import { unionRect, ANNOT, FIELD } from '../engine/pdfium';
import { normalizeRuns, decodeRichText, colorHex, hexToRgba, applySpanStyle, richToHtml, richFromPlain, writeRichText, htmlToRich, plainText } from '../engine/richtext';
import { loadFont, fontCss, removeObjects, parseStyleCode, styleCode, writeText, loadFace, needsShaping, removeById, drawFieldAppearance, resolveFace, guessFontKey, replaceObjectText, fontByKey } from '../engine/text';
import { toast, rgbCss, modal, svg, h } from './dom';
import { decodeImage, encodeImage, defaultImageBox, pickImageFile, imageMatrix, dragImageBox } from './images';
import { placeStamp } from './stamps';
import type { Matrix, Pt, RGBA, Rect, AnnotInfo, LineEnd } from '../engine/types';
import type { Doc, FieldInfo, TextObjectInfo } from '../engine/pdfium';
import type { Run, RichText } from '../engine/richtext';
import type { App } from '../app';
import type { PageView, Viewer } from './viewer';
import type { DecodedImage } from './images';
import type { Arrange } from './arrange';
import type { Crop } from './crop';
import type { TextBoxes } from './textbox';
import type { Links } from './links';
import type { Forms } from './forms';

/** A text object on a page, as listed by Doc.textObjects() (Margin blocks carry their mark in `margin`). */
export type TextObj = TextObjectInfo;

/** An editable unit of page text: a Margin text block, or a run of adjacent same-style objects on one line. */
export type TextRun = { objs: TextObj[]; bounds: Rect; block: boolean; text: string };

/** Inline style flags of the text editor. */
type InlineStyle = { bold: boolean; italic: boolean; underline: boolean; strike: boolean };

/** What the inline text editor is editing. */
type EditorTarget =
  | { kind: "new"; at: Pt; rd: RichText; scale: number }
  | { kind: "block"; blockId: string; rd: RichText; scale: number }
  | { kind: "para" | "object"; objs: TextObj[]; rd: RichText; scale: number };

/** State of the open inline rich-text editor. */
export type EditorState = {
  pv: PageView;
  el: HTMLElement;
  kind: "new" | "block" | "para" | "object";
  /** the rich-text document being edited (as it was when opened) */
  rd: RichText;
  /** text-space → page scale of the edited text */
  scale: number;
  at?: Pt;
  blockId?: string;
  objs?: TextObj[];
  fontKey: string;
  size: number;
  color: RGBA;
  align: string;
  lh: number;
  style: InlineStyle;
  /** page bounds of the original text, if any */
  bounds: Rect | null;
  /** last selection inside the editor, restored before applying a style */
  range?: Range;
  list?: string | null;
  selFont?: string;
  selSize?: number;
};

/** A saved signature: data URL plus decoded pixels once loaded. */
export type SavedSignature = { url: string; w: number; h: number; rgba?: Uint8ClampedArray };

/** Pointer-move / pointer-up callback for {@link Interact.drag}: PDF point and the raw event. */
type DragFn = (at: Pt, e: PointerEvent) => void;

/** "rrggbb" (padded/truncated to 6 digits) → opaque RGBA. */
const parseHexColor = (hex: string): RGBA => {
  const n = parseInt(hex.padEnd(6, "0").slice(0, 6), 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255, 255];
};
const dist = (a: Pt, b: Pt): number => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Pointer handling for every page tool: builds each page's overlay for the current tool and dispatches
 * pointer-downs (select/move annotations, markup, drawing, shapes, lines, redaction, notes, stamps,
 * signatures, images, editing existing text and adding new text). Also owns the inline rich-text editor
 * and the saved signatures.
 */
