import { Blob as HbBlob, Buffer as HbBuffer, Face as HbFace, Font as HbFont, Variation as HbVariation, initHarfBuzz, shape as hbShape } from '../vendor/harfbuzz/index.mjs';
import { loadAsset } from './assets';
import { readTextMark, calloutAnchor } from './pdfium';
import type { Doc, Pdfium } from './pdfium';
import type { FreeTextData, Matrix, Pt, RGBA, Rect } from './types';
import { DEFAULT_FT_BORDER_WIDTH } from './types';
import { subsetFont } from './subset';

export { DEFAULT_FT_BORDER_WIDTH };

/** The open document. */
type PdfDoc = Doc;
/** The PDFium wasm wrapper (`doc.lib`). */
type PdfLib = Pdfium;
/** A PDFium handle (FPDF_PAGEOBJECT, FPDF_FONT, …): a wasm pointer, 0 for none. */
type Handle = number;
/** Maps a point from glyph/text space to output coordinates, giving [x, y]. */
type PointTransform = (x: number, y: number) => number[];

/** Border width a text box style actually draws with: 0 without a border colour. */
const ftBorderWidth = (style: FreeTextData["style"]): number => style.border ? style.borderWidth ?? DEFAULT_FT_BORDER_WIDTH : 0;

/**
 * A font family offered in the font menus. Either one of the PDF standard 14 families (`std` lists the
 * regular / bold / italic / bold-italic base font names) or a bundled TrueType font loaded from `public/fonts/`
 * (`file` regular, optional `b` / `i` / `bi` styles; `vw` = variable font with a `wght` axis).
 */
export type FontDef = {
  key: string;
  label: string;
  group: string;
  /** CSS font-family (for bundled fonts the name it is registered under with the FontFace API) */
  css: string;
  std?: string[];
  file?: string;
  b?: string;
  i?: string;
  bi?: string;
  vw?: boolean;
};

/** A family resolved to one concrete style: a standard base font, or a font file plus synthetic bold / italic. */
export type FontFace_ = {
  def: FontDef;
  std?: string;
  file?: string;
  /** weight to set on the variable `wght` axis */
  wght?: number;
  fakeBold: boolean;
  fakeItalic: boolean;
  /** cache key for this face */
  key: string;
};

/** A loaded face: font bytes, HarfBuzz font (bundled fonts only), units per em and ascent as a fraction of the em. */
export type LoadedFont = { bytes: Uint8Array; hbFont?: HbFont; upem: number; ascent: number; file?: string };

/** A shaped glyph: glyph id, pen position and advance in font units. */
export type ShapedGlyph = { gid: number; x: number; y: number; adv: number };

