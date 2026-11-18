import { FIELD, nameRadioStates } from '../engine/pdfium';
import { toast, modal, svg, h } from './dom';
import type { Box, Pt, Rect } from '../engine/types';

/** The parts of a viewer page view that the form field tool uses. */
interface PageView {
  index: number;
  /** page → overlay pixels */
  tf: { box(r: Rect): Box };
  ov: HTMLElement;
  svg: SVGSVGElement;
}

/** A form field widget as listed by Doc.fields(). */
type FieldInfo = {
  index: number;
  type: number;
  rect: Rect;
  options: { label: string; [k: string]: unknown }[];
  name: string;
  value: string;
  checked: boolean;
  readOnly: boolean;
  multiline: boolean;
  exportValue: string;
};

/** Drag helper the interact layer passes to tools (see Interact). */
type DragFn = (ev: PointerEvent, pv: PageView, onMove: (p: Pt) => void, onUp: (p: Pt) => void) => void;

/** A kind of field the form tool can create, with its default size (pt) and the base of its default name. */
export type FieldKind = { kind: string; label: string; w: number; h: number; base: string };

/** Field kinds offered by the form tool, in ribbon order. */
const FIELD_KINDS: FieldKind[] = [{ kind: "text", label: "Text", w: 180, h: 22, base: "Text" }, { kind: "multiline", label: "Multi-line", w: 240, h: 64, base: "Notes" }, { kind: "checkbox", label: "Checkbox", w: 14, h: 14, base: "Check" }, { kind: "radio", label: "Radio", w: 14, h: 14, base: "Choice" }, { kind: "dropdown", label: "Dropdown", w: 160, h: 22, base: "Dropdown" }, { kind: "list", label: "List", w: 160, h: 64, base: "List" }, { kind: "signature", label: "Signature", w: 180, h: 44, base: "Signature" }];
/** User-facing names of PDFium form field types. */
const FIELD_TYPE_LABELS: Record<number, string> = { [FIELD.TEXT]: "Text field", [FIELD.CHECKBOX]: "Checkbox", [FIELD.RADIO]: "Radio button", [FIELD.COMBO]: "Dropdown", [FIELD.LIST]: "List box", [FIELD.PUSHBUTTON]: "Button", [FIELD.SIGNATURE]: "Signature field" };
/** Reduces `s` to a safe ASCII PDF name (spaces become `_`), or `fallback` if nothing is left. */
const toPdfName = (s: string, fallback: string) => s.normalize("NFKD").replace(/[^\x20-\x7e]/g, "").replace(/[^A-Za-z0-9 _.-]/g, "").trim().replace(/\s+/g, "_") || fallback;

