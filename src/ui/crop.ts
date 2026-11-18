import { Affine } from '../engine/pdfium';
import { toast, h } from './dom';
import type { Box, Rect } from '../engine/types';
import type { App } from '../app';
import type { PageView, Viewer } from './viewer';

/** The six coefficients of an affine transform (PDF matrix order). */
type AffineLike = { a: number; b: number; c: number; d: number; e: number; f: number };

/** The pending crop rectangle: which page it was drawn on and the rectangle in PDF space. */
type CropSelection = { page: number; rect: Rect };

/**
 * Composes two affine transforms: the result applies `second` first, then `first`.
 */
function mulAffine(first: AffineLike, second: AffineLike) {
  return new Affine(
    first.a * second.a + first.c * second.b,
    first.b * second.a + first.d * second.b,
    first.a * second.c + first.c * second.d,
    first.b * second.c + first.d * second.d,
    first.a * second.e + first.c * second.f + first.e,
    first.b * second.e + first.d * second.f + first.f,
  );
}

/** A dashed SVG line in the selection colour (used as a drag preview). */
function dashedLine(x1: number, y1: number, x2: number, y2: number): SVGLineElement {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  for (const [name, value] of Object.entries({ x1: x1, y1: y1, x2: x2, y2: y2 })) line.setAttribute(name, String(value));
  line.setAttribute("stroke", "var(--sel)");
  line.setAttribute("stroke-width", "2");
  line.setAttribute("stroke-dasharray", "4 3");
  return line;
}

/** Distance from point (px, py) to the segment a–b. */
function distToSegment(px: number, py: number, a: [number, number], b: [number, number]): number {
  const dx = b[0] - a[0], dy = b[1] - a[1], lenSq = dx * dx + dy * dy, t = lenSq ? Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / lenSq)) : 0;
  return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
}

/** Resize handle positions, clockwise from top-left. */
const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
/** Smallest page width/height (pt) a crop may leave. */
const MIN_CROPPED_SIZE = 36;

/**
 * Crop pages tool: the user draws (and then moves/resizes) a rectangle on one page; `apply` crops the
 * chosen pages by the same margins.
 */
