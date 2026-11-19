import { writeText, insertMarkedImage, removeById, measureWithFont, FONTS, FONT_GROUPS } from '../engine/text';
import { toast, icon, modal, h } from './dom';
import type { Child, ToastHandle } from './dom';
import type { RGBA } from '../engine/types';
import type { Doc } from '../engine/pdfium';
import type { App } from '../app';


/** The six header/footer positions: h/f (header, footer) + l/c/r (left, centre, right). */
const HF_SLOTS = ["hl", "hc", "hr", "fl", "fc", "fr"] as const;
type Slot = (typeof HF_SLOTS)[number];

/** Header & footer settings (stored in app settings). Sizes and margin in points; images are data: URLs. */
export type HeaderFooterSettings = {
  text: Record<Slot, string>;
  fontKey: string;
  size: number;
  color: RGBA;
  margin: number;
  range: "all" | "skipFirst" | "custom";
  from: number;
  to: number;
  /** number printed on the first page in range */
  start: number;
  thaiDigits: boolean;
  images: Partial<Record<Slot, string>>;
  imageHeight: number;
};

/** Default header & footer: file name bottom left, "Page n of N" bottom right. */
const DEFAULT_HEADER_FOOTER: HeaderFooterSettings = { text: { hl: "", hc: "", hr: "", fl: "{file}", fc: "", fr: "Page {page} of {pages}" }, fontKey: "sarabun", size: 9, color: [90, 94, 104, 255], margin: 28, range: "all", from: 1, to: 1, start: 1, thaiDigits: false, images: {}, imageHeight: 24 };
const THAI_DIGITS = "๐๑๒๓๔๕๖๗๘๙";

/** A header/footer image rasterised for drawing; `aspect` is width / height. */
type HfImage = { rgba: Uint8ClampedArray; w: number; h: number; aspect: number };

/** Today's date for the {date} token, in the browser's locale. */
const todayText = () => (/* @__PURE__ */ new Date()).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

/** Replaces {page}, {pages}, {date} and {file} tokens; optionally turns ASCII digits into Thai digits. */
function expandTokens(template: string, values: Record<string, string>, thaiDigits: boolean): string {
  const text = template.replace(/\{(page|pages|date|file)\}/g, (_match, token) => values[token]);
  return thaiDigits ? text.replace(/[0-9]/g, (d) => THAI_DIGITS[+d]) : text;
}

/** Decodes an image URL and rasterises it at 4 px per point of `heightPt` (height 8–1200 px, width ≤ 2400 px). */
async function rasterizeImage(url: string, heightPt: number): Promise<HfImage> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1), h = Math.max(8, Math.min(1200, Math.round(heightPt * 4))), w = Math.max(8, Math.min(2400, Math.round(h * aspect))), canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return { rgba: ctx.getImageData(0, 0, w, h).data, w, h, aspect };
}

/** Removes every header/footer block from the given pages. */
function removeHeaderFooter(app: App, pages: number[]): void {
  for (const page of pages) for (const slot of HF_SLOTS) removeById(app.doc, page, "hf-" + slot);
}

/** Pages in range (0-based), the first of them, and the page total printed for {pages}. */
function hfPages(pageCount: number, settings: HeaderFooterSettings): { pages: number[]; first: number; total: number } {
  const first = settings.range === "skipFirst" ? 1 : settings.range === "custom" ? Math.max(0, settings.from - 1) : 0, last = settings.range === "custom" ? Math.min(pageCount - 1, settings.to - 1) : pageCount - 1, pages: number[] = [];
  for (let p = first; p <= last; p++) pages.push(p);
  return { pages, first, total: settings.start + pages.length - 1 };
}

/** Rasterised images by height and URL (at most ~24 kept). Failed loads are evicted. */
const hfImageCache = /* @__PURE__ */ new Map<string, Promise<HfImage>>();

/** Rasterises the images of all slots that have one (cached). */
async function loadHfImages(settings: HeaderFooterSettings): Promise<Partial<Record<Slot, HfImage>>> {
  const images: Partial<Record<Slot, HfImage>> = {};
  for (const slot of HF_SLOTS) {
    const url = settings.images?.[slot];
    if (!url) continue;
    const key = settings.imageHeight + "|" + url;
    let pending = hfImageCache.get(key);
    if (!pending) {
      pending = rasterizeImage(url, settings.imageHeight);
      hfImageCache.set(key, pending);
      if (hfImageCache.size > 24) hfImageCache.delete(hfImageCache.keys().next().value!);
    }
    images[slot] = await pending.catch(() => {
      hfImageCache.delete(key);
      throw new Error("One of the images could not be read");
    });
  }
  return images;
}