class Interact {
  app: App;
  v: Viewer;
  editor: EditorState | null = null;
  onEditor: (editor: EditorState | null) => void = () => {
  };
  onNoteCreated: (page: number, index: number) => void = () => {
  };
  /** Ctrl/Cmd+B/I/U ("b" | "i" | "u") or Ctrl/Cmd+Shift+X ("x") inside the editor */
  onFormatKey: (key: string) => void = () => {
  };
  arrange: Arrange | null = null;
  /** the image picked for the Image tool */
  image: DecodedImage | null = null;
  crop: Crop | null = null;
  textbox: TextBoxes | null = null;
  links: Links | null = null;
  forms: Forms | null = null;
  /** previous pointer-down, for double-click detection */
  lastDown: { t: number; x: number; y: number; page: number } | null = null;
  onImage: () => void = () => {
  };
  constructor(app: App, viewer: Viewer) {
    this.app = app;
    this.v = viewer;
    viewer.onOverlay = (pv) => this.overlay(pv);
    viewer.inner.addEventListener("pointerdown", (e) => this.down(e));
    this.loadSaved();
  }
  /** The page view an event happened on. */
  pvFrom(e: Event): PageView | null {
    const page = (e.target as HTMLElement).closest<HTMLElement>(".page");
    return page ? this.v.views[+page.dataset.index!] : null;
  }
  refreshOverlays(): void {
    for (const pv of this.v.views) this.v.overlayOf(pv);
  }
  /** Rebuilds a page's overlay for the current tool (left alone while an editor is open on that page). */
  overlay(pv: PageView): void {
    if (this.editor?.pv === pv || this.textbox?.open?.pv === pv) return;
    pv.ov.replaceChildren();
    pv.ov.dataset.tool = this.app.tool;
    const tool = this.app.tool;
    if (tool === "select") {
      // Objects to select; on top of them, links to follow and form fields to fill.
      if (this.arrange && !this.arrange.overlay(pv)) return;
      this.links?.overlay(pv, false);
      this.fieldControls(pv);
      return;
    }
    if (tool === "crop") {
      this.crop?.overlay(pv);
      return;
    }
    // Form field and Link draw their own boxes; the selected field or link gets a frame with resize handles.
    if (tool === "link") {
      this.links?.overlay(pv, true);
      this.arrange?.overlay(pv, false);
      return;
    }
    if (tool === "form") {
      this.forms?.overlay(pv);
      this.arrange?.overlay(pv, false);
      return;
    }
    if (tool === "edittext") {
      for (const run of groupTextRuns(this.v.textsOf(pv))) {
        const box = pv.tf.box(run.bounds);
        pv.ov.append(h("div", { class: "tbox" + (run.block ? " block" : ""), "data-obj": String(run.objs[0].index), title: "Click to edit", style: { left: box.x - 2 + "px", top: box.y - 2 + "px", width: box.w + 4 + "px", height: box.h + 4 + "px" } }));
      }
    }
  }
  /** Live HTML controls over the page's form fields (Select tool): text inputs, toggles, selects, "Sign here". */
  fieldControls(pv: PageView): void {
    for (const field of this.v.fieldsOf(pv)) {
      const box = pv.tf.box(field.rect), place = { left: box.x + "px", top: box.y + "px", width: box.w + "px", height: box.h + "px" }, mutateField = (label: string, fn: () => unknown) => this.app.mutate(label, { pages: [pv.index] }, fn).catch((err: Error) => toast(err.message, "err"));
      if (field.type === FIELD.TEXT) {
        const fontSize = Math.max(9, Math.min(box.h * 0.62, 18)) + "px", input = field.multiline ? h("textarea", { class: "fld", "aria-label": field.name || "Text field", disabled: field.readOnly, style: { ...place, fontSize } }) : h("input", { class: "fld", type: "text", "aria-label": field.name || "Text field", disabled: field.readOnly, style: { ...place, fontSize } });
        input.value = field.value;
        input.addEventListener("pointerdown", (e: Event) => e.stopPropagation());
        input.addEventListener("keydown", (e: Event) => {
          if ((e as KeyboardEvent).key === "Enter" && !field.multiline) input.blur();
          e.stopPropagation();
        });
        input.addEventListener("change", () => {
          const value = input.value;
          this.app.mutate("Fill field", { pages: [pv.index] }, async () => {
            this.app.doc.setFieldText(pv.index, field.index, value);
            // complex scripts (e.g. Thai) need an appearance drawn with a shaping font
            if (needsShaping(value)) await drawFieldAppearance(this.app.doc, pv.index, field.index, value);
          }).catch((err: Error) => toast(err.message, "err"));
        });
        pv.ov.append(input);
      } else if (field.type === FIELD.CHECKBOX || field.type === FIELD.RADIO) {
        const toggle = h("button", { class: "fld toggle", type: "button", role: field.type === FIELD.RADIO ? "radio" : "checkbox", "aria-checked": String(field.checked), "aria-label": field.name || "Option", disabled: field.readOnly, style: place });
        toggle.addEventListener("pointerdown", (e: Event) => e.stopPropagation());
        toggle.addEventListener("click", () => mutateField(field.type === FIELD.RADIO ? "Choose option" : "Toggle checkbox", () => this.app.doc.clickField(pv.index, field.index)));
        pv.ov.append(toggle);
      } else if (field.type === FIELD.SIGNATURE) {
        const center = { x: (field.rect.l + field.rect.r) / 2, y: (field.rect.b + field.rect.t) / 2 };
        // already signed (a stamp covers the field's centre) or read-only: no button
        if (this.v.annotsOf(pv).some((a: AnnotInfo) => a.subtype === ANNOT.STAMP && a.rect.l <= center.x && a.rect.r >= center.x && a.rect.b <= center.y && a.rect.t >= center.y) || field.readOnly) continue;
        const button = h("button", { class: "fld sigfld", type: "button", "aria-label": `Sign “${field.name || "signature"}”`, title: "Click to sign", style: place }, h("span", { text: "Sign here" }));
        button.addEventListener("pointerdown", (e: Event) => e.stopPropagation());
        button.addEventListener("click", () => this.signField(pv, field.rect));
        pv.ov.append(button);
      } else if (field.type === FIELD.COMBO || field.type === FIELD.LIST) {
        const select = h("select", { class: "fld", "aria-label": field.name || "Choice", disabled: field.readOnly, style: place }, ...field.options.map((opt: FieldInfo["options"][number], i: number) => h("option", { value: String(i), text: opt.label, selected: opt.selected })));
        select.addEventListener("pointerdown", (e: Event) => e.stopPropagation());
        select.addEventListener("change", () => mutateField("Choose option", () => this.app.doc.selectOption(pv.index, field.index, +select.value)));
        pv.ov.append(select);
      }
    }
  }
  /** Primary-button pointer-down on a page: commits an open editor, detects double-clicks, dispatches to the tool. */
  down(e: PointerEvent): void | Promise<void> {
    if (e.button !== 0) return;
    const pv = this.pvFrom(e);
    if (!pv || (e.target as HTMLElement).closest(".editor")) return;
    if (this.editor) {
      this.commitEditor();
      return;
    }
    const tool = this.app.tool, at = this.v.toPage(pv, e), now = performance.now(), prev = this.lastDown;
    this.lastDown = { t: now, x: e.clientX, y: e.clientY, page: pv.index };
    // A second click in the same spot (no modifier keys: Shift/Ctrl/Alt-clicks select) is a double-click.
    if (tool === "select" && prev && prev.page === pv.index && now - prev.t < 450 && Math.hypot(e.clientX - prev.x, e.clientY - prev.y) < 6 && !(e.shiftKey || e.ctrlKey || e.metaKey || e.altKey)) {
      this.lastDown = null;
      if (this.dbl(e)) return;
    }
    const drag = (ev: PointerEvent, view: PageView, move: DragFn, up: DragFn) => this.drag(ev, view, move, up);
    switch (tool) {
      case "select":
        return this.arrange?.down(e, pv);
      case "edittext":
        return this.editTextDown(e, pv);
      case "highlight":
      case "underline":
      case "strike":
        return this.markupDown(e, pv, tool);
      case "draw":
        return this.drawDown(e, pv);
      case "rect":
      case "ellipse":
        return this.shapeDown(e, pv, tool);
      case "line":
        return this.lineDown(e, pv);
      case "stamp":
        return this.stampDown(pv, at);
      case "redact":
        return this.redactDown(e, pv);
      case "form":
      case "link":
        return this.fieldOrLinkDown(e, pv, tool, drag);
      case "textbox":
        return this.textbox?.down(e, pv, drag);
      case "note":
        return this.noteDown(pv, at);
      case "sign":
        return this.signDown(pv, at);
      case "image":
        return this.imageDown(e, pv);
      case "crop":
        return this.crop?.down(e, pv);
    }
  }
  /**
   * Form field and Link tools: the selected one's handles resize it; a field or link is moved by dragging and
   * edited by clicking; empty space draws a new one.
   */
  fieldOrLinkDown(e: PointerEvent, pv: PageView, tool: "form" | "link", drag: (ev: PointerEvent, view: PageView, move: DragFn, up: DragFn) => void): void {
    const target = e.target as HTMLElement, arrange = this.arrange;
    if (arrange && arrange.onHandle(target)) return arrange.down(e, pv);
    const hit = target.closest<HTMLElement>(tool === "form" ? ".fbox" : ".lbox"), frame = target.closest<HTMLElement>(".oframe[data-k]");
    if (arrange && (hit || frame)) {
      const index = hit ? +(tool === "form" ? hit.dataset.field! : hit.dataset.link!) : +frame!.dataset.k!.slice(1);
      arrange.press(e, pv, "a" + index, () => {
        if (tool === "form") {
          const field = this.v.fieldsOf(pv).find((f: FieldInfo) => f.index === index);
          if (field) this.forms?.editDialog(pv.index, field);
        } else {
          const link = this.links?.of(pv.index).find((l) => l.index === index);
          if (link) this.links?.editDialog(pv.index, link);
        }
      });
      return;
    }
    if (arrange?.sel) arrange.clear();
    return tool === "form" ? this.forms?.down(e, pv, drag) : this.links?.down(e, pv, drag);
  }
  /**
   * Captures the pointer on the page overlay and reports moves (at most once per frame) and the release in
   * PDF coordinates. The SVG preview layer is cleared on release; a cancelled drag just refreshes overlays.
   */
  drag(e: PointerEvent, pv: PageView, move: DragFn, up: DragFn): void {
    e.preventDefault();
    const ov = pv.ov;
    ov.setPointerCapture(e.pointerId);
    let latest: PointerEvent | null = null, frame = 0;
    const onMove = (ev: PointerEvent) => {
      latest = ev;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (latest) move(this.v.toPage(pv, latest), latest);
        });
      }
    };
    const onUp = (ev: PointerEvent) => {
      ov.removeEventListener("pointermove", onMove);
      ov.removeEventListener("pointerup", onUp);
      ov.removeEventListener("pointercancel", onUp);
      cancelAnimationFrame(frame);
      pv.svg.replaceChildren();
      if (ev.type === "pointercancel") {
        this.refreshOverlays();
        return;
      }
      up(this.v.toPage(pv, ev), ev);
    };
    ov.addEventListener("pointermove", onMove);
    ov.addEventListener("pointerup", onUp);
    ov.addEventListener("pointercancel", onUp);
  }
  /**
   * Double-click with Select: on a text box or added text, edit its text; on another annotation, open its
   * comment; on the page's own text, switch to the Text tool and edit that text. Returns false when there is
   * nothing to edit (the press then works as a single click).
   */
  dbl(e: PointerEvent): boolean {
    const pv = this.pvFrom(e);
    if (!pv || this.app.tool !== "select" || !this.arrange) return false;
    const ovRect = pv.ov.getBoundingClientRect(), hit = this.arrange.stackAt(pv, e.clientX - ovRect.left, e.clientY - ovRect.top)[0];
    if (hit?.kind === "annot") {
      e.preventDefault();
      if (this.v.annotsOf(pv).find((a: AnnotInfo) => a.index === hit.annot)?.subtype === ANNOT.FREETEXT && this.textbox) this.textbox.edit(pv, hit.annot!);
      else this.onNoteCreated(pv.index, hit.annot!);
      return true;
    }
    if (hit?.kind === "image") return false;
    const at = this.v.toPage(pv, e), runs = groupTextRuns(this.v.textsOf(pv)), run = hit?.kind === "block" ? runs.find((r) => r.block && r.objs[0].margin?.id === hit.block) : runs.filter((r) => !r.block && at.x >= r.bounds.l - 2 && at.x <= r.bounds.r + 2 && at.y >= r.bounds.b - 2 && at.y <= r.bounds.t + 2).sort((a, b) => (a.bounds.r - a.bounds.l) * (a.bounds.t - a.bounds.b) - (b.bounds.r - b.bounds.l) * (b.bounds.t - b.bounds.b))[0];
    if (!run) return false;
    e.preventDefault();
    this.app.setTool("edittext");
    this.editRun(pv, run.objs[0].index);
    return true;
  }
  /** Highlight / underline / strikeout: sweep across text; a highlight can also be a dragged area. */
  markupDown(e: PointerEvent, pv: PageView, tool: "highlight" | "underline" | "strike"): void {
    const start = this.v.toPage(pv, e);
    let rects: Rect[] = [];
    const color = tool === "highlight" ? this.app.settings.markupColor : this.app.settings.lineMarkupColor, subtype = tool === "highlight" ? ANNOT.HIGHLIGHT : tool === "underline" ? ANNOT.UNDERLINE : ANNOT.STRIKEOUT;
    this.drag(e, pv, (at) => {
      rects = this.app.doc.selectionRects(pv.index, start, at).rects;
      // no text under the sweep: show the dragged area faintly
      pv.svg.replaceChildren(...(rects.length ? rects : [rectFrom2(start, at)]).map((r) => {
        const box = pv.tf.box(r);
        return svg("rect", { x: box.x, y: box.y, width: box.w, height: box.h, fill: rgbCss(color), "fill-opacity": rects.length ? 0.35 : 0.12, stroke: rects.length ? "none" : rgbCss(color), "stroke-dasharray": "4 3" });
      }));
    }, (end) => {
      if (!rects.length) {
        if (tool === "highlight" && Math.abs(end.x - start.x) > 4 && Math.abs(end.y - start.y) > 4) rects = [rectFrom2(start, end)];
        else {
          if (dist(end, start) > 3) toast("Drag across text to mark it up", "warn");
          return;
        }
      }
      this.app.mutate(tool === "highlight" ? "Highlight" : tool === "underline" ? "Underline" : "Strikeout", { pages: [pv.index] }, () => this.app.doc.addMarkup(pv.index, subtype, rects, color, this.app.settings.author)).catch((err: Error) => toast(err.message, "err"));
    });
  }
  /** Freehand ink; the stroke is simplified (0.35 pt tolerance) before it is stored. */
  drawDown(e: PointerEvent, pv: PageView): void {
    const points: Pt[] = [this.v.toPage(pv, e)], { inkColor, inkWidth } = this.app.settings, line = svg("polyline", { fill: "none", stroke: rgbCss(inkColor), "stroke-width": inkWidth * this.v.zoom, "stroke-linecap": "round", "stroke-linejoin": "round" });
    pv.svg.replaceChildren(line);
    this.drag(e, pv, (at) => {
      if (!(dist(at, points[points.length - 1]) < 0.6)) {
        points.push(at);
        if (!line.isConnected) pv.svg.replaceChildren(line);
        line.setAttribute("points", points.map((p) => this.v.toDev(pv, p.x, p.y).join(",")).join(" "));
      }
    }, () => {
      if (points.length >= 2) this.app.mutate("Draw", { pages: [pv.index] }, () => this.app.doc.addInk(pv.index, [simplifyPath(points, 0.35)], inkColor, inkWidth, this.app.settings.author)).catch((err: Error) => toast(err.message, "err"));
    });
  }
  /** Rectangle / ellipse by dragging; needs an outline or a fill colour. */
  shapeDown(e: PointerEvent, pv: PageView, tool: "rect" | "ellipse"): void {
    const start = this.v.toPage(pv, e), { shapeColor, shapeWidth, shapeFill, shapeOpacity = 1 } = this.app.settings;
    if (!shapeColor && !shapeFill) {
      toast("Pick an outline or a fill colour first", "warn");
      return;
    }
    this.drag(e, pv, (at) => {
      const box = pv.tf.box(rectFrom2(start, at)), paint = { fill: shapeFill ? rgbCss(shapeFill) : "none", stroke: shapeColor ? rgbCss(shapeColor) : "none", "stroke-width": shapeWidth * this.v.zoom, opacity: shapeOpacity };
      pv.svg.replaceChildren(tool === "rect" ? svg("rect", { x: box.x, y: box.y, width: box.w, height: box.h, ...paint }) : svg("ellipse", { cx: box.x + box.w / 2, cy: box.y + box.h / 2, rx: box.w / 2, ry: box.h / 2, ...paint }));
    }, (end) => {
      if (!(Math.abs(end.x - start.x) < 3 || Math.abs(end.y - start.y) < 3)) {
        this.app.mutate(tool === "rect" ? "Rectangle" : "Ellipse", { pages: [pv.index] }, () => this.app.doc.addShape(pv.index, tool === "rect" ? ANNOT.SQUARE : ANNOT.CIRCLE, rectFrom2(start, end), shapeColor, shapeWidth, this.app.settings.author, { fill: shapeFill, opacity: shapeOpacity })).catch((err: Error) => toast(err.message, "err"));
      }
    });
  }
  /** Switches to Select with the item just placed (`key`, an ArrangeItem key) selected. */
  selectAfterPlacing(pv: PageView, key: string): void {
    this.app.setTool("select");
    if (!this.arrange) return;
    this.arrange.sel = { page: pv.index, key };
    this.arrange.extra = [];
    this.arrange.refresh();
    this.arrange.onChange();
  }
  /** Stamp tool: place the chosen stamp, then switch to Select with it selected. */
  async stampDown(pv: PageView, at: Pt): Promise<void> {
    const index = await placeStamp(this.app, pv, at);
    if (index != null) this.selectAfterPlacing(pv, "a" + index);
  }
  /** Redaction marks: over text (sweep) or an area, per the redact mode setting. */
  redactDown(e: PointerEvent, pv: PageView): void {
    const start = this.v.toPage(pv, e), areaMode = this.app.settings.redactMode === "area";
    let rects: Rect[] = [];
    this.drag(e, pv, (at) => {
      rects = areaMode ? [rectFrom2(start, at)] : this.app.doc.selectionRects(pv.index, start, at).rects;
      const shown = rects.length ? rects : [rectFrom2(start, at)];
      pv.svg.replaceChildren(...shown.map((r) => {
        const box = pv.tf.box(r);
        return svg("rect", { x: box.x, y: box.y, width: box.w, height: box.h, fill: "rgba(214,40,40,.18)", stroke: "#d62828", "stroke-dasharray": "4 3" });
      }));
    }, (end) => {
      if (areaMode) rects = [rectFrom2(start, end)];
      rects = rects.filter((r) => r.r - r.l > 1 && r.t - r.b > 1);
      if (!(!rects.length || areaMode && dist(start, end) < 4)) {
        this.app.mutate("Mark for redaction", { pages: [pv.index] }, () => this.app.doc.addRedactMark(pv.index, rects, this.app.settings.author)).catch((err: Error) => toast(err.message, "err"));
      }
    });
  }
  /** Line / arrow; Shift snaps the angle to 45° steps. */
  lineDown(e: PointerEvent, pv: PageView): void {
    const start: Pt = this.v.toPage(pv, e), { lineColor, lineWidth, lineEnds } = this.app.settings, ends: [LineEnd, LineEnd] = lineEnds === "double" ? ["OpenArrow", "OpenArrow"] : lineEnds === "arrow" ? ["None", "OpenArrow"] : ["None", "None"];
    let end = start;
    const snap = (at: Pt, ev: PointerEvent): Pt => {
      if (!ev.shiftKey) return at;
      const dx = at.x - start.x, dy = at.y - start.y, len = Math.hypot(dx, dy), angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4);
      return { x: start.x + len * Math.cos(angle), y: start.y + len * Math.sin(angle) };
    };
    this.drag(e, pv, (at, ev) => {
      end = snap(at, ev);
      const [x1, y1] = pv.tf.apply(start.x, start.y), [x2, y2] = pv.tf.apply(end.x, end.y), zoom = this.v.zoom, stroke = rgbCss(lineColor), width = lineWidth * zoom, parts: SVGElement[] = [svg("line", { x1, y1, x2, y2, stroke, "stroke-width": width, "stroke-linecap": "round" })];
      /** open arrowhead at (tipX, tipY) pointing away from (fromX, fromY) */
      const arrowhead = (tipX: number, tipY: number, fromX: number, fromY: number) => {
        const size = Math.max(7, lineWidth * 4.5) * zoom, dir = Math.atan2(tipY - fromY, tipX - fromX), spread = 28 * Math.PI / 180;
        parts.push(svg("path", { d: `M${tipX - size * Math.cos(dir - spread)},${tipY - size * Math.sin(dir - spread)} L${tipX},${tipY} L${tipX - size * Math.cos(dir + spread)},${tipY - size * Math.sin(dir + spread)}`, fill: "none", stroke, "stroke-width": width }));
      };
      if (ends[1] !== "None") arrowhead(x2, y2, x1, y1);
      if (ends[0] !== "None") arrowhead(x1, y1, x2, y2);
      pv.svg.replaceChildren(...parts);
    }, (at, ev) => {
      end = snap(at, ev);
      if (!(dist(start, end) < 3)) {
        this.app.mutate(ends[1] === "None" ? "Line" : "Arrow", { pages: [pv.index] }, () => this.app.doc.addLine(pv.index, start, end, lineColor, lineWidth, ends, this.app.settings.author)).catch((err: Error) => toast(err.message, "err"));
      }
    });
  }
  /** Sticky note at the click; then back to Select with the new note selected and its comment opened. */
  async noteDown(pv: PageView, at: Pt): Promise<void> {
    const countBefore = this.app.doc.annots(pv.index).length;
    await this.app.mutate("Add note", { pages: [pv.index] }, () => this.app.doc.addNote(pv.index, { x: at.x - 10, y: at.y + 10 }, "", this.app.settings.noteColor, this.app.settings.author));
    const annots = this.app.doc.annots(pv.index), added = annots[annots.length - 1];
    this.app.setTool("select");
    if (added && annots.length > countBefore) {
      this.app.selectedAnnot = { page: pv.index, index: added.index };
      this.refreshOverlays();
      this.onNoteCreated(pv.index, added.index);
    }
  }
  /** Saved signatures, newest first (at most 6, kept in localStorage). */
  saved: SavedSignature[] = [];
  activeSig = -1;
  get signature(): SavedSignature | null {
    return this.saved[this.activeSig] || null;
  }
  onSignatures: () => void = () => {
  };
  /** Loads saved signatures (also migrates the old single "margin.signature" entry). */
  loadSaved(): void {
    try {
      const list = JSON.parse(localStorage.getItem("margin.signatures") || "null"), legacy = localStorage.getItem("margin.signature");
      for (const url of list || (legacy ? [legacy] : [])) this.addSaved(url, false);
    } catch {
    }
  }
  persist(): void {
    try {
      localStorage.setItem("margin.signatures", JSON.stringify(this.saved.map((s) => s.url)));
      localStorage.removeItem("margin.signature");
    } catch {
    }
  }
  /** Adds a signature (PNG data URL) at the front, makes it active and decodes its pixels in the background. */
  addSaved(url: string, persist = true): void {
    const sig: SavedSignature = { url, w: 1, h: 1 };
    this.saved.unshift(sig);
    if (this.saved.length > 6) this.saved.length = 6;
    this.activeSig = 0;
    const img = new Image();
    img.onload = () => {
      const ctx = h("canvas", { width: img.width, height: img.height }).getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      Object.assign(sig, { rgba: ctx.getImageData(0, 0, img.width, img.height).data, w: img.width, h: img.height });
      this.onSignatures();
    };
    img.src = url;
    if (persist) this.persist();
  }
  removeSaved(index: number): void {
    this.saved.splice(index, 1);
    this.activeSig = this.saved.length ? Math.min(this.activeSig, this.saved.length - 1) : -1;
    this.persist();
    this.onSignatures();
  }
  chooseSaved(index: number): void {
    this.activeSig = index;
    this.onSignatures();
  }
  /** Lets the user pick a saved signature (or draw a new one). Resolves true when one is ready to use. */
  async chooseSignature(): Promise<boolean> {
    if (!this.saved.length) return this.captureSignature();
    let picked = this.activeSig;
    const list = h("div", { class: "sig-choices", role: "listbox", "aria-label": "Saved signatures" });
    const render = () => list.replaceChildren(...this.saved.map((sig, i) => h("div", { class: "sig-choice" + (i === picked ? " on" : ""), role: "option", "aria-selected": String(i === picked), tabindex: "0", onclick: () => {
      picked = i;
      render();
    }, ondblclick: () => document.querySelector<HTMLElement>(".modal .btn.primary")?.click() }, h("img", { src: sig.url, alt: `Signature ${i + 1}` }), h("button", { class: "sig-del", type: "button", "aria-label": "Remove this signature", title: "Remove", text: "×", onclick: (e: Event) => {
      e.stopPropagation();
      this.removeSaved(i);
      if (picked >= this.saved.length) picked = this.saved.length - 1;
      // removing the last one switches straight to drawing a new one
      if (this.saved.length) render();
      else document.querySelector<HTMLElement>('.modal .btn[data-id="new"]')?.click();
    } }))));
    render();
    const choice = await modal({ title: "Choose a signature", body: h("div", { class: "stack" }, list, h("p", { class: "hint", text: "Pick one, then click the page where it should go. Signatures are saved in this browser only." })), actions: [{ id: "new", label: "Draw a new one" }, { id: "cancel", label: "Cancel" }, { id: "use", label: "Use selected", primary: true }], onOpen: (dialog: HTMLElement) => dialog.querySelectorAll<HTMLElement>(".modal-actions .btn").forEach((btn, i) => btn.dataset.id = ["new", "cancel", "use"][i]) });
    if (choice === "new") return this.captureSignature();
    if (choice === "use" && this.saved[picked]) {
      this.chooseSaved(picked);
      return true;
    }
    return false;
  }
  /** Signature pad dialog; the drawing is trimmed to its ink and saved. Resolves true when a signature was added. */
  async captureSignature(): Promise<boolean> {
    const pad = h("canvas", { class: "sigpad", width: 1040, height: 360, "aria-label": "Signature pad" }), ctx = pad.getContext("2d")!;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#141a2e";
    ctx.lineWidth = 9;
    let drawing = false, inked = false, last: { x: number; y: number } | null = null;
    const padPoint = (e: PointerEvent) => {
      const box = pad.getBoundingClientRect();
      return { x: (e.clientX - box.left) * (pad.width / box.width), y: (e.clientY - box.top) * (pad.height / box.height) };
    };
    pad.addEventListener("pointerdown", (e: PointerEvent) => {
      drawing = true;
      inked = true;
      pad.setPointerCapture(e.pointerId);
      last = padPoint(e);
    });
    pad.addEventListener("pointermove", (e: PointerEvent) => {
      if (!drawing || !last) return;
      const p = padPoint(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
    });
    pad.addEventListener("pointerup", () => {
      drawing = false;
      last = null;
    });
    const clear = h("button", { class: "btn ghost small", type: "button", text: "Clear", onclick: () => {
      ctx.clearRect(0, 0, pad.width, pad.height);
      inked = false;
    } }), body = h("div", { class: "sig-body" }, h("div", { class: "sigwrap" }, pad, h("div", { class: "sigline" })), h("div", { class: "sig-row" }, h("span", { class: "hint", text: "Sign with a mouse, trackpad, or finger." }), clear));
    if (await modal({ title: "Draw your signature", body, actions: [{ id: "cancel", label: "Cancel" }, { id: "use", label: "Use signature", primary: true }] }) !== "use") return false;
    if (!inked) {
      toast("Draw a signature first", "warn");
      return false;
    }
    const trimmed = trimCanvas(pad);
    if (trimmed) {
      this.addSaved(trimmed.toDataURL("image/png"));
      // give the image a moment to decode
      await new Promise((resolve) => setTimeout(resolve, 60));
      return true;
    }
    return false;
  }
  /** Sign tool: places the active signature, 150 pt wide, centred on the click. */
  async signDown(pv: PageView, at: Pt): Promise<void> {
    if (!this.signature && !await this.chooseSignature()) return;
    const sig = this.signature!;
    if (!sig.rgba) await new Promise((resolve) => setTimeout(resolve, 80));
    if (!sig.rgba) {
      toast("The signature is still loading. Click again.", "warn");
      return;
    }
    const rgba = sig.rgba, w = 150, h = w * (sig.h / sig.w), rect = { l: at.x - w / 2, r: at.x + w / 2, t: at.y + h / 2, b: at.y - h / 2 };
    await this.app.mutate("Place signature", { pages: [pv.index] }, () => this.app.doc.addImageStamp(pv.index, rect, rgba, sig.w, sig.h, this.app.settings.author)).catch((err: Error) => toast(err.message, "err"));
    this.app.setTool("select");
  }
  /** Signs a signature field: the signature is fitted inside the field with a small inset, slightly below centre. */
  async signField(pv: PageView, field: Rect): Promise<void> {
    if ((this.saved.length > 1 || !this.signature) && !await this.chooseSignature()) return;
    const sig = this.signature!;
    if (!sig.rgba) await new Promise((resolve) => setTimeout(resolve, 120));
    if (!sig.rgba) {
      toast("The signature is still loading. Click again.", "warn");
      return;
    }
    const rgba = sig.rgba, inset = Math.min(4, (field.t - field.b) * 0.08), availW = field.r - field.l - inset * 2, availH = field.t - field.b - inset * 2, scale = Math.min(availW / sig.w, availH / sig.h), w = sig.w * scale, h = sig.h * scale, cx = (field.l + field.r) / 2, bottom = field.b + inset + (availH - h) * 0.35, rect = { l: cx - w / 2, r: cx + w / 2, b: bottom, t: bottom + h };
    await this.app.mutate("Sign field", { pages: [pv.index] }, () => this.app.doc.addImageStamp(pv.index, rect, rgba, sig.w, sig.h, this.app.settings.author)).catch((err: Error) => toast(err.message, "err"));
  }
  /** Asks for an image file for the Image tool. Resolves true when one was loaded. */
  async chooseImage(): Promise<boolean> {
    const file = await pickImageFile();
    if (!file) return false;
    try {
      this.setImage(await decodeImage(file, file.name));
      return true;
    } catch (err) {
      toast((err as Error).message, "err");
      return false;
    }
  }
  /** Replaces the Image tool's image, releasing the previous one. */
  setImage(image: DecodedImage | null): void {
    if (this.image && this.image !== image) {
      URL.revokeObjectURL(this.image.url);
      this.image.bitmap.close();
    }
    this.image = image;
    this.onImage();
  }
  /** CSS pixels per point for a page as laid out. */
  scaleOf(pv: PageView): number {
    return pv.ov.clientWidth / pv.w || this.v.zoom;
  }
  /** Image tool: click to place at natural size or drag a box to size it (asks for an image first if none). */
  imageDown(e: PointerEvent, pv: PageView): void {
    if (!this.image) {
      e.preventDefault();
      this.chooseImage();
      return;
    }
    const image = this.image, ovBox = pv.ov.getBoundingClientRect(), x0 = e.clientX - ovBox.left, y0 = e.clientY - ovBox.top;
    let cur = { x: x0, y: y0 };
    this.drag(e, pv, (_pt, ev) => {
      cur = { x: ev.clientX - ovBox.left, y: ev.clientY - ovBox.top };
      const fitted = dragImageBox(image, x0, y0, cur.x, cur.y);
      pv.svg.replaceChildren(svg("rect", { x: Math.min(x0, cur.x), y: Math.min(y0, cur.y), width: Math.abs(cur.x - x0), height: Math.abs(cur.y - y0), fill: "none", stroke: "var(--sel)", "stroke-dasharray": "4 3", opacity: 0.5 }), svg("image", { href: image.url, x: fitted.x, y: fitted.y, width: fitted.w, height: fitted.h, opacity: 0.75, preserveAspectRatio: "none" }));
    }, () => {
      const box = Math.abs(cur.x - x0) > 8 && Math.abs(cur.y - y0) > 8 ? dragImageBox(image, x0, y0, cur.x, cur.y) : defaultImageBox(image, pv, this.scaleOf(pv), x0, y0);
      this.placeImage(pv, image, box);
    });
  }
  /** Inserts an image into the box (overlay pixels), then selects it with Select. */
  async placeImage(pv: PageView, image: DecodedImage, box: { x: number; y: number; w: number; h: number }): Promise<void> {
    const scale = this.scaleOf(pv);
    try {
      const src = await encodeImage(image, box.w / scale, box.h / scale);
      let objIndex = -1;
      await this.app.mutate("Insert image", { pages: [pv.index] }, () => {
        objIndex = this.app.doc.addImage(pv.index, imageMatrix(pv, box), src);
      });
      if (objIndex >= 0) this.selectAfterPlacing(pv, "o" + objIndex);
    } catch (err) {
      toast((err as Error).message || "The image could not be placed", "err");
    }
  }
  /**
   * Places a pasted or dropped image file at natural size: at the pointer when `at` is given, otherwise centred
   * in the visible part of the current page.
   */
  async placeImageFile(file: File, at?: { pv: PageView; clientX: number; clientY: number } | null): Promise<void> {
    let image: DecodedImage;
    try {
      image = await decodeImage(file, file.name || "Pasted image");
    } catch (err) {
      toast((err as Error).message, "err");
      return;
    }
    let pv = at?.pv, x: number, y0: number;
    if (pv && at) {
      const ovBox = pv.ov.getBoundingClientRect();
      x = at.clientX - ovBox.left;
      y0 = at.clientY - ovBox.top;
    } else {
      pv = this.v.views[this.app.currentPage] || this.v.views[0];
      if (!pv) {
        // nowhere to place it: release the decoded image
        URL.revokeObjectURL(image.url);
        image.bitmap.close();
        return;
      }
      const ovBox = pv.ov.getBoundingClientRect(), viewBox = this.v.el.getBoundingClientRect(), top = Math.max(ovBox.top, viewBox.top), bottom = Math.min(ovBox.bottom, viewBox.bottom);
      x = ovBox.width / 2;
      y0 = (bottom > top ? (top + bottom) / 2 : ovBox.top + ovBox.height / 2) - ovBox.top;
    }
    await this.placeImage(pv, image, defaultImageBox(image, pv, this.scaleOf(pv), x, y0));
    URL.revokeObjectURL(image.url);
    image.bitmap.close();
  }
  /**
   * Text tool: opens the editor on the clicked run. Margin blocks are edited as their rich text; other
   * text is gathered into a paragraph (lines of the same style), with bold/italic guessed from the font name
   * or slant and the matrix's skew removed.
   */
  /** Text tool: on text, a click edits it and a drag moves it; on an empty spot, a click (or drag) starts new text. */
  editTextDown(e: PointerEvent, pv: PageView): void {
    const boxEl = (e.target as HTMLElement).closest<HTMLElement>(".tbox");
    if (!boxEl) return this.addTextDown(e, pv);
    e.preventDefault();
    const objIndex = +boxEl.dataset.obj!, run = groupTextRuns(this.v.textsOf(pv)).find((r) => r.objs[0].index === objIndex);
    if (!run) return;
    // Drag to move the text; click to edit it.
    const key = run.block ? "b" + run.objs[0].margin!.id : "l" + objIndex;
    if (this.arrange) this.arrange.press(e, pv, key, () => this.editRun(pv, objIndex), false);
    else this.editRun(pv, objIndex);
  }
  /** Opens the editor on the text run starting with page object `objIndex` (a paragraph, a line or added text). */
  editRun(pv: PageView, objIndex: number): void {
    const runs = groupTextRuns(this.v.textsOf(pv)), run = runs.find((r) => r.objs[0].index === objIndex);
    if (!run) return;
    if (run.block) {
      const rd = blockRichDoc(run);
      this.openEditor(pv, { kind: "block", blockId: run.objs[0].margin!.id, rd, scale: matrixScale(rd.bm) }, run.bounds);
      return;
    }
    const lines = paragraphOf(runs, run), first = lines[0].objs[0], baseFont = first.fontName.replace(/^[A-Z]{6}\+/, ""), bold = /bold|black|heavy|semibold|demi/i.test(baseFont), italic = /italic|oblique/i.test(baseFont) || Math.abs(first.matrix[2]) > 0.05 * Math.abs(first.matrix[3]), text = joinLines(lines.map((l) => l.text)), scale = matrixScale(first.matrix), matrix = unskewMatrix(first.matrix), left = Math.min(...lines.map((l) => l.bounds.l)), multi = lines.length > 1, rd: RichText = { v: 1, paras: [[{ t: text, ...(bold ? { b: bold } : {}), ...(italic ? { i: italic } : {}) }]], font: guessFontKey(first.fontName, text), size: first.fontSize, color: colorHex(first.color), align: "left", lh: multi ? Math.max(1, (lines[0].objs[0].matrix[5] - lines[1].objs[0].matrix[5]) / (first.fontSize * scale)) : 1.5, width: multi ? (Math.max(...lines.map((l) => l.bounds.r)) - left) / scale * 1.02 : undefined, bm: multi ? [matrix[0], matrix[1], matrix[2], matrix[3], left, matrix[5]] : matrix };
    this.openEditor(pv, { kind: multi ? "para" : "object", objs: lines.flatMap((l) => l.objs), rd, scale }, unionRect(lines.map((l) => l.bounds)));
  }
  /** New text: click (or drag to set a wrap width over 24 pt) to open an editor for it. */
  addTextDown(e: PointerEvent, pv: PageView): void {
    const start = this.v.toPage(pv, e);
    let cur = start;
    this.drag(e, pv, (at) => {
      cur = at;
      const box = pv.tf.box({ l: Math.min(start.x, at.x), r: Math.max(start.x, at.x), t: start.y, b: start.y - this.app.settings.textSize * 1.4 });
      pv.svg.replaceChildren(svg("rect", { x: box.x, y: box.y, width: box.w, height: box.h, fill: "none", stroke: "var(--accent)", "stroke-dasharray": "4 3" }));
    }, () => {
      const origin = { x: Math.min(start.x, cur.x), y: start.y }, wrap = Math.abs(cur.x - start.x) > 24;
      this.openNewEditor(pv, origin, wrap ? Math.abs(cur.x - start.x) : undefined);
    });
  }
  /** Opens an empty editor at `at` using the text settings (font, size, colour, style, alignment, line height). */
  openNewEditor(pv: PageView, at: Pt, width?: number): void {
    const settings = this.app.settings, style = parseStyleCode(settings.textStyle), rd: RichText = { v: 1, paras: [[{ t: "", ...(style.bold ? { b: true } : {}), ...(style.italic ? { i: true } : {}), ...(style.underline ? { u: true } : {}), ...(style.strike ? { s: true } : {}) }]], font: settings.textFont, size: settings.textSize, color: colorHex(settings.textColor), align: settings.textAlign, lh: settings.textLh, width, bm: [1, 0, 0, 1, at.x, at.y] };
    this.openEditor(pv, { kind: "new", at, rd, scale: 1 }, null);
  }
  /**
   * Opens the contenteditable rich-text editor on a page. Tracks the selection's inline style, list type,
   * font and size so the ribbon can reflect them (via onEditor).
   */
  openEditor(pv: PageView, target: EditorTarget, bounds: Rect | null): void {
    const rd = target.rd, el = h("div", { class: "editor rich", contenteditable: "true", spellcheck: "true", role: "textbox", "aria-multiline": "true", "aria-label": "Text" });
    el.innerHTML = richToHtml(rd, (size: number) => size * target.scale * this.v.zoom, (key: string) => fontCss(fontByKey(key)));
    pv.ov.append(el);
    const firstSpan: Partial<Run> = rd.paras[0]?.[0] || {};
    this.editor = { pv, el, ...target, fontKey: rd.font, size: rd.size, color: hexToRgba(rd.color), align: rd.align, lh: rd.lh, style: { bold: !!firstSpan.b, italic: !!firstSpan.i, underline: !!firstSpan.u, strike: !!firstSpan.s }, bounds } as EditorState;
    try {
      document.execCommand("styleWithCSS", false, "false");
      document.execCommand("defaultParagraphSeparator", false, "div");
    } catch {
    }
    this.styleEditor();
    el.addEventListener("input", () => this.placeEditor());
    el.addEventListener("paste", (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text/plain") || "";
      document.execCommand("insertText", false, text.replace(/\r/g, ""));
    });
    el.addEventListener("keydown", (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Escape") {
        e.preventDefault();
        this.cancelEditor();
      } else if ((e.metaKey || e.ctrlKey) && !e.altKey && ["b", "i", "u"].includes(e.key.toLowerCase()) && !e.shiftKey) {
        e.preventDefault();
        this.onFormatKey(e.key.toLowerCase());
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "x") {
        e.preventDefault();
        this.onFormatKey("x");
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey || target.kind === "object" && !e.shiftKey)) {
        // a single-line object commits on Enter; otherwise Ctrl/Cmd+Enter
        e.preventDefault();
        this.commitEditor();
      }
    });
    el.addEventListener("pointerdown", (e: Event) => e.stopPropagation());
    const onSelectionChange = () => {
      const editor = this.editor;
      if (!editor || editor.el !== el) {
        document.removeEventListener("selectionchange", onSelectionChange);
        return;
      }
      if (!el.contains(document.getSelection()?.anchorNode || null)) return;
      const sel = document.getSelection()!;
      if (sel.rangeCount) editor.range = sel.getRangeAt(0).cloneRange();
      const commandState = (command: string) => {
        try {
          return document.queryCommandState(command);
        } catch {
          return false;
        }
      };
      const style = { bold: commandState("bold"), italic: commandState("italic"), underline: commandState("underline"), strike: commandState("strikeThrough") }, list = this.listState(), anchor = document.getSelection()?.anchorNode, anchorEl = (anchor instanceof HTMLElement ? anchor : anchor?.parentElement) || null;
      let font = anchorEl?.closest<HTMLElement>("[data-f]")?.dataset.f, size = +(anchorEl?.closest<HTMLElement>("[data-z]")?.dataset.z || 0) || undefined;
      // a selection spanning several spans: use the font/size only if all of them agree
      if ((!font || !size) && sel.rangeCount && !sel.isCollapsed) {
        const fragment = sel.getRangeAt(0).cloneContents(), common = (attr: string) => {
          const values = [...fragment.querySelectorAll<HTMLElement>(`[data-${attr}]`)].map((node) => node.dataset[attr]);
          return values.length && values.every((v) => v === values[0]) ? values[0] : undefined;
        };
        font ||= common("f");
        size ||= +(common("z") || 0) || undefined;
      }
      if (styleCode(style) !== styleCode(editor.style) || list !== editor.list || font !== editor.selFont || size !== editor.selSize) {
        editor.style = style;
        editor.list = list;
        editor.selFont = font;
        editor.selSize = size;
        this.onEditor(editor);
      }
    };
    document.addEventListener("selectionchange", onSelectionChange);
    this.onEditor(this.editor);
    requestAnimationFrame(() => {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = document.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      this.placeEditor();
    });
    // re-place once the web font has loaded (metrics change)
    loadFace(resolveFace(fontByKey(rd.font), {})).then(() => this.placeEditor()).catch(() => {
    });
  }
  /** Toggles a bulleted ("b") or numbered list in the editor. */
  toggleList(kind: "b" | "n"): void {
    const editor = this.editor;
    if (editor) {
      editor.el.focus();
      document.execCommand(kind === "b" ? "insertUnorderedList" : "insertOrderedList");
      this.onEditor(editor);
    }
  }
  /** List type at the editor selection: "b" bulleted, "n" numbered, or null. */
  listState(): "b" | "n" | null {
    const commandState = (command: string) => {
      try {
        return document.queryCommandState(command);
      } catch {
        return false;
      }
    };
    return commandState("insertUnorderedList") ? "b" : commandState("insertOrderedList") ? "n" : null;
  }
  /**
   * Applies a style change from the ribbon. With a non-empty selection, colour, font and size apply to the
   * selection only; otherwise they become the editor's defaults. Inline styles toggle via execCommand.
   */
  setEditorStyle(change: { style?: Partial<InlineStyle>; color?: RGBA; fontKey?: string; size?: number; align?: string; lh?: number }): void {
    const editor = this.editor;
    if (!editor) return;
    // work on a copy: fontKey / size are dropped below when they only applied to the selection
    change = { ...change };
    editor.el.focus();
    if (editor.range && editor.el.contains(editor.range.startContainer)) {
      const sel = document.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(editor.range);
    }
    const sel = document.getSelection(), hasSelection = !!sel && !sel.isCollapsed && editor.el.contains(sel.anchorNode);
    if (change.style) {
      const commands = { bold: "bold", italic: "italic", underline: "underline", strike: "strikeThrough" } as const;
      for (const key of Object.keys(commands) as (keyof InlineStyle)[]) {
        if (change.style[key] !== undefined && !!change.style[key] != !!editor.style[key]) document.execCommand(commands[key]);
      }
      editor.style = { ...editor.style, ...change.style };
    }
    if (change.color) {
      if (hasSelection) document.execCommand("foreColor", false, "#" + colorHex(change.color));
      else editor.color = change.color;
    }
    if (change.fontKey) {
      if (hasSelection && applySpanStyle(editor.el, "f", change.fontKey, fontCss(fontByKey(change.fontKey)))) {
        editor.selFont = change.fontKey;
        loadFace(resolveFace(fontByKey(change.fontKey), {})).catch(() => {
        });
        delete change.fontKey;
      } else editor.fontKey = change.fontKey;
    }
    if (change.size) {
      if (hasSelection && applySpanStyle(editor.el, "z", String(change.size), change.size * editor.scale * this.v.zoom + "px")) {
        editor.selSize = change.size;
        delete change.size;
      } else editor.size = change.size;
    }
    {
      const after = document.getSelection();
      if (after?.rangeCount && editor.el.contains(after.anchorNode)) editor.range = after.getRangeAt(0).cloneRange();
    }
    if (change.align) editor.align = change.align;
    if (change.lh) editor.lh = change.lh;
    this.styleEditor();
    // fontKey is still set only when it became the editor's default font
    if (change.fontKey) loadFace(resolveFace(fontByKey(editor.fontKey), {})).then(() => this.placeEditor()).catch((err: Error) => toast(err.message, "err"));
    this.onEditor(editor);
  }
  /** Applies the editor's default font, size, colour, line height, alignment and wrap width to its element. */
  styleEditor(): void {
    const editor = this.editor;
    if (!editor) return;
    const font = fontByKey(editor.fontKey), zoom = this.v.zoom, px = editor.size * editor.scale * zoom;
    Object.assign(editor.el.style, { fontFamily: fontCss(font), fontSize: px + "px", color: rgbCss(editor.color), lineHeight: String(editor.lh), textAlign: editor.align, whiteSpace: editor.rd.width ? "pre-wrap" : "pre", width: editor.rd.width ? editor.rd.width * editor.scale * zoom + "px" : "auto" });
    this.placeEditor();
  }
  /** Positions the editor so its first baseline sits on the text's baseline (new text: `at` is the top-left). */
  placeEditor(): void {
    const editor = this.editor;
    if (!editor) return;
    const zoom = this.v.zoom, px = editor.size * editor.scale * zoom, lineH = editor.lh * px;
    let x: number, baseline: number;
    if (editor.kind === "new") {
      const [dx, dy] = this.v.toDev(editor.pv, editor.at!.x, editor.at!.y);
      x = dx;
      baseline = dy + 0.8 * px;
    } else [x, baseline] = this.v.toDev(editor.pv, editor.rd.bm[4], editor.rd.bm[5]);
    const top = baseline - ((lineH - 1.2 * px) / 2 + 0.92 * px) - 3;
    editor.el.style.left = x - 4 + "px";
    editor.el.style.top = top + "px";
    if (!editor.rd.width) {
      editor.el.style.width = "auto";
      editor.el.style.minWidth = Math.max(40, (editor.bounds ? this.v.zoom * (editor.bounds.r - editor.bounds.l) : 0) + 8) + "px";
    }
  }
  /** Closes the editor without saving. */
  cancelEditor(): void {
    const editor = this.editor;
    if (editor) {
      this.editor = null;
      editor.el.remove();
      this.onEditor(null);
      this.overlay(editor.pv);
    }
  }
  /** Reads the editor's content back into a rich-text document. */
  editorDoc(editor: EditorState): RichText {
    const parsed = htmlToRich(editor.el, colorHex(editor.color), editor.fontKey, editor.size), paras = parsed.paras.map(normalizeRuns), lists = parsed.lists.some(Boolean) ? parsed.lists : undefined, doc = { ...editor.rd, paras, font: editor.fontKey, size: editor.size, color: colorHex(editor.color), align: editor.align, lh: editor.lh };
    if (lists) doc.lists = lists;
    else delete doc.lists;
    return doc;
  }
  /**
   * Closes the editor and writes the text to the page: new text is added as a Margin block (in a font that
   * can show it), an edited block is replaced, and edited plain text is changed in place when possible
   * (single object, same style, simple script) or replaced by a new block. Unchanged text is left alone and
   * emptied text is deleted.
   */
  async commitEditor(): Promise<void> {
    const editor = this.editor;
    if (!editor) return;
    const doc = this.editorDoc(editor);
    this.editor = null;
    editor.el.remove();
    this.onEditor(null);
    const pdf = this.app.doc, page = editor.pv.index, plain = plainText(doc), unchanged = sameRichDoc(doc, editor.rd);
    try {
      if (editor.kind === "new") {
        if (!plain.trim()) {
          this.overlay(editor.pv);
          return;
        }
        const matrix = await this.newBlockMatrix(editor);
        let fallbacks: string[] = [];
        await this.app.mutate("Add text", { pages: [page] }, async () => {
          fallbacks = (await writeRichText(pdf, page, { ...doc, bm: matrix })).fallbacks;
        });
        tellFallbacks(doc.font, fallbacks);
      } else if (editor.kind === "block") {
        if (unchanged) {
          this.overlay(editor.pv);
          return;
        }
        await this.app.mutate("Edit text", { pages: [page] }, async () => {
          removeById(pdf, page, editor.blockId!);
          if (plain.trim()) tellFallbacks(doc.font, (await writeRichText(pdf, page, doc)).fallbacks);
        });
      } else {
        if (unchanged) {
          this.overlay(editor.pv);
          return;
        }
        const objs = editor.objs!, first = objs[0], indices = objs.map((o) => o.index), sameStyle = doc.paras.length === 1 && doc.paras[0].length === 1 && sameRunStyle(doc.paras[0][0], editor.rd.paras[0][0]) && doc.font === editor.rd.font && doc.size === editor.rd.size && doc.color === editor.rd.color;
        await this.app.mutate("Edit text", { pages: [page] }, async () => {
          if (!plain.trim()) return removeObjects(pdf, page, indices);
          // try changing the text in place; otherwise delete the objects and write a new block
          if (!(editor.kind === "object" && sameStyle && objs.length === 1 && !needsShaping(plain) && replaceObjectText(pdf, page, first.index, plain))) {
            removeObjects(pdf, page, indices);
            tellFallbacks(doc.font, (await writeRichText(pdf, page, doc)).fallbacks);
          }
        });
      }
    } catch (err) {
      toast((err as Error).message || "Edit failed", "err");
      this.overlay(editor.pv);
    }
  }
  /**
   * Text matrix for new text at `editor.at`: axes aligned with the screen (so text on a rotated page reads
   * upright), origin moved down by the font's ascent so `at` is the top of the first line.
   */
  async newBlockMatrix(editor: EditorState): Promise<Matrix> {
    const pv = editor.pv, inv = pv.inv, [ox, oy] = inv.apply(0, 0), [rx, ry] = inv.apply(1, 0), [dx, dy] = inv.apply(0, 1);
    let ax = rx - ox, ay = ry - oy;
    const aLen = Math.hypot(ax, ay);
    ax /= aLen;
    ay /= aLen;
    // screen y points down; text space y points up
    let bx = -(dx - ox), by = -(dy - oy);
    const bLen = Math.hypot(bx, by);
    bx /= bLen;
    by /= bLen;
    const ascent = ((await loadFont(fontByKey(editor.fontKey)).catch(() => null))?.ascent ?? 0.8) * editor.size, at = editor.at!;
    return [ax, ay, bx, by, at.x - bx * ascent, at.y - by * ascent];
  }
}

