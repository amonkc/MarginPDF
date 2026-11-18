import type { RGBA } from './engine/types';
import { Growable } from './engine/growable';
import { objectIndex, ENGINE_FULL, compactDelta, isEngineAbort } from './engine/pdfium';
import type { Doc, Pdfium } from './engine/pdfium';
import { DEFAULT_HEADER_FOOTER } from './ui/headerfooter';
import type { HeaderFooterSettings } from './ui/headerfooter';
import { DEFAULT_WATERMARK } from './ui/watermark';
import type { WatermarkSettings } from './ui/watermark';

/** Most undo steps kept. */
const MAX_UNDO = 100;
/** Edits allowed by the "modify annotations" permission (bit 6, value 32). */
const ANNOT_EDIT_LABELS = /^(Add note|Highlight|Underline|Strikeout|Draw|Rectangle|Ellipse|Line|Arrow|Move annotation|Delete annotation|Edit comment|Reply|Edit reply|Delete reply|Change color|Callout|Text box|Edit text box|Delete text box|Stamp|Place signature|Sign field|Edit line|Fill field|Toggle checkbox|Choose option)$/;
/** Edits allowed by the "fill form fields" permission (bit 9, value 256). */
const FORM_FILL_LABELS = /^(Fill field|Toggle checkbox|Choose option|Sign field)$/;
/** Estimated bytes of loaded pages above which the document is reloaded to free memory. */
const EVICT_AT = 512 * 1024 * 1024;
/** Files larger than this are saved incrementally only (a full rewrite would not fit in a tab's memory). */
const FULL_SAVE_MAX = 600 * 1024 * 1024;
/** Bytes of superseded file buffers (left by full rewrites) the undo history may hold before old steps are dropped. */
const HISTORY_BUFFERS_MAX = 512 * 1024 * 1024;

