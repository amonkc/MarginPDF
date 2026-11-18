import { svg, h } from './dom';
import type { Rect, AnnotInfo } from '../engine/types';
import type { Affine, FieldInfo, TextObjectInfo } from '../engine/pdfium';
import type { App } from '../app';

/** Page ⇄ device transform for one page view (an engine `Affine`). */
export type PageTransform = Affine;

/** One rendered page in the viewer and its cached per-page data. */
export type PageView = {
  index: number;
  /** the `.page` wrapper */
  wrap: HTMLElement;
  canvas: HTMLCanvasElement;
  /** interactive overlay (tool boxes, editors, field controls) */
  ov: HTMLElement;
  /** search hit highlights */
  hits: HTMLElement;
  /** preview layer for drags in progress */
  svg: SVGSVGElement;
  /** page size in points */
  w: number;
  h: number;
  /** scaleKey() of the last render, 0 if never rendered */
  renderedAt: number;
  dirty: boolean;
  visible: boolean;
  /** overlay must be rebuilt when the page next becomes visible */
  ovStale?: boolean;
  annots?: AnnotInfo[];
  fields?: FieldInfo[];
  texts?: TextObjectInfo[];
  /** page → device pixels at the current zoom (lazily computed; set to null to recompute) */
  tf: PageTransform;
  /** device pixels → page */
  readonly inv: PageTransform;
};

/** A search hit: rectangles (PDF space) on a page. */
export type SearchHit = { page: number; rects: Rect[] };

/** Gap below each page in px (matches the CSS), used to keep the reading position across rebuilds. */
const PAGE_GAP = 22;

/**
 * The scrolling page viewer: lays out one view per page, renders visible pages lazily (nearest to the middle of
 * the viewport first), handles zoom/fit and converts between page and screen coordinates.
 */
