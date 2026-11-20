// Scan with camera: take photos of paper pages (the phone's camera app, through a file input), find each page's
// edges, let the user adjust the corners, straighten and clean up the page, then make a PDF or add the pages to
// the open document. Image processing is in scanimage.ts.

import { h, icon } from './dom';
import { detectQuad, insetQuad, outputSize, warp, applyFilter, rotateQuad } from './scanimage';
import type { Pixels, Quad, ScanFilter } from './scanimage';

/** A page in progress: the photo (downscaled), the corners, the filter, and the finished JPEG. */
type ScanPage = { photo: ImageBitmap; quad: Quad; filter: ScanFilter; result: Blob; thumb: string };
/** What the scanner hands back: finished page images, and whether to start a new PDF or add to the open one. */
export type ScanResult = { files: File[]; target: "new" | "insert" };

/** Photos are worked on at most this size (long side); 12-megapixel phone photos would be slow and heavy. */
const MAX_PHOTO = 3200;
/** Edge detection runs on a copy this small. */
const DETECT_SIZE = 480;
const FILTERS: [ScanFilter, string][] = [["colour", "Colour"], ["clean", "Clean"], ["bw", "Black & white"]];
const STORE = "margin.scanFilter";

/** Reads a canvas-sized bitmap's pixels. */
function pixelsOf(bitmap: ImageBitmap, w = bitmap.width, hgt = bitmap.height): Pixels {
  const canvas = new OffscreenCanvas(w, hgt), ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, hgt);
  const img = ctx.getImageData(0, 0, w, hgt);
  return { data: img.data, width: w, height: hgt };
}

/** The photo, downscaled to MAX_PHOTO and turned upright from its EXIF orientation. */
async function loadPhoto(file: File): Promise<ImageBitmap> {
  const probe = await createImageBitmap(file, { imageOrientation: "from-image" });
  const k = Math.min(1, MAX_PHOTO / Math.max(probe.width, probe.height));
  if (k === 1) return probe;
  const scaled = await createImageBitmap(probe, { resizeWidth: Math.round(probe.width * k), resizeHeight: Math.round(probe.height * k), resizeQuality: "high" });
  probe.close();
  return scaled;
}

/** Where the page is in the photo: detected on a small copy, else the whole photo slightly inset. */
function findPage(photo: ImageBitmap): Quad {
  const k = Math.min(1, DETECT_SIZE / Math.max(photo.width, photo.height)), small = pixelsOf(photo, Math.round(photo.width * k), Math.round(photo.height * k));
  const quad = detectQuad(small);
  return quad ? (quad.map(([x, y]) => [x / k, y / k]) as Quad) : insetQuad(photo.width, photo.height);
}

/** Straightens and cleans up a page; resolves to a JPEG and a small preview URL. */
async function finishPage(photo: ImageBitmap, quad: Quad, filter: ScanFilter): Promise<{ result: Blob; thumb: string }> {
  const [w, hgt] = outputSize(quad), page = warp(pixelsOf(photo), quad, w, hgt);
  applyFilter(page, filter);
  const canvas = new OffscreenCanvas(w, hgt);
  canvas.getContext("2d")!.putImageData(new ImageData(page.data, w, hgt), 0, 0);
  const result = await canvas.convertToBlob({ type: "image/jpeg", quality: filter === "colour" ? 0.85 : 0.8 });
  const tk = 240 / Math.max(w, hgt), thumbCanvas = new OffscreenCanvas(Math.round(w * tk), Math.round(hgt * tk));
  thumbCanvas.getContext("2d")!.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
  return { result, thumb: URL.createObjectURL(await thumbCanvas.convertToBlob({ type: "image/jpeg", quality: 0.7 })) };
}

/** Opens the system camera (on phones) or a photo picker; resolves to the photos taken, or [] if cancelled. */
function takePhotos(camera: boolean): Promise<File[]> {
  return new Promise((resolve) => {
    const input = h("input", { type: "file", accept: "image/*", hidden: true }) as HTMLInputElement;
    if (camera) input.setAttribute("capture", "environment");
    else input.multiple = true;
    let done = false;
    const finish = (files: File[]) => {
      if (done) return;
      done = true;
      input.remove();
      resolve(files);
    };
    input.addEventListener("change", () => finish([...(input.files || [])]));
    input.addEventListener("cancel", () => finish([]));
    document.body.append(input);
    input.click();
  });
}

/**
 * The scanner, full screen. Resolves when the user finishes (with the pages) or cancels (null).
 * `canInsert` offers "Add to this document" besides "Create PDF".
 */
