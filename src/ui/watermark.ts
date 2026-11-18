import { outlineFont, removeById, insertMarkedObject, measureWithFont, FONTS, createImageObject, textPathObject } from '../engine/text';
import { toast, modal, h } from './dom';
import type { Child, ToastHandle } from './dom';
import type { RGBA } from '../engine/types';
import type { Doc, PageObjectInfo } from '../engine/pdfium';
import type { App } from '../app';

/** Watermark & background settings (stored in app settings). Opacity, scale in %, angle in degrees. */
export type WatermarkSettings = {
  kind: "text" | "image";
  text: string;
  fontKey: string;
  color: RGBA;
  /** image as a data: URL */
  image: string;
  opacity: number;
  angle: number;
  scale: number;
  behind: boolean;
  range: "all" | "custom";
  from: number;
  to: number;
  bg: boolean;
  bgColor: RGBA;
};

/** Default watermark settings. */
const DEFAULT_WATERMARK: WatermarkSettings = { kind: "text", text: "CONFIDENTIAL", fontKey: "sarabun", color: [196, 40, 40, 255], image: "", opacity: 22, angle: 45, scale: 70, behind: false, range: "all", from: 1, to: 1, bg: false, bgColor: [255, 251, 235, 255] };
/** Block id tagging the watermark object on each page. */
const WATERMARK_ID = "wm";
/** Block id tagging the page-colour background rectangle. */
const BACKGROUND_ID = "bg";

type Pixels = { data: Uint8ClampedArray; w: number; h: number };

/** 0-based pages the settings apply to. */
function watermarkPages(pageCount: number, settings: WatermarkSettings): number[] {
  const first = settings.range === "custom" ? Math.max(1, settings.from) : 1, last = settings.range === "custom" ? Math.min(pageCount, settings.to) : pageCount, pages: number[] = [];
  for (let p = first - 1; p <= last - 1; p++) pages.push(p);
  return pages;
}

/** Decodes an image URL to RGBA pixels, scaled down so its long side is at most `maxSide`. */
async function loadImagePixels(url: string, maxSide = 1600): Promise<Pixels> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const k = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight)), w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k)), canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return { data: ctx.getImageData(0, 0, w, h).data, w, h };
}

/** Number of page objects tagged with a block id. */
function countBlockObjects(doc: Doc, page: number, blockId: string): number {
  return doc.pageObjects(page).filter((obj) => obj.blockId === blockId).length;
}

/**
 * Replaces the watermark and background on one page: an optional full-page colour rectangle at the bottom of the
 * stack, then the text (as glyph outlines) or image, rotated about the page centre and placed on top or just above
 * the background.
 */
async function drawWatermark(doc: Doc, page: number, settings: WatermarkSettings, image: Pixels | null): Promise<void> {
  removeById(doc, page, WATERMARK_ID);
  removeById(doc, page, BACKGROUND_ID);
  const { w: pageW, h: pageH } = doc.pageSize(page), inv = doc.transform(page, pageW, pageH).invert(), cx = pageW / 2, cy = pageH / 2, rad = settings.angle * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad), length = Math.min(Math.abs(cos) > 1e-6 ? pageW / Math.abs(cos) : 1 / 0, Math.abs(sin) > 1e-6 ? pageH / Math.abs(sin) : 1 / 0) * (settings.scale / 100), toPdf = (x: number, y: number) => inv.apply(cx + x * cos - y * sin, cy - (x * sin + y * cos));
  if (settings.bg) {
    const a = inv.apply(0, 0), b = inv.apply(pageW, pageH), P = doc.P, rect = P.FPDFPageObj_CreateNewRect(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
    P.FPDFPageObj_SetFillColor(rect, settings.bgColor[0], settings.bgColor[1], settings.bgColor[2], 255);
    P.FPDFPath_SetDrawMode(rect, 1, false);
    insertMarkedObject(doc, page, rect, BACKGROUND_ID, 0);
  }
  const alpha = Math.round(settings.opacity / 100 * 255);
  let obj = 0;
  if (settings.kind === "text" && settings.text.trim()) {
    // Font size that makes the text `length` points long.
    const size = 100 * length / Math.max(1, await textWidthAt100(settings));
    obj = await textPathObject(doc, settings.text.trim(), settings.fontKey, size, toPdf);
    doc.P.FPDFPageObj_SetFillColor(obj, settings.color[0], settings.color[1], settings.color[2], alpha);
  } else if (settings.kind === "image" && image) {
    const aspect = image.w / image.h;
    let w = length, h = length / aspect;
    const maxH = Math.min(pageW, pageH) * (settings.scale / 100);
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    const rgba = new Uint8ClampedArray(image.data);
    for (let i = 3; i < rgba.length; i += 4) rgba[i] = Math.round(rgba[i] * (settings.opacity / 100));
    const origin = toPdf(-w / 2, -h / 2), right = toPdf(w / 2, -h / 2), up = toPdf(-w / 2, h / 2);
    obj = createImageObject(doc, rgba, image.w, image.h, [right[0] - origin[0], right[1] - origin[1], up[0] - origin[0], up[1] - origin[1], origin[0], origin[1]]);
  }
  if (obj) insertMarkedObject(doc, page, obj, WATERMARK_ID, settings.behind ? countBlockObjects(doc, page, BACKGROUND_ID) : -1);
}