/**
 * Draws all six positions on one page. Layout is done in the page's displayed (rotated) orientation, y down,
 * and mapped to PDF space with the inverse page transform. Each position is [image][gap][text], aligned left,
 * centred or right within the margin; image and text are centred on a band of max(image height, font size).
 */
async function drawHeaderFooter(doc: Doc, page: number, pageNo: number, total: number, fileName: string, settings: HeaderFooterSettings, images: Partial<Record<Slot, HfImage>>): Promise<void> {
  const values = { page: String(pageNo), pages: String(total), date: todayText(), file: fileName }, { w: pageW, h: pageH } = doc.pageSize(page), inv = doc.transform(page, pageW, pageH).invert(), [ox, oy] = inv.apply(0, 0), [xx, xy] = inv.apply(1, 0), [yx, yy] = inv.apply(0, 1), ax = xx - ox, ay = xy - oy, bx = -(yx - ox), by = -(yy - oy);
  for (const slot of HF_SLOTS) {
    const text = expandTokens(settings.text[slot] || "", values, settings.thaiDigits).trim(), image = images[slot];
    if (!text && !image) continue;
    const imageH = settings.imageHeight, imageW = image ? imageH * image.aspect : 0, gap = image && text ? settings.size * 0.6 : 0, textW = text ? await measureWithFont(settings.fontKey, text, settings.size) : 0, totalW = imageW + gap + textW, left = slot[1] === "l" ? settings.margin : slot[1] === "c" ? (pageW - totalW) / 2 : pageW - settings.margin - totalW, bandH = Math.max(image ? imageH : 0, settings.size), top = slot[0] === "h" ? settings.margin : pageH - settings.margin - bandH, id = "hf-" + slot;
    if (image) {
      const imageTop = top + (bandH - imageH) / 2, [px, py] = inv.apply(left, imageTop + imageH);
      insertMarkedImage(doc, page, image.rgba, image.w, image.h, [ax * imageW, ay * imageW, bx * imageH, by * imageH, px, py], id);
    }
    if (text) {
      const baseline = image ? top + bandH / 2 + settings.size * 0.35 : slot[0] === "h" ? settings.margin + settings.size * 0.8 : pageH - settings.margin, [px, py] = inv.apply(left + imageW + gap, baseline);
      await writeText(doc, page, { lines: [text], fontKey: settings.fontKey, size: settings.size, color: settings.color, matrix: [ax, ay, bx, by, px, py], id });
    }
  }
}

/** File name without the .pdf extension, for the {file} token. */
const baseFileName = (app: App): string => app.fileName.replace(/\.pdf$/i, "");

/** Replaces the header & footer on all pages with the given settings. Returns the number of pages it was added to. */
async function applyHeaderFooter(app: App, settings: HeaderFooterSettings): Promise<number> {
  const doc = app.doc, pageCount = doc.pageCount, { pages, total } = hfPages(pageCount, settings);
  if (!pages.length) throw new Error("That page range is empty");
  const images = await loadHfImages(settings);
  removeHeaderFooter(app, [...Array(pageCount).keys()]);
  for (const [i, page] of pages.entries()) await drawHeaderFooter(doc, page, settings.start + i, total, baseFileName(app), settings, images);
  return pages.length;
}

/** Renders a one-page copy of `page` with the header & footer applied, `widthPx` CSS pixels wide. */
async function renderPreview(app: App, page: number, settings: HeaderFooterSettings, widthPx: number): Promise<{ img: ImageData; w: number; h: number; scale: number; inRange: boolean }> {
  const { pages, first, total } = hfPages(app.doc.pageCount, settings), copy = app.lib.create();
  try {
    copy.importIndices(app.doc, [page], 0);
    for (const slot of HF_SLOTS) removeById(copy, 0, "hf-" + slot);
    const inRange = pages.includes(page);
    if (inRange) await drawHeaderFooter(copy, 0, settings.start + (page - first), total, baseFileName(app), settings, await loadHfImages(settings));
    const { w, h } = copy.pageSize(0), scale = widthPx / w * Math.min(2, devicePixelRatio || 1);
    return { img: copy.render(0, w * scale, h * scale), w, h, scale, inRange };
  } finally {
    copy.close();
  }
}

