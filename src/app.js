import { Yt } from './engine/growable';
import { Bi, Ha, Ni, wo } from './engine/pdfium';
import { xl } from './ui/headerfooter';
import { ds } from './ui/watermark';

const Bl = 100;
const Nl = /^(Add note|Highlight|Underline|Strikeout|Draw|Rectangle|Ellipse|Line|Arrow|Move annotation|Delete annotation|Edit comment|Reply|Edit reply|Delete reply|Change color|Callout|Text box|Edit text box|Delete text box|Stamp|Place signature|Sign field|Edit line|Fill field|Toggle checkbox|Choose option)$/;
const $l = /^(Fill field|Toggle checkbox|Choose option|Sign field)$/;
const Ul = 512 * 1024 * 1024;
const yr = 600 * 1024 * 1024;
const zl = (u, n) => {
  try {
    const t = localStorage.getItem("margin." + u);
    return t ? JSON.parse(t) : n;
  } catch {
    return n;
  }
};
const Hl = (u, n) => {
  try {
    localStorage.setItem("margin." + u, JSON.stringify(n));
  } catch {
  }
};
const Wl = { author: "Me", markupColor: [246, 214, 74, 255], lineMarkupColor: [214, 69, 52, 255], inkColor: [214, 69, 52, 255], inkWidth: 2, shapeColor: [37, 99, 235, 255], shapeWidth: 1.5, shapeFill: null, shapeOpacity: 1, lineColor: [214, 69, 52, 255], lineWidth: 2, lineEnds: "arrow", ftSize: 12, ftColor: [24, 26, 33, 255], ftFill: [255, 255, 255, 255], ftBorder: [214, 69, 52, 255], ftCallout: false, stamp: "approved", stampCustom: "", stampColor: [37, 99, 235, 255], stampDated: true, redactMode: "text", formKind: "text", formLastGroup: "", redactFill: [0, 0, 0, 255], noteColor: [246, 214, 74, 255], textColor: [24, 26, 33, 255], textFont: "sarabun", textSize: 14, textStyle: "", textAlign: "left", textLh: 1.5, hf: xl, wm: ds };
class Vl {
  lib;
  doc;
  fileName = "document.pdf";
  dirty = false;
  tool = "select";
  undoStack = [];
  redoStack = [];
  file;
  cur = 0;
  index = null;
  password = "";
  ownerPassword = "";
  rewriteNext = false;
  busy = false;
  pendingPatch = null;
  mustRewrite = false;
  listeners = [];
  toolListeners = [];
  settings = { ...Wl, ...zl("settings", {}) };
  saveSettings() {
    Hl("settings", this.settings);
  }
  selectedAnnot = null;
  selectedPages = /* @__PURE__ */ new Set();
  currentPage = 0;
  constructor(n) {
    this.lib = n;
  }
  open(n, t, e = "") {
    const r = n instanceof Yt ? n : Yt.from(n), o = this.lib.open(r.view(), e);
    this.doc && this.doc.close(), this.doc = o, this.file = r, this.cur = r.len, this.index = null, this.password = e, this.ownerPassword = "", this.mustRewrite = false, this.fileName = t, this.dirty = false, this.undoStack = [], this.redoStack = [], this.selectedAnnot = null, this.selectedPages.clear(), this.currentPage = 0, this.emit({ pages: "all", structure: true });
  }
  on(n) {
    this.listeners.push(n);
  }
  onTool(n) {
    this.toolListeners.push(n);
  }
  emit(n) {
    for (const t of this.listeners) t(n);
  }
  setTool(n) {
    this.tool = n, this.selectedAnnot = null;
    for (const t of this.toolListeners) t(n);
  }
  commit() {
    const n = this.doc, t = this.rewriteNext ? null : n.saveDelta(this.cur);
    if (!t) {
      this.rewriteNext = false, this.file = Yt.from(n.save()), this.cur = this.file.len, this.index = null, n.swap(this.file.view(), this.password, void 0, this.ownerPassword);
      return;
    }
    const e = this.file.view(this.cur);
    this.index ??= Bi(e);
    const r = /* @__PURE__ */ new Map();
    let o = Ni(e, t, this.index, r);
    if (this.pendingPatch) {
      const a = this.pendingPatch;
      this.pendingPatch = null;
      const s = a(o);
      s.length === o.length && (o = s);
    }
    this.file.writeAt(this.cur, o), this.cur = this.file.len;
    for (const [a, s] of r) this.index.set(a, s);
    n.swap(this.file.view(this.cur), this.password, void 0, this.ownerPassword);
  }
  get limits() {
    const { encrypted: n, perms: t } = this.doc.security(), e = 1340;
    return { locked: n && (t & e) !== e, perms: t };
  }
  blocked(n) {
    const { locked: t, perms: e } = this.limits;
    return !t || e & 8 || e & 32 && Nl.test(n) || e & 256 && $l.test(n) ? null : "This PDF’s permissions don’t allow that change. Unlock it with its permissions password (the lock button) to edit it.";
  }
  unlock(n) {
    return this.doc.unlockOwner(n) ? (this.ownerPassword = n, this.emit({ pages: [] }), true) : false;
  }
  async protect(n, t, e) {
    if (this.cur > yr) throw new Error("Files over 600 MB can’t be protected here: encrypting rewrites the whole file, which needs more memory than a browser tab has.");
    await this.mutate("Protect document", { pages: [] }, () => {
      if (!this.doc.setProtection(n, t, e)) throw new Error("The document could not be encrypted");
      this.password = n, this.ownerPassword = t, this.rewriteNext = true;
    });
  }
  async unprotect() {
    if (this.cur > yr) throw new Error("Protection can’t be removed from files over 600 MB here: decrypting rewrites the whole file, which needs more memory than a browser tab has.");
    await this.mutate("Remove protection", { pages: [] }, () => {
      if (!this.doc.removeProtection()) throw new Error("The protection could not be removed");
      this.password = "", this.ownerPassword = "", this.rewriteNext = true;
    });
  }
  get fileSize() {
    return this.cur;
  }
  patchNextCommit(n) {
    this.pendingPatch = n;
  }
  exportBytes() {
    if (this.cur <= yr) return this.doc.save();
    if (this.mustRewrite) throw new Error("This file is too large to save with redactions applied: the redacted content can only be removed by rewriting the whole file, which needs more memory than a browser tab has. Extract the pages you need first, then redact them.");
    return this.file.view(this.cur);
  }
  restore(n) {
    (n.file !== this.file || n.len !== this.cur) && (this.index = null), this.file = n.file, this.cur = n.len, n.pw != null && (this.password = n.pw, this.ownerPassword = n.owner ?? ""), this.doc.swap(this.file.view(this.cur), this.password, void 0, this.ownerPassword), this.selectedAnnot = null;
    const t = this.doc.pageCount;
    this.selectedPages = new Set([...this.selectedPages].filter((e) => e < t)), this.currentPage >= t && (this.currentPage = Math.max(0, t - 1));
  }
  relieveMemory(n) {
    const t = this.doc, e = t.pageCount;
    !e || t.depth || this.busy || n != null && t.loaded.has(n) || t.loaded.size * (this.cur / e) < Ul || t.swap(this.file.view(this.cur), this.password, void 0, this.ownerPassword);
  }
  trimHistory() {
    for (; this.undoStack.length > Bl; ) this.undoStack.shift();
    const n = () => {
      const t = /* @__PURE__ */ new Set();
      for (const r of [...this.undoStack, ...this.redoStack]) r.file !== this.file && t.add(r.file);
      let e = 0;
      for (const r of t) e += r.len;
      return e;
    };
    for (; this.undoStack.length && this.undoStack[0].file !== this.file && n() > 512 * 1024 * 1024; ) this.undoStack.shift();
  }
  async mutate(n, t, e) {
    const r = this.blocked(n);
    if (r) throw new Error(r);
    const o = { label: n, file: this.file, len: this.cur, change: t, pw: this.password, owner: this.ownerPassword };
    this.doc.loaded.size > 2 && !this.doc.depth && this.doc.swap(this.file.view(this.cur), this.password, void 0, this.ownerPassword), this.busy = true;
    try {
      try {
        await e(), this.commit();
      } catch (a) {
        if (this.pendingPatch = null, this.rewriteNext = false, wo(a)) throw new Error(Ha);
        try {
          this.restore(o);
        } catch {
        }
        throw a;
      }
    } finally {
      this.busy = false;
    }
    this.undoStack.push(o), this.redoStack = [], this.trimHistory(), this.dirty = true, this.emit(t);
  }
  get canUndo() {
    return this.undoStack.length > 0;
  }
  get canRedo() {
    return this.redoStack.length > 0;
  }
  get undoLabel() {
    return this.undoStack.at(-1)?.label;
  }
  get redoLabel() {
    return this.redoStack.at(-1)?.label;
  }
  undo() {
    const n = this.undoStack.pop();
    return n ? (this.redoStack.push({ label: n.label, file: this.file, len: this.cur, change: n.change, pw: this.password, owner: this.ownerPassword }), this.step(n), n.label) : null;
  }
  redo() {
    const n = this.redoStack.pop();
    return n ? (this.undoStack.push({ label: n.label, file: this.file, len: this.cur, change: n.change, pw: this.password, owner: this.ownerPassword }), this.step(n), n.label) : null;
  }
  step(n) {
    const t = this.doc.pageCount;
    this.restore(n), this.dirty = true;
    const e = n.change;
    this.emit(this.doc.pageCount !== t || e.structure || e.pages === "all" ? { pages: "all", structure: e.structure || this.doc.pageCount !== t } : { pages: [...e.pages] });
  }
  replaceDoc(n) {
    this.restore({ file: Yt.from(n), len: n.length });
  }
  get editedName() {
    return this.fileName.replace(/\.pdf$/i, "") + "_edited.pdf";
  }
}

export { Vl, yr };