/** Receives a glyph outline as path commands, in output coordinates. */
type PathSink = {
  move: (x: number, y: number) => void;
  line: (x: number, y: number) => void;
  curve: (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => void;
  close: () => void;
};

/** All fonts Margin can write with. The first entry is the fallback for unknown keys. */
const FONTS: FontDef[] = [
  { key: "helv", label: "Helvetica", group: "Standard", css: "Helvetica, Arial, sans-serif", std: ["Helvetica", "Helvetica-Bold", "Helvetica-Oblique", "Helvetica-BoldOblique"] },
  { key: "times", label: "Times", group: "Standard", css: '"Times New Roman", Times, serif', std: ["Times-Roman", "Times-Bold", "Times-Italic", "Times-BoldItalic"] },
  { key: "courier", label: "Courier", group: "Standard", css: '"Courier New", Courier, monospace', std: ["Courier", "Courier-Bold", "Courier-Oblique", "Courier-BoldOblique"] },
  { key: "sarabun", label: "Sarabun", group: "Thai + Latin", css: "MarginSarabun", file: "Sarabun-Regular.ttf", b: "Sarabun-Bold.ttf", i: "Sarabun-Italic.ttf", bi: "Sarabun-BoldItalic.ttf" },
  { key: "notosansthai", label: "Noto Sans Thai", group: "Thai + Latin", css: "MarginNotoSansThai", file: "NotoSansThai.ttf", vw: true },
  { key: "notoserifthai", label: "Noto Serif Thai", group: "Thai + Latin", css: "MarginNotoSerifThai", file: "NotoSerifThai.ttf", vw: true },
  { key: "kanit", label: "Kanit", group: "Thai + Latin", css: "MarginKanit", file: "Kanit-Regular.ttf", b: "Kanit-Bold.ttf", i: "Kanit-Italic.ttf", bi: "Kanit-BoldItalic.ttf" },
  { key: "prompt", label: "Prompt", group: "Thai + Latin", css: "MarginPrompt", file: "Prompt-Regular.ttf", b: "Prompt-Bold.ttf", i: "Prompt-Italic.ttf", bi: "Prompt-BoldItalic.ttf" },
  { key: "mitr", label: "Mitr", group: "Thai + Latin", css: "MarginMitr", file: "Mitr-Regular.ttf", b: "Mitr-Bold.ttf" },
  { key: "baijamjuree", label: "Bai Jamjuree", group: "Thai + Latin", css: "MarginBaiJamjuree", file: "BaiJamjuree-Regular.ttf", b: "BaiJamjuree-Bold.ttf", i: "BaiJamjuree-Italic.ttf", bi: "BaiJamjuree-BoldItalic.ttf" },
  { key: "chakrapetch", label: "Chakra Petch", group: "Thai + Latin", css: "MarginChakraPetch", file: "ChakraPetch-Regular.ttf", b: "ChakraPetch-Bold.ttf", i: "ChakraPetch-Italic.ttf", bi: "ChakraPetch-BoldItalic.ttf" },
  { key: "plexthai", label: "IBM Plex Sans Thai", group: "Thai + Latin", css: "MarginPlexThai", file: "IBMPlexSansThai-Regular.ttf", b: "IBMPlexSansThai-Bold.ttf" },
  { key: "roboto", label: "Roboto", group: "Latin", css: "MarginRoboto", file: "Roboto.ttf", i: "Roboto-Italic.ttf", vw: true },
  { key: "opensans", label: "Open Sans", group: "Latin", css: "MarginOpenSans", file: "OpenSans.ttf", i: "OpenSans-Italic.ttf", vw: true },
  { key: "lato", label: "Lato", group: "Latin", css: "MarginLato", file: "Lato-Regular.ttf", b: "Lato-Bold.ttf" },
  { key: "montserrat", label: "Montserrat", group: "Latin", css: "MarginMontserrat", file: "Montserrat.ttf", i: "Montserrat-Italic.ttf", vw: true },
  { key: "poppins", label: "Poppins", group: "Latin", css: "MarginPoppins", file: "Poppins-Regular.ttf", b: "Poppins-Bold.ttf", i: "Poppins-Italic.ttf", bi: "Poppins-BoldItalic.ttf" },
  { key: "nunito", label: "Nunito", group: "Latin", css: "MarginNunito", file: "Nunito.ttf", i: "Nunito-Italic.ttf", vw: true },
  { key: "playfair", label: "Playfair Display", group: "Latin", css: "MarginPlayfair", file: "PlayfairDisplay.ttf", i: "PlayfairDisplay-Italic.ttf", vw: true },
  { key: "oswald", label: "Oswald", group: "Latin", css: "MarginOswald", file: "Oswald.ttf", vw: true },
  { key: "robotomono", label: "Roboto Mono", group: "Latin", css: "MarginRobotoMono", file: "RobotoMono.ttf", i: "RobotoMono-Italic.ttf", vw: true },
  // Chinese, Japanese and Korean: everyday character sets (scripts/make-fonts.py), about 1–1.3 MB each to download
  { key: "notosanssc", label: "Noto Sans SC · Simplified Chinese", group: "Chinese, Japanese, Korean", css: "MarginNotoSansSC", file: "NotoSansSC-Regular.ttf" },
  { key: "notosanstc", label: "Noto Sans TC · Traditional Chinese", group: "Chinese, Japanese, Korean", css: "MarginNotoSansTC", file: "NotoSansTC-Regular.ttf" },
  { key: "notosansjp", label: "Noto Sans JP · Japanese", group: "Chinese, Japanese, Korean", css: "MarginNotoSansJP", file: "NotoSansJP-Regular.ttf" },
  { key: "notosanskr", label: "Noto Sans KR · Korean", group: "Chinese, Japanese, Korean", css: "MarginNotoSansKR", file: "NotoSansKR-Regular.ttf" },
  { key: "notosansdevanagari", label: "Noto Sans Devanagari · Hindi, Marathi, Nepali", group: "South and Southeast Asian", css: "MarginNotoSansDevanagari", file: "NotoSansDevanagari.ttf", vw: true },
  { key: "notosansbengali", label: "Noto Sans Bengali", group: "South and Southeast Asian", css: "MarginNotoSansBengali", file: "NotoSansBengali.ttf", vw: true },
  { key: "notosanstamil", label: "Noto Sans Tamil", group: "South and Southeast Asian", css: "MarginNotoSansTamil", file: "NotoSansTamil.ttf", vw: true },
  { key: "notosanstelugu", label: "Noto Sans Telugu", group: "South and Southeast Asian", css: "MarginNotoSansTelugu", file: "NotoSansTelugu.ttf", vw: true },
  { key: "notosanslao", label: "Noto Sans Lao", group: "South and Southeast Asian", css: "MarginNotoSansLao", file: "NotoSansLao.ttf", vw: true },
  { key: "notosanskhmer", label: "Noto Sans Khmer", group: "South and Southeast Asian", css: "MarginNotoSansKhmer", file: "NotoSansKhmer.ttf", vw: true },
  { key: "notosansmyanmar", label: "Noto Sans Myanmar · Burmese", group: "South and Southeast Asian", css: "MarginNotoSansMyanmar", file: "NotoSansMyanmar.ttf", vw: true }
];
/** Font menu sections, in menu order. */
const FONT_GROUPS = ["Standard", "Thai + Latin", "Latin", "Chinese, Japanese, Korean", "South and Southeast Asian"];
/** Font definition by key; unknown keys give Helvetica. */
const fontByKey = (key: string): FontDef => FONTS.find((font) => font.key === key) || FONTS[0];
/** CSS font-family value for previewing a font in the UI. */
const fontCss = (font: FontDef): string => font.std ? font.css : `"${font.css}", sans-serif`;
/** Scripts whose text must be shaped (Thai, Lao, Myanmar, Khmer, Indic). */
const COMPLEX_SCRIPT_RE = /[฀-๿຀-໿က-႟ក-៿ऀ-෿]/;
/** True when `text` contains characters from a script that needs HarfBuzz shaping. */
const needsShaping = (text: string): boolean => COMPLEX_SCRIPT_RE.test(text);
/** True when `text` contains Thai. */
const hasThai = (text: string): boolean => /[฀-๿]/.test(text);
/** True when every character is encodable in WinAnsi, i.e. a standard 14 font can show it. */
const isWinAnsi = (text: string): boolean => [...text].every((ch) => ch.codePointAt(0)! < 256 || "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ".includes(ch));

/** Text style flags. */
export type TextStyleFlags = { bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean };
/** Encode style flags as the compact "biu s" code stored in text marks (`st`). */
const styleCode = (style: TextStyleFlags): string => (style.bold ? "b" : "") + (style.italic ? "i" : "") + (style.underline ? "u" : "") + (style.strike ? "s" : "");
/** Decode a style code written by {@link styleCode}. */
const parseStyleCode = (code: string) => ({ bold: code.includes("b"), italic: code.includes("i"), underline: code.includes("u"), strike: code.includes("s") });

/**
 * Pick the concrete face for a family and style. Uses a real bold/italic file when the family has one,
 * the variable `wght` axis for bold where possible, and otherwise falls back to synthetic bold (stroke)
 * or synthetic italic (skew).
 */
function resolveFace(def: FontDef, style: { bold?: boolean; italic?: boolean }): FontFace_ {
  const bold = !!style.bold, italic = !!style.italic;
  if (def.std) return { def, std: def.std[(bold ? 1 : 0) + (italic ? 2 : 0)], fakeBold: false, fakeItalic: false, key: def.key + (bold ? "b" : "") + (italic ? "i" : "") };
  let file = def.file, wght: number | undefined, fakeBold = false, fakeItalic = false;
  if (bold && italic) {
    if (def.bi) file = def.bi;
    else if (def.i && def.vw) {
      file = def.i;
      wght = 700;
    } else if (def.b) {
      file = def.b;
      fakeItalic = true;
    } else if (def.i) {
      file = def.i;
      fakeBold = true;
    } else if (def.vw) {
      wght = 700;
      fakeItalic = true;
    } else fakeBold = fakeItalic = true;
  } else if (bold) {
    if (def.b) file = def.b;
    else if (def.vw) wght = 700;
    else fakeBold = true;
  } else if (italic) {
    if (def.i) file = def.i;
    else fakeItalic = true;
  }
  return { def, file, wght, fakeBold, fakeItalic, key: file + (wght ? "@" + wght : "") };
}
/** Shear used for synthetic italic (12°). */
const FAKE_ITALIC_SKEW = Math.tan(12 * Math.PI / 180);
/** Loaded faces by face key. */
const fontCache = /* @__PURE__ */ new Map<string, Promise<LoadedFont>>();
/** Resolves when the HarfBuzz wasm is ready. */
let harfbuzzReady: Promise<void> | null = null;
/** Start HarfBuzz from its wasm bytes. Font loading waits for this. */
function initShaper(wasmBinary: ArrayBuffer | Uint8Array): Promise<void> {
  harfbuzzReady = initHarfBuzz({ wasmBinary });
  return harfbuzzReady!;
}
/** Font groups whose files are large (about a megabyte): the UI is told while one downloads. */
const BIG_FONT_GROUPS = new Set(["Chinese, Japanese, Korean"]);
let fontLoadingHook: (def: FontDef) => () => void = () => () => {};
/** Called when a large font starts downloading; the function it returns is called when it's done. */
function onBigFontLoading(hook: (def: FontDef) => () => void): void {
  fontLoadingHook = hook;
}
/** Load the regular face of a family. */
function loadFont(def: FontDef): Promise<LoadedFont> {
  return loadFace(resolveFace(def, {}));
}
/**
 * Load a face: fetch the TTF, register it with the browser (for on-screen editing) and create its HarfBuzz font.
 * Standard 14 faces need nothing loaded. Cached; a failed load is evicted so it can be retried.
 */
function loadFace(face: FontFace_): Promise<LoadedFont> {
  if (face.std) return Promise.resolve({ bytes: new Uint8Array(), upem: 1e3, ascent: 0.75 });
  let pending = fontCache.get(face.key);
  if (!pending) {
    const done = BIG_FONT_GROUPS.has(face.def.group) ? fontLoadingHook(face.def) : null;
    pending = (async () => {
      const def = face.def, file = face.file!, data = await loadAsset("fonts/" + file).catch(() => {
        throw new Error(`Font ${def.label} failed to load`);
      }), bytes = new Uint8Array(data), descriptors = { weight: def.vw ? "100 900" : file === def.b || file === def.bi ? "700" : "400", style: file === def.i || file === def.bi ? "italic" : "normal" };
      try {
        const browserFace = new FontFace(def.css, data.slice(0), descriptors);
        await browserFace.load();
        document.fonts.add(browserFace);
      } catch {
      }
      await harfbuzzReady;
      const hbFace = new HbFace(new HbBlob(data.slice(0))), hbFont = new HbFont(hbFace);
      if (face.wght) {
        const variation = HbVariation.fromString("wght=" + face.wght);
        if (variation) hbFont.setVariations([variation]);
      }
      const upem = hbFace.upem;
      let ascent = 0.8;
      try {
        const extents = hbFont.hExtents ? hbFont.hExtents() : null;
        if (extents?.ascender) ascent = extents.ascender / upem;
      } catch {
      }
      return { bytes, hbFont, upem, ascent, file };
    })();
    fontCache.set(face.key, pending);
    pending.catch(() => fontCache.delete(face.key));
    if (done) pending.then(done, done);
  }
  return pending;
}
/** PDFium font handles per opened document, keyed by base font name or file plus characters. */
const pdfFontCache = /* @__PURE__ */ new WeakMap<object, { g: number; m: Map<string, Handle> }>();
/**
 * The PDFium font object for a face and the text it will show: a standard font, or the TTF embedded as a CID
 * font, cut down to the characters of `text` (subset.ts) so a PDF doesn't carry whole font files.
 */
async function pdfFontFor(doc: PdfDoc, face: FontFace_, loaded: LoadedFont, text: string): Promise<Handle> {
  const chars = [...new Set(text)].sort().join(""), cacheKey = face.std || face.file + "|" + chars;
  const cached = () => {
    let entry = pdfFontCache.get(doc);
    // per opened document: font handles die with the document they were loaded into (Doc.generation)
    if (!entry || entry.g !== doc.generation) {
      entry = { g: doc.generation, m: /* @__PURE__ */ new Map<string, Handle>() };
      pdfFontCache.set(doc, entry);
    }
    return entry.m;
  };
  let handle = cached().get(cacheKey);
  if (handle) return handle;
  const bytes = face.std ? null : (await subsetFont(loaded.bytes, chars)) || loaded.bytes;
  handle = cached().get(cacheKey); // another write may have made it meanwhile
  if (!handle) {
    handle = face.std ? doc.P.FPDFText_LoadStandardFont(doc.h, face.std) : doc.P.FPDFText_LoadFont(doc.h, doc.lib.bytes(bytes!), bytes!.length, 2, true);
    if (!handle) throw new Error(`PDFium could not embed ${face.def.label}`);
    cached().set(cacheKey, handle);
  }
  return handle;
}

// ---- Choosing a font that can show the text --------------------------------------------------------------
// Each font says which characters it has (HarfBuzz's character map). Where the chosen font lacks some, those
// stretches of text use the font for their script instead: Japanese kana → Noto Sans JP, Hangul → Noto Sans KR,
// Chinese characters → the Chinese, Japanese or Korean font that fits the surrounding text and the browser's
// language, Indic and Southeast Asian scripts → their Noto font, Thai → Sarabun, Greek and Cyrillic → Lato,
// accented Latin (pinyin, Vietnamese) → Sarabun or Lato. Text is split between grapheme clusters only.

/** Characters that go with whatever font is next to them. */
const NEUTRAL_RE = /^[\s\u200b-\u200f\u2060\ufe00-\ufe0f]+$/u;
const KANA_RE = /[\u3040-\u30ff\u31f0-\u31ff\uff66-\uff9f]/;
const HANGUL_RE = /[\uac00-\ud7a3\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff]/;
const HAN_RE = /[\u2e80-\u2fdf\u3000-\u303f\u3100-\u312f\u31a0-\u31bf\u3200-\u33ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\ufe30-\ufe4f\uff00-\uffef]|[\ud840-\ud87f][\udc00-\udfff]/;
/** The order to try the Chinese, Japanese and Korean fonts for Chinese characters. */
function hanFonts(context: string): string[] {
  const sc = "notosanssc", tc = "notosanstc", jp = "notosansjp", kr = "notosanskr";
  if (KANA_RE.test(context)) return [jp, tc, sc, kr];
  if (HANGUL_RE.test(context)) return [kr, tc, sc, jp];
  const lang = (typeof navigator < "u" ? navigator.languages?.[0] || navigator.language || "" : "").toLowerCase();
  if (/^zh-(tw|hk|mo|hant)/.test(lang)) return [tc, sc, jp, kr];
  if (lang.startsWith("ja")) return [jp, sc, tc, kr];
  if (lang.startsWith("ko")) return [kr, tc, sc, jp];
  return [sc, tc, jp, kr];
}
const SCRIPT_FONTS: [RegExp, (context: string) => string[]][] = [
  [KANA_RE, () => ["notosansjp"]],
  [HANGUL_RE, () => ["notosanskr"]],
  [HAN_RE, hanFonts],
  [/[\u0900-\u097f\ua8e0-\ua8ff\u1cd0-\u1cff]/, () => ["notosansdevanagari"]],
  [/[\u0980-\u09ff]/, () => ["notosansbengali"]],
  [/[\u0b80-\u0bff]/, () => ["notosanstamil"]],
  [/[\u0c00-\u0c7f]/, () => ["notosanstelugu"]],
  [/[\u0e80-\u0eff]/, () => ["notosanslao"]],
  [/[\u1780-\u17ff\u19e0-\u19ff]/, () => ["notosanskhmer"]],
  [/[\u1000-\u109f\uaa60-\uaa7f\ua9e0-\ua9ff]/, () => ["notosansmyanmar"]],
  [/[\u0e00-\u0e7f]/, () => ["sarabun", "notosansthai"]],
  [/[\u0370-\u03ff\u1f00-\u1fff\u0400-\u052f]/, () => ["lato", "roboto", "opensans"]],
  [/[\u0080-\u024f\u1e00-\u1eff\u02b0-\u02ff\u0300-\u036f]/, () => ["sarabun", "lato"]],
];
/** Fonts to try for a grapheme cluster the chosen font can't show (other symbols: fonts already loaded). */
function fallbackKeys(cluster: string, context: string): string[] {
  for (const [re, keys] of SCRIPT_FONTS) if (re.test(cluster)) return keys(context);
  return [...fontCache.keys()].map((key) => FONTS.find((f) => key === f.key)?.key).filter((k): k is string => !!k);
}
/** Whether a family can show every character of `text` (standard fonts: WinAnsi). Loads the font. */
async function covers(def: FontDef, text: string): Promise<boolean> {
  if (def.std) return isWinAnsi(text);
  const font = await loadFont(def);
  return [...text].every((ch) => NEUTRAL_RE.test(ch) || font.hbFont!.nominalGlyph(ch.codePointAt(0)!) !== undefined);
}
const CLUSTERS = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
const WORDS = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: "word" }) : null;
const clustersOf = (text: string): string[] => CLUSTERS ? [...CLUSTERS.segment(text)].map((s) => s.segment) : [...text];

