import { FIELD, nameRadioStates } from '../engine/pdfium';
import { needsShaping, drawFieldAppearance } from '../engine/text';
import { makeZip } from '../util/zip';
import { toast, modal, h } from './dom';
import type { Child } from './dom';
import type { Doc, Pdfium, FieldInfo, FieldKind as EngineFieldKind } from '../engine/pdfium';
import type { ZipEntry } from '../util/zip';
import type { App } from '../app';

/** Kind of form field Margin can recreate. */
export type FieldKind = EngineFieldKind;
/** A form field recreated in a target document, with the value to restore once it has been saved and reopened. */
export type CopiedField = { page: number; name: string; kind: FieldKind; value: string; checked: boolean; exportValue: string; selected: number; options: string[] };

/**
 * Recreates the form fields of `srcPages` (all but push buttons) on the pages copied into `dst` starting at
 * `dstStart`, replacing the widgets that page import brought along. Names already in `takenNames` get a
 * `_2`, `_3`… suffix (and are added to it); radio buttons of one group are joined. Returns the fields with
 * their values, to be applied by `reopenWithFieldValues`.
 */
function copyFormFields(src: Doc, srcPages: number[], dst: Doc, dstStart: number, takenNames: Set<string>): CopiedField[] {
  const renamed = /* @__PURE__ */ new Map<string, string>(), uniqueName = (name: string) => {
    let unique = renamed.get(name);
    if (unique) return unique;
    unique = name;
    let n = 2;
    for (; takenNames.has(unique); ) unique = `${name}_${n++}`;
    renamed.set(name, unique);
    takenNames.add(unique);
    return unique;
  }, copied: CopiedField[] = [], radioGroups = /* @__PURE__ */ new Map<string, { page: number; annot: number }>();
  for (const [i, srcPage] of srcPages.entries()) {
    const page = dstStart + i, fields = src.fields(srcPage).filter((f: FieldInfo) => f.type !== FIELD.PUSHBUTTON);
    if (!(!fields.length && !dst.fields(page).length)) {
      dst.removeWidgets(page);
      for (const f of fields) {
        const kind: FieldKind | null = f.type === FIELD.TEXT ? f.multiline ? "multiline" : "text" : f.type === FIELD.CHECKBOX ? "checkbox" : f.type === FIELD.RADIO ? "radio" : f.type === FIELD.COMBO ? "dropdown" : f.type === FIELD.LIST ? "list" : f.type === FIELD.SIGNATURE ? "signature" : null;
        if (!kind) continue;
        const name = uniqueName(f.name || "Field"), annot = dst.createField(page, kind, f.rect, name, { options: f.options.map((o) => o.label), onValue: f.exportValue || "On", joinTo: kind === "radio" ? radioGroups.get(name) : undefined });
        if (kind === "radio" && !radioGroups.has(name)) radioGroups.set(name, { page, annot });
        const selected = f.options.findIndex((o) => o.selected);
        copied.push({ page, name, kind, value: f.value, checked: f.checked, exportValue: f.exportValue, selected: selected >= 0 ? selected : f.options.findIndex((o) => o.label === f.value), options: f.options.map((o) => o.label) });
      }
    }
  }
  return copied;
}

/** Opens saved PDF bytes and fills in the values of fields recreated by `copyFormFields`. Returns the opened doc. */
async function reopenWithFieldValues(lib: Pdfium, bytes: Uint8Array, fields: CopiedField[]): Promise<Doc> {
  const doc = lib.open(nameRadioStates(bytes));
  for (const rec of fields) {
    const matches = doc.fields(rec.page).filter((f) => f.name === rec.name), field = rec.kind === "radio" ? matches.find((f) => f.exportValue === rec.exportValue) : matches[0];
    if (field) {
      if ((rec.kind === "text" || rec.kind === "multiline") && rec.value) {
        doc.setFieldText(rec.page, field.index, rec.value);
        // Complex-script text needs an appearance drawn by Margin's own shaper.
        if (needsShaping(rec.value)) await drawFieldAppearance(doc, rec.page, field.index, rec.value);
      } else if ((rec.kind === "checkbox" || rec.kind === "radio") && rec.checked && !field.checked) doc.clickField(rec.page, field.index);
      else if (rec.kind === "dropdown" || rec.kind === "list") {
        if (field.options.map((o) => o.label).join(`
`) !== rec.options.join(`
`)) doc.setFieldOptions(rec.page, field.index, rec.options);
        if (rec.selected >= 0) doc.selectOption(rec.page, field.index, rec.selected);
      }
    }
  }
  return doc;
}

/** Names of all form fields in a document. */
function fieldNames(doc: Doc): Set<string> {
  const names = /* @__PURE__ */ new Set<string>();
  for (let page = 0; page < doc.pageCount; page++) for (const f of doc.fields(page)) names.add(f.name);
  return names;
}

/**
 * Parses a page list like "1-3, 5, 8-" (1-based; open ends run to the first/last page) into sorted,
 * unique 0-based indices. Throws a user-facing error on bad input; `emptyMessage` is the error for an empty field.
 */
function parsePageRange(text: string, pageCount: number, emptyMessage = "Enter the pages"): number[] {
  const pages = /* @__PURE__ */ new Set<number>(), trimmed = text.trim();
  if (!trimmed) throw new Error(emptyMessage);
  for (const part of trimmed.split(/[,;\s]+/).filter(Boolean)) {
    const m = part.match(/^(\d*)\s*[-–]\s*(\d*)$/) || part.match(/^(\d+)$/);
    if (!m) throw new Error(`“${part}” isn’t a page or a range`);
    const from = m[2] === undefined || m[1] ? +m[1] : 1, to = m[2] === undefined ? +m[1] : m[2] ? +m[2] : pageCount;
    if (from < 1 || to > pageCount || from > to) throw new Error(`Pages go from 1 to ${pageCount}`);
    for (let p = from; p <= to; p++) pages.add(p - 1);
  }
  return [...pages].sort((a, b) => a - b);
}