class Crop {
  app: App;
  v: Viewer;
  sel: CropSelection | null = null;
  onChange: () => void = () => {
  };
  constructor(app: App, viewer: Viewer) {
    this.app = app;
    this.v = viewer;
  }
  /** Converts an overlay-pixel box on page view `pv` to a PDF-space rectangle. */
  toRect(pv: PageView, box: Box): Rect {
    const corners = [pv.inv.apply(box.x, box.y), pv.inv.apply(box.x + box.w, box.y + box.h)];
    return { l: Math.min(corners[0][0], corners[1][0]), r: Math.max(corners[0][0], corners[1][0]), b: Math.min(corners[0][1], corners[1][1]), t: Math.max(corners[0][1], corners[1][1]) };
  }
  /** Pixels per point actually shown for this page (falls back to the viewer zoom). */
  zoomOf(pv: PageView): number {
    return pv.ov.clientWidth / pv.w || this.v.zoom;
  }
  overlay(pv: PageView): void {
    const sel = this.sel;
    if (!sel || sel.page !== pv.index) return;
    const box = pv.tf.box(sel.rect);
    pv.ov.append(this.frame(pv, box));
  }
  /** The selection frame element with its size label and resize handles. */
  frame(pv: PageView, box: Box): HTMLElement {
    const zoom = this.zoomOf(pv), el = h("div", { class: "cropsel", style: { left: box.x + "px", top: box.y + "px", width: box.w + "px", height: box.h + "px" } }, h("span", { class: "olabel", text: `${Math.round(box.w / zoom)} × ${Math.round(box.h / zoom)} pt` }));
    for (const handle of HANDLES) el.append(h("span", { class: "ohandle " + handle, "data-h": handle }));
    return el;
  }
  refresh(): void {
    for (const pv of this.v.views) {
      if (pv.ov.dataset.tool === "crop" && pv.visible) {
        pv.ov.replaceChildren();
        this.overlay(pv);
      }
    }
  }
  /** Pointer down on a page overlay: draw a new rectangle, move the current one, or drag one of its handles. */
  down(ev: PointerEvent, pv: PageView): void {
    if (ev.button !== 0) return;
    ev.preventDefault();
    const ovRect = pv.ov.getBoundingClientRect(), startX = ev.clientX - ovRect.left, startY = ev.clientY - ovRect.top, ovW = pv.ov.clientWidth, ovH = pv.ov.clientHeight, clampToPage = (b: Box): Box => {
      const left = Math.max(0, b.x), top = Math.max(0, b.y);
      return { x: left, y: top, w: Math.min(ovW, b.x + b.w) - left, h: Math.min(ovH, b.y + b.h) - top };
    }, handle = (ev.target as HTMLElement).closest<HTMLElement>(".ohandle")?.dataset.h, startBox = this.sel?.page === pv.index ? pv.tf.box(this.sel.rect) : null, insideSel = startBox && startX >= startBox.x && startX <= startBox.x + startBox.w && startY >= startBox.y && startY <= startBox.y + startBox.h, mode = handle && startBox ? handle : insideSel ? "move" : "new";
    if (mode === "new" && this.sel && this.sel.page !== pv.index) {
      this.sel = null;
      this.refresh();
    }
    let box: Box = startBox || { x: startX, y: startY, w: 0, h: 0 };
    pv.ov.setPointerCapture(ev.pointerId);
    let frameEl = pv.ov.querySelector<HTMLElement>(".cropsel");
    const render = () => {
      if (!frameEl) {
        frameEl = this.frame(pv, box);
        pv.ov.replaceChildren(frameEl);
      }
      Object.assign(frameEl.style, { left: box.x + "px", top: box.y + "px", width: box.w + "px", height: box.h + "px" });
      const zoom = this.zoomOf(pv);
      frameEl.querySelector(".olabel")!.textContent = `${Math.round(box.w / zoom)} × ${Math.round(box.h / zoom)} pt`;
    }, onMove = (e: PointerEvent) => {
      const px = Math.max(0, Math.min(ovW, e.clientX - ovRect.left)), py = Math.max(0, Math.min(ovH, e.clientY - ovRect.top));
      if (mode === "new") box = { x: Math.min(startX, px), y: Math.min(startY, py), w: Math.abs(px - startX), h: Math.abs(py - startY) };
      else if (mode === "move") {
        const sb = startBox!;
        const dx = Math.max(-sb.x, Math.min(ovW - sb.x - sb.w, px - startX)), dy = Math.max(-sb.y, Math.min(ovH - sb.y - sb.h, py - startY));
        box = { ...sb, x: sb.x + dx, y: sb.y + dy };
      } else {
        const sb = startBox!;
        let { x: left, y: top } = sb, right = sb.x + sb.w, bottom = sb.y + sb.h;
        if (mode.includes("w")) left = Math.min(px, right - 10);
        if (mode.includes("e")) right = Math.max(px, left + 10);
        if (mode.includes("n")) top = Math.min(py, bottom - 10);
        if (mode.includes("s")) bottom = Math.max(py, top + 10);
        box = clampToPage({ x: left, y: top, w: right - left, h: bottom - top });
      }
      render();
    }, onUp = () => {
      pv.ov.removeEventListener("pointermove", onMove);
      pv.ov.removeEventListener("pointerup", onUp);
      pv.ov.removeEventListener("pointercancel", onUp);
      const zoom = this.zoomOf(pv);
      // Under 10 pt either way counts as a click: a click outside clears the selection.
      if (box.w / zoom < 10 || box.h / zoom < 10) {
        if (mode === "new") {
          this.sel = null;
          this.refresh();
          this.onChange();
        }
        return;
      }
      this.sel = { page: pv.index, rect: this.toRect(pv, box) };
      this.refresh();
      this.onChange();
    };
    pv.ov.addEventListener("pointermove", onMove);
    pv.ov.addEventListener("pointerup", onUp);
    pv.ov.addEventListener("pointercancel", onUp);
  }
  /**
   * Crops `pages` by the margins between the selection and its page's crop box. Pages that would end up
   * smaller than 36 pt are skipped and counted in the toast.
   */
  async apply(pages: number[]): Promise<void> {
    const sel = this.sel;
    if (!sel) return;
    this.sel = null;
    const doc = this.app.doc, selPageCrop: Rect = doc.pageBoxes(sel.page).crop, margins = { l: sel.rect.l - selPageCrop.l, b: sel.rect.b - selPageCrop.b, r: selPageCrop.r - sel.rect.r, t: selPageCrop.t - sel.rect.t };
    let tooSmall = 0;
    await this.app.mutate(pages.length > 1 ? "Crop pages" : "Crop page", { pages: "all", structure: true }, () => {
      for (const page of pages) {
        const crop: Rect = doc.pageBoxes(page).crop, next = { l: crop.l + margins.l, b: crop.b + margins.b, r: crop.r - margins.r, t: crop.t - margins.t };
        if (next.r - next.l < MIN_CROPPED_SIZE || next.t - next.b < MIN_CROPPED_SIZE) {
          tooSmall++;
          continue;
        }
        doc.setCropBox(page, next);
      }
    }).catch((err) => toast(err.message, "err"));
    this.onChange();
    const cropped = pages.length - tooSmall;
    toast(tooSmall ? `Cropped ${cropped} page${cropped === 1 ? "" : "s"}; ${tooSmall} too small to crop that much` : `Cropped ${cropped} page${cropped === 1 ? "" : "s"}`, tooSmall ? "warn" : "ok");
  }
  /** True when the page's crop box differs from its media box. */
  isCropped(page: number): boolean {
    const { media, crop } = this.app.doc.pageBoxes(page);
    return Math.abs(media.l - crop.l) + Math.abs(media.b - crop.b) + Math.abs(media.r - crop.r) + Math.abs(media.t - crop.t) > 0.5;
  }
  /** Removes the crop box from those of `pages` that have one. */
  async reset(pages: number[]): Promise<void> {
    const cropped = pages.filter((page) => this.isCropped(page));
    if (cropped.length) {
      this.sel = null;
      await this.app.mutate("Remove crop", { pages: "all", structure: true }, () => {
        for (const page of cropped) this.app.doc.setCropBox(page, null);
      }).catch((err) => toast(err.message, "err"));
      toast(`Restored ${cropped.length} page${cropped.length === 1 ? "" : "s"} to full size`);
    }
  }
}

export { distToSegment, dashedLine, mulAffine, Crop };
