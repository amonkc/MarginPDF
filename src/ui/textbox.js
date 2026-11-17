import { $t, Dr, cr, ko, ta } from '../engine/text';
import { H, pt, y } from './dom';

const yo = (u) => `rgb(${u[0]},${u[1]},${u[2]})`;
const Ba = 200;
class hu {
  app;
  v;
  open = null;
  onChange = () => {
  };
  constructor(n, t) {
    this.app = n, this.v = t;
  }
  style() {
    const n = this.app.settings;
    return { fontKey: n.textFont, size: n.ftSize, color: n.ftColor, fill: n.ftFill, border: n.ftBorder, borderWidth: 1 };
  }
  down(n, t, e) {
    if (this.open) {
      this.open.done(true);
      return;
    }
    const r = this.v.toPage(t, n), o = this.app.settings.ftCallout, a = this.v.zoom, s = (l) => {
      if (!o) return Math.abs(l.x - r.x) < 6 && Math.abs(l.y - r.y) < 6 ? { l: r.x, r: r.x + Ba, t: r.y, b: r.y - this.app.settings.ftSize * 2.2 } : { l: Math.min(r.x, l.x), r: Math.max(r.x, l.x), b: Math.min(r.y, l.y), t: Math.max(r.y, l.y) };
      const h = Ba * 0.8, m = this.app.settings.ftSize * 2.2, _ = l.x >= r.x ? l.x : l.x - h, p = l.y >= r.y ? l.y + m : l.y;
      return { l: _, r: _ + h, t: p, b: p - m };
    };
    let i = r;
    e(n, t, (l) => {
      i = l;
      const h = t.tf.box(s(l)), m = [pt("rect", { x: h.x, y: h.y, width: h.w, height: h.h, fill: "none", stroke: "var(--sel)", "stroke-dasharray": "4 3" })];
      if (o) {
        const [_, p] = t.tf.apply(r.x, r.y);
        m.push(pt("line", { x1: _, y1: p, x2: h.x + h.w / 2, y2: h.y + h.h / 2, stroke: "var(--sel)", "stroke-dasharray": "4 3" }));
      }
      t.svg.replaceChildren(...m);
    }, (l) => {
      if (i = l, o && Math.hypot(i.x - r.x, i.y - r.y) < 12 / a) {
        H("Drag from the point the callout should point at to where the box goes", "warn");
        return;
      }
      const h = s(i);
      this.edit(t, null, { box: h, tip: o ? r : void 0, text: "", style: this.style() });
    });
  }
  async edit(n, t, e) {
    this.open && this.open.done(true);
    const r = this.app.doc, o = e || (t != null ? r.readFreeText(n.index, t) : null);
    if (!o) return;
    const a = cr(o.style.fontKey, o.text || "ก");
    await $t(a).catch(() => {
    });
    const s = n.tf.box(o.box), i = this.v.zoom, l = o.style, h = l.border ? l.borderWidth : 0, m = y("textarea", { class: "ftedit", spellcheck: true, "aria-label": "Text box" });
    m.value = o.text, Object.assign(m.style, { left: s.x + "px", top: s.y + "px", width: s.w + "px", minHeight: s.h + "px", padding: (4 + h) * i + "px", fontFamily: Dr(a), fontSize: l.size * i + "px", lineHeight: "1.3", color: yo(l.color), background: l.fill ? yo(l.fill) : "rgba(255,255,255,.85)", borderColor: l.border ? yo(l.border) : "transparent", borderWidth: Math.max(1, h * i) + "px" });
    const _ = () => {
      m.style.height = "0px", m.style.height = Math.max(s.h, m.scrollHeight) + "px";
    };
    n.ov.append(m), _(), m.addEventListener("input", _), m.addEventListener("pointerdown", (x) => x.stopPropagation());
    let p = false;
    const P = async (x) => {
      if (p) return;
      p = true, this.open = null, m.remove(), this.onChange();
      const A = m.value.replace(/\r/g, "").replace(/\s+$/, "");
      if (!x || A === o.text && t != null) {
        this.app.emit({ pages: [n.index] });
        return;
      }
      const w = n.index;
      try {
        if (!A) {
          t != null ? await this.app.mutate("Delete text box", { pages: [w] }, () => r.deleteAnnot(w, t)) : this.app.emit({ pages: [w] });
          return;
        }
        const k = { ...o, text: A }, G = await ta(k), E = t == null && o.tip ? G : Math.max(G, o.box.t - o.box.b);
        k.box = { ...o.box, b: o.box.t - E }, await this.app.mutate(t == null ? o.tip ? "Callout" : "Text box" : "Edit text box", { pages: [w] }, async () => {
          const B = t ?? r.createFreeText(w, this.app.settings.author);
          await ko(r, w, B, k);
        });
      } catch (k) {
        H(k.message, "err");
      }
    };
    m.addEventListener("keydown", (x) => {
      x.stopPropagation(), x.key === "Escape" ? (x.preventDefault(), P(false)) : x.key === "Enter" && (x.metaKey || x.ctrlKey) && (x.preventDefault(), P(true));
    }), m.addEventListener("blur", () => setTimeout(() => {
      !p && document.activeElement !== m && P(true);
    }, 120)), this.open = { pv: n, el: m, done: P }, this.onChange();
    const D = () => {
      !m.isConnected || p || (m.focus({ preventScroll: true }), m.setSelectionRange(m.value.length, m.value.length));
    };
    D(), requestAnimationFrame(D);
  }
  async update(n, t, e, r) {
    const o = this.app.doc, a = o.readFreeText(n, t);
    if (!a) return;
    const s = e(structuredClone(a)), i = await ta(s);
    s.box.t - s.box.b < i && (s.box.b = s.box.t - i), await this.app.mutate(r, { pages: [n] }, () => ko(o, n, t, s)).catch((l) => H(l.message, "err"));
  }
}

export { hu };