/** Reads a saved preference; the stored value is parsed JSON, so its shape is the caller's to trust. */
const loadPref = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem("margin." + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const savePref = (key: string, value: unknown): void => {
  try {
    localStorage.setItem("margin." + key, JSON.stringify(value));
  } catch {
  }
};

/** User settings (tool colours, sizes, author name, header/footer and watermark presets), kept in localStorage ("margin.settings"). Colours are RGBA 0–255; null means none. */
export type Settings = {
  author: string;
  markupColor: RGBA; lineMarkupColor: RGBA;
  inkColor: RGBA; inkWidth: number;
  /** rectangles and ellipses: outline (null = none), width, fill (null = none), opacity 0–1 */
  shapeColor: RGBA | null; shapeWidth: number; shapeFill: RGBA | null; shapeOpacity: number;
  lineColor: RGBA; lineWidth: number; lineEnds: string;
  ftSize: number; ftColor: RGBA; ftFill: RGBA | null; ftBorder: RGBA | null; ftCallout: boolean;
  stamp: string; stampCustom: string; stampColor: RGBA; stampDated: boolean;
  redactMode: string; formKind: string; formLastGroup: string; redactFill: RGBA | null;
  noteColor: RGBA;
  textColor: RGBA; textFont: string; textSize: number; textStyle: string; textAlign: string; textLh: number;
  hf: HeaderFooterSettings; wm: WatermarkSettings;
};

/** Default tool settings; saved settings are merged over these. */
const DEFAULT_SETTINGS: Settings = { author: "Me", markupColor: [246, 214, 74, 255], lineMarkupColor: [214, 69, 52, 255], inkColor: [214, 69, 52, 255], inkWidth: 2, shapeColor: [37, 99, 235, 255], shapeWidth: 1.5, shapeFill: null, shapeOpacity: 1, lineColor: [214, 69, 52, 255], lineWidth: 2, lineEnds: "arrow", ftSize: 12, ftColor: [24, 26, 33, 255], ftFill: [255, 255, 255, 255], ftBorder: [214, 69, 52, 255], ftCallout: false, stamp: "approved", stampCustom: "", stampColor: [37, 99, 235, 255], stampDated: true, redactMode: "text", formKind: "text", formLastGroup: "", redactFill: [0, 0, 0, 255], noteColor: [246, 214, 74, 255], textColor: [24, 26, 33, 255], textFont: "sarabun", textSize: 14, textStyle: "", textAlign: "left", textLh: 1.5, hf: DEFAULT_HEADER_FOOTER, wm: DEFAULT_WATERMARK };

/** What an edit changed: the pages to re-render (or all), and whether pages were added, removed or reordered. */
export type Change = { pages: number[] | 'all'; structure?: boolean };

/**
 * An undo/redo snapshot. The file buffer is append-only between full rewrites, so a snapshot is just the
 * buffer plus the length it had (incremental saves append after it), plus the passwords in force.
 */
export type Snapshot = { label?: string; file: Growable; len: number; change?: Change; pw?: string; owner?: string };

/** The selected annotation, by page and annotation index. */
export type AnnotRef = { page: number; index: number; [k: string]: unknown };

/**
 * Document state: the open PDF, its backing file buffer, undo/redo history, settings, the current tool and
 * selection. Every edit goes through {@link App.mutate}, which runs the change against the PDFium document and
 * commits it as an incremental update appended to the file.
 */
class App {
  lib: Pdfium;
  /** The open document (set by {@link App.open} before anything else uses it). */
  doc!: Doc;
  fileName = "document.pdf";
  dirty = false;
  tool = "select";
  undoStack: Snapshot[] = [];
  redoStack: Snapshot[] = [];
  /** The PDF file bytes; only the first `cur` bytes are the current document. */
  file!: Growable;
  /** Length of the current document within `file`. */
  cur = 0;
  /** Object offsets of the current file (lazily built), used to write compact incremental updates. */
  index: Map<number, number> | null = null;
  password = "";
  ownerPassword = "";
  /** Next commit must rewrite the whole file (e.g. after changing encryption). */
  rewriteNext = false;
  busy = false;
  /** Hook applied once to the next incremental update's bytes (ignored if it changes their length). */
  pendingPatch: ((bytes: Uint8Array) => Uint8Array) | null = null;
  /** Set when content was redacted: the file must be fully rewritten on export for it to really be gone. */
  mustRewrite = false;
  listeners: ((change: Change) => void)[] = [];
  toolListeners: ((tool: string) => void)[] = [];
  settings: Settings = { ...DEFAULT_SETTINGS, ...loadPref<Partial<Settings>>("settings", {}) };
  saveSettings(): void {
    savePref("settings", this.settings);
  }
  selectedAnnot: AnnotRef | null = null;
  selectedPages: Set<number> = new Set();
  currentPage = 0;
  constructor(lib: Pdfium) {
    this.lib = lib;
  }
  /** Opens `bytes` as the current document, discarding history and selection. */
  open(bytes: Growable | Uint8Array, name: string, password: string = ""): void {
    const file = bytes instanceof Growable ? bytes : Growable.from(bytes), doc = this.lib.open(file.view(), password);
    if (this.doc) this.doc.close();
    this.doc = doc;
    this.file = file;
    this.cur = file.len;
    this.index = null;
    this.password = password;
    this.ownerPassword = "";
    this.mustRewrite = false;
    this.fileName = name;
    this.dirty = false;
    this.undoStack = [];
    this.redoStack = [];
    this.selectedAnnot = null;
    this.selectedPages.clear();
    this.currentPage = 0;
    this.emit({ pages: "all", structure: true });
  }
  on(listener: (change: Change) => void): void {
    this.listeners.push(listener);
  }
  onTool(listener: (tool: string) => void): void {
    this.toolListeners.push(listener);
  }
  emit(change: Change): void {
    for (const listener of this.listeners) listener(change);
  }
  setTool(tool: string): void {
    this.tool = tool;
    this.selectedAnnot = null;
    for (const listener of this.toolListeners) listener(tool);
  }
  /**
   * Writes the document's pending changes into the file: normally as a compact incremental update appended
   * after `cur`; when no delta is possible (or a rewrite was requested) the whole file is replaced.
   * The PDFium document is then reloaded from the new bytes.
   */
  commit(): void {
    const doc = this.doc, delta = this.rewriteNext ? null : doc.saveDelta(this.cur);
    if (!delta) {
      this.rewriteNext = false;
      this.file = Growable.from(doc.save());
      this.cur = this.file.len;
      this.index = null;
      doc.swap(this.file.view(), this.password, undefined, this.ownerPassword);
      return;
    }
    const current = this.file.view(this.cur);
    this.index ??= objectIndex(current);
    const newOffsets = new Map<number, number>();
    let update = compactDelta(current, delta, this.index, newOffsets);
    if (this.pendingPatch) {
      const patch = this.pendingPatch;
      this.pendingPatch = null;
      const patched = patch(update);
      if (patched.length === update.length) update = patched;
    }
    this.file.writeAt(this.cur, update);
    this.cur = this.file.len;
    for (const [key, offset] of newOffsets) this.index!.set(key, offset);
    doc.swap(this.file.view(this.cur), this.password, undefined, this.ownerPassword);
  }
  /** Whether the document is encrypted with restrictions still in force, and its permission bits. */
  get limits(): { locked: boolean; perms: number } {
    // 4|8|16|32|256|1024: the permission bits that matter for editing; all set means unrestricted.
    const { encrypted, perms } = this.doc.security(), allEdits = 1340;
    return { locked: encrypted && (perms & allEdits) !== allEdits, perms };
  }
  /** Why the edit called `label` isn't allowed by the PDF's permissions, or null if it is. */
  blocked(label: string): string | null {
    const { locked, perms } = this.limits;
    return !locked || perms & 8 || perms & 32 && ANNOT_EDIT_LABELS.test(label) || perms & 256 && FORM_FILL_LABELS.test(label) ? null : "This PDF’s permissions don’t allow that change. Unlock it with its permissions password (the lock button) to edit it.";
  }
  /** Unlocks permissions with the owner password; returns whether it was correct. */
  unlock(ownerPassword: string): boolean {
    if (this.doc.unlockOwner(ownerPassword)) {
      this.ownerPassword = ownerPassword;
      this.emit({ pages: [] });
      return true;
    }
    return false;
  }
  /** Encrypts the document with the given passwords and permission bits. */
  async protect(userPassword: string, ownerPassword: string, perms: number): Promise<void> {
    if (this.cur > FULL_SAVE_MAX) throw new Error("Files over 600 MB can’t be protected here: encrypting rewrites the whole file, which needs more memory than a browser tab has.");
    await this.mutate("Protect document", { pages: [] }, () => {
      if (!this.doc.setProtection(userPassword, ownerPassword, perms)) throw new Error("The document could not be encrypted");
      this.password = userPassword;
      this.ownerPassword = ownerPassword;
      this.rewriteNext = true;
    });
  }
  /** Removes encryption. */
  async unprotect(): Promise<void> {
    if (this.cur > FULL_SAVE_MAX) throw new Error("Protection can’t be removed from files over 600 MB here: decrypting rewrites the whole file, which needs more memory than a browser tab has.");
    await this.mutate("Remove protection", { pages: [] }, () => {
      if (!this.doc.removeProtection()) throw new Error("The protection could not be removed");
      this.password = "";
      this.ownerPassword = "";
      this.rewriteNext = true;
    });
  }
  get fileSize(): number {
    return this.cur;
  }
  /** Registers a one-shot patch for the bytes of the next incremental update. */
  patchNextCommit(patch: (bytes: Uint8Array) => Uint8Array): void {
    this.pendingPatch = patch;
  }
  /** The bytes to save: a full rewrite when the file is small enough, otherwise the incremental file as is. */
  exportBytes(): Uint8Array {
    if (this.cur <= FULL_SAVE_MAX) return this.doc.save();
    if (this.mustRewrite) throw new Error("This file is too large to save with redactions applied: the redacted content can only be removed by rewriting the whole file, which needs more memory than a browser tab has. Extract the pages you need first, then redact them.");
    return this.file.view(this.cur);
  }
  /** Reloads the document from a snapshot and clamps the page selection to the new page count. */
  restore(snapshot: Snapshot): void {
    if (snapshot.file !== this.file || snapshot.len !== this.cur) this.index = null;
    this.file = snapshot.file;
    this.cur = snapshot.len;
    if (snapshot.pw != null) {
      this.password = snapshot.pw;
      this.ownerPassword = snapshot.owner ?? "";
    }
    this.doc.swap(this.file.view(this.cur), this.password, undefined, this.ownerPassword);
    this.selectedAnnot = null;
    const pageCount = this.doc.pageCount;
    this.selectedPages = new Set([...this.selectedPages].filter((p) => p < pageCount));
    if (this.currentPage >= pageCount) this.currentPage = Math.max(0, pageCount - 1);
  }
  /**
   * Reloads the document (dropping every loaded page) when the loaded pages are estimated to use too much
   * memory. Skipped mid-operation, or when `page` (about to be used) is already loaded.
   */
  relieveMemory(page?: number | null): void {
    const doc = this.doc, pageCount = doc.pageCount;
    if (!pageCount || doc.depth || this.busy || page != null && doc.loaded.has(page) || doc.loaded.size * (this.cur / pageCount) < EVICT_AT) return;
    doc.swap(this.file.view(this.cur), this.password, undefined, this.ownerPassword);
  }
  /** Caps the undo history by count, and by the memory held in old file buffers (from full rewrites). */
  trimHistory(): void {
    while (this.undoStack.length > MAX_UNDO) this.undoStack.shift();
    const otherBuffersSize = () => {
      const buffers = new Set<Growable>();
      for (const snap of [...this.undoStack, ...this.redoStack]) if (snap.file !== this.file) buffers.add(snap.file);
      let total = 0;
      for (const buf of buffers) total += buf.len;
      return total;
    };
    while (this.undoStack.length && this.undoStack[0].file !== this.file && otherBuffersSize() > HISTORY_BUFFERS_MAX) this.undoStack.shift();
  }
  /**
   * Runs one undoable edit: checks permissions, runs `run` against the document, commits it to the file and
   * records an undo snapshot. On failure the document is restored to its previous state and the error rethrown
   * (engine aborts become a generic "out of memory" style error).
   */
  async mutate(label: string, change: Change, run: () => unknown): Promise<void> {
    const reason = this.blocked(label);
    if (reason) throw new Error(reason);
    const snapshot: Snapshot = { label, file: this.file, len: this.cur, change, pw: this.password, owner: this.ownerPassword };
    // Start from a freshly loaded document when many pages are cached, to keep memory down.
    if (this.doc.loaded.size > 2 && !this.doc.depth) this.doc.swap(this.file.view(this.cur), this.password, undefined, this.ownerPassword);
    this.busy = true;
    try {
      try {
        await run();
        this.commit();
      } catch (err) {
        this.pendingPatch = null;
        this.rewriteNext = false;
        if (isEngineAbort(err)) throw new Error(ENGINE_FULL);
        try {
          this.restore(snapshot);
        } catch {
        }
        throw err;
      }
    } finally {
      this.busy = false;
    }
    this.undoStack.push(snapshot);
    this.redoStack = [];
    this.trimHistory();
    this.dirty = true;
    this.emit(change);
  }
  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }
  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }
  get undoLabel(): string | undefined {
    return this.undoStack.at(-1)?.label;
  }
  get redoLabel(): string | undefined {
    return this.redoStack.at(-1)?.label;
  }
  /** Undoes the last edit; returns its label, or null if there was nothing to undo. */
  undo(): string | null | undefined {
    const snapshot = this.undoStack.pop();
    if (!snapshot) return null;
    this.redoStack.push({ label: snapshot.label, file: this.file, len: this.cur, change: snapshot.change, pw: this.password, owner: this.ownerPassword });
    this.step(snapshot);
    return snapshot.label;
  }
  /** Redoes the last undone edit; returns its label, or null if there was nothing to redo. */
  redo(): string | null | undefined {
    const snapshot = this.redoStack.pop();
    if (!snapshot) return null;
    this.undoStack.push({ label: snapshot.label, file: this.file, len: this.cur, change: snapshot.change, pw: this.password, owner: this.ownerPassword });
    this.step(snapshot);
    return snapshot.label;
  }
  /** Restores an undo/redo snapshot and notifies listeners of what it touched. */
  step(snapshot: Snapshot): void {
    const pageCountBefore = this.doc.pageCount;
    this.restore(snapshot);
    this.dirty = true;
    const change = snapshot.change!;
    this.emit(this.doc.pageCount !== pageCountBefore || change.structure || change.pages === "all" ? { pages: "all", structure: change.structure || this.doc.pageCount !== pageCountBefore } : { pages: [...change.pages] });
  }
  /**
   * Reopens unsaved work kept by the session store: the file at length `cur`, its undo/redo history and page.
   * Throws like {@link App.open} (e.g. a PdfError asking for the password).
   */
  resume(state: { file: Growable; cur: number; name: string; undo: Snapshot[]; redo: Snapshot[]; page: number; mustRewrite: boolean }, password = ""): void {
    this.open(state.file, state.name, password);
    if (state.cur !== state.file.len) this.restore({ file: state.file, len: state.cur });
    this.undoStack = state.undo;
    this.redoStack = state.redo;
    this.mustRewrite = state.mustRewrite;
    this.currentPage = Math.min(state.page, Math.max(0, this.doc.pageCount - 1));
    this.dirty = true;
    this.emit({ pages: "all", structure: true });
  }
  /** Replaces the document bytes without recording history. */
  replaceDoc(bytes: Uint8Array): void {
    this.restore({ file: Growable.from(bytes), len: bytes.length });
  }
  /** Suggested file name for saving a copy: "name_edited.pdf". */
  get editedName(): string {
    return this.fileName.replace(/\.pdf$/i, "") + "_edited.pdf";
  }
}

export { App, FULL_SAVE_MAX };