/**
 * Splits `text` into pieces that each have a font able to show them: `fontKey` wherever it can, the script's
 * font elsewhere (a cluster no font has stays in `fontKey`). `context` is the surrounding text (for choosing
 * between Chinese, Japanese and Korean).
 */
async function splitByCoverage(fontKey: string, text: string, context = text): Promise<{ text: string; fontKey: string }[]> {
  const def = fontByKey(fontKey);
  if (!text || (await covers(def, text).catch(() => true))) return [{ text, fontKey: def.key }];
  // One Chinese/Japanese/Korean font for all the Chinese characters of the context when one has them all
  // (so Traditional Chinese isn't mixed with Simplified glyphs), and fonts already used here tried first.
  const hanChars = [...context].filter((ch) => HAN_RE.test(ch)).join(""), hanOrder = hanFonts(context);
  if (hanChars) {
    for (const key of hanOrder) {
      if (await covers(fontByKey(key), hanChars).catch(() => false)) {
        hanOrder.splice(hanOrder.indexOf(key), 1);
        hanOrder.unshift(key);
        break;
      }
    }
  }
  const used: string[] = [], candidatesFor = (cluster: string) => {
    const keys = HAN_RE.test(cluster) && !KANA_RE.test(cluster) && !HANGUL_RE.test(cluster) ? hanOrder : fallbackKeys(cluster, context);
    return [...used.filter((k) => !HAN_RE.test(cluster) || keys.indexOf(k) === 0), ...keys.filter((k) => !used.includes(k))];
  };
  const pieces: { text: string; fontKey: string }[] = [], push = (piece: string, key: string) => {
    if (key !== def.key && !used.includes(key)) used.push(key);
    const last = pieces[pieces.length - 1];
    if (last && last.fontKey === key) last.text += piece;
    else pieces.push({ text: piece, fontKey: key });
  };
  /** The first fallback that has all of `piece` (judged by its first character the chosen font lacks). */
  const fallbackFor = async (piece: string): Promise<string | null> => {
    for (const cluster of clustersOf(piece)) {
      if (NEUTRAL_RE.test(cluster) || (await covers(def, cluster).catch(() => true))) continue;
      for (const candidate of candidatesFor(cluster)) if (candidate !== def.key && (await covers(fontByKey(candidate), piece).catch(() => false))) return candidate;
      return null;
    }
    return def.key;
  };
  // Whole words where one font has them all (so "Việt" isn't set in two fonts), else cluster by cluster.
  for (const word of WORDS ? [...WORDS.segment(text)].map((s) => s.segment) : text.split(/(?<=\s)|(?=\s)/)) {
    if (NEUTRAL_RE.test(word) || (await covers(def, word).catch(() => true))) {
      push(word, def.key);
      continue;
    }
    const whole = await fallbackFor(word);
    if (whole) {
      push(word, whole);
      continue;
    }
    for (const cluster of clustersOf(word)) {
      let key = def.key;
      if (!NEUTRAL_RE.test(cluster) && !(await covers(def, cluster).catch(() => true))) {
        for (const candidate of candidatesFor(cluster)) {
          if (candidate !== def.key && (await covers(fontByKey(candidate), cluster).catch(() => false))) {
            key = candidate;
            break;
          }
        }
      }
      push(cluster, key);
    }
  }
  // A space between two pieces in the same fallback font joins them.
  for (let i = 1; i + 1 < pieces.length; i++) {
    const [prev, mid, next] = [pieces[i - 1], pieces[i], pieces[i + 1]];
    if (NEUTRAL_RE.test(mid.text) && prev.fontKey === next.fontKey && prev.fontKey !== def.key) {
      pieces.splice(i - 1, 3, { text: prev.text + mid.text + next.text, fontKey: prev.fontKey });
      i--;
    }
  }
  return pieces;
}
/**
 * One font for all of `text` (for things drawn with a single font: plain text lines, text boxes, form fields,
 * stamps): `fontKey` if it can show it, else the first font that can, else the one that shows the most.
 */