/** Form field tool: shows field boxes, draws new fields and edits existing ones through dialogs. */
class Forms {
  app: any;
  v: any;
  constructor(app: any, viewer: any) {
    this.app = app;
    this.v = viewer;
  }
  /** Every field widget in the document, with its page index. */
  allFields(): (FieldInfo & { page: number })[] {
    const all: (FieldInfo & { page: number })[] = [];
    for (let page = 0; page < this.app.doc.pageCount; page++) for (const field of this.app.doc.fields(page)) all.push({ ...field, page: page });
    return all;
  }
  /** `base` followed by the smallest number ≥ 1 that no field name uses yet. */
  uniqueName(base: string): string {
    const names = new Set(this.allFields().map((f) => f.name));
    let n = 1;
    for (; names.has(base + n); ) n++;
    return base + n;
  }
  overlay(pv: PageView): void {
    for (const field of this.v.fieldsOf(pv) as FieldInfo[]) {
      const box = pv.tf.box(field.rect);
      pv.ov.append(h("div", { class: "fbox", "data-field": String(field.index), title: `${FIELD_TYPE_LABELS[field.type] || "Field"} “${field.name}” — click to edit`, style: { left: box.x + "px", top: box.y + "px", width: box.w + "px", height: box.h + "px" } }, h("span", { class: "fname-tag", text: field.name })));
    }
  }
  /**
   * Pointer down with the form tool: on a field box, edit that field; otherwise drag out a new field of the
   * kind chosen in the ribbon (a click makes one of the default size; checkboxes and radios stay square).
   */
  down(ev: PointerEvent, pv: PageView, drag: DragFn): void {
    const hit = (ev.target as HTMLElement).closest<HTMLElement>(".fbox");
    if (hit) {
      ev.preventDefault();
      const field = (this.v.fieldsOf(pv) as FieldInfo[]).find((f) => f.index === +hit.dataset.field!);
      if (field) this.editDialog(pv.index, field);
      return;
    }
    const kind = FIELD_KINDS.find((k) => k.kind === this.app.settings.formKind) || FIELD_KINDS[0], start: Pt = this.v.toPage(pv, ev), rectFor = (p: Pt): Rect => {
      if (Math.abs(p.x - start.x) < 6 && Math.abs(p.y - start.y) < 6) return { l: start.x, r: start.x + kind.w, t: start.y, b: start.y - kind.h };
      if (kind.kind === "checkbox" || kind.kind === "radio") {
        const side = Math.max(Math.abs(p.x - start.x), Math.abs(p.y - start.y));
        return { l: Math.min(start.x, start.x + Math.sign(p.x - start.x) * side), r: Math.max(start.x, start.x + Math.sign(p.x - start.x) * side), b: Math.min(start.y, start.y + Math.sign(p.y - start.y) * side), t: Math.max(start.y, start.y + Math.sign(p.y - start.y) * side) };
      }
      return { l: Math.min(start.x, p.x), r: Math.max(start.x, p.x), b: Math.min(start.y, p.y), t: Math.max(start.y, p.y) };
    };
    drag(ev, pv, (p) => {
      const box = pv.tf.box(rectFor(p));
      pv.svg.replaceChildren(svg("rect", { x: box.x, y: box.y, width: box.w, height: box.h, fill: "rgba(90,162,255,.12)", stroke: "var(--sel)", "stroke-dasharray": "4 3" }));
    }, (p) => {
      const rect = rectFor(p);
      if (rect.r - rect.l < 6 || rect.t - rect.b < 6) return;
      this.newDialog(pv.index, kind.kind, rect);
    });
  }
  /**
   * Asks for the new field's name (radio: group and on-value; dropdown/list: options) and creates it.
   * Radio buttons default to the last group used so a set can be placed one after another.
   */
  async newDialog(page: number, kindName: string, rect: Rect): Promise<void> {
    const kind = FIELD_KINDS.find((k) => k.kind === kindName)!, radioGroups = [...new Set(this.allFields().filter((f) => f.type === FIELD.RADIO).map((f) => f.name))], lastGroup = this.app.settings.formLastGroup && radioGroups.includes(this.app.settings.formLastGroup) ? this.app.settings.formLastGroup : "", nameInput = h("input", { class: "tinput", id: "ff-name", value: kindName === "radio" ? lastGroup || this.uniqueName("Group") : this.uniqueName(kind.base), autocomplete: "off", list: "ff-groups" }) as HTMLInputElement, rows: HTMLElement[] = [h("label", { class: "stack-field" }, h("span", { class: "rlabel", text: kindName === "radio" ? "Group (buttons with the same group name: only one can be chosen)" : "Field name" }), nameInput)];
    if (kindName === "radio") rows.push(h("datalist", { id: "ff-groups" }, ...radioGroups.map((g) => h("option", { value: g }))));
    let valueInput: HTMLInputElement | null = null, optionsInput: HTMLTextAreaElement | null = null;
    if (kindName === "radio") {
      const inGroup = this.allFields().filter((f) => f.type === FIELD.RADIO && f.name === nameInput.value).length;
      valueInput = h("input", { class: "tinput", id: "ff-value", value: `Choice${inGroup + 1}`, autocomplete: "off" }) as HTMLInputElement;
      rows.push(h("label", { class: "stack-field" }, h("span", { class: "rlabel", text: "This button’s value (letters and digits)" }), valueInput));
    }
    if (kindName === "dropdown" || kindName === "list") {
      optionsInput = h("textarea", { class: "tinput ff-opts", id: "ff-opts", rows: 5, placeholder: "One option per line" }) as HTMLTextAreaElement;
      optionsInput.value = `Option 1
Option 2
Option 3`;
      rows.push(h("label", { class: "stack-field" }, h("span", { class: "rlabel", text: "Options, one per line" }), optionsInput));
    }
    if (await modal({ title: `New ${kind.label.toLowerCase()} field`, body: h("div", { class: "stack" }, ...rows), actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Add field", primary: true }] }) !== "ok") return;
    const name = nameInput.value.trim() || this.uniqueName(kind.base);
    // Radio buttons share their group's name; every other field needs a name of its own.
    if (kindName !== "radio" && this.allFields().some((f) => f.name === name)) {
      toast(`A field named “${name}” already exists`, "warn");
      return;
    }
    const options = optionsInput ? optionsInput.value.split(`
`).map((s) => s.trim()).filter(Boolean) : undefined;
    if (optionsInput && !options!.length) {
      toast("Add at least one option", "warn");
      return;
    }
    const onValue = valueInput ? toPdfName(valueInput.value, "Choice") : undefined;
    if (kindName === "radio") {
      this.app.settings.formLastGroup = name;
      this.app.saveSettings();
    }
    await this.app.mutate(`Add ${kind.label.toLowerCase()} field`, { pages: "all", structure: kindName === "radio" || kindName === "signature" }, () => {
      this.app.doc.createField(page, kindName, rect, name, { options: options, onValue: onValue });
      // Radio and signature fields get a patch applied to the bytes of the next save (see za).
      if (kindName === "radio" || kindName === "signature") this.app.patchNextCommit(nameRadioStates);
    }).catch((err) => toast(err.message, "err"));
  }
  /** Rename (and for dropdowns/lists, edit the options of) a field, or delete it. */
  async editDialog(page: number, field: FieldInfo): Promise<void> {
    const nameInput = h("input", { class: "tinput", id: "ff-name", value: field.name, autocomplete: "off" }) as HTMLInputElement, rows: HTMLElement[] = [h("label", { class: "stack-field" }, h("span", { class: "rlabel", text: field.type === FIELD.RADIO ? "Group name" : "Field name" }), nameInput)];
    let optionsInput: HTMLTextAreaElement | null = null;
    if (field.type === FIELD.COMBO || field.type === FIELD.LIST) {
      optionsInput = h("textarea", { class: "tinput ff-opts", rows: 5 }) as HTMLTextAreaElement;
      optionsInput.value = field.options.map((o) => o.label).join(`
`);
      rows.push(h("label", { class: "stack-field" }, h("span", { class: "rlabel", text: "Options, one per line" }), optionsInput));
    }
    rows.push(h("p", { class: "modal-text", text: "Move or resize fields with Move & resize (A). Fill them in with Select (V)." }));
    const choice = await modal({ title: `Edit ${(FIELD_TYPE_LABELS[field.type] || "field").toLowerCase()}`, body: h("div", { class: "stack" }, ...rows), actions: [{ id: "delete", label: "Delete field", danger: true }, { id: "cancel", label: "Cancel" }, { id: "ok", label: "Save", primary: true }] }), doc = this.app.doc;
    if (choice === "delete") {
      await this.app.mutate("Delete field", { pages: [page] }, () => doc.deleteAnnot(page, field.index)).catch((err) => toast(err.message, "err"));
      return;
    }
    if (choice !== "ok") return;
    const name = nameInput.value.trim(), options = optionsInput ? optionsInput.value.split(`
`).map((s) => s.trim()).filter(Boolean) : null, renamed = name && name !== field.name, optionsChanged = options && options.join(`
`) !== field.options.map((o) => o.label).join(`
`);
    if (renamed || optionsChanged) {
      if (renamed && field.type !== FIELD.RADIO && this.allFields().some((f) => f.name === name)) {
        toast(`A field named “${name}” already exists`, "warn");
        return;
      }
      await this.app.mutate("Edit field", { pages: [page] }, () => {
        if (renamed && !doc.setFieldName(page, field.index, name)) throw new Error("Could not rename the field");
        if (optionsChanged) doc.setFieldOptions(page, field.index, options);
      }).catch((err) => toast(err.message, "err"));
    }
  }
}

export { Forms, FIELD_KINDS };
