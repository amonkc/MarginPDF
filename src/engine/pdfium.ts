import { init as ji } from '@embedpdf/pdfium';
import type { WrappedPdfiumModule } from '@embedpdf/pdfium';
import { DEFAULT_FT_BORDER_WIDTH } from './types';
import type {
  AnnotInfo,
  AnnotStyle,
  Bookmark,
  Box,
  ClipAnnot,
  ClipObj,
  FreeTextData,
  ImageSrc,
  LineEnd,
  Matrix,
  Pt,
  RGBA,
  Rect,
} from './types';

// ---------------------------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------------------------

/** PDF annotation subtypes (FPDF_ANNOT_*) that Margin cares about. */
const ANNOT = { TEXT: 1, LINK: 2, FREETEXT: 3, LINE: 4, SQUARE: 5, CIRCLE: 6, HIGHLIGHT: 9, UNDERLINE: 10, SQUIGGLY: 11, STRIKEOUT: 12, STAMP: 13, INK: 15, POPUP: 16, WIDGET: 20, REDACT: 28 } as const;
/** User-facing names of the annotation subtypes Margin lists. */
const ANNOT_NAMES: Record<number, string> = { 1: "Note", 3: "Text box", 4: "Line", 5: "Rectangle", 6: "Ellipse", 9: "Highlight", 10: "Underline", 11: "Squiggly", 12: "Strikeout", 13: "Stamp", 15: "Drawing", 28: "Redaction" };
/** Form field types (FPDF_FORMFIELD_*). */
const FIELD = { PUSHBUTTON: 1, CHECKBOX: 2, RADIO: 3, COMBO: 4, LIST: 5, TEXT: 6, SIGNATURE: 7 } as const;
/** Render flags: FPDF_ANNOT | FPDF_REVERSE_BYTE_ORDER (RGBA output). */
const RENDER_FLAGS = 17;

// ---------------------------------------------------------------------------------------------
// Raw PDF byte helpers (run on the saved file, outside PDFium)
// ---------------------------------------------------------------------------------------------

/** Decode bytes as Latin-1 (one char per byte), in chunks to stay under the argument limit. */
function latin1(bytes: Uint8Array): string {
  let text = "";
  for (let at = 0; at < bytes.length; at += 32768) text += String.fromCharCode.apply(null, bytes.subarray(at, at + 32768) as unknown as number[]);
  return text;
}

/**
 * Post-save patch for things PDFium can't write itself, done in place without shifting any byte offsets
 * (each object is rewritten into the same length, padded with spaces, or left alone if it would grow):
 * - signature fields, created as text fields tagged /MarginSig, become real /FT/Sig fields;
 * - radio buttons tagged /MarginOn (…) get their "on" appearance state renamed from /Yes to that value.
 */