/** Cache of text widths at 100 pt, keyed by font key and trimmed text; least recently used entries beyond 32 are dropped. */
const textWidthCache = /* @__PURE__ */ new Map<string, number>();
const TEXT_WIDTH_CACHE_MAX = 32;

/** Width of the (trimmed) watermark text at 100 pt in the font it will actually be drawn with. */
async function textWidthAt100(settings: WatermarkSettings): Promise<number> {
  const text = settings.text.trim(), key = settings.fontKey + "|" + text;
  let width = textWidthCache.get(key);
  if (width == null) {
    width = await measureWithFont(outlineFont(settings.fontKey, text).key, text, 100);
    if (textWidthCache.size >= TEXT_WIDTH_CACHE_MAX) textWidthCache.delete(textWidthCache.keys().next().value!);
  } else textWidthCache.delete(key);
  // (Re)insert so the most recently used entry is last in iteration order.
  textWidthCache.set(key, width);
  return width;
}

/** True if any page has a watermark or background. */
function hasWatermark(app: App): boolean {
  const doc: Doc = app.doc;
  for (let page = 0; page < doc.pageCount; page++) if (doc.pageObjects(page).some((obj: PageObjectInfo) => obj.blockId === WATERMARK_ID || obj.blockId === BACKGROUND_ID)) return true;
  return false;
}

/** Removes the watermark from every page and draws it on the chosen ones. Returns the number of pages. */
async function applyWatermark(app: App, settings: WatermarkSettings): Promise<number> {
  const pages = watermarkPages(app.doc.pageCount, settings);
  if (!pages.length) throw new Error("That page range is empty");
  const image = settings.kind === "image" && settings.image ? await loadImagePixels(settings.image) : null;
  if (settings.kind === "image" && !image) throw new Error("Choose an image first");
  for (let page = 0; page < app.doc.pageCount; page++) {
    removeById(app.doc, page, WATERMARK_ID);
    removeById(app.doc, page, BACKGROUND_ID);
  }
  for (const page of pages) await drawWatermark(app.doc, page, settings, image);
  return pages.length;
}

/** Removes the watermark and background from every page. */
function removeWatermark(app: App): void {
  for (let page = 0; page < app.doc.pageCount; page++) {
    removeById(app.doc, page, WATERMARK_ID);
    removeById(app.doc, page, BACKGROUND_ID);
  }
}

/**
 * "Watermark & background" dialog with a live preview of one page (rendered from a one-page copy).
 * `saveSettings` receives the settings when they are applied.
 */
