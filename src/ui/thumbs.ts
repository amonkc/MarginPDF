import { icon, h } from './dom';
import type { App } from '../app';

/** Thumbnail width in CSS pixels. */
const THUMB_W = 112;

type ThumbItem = { wrap: HTMLElement; canvas: HTMLCanvasElement; dirty: boolean };

/**
 * The page thumbnails sidebar: lazy-rendered thumbnails, click/shift/ctrl selection, drag to reorder, and
 * "+" insertion points between pages (blank page, pages from a PDF, or PDF files dropped there).
 */
class Thumbs {
  el: HTMLElement;
  list: HTMLElement;
  app: App;
  items: ThumbItem[] = [];
  io: IntersectionObserver;
  /** Page a shift-click range extends from. */
  anchor = 0;
  onGo: (page: number) => void = () => {
  };
  onSelection: () => void = () => {
  };
  onMove: (pages: number[], to: number) => void = () => {
  };
  onInsertBlank: (at: number) => void = () => {
  };
  onInsertFrom: (at: number, files?: File[]) => void = () => {
  };
  constructor(el: HTMLElement, app: App) {
    this.el = el;
    this.app = app;
    this.list = h("div", { class: "thumb-list", role: "listbox", "aria-label": "Pages", "aria-multiselectable": "true" });
    el.append(this.list);
    this.io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) this.draw(+(entry.target as HTMLElement).dataset.index!);
      }
    }, { root: this.list, rootMargin: "300px 0px" });
  }
  /** Rebuilds all thumbnails (after the page structure changed), keeping the scroll position. */
  rebuild(): void {
    const scrollTop = this.list.scrollTop;
    this.io.disconnect();
    this.list.replaceChildren();
    this.items = [];
    const pageCount = this.app.doc.pageCount;
    for (let page = 0; page < pageCount; page++) {
      const { w, h: pageH } = this.app.doc.pageSize(page), canvas = h("canvas", { class: "tcanvas" }), width = THUMB_W, height = Math.round(width * (pageH / w));
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      const wrap = h("div", { class: "thumb", role: "option", tabindex: "0", draggable: "true", "data-index": String(page), "aria-label": `Page ${page + 1}` }, h("div", { class: "tframe" }, canvas), h("span", { class: "tlabel", text: String(page + 1) }));
      wrap.addEventListener("click", (e) => this.click(page, e));
      wrap.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.click(page, e);
        }
      });
      this.dnd(wrap, page);
      this.list.append(this.gap(page, pageCount), wrap);
      this.items.push({ wrap, canvas, dirty: true });
      this.io.observe(wrap);
    }
    this.list.append(this.gap(pageCount, pageCount));
    this.list.scrollTop = scrollTop;
    this.mark();
  }
  /** The insertion point before page `at` (or after the last page when `at === pageCount`). */
  gap(at: number, pageCount: number): HTMLElement {
    const where = at === 0 ? "before page 1" : at === pageCount ? `after page ${pageCount}` : `between pages ${at} and ${at + 1}`, menuItem = (text: string, run: () => void) => h("button", { class: "gap-item", type: "button", role: "menuitem", text, onclick: (e) => {
      e.stopPropagation();
      closeMenu();
      run();
    } }), menu = h("div", { class: "gap-menu", role: "menu", hidden: true }, menuItem("Blank page", () => this.onInsertBlank(at)), menuItem("Pages from a PDF…", () => this.onInsertFrom(at))), plus = h("button", { class: "gap-plus", type: "button", "aria-haspopup": "menu", "aria-expanded": "false", "aria-label": `Insert ${where}`, title: `Insert ${where}` }, icon("plus")), onOutsidePointer = (e: PointerEvent) => {
      if (!gapEl.contains(e.target as Node)) closeMenu();
    }, onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        plus.focus();
      }
    }, closeMenu = () => {
      menu.hidden = true;
      gapEl.classList.remove("open");
      plus.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", onOutsidePointer, true);
      document.removeEventListener("keydown", onKey, true);
    };
    plus.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!menu.hidden) return closeMenu();
      // Close any other open insertion menu first.
      this.list.querySelectorAll<HTMLElement>(".tgap.open .gap-plus").forEach((other) => other !== plus && other.click());
      menu.hidden = false;
      gapEl.classList.add("open");
      plus.setAttribute("aria-expanded", "true");
      document.addEventListener("pointerdown", onOutsidePointer, true);
      document.addEventListener("keydown", onKey, true);
      (menu.firstElementChild as HTMLElement).focus();
    });
    const gapEl = h("div", { class: "tgap" + (at === pageCount ? " end" : ""), "data-at": String(at) }, h("span", { class: "gap-line", "aria-hidden": "true" }), plus, menu);
    gapEl.addEventListener("dragover", (e) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
        e.stopPropagation();
        gapEl.classList.add("drop");
      }
    });
    gapEl.addEventListener("dragleave", () => gapEl.classList.remove("drop"));
    gapEl.addEventListener("drop", (e) => {
      gapEl.classList.remove("drop");
      const pdfs = [...e.dataTransfer?.files || []].filter((f) => /\.pdf$/i.test(f.name) || f.type === "application/pdf");
      if (pdfs.length) {
        e.preventDefault();
        e.stopPropagation();
        this.onInsertFrom(at, pdfs);
      }
    });
    return gapEl;
  }
  /** Marks thumbnails stale and redraws those in or near view; the rest redraw when scrolled into view. */
  invalidate(pages: number[] | "all"): void {
    const indices = pages === "all" ? this.items.map((_item, i) => i) : pages;
    for (const page of indices) {
      const item = this.items[page];
      if (!item) continue;
      item.dirty = true;
      const box = item.wrap.getBoundingClientRect(), listBox = this.list.getBoundingClientRect();
      if (box.bottom > listBox.top - 300 && box.top < listBox.bottom + 300) this.draw(page);
    }
  }
  /** Renders a stale thumbnail. */
  draw(page: number): void {
    const item = this.items[page];
    if (!item || !item.dirty) return;
    item.dirty = false;
    const { w, h } = this.app.doc.pageSize(page), pxW = THUMB_W * Math.min(2, devicePixelRatio || 1), pxH = Math.round(pxW * (h / w));
    this.app.relieveMemory(page);
    const image: ImageData = this.app.doc.render(page, pxW, pxH);
    item.canvas.width = image.width;
    item.canvas.height = image.height;
    item.canvas.getContext("2d")!.putImageData(image, 0, 0);
    item.canvas.style.height = Math.round(THUMB_W * (h / w)) + "px";
  }
  /** Click selection: shift extends a range, Ctrl/Cmd toggles, a plain click selects one page and goes to it. */
  click(page: number, e: MouseEvent | KeyboardEvent): void {
    const selected = this.app.selectedPages;
    if (e.shiftKey) {
      const [from, to] = [Math.min(this.anchor, page), Math.max(this.anchor, page)];
      for (let p = from; p <= to; p++) selected.add(p);
    } else if (e.metaKey || e.ctrlKey) {
      if (selected.has(page)) selected.delete(page);
      else selected.add(page);
      this.anchor = page;
    } else {
      selected.clear();
      selected.add(page);
      this.anchor = page;
      this.onGo(page);
    }
    this.mark();
    this.onSelection();
  }
  /** Syncs the selected/current classes with the app state. */
  mark(): void {
    this.items.forEach((item, page) => {
      item.wrap.classList.toggle("sel", this.app.selectedPages.has(page));
      item.wrap.classList.toggle("cur", this.app.currentPage === page);
      item.wrap.setAttribute("aria-selected", String(this.app.selectedPages.has(page)));
    });
  }
  /** Marks the current page and scrolls its thumbnail into view if needed. */
  follow(page: number): void {
    this.mark();
    const item = this.items[page];
    if (!item) return;
    const box = item.wrap.getBoundingClientRect(), listBox = this.list.getBoundingClientRect();
    if (box.top < listBox.top || box.bottom > listBox.bottom) item.wrap.scrollIntoView({ block: "nearest" });
  }
  /** Drag-to-reorder for one thumbnail; dragging moves the whole selection. File drags are left to the gaps. */
  dnd(wrap: HTMLElement, page: number): void {
    wrap.addEventListener("dragstart", (e) => {
      if (!this.app.selectedPages.has(page)) {
        this.app.selectedPages.clear();
        this.app.selectedPages.add(page);
        this.mark();
        this.onSelection();
      }
      e.dataTransfer!.effectAllowed = "move";
      e.dataTransfer!.setData("text/plain", "margin-pages");
      wrap.classList.add("dragging");
    });
    wrap.addEventListener("dragend", () => {
      wrap.classList.remove("dragging");
      this.list.querySelectorAll(".drop-before,.drop-after").forEach((x) => x.classList.remove("drop-before", "drop-after"));
    });
    wrap.addEventListener("dragover", (e) => {
      if (e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault();
      const box = wrap.getBoundingClientRect(), after = e.clientY > box.top + box.height / 2;
      wrap.classList.toggle("drop-after", after);
      wrap.classList.toggle("drop-before", !after);
    });
    wrap.addEventListener("dragleave", () => wrap.classList.remove("drop-before", "drop-after"));
    wrap.addEventListener("drop", (e) => {
      if (e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault();
      e.stopPropagation();
      const after = wrap.classList.contains("drop-after");
      wrap.classList.remove("drop-before", "drop-after");
      // Target index in the page list once the moved pages are taken out.
      const moving = [...this.app.selectedPages].sort((a, b) => a - b), dropAt = page + (after ? 1 : 0), to = dropAt - moving.filter((p) => p < dropAt).length;
      if (moving.length && !(moving.length === 1 && to === moving[0])) this.onMove(moving, to);
    });
  }
}

/** The toolbar of page actions under the thumbnails; `run` receives the action id (e.g. "rotl", "delete"). */
function pageActions(run: (action: string) => void): HTMLElement {
  const button = (action: string, iconName: string, label: string) => h("button", { class: "iconbtn", type: "button", title: label, "aria-label": label, "data-act": action, onclick: () => run(action) }, icon(iconName));
  return h("div", { class: "page-actions" }, button("rotl", "rotl", "Rotate left"), button("rotr", "rotr", "Rotate right"), button("insert", "plus", "Insert blank page after"), button("merge", "merge", "Insert pages from other PDFs"), button("copy", "copy", "Copy selected pages (Ctrl+C)"), button("paste", "paste", "Paste copied pages after the selected page (Ctrl+V)"), button("extract", "extract", "Extract or split pages"), button("delete", "trash", "Delete selected pages"));
}

export { pageActions, Thumbs };