async function coveringFontKey(fontKey: string, text: string): Promise<string> {
  const pieces = await splitByCoverage(fontKey, text);
  if (pieces.length === 1) return pieces[0].fontKey;
  const shown = new Map<string, number>();
  for (const piece of pieces) shown.set(piece.fontKey, (shown.get(piece.fontKey) || 0) + piece.text.length);
  const keys = [...shown.keys()].sort((a, b) => shown.get(b)! - shown.get(a)!);
  for (const key of keys) if (key !== fontKey && (await covers(fontByKey(key), text).catch(() => false))) return key;
  return keys[0];
}
/** {@link outlineFont}, then switched to a font that can show `text` if that one can't. */
async function outlineFontFor(fontKey: string, text: string): Promise<FontDef> {
  return fontByKey(await coveringFontKey(outlineFont(fontKey, text).key, text));
}
/** Shape one line with HarfBuzz. Glyph positions are in font units; `width` is in ems. */
function shapeText(font: LoadedFont, text: string): { glyphs: ShapedGlyph[]; width: number } {
  const buffer = new HbBuffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  hbShape(font.hbFont!, buffer);
  const infos = buffer.getGlyphInfos(), positions = buffer.getGlyphPositions(), glyphs: ShapedGlyph[] = [];
  let penX = 0;
  for (let i = 0; i < infos.length; i++) {
    glyphs.push({ gid: infos[i].codepoint, x: penX + positions[i].xOffset, y: positions[i].yOffset, adv: positions[i].xAdvance });
    penX += positions[i].xAdvance;
  }
  return { glyphs, width: penX / font.upem };
}
/** Width of `text` at `size` pt. Standard fonts are measured with a canvas using the CSS fallback font. */
function measureText(face: FontFace_, font: LoadedFont, text: string, size: number): number {
  if (face.std) {
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.font = `${face.std.includes("Oblique") || face.std.includes("Italic") ? "italic " : ""}${face.std.includes("Bold") ? "bold " : ""}${size * 10}px ${face.def.css}`;
    return ctx.measureText(text).width / 10;
  }
  return shapeText(font, text).width * size;
}

/** What to write with {@link writeText}. */
export type WriteTextOptions = TextStyleFlags & {
  lines: string[];
  fontKey: string;
  size: number;
  color: RGBA;
  /** text space → page matrix of the first line's baseline origin */
  matrix: Matrix;
  /** id shared by all objects of this text block (generated when absent) */
  id?: string;
  lineHeight?: number;
  align?: string;
  /** line number of the first line, stored in the marks */
  ln0?: number;
  /** extra mark parameters */
  extra?: Record<string, string>;
};

/**
 * Write lines of text into a page as real text objects, tagged with a "MarginText" mark that records how to
 * edit them again. Complex scripts (and variable-weight faces) are additionally drawn as glyph outline paths
 * ("MarginGlyph"), with the text object made invisible (render mode 3) so it still provides selectable,
 * searchable text. Synthetic bold strokes the glyphs; underline / strike-through are filled rectangles.
 * Falls back to Sarabun when a standard font cannot encode the text.
 */
