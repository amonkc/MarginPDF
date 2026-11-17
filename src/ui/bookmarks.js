import { pn } from './ctxmenu';
import { H, Ve, y } from './dom';

const _t = (u) => u.join(".");
class Gc {
  el;
  app;
  v;
  tree;
  empty;
  items = [];
  open = /* @__PURE__ */ new Set();
  sel = null;
  onCount = () => {
  };
  constructor(n, t) {
    this.app = n, this.v = t, this.tree = y("div", { class: "bm-tree", role: "tree", "aria-label": "Bookmarks" }), this.empty = y("div", { class: "empty-note" }, y("p", { text: "No bookmarks yet." }), y("p", { class: "hint", text: "Add one to mark the page you’re looking at. Bookmarks are saved in the PDF, so other readers see them too." }));
    const e = y("button", { class: "btn ghost small", type: "button", title: "Bookmark the current view", onclick: () => this.addHere() }, Ve("plus"), "Add bookmark");
    this.el = y("div", { class: "bm-pane" }, y("div", { class: "bm-actions" }, e), this.empty, this.tree), this.tree.addEventListener("keydown", (r) => this.key(r)), n.on(() => this.refresh());
  }
  refresh() {
    try {
      this.items = this.app.doc.outline();
    } catch {
      this.items = [];
    }
    const n = (e) => e.reduce((r, o) => r + 1 + n(o.children), 0);
    this.onCount(n(this.items)), this.empty.hidden = this.items.length > 0, this.tree.replaceChildren(...this.items.map((e) => this.row(e, 1)));
    const t = this.sel && this.tree.querySelector(`[data-path="${this.sel}"]`);
    t && t.classList.add("sel");
  }
  row(n, t) {
    const e = _t(n.path), r = this.open.has(e), o = n.children.length > 0, a = y("div", { class: "bm-row" + (this.sel === e ? " sel" : ""), role: "treeitem", tabindex: this.sel === e || !this.sel && e === "0" ? "0" : "-1", "data-path": e, "aria-level": String(t), ...o ? { "aria-expanded": String(r) } : {}, title: n.uri ? n.uri : n.page >= 0 ? `Page ${n.page + 1}` : "No target", style: { paddingLeft: 6 + (t - 1) * 14 + "px" } }, y("button", { class: "bm-twist" + (o ? "" : " none"), type: "button", tabindex: "-1", "aria-hidden": "true", text: o ? r ? "▾" : "▸" : "", onclick: (i) => {
      i.stopPropagation(), this.toggle(e);
    } }), y("span", { class: "bm-title", text: n.title || "Untitled" }), y("span", { class: "bm-page", text: n.page >= 0 ? String(n.page + 1) : n.uri ? "↗" : "" }));
    a.addEventListener("click", () => {
      this.select(e), this.go(n);
    }), a.addEventListener("dblclick", (i) => {
      i.preventDefault(), this.rename(n);
    }), a.addEventListener("contextmenu", (i) => {
      i.preventDefault(), this.select(e), this.menu(n, i.clientX, i.clientY, a);
    });
    const s = y("div", { class: "bm-node", role: "none" }, a);
    return o && r && s.append(y("div", { role: "group" }, ...n.children.map((i) => this.row(i, t + 1)))), s;
  }
  find(n, t = this.items) {
    for (const e of t) {
      if (_t(e.path) === n) return e;
      const r = this.find(n, e.children);
      if (r) return r;
    }
    return null;
  }
  siblings(n) {
    const t = n.path.length > 1 ? this.find(_t(n.path.slice(0, -1))) : null;
    return t ? t.children : this.items;
  }
  select(n) {
    this.sel = n, this.tree.querySelectorAll(".bm-row").forEach((t) => {
      const e = t.dataset.path === n;
      t.classList.toggle("sel", e), t.tabIndex = e ? 0 : -1;
    });
  }
  focus(n) {
    this.select(n), this.tree.querySelector(`[data-path="${n}"]`)?.focus();
  }
  toggle(n, t) {
    t ?? !this.open.has(n) ? this.open.add(n) : this.open.delete(n), this.refresh(), this.focus(n);
  }
  go(n) {
    if (n.uri) {
      try {
        window.open(n.uri, "_blank", "noopener");
      } catch {
        H(n.uri);
      }
      return;
    }
    if (n.page < 0 || n.page >= this.app.doc.pageCount) return H("This bookmark doesn’t point to a page", "warn");
    this.v.scrollToPoint(n.page, n.top);
  }
  async edit(n, t) {
    await this.app.mutate(n, { pages: [] }, t).catch((e) => H(e.message, "err"));
  }
  async addHere(n = false) {
    const { page: t, y: e } = this.v.viewTop(), r = this.sel ? this.find(this.sel) : null, o = r ? n ? r.path : r.path.slice(0, -1) : [], a = r ? n ? r.children.length : r.path[r.path.length - 1] + 1 : this.items.length, s = this.suggestTitle(t);
    await this.edit("Add bookmark", () => this.app.doc.addBookmark(o, a, s, t, e));
    const i = _t([...o, a]);
    n && r && this.open.add(_t(r.path)), this.refresh(), this.select(i);
    const l = this.find(i);
    l && this.rename(l);
  }
  suggestTitle(n) {
    try {
      const r = this.app.doc.textObjects(n).filter((o) => o.text.trim().length >= 3).reduce((o, a) => !o || a.fontSize > o.fontSize + 0.5 ? a : o, null)?.text.trim();
      if (r) return r.length > 60 ? r.slice(0, 59) + "…" : r;
    } catch {
    }
    return `Page ${n + 1}`;
  }
  rename(n) {
    const t = _t(n.path), e = this.tree.querySelector(`[data-path="${t}"]`);
    if (!e) return;
    const r = e.querySelector(".bm-title"), o = y("input", { class: "bm-edit", value: n.title, "aria-label": "Bookmark name" });
    r.replaceWith(o), o.focus(), o.select();
    let a = false;
    const s = async (i) => {
      if (a) return;
      a = true;
      const l = o.value.trim();
      i && l && l !== n.title ? await this.edit("Rename bookmark", () => this.app.doc.renameBookmark(n.path, l)) : this.refresh(), this.focus(t);
    };
    o.addEventListener("keydown", (i) => {
      i.stopPropagation(), i.key === "Enter" ? s(true) : i.key === "Escape" && s(false);
    }), o.addEventListener("blur", () => s(true)), o.addEventListener("click", (i) => i.stopPropagation());
  }
  moves(n) {
    const t = this.siblings(n), e = n.path[n.path.length - 1], r = n.path.slice(0, -1);
    return { up: e > 0 ? () => this.move(n, r, e - 1, _t([...r, e - 1])) : null, down: e < t.length - 1 ? () => this.move(n, r, e + 2, _t([...r, e + 1])) : null, indent: e > 0 ? () => {
      const o = t[e - 1];
      this.open.add(_t(o.path)), this.move(n, o.path, o.children.length, _t([...o.path, o.children.length]));
    } : null, outdent: r.length ? () => {
      const o = r.slice(0, -1), a = r[r.length - 1];
      this.move(n, o, a + 1, _t([...o, a + 1]));
    } : null };
  }
  async move(n, t, e, r) {
    const o = this.open.has(_t(n.path));
    this.open = new Set([...this.open].filter((a) => !a.startsWith(_t(n.path)))), await this.edit("Move bookmark", () => this.app.doc.moveBookmark(n.path, t, e)), o && (this.open.add(r), this.refresh()), this.focus(r);
  }
  async remove(n) {
    const t = (r) => r.reduce((o, a) => o + 1 + t(a.children), 0), e = t(n.children);
    await this.edit(e ? `Delete bookmark and ${e} under it` : "Delete bookmark", () => this.app.doc.deleteBookmark(n.path)), this.sel = null, this.refresh();
  }
  menu(n, t, e, r) {
    const o = this.moves(n), { locked: a, perms: s } = this.app.limits, i = !a || !!(s & 8), { page: l } = this.v.viewTop();
    pn(t, e, [{ heading: n.title.length > 32 ? n.title.slice(0, 31) + "…" : n.title || "Bookmark" }, { label: n.uri ? "Open link" : "Go to bookmark", run: () => this.go(n) }, { label: "Rename", shortcut: "F2", disabled: !i, run: () => this.rename(n) }, { label: `Point to the current view (page ${l + 1})`, disabled: !i, run: () => {
      const h = this.v.viewTop();
      this.edit("Change bookmark target", () => this.app.doc.retargetBookmark(n.path, h.page, h.y));
    } }, "sep", { label: "Add bookmark after", disabled: !i, run: () => this.addHere(false) }, { label: "Add bookmark inside", disabled: !i, run: () => this.addHere(true) }, "sep", { label: "Move up", shortcut: "Alt+↑", disabled: !i || !o.up, run: () => o.up?.() }, { label: "Move down", shortcut: "Alt+↓", disabled: !i || !o.down, run: () => o.down?.() }, { label: "Indent", shortcut: "Alt+→", disabled: !i || !o.indent, run: () => o.indent?.() }, { label: "Outdent", shortcut: "Alt+←", disabled: !i || !o.outdent, run: () => o.outdent?.() }, "sep", { label: n.children.length ? "Delete with its children" : "Delete", shortcut: "Del", danger: true, disabled: !i, run: () => this.remove(n) }], r);
  }
  key(n) {
    const t = n.target.closest(".bm-row");
    if (!t || n.target.tagName === "INPUT") return;
    const e = t.dataset.path, r = this.find(e);
    if (!r) return;
    const o = [...this.tree.querySelectorAll(".bm-row")], a = o.indexOf(t), s = this.moves(r), i = () => {
      n.preventDefault(), n.stopPropagation();
    };
    if (n.altKey && n.key === "ArrowUp") i(), s.up?.();
    else if (n.altKey && n.key === "ArrowDown") i(), s.down?.();
    else if (n.altKey && n.key === "ArrowRight") i(), s.indent?.();
    else if (n.altKey && n.key === "ArrowLeft") i(), s.outdent?.();
    else if (n.key === "ArrowDown") i(), o[a + 1] && this.focus(o[a + 1].dataset.path);
    else if (n.key === "ArrowUp") i(), o[a - 1] && this.focus(o[a - 1].dataset.path);
    else if (n.key === "ArrowRight") i(), r.children.length && !this.open.has(e) ? this.toggle(e, true) : r.children.length && this.focus(_t(r.children[0].path));
    else if (n.key === "ArrowLeft") i(), this.open.has(e) ? this.toggle(e, false) : r.path.length > 1 && this.focus(_t(r.path.slice(0, -1)));
    else if (n.key === "Enter") i(), this.go(r);
    else if (n.key === "F2") i(), this.rename(r);
    else if (n.key === "Delete" || n.key === "Backspace") i(), this.remove(r);
    else if (n.key === "ContextMenu" || n.shiftKey && n.key === "F10") {
      i();
      const l = t.getBoundingClientRect();
      this.menu(r, l.left + 24, l.bottom, t);
    }
  }
}

export { Gc };