class Viewer {
  el: HTMLElement;
  inner: HTMLElement;
  app: App;
  views: PageView[] = [];
  zoom = 1;
  fit: "width" | "page" | null = "width";
  io: IntersectionObserver;
  queue = new Set<number>();
  raf = 0;
  hits: SearchHit[] = [];
  activeHit = -1;
  /** rebuilds a page's overlay (set by Interact) */
  onOverlay: (pv: PageView) => void = () => {
  };
  onZoom: (zoom: number) => void = () => {
  };
  onPage: (page: number) => void = () => {
  };
  constructor(el: HTMLElement, app: App) {
    this.el = el;
    this.app = app;
    this.inner = h("div", { class: "pages" });
    el.append(this.inner);
    this.io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const view = this.views[+(entry.target as HTMLElement).dataset.index!];
        if (view) {
          view.visible = entry.isIntersecting;
          if (view.visible && (view.dirty || view.renderedAt !== this.scaleKey())) this.schedule(view.index);
          if (view.visible && view.ovStale) this.overlayOf(view);
        }
      }
    }, { root: el, rootMargin: "600px 0px" });
    new ResizeObserver(() => {
      if (this.fit) this.applyFit();
    }).observe(el);
    el.addEventListener("scroll", () => this.trackPage(), { passive: true });
    el.addEventListener("wheel", (e) => {
      // pinch / ctrl+wheel zooms around the pointer
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        this.setZoom(this.zoom * Math.exp(-e.deltaY * 22e-4), { x: e.clientX, y: e.clientY });
      }
    }, { passive: false });
    this.pinchZoom();
  }
  /**
   * Two-finger pinch on touch screens zooms around the fingers (the browser's own page zoom is off for the app).
   * The second finger cancels whatever the first one started (a drag, a stroke, a long press); while pinching
   * the pages are scaled with a CSS transform, and the zoom is applied, and the pages re-rendered, on release.
   */
  pinchZoom(): void {
    const el = this.el, touches = new Map<number, PointerEvent>();
    let pinch: { d0: number; z0: number; mid0: { x: number; y: number }; mid: { x: number; y: number }; s: number } | null = null;
    const pair = () => [...touches.values()].slice(0, 2);
    const mid = ([a, b]: PointerEvent[]) => ({ x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 });
    const dist = ([a, b]: PointerEvent[]) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1;
    const swallow = (e: Event) => {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    };
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "touch") return;
      touches.set(e.pointerId, e);
      if (touches.size < 2) return;
      swallow(e);
      if (pinch) return;
      // End the first finger's gesture as cancelled, then pinch with both.
      const [first] = pair();
      first.target?.dispatchEvent(new PointerEvent("pointercancel", { pointerId: first.pointerId, pointerType: "touch", bubbles: true }));
      const fingers = pair(), m = mid(fingers), inner = this.inner.getBoundingClientRect();
      pinch = { d0: dist(fingers), z0: this.zoom, mid0: m, mid: m, s: 1 };
      this.inner.style.transformOrigin = `${m.x - inner.left}px ${m.y - inner.top}px`;
      this.inner.style.willChange = "transform";
    }, true);
    el.addEventListener("pointermove", (e) => {
      if (!touches.has(e.pointerId)) return;
      touches.set(e.pointerId, e);
      if (!pinch) return;
      swallow(e);
      const fingers = pair();
      pinch.mid = mid(fingers);
      pinch.s = Math.max(0.2 / pinch.z0, Math.min(6 / pinch.z0, dist(fingers) / pinch.d0));
      this.inner.style.transform = `translate(${pinch.mid.x - pinch.mid0.x}px, ${pinch.mid.y - pinch.mid0.y}px) scale(${pinch.s})`;
    }, true);
    const end = (e: PointerEvent) => {
      if (!touches.delete(e.pointerId)) return;
      if (!pinch) return;
      swallow(e);
      if (touches.size >= 2) return;
      const { z0, s, mid0, mid: m } = pinch;
      pinch = null;
      touches.clear(); // a finger left on the screen doesn't start a new gesture
      this.inner.style.transform = this.inner.style.transformOrigin = this.inner.style.willChange = "";
      if (Math.abs(s - 1) > 0.01) this.setZoom(z0 * s, mid0);
      el.scrollLeft -= m.x - mid0.x;
      el.scrollTop -= m.y - mid0.y;
    };
    el.addEventListener("pointerup", end, true);
    el.addEventListener("pointercancel", (e) => {
      // our own cancel for the first finger isn't the end of the pinch
      if (e.isTrusted) end(e);
    }, true);
    // Keep the browser from scrolling or zooming the page while two fingers are down.
    el.addEventListener("touchmove", (e) => {
      if (e.touches.length > 1 && e.cancelable) e.preventDefault();
    }, { passive: false });
  }
  /** Identifies the render resolution (zoom and device pixel ratio) so stale renders can be detected. */
  scaleKey(): number {
    return Math.round(this.zoom * 1e3) * 10 + Math.min(3, Math.round(devicePixelRatio || 1));
  }
  /** Recreates all page views (after pages were added, removed or reordered), keeping the scroll position. */
  rebuild(): void {
    let anchor: { page: number; frac: number; left: number } | null = null;
    const scrollTop = this.el.scrollTop;
    for (const view of this.views) {
      const top = view.wrap.offsetTop, height = view.wrap.offsetHeight + PAGE_GAP;
      if (scrollTop < top + height) {
        anchor = { page: view.index, frac: Math.max(0, (scrollTop - top) / height), left: this.el.scrollLeft };
        break;
      }
    }
    this.io.disconnect();
    this.inner.replaceChildren();
    this.views = [];
    const doc = this.app.doc;
    for (let i = 0; i < doc.pageCount; i++) {
      const { w, h: pageH } = doc.pageSize(i), canvas = h("canvas", { class: "pdf", "aria-label": `Page ${i + 1}` }), hits = h("div", { class: "hits" }), preview = svg("svg", { class: "preview" }), ov = h("div", { class: "ov" }), wrap = h("div", { class: "page", "data-index": String(i) }, canvas, hits, preview, ov, h("span", { class: "pnum", text: `${i + 1}` }));
      this.inner.append(wrap);
      const view = this.makeView({ index: i, wrap, canvas, ov, hits, svg: preview, w, h: pageH, renderedAt: 0, dirty: true, visible: false });
      this.views.push(view);
      this.io.observe(wrap);
    }
    if (this.fit) this.applyFit();
    else this.layout();
    if (anchor && this.views.length) {
      const view = this.views[Math.min(anchor.page, this.views.length - 1)];
      this.el.scrollTop = view.wrap.offsetTop + anchor.frac * (view.wrap.offsetHeight + PAGE_GAP);
      this.el.scrollLeft = anchor.left;
    }
  }
  /** Marks pages as changed: drops cached annots/fields/texts, resizes if the page size changed, re-renders. */
  invalidate(pages: number[] | "all"): void {
    const views = pages === "all" ? this.views : pages.map((i) => this.views[i]).filter(Boolean);
    for (const view of views) {
      const { w, h } = this.app.doc.pageSize(view.index), resized = w !== view.w || h !== view.h;
      view.w = w;
      view.h = h;
      view.dirty = true;
      view.annots = view.fields = view.texts = undefined;
      if (resized) this.sizeView(view);
      else this.overlayOf(view);
      if (view.visible) this.schedule(view.index);
    }
  }
  /** Sets the zoom so the widest page (or, for "page", also the tallest) fits the viewport. */
  applyFit(): void {
    if (!this.views.length) return;
    const avail = this.el.clientWidth - 48, widest = Math.max(...this.views.map((v) => v.w));
    let zoom = avail / widest;
    if (this.fit === "page") {
      const tallest = Math.max(...this.views.map((v) => v.h));
      zoom = Math.min(zoom, (this.el.clientHeight - 48) / tallest);
    }
    this.zoom = Math.max(0.2, Math.min(zoom, 2.5));
    this.layout();
  }
  /** Sets a manual zoom (0.2–6), keeping the point under `at` (client coords; default the viewport centre) in place. */
  setZoom(zoom: number, at?: { x: number; y: number }): void {
    zoom = Math.max(0.2, Math.min(6, zoom));
    this.fit = null;
    const box = this.el.getBoundingClientRect(), dx = at ? at.x - box.left : this.el.clientWidth / 2, dy = at ? at.y - box.top : this.el.clientHeight / 2, fx = (this.el.scrollLeft + dx) / this.inner.scrollWidth, fy = (this.el.scrollTop + dy) / this.inner.scrollHeight;
    this.zoom = zoom;
    this.layout();
    this.el.scrollLeft = fx * this.inner.scrollWidth - dx;
    this.el.scrollTop = fy * this.inner.scrollHeight - dy;
  }
  layout(): void {
    for (const view of this.views) this.sizeView(view);
    this.onZoom(this.zoom);
    for (const view of this.views) if (view.visible) this.schedule(view.index);
  }
  /** Adds the lazily computed `tf` / `inv` transforms to a new view. */
  makeView(init: Omit<PageView, "tf" | "inv">): PageView {
    let tf: PageTransform | null = null, inv: PageTransform | null = null;
    const view = init as PageView;
    const compute = () => {
      tf = this.app.doc.transform(view.index, view.w * this.zoom, view.h * this.zoom);
      inv = tf!.invert();
    };
    Object.defineProperties(view, { tf: { get: () => {
      if (!tf) compute();
      return tf;
    }, set: (value) => {
      tf = value;
      inv = value ? value.invert() : null;
    }, enumerable: true }, inv: { get: () => {
      if (!inv) compute();
      return inv;
    }, enumerable: true } });
    return view;
  }
  sizeView(view: PageView): void {
    const w = view.w * this.zoom, h = view.h * this.zoom;
    view.wrap.style.width = w + "px";
    view.wrap.style.height = h + "px";
    view.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    view.tf = null!;
    this.overlayOf(view);
    this.drawHits(view);
  }
  /** Rebuilds a visible page's overlay now; for an offscreen page clears it and defers until it scrolls in. */
  overlayOf(view: PageView): void {
    if (view.visible) {
      view.ovStale = false;
      this.onOverlay(view);
    } else {
      view.ovStale = true;
      view.ov.replaceChildren();
    }
  }
  schedule(page: number): void {
    this.queue.add(page);
    if (!this.raf) this.raf = requestAnimationFrame(() => this.flush());
  }
  /** Renders one queued visible page per frame, nearest the viewport middle first. */
  flush(): void {
    this.raf = 0;
    const pending = [...this.queue].filter((i) => this.views[i]?.visible);
    if (!pending.length) {
      this.queue.clear();
      return;
    }
    const mid = this.el.scrollTop + this.el.clientHeight / 2;
    pending.sort((a, b) => Math.abs(this.views[a].wrap.offsetTop - mid) - Math.abs(this.views[b].wrap.offsetTop - mid));
    const next = pending[0];
    this.queue.delete(next);
    this.renderView(this.views[next]);
    if (this.queue.size) this.raf = requestAnimationFrame(() => this.flush());
  }
  /** Renders a page at zoom × device pixel ratio (max 3), capped at 4096 px on the long side. */
  renderView(view: PageView): void {
    const dpr = Math.min(3, devicePixelRatio || 1);
    let w = view.w * this.zoom * dpr, h = view.h * this.zoom * dpr;
    const cap = 4096 / Math.max(w, h);
    if (cap < 1) {
      w *= cap;
      h *= cap;
    }
    this.app.relieveMemory(view.index);
    const image = this.app.doc.render(view.index, w, h);
    view.canvas.width = image.width;
    view.canvas.height = image.height;
    view.canvas.getContext("2d")!.putImageData(image, 0, 0);
    view.renderedAt = this.scaleKey();
    view.dirty = false;
  }
  /** Updates app.currentPage to the last page whose top is above 35% of the viewport. */
  trackPage(): void {
    const line = this.el.scrollTop + this.el.clientHeight * 0.35;
    let page = 0;
    for (const view of this.views) {
      if (view.wrap.offsetTop <= line) page = view.index;
      else break;
    }
    if (page !== this.app.currentPage) {
      this.app.currentPage = page;
      this.onPage(page);
    }
  }
  /** Smooth-scrolls to a page, or to a rectangle on it (placed a third down the viewport). */
  scrollToPage(page: number, rect?: Rect): void {
    const view = this.views[page];
    if (!view) return;
    let top = view.wrap.offsetTop - 16;
    if (rect) {
      const box = view.tf.box(rect);
      top = view.wrap.offsetTop + box.y - this.el.clientHeight / 3;
      this.el.scrollTo({ left: Math.max(0, view.wrap.offsetLeft + box.x - 40), top, behavior: "smooth" });
      return;
    }
    this.el.scrollTo({ top, behavior: "smooth" });
  }
  /** The page and PDF y (rounded) at the top edge of the viewport. */
  viewTop(): { page: number; y: number } {
    const scrollTop = this.el.scrollTop, view = this.views.find((v) => v.wrap.offsetTop + v.wrap.offsetHeight > scrollTop + 2) || this.views[this.views.length - 1];
    if (!view) return { page: 0, y: 0 };
    const offset = Math.max(0, scrollTop - view.wrap.offsetTop), [, pageY] = view.inv.apply(0, Math.min(offset, view.wrap.offsetHeight));
    return { page: view.index, y: Math.round(Math.min(view.h, Math.max(0, pageY))) };
  }
  /** Smooth-scrolls so PDF y `pageY` on `page` is near the top (or the page top when pageY is null). */
  scrollToPoint(page: number, pageY?: number | null): void {
    const view = this.views[page];
    if (!view) return;
    const offset = pageY == null ? 0 : Math.max(0, view.tf.apply(0, pageY)[1]);
    this.el.scrollTo({ top: view.wrap.offsetTop + offset - (pageY == null ? 16 : 8), behavior: "smooth" });
  }
  /** Top-level annotations of a page (replies excluded), cached until invalidated. */
  annotsOf(view: PageView): AnnotInfo[] {
    return view.annots ??= this.app.doc.annots(view.index).filter((a: AnnotInfo) => a.irt == null);
  }
  fieldsOf(view: PageView): FieldInfo[] {
    return view.fields ??= this.app.doc.fields(view.index);
  }
  textsOf(view: PageView): TextObjectInfo[] {
    return view.texts ??= this.app.doc.textObjects(view.index);
  }
  /** Pointer position → PDF point on the page. */
  toPage(view: PageView, e: { clientX: number; clientY: number }): { x: number; y: number } {
    const box = view.ov.getBoundingClientRect(), [x, y] = view.inv.apply(e.clientX - box.left, e.clientY - box.top);
    return { x, y };
  }
  /** PDF point → device pixels within the page. */
  toDev(view: PageView, x: number, y: number): [number, number] {
    return view.tf.apply(x, y);
  }
  setHits(hits: SearchHit[], active: number): void {
    this.hits = hits;
    this.activeHit = active;
    for (const view of this.views) this.drawHits(view);
  }
  drawHits(view: PageView): void {
    view.hits.replaceChildren();
    this.hits.forEach((hit, i) => {
      if (hit.page === view.index) for (const rect of hit.rects) {
        const box = view.tf.box(rect);
        view.hits.append(h("div", { class: "hit" + (i === this.activeHit ? " active" : ""), style: { left: box.x - 1 + "px", top: box.y - 1 + "px", width: box.w + 2 + "px", height: box.h + 2 + "px" } }));
      }
    });
  }
}

export { Viewer };
