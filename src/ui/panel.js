import { Zn } from '../engine/pdfium';
import { H, Ve, y } from './dom';

const $a = (u) => {
  const n = /^D:(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?/.exec(u || "");
  return n ? new Date(+n[1], +n[2] - 1, +n[3], +(n[4] || 0), +(n[5] || 0)).toLocaleString(void 0, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
};
const pu = (u) => u ? `rgb(${u[0]},${u[1]},${u[2]})` : "transparent";
class Fu {
  onEditFreeText = null;
  el;
  app;
  list;
  count;
  onGo = () => {
  };
  cache = [];
  replying = /* @__PURE__ */ new Set();
  constructor(n, t) {
    this.el = n, this.app = t, this.count = y("span", { class: "count" }), this.list = y("div", { class: "clist" }), n.append(y("div", { class: "panel-head" }, y("h2", { text: "Comments" }), this.count), this.list);
  }
  perPage = [];
  known = false;
  readPage(n) {
    this.app.relieveMemory(n);
    const t = this.app.doc.annots(n), e = (o) => {
      let a = o;
      for (let s = 0; a.irt != null && s < 20; s++) {
        const i = t.find((l) => l.index === a.irt);
        if (!i) break;
        a = i;
      }
      return a;
    }, r = [];
    for (const o of t) o.irt == null && Zn[o.subtype] && r.push({ page: n, a: o, replies: t.filter((a) => a.irt != null && e(a) === o).sort((a, s) => a.modified < s.modified ? -1 : 1) });
    this.perPage[n] = r;
  }
  refresh(n) {
    const t = this.app.doc, e = t.pageCount;
    if (!this.known || n && (n.pages === "all" || n.structure) || this.perPage.length !== e) {
      this.perPage = [];
      for (let o = 0; o < e; o++) this.readPage(o);
      this.known = true;
    } else if (n && Array.isArray(n.pages)) for (const o of n.pages) o >= 0 && o < e && this.readPage(o);
    if (this.cache = this.perPage.flat(), this.count.textContent = String(this.cache.length), this.list.replaceChildren(), !this.cache.length) {
      this.list.append(y("div", { class: "empty-note" }, y("p", { text: "No comments yet." }), y("p", { class: "hint", text: "Highlights, notes, drawings and shapes you add appear here, ready to reply to or edit." })));
      return;
    }
    let r = -1;
    for (const { page: o, a, replies: s } of this.cache) {
      o !== r && (this.list.append(y("div", { class: "cpage", text: `Page ${o + 1}` })), r = o);
      const i = this.app.selectedAnnot?.page === o && this.app.selectedAnnot.index === a.index, l = y("textarea", { class: "ctext", rows: 2, placeholder: "Add a comment", "aria-label": `Comment on ${Zn[a.subtype]}, page ${o + 1}` });
      l.value = a.contents;
      const h = () => {
        l.style.height = "auto", l.style.height = Math.min(220, l.scrollHeight + 2) + "px";
      };
      l.addEventListener("input", h), requestAnimationFrame(h), l.addEventListener("change", () => {
        if (a.subtype === 3 && this.onEditFreeText) {
          this.onEditFreeText(o, a.index, l.value);
          return;
        }
        this.app.mutate("Edit comment", { pages: [o] }, () => this.app.doc.setAnnotContents(o, a.index, l.value)).catch((w) => H(w.message, "err"));
      }), l.addEventListener("keydown", (w) => w.stopPropagation());
      const m = y("button", { class: "iconbtn small", type: "button", title: "Delete", "aria-label": "Delete annotation", onclick: (w) => {
        w.stopPropagation(), this.app.mutate("Delete annotation", { pages: [o] }, () => this.app.doc.deleteAnnot(o, a.index)).catch((k) => H(k.message, "err"));
      } }, Ve("trash")), _ = y("div", { class: "ccard" + (i ? " sel" : ""), "data-key": `${o}:${a.index}` }, y("div", { class: "chead", onclick: () => this.onGo(o, a) }, y("span", { class: "cdot", style: { background: pu(a.color) } }), y("span", { class: "ctype", text: a.subtype === 13 && a.contents === "Signature" ? "Signature" : Zn[a.subtype] }), y("span", { class: "cmeta", text: [a.author, $a(a.modified)].filter(Boolean).join(" · ") }), m), l);
      for (const w of s) {
        const k = y("textarea", { class: "ctext reply", rows: 1, "aria-label": `Reply by ${w.author}` });
        k.value = w.contents;
        const G = () => {
          k.style.height = "auto", k.style.height = Math.min(200, k.scrollHeight + 2) + "px";
        };
        k.addEventListener("input", G), requestAnimationFrame(G), k.addEventListener("keydown", (E) => E.stopPropagation()), k.addEventListener("change", () => this.app.mutate("Edit reply", { pages: [o] }, () => this.app.doc.setAnnotContents(o, w.index, k.value)).catch((E) => H(E.message, "err"))), _.append(y("div", { class: "creply" }, y("div", { class: "chead" }, y("span", { class: "ctype small", text: w.author || "Reply" }), y("span", { class: "cmeta", text: $a(w.modified) }), y("button", { class: "iconbtn small", type: "button", title: "Delete reply", "aria-label": "Delete reply", onclick: () => this.app.mutate("Delete reply", { pages: [o] }, () => this.app.doc.deleteAnnot(o, w.index)).catch((E) => H(E.message, "err")) }, Ve("trash"))), k));
      }
      const p = `${o}:${a.index}`, P = y("textarea", { class: "ctext", rows: 2, placeholder: "Write a reply", "aria-label": "Reply" });
      P.addEventListener("keydown", (w) => {
        w.stopPropagation(), w.key === "Enter" && (w.metaKey || w.ctrlKey) && D(), w.key === "Escape" && (this.replying.delete(p), this.refresh());
      });
      const D = () => {
        const w = P.value.trim();
        w && (this.replying.delete(p), this.app.mutate("Reply", { pages: [o] }, () => this.app.doc.addReply(o, a.index, w, this.app.settings.author)).catch((k) => H(k.message, "err")));
      }, x = y("div", { class: "creply-form", hidden: !this.replying.has(p) }, P, y("div", { class: "creply-actions" }, y("button", { class: "btn ghost small", type: "button", onclick: () => {
        this.replying.delete(p), x.hidden = true;
      } }, "Cancel"), y("button", { class: "btn primary small", type: "button", onclick: D }, "Reply"))), A = y("button", { class: "clink", type: "button", hidden: this.replying.has(p), onclick: () => {
        this.replying.add(p), x.hidden = false, A.hidden = true, P.focus();
      } }, s.length ? `Reply (${s.length} so far)` : "Reply");
      _.append(x, A), this.list.append(_);
    }
  }
  focus(n, t) {
    const e = this.list.querySelector(`[data-key="${n}:${t}"]`);
    e && (this.list.querySelectorAll(".ccard.sel").forEach((r) => r.classList.remove("sel")), e.classList.add("sel"), e.scrollIntoView({ block: "nearest", behavior: "smooth" }), e.querySelector("textarea").focus());
  }
  reply(n, t) {
    this.replying.add(`${n}:${t}`), this.refresh();
    const e = this.list.querySelector(`[data-key="${n}:${t}"]`);
    e && (e.scrollIntoView({ block: "nearest" }), e.querySelector(".creply-form textarea")?.focus());
  }
  markSelected() {
    const n = this.app.selectedAnnot;
    this.list.querySelectorAll(".ccard").forEach((t) => t.classList.toggle("sel", !!n && t.dataset.key === `${n.page}:${n.index}`));
  }
}

export { Fu };