function scanDocument(canInsert: boolean): Promise<ScanResult | null> {
  return new Promise((resolve) => {
    const pages: ScanPage[] = [];
    let filter: ScanFilter = "clean";
    try {
      filter = (localStorage.getItem(STORE) as ScanFilter) || "clean";
    } catch {}
    // ---- editing one photo: corners and filter
    let editing: { photo: ImageBitmap; quad: Quad; index: number | null } | null = null;
    const canvas = h("canvas", { class: "scan-photo" }) as HTMLCanvasElement;
    const outline = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    outline.setAttribute("class", "scan-outline");
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    outline.append(polygon);
    const handles = [0, 1, 2, 3].map((i) => h("button", { class: "scan-handle", type: "button", "aria-label": ["Top-left", "Top-right", "Bottom-right", "Bottom-left"][i] + " corner" }));
    const stage = h("div", { class: "scan-stage" }, canvas, outline, ...handles);
    const filterButtons = FILTERS.map(([id, label]) => h("button", { class: "scan-chip", type: "button", "data-filter": id, text: label, onclick: () => setFilter(id) }));
    const status = h("p", { class: "scan-status", role: "status" });
    const editView = h("div", { class: "scan-edit" },
      h("p", { class: "hint", text: "Drag the corners to the edges of the page." }),
      stage,
      h("div", { class: "scan-tools" }, h("div", { class: "scan-chips", role: "group", "aria-label": "Clean-up" }, ...filterButtons),
        h("button", { class: "btn", type: "button", title: "Rotate", "aria-label": "Rotate", onclick: () => rotate() }, icon("rotr"))),
      status,
      h("div", { class: "scan-row" },
        h("button", { class: "btn", type: "button", text: "Discard photo", onclick: () => leaveEdit() }),
        h("button", { class: "btn primary", type: "button", id: "scan-keep", text: "Keep page", onclick: () => keepPage() })));
    // ---- the pages so far
    const grid = h("div", { class: "scan-grid" });
    const createButton = h("button", { class: "btn primary", type: "button", id: "scan-create", text: "Create PDF", onclick: () => finish("new") });
    const insertButton = canInsert ? h("button", { class: "btn", type: "button", id: "scan-insert", text: "Add to this document", onclick: () => finish("insert") }) : null;
    const listView = h("div", { class: "scan-list" },
      grid,
      h("div", { class: "scan-start" },
        h("button", { class: "btn scan-big", type: "button", id: "scan-camera", onclick: () => addPhotos(true) }, icon("camera"), h("span", { text: "Take a photo" })),
        h("button", { class: "btn scan-big", type: "button", id: "scan-choose", onclick: () => addPhotos(false) }, icon("image"), h("span", { text: "Choose photos" }))),
      h("p", { class: "hint", text: "Lay the page on a darker surface, in good light, and fill the frame with it. Everything stays on this device." }),
      h("div", { class: "scan-row", id: "scan-finish" }, insertButton, createButton));
    const title = h("h2", { text: "Scan document" });
    const root = h("div", { class: "scan", role: "dialog", "aria-modal": "true", "aria-label": "Scan document" },
      h("header", { class: "scan-head" }, title, h("button", { class: "iconbtn", type: "button", "aria-label": "Close", title: "Close", onclick: () => close() }, icon("close"))),
      h("div", { class: "scan-body" }, listView, editView));
    document.body.append(root);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") editing ? leaveEdit() : close();
    };
    document.addEventListener("keydown", onKey);

    const show = () => {
      listView.hidden = !!editing;
      editView.hidden = !editing;
      title.textContent = editing ? (editing.index == null ? `Page ${pages.length + 1}` : `Page ${editing.index + 1}`) : pages.length ? `Scanned pages (${pages.length})` : "Scan document";
      (listView.querySelector("#scan-finish") as HTMLElement).hidden = !pages.length;
      grid.replaceChildren(...pages.map((page, i) => h("div", { class: "scan-thumb" },
        h("button", { class: "scan-thumb-img", type: "button", "aria-label": `Edit page ${i + 1}`, onclick: () => edit(page.photo, page.quad, i) }, h("img", { src: page.thumb, alt: `Page ${i + 1}` })),
        h("span", { text: String(i + 1) }),
        h("button", { class: "tact danger", type: "button", "aria-label": `Remove page ${i + 1}`, title: "Remove", onclick: () => removePage(i) }, icon("trash")))));
      filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === filter)));
      if (editing) requestAnimationFrame(drawStage);
    };
    // ---- corners
    let scale = 1;
    function drawStage() {
      if (!editing) return;
      const { photo } = editing, box = stage.parentElement!.getBoundingClientRect();
      scale = Math.min((box.width - 8) / photo.width, Math.max(160, innerHeight - 330) / photo.height);
      canvas.width = Math.round(photo.width * scale * devicePixelRatio);
      canvas.height = Math.round(photo.height * scale * devicePixelRatio);
      canvas.style.width = Math.round(photo.width * scale) + "px";
      canvas.style.height = Math.round(photo.height * scale) + "px";
      canvas.getContext("2d")!.drawImage(photo, 0, 0, canvas.width, canvas.height);
      outline.setAttribute("width", canvas.style.width);
      outline.setAttribute("height", canvas.style.height);
      placeCorners();
    }
    function placeCorners() {
      if (!editing) return;
      const pts = editing.quad.map(([x, y]) => [x * scale, y * scale]);
      polygon.setAttribute("points", pts.map((p) => p.join(",")).join(" "));
      handles.forEach((handle, i) => {
        handle.style.left = pts[i][0] + "px";
        handle.style.top = pts[i][1] + "px";
      });
    }
    handles.forEach((handle, i) => {
      handle.addEventListener("pointerdown", (e) => {
        if (!editing) return;
        e.preventDefault();
        handle.setPointerCapture(e.pointerId);
        const rect = canvas.getBoundingClientRect();
        const move = (ev: PointerEvent) => {
          const ed = editing!, x = Math.max(0, Math.min(ed.photo.width, (ev.clientX - rect.left) / scale)), y = Math.max(0, Math.min(ed.photo.height, (ev.clientY - rect.top) / scale));
          ed.quad = ed.quad.map((p, j) => (j === i ? [x, y] : p)) as Quad;
          placeCorners();
        };
        const up = () => {
          handle.removeEventListener("pointermove", move);
          handle.removeEventListener("pointerup", up);
          handle.removeEventListener("pointercancel", up);
        };
        handle.addEventListener("pointermove", move);
        handle.addEventListener("pointerup", up);
        handle.addEventListener("pointercancel", up);
      });
      // Arrow keys nudge a focused corner.
      handle.addEventListener("keydown", (e) => {
        const step = e.shiftKey ? 20 : 4, d = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as Record<string, number[]>)[e.key];
        if (!d || !editing) return;
        e.preventDefault();
        const ed = editing;
        ed.quad = ed.quad.map((p, j) => (j === i ? [Math.max(0, Math.min(ed.photo.width, p[0] + (d[0] * step) / scale)), Math.max(0, Math.min(ed.photo.height, p[1] + (d[1] * step) / scale))] : p)) as Quad;
        placeCorners();
      });
    });
    addEventListener("resize", drawStage);
    // ---- actions
    function setFilter(id: ScanFilter) {
      filter = id;
      try {
        localStorage.setItem(STORE, id);
      } catch {}
      show();
    }
    function rotate() {
      if (!editing) return;
      editing.quad = rotateQuad(editing.quad);
      status.textContent = "The page will be turned a quarter clockwise.";
    }
    function edit(photo: ImageBitmap, quad: Quad, index: number | null) {
      editing = { photo, quad, index };
      status.textContent = "";
      show();
    }
    function leaveEdit() {
      if (editing && editing.index == null) editing.photo.close();
      editing = null;
      show();
    }
    async function keepPage() {
      if (!editing) return;
      const { photo, quad, index } = editing, keep = root.querySelector<HTMLButtonElement>("#scan-keep")!;
      keep.disabled = true;
      status.textContent = "Straightening…";
      await new Promise((r) => setTimeout(r, 30)); // let the status paint
      try {
        const done = await finishPage(photo, quad, filter);
        const page: ScanPage = { photo, quad, filter, ...done };
        if (index == null) pages.push(page);
        else {
          URL.revokeObjectURL(pages[index].thumb);
          pages[index] = page;
        }
        editing = null;
        status.textContent = "";
      } catch (err) {
        status.textContent = (err as Error).message || "That photo couldn’t be processed";
      }
      keep.disabled = false;
      show();
    }
    async function addPhotos(camera: boolean) {
      const files = await takePhotos(camera);
      for (const [i, file] of files.entries()) {
        let photo: ImageBitmap;
        try {
          photo = await loadPhoto(file);
        } catch {
          status.textContent = `${file.name} isn’t a photo this browser can read`;
          continue;
        }
        if (i < files.length - 1) {
          // Several photos chosen at once: keep each with its detected corners, review afterwards.
          const quad = findPage(photo), done = await finishPage(photo, quad, filter);
          pages.push({ photo, quad, filter, ...done });
          show();
        } else edit(photo, findPage(photo), null);
      }
    }
    function removePage(i: number) {
      const [page] = pages.splice(i, 1);
      page.photo.close();
      URL.revokeObjectURL(page.thumb);
      show();
    }
    function cleanup() {
      document.removeEventListener("keydown", onKey);
      removeEventListener("resize", drawStage);
      root.remove();
      for (const page of pages) {
        page.photo.close();
        URL.revokeObjectURL(page.thumb);
      }
      editing?.photo.close();
    }
    function close() {
      if (pages.length && !confirm(`Discard ${pages.length === 1 ? "the scanned page" : `${pages.length} scanned pages`}?`)) return;
      cleanup();
      resolve(null);
    }
    function finish(target: "new" | "insert") {
      if (!pages.length) return;
      const files = pages.map((page, i) => new File([page.result], `Scan ${i + 1}.jpg`, { type: "image/jpeg" }));
      cleanup();
      resolve({ files, target });
    }
    show();
  });
}

export { scanDocument, findPage, finishPage };
