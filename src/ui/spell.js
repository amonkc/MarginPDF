import { Cr } from '../engine/assets';
import { Jt } from '../engine/pdfium';
import { H, Ve, y } from './dom';
import { Cs } from './replace';
import { default as Zc } from 'nspell';

let br = null;
const Ms = "margin.spell.words";
const Gs = () => {
  try {
    return JSON.parse(localStorage.getItem(Ms) || "[]");
  } catch {
    return [];
  }
};
function ja() {
  return br ??= Promise.all([Cr("dict/en.aff"), Cr("dict/en.dic")]).then(([u, n]) => {
    const t = new TextDecoder(), e = Zc({ aff: t.decode(u), dic: t.decode(n) });
    for (const r of Gs()) e.add(r);
    return e;
  }), br.catch(() => {
    br = null;
  }), br;
}
class Lr {
  app;
  v;
  el = null;
  issues = [];
  at = 0;
  ignored = /* @__PURE__ */ new Set();
  busy = false;
  constructor(n, t) {
    this.app = n, this.v = t;
  }
  static candidate(n) {
    return n.length > 1 && (n.match(/[A-Z\u00C0-\u00DE]/g)?.length ?? 0) < 2 && !/[a-z].*[A-Z]/.test(n);
  }
  async open() {
    this.el || this.build(), this.el.hidden = false, this.status("Loading the English dictionary…"), this.render();
    let n;
    try {
      n = await ja(), this.sync = n;
    } catch (o) {
      this.status("The dictionary couldn’t be loaded: " + o.message);
      return;
    }
    this.busy = true, this.issues = [], this.at = 0;
    const t = /* @__PURE__ */ new Map(), e = (o) => {
      const a = o.replace(/’/g, "'");
      let s = t.get(a);
      return s == null && (s = !(n.correct(a) || n.correct(a.toLowerCase())), t.set(a, s)), s;
    }, r = this.app.doc.pageCount;
    for (let o = 0; o < r; o++) {
      if (!this.el || this.el.hidden) {
        this.busy = false;
        return;
      }
      this.status(`Checking page ${o + 1} of ${r}…`), o % 4 === 0 && await new Promise((a) => setTimeout(a, 0)), this.app.relieveMemory(o);
      try {
        for (const a of this.app.doc.pageWords(o, Lr.candidate)) !this.ignored.has(a.word.toLowerCase()) && e(a.word) && this.issues.push({ page: o, ...a });
      } catch {
      }
    }
    this.busy = false, this.render();
  }
  close() {
    this.el && (this.el.hidden = true), this.v.setHits([], -1);
  }
  build() {
    this.el = y("section", { class: "spell-panel", role: "dialog", "aria-label": "Spelling", hidden: true }), document.body.append(this.el), document.addEventListener("keydown", (n) => {
      if (n.key !== "Escape" || !this.el || this.el.hidden || document.querySelector(".modal, .ctxmenu")) return;
      const t = n.target;
      t.closest?.("input,textarea,[contenteditable]") && !this.el.contains(t) || (n.stopPropagation(), this.close());
    }, true);
  }
  status(n) {
    const t = this.el?.querySelector(".sp-status");
    t ? t.textContent = n : this.render(n);
  }
  render(n) {
    const t = this.el, e = this.issues[this.at], r = y("div", { class: "sp-head" }, y("h2", { text: "Spelling" }), y("span", { class: "hint", text: "English" }), y("button", { class: "iconbtn small", type: "button", "aria-label": "Close", title: "Close (Esc)", onclick: () => this.close() }, Ve("close"))), o = y("p", { class: "sp-status", text: n ?? (this.busy ? "" : this.issues.length ? `${this.at + 1} of ${this.issues.length} possible misspelling${this.issues.length === 1 ? "" : "s"}` : "No spelling problems found.") });
    if (t.replaceChildren(r, o), !e || this.busy) {
      this.v.setHits([], -1);
      return;
    }
    const a = y("p", { class: "sp-context" }), s = e.context.indexOf(e.word);
    s >= 0 ? a.append(e.context.slice(0, s), y("mark", { text: e.word }), e.context.slice(s + e.word.length)) : a.textContent = e.context;
    const i = this.suggest(e.word);
    t.append(y("div", { class: "sp-word" }, y("b", { text: e.word }), y("span", { class: "hint", text: ` page ${e.page + 1}` })), a, y("div", { class: "sp-sugg" }, ...i.length ? i.map((l) => y("button", { class: "chip", type: "button", title: `Replace with “${l}”`, onclick: () => this.replace(e, l) }, l)) : [y("span", { class: "hint", text: "No suggestions" })]), y("div", { class: "sp-actions" }, y("button", { class: "btn ghost small", type: "button", onclick: () => this.skip() }, "Ignore"), y("button", { class: "btn ghost small", type: "button", onclick: () => this.ignoreAll(e.word) }, "Ignore all"), y("button", { class: "btn ghost small", type: "button", onclick: () => this.learn(e.word) }, "Add to dictionary"), y("span", { class: "sp-nav" }, y("button", { class: "iconbtn small", type: "button", "aria-label": "Previous", title: "Previous", disabled: this.at === 0, onclick: () => {
      this.at--, this.render();
    } }, Ve("up")), y("button", { class: "iconbtn small", type: "button", "aria-label": "Next", title: "Next", disabled: this.at >= this.issues.length - 1, onclick: () => {
      this.at++, this.render();
    } }, Ve("down"))))), this.v.setHits([{ page: e.page, rects: e.rects }], 0), e.rects[0] && this.v.scrollToPage(e.page, e.rects[0]);
  }
  suggestCache = /* @__PURE__ */ new Map();
  suggest(n) {
    let t = this.suggestCache.get(n);
    if (t) return t;
    const e = this.sync;
    if (!e) return [];
    const r = /^[A-Z]/.test(n), o = n.toLowerCase(), a = (l) => r ? l[0].toUpperCase() + l.slice(1) : l, s = /* @__PURE__ */ new Set();
    for (let l = 0; l + 1 < o.length; l++) {
      const h = o.slice(0, l) + o[l + 1] + o[l] + o.slice(l + 2);
      e.correct(h) && s.add(a(h));
    }
    for (const l of [...e.suggest(o), ...r ? e.suggest(n) : []]) s.add(/^[A-Z]{2,}/.test(l) ? l : a(l));
    s.delete(n);
    const i = (l, h) => {
      l = l.toLowerCase(), h = h.toLowerCase();
      const m = [];
      for (let _ = 0; _ <= l.length; _++) {
        m[_] = [_];
        for (let p = 1; p <= h.length; p++) m[_][p] = _ ? 0 : p;
      }
      for (let _ = 1; _ <= l.length; _++) for (let p = 1; p <= h.length; p++) m[_][p] = Math.min(m[_ - 1][p] + 1, m[_][p - 1] + 1, m[_ - 1][p - 1] + (l[_ - 1] === h[p - 1] ? 0 : 1)), _ > 1 && p > 1 && l[_ - 1] === h[p - 2] && l[_ - 2] === h[p - 1] && (m[_][p] = Math.min(m[_][p], m[_ - 2][p - 2] + 1));
      return m[l.length][h.length];
    };
    return t = [...s].map((l, h) => ({ x: l, k: h, d: i(n, l) })).sort((l, h) => l.d - h.d || l.k - h.k).map((l) => l.x).slice(0, 5), this.suggestCache.set(n, t), t;
  }
  sync = null;
  skip() {
    this.issues.splice(this.at, 1), this.at >= this.issues.length && (this.at = Math.max(0, this.issues.length - 1)), this.render();
  }
  ignoreAll(n) {
    const t = n.toLowerCase();
    this.ignored.add(t), this.issues = this.issues.filter((e) => e.word.toLowerCase() !== t), this.at >= this.issues.length && (this.at = Math.max(0, this.issues.length - 1)), this.render();
  }
  learn(n) {
    try {
      const t = Gs();
      t.includes(n) || (t.push(n), localStorage.setItem(Ms, JSON.stringify(t)));
    } catch {
    }
    this.sync?.add(n), this.ignoreAll(n), H(`Added “${n}” to your dictionary (this browser)`);
  }
  async replace(n, t) {
    if (!await Cs(this.app, n.page, Jt(n.rects), n.word, t, { matchCase: true, wholeWord: true }).catch((h) => (H(h.message, "err"), false))) return H(`“${n.word}” couldn’t be replaced here (it may be part of an image or a locked text block)`, "warn", 5e3);
    const r = await ja(), o = this.app.doc.pageWords(n.page, Lr.candidate).filter((h) => !this.ignored.has(h.word.toLowerCase()) && !(r.correct(h.word) || r.correct(h.word.toLowerCase()))), a = this.issues.filter((h) => h.page !== n.page), s = a.filter((h) => h.page < n.page).length, i = n.rects[0], l = i ? o.filter((h) => h.rects[0] && (h.rects[0].t > i.t + 1 || Math.abs(h.rects[0].t - i.t) <= 1 && h.rects[0].l < i.l)).length : 0;
    this.issues = [...a.slice(0, s), ...o.map((h) => ({ page: n.page, ...h })), ...a.slice(s)], this.at = Math.min(s + l, Math.max(0, this.issues.length - 1)), this.render();
  }
}

export { Lr };