/**
 * Groups a page's text objects into editable runs: one per Margin block (by id, lines in order, text from the
 * stored rich text when present), one per rotated/skewed object, and for upright text, runs of objects on the
 * same baseline with similar size, same colour and font, split at gaps wider than 1.6 × the font size.
 */
function groupTextRuns(objs: TextObj[]): TextRun[] {
  const runs: TextRun[] = [], blocks = new Map<string, TextObj[]>(), plain: TextObj[] = [];
  for (const obj of objs) {
    if (obj.margin?.id) {
      const list = blocks.get(obj.margin.id) || [];
      list.push(obj);
      blocks.set(obj.margin.id, list);
    } else plain.push(obj);
  }
  for (const list of blocks.values()) {
    list.sort((a, b) => a.margin!.ln - b.margin!.ln);
    const stored = list.find((o) => o.margin!.rt)?.margin!.rt, rich = stored ? decodeRichText(stored) : null;
    runs.push({ objs: list, bounds: unionRect(list.map((o) => o.bounds)), block: true, text: rich ? plainText(rich) : list.map((o) => o.text).join(`
`) });
  }
  const sizeOf = (o: TextObj) => o.fontSize * matrixScale(o.matrix), isUpright = (o: TextObj) => Math.abs(o.matrix[1]) < 1e-3 && Math.abs(o.matrix[2]) < 1e-3 && o.matrix[0] > 0 && o.matrix[3] > 0, transformed = plain.filter((o) => !isUpright(o));
  for (const obj of transformed) runs.push({ objs: [obj], bounds: obj.bounds, block: false, text: obj.text });
  // top to bottom, left to right
  const upright = plain.filter(isUpright).sort((a, b) => b.matrix[5] - a.matrix[5] || a.matrix[4] - b.matrix[4]), lines: TextObj[][] = [];
  for (const obj of upright) {
    const line = lines.find((l) => Math.abs(l[0].matrix[5] - obj.matrix[5]) < sizeOf(l[0]) * 0.2 && Math.abs(sizeOf(l[0]) - sizeOf(obj)) < sizeOf(l[0]) * 0.15);
    if (line) line.push(obj);
    else lines.push([obj]);
  }
  for (const line of lines) {
    line.sort((a, b) => a.bounds.l - b.bounds.l);
    let current: TextObj[] = [];
    const flush = () => {
      if (current.length) {
        const text = joinRunText(current);
        if (!text.trim()) {
          current = [];
          return;
        }
        runs.push({ objs: current, bounds: unionRect(current.map((o) => o.bounds)), block: false, text });
        current = [];
      }
    };
    for (const obj of line) {
      const prev = current[current.length - 1];
      if (prev && (obj.bounds.l - prev.bounds.r > sizeOf(prev) * 1.6 || obj.color.slice(0, 3).join() !== prev.color.slice(0, 3).join() || obj.fontName !== prev.fontName)) flush();
      current.push(obj);
    }
    flush();
  }
  return runs;
}

