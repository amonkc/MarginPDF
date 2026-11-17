import { Ve, y } from './dom';

class gu {
  el;
  list;
  app;
  items = [];
  io;
  anchor = 0;
  onGo = () => {
  };
  onSelection = () => {
  };
  onMove = () => {
  };
  onInsertBlank = () => {
  };
  onInsertFrom = () => {
  };
  constructor(n, t) {
    this.el = n, this.app = t, this.list = y("div", { class: "thumb-list", role: "listbox", "aria-label": "Pages", "aria-multiselectable": "true" }), n.append(this.list), this.io = new IntersectionObserver((e) => {
      for (const r of e) r.isIntersecting && this.draw(+r.target.dataset.index);
    }, { root: this.list, rootMargin: "300px 0px" });
  }
  rebuild() {
    const n = this.list.scrollTop;
    this.io.disconnect(), this.list.replaceChildren(), this.items = [];
    const t = this.app.doc.pageCount;
    for (let e = 0; e < t; e++) {
      const { w: r, h: o } = this.app.doc.pageSize(e), a = y("canvas", { class: "tcanvas" }), s = 112, i = Math.round(s * (o / r));
      a.style.width = s + "px", a.style.height = i + "px";
      const l = y("div", { class: "thumb", role: "option", tabindex: "0", draggable: "true", "data-index": String(e), "aria-label": `Page ${e + 1}` }, y("div", { class: "tframe" }, a), y("span", { class: "tlabel", text: String(e + 1) }));
      l.addEventListener("click", (h) => this.click(e, h)), l.addEventListener("keydown", (h) => {
        (h.key === "Enter" || h.key === " ") && (h.preventDefault(), this.click(e, h));
      }), this.dnd(l, e), this.list.append(this.gap(e, t), l), this.items.push({ wrap: l, canvas: a, dirty: true }), this.io.observe(l);
    }
    this.list.append(this.gap(t, t)), this.list.scrollTop = n, this.mark();
  }
  gap(n, t) {
    const e = n === 0 ? "before page 1" : n === t ? `after page ${t}` : `between pages ${n} and ${n + 1}`, r = (m, _) => y("button", { class: "gap-item", type: "button", role: "menuitem", text: m, onclick: (p) => {
      p.stopPropagation(), l(), _();
    } }), o = y("div", { class: "gap-menu", role: "menu", hidden: true }, r("Blank page", () => this.onInsertBlank(n)), r("Pages from a PDF…", () => this.onInsertFrom(n))), a = y("button", { class: "gap-plus", type: "button", "aria-haspopup": "menu", "aria-expanded": "false", "aria-label": `Insert ${e}`, title: `Insert ${e}` }, Ve("plus")), s = (m) => {
      h.contains(m.target) || l();
    }, i = (m) => {
      m.key === "Escape" && (l(), a.focus());
    }, l = () => {
      o.hidden = true, h.classList.remove("open"), a.setAttribute("aria-expanded", "false"), document.removeEventListener("pointerdown", s, true), document.removeEventListener("keydown", i, true);
    };
    a.addEventListener("click", (m) => {
      if (m.stopPropagation(), !o.hidden) return l();
      this.list.querySelectorAll(".tgap.open .gap-plus").forEach((_) => _ !== a && _.click()), o.hidden = false, h.classList.add("open"), a.setAttribute("aria-expanded", "true"), document.addEventListener("pointerdown", s, true), document.addEventListener("keydown", i, true), o.firstElementChild.focus();
    });
    const h = y("div", { class: "tgap" + (n === t ? " end" : ""), "data-at": String(n) }, y("span", { class: "gap-line", "aria-hidden": "true" }), a, o);
    return h.addEventListener("dragover", (m) => {
      m.dataTransfer?.types.includes("Files") && (m.preventDefault(), m.stopPropagation(), h.classList.add("drop"));
    }), h.addEventListener("dragleave", () => h.classList.remove("drop")), h.addEventListener("drop", (m) => {
      h.classList.remove("drop");
      const _ = [...m.dataTransfer?.files || []].filter((p) => /\.pdf$/i.test(p.name) || p.type === "application/pdf");
      _.length && (m.preventDefault(), m.stopPropagation(), this.onInsertFrom(n, _));
    }), h;
  }
  invalidate(n) {
    const t = n === "all" ? this.items.map((e, r) => r) : n;
    for (const e of t) {
      const r = this.items[e];
      if (!r) continue;
      r.dirty = true;
      const o = r.wrap.getBoundingClientRect(), a = this.list.getBoundingClientRect();
      o.bottom > a.top - 300 && o.top < a.bottom + 300 && this.draw(e);
    }
  }
  draw(n) {
    const t = this.items[n];
    if (!t || !t.dirty) return;
    t.dirty = false;
    const { w: e, h: r } = this.app.doc.pageSize(n), a = 112 * Math.min(2, devicePixelRatio || 1), s = Math.round(a * (r / e));
    this.app.relieveMemory(n);
    const i = this.app.doc.render(n, a, s);
    t.canvas.width = i.width, t.canvas.height = i.height, t.canvas.getContext("2d").putImageData(i, 0, 0), t.canvas.style.height = Math.round(112 * (r / e)) + "px";
  }
  click(n, t) {
    const e = this.app.selectedPages;
    if (t.shiftKey) {
      const [r, o] = [Math.min(this.anchor, n), Math.max(this.anchor, n)];
      for (let a = r; a <= o; a++) e.add(a);
    } else t.metaKey || t.ctrlKey ? (e.has(n) ? e.delete(n) : e.add(n), this.anchor = n) : (e.clear(), e.add(n), this.anchor = n, this.onGo(n));
    this.mark(), this.onSelection();
  }
  mark() {
    this.items.forEach((n, t) => {
      n.wrap.classList.toggle("sel", this.app.selectedPages.has(t)), n.wrap.classList.toggle("cur", this.app.currentPage === t), n.wrap.setAttribute("aria-selected", String(this.app.selectedPages.has(t)));
    });
  }
  follow(n) {
    this.mark();
    const t = this.items[n];
    if (!t) return;
    const e = t.wrap.getBoundingClientRect(), r = this.list.getBoundingClientRect();
    (e.top < r.top || e.bottom > r.bottom) && t.wrap.scrollIntoView({ block: "nearest" });
  }
  dnd(n, t) {
    n.addEventListener("dragstart", (e) => {
      this.app.selectedPages.has(t) || (this.app.selectedPages.clear(), this.app.selectedPages.add(t), this.mark(), this.onSelection()), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", "margin-pages"), n.classList.add("dragging");
    }), n.addEventListener("dragend", () => {
      n.classList.remove("dragging"), this.list.querySelectorAll(".drop-before,.drop-after").forEach((e) => e.classList.remove("drop-before", "drop-after"));
    }), n.addEventListener("dragover", (e) => {
      if (e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault();
      const r = n.getBoundingClientRect(), o = e.clientY > r.top + r.height / 2;
      n.classList.toggle("drop-after", o), n.classList.toggle("drop-before", !o);
    }), n.addEventListener("dragleave", () => n.classList.remove("drop-before", "drop-after")), n.addEventListener("drop", (e) => {
      if (e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault(), e.stopPropagation();
      const r = n.classList.contains("drop-after");
      n.classList.remove("drop-before", "drop-after");
      const o = [...this.app.selectedPages].sort((i, l) => i - l), a = t + (r ? 1 : 0), s = a - o.filter((i) => i < a).length;
      o.length && !(o.length === 1 && s === o[0]) && this.onMove(o, s);
    });
  }
}
function bu(u) {
  const n = (t, e, r) => y("button", { class: "iconbtn", type: "button", title: r, "aria-label": r, "data-act": t, onclick: () => u(t) }, Ve(e));
  return y("div", { class: "page-actions" }, n("rotl", "rotl", "Rotate left"), n("rotr", "rotr", "Rotate right"), n("insert", "plus", "Insert blank page after"), n("merge", "merge", "Insert pages from other PDFs"), n("copy", "copy", "Copy selected pages (Ctrl+C)"), n("paste", "paste", "Paste copied pages after the selected page (Ctrl+V)"), n("extract", "extract", "Extract or split pages"), n("delete", "trash", "Delete selected pages"));
}

export { bu, gu };
