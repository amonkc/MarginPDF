import { ye, za } from '../engine/pdfium';
import { H, nt, pt, y } from './dom';

const kr = [{ kind: "text", label: "Text", w: 180, h: 22, base: "Text" }, { kind: "multiline", label: "Multi-line", w: 240, h: 64, base: "Notes" }, { kind: "checkbox", label: "Checkbox", w: 14, h: 14, base: "Check" }, { kind: "radio", label: "Radio", w: 14, h: 14, base: "Choice" }, { kind: "dropdown", label: "Dropdown", w: 160, h: 22, base: "Dropdown" }, { kind: "list", label: "List", w: 160, h: 64, base: "List" }, { kind: "signature", label: "Signature", w: 180, h: 44, base: "Signature" }];
const Na = { [ye.TEXT]: "Text field", [ye.CHECKBOX]: "Checkbox", [ye.RADIO]: "Radio button", [ye.COMBO]: "Dropdown", [ye.LIST]: "List box", [ye.PUSHBUTTON]: "Button", [ye.SIGNATURE]: "Signature field" };
const fu = (u, n) => u.normalize("NFKD").replace(/[^\x20-\x7e]/g, "").replace(/[^A-Za-z0-9 _.-]/g, "").trim().replace(/\s+/g, "_") || n;
class _u {
  app;
  v;
  constructor(n, t) {
    this.app = n, this.v = t;
  }
  allFields() {
    const n = [];
    for (let t = 0; t < this.app.doc.pageCount; t++) for (const e of this.app.doc.fields(t)) n.push({ ...e, page: t });
    return n;
  }
  uniqueName(n) {
    const t = new Set(this.allFields().map((r) => r.name));
    let e = 1;
    for (; t.has(n + e); ) e++;
    return n + e;
  }
  overlay(n) {
    for (const t of this.v.fieldsOf(n)) {
      const e = n.tf.box(t.rect);
      n.ov.append(y("div", { class: "fbox", "data-field": String(t.index), title: `${Na[t.type] || "Field"} “${t.name}” — click to edit`, style: { left: e.x + "px", top: e.y + "px", width: e.w + "px", height: e.h + "px" } }, y("span", { class: "fname-tag", text: t.name })));
    }
  }
  down(n, t, e) {
    const r = n.target.closest(".fbox");
    if (r) {
      n.preventDefault();
      const i = this.v.fieldsOf(t).find((l) => l.index === +r.dataset.field);
      i && this.editDialog(t.index, i);
      return;
    }
    const o = kr.find((i) => i.kind === this.app.settings.formKind) || kr[0], a = this.v.toPage(t, n), s = (i) => {
      if (Math.abs(i.x - a.x) < 6 && Math.abs(i.y - a.y) < 6) return { l: a.x, r: a.x + o.w, t: a.y, b: a.y - o.h };
      if (o.kind === "checkbox" || o.kind === "radio") {
        const l = Math.max(Math.abs(i.x - a.x), Math.abs(i.y - a.y));
        return { l: Math.min(a.x, a.x + Math.sign(i.x - a.x) * l), r: Math.max(a.x, a.x + Math.sign(i.x - a.x) * l), b: Math.min(a.y, a.y + Math.sign(i.y - a.y) * l), t: Math.max(a.y, a.y + Math.sign(i.y - a.y) * l) };
      }
      return { l: Math.min(a.x, i.x), r: Math.max(a.x, i.x), b: Math.min(a.y, i.y), t: Math.max(a.y, i.y) };
    };
    e(n, t, (i) => {
      const l = t.tf.box(s(i));
      t.svg.replaceChildren(pt("rect", { x: l.x, y: l.y, width: l.w, height: l.h, fill: "rgba(90,162,255,.12)", stroke: "var(--sel)", "stroke-dasharray": "4 3" }));
    }, (i) => {
      const l = s(i);
      l.r - l.l < 6 || l.t - l.b < 6 || this.newDialog(t.index, o.kind, l);
    });
  }
  async newDialog(n, t, e) {
    const r = kr.find((D) => D.kind === t), o = [...new Set(this.allFields().filter((D) => D.type === ye.RADIO).map((D) => D.name))], a = this.app.settings.formLastGroup && o.includes(this.app.settings.formLastGroup) ? this.app.settings.formLastGroup : "", s = y("input", { class: "tinput", id: "ff-name", value: t === "radio" ? a || this.uniqueName("Group") : this.uniqueName(r.base), autocomplete: "off", list: "ff-groups" }), i = [y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: t === "radio" ? "Group (buttons with the same group name: only one can be chosen)" : "Field name" }), s)];
    t === "radio" && i.push(y("datalist", { id: "ff-groups" }, ...o.map((D) => y("option", { value: D }))));
    let l = null, h = null;
    if (t === "radio") {
      const D = this.allFields().filter((x) => x.type === ye.RADIO && x.name === s.value).length;
      l = y("input", { class: "tinput", id: "ff-value", value: `Choice${D + 1}`, autocomplete: "off" }), i.push(y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: "This button’s value (letters and digits)" }), l));
    }
    if ((t === "dropdown" || t === "list") && (h = y("textarea", { class: "tinput ff-opts", id: "ff-opts", rows: 5, placeholder: "One option per line" }), h.value = `Option 1
Option 2
Option 3`, i.push(y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: "Options, one per line" }), h))), await nt({ title: `New ${r.label.toLowerCase()} field`, body: y("div", { class: "stack" }, ...i), actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Add field", primary: true }] }) !== "ok") return;
    const _ = s.value.trim() || this.uniqueName(r.base);
    if (t !== "radio" && this.allFields().some((D) => D.name === _)) {
      H(`A field named “${_}” already exists`, "warn");
      return;
    }
    const p = h ? h.value.split(`
`).map((D) => D.trim()).filter(Boolean) : void 0;
    if (h && !p.length) {
      H("Add at least one option", "warn");
      return;
    }
    const P = l ? fu(l.value, "Choice") : void 0;
    t === "radio" && (this.app.settings.formLastGroup = _, this.app.saveSettings()), await this.app.mutate(`Add ${r.label.toLowerCase()} field`, { pages: "all", structure: t === "radio" || t === "signature" }, () => {
      this.app.doc.createField(n, t, e, _, { options: p, onValue: P }), (t === "radio" || t === "signature") && this.app.patchNextCommit(za);
    }).catch((D) => H(D.message, "err"));
  }
  async editDialog(n, t) {
    const e = y("input", { class: "tinput", id: "ff-name", value: t.name, autocomplete: "off" }), r = [y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: t.type === ye.RADIO ? "Group name" : "Field name" }), e)];
    let o = null;
    (t.type === ye.COMBO || t.type === ye.LIST) && (o = y("textarea", { class: "tinput ff-opts", rows: 5 }), o.value = t.options.map((_) => _.label).join(`
`), r.push(y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: "Options, one per line" }), o))), r.push(y("p", { class: "modal-text", text: "Move or resize fields with Move & resize (A). Fill them in with Select (V)." }));
    const a = await nt({ title: `Edit ${(Na[t.type] || "field").toLowerCase()}`, body: y("div", { class: "stack" }, ...r), actions: [{ id: "delete", label: "Delete field", danger: true }, { id: "cancel", label: "Cancel" }, { id: "ok", label: "Save", primary: true }] }), s = this.app.doc;
    if (a === "delete") {
      await this.app.mutate("Delete field", { pages: [n] }, () => s.deleteAnnot(n, t.index)).catch((_) => H(_.message, "err"));
      return;
    }
    if (a !== "ok") return;
    const i = e.value.trim(), l = o ? o.value.split(`
`).map((_) => _.trim()).filter(Boolean) : null, h = i && i !== t.name, m = l && l.join(`
`) !== t.options.map((_) => _.label).join(`
`);
    if (!(!h && !m)) {
      if (h && t.type !== ye.RADIO && this.allFields().some((_) => _.name === i)) {
        H(`A field named “${i}” already exists`, "warn");
        return;
      }
      await this.app.mutate("Edit field", { pages: [n] }, () => {
        if (h && !s.setFieldName(n, t.index, i)) throw new Error("Could not rename the field");
        m && s.setFieldOptions(n, t.index, l);
      }).catch((_) => H(_.message, "err"));
    }
  }
}

export { _u, kr };