/**
 * Joins the text of a run's objects, inserting a space at visible gaps (> 0.22 em) and skipping objects that
 * duplicate the previous one at the same place (fake bold drawn twice).
 */
function joinRunText(objs: TextObj[]): string {
  let text = "", prev: TextObj | null = null;
  for (const obj of objs) {
    if (obj.text) {
      if (prev) {
        if (obj.bounds.l >= prev.bounds.l - 0.6 && obj.bounds.r <= prev.bounds.r + 0.6 && obj.text.trim() === prev.text.trim()) {
          if (/\s$/.test(obj.text) && !/\s$/.test(text)) text += " ";
          continue;
        }
        const gap = obj.bounds.l - prev.bounds.r, em = obj.fontSize * matrixScale(obj.matrix);
        if (gap > em * 0.22 && !/\s$/.test(text) && !/^\s/.test(obj.text)) text += " ";
      }
      text += /\s$/.test(text) ? obj.text.replace(/^\s+/, "") : obj.text;
      prev = obj;
    }
  }
  return text.replace(/\s+$/, "");
}

/** Horizontal scale of a matrix (length of its x axis; 1 if degenerate). */
const matrixScale = (m: number[]): number => Math.hypot(m[0], m[1]) || 1;

/** Removes skew from a matrix: makes the y axis perpendicular to the x axis (keeps rotation, scale, translation). */
function unskewMatrix(m: number[]): Matrix {
  const [a, b, c, d, e, f] = m, lenSq = a * a + b * b || 1, proj = (a * c + b * d) / lenSq;
  return [a, b, c - proj * a, d - proj * b, e, f];
}

