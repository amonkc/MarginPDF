import { Jt, Q, Zn, wr, yt } from '../engine/pdfium';
import { Mo, tr } from '../engine/richtext';
import { Fn, gt, ko } from '../engine/text';
import { Dc, Pc, Xt } from './crop';
import { H, y } from './dom';
import { ps } from './images';
import { Pn } from './interact';

const ma = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const fa = 5;
class bc {
  app;
  v;
  sel = null;
  extra = [];
  items = /* @__PURE__ */ new Map();
  onChange = () => {
  };
  onFreeText = () => {
  };
  constructor(n, t) {
    this.app = n, this.v = t;
  }
  itemsOf(n) {
    let t = this.items.get(n.index);
    if (t) return t;
    const e = this.app.doc;
    t = [];
    for (const l of this.v.annotsOf(n)) if (!(wr(l.subtype) || l.subtype === Q.POPUP || l.subtype === Q.REDACT)) {
      if (l.subtype === Q.FREETEXT && l.ft) {
        t.push({ kind: "annot", key: "a" + l.index, label: l.ft.tip ? "Callout" : "Text box", bounds: l.ft.box, objs: [], annot: l.index, uniform: false, resizable: true, ft: l.ft });
        continue;
      }
      if (l.subtype === Q.LINE && l.line) {
        t.push({ kind: "annot", key: "a" + l.index, label: "Line", bounds: l.rect, objs: [], annot: l.index, uniform: false, resizable: false, line: l.line });
        continue;
      }
      t.push({ kind: "annot", key: "a" + l.index, label: l.subtype === Q.STAMP && l.contents === "Signature" ? "Signature" : Zn[l.subtype] || "Annotation", bounds: l.rect, objs: [], annot: l.index, uniform: l.subtype === Q.STAMP, resizable: l.subtype !== Q.TEXT });
    }
    for (const l of this.v.fieldsOf(n)) t.push({ kind: "annot", key: "a" + l.index, label: "Form field", bounds: l.rect, objs: [], annot: l.index, uniform: false, resizable: true });
    for (const l of e.links(n.index)) t.push({ kind: "annot", key: "a" + l.index, label: "Link", bounds: l.rect, objs: [], annot: l.index, uniform: false, resizable: true });
    const r = e.pageObjects(n.index), o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
    for (const l of r) l.blockId ? ((o.get(l.blockId) || o.set(l.blockId, []).get(l.blockId)).push(l.bounds), (a.get(l.blockId) || a.set(l.blockId, []).get(l.blockId)).push(l.index)) : (l.type === 3 || l.type === 5) && t.push({ kind: "image", key: "o" + l.index, label: l.type === 3 ? "Image" : "Graphic", bounds: l.bounds, objs: [l.index], uniform: false, resizable: true });
    const s = /* @__PURE__ */ new Map();
    for (const l of this.v.textsOf(n)) if (l.margin?.rt) {
      const h = Mo(l.margin.rt);
      h?.width && s.set(l.margin.id, h);
    }
    for (const [l, h] of o) t.push({ wrap: s.get(l), kind: "block", key: "b" + l, label: l.startsWith("hf-") ? "Header / footer" : l === "wm" ? "Watermark" : l === "bg" ? "Background" : "Text", bounds: Jt(h), objs: a.get(l), block: l, uniform: true, resizable: true });
    for (const l of Pn(this.v.textsOf(n))) l.block || t.push({ kind: "line", key: "l" + l.objs[0].index, label: "Text", bounds: l.bounds, objs: l.objs.map((h) => h.index), uniform: true, resizable: true });
    const i = (l) => (l.r - l.l) * (l.t - l.b);
    return t.sort((l, h) => i(l.bounds) - i(h.bounds)), this.items.set(n.index, t), t;
  }
  invalidate(n) {
    n == null ? this.items.clear() : this.items.delete(n);
  }
  overlay(n) {
    if (this.items.delete(n.index), this.cropping) {
      this.cropOverlay(n);
      return;
    }
    const t = this.itemsOf(n);
    for (const o of [...t].reverse()) {
      const a = n.tf.box(o.bounds);
      n.ov.append(y("div", { class: "obox", "data-k": o.key, title: o.label, style: { left: a.x - 2 + "px", top: a.y - 2 + "px", width: a.w + 4 + "px", height: a.h + 4 + "px" } }));
    }
    const e = this.sel;
    if (!e || e.page !== n.index) return;
    this.extra = this.extra.filter((o) => o !== e.key && t.some((a) => a.key === o));
    const r = t.find((o) => o.key === e.key);
    if (!r) {
      const o = this.extra.shift();
      this.sel = o ? { page: e.page, key: o } : null, this.sel && this.overlay(n);
      return;
    }
    if (this.extra.length) {
      const o = this.selected(n);
      for (const s of o) {
        const i = n.tf.box(s.bounds);
        n.ov.append(y("div", { class: "oframe multi" + (s === r ? " primary" : ""), "data-k": s.key, style: { left: i.x - 2 + "px", top: i.y - 2 + "px", width: i.w + 4 + "px", height: i.h + 4 + "px" } }));
      }
      const a = this.groupBox(n, o);
      n.ov.append(y("div", { class: "ogroup", style: { left: a.x - 5 + "px", top: a.y - 5 + "px", width: a.w + 10 + "px", height: a.h + 10 + "px" } }, y("span", { class: "olabel", text: `${o.length} objects · ${this.size(n, a)}` })));
      return;
    }
    n.ov.append(this.frame(n, r, n.tf.box(r.bounds)));
  }
  selected(n) {
    const t = this.sel;
    if (!t) return [];
    if (n ??= this.v.views[t.page], !n || n.index !== t.page) return [];
    const e = this.itemsOf(n);
    return [t.key, ...this.extra].map((o) => e.find((a) => a.key === o)).filter((o) => !!o);
  }
  groupBox(n, t) {
    const e = t.map((i) => n.tf.box(i.bounds)), r = Math.min(...e.map((i) => i.x)), o = Math.min(...e.map((i) => i.y)), a = Math.max(...e.map((i) => i.x + i.w)), s = Math.max(...e.map((i) => i.y + i.h));
    return { x: r, y: o, w: a - r, h: s - o };
  }
  toggle(n, t) {
    const e = this.sel;
    if (!e || e.page !== n.index) this.sel = { page: n.index, key: t }, this.extra = [];
    else if (e.key === t) {
      const r = this.extra.shift();
      this.sel = r ? { page: n.index, key: r } : null;
    } else this.extra.includes(t) ? this.extra = this.extra.filter((r) => r !== t) : (this.extra.push(e.key), this.sel = { page: n.index, key: t });
    this.refresh(), this.onChange();
  }
  selectAll() {
    const n = this.v.views[this.sel?.page ?? this.app.currentPage];
    if (!n) return;
    const t = this.itemsOf(n).filter((e) => e.kind !== "block" || !/^(wm|bg|hf-)/.test(e.block || ""));
    t.length && (this.sel = { page: n.index, key: t[0].key }, this.extra = t.slice(1).map((e) => e.key), this.refresh(), this.onChange());
  }
  clear() {
    this.sel && (this.sel = null, this.extra = [], this.refresh(), this.onChange());
  }
  frame(n, t, e) {
    const r = y("div", { class: "oframe" + (t.resizable ? "" : " fixed"), "data-k": t.key, style: { left: e.x - 2 + "px", top: e.y - 2 + "px", width: e.w + 4 + "px", height: e.h + 4 + "px" } }, y("span", { class: "olabel", text: `${t.label} · ${this.size(n, e)}` }));
    if (t.resizable) for (const a of ma) t.uniform && a.length === 1 && !(t.wrap && (a === "e" || a === "w")) || r.append(y("span", { class: "ohandle " + a, "data-h": a }));
    return (t.line || (t.ft?.tip ? [t.ft.tip] : [])).forEach((a, s) => {
      const [i, l] = n.tf.apply(a.x, a.y);
      r.append(y("span", { class: "ohandle pt", "data-h": "p" + s, style: { left: i - e.x + 2 - 6 + "px", top: l - e.y + 2 - 6 + "px" } }));
    }), r;
  }
  size(n, t) {
    const e = this.v.zoom;
    return `${Math.round(t.w / e)} × ${Math.round(t.h / e)} pt`;
  }
  down(n, t) {
    const r = n.target.closest(".ohandle"), o = this.itemsOf(t);
    let a;
    if (r && this.sel?.page === t.index) a = o.find((l) => l.key === this.sel.key);
    else {
      const l = t.ov.getBoundingClientRect(), h = n.clientX - l.left, m = n.clientY - l.top;
      a = o.find((_) => _.line && Dc(h, m, t.tf.apply(_.line[0].x, _.line[0].y), t.tf.apply(_.line[1].x, _.line[1].y)) < 7) || o.find((_) => {
        if (_.line) return false;
        const p = t.tf.box(_.bounds);
        return h >= p.x - 3 && h <= p.x + p.w + 3 && m >= p.y - 3 && m <= p.y + p.h + 3;
      });
    }
    const s = n.shiftKey || n.ctrlKey || n.metaKey;
    if (!a) {
      n.preventDefault(), !s && this.sel && (this.sel = null, this.extra = [], this.refresh(), this.onChange()), this.marquee(n, t, s);
      return;
    }
    if (n.preventDefault(), s && !r) {
      this.toggle(t, a.key);
      return;
    }
    if (!r && this.extra.length && this.sel?.page === t.index && (this.sel.key === a.key || this.extra.includes(a.key))) {
      this.dragGroup(n, t);
      return;
    }
    (this.sel?.page !== t.index || this.sel.key !== a.key || this.extra.length) && (this.sel = { page: t.index, key: a.key }, this.extra = [], this.refresh(), this.onChange());
    const i = t.ov.querySelector(".oframe");
    if (i) {
      if ((a.line || a.ft?.tip) && r && /^p[01]$/.test(r.dataset.h)) return this.dragEnd(n, t, a, +r.dataset.h[1]);
      this.drag(n, t, a, i, r?.dataset.h || null);
    }
  }
  drag(n, t, e, r, o) {
    const a = t.ov;
    a.setPointerCapture(n.pointerId);
    const s = t.tf.box(e.bounds), i = n.clientX, l = n.clientY, h = t.w * this.v.zoom, m = t.h * this.v.zoom, _ = this.itemsOf(t).filter((E) => E !== e).map((E) => t.tf.box(E.bounds)), p = [0, h / 2, h, ..._.flatMap((E) => [E.x, E.x + E.w / 2, E.x + E.w])], P = [0, m / 2, m, ..._.flatMap((E) => [E.y, E.y + E.h / 2, E.y + E.h])];
    let D = { ...s }, x = false;
    const A = y("div", { class: "oguides" });
    a.append(A);
    const w = r.querySelector(".olabel"), k = (E) => {
      const B = E.clientX - i, z = E.clientY - l;
      if (!(!x && Math.hypot(B, z) < 2)) {
        if (x = true, A.replaceChildren(), o) {
          let { x: O, y: W, w: N, h: V } = s;
          if (o.includes("e") && (N = Math.max(6, s.w + B)), o.includes("w") && (N = Math.max(6, s.w - B), O = s.x + s.w - N), o.includes("s") && (V = Math.max(6, s.h + z)), o.includes("n") && (V = Math.max(6, s.h - z), W = s.y + s.h - V), e.wrap && o.length === 1) V = s.h, W = s.y;
          else if ((e.uniform || o.length === 2) && !(E.shiftKey && !e.uniform) && o.length === 2) {
            const q = Math.max(N / s.w, V / s.h);
            N = s.w * q, V = s.h * q, o.includes("w") && (O = s.x + s.w - N), o.includes("n") && (W = s.y + s.h - V);
          }
          D = { x: O, y: W, w: N, h: V };
        } else if (D = { ...s, x: s.x + B, y: s.y + z }, !E.altKey) {
          const O = (W, N, V, q) => {
            let Y = fa + 1, ne = W, J = -1;
            for (const [ee] of [[0], [N / 2], [N]]) for (const ae of V) {
              const de = Math.abs(W + ee - ae);
              de < Y && (Y = de, ne = ae - ee, J = ae);
            }
            return J >= 0 && A.append(y("div", { class: "oguide " + (q ? "v" : "h"), style: q ? { left: J + "px" } : { top: J + "px" } })), ne;
          };
          D.x = O(D.x, D.w, p, true), D.y = O(D.y, D.h, P, false);
        }
        Object.assign(r.style, { left: D.x - 2 + "px", top: D.y - 2 + "px", width: D.w + 4 + "px", height: D.h + 4 + "px" }), w && (w.textContent = `${e.label} · ${this.size(t, D)}`);
      }
    }, G = () => {
      a.removeEventListener("pointermove", k), a.removeEventListener("pointerup", G), a.removeEventListener("pointercancel", G), A.remove(), x && this.apply(t, e, s, D);
    };
    a.addEventListener("pointermove", k), a.addEventListener("pointerup", G), a.addEventListener("pointercancel", G);
  }
  marquee(n, t, e) {
    const r = t.ov;
    r.setPointerCapture(n.pointerId);
    const o = r.getBoundingClientRect(), a = n.clientX - o.left, s = n.clientY - o.top;
    let i = null;
    const l = (m) => {
      const _ = m.clientX - o.left, p = m.clientY - o.top;
      if (i = { x: Math.min(a, _), y: Math.min(s, p), w: Math.abs(_ - a), h: Math.abs(p - s) }, i.w < 3 && i.h < 3) return;
      const P = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      for (const [D, x] of Object.entries({ x: i.x, y: i.y, width: i.w, height: i.h })) P.setAttribute(D, String(x));
      P.setAttribute("class", "omarquee"), t.svg.replaceChildren(P);
    }, h = () => {
      if (r.removeEventListener("pointermove", l), r.removeEventListener("pointerup", h), r.removeEventListener("pointercancel", h), t.svg.replaceChildren(), !i || i.w < 3 && i.h < 3) return;
      const m = i, _ = this.itemsOf(t).filter((D) => {
        const x = t.tf.box(D.bounds), A = x.x + x.w / 2, w = x.y + x.h / 2;
        return A >= m.x && A <= m.x + m.w && w >= m.y && w <= m.y + m.h;
      }).filter((D) => D.kind !== "block" || !/^(wm|bg|hf-)/.test(D.block || ""));
      if (!_.length) return;
      const p = new Set(e && this.sel?.page === t.index ? [this.sel.key, ...this.extra] : []);
      for (const D of _) p.add(D.key);
      const P = [...p];
      this.sel = { page: t.index, key: P[0] }, this.extra = P.slice(1), this.refresh(), this.onChange();
    };
    r.addEventListener("pointermove", l), r.addEventListener("pointerup", h), r.addEventListener("pointercancel", h);
  }
  dragGroup(n, t) {
    const e = t.ov;
    e.setPointerCapture(n.pointerId);
    const r = this.selected(t), o = this.groupBox(t, r), a = n.clientX, s = n.clientY, i = t.w * this.v.zoom, l = t.h * this.v.zoom, h = this.itemsOf(t).filter((G) => !r.includes(G)).map((G) => t.tf.box(G.bounds)), m = [0, i / 2, i, ...h.flatMap((G) => [G.x, G.x + G.w / 2, G.x + G.w])], _ = [0, l / 2, l, ...h.flatMap((G) => [G.y, G.y + G.h / 2, G.y + G.h])], p = y("div", { class: "oguides" });
    e.append(p);
    const P = [...e.querySelectorAll(".oframe.multi, .ogroup")];
    let D = 0, x = 0, A = false;
    const w = (G) => {
      if (D = G.clientX - a, x = G.clientY - s, !(!A && Math.hypot(D, x) < 2)) {
        if (A = true, p.replaceChildren(), !G.altKey) {
          const E = this.snap({ ...o, x: o.x + D, y: o.y + x }, m, _, p);
          D = E.x - o.x, x = E.y - o.y;
        }
        for (const E of P) E.style.transform = `translate(${D}px, ${x}px)`;
      }
    }, k = () => {
      e.removeEventListener("pointermove", w), e.removeEventListener("pointerup", k), e.removeEventListener("pointercancel", k), p.remove(), A && this.moveGroup(t, r, D, x);
    };
    e.addEventListener("pointermove", w), e.addEventListener("pointerup", k), e.addEventListener("pointercancel", k);
  }
  snap(n, t, e, r) {
    const o = (a, s, i, l) => {
      let h = fa + 1, m = a, _ = -1;
      for (const p of [0, s / 2, s]) for (const P of i) {
        const D = Math.abs(a + p - P);
        D < h && (h = D, m = P - p, _ = P);
      }
      return _ >= 0 && r.append(y("div", { class: "oguide " + (l ? "v" : "h"), style: l ? { left: _ + "px" } : { top: _ + "px" } })), m;
    };
    return { ...n, x: o(n.x, n.w, t, true), y: o(n.y, n.h, e, false) };
  }
  pageMap(n, t, e) {
    const r = e.w / t.w, o = e.h / t.h, a = new yt(r, 0, 0, o, e.x - t.x * r, e.y - t.y * o), s = Xt(n.inv, Xt(a, n.tf));
    return [s.a, s.b, s.c, s.d, s.e, s.f];
  }
  moveItem(n, t, e, r) {
    const o = this.app.doc, a = n.index;
    if (t.kind === "annot") {
      const l = n.inv.apply(0, 0), h = n.inv.apply(e, r);
      o.moveAnnot(a, t.annot, h[0] - l[0], h[1] - l[1]);
      return;
    }
    const s = n.tf.box(t.bounds), i = this.pageMap(n, s, { ...s, x: s.x + e, y: s.y + r });
    t.kind === "block" ? o.transformBlock(a, t.block, i, 1) : o.transformObjects(a, t.objs, i);
  }
  resizeItem(n, t, e, r) {
    const o = this.app.doc, a = n.index;
    if (!t.resizable || t.ft || t.line) return false;
    if (t.uniform) {
      const i = r.w / e.w !== 1 ? r.w / e.w : r.h / e.h;
      r = { x: r.x, y: r.y, w: e.w * i, h: e.h * i };
    }
    if (t.kind === "annot") {
      const i = [n.inv.apply(r.x, r.y), n.inv.apply(r.x + r.w, r.y + r.h)];
      return o.resizeAnnot(a, t.annot, { l: Math.min(i[0][0], i[1][0]), r: Math.max(i[0][0], i[1][0]), b: Math.min(i[0][1], i[1][1]), t: Math.max(i[0][1], i[1][1]) }), true;
    }
    const s = this.pageMap(n, e, r);
    return t.kind === "block" ? o.transformBlock(a, t.block, s, t.uniform ? r.w / e.w : 1) : o.transformObjects(a, t.objs, s), true;
  }
  moveGroup(n, t, e, r, o = `Move ${t.length} objects`) {
    !e && !r || this.app.mutate(o, { pages: [n.index] }, () => {
      for (const a of t) this.moveItem(n, a, e, r);
    }).catch((a) => H(a.message, "err"));
  }
  align(n) {
    const t = this.selected();
    if (!t.length) return;
    const e = this.v.views[this.sel.page], r = t.length === 1 ? { x: 0, y: 0, w: e.w * this.v.zoom, h: e.h * this.v.zoom } : this.groupBox(e, t), o = { left: "left", hcenter: "centre", right: "right", top: "top", vmiddle: "middle", bottom: "bottom" };
    this.app.mutate(t.length === 1 ? `Align to page ${o[n]}` : `Align ${o[n]}`, { pages: [e.index] }, () => {
      for (const a of t) {
        const s = e.tf.box(a.bounds);
        let i = 0, l = 0;
        n === "left" ? i = r.x - s.x : n === "right" ? i = r.x + r.w - (s.x + s.w) : n === "hcenter" ? i = r.x + r.w / 2 - (s.x + s.w / 2) : n === "top" ? l = r.y - s.y : n === "bottom" ? l = r.y + r.h - (s.y + s.h) : l = r.y + r.h / 2 - (s.y + s.h / 2), (Math.abs(i) > 0.01 || Math.abs(l) > 0.01) && this.moveItem(e, a, i, l);
      }
    }).catch((a) => H(a.message, "err"));
  }
  distribute(n) {
    const t = this.selected();
    if (t.length < 3) return H("Select three or more objects to distribute them", "warn");
    const e = this.v.views[this.sel.page], r = t.map((h) => ({ it: h, b: e.tf.box(h.bounds) })), o = (h) => n === "h" ? h.x : h.y, a = (h) => n === "h" ? h.w : h.h;
    r.sort((h, m) => o(h.b) + a(h.b) / 2 - (o(m.b) + a(m.b) / 2));
    const s = o(r[0].b), l = (o(r[r.length - 1].b) + a(r[r.length - 1].b) - s - r.reduce((h, m) => h + a(m.b), 0)) / (r.length - 1);
    this.app.mutate(n === "h" ? "Distribute across" : "Distribute down", { pages: [e.index] }, () => {
      let h = s;
      for (const { it: m, b: _ } of r) {
        const p = h - o(_);
        Math.abs(p) > 0.01 && this.moveItem(e, m, n === "h" ? p : 0, n === "v" ? p : 0), h += a(_) + l;
      }
    }).catch((h) => H(h.message, "err"));
  }
  matchSize(n) {
    const t = this.selected();
    if (t.length < 2) return H("Select two or more objects; the others take the size of the one you clicked last", "warn");
    const e = this.v.views[this.sel.page], r = e.tf.box(t[0].bounds);
    let o = 0;
    this.app.mutate(n === "w" ? "Match width" : n === "h" ? "Match height" : "Match size", { pages: [e.index] }, () => {
      for (const a of t.slice(1)) {
        const s = e.tf.box(a.bounds), i = { x: s.x, y: s.y, w: n === "h" ? s.w : r.w, h: n === "w" ? s.h : r.h };
        this.resizeItem(e, a, s, i) || o++;
      }
    }).then(() => {
      o && H(`${o} object${o === 1 ? "" : "s"} (text boxes, lines or notes) kept ${o === 1 ? "its" : "their"} size`, "warn");
    }).catch((a) => H(a.message, "err"));
  }
  restack(n) {
    const t = this.selected();
    if (!t.length) return;
    const e = this.sel.page, r = t.filter((i) => i.kind !== "annot").flatMap((i) => i.objs), o = t.filter((i) => i.kind === "annot").map((i) => i.annot), a = { front: "Bring to front", back: "Send to back", forward: "Bring forward", backward: "Send backward" };
    let s = false;
    this.app.mutate(a[n], { pages: [e] }, () => {
      if (r.length && this.app.doc.restackObjects(e, r, n) && (s = true), o.length && this.app.doc.restackAnnots(e, o, n) && (s = true), !s) throw new Error(n === "front" || n === "forward" ? "Already in front of what it overlaps" : "Already behind what it overlaps");
    }).then(() => {
      this.sel = null, this.extra = [], this.refresh(), this.onChange();
    }).catch((i) => H(i.message, "warn"));
  }
  dragEnd(n, t, e, r) {
    const o = t.ov;
    o.setPointerCapture(n.pointerId);
    const a = e.ft, s = a ? { x: (a.box.l + a.box.r) / 2, y: (a.box.t + a.box.b) / 2 } : e.line[1 - r];
    let i = a ? a.tip : e.line[r], l = false;
    const h = t.svg, m = (p) => {
      const P = o.getBoundingClientRect(), [D, x] = t.inv.apply(p.clientX - P.left, p.clientY - P.top);
      if (i = { x: D, y: x }, p.shiftKey) {
        const E = D - s.x, B = x - s.y, z = Math.hypot(E, B), O = Math.round(Math.atan2(B, E) / (Math.PI / 4)) * (Math.PI / 4);
        i = { x: s.x + z * Math.cos(O), y: s.y + z * Math.sin(O) };
      }
      l = true;
      const [A, w] = t.tf.apply(s.x, s.y), [k, G] = t.tf.apply(i.x, i.y);
      h.replaceChildren(Pc(A, w, k, G));
    }, _ = () => {
      if (o.removeEventListener("pointermove", m), o.removeEventListener("pointerup", _), o.removeEventListener("pointercancel", _), h.replaceChildren(), !l || Math.hypot(i.x - s.x, i.y - s.y) < 2) return;
      if (a) {
        this.onFreeText(t.index, e.annot, (D) => ({ ...D, tip: i }), "Point callout");
        return;
      }
      const [p, P] = r === 0 ? [i, s] : [s, i];
      this.app.mutate("Edit line", { pages: [t.index] }, () => this.app.doc.setLinePoints(t.index, e.annot, p, P)).catch((D) => H(D.message, "err"));
    };
    o.addEventListener("pointermove", m), o.addEventListener("pointerup", _), o.addEventListener("pointercancel", _);
  }
  apply(n, t, e, r) {
    const o = r.w / e.w, a = r.h / e.h, s = new yt(o, 0, 0, a, r.x - e.x * o, r.y - e.y * a), i = Xt(n.inv, Xt(s, n.tf)), l = [i.a, i.b, i.c, i.d, i.e, i.f], h = Math.abs(o - 1) > 1e-3 || Math.abs(a - 1) > 1e-3, m = h ? `Resize ${t.label.toLowerCase()}` : `Move ${t.label.toLowerCase()}`, _ = this.app.doc, p = n.index;
    if (t.wrap && Math.abs(a - 1) < 1e-3 && Math.abs(o - 1) > 1e-3) {
      const P = t.wrap, D = Math.hypot(P.bm[0], P.bm[1]) || 1, x = r.x - e.x, A = n.inv.apply(e.x, e.y), w = n.inv.apply(e.x + x, e.y), k = (n.ov.clientWidth / n.w || this.v.zoom) * D, G = { ...P, width: Math.max(12, P.width + (r.w - e.w) / k), bm: [P.bm[0], P.bm[1], P.bm[2], P.bm[3], P.bm[4] + (w[0] - A[0]), P.bm[5] + (w[1] - A[1])] };
      this.app.mutate("Reflow text", { pages: [p] }, async () => {
        gt(_, p, t.block), await tr(_, p, G, t.block);
      }).catch((E) => H(E.message, "err"));
      return;
    }
    if (t.ft) {
      const P = [n.inv.apply(r.x, r.y), n.inv.apply(r.x + r.w, r.y + r.h)], D = { l: Math.min(P[0][0], P[1][0]), r: Math.max(P[0][0], P[1][0]), b: Math.min(P[0][1], P[1][1]), t: Math.max(P[0][1], P[1][1]) };
      this.onFreeText(p, t.annot, (x) => ({ ...x, box: D }), m);
      return;
    }
    this.app.mutate(m, { pages: [p] }, () => {
      if (t.kind === "annot") if (h) {
        const P = [n.inv.apply(r.x, r.y), n.inv.apply(r.x + r.w, r.y + r.h)];
        _.resizeAnnot(p, t.annot, { l: Math.min(P[0][0], P[1][0]), r: Math.max(P[0][0], P[1][0]), b: Math.min(P[0][1], P[1][1]), t: Math.max(P[0][1], P[1][1]) });
      } else {
        const P = n.inv.apply(e.x, e.y), D = n.inv.apply(r.x, r.y);
        _.moveAnnot(p, t.annot, D[0] - P[0], D[1] - P[1]);
      }
      else t.kind === "block" ? _.transformBlock(p, t.block, l, t.uniform ? o : 1) : _.transformObjects(p, t.objs, l);
    }).catch((P) => H(P.message, "err"));
  }
  nudge(n, t) {
    const e = this.sel;
    if (!e) return false;
    if (this.extra.length) {
      const i = this.v.views[e.page], l = this.v.zoom;
      return this.moveGroup(i, this.selected(i), n * l, t * l), true;
    }
    const r = this.v.views[e.page], o = r && this.itemsOf(r).find((i) => i.key === e.key);
    if (!o) return false;
    const a = r.tf.box(o.bounds), s = this.v.zoom;
    return this.apply(r, o, a, { ...a, x: a.x + n * s, y: a.y + t * s }), true;
  }
  removeItems(n, t, e) {
    const r = this.app.doc, o = t.filter((s) => s.kind === "annot").map((s) => s.annot).sort((s, i) => i - s), a = t.filter((s) => s.kind !== "annot").flatMap((s) => s.objs);
    if (this.sel?.page === n) {
      const s = new Set(t.map((i) => i.key));
      s.has(this.sel.key) && (this.sel = null), this.extra = this.extra.filter((i) => !s.has(i)), !this.sel && this.extra.length && (this.sel = { page: n, key: this.extra.shift() });
    }
    return this.app.mutate(e, { pages: [n] }, () => {
      for (const s of o) r.deleteAnnot(n, s);
      a.length && Fn(r, n, a);
    });
  }
  remove() {
    const n = this.sel;
    if (!n) return false;
    if (this.extra.length) {
      const a = this.selected(), s = this.app.doc, i = n.page;
      this.sel = null, this.extra = [];
      const l = a.filter((m) => m.kind === "annot").map((m) => m.annot).sort((m, _) => _ - m), h = a.filter((m) => m.kind !== "annot").flatMap((m) => m.objs);
      return this.app.mutate(`Delete ${a.length} objects`, { pages: [i] }, () => {
        for (const m of l) s.deleteAnnot(i, m);
        h.length && Fn(s, i, h);
      }).catch((m) => H(m.message, "err")), true;
    }
    const t = this.v.views[n.page], e = t && this.itemsOf(t).find((a) => a.key === n.key);
    if (!e) return false;
    const r = this.app.doc, o = n.page;
    return this.sel = null, this.app.mutate(`Delete ${e.label.toLowerCase()}`, { pages: [o] }, () => {
      e.kind === "annot" ? r.deleteAnnot(o, e.annot) : Fn(r, o, e.objs);
    }).catch((a) => H(a.message, "err")), true;
  }
  canDuplicate(n) {
    return n.kind === "annot" ? n.label !== "Link" && n.label !== "Form field" : n.kind === "image" && n.label === "Image";
  }
  clipOf(n, t = this.selected()) {
    const e = t.filter((s) => this.canDuplicate(s)), r = t.length - e.length;
    if (!e.length) return null;
    const { items: o, skipped: a } = this.app.doc.readClip(n, e.filter((s) => s.kind === "annot").map((s) => s.annot), e.filter((s) => s.kind === "image").flatMap((s) => s.objs));
    return o.length ? { items: o, bounds: Jt(e.map((s) => s.bounds)), skipped: r + a } : null;
  }
  async paste(n, t, e, r, o) {
    const a = this.app.doc, s = this.app.settings.author;
    let i = [];
    try {
      await this.app.mutate(o, { pages: [n] }, async () => {
        i = a.writeClip(n, t, e, r, s);
        for (const l of t) {
          if (l.t !== "ft") continue;
          const h = l.data, m = a.createFreeText(n, s);
          await ko(a, n, m, { ...h, box: { l: h.box.l + e, r: h.box.r + e, t: h.box.t + r, b: h.box.b + r }, tip: h.tip ? { x: h.tip.x + e, y: h.tip.y + r } : void 0 }), i.push("a" + m);
        }
      });
    } catch (l) {
      return H(l.message, "err"), [];
    }
    return this.app.tool === "arrange" && i.length && (this.invalidate(n), this.sel = { page: n, key: i[0] }, this.extra = i.slice(1), this.refresh(), this.onChange()), i;
  }
  screenOffset(n, t = 12, e = t) {
    const r = this.v.views[n];
    if (!r) return [t, -e];
    const o = this.v.zoom, a = r.inv.apply(0, 0), s = r.inv.apply(t * o, e * o);
    return [s[0] - a[0], s[1] - a[1]];
  }
  async duplicate(n, t = this.selected()) {
    const e = this.clipOf(n, t);
    if (!e) return H("Only annotations and pictures can be duplicated", "warn"), [];
    e.skipped && H(`${e.skipped} object${e.skipped === 1 ? "" : "s"} (text, links, form fields or markup) ${e.skipped === 1 ? "wasn’t" : "weren’t"} duplicated`, "warn");
    const [r, o] = this.screenOffset(n);
    return this.paste(n, e.items, r, o, e.items.length > 1 ? `Duplicate ${e.items.length} objects` : "Duplicate");
  }
  itemOfAnnot(n, t) {
    const e = this.v.views[n];
    return e ? (this.app.tool !== "arrange" && this.items.delete(n), this.itemsOf(e).find((r) => r.key === "a" + t) || null) : null;
  }
  current() {
    const n = this.sel;
    if (!n || this.extra.length) return null;
    const t = this.v.views[n.page];
    return t && this.itemsOf(t).find((e) => e.key === n.key) || null;
  }
  turn(n) {
    const t = this.sel, e = this.current();
    if (!t || !e || e.kind !== "image") return;
    const r = this.v.views[t.page], o = r.tf.box(e.bounds), a = o.x + o.w / 2, s = o.y + o.h / 2, i = n === "rotl" ? new yt(0, -1, 1, 0, 0, 0) : n === "rotr" ? new yt(0, 1, -1, 0, 0, 0) : n === "fliph" ? new yt(-1, 0, 0, 1, 0, 0) : new yt(1, 0, 0, -1, 0, 0), l = Xt(new yt(1, 0, 0, 1, a, s), Xt(i, new yt(1, 0, 0, 1, -a, -s))), h = Xt(r.inv, Xt(l, r.tf)), m = { rotl: "Rotate image left", rotr: "Rotate image right", fliph: "Flip image", flipv: "Flip image" }[n];
    this.app.mutate(m, { pages: [t.page] }, () => this.app.doc.transformObjects(t.page, e.objs, [h.a, h.b, h.c, h.d, h.e, h.f])).catch((_) => H(_.message, "err"));
  }
  cropping = null;
  startCrop() {
    const n = this.sel, t = this.current();
    !n || !t || t.kind !== "image" || t.label !== "Image" || (this.cropping = { page: n.page, key: n.key, obj: t.objs[0], f: { x0: 0, y0: 0, x1: 1, y1: 1 } }, this.refresh(), this.onChange());
  }
  cancelCrop() {
    this.cropping = null, this.refresh(), this.onChange();
  }
  async applyCrop(n) {
    const t = this.cropping;
    if (!t) return;
    this.cropping = null;
    const { x0: e, y0: r, x1: o, y1: a } = t.f;
    if (o - e > 0.995 && a - r > 0.995) {
      this.refresh(), this.onChange();
      return;
    }
    const s = this.app.doc, i = s.imageInfo(t.page, t.obj), l = s.imagePixels(t.page, t.obj);
    if (!i || !l) {
      H("This image can’t be cropped", "err");
      return;
    }
    const h = Math.max(0, Math.floor(e * l.w)), m = Math.min(l.w, Math.ceil(o * l.w)), _ = Math.max(0, Math.floor((1 - a) * l.h)), p = Math.min(l.h, Math.ceil((1 - r) * l.h)), P = Math.max(1, m - h), D = Math.max(1, p - _), x = new Uint8ClampedArray(P * D * 4);
    for (let Y = 0; Y < D; Y++) x.set(l.rgba.subarray(((_ + Y) * l.w + h) * 4, ((_ + Y) * l.w + h + P) * 4), Y * P * 4);
    const A = await n(x, P, D, i.jpeg), w = h / l.w, k = (h + P) / l.w, G = 1 - (_ + D) / l.h, E = 1 - _ / l.h, [B, z, O, W, N, V] = i.matrix, q = [B * (k - w), z * (k - w), O * (E - G), W * (E - G), N + B * w + O * G, V + z * w + W * G];
    await this.app.mutate("Crop image", { pages: [t.page] }, () => s.setImage(t.page, t.obj, A, q)).catch((Y) => H(Y.message, "err"));
  }
  async replaceImage(n, t, e) {
    const r = this.sel, o = this.current();
    if (!r || !o || o.kind !== "image" || o.label !== "Image") return;
    const a = this.app.doc, s = this.v.views[r.page], i = s.tf.box(o.bounds), l = t / e, h = Math.min(i.w, i.h * l), m = h / l, _ = ps(s, { x: i.x + (i.w - h) / 2, y: i.y + (i.h - m) / 2, w: h, h: m });
    await this.app.mutate("Replace image", { pages: [r.page] }, () => a.setImage(r.page, o.objs[0], n, _)).catch((p) => H(p.message, "err"));
  }
  cropOverlay(n) {
    const t = this.cropping;
    if (!t || t.page !== n.index) return false;
    const e = this.itemsOf(n).find((w) => w.key === t.key), r = this.app.doc.imageInfo(t.page, t.obj);
    if (!e || !r) return false;
    const [o, a, s, i, l, h] = r.matrix, m = (w, k) => n.tf.apply(o * w + s * k + l, a * w + i * k + h), _ = (w) => {
      const k = [m(w.x0, w.y0), m(w.x1, w.y1)], G = Math.min(k[0][0], k[1][0]), E = Math.min(k[0][1], k[1][1]);
      return { x: G, y: E, w: Math.abs(k[1][0] - k[0][0]), h: Math.abs(k[1][1] - k[0][1]) };
    }, p = _({ x0: 0, y0: 0, x1: 1, y1: 1 }), P = y("div", { class: "cropsel" });
    for (const w of ma) P.append(y("span", { class: "ohandle " + w, "data-h": w }));
    const D = () => {
      const w = _(t.f);
      Object.assign(P.style, { left: w.x + "px", top: w.y + "px", width: w.w + "px", height: w.h + "px" });
    };
    D(), n.ov.append(y("div", { class: "crop-image-area", style: { left: p.x + "px", top: p.y + "px", width: p.w + "px", height: p.h + "px" } }), P);
    const x = Xt(n.tf, new yt(o, a, s, i, l, h)), A = x.invert();
    return P.addEventListener("pointerdown", (w) => {
      w.stopPropagation(), w.preventDefault();
      const k = w.target.closest(".ohandle")?.dataset.h || "move", G = n.ov.getBoundingClientRect(), E = { ...t.f }, [B, z] = A.apply(w.clientX - G.left, w.clientY - G.top);
      P.setPointerCapture(w.pointerId);
      const O = (N) => {
        const [V, q] = A.apply(N.clientX - G.left, N.clientY - G.top), Y = V - B, ne = q - z, J = { ...E }, ee = (ae) => Math.max(0, Math.min(1, ae));
        if (k === "move") {
          const ae = E.x1 - E.x0, de = E.y1 - E.y0;
          J.x0 = ee(E.x0 + Y), J.y0 = ee(E.y0 + ne), J.x0 = Math.min(J.x0, 1 - ae), J.y0 = Math.min(J.y0, 1 - de), J.x1 = J.x0 + ae, J.y1 = J.y0 + de;
        } else {
          const ae = Math.abs(x.a) >= Math.abs(x.c) ? { ax: "x", sg: Math.sign(x.a) } : { ax: "y", sg: Math.sign(x.c) }, de = Math.abs(x.b) >= Math.abs(x.d) ? { ax: "x", sg: Math.sign(x.b) } : { ax: "y", sg: Math.sign(x.d) }, oe = (fe, we) => {
            const ce = fe.sg > 0 === we, Ge = fe.ax + (ce ? "1" : "0");
            J[Ge] = ee(E[Ge] + (fe.ax === "x" ? Y : ne));
          };
          if (k.includes("e") && oe(ae, true), k.includes("w") && oe(ae, false), k.includes("s") && oe(de, true), k.includes("n") && oe(de, false), J.x0 > J.x1 || J.y0 > J.y1 || J.x1 - J.x0 < 0.02 || J.y1 - J.y0 < 0.02) return;
        }
        t.f = J, D();
      }, W = () => {
        P.removeEventListener("pointermove", O), P.removeEventListener("pointerup", W), this.onChange();
      };
      P.addEventListener("pointermove", O), P.addEventListener("pointerup", W);
    }), true;
  }
  refresh() {
    for (const n of this.v.views) n.ov.dataset.tool === "arrange" && n.visible && (n.ov.replaceChildren(), this.overlay(n));
  }
}

export { bc };