async function writeText(doc: PdfDoc, pageIndex: number, opts: WriteTextOptions): Promise<{ fontKey: string; fellBack: boolean }> {
  const allText = opts.lines.join(""), def = fontByKey(await coveringFontKey(opts.fontKey, allText)), fellBack = def.key !== fontByKey(opts.fontKey).key;
  const face = resolveFace(def, opts), font = await loadFace(face), id = opts.id || "b" + Math.random().toString(36).slice(2, 9), lineHeight = opts.lineHeight ?? 1.5, lineStep = lineHeight * opts.size, size = opts.size, [a, b, c, d, e, f] = opts.matrix, lib = doc.lib, api = doc.P, pdfFont = await pdfFontFor(doc, face, font, allText), color = opts.color, hex = color.slice(0, 3).map((v) => v.toString(16).padStart(2, "0")).join(""), lineWidths = opts.lines.map((line) => line ? measureText(face, font, line, size) : 0), maxWidth = Math.max(0, ...lineWidths), skew = face.fakeItalic ? FAKE_ITALIC_SKEW : 0, boldStroke = face.fakeBold ? size * 0.035 * Math.hypot(a, b) : 0, markParams = { ...opts.extra || {}, id, font: def.key, size: String(size), color: hex, lh: String(lineHeight), st: styleCode(opts), al: opts.align || "left", bm: opts.matrix.map((v) => +v.toFixed(4)).join(",") };
  doc.withPage(pageIndex, (page) => {
    opts.lines.forEach((line, lineIndex) => {
      if (!line) return;
      const alignOffset = opts.align === "center" ? (maxWidth - lineWidths[lineIndex]) / 2 : opts.align === "right" ? maxWidth - lineWidths[lineIndex] : 0, originX = e - c * lineStep * lineIndex + a * alignOffset, originY = f - d * lineStep * lineIndex + b * alignOffset, asOutlines = !face.std && (needsShaping(line) || !!face.wght);
      if (asOutlines) {
        const scale = size / font.upem;
        for (const glyph of shapeText(font, line).glyphs) {
          const path = glyphPathObject(lib, font.hbFont!, glyph.gid, (gx, gy) => {
            let x = (glyph.x + gx) * scale;
            const y = (glyph.y + gy) * scale;
            x += skew * y;
            return [a * x + c * y + originX, b * x + d * y + originY];
          });
          if (path) {
            api.FPDFPageObj_SetFillColor(path, color[0], color[1], color[2], color[3]);
            if (boldStroke) {
              api.FPDFPageObj_SetStrokeColor(path, color[0], color[1], color[2], color[3]);
              api.FPDFPageObj_SetStrokeWidth(path, boldStroke);
              api.FPDFPageObj_SetLineJoin(path, 1);
            }
            api.FPDFPath_SetDrawMode(path, 1, !!boldStroke);
            addMark(doc, path, "MarginGlyph", { id });
            api.FPDFPage_InsertObject(page, path);
          }
        }
      }
      const textObj = api.FPDFPageObj_CreateTextObj(doc.h, pdfFont, size), wide = lib.wstr(line);
      api.FPDFText_SetText(textObj, wide);
      lib.free(wide);
      api.FPDFPageObj_SetFillColor(textObj, color[0], color[1], color[2], color[3]);
      if (asOutlines) api.FPDFTextObj_SetTextRenderMode(textObj, 3);
      else if (boldStroke) {
        api.FPDFTextObj_SetTextRenderMode(textObj, 2);
        api.FPDFPageObj_SetStrokeColor(textObj, color[0], color[1], color[2], color[3]);
        api.FPDFPageObj_SetStrokeWidth(textObj, boldStroke);
      }
      const matrixPtr = lib.floats([a, b, c + skew * a, d + skew * b, originX, originY]);
      api.FPDFPageObj_SetMatrix(textObj, matrixPtr);
      lib.free(matrixPtr);
      addMark(doc, textObj, "MarginText", { ...markParams, ln: String((opts.ln0 || 0) + lineIndex) });
      api.FPDFPage_InsertObject(page, textObj);
      for (const [enabled, offset] of [[opts.underline, -0.13], [opts.strike, 0.27]] as [boolean | undefined, number][]) {
        if (!enabled) continue;
        const thickness = size * 0.055, y = offset * size, x0 = 0, x1 = lineWidths[lineIndex], toPage = (x: number, yy: number) => [a * x + c * yy + originX, b * x + d * yy + originY], [p0x, p0y] = toPage(x0, y - thickness / 2), [p1x, p1y] = toPage(x1, y - thickness / 2), [p2x, p2y] = toPage(x1, y + thickness / 2), [p3x, p3y] = toPage(x0, y + thickness / 2), bar = api.FPDFPageObj_CreateNewPath(p0x, p0y);
        api.FPDFPath_LineTo(bar, p1x, p1y);
        api.FPDFPath_LineTo(bar, p2x, p2y);
        api.FPDFPath_LineTo(bar, p3x, p3y);
        api.FPDFPath_Close(bar);
        api.FPDFPageObj_SetFillColor(bar, color[0], color[1], color[2], color[3]);
        api.FPDFPath_SetDrawMode(bar, 1, false);
        addMark(doc, bar, "MarginGlyph", { id });
        api.FPDFPage_InsertObject(page, bar);
      }
    });
    api.FPDFPage_GenerateContent(page);
  });
  return { fontKey: def.key, fellBack };
}
/** Add a content mark with string parameters to a page object. */
function addMark(doc: PdfDoc, obj: Handle, name: string, params: Record<string, string>): void {
  const mark = doc.P.FPDFPageObj_AddMark(obj, name);
  for (const [key, value] of Object.entries(params)) doc.P.FPDFPageObjMark_SetStringParam(doc.h, obj, mark, key, value);
}
/**
 * Feed a glyph outline (font units) to `sink`, mapping points through `transform`. Quadratic segments are
 * converted to cubics. Returns false when the glyph has no outline data.
 */