/** Normalised rectangle spanned by two points. */
const rectFrom2 = (a: Pt, b: Pt): Rect => ({ l: Math.min(a.x, b.x), r: Math.max(a.x, b.x), b: Math.min(a.y, b.y), t: Math.max(a.y, b.y) });

/** Ramer–Douglas–Peucker simplification of a polyline with the given tolerance. */
function simplifyPath(points: Pt[], tolerance: number): Pt[] {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  for (; stack.length; ) {
    const [from, to] = stack.pop()!;
    let maxDist = 0, maxAt = -1;
    for (let i = from + 1; i < to; i++) {
      const a = points[from], b = points[to], p = points[i], dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, d = Math.abs(dy * p.x - dx * p.y + b.x * a.y - b.y * a.x) / len;
      if (d > maxDist) {
        maxDist = d;
        maxAt = i;
      }
    }
    if (maxDist > tolerance && maxAt > 0) {
      keep[maxAt] = 1;
      stack.push([from, maxAt], [maxAt, to]);
    }
  }
  return points.filter((_p, i) => keep[i]);
}

/** Copies the inked part of a canvas (alpha > 8) plus a 6 px margin; null if nothing was drawn. */
function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement | null {
  const ctx = canvas.getContext("2d")!, { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let row = 0; row < height; row++) for (let col = 0; col < width; col++) {
    if (data[(row * width + col) * 4 + 3] > 8) {
      if (col < minX) minX = col;
      if (col > maxX) maxX = col;
      if (row < minY) minY = row;
      if (row > maxY) maxY = row;
    }
  }
  if (maxX <= minX || maxY <= minY) return null;
  const pad = 6;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const out = h("canvas", { width: maxX - minX + 1, height: maxY - minY + 1 });
  out.getContext("2d")!.drawImage(canvas, minX, minY, maxX - minX + 1, maxY - minY + 1, 0, 0, maxX - minX + 1, maxY - minY + 1);
  return out;
}

