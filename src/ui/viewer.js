import { pt, y } from './dom';

class tc {
  el;
  inner;
  app;
  views = [];
  zoom = 1;
  fit = "width";
  io;
  queue = /* @__PURE__ */ new Set();
  raf = 0;
  hits = [];
  activeHit = -1;
  onOverlay = () => {
  };
  onZoom = () => {
  };
  onPage = () => {
  };
  constructor(n, t) {
    this.el = n, this.app = t, this.inner = y("div", { class: "pages" }), n.append(this.inner), this.io = new IntersectionObserver((e) => {
      for (const r of e) {
        const o = this.views[+r.target.dataset.index];
        o && (o.visible = r.isIntersecting, o.visible && (o.dirty || o.renderedAt !== this.scaleKey()) && this.schedule(o.index), o.visible && o.ovStale && this.overlayOf(o));
      }
    }, { root: n, rootMargin: "600px 0px" }), new ResizeObserver(() => {
      this.fit && this.applyFit();
    }).observe(n), n.addEventListener("scroll", () => this.trackPage(), { passive: true }), n.addEventListener("wheel", (e) => {
      (e.ctrlKey || e.metaKey) && (e.preventDefault(), this.setZoom(this.zoom * Math.exp(-e.deltaY * 22e-4), { x: e.clientX, y: e.clientY }));
    }, { passive: false });
  }
  scaleKey() {
    return Math.round(this.zoom * 1e3) * 10 + Math.min(3, Math.round(devicePixelRatio || 1));
  }
  rebuild() {
    let n = null;
    const t = this.el.scrollTop;
    for (const r of this.views) {
      const o = r.wrap.offsetTop, a = r.wrap.offsetHeight + 22;
      if (t < o + a) {
        n = { page: r.index, frac: Math.max(0, (t - o) / a), left: this.el.scrollLeft };
        break;
      }
    }
    this.io.disconnect(), this.inner.replaceChildren(), this.views = [];
    const e = this.app.doc;
    for (let r = 0; r < e.pageCount; r++) {
      const { w: o, h: a } = e.pageSize(r), s = y("canvas", { class: "pdf", "aria-label": `Page ${r + 1}` }), i = y("div", { class: "hits" }), l = pt("svg", { class: "preview" }), h = y("div", { class: "ov" }), m = y("div", { class: "page", "data-index": String(r) }, s, i, l, h, y("span", { class: "pnum", text: `${r + 1}` }));
      this.inner.append(m);
      const _ = this.makeView({ index: r, wrap: m, canvas: s, ov: h, hits: i, svg: l, w: o, h: a, renderedAt: 0, dirty: true, visible: false });
      this.views.push(_), this.io.observe(m);
    }
    if (this.fit ? this.applyFit() : this.layout(), n && this.views.length) {
      const r = this.views[Math.min(n.page, this.views.length - 1)];
      this.el.scrollTop = r.wrap.offsetTop + n.frac * (r.wrap.offsetHeight + 22), this.el.scrollLeft = n.left;
    }
  }
  invalidate(n) {
    const t = n === "all" ? this.views : n.map((e) => this.views[e]).filter(Boolean);
    for (const e of t) {
      const { w: r, h: o } = this.app.doc.pageSize(e.index), a = r !== e.w || o !== e.h;
      e.w = r, e.h = o, e.dirty = true, e.annots = e.fields = e.texts = void 0, a ? this.sizeView(e) : this.overlayOf(e), e.visible && this.schedule(e.index);
    }
  }
  applyFit() {
    if (!this.views.length) return;
    const n = this.el.clientWidth - 48, t = Math.max(...this.views.map((r) => r.w));
    let e = n / t;
    if (this.fit === "page") {
      const r = Math.max(...this.views.map((o) => o.h));
      e = Math.min(e, (this.el.clientHeight - 48) / r);
    }
    this.zoom = Math.max(0.2, Math.min(e, 2.5)), this.layout();
  }
  setZoom(n, t) {
    n = Math.max(0.2, Math.min(6, n)), this.fit = null;
    const e = this.el.getBoundingClientRect(), r = t ? t.x - e.left : this.el.clientWidth / 2, o = t ? t.y - e.top : this.el.clientHeight / 2, a = (this.el.scrollLeft + r) / this.inner.scrollWidth, s = (this.el.scrollTop + o) / this.inner.scrollHeight;
    this.zoom = n, this.layout(), this.el.scrollLeft = a * this.inner.scrollWidth - r, this.el.scrollTop = s * this.inner.scrollHeight - o;
  }
  layout() {
    for (const n of this.views) this.sizeView(n);
    this.onZoom(this.zoom);
    for (const n of this.views) n.visible && this.schedule(n.index);
  }
  makeView(n) {
    let t = null, e = null;
    const r = n, o = () => {
      t = this.app.doc.transform(r.index, r.w * this.zoom, r.h * this.zoom), e = t.invert();
    };
    return Object.defineProperties(r, { tf: { get: () => (t || o(), t), set: (a) => {
      t = a, e = a ? a.invert() : null;
    }, enumerable: true }, inv: { get: () => (e || o(), e), enumerable: true } }), r;
  }
  sizeView(n) {
    const t = n.w * this.zoom, e = n.h * this.zoom;
    n.wrap.style.width = t + "px", n.wrap.style.height = e + "px", n.svg.setAttribute("viewBox", `0 0 ${t} ${e}`), n.tf = null, this.overlayOf(n), this.drawHits(n);
  }
  overlayOf(n) {
    n.visible ? (n.ovStale = false, this.onOverlay(n)) : (n.ovStale = true, n.ov.replaceChildren());
  }
  schedule(n) {
    this.queue.add(n), this.raf || (this.raf = requestAnimationFrame(() => this.flush()));
  }
  flush() {
    this.raf = 0;
    const n = [...this.queue].filter((r) => this.views[r]?.visible);
    if (!n.length) {
      this.queue.clear();
      return;
    }
    const t = this.el.scrollTop + this.el.clientHeight / 2;
    n.sort((r, o) => Math.abs(this.views[r].wrap.offsetTop - t) - Math.abs(this.views[o].wrap.offsetTop - t));
    const e = n[0];
    this.queue.delete(e), this.renderView(this.views[e]), this.queue.size && (this.raf = requestAnimationFrame(() => this.flush()));
  }
  renderView(n) {
    const t = Math.min(3, devicePixelRatio || 1);
    let e = n.w * this.zoom * t, r = n.h * this.zoom * t;
    const o = 4096 / Math.max(e, r);
    o < 1 && (e *= o, r *= o), this.app.relieveMemory(n.index);
    const a = this.app.doc.render(n.index, e, r);
    n.canvas.width = a.width, n.canvas.height = a.height, n.canvas.getContext("2d").putImageData(a, 0, 0), n.renderedAt = this.scaleKey(), n.dirty = false;
  }
  trackPage() {
    const n = this.el.scrollTop + this.el.clientHeight * 0.35;
    let t = 0;
    for (const e of this.views) if (e.wrap.offsetTop <= n) t = e.index;
    else break;
    t !== this.app.currentPage && (this.app.currentPage = t, this.onPage(t));
  }
  scrollToPage(n, t) {
    const e = this.views[n];
    if (!e) return;
    let r = e.wrap.offsetTop - 16;
    if (t) {
      const o = e.tf.box(t);
      r = e.wrap.offsetTop + o.y - this.el.clientHeight / 3, this.el.scrollTo({ left: Math.max(0, e.wrap.offsetLeft + o.x - 40), top: r, behavior: "smooth" });
      return;
    }
    this.el.scrollTo({ top: r, behavior: "smooth" });
  }
  viewTop() {
    const n = this.el.scrollTop, t = this.views.find((o) => o.wrap.offsetTop + o.wrap.offsetHeight > n + 2) || this.views[this.views.length - 1];
    if (!t) return { page: 0, y: 0 };
    const e = Math.max(0, n - t.wrap.offsetTop), [, r] = t.inv.apply(0, Math.min(e, t.wrap.offsetHeight));
    return { page: t.index, y: Math.round(Math.min(t.h, Math.max(0, r))) };
  }
  scrollToPoint(n, t) {
    const e = this.views[n];
    if (!e) return;
    const r = t == null ? 0 : Math.max(0, e.tf.apply(0, t)[1]);
    this.el.scrollTo({ top: e.wrap.offsetTop + r - (t == null ? 16 : 8), behavior: "smooth" });
  }
  annotsOf(n) {
    return n.annots ??= this.app.doc.annots(n.index).filter((t) => t.irt == null);
  }
  fieldsOf(n) {
    return n.fields ??= this.app.doc.fields(n.index);
  }
  textsOf(n) {
    return n.texts ??= this.app.doc.textObjects(n.index);
  }
  toPage(n, t) {
    const e = n.ov.getBoundingClientRect(), [r, o] = n.inv.apply(t.clientX - e.left, t.clientY - e.top);
    return { x: r, y: o };
  }
  toDev(n, t, e) {
    return n.tf.apply(t, e);
  }
  setHits(n, t) {
    this.hits = n, this.activeHit = t;
    for (const e of this.views) this.drawHits(e);
  }
  drawHits(n) {
    n.hits.replaceChildren(), this.hits.forEach((t, e) => {
      if (t.page === n.index) for (const r of t.rects) {
        const o = n.tf.box(r);
        n.hits.append(y("div", { class: "hit" + (e === this.activeHit ? " active" : ""), style: { left: o.x - 1 + "px", top: o.y - 1 + "px", width: o.w + 2 + "px", height: o.h + 2 + "px" } }));
      }
    });
  }
}

export { tc };