function drawGlyph(hbFont: HbFont, gid: number, transform: PointTransform, sink: PathSink): boolean {
  const svgPath = hbFont.glyphToPath(gid);
  const point = (x: number, y: number) => transform(x, y) as [number, number];
  if (!svgPath) return false;
  const tokens: string[] = svgPath.match(/[MLQCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
  let pos = 0, curX = 0, curY = 0;
  const num = () => +tokens[pos++];
  for (; pos < tokens.length; ) {
    const cmd = tokens[pos++];
    if (cmd === "M") {
      curX = num();
      curY = num();
      sink.move(...point(curX, curY));
    } else if (cmd === "L") {
      curX = num();
      curY = num();
      sink.line(...point(curX, curY));
    } else if (cmd === "Q") {
      const qx = num(), qy = num(), x = num(), y = num();
      sink.curve(...point(curX + 2 / 3 * (qx - curX), curY + 2 / 3 * (qy - curY)), ...point(x + 2 / 3 * (qx - x), y + 2 / 3 * (qy - y)), ...point(x, y));
      curX = x;
      curY = y;
    } else if (cmd === "C") {
      const v = [num(), num(), num(), num(), num(), num()];
      sink.curve(...point(v[0], v[1]), ...point(v[2], v[3]), ...point(v[4], v[5]));
      curX = v[4];
      curY = v[5];
    } else if (cmd === "Z") sink.close();
  }
  return true;
}
/** Build a PDFium path object from a glyph outline; returns 0 for an empty glyph. Not inserted into a page. */
function glyphPathObject(lib: PdfLib, hbFont: HbFont, gid: number, transform: PointTransform): Handle {
  const api = lib.P;
  let path: Handle = 0;
  drawGlyph(hbFont, gid, transform, {
    move: (x, y) => {
      if (path) api.FPDFPath_MoveTo(path, x, y);
      else path = api.FPDFPageObj_CreateNewPath(x, y);
    },
    line: (x, y) => api.FPDFPath_LineTo(path, x, y),
    curve: (x1, y1, x2, y2, x3, y3) => api.FPDFPath_BezierTo(path, x1, y1, x2, y2, x3, y3),
    close: () => {
      if (path) api.FPDFPath_Close(path);
    }
  });
  return path;
}
/** Remove every object of the text block / drawing with this Margin id from a page. */
function removeById(doc: PdfDoc, pageIndex: number, id: string): void {
  const api = doc.P;
  doc.withPage(pageIndex, (page) => {
    for (let i = api.FPDFPage_CountObjects(page) - 1; i >= 0; i--) {
      const obj = api.FPDFPage_GetObject(page, i), mark = readTextMark(doc.lib, obj, "MarginGlyph") || readTextMark(doc.lib, obj, "MarginText");
      if (mark && mark.id === id) {
        api.FPDFPage_RemoveObject(page, obj);
        api.FPDFPageObj_Destroy(obj);
      }
    }
    api.FPDFPage_GenerateContent(page);
  });
}
/** Remove the page objects at these indexes. */
function removeObjects(doc: PdfDoc, pageIndex: number, indexes: number[]): void {
  const api = doc.P;
  doc.withPage(pageIndex, (page) => {
    const objs = indexes.map((i) => api.FPDFPage_GetObject(page, i)).filter(Boolean);
    for (const obj of objs) {
      if (api.FPDFPage_RemoveObject(page, obj)) api.FPDFPageObj_Destroy(obj);
    }
    api.FPDFPage_GenerateContent(page);
  });
}
/**
 * Replace the text of an existing (non-Margin) text object in its own font. Reads the result back and restores
 * the old text, returning false, when the font cannot represent the new text (missing glyphs).
 */
function replaceObjectText(doc: PdfDoc, pageIndex: number, objIndex: number, text: string): boolean {
  const api = doc.P, lib = doc.lib;
  return doc.withPage(pageIndex, (page, textPage) => {
    const obj = api.FPDFPage_GetObject(page, objIndex), oldText = lib.readW((buf, len) => api.FPDFTextObj_GetText(obj, textPage, buf, len)), wide = lib.wstr(text);
    api.FPDFText_SetText(obj, wide);
    lib.free(wide);
    const freshTextPage = api.FPDFText_LoadPage(page), readBack = lib.readW((buf, len) => api.FPDFTextObj_GetText(obj, freshTextPage, buf, len));
    api.FPDFText_ClosePage(freshTextPage);
    if (readBack.replace(/\s+/g, " ").trim() !== text.replace(/\s+/g, " ").trim()) {
      const oldWide = lib.wstr(oldText);
      api.FPDFText_SetText(obj, oldWide);
      lib.free(oldWide);
      return false;
    }
    api.FPDFPage_GenerateContent(page);
    return true;
  }, { text: true });
}
/**
 * Draw a text form field's normal appearance with `value` as glyph outlines (so Thai renders in any viewer),
 * honouring the field's background, border, font size and multiline flag. Auto-sizes single-line fields.
 */
async function drawFieldAppearance(doc: PdfDoc, pageIndex: number, annotIndex: number, value: string, fontKey = "sarabun"): Promise<void> {
  // outlines need a bundled (HarfBuzz) font: standard fonts and non-Thai fonts for Thai text are mapped by outlineFont
  const look = doc.fieldLook(pageIndex, annotIndex), rect = look.rect, width = rect.r - rect.l, height = rect.t - rect.b, borderWidth = look.borderWidth || 0, font = await loadFont(await outlineFontFor(fontKey, value)), pad = 2 + borderWidth, lines = look.multiline ? value.replace(/\r/g, "").split(`
`) : [value.replace(/[\r\n]+/g, " ")];
  let size = look.size || (look.multiline ? 11 : Math.max(6, Math.min(14, height * 0.62)));
  if (!look.multiline && !look.size) {
    const textWidth = shapeText(font, lines[0]).width * size;
    if (textWidth > width - pad * 2) size = Math.max(5, size * (width - pad * 2) / textWidth);
  }
  const fmt = (v: number) => (Math.round(v * 1e3) / 1e3).toString(), ops = ["q"];
  if (look.background) ops.push(`${look.background.map((v) => fmt(v / 255)).join(" ")} rg ${fmt(rect.l)} ${fmt(rect.b)} ${fmt(width)} ${fmt(height)} re f`);
  if (look.border && borderWidth > 0) ops.push(`${look.border.map((v) => fmt(v / 255)).join(" ")} RG ${fmt(borderWidth)} w ${fmt(rect.l + borderWidth / 2)} ${fmt(rect.b + borderWidth / 2)} ${fmt(width - borderWidth)} ${fmt(height - borderWidth)} re S`);
  ops.push(`${fmt(rect.l + borderWidth)} ${fmt(rect.b + borderWidth)} ${fmt(width - 2 * borderWidth)} ${fmt(height - 2 * borderWidth)} re W n 0 0 0 rg`);
  const scale = size / font.upem, lineStep = size * 1.2;
  let baseline = look.multiline ? rect.t - pad - font.ascent * size : rect.b + (height - size) / 2 + size * 0.24;
  for (const line of lines) {
    const { glyphs } = shapeText(font, line);
    for (const glyph of glyphs) {
      if (drawGlyph(font.hbFont!, glyph.gid, (x, y) => [rect.l + pad + (glyph.x + x) * scale, baseline + (glyph.y + y) * scale], { move: (x, y) => ops.push(`${fmt(x)} ${fmt(y)} m`), line: (x, y) => ops.push(`${fmt(x)} ${fmt(y)} l`), curve: (x1, y1, x2, y2, x3, y3) => ops.push(`${fmt(x1)} ${fmt(y1)} ${fmt(x2)} ${fmt(y2)} ${fmt(x3)} ${fmt(y3)} c`), close: () => ops.push("h") })) ops.push("f");
    }
    baseline -= lineStep;
  }
  ops.push("Q");
  if (!doc.setNormalAppearance(pageIndex, annotIndex, ops.join(`
`))) throw new Error("Could not draw the field");
}
/**
 * Guess the closest Margin font for an existing PDF font name (subset prefix stripped), so edited text keeps a
 * similar look. Thai text only maps to Thai-capable fonts.
 */
function guessFontKey(pdfFontName: string, sample: string): string {
  const name = pdfFontName.toLowerCase().replace(/^[a-z]{6}\+/, "");
  if (hasThai(sample)) {
    for (const font of FONTS) if (font.group === "Thai + Latin" && name.replace(/[^a-z]/g, "").includes(font.label.toLowerCase().replace(/[^a-z]/g, ""))) return font.key;
    return "sarabun";
  }
  for (const font of FONTS) if (!font.std && name.replace(/[^a-z]/g, "").includes(font.label.toLowerCase().replace(/[^a-z]/g, ""))) return font.key;
  return /times|serif|georgia|garamond|roman/.test(name) ? "times" : /courier|mono|consol/.test(name) ? "courier" : "helv";
}
/** Width of `text` at `size` pt in the regular face of a font (Sarabun if a standard font cannot encode it). */
async function measureWithFont(fontKey: string, text: string, size: number): Promise<number> {
  let def = fontByKey(fontKey);
  if (def.std && !isWinAnsi(text)) def = fontByKey("sarabun");
  const face = resolveFace(def, {});
  return measureText(face, await loadFace(face), text, size);
}
/** Insert an RGBA bitmap as an image object with `matrix`, marked as part of Margin drawing `id`. */
function insertMarkedImage(doc: PdfDoc, pageIndex: number, rgba: ArrayLike<number>, w: number, h: number, matrix: Matrix | number[], id: string): void {
  const api = doc.P, lib = doc.lib, wasm = lib.M;
  doc.withPage(pageIndex, (page) => {
    const bitmap = api.FPDFBitmap_Create(w, h, 1), buffer = api.FPDFBitmap_GetBuffer(bitmap), stride = api.FPDFBitmap_GetStride(bitmap);
    // RGBA → PDFium's BGRA
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const src = (y * w + x) * 4, dst = buffer + y * stride + x * 4;
      wasm.HEAPU8[dst] = rgba[src + 2];
      wasm.HEAPU8[dst + 1] = rgba[src + 1];
      wasm.HEAPU8[dst + 2] = rgba[src];
      wasm.HEAPU8[dst + 3] = rgba[src + 3];
    }
    const image = api.FPDFPageObj_NewImageObj(doc.h);
    api.FPDFImageObj_SetBitmap(0, 0, image, bitmap);
    api.FPDFBitmap_Destroy(bitmap);
    const matrixPtr = lib.floats(matrix);
    api.FPDFPageObj_SetMatrix(image, matrixPtr);
    lib.free(matrixPtr);
    addMark(doc, image, "MarginGlyph", { id });
    api.FPDFPage_InsertObject(page, image);
    api.FPDFPage_GenerateContent(page);
  });
}
/**
 * The bundled font to draw outlines with: standard fonts map to a similar TTF (they have no outlines here),
 * and Thai text needs a Thai-capable family.
 */
function outlineFont(fontKey: string, text: string): FontDef {
  let def = fontByKey(fontKey);
  if (def.std) def = fontByKey(({ helv: "roboto", times: "notoserifthai", courier: "robotomono" } as Record<string, string>)[def.key] || "sarabun");
  if (hasThai(text) && def.group !== "Thai + Latin") def = fontByKey("sarabun");
  return def;
}
/** Thai-aware word and grapheme segmenters (null where Intl.Segmenter is unavailable). */
const WORD_SEGMENTER = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "word" }) : null;
const GRAPHEME_SEGMENTER = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "grapheme" }) : null;
/** Split text with a segmenter, or after each whitespace character when there is none. */
const segmentText = (text: string, segmenter: Intl.Segmenter | null): string[] => segmenter ? [...segmenter.segment(text)].map((s) => s.segment) : text.split(/(?<=\s)/);
/**
 * Word-wrap text to `maxWidth` pt at `size` pt. Hard line breaks are kept; a word wider than the line is
 * broken between graphemes.
 */