/** Ribbon metadata for each tool: label, keyboard shortcut, icon name and the hint shown while it is active. */
export type ToolInfo = { label: string; key: string; icon: string; hint: string };

const TOOL_INFO: Record<string, ToolInfo> = { select: { label: "Select", key: "V", icon: "select", hint: "Click an object to select it: drag to move, drag a handle to resize. Shift-click or drag a box to select more. Double-click to edit text or a comment." }, edittext: { label: "Text", key: "T", icon: "edittext", hint: "Click text to edit it, or drag it to move it. Click an empty spot to add new text." }, highlight: { label: "Highlight", key: "H", icon: "highlight", hint: "Drag across text to highlight it." }, underline: { label: "Underline", key: "U", icon: "underline", hint: "Drag across text to underline it." }, strike: { label: "Strikeout", key: "K", icon: "strike", hint: "Drag across text to strike it out." }, draw: { label: "Draw", key: "D", icon: "draw", hint: "Draw freehand on the page." }, rect: { label: "Rectangle", key: "R", icon: "rect", hint: "Drag to draw a rectangle." }, form: { label: "Form field", key: "F", icon: "formfield", hint: "Pick a field type, then drag a box (or click). Click a field to rename it or change its options; drag it to move it." }, redact: { label: "Redact", key: "X", icon: "redact", hint: "Sweep across text or drag over an area to mark it. Nothing is removed until you apply." }, link: { label: "Link", key: "G", icon: "link", hint: "Sweep across text or drag a box to add a link. Click a link to edit or remove it; drag it to move it." }, stamp: { label: "Stamp", key: "P", icon: "stamp", hint: "Pick a stamp, then click the page." }, textbox: { label: "Text box & callout", key: "B", icon: "textbox", hint: "Drag a box, or click, then type. Click a text box to edit it." }, line: { label: "Line & arrow", key: "L", icon: "line", hint: "Drag to draw. Shift keeps it to 45° steps." }, ellipse: { label: "Ellipse", key: "O", icon: "ellipse", hint: "Drag to draw an ellipse." }, note: { label: "Note", key: "N", icon: "note", hint: "Click to pin a sticky note." }, sign: { label: "Signature", key: "S", icon: "sign", hint: "Click the page where the signature should go." }, crop: { label: "Crop pages", key: "C", icon: "crop", hint: "Drag a rectangle around the part of the page to keep." }, image: { label: "Image", key: "I", icon: "image", hint: "Click to place at natural size, or drag a box to size it. You can also paste or drop an image." } };

