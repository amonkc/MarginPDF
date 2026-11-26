import { loadFont, fontCss, outlineFontFor, renderFreeText, freeTextHeight, DEFAULT_FT_BORDER_WIDTH } from '../engine/text';
import { toast, svg, h } from './dom';
import type { FreeTextData, FreeTextStyle, Pt, RGBA, Rect } from '../engine/types';
import type { App } from '../app';
import type { PageView, Viewer } from './viewer';

/**
 * Drag helper the interact layer passes to tools: tracks the pointer from `ev` and calls `onMove` with each
 * page-space point and `onUp` with the last one.
 */
type DragFn = (ev: PointerEvent, pv: PageView, onMove: (p: Pt) => void, onUp: (p: Pt) => void) => void;

/** The text box editor currently open on a page. `done(true)` saves, `done(false)` discards. */
type OpenEditor = { pv: PageView; el: HTMLTextAreaElement; done: (commit: boolean) => Promise<void> };

const rgbString = (c: RGBA | number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;
/** Width (pt) of a text box made by a click instead of a drag. */
const DEFAULT_BOX_WIDTH = 200;

/** Text box and callout tool: draws new boxes and edits their text in an in-place textarea. */
class TextBoxes {
  app: App;
  v: Viewer;
  open: OpenEditor | null = null;
  onChange: () => void = () => {
  };
  constructor(app: App, viewer: Viewer) {
    this.app = app;
    this.v = viewer;
  }
  /** Style for new text boxes, from the current settings. */
  style(): FreeTextStyle {
    const settings = this.app.settings;
    return { fontKey: settings.textFont, size: settings.ftSize, color: settings.ftColor, fill: settings.ftFill, border: settings.ftBorder, borderWidth: 1 };
  }
  /**
   * Pointer down with the text box tool. A plain box spans the drag (or is a default-size box on a click);
   * a callout is dragged from the point it points at to where the box goes.
   */
  down(ev: PointerEvent, pv: PageView, drag: DragFn): void {
    if (this.open) {
      this.open.done(true);
      return;
    }
    // On an existing text box: edit it rather than stack a new one on top.
    const at: Pt = this.v.toPage(pv, ev), existing = this.boxAt(pv, at);
    if (existing != null) {
      ev.preventDefault();
      this.edit(pv, existing);
      return;
    }
    const start: Pt = at, callout: boolean = this.app.settings.ftCallout, zoom: number = this.v.zoom, boxFor = (p: Pt): Rect => {
      if (!callout) return Math.abs(p.x - start.x) < 6 && Math.abs(p.y - start.y) < 6 ? { l: start.x, r: start.x + DEFAULT_BOX_WIDTH, t: start.y, b: start.y - this.app.settings.ftSize * 2.2 } : { l: Math.min(start.x, p.x), r: Math.max(start.x, p.x), b: Math.min(start.y, p.y), t: Math.max(start.y, p.y) };
      // Callout: a fixed-size box beside the pointer, on the side away from the tip.
      const w = DEFAULT_BOX_WIDTH * 0.8, h = this.app.settings.ftSize * 2.2, left = p.x >= start.x ? p.x : p.x - w, top = p.y >= start.y ? p.y + h : p.y;
      return { l: left, r: left + w, t: top, b: top - h };
    };
    let last = start;
    drag(ev, pv, (p) => {
      last = p;
      const box = pv.tf.box(boxFor(p)), shapes: SVGElement[] = [svg("rect", { x: box.x, y: box.y, width: box.w, height: box.h, fill: "none", stroke: "var(--sel)", "stroke-dasharray": "4 3" })];
      if (callout) {
        const [tipX, tipY] = pv.tf.apply(start.x, start.y);
        shapes.push(svg("line", { x1: tipX, y1: tipY, x2: box.x + box.w / 2, y2: box.y + box.h / 2, stroke: "var(--sel)", "stroke-dasharray": "4 3" }));
      }
      pv.svg.replaceChildren(...shapes);
    }, (p) => {
      last = p;
      if (callout && Math.hypot(last.x - start.x, last.y - start.y) < 12 / zoom) {
        toast("Drag from the point the callout should point at to where the box goes", "warn");
        return;
      }
      const box = boxFor(last);
      this.edit(pv, null, { box: box, tip: callout ? start : undefined, text: "", style: this.style() });
    });
  }
  /** The text box annotation whose box (not its callout line) contains `at`, frontmost first, or null. */
  boxAt(pv: PageView, at: Pt): number | null {
    const boxes = this.v.annotsOf(pv).filter((a: { subtype: number }) => a.subtype === 3).reverse();
    for (const a of boxes as { index: number; rect: Rect }[]) {
      const box = this.app.doc.readFreeText(pv.index, a.index)?.box || a.rect;
      if (at.x >= box.l && at.x <= box.r && at.y >= box.b && at.y <= box.t) return a.index;
    }
    return null;
  }
  /**
   * Opens the in-place editor for text box `annot` on `pv`, or for the new box `data` when `annot` is null.
   * Saving grows the box to fit the text; saving it empty deletes the box.
   */
  async edit(pv: PageView, annot: number | null, data?: FreeTextData): Promise<void> {
    if (this.open) this.open.done(true);
    const doc = this.app.doc, ft: FreeTextData | null = data || (annot != null ? doc.readFreeText(pv.index, annot) : null);
    if (!ft) return;
    // Load the font first so the textarea shows the text in the face it will be drawn with.
    const font = await outlineFontFor(ft.style.fontKey, ft.text || "ก");
    await loadFont(font).catch(() => {
    });
    const box = pv.tf.box(ft.box), zoom: number = this.v.zoom, st = ft.style, borderW = st.border ? st.borderWidth ?? DEFAULT_FT_BORDER_WIDTH : 0, editor = h("textarea", { class: "ftedit", spellcheck: true, "aria-label": "Text box" }) as HTMLTextAreaElement;
    editor.value = ft.text;
    Object.assign(editor.style, { left: box.x + "px", top: box.y + "px", width: box.w + "px", minHeight: box.h + "px", padding: (4 + borderW) * zoom + "px", fontFamily: fontCss(font), fontSize: st.size * zoom + "px", lineHeight: "1.3", color: rgbString(st.color), background: st.fill ? rgbString(st.fill) : "rgba(255,255,255,.85)", borderColor: st.border ? rgbString(st.border) : "transparent", borderWidth: Math.max(1, borderW * zoom) + "px" });
    const autoHeight = () => {
      editor.style.height = "0px";
      editor.style.height = Math.max(box.h, editor.scrollHeight) + "px";
    };
    pv.ov.append(editor);
    autoHeight();
    editor.addEventListener("input", autoHeight);
    editor.addEventListener("pointerdown", (e) => e.stopPropagation());
    let closed = false;
    const close = async (commit: boolean): Promise<void> => {
      if (closed) return;
      closed = true;
      this.open = null;
      editor.remove();
      this.onChange();
      const text = editor.value.replace(/\r/g, "").replace(/\s+$/, "");
      if (!commit || text === ft.text && annot != null) {
        this.app.emit({ pages: [pv.index] });
        return;
      }
      const page = pv.index;
      try {
        if (!text) {
          if (annot != null) await this.app.mutate("Delete text box", { pages: [page] }, () => doc.deleteAnnot(page, annot));
          else this.app.emit({ pages: [page] });
          return;
        }
        // New callouts take the height of their text; other boxes only ever grow.
        const next = { ...ft, text: text }, textH = await freeTextHeight(next), height = annot == null && ft.tip ? textH : Math.max(textH, ft.box.t - ft.box.b);
        next.box = { ...ft.box, b: ft.box.t - height };
        await this.app.mutate(annot == null ? ft.tip ? "Callout" : "Text box" : "Edit text box", { pages: [page] }, async () => {
          const index = annot ?? doc.createFreeText(page, this.app.settings.author);
          await renderFreeText(doc, page, index, next);
        });
      } catch (err) {
        toast((err as Error).message, "err");
      }
    };
    editor.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Escape") {
        e.preventDefault();
        close(false);
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        close(true);
      }
    });
    // Blur saves, unless focus comes straight back (e.g. a click on the textarea's own scrollbar).
    editor.addEventListener("blur", () => setTimeout(() => {
      if (!closed && document.activeElement !== editor) close(true);
    }, 120));
    this.open = { pv: pv, el: editor, done: close };
    this.onChange();
    const focusEnd = () => {
      if (editor.isConnected && !closed) {
        editor.focus({ preventScroll: true });
        editor.setSelectionRange(editor.value.length, editor.value.length);
      }
    };
    focusEnd();
    requestAnimationFrame(focusEnd);
  }
  /**
   * Rewrites text box `annot` on `page` with `change` applied to its data, growing the box if the text no
   * longer fits. `label` names the undo step.
   */
  async update(page: number, annot: number, change: (d: FreeTextData) => FreeTextData, label: string): Promise<void> {
    const doc = this.app.doc, current = doc.readFreeText(page, annot);
    if (!current) return;
    const next = change(structuredClone(current)), textH = await freeTextHeight(next);
    if (next.box.t - next.box.b < textH) next.box.b = next.box.t - textH;
    await this.app.mutate(label, { pages: [page] }, () => renderFreeText(doc, page, annot, next)).catch((err) => toast(err.message, "err"));
  }
}

export { TextBoxes };