function wrapLines(font: LoadedFont, text: string, size: number, maxWidth: number): string[] {
  const widthOf = (s: string) => shapeText(font, s).width * size, out: string[] = [];
  for (const para of text.replace(/\r/g, "").split(`
`)) {
    let line = "";
    for (const word of segmentText(para, WORD_SEGMENTER)) {
      if (!line || widthOf(line + word) <= maxWidth) {
        line += word;
        if (widthOf(line) <= maxWidth || /^\s+$/.test(word)) continue;
      } else {
        out.push(line.trimEnd());
        line = word.trimStart();
        if (widthOf(line) <= maxWidth) continue;
      }
      // the line is too long on its own: break it between graphemes
      const graphemes = segmentText(line, GRAPHEME_SEGMENTER);
      line = "";
      for (const g of graphemes) {
        if (line && widthOf(line + g) > maxWidth) {
          out.push(line);
          line = g;
        } else line += g;
      }
    }
    out.push(line.trimEnd());
  }
  return out;
}
/** Inner padding of a text box (pt), inside the border. */
const TEXTBOX_PADDING = 4;
/** Height a text box needs to show all of its wrapped text. */
async function freeTextHeight(data: FreeTextData): Promise<number> {
  const font = await loadFont(await outlineFontFor(data.style.fontKey, data.text)), border = ftBorderWidth(data.style);
  return wrapLines(font, data.text || " ", data.style.size, data.box.r - data.box.l - 2 * (TEXTBOX_PADDING + border)).length * data.style.size * 1.3 + 2 * (TEXTBOX_PADDING + border);
}
/**
 * Render a Margin text box / callout into its annotation appearance stream: optional callout line with an
 * arrowhead, fill, border, and the wrapped text as glyph outlines. Then stores it via doc.writeFreeText.
 */
async function renderFreeText(doc: PdfDoc, pageIndex: number, annotIndex: number, data: FreeTextData): Promise<void> {
  const font = await loadFont(await outlineFontFor(data.style.fontKey, data.text)), { box, style } = data, border = ftBorderWidth(style), fmt = (v: number) => (Math.round(v * 1e3) / 1e3).toString(), rgbOps = (c: number[]) => c.slice(0, 3).map((v) => fmt(v / 255)).join(" "), width = box.r - box.l, height = box.t - box.b, ops = ["q"];
  let bounds: Rect = { ...box };
  const tip = data.tip;
  if (tip && style.border) {
    const anchor = calloutAnchor(box, tip);
    if (Math.hypot(anchor.x - tip.x, anchor.y - tip.y) > 2) {
      const lineWidth = Math.max(1, border), headLength = Math.max(7, lineWidth * 4.5), headAngle = 28 * Math.PI / 180, dx = tip.x - anchor.x, dy = tip.y - anchor.y, length = Math.hypot(dx, dy), ux = dx / length, uy = dy / length, headPoint = (side: number) => ({ x: tip.x - headLength * (ux * Math.cos(headAngle) - uy * Math.sin(headAngle) * side), y: tip.y - headLength * (uy * Math.cos(headAngle) + ux * Math.sin(headAngle) * side) }), head1 = headPoint(1), head2 = headPoint(-1);
      ops.push(`${rgbOps(style.border)} RG ${fmt(lineWidth)} w 1 J 1 j ${fmt(anchor.x)} ${fmt(anchor.y)} m ${fmt(tip.x)} ${fmt(tip.y)} l S ${fmt(head1.x)} ${fmt(head1.y)} m ${fmt(tip.x)} ${fmt(tip.y)} l ${fmt(head2.x)} ${fmt(head2.y)} l S`);
      const xs = [box.l, box.r, tip.x, head1.x, head2.x], ys = [box.b, box.t, tip.y, head1.y, head2.y];
      bounds = { l: Math.min(...xs) - lineWidth, r: Math.max(...xs) + lineWidth, b: Math.min(...ys) - lineWidth, t: Math.max(...ys) + lineWidth };
    }
  }
  if (style.fill) ops.push(`${rgbOps(style.fill)} rg ${fmt(box.l)} ${fmt(box.b)} ${fmt(width)} ${fmt(height)} re f`);
  if (style.border && border > 0) ops.push(`${rgbOps(style.border)} RG ${fmt(border)} w 0 J 0 j ${fmt(box.l + border / 2)} ${fmt(box.b + border / 2)} ${fmt(width - border)} ${fmt(height - border)} re S`);
  ops.push(`${fmt(box.l + border)} ${fmt(box.b + border)} ${fmt(width - 2 * border)} ${fmt(height - 2 * border)} re W n ${rgbOps(style.color)} rg`);
  const size = style.size, scale = size / font.upem, lineStep = size * 1.3;
  let baseline = box.t - border - TEXTBOX_PADDING - font.ascent * size - (lineStep - size) / 2;
  for (const line of wrapLines(font, data.text, size, width - 2 * (TEXTBOX_PADDING + border))) {
    const { glyphs } = shapeText(font, line);
    for (const glyph of glyphs) {
      if (drawGlyph(font.hbFont!, glyph.gid, (x, y) => [box.l + border + TEXTBOX_PADDING + (glyph.x + x) * scale, baseline + (glyph.y + y) * scale], { move: (x, y) => ops.push(`${fmt(x)} ${fmt(y)} m`), line: (x, y) => ops.push(`${fmt(x)} ${fmt(y)} l`), curve: (x1, y1, x2, y2, x3, y3) => ops.push(`${fmt(x1)} ${fmt(y1)} ${fmt(x2)} ${fmt(y2)} ${fmt(x3)} ${fmt(y3)} c`), close: () => ops.push("h") })) ops.push("f");
    }
    baseline -= lineStep;
  }
  ops.push("Q");
  doc.writeFreeText(pageIndex, annotIndex, data, bounds, ops.join(`
`));
}
/**
 * Build a rubber-stamp appearance centred on `center`: a double rounded border around a bold label and an
 * optional smaller second line, all as outlines in Sarabun.
 */
