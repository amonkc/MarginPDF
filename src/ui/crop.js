import { yt } from '../engine/pdfium';
import { H, y } from './dom';

function Xt(u, n) {
  return new yt(u.a * n.a + u.c * n.b, u.b * n.a + u.d * n.b, u.a * n.c + u.c * n.d, u.b * n.c + u.d * n.d, u.a * n.e + u.c * n.f + u.e, u.b * n.e + u.d * n.f + u.f);
}
function Pc(u, n, t, e) {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "line");
  for (const [o, a] of Object.entries({ x1: u, y1: n, x2: t, y2: e })) r.setAttribute(o, String(a));
  return r.setAttribute("stroke", "var(--sel)"), r.setAttribute("stroke-width", "2"), r.setAttribute("stroke-dasharray", "4 3"), r;
}
function Dc(u, n, t, e) {
  const r = e[0] - t[0], o = e[1] - t[1], a = r * r + o * o, s = a ? Math.max(0, Math.min(1, ((u - t[0]) * r + (n - t[1]) * o) / a)) : 0;
  return Math.hypot(u - (t[0] + s * r), n - (t[1] + s * o));
}
const yc = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const _a = 36;
class wc {
  app;
  v;
  sel = null;
  onChange = () => {
  };
  constructor(n, t) {
    this.app = n, this.v = t;
  }
  toRect(n, t) {
    const e = [n.inv.apply(t.x, t.y), n.inv.apply(t.x + t.w, t.y + t.h)];
    return { l: Math.min(e[0][0], e[1][0]), r: Math.max(e[0][0], e[1][0]), b: Math.min(e[0][1], e[1][1]), t: Math.max(e[0][1], e[1][1]) };
  }
  zoomOf(n) {
    return n.ov.clientWidth / n.w || this.v.zoom;
  }
  overlay(n) {
    const t = this.sel;
    if (!t || t.page !== n.index) return;
    const e = n.tf.box(t.rect);
    n.ov.append(this.frame(n, e));
  }
  frame(n, t) {
    const e = this.zoomOf(n), r = y("div", { class: "cropsel", style: { left: t.x + "px", top: t.y + "px", width: t.w + "px", height: t.h + "px" } }, y("span", { class: "olabel", text: `${Math.round(t.w / e)} × ${Math.round(t.h / e)} pt` }));
    for (const o of yc) r.append(y("span", { class: "ohandle " + o, "data-h": o }));
    return r;
  }
  refresh() {
    for (const n of this.v.views) n.ov.dataset.tool === "crop" && n.visible && (n.ov.replaceChildren(), this.overlay(n));
  }
  down(n, t) {
    if (n.button !== 0) return;
    n.preventDefault();
    const e = t.ov.getBoundingClientRect(), r = n.clientX - e.left, o = n.clientY - e.top, a = t.ov.clientWidth, s = t.ov.clientHeight, i = (w) => {
      const k = Math.max(0, w.x), G = Math.max(0, w.y);
      return { x: k, y: G, w: Math.min(a, w.x + w.w) - k, h: Math.min(s, w.y + w.h) - G };
    }, l = n.target.closest(".ohandle")?.dataset.h, h = this.sel?.page === t.index ? t.tf.box(this.sel.rect) : null, m = h && r >= h.x && r <= h.x + h.w && o >= h.y && o <= h.y + h.h, _ = l && h ? l : m ? "move" : "new";
    _ === "new" && this.sel && this.sel.page !== t.index && (this.sel = null, this.refresh());
    let p = h || { x: r, y: o, w: 0, h: 0 };
    t.ov.setPointerCapture(n.pointerId);
    let P = t.ov.querySelector(".cropsel");
    const D = () => {
      P || (P = this.frame(t, p), t.ov.replaceChildren(P)), Object.assign(P.style, { left: p.x + "px", top: p.y + "px", width: p.w + "px", height: p.h + "px" });
      const w = this.zoomOf(t);
      P.querySelector(".olabel").textContent = `${Math.round(p.w / w)} × ${Math.round(p.h / w)} pt`;
    }, x = (w) => {
      const k = Math.max(0, Math.min(a, w.clientX - e.left)), G = Math.max(0, Math.min(s, w.clientY - e.top));
      if (_ === "new") p = { x: Math.min(r, k), y: Math.min(o, G), w: Math.abs(k - r), h: Math.abs(G - o) };
      else if (_ === "move") {
        const E = Math.max(-h.x, Math.min(a - h.x - h.w, k - r)), B = Math.max(-h.y, Math.min(s - h.y - h.h, G - o));
        p = { ...h, x: h.x + E, y: h.y + B };
      } else {
        let { x: E, y: B } = h, z = h.x + h.w, O = h.y + h.h;
        _.includes("w") && (E = Math.min(k, z - 10)), _.includes("e") && (z = Math.max(k, E + 10)), _.includes("n") && (B = Math.min(G, O - 10)), _.includes("s") && (O = Math.max(G, B + 10)), p = i({ x: E, y: B, w: z - E, h: O - B });
      }
      D();
    }, A = () => {
      t.ov.removeEventListener("pointermove", x), t.ov.removeEventListener("pointerup", A), t.ov.removeEventListener("pointercancel", A);
      const w = this.zoomOf(t);
      if (p.w / w < 10 || p.h / w < 10) {
        _ === "new" && (this.sel = null, this.refresh(), this.onChange());
        return;
      }
      this.sel = { page: t.index, rect: this.toRect(t, p) }, this.refresh(), this.onChange();
    };
    t.ov.addEventListener("pointermove", x), t.ov.addEventListener("pointerup", A), t.ov.addEventListener("pointercancel", A);
  }
  async apply(n) {
    const t = this.sel;
    if (!t) return;
    this.sel = null;
    const e = this.app.doc, r = e.pageBoxes(t.page).crop, o = { l: t.rect.l - r.l, b: t.rect.b - r.b, r: r.r - t.rect.r, t: r.t - t.rect.t };
    let a = 0;
    await this.app.mutate(n.length > 1 ? "Crop pages" : "Crop page", { pages: "all", structure: true }, () => {
      for (const i of n) {
        const l = e.pageBoxes(i).crop, h = { l: l.l + o.l, b: l.b + o.b, r: l.r - o.r, t: l.t - o.t };
        if (h.r - h.l < _a || h.t - h.b < _a) {
          a++;
          continue;
        }
        e.setCropBox(i, h);
      }
    }).catch((i) => H(i.message, "err")), this.onChange();
    const s = n.length - a;
    H(a ? `Cropped ${s} page${s === 1 ? "" : "s"}; ${a} too small to crop that much` : `Cropped ${s} page${s === 1 ? "" : "s"}`, a ? "warn" : "ok");
  }
  isCropped(n) {
    const { media: t, crop: e } = this.app.doc.pageBoxes(n);
    return Math.abs(t.l - e.l) + Math.abs(t.b - e.b) + Math.abs(t.r - e.r) + Math.abs(t.t - e.t) > 0.5;
  }
  async reset(n) {
    const t = n.filter((e) => this.isCropped(e));
    t.length && (this.sel = null, await this.app.mutate("Remove crop", { pages: "all", structure: true }, () => {
      for (const e of t) this.app.doc.setCropBox(e, null);
    }).catch((e) => H(e.message, "err")), H(`Restored ${t.length} page${t.length === 1 ? "" : "s"} to full size`));
  }
}

export { Dc, Pc, Xt, wc };
