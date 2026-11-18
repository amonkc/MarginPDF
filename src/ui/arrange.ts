import { unionRect, ANNOT, ANNOT_NAMES, isTextMarkup, Affine } from '../engine/pdfium';
import { decodeRichText, writeRichText } from '../engine/richtext';
import { removeObjects, removeById, renderFreeText } from '../engine/text';
import { distToSegment, dashedLine, mulAffine } from './crop';
import { toast, h } from './dom';
import { imageMatrix } from './images';
import { groupTextRuns } from './interact';
import type { AnnotInfo, Box, ClipObj, FreeTextData, ImageSrc, Matrix, Pt, Rect } from '../engine/types';
import type { RichText } from '../engine/richtext';
import type { RestackMode } from '../engine/pdfium';
import type { App } from '../app';
import type { PageView, Viewer } from './viewer';

/**
 * One thing the Move & resize tool can select on a page.
 * - `annot`: an annotation, form field or link (`annot` is its index)
 * - `image`: an image or vector graphic page object (`objs` holds its index)
 * - `block`: the page objects of a Margin text block, header/footer, watermark or background (`block` is its id)
 * - `line`: one line of ordinary page text
 */
export type ArrangeItem = {
  kind: "annot" | "image" | "block" | "line";
  /** unique on the page: "a"+annot index, "o"+object index, "b"+block id, "l"+first object index */
  key: string;
  label: string;
  bounds: Rect;
  objs: number[];
  annot?: number;
  block?: string;
  /** resizes keep the aspect ratio (corner handles only) */
  uniform: boolean;
  resizable: boolean;
  /** text box / callout geometry */
  ft?: { box: Rect; tip?: Pt };
  /** line annotation end points */
  line?: [Pt, Pt];
  /** set for wrapping rich text: side handles reflow it instead of scaling */
  wrap?: RichText;
  /** paint order on the page, higher is in front (annotations above all page content); see `stackOf` */
  z: number;
};

/** The primary selection: page index and item key. */
type Selection = { page: number; key: string };
/** Image crop in progress: the kept part of the image as fractions of its unit square (y up). */
type CropFrac = { x0: number; y0: number; x1: number; y1: number };
type ImageCrop = { page: number; key: string; obj: number; f: CropFrac };
/** Edges and centre lines that `align` can line items up on. */
type AlignEdge = "left" | "hcenter" | "right" | "top" | "vmiddle" | "bottom";

/** Resize handle positions, clockwise from top-left. */
const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
/** Stacking: annotations are drawn above all page content; a watermark, though usually last, is clicked through. */
const ANNOT_Z = 1e7, WATERMARK_Z = -1;
/** Snap distance in screen pixels. */
const SNAP_PX = 5;

/**
 * The Move & resize tool. Selects page objects and annotations (click, Shift/Ctrl-click, marquee), moves and
 * resizes them with snapping guides, and provides align/distribute/match size, stacking order, image
 * rotate/flip/crop/replace, delete, duplicate and clipboard data.
 *
 * The selection is `sel` (the primary item, last clicked) plus `extra` (other keys on the same page).
 */