/**
 * "Header & footer" dialog: text and image for six positions with insertable tokens, font, colour, page range,
 * numbering and margin, and a preview of the top and bottom strips of one page. `saveSettings` receives the
 * settings when they are applied.
 */
async function headerFooterDialog(app: App, initial: HeaderFooterSettings, saveSettings: (settings: HeaderFooterSettings) => void): Promise<ToastHandle | void> {
  const s: HeaderFooterSettings = JSON.parse(JSON.stringify(initial));
  s.images ||= {};
  s.imageHeight ||= 24;
  const pageCount = app.doc.pageCount;
  if (s.to < 1 || s.to > pageCount) s.to = pageCount;
  const textInputs = {} as Record<Slot, HTMLInputElement>;
  // Re-render hook for image changes; set to the preview scheduler once that exists.
  let onImageChange = () => {
  };
  const slotEditor = (slot: Slot, position: string) => {
    const name = (slot[0] === "h" ? "Header " : "Footer ") + position.toLowerCase(), input = h("input", { class: "tinput", id: "hf-" + slot, type: "text", value: s.text[slot], placeholder: position, "aria-label": name + " text" }) as HTMLInputElement;
    input.addEventListener("focus", () => lastFocused = input);
    textInputs[slot] = input;
    const picker = h("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/svg+xml", hidden: true, id: "hf-img-" + slot }) as HTMLInputElement, imageButton = h("button", { class: "hf-img", type: "button", title: "Add an image", "aria-label": name + " image" }), removeButton = h("button", { class: "hf-img-x", type: "button", title: "Remove image", "aria-label": "Remove " + name + " image", text: "×" }), syncImage = () => {
      const url = s.images[slot];
      imageButton.replaceChildren(url ? h("img", { src: url, alt: "" }) : icon("image"));
      imageButton.classList.toggle("has", !!url);
      removeButton.hidden = !url;
    };
    imageButton.addEventListener("click", () => picker.click());
    removeButton.addEventListener("click", () => {
      delete s.images[slot];
      syncImage();
    });
    picker.addEventListener("change", () => {
      const file = picker.files?.[0];
      picker.value = "";
      if (!file) return;
      if (file.size > 4 * 1024 * 1024) return toast("Choose an image under 4 MB", "warn");
      const reader = new FileReader();
      reader.onload = () => {
        s.images[slot] = String(reader.result);
        syncImage();
        onImageChange();
      };
      reader.readAsDataURL(file);
    });
    syncImage();
    return h("div", { class: "hf-slot" }, input, imageButton, removeButton, picker);
  };
  /** The text field tokens are inserted into (the last focused one; bottom right by default). */
  let lastFocused: HTMLInputElement | null = null;
  const tokenChip = (token: string, label: string) => h("button", { class: "chip", type: "button", text: label, onclick: () => {
    const input = lastFocused || textInputs.fr, start = input.selectionStart ?? input.value.length, end = input.selectionEnd ?? start;
    input.value = input.value.slice(0, start) + token + input.value.slice(end);
    input.focus();
    input.setSelectionRange(start + token.length, start + token.length);
  } }), fontSelect = h("select", { class: "rselect", id: "hf-font", "aria-label": "Font" }, ...FONT_GROUPS.map((group) => h("optgroup", { label: group }, ...FONTS.filter((f) => f.group === group).map((f) => h("option", { value: f.key, text: f.label, selected: f.key === s.fontKey }))))) as HTMLSelectElement, numberInput = (id: string, value: number, min: number, max: number, label: string) => h("input", { class: "rnum", id, type: "number", value: String(value), min: String(min), max: String(max), "aria-label": label }) as HTMLInputElement, sizeInput = numberInput("hf-size", s.size, 5, 36, "Font size"), marginInput = numberInput("hf-margin", s.margin, 6, 144, "Margin from page edge"), startInput = numberInput("hf-start", s.start, 0, 99999, "First page number"), imageHeightInput = numberInput("hf-imgh", s.imageHeight, 6, 120, "Image height"), fromInput = numberInput("hf-from", s.from, 1, pageCount, "From page"), toInput = numberInput("hf-to", s.to, 1, pageCount, "To page"), rangeSelect = h("select", { class: "rselect", id: "hf-range", "aria-label": "Pages" }, h("option", { value: "all", text: `All ${pageCount} pages`, selected: s.range === "all" }), h("option", { value: "skipFirst", text: "All except the first page", selected: s.range === "skipFirst" }), h("option", { value: "custom", text: "Page range", selected: s.range === "custom" })) as HTMLSelectElement, fromTo = h("span", { class: "withunit" }, fromInput, h("span", { class: "unit", text: "to" }), toInput), syncRange = () => {
    fromTo.hidden = rangeSelect.value !== "custom";
  };
  rangeSelect.addEventListener("change", syncRange);
  syncRange();
  const thaiBox = h("input", { type: "checkbox", id: "hf-thai", checked: s.thaiDigits }) as HTMLInputElement, swatch = (color: RGBA) => h("button", { class: "sw" + (color.join() === s.color.join() ? " on" : ""), type: "button", "aria-label": `rgb ${color.slice(0, 3).join(" ")}`, style: { background: `rgb(${color[0]},${color[1]},${color[2]})` }, onclick: (ev: MouseEvent) => {
    s.color = color;
    (ev.currentTarget as HTMLElement).parentElement!.querySelectorAll(".sw").forEach((sw) => sw.classList.remove("on"));
    (ev.currentTarget as HTMLElement).classList.add("on");
  } }), row = (label: string, ...controls: Child[]) => h("div", { class: "hf-row" }, h("span", { class: "rlabel", text: label }), h("div", { class: "hf-ctrl" }, ...controls)), body = h("div", { class: "hf" }, h("div", { class: "hf-grid" }, h("span", { class: "rlabel", text: "Header" }), slotEditor("hl", "Left"), slotEditor("hc", "Center"), slotEditor("hr", "Right"), h("span", { class: "rlabel", text: "Footer" }), slotEditor("fl", "Left"), slotEditor("fc", "Center"), slotEditor("fr", "Right")), h("div", { class: "hf-tokens" }, h("span", { class: "hint", text: "Insert:" }), tokenChip("{page}", "Page number"), tokenChip("{pages}", "Page count"), tokenChip("{date}", "Date"), tokenChip("{file}", "File name")), row("Text", fontSelect, h("span", { class: "withunit" }, sizeInput, h("span", { class: "unit", text: "pt" })), h("div", { class: "swatches" }, ...([[90, 94, 104, 255], [24, 26, 33, 255], [214, 69, 52, 255], [37, 99, 235, 255]] as RGBA[]).map(swatch))), row("Pages", rangeSelect, fromTo), row("Numbering", h("span", { class: "withunit" }, h("span", { class: "unit", text: "Start at" }), startInput), h("label", { class: "hf-check" }, thaiBox, "Thai digits (๑ ๒ ๓)")), row("Images", h("span", { class: "withunit" }, h("span", { class: "unit", text: "Height" }), imageHeightInput, h("span", { class: "unit", text: "pt" })), h("span", { class: "hint", text: "Use the image button beside a position. Images sit before that position’s text." })), row("Margin", h("span", { class: "withunit" }, marginInput, h("span", { class: "unit", text: "pt from the edge" })))), readForm = () => {
    for (const slot of HF_SLOTS) s.text[slot] = textInputs[slot].value;
    s.fontKey = fontSelect.value;
    s.size = Math.max(5, Math.min(36, +sizeInput.value || 9));
    s.margin = Math.max(6, Math.min(144, +marginInput.value || 28));
    s.imageHeight = Math.max(6, Math.min(120, +imageHeightInput.value || 24));
    s.start = Math.max(0, Math.round(+startInput.value || 1));
    s.range = rangeSelect.value as HeaderFooterSettings["range"];
    s.from = Math.max(1, Math.min(pageCount, +fromInput.value || 1));
    s.to = Math.max(s.from, Math.min(pageCount, +toInput.value || pageCount));
    s.thaiDigits = thaiBox.checked;
  };
  let previewPage = Math.min(app.currentPage, pageCount - 1);
  const topStrip = h("canvas", { class: "hf-strip", "aria-label": "Preview of the top of the page" }) as HTMLCanvasElement, bottomStrip = h("canvas", { class: "hf-strip", "aria-label": "Preview of the bottom of the page" }) as HTMLCanvasElement, pageLabel = h("span", { class: "mono", text: "" }), previewNote = h("span", { class: "hint", text: "" }), pageButton = (step: number) => h("button", { class: "iconbtn small", type: "button", "aria-label": step < 0 ? "Previous page" : "Next page", onclick: () => {
    previewPage = Math.max(0, Math.min(pageCount - 1, previewPage + step));
    schedulePreview();
  } }, icon(step < 0 ? "left" : "right")), preview = h("div", { class: "hf-preview" }, h("div", { class: "hf-pv-head" }, h("span", { class: "rlabel", text: "Preview" }), pageButton(-1), pageLabel, pageButton(1), previewNote), h("div", { class: "hf-band" }, topStrip), h("div", { class: "hf-gap", "aria-hidden": "true" }), h("div", { class: "hf-band" }, bottomStrip));
  body.append(preview);
  // `generation` drops results of stale previews; `timer` debounces them.
  let timer = 0, generation = 0;
  const updatePreview = async () => {
    const gen = ++generation;
    readForm();
    pageLabel.textContent = `Page ${previewPage + 1} of ${pageCount}`;
    const widthPx = Math.max(240, preview.clientWidth || 600);
    try {
      const r = await renderPreview(app, previewPage, s, widthPx);
      if (gen !== generation) return;
      previewNote.textContent = r.inRange ? "" : "This page is outside the chosen range.";
      // Strip height: margin + band + a little, in points (at most half the page), then in pixels.
      const stripPt = Math.min(r.h / 2, s.margin + Math.max(s.size, HF_SLOTS.some((slot) => s.images[slot]) ? s.imageHeight : 0) + 18), stripPx = Math.round(stripPt * r.scale), full = document.createElement("canvas");
      full.width = r.img.width;
      full.height = r.img.height;
      full.getContext("2d")!.putImageData(r.img, 0, 0);
      for (const [strip, sy] of [[topStrip, 0], [bottomStrip, r.img.height - stripPx]] as [HTMLCanvasElement, number][]) {
        strip.width = r.img.width;
        strip.height = stripPx;
        strip.style.aspectRatio = `${r.img.width} / ${stripPx}`;
        strip.getContext("2d")!.drawImage(full, 0, sy, r.img.width, stripPx, 0, 0, r.img.width, stripPx);
      }
    } catch (err) {
      if (gen === generation) previewNote.textContent = (err as Error).message || "Preview unavailable";
    }
  }, schedulePreview = () => {
    clearTimeout(timer);
    timer = window.setTimeout(updatePreview, 220);
  };
  body.addEventListener("input", schedulePreview);
  body.addEventListener("change", schedulePreview);
  body.addEventListener("click", (ev) => {
    if ((ev.target as Element).closest(".sw,.chip,.hf-img-x")) schedulePreview();
  });
  onImageChange = schedulePreview;
  const choice = await modal({ title: "Header & footer", onOpen: () => requestAnimationFrame(() => updatePreview()), body, actions: [{ id: "remove", label: "Remove from all pages" }, { id: "cancel", label: "Cancel" }, { id: "apply", label: "Apply", primary: true }] });
  // Drop any scheduled or in-flight preview on every way out of the dialog.
  clearTimeout(timer);
  generation++;
  if (choice === "remove") {
    try {
      await app.mutate("Remove header & footer", { pages: "all" }, () => removeHeaderFooter(app, [...Array(app.doc.pageCount).keys()]));
      toast("Removed header and footer");
    } catch (err) {
      toast((err as Error).message, "err");
    }
    return;
  }
  if (choice === "apply") {
    readForm();
    saveSettings(s);
    if (!HF_SLOTS.some((slot) => s.text[slot].trim() || s.images[slot])) return toast("Add text or an image to at least one position", "warn");
    try {
      let count = 0;
      await app.mutate("Header & footer", { pages: "all" }, async () => {
        count = await applyHeaderFooter(app, s);
      });
      toast(`Header and footer added to ${count} page${count === 1 ? "" : "s"}`);
    } catch (err) {
      toast((err as Error).message, "err");
    }
  }
}

export { headerFooterDialog, DEFAULT_HEADER_FOOTER };