async function stampAppearance(stamp: { label: string; sub?: string; color: RGBA | number[] }, center: Pt): Promise<{ rect: Rect; content: string }> {
  const boldFont = await loadFace(resolveFace(fontByKey(await coveringFontKey("sarabun", stamp.label)), { bold: true })), subFont = stamp.sub ? await loadFont(fontByKey(await coveringFontKey("sarabun", stamp.sub))) : null, labelSize = 22, subSize = 8.5, padX = 12, padY = 7, borderWidth = 2.2, labelShape = shapeText(boldFont, stamp.label), subShape = stamp.sub && subFont ? shapeText(subFont, stamp.sub) : null, width = Math.max(labelShape.width * labelSize, subShape ? subShape.width * subSize : 0) + padX * 2, height = labelSize * 1.05 + (subShape ? subSize * 1.5 : 0) + padY * 2, rect = { l: center.x - width / 2, r: center.x + width / 2, b: center.y - height / 2, t: center.y + height / 2 }, fmt = (v: number) => (Math.round(v * 1e3) / 1e3).toString(), colorOps = stamp.color.slice(0, 3).map((v) => fmt(v / 255)).join(" "), ops = ["q", `${colorOps} RG ${colorOps} rg`], roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
    const k = 0.5523 * r; // Bézier circle approximation
    ops.push(`${fmt(x + r)} ${fmt(y)} m ${fmt(x + w - r)} ${fmt(y)} l ${fmt(x + w - r + k)} ${fmt(y)} ${fmt(x + w)} ${fmt(y + r - k)} ${fmt(x + w)} ${fmt(y + r)} c ${fmt(x + w)} ${fmt(y + h - r)} l ${fmt(x + w)} ${fmt(y + h - r + k)} ${fmt(x + w - r + k)} ${fmt(y + h)} ${fmt(x + w - r)} ${fmt(y + h)} c ${fmt(x + r)} ${fmt(y + h)} l ${fmt(x + r - k)} ${fmt(y + h)} ${fmt(x)} ${fmt(y + h - r + k)} ${fmt(x)} ${fmt(y + h - r)} c ${fmt(x)} ${fmt(y + r)} l ${fmt(x)} ${fmt(y + r - k)} ${fmt(x + r - k)} ${fmt(y)} ${fmt(x + r)} ${fmt(y)} c h S`);
  };
  ops.push(`${fmt(borderWidth)} w`);
  roundedRect(rect.l + borderWidth / 2, rect.b + borderWidth / 2, width - borderWidth, height - borderWidth, 6);
  ops.push(`${fmt(borderWidth * 0.45)} w`);
  roundedRect(rect.l + borderWidth * 2.2, rect.b + borderWidth * 2.2, width - borderWidth * 4.4, height - borderWidth * 4.4, 4);
  /** Draw one shaped line centred horizontally on the stamp. */
  const drawLine = (font: LoadedFont, shaped: { glyphs: ShapedGlyph[]; width: number }, size: number, baseline: number) => {
    const scale = size / font.upem, startX = center.x - shaped.width * size / 2;
    for (const glyph of shaped.glyphs) {
      if (drawGlyph(font.hbFont!, glyph.gid, (x, y) => [startX + (glyph.x + x) * scale, baseline + (glyph.y + y) * scale], { move: (x, y) => ops.push(`${fmt(x)} ${fmt(y)} m`), line: (x, y) => ops.push(`${fmt(x)} ${fmt(y)} l`), curve: (x1, y1, x2, y2, x3, y3) => ops.push(`${fmt(x1)} ${fmt(y1)} ${fmt(x2)} ${fmt(y2)} ${fmt(x3)} ${fmt(y3)} c`), close: () => ops.push("h") })) ops.push("f");
    }
  }, top = rect.t - padY;
  drawLine(boldFont, labelShape, labelSize, top - labelSize * 0.82);
  if (subShape && subFont) drawLine(subFont, subShape, subSize, top - labelSize * 1.05 - subSize * 1.05);
  ops.push("Q");
  return { rect, content: ops.join(`
`) };
}
/**
 * Build a single path object with `text` as glyph outlines, centred on (0, 0) (vertically around the
 * x-height) and mapped through `transform`. Throws when there is nothing to draw. Not inserted into a page.
 */
async function textPathObject(doc: PdfDoc, text: string, fontKey: string, size: number, transform: PointTransform): Promise<Handle> {
  const font = await loadFont(await outlineFontFor(fontKey, text)), shaped = shapeText(font, text), scale = size / font.upem, x0 = -(shaped.width * size) / 2, y0 = -size * 0.35, api = doc.P;
  let path: Handle = 0;
  for (const glyph of shaped.glyphs) drawGlyph(font.hbFont!, glyph.gid, (x, y) => transform(x0 + (glyph.x + x) * scale, y0 + (glyph.y + y) * scale), {
    move: (x, y) => {
      if (path) api.FPDFPath_MoveTo(path, x, y);
      else path = api.FPDFPageObj_CreateNewPath(x, y);
    },
    line: (x, y) => api.FPDFPath_LineTo(path, x, y),
    curve: (x1, y1, x2, y2, x3, y3) => api.FPDFPath_BezierTo(path, x1, y1, x2, y2, x3, y3),
    close: () => {
      if (path) api.FPDFPath_Close(path);
    }
  });
  if (!path) throw new Error("Nothing to draw");
  api.FPDFPath_SetDrawMode(path, 1, false);
  return path;
}
/** Mark a page object as part of Margin drawing `id` and insert it at `index` (or on top when index < 0). */
function insertMarkedObject(doc: PdfDoc, pageIndex: number, obj: Handle, id: string, index: number): void {
  const api = doc.P;
  doc.withPage(pageIndex, (page) => {
    addMark(doc, obj, "MarginGlyph", { id });
    if (index < 0) api.FPDFPage_InsertObject(page, obj);
    else api.FPDFPage_InsertObjectAtIndex(page, obj, index);
    api.FPDFPage_GenerateContent(page);
  });
}
/** Create (but do not insert) an image object from RGBA pixels with `matrix`. */
function createImageObject(doc: PdfDoc, rgba: ArrayLike<number>, w: number, h: number, matrix: Matrix | number[]): Handle {
  const api = doc.P, wasm = doc.lib.M, bitmap = api.FPDFBitmap_Create(w, h, 1), buffer = api.FPDFBitmap_GetBuffer(bitmap), stride = api.FPDFBitmap_GetStride(bitmap);
  // RGBA → PDFium's BGRA
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const src = (y * w + x) * 4, dst = buffer + y * stride + x * 4;
    wasm.HEAPU8[dst] = rgba[src + 2];
    wasm.HEAPU8[dst + 1] = rgba[src + 1];
    wasm.HEAPU8[dst + 2] = rgba[src];
    wasm.HEAPU8[dst + 3] = rgba[src + 3];
  }
  const image = api.FPDFPageObj_NewImageObj(doc.h);
  api.FPDFImageObj_SetBitmap(0, 0, image, bitmap);
  api.FPDFBitmap_Destroy(bitmap);
  const matrixPtr = doc.lib.floats(matrix);
  api.FPDFPageObj_SetMatrix(image, matrixPtr);
  doc.lib.free(matrixPtr);
  return image;
}

export { FONT_GROUPS, splitByCoverage, coveringFontKey, outlineFontFor, onBigFontLoading, loadFont, isWinAnsi, measureText, stampAppearance, fontCss, removeObjects, parseStyleCode, styleCode, writeText, initShaper, loadFace, needsShaping, outlineFont, insertMarkedImage, removeById, renderFreeText, insertMarkedObject, drawFieldAppearance, resolveFace, measureWithFont, guessFontKey, FONTS, freeTextHeight, replaceObjectText, createImageObject, textPathObject, fontByKey };