/**
 * Replaces a run's text with plain `text` (used by find & replace). A Margin block is redrawn with its stored
 * style; other text is changed in place when possible, otherwise deleted and redrawn on one line in a matching
 * font. Empty text deletes the run.
 */
async function replaceRunText(pdf: Doc, page: number, run: TextRun, text: string): Promise<void> {
  if (run.block) {
    const first = run.objs[0], meta = first.margin!;
    removeById(pdf, page, meta.id);
    if (!text.trim()) return;
    // the engine types matrices and colours as number[]; they are always 6 / 4 entries
    const matrix = (meta.bm || unskewMatrix(first.matrix)) as Matrix, color = meta.color ? parseHexColor(meta.color) : first.color as RGBA;
    await writeText(pdf, page, { lines: text.split(`
`), fontKey: meta.font || "sarabun", size: meta.size || first.fontSize, color, matrix, ...parseStyleCode(meta.st || ""), align: meta.al || "left", lineHeight: meta.lh || 1.5 });
    return;
  }
  const objs = run.objs, first = objs[0], indices = objs.map((o) => o.index), oneLine = text.replace(/\n+/g, " ");
  if (!oneLine.trim()) {
    removeObjects(pdf, page, indices);
    return;
  }
  if (objs.length === 1 && !needsShaping(oneLine) && replaceObjectText(pdf, page, first.index, oneLine)) return;
  const baseFont = first.fontName.replace(/^[A-Z]{6}\+/, ""), style = { bold: /bold|black|heavy|semibold|demi/i.test(baseFont), italic: /italic|oblique/i.test(baseFont) || Math.abs(first.matrix[2]) > 0.05 * Math.abs(first.matrix[3]) };
  removeObjects(pdf, page, indices);
  await writeText(pdf, page, { lines: [oneLine], fontKey: guessFontKey(first.fontName, oneLine), size: first.fontSize, color: first.color as RGBA, matrix: unskewMatrix(first.matrix), ...style });
}

