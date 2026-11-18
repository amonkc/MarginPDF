import { makeZip } from '../util/zip';
import { toast, modal, h } from './dom';
import type { Child, ToastHandle } from './dom';
import type { App } from '../app';
import { parsePageRange, formatPageRange } from './extract';
import { renderPages } from './print';
import type { RenderedPage } from './print';

/** Saves bytes under a file name with a MIME type (provided by the app). */
type SaveFile = (data: Uint8Array, name: string, mime: string) => Promise<unknown> | unknown;

/**
 * "Export pages as images" dialog: pages, PNG/JPEG, resolution, quality and markup, with a live size hint.
 * One page is saved as an image, several as a .zip.
 */
async function exportImagesDialog(app: App, save: SaveFile): Promise<ToastHandle | void> {
  const { locked, perms } = app.limits;
  if (locked && !(perms & 16)) return toast("This PDF’s permissions don’t allow copying its content. Unlock it with its permissions password first.", "warn", 5e3);
  const pageCount = app.doc.pageCount, selected = [...app.selectedPages].sort((a, b) => a - b), pagesRadio = (value: string, label: Child, checked = false) => h("label", { class: "hf-check" }, h("input", { type: "radio", name: "ei-pages", value, checked }), label), rangeInput = h("input", { class: "tinput", id: "ei-range", value: selected.length ? formatPageRange(selected) : `1-${pageCount}`, autocomplete: "off" }) as HTMLInputElement, formatSelect = h("select", { class: "tinput", id: "ei-format" }, h("option", { value: "png", text: "PNG (sharp, larger)" }), h("option", { value: "jpeg", text: "JPEG (smaller, for photos)" })) as HTMLSelectElement, dpiSelect = h("select", { class: "tinput", id: "ei-dpi" }, ...([[72, "Screen (72 dpi)"], [150, "Standard (150 dpi)"], [300, "Print (300 dpi)"], [600, "Very high (600 dpi)"]] as [number, string][]).map(([dpi, label]) => h("option", { value: String(dpi), text: String(label), selected: dpi === 150 }))) as HTMLSelectElement, qualityRange = h("input", { type: "range", id: "ei-quality", min: "50", max: "100", value: "90", "aria-label": "JPEG quality" }) as HTMLInputElement, qualityValue = h("span", { class: "rlabel", text: "90" }), qualityRow = h("label", { class: "rfield" }, h("span", { class: "rlabel", text: "Quality" }), qualityRange, qualityValue), annotsBox = h("input", { type: "checkbox", id: "ei-annots", checked: true }) as HTMLInputElement, sizeHint = h("p", { class: "hint", id: "ei-size" }), body = h("div", { class: "stack" }, h("div", { class: "stack", role: "radiogroup", "aria-label": "Pages" }, pagesRadio("all", `All pages (${pageCount})`, !selected.length), pagesRadio("current", `Current page (${app.currentPage + 1})`), ...selected.length ? [pagesRadio("sel", `Selected pages (${formatPageRange(selected)})`, true)] : [], h("label", { class: "hf-check" }, h("input", { type: "radio", name: "ei-pages", value: "range" }), "Pages ", rangeInput)), h("label", { class: "rfield" }, h("span", { class: "rlabel", text: "Format" }), formatSelect), h("label", { class: "rfield" }, h("span", { class: "rlabel", text: "Resolution" }), dpiSelect), qualityRow, h("label", { class: "hf-check" }, annotsBox, "Include comments and markup"), sizeHint), chosenPages = (): number[] => {
    const mode = (body.querySelector("input[name=ei-pages]:checked") as HTMLInputElement).value;
    return mode === "all" ? [...Array(pageCount).keys()] : mode === "current" ? [app.currentPage] : mode === "sel" ? selected : parsePageRange(rangeInput.value, pageCount);
  }, update = () => {
    qualityRow.hidden = formatSelect.value !== "jpeg";
    qualityValue.textContent = qualityRange.value;
    try {
      const pages = chosenPages(), { w, h } = app.doc.pageSize(pages[0] ?? 0), dpi = +dpiSelect.value;
      sizeHint.textContent = `${pages.length} image${pages.length === 1 ? "" : "s"}, about ${Math.round(w / 72 * dpi)} × ${Math.round(h / 72 * dpi)} px${pages.length > 1 ? ", saved together as a .zip" : ""}`;
      sizeHint.classList.remove("err");
    } catch (err) {
      sizeHint.textContent = (err as Error).message;
      sizeHint.classList.add("err");
    }
  };
  rangeInput.addEventListener("focus", () => {
    (body.querySelector("input[value=range]") as HTMLInputElement).checked = true;
    update();
  });
  body.addEventListener("input", update);
  body.addEventListener("change", update);
  update();
  if (await modal({ title: "Export pages as images", body, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Export", primary: true }] }) !== "ok") return;
  let pages: number[];
  try {
    pages = chosenPages();
  } catch (err) {
    return toast((err as Error).message, "warn");
  }
  const mime = formatSelect.value === "jpeg" ? "image/jpeg" : "image/png", ext = formatSelect.value === "jpeg" ? "jpg" : "png";
  let cancelled = false;
  const progress = toast(`Rendering page 1 of ${pages.length}…`, "ok", 6e5, { label: "Cancel", run: () => {
    cancelled = true;
  } });
  let rendered: RenderedPage[] | null;
  try {
    rendered = await renderPages(app, pages, +dpiSelect.value, annotsBox.checked, mime, +qualityRange.value / 100, (i) => (progress.set(`Rendering page ${i + 1} of ${pages.length}…`), !cancelled));
  } catch (err) {
    progress.close();
    return toast((err as Error).message, "err");
  }
  progress.close();
  if (!rendered) return;
  // File names: <name>_page<n>.<ext>, page numbers zero-padded to the width of the page count.
  const baseName = app.fileName.replace(/\.pdf$/i, ""), digits = String(pageCount).length, files = await Promise.all(rendered.map(async (r) => ({ name: `${baseName}_page${String(r.page + 1).padStart(digits, "0")}.${ext}`, data: new Uint8Array(await r.blob.arrayBuffer()) })));
  if (files.length === 1) await save(files[0].data, files[0].name, mime);
  else await save(makeZip(files), `${baseName}_${ext}.zip`, "application/zip");
}

export { exportImagesDialog };
