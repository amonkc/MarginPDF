// Images to PDF: photos and pictures (JPG, PNG, WebP, GIF, BMP, AVIF) become PDF pages, one image per page.
// Used to open images as a new document and to insert images as pages into the current one.

import type { Doc, Pdfium } from '../engine/pdfium';
import { decodeImage, encodeImage, IMAGE_ACCEPT } from './images';
import { h, modal } from './dom';

/** Page size for image pages: a paper size (orientation follows each image) or the image's own proportions. */
export type ImagePageSize = "a4" | "letter" | "image";
export type ImagePageOptions = { size: ImagePageSize; margin: number };

const PAPER: Record<"a4" | "letter", [number, number]> = { a4: [595.28, 841.89], letter: [612, 792] };
/** "Same as image" pages have the image's proportions, their long side as long as A4's. */
const IMAGE_PAGE_LONG = 841.89;
const MARGINS: [string, number][] = [["None", 0], ["Small", 18], ["Large", 54]];
const STORE = "margin.imagePages";

/** The paper size Margin suggests: Letter in the US and Canada, A4 elsewhere. */
const defaultPaper = (): "a4" | "letter" => /-(US|CA)$/i.test(navigator.language) ? "letter" : "a4";

/** Asks for page size and margins (remembered on this device). Resolves to null if cancelled. */
async function askImagePages(count: number, verb: "Create PDF" | "Insert"): Promise<ImagePageOptions | null> {
  let saved: Partial<ImagePageOptions> = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORE) || "{}");
  } catch {}
  const size = saved.size || defaultPaper(), margin = saved.margin ?? 0;
  const radio = (name: string, value: string, label: string, checked: boolean) =>
    h("label", { class: "hf-check" }, h("input", { type: "radio", name, value, checked }), label);
  const body = h(
    "div",
    { class: "stack" },
    h("p", { class: "modal-text", text: count === 1 ? "The image becomes one page." : `Each of the ${count} images becomes a page, in the order you chose them.` }),
    h("div", { class: "stack", role: "radiogroup", "aria-label": "Page size" },
      h("span", { class: "rlabel", text: "Page size" }),
      radio("ip-size", "a4", "A4", size === "a4"),
      radio("ip-size", "letter", "Letter", size === "letter"),
      radio("ip-size", "image", "Same shape as the image", size === "image")),
    h("div", { class: "stack", role: "radiogroup", "aria-label": "Margin" },
      h("span", { class: "rlabel", text: "Margin" }),
      ...MARGINS.map(([label, pt]) => radio("ip-margin", String(pt), label, pt === margin))),
    h("p", { class: "hint", text: "Pages turn sideways for landscape images. Photos are kept at up to 300 dpi." }),
  );
  const choice = await modal({ title: count === 1 ? "Image to PDF" : "Images to PDF", body, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: verb, primary: true }] });
  if (choice !== "ok") return null;
  const picked = (name: string) => (body.querySelector(`input[name=${name}]:checked`) as HTMLInputElement).value;
  const options: ImagePageOptions = { size: picked("ip-size") as ImagePageSize, margin: +picked("ip-margin") };
  try {
    localStorage.setItem(STORE, JSON.stringify(options));
  } catch {}
  return options;
}

/** Page width and height for an image: paper turned to match the image's orientation, or the image's shape. */
function pageSizeFor(img: { w: number; h: number }, options: ImagePageOptions): [number, number] {
  if (options.size === "image") {
    const k = (IMAGE_PAGE_LONG - 2 * options.margin) / Math.max(img.w, img.h);
    return [img.w * k + 2 * options.margin, img.h * k + 2 * options.margin];
  }
  const [w, h] = PAPER[options.size];
  return img.w > img.h ? [h, w] : [w, h];
}

/**
 * A new document with one page per image, each image fitted inside the margins and centred. Images the browser
 * can't decode are skipped and named in `skipped`. The caller closes the document.
 */
async function imagesToDoc(pdfium: Pdfium, files: File[], options: ImagePageOptions, progress?: (done: number) => void): Promise<{ doc: Doc; skipped: string[] }> {
  const doc = pdfium.create(), skipped: string[] = [];
  try {
    for (const [i, file] of files.entries()) {
      let img;
      try {
        img = await decodeImage(file, file.name);
      } catch {
        skipped.push(file.name);
        continue;
      }
      try {
        const [pw, ph] = pageSizeFor(img, options), m = options.margin;
        const k = Math.min((pw - 2 * m) / img.w, (ph - 2 * m) / img.h), w = img.w * k, hgt = img.h * k;
        const page = doc.pageCount;
        doc.insertBlank(page, pw, ph);
        doc.addImage(page, [w, 0, 0, hgt, (pw - w) / 2, (ph - hgt) / 2], await encodeImage(img, w, hgt));
      } finally {
        img.bitmap.close();
        URL.revokeObjectURL(img.url);
      }
      progress?.(i + 1);
    }
  } catch (err) {
    doc.close();
    throw err;
  }
  return { doc, skipped };
}

/** "photo.jpg" → "photo.pdf". */
const pdfNameFor = (file: File): string => file.name.replace(/\.[^.]+$/, "") + ".pdf";

export { askImagePages, imagesToDoc, pdfNameFor, IMAGE_ACCEPT };
