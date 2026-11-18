import { openMenu } from './ctxmenu';
import { toast, icon, h } from './dom';
import type { ToastHandle } from './dom';
import type { Bookmark } from '../engine/types';
import type { TextObjectInfo } from '../engine/pdfium';
import type { Viewer } from './viewer';
import type { App } from '../app';

/** A bookmark's tree path as a string key, e.g. "0.2.1". */
const pathKey = (path: number[]): string => path.join(".");

/** Moves available for a bookmark (null when not possible from where it is). */
type BookmarkMoves = { up: (() => void) | null; down: (() => void) | null; indent: (() => void) | null; outdent: (() => void) | null };

/** The bookmarks (outline) panel: an editable ARIA tree with keyboard navigation and a context menu. */
class Bookmarks {
  el: HTMLElement;
  app: App;
  /** The viewer. */
  v: Viewer;
  tree: HTMLElement;
  empty: HTMLElement;
  items: Bookmark[] = [];
  /** Expanded rows, by path key. */
  open: Set<string> = new Set();
  /** Selected row's path key. */
  sel: string | null = null;
  onCount: (count: number) => void = () => {
  };
  constructor(app: App, viewer: Viewer) {
    this.app = app;
    this.v = viewer;
    this.tree = h("div", { class: "bm-tree", role: "tree", "aria-label": "Bookmarks" });
    this.empty = h("div", { class: "empty-note" }, h("p", { text: "No bookmarks yet." }), h("p", { class: "hint", text: "Add one to mark the page you’re looking at. Bookmarks are saved in the PDF, so other readers see them too." }));
    const addBtn = h("button", { class: "btn ghost small", type: "button", title: "Bookmark the current view", onclick: () => this.addHere() }, icon("plus"), "Add bookmark");
    this.el = h("div", { class: "bm-pane" }, h("div", { class: "bm-actions" }, addBtn), this.empty, this.tree);
    this.tree.addEventListener("keydown", (e) => this.key(e));
    app.on(() => this.refresh());
  }
  /** Re-reads the outline and rebuilds the tree. */
  refresh(): void {
    try {
      this.items = this.app.doc.outline();
    } catch {
      this.items = [];
    }
    const countAll = (list: Bookmark[]): number => list.reduce((sum, b) => sum + 1 + countAll(b.children), 0);
    this.onCount(countAll(this.items));
    this.empty.hidden = this.items.length > 0;
    this.tree.replaceChildren(...this.items.map((b) => this.row(b, 1)));
    const selRow = this.sel && this.tree.querySelector(`[data-path="${this.sel}"]`);
    if (selRow) selRow.classList.add("sel");
  }
  /** Builds the tree node for `bm` at nesting `level` (1-based), including its expanded children. */
  row(bm: Bookmark, level: number): HTMLElement {
    const key = pathKey(bm.path), expanded = this.open.has(key), hasChildren = bm.children.length > 0, rowEl = h("div", { class: "bm-row" + (this.sel === key ? " sel" : ""), role: "treeitem", tabindex: this.sel === key || !this.sel && key === "0" ? "0" : "-1", "data-path": key, "aria-level": String(level), ...hasChildren ? { "aria-expanded": String(expanded) } : {}, title: bm.uri ? bm.uri : bm.page >= 0 ? `Page ${bm.page + 1}` : "No target", style: { paddingLeft: 6 + (level - 1) * 14 + "px" } }, h("button", { class: "bm-twist" + (hasChildren ? "" : " none"), type: "button", tabindex: "-1", "aria-hidden": "true", text: hasChildren ? expanded ? "▾" : "▸" : "", onclick: (e: MouseEvent) => {
      e.stopPropagation();
      this.toggle(key);
    } }), h("span", { class: "bm-title", text: bm.title || "Untitled" }), h("span", { class: "bm-page", text: bm.page >= 0 ? String(bm.page + 1) : bm.uri ? "↗" : "" }));
    rowEl.addEventListener("click", () => {
      this.select(key);
      this.go(bm);
    });
    rowEl.addEventListener("dblclick", (e) => {
      e.preventDefault();
      this.rename(bm);
    });
    rowEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.select(key);
      this.menu(bm, e.clientX, e.clientY, rowEl);
    });
    const node = h("div", { class: "bm-node", role: "none" }, rowEl);
    if (hasChildren && expanded) node.append(h("div", { role: "group" }, ...bm.children.map((child) => this.row(child, level + 1))));
    return node;
  }
  /** The bookmark with path key `key`, searched depth-first. */
  find(key: string, list: Bookmark[] = this.items): Bookmark | null {
    for (const b of list) {
      if (pathKey(b.path) === key) return b;
      const found = this.find(key, b.children);
      if (found) return found;
    }
    return null;
  }
  /** The list `bm` belongs to (its parent's children, or the top level). */
  siblings(bm: Bookmark): Bookmark[] {
    const parent = bm.path.length > 1 ? this.find(pathKey(bm.path.slice(0, -1))) : null;
    return parent ? parent.children : this.items;
  }
  /** Selects the row with path key `key` (roving tabindex). */
  select(key: string): void {
    this.sel = key;
    this.tree.querySelectorAll<HTMLElement>(".bm-row").forEach((rowEl) => {
      const isSel = rowEl.dataset.path === key;
      rowEl.classList.toggle("sel", isSel);
      rowEl.tabIndex = isSel ? 0 : -1;
    });
  }
  focus(key: string): void {
    this.select(key);
    this.tree.querySelector<HTMLElement>(`[data-path="${key}"]`)?.focus();
  }
  /** Expands/collapses a row (`force` sets the state, otherwise it flips). */
  toggle(key: string, force?: boolean): void {
    if (force ?? !this.open.has(key)) this.open.add(key);
    else this.open.delete(key);
    this.refresh();
    this.focus(key);
  }
  /** Follows a bookmark: opens its link, or scrolls the viewer to its page and position. */
  go(bm: Bookmark): ToastHandle | void {
    if (bm.uri) {
      try {
        window.open(bm.uri, "_blank", "noopener");
      } catch {
        toast(bm.uri);
      }
      return;
    }
    if (bm.page < 0 || bm.page >= this.app.doc.pageCount) return toast("This bookmark doesn’t point to a page", "warn");
    this.v.scrollToPoint(bm.page, bm.top);
  }
  /** Runs an outline edit as an undoable step, reporting errors as a toast. */
  async edit(label: string, run: () => unknown): Promise<void> {
    await this.app.mutate(label, { pages: [] }, run).catch((err) => toast(err.message, "err"));
  }
  /**
   * Adds a bookmark for the current view after the selected one (or inside it when `inside`), or at the end
   * when nothing is selected, then starts renaming it.
   */
  async addHere(inside: boolean = false): Promise<void> {
    const { page, y: top } = this.v.viewTop(), selected = this.sel ? this.find(this.sel) : null, parentPath = selected ? inside ? selected.path : selected.path.slice(0, -1) : [], position = selected ? inside ? selected.children.length : selected.path[selected.path.length - 1] + 1 : this.items.length, title = this.suggestTitle(page);
    await this.edit("Add bookmark", () => this.app.doc.addBookmark(parentPath, position, title, page, top));
    const newKey = pathKey([...parentPath, position]);
    if (inside && selected) this.open.add(pathKey(selected.path));
    this.refresh();
    this.select(newKey);
    const added = this.find(newKey);
    if (added) this.rename(added);
  }
  /** A default title: the page's largest text (a likely heading), else "Page N". */
  suggestTitle(page: number): string {
    try {
      const text = this.app.doc.textObjects(page).filter((t) => t.text.trim().length >= 3).reduce<TextObjectInfo | null>((best, t) => !best || t.fontSize > best.fontSize + 0.5 ? t : best, null)?.text.trim();
      if (text) return text.length > 60 ? text.slice(0, 59) + "…" : text;
    } catch {
    }
    return `Page ${page + 1}`;
  }
  /** Turns a row's title into an inline text field; Enter or blur saves, Escape cancels. */
  rename(bm: Bookmark): void {
    const key = pathKey(bm.path), rowEl = this.tree.querySelector(`[data-path="${key}"]`);
    if (!rowEl) return;
    const titleEl = rowEl.querySelector(".bm-title")!, input = h("input", { class: "bm-edit", value: bm.title, "aria-label": "Bookmark name" });
    titleEl.replaceWith(input);
    input.focus();
    input.select();
    let done = false;
    const finish = async (save: boolean) => {
      if (done) return;
      done = true;
      const title = input.value.trim();
      if (save && title && title !== bm.title) await this.edit("Rename bookmark", () => this.app.doc.renameBookmark(bm.path, title));
      else this.refresh();
      this.focus(key);
    };
    input.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter") finish(true);
      else if (e.key === "Escape") finish(false);
    });
    input.addEventListener("blur", () => finish(true));
    input.addEventListener("click", (e) => e.stopPropagation());
  }
  /** The structural moves possible for `bm`. */
  moves(bm: Bookmark): BookmarkMoves {
    const siblings = this.siblings(bm), index = bm.path[bm.path.length - 1], parentPath = bm.path.slice(0, -1);
    // moveBookmark takes the insertion index before removal, hence index + 2 for "down".
    return { up: index > 0 ? () => this.move(bm, parentPath, index - 1, pathKey([...parentPath, index - 1])) : null, down: index < siblings.length - 1 ? () => this.move(bm, parentPath, index + 2, pathKey([...parentPath, index + 1])) : null, indent: index > 0 ? () => {
      const prev = siblings[index - 1];
      this.open.add(pathKey(prev.path));
      this.move(bm, prev.path, prev.children.length, pathKey([...prev.path, prev.children.length]));
    } : null, outdent: parentPath.length ? () => {
      const grandparentPath = parentPath.slice(0, -1), parentIndex = parentPath[parentPath.length - 1];
      this.move(bm, grandparentPath, parentIndex + 1, pathKey([...grandparentPath, parentIndex + 1]));
    } : null };
  }
  /** Moves `bm` under `toParent` at `toIndex`; `newKey` is where it ends up (to keep it expanded and focused). */
  async move(bm: Bookmark, toParent: number[], toIndex: number, newKey: string): Promise<void> {
    const oldKey = pathKey(bm.path), wasOpen = this.open.has(oldKey);
    // Forget the expanded state of the bookmark and its subtree only ("1" and "1.x", not "10").
    this.open = new Set([...this.open].filter((key) => key !== oldKey && !key.startsWith(oldKey + ".")));
    await this.edit("Move bookmark", () => this.app.doc.moveBookmark(bm.path, toParent, toIndex));
    if (wasOpen) {
      this.open.add(newKey);
      this.refresh();
    }
    this.focus(newKey);
  }
  /** Deletes `bm` and everything under it. */
  async remove(bm: Bookmark): Promise<void> {
    const countAll = (list: Bookmark[]): number => list.reduce((sum, b) => sum + 1 + countAll(b.children), 0), descendants = countAll(bm.children);
    await this.edit(descendants ? `Delete bookmark and ${descendants} under it` : "Delete bookmark", () => this.app.doc.deleteBookmark(bm.path));
    this.sel = null;
    this.refresh();
  }
  /** Opens the context menu for `bm` at a viewport position. Editing entries are disabled when permissions forbid changes. */
  menu(bm: Bookmark, clientX: number, clientY: number, anchor: HTMLElement): void {
    const moves = this.moves(bm), { locked, perms } = this.app.limits, canEdit = !locked || !!(perms & 8), { page } = this.v.viewTop();
    openMenu(clientX, clientY, [{ heading: bm.title.length > 32 ? bm.title.slice(0, 31) + "…" : bm.title || "Bookmark" }, { label: bm.uri ? "Open link" : "Go to bookmark", run: () => this.go(bm) }, { label: "Rename", shortcut: "F2", disabled: !canEdit, run: () => this.rename(bm) }, { label: `Point to the current view (page ${page + 1})`, disabled: !canEdit, run: () => {
      const view = this.v.viewTop();
      this.edit("Change bookmark target", () => this.app.doc.retargetBookmark(bm.path, view.page, view.y));
    } }, "sep", { label: "Add bookmark after", disabled: !canEdit, run: () => this.addHere(false) }, { label: "Add bookmark inside", disabled: !canEdit, run: () => this.addHere(true) }, "sep", { label: "Move up", shortcut: "Alt+↑", disabled: !canEdit || !moves.up, run: () => moves.up?.() }, { label: "Move down", shortcut: "Alt+↓", disabled: !canEdit || !moves.down, run: () => moves.down?.() }, { label: "Indent", shortcut: "Alt+→", disabled: !canEdit || !moves.indent, run: () => moves.indent?.() }, { label: "Outdent", shortcut: "Alt+←", disabled: !canEdit || !moves.outdent, run: () => moves.outdent?.() }, "sep", { label: bm.children.length ? "Delete with its children" : "Delete", shortcut: "Del", danger: true, disabled: !canEdit, run: () => this.remove(bm) }], anchor);
  }
  /** Tree keyboard handling (ARIA tree pattern plus Alt+arrows to move, F2, Delete, context menu key). */
  key(e: KeyboardEvent): void {
    const target = e.target as HTMLElement, rowEl = target.closest<HTMLElement>(".bm-row");
    if (!rowEl || target.tagName === "INPUT") return;
    const key = rowEl.dataset.path!, bm = this.find(key);
    if (!bm) return;
    const rows = [...this.tree.querySelectorAll<HTMLElement>(".bm-row")], rowIndex = rows.indexOf(rowEl), moves = this.moves(bm), consume = () => {
      e.preventDefault();
      e.stopPropagation();
    };
    if (e.altKey && e.key === "ArrowUp") {
      consume();
      moves.up?.();
    } else if (e.altKey && e.key === "ArrowDown") {
      consume();
      moves.down?.();
    } else if (e.altKey && e.key === "ArrowRight") {
      consume();
      moves.indent?.();
    } else if (e.altKey && e.key === "ArrowLeft") {
      consume();
      moves.outdent?.();
    } else if (e.key === "ArrowDown") {
      consume();
      if (rows[rowIndex + 1]) this.focus(rows[rowIndex + 1].dataset.path!);
    } else if (e.key === "ArrowUp") {
      consume();
      if (rows[rowIndex - 1]) this.focus(rows[rowIndex - 1].dataset.path!);
    } else if (e.key === "ArrowRight") {
      consume();
      if (bm.children.length && !this.open.has(key)) this.toggle(key, true);
      else if (bm.children.length) this.focus(pathKey(bm.children[0].path));
    } else if (e.key === "ArrowLeft") {
      consume();
      if (this.open.has(key)) this.toggle(key, false);
      else if (bm.path.length > 1) this.focus(pathKey(bm.path.slice(0, -1)));
    } else if (e.key === "Enter") {
      consume();
      this.go(bm);
    } else if (e.key === "F2") {
      consume();
      this.rename(bm);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      consume();
      this.remove(bm);
    } else if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
      consume();
      const box = rowEl.getBoundingClientRect();
      this.menu(bm, box.left + 24, box.bottom, rowEl);
    }
  }
}

export { Bookmarks };