function nameRadioStates(bytes: Uint8Array): Uint8Array {
  const text = latin1(bytes);
  if (!text.includes("/MarginOn") && !text.includes("/MarginSig")) return bytes;
  const out = bytes.slice(), objRe = /(\d+ \d+ obj)([\s\S]*?)endobj/g;
  let match: RegExpExecArray | null;
  const sigParents = new Set<string>();
  for (const sig of text.matchAll(/(\d+ \d+) obj((?:(?!endobj)[\s\S])*?\/MarginSig[\s\S]*?)endobj/g)) {
    const parent = sig[2].match(/\/Parent\s*(\d+ \d+) R/);
    if (parent) sigParents.add(parent[1]);
  }
  const put = (at: number, s: string) => {
    for (let k = 0; k < s.length; k++) out[at + k] = s.charCodeAt(k) & 255;
  };
  while ((match = objRe.exec(text))) {
    const body = match[2];
    if (sigParents.has(match[1].replace(/ obj$/, "")) || /\/MarginSig\s*\(/.test(body)) {
      let patched = body.replace(/\/MarginSig\s*\((?:[^()\\]|\\.)*\)/, "").replace(/\/Ff\s*8388608\b/, "").replace(/\/FT\s*\/Tx\b/, "/FT/Sig").replace(/\/DA\s*\((?:[^()\\]|\\.)*\)/, "");
      // "/FT/Sig" is one byte longer than "/FT/Tx": claw it back from whitespace if needed.
      if (patched.length > body.length) patched = patched.replace(/\/Kids\s*\[\s+/, "/Kids[").replace(/\/T\s+\(/, "/T(");
      if (patched.length <= body.length) put(match.index + match[1].length, patched + " ".repeat(body.length - patched.length));
      continue;
    }
    const on = body.match(/\/MarginOn\s*\(((?:[^()\\]|\\.)*)\)/);
    if (!on) continue;
    const state = on[1].replace(/\\(.)/g, "$1").trim().replace(/[^A-Za-z0-9_.-]/g, "").slice(0, 24) || "On";
    const patched = body.replace(on[0], "").replace(/\/Yes\b/g, "/" + state);
    if (!(patched.length > body.length)) put(match.index + match[1].length, patched + " ".repeat(body.length - patched.length));
  }
  return out;
}

/** Appearance stream for an unsigned signature field: a grey frame, a baseline and a small "×". */
function signatureFieldAP(rect: Rect): string {
  const num = (v: number) => (Math.round(v * 100) / 100).toString(), w = rect.r - rect.l, ht = rect.t - rect.b, inset = Math.min(8, w * 0.06), baseY = rect.b + Math.max(4, ht * 0.28), cross = Math.min(7, ht * 0.18);
  return [`q 0.47 0.49 0.53 RG 0.75 w ${num(rect.l + 0.4)} ${num(rect.b + 0.4)} ${num(w - 0.8)} ${num(ht - 0.8)} re S`, `0.35 0.37 0.42 RG 0.6 w ${num(rect.l + inset)} ${num(baseY)} m ${num(rect.r - inset)} ${num(baseY)} l S`, `0.9 w ${num(rect.l + inset)} ${num(baseY + 3)} m ${num(rect.l + inset + cross)} ${num(baseY + 3 + cross)} l ${num(rect.l + inset)} ${num(baseY + 3 + cross)} m ${num(rect.l + inset + cross)} ${num(baseY + 3)} l S Q`].join(`
`);
}

/**
 * Scan a PDF for "N G obj" headers and map each object number to the byte offset of its header
 * (the last occurrence wins). Used as the base for compactDelta().
 */
function objectIndex(bytes: Uint8Array): Map<number, number> {
  const index = new Map<number, number>(), isSpace = (c: number) => c === 32 || c === 10 || c === 13 || c === 9 || c === 12 || c === 0, isDigit = (c: number) => c >= 48 && c <= 57;
  // Look for "o" "b" "j" preceded by " <gen> " and "<num>".
  for (let at = bytes.indexOf(111, 4); at >= 0; at = bytes.indexOf(111, at + 1)) {
    if (bytes[at + 1] !== 98 || bytes[at + 2] !== 106 || bytes[at - 1] !== 32) continue;
    let genStart = at - 2;
    if (!isDigit(bytes[genStart])) continue;
    while (genStart > 0 && isDigit(bytes[genStart - 1])) genStart--;
    if (bytes[genStart - 1] !== 32) continue;
    let numStart = genStart - 2;
    if (!isDigit(bytes[numStart])) continue;
    while (numStart > 0 && isDigit(bytes[numStart - 1])) numStart--;
    if (numStart > 0 && !isSpace(bytes[numStart - 1])) continue;
    let num = 0;
    for (let k = numStart; k < genStart - 1; k++) num = num * 10 + bytes[k] - 48;
    index.set(num, numStart);
  }
  return index;
}

type XrefEntry = { num: number; off: number; gen: string; t: string };

/**
 * Shrink an incremental-update delta (as written by Doc.saveDelta) by dropping the objects PDFium
 * re-wrote byte-for-byte unchanged from the base file, and rebuild the delta's xref to match.
 * `index` maps object numbers to their offsets in `base` (see objectIndex); offsets of the objects that
 * are kept are recorded in `newOffsets`. Returns the delta unchanged whenever anything looks unexpected.
 */
function compactDelta(base: Uint8Array, delta: Uint8Array, index: Map<number, number>, newOffsets?: Map<number, number>): Uint8Array {
  try {
    const deltaLen = delta.length;
    let xrefAt = -1;
    // Last "xref" at the start of a line.
    for (let k = deltaLen - 4; k > 0; k--) if (delta[k] === 120 && delta[k + 1] === 114 && delta[k + 2] === 101 && delta[k + 3] === 102 && (delta[k - 1] === 10 || delta[k - 1] === 13)) {
      xrefAt = k;
      break;
    }
    if (xrefAt < 0) return delta;
    const tail = latin1(delta.subarray(xrefAt)), trailerAt = tail.indexOf("trailer");
    if (trailerAt < 0) return delta;
    const lines = tail.slice(4, trailerAt).trim().split(/\r\n|\r|\n/).map((line) => line.trim()).filter(Boolean), entries: XrefEntry[] = [];
    for (let k = 0; k < lines.length; ) {
      const head = lines[k++].split(/\s+/);
      if (head.length !== 2) return delta;
      const first = +head[0], count = +head[1];
      for (let j = 0; j < count; j++) {
        const parts = (lines[k++] || "").split(/\s+/);
        if (parts.length !== 3) return delta;
        entries.push({ num: first + j, off: +parts[0], gen: parts[1], t: parts[2] });
      }
    }
    const trailer = tail.slice(trailerAt, tail.indexOf("startxref")), inUse = entries.filter((e) => e.t === "n").sort((a, b) => a.off - b.off), baseLen = base.length;
    if (inUse.some((e) => e.off < baseLen || e.off - baseLen >= xrefAt)) return delta;
    const keep: { e: XrefEntry; bytes: Uint8Array }[] = [];
    let dropped = 0;
    for (let k = 0; k < inUse.length; k++) {
      const entry = inUse[k], start = entry.off - baseLen, end = k + 1 < inUse.length ? inUse[k + 1].off - baseLen : xrefAt, chunk = delta.subarray(start, end);
      let objEnd = -1;
      // Last "endobj" in the chunk.
      for (let j = chunk.length - 6; j >= 0; j--) if (chunk[j] === 101 && chunk[j + 1] === 110 && chunk[j + 2] === 100 && chunk[j + 3] === 111 && chunk[j + 4] === 98 && chunk[j + 5] === 106) {
        objEnd = j + 6;
        break;
      }
      const baseOff = index.get(entry.num);
      let same = objEnd > 0 && baseOff != null && baseOff + objEnd <= baseLen;
      if (same) {
        for (let j = 0; j < objEnd; j++) if (base[baseOff! + j] !== chunk[j]) {
          same = false;
          break;
        }
      }
      if (same) dropped++;
      else keep.push({ e: entry, bytes: chunk });
    }
    if (!dropped) {
      for (const e of inUse) newOffsets?.set(e.num, e.off);
      return delta;
    }
    const head = delta.subarray(0, inUse.length ? inUse[0].off - baseLen : xrefAt), parts: Uint8Array[] = [head];
    let size = head.length;
    const offsets = new Map<number, number>();
    for (const k of keep) {
      offsets.set(k.e.num, baseLen + size);
      newOffsets?.set(k.e.num, baseLen + size);
      parts.push(k.bytes);
      size += k.bytes.length;
    }
    const xrefEntries = entries.filter((e) => e.t !== "n" || offsets.has(e.num)).sort((a, b) => a.num - b.num);
    let xref = `xref\r
`;
    for (let k = 0; k < xrefEntries.length; ) {
      let last = k;
      while (last + 1 < xrefEntries.length && xrefEntries[last + 1].num === xrefEntries[last].num + 1) last++;
      xref += `${xrefEntries[k].num} ${last - k + 1}\r
`;
      for (let j = k; j <= last; j++) {
        const e = xrefEntries[j];
        xref += `${String(e.t === "n" ? offsets.get(e.num) : e.off).padStart(10, "0")} ${e.gen.padStart(5, "0")} ${e.t}\r
`;
      }
      k = last + 1;
    }
    xref += trailer + `startxref\r
${baseLen + size}\r
%%EOF\r
`;
    const xrefBytes = new Uint8Array(xref.length);
    for (let k = 0; k < xref.length; k++) xrefBytes[k] = xref.charCodeAt(k) & 255;
    parts.push(xrefBytes);
    size += xrefBytes.length;
    const out = new Uint8Array(size);
    let pos = 0;
    for (const p of parts) {
      out.set(p, pos);
      pos += p.length;
    }
    return out;
  } catch {
    return delta;
  }
}

/** Blank out (with spaces) every "/Parent N G R" that points at an object the file doesn't define. */
function dropDanglingParents(bytes: Uint8Array): Uint8Array {
  const text = new TextDecoder("latin1").decode(bytes);
  if (text.indexOf("/Parent") < 0) return bytes;
  const defined = new Set<string>();
  for (const m of text.matchAll(/(?:^|[\r\n\s])(\d+)\s+(\d+)\s+obj\b/g)) defined.add(m[1] + " " + m[2]);
  for (const m of text.matchAll(/\/Parent\s*(\d+)\s+(\d+)\s+R/g)) if (!defined.has(m[1] + " " + m[2])) bytes.fill(32, m.index!, m.index! + m[0].length);
  return bytes;
}

// ---------------------------------------------------------------------------------------------
// The PDFium library wrapper
// ---------------------------------------------------------------------------------------------

/** The cwrapped PDFium API as typed by @embedpdf/pdfium (BOOL-returning C functions declared "number" return numbers). */
type PdfiumApi = WrappedPdfiumModule;
/** Heap value types Margin reads and writes. */
type HeapType = "i32" | "float" | "double";
/**
 * The emscripten module behind the API: the members Margin uses. @embedpdf/pdfium types these via
 * `typeof addFunction` etc. from @types/emscripten, which isn't installed here (so they would be `any`, and
 * HEAPU8 would be missing); this spells out the runtime signatures instead.
 */
interface PdfiumRuntime {
  HEAPU8: Uint8Array;
  wasmExports: { malloc(size: number): number; free(ptr: number): void };
  /** Add a JS function to the wasm table (signature like "iiii"); returns its table index. */
  addFunction(fn: (...args: number[]) => number, signature: string): number;
  removeFunction(index: number): void;
  getValue(ptr: number, type: HeapType): number;
  setValue(ptr: number, value: number, type: HeapType): void;
  UTF16ToString(ptr: number): string;
  UTF8ToString(ptr: number): string;
  stringToUTF16(s: string, ptr: number, maxBytes: number): number;
}

/** Bytes handed to PDFium through a custom FPDF_FILEACCESS: the file, the struct and its read callback. */
export type PdfSource = { bytes: Uint8Array; fa: number; cb: number };

/** The loaded PDFium wasm module plus wasm-heap helpers. */
class Pdfium {
  /** The cwrapped PDFium API. */
  P: PdfiumApi;
  /** The emscripten module (heap, malloc, addFunction …). */
  M: PdfiumRuntime;
  constructor(api: PdfiumApi) {
    this.P = api;
    this.M = api.pdfium as unknown as PdfiumRuntime;
    api.PDFiumExt_Init();
  }
  static async load(wasmBinary: ArrayBuffer | Uint8Array): Promise<Pdfium> {
    const api = await ji({ wasmBinary } as Parameters<typeof ji>[0]);
    return new Pdfium(api);
  }
  /** malloc at least one byte. */
  alloc(size: number): number {
    return this.M.wasmExports.malloc(Math.max(1, size));
  }
  free(ptr: number): void {
    if (ptr) this.M.wasmExports.free(ptr);
  }
  /** Copy bytes onto the wasm heap; caller frees. */
  bytes(data: Uint8Array): number {
    const ptr = this.alloc(data.length);
    this.M.HEAPU8.set(data, ptr);
    return ptr;
  }
  /** A NUL-terminated UTF-16 copy of a string (FPDF_WIDESTRING); caller frees. */
  wstr(s: string): number {
    const size = (s.length + 1) * 2, ptr = this.alloc(size);
    this.M.stringToUTF16(s, ptr, size);
    return ptr;
  }
  /** A float32 array on the heap; caller frees. */
  floats(values: number[]): number {
    const ptr = this.alloc(values.length * 4);
    values.forEach((v, k) => this.M.setValue(ptr + k * 4, v, "float"));
    return ptr;
  }
  readFloats(ptr: number, count: number): number[] {
    const out: number[] = [];
    for (let k = 0; k < count; k++) out.push(this.M.getValue(ptr + k * 4, "float"));
    return out;
  }
  readDoubles(ptr: number, count: number): number[] {
    const out: number[] = [];
    for (let k = 0; k < count; k++) out.push(this.M.getValue(ptr + k * 8, "double"));
    return out;
  }
  readU32(ptr: number, count: number): number[] {
    const out: number[] = [];
    for (let k = 0; k < count; k++) out.push(this.M.getValue(ptr + k * 4, "i32") >>> 0);
    return out;
  }
  /**
   * Read a UTF-16 string from a PDFium "call twice" getter: `get(0, 0)` returns the byte length
   * (including the terminator), then `get(buf, len)` fills it.
   */
  readW(get: (buf: number, len: number) => number): string {
    const len = get(0, 0);
    if (!len || len <= 2) return "";
    const buf = this.alloc(len);
    get(buf, len);
    const s = this.M.UTF16ToString(buf);
    this.free(buf);
    return s;
  }
  /** Run `fn` with a scratch allocator; everything it allocated is freed afterwards. */
  tmp<T>(fn: (alloc: (size: number) => number) => T): T {
    const ptrs: number[] = [], alloc = (size: number) => {
      const ptr = this.alloc(size);
      ptrs.push(ptr);
      return ptr;
    };
    try {
      return fn(alloc);
    } finally {
      ptrs.forEach((ptr) => this.free(ptr));
    }
  }
  /** Open a PDF. Throws PdfError (e.g. code 4 when a password is needed). */
  open(bytes: Uint8Array, password = ""): Doc {
    const src = this.source(bytes), handle = this.P.FPDF_LoadCustomDocument(src.fa, password);
    if (!handle) {
      const code = this.P.FPDF_GetLastError();
      this.dropSource(src);
      throw new PdfError(code);
    }
    return new Doc(this, handle, src);
  }
  /** Expose `bytes` to PDFium through an FPDF_FILEACCESS whose callback copies the requested range. */
  source(bytes: Uint8Array): PdfSource {
    if (bytes.length > 4294967295) throw new Error("Files over 4 GB can’t be opened");
    const mod = this.M, cb = mod.addFunction((_param: number, pos: number, buf: number, size: number) => (pos >>>= 0, size >>>= 0, buf >>>= 0, pos + size > bytes.length ? 0 : (mod.HEAPU8.set(bytes.subarray(pos, pos + size), buf), 1)), "iiiii"), fa = this.alloc(12);
    mod.setValue(fa, bytes.length | 0, "i32");
    mod.setValue(fa + 4, cb, "i32");
    mod.setValue(fa + 8, 0, "i32");
    return { bytes, fa, cb };
  }
  dropSource(src: PdfSource): void {
    this.M.removeFunction(src.cb);
    this.free(src.fa);
  }
  /** A new, empty document. */
  create(): Doc {
    return new Doc(this, this.P.FPDF_CreateNewDocument(), null);
  }
}

/** Whether an error is the wasm engine aborting / running out of memory (the module is then unusable). */
const isEngineAbort = (err: unknown): boolean => /Aborted|out of memory|Cannot enlarge memory/i.test(String((err as { message?: unknown } | null | undefined)?.message ?? err));
const ENGINE_FULL = "The PDF engine ran out of memory: this file is too large to edit in a browser tab. Reload Margin to keep working.";

/** A PDFium load error (FPDF_ERR_* code) with a user-facing message. */
class PdfError extends Error {
  code: number;
  constructor(code: number) {
    super(({ 1: "Unknown error", 2: "File not found", 3: "Not a PDF or the file is damaged", 4: "Password required", 5: "Unsupported security scheme", 6: "Page not found" } as Record<number, string>)[code] || "Could not open the PDF");
    this.code = code;
  }
}

/** Line ending name → PDFium code, and back. */
const LE_CODE: Record<LineEnd, number> = { None: 0, OpenArrow: 4, ClosedArrow: 5 };
const LE_NAME: Record<number, LineEnd> = { 0: "None", 4: "OpenArrow", 5: "ClosedArrow" };
/** Format a number for a content stream: 3 decimals, trailing zeros dropped, tiny values as 0. */
const fmt = (v: number): string => (Math.abs(v) < 1e-4 ? 0 : v).toFixed(3).replace(/\.?0+$/, "") || "0";

// ---------------------------------------------------------------------------------------------
// Doc: one open PDF
// ---------------------------------------------------------------------------------------------

/** Where a restack moves the selection. */
export type RestackMode = "front" | "back" | "forward" | "backward";
/** A text object on a page (Doc.textObjects). */
export type TextObjectInfo = {
  index: number;
  text: string;
  bounds: Rect;
  fontSize: number;
  /** fill colour as 0–255 r, g, b, a */
  color: RGBA;
  matrix: Matrix;
  fontName: string;
  /** text render mode 3 (invisible, e.g. OCR layers) */
  invisible: boolean;
  /** Margin text block metadata, when the object belongs to one */
  margin?: TextMark;
};
/** A word on a page with its rectangles and surrounding text (Doc.pageWords). */
export type WordHit = { word: string; rects: Rect[]; context: string };
/** Search results on one page. */
export type PageRects = { page: number; rects: Rect[] };
/** A link annotation: its target is a URI or a page index. */
export type LinkInfo = { index: number; rect: Rect; uri?: string; page?: number };
export type LinkTarget = { uri: string } | { page: number };
/** The kinds of field Margin can create. */
export type FieldKind = "text" | "multiline" | "signature" | "checkbox" | "radio" | "dropdown" | "list";
export type FieldOptions = {
  size?: number;
  /** dropdown / list choices */
  options?: string[];
  /** radio: the export value of this button */
  onValue?: string;
  /** radio: an existing button of the group to join */
  joinTo?: { page: number; annot: number } | null;
};
/** A form widget (Doc.fields). */
export type FieldInfo = {
  index: number;
  type: number;
  rect: Rect;
  options: { label: string; selected: boolean }[];
  name: string;
  value: string;
  checked: boolean;
  readOnly: boolean;
  multiline: boolean;
  exportValue: string;
};
/** A field's look (Doc.fieldLook): MK colours are 0–255 r, g, b. */
export type FieldLook = { rect: Rect; border: number[] | null; background: number[] | null; size: number; borderWidth: number; multiline: boolean };
/** An image object's placement and pixel size. */
export type ImageInfo = { matrix: Matrix; w: number; h: number; jpeg: boolean };
/** An image object as listed by Doc.imageList; `print` is a fingerprint for spotting duplicates. */
export type ImageListItem = { k: number; w: number; h: number; ptW: number; ptH: number; jpeg: boolean; bytes: number; print: string };
/** A selectable page object (Doc.pageObjects); `blockId` is set for Margin text blocks. */
export type PageObjectInfo = { index: number; type: number; bounds: Rect; blockId: string };
/** Parameters of a Margin "MarginText"/"MarginGlyph" content mark. */
export type TextMark = {
  id: string;
  font: string;
  ln: number;
  size: number;
  color: string;
  lh: number;
  st: string;
  al: string;
  /** block matrix (always 6 finite numbers) */
  bm: Matrix | null;
  rt: string;
};
/** A rendered image annotation object: placement and RGBA pixels. */
export type RenderedImage = { m: Matrix; rgba: Uint8ClampedArray; w: number; h: number };

/**
 * One open document. Pages and annotations are addressed by index; every method loads the page,
 * does its work and closes it again (see withPage), so handles never escape.
 */
class Doc {
  lib: Pdfium;
  /** The cwrapped PDFium API. */
  P: PdfiumApi;
  /** FPDF_DOCUMENT handle (0 once closed). */
  h: number;
  src: PdfSource | null;
  /** FPDF_FORMHANDLE (0 when the form environment couldn't be created). */
  form: number;
  finfo: number;
  /** Pages were imported from another document (save() then repairs dangling /Parent refs). */
  imported = false;
  /** Page indices loaded since the last swap. */
  loaded = new Set<number>();
  /** How many pages are currently loaded through withPage/addLink/createField. */
  depth = 0;
  constructor(lib: Pdfium, handle: number, src: PdfSource | null) {
    this.lib = lib;
    this.P = lib.P;
    this.h = handle;
    this.src = src;
    this.finfo = this.P.PDFiumExt_OpenFormFillInfo();
    this.form = this.P.PDFiumExt_InitFormFillEnvironment(handle, this.finfo);
    if (this.form) this.P.FPDF_SetFormFieldHighlightColor(this.form, 0, 0);
  }
  close(): void {
    if (this.h) {
      if (this.form) this.P.PDFiumExt_ExitFormFillEnvironment(this.form);
      if (this.finfo) this.P.PDFiumExt_CloseFormFillInfo(this.finfo);
      this.P.FPDF_CloseDocument(this.h);
      if (this.src) this.lib.dropSource(this.src);
      this.form = 0;
      this.finfo = 0;
      this.src = null;
      this.h = 0;
    }
  }
  /**
   * Close and reopen this Doc on new bytes (after a save), trying `fallback` if `bytes` won't open.
   * `ownerPassword`, if given, re-unlocks owner permissions.
   */
  swap(bytes: Uint8Array, password = "", fallback?: Uint8Array, ownerPassword = ""): void {
    this.close();
    const lib = this.lib, P = this.P, tryOpen = (data: Uint8Array) => {
      const src = lib.source(data), handle = P.FPDF_LoadCustomDocument(src.fa, password);
      if (!handle) lib.dropSource(src);
      return handle ? { h: handle, src } : null;
    }, opened = tryOpen(bytes) || (fallback ? tryOpen(fallback) : null);
    if (!opened) throw new PdfError(P.FPDF_GetLastError());
    this.h = opened.h;
    this.src = opened.src;
    this.imported = false;
    this.loaded.clear();
    if (ownerPassword) P.EPDF_UnlockOwnerPermissions(this.h, ownerPassword);
    this.finfo = P.PDFiumExt_OpenFormFillInfo();
    this.form = P.PDFiumExt_InitFormFillEnvironment(this.h, this.finfo);
    if (this.form) P.FPDF_SetFormFieldHighlightColor(this.form, 0, 0);
  }
  get pageCount(): number {
    return this.P.FPDF_GetPageCount(this.h);
  }
  /** Load page `index` (and its text page when `opts.text`), run `fn`, then close everything. */
  withPage<T>(index: number, fn: (page: number, textPage: number) => T, opts: { text?: boolean } = {}): T {
    const page = this.P.FPDF_LoadPage(this.h, index);
    if (!page) throw new PdfError(6);
    this.loaded.add(index);
    this.depth++;
    if (this.form) this.P.FORM_OnAfterLoadPage(page, this.form);
    const textPage = opts.text ? this.P.FPDFText_LoadPage(page) : 0;
    try {
      return fn(page, textPage);
    } finally {
      if (textPage) this.P.FPDFText_ClosePage(textPage);
      if (this.form) this.P.FORM_OnBeforeClosePage(page, this.form);
      this.P.FPDF_ClosePage(page);
      this.depth--;
    }
  }
  /** Page size in points (without loading the page when possible). */
  pageSize(index: number): { w: number; h: number } {
    const lib = this.lib, buf = lib.alloc(8);
    try {
      if (this.P.FPDF_GetPageSizeByIndexF(this.h, index, buf)) return { w: lib.M.getValue(buf, "float"), h: lib.M.getValue(buf + 4, "float") };
    } finally {
      lib.free(buf);
    }
    return this.withPage(index, (page) => ({ w: this.P.FPDF_GetPageWidthF(page), h: this.P.FPDF_GetPageHeightF(page) }));
  }
  /** The media box, and the crop box clipped to it (the media box when there is none). */
  pageBoxes(index: number): { media: Rect; crop: Rect } {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => lib.tmp((alloc) => {
      const buf = alloc(16), getBox = (fnName: "FPDFPage_GetMediaBox" | "FPDFPage_GetCropBox"): Rect | null => P[fnName](page, buf, buf + 4, buf + 8, buf + 12) ? (([x0, y0, x1, y1]) => ({ l: Math.min(x0, x1), b: Math.min(y0, y1), r: Math.max(x0, x1), t: Math.max(y0, y1) }))(lib.readFloats(buf, 4)) : null, media = getBox("FPDFPage_GetMediaBox") || { l: 0, b: 0, r: P.FPDF_GetPageWidthF(page), t: P.FPDF_GetPageHeightF(page) }, cropBox = getBox("FPDFPage_GetCropBox"), crop = cropBox ? { l: Math.max(cropBox.l, media.l), b: Math.max(cropBox.b, media.b), r: Math.min(cropBox.r, media.r), t: Math.min(cropBox.t, media.t) } : media;
      return { media, crop };
    }));
  }
  /** Set the crop box; null/undefined resets it to the media box. */
  setCropBox(index: number, rect?: Rect | null): void {
    const box = rect || this.pageBoxes(index).media;
    this.withPage(index, (page) => this.P.FPDFPage_SetCropBox(page, box.l, box.b, box.r, box.t));
  }
  /**
   * The page → device transform for a page rendered at `width` × `height` pixels (rotation and crop
   * included), measured from FPDF_PageToDevice at 1/64 px precision.
   */
  transform(index: number, width: number, height: number): Affine {
    const lib = this.lib;
    return this.withPage(index, (page) => lib.tmp((alloc) => {
      const xPtr = alloc(4), yPtr = alloc(4), toDevice = (x: number, y: number) => (this.P.FPDF_PageToDevice(page, 0, 0, Math.round(width * 64), Math.round(height * 64), 0, x, y, xPtr, yPtr), [lib.M.getValue(xPtr, "i32") / 64, lib.M.getValue(yPtr, "i32") / 64]), origin = toDevice(0, 0), xAxis = toDevice(1e3, 0), yAxis = toDevice(0, 1e3);
      return new Affine((xAxis[0] - origin[0]) / 1e3, (xAxis[1] - origin[1]) / 1e3, (yAxis[0] - origin[0]) / 1e3, (yAxis[1] - origin[1]) / 1e3, origin[0], origin[1]);
    }));
  }
  /** Render a page (plus form fields) to RGBA at `width` × `height` pixels on white. */
  render(index: number, width: number, height: number, opts: { annots?: boolean; print?: boolean } = {}): ImageData {
    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));
    const flags = (opts.annots === false ? RENDER_FLAGS & -2 : RENDER_FLAGS) | (opts.print ? 2048 : 0);
    return this.withPage(index, (page) => {
      const bitmap = this.P.FPDFBitmap_Create(width, height, 1);
      this.P.FPDFBitmap_FillRect(bitmap, 0, 0, width, height, 4294967295);
      this.P.FPDF_RenderPageBitmap(bitmap, page, 0, 0, width, height, 0, flags);
      if (this.form) this.P.FPDF_FFLDraw(this.form, bitmap, page, 0, 0, width, height, 0, flags | 1);
      const stride = this.P.FPDFBitmap_GetStride(bitmap), buf = this.P.FPDFBitmap_GetBuffer(bitmap), heap = this.lib.M.HEAPU8, img = new ImageData(width, height);
      if (stride === width * 4) img.data.set(heap.subarray(buf, buf + width * height * 4));
      else for (let y = 0; y < height; y++) img.data.set(heap.subarray(buf + y * stride, buf + y * stride + width * 4), y * width * 4);
      this.P.FPDFBitmap_Destroy(bitmap);
      return img;
    });
  }
  /** Save the whole document (full rewrite). */
  save(): Uint8Array {
    const out = this.write(0, 0);
    if (!out) throw new Error("PDFium could not write the file");
    return this.imported ? dropDanglingParents(out) : out;
  }
  /**
   * FPDF_SaveAsCopy with `flags`. With `skip` > 0 (incremental save) PDFium first re-emits the original
   * file: the first `skip` bytes are checked against the source (spot checks of up to 32 bytes per
   * write) and dropped, so only the appended update is returned. Null when saving fails or the prefix
   * doesn't match the source.
   */
  write(flags: number, skip: number): Uint8Array | null {
    const P = this.P, lib = this.lib, mod = lib.M;
    if (this.form) P.FORM_ForceToKillFocus(this.form);
    const orig = this.src?.bytes;
    let buf: Uint8Array = new Uint8Array(skip ? 0 : Math.max(65536, (orig?.length ?? 0) + (1 << 20))), size = 0, seen = 0, prefixOk = true;
    const chunks: Uint8Array[] = [], writeBlock = mod.addFunction((_self: number, data: number, len: number) => {
      data >>>= 0;
      len >>>= 0;
      const heap = mod.HEAPU8;
      if (seen < skip && orig) {
        const n = Math.min(len, skip - seen, 32);
        for (let k = 0; k < n; k++) if (heap[data + k] !== orig[seen + k]) {
          prefixOk = false;
          break;
        }
      }
      const from = Math.max(seen, skip);
      if (seen + len > from) {
        const part = heap.subarray(data + (from - seen), data + len);
        if (skip) chunks.push(part.slice());
        else {
          if (size + part.length > buf.length) {
            const grown = new Uint8Array(Math.max(size + part.length, Math.floor(buf.length * 1.5)));
            grown.set(buf.subarray(0, size));
            buf = grown;
          }
          buf.set(part, size);
        }
        size += part.length;
      }
      return seen += len, 1;
    }, "iiii"), fileWrite = lib.alloc(8);
    mod.setValue(fileWrite, 1, "i32");
    mod.setValue(fileWrite + 4, writeBlock, "i32");
    let ok = false;
    try {
      ok = !!P.FPDF_SaveAsCopy(this.h, fileWrite, flags);
    } finally {
      mod.removeFunction(writeBlock);
      lib.free(fileWrite);
    }
    if (!ok || !prefixOk || seen < skip) return null;
    if (skip) {
      const out = new Uint8Array(size);
      let pos = 0;
      for (const c of chunks) {
        out.set(c, pos);
        pos += c.length;
      }
      return out;
    }
    return size === buf.length ? buf : buf.slice(0, size);
  }
  /**
   * Incremental save: only the bytes to append to the original file, provided that file is still
   * `baseLength` bytes long; null if that isn't possible (then do a full save()).
   */
  saveDelta(baseLength: number): Uint8Array | null {
    return !this.src || this.src.bytes.length !== baseLength ? null : this.write(1, baseLength);
  }
  /**
   * Change the z-order of page objects. "forward"/"backward" step past the next object that overlaps
   * the selection. Returns false when nothing would change.
   */
  restackObjects(index: number, objIndices: number[], mode: RestackMode): boolean {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const count = P.FPDFPage_CountObjects(page), sel = new Set(objIndices);
      if (!objIndices.length) return false;
      const boundsOf = (obj: number): Rect => lib.tmp((alloc) => {
        const buf = alloc(16);
        P.FPDFPageObj_GetBounds(obj, buf, buf + 4, buf + 8, buf + 12);
        const [l, b, r, t] = lib.readFloats(buf, 4);
        return { l, b, r, t };
      }), objs: number[] = [...sel].sort((a, b) => a - b).map((k) => P.FPDFPage_GetObject(page, k)), selBox = objs.map(boundsOf).reduce((a, b) => ({ l: Math.min(a.l, b.l), b: Math.min(a.b, b.b), r: Math.max(a.r, b.r), t: Math.max(a.t, b.t) })), overlaps = (k: number) => {
        const box = boundsOf(P.FPDFPage_GetObject(page, k));
        return box.l < selBox.r && box.r > selBox.l && box.b < selBox.t && box.t > selBox.b;
      }, lo = Math.min(...sel), hi = Math.max(...sel);
      // The selection is reinserted right after index `target` (-1: at the very back).
      let target = -1;
      if (mode === "front") {
        if (hi === count - 1 && sel.size === hi - lo + 1) return false;
        target = count - 1;
      } else if (mode === "back") {
        if (lo === 0 && sel.size === hi - lo + 1) return false;
        target = -1;
      } else if (mode === "forward") {
        for (let k = hi + 1; k < count; k++) if (!sel.has(k) && overlaps(k)) {
          target = k;
          break;
        }
        if (target < 0) return false;
      } else {
        let found = false;
        for (let k = lo - 1; k >= 0; k--) if (!sel.has(k) && overlaps(k)) {
          target = k - 1;
          found = true;
          break;
        }
        if (!found) return false;
      }
      const before = [...sel].filter((k) => k <= target).length;
      let at = target - before + 1;
      for (let k = objs.length - 1; k >= 0; k--) P.FPDFPage_RemoveObject(page, objs[k]);
      for (const obj of objs) P.FPDFPage_InsertObjectAtIndex(page, obj, at++);
      P.FPDFPage_GenerateContent(page);
      return true;
    });
  }
  /** Change the z-order of annotations (popups don't count as overlapping). False when nothing changes. */
  restackAnnots(index: number, annotIndices: number[], mode: RestackMode): boolean {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const count = P.FPDFPage_GetAnnotCount(page), sel = new Set(annotIndices.filter((k) => k >= 0 && k < count));
      if (!sel.size) return false;
      const info = (k: number) => {
        const annot = P.FPDFPage_GetAnnot(page, k);
        try {
          return { r: annotRect(lib, annot), st: P.FPDFAnnot_GetSubtype(annot) };
        } finally {
          P.FPDFPage_CloseAnnot(annot);
        }
      }, sorted = [...sel].sort((a, b) => a - b), selBox = sorted.map((k) => info(k).r).reduce((a, b) => ({ l: Math.min(a.l, b.l), b: Math.min(a.b, b.b), r: Math.max(a.r, b.r), t: Math.max(a.t, b.t) })), overlaps = (k: number) => {
        const { r: box, st: subtype } = info(k);
        return subtype !== ANNOT.POPUP && box.l < selBox.r && box.r > selBox.l && box.b < selBox.t && box.t > selBox.b;
      }, lo = sorted[0], hi = sorted[sorted.length - 1], contiguous = hi - lo + 1 === sorted.length;
      // Destination index of the first moved annotation.
      let dest = -1;
      if (mode === "front") {
        if (hi === count - 1 && contiguous) return false;
        dest = count - sorted.length;
      } else if (mode === "back") {
        if (lo === 0 && contiguous) return false;
        dest = 0;
      } else if (mode === "forward") {
        for (let k = hi + 1; k < count; k++) if (!sel.has(k) && overlaps(k)) {
          dest = k - sorted.length + 1;
          break;
        }
      } else for (let k = lo - 1; k >= 0; k--) if (!sel.has(k) && overlaps(k)) {
        dest = k;
        break;
      }
      if (dest < 0) return false;
      const buf = lib.alloc(4 * sorted.length);
      sorted.forEach((k, j) => lib.M.setValue(buf + 4 * j, k, "i32"));
      try {
        return !!P.EPDFPage_MoveAnnots(page, buf, sorted.length, dest);
      } finally {
        lib.free(buf);
      }
    });
  }
  // ---- Bookmarks -------------------------------------------------------------------------------
  /** The bookmark tree (max depth 32, max 5000 siblings, cycles cut). */
  outline(): Bookmark[] {
    const P = this.P, lib = this.lib, seen = new Set<number>(), walk = (parent: number, path: number[], depth: number): Bookmark[] => {
      const items: Bookmark[] = [];
      if (depth > 32) return items;
      for (let bm = P.FPDFBookmark_GetFirstChild(this.h, parent), k = 0; bm && items.length < 5e3 && !seen.has(bm); bm = P.FPDFBookmark_GetNextSibling(this.h, bm), k++) {
        seen.add(bm);
        const itemPath = [...path, k], target = this.bmTarget(bm);
        items.push({ title: lib.readW((buf, len) => P.FPDFBookmark_GetTitle(bm, buf, len)), ...target, path: itemPath, children: walk(bm, itemPath, depth + 1) });
      }
      return items;
    };
    return walk(0, [], 0);
  }
  /** Where a bookmark points: a page (-1 if none) and optional top, or a URI action. */
  bmTarget(bm: number): { page: number; top: number | null; uri: string | null } {
    const P = this.P, lib = this.lib;
    let dest = P.FPDFBookmark_GetDest(this.h, bm), uri: string | null = null;
    if (!dest) {
      const action = P.FPDFBookmark_GetAction(bm);
      if (action) {
        const type = P.FPDFAction_GetType(action);
        if (type === 1) dest = P.FPDFAction_GetDest(this.h, action);
        else if (type === 3) {
          const len = P.FPDFAction_GetURIPath(this.h, action, 0, 0);
          if (len > 1) {
            const buf = lib.alloc(len);
            P.FPDFAction_GetURIPath(this.h, action, buf, len);
            uri = lib.M.UTF8ToString(buf);
            lib.free(buf);
          }
        }
      }
    }
    if (!dest) return { page: -1, top: null, uri };
    const page = P.FPDFDest_GetDestPageIndex(this.h, dest), buf = lib.alloc(24);
    try {
      // hasX, hasY, hasZoom, x, y, zoom: use y when hasY.
      const top = P.FPDFDest_GetLocationInPage(dest, buf, buf + 4, buf + 8, buf + 12, buf + 16, buf + 20) && lib.M.getValue(buf + 4, "i32") ? lib.M.getValue(buf + 16, "float") : null;
      return { page, top, uri };
    } finally {
      lib.free(buf);
    }
  }
  /** The bookmark handle at `path` (child indices from the root); 0 if it doesn't exist. */
  bmAt(path: number[]): number {
    let bm = 0;
    for (const k of path) {
      let child = this.P.FPDFBookmark_GetFirstChild(this.h, bm);
      for (let j = 0; j < k && child; j++) child = this.P.FPDFBookmark_GetNextSibling(this.h, child);
      if (!child) return 0;
      bm = child;
    }
    return bm;
  }
  /** The `k`-th child of `parent` (0 if missing). */
  bmChild(parent: number, k: number): number {
    let child = this.P.FPDFBookmark_GetFirstChild(this.h, parent);
    for (let j = 0; j < k && child; j++) child = this.P.FPDFBookmark_GetNextSibling(this.h, child);
    return child;
  }
  /** Insert a bookmark titled `title` as child number `at` of the bookmark at `parentPath`. */
  bmInsert(parentPath: number[], at: number, title: string): number {
    const P = this.P, lib = this.lib, parent = parentPath.length ? this.bmAt(parentPath) : 0;
    if (parentPath.length && !parent) throw new Error("That bookmark no longer exists");
    const titlePtr = lib.wstr(title);
    try {
      return at <= 0 ? P.EPDFBookmark_InsertAfter(this.h, parent, 0, titlePtr) : P.EPDFBookmark_InsertAfter(this.h, parent, this.bmChild(parent, at - 1), titlePtr);
    } finally {
      lib.free(titlePtr);
    }
  }
  /** Add a bookmark pointing at `page` (scrolled to `top`, if given). */
  addBookmark(parentPath: number[], at: number, title: string, page: number, top?: number | null): void {
    const bm = this.bmInsert(parentPath, at, title);
    if (!bm) throw new Error("The bookmark could not be added");
    this.withPage(page, (pageH) => {
      const dest = this.P.EPDFDest_CreateXYZ(pageH, false, 0, top != null, top ?? 0, false, 0);
      if (!dest || !this.P.EPDFBookmark_SetDest(this.h, bm, dest)) throw new Error("The bookmark’s page could not be set");
    });
  }
  renameBookmark(path: number[], title: string): void {
    const bm = this.bmAt(path);
    if (!bm) throw new Error("That bookmark no longer exists");
    const titlePtr = this.lib.wstr(title);
    try {
      if (!this.P.EPDFBookmark_SetTitle(bm, titlePtr)) throw new Error("The bookmark could not be renamed");
    } finally {
      this.lib.free(titlePtr);
    }
  }
  retargetBookmark(path: number[], page: number, top?: number | null): void {
    const bm = this.bmAt(path);
    if (!bm) throw new Error("That bookmark no longer exists");
    this.withPage(page, (pageH) => {
      const dest = this.P.EPDFDest_CreateXYZ(pageH, false, 0, top != null, top ?? 0, false, 0);
      this.P.EPDFBookmark_ClearTarget(bm);
      this.P.EPDFBookmark_SetDest(this.h, bm, dest);
    });
  }
  deleteBookmark(path: number[]): void {
    const bm = this.bmAt(path);
    if (!bm || !this.P.EPDFBookmark_Delete(this.h, bm)) throw new Error("The bookmark could not be deleted");
  }
  /** Move a bookmark (with its subtree) to child `at` of `toParent`: copied there, then the original deleted. */
  moveBookmark(path: number[], toParent: number[], at: number): void {
    const P = this.P, lib = this.lib;
    if (toParent.length >= path.length && path.every((k, j) => toParent[j] === k)) throw new Error("A bookmark can’t go inside itself");
    const bm = this.bmAt(path);
    if (!bm) throw new Error("That bookmark no longer exists");
    const copyInto = (from: number, to: number) => {
      const dest = P.FPDFBookmark_GetDest(this.h, from), action = P.FPDFBookmark_GetAction(from);
      if (dest) P.EPDFBookmark_SetDest(this.h, to, dest);
      else if (action) P.EPDFBookmark_SetAction(this.h, to, action);
      for (let child = P.FPDFBookmark_GetFirstChild(this.h, from); child; child = P.FPDFBookmark_GetNextSibling(this.h, child)) {
        const titlePtr = lib.wstr(lib.readW((buf, len) => P.FPDFBookmark_GetTitle(child, buf, len))), copy = P.EPDFBookmark_AppendChild(this.h, to, titlePtr);
        lib.free(titlePtr);
        if (copy) copyInto(child, copy);
      }
    }, title = lib.readW((buf, len) => P.FPDFBookmark_GetTitle(bm, buf, len)), moved = this.bmInsert(toParent, at, title);
    if (!moved) throw new Error("The bookmark could not be moved");
    copyInto(bm, moved);
    P.EPDFBookmark_Delete(this.h, bm);
  }
  // ---- Security --------------------------------------------------------------------------------
  security(): { encrypted: boolean; revision: number; perms: number } {
    const revision = this.P.FPDF_GetSecurityHandlerRevision(this.h);
    return { encrypted: revision > 0, revision, perms: this.P.FPDF_GetDocPermissions(this.h) >>> 0 };
  }
  unlockOwner(password: string): boolean {
    return !!this.P.EPDF_UnlockOwnerPermissions(this.h, password);
  }
  setProtection(userPassword: string, ownerPassword: string, perms: number): boolean {
    return !!this.P.EPDF_SetEncryption(this.h, userPassword, ownerPassword, perms | 0);
  }
  removeProtection(): boolean {
    return !!this.P.EPDF_RemoveEncryption(this.h);
  }
  // ---- Pages -----------------------------------------------------------------------------------
  /** Rotate by `quarterTurns` × 90° clockwise. */
  rotate(index: number, quarterTurns: number): void {
    this.withPage(index, (page) => {
      this.P.FPDFPage_SetRotation(page, ((this.P.FPDFPage_GetRotation(page) + quarterTurns) % 4 + 4) % 4);
    });
  }
  deletePage(index: number): void {
    this.P.FPDFPage_Delete(this.h, index);
  }
  insertBlank(index: number, width: number, height: number): void {
    const page = this.P.FPDFPage_New(this.h, index, width, height);
    this.P.FPDF_ClosePage(page);
  }
  /** Move the given pages (in that order) so they start at `dest`. */
  movePages(indices: number[], dest: number): boolean {
    return this.lib.tmp((alloc) => {
      const buf = alloc(indices.length * 4);
      indices.forEach((k, j) => this.lib.M.setValue(buf + j * 4, k, "i32"));
      return !!this.P.FPDF_MovePages(this.h, buf, indices.length, dest);
    });
  }
  /** Import every page of `from` at index `at`. */
  importAll(from: Doc, at: number): boolean {
    this.imported = true;
    return !!this.P.FPDF_ImportPagesByIndex(this.h, from.h, 0, 0, at);
  }
  /** Import the given pages of `from` at index `at`. */
  importIndices(from: Doc, indices: number[], at: number): boolean {
    this.imported = true;
    return this.lib.tmp((alloc) => {
      const buf = alloc(indices.length * 4);
      indices.forEach((k, j) => this.lib.M.setValue(buf + j * 4, k, "i32"));
      return !!this.P.FPDF_ImportPagesByIndex(this.h, from.h, buf, indices.length, at);
    });
  }
  // ---- Text ------------------------------------------------------------------------------------
  /** Text objects on a page; invisible ones only when they are Margin text. */
  textObjects(index: number): TextObjectInfo[] {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page, textPage) => {
      const out: TextObjectInfo[] = [], count = P.FPDFPage_CountObjects(page);
      for (let k = 0; k < count; k++) {
        const obj = P.FPDFPage_GetObject(page, k);
        if (P.FPDFPageObj_GetType(obj) !== 1) continue;
        const text = lib.readW((buf, len) => P.FPDFTextObj_GetText(obj, textPage, buf, len)), props = lib.tmp((alloc) => {
          const boundsBuf = alloc(16);
          P.FPDFPageObj_GetBounds(obj, boundsBuf, boundsBuf + 4, boundsBuf + 8, boundsBuf + 12);
          const [l, b, r, t] = lib.readFloats(boundsBuf, 4), sizeBuf = alloc(4);
          P.FPDFTextObj_GetFontSize(obj, sizeBuf);
          const colorBuf = alloc(16);
          P.FPDFPageObj_GetFillColor(obj, colorBuf, colorBuf + 4, colorBuf + 8, colorBuf + 12);
          const matrixBuf = alloc(24);
          P.FPDFPageObj_GetMatrix(obj, matrixBuf);
          const font = P.FPDFTextObj_GetFont(obj);
          let fontName = "";
          if (font) {
            const nameBuf = alloc(256);
            fontName = P.FPDFFont_GetBaseFontName(font, nameBuf, 256) ? lib.M.UTF8ToString(nameBuf) : "";
          }
          return { bounds: { l, b, r, t }, fontSize: lib.readFloats(sizeBuf, 1)[0], color: lib.readU32(colorBuf, 4) as RGBA, matrix: lib.readFloats(matrixBuf, 6) as Matrix, fontName };
        }), mark = readTextMark(lib, obj, "MarginText"), invisible = P.FPDFTextObj_GetTextRenderMode(obj) === 3;
        if (!(invisible && !mark)) out.push({ index: k, text, ...props, invisible, margin: mark || undefined });
      }
      return out;
    }, { text: true });
  }
  /** Words on a page (Latin letters, with apostrophes) accepted by `accept`, for spell checking. */
  pageWords(index: number, accept: (word: string) => boolean): WordHit[] {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (_page, textPage) => {
      const count = P.FPDFText_CountChars(textPage);
      if (count <= 0) return [];
      const text: string = lib.tmp((alloc) => {
        const buf = alloc((count + 1) * 2);
        P.FPDFText_GetText(textPage, 0, count, buf);
        return lib.M.UTF16ToString(buf);
      }), out: WordHit[] = [];
      lib.tmp((alloc) => {
        const buf = alloc(32);
        for (const match of text.matchAll(/[A-Za-z\u00C0-\u024F]+(?:['’][A-Za-z]+)*/g)) {
          const word = match[0];
          if (!accept(word)) continue;
          const start = match.index!, rectCount = P.FPDFText_CountRects(textPage, start, word.length), rects: Rect[] = [];
          for (let k = 0; k < rectCount; k++) {
            P.FPDFText_GetRect(textPage, k, buf, buf + 8, buf + 16, buf + 24);
            const [l, t, r, b] = lib.readDoubles(buf, 4);
            rects.push({ l, t, r, b });
          }
          const from = Math.max(0, start - 30), to = Math.min(text.length, start + word.length + 30);
          out.push({ word, rects, context: (from > 0 ? "…" : "") + text.slice(from, to).replace(/\s+/g, " ") + (to < text.length ? "…" : "") });
        }
      });
      return out;
    }, { text: true });
  }
  /** Text selected between two page points: its line rectangles and the text. */
  selectionRects(index: number, from: Pt, to: Pt): { rects: Rect[]; text: string } {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (_page, textPage) => {
      let first = P.FPDFText_GetCharIndexAtPos(textPage, from.x, from.y, 6, 6), last = P.FPDFText_GetCharIndexAtPos(textPage, to.x, to.y, 6, 6);
      if (first < 0 || last < 0) return { rects: [], text: "" };
      if (first > last) [first, last] = [last, first];
      const count = last - first + 1, rectCount = P.FPDFText_CountRects(textPage, first, count), rects: Rect[] = [];
      lib.tmp((alloc) => {
        const buf = alloc(32);
        for (let k = 0; k < rectCount; k++) {
          P.FPDFText_GetRect(textPage, k, buf, buf + 8, buf + 16, buf + 24);
          const [l, t, r, b] = lib.readDoubles(buf, 4);
          rects.push({ l, t, r, b });
        }
      });
      const text: string = lib.tmp((alloc) => {
        const buf = alloc((count + 1) * 2);
        P.FPDFText_GetText(textPage, first, count, buf);
        return lib.M.UTF16ToString(buf);
      });
      return { rects, text };
    }, { text: true });
  }
  /** Find text in the whole document (stops a little after 2000 hits). */
  search(query: string, opts: { matchCase?: boolean; wholeWord?: boolean } = {}): PageRects[] {
    const P = this.P, lib = this.lib, hits: PageRects[] = [];
    if (!query) return hits;
    const flags = (opts.matchCase ? 1 : 0) | (opts.wholeWord ? 2 : 0), queryPtr = lib.wstr(query);
    try {
      for (let pageIndex = 0; pageIndex < this.pageCount; pageIndex++) this.withPage(pageIndex, (_page, textPage) => {
        const find = P.FPDFText_FindStart(textPage, queryPtr, flags, 0);
        if (find) {
          lib.tmp((alloc) => {
            const buf = alloc(32);
            while (P.FPDFText_FindNext(find)) {
              const start = P.FPDFText_GetSchResultIndex(find), count = P.FPDFText_GetSchCount(find), rectCount = P.FPDFText_CountRects(textPage, start, count), rects: Rect[] = [];
              for (let k = 0; k < rectCount; k++) {
                P.FPDFText_GetRect(textPage, k, buf, buf + 8, buf + 16, buf + 24);
                const [l, t, r, b] = lib.readDoubles(buf, 4);
                rects.push({ l, t, r, b });
              }
              if (rects.length) hits.push({ page: pageIndex, rects });
              if (hits.length > 2e3) break;
            }
          });
          P.FPDFText_FindClose(find);
        }
      }, { text: true });
    } finally {
      lib.free(queryPtr);
    }
    return hits;
  }
  // ---- Annotations -----------------------------------------------------------------------------
  /** The annotations on a page, excluding popups, links and form widgets. */
  annots(index: number): AnnotInfo[] {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const out: AnnotInfo[] = [], count = P.FPDFPage_GetAnnotCount(page);
      for (let k = 0; k < count; k++) {
        const annot = P.FPDFPage_GetAnnot(page, k);
        try {
          const subtype = P.FPDFAnnot_GetSubtype(annot);
          if (subtype === ANNOT.POPUP || subtype === ANNOT.LINK || subtype === ANNOT.WIDGET) continue;
          const rect = annotRect(lib, annot), color = lib.tmp((alloc): RGBA | null => {
            const buf = alloc(16);
            return P.EPDFAnnot_GetColor(annot, 0, buf, buf + 4, buf + 8) ? [...lib.readU32(buf, 3), 255] as RGBA : P.FPDFAnnot_GetColor(annot, 0, buf, buf + 4, buf + 8, buf + 12) ? lib.readU32(buf, 4) as RGBA : null;
          }), str = (key: string) => lib.readW((buf, len) => P.FPDFAnnot_GetStringValue(annot, key, buf, len)), info: AnnotInfo = { index: k, subtype, rect, color, contents: str("Contents"), author: str("T"), modified: str("M"), isMargin: str("NM").startsWith("margin-") };
          if (subtype === ANNOT.LINE) info.line = this.readLine(annot) || undefined;
          const irt = P.FPDFAnnot_GetLinkedAnnot(annot, "IRT");
          if (irt) {
            const irtIndex = P.FPDFPage_GetAnnotIndex(page, irt);
            P.FPDFPage_CloseAnnot(irt);
            if (irtIndex >= 0) info.irt = irtIndex;
          }
          if (subtype === ANNOT.FREETEXT) try {
            const ft = JSON.parse(str("MarginFT"));
            if (ft?.box) info.ft = { box: ft.box, tip: ft.tip };
          } catch {
          }
          out.push(info);
        } finally {
          P.FPDFPage_CloseAnnot(annot);
        }
      }
      return out;
    });
  }
  /**
   * Create an annotation on a loaded page with Margin's bookkeeping: colour, author (/T), date (/M),
   * a "margin-…" /NM and the Print flag. Returns the open annotation handle; caller closes it.
   */
  newAnnot(page: number, subtype: number, color: RGBA | null | undefined, author: string): number {
    const P = this.P, lib = this.lib, annot = P.FPDFPage_CreateAnnot(page, subtype);
    if (!annot) throw new Error("Could not create annotation");
    if (color) P.FPDFAnnot_SetColor(annot, 0, color[0], color[1], color[2], color[3]);
    const setStr = (key: string, value: string) => {
      const ptr = lib.wstr(value);
      P.FPDFAnnot_SetStringValue(annot, key, ptr);
      lib.free(ptr);
    };
    setStr("T", author);
    setStr("M", pdfDate());
    setStr("NM", "margin-" + Math.random().toString(36).slice(2, 10));
    P.FPDFAnnot_SetFlags(annot, 4);
    return annot;
  }
  /** Add a text markup (highlight, underline, …) covering `rects`. */
  addMarkup(index: number, subtype: number, rects: Rect[], color: RGBA | null, author: string, contents = ""): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const annot = this.newAnnot(page, subtype, color, author);
      try {
        for (const r of rects) {
          const quad = lib.floats([r.l, r.t, r.r, r.t, r.l, r.b, r.r, r.b]);
          P.FPDFAnnot_AppendAttachmentPoints(annot, quad);
          lib.free(quad);
        }
        const bounds = unionRect(rects);
        setAnnotRect(lib, annot, bounds);
        if (contents) {
          const ptr = lib.wstr(contents);
          P.FPDFAnnot_SetStringValue(annot, "Contents", ptr);
          lib.free(ptr);
        }
        P.EPDFAnnot_GenerateAppearance(annot);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Add a freehand drawing. */
  addInk(index: number, strokes: Pt[][], color: RGBA | null, width: number, author: string): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const annot = this.newAnnot(page, ANNOT.INK, color, author);
      try {
        P.FPDFAnnot_SetBorder(annot, 0, 0, width);
        for (const stroke of strokes) {
          const pts = lib.floats(stroke.flatMap((p) => [p.x, p.y]));
          P.FPDFAnnot_AddInkStroke(annot, pts, stroke.length);
          lib.free(pts);
        }
        const all = strokes.flat(), pad = width;
        setAnnotRect(lib, annot, { l: Math.min(...all.map((p) => p.x)) - pad, r: Math.max(...all.map((p) => p.x)) + pad, b: Math.min(...all.map((p) => p.y)) - pad, t: Math.max(...all.map((p) => p.y)) + pad });
        P.EPDFAnnot_GenerateAppearance(annot);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Add a rectangle or ellipse (subtype SQUARE / CIRCLE). */
  addShape(index: number, subtype: number, rect: Rect, color: RGBA | null, width: number, author: string, opts: { fill?: RGBA | null; opacity?: number } = {}): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const annot = this.newAnnot(page, subtype, color, author);
      try {
        P.FPDFAnnot_SetBorder(annot, 0, 0, width);
        P.EPDFAnnot_SetBorderStyle(annot, 1, width);
        setAnnotRect(lib, annot, rect);
        if (opts.fill) P.EPDFAnnot_SetColor(annot, 1, opts.fill[0], opts.fill[1], opts.fill[2]);
        if (opts.opacity != null && opts.opacity < 1) P.EPDFAnnot_SetOpacity(annot, Math.round(Math.max(0.05, opts.opacity) * 255));
        this.shapeAP(annot);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** A line annotation's end points, or null. */
  readLine(annot: number): [Pt, Pt] | null {
    const lib = this.lib;
    return lib.tmp((alloc): [Pt, Pt] | null => {
      const buf = alloc(16);
      if (!this.P.FPDFAnnot_GetLine(annot, buf, buf + 8)) return null;
      const [x0, y0, x1, y1] = lib.readFloats(buf, 4);
      return [{ x: x0, y: y0 }, { x: x1, y: y1 }];
    });
  }
  writeLine(annot: number, a: Pt, b: Pt): void {
    const lib = this.lib, start = lib.floats([a.x, a.y]), end = lib.floats([b.x, b.y]);
    this.P.EPDFAnnot_SetLine(annot, start, end);
    lib.free(start);
    lib.free(end);
  }
  /** Rectangles and ellipses get Margin's own appearance: PDFium's strokes black when the outline
   *  colour (/C) is absent, but no /C means "no outline". Drawn in page space; BBox == Rect. */
  shapeAP(annot: number): void {
    const P = this.P, lib = this.lib, rect = annotRect(lib, annot), style = this.readStyle(annot), stroke = lib.tmp((alloc) => {
      const buf = alloc(12);
      return P.EPDFAnnot_GetColor(annot, 0, buf, buf + 4, buf + 8) ? lib.readU32(buf, 3) : null;
    }), width = stroke && style.width > 0 ? style.width : 0, half = width / 2, x0 = rect.l + half, x1 = rect.r - half, y0 = rect.b + half, y1 = rect.t - half;
    if (x1 - x0 <= 0 || y1 - y0 <= 0) return;
    const rgb = (c: number[]) => c.slice(0, 3).map((v) => fmt(v / 255)).join(" "), dash = style.dashed && width ? `[${fmt(Math.max(3, width * 3))} ${fmt(Math.max(2, width * 2))}] 0 d ` : "";
    let path: string;
    if (P.FPDFAnnot_GetSubtype(annot) === ANNOT.CIRCLE) {
      // Four Bézier quarter arcs (K = 0.5523).
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2, K = 0.5523;
      path = `${fmt(cx + rx)} ${fmt(cy)} m ${fmt(cx + rx)} ${fmt(cy + ry * K)} ${fmt(cx + rx * K)} ${fmt(cy + ry)} ${fmt(cx)} ${fmt(cy + ry)} c ${fmt(cx - rx * K)} ${fmt(cy + ry)} ${fmt(cx - rx)} ${fmt(cy + ry * K)} ${fmt(cx - rx)} ${fmt(cy)} c ${fmt(cx - rx)} ${fmt(cy - ry * K)} ${fmt(cx - rx * K)} ${fmt(cy - ry)} ${fmt(cx)} ${fmt(cy - ry)} c ${fmt(cx + rx * K)} ${fmt(cy - ry)} ${fmt(cx + rx)} ${fmt(cy - ry * K)} ${fmt(cx + rx)} ${fmt(cy)} c h`;
    } else path = `${fmt(x0)} ${fmt(y0)} ${fmt(x1 - x0)} ${fmt(y1 - y0)} re`;
    const paintOp = style.fill ? width ? "B" : "f" : width ? "S" : "n", ap = `q ${P.FPDFAnnot_HasKey(annot, "CA") ? "/GS gs " : ""}${style.fill ? rgb(style.fill) + " rg " : ""}${width ? `${rgb(stroke!)} RG ${fmt(width)} w 0 j ${dash}` : ""}${path} ${paintOp} Q`, apPtr = lib.wstr(ap);
    P.FPDFAnnot_SetAP(annot, 0, apPtr);
    lib.free(apPtr);
  }
  /** Redraw an annotation's appearance after a change, by kind. */
  regenAP(annot: number): void {
    const P = this.P, subtype = P.FPDFAnnot_GetSubtype(annot);
    if (subtype === ANNOT.LINE) this.lineAP(annot);
    else if (subtype === ANNOT.SQUARE || subtype === ANNOT.CIRCLE) this.shapeAP(annot);
    else if (subtype !== ANNOT.STAMP && subtype !== ANNOT.FREETEXT && !this.isDrawn(annot)) P.EPDFAnnot_GenerateAppearance(annot);
  }
  /**
   * Margin's own appearance for a line: the stroke plus open/closed arrowheads (28°, length
   * max(7, 4.5 × width)); the line is shortened under a closed head. Also refits /Rect.
   */
  lineAP(annot: number): void {
    const P = this.P, lib = this.lib, pts = this.readLine(annot);
    if (!pts) return;
    const [p0, p1] = pts, width = lib.tmp((alloc) => {
      const buf = alloc(12);
      return P.FPDFAnnot_GetBorder(annot, buf, buf + 4, buf + 8) ? lib.readFloats(buf + 8, 1)[0] : 1;
    }) || 1, color = lib.tmp((alloc) => {
      const buf = alloc(12);
      return P.EPDFAnnot_GetColor(annot, 0, buf, buf + 4, buf + 8) ? lib.readU32(buf, 3) : [0, 0, 0];
    }), ends = lib.tmp((alloc) => {
      const buf = alloc(8);
      return P.EPDFAnnot_GetLineEndings(annot, buf, buf + 4) ? [lib.M.getValue(buf, "i32"), lib.M.getValue(buf + 4, "i32")] : [0, 0];
    }), dash = lib.tmp((alloc) => {
      const buf = alloc(8);
      if (P.EPDFAnnot_GetBorderStyle(annot, buf) !== 2) return "";
      const n = P.EPDFAnnot_GetBorderDashPatternCount(annot);
      if (n <= 0 || n > 8) return `[${fmt(width * 3)} ${fmt(width * 2)}] 0 d `;
      const pattern = alloc(n * 4);
      P.EPDFAnnot_GetBorderDashPattern(annot, pattern, n);
      return `[${lib.readFloats(pattern, n).map(fmt).join(" ")}] 0 d `;
    }), gs = P.FPDFAnnot_HasKey(annot, "CA") ? "/GS gs " : "", rgb = color.map((v) => fmt(v / 255)).join(" "), headLen = Math.max(7, width * 4.5), headAngle = 28 * Math.PI / 180, extent: Pt[] = [p0, p1], heads: string[] = [];
    let from = p0, to = p1;
    /** Draw the head at `tip` (pointing away from `other`); returns where the shaft should end. */
    const arrow = (tip: Pt, other: Pt, ending: number): Pt => {
      if (ending !== 4 && ending !== 5) return tip;
      const dx = tip.x - other.x, dy = tip.y - other.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, wing = (side: number) => {
        const cos = Math.cos(headAngle), sin = Math.sin(headAngle) * side;
        return { x: tip.x - headLen * (ux * cos - uy * sin), y: tip.y - headLen * (uy * cos + ux * sin) };
      }, left = wing(1), right = wing(-1);
      extent.push(left, right);
      heads.push(`${fmt(left.x)} ${fmt(left.y)} m ${fmt(tip.x)} ${fmt(tip.y)} l ${fmt(right.x)} ${fmt(right.y)} l ${ending === 5 ? "h B" : "S"}`);
      return ending === 5 ? { x: tip.x - ux * headLen * Math.cos(headAngle) * 0.9, y: tip.y - uy * headLen * Math.cos(headAngle) * 0.9 } : tip;
    };
    from = arrow(p0, p1, ends[0]);
    to = arrow(p1, p0, ends[1]);
    const pad = width / 2 + 1.5;
    setAnnotRect(lib, annot, { l: Math.min(...extent.map((p) => p.x)) - pad, r: Math.max(...extent.map((p) => p.x)) + pad, b: Math.min(...extent.map((p) => p.y)) - pad, t: Math.max(...extent.map((p) => p.y)) + pad });
    const ap = `q ${gs}${rgb} RG ${rgb} rg ${fmt(width)} w ${dash ? "0 J" : "1 J"} 1 j ${dash}${fmt(from.x)} ${fmt(from.y)} m ${fmt(to.x)} ${fmt(to.y)} l S 0 J 0 j ${dash ? "[] 0 d " : ""}${heads.join(" ")} Q`, apPtr = lib.wstr(ap);
    P.FPDFAnnot_SetAP(annot, 0, apPtr);
    lib.free(apPtr);
  }
  /** Add a line from `a` to `b` with the given arrowheads. */
  addLine(index: number, a: Pt, b: Pt, color: RGBA, width: number, ends: [LineEnd, LineEnd], author: string): void {
    const P = this.P;
    this.withPage(index, (page) => {
      const annot = this.newAnnot(page, ANNOT.LINE, null, author);
      try {
        P.EPDFAnnot_SetColor(annot, 0, color[0], color[1], color[2]);
        P.FPDFAnnot_SetBorder(annot, 0, 0, width);
        this.writeLine(annot, a, b);
        P.EPDFAnnot_SetLineEndings(annot, LE_CODE[ends[0]], LE_CODE[ends[1]]);
        setAnnotRect(this.lib, annot, { l: Math.min(a.x, b.x), r: Math.max(a.x, b.x), b: Math.min(a.y, b.y), t: Math.max(a.y, b.y) });
        this.lineAP(annot);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Create an empty FreeText annotation; returns its index (fill it with writeFreeText). */
  createFreeText(index: number, author: string): number {
    return this.withPage(index, (page) => {
      const annot = this.newAnnot(page, ANNOT.FREETEXT, null, author);
      this.P.FPDFPage_CloseAnnot(annot);
      return this.P.FPDFPage_GetAnnotCount(page) - 1;
    });
  }
  /**
   * Store a Margin text box: /Contents, the full data as JSON in /MarginFT, standard FreeText keys
   * (DA, colours, border, /RD, callout line and intent) for other viewers, `rect` as /Rect and `ap`
   * (drawn by the caller) as the normal appearance.
   */
  writeFreeText(index: number, annotIndex: number, data: FreeTextData, rect: Rect, ap: string): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        const setStr = (key: string, value: string) => {
          const ptr = lib.wstr(value);
          P.FPDFAnnot_SetStringValue(annot, key, ptr);
          lib.free(ptr);
        };
        setStr("Contents", data.text);
        setStr("M", pdfDate());
        setStr("MarginFT", JSON.stringify(data));
        const color = data.style.color;
        P.EPDFAnnot_SetDefaultAppearance(annot, 4, data.style.size, color[0], color[1], color[2]);
        if (data.style.border) P.EPDFAnnot_SetColor(annot, 0, data.style.border[0], data.style.border[1], data.style.border[2]);
        else P.EPDFAnnot_ClearColor(annot, 0);
        if (data.style.fill) P.EPDFAnnot_SetColor(annot, 1, data.style.fill[0], data.style.fill[1], data.style.fill[2]);
        else P.EPDFAnnot_ClearColor(annot, 1);
        // Same width renderFreeText draws (`ap`), so viewers that redraw from /Border agree with it.
        P.FPDFAnnot_SetBorder(annot, 0, 0, data.style.border ? data.style.borderWidth ?? DEFAULT_FT_BORDER_WIDTH : 0);
        setAnnotRect(lib, annot, rect);
        P.EPDFAnnot_SetRectangleDifferences(annot, data.box.l - rect.l, rect.t - data.box.t, rect.r - data.box.r, data.box.b - rect.b);
        if (data.tip) {
          const anchor = calloutAnchor(data.box, data.tip), line = lib.floats([data.tip.x, data.tip.y, anchor.x, anchor.y]);
          P.EPDFAnnot_SetCalloutLine(annot, line, 2);
          lib.free(line);
          P.EPDFAnnot_SetIntent(annot, "FreeTextCallout");
          P.EPDFAnnot_SetLineEndings(annot, LE_CODE.OpenArrow, 0);
        } else {
          P.EPDFAnnot_SetCalloutLine(annot, 0, 0);
          P.EPDFAnnot_SetIntent(annot, "FreeText");
        }
        const apPtr = lib.wstr(ap);
        P.FPDFAnnot_SetAP(annot, 0, apPtr);
        lib.free(apPtr);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /**
   * Read a FreeText annotation as Margin text-box data: from /MarginFT when present, otherwise a
   * best effort from /Rect and /DA (font size and colour). Null if it isn't a FreeText.
   */
  readFreeText(index: number, annotIndex: number): FreeTextData | null {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        if (P.FPDFAnnot_GetSubtype(annot) !== ANNOT.FREETEXT) return null;
        const str = (key: string) => lib.readW((buf, len) => P.FPDFAnnot_GetStringValue(annot, key, buf, len));
        try {
          const data = JSON.parse(str("MarginFT"));
          if (data?.box && data?.style) return { ...data, text: str("Contents") };
        } catch {
        }
        const box = annotRect(lib, annot), da = str("DA"), size = +(da.match(/([\d.]+)\s+Tf/)?.[1] || 12) || 12, rgbMatch = da.match(/([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+rg/), color: RGBA = rgbMatch ? [Math.round(+rgbMatch[1] * 255), Math.round(+rgbMatch[2] * 255), Math.round(+rgbMatch[3] * 255), 255] : [0, 0, 0, 255];
        return { box, text: str("Contents"), style: { fontKey: "sarabun", size, color, fill: null, border: null, borderWidth: DEFAULT_FT_BORDER_WIDTH } };
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  // ---- Flatten & redaction ---------------------------------------------------------------------
  /** How many annotations (excluding links, popups, redaction marks) and form widgets the document has. */
  flattenCounts(): { annots: number; fields: number } {
    const P = this.P;
    let annots = 0, fields = 0;
    for (let index = 0; index < this.pageCount; index++) this.withPage(index, (page) => {
      const count = P.FPDFPage_GetAnnotCount(page);
      for (let k = 0; k < count; k++) {
        const annot = P.FPDFPage_GetAnnot(page, k), subtype = P.FPDFAnnot_GetSubtype(annot);
        P.FPDFPage_CloseAnnot(annot);
        if (subtype === ANNOT.WIDGET) fields++;
        else if (subtype !== ANNOT.LINK && subtype !== ANNOT.POPUP && subtype !== ANNOT.REDACT) annots++;
      }
    });
    return { annots, fields };
  }
  /**
   * Burn annotations and/or form fields into the page content. Hidden annotations and popups are
   * removed; links and redaction marks are kept. Checkboxes and radio buttons that PDFium can't flatten
   * get a simple drawn appearance first. Returns how many were flattened / failed.
   */
  flatten(what: { annots?: boolean; fields?: boolean }): { done: number; failed: number } {
    const P = this.P, lib = this.lib;
    let done = 0, failed = 0;
    if (this.form) P.FORM_ForceToKillFocus(this.form);
    for (let index = 0; index < this.pageCount; index++) this.withPage(index, (page) => {
      for (let k = P.FPDFPage_GetAnnotCount(page) - 1; k >= 0; k--) {
        const annot = P.FPDFPage_GetAnnot(page, k);
        if (!annot) continue;
        const subtype = P.FPDFAnnot_GetSubtype(annot);
        let remove = false, ok = false;
        try {
          if (subtype === ANNOT.LINK || subtype === ANNOT.REDACT || (subtype === ANNOT.WIDGET ? !what.fields : !what.annots)) continue;
          // Popups and hidden (flag 2) annotations are dropped, not burnt in.
          if (subtype === ANNOT.POPUP || P.FPDFAnnot_GetFlags(annot) & 2) {
            remove = true;
            continue;
          }
          ok = !!P.EPDFAnnot_Flatten(page, annot);
          if (!ok && subtype === ANNOT.WIDGET) {
            const fieldType = P.FPDFAnnot_GetFormFieldType(this.form, annot);
            if (fieldType === FIELD.CHECKBOX || fieldType === FIELD.RADIO) {
              const r = annotRect(lib, annot), checked = !!P.FPDFAnnot_IsChecked(this.form, annot), w = r.r - r.l, ht = r.t - r.b, f = (v: number) => fmt(v);
              let ap = "q 0 0 0 RG 0 0 0 rg 1 w ";
              if (fieldType === FIELD.CHECKBOX) {
                ap += `${f(r.l + 0.5)} ${f(r.b + 0.5)} ${f(w - 1)} ${f(ht - 1)} re S`;
                if (checked) ap += ` 1.6 w 1 J 1 j ${f(r.l + w * 0.22)} ${f(r.b + ht * 0.52)} m ${f(r.l + w * 0.42)} ${f(r.b + ht * 0.28)} l ${f(r.l + w * 0.8)} ${f(r.b + ht * 0.76)} l S`;
              } else {
                const cx = (r.l + r.r) / 2, cy = (r.b + r.t) / 2, radius = Math.min(w, ht) / 2 - 0.5, K = 0.5523, circle = (rad: number) => `${f(cx + rad)} ${f(cy)} m ${f(cx + rad)} ${f(cy + rad * K)} ${f(cx + rad * K)} ${f(cy + rad)} ${f(cx)} ${f(cy + rad)} c ${f(cx - rad * K)} ${f(cy + rad)} ${f(cx - rad)} ${f(cy + rad * K)} ${f(cx - rad)} ${f(cy)} c ${f(cx - rad)} ${f(cy - rad * K)} ${f(cx - rad * K)} ${f(cy - rad)} ${f(cx)} ${f(cy - rad)} c ${f(cx + rad * K)} ${f(cy - rad)} ${f(cx + rad)} ${f(cy - rad * K)} ${f(cx + rad)} ${f(cy)} c h`;
                ap += circle(radius) + " S";
                if (checked) ap += " " + circle(radius * 0.45) + " f";
              }
              ap += " Q";
              const apPtr = lib.wstr(ap);
              P.FPDFAnnot_SetAP(annot, 0, apPtr);
              lib.free(apPtr);
              ok = !!P.EPDFAnnot_Flatten(page, annot);
            }
          } else if (!ok) {
            P.EPDFAnnot_GenerateAppearance(annot);
            ok = !!P.EPDFAnnot_Flatten(page, annot);
          }
        } finally {
          P.FPDFPage_CloseAnnot(annot);
          if (remove) P.FPDFPage_RemoveAnnot(page, k);
          else if (subtype !== ANNOT.LINK && subtype !== ANNOT.REDACT && (subtype === ANNOT.WIDGET ? what.fields : what.annots)) {
            if (ok) done++;
            else failed++;
          }
        }
      }
      P.FPDFPage_GenerateContent(page);
    });
    return { done, failed };
  }
  /** Mark areas for redaction (a Redact annotation drawn as red dashed boxes with a diagonal). */
  addRedactMark(index: number, rects: Rect[], author: string): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const annot = this.newAnnot(page, ANNOT.REDACT, null, author);
      try {
        for (const r of rects) {
          const quad = lib.floats([r.l, r.t, r.r, r.t, r.l, r.b, r.r, r.b]);
          P.FPDFAnnot_AppendAttachmentPoints(annot, quad);
          lib.free(quad);
        }
        const bounds = unionRect(rects);
        setAnnotRect(lib, annot, { l: bounds.l - 1, r: bounds.r + 1, b: bounds.b - 1, t: bounds.t + 1 });
        P.EPDFAnnot_SetColor(annot, 0, 214, 40, 40);
        P.EPDFAnnot_SetColor(annot, 1, 0, 0, 0);
        const ops = ["q 0.84 0.16 0.16 RG 1.2 w [3 2] 0 d"];
        for (const r of rects) ops.push(`${fmt(r.l)} ${fmt(r.b)} ${fmt(r.r - r.l)} ${fmt(r.t - r.b)} re S ${fmt(r.l)} ${fmt(r.b)} m ${fmt(r.r)} ${fmt(r.t)} l S`);
        ops.push("Q");
        const apPtr = lib.wstr(ops.join(" "));
        P.FPDFAnnot_SetAP(annot, 0, apPtr);
        lib.free(apPtr);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** All redaction marks in the document, as rectangles per page (quads, or /Rect when there are none). */
  redactMarks(): PageRects[] {
    const P = this.P, lib = this.lib, out: PageRects[] = [];
    for (let index = 0; index < this.pageCount; index++) this.withPage(index, (page) => {
      const rects: Rect[] = [];
      for (let k = 0; k < P.FPDFPage_GetAnnotCount(page); k++) {
        const annot = P.FPDFPage_GetAnnot(page, k);
        try {
          if (P.FPDFAnnot_GetSubtype(annot) !== ANNOT.REDACT) continue;
          const quadCount = P.FPDFAnnot_CountAttachmentPoints(annot);
          if (!quadCount) {
            rects.push(annotRect(lib, annot));
            continue;
          }
          for (let q = 0; q < quadCount; q++) lib.tmp((alloc) => {
            const buf = alloc(32);
            if (P.FPDFAnnot_GetAttachmentPoints(annot, q, buf)) {
              const v = lib.readFloats(buf, 8), xs = [v[0], v[2], v[4], v[6]], ys = [v[1], v[3], v[5], v[7]];
              rects.push({ l: Math.min(...xs), r: Math.max(...xs), b: Math.min(...ys), t: Math.max(...ys) });
            }
          });
        } finally {
          P.FPDFPage_CloseAnnot(annot);
        }
      }
      if (rects.length) out.push({ page: index, rects });
    });
    return out;
  }
  clearRedactMarks(): void {
    const P = this.P;
    for (let index = 0; index < this.pageCount; index++) this.withPage(index, (page) => {
      for (let k = P.FPDFPage_GetAnnotCount(page) - 1; k >= 0; k--) {
        const annot = P.FPDFPage_GetAnnot(page, k), isRedact = P.FPDFAnnot_GetSubtype(annot) === ANNOT.REDACT;
        P.FPDFPage_CloseAnnot(annot);
        if (isRedact) P.FPDFPage_RemoveAnnot(page, k);
      }
    });
  }
  /**
   * Apply all redaction marks: PDFium removes the content underneath, then annotations more than 30%
   * covered (and the marks) are deleted, and optionally boxes of `fill` are painted over the areas.
   * Returns the number of pages redacted.
   */
  applyRedactions(fill?: RGBA | number[] | null): number {
    const P = this.P, lib = this.lib, marks = this.redactMarks();
    for (const { page: index, rects } of marks) this.withPage(index, (page) => {
      P.EPDFPage_ApplyRedactions(page);
      const overlapArea = (a: Rect, b: Rect) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l)) * Math.max(0, Math.min(a.t, b.t) - Math.max(a.b, b.b));
      for (let k = P.FPDFPage_GetAnnotCount(page) - 1; k >= 0; k--) {
        const annot = P.FPDFPage_GetAnnot(page, k), subtype = P.FPDFAnnot_GetSubtype(annot), r = annotRect(lib, annot);
        P.FPDFPage_CloseAnnot(annot);
        const area = Math.max(1e-3, (r.r - r.l) * (r.t - r.b)), covered = rects.reduce((sum, m) => sum + overlapArea(r, m), 0);
        if (subtype === ANNOT.REDACT || covered / area > 0.3) P.FPDFPage_RemoveAnnot(page, k);
      }
      if (fill) for (const r of rects) {
        const box = P.FPDFPageObj_CreateNewRect(r.l, r.b, r.r - r.l, r.t - r.b);
        P.FPDFPageObj_SetFillColor(box, fill[0], fill[1], fill[2], 255);
        P.FPDFPath_SetDrawMode(box, 1, false);
        P.FPDFPage_InsertObject(page, box);
      }
      P.FPDFPage_GenerateContent(page);
    });
    return marks.length;
  }
  // ---- Links -----------------------------------------------------------------------------------
  /** Link annotations on a page with their URI or destination page. */
  links(index: number): LinkInfo[] {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const out: LinkInfo[] = [], count = P.FPDFPage_GetAnnotCount(page);
      for (let k = 0; k < count; k++) {
        const annot = P.FPDFPage_GetAnnot(page, k);
        try {
          if (P.FPDFAnnot_GetSubtype(annot) !== ANNOT.LINK) continue;
          const info: LinkInfo = { index: k, rect: annotRect(lib, annot) }, link = P.FPDFAnnot_GetLink(annot);
          if (link) {
            const action = P.FPDFLink_GetAction(link), type = action ? P.FPDFAction_GetType(action) : 0;
            if (type === 3) {
              const len = P.FPDFAction_GetURIPath(this.h, action, 0, 0);
              if (len > 1) {
                const buf = lib.alloc(len);
                P.FPDFAction_GetURIPath(this.h, action, buf, len);
                info.uri = lib.M.UTF8ToString(buf);
                lib.free(buf);
              }
            } else {
              const dest = (action && type === 1 ? P.FPDFAction_GetDest(this.h, action) : 0) || P.FPDFLink_GetDest(this.h, link);
              if (dest) info.page = P.FPDFDest_GetDestPageIndex(this.h, dest);
            }
          }
          out.push(info);
        } finally {
          P.FPDFPage_CloseAnnot(annot);
        }
      }
      return out;
    });
  }
  /** Add a link over `rect` to a URI or to the top of a page (which is loaded meanwhile). */
  addLink(index: number, rect: Rect, target: LinkTarget): void {
    const P = this.P, lib = this.lib, destPage = "page" in target ? P.FPDF_LoadPage(this.h, target.page) : 0;
    this.depth++;
    try {
      this.withPage(index, (page) => {
        const annot = P.FPDFPage_CreateAnnot(page, ANNOT.LINK);
        if (!annot) throw new Error("Could not create the link");
        try {
          setAnnotRect(lib, annot, rect);
          P.FPDFAnnot_SetBorder(annot, 0, 0, 0);
          let action = 0;
          if ("uri" in target) action = P.EPDFAction_CreateURI(this.h, target.uri);
          else {
            const dest = P.EPDFDest_CreateXYZ(destPage, false, 0, true, P.FPDF_GetPageHeightF(destPage), false, 0);
            action = dest ? P.EPDFAction_CreateGoTo(this.h, dest) : 0;
          }
          if (!action || !P.EPDFAnnot_SetAction(annot, action)) throw new Error("Could not set the link target");
        } finally {
          P.FPDFPage_CloseAnnot(annot);
        }
      });
    } finally {
      this.depth--;
      if (destPage) P.FPDF_ClosePage(destPage);
    }
  }
  setLinePoints(index: number, annotIndex: number, a: Pt, b: Pt): void {
    this.withPage(index, (page) => {
      const annot = this.P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        this.writeLine(annot, a, b);
        this.lineAP(annot);
      } finally {
        this.P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Add a sticky note (20 × 20 pt, top-left corner at `at`). */
  addNote(index: number, at: Pt, text: string, color: RGBA | null, author: string): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const annot = this.newAnnot(page, ANNOT.TEXT, color, author);
      try {
        setAnnotRect(lib, annot, { l: at.x, r: at.x + 20, t: at.y, b: at.y - 20 });
        const ptr = lib.wstr(text);
        P.FPDFAnnot_SetStringValue(annot, "Contents", ptr);
        lib.free(ptr);
        P.EPDFAnnot_GenerateAppearance(annot);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Add a stamp annotation showing RGBA pixels stretched over `rect` (signatures, image stamps). */
  addImageStamp(index: number, rect: Rect, rgba: ArrayLike<number>, w: number, h: number, author: string, contents = "Signature"): void {
    const P = this.P, lib = this.lib, mod = lib.M;
    this.withPage(index, (page) => {
      const bitmap = P.FPDFBitmap_Create(w, h, 1), buf = P.FPDFBitmap_GetBuffer(bitmap), stride = P.FPDFBitmap_GetStride(bitmap);
      // RGBA → BGRA
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const src = (y * w + x) * 4, dst = buf + y * stride + x * 4;
        mod.HEAPU8[dst] = rgba[src + 2];
        mod.HEAPU8[dst + 1] = rgba[src + 1];
        mod.HEAPU8[dst + 2] = rgba[src];
        mod.HEAPU8[dst + 3] = rgba[src + 3];
      }
      const img = P.FPDFPageObj_NewImageObj(this.h);
      P.FPDFImageObj_SetBitmap(0, 0, img, bitmap);
      P.FPDFBitmap_Destroy(bitmap);
      const matrix = lib.floats([rect.r - rect.l, 0, 0, rect.t - rect.b, rect.l, rect.b]);
      P.FPDFPageObj_SetMatrix(img, matrix);
      lib.free(matrix);
      const annot = this.newAnnot(page, ANNOT.STAMP, null, author);
      try {
        setAnnotRect(lib, annot, rect);
        const ptr = lib.wstr(contents);
        P.FPDFAnnot_SetStringValue(annot, "Contents", ptr);
        lib.free(ptr);
        P.FPDFAnnot_AppendObject(annot, img);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Add a stamp whose appearance is the content stream `ap` (tagged /MarginAP). Returns its index. */
  addDrawnStamp(index: number, rect: Rect, contents: string, ap: string, author: string): number {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const annot = this.newAnnot(page, ANNOT.STAMP, null, author);
      try {
        setAnnotRect(lib, annot, rect);
        const contentsPtr = lib.wstr(contents);
        P.FPDFAnnot_SetStringValue(annot, "Contents", contentsPtr);
        lib.free(contentsPtr);
        const apPtr = lib.wstr(ap);
        P.FPDFAnnot_SetAP(annot, 0, apPtr);
        lib.free(apPtr);
        const flag = lib.wstr("1");
        P.FPDFAnnot_SetStringValue(annot, "MarginAP", flag);
        lib.free(flag);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
      return P.FPDFPage_GetAnnotCount(page) - 1;
    });
  }
  // ---- Images ----------------------------------------------------------------------------------
  /** Add an image object placed by `matrix`; returns its object index. */
  addImage(index: number, matrix: number[], src: ImageSrc): number {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const img = P.FPDFPageObj_NewImageObj(this.h);
      this.fillImage(img, src);
      const m = lib.floats(matrix);
      P.FPDFPageObj_SetMatrix(img, m);
      lib.free(m);
      P.FPDFPage_InsertObject(page, img);
      P.FPDFPage_GenerateContent(page);
      return P.FPDFPage_CountObjects(page) - 1;
    });
  }
  /** Load JPEG bytes (kept as-is) or RGBA pixels into an image object. Destroys it if the JPEG is bad. */
  fillImage(img: number, src: ImageSrc): void {
    const P = this.P, lib = this.lib, mod = lib.M;
    if ("jpeg" in src) {
      const data = lib.bytes(src.jpeg), len = src.jpeg.length, cb = mod.addFunction((_param: number, pos: number, buf: number, size: number) => pos + size > len ? 0 : (mod.HEAPU8.copyWithin(buf, data + pos, data + pos + size), 1), "iiiii"), fa = lib.alloc(12);
      mod.setValue(fa, len, "i32");
      mod.setValue(fa + 4, cb, "i32");
      mod.setValue(fa + 8, 0, "i32");
      const ok = P.FPDFImageObj_LoadJpegFileInline(0, 0, img, fa);
      mod.removeFunction(cb);
      lib.free(fa);
      lib.free(data);
      if (!ok) {
        P.FPDFPageObj_Destroy(img);
        throw new Error("That JPEG could not be read");
      }
    } else {
      const { rgba, w, h } = src, bitmap = P.FPDFBitmap_Create(w, h, 1), buf = P.FPDFBitmap_GetBuffer(bitmap), stride = P.FPDFBitmap_GetStride(bitmap);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const s = (y * w + x) * 4, d = buf + y * stride + x * 4;
        mod.HEAPU8[d] = rgba[s + 2];
        mod.HEAPU8[d + 1] = rgba[s + 1];
        mod.HEAPU8[d + 2] = rgba[s];
        mod.HEAPU8[d + 3] = rgba[s + 3];
      }
      P.FPDFImageObj_SetBitmap(0, 0, img, bitmap);
      P.FPDFBitmap_Destroy(bitmap);
    }
  }
  /** Placement, pixel size and JPEG-ness of an image object; null if it isn't one. */
  imageInfo(index: number, objIndex: number): ImageInfo | null {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const obj = P.FPDFPage_GetObject(page, objIndex);
      return !obj || P.FPDFPageObj_GetType(obj) !== 3 ? null : lib.tmp((alloc) => {
        const matrixBuf = alloc(24);
        P.FPDFPageObj_GetMatrix(obj, matrixBuf);
        const matrix = lib.readFloats(matrixBuf, 6) as Matrix, sizeBuf = alloc(8);
        P.FPDFImageObj_GetImagePixelSize(obj, sizeBuf, sizeBuf + 4);
        const [w, h] = [lib.M.getValue(sizeBuf, "i32"), lib.M.getValue(sizeBuf + 4, "i32")];
        let jpeg = false;
        const filterCount = P.FPDFImageObj_GetImageFilterCount(obj);
        for (let k = 0; k < filterCount; k++) {
          const len = P.FPDFImageObj_GetImageFilter(obj, k, 0, 0), buf = lib.alloc(len);
          P.FPDFImageObj_GetImageFilter(obj, k, buf, len);
          if (lib.M.UTF8ToString(buf) === "DCTDecode") jpeg = true;
          lib.free(buf);
        }
        return { matrix, w, h, jpeg };
      });
    });
  }
  /** Every image object on a page with size, placed size, encoded byte count and a duplicate fingerprint. */
  imageList(index: number): ImageListItem[] {
    const P = this.P, lib = this.lib, mod = lib.M;
    return this.withPage(index, (page) => {
      const out: ImageListItem[] = [], count = P.FPDFPage_CountObjects(page);
      for (let k = 0; k < count; k++) {
        const obj = P.FPDFPage_GetObject(page, k);
        if (P.FPDFPageObj_GetType(obj) !== 3) continue;
        const size = lib.tmp((alloc) => {
          const matrixBuf = alloc(24);
          P.FPDFPageObj_GetMatrix(obj, matrixBuf);
          const [a, b, c, d] = lib.readFloats(matrixBuf, 4), sizeBuf = alloc(8);
          P.FPDFImageObj_GetImagePixelSize(obj, sizeBuf, sizeBuf + 4);
          return { w: mod.getValue(sizeBuf, "i32") as number, h: mod.getValue(sizeBuf + 4, "i32") as number, ptW: Math.hypot(a, b), ptH: Math.hypot(c, d) };
        });
        let jpeg = false;
        const filterCount = P.FPDFImageObj_GetImageFilterCount(obj);
        for (let j = 0; j < filterCount; j++) {
          const len = P.FPDFImageObj_GetImageFilter(obj, j, 0, 0), buf = lib.alloc(len);
          P.FPDFImageObj_GetImageFilter(obj, j, buf, len);
          if (lib.M.UTF8ToString(buf) === "DCTDecode") jpeg = true;
          lib.free(buf);
        }
        const bytes = P.FPDFImageObj_GetImageDataRaw(obj, 0, 0) >>> 0;
        let print = `${bytes}:${size.w}x${size.h}`;
        if (bytes) {
          // FNV-1a over the first 64 KB of the encoded data.
          const hashLen = Math.min(bytes, 65536), buf = lib.alloc(bytes);
          P.FPDFImageObj_GetImageDataRaw(obj, buf, bytes);
          let hash = 2166136261;
          for (let j = 0; j < hashLen; j++) hash = Math.imul(hash ^ mod.HEAPU8[buf + j], 16777619);
          lib.free(buf);
          print += ":" + (hash >>> 0).toString(36);
        }
        out.push({ k, ...size, jpeg, bytes, print });
      }
      return out;
    });
  }
  /** Decoded RGBA pixels of an image object (rendered at its own pixel size, masks applied). */
  imagePixels(index: number, objIndex: number): { rgba: Uint8ClampedArray; w: number; h: number } | null {
    const P = this.P, lib = this.lib, mod = lib.M;
    return this.withPage(index, (page) => {
      const obj = P.FPDFPage_GetObject(page, objIndex);
      if (!obj) return null;
      const info = lib.tmp((alloc) => {
        const matrixBuf = alloc(24);
        P.FPDFPageObj_GetMatrix(obj, matrixBuf);
        const sizeBuf = alloc(8);
        P.FPDFImageObj_GetImagePixelSize(obj, sizeBuf, sizeBuf + 4);
        return { m: lib.readFloats(matrixBuf, 6), w: mod.getValue(sizeBuf, "i32") as number, h: mod.getValue(sizeBuf + 4, "i32") as number };
      }), pixelMatrix = lib.floats([info.w, 0, 0, info.h, 0, 0]);
      // Temporarily scale the object to 1 px per image pixel so the rendered bitmap is full size.
      P.FPDFPageObj_SetMatrix(obj, pixelMatrix);
      lib.free(pixelMatrix);
      const bitmap = P.FPDFImageObj_GetRenderedBitmap(this.h, page, obj), origMatrix = lib.floats(info.m);
      P.FPDFPageObj_SetMatrix(obj, origMatrix);
      lib.free(origMatrix);
      if (!bitmap) return null;
      const w = P.FPDFBitmap_GetWidth(bitmap), h = P.FPDFBitmap_GetHeight(bitmap), stride = P.FPDFBitmap_GetStride(bitmap), buf = P.FPDFBitmap_GetBuffer(bitmap), rgba = new Uint8ClampedArray(w * h * 4);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const s = buf + y * stride + x * 4, d = (y * w + x) * 4;
        rgba[d] = mod.HEAPU8[s + 2];
        rgba[d + 1] = mod.HEAPU8[s + 1];
        rgba[d + 2] = mod.HEAPU8[s];
        rgba[d + 3] = mod.HEAPU8[s + 3];
      }
      P.FPDFBitmap_Destroy(bitmap);
      return { rgba, w, h };
    });
  }
  /** Replace an image object's pixels (and optionally its matrix). */
  setImage(index: number, objIndex: number, src: ImageSrc, matrix?: number[] | null): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const obj = P.FPDFPage_GetObject(page, objIndex);
      if (!obj) throw new Error("The image is gone");
      this.fillImage(obj, src);
      if (matrix) {
        const m = lib.floats(matrix);
        P.FPDFPageObj_SetMatrix(obj, m);
        lib.free(m);
      }
      P.FPDFPage_GenerateContent(page);
    });
  }
  // ---- Annotation editing ----------------------------------------------------------------------
  /** Delete an annotation together with its replies (annotations /IRT-linked to it, transitively). */
  deleteAnnot(index: number, annotIndex: number): void {
    const P = this.P;
    this.withPage(index, (page) => {
      const doomed = new Set([annotIndex]);
      for (let grew = true; grew; ) {
        grew = false;
        for (let k = 0; k < P.FPDFPage_GetAnnotCount(page); k++) {
          if (doomed.has(k)) continue;
          const annot = P.FPDFPage_GetAnnot(page, k), irt = P.FPDFAnnot_GetLinkedAnnot(annot, "IRT");
          let irtIndex = -1;
          if (irt) {
            irtIndex = P.FPDFPage_GetAnnotIndex(page, irt);
            P.FPDFPage_CloseAnnot(irt);
          }
          P.FPDFPage_CloseAnnot(annot);
          if (irtIndex >= 0 && doomed.has(irtIndex)) {
            doomed.add(k);
            grew = true;
          }
        }
      }
      for (const k of [...doomed].sort((a, b) => b - a)) P.FPDFPage_RemoveAnnot(page, k);
    });
  }
  /** Add a reply: a hidden, blank-appearance Text annotation /IRT-linked to the parent. */
  addReply(index: number, annotIndex: number, text: string, author: string): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const parent = P.FPDFPage_GetAnnot(page, annotIndex);
      if (!parent) throw new Error("That comment is gone");
      const r = annotRect(lib, parent), reply = this.newAnnot(page, ANNOT.TEXT, null, author);
      try {
        setAnnotRect(lib, reply, { l: r.r, r: r.r + 1, t: r.t, b: r.t - 1 });
        // Print | NoZoom | NoRotate
        P.FPDFAnnot_SetFlags(reply, 28);
        const ptr = lib.wstr(text);
        P.FPDFAnnot_SetStringValue(reply, "Contents", ptr);
        lib.free(ptr);
        if (!P.EPDFAnnot_SetLinkedAnnot(reply, "IRT", parent)) throw new Error("Could not link the reply");
        const blank = lib.wstr(" ");
        P.FPDFAnnot_SetAP(reply, 0, blank);
        lib.free(blank);
      } finally {
        P.FPDFPage_CloseAnnot(reply);
        P.FPDFPage_CloseAnnot(parent);
      }
    });
  }
  /** Set an annotation's /Contents and touch /M. */
  setAnnotContents(index: number, annotIndex: number, text: string): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        const textPtr = lib.wstr(text);
        P.FPDFAnnot_SetStringValue(annot, "Contents", textPtr);
        lib.free(textPtr);
        const datePtr = lib.wstr(pdfDate());
        P.FPDFAnnot_SetStringValue(annot, "M", datePtr);
        lib.free(datePtr);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Set (or with null, clear) an annotation's colour and redraw it. */
  setAnnotColor(index: number, annotIndex: number, color: RGBA | null): void {
    const P = this.P;
    this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        if (color) {
          if (!P.EPDFAnnot_SetColor(annot, 0, color[0], color[1], color[2])) P.FPDFAnnot_SetColor(annot, 0, color[0], color[1], color[2], color[3]);
        } else P.EPDFAnnot_ClearColor(annot, 0);
        const subtype = P.FPDFAnnot_GetSubtype(annot);
        if (subtype === ANNOT.SQUARE || subtype === ANNOT.CIRCLE) this.shapeAP(annot);
        else if (subtype === ANNOT.LINE) this.lineAP(annot);
        else if (subtype !== ANNOT.STAMP && subtype !== ANNOT.FREETEXT) P.EPDFAnnot_GenerateAppearance(annot);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  annotStyle(index: number, annotIndex: number): AnnotStyle | null {
    const P = this.P;
    return this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      if (!annot) return null;
      try {
        return this.readStyle(annot);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Border width (/BS, else /Border, default 1), dashed, interior colour, opacity and line endings. */
  readStyle(annot: number): AnnotStyle {
    const P = this.P, lib = this.lib;
    return lib.tmp((alloc) => {
      const buf = alloc(16), borderStyle = P.EPDFAnnot_GetBorderStyle(annot, buf);
      let width = borderStyle > 0 ? lib.readFloats(buf, 1)[0] : 0;
      if (!(borderStyle > 0)) width = P.FPDFAnnot_GetBorder(annot, buf, buf + 4, buf + 8) ? lib.readFloats(buf + 8, 1)[0] : 1;
      const dashed = borderStyle === 2, fill = P.EPDFAnnot_GetColor(annot, 1, buf, buf + 4, buf + 8) ? [...lib.readU32(buf, 3), 255] as RGBA : null, opacity = P.FPDFAnnot_HasKey(annot, "CA") && P.EPDFAnnot_GetOpacity(annot, buf) ? (lib.M.getValue(buf, "i32") & 255) / 255 : 1, style: AnnotStyle = { width, dashed, fill, opacity };
      if (P.FPDFAnnot_GetSubtype(annot) === ANNOT.LINE) {
        const ends = P.EPDFAnnot_GetLineEndings(annot, buf, buf + 4) ? [lib.M.getValue(buf, "i32"), lib.M.getValue(buf + 4, "i32")] : [0, 0];
        style.ends = ends.map((code) => LE_NAME[code] || "None") as [LineEnd, LineEnd];
      }
      return style;
    });
  }
  /** Apply the given style properties (others unchanged), touch /M and redraw. */
  writeStyle(annot: number, patch: Partial<AnnotStyle>): void {
    const P = this.P, lib = this.lib, cur = this.readStyle(annot), width = patch.width ?? cur.width, dashed = patch.dashed ?? cur.dashed;
    if (patch.width != null || patch.dashed != null) {
      P.FPDFAnnot_SetBorder(annot, 0, 0, width);
      P.EPDFAnnot_SetBorderStyle(annot, dashed ? 2 : 1, width);
      if (dashed) {
        const pattern = lib.floats([Math.max(3, width * 3), Math.max(2, width * 2)]);
        P.EPDFAnnot_SetBorderDashPattern(annot, pattern, 2);
        lib.free(pattern);
      }
    }
    if ("fill" in patch) {
      if (patch.fill) P.EPDFAnnot_SetColor(annot, 1, patch.fill[0], patch.fill[1], patch.fill[2]);
      else P.EPDFAnnot_ClearColor(annot, 1);
    }
    if (patch.opacity != null) P.EPDFAnnot_SetOpacity(annot, Math.round(Math.max(0.05, Math.min(1, patch.opacity)) * 255));
    if (patch.ends) P.EPDFAnnot_SetLineEndings(annot, LE_CODE[patch.ends[0]], LE_CODE[patch.ends[1]]);
    const datePtr = lib.wstr(pdfDate());
    P.FPDFAnnot_SetStringValue(annot, "M", datePtr);
    lib.free(datePtr);
    this.regenAP(annot);
  }
  setAnnotStyle(index: number, annotIndex: number, patch: Partial<AnnotStyle>): void {
    const P = this.P;
    this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      if (!annot) throw new Error("That annotation is gone");
      try {
        this.writeStyle(annot, patch);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Swap a line's start and end. */
  reverseLine(index: number, annotIndex: number): void {
    const P = this.P;
    this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        const pts = this.readLine(annot);
        if (!pts) throw new Error("Not a line");
        this.writeLine(annot, pts[1], pts[0]);
        this.lineAP(annot);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** The raw JPEG bytes of an image object, if its data is a JPEG (starts FF D8); else null. */
  imageJpeg(index: number, objIndex: number): Uint8Array | null {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const obj = P.FPDFPage_GetObject(page, objIndex);
      if (!obj || P.FPDFPageObj_GetType(obj) !== 3) return null;
      const len = P.FPDFImageObj_GetImageDataRaw(obj, 0, 0);
      if (len <= 0) return null;
      const buf = lib.alloc(len);
      P.FPDFImageObj_GetImageDataRaw(obj, buf, len);
      const data: Uint8Array = lib.M.HEAPU8.slice(buf, buf + len);
      lib.free(buf);
      return data[0] === 255 && data[1] === 216 ? data : null;
    });
  }
  // ---- Copy & paste ----------------------------------------------------------------------------
  /**
   * Copy annotations and image objects of a page as plain data. Supported: shapes, lines, ink, notes,
   * stamps (drawn or image-based), Margin text boxes and images; anything else is counted in `skipped`.
   */
  readClip(index: number, annotIndices: number[], objIndices: number[]): { items: ClipObj[]; skipped: number } {
    const P = this.P, lib = this.lib, items: ClipObj[] = [];
    let skipped = 0;
    for (const annotIndex of annotIndices) {
      const clip = this.withPage(index, (page): ClipAnnot | null => {
        const annot = P.FPDFPage_GetAnnot(page, annotIndex);
        if (!annot) return null;
        try {
          const subtype = P.FPDFAnnot_GetSubtype(annot);
          if (subtype === ANNOT.FREETEXT || !([ANNOT.SQUARE, ANNOT.CIRCLE, ANNOT.LINE, ANNOT.INK, ANNOT.TEXT, ANNOT.STAMP] as number[]).includes(subtype)) return null;
          const str = (key: string) => lib.readW((buf, len) => P.FPDFAnnot_GetStringValue(annot, key, buf, len)), color = lib.tmp((alloc): RGBA | null => {
            const buf = alloc(16);
            return P.EPDFAnnot_GetColor(annot, 0, buf, buf + 4, buf + 8) ? [...lib.readU32(buf, 3), 255] as RGBA : P.FPDFAnnot_GetColor(annot, 0, buf, buf + 4, buf + 8, buf + 12) ? lib.readU32(buf, 4) as RGBA : null;
          }), out: ClipAnnot = { t: "annot", subtype, rect: annotRect(lib, annot), color, contents: str("Contents"), style: this.readStyle(annot) };
          if (subtype === ANNOT.LINE) {
            const pts = this.readLine(annot);
            if (!pts) return null;
            out.line = pts;
          }
          if (subtype === ANNOT.INK) {
            out.ink = [];
            for (let k = 0, n = P.FPDFAnnot_GetInkListCount(annot); k < n; k++) {
              const count = P.FPDFAnnot_GetInkListPath(annot, k, 0, 0), buf = lib.alloc(count * 8);
              P.FPDFAnnot_GetInkListPath(annot, k, buf, count);
              out.ink.push(lib.readFloats(buf, count * 2));
              lib.free(buf);
            }
          }
          if (subtype === ANNOT.STAMP) {
            if (this.isDrawn(annot)) {
              const ap = lib.readW((buf, len) => P.FPDFAnnot_GetAP(annot, 0, buf, len));
              if (!ap) return null;
              out.ap = ap;
            } else {
              out.images = [];
              for (let k = 0, n = P.FPDFAnnot_GetObjectCount(annot); k < n; k++) {
                const obj = P.FPDFAnnot_GetObject(annot, k);
                if (P.FPDFPageObj_GetType(obj) !== 3) return null;
                const img = this.renderImageObj(page, obj);
                if (!img) return null;
                out.images.push(img);
              }
              if (!out.images.length) return null;
            }
          }
          return out;
        } finally {
          P.FPDFPage_CloseAnnot(annot);
        }
      });
      if (clip) {
        items.push(clip);
        continue;
      }
      const ft = this.withPage(index, (page) => {
        const annot = P.FPDFPage_GetAnnot(page, annotIndex);
        if (!annot) return false;
        const subtype = P.FPDFAnnot_GetSubtype(annot);
        P.FPDFPage_CloseAnnot(annot);
        return subtype === ANNOT.FREETEXT;
      }) ? this.readFreeText(index, annotIndex) : null;
      if (ft) items.push({ t: "ft", data: ft });
      else skipped++;
    }
    for (const objIndex of objIndices) {
      const info = this.imageInfo(index, objIndex);
      if (!info) {
        skipped++;
        continue;
      }
      const jpeg = info.jpeg ? this.imageJpeg(index, objIndex) : null;
      if (jpeg) {
        items.push({ t: "img", m: info.matrix, src: { jpeg } });
        continue;
      }
      const px = this.imagePixels(index, objIndex);
      if (!px) {
        skipped++;
        continue;
      }
      items.push({ t: "img", m: info.matrix, src: { rgba: px.rgba, w: px.w, h: px.h } });
    }
    return { items, skipped };
  }
  /** Render an image object (e.g. inside a stamp's appearance) to RGBA at its pixel size, with its matrix. */
  renderImageObj(page: number, obj: number): RenderedImage | null {
    const P = this.P, lib = this.lib, mod = lib.M, matrix = lib.tmp((alloc) => {
      const buf = alloc(24);
      P.FPDFPageObj_GetMatrix(obj, buf);
      return lib.readFloats(buf, 6) as Matrix;
    }), size = lib.tmp((alloc) => {
      const buf = alloc(8);
      P.FPDFImageObj_GetImagePixelSize(obj, buf, buf + 4);
      return [mod.getValue(buf, "i32"), mod.getValue(buf + 4, "i32")];
    }), pixelMatrix = lib.floats([size[0] || 1, 0, 0, size[1] || 1, 0, 0]);
    P.FPDFPageObj_SetMatrix(obj, pixelMatrix);
    lib.free(pixelMatrix);
    const bitmap = P.FPDFImageObj_GetRenderedBitmap(this.h, page, obj), origMatrix = lib.floats(matrix);
    P.FPDFPageObj_SetMatrix(obj, origMatrix);
    lib.free(origMatrix);
    if (!bitmap) return null;
    const w = P.FPDFBitmap_GetWidth(bitmap), h = P.FPDFBitmap_GetHeight(bitmap), stride = P.FPDFBitmap_GetStride(bitmap), buf = P.FPDFBitmap_GetBuffer(bitmap), rgba = new Uint8ClampedArray(w * h * 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const s = buf + y * stride + x * 4, d = (y * w + x) * 4;
      rgba[d] = mod.HEAPU8[s + 2];
      rgba[d + 1] = mod.HEAPU8[s + 1];
      rgba[d + 2] = mod.HEAPU8[s];
      rgba[d + 3] = mod.HEAPU8[s + 3];
    }
    P.FPDFBitmap_Destroy(bitmap);
    return { m: matrix, rgba, w, h };
  }
  /**
   * Paste clipboard items onto a page, offset by (dx, dy). Text boxes ("ft") are skipped (the caller
   * recreates those). Returns ids of what was created: "o<objIndex>" for images, "a<annotIndex>" for annotations.
   */
  writeClip(index: number, items: ClipObj[], dx: number, dy: number, author: string): string[] {
    const P = this.P, lib = this.lib, mod = lib.M, created: string[] = [], shift = (r: Rect): Rect => ({ l: r.l + dx, r: r.r + dx, t: r.t + dy, b: r.b + dy });
    for (const item of items) {
      if (item.t === "ft") continue;
      if (item.t === "img") {
        const m = item.m;
        created.push("o" + this.addImage(index, [m[0], m[1], m[2], m[3], m[4] + dx, m[5] + dy], item.src));
        continue;
      }
      const subtype = item.subtype, annotIndex = this.withPage(index, (page) => {
        let annot = 0;
        if (subtype === ANNOT.STAMP) {
          annot = this.newAnnot(page, ANNOT.STAMP, null, author);
          setAnnotRect(lib, annot, shift(item.rect));
          if (item.ap != null) {
            const apPtr = lib.wstr(`q 1 0 0 1 ${fmt(dx)} ${fmt(dy)} cm
${item.ap}
Q`);
            P.FPDFAnnot_SetAP(annot, 0, apPtr);
            lib.free(apPtr);
            const flag = lib.wstr("1");
            P.FPDFAnnot_SetStringValue(annot, "MarginAP", flag);
            lib.free(flag);
          } else for (const img of item.images || []) {
            const bitmap = P.FPDFBitmap_Create(img.w, img.h, 1), buf = P.FPDFBitmap_GetBuffer(bitmap), stride = P.FPDFBitmap_GetStride(bitmap);
            for (let y = 0; y < img.h; y++) for (let x = 0; x < img.w; x++) {
              const s = (y * img.w + x) * 4, d = buf + y * stride + x * 4;
              mod.HEAPU8[d] = img.rgba[s + 2];
              mod.HEAPU8[d + 1] = img.rgba[s + 1];
              mod.HEAPU8[d + 2] = img.rgba[s];
              mod.HEAPU8[d + 3] = img.rgba[s + 3];
            }
            const obj = P.FPDFPageObj_NewImageObj(this.h);
            P.FPDFImageObj_SetBitmap(0, 0, obj, bitmap);
            P.FPDFBitmap_Destroy(bitmap);
            const m = lib.floats([img.m[0], img.m[1], img.m[2], img.m[3], img.m[4] + dx, img.m[5] + dy]);
            P.FPDFPageObj_SetMatrix(obj, m);
            lib.free(m);
            P.FPDFAnnot_AppendObject(annot, obj);
          }
        } else {
          annot = this.newAnnot(page, subtype, subtype === ANNOT.LINE ? null : item.color, author);
          if (subtype === ANNOT.LINE && item.line) {
            if (item.color) P.EPDFAnnot_SetColor(annot, 0, item.color[0], item.color[1], item.color[2]);
            this.writeLine(annot, { x: item.line[0].x + dx, y: item.line[0].y + dy }, { x: item.line[1].x + dx, y: item.line[1].y + dy });
          }
          setAnnotRect(lib, annot, shift(item.rect));
          for (const stroke of item.ink || []) {
            const pts = lib.floats(stroke.map((v, k) => v + (k % 2 ? dy : dx)));
            P.FPDFAnnot_AddInkStroke(annot, pts, stroke.length / 2);
            lib.free(pts);
          }
        }
        try {
          if (item.contents) {
            const ptr = lib.wstr(item.contents);
            P.FPDFAnnot_SetStringValue(annot, "Contents", ptr);
            lib.free(ptr);
          }
          if (subtype === ANNOT.TEXT) P.EPDFAnnot_GenerateAppearance(annot);
          else if (subtype !== ANNOT.STAMP) this.writeStyle(annot, item.style);
        } finally {
          P.FPDFPage_CloseAnnot(annot);
        }
        return P.FPDFPage_GetAnnotCount(page) - 1;
      });
      created.push("a" + annotIndex);
    }
    return created;
  }
  /** Set /Rect to `to` and wrap the existing appearance in a matrix that maps `from` onto `to`. */
  reframeAP(annot: number, from: Rect, to: Rect): void {
    const P = this.P, lib = this.lib, ap = lib.readW((buf, len) => P.FPDFAnnot_GetAP(annot, 0, buf, len));
    setAnnotRect(lib, annot, to);
    if (!ap) return;
    const sx = (to.r - to.l) / Math.max(1e-6, from.r - from.l), sy = (to.t - to.b) / Math.max(1e-6, from.t - from.b), apPtr = lib.wstr(`q ${fmt(sx)} 0 0 ${fmt(sy)} ${fmt(to.l - from.l * sx)} ${fmt(to.b - from.b * sy)} cm
${ap}
Q`);
    P.FPDFAnnot_SetAP(annot, 0, apPtr);
    lib.free(apPtr);
  }
  /** Whether Margin drew this annotation's appearance itself (/MarginAP or /MarginFT). */
  isDrawn(annot: number): boolean {
    return this.P.FPDFAnnot_HasKey(annot, "MarginAP") || this.P.FPDFAnnot_HasKey(annot, "MarginFT");
  }
  /** Move an annotation by (dx, dy). Text markups and redaction marks can't move (false). */
  moveAnnot(index: number, annotIndex: number, dx: number, dy: number): boolean {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        const subtype = P.FPDFAnnot_GetSubtype(annot);
        if (([ANNOT.HIGHLIGHT, ANNOT.UNDERLINE, ANNOT.STRIKEOUT, ANNOT.SQUIGGLY, ANNOT.REDACT] as number[]).includes(subtype)) return false;
        if (subtype === ANNOT.LINE) {
          const pts = this.readLine(annot);
          if (!pts) return false;
          this.writeLine(annot, { x: pts[0].x + dx, y: pts[0].y + dy }, { x: pts[1].x + dx, y: pts[1].y + dy });
          this.lineAP(annot);
          return true;
        }
        if (subtype === ANNOT.WIDGET) {
          const r = annotRect(lib, annot);
          setAnnotRect(lib, annot, { l: r.l + dx, r: r.r + dx, t: r.t + dy, b: r.b + dy });
          return true;
        }
        const from = annotRect(lib, annot), to = { l: from.l + dx, r: from.r + dx, t: from.t + dy, b: from.b + dy };
        if (this.isDrawn(annot)) this.reframeAP(annot, from, to);
        else setAnnotRect(lib, annot, to);
        if (subtype === ANNOT.FREETEXT) {
          const str = (key: string) => lib.readW((buf, len) => P.FPDFAnnot_GetStringValue(annot, key, buf, len));
          try {
            const data = JSON.parse(str("MarginFT")), shift = (r: Rect) => ({ l: r.l + dx, r: r.r + dx, t: r.t + dy, b: r.b + dy });
            data.box = shift(data.box);
            if (data.tip) data.tip = { x: data.tip.x + dx, y: data.tip.y + dy };
            const ptr = lib.wstr(JSON.stringify(data));
            P.FPDFAnnot_SetStringValue(annot, "MarginFT", ptr);
            lib.free(ptr);
            if (data.tip) {
              const anchor = calloutAnchor(data.box, data.tip), line = lib.floats([data.tip.x, data.tip.y, anchor.x, anchor.y]);
              P.EPDFAnnot_SetCalloutLine(annot, line, 2);
              lib.free(line);
            }
          } catch {
          }
          return true;
        }
        if (subtype === ANNOT.INK) {
          const count = P.FPDFAnnot_GetInkListCount(annot), strokes: number[][] = [];
          for (let k = 0; k < count; k++) {
            const n = P.FPDFAnnot_GetInkListPath(annot, k, 0, 0), buf = lib.alloc(n * 8);
            P.FPDFAnnot_GetInkListPath(annot, k, buf, n);
            const pts = lib.readFloats(buf, n * 2);
            lib.free(buf);
            strokes.push(pts.map((v, j) => v + (j % 2 ? dy : dx)));
          }
          P.FPDFAnnot_RemoveInkList(annot);
          for (const stroke of strokes) {
            const ptr = lib.floats(stroke);
            P.FPDFAnnot_AddInkStroke(annot, ptr, stroke.length / 2);
            lib.free(ptr);
          }
        }
        if (subtype !== ANNOT.STAMP) this.regenAP(annot);
        return true;
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /**
   * Resize an annotation to `rect`, scaling its geometry. Text boxes, notes, text markups and redaction
   * marks can't be resized (false).
   */
  resizeAnnot(index: number, annotIndex: number, rect: Rect): boolean {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        const subtype = P.FPDFAnnot_GetSubtype(annot);
        if (subtype === ANNOT.FREETEXT || subtype === ANNOT.TEXT || subtype === ANNOT.REDACT || ([ANNOT.HIGHLIGHT, ANNOT.UNDERLINE, ANNOT.STRIKEOUT, ANNOT.SQUIGGLY] as number[]).includes(subtype)) return false;
        const from = annotRect(lib, annot), sx = (rect.r - rect.l) / Math.max(1e-6, from.r - from.l), sy = (rect.t - rect.b) / Math.max(1e-6, from.t - from.b), map = (x: number, y: number) => [rect.l + (x - from.l) * sx, rect.b + (y - from.b) * sy];
        if (this.isDrawn(annot)) {
          this.reframeAP(annot, from, rect);
          return true;
        }
        if (subtype === ANNOT.WIDGET) {
          setAnnotRect(lib, annot, rect);
          const fieldType = P.FPDFAnnot_GetFormFieldType(this.form, annot);
          if (fieldType === FIELD.SIGNATURE) {
            const apPtr = lib.wstr(signatureFieldAP(rect));
            P.FPDFAnnot_SetAP(annot, 0, apPtr);
            lib.free(apPtr);
          } else if (fieldType !== FIELD.CHECKBOX && fieldType !== FIELD.RADIO) P.EPDFAnnot_GenerateFormFieldAP(annot);
          return true;
        }
        if (subtype === ANNOT.LINE) {
          const pts = this.readLine(annot);
          if (!pts) return false;
          const [a, b] = pts.map((p) => map(p.x, p.y));
          this.writeLine(annot, { x: a[0], y: a[1] }, { x: b[0], y: b[1] });
          this.lineAP(annot);
          return true;
        }
        setAnnotRect(lib, annot, rect);
        if (subtype === ANNOT.INK) {
          const count = P.FPDFAnnot_GetInkListCount(annot), strokes: number[][] = [];
          for (let k = 0; k < count; k++) {
            const n = P.FPDFAnnot_GetInkListPath(annot, k, 0, 0), buf = lib.alloc(n * 8);
            P.FPDFAnnot_GetInkListPath(annot, k, buf, n);
            const pts = lib.readFloats(buf, n * 2);
            lib.free(buf);
            const mapped: number[] = [];
            for (let j = 0; j < pts.length; j += 2) mapped.push(...map(pts[j], pts[j + 1]));
            strokes.push(mapped);
          }
          P.FPDFAnnot_RemoveInkList(annot);
          for (const stroke of strokes) {
            const ptr = lib.floats(stroke);
            P.FPDFAnnot_AddInkStroke(annot, ptr, stroke.length / 2);
            lib.free(ptr);
          }
        }
        if (subtype !== ANNOT.STAMP) this.regenAP(annot);
        return true;
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  // ---- Page objects ----------------------------------------------------------------------------
  /** Selectable page objects: text, images, forms (types 1, 3, 5) and anything that is Margin text. */
  pageObjects(index: number): PageObjectInfo[] {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const out: PageObjectInfo[] = [], count = P.FPDFPage_CountObjects(page);
      for (let k = 0; k < count; k++) {
        const obj = P.FPDFPage_GetObject(page, k), type = P.FPDFPageObj_GetType(obj), mark = readTextMark(lib, obj, "MarginText") || readTextMark(lib, obj, "MarginGlyph");
        if (!mark && type !== 1 && type !== 3 && type !== 5) continue;
        const bounds = lib.tmp((alloc) => {
          const buf = alloc(16);
          P.FPDFPageObj_GetBounds(obj, buf, buf + 4, buf + 8, buf + 12);
          const [l, b, r, t] = lib.readFloats(buf, 4);
          return { l, b, r, t };
        });
        out.push({ index: k, type, bounds, blockId: mark?.id || "" });
      }
      return out;
    });
  }
  /** Apply `matrix` to the given page objects. */
  transformObjects(index: number, objIndices: number[], matrix: number[]): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const objs = objIndices.map((k) => P.FPDFPage_GetObject(page, k)).filter(Boolean), m = lib.floats(matrix);
      for (const obj of objs) P.FPDFPageObj_TransformF(obj, m);
      lib.free(m);
      P.FPDFPage_GenerateContent(page);
    });
  }
  /**
   * Transform every object of Margin text block `blockId` by `matrix`, keeping the block's mark
   * metadata in step: its block matrix origin (`bm`), font `size` (× `scale`) and the rich-text JSON (`rt`).
   */
  transformBlock(index: number, blockId: string, matrix: number[], scale: number): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const m = lib.floats(matrix);
      for (let k = 0; k < P.FPDFPage_CountObjects(page); k++) {
        const obj = P.FPDFPage_GetObject(page, k), mark = readTextMark(lib, obj, "MarginText") || readTextMark(lib, obj, "MarginGlyph");
        if (!mark || mark.id !== blockId) continue;
        P.FPDFPageObj_TransformF(obj, m);
        const textMark = readTextMark(lib, obj, "MarginText");
        if (textMark) {
          const markH = findMark(lib, obj, "MarginText");
          if (!markH) continue;
          if (textMark.bm) {
            const [a, b, c, d, e, f] = textMark.bm, x = matrix[0] * e + matrix[2] * f + matrix[4], y = matrix[1] * e + matrix[3] * f + matrix[5];
            P.FPDFPageObjMark_SetStringParam(this.h, obj, markH, "bm", [a, b, c, d, x, y].map((v) => +v.toFixed(4)).join(","));
          }
          if (scale !== 1 && textMark.size) P.FPDFPageObjMark_SetStringParam(this.h, obj, markH, "size", String(+(textMark.size * scale).toFixed(2)));
          if (textMark.rt) try {
            const rt = JSON.parse(decodeURIComponent(textMark.rt)), [a, b, c, d, e, f] = rt.bm;
            rt.bm = [a, b, c, d, +(matrix[0] * e + matrix[2] * f + matrix[4]).toFixed(4), +(matrix[1] * e + matrix[3] * f + matrix[5]).toFixed(4)];
            if (scale !== 1) {
              rt.size = +(rt.size * scale).toFixed(2);
              if (rt.width) rt.width = +(rt.width * scale).toFixed(2);
            }
            P.FPDFPageObjMark_SetStringParam(this.h, obj, markH, "rt", encodeURIComponent(JSON.stringify(rt)));
          } catch {
          }
        }
      }
      lib.free(m);
      P.FPDFPage_GenerateContent(page);
    });
  }
  // ---- Form fields -----------------------------------------------------------------------------
  /** Form widgets on a page (empty when the document has no form environment). */
  fields(index: number): FieldInfo[] {
    const P = this.P, lib = this.lib, form = this.form;
    return form ? this.withPage(index, (page) => {
      const out: FieldInfo[] = [], count = P.FPDFPage_GetAnnotCount(page);
      for (let k = 0; k < count; k++) {
        const annot = P.FPDFPage_GetAnnot(page, k);
        try {
          if (P.FPDFAnnot_GetSubtype(annot) !== ANNOT.WIDGET) continue;
          const type = P.FPDFAnnot_GetFormFieldType(form, annot);
          if (type <= 0) continue;
          const flags = P.FPDFAnnot_GetFormFieldFlags(form, annot), options: { label: string; selected: boolean }[] = [];
          if (type === FIELD.COMBO || type === FIELD.LIST) {
            const optionCount = P.FPDFAnnot_GetOptionCount(form, annot);
            for (let j = 0; j < optionCount; j++) options.push({ label: lib.readW((buf, len) => P.FPDFAnnot_GetOptionLabel(form, annot, j, buf, len)), selected: !!P.FPDFAnnot_IsOptionSelected(form, annot, j) });
          }
          out.push({ index: k, type, rect: annotRect(lib, annot), options, name: lib.readW((buf, len) => P.FPDFAnnot_GetFormFieldName(form, annot, buf, len)), value: lib.readW((buf, len) => P.FPDFAnnot_GetFormFieldValue(form, annot, buf, len)), checked: type === FIELD.CHECKBOX || type === FIELD.RADIO ? !!P.FPDFAnnot_IsChecked(form, annot) : false, readOnly: !!(flags & 1), multiline: type === FIELD.TEXT && !!(flags & 4096), exportValue: type === FIELD.CHECKBOX || type === FIELD.RADIO ? lib.readW((buf, len) => P.FPDFAnnot_GetFormFieldExportValue(form, annot, buf, len)) : "" });
        } finally {
          P.FPDFPage_CloseAnnot(annot);
        }
      }
      return out;
    }) : [];
  }
  /**
   * Create a form field; returns its annotation index. A radio button joins `opts.joinTo` or else the
   * first existing radio group with the same name. Its "on" state name is stored in a padded /MarginOn
   * string, and signature fields are text fields tagged /MarginSig; nameRadioStates() fixes both up
   * after saving.
   */
  createField(index: number, kind: FieldKind, rect: Rect, name: string, opts: FieldOptions = {}): number {
    const P = this.P, lib = this.lib, form = this.form;
    if (!form) throw new Error("Form fields aren’t available for this document");
    const fieldType = ({ text: FIELD.TEXT, multiline: FIELD.TEXT, signature: FIELD.TEXT, checkbox: FIELD.CHECKBOX, radio: FIELD.RADIO, dropdown: FIELD.COMBO, list: FIELD.LIST } as Record<string, number>)[kind];
    let group = opts.joinTo || null;
    if (kind === "radio" && !group) for (let pageIndex = 0; pageIndex < this.pageCount && !group; pageIndex++) {
      const sibling = this.fields(pageIndex).find((f) => f.type === FIELD.RADIO && f.name === name);
      if (sibling) group = { page: pageIndex, annot: sibling.index };
    }
    // The group's page, when it is another page, stays loaded while we work.
    const groupPage = group && group.page !== index ? P.FPDF_LoadPage(this.h, group.page) : 0;
    if (groupPage) P.FORM_OnAfterLoadPage(groupPage, form);
    this.depth++;
    try {
      return this.withPage(index, (page) => {
        const namePtr = lib.wstr(group ? name + "__margin_new" : name), annot = P.EPDFPage_CreateFormField(page, form, fieldType, namePtr);
        lib.free(namePtr);
        if (!annot) throw new Error("Could not create the field");
        try {
          setAnnotRect(lib, annot, rect);
          P.FPDFAnnot_SetFlags(annot, 4);
          P.FPDFAnnot_SetBorder(annot, 0, 0, 1);
          P.EPDFAnnot_SetMKColor(annot, 0, 120, 124, 134);
          if (kind !== "checkbox" && kind !== "radio" && kind !== "signature") P.EPDFAnnot_SetMKColor(annot, 1, 255, 255, 255);
          P.EPDFAnnot_SetDefaultAppearance(annot, 4, opts.size ?? (kind === "checkbox" || kind === "radio" ? 0 : 11), 0, 0, 0);
          if (kind === "multiline") P.FPDFAnnot_SetFormFieldFlags(form, annot, 4096);
          if ((kind === "dropdown" || kind === "list") && opts.options?.length) {
            const ptrs = opts.options.map((label) => lib.wstr(label)), arr = lib.alloc(ptrs.length * 4);
            ptrs.forEach((ptr, j) => lib.M.setValue(arr + j * 4, ptr, "i32"));
            P.EPDFAnnot_SetFormFieldOptions(form, annot, arr, ptrs.length);
            ptrs.forEach((ptr) => lib.free(ptr));
            lib.free(arr);
          }
          if (kind === "radio") {
            if (group) {
              const sibling = P.FPDFPage_GetAnnot(groupPage || page, group.annot);
              try {
                if (!P.EPDFAnnot_ShareFormField(form, sibling, annot)) throw new Error("Could not add the button to its group");
              } finally {
                P.FPDFPage_CloseAnnot(sibling);
              }
              const realName = lib.wstr(name);
              P.EPDFAnnot_SetFormFieldName(form, annot, realName);
              lib.free(realName);
            }
            // Padded so nameRadioStates() can rewrite in place.
            const onPtr = lib.wstr((opts.onValue || "Choice").slice(0, 24) + " ".repeat(60));
            P.FPDFAnnot_SetStringValue(annot, "MarginOn", onPtr);
            lib.free(onPtr);
          }
          P.EPDFAnnot_GenerateFormFieldAP(annot);
          if (kind === "signature") {
            const sigPtr = lib.wstr(" ".repeat(40));
            P.FPDFAnnot_SetStringValue(annot, "MarginSig", sigPtr);
            lib.free(sigPtr);
            P.FPDFAnnot_SetFormFieldFlags(form, annot, 1 << 23);
            const apPtr = lib.wstr(signatureFieldAP(rect));
            P.FPDFAnnot_SetAP(annot, 0, apPtr);
            lib.free(apPtr);
          }
        } finally {
          P.FPDFPage_CloseAnnot(annot);
        }
        return P.FPDFPage_GetAnnotCount(page) - 1;
      });
    } finally {
      this.depth--;
      if (groupPage) {
        P.FORM_OnBeforeClosePage(groupPage, form);
        P.FPDF_ClosePage(groupPage);
      }
    }
  }
  /** Remove every form widget from a page. */
  removeWidgets(index: number): void {
    const P = this.P;
    this.withPage(index, (page) => {
      for (let k = P.FPDFPage_GetAnnotCount(page) - 1; k >= 0; k--) {
        const annot = P.FPDFPage_GetAnnot(page, k), isWidget = P.FPDFAnnot_GetSubtype(annot) === ANNOT.WIDGET;
        P.FPDFPage_CloseAnnot(annot);
        if (isWidget) P.FPDFPage_RemoveAnnot(page, k);
      }
    });
  }
  setFieldName(index: number, annotIndex: number, name: string): boolean {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        const namePtr = lib.wstr(name), ok = P.EPDFAnnot_SetFormFieldName(this.form, annot, namePtr);
        lib.free(namePtr);
        return !!ok;
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Replace a choice field's options. */
  setFieldOptions(index: number, annotIndex: number, options: string[]): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        const ptrs = options.map((label) => lib.wstr(label)), arr = lib.alloc(Math.max(1, ptrs.length) * 4);
        ptrs.forEach((ptr, j) => lib.M.setValue(arr + j * 4, ptr, "i32"));
        P.EPDFAnnot_SetFormFieldOptions(this.form, annot, arr, ptrs.length);
        ptrs.forEach((ptr) => lib.free(ptr));
        lib.free(arr);
        P.EPDFAnnot_GenerateFormFieldAP(annot);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Set a text field's value the way a user would: focus, select all, type, blur. */
  setFieldText(index: number, annotIndex: number, text: string): void {
    const P = this.P, lib = this.lib, form = this.form;
    this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        P.FORM_SetFocusedAnnot(form, annot);
        P.FORM_SelectAllText(form, page);
        const textPtr = lib.wstr(text);
        P.FORM_ReplaceSelection(form, page, textPtr);
        lib.free(textPtr);
        P.FORM_ForceToKillFocus(form);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** A field's rect, MK border/background colours, font size, border width and multiline flag. */
  fieldLook(index: number, annotIndex: number): FieldLook {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        return lib.tmp((alloc) => {
          const colorBuf = alloc(12), mkColor = (which: number) => P.EPDFAnnot_GetMKColor(annot, which, colorBuf, colorBuf + 4, colorBuf + 8) ? lib.readU32(colorBuf, 3) : null, sizeBuf = alloc(4), size = P.FPDFAnnot_GetFontSize(this.form, annot, sizeBuf) ? lib.readFloats(sizeBuf, 1)[0] : 0, hRadius = alloc(4), vRadius = alloc(4), widthBuf = alloc(4), borderWidth = P.FPDFAnnot_GetBorder(annot, hRadius, vRadius, widthBuf) ? lib.readFloats(widthBuf, 1)[0] : 1, flags = P.FPDFAnnot_GetFormFieldFlags(this.form, annot);
          return { rect: annotRect(lib, annot), border: mkColor(0), background: mkColor(1), size, borderWidth, multiline: !!(flags & 4096) };
        });
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Replace an annotation's normal appearance stream. */
  setNormalAppearance(index: number, annotIndex: number, ap: string): boolean {
    const P = this.P, lib = this.lib;
    return this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        const apPtr = lib.wstr(ap), ok = !!P.FPDFAnnot_SetAP(annot, 0, apPtr);
        lib.free(apPtr);
        return ok;
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Simulate a click in the middle of a field (toggles checkboxes / radio buttons). */
  clickField(index: number, annotIndex: number): void {
    const P = this.P, lib = this.lib;
    this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        const r = annotRect(lib, annot), x = (r.l + r.r) / 2, y = (r.t + r.b) / 2;
        P.FORM_OnMouseMove(this.form, page, 0, x, y);
        P.FORM_OnLButtonDown(this.form, page, 0, x, y);
        P.FORM_OnLButtonUp(this.form, page, 0, x, y);
        P.FORM_ForceToKillFocus(this.form);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
  /** Select option `optionIndex` of a choice field. */
  selectOption(index: number, annotIndex: number, optionIndex: number): void {
    const P = this.P;
    this.withPage(index, (page) => {
      const annot = P.FPDFPage_GetAnnot(page, annotIndex);
      try {
        P.FORM_SetFocusedAnnot(this.form, annot);
        P.FORM_SetIndexSelected(this.form, page, optionIndex, true);
        P.FORM_ForceToKillFocus(this.form);
      } finally {
        P.FPDFPage_CloseAnnot(annot);
      }
    });
  }
}

// ---------------------------------------------------------------------------------------------
// Geometry & small helpers
// ---------------------------------------------------------------------------------------------

/** A 2-D affine transform [a b c d e f]: x' = a·x + c·y + e, y' = b·x + d·y + f. */
class Affine {
  declare a: number;
  declare b: number;
  declare c: number;
  declare d: number;
  declare e: number;
  declare f: number;
  constructor(a: number, b: number, c: number, d: number, e: number, f: number) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
  }
  apply(x: number, y: number): [number, number] {
    return [this.a * x + this.c * y + this.e, this.b * x + this.d * y + this.f];
  }
  invert(): Affine {
    const det = this.a * this.d - this.b * this.c, a = this.d / det, b = -this.b / det, c = -this.c / det, d = this.a / det;
    return new Affine(a, b, c, d, -(a * this.e + c * this.f), -(b * this.e + d * this.f));
  }
  /** The axis-aligned bounding box of a transformed rect. */
  box(r: Rect): Box {
    const corners = [this.apply(r.l, r.b), this.apply(r.r, r.t), this.apply(r.l, r.t), this.apply(r.r, r.b)], xs = corners.map((p) => p[0]), ys = corners.map((p) => p[1]), x = Math.min(...xs), y = Math.min(...ys);
    return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
  }
}

/** An annotation's /Rect, normalised. */
function annotRect(lib: Pdfium, annot: number): Rect {
  return lib.tmp((alloc) => {
    const buf = alloc(16);
    lib.P.FPDFAnnot_GetRect(annot, buf);
    const [x0, y0, x1, y1] = lib.readFloats(buf, 4);
    return { l: Math.min(x0, x1), r: Math.max(x0, x1), t: Math.max(y0, y1), b: Math.min(y0, y1) };
  });
}

/** Where a callout line from `tip` meets the box: the box edge toward the tip (the tip itself if inside). */
function calloutAnchor(box: Rect, tip: Pt): Pt {
  const cx = (box.l + box.r) / 2, cy = (box.b + box.t) / 2, dx = tip.x - cx, dy = tip.y - cy, halfW = (box.r - box.l) / 2, halfH = (box.t - box.b) / 2, k = Math.min(dx ? halfW / Math.abs(dx) : 1 / 0, dy ? halfH / Math.abs(dy) : 1 / 0);
  return k >= 1 ? { x: tip.x, y: tip.y } : { x: cx + dx * k, y: cy + dy * k };
}

function setAnnotRect(lib: Pdfium, annot: number, r: Rect): void {
  const buf = lib.floats([r.l, r.t, r.r, r.b]);
  lib.P.FPDFAnnot_SetRect(annot, buf);
  lib.free(buf);
}

/** The bounding rect of several rects. */
function unionRect(rects: Rect[]): Rect {
  return { l: Math.min(...rects.map((r) => r.l)), r: Math.max(...rects.map((r) => r.r)), b: Math.min(...rects.map((r) => r.b)), t: Math.max(...rects.map((r) => r.t)) };
}

/** A PDF date string (D:YYYYMMDDHHmmSS, local time, no zone). */
function pdfDate(date = new Date()): string {
  const pad = (v: number) => String(v).padStart(2, "0");
  return `D:${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

/** The handle of a page object's content mark named `name`, or 0. */
function findMark(lib: Pdfium, obj: number, name: string): number {
  const P = lib.P, count = P.FPDFPageObj_CountMarks(obj);
  for (let k = 0; k < count; k++) {
    const mark = P.FPDFPageObj_GetMark(obj, k);
    if (lib.tmp((alloc) => {
      const nameBuf = alloc(128), lenBuf = alloc(4);
      return P.FPDFPageObjMark_GetName(mark, nameBuf, 128, lenBuf) && lib.M.UTF16ToString(nameBuf) === name;
    })) return mark;
  }
  return 0;
}

/** Read the parameters of a Margin text mark (`name` = "MarginText" or "MarginGlyph") on a page object. */
function readTextMark(lib: Pdfium, obj: number, name: string): TextMark | null {
  const P = lib.P, count = P.FPDFPageObj_CountMarks(obj);
  for (let k = 0; k < count; k++) {
    const mark = P.FPDFPageObj_GetMark(obj, k), params = lib.tmp((alloc): TextMark | null => {
      const nameBuf = alloc(128), lenBuf = alloc(4);
      if (!P.FPDFPageObjMark_GetName(mark, nameBuf, 128, lenBuf) || lib.M.UTF16ToString(nameBuf) !== name) return null;
      const param = (key: string): string => {
        const buf = alloc(512);
        return P.FPDFPageObjMark_GetParamStringValue(mark, key, buf, 512, lenBuf) ? lib.M.UTF16ToString(buf) : "";
      }, bm = param("bm").split(",").map(Number);
      // "rt" (rich text JSON) can be long: size it first.
      let rt = "";
      if (P.FPDFPageObjMark_GetParamStringValue(mark, "rt", 0, 0, lenBuf)) {
        const len = lib.M.getValue(lenBuf, "i32") >>> 0;
        if (len > 2) {
          const buf = lib.alloc(len);
          P.FPDFPageObjMark_GetParamStringValue(mark, "rt", buf, len, lenBuf);
          rt = lib.M.UTF16ToString(buf);
          lib.free(buf);
        }
      }
      return { id: param("id"), font: param("font"), ln: +param("ln") || 0, size: +param("size") || 0, color: param("color"), lh: +param("lh") || 1.5, st: param("st"), al: param("al") || "left", bm: bm.length === 6 && bm.every(Number.isFinite) ? bm as Matrix : null, rt };
    });
    if (params) return params;
  }
  return null;
}

/** Highlight, underline, strikeout or squiggly. */
const isTextMarkup = (subtype: number): boolean => subtype === ANNOT.HIGHLIGHT || subtype === ANNOT.UNDERLINE || subtype === ANNOT.STRIKEOUT || subtype === ANNOT.SQUIGGLY;

export { objectIndex, ENGINE_FULL, unionRect, compactDelta, ANNOT, Pdfium, ANNOT_NAMES, readTextMark, PdfError, calloutAnchor, isEngineAbort, isTextMarkup, FIELD, Affine, nameRadioStates, Doc };