async function watermarkDialog(app: App, initial: WatermarkSettings, saveSettings: (settings: WatermarkSettings) => void): Promise<ToastHandle | void> {
  const s: WatermarkSettings = JSON.parse(JSON.stringify(initial)), pageCount = app.doc.pageCount;
  if (s.to < 1 || s.to > pageCount) s.to = pageCount;
  const swatches = (colors: RGBA[], get: () => RGBA, set: (c: RGBA) => void, label: string) => {
    const group = h("div", { class: "swatches", role: "radiogroup", "aria-label": label }), render = () => group.replaceChildren(...colors.map((c) => {
      const on = get().slice(0, 3).join() === c.slice(0, 3).join();
      return h("button", { class: "sw" + (on ? " on" : ""), type: "button", role: "radio", "aria-checked": String(on), "aria-label": `rgb ${c.slice(0, 3).join(" ")}`, style: { background: `rgb(${c[0]},${c[1]},${c[2]})` }, onclick: () => {
        set(c);
        render();
        schedulePreview();
      } });
    }));
    render();
    return group;
  }, row = (label: string, ...controls: Child[]) => h("div", { class: "hf-row" }, h("span", { class: "rlabel", text: label }), h("div", { class: "hf-ctrl" }, ...controls)), radio = (name: string, value: string, label: string, checked: boolean, onSelect: () => void) => {
    const input = h("input", { type: "radio", name, value, checked }) as HTMLInputElement;
    input.addEventListener("change", () => {
      if (input.checked) {
        onSelect();
        syncVisibility();
        schedulePreview();
      }
    });
    return h("label", { class: "hf-check" }, input, label);
  }, slider = (min: number, max: number, value: number, set: (v: number) => void, unit: string, label: string) => {
    const input = h("input", { type: "range", min: String(min), max: String(max), value: String(value), "aria-label": label, class: "wm-range" }) as HTMLInputElement, readout = h("span", { class: "mono", text: value + unit });
    input.addEventListener("input", () => {
      set(+input.value);
      readout.textContent = input.value + unit;
      schedulePreview();
    });
    return h("span", { class: "wm-slider" }, input, readout);
  }, textInput = h("input", { class: "tinput", value: s.text, "aria-label": "Watermark text" }) as HTMLInputElement;
  textInput.addEventListener("input", () => {
    s.text = textInput.value;
    schedulePreview();
  });
  const fontSelect = h("select", { class: "rselect", "aria-label": "Font" }) as HTMLSelectElement;
  for (const group of ["Standard", "Thai + Latin", "Latin"]) fontSelect.append(h("optgroup", { label: group }, ...FONTS.filter((f) => f.group === group).map((f) => h("option", { value: f.key, text: f.label, selected: f.key === s.fontKey }))));
  fontSelect.addEventListener("change", () => {
    s.fontKey = fontSelect.value;
    schedulePreview();
  });
  const imageButton = h("button", { class: "btn ghost small", type: "button" }, s.image ? "Change image…" : "Choose image…"), thumb = h("img", { class: "wm-thumb", alt: "", hidden: !s.image, src: s.image || undefined }) as HTMLImageElement;
  imageButton.addEventListener("click", () => {
    const picker = h("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/svg+xml" }) as HTMLInputElement;
    picker.addEventListener("change", () => {
      const file = picker.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        s.image = String(reader.result);
        thumb.src = s.image;
        thumb.hidden = false;
        imageButton.textContent = "Change image…";
        schedulePreview();
      };
      reader.readAsDataURL(file);
    });
    picker.click();
  });
  const textRows = [row("Text", textInput), row("Font", fontSelect), row("Colour", swatches([[196, 40, 40, 255], [24, 26, 33, 255], [120, 124, 134, 255], [37, 99, 235, 255], [22, 140, 82, 255]], () => s.color, (c) => s.color = c, "Watermark colour"))], imageRows = [row("Image", imageButton, thumb)], fromInput = h("input", { class: "rnum", type: "number", min: "1", max: String(pageCount), value: String(s.from), "aria-label": "From page" }) as HTMLInputElement, toInput = h("input", { class: "rnum", type: "number", min: "1", max: String(pageCount), value: String(s.to), "aria-label": "To page" }) as HTMLInputElement;
  fromInput.addEventListener("change", () => {
    s.from = +fromInput.value || 1;
    schedulePreview();
  });
  toInput.addEventListener("change", () => {
    s.to = +toInput.value || pageCount;
    schedulePreview();
  });
  const bgBox = h("input", { type: "checkbox", checked: s.bg }) as HTMLInputElement;
  bgBox.addEventListener("change", () => {
    s.bg = bgBox.checked;
    schedulePreview();
  });
  const syncVisibility = () => {
    textRows.forEach((el) => el.hidden = s.kind !== "text");
    imageRows.forEach((el) => el.hidden = s.kind !== "image");
    fromInput.disabled = toInput.disabled = s.range !== "custom";
  }, canvas = h("canvas", { class: "wm-canvas", "aria-label": "Preview" }) as HTMLCanvasElement;
  let previewPage = 0;
  const pageLabel = h("span", { class: "mono" }), pageButton = (step: number) => h("button", { class: "iconbtn small", type: "button", "aria-label": step < 0 ? "Previous page" : "Next page", text: step < 0 ? "‹" : "›", onclick: () => {
    previewPage = Math.max(0, Math.min(pageCount - 1, previewPage + step));
    schedulePreview();
  } }), body = h("div", { class: "wm" }, h("div", { class: "wm-form" }, row("Watermark", radio("wm-kind", "text", "Text", s.kind === "text", () => s.kind = "text"), radio("wm-kind", "image", "Image", s.kind === "image", () => s.kind = "image")), ...textRows, ...imageRows, row("Opacity", slider(5, 100, s.opacity, (v) => s.opacity = v, "%", "Opacity")), row("Angle", slider(-90, 90, s.angle, (v) => s.angle = v, "°", "Angle")), row("Size", slider(10, 100, s.scale, (v) => s.scale = v, "%", "Size relative to the page")), row("Layer", radio("wm-layer", "top", "Over the content", !s.behind, () => s.behind = false), radio("wm-layer", "behind", "Behind the content", s.behind, () => s.behind = true)), row("Background", h("label", { class: "hf-check" }, bgBox, "Page colour"), swatches([[255, 251, 235, 255], [240, 249, 255, 255], [240, 253, 244, 255], [253, 242, 248, 255], [243, 244, 246, 255]], () => s.bgColor, (c) => {
    s.bgColor = c;
    s.bg = true;
    bgBox.checked = true;
  }, "Background colour")), row("Pages", radio("wm-range", "all", "All", s.range === "all", () => s.range = "all"), radio("wm-range", "custom", "From", s.range === "custom", () => s.range = "custom"), fromInput, "to", toInput)), h("div", { class: "wm-preview" }, h("div", { class: "hf-pv-head" }, h("span", { class: "rlabel", text: "Preview" }), pageButton(-1), pageLabel, pageButton(1)), canvas));
  syncVisibility();
  // `generation` drops results of stale previews; `timer` debounces them.
  let generation = 0, timer = 0;
  const schedulePreview = () => {
    clearTimeout(timer);
    timer = window.setTimeout(renderPreview, 120);
  }, renderPreview = async () => {
    const gen = ++generation;
    pageLabel.textContent = `Page ${previewPage + 1} of ${pageCount}`;
    const copy: Doc = app.lib.create();
    try {
      copy.importIndices(app.doc, [previewPage], 0);
      removeById(copy, 0, WATERMARK_ID);
      removeById(copy, 0, BACKGROUND_ID);
      if (watermarkPages(pageCount, s).includes(previewPage)) {
        const image = s.kind === "image" && s.image ? await loadImagePixels(s.image, 600) : null;
        await drawWatermark(copy, 0, s, image);
      }
      if (gen !== generation) return;
      const { w, h } = copy.pageSize(0), px = 300 * Math.min(2, devicePixelRatio || 1), scale = px / w, img = copy.render(0, w * scale, h * scale);
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.putImageData(img, 0, 0);
    } catch (err) {
      if (gen === generation) pageLabel.textContent = (err as Error).message;
    } finally {
      copy.close();
    }
  };
  renderPreview();
  const existing = hasWatermark(app), choice = await modal({ title: "Watermark & background", body, actions: [...existing ? [{ id: "remove", label: "Remove", danger: true }] : [], { id: "cancel", label: "Cancel" }, { id: "apply", label: "Apply", primary: true }] });
  clearTimeout(timer);
  generation++;
  if (choice === "remove") {
    try {
      await app.mutate("Remove watermark", { pages: "all" }, () => removeWatermark(app));
      toast("Removed the watermark and background");
    } catch (err) {
      toast((err as Error).message, "err");
    }
    return;
  }
  if (choice !== "apply") return;
  if (s.kind === "text" && !s.text.trim() && !s.bg) return toast("Type the watermark text first", "warn");
  saveSettings(s);
  let applied = 0;
  await app.mutate(s.kind === "text" && !s.text.trim() ? "Page background" : "Watermark", { pages: "all" }, async () => {
    applied = await applyWatermark(app, s);
  }).catch((err: Error) => toast(err.message, "err"));
  if (applied) toast(`Applied to ${applied} page${applied === 1 ? "" : "s"}`);
}

export { DEFAULT_WATERMARK, watermarkDialog };
