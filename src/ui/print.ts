import { toast, modal, h } from './dom';
import { parsePageRange, formatPageRange } from './extract';

/** One rendered page: its index, the encoded image and the page size in points. */
export type RenderedPage = { page: number; blob: Blob; w: number; h: number };

/**
 * Renders pages to encoded images at `dpi` (long side capped at 8000 px), one at a time, yielding to the
 * event loop between pages. `onPage(i)` is called before page i and returns false to cancel (→ null).
 */
async function renderPages(app: any, pages: number[], dpi: number, annots: boolean, mime: string, quality: number, onPage: (i: number) => boolean): Promise<RenderedPage[] | null> {
  const out: RenderedPage[] = [], canvas = document.createElement("canvas"), ctx = canvas.getContext("2d")!;
  for (let i = 0; i < pages.length; i++) {
    if (!onPage(i)) return null;
    await new Promise((resolve) => setTimeout(resolve, 0));
    const page = pages[i], { w, h } = app.doc.pageSize(page);
    let pxW = Math.round(w / 72 * dpi), pxH = Math.round(h / 72 * dpi);
    const cap = 8e3 / Math.max(pxW, pxH);
    if (cap < 1) {
      pxW = Math.round(pxW * cap);
      pxH = Math.round(pxH * cap);
    }
    app.relieveMemory(page);
    const img = app.doc.render(page, pxW, pxH, { annots, print: true });
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.putImageData(img, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, quality));
    if (!blob) throw new Error(`Page ${page + 1} could not be rendered`);
    out.push({ page, blob, w, h });
  }
  // Release the canvas backing store.
  canvas.width = canvas.height = 0;
  return out;
}

/** Print dialog: choose pages, markup and quality, then render the pages as images and open the browser's print. */
async function printDialog(app: any): Promise<any> {
  const { locked, perms } = app.limits;
  if (locked && !(perms & 4)) return toast("This PDF’s permissions don’t allow printing. Unlock it with its permissions password first.", "warn", 5e3);
  const pageCount = app.doc.pageCount, selected = [...app.selectedPages].sort((a, b) => a - b), pagesRadio = (value: string, label: any, checked = false) => h("label", { class: "hf-check" }, h("input", { type: "radio", name: "pr-pages", value, checked }), label), rangeInput = h("input", { class: "tinput", id: "print-range", value: selected.length ? formatPageRange(selected) : `1-${pageCount}`, placeholder: "e.g. 1-3, 5", autocomplete: "off" }) as HTMLInputElement, annotsBox = h("input", { type: "checkbox", id: "print-annots", checked: true }) as HTMLInputElement, qualitySelect = h("select", { class: "tinput", id: "print-quality" }, h("option", { value: "150", text: "Standard (150 dpi)" }), h("option", { value: "300", text: "High (300 dpi, slower)" })) as HTMLSelectElement, body = h("div", { class: "stack" }, h("div", { class: "stack", role: "radiogroup", "aria-label": "Pages" }, pagesRadio("all", `All pages (${pageCount})`, !selected.length), pagesRadio("current", `Current page (${app.currentPage + 1})`), ...selected.length ? [pagesRadio("sel", `Selected pages (${formatPageRange(selected)})`, true)] : [], h("label", { class: "hf-check" }, h("input", { type: "radio", name: "pr-pages", value: "range" }), "Pages ", rangeInput)), h("label", { class: "hf-check" }, annotsBox, "Comments and markup"), h("label", { class: "rfield" }, h("span", { class: "rlabel", text: "Quality" }), qualitySelect), h("p", { class: "hint", text: "Choose the printer, paper size and copies in the next step." }));
  rangeInput.addEventListener("focus", () => {
    (body.querySelector("input[value=range]") as HTMLInputElement).checked = true;
  });
  if (await modal({ title: "Print", body, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Print…", primary: true }] }) !== "ok") return;
  const mode = (body.querySelector("input[name=pr-pages]:checked") as HTMLInputElement).value;
  let pages: number[];
  try {
    pages = mode === "all" ? [...Array(pageCount).keys()] : mode === "current" ? [app.currentPage] : mode === "sel" ? selected : parsePageRange(rangeInput.value, pageCount);
  } catch (err: any) {
    return toast(err.message, "warn");
  }
  const dpi = +qualitySelect.value;
  let cancelled = false;
  const progress = toast(`Preparing page 1 of ${pages.length}…`, "ok", 6e5, { label: "Cancel", run: () => {
    cancelled = true;
  } });
  let rendered: RenderedPage[] | null;
  try {
    rendered = await renderPages(app, pages, dpi, annotsBox.checked, "image/jpeg", 0.92, (i) => (progress?.set?.(`Preparing page ${i + 1} of ${pages.length}…`), !cancelled));
  } catch (err: any) {
    progress?.close?.();
    return toast(err.message, "err");
  }
  progress?.close?.();
  if (rendered) printImages(rendered);
}

/**
 * Puts the rendered pages into a #print-root element (shown only by the print stylesheet), waits for the
 * images to decode and calls window.print(); everything is removed again after printing.
 */
function printImages(pages: RenderedPage[]): void {
  document.getElementById("print-root")?.remove();
  const urls = pages.map((p) => URL.createObjectURL(p.blob)), root = h("div", { id: "print-root", "aria-hidden": "true" }, ...pages.map((p, i) => h("div", { class: "print-page" + (p.w > p.h ? " landscape" : "") }, h("img", { src: urls[i], alt: "" }))));
  document.body.append(root);
  const cleanup = () => {
    root.remove();
    urls.forEach((url) => URL.revokeObjectURL(url));
    removeEventListener("afterprint", cleanup);
  };
  addEventListener("afterprint", cleanup);
  Promise.all([...root.querySelectorAll("img")].map((img) => img.decode().catch(() => {
  }))).then(() => {
    try {
      window.print();
    } catch {
      toast("Printing isn’t available here. Save the PDF and print it from your PDF viewer.", "warn", 6e3);
      cleanup();
    }
  });
}

export { printDialog, renderPages };