/** Says which fonts Margin used for characters the chosen font can't show. */
function tellFallbacks(chosenKey: string, fallbacks: string[]): void {
  if (!fallbacks.length) return;
  const names = fallbacks.map((key) => fontByKey(key).label.split(" · ")[0]);
  toast(`${fontByKey(chosenKey).label.split(" · ")[0]} can’t show some of these characters, so Margin used ${names.join(" and ")} for them.`, "warn", 4800);
}

/**
 * The rich-text document of a Margin block: its stored rich text, or (older blocks) one paragraph per line
 * rebuilt from the objects' text and the block's stored style.
 */
function blockRichDoc(run: TextRun): RichText {
  const withRich = run.objs.find((o) => o.margin?.rt), stored = withRich ? decodeRichText(withRich.margin!.rt!) : null;
  if (stored) return stored;
  const first = run.objs[0], meta = first.margin!, byLine = new Map<number, string>();
  for (const obj of run.objs) byLine.set(obj.margin!.ln, (byLine.get(obj.margin!.ln) || "") + obj.text);
  const count = Math.max(...byLine.keys()) + 1, lines: string[] = [];
  for (let i = 0; i < count; i++) lines.push(byLine.get(i) || "");
  return richFromPlain(lines, { font: meta.font || "sarabun", size: meta.size || first.fontSize, color: meta.color || colorHex(first.color), st: meta.st || "", align: meta.al || "left", lh: meta.lh || 1.5, bm: meta.bm || unskewMatrix(first.matrix) });
}

/**
 * The paragraph `run` belongs to: upright single-line runs of the same font, size and colour, left-aligned
 * with it, stacked at a steady line spacing (0.9–2.2 em). A line much shorter than the ones above ends the
 * paragraph. Returns the lines top to bottom, or just `[run]`.
 */
function paragraphOf(runs: TextRun[], run: TextRun): TextRun[] {
  const metrics = (r: TextRun) => {
    const first = r.objs[0];
    return { font: first.fontName, size: first.fontSize * matrixScale(first.matrix), color: first.color.slice(0, 3).join(), left: r.bounds.l, base: first.matrix[5] };
  }, ref = metrics(run), isUpright = (r: TextRun) => r.objs.every((o) => Math.abs(o.matrix[1]) < 1e-3 && Math.abs(o.matrix[2]) < 1e-3 && o.matrix[0] > 0 && o.matrix[3] > 0);
  if (!isUpright(run)) return [run];
  const candidates = runs.filter((r) => {
    if (r.block || !isUpright(r)) return false;
    const m = metrics(r);
    return m.font === ref.font && Math.abs(m.size - ref.size) < ref.size * 0.05 && m.color === ref.color && Math.abs(m.left - ref.left) < Math.max(2, ref.size * 0.3);
  }).sort((a, b) => metrics(b).base - metrics(a).base), widthOf = (r: TextRun) => r.bounds.r - r.bounds.l, paras: TextRun[][] = [];
  for (const cand of candidates) {
    const para = paras[paras.length - 1], last = para?.[para.length - 1];
    let joins = !!last;
    if (last) {
      const step = metrics(last).base - metrics(cand).base;
      if (step < ref.size * 0.9 || step > ref.size * 2.2) joins = false;
      else if (para.length > 1) {
        const prevStep = metrics(para[para.length - 2]).base - metrics(last).base;
        if (Math.abs(prevStep - step) > ref.size * 0.25) joins = false;
      }
      // a short last line ends the paragraph
      if (joins && widthOf(last) < Math.max(...para.map(widthOf)) * 0.8 && para.length > 1) joins = false;
      if (joins && para.length === 1 && widthOf(last) < widthOf(cand) * 0.6) joins = false;
    }
    if (joins) para.push(cand);
    else paras.push([cand]);
  }
  return paras.find((p) => p.includes(run)) || [run];
}

/** Joins wrapped lines into one string: drops a line-end hyphen before a letter, no space between Thai characters. */
function joinLines(lines: string[]): string {
  let text = "";
  for (const line of lines.map((l) => l.trim())) {
    if (!text) {
      text = line;
      continue;
    }
    const end = text[text.length - 1], start = line[0];
    if (end === "-" && /[a-z]/i.test(start)) {
      text = text.slice(0, -1) + line;
      continue;
    }
    text += /[฀-๿]/.test(end) && /[฀-๿]/.test(start) ? line : " " + line;
  }
  return text;
}

/** Same inline style (bold, italic, underline, strike, colour) for two rich-text spans. */
const sameRunStyle = (a: Run | undefined, b: Run | undefined): boolean => !!a?.b == !!b?.b && !!a?.i == !!b?.i && !!a?.u == !!b?.u && !!a?.s == !!b?.s && (a?.c || "") === (b?.c || "");

/** Whether two rich-text documents have the same content and formatting (normalised spans, lists, width). */
function sameRichDoc(a: RichText, b: RichText): boolean {
  const key = (d: RichText) => JSON.stringify({ p: d.paras.map((para) => normalizeRuns(para).map((span) => ({ ...span }))), f: d.font, s: d.size, c: d.color, a: d.align, l: d.lh, w: d.width || 0, li: (d.lists || []).map((l) => l || "").join(",").replace(/,+$/, "") });
  return key(a) === key(b);
}

export { TOOL_INFO, groupTextRuns, blockRichDoc, Interact, replaceRunText };