class Arrange {
  app: App;
  v: Viewer;
  sel: Selection | null = null;
  extra: string[] = [];
  /** Items per page index, smallest first; rebuilt on each overlay. */
  items: Map<number, ArrangeItem[]> = /* @__PURE__ */ new Map();
  onChange: () => void = () => {
  };
  /** Edits a text box: (page, annot index, change to its data, undo label). Set by main. */
  onFreeText: (page: number, annot: number, change: (d: FreeTextData) => FreeTextData, label: string) => void = () => {
  };
  cropping: ImageCrop | null = null;
  constructor(app: App, viewer: Viewer) {
    this.app = app;
    this.v = viewer;
  }
  /** The selectable items on a page, smallest first (cached). Clicks pick by stacking order instead: `stackAt`. */
  itemsOf(pv: PageView): ArrangeItem[] {
    let items = this.items.get(pv.index);
    if (items) return items;
    const doc = this.app.doc;
    items = [];
    for (const a of this.v.annotsOf(pv) as AnnotInfo[]) if (!(isTextMarkup(a.subtype) || a.subtype === ANNOT.POPUP || a.subtype === ANNOT.REDACT)) {
      if (a.subtype === ANNOT.FREETEXT && a.ft) {
        items.push({ kind: "annot", key: "a" + a.index, label: a.ft.tip ? "Callout" : "Text box", bounds: a.ft.box, objs: [], annot: a.index, uniform: false, resizable: true, ft: a.ft, z: ANNOT_Z + a.index });
        continue;
      }
      if (a.subtype === ANNOT.LINE && a.line) {
        items.push({ kind: "annot", key: "a" + a.index, label: "Line", bounds: a.rect, objs: [], annot: a.index, uniform: false, resizable: false, line: a.line, z: ANNOT_Z + a.index });
        continue;
      }
      items.push({ kind: "annot", key: "a" + a.index, label: a.subtype === ANNOT.STAMP && a.contents === "Signature" ? "Signature" : ANNOT_NAMES[a.subtype] || "Annotation", bounds: a.rect, objs: [], annot: a.index, uniform: a.subtype === ANNOT.STAMP, resizable: a.subtype !== ANNOT.TEXT, z: ANNOT_Z + a.index });
    }
    for (const f of this.v.fieldsOf(pv)) items.push({ kind: "annot", key: "a" + f.index, label: "Form field", bounds: f.rect, objs: [], annot: f.index, uniform: false, resizable: true, z: ANNOT_Z + f.index });
    for (const link of doc.links(pv.index)) items.push({ kind: "annot", key: "a" + link.index, label: "Link", bounds: link.rect, objs: [], annot: link.index, uniform: false, resizable: true, z: ANNOT_Z + link.index });
    const objects = doc.pageObjects(pv.index), blockBounds = /* @__PURE__ */ new Map<string, Rect[]>(), blockObjs = /* @__PURE__ */ new Map<string, number[]>();
    for (const obj of objects) {
      if (obj.blockId) {
        (blockBounds.get(obj.blockId) || blockBounds.set(obj.blockId, []).get(obj.blockId))!.push(obj.bounds);
        (blockObjs.get(obj.blockId) || blockObjs.set(obj.blockId, []).get(obj.blockId))!.push(obj.index);
      } else if (obj.type === 3 || obj.type === 5) items.push({ kind: "image", key: "o" + obj.index, label: obj.type === 3 ? "Image" : "Graphic", bounds: obj.bounds, objs: [obj.index], uniform: false, resizable: true, z: obj.index });
    }
    // Rich-text blocks that wrap to a width, by block id.
    const wraps = /* @__PURE__ */ new Map<string, RichText>();
    for (const text of this.v.textsOf(pv)) if (text.margin?.rt) {
      const wrap = decodeRichText(text.margin.rt);
      if (wrap?.width) wraps.set(text.margin.id, wrap);
    }
    for (const [id, bounds] of blockBounds) items.push({ wrap: wraps.get(id), kind: "block", key: "b" + id, label: id.startsWith("hf-") ? "Header / footer" : id === "wm" ? "Watermark" : id === "bg" ? "Background" : "Text", bounds: unionRect(bounds), objs: blockObjs.get(id)!, block: id, uniform: true, resizable: true, z: id === "wm" ? WATERMARK_Z : Math.max(...blockObjs.get(id)!) });
    for (const line of groupTextRuns(this.v.textsOf(pv))) if (!line.block) items.push({ kind: "line", key: "l" + line.objs[0].index, label: "Text", bounds: line.bounds, objs: line.objs.map((o) => o.index), uniform: true, resizable: true, z: Math.max(...line.objs.map((o) => o.index)) });
    const area = (r: Rect) => (r.r - r.l) * (r.t - r.b);
    items.sort((a, b) => area(a.bounds) - area(b.bounds));
    this.items.set(pv.index, items);
    return items;
  }
  /** Drops cached items for one page, or for all pages. */
  invalidate(page?: number | null): void {
    if (page == null) this.items.clear();
    else this.items.delete(page);
  }
  /** Draws hit boxes for every item and the selection frame(s) on a page overlay. */
  overlay(pv: PageView): void {
    this.items.delete(pv.index);
    if (this.cropping) {
      this.cropOverlay(pv);
      return;
    }
    const items = this.itemsOf(pv);
    // Back to front, so the hover title is the item in front.
    for (const item of [...items].sort((a, b) => a.z - b.z)) {
      const box = pv.tf.box(item.bounds);
      pv.ov.append(h("div", { class: "obox", "data-k": item.key, title: item.label, style: { left: box.x - 2 + "px", top: box.y - 2 + "px", width: box.w + 4 + "px", height: box.h + 4 + "px" } }));
    }
    const sel = this.sel;
    if (!sel || sel.page !== pv.index) return;
    this.extra = this.extra.filter((k) => k !== sel.key && items.some((it) => it.key === k));
    const primary = items.find((it) => it.key === sel.key);
    if (!primary) {
      // The primary item is gone (deleted or changed): promote the next one.
      const next = this.extra.shift();
      this.sel = next ? { page: sel.page, key: next } : null;
      if (this.sel) this.overlay(pv);
      return;
    }
    if (this.extra.length) {
      const selected = this.selected(pv);
      for (const item of selected) {
        const box = pv.tf.box(item.bounds);
        pv.ov.append(h("div", { class: "oframe multi" + (item === primary ? " primary" : ""), "data-k": item.key, style: { left: box.x - 2 + "px", top: box.y - 2 + "px", width: box.w + 4 + "px", height: box.h + 4 + "px" } }));
      }
      const group = this.groupBox(pv, selected);
      pv.ov.append(h("div", { class: "ogroup", style: { left: group.x - 5 + "px", top: group.y - 5 + "px", width: group.w + 10 + "px", height: group.h + 10 + "px" } }, h("span", { class: "olabel", text: `${selected.length} objects · ${this.size(pv, group)}` })));
      return;
    }
    pv.ov.append(this.frame(pv, primary, pv.tf.box(primary.bounds)));
  }
  /** The selected items (primary first), looked up on `pv` or the selection's page view. */
  selected(pv?: PageView): ArrangeItem[] {
    const sel = this.sel;
    if (!sel) return [];
    pv ??= this.v.views[sel.page];
    if (!pv || pv.index !== sel.page) return [];
    const items = this.itemsOf(pv);
    return [sel.key, ...this.extra].map((k) => items.find((it) => it.key === k)).filter((it) => !!it) as ArrangeItem[];
  }
  /** Bounding box (overlay pixels) of several items. */
  groupBox(pv: PageView, items: ArrangeItem[]): Box {
    const boxes = items.map((it) => pv.tf.box(it.bounds)), left = Math.min(...boxes.map((b) => b.x)), top = Math.min(...boxes.map((b) => b.y)), right = Math.max(...boxes.map((b) => b.x + b.w)), bottom = Math.max(...boxes.map((b) => b.y + b.h));
    return { x: left, y: top, w: right - left, h: bottom - top };
  }
  /**
   * Shift/Ctrl-click: adds `key` to the selection (it becomes the primary item) or removes it.
   * Clicking an item on another page starts a new selection there.
   */
  toggle(pv: PageView, key: string): void {
    const sel = this.sel;
    if (!sel || sel.page !== pv.index) {
      this.sel = { page: pv.index, key: key };
      this.extra = [];
    } else if (sel.key === key) {
      const next = this.extra.shift();
      this.sel = next ? { page: pv.index, key: next } : null;
    } else if (this.extra.includes(key)) this.extra = this.extra.filter((k) => k !== key);
    else {
      this.extra.push(sel.key);
      this.sel = { page: pv.index, key: key };
    }
    this.refresh();
    this.onChange();
  }
  /** Selects everything on the current page except watermarks, backgrounds and headers/footers. */
  selectAll(): void {
    const pv = this.v.views[this.sel?.page ?? this.app.currentPage];
    if (!pv) return;
    const items = this.itemsOf(pv).filter((it) => it.kind !== "block" || !/^(wm|bg|hf-)/.test(it.block || ""));
    if (items.length) {
      this.sel = { page: pv.index, key: items[0].key };
      this.extra = items.slice(1).map((it) => it.key);
      this.refresh();
      this.onChange();
    }
  }
  clear(): void {
    if (this.sel) {
      this.sel = null;
      this.extra = [];
      this.refresh();
      this.onChange();
    }
  }
  /** Selection frame for a single item: size label, resize handles and end-point handles ("p0"/"p1"). */
  frame(pv: PageView, item: ArrangeItem, box: Box): HTMLElement {
    const el = h("div", { class: "oframe" + (item.resizable ? "" : " fixed"), "data-k": item.key, style: { left: box.x - 2 + "px", top: box.y - 2 + "px", width: box.w + 4 + "px", height: box.h + 4 + "px" } }, h("span", { class: "olabel", text: `${item.label} · ${this.size(pv, box)}` }));
    if (item.resizable) {
      for (const handle of HANDLES) {
        // Uniform items get corner handles only; wrapping text also gets the side handles that reflow it.
        if (!(item.uniform && handle.length === 1 && !(item.wrap && (handle === "e" || handle === "w")))) el.append(h("span", { class: "ohandle " + handle, "data-h": handle }));
      }
    }
    (item.line || (item.ft?.tip ? [item.ft.tip] : [])).forEach((p, i) => {
      const [px, py] = pv.tf.apply(p.x, p.y);
      el.append(h("span", { class: "ohandle pt", "data-h": "p" + i, style: { left: px - box.x + 2 - 6 + "px", top: py - box.y + 2 - 6 + "px" } }));
    });
    return el;
  }
  /** "W × H pt" for an overlay-pixel box. */
  size(_pv: PageView, box: Box): string {
    const zoom = this.v.zoom;
    return `${Math.round(box.w / zoom)} × ${Math.round(box.h / zoom)} pt`;
  }
  /**
   * Pointer down with the tool: picks the item under the pointer (lines by distance to the segment),
   * then toggles it (modifier), drags the group, drags an end point, or moves/resizes the item. Empty space
   * starts a marquee.
   */
  down(ev: PointerEvent, pv: PageView): void {
    const handle = (ev.target as HTMLElement).closest<HTMLElement>(".ohandle"), items = this.itemsOf(pv);
    let hit: ArrangeItem | undefined;
    if (handle && this.sel?.page === pv.index) hit = items.find((it) => it.key === this.sel!.key);
    else {
      const ovRect = pv.ov.getBoundingClientRect(), stack = this.stackAt(pv, ev.clientX - ovRect.left, ev.clientY - ovRect.top);
      // Alt-click reaches what's behind: the item below the selected one in the stack under the pointer.
      const below = ev.altKey && this.sel?.page === pv.index ? stack.findIndex((it) => it.key === this.sel!.key) : -1;
      hit = below >= 0 ? stack[(below + 1) % stack.length] : stack[0];
    }
    const additive = ev.shiftKey || ev.ctrlKey || ev.metaKey;
    if (!hit) {
      ev.preventDefault();
      if (!additive && this.sel) {
        this.sel = null;
        this.extra = [];
        this.refresh();
        this.onChange();
      }
      this.marquee(ev, pv, additive);
      return;
    }
    ev.preventDefault();
    if (additive && !handle) {
      this.toggle(pv, hit.key);
      return;
    }
    if (!handle && this.extra.length && this.sel?.page === pv.index && (this.sel.key === hit.key || this.extra.includes(hit.key))) {
      this.dragGroup(ev, pv);
      return;
    }
    if (this.sel?.page !== pv.index || this.sel.key !== hit.key || this.extra.length) {
      this.sel = { page: pv.index, key: hit.key };
      this.extra = [];
      this.refresh();
      this.onChange();
    }
    const frameEl = pv.ov.querySelector<HTMLElement>(".oframe");
    if (frameEl) {
      if ((hit.line || hit.ft?.tip) && handle && /^p[01]$/.test(handle.dataset.h!)) return this.dragEnd(ev, pv, hit, +handle.dataset.h![1]);
      this.drag(ev, pv, hit, frameEl, handle?.dataset.h || null);
    }
  }
  /**
   * The items under an overlay point, front to back: the one drawn on top first (annotations above page
   * content, later page objects above earlier ones, the watermark behind everything else). Lines count within
   * 7 px of their segment, other items within 3 px of their box.
   */
  stackAt(pv: PageView, px: number, py: number): ArrangeItem[] {
    return this.itemsOf(pv).filter((it) => {
      if (it.line) return distToSegment(px, py, pv.tf.apply(it.line[0].x, it.line[0].y), pv.tf.apply(it.line[1].x, it.line[1].y)) < 7;
      const box = pv.tf.box(it.bounds);
      return px >= box.x - 3 && px <= box.x + box.w + 3 && py >= box.y - 3 && py <= box.y + box.h + 3;
    }).sort((a, b) => b.z - a.z);
  }
  /**
   * Moves (handle null) or resizes (handle "n", "se", …) one item, previewing on its frame. Moves snap the
   * item's edges and centre to the page and to other items unless Alt is held; corner resizes keep the
   * aspect ratio (always for uniform items, otherwise unless Shift is held). Commits through `apply`.
   */
  drag(ev: PointerEvent, pv: PageView, item: ArrangeItem, frameEl: HTMLElement, handle: string | null): void {
    const ov = pv.ov;
    ov.setPointerCapture(ev.pointerId);
    const start = pv.tf.box(item.bounds), startX = ev.clientX, startY = ev.clientY, pageW = pv.w * this.v.zoom, pageH = pv.h * this.v.zoom, others = this.itemsOf(pv).filter((it) => it !== item).map((it) => pv.tf.box(it.bounds)), snapXs = [0, pageW / 2, pageW, ...others.flatMap((b) => [b.x, b.x + b.w / 2, b.x + b.w])], snapYs = [0, pageH / 2, pageH, ...others.flatMap((b) => [b.y, b.y + b.h / 2, b.y + b.h])];
    let box: Box = { ...start }, moved = false;
    const guides = h("div", { class: "oguides" });
    ov.append(guides);
    const label = frameEl.querySelector(".olabel"), onMove = (e: PointerEvent) => {
      const dx = e.clientX - startX, dy = e.clientY - startY;
      // Ignore jitter under 2 px until the drag has started.
      if (!(!moved && Math.hypot(dx, dy) < 2)) {
        moved = true;
        guides.replaceChildren();
        if (handle) {
          let { x: left, y: top, w: width, h: height } = start;
          if (handle.includes("e")) width = Math.max(6, start.w + dx);
          if (handle.includes("w")) {
            width = Math.max(6, start.w - dx);
            left = start.x + start.w - width;
          }
          if (handle.includes("s")) height = Math.max(6, start.h + dy);
          if (handle.includes("n")) {
            height = Math.max(6, start.h - dy);
            top = start.y + start.h - height;
          }
          if (item.wrap && handle.length === 1) {
            // Side handles on wrapping text change only its width.
            height = start.h;
            top = start.y;
          } else if (handle.length === 2 && (item.uniform || !e.shiftKey)) {
            const scale = Math.max(width / start.w, height / start.h);
            width = start.w * scale;
            height = start.h * scale;
            if (handle.includes("w")) left = start.x + start.w - width;
            if (handle.includes("n")) top = start.y + start.h - height;
          }
          box = { x: left, y: top, w: width, h: height };
        } else {
          box = { ...start, x: start.x + dx, y: start.y + dy };
          if (!e.altKey) box = this.snap(box, snapXs, snapYs, guides);
        }
        Object.assign(frameEl.style, { left: box.x - 2 + "px", top: box.y - 2 + "px", width: box.w + 4 + "px", height: box.h + 4 + "px" });
        if (label) label.textContent = `${item.label} · ${this.size(pv, box)}`;
      }
    }, onUp = () => {
      ov.removeEventListener("pointermove", onMove);
      ov.removeEventListener("pointerup", onUp);
      ov.removeEventListener("pointercancel", onUp);
      guides.remove();
      if (moved) this.apply(pv, item, start, box);
    };
    ov.addEventListener("pointermove", onMove);
    ov.addEventListener("pointerup", onUp);
    ov.addEventListener("pointercancel", onUp);
  }
  /**
   * Rubber-band selection: selects the items whose centre falls inside the rectangle (not watermarks,
   * backgrounds or headers/footers). With `additive` they are added to the current selection.
   */
  marquee(ev: PointerEvent, pv: PageView, additive: boolean): void {
    const ov = pv.ov;
    ov.setPointerCapture(ev.pointerId);
    const ovRect = ov.getBoundingClientRect(), startX = ev.clientX - ovRect.left, startY = ev.clientY - ovRect.top;
    let band: Box | null = null;
    const onMove = (e: PointerEvent) => {
      const px = e.clientX - ovRect.left, py = e.clientY - ovRect.top;
      band = { x: Math.min(startX, px), y: Math.min(startY, py), w: Math.abs(px - startX), h: Math.abs(py - startY) };
      if (band.w < 3 && band.h < 3) return;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      for (const [name, value] of Object.entries({ x: band.x, y: band.y, width: band.w, height: band.h })) rect.setAttribute(name, String(value));
      rect.setAttribute("class", "omarquee");
      pv.svg.replaceChildren(rect);
    }, onUp = () => {
      ov.removeEventListener("pointermove", onMove);
      ov.removeEventListener("pointerup", onUp);
      ov.removeEventListener("pointercancel", onUp);
      pv.svg.replaceChildren();
      if (!band || band.w < 3 && band.h < 3) return;
      const b: Box = band, inside = this.itemsOf(pv).filter((it) => {
        const box = pv.tf.box(it.bounds), cx = box.x + box.w / 2, cy = box.y + box.h / 2;
        return cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h;
      }).filter((it) => it.kind !== "block" || !/^(wm|bg|hf-)/.test(it.block || ""));
      if (!inside.length) return;
      const keys = new Set(additive && this.sel?.page === pv.index ? [this.sel.key, ...this.extra] : []);
      for (const it of inside) keys.add(it.key);
      const list = [...keys];
      this.sel = { page: pv.index, key: list[0] };
      this.extra = list.slice(1);
      this.refresh();
      this.onChange();
    };
    ov.addEventListener("pointermove", onMove);
    ov.addEventListener("pointerup", onUp);
    ov.addEventListener("pointercancel", onUp);
  }
  /** Drags the whole multi-selection (with snapping of the group box unless Alt is held); commits through `moveGroup`. */
  dragGroup(ev: PointerEvent, pv: PageView): void {
    const ov = pv.ov;
    ov.setPointerCapture(ev.pointerId);
    const selected = this.selected(pv), group = this.groupBox(pv, selected), startX = ev.clientX, startY = ev.clientY, pageW = pv.w * this.v.zoom, pageH = pv.h * this.v.zoom, others = this.itemsOf(pv).filter((it) => !selected.includes(it)).map((it) => pv.tf.box(it.bounds)), snapXs = [0, pageW / 2, pageW, ...others.flatMap((b) => [b.x, b.x + b.w / 2, b.x + b.w])], snapYs = [0, pageH / 2, pageH, ...others.flatMap((b) => [b.y, b.y + b.h / 2, b.y + b.h])], guides = h("div", { class: "oguides" });
    ov.append(guides);
    const frames = [...ov.querySelectorAll<HTMLElement>(".oframe.multi, .ogroup")];
    let dx = 0, dy = 0, moved = false;
    const onMove = (e: PointerEvent) => {
      dx = e.clientX - startX;
      dy = e.clientY - startY;
      if (!(!moved && Math.hypot(dx, dy) < 2)) {
        moved = true;
        guides.replaceChildren();
        if (!e.altKey) {
          const snapped = this.snap({ ...group, x: group.x + dx, y: group.y + dy }, snapXs, snapYs, guides);
          dx = snapped.x - group.x;
          dy = snapped.y - group.y;
        }
        for (const f of frames) f.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    }, onUp = () => {
      ov.removeEventListener("pointermove", onMove);
      ov.removeEventListener("pointerup", onUp);
      ov.removeEventListener("pointercancel", onUp);
      guides.remove();
      if (moved) this.moveGroup(pv, selected, dx, dy);
    };
    ov.addEventListener("pointermove", onMove);
    ov.addEventListener("pointerup", onUp);
    ov.addEventListener("pointercancel", onUp);
  }
  /**
   * Snaps a box's near edge, centre or far edge to the closest of `xs` / `ys` within SNAP_PX, appending a
   * guide line to `guides` for each axis that snapped.
   */
  snap(box: Box, xs: number[], ys: number[], guides: HTMLElement): Box {
    const snapAxis = (pos: number, size: number, targets: number[], vertical: boolean) => {
      let best = SNAP_PX + 1, snapped = pos, guideAt = -1;
      for (const offset of [0, size / 2, size]) for (const target of targets) {
        const dist = Math.abs(pos + offset - target);
        if (dist < best) {
          best = dist;
          snapped = target - offset;
          guideAt = target;
        }
      }
      if (guideAt >= 0) guides.append(h("div", { class: "oguide " + (vertical ? "v" : "h"), style: vertical ? { left: guideAt + "px" } : { top: guideAt + "px" } }));
      return snapped;
    };
    return { ...box, x: snapAxis(box.x, box.w, xs, true), y: snapAxis(box.y, box.h, ys, false) };
  }
  /** The PDF-space matrix that maps overlay box `from` onto `to` on this page. */
  pageMap(pv: PageView, from: Box, to: Box): Matrix {
    const sx = to.w / from.w, sy = to.h / from.h, screen = new Affine(sx, 0, 0, sy, to.x - from.x * sx, to.y - from.y * sy), m = mulAffine(pv.inv, mulAffine(screen, pv.tf));
    return [m.a, m.b, m.c, m.d, m.e, m.f];
  }
  /** Moves one item by (dx, dy) overlay pixels. Call inside a mutation. */
  moveItem(pv: PageView, item: ArrangeItem, dx: number, dy: number): void {
    const doc = this.app.doc, page = pv.index;
    if (item.kind === "annot") {
      const origin = pv.inv.apply(0, 0), moved = pv.inv.apply(dx, dy);
      doc.moveAnnot(page, item.annot!, moved[0] - origin[0], moved[1] - origin[1]);
      return;
    }
    const box = pv.tf.box(item.bounds), m = this.pageMap(pv, box, { ...box, x: box.x + dx, y: box.y + dy });
    if (item.kind === "block") doc.transformBlock(page, item.block!, m, 1);
    else doc.transformObjects(page, item.objs, m);
  }
  /**
   * Resizes one item from overlay box `from` to `to` (uniform items keep their aspect ratio). Returns false for
   * items that can't be resized this way (text boxes, lines, notes). Call inside a mutation.
   */
  resizeItem(pv: PageView, item: ArrangeItem, from: Box, to: Box): boolean {
    const doc = this.app.doc, page = pv.index;
    if (!item.resizable || item.ft || item.line) return false;
    if (item.uniform) {
      const scale = to.w / from.w !== 1 ? to.w / from.w : to.h / from.h;
      to = { x: to.x, y: to.y, w: from.w * scale, h: from.h * scale };
    }
    if (item.kind === "annot") {
      const c = [pv.inv.apply(to.x, to.y), pv.inv.apply(to.x + to.w, to.y + to.h)];
      doc.resizeAnnot(page, item.annot!, { l: Math.min(c[0][0], c[1][0]), r: Math.max(c[0][0], c[1][0]), b: Math.min(c[0][1], c[1][1]), t: Math.max(c[0][1], c[1][1]) });
      return true;
    }
    const m = this.pageMap(pv, from, to);
    if (item.kind === "block") doc.transformBlock(page, item.block!, m, item.uniform ? to.w / from.w : 1);
    else doc.transformObjects(page, item.objs, m);
    return true;
  }
  /** Moves several items by (dx, dy) overlay pixels as one undo step. */
  moveGroup(pv: PageView, items: ArrangeItem[], dx: number, dy: number, label = `Move ${items.length} objects`): void {
    if (dx || dy) {
      this.app.mutate(label, { pages: [pv.index] }, () => {
        for (const item of items) this.moveItem(pv, item, dx, dy);
      }).catch((err) => toast(err.message, "err"));
    }
  }
  /** Aligns the selection to its group box, or a single item to the page. */
  align(edge: AlignEdge): void {
    const items = this.selected();
    if (!items.length) return;
    const pv = this.v.views[this.sel!.page], target = items.length === 1 ? { x: 0, y: 0, w: pv.w * this.v.zoom, h: pv.h * this.v.zoom } : this.groupBox(pv, items), names: Record<AlignEdge, string> = { left: "left", hcenter: "centre", right: "right", top: "top", vmiddle: "middle", bottom: "bottom" };
    this.app.mutate(items.length === 1 ? `Align to page ${names[edge]}` : `Align ${names[edge]}`, { pages: [pv.index] }, () => {
      for (const item of items) {
        const box = pv.tf.box(item.bounds);
        let dx = 0, dy = 0;
        if (edge === "left") dx = target.x - box.x;
        else if (edge === "right") dx = target.x + target.w - (box.x + box.w);
        else if (edge === "hcenter") dx = target.x + target.w / 2 - (box.x + box.w / 2);
        else if (edge === "top") dy = target.y - box.y;
        else if (edge === "bottom") dy = target.y + target.h - (box.y + box.h);
        else dy = target.y + target.h / 2 - (box.y + box.h / 2);
        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) this.moveItem(pv, item, dx, dy);
      }
    }).catch((err) => toast(err.message, "err"));
  }
  /** Spaces three or more items evenly across ("h") or down ("v"), keeping the outermost two in place. */
  distribute(axis: "h" | "v") {
    const items = this.selected();
    if (items.length < 3) return toast("Select three or more objects to distribute them", "warn");
    const pv = this.v.views[this.sel!.page], entries = items.map((it) => ({ it: it, b: pv.tf.box(it.bounds) as Box })), pos = (b: Box) => axis === "h" ? b.x : b.y, len = (b: Box) => axis === "h" ? b.w : b.h;
    entries.sort((p, q) => pos(p.b) + len(p.b) / 2 - (pos(q.b) + len(q.b) / 2));
    const first = pos(entries[0].b), gap = (pos(entries[entries.length - 1].b) + len(entries[entries.length - 1].b) - first - entries.reduce((sum, e) => sum + len(e.b), 0)) / (entries.length - 1);
    this.app.mutate(axis === "h" ? "Distribute across" : "Distribute down", { pages: [pv.index] }, () => {
      let at = first;
      for (const { it, b } of entries) {
        const d = at - pos(b);
        if (Math.abs(d) > 0.01) this.moveItem(pv, it, axis === "h" ? d : 0, axis === "v" ? d : 0);
        at += len(b) + gap;
      }
    }).catch((err) => toast(err.message, "err"));
  }
  /** Gives the other selected items the width ("w"), height ("h") or both of the primary (last clicked) item. */
  matchSize(dim: "w" | "h" | "both") {
    const items = this.selected();
    if (items.length < 2) return toast("Select two or more objects; the others take the size of the one you clicked last", "warn");
    const pv = this.v.views[this.sel!.page], ref = pv.tf.box(items[0].bounds);
    let kept = 0;
    this.app.mutate(dim === "w" ? "Match width" : dim === "h" ? "Match height" : "Match size", { pages: [pv.index] }, () => {
      for (const item of items.slice(1)) {
        const box = pv.tf.box(item.bounds), to = { x: box.x, y: box.y, w: dim === "h" ? box.w : ref.w, h: dim === "w" ? box.h : ref.h };
        if (!this.resizeItem(pv, item, box, to)) kept++;
      }
    }).then(() => {
      if (kept) toast(`${kept} object${kept === 1 ? "" : "s"} (text boxes, lines or notes) kept ${kept === 1 ? "its" : "their"} size`, "warn");
    }).catch((err) => toast(err.message, "err"));
  }
  /** Changes the stacking order of the selection; clears the selection afterwards. */
  restack(dir: RestackMode): void {
    const items = this.selected();
    if (!items.length) return;
    const page = this.sel!.page, objs = items.filter((it) => it.kind !== "annot").flatMap((it) => it.objs), annots = items.filter((it) => it.kind === "annot").map((it) => it.annot!), labels: Record<RestackMode, string> = { front: "Bring to front", back: "Send to back", forward: "Bring forward", backward: "Send backward" };
    let changed = false;
    this.app.mutate(labels[dir], { pages: [page] }, () => {
      if (objs.length && this.app.doc.restackObjects(page, objs, dir)) changed = true;
      if (annots.length && this.app.doc.restackAnnots(page, annots, dir)) changed = true;
      if (!changed) throw new Error(dir === "front" || dir === "forward" ? "Already in front of what it overlaps" : "Already behind what it overlaps");
    }).then(() => {
      this.sel = null;
      this.extra = [];
      this.refresh();
      this.onChange();
    }).catch((err) => toast(err.message, "warn"));
  }
  /**
   * Drags end point `which` (0 or 1) of a line, or the tip of a callout. Shift snaps the angle to 45°
   * steps around the other end (the box centre for callouts).
   */
  dragEnd(ev: PointerEvent, pv: PageView, item: ArrangeItem, which: number): void {
    const ov = pv.ov;
    ov.setPointerCapture(ev.pointerId);
    const ft = item.ft, anchor: Pt = ft ? { x: (ft.box.l + ft.box.r) / 2, y: (ft.box.t + ft.box.b) / 2 } : item.line![1 - which];
    let end: Pt = ft ? ft.tip! : item.line![which], moved = false;
    const svg = pv.svg, onMove = (e: PointerEvent) => {
      const ovRect = ov.getBoundingClientRect(), [px, py] = pv.inv.apply(e.clientX - ovRect.left, e.clientY - ovRect.top);
      end = { x: px, y: py };
      if (e.shiftKey) {
        const dx = px - anchor.x, dy = py - anchor.y, dist = Math.hypot(dx, dy), angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4);
        end = { x: anchor.x + dist * Math.cos(angle), y: anchor.y + dist * Math.sin(angle) };
      }
      moved = true;
      const [ax, ay] = pv.tf.apply(anchor.x, anchor.y), [ex, ey] = pv.tf.apply(end.x, end.y);
      svg.replaceChildren(dashedLine(ax, ay, ex, ey));
    }, onUp = () => {
      ov.removeEventListener("pointermove", onMove);
      ov.removeEventListener("pointerup", onUp);
      ov.removeEventListener("pointercancel", onUp);
      svg.replaceChildren();
      if (!moved || Math.hypot(end.x - anchor.x, end.y - anchor.y) < 2) return;
      if (ft) {
        this.onFreeText(pv.index, item.annot!, (d) => ({ ...d, tip: end }), "Point callout");
        return;
      }
      const [p1, p2] = which === 0 ? [end, anchor] : [anchor, end];
      this.app.mutate("Edit line", { pages: [pv.index] }, () => this.app.doc.setLinePoints(pv.index, item.annot!, p1, p2)).catch((err) => toast(err.message, "err"));
    };
    ov.addEventListener("pointermove", onMove);
    ov.addEventListener("pointerup", onUp);
    ov.addEventListener("pointercancel", onUp);
  }
  /**
   * Commits a move/resize of one item from overlay box `from` to `to`. A width-only change of wrapping text
   * reflows it to the new width; text boxes go through `onFreeText`; annotations are moved or resized;
   * page objects and blocks are transformed.
   */
  apply(pv: PageView, item: ArrangeItem, from: Box, to: Box): void {
    const sx = to.w / from.w, sy = to.h / from.h, screen = new Affine(sx, 0, 0, sy, to.x - from.x * sx, to.y - from.y * sy), pm = mulAffine(pv.inv, mulAffine(screen, pv.tf)), matrix = [pm.a, pm.b, pm.c, pm.d, pm.e, pm.f], resized = Math.abs(sx - 1) > 1e-3 || Math.abs(sy - 1) > 1e-3, label = resized ? `Resize ${item.label.toLowerCase()}` : `Move ${item.label.toLowerCase()}`, doc = this.app.doc, page = pv.index;
    if (item.wrap && Math.abs(sy - 1) < 1e-3 && Math.abs(sx - 1) > 1e-3) {
      // Reflow: new width in text units (overlay px / (px per pt × block scale)), and shift the block matrix
      // by the left edge's move in page space.
      const wrap = item.wrap, blockScale = Math.hypot(wrap.bm[0], wrap.bm[1]) || 1, dx = to.x - from.x, p0 = pv.inv.apply(from.x, from.y), p1 = pv.inv.apply(from.x + dx, from.y), pxPerUnit = (pv.ov.clientWidth / pv.w || this.v.zoom) * blockScale, next = { ...wrap, width: Math.max(12, wrap.width! + (to.w - from.w) / pxPerUnit), bm: [wrap.bm[0], wrap.bm[1], wrap.bm[2], wrap.bm[3], wrap.bm[4] + (p1[0] - p0[0]), wrap.bm[5] + (p1[1] - p0[1])] };
      this.app.mutate("Reflow text", { pages: [page] }, async () => {
        removeById(doc, page, item.block!);
        await writeRichText(doc, page, next, item.block!);
      }).catch((err) => toast(err.message, "err"));
      return;
    }
    if (item.ft) {
      const c = [pv.inv.apply(to.x, to.y), pv.inv.apply(to.x + to.w, to.y + to.h)], box = { l: Math.min(c[0][0], c[1][0]), r: Math.max(c[0][0], c[1][0]), b: Math.min(c[0][1], c[1][1]), t: Math.max(c[0][1], c[1][1]) };
      this.onFreeText(page, item.annot!, (d) => ({ ...d, box: box }), label);
      return;
    }
    this.app.mutate(label, { pages: [page] }, () => {
      if (item.kind === "annot") {
        if (resized) {
          const c = [pv.inv.apply(to.x, to.y), pv.inv.apply(to.x + to.w, to.y + to.h)];
          doc.resizeAnnot(page, item.annot!, { l: Math.min(c[0][0], c[1][0]), r: Math.max(c[0][0], c[1][0]), b: Math.min(c[0][1], c[1][1]), t: Math.max(c[0][1], c[1][1]) });
        } else {
          const a = pv.inv.apply(from.x, from.y), b = pv.inv.apply(to.x, to.y);
          doc.moveAnnot(page, item.annot!, b[0] - a[0], b[1] - a[1]);
        }
      } else if (item.kind === "block") doc.transformBlock(page, item.block!, matrix, item.uniform ? sx : 1);
      else doc.transformObjects(page, item.objs, matrix);
    }).catch((err) => toast(err.message, "err"));
  }
  /** Arrow keys: moves the selection by (dx, dy) points. Returns false when nothing is selected. */
  nudge(dx: number, dy: number): boolean {
    const sel = this.sel;
    if (!sel) return false;
    if (this.extra.length) {
      const pv = this.v.views[sel.page], zoom = this.v.zoom;
      this.moveGroup(pv, this.selected(pv), dx * zoom, dy * zoom);
      return true;
    }
    const pv = this.v.views[sel.page], item = pv && this.itemsOf(pv).find((it) => it.key === sel.key);
    if (!item) return false;
    const box = pv.tf.box(item.bounds), zoom = this.v.zoom;
    this.apply(pv, item, box, { ...box, x: box.x + dx * zoom, y: box.y + dy * zoom });
    return true;
  }
  /** Deletes `items` on `page` as one undo step (dropping them from the selection first). */
  removeItems(page: number, items: ArrangeItem[], label: string) {
    const doc = this.app.doc, annots = items.filter((it) => it.kind === "annot").map((it) => it.annot!).sort((a, b) => b - a), objs = items.filter((it) => it.kind !== "annot").flatMap((it) => it.objs);
    if (this.sel?.page === page) {
      const keys = new Set(items.map((it) => it.key));
      if (keys.has(this.sel.key)) this.sel = null;
      this.extra = this.extra.filter((k) => !keys.has(k));
      if (!this.sel && this.extra.length) this.sel = { page: page, key: this.extra.shift()! };
    }
    return this.app.mutate(label, { pages: [page] }, () => {
      // Highest index first, so earlier deletions don't shift later ones.
      for (const a of annots) doc.deleteAnnot(page, a);
      if (objs.length) removeObjects(doc, page, objs);
    });
  }
  /** Deletes the selection. Returns false when nothing is selected. */
  remove(): boolean {
    const sel = this.sel;
    if (!sel) return false;
    if (this.extra.length) {
      const items = this.selected(), doc = this.app.doc, page = sel.page;
      this.sel = null;
      this.extra = [];
      const annots = items.filter((it) => it.kind === "annot").map((it) => it.annot!).sort((a, b) => b - a), objs = items.filter((it) => it.kind !== "annot").flatMap((it) => it.objs);
      this.app.mutate(`Delete ${items.length} objects`, { pages: [page] }, () => {
        for (const a of annots) doc.deleteAnnot(page, a);
        if (objs.length) removeObjects(doc, page, objs);
      }).catch((err) => toast(err.message, "err"));
      return true;
    }
    const pv = this.v.views[sel.page], item = pv && this.itemsOf(pv).find((it) => it.key === sel.key);
    if (!item) return false;
    const doc = this.app.doc, page = sel.page;
    this.sel = null;
    this.app.mutate(`Delete ${item.label.toLowerCase()}`, { pages: [page] }, () => {
      if (item.kind === "annot") doc.deleteAnnot(page, item.annot!);
      else removeObjects(doc, page, item.objs);
    }).catch((err) => toast(err.message, "err"));
    return true;
  }
  /** Annotations (except links and form fields) and images can be duplicated / copied. */
  canDuplicate(item: ArrangeItem): boolean {
    return item.kind === "annot" ? item.label !== "Link" && item.label !== "Form field" : item.kind === "image" && item.label === "Image";
  }
  /**
   * Clipboard data for `items` on `page`: the copyable items, their combined bounds and how many were
   * skipped. Null when nothing could be copied.
   */
  clipOf(page: number, items: ArrangeItem[] = this.selected()): { items: ClipObj[]; bounds: Rect; skipped: number } | null {
    const copyable = items.filter((it) => this.canDuplicate(it)), notCopyable = items.length - copyable.length;
    if (!copyable.length) return null;
    const { items: clip, skipped } = this.app.doc.readClip(page, copyable.filter((it) => it.kind === "annot").map((it) => it.annot!), copyable.filter((it) => it.kind === "image").flatMap((it) => it.objs));
    return clip.length ? { items: clip, bounds: unionRect(copyable.map((it) => it.bounds)), skipped: notCopyable + skipped } : null;
  }
  /**
   * Writes clipboard items onto `page`, offset by (dx, dy) points, as one undo step labelled `label`.
   * Text boxes are recreated (so their appearance is regenerated). Selects what was pasted when the tool is
   * active; returns the new item keys.
   */
  async paste(page: number, clip: ClipObj[], dx: number, dy: number, label: string): Promise<string[]> {
    const doc = this.app.doc, author = this.app.settings.author;
    let keys: string[] = [];
    try {
      await this.app.mutate(label, { pages: [page] }, async () => {
        keys = doc.writeClip(page, clip, dx, dy, author);
        for (const c of clip) {
          if (c.t !== "ft") continue;
          const d = c.data, annot = doc.createFreeText(page, author);
          await renderFreeText(doc, page, annot, { ...d, box: { l: d.box.l + dx, r: d.box.r + dx, t: d.box.t + dy, b: d.box.b + dy }, tip: d.tip ? { x: d.tip.x + dx, y: d.tip.y + dy } : undefined });
          keys.push("a" + annot);
        }
      });
    } catch (err) {
      toast((err as Error).message, "err");
      return [];
    }
    if (this.app.tool === "arrange" && keys.length) {
      this.invalidate(page);
      this.sel = { page: page, key: keys[0] };
      this.extra = keys.slice(1);
      this.refresh();
      this.onChange();
    }
    return keys;
  }
  /** A screen offset of (dx, dy) pixels down-right converted to a PDF-space offset on `page`. */
  screenOffset(page: number, dx = 12, dy = dx): [number, number] {
    const pv = this.v.views[page];
    if (!pv) return [dx, -dy];
    const zoom = this.v.zoom, origin = pv.inv.apply(0, 0), p = pv.inv.apply(dx * zoom, dy * zoom);
    return [p[0] - origin[0], p[1] - origin[1]];
  }
  /** Duplicates `items` on `page`, slightly offset. Returns the new item keys. */
  async duplicate(page: number, items: ArrangeItem[] = this.selected()): Promise<string[]> {
    const clip = this.clipOf(page, items);
    if (!clip) {
      toast("Only annotations and pictures can be duplicated", "warn");
      return [];
    }
    if (clip.skipped) toast(`${clip.skipped} object${clip.skipped === 1 ? "" : "s"} (text, links, form fields or markup) ${clip.skipped === 1 ? "wasn’t" : "weren’t"} duplicated`, "warn");
    const [dx, dy] = this.screenOffset(page);
    return this.paste(page, clip.items, dx, dy, clip.items.length > 1 ? `Duplicate ${clip.items.length} objects` : "Duplicate");
  }
  /** The item for annotation `annot` on `page` (re-reading the page unless the tool is active), or null. */
  itemOfAnnot(page: number, annot: number): ArrangeItem | null {
    const pv = this.v.views[page];
    if (!pv) return null;
    if (this.app.tool !== "arrange") this.items.delete(page);
    return this.itemsOf(pv).find((it) => it.key === "a" + annot) || null;
  }
  /** The single selected item, or null when nothing or several are selected. */
  current(): ArrangeItem | null {
    const sel = this.sel;
    if (!sel || this.extra.length) return null;
    const pv = this.v.views[sel.page];
    return pv && this.itemsOf(pv).find((it) => it.key === sel.key) || null;
  }
  /** Rotates (90° left/right) or flips the selected image about its centre. */
  turn(mode: "rotl" | "rotr" | "fliph" | "flipv"): void {
    const sel = this.sel, item = this.current();
    if (!sel || !item || item.kind !== "image") return;
    const pv = this.v.views[sel.page], box = pv.tf.box(item.bounds), cx = box.x + box.w / 2, cy = box.y + box.h / 2, op = mode === "rotl" ? new Affine(0, -1, 1, 0, 0, 0) : mode === "rotr" ? new Affine(0, 1, -1, 0, 0, 0) : mode === "fliph" ? new Affine(-1, 0, 0, 1, 0, 0) : new Affine(1, 0, 0, -1, 0, 0), aboutCentre = mulAffine(new Affine(1, 0, 0, 1, cx, cy), mulAffine(op, new Affine(1, 0, 0, 1, -cx, -cy))), m = mulAffine(pv.inv, mulAffine(aboutCentre, pv.tf)), label = { rotl: "Rotate image left", rotr: "Rotate image right", fliph: "Flip image", flipv: "Flip image" }[mode];
    this.app.mutate(label, { pages: [sel.page] }, () => this.app.doc.transformObjects(sel.page, item.objs, [m.a, m.b, m.c, m.d, m.e, m.f])).catch((err) => toast(err.message, "err"));
  }
  /** Enters image crop mode for the selected image. */
  startCrop(): void {
    const sel = this.sel, item = this.current();
    if (!sel || !item || item.kind !== "image" || item.label !== "Image") return;
    this.cropping = { page: sel.page, key: sel.key, obj: item.objs[0], f: { x0: 0, y0: 0, x1: 1, y1: 1 } };
    this.refresh();
    this.onChange();
  }
  cancelCrop(): void {
    this.cropping = null;
    this.refresh();
    this.onChange();
  }
  /**
   * Applies the image crop: cuts the kept pixels out, re-encodes them with `encode` (told whether the
   * original was a JPEG) and shrinks the image matrix to the kept part, so the cut part leaves the file.
   */
  async applyCrop(encode: (rgba: Uint8ClampedArray, w: number, h: number, jpeg: boolean) => Promise<ImageSrc> | ImageSrc): Promise<void> {
    const crop = this.cropping;
    if (!crop) return;
    this.cropping = null;
    const { x0, y0, x1, y1 } = crop.f;
    if (x1 - x0 > 0.995 && y1 - y0 > 0.995) {
      this.refresh();
      this.onChange();
      return;
    }
    const doc = this.app.doc, info = doc.imageInfo(crop.page, crop.obj), px = doc.imagePixels(crop.page, crop.obj);
    if (!info || !px) {
      toast("This image can’t be cropped", "err");
      return;
    }
    // Pixel rows run top-down while the fractions are y-up.
    const left = Math.max(0, Math.floor(x0 * px.w)), right = Math.min(px.w, Math.ceil(x1 * px.w)), top = Math.max(0, Math.floor((1 - y1) * px.h)), bottom = Math.min(px.h, Math.ceil((1 - y0) * px.h)), w = Math.max(1, right - left), h = Math.max(1, bottom - top), rgba = new Uint8ClampedArray(w * h * 4);
    for (let row = 0; row < h; row++) rgba.set(px.rgba.subarray(((top + row) * px.w + left) * 4, ((top + row) * px.w + left + w) * 4), row * w * 4);
    const src = await encode(rgba, w, h, info.jpeg), fx0 = left / px.w, fx1 = (left + w) / px.w, fy0 = 1 - (top + h) / px.h, fy1 = 1 - top / px.h, [a, b, c, d, e, f] = info.matrix, matrix = [a * (fx1 - fx0), b * (fx1 - fx0), c * (fy1 - fy0), d * (fy1 - fy0), e + a * fx0 + c * fy0, f + b * fx0 + d * fy0];
    await this.app.mutate("Crop image", { pages: [crop.page] }, () => doc.setImage(crop.page, crop.obj, src, matrix)).catch((err) => toast(err.message, "err"));
  }
  /** Replaces the selected image with `src` (w × h px), fitted and centred in the old image's box. */
  async replaceImage(src: ImageSrc, w: number, h: number): Promise<void> {
    const sel = this.sel, item = this.current();
    if (!sel || !item || item.kind !== "image" || item.label !== "Image") return;
    const doc = this.app.doc, pv = this.v.views[sel.page], box = pv.tf.box(item.bounds), aspect = w / h, fitW = Math.min(box.w, box.h * aspect), fitH = fitW / aspect, matrix = imageMatrix(pv, { x: box.x + (box.w - fitW) / 2, y: box.y + (box.h - fitH) / 2, w: fitW, h: fitH });
    await this.app.mutate("Replace image", { pages: [sel.page] }, () => doc.setImage(sel.page, item.objs[0], src, matrix)).catch((err) => toast(err.message, "err"));
  }
  /**
   * Image crop mode overlay: the full image area plus a crop frame with handles. Dragging works in the
   * image's own unit square, so it behaves for rotated and flipped images too. Returns false if the image is
   * not on this page.
   */
  cropOverlay(pv: PageView): boolean {
    const crop = this.cropping;
    if (!crop || crop.page !== pv.index) return false;
    const item = this.itemsOf(pv).find((it) => it.key === crop.key), info = this.app.doc.imageInfo(crop.page, crop.obj);
    if (!item || !info) return false;
    const [a, b, c, d, e, f] = info.matrix, toScreen = (u: number, v: number) => pv.tf.apply(a * u + c * v + e, b * u + d * v + f), boxOf = (fr: CropFrac): Box => {
      const p = [toScreen(fr.x0, fr.y0), toScreen(fr.x1, fr.y1)], left = Math.min(p[0][0], p[1][0]), top = Math.min(p[0][1], p[1][1]);
      return { x: left, y: top, w: Math.abs(p[1][0] - p[0][0]), h: Math.abs(p[1][1] - p[0][1]) };
    }, full = boxOf({ x0: 0, y0: 0, x1: 1, y1: 1 }), frameEl = h("div", { class: "cropsel" });
    for (const handle of HANDLES) frameEl.append(h("span", { class: "ohandle " + handle, "data-h": handle }));
    const render = () => {
      const box = boxOf(crop.f);
      Object.assign(frameEl.style, { left: box.x + "px", top: box.y + "px", width: box.w + "px", height: box.h + "px" });
    };
    render();
    pv.ov.append(h("div", { class: "crop-image-area", style: { left: full.x + "px", top: full.y + "px", width: full.w + "px", height: full.h + "px" } }), frameEl);
    // image unit square → overlay pixels, and back
    const toOv = mulAffine(pv.tf, new Affine(a, b, c, d, e, f)), fromOv = toOv.invert();
    frameEl.addEventListener("pointerdown", (ev: PointerEvent) => {
      ev.stopPropagation();
      ev.preventDefault();
      const handle = (ev.target as HTMLElement).closest<HTMLElement>(".ohandle")?.dataset.h || "move", ovRect = pv.ov.getBoundingClientRect(), start = { ...crop.f }, [u0, v0] = fromOv.apply(ev.clientX - ovRect.left, ev.clientY - ovRect.top);
      frameEl.setPointerCapture(ev.pointerId);
      const onMove = (m: PointerEvent) => {
        const [u, v] = fromOv.apply(m.clientX - ovRect.left, m.clientY - ovRect.top), du = u - u0, dv = v - v0, next = { ...start }, clamp01 = (n: number) => Math.max(0, Math.min(1, n));
        if (handle === "move") {
          const w = start.x1 - start.x0, h = start.y1 - start.y0;
          next.x0 = clamp01(start.x0 + du);
          next.y0 = clamp01(start.y0 + dv);
          next.x0 = Math.min(next.x0, 1 - w);
          next.y0 = Math.min(next.y0, 1 - h);
          next.x1 = next.x0 + w;
          next.y1 = next.y0 + h;
        } else {
          // Which image axis (and direction) the screen's horizontal and vertical edges correspond to.
          const horiz = Math.abs(toOv.a) >= Math.abs(toOv.c) ? { ax: "x", sg: Math.sign(toOv.a) } : { ax: "y", sg: Math.sign(toOv.c) }, vert = Math.abs(toOv.b) >= Math.abs(toOv.d) ? { ax: "x", sg: Math.sign(toOv.b) } : { ax: "y", sg: Math.sign(toOv.d) }, moveEdge = (axis: { ax: string; sg: number }, positive: boolean) => {
            const isMax = axis.sg > 0 === positive, key = (axis.ax + (isMax ? "1" : "0")) as keyof CropFrac;
            next[key] = clamp01(start[key] + (axis.ax === "x" ? du : dv));
          };
          if (handle.includes("e")) moveEdge(horiz, true);
          if (handle.includes("w")) moveEdge(horiz, false);
          if (handle.includes("s")) moveEdge(vert, true);
          if (handle.includes("n")) moveEdge(vert, false);
          if (next.x0 > next.x1 || next.y0 > next.y1 || next.x1 - next.x0 < 0.02 || next.y1 - next.y0 < 0.02) return;
        }
        crop.f = next;
        render();
      }, detach = () => {
        frameEl.removeEventListener("pointermove", onMove);
        frameEl.removeEventListener("pointerup", onUp);
        frameEl.removeEventListener("pointercancel", onCancel);
      }, onUp = () => {
        detach();
        this.onChange();
      }, onCancel = () => {
        // Cancelled pointer: put the crop frame back where the drag started.
        detach();
        crop.f = start;
        render();
      };
      frameEl.addEventListener("pointermove", onMove);
      frameEl.addEventListener("pointerup", onUp);
      frameEl.addEventListener("pointercancel", onCancel);
    });
    return true;
  }
  refresh(): void {
    for (const pv of this.v.views) {
      if (pv.ov.dataset.tool === "arrange" && pv.visible) {
        pv.ov.replaceChildren();
        this.overlay(pv);
      }
    }
  }
}

export { Arrange };
