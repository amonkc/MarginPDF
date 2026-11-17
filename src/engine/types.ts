// Shared data shapes used across the engine and the UI. Coordinates are PDF user space (points, y up)
// unless a name says otherwise; "device"/"screen" boxes are CSS pixels with y down.

/** Rectangle in PDF space: left, right, top, bottom (t > b). */
export type Rect = { l: number; r: number; t: number; b: number };
/** Point in PDF space. */
export type Pt = { x: number; y: number };
/** Box in screen/device pixels (y down). */
export type Box = { x: number; y: number; w: number; h: number };
/** Colour as 0–255 red, green, blue, alpha. */
export type RGBA = [number, number, number, number];
/** PDF matrix [a b c d e f]. */
export type Matrix = [number, number, number, number, number, number];

/** Line ending styles Margin draws. */
export type LineEnd = 'None' | 'OpenArrow' | 'ClosedArrow';

/** One annotation as listed by Doc.annots(). */
export type AnnotInfo = {
  index: number;
  subtype: number;
  rect: Rect;
  color: RGBA | null;
  contents: string;
  author: string;
  modified: string;
  isMargin: boolean;
  line?: [Pt, Pt];
  /** index of the annotation this one replies to */
  irt?: number;
  /** Margin text boxes: the box and the callout tip, if any */
  ft?: { box: Rect; tip?: Pt };
};

/** How an annotation is drawn: stroke width (pt), dashed or solid, interior fill, opacity 0–1, line arrowheads. */
export type AnnotStyle = { width: number; dashed: boolean; fill: RGBA | null; opacity: number; ends?: [LineEnd, LineEnd] };

/** Style of a Margin text box / callout. */
export type FreeTextStyle = {
  fontKey: string;
  size: number;
  color: RGBA;
  fill: RGBA | null;
  border: RGBA | null;
  borderWidth?: number;
  [k: string]: unknown;
};
/** A Margin text box / callout as stored in its /MarginFT entry plus its /Contents. */
export type FreeTextData = { box: Rect; tip?: Pt; text: string; style: FreeTextStyle; [k: string]: unknown };

/** Pixels or a JPEG file for an image object. */
export type ImageSrc = { jpeg: Uint8Array } | { rgba: Uint8ClampedArray | Uint8Array; w: number; h: number };

/** Annotations and images as plain data (copy & paste between pages, documents and windows). */
export type ClipAnnot = {
  t: 'annot';
  subtype: number;
  rect: Rect;
  color: RGBA | null;
  contents: string;
  style: AnnotStyle;
  line?: [Pt, Pt];
  ink?: number[][];
  ap?: string;
  images?: { m: Matrix; rgba: Uint8ClampedArray; w: number; h: number }[];
};
export type ClipObj = ClipAnnot | { t: 'ft'; data: FreeTextData } | { t: 'img'; m: Matrix; src: ImageSrc };

/** A bookmark (outline item). `path` is its position as child indices from the root. */
export type Bookmark = { title: string; page: number; top: number | null; uri: string | null; path: number[]; children: Bookmark[] };