/** Formats sorted 0-based page indices as a 1-based list with runs collapsed, e.g. "1-3, 5". */
function formatPageRange(pages: number[]): string {
  const parts: string[] = [];
  for (let start = 0; start < pages.length; ) {
    let end = start;
    for (; end + 1 < pages.length && pages[end + 1] === pages[end] + 1; ) end++;
    parts.push(end > start ? `${pages[start] + 1}-${pages[end] + 1}` : `${pages[start] + 1}`);
    start = end + 1;
  }
  return parts.join(", ");
}

/**
 * "Extract pages" dialog: copies the chosen pages (with their form fields) into one PDF, one per page, or one per
 * N pages (several are saved as a .zip), and optionally removes them from this document afterwards.
 */
async function extractDialog(app: App, lib: Pdfium, initialPages: number[], save: (data: Uint8Array, name: string, mime: string) => Promise<unknown> | unknown): Promise<void> {
  const pageCount = app.doc.pageCount, rangeInput = h("input", { class: "tinput", id: "ex-range", value: formatPageRange(initialPages), placeholder: "e.g. 1-3, 5, 8-", autocomplete: "off" }) as HTMLInputElement, everyInput = h("input", { class: "rnum", type: "number", min: "1", max: String(pageCount), value: "2", id: "ex-every", "aria-label": "Pages per file" }) as HTMLInputElement, modeRadio = (value: string, content: Child[], checked = false) => h("label", { class: "hf-check" }, h("input", { type: "radio", name: "ex-mode", value, checked }), ...content), deleteBox = h("input", { type: "checkbox", id: "ex-del" }) as HTMLInputElement, status = h("p", { class: "modal-text", id: "ex-status" }), body = h("div", { class: "stack extract" }, h("label", { class: "rfield" }, h("span", { class: "rlabel", text: `Pages (of ${pageCount})` }), rangeInput), h("div", { class: "stack", role: "radiogroup", "aria-label": "Output" }, modeRadio("one", ["As one PDF"], true), modeRadio("each", ["One PDF per page"]), modeRadio("every", ["Split every ", everyInput, " pages"])), h("label", { class: "hf-check" }, deleteBox, "Remove these pages from this document afterwards"), status), mode = () => (body.querySelector("input[name=ex-mode]:checked") as HTMLInputElement).value, groups = (): number[][] => {
    const pages = parsePageRange(rangeInput.value, pageCount, "Enter the pages to extract"), m = mode();
    if (m === "one") return [pages];
    const size = m === "each" ? 1 : Math.max(1, Math.floor(+everyInput.value || 1)), out: number[][] = [];
    for (let i = 0; i < pages.length; i += size) out.push(pages.slice(i, i + size));
    return out;
  }, update = () => {
    try {
      const files = groups(), total = files.reduce((sum, g) => sum + g.length, 0);
      status.textContent = files.length === 1 ? `${total} page${total === 1 ? "" : "s"} → 1 PDF` : `${total} pages → ${files.length} PDFs, saved together as a .zip`;
      status.classList.remove("err");
      // Removing every page would leave an empty document.
      deleteBox.disabled = total >= pageCount;
      if (deleteBox.disabled) deleteBox.checked = false;
    } catch (err) {
      status.textContent = (err as Error).message;
      status.classList.add("err");
    }
  };
  body.addEventListener("input", update);
  body.addEventListener("change", update);
  update();
  if (await modal({ title: "Extract pages", body, actions: [{ id: "cancel", label: "Cancel" }, { id: "go", label: "Extract", primary: true }] }) !== "go") return;
  let chosen: number[][];
  try {
    chosen = groups();
  } catch (err) {
    toast((err as Error).message, "warn");
    return;
  }
  const baseName = app.fileName.replace(/\.pdf$/i, ""), fileName = (pages: number[]) => pages.length === 1 ? `${baseName}_page${pages[0] + 1}.pdf` : `${baseName}_pages${formatPageRange(pages).replace(/, /g, "_")}.pdf`, files: ZipEntry[] = [];
  for (const pages of chosen) {
    let out: Doc = lib.create();
    try {
      if (!out.importIndices(app.doc, pages, 0)) throw new Error("Those pages could not be copied");
      const fields = copyFormFields(app.doc, pages, out, 0, /* @__PURE__ */ new Set());
      if (fields.length) {
        // Field values can only be set reliably on a reopened copy.
        const reopened = await reopenWithFieldValues(lib, out.save(), fields);
        out.close();
        out = reopened;
      }
      files.push({ name: fileName(pages), data: out.save() });
    } finally {
      out.close();
    }
  }
  if (files.length === 1) await save(files[0].data, files[0].name, "application/pdf");
  else await save(makeZip(files), `${baseName}_split.zip`, "application/zip");
  if (deleteBox.checked) {
    // Delete from the last page backwards so earlier indices stay valid.
    const toDelete = chosen.flat().sort((a, b) => b - a);
    await app.mutate(`Remove ${toDelete.length} extracted page${toDelete.length === 1 ? "" : "s"}`, { pages: "all", structure: true }, () => {
      for (const page of toDelete) app.doc.deletePage(page);
      app.selectedPages.clear();
    });
  }
}

export { extractDialog, reopenWithFieldValues, parsePageRange, formatPageRange, fieldNames, copyFormFields };
