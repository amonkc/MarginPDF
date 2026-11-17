import { isWinAnsi, measureText, writeText, loadFace, resolveFace, fontByKey } from './text';

/**
 * A styled run of text. Flags: b bold, i italic, u underline, s strike-through; c colour as "rrggbb",
 * f font key, z size in pt. Absent fields inherit from the block.
 */
export type Run = { t: string; b?: boolean; i?: boolean; u?: boolean; s?: boolean; c?: string; f?: string; z?: number };
/** List type of a paragraph: "b" bulleted, "n" numbered, null none. */
export type ListKind = "b" | "n" | null;
/**
 * A rich-text block as stored (URI-encoded JSON) in the `rt` parameter of the first MarginText mark:
 * paragraphs of runs plus block defaults and the baseline matrix `bm` of the first line.
 */
export type RichText = {
  v: 1;
  paras: Run[][];
  font: string;
  size: number;
  /** default colour "rrggbb" */
  color: string;
  align: string;
  /** line height factor */
  lh: number;
  bm: number[];
  lists?: ListKind[];
  /** wrap width in pt (no wrapping when absent or ≤ 0) */
  width?: number;
  [k: string]: unknown;
};
/** A piece of a laid-out line: text in one run at x offset (pt) from the line start. */
export type LayoutSeg = { text: string; run: Run; x: number; w: number };
/** A laid-out line: `y` is the baseline offset (pt, downwards) from the first line, `size` its largest font size. */
export type LayoutLine = { segs: LayoutSeg[]; width: number; para: number; lastOfPara: boolean; y: number; size: number };

/** Indent of list paragraphs, in ems of the block size. */
const LIST_INDENT_EMS = 1.6;
/** RGBA → "rrggbb". */
const colorHex = (rgba: number[]): string => rgba.slice(0, 3).map((v) => v.toString(16).padStart(2, "0")).join("");
/** "rrggbb" (padded / truncated to 6 digits; empty = black) → opaque RGBA. */
const hexToRgba = (hex: string | undefined): [number, number, number, number] => {
  const n = parseInt((hex || "000000").padEnd(6, "0").slice(0, 6), 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255, 255];
};
/** True when two runs have the same style (text ignored). */
const sameRunStyle = (a: Run, b: Run): boolean => !!a.b == !!b.b && !!a.i == !!b.i && !!a.u == !!b.u && !!a.s == !!b.s && (a.c || "") === (b.c || "") && (a.f || "") === (b.f || "") && (a.z || 0) === (b.z || 0);
const GRAPHEME_SEGMENTER = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "grapheme" }) : null;
const WORD_SEGMENTER = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "word" }) : null;
/** The block's text, paragraphs joined with newlines. */
const plainText = (rt: { paras: Run[][] }): string => rt.paras.map((para) => para.map((run) => run.t).join("")).join(`
`);
const encodeRichText = (rt: RichText): string => encodeURIComponent(JSON.stringify(rt));
/** Parse a stored `rt` mark value; null when it is not a version-1 rich-text block. */
function decodeRichText(encoded: string): RichText | null {
  try {
    const rt = JSON.parse(decodeURIComponent(encoded));
    return rt?.v === 1 && Array.isArray(rt.paras) ? rt : null;
  } catch {
    return null;
  }
}
/**
 * Normalise a paragraph's runs: style boundaries are moved to grapheme boundaries (a grapheme takes the style
 * of its first character) and adjacent runs with the same style are merged. Never returns an empty array.
 */
function normalizeRuns(runs: Run[]): Run[] {
  const text = runs.map((run) => run.t).join("");
  if (!text) return [{ t: "" }];
  const runAt: Run[] = [];
  for (const run of runs) for (let i = 0; i < run.t.length; i++) runAt.push(run);
  const out: Run[] = [], segments = GRAPHEME_SEGMENTER ? [...GRAPHEME_SEGMENTER.segment(text)] : [...text].map((ch, index) => ({ segment: ch, index }));
  for (const seg of segments) {
    const style = runAt[seg.index], last = out[out.length - 1];
    if (last && sameRunStyle(last, style)) last.t += seg.segment;
    else {
      const run: Run = { t: seg.segment };
      if (style.b) run.b = true;
      if (style.i) run.i = true;
      if (style.u) run.u = true;
      if (style.s) run.s = true;
      if (style.c) run.c = style.c;
      if (style.f) run.f = style.f;
      if (style.z) run.z = style.z;
      out.push(run);
    }
  }
  return out;
}
/** Build a rich-text block from plain lines and the style recorded in a (pre-rich-text) MarginText mark. */
function richFromPlain(lines: string[], mark: { st: string; font: string; size: number; color: string; align: string; lh: number; bm: any }): RichText {
  const b = mark.st.includes("b"), i = mark.st.includes("i"), u = mark.st.includes("u"), s = mark.st.includes("s");
  return { v: 1, paras: lines.map((line) => [{ t: line, ...b ? { b } : {}, ...i ? { i } : {}, ...u ? { u } : {}, ...s ? { s } : {} }]), font: mark.font, size: mark.size, color: mark.color, align: mark.align, lh: mark.lh, bm: mark.bm };
}
/** The block's default font, or Sarabun when it is a standard font that cannot encode the block's text. */
function blockFont(rt: RichText) {
  const def = fontByKey(rt.font);
  return def.std && !isWinAnsi(plainText(rt).replace(/\n/g, "")) ? fontByKey("sarabun") : def;
}
/** The font a run is drawn with (its own font, else the block's; Sarabun when a standard font cannot encode it). */
function runFont(rt: RichText, run: Run) {
  if (!run.f) return blockFont(rt);
  const def = fontByKey(run.f);
  return def.std && !isWinAnsi(run.t) ? fontByKey("sarabun") : def;
}
const runSize = (rt: RichText, run: Run): number => run.z || rt.size;

type MeasuredPart = { run: Run; text: string; w: number };
type MeasuredWord = { parts: MeasuredPart[]; w: number; space: boolean };

/**
 * Lay out a rich-text block: shape and measure every word, break words wider than the line between graphemes,
 * wrap to `rt.width`, align (left / center / right / justify) and add list markers.
 */
async function layoutRich(rt: RichText): Promise<LayoutLine[]> {
  const faces = /* @__PURE__ */ new Map(), faceFor = async (run: Run, text: string) => {
    const def = runFont(rt, { ...run, t: text }), key = def.key + (run.b ? "b" : "") + (run.i ? "i" : "");
    let entry = faces.get(key);
    if (!entry) {
      const face = resolveFace(def, { bold: run.b, italic: run.i });
      entry = { face, l: await loadFace(face) };
      faces.set(key, entry);
    }
    return entry;
  }, measure = async (run: Run, text: string): Promise<number> => {
    if (!text) return 0;
    const entry = await faceFor(run, run.t || text);
    return measureText(entry.face, entry.l, text, runSize(rt, run));
  };
  let y = 0, firstLine = true;
  const maxWidth = rt.width && rt.width > 0 ? rt.width : 1 / 0, out: LayoutLine[] = [];
  let listCounter = 0;
  for (const [paraIndex, para] of rt.paras.entries()) {
    const list = rt.lists?.[paraIndex] || null;
    listCounter = list === "n" ? listCounter + 1 : 0;
    const indent = list ? rt.size * LIST_INDENT_EMS : 0, avail = maxWidth - indent, runs = para.length ? para : [{ t: "" }], text = runs.map((run) => run.t).join(""), runStarts: number[] = [];
    let offset = 0;
    for (const run of runs) {
      runStarts.push(offset);
      offset += run.t.length;
    }
    const runIndexAt = (pos: number) => {
      let i = 0;
      for (; i + 1 < runStarts.length && runStarts[i + 1] <= pos; ) i++;
      return i;
    }, wordSegs = WORD_SEGMENTER ? [...WORD_SEGMENTER.segment(text)] : text.split(/(\s+)/).filter(Boolean).reduce((acc: { segment: string; index: number }[], seg) => (acc.push({ segment: seg, index: acc.length ? acc[acc.length - 1].index + acc[acc.length - 1].segment.length : 0 }), acc), []), words: MeasuredWord[] = [];
    // measure each word, split at run boundaries
    for (const seg of wordSegs) {
      const parts: MeasuredPart[] = [];
      let pos = seg.index;
      const end = seg.index + seg.segment.length;
      for (; pos < end; ) {
        const runIndex = runIndexAt(pos), partEnd = Math.min(end, runIndex + 1 < runStarts.length ? runStarts[runIndex + 1] : end), partText = text.slice(pos, partEnd);
        parts.push({ run: runs[runIndex], text: partText, w: await measure(runs[runIndex], partText) });
        pos = partEnd;
      }
      words.push({ parts, w: parts.reduce((sum, part) => sum + part.w, 0), space: /^\s+$/.test(seg.segment) });
    }
    // break words that are wider than a line between graphemes
    const pieces: MeasuredWord[] = [];
    for (const word of words) {
      if (word.w <= avail || word.space) {
        pieces.push(word);
        continue;
      }
      let current: MeasuredPart[] = [], currentWidth = 0;
      for (const part of word.parts) {
        const graphemes = GRAPHEME_SEGMENTER ? [...GRAPHEME_SEGMENTER.segment(part.text)].map((s) => s.segment) : [...part.text];
        for (const g of graphemes) {
          const gw = await measure(part.run, g);
          if (current.length && currentWidth + gw > avail) {
            pieces.push({ parts: current, w: currentWidth, space: false });
            current = [];
            currentWidth = 0;
          }
          const last = current[current.length - 1];
          if (last && last.run === part.run) {
            last.text += g;
            last.w += gw;
          } else current.push({ run: part.run, text: g, w: gw });
          currentWidth += gw;
        }
      }
      if (current.length) pieces.push({ parts: current, w: currentWidth, space: false });
    }
    // wrap; whitespace never starts a wrapped line
    const lines: MeasuredWord[][] = [[]];
    let lineWidth = 0;
    for (const piece of pieces) {
      const line = lines[lines.length - 1];
      if (line.length && !piece.space && lineWidth + piece.w > avail) {
        lines.push([piece]);
        lineWidth = piece.w;
        continue;
      }
      if (!(!line.length && piece.space && lines.length > 1)) {
        line.push(piece);
        lineWidth += piece.w;
      }
    }
    for (const [lineIndex, line] of lines.entries()) {
      for (; line.length && line[line.length - 1].space; ) line.pop();
      const width = line.reduce((sum, piece) => sum + piece.w, 0), isLast = lineIndex === lines.length - 1, slack = avail === 1 / 0 ? 0 : avail - width;
      let x = indent + (rt.align === "center" ? slack / 2 : rt.align === "right" ? slack : 0);
      const gaps = rt.align === "justify" && !isLast ? line.filter((piece) => piece.space).length : 0, gapExtra = gaps ? slack / gaps : 0, segs: LayoutSeg[] = [];
      for (const piece of line) {
        for (const part of piece.parts) {
          const last = segs[segs.length - 1];
          // justified lines keep every part separate so spaces can stretch
          if (last && last.run === part.run && !gaps) {
            last.text += part.text;
            last.w += part.w;
          } else segs.push({ text: part.text, run: part.run, x, w: part.w });
          x += part.w;
        }
        if (piece.space && gaps) x += gapExtra;
      }
      const visible = segs.filter((seg) => seg.text.trim() || seg.run.u || seg.run.s);
      if (list && lineIndex === 0) {
        // bullet / number in the first run's colour, weight, size and font, right-aligned in the indent
        const markerRun: Run = { t: "", ...runs[0].c ? { c: runs[0].c } : {}, ...runs[0].b ? { b: true } : {}, ...runs[0].z ? { z: runs[0].z } : {}, ...runs[0].f ? { f: runs[0].f } : {} }, marker = list === "b" ? "•" : `${listCounter}.`, markerWidth = await measure(markerRun, marker);
        visible.unshift({ text: marker, run: markerRun, x: Math.max(0, indent - rt.size * 0.45 - markerWidth), w: markerWidth });
      }
      const size = Math.max(...visible.length ? visible.map((seg) => runSize(rt, seg.run)) : runs.map((run) => runSize(rt, run)));
      if (!firstLine) y += rt.lh * size;
      firstLine = false;
      out.push({ segs: visible, width, para: paraIndex, lastOfPara: isLast, y, size });
    }
  }
  return out;
}
/**
 * Write a rich-text block into a page: one text-object line per laid-out segment, all sharing one id. The
 * block itself is stored (`rt`) on the first segment's mark so it can be edited again.
 * Returns the id and the number of lines written (0 when the block is empty).
 */
async function writeRichText(doc: any, pageIndex: number, rt: RichText, id?: string): Promise<{ id: string; lines: number }> {
  const lines = await layoutRich(rt), blockId = id || "b" + Math.random().toString(36).slice(2, 9), [a, b, c, d, e, f] = rt.bm;
  let first = true;
  for (const [lineIndex, line] of lines.entries()) for (const seg of line.segs) {
    const x = e - c * line.y + a * seg.x, y = f - d * line.y + b * seg.x;
    await writeText(doc, pageIndex, { lines: [seg.text], fontKey: runFont(rt, seg.run).key, size: runSize(rt, seg.run), color: hexToRgba(seg.run.c || rt.color), matrix: [a, b, c, d, x, y], bold: seg.run.b, italic: seg.run.i, underline: seg.run.u, strike: seg.run.s, id: blockId, lineHeight: rt.lh, align: "left", ln0: lineIndex, extra: first ? { rt: encodeRichText(rt) } : undefined });
    first = false;
  }
  return first ? { id: blockId, lines: 0 } : { id: blockId, lines: lines.length };
}
/**
 * Replace the characters [start, end) of the block's plain text (UTF-16 offsets, paragraphs separated by one
 * newline) with `text`. Inserted text takes the style of the character at `start` (or the one before it);
 * new paragraphs inherit the list type of the paragraph they split.
 */
function spliceRichText(rt: RichText, start: number, end: number, text: string): RichText {
  const chars: { ch: string; run: Run }[] = [];
  rt.paras.forEach((para, paraIndex) => {
    if (paraIndex) chars.push({ ch: `
`, run: {} as Run });
    for (const run of para) for (const ch of run.t) chars.push({ ch, run });
  });
  // one entry per UTF-16 code unit
  const units: { ch: string; run: Run }[] = [];
  for (const c of chars) for (const unit of c.ch.split("")) units.push({ ch: unit, run: c.run });
  const insertStyle = units[start]?.run && units[start].ch !== `
` ? units[start].run : units[Math.max(0, start - 1)]?.run || {}, inserted = text.split("").map((ch) => ({ ch, run: ch === `
` ? {} : insertStyle })), merged = [...units.slice(0, start), ...inserted, ...units.slice(end)], paras: Run[][] = [[]];
  for (const unit of merged) {
    if (unit.ch === `
`) {
      paras.push([]);
      continue;
    }
    const para = paras[paras.length - 1], last = para[para.length - 1];
    if (last && sameRunStyle(last, unit.run as Run)) last.t += unit.ch;
    else para.push({ ...unit.run, t: unit.ch });
  }
  const startPara = units.slice(0, start).filter((unit) => unit.ch === `
`).length, removedBreaks = units.slice(start, end).filter((unit) => unit.ch === `
`).length, addedBreaks = text.split(`
`).length - 1, lists = rt.lists ? [...rt.lists.slice(0, startPara + 1), ...Array(addedBreaks).fill(rt.lists[startPara] ?? null), ...rt.lists.slice(startPara + 1 + removedBreaks)] : undefined;
  return { ...rt, paras: paras.map(normalizeRuns), ...lists ? { lists } : {} };
}
const escapeHtml = (text: string): string => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/**
 * Render a block as HTML for the contenteditable editor. Only styles differing from the block defaults are
 * written; sizes become `data-z` spans (with `sizePx` giving the on-screen px) and fonts `data-f` spans.
 * The first plain paragraph is bare, later ones are `<div>`s; list paragraphs are grouped into `<ul>` / `<ol>`.
 */
function richToHtml(rt: RichText, sizePx: (pt: number) => number, fontCss: (fontKey: string) => string): string {
  const paras = rt.paras.map((para, index) => ({ inner: para.filter((run) => run.t).map((run) => {
    let html = escapeHtml(run.t);
    if (run.s) html = `<s>${html}</s>`;
    if (run.u) html = `<u>${html}</u>`;
    if (run.i) html = `<i>${html}</i>`;
    if (run.b) html = `<b>${html}</b>`;
    if (run.c && run.c !== rt.color) html = `<font color="#${run.c}">${html}</font>`;
    if (run.z && run.z !== rt.size) html = `<span data-z="${run.z}" style="font-size:${sizePx(run.z)}px">${html}</span>`;
    if (run.f && run.f !== rt.font) html = `<span data-f="${run.f}" style="font-family:${fontCss(run.f).replace(/"/g, "&quot;")}">${html}</span>`;
    return html;
  }).join("") || "<br>", list: rt.lists?.[index] || null, first: index === 0 }));
  let html = "";
  for (let i = 0; i < paras.length; ) {
    const para = paras[i];
    if (para.list) {
      const tag = para.list === "n" ? "ol" : "ul";
      let items = "";
      for (; i < paras.length && paras[i].list === para.list; ) items += `<li>${paras[i++].inner}</li>`;
      html += `<${tag}>${items}</${tag}>`;
    } else {
      html += para.first ? para.inner : `<div>${para.inner}</div>`;
      i++;
    }
  }
  return html;
}
/** Elements that start a new paragraph. */
const BLOCK_TAGS = /* @__PURE__ */ new Set(["DIV", "P", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "PRE"]);
/** CSS colour (rgb()/rgba(), #rrggbb or #rgb) → "rrggbb"; "" when not recognised. */
function cssColorHex(css: string): string {
  const m = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) return [m[1], m[2], m[3]].map((v) => (+v).toString(16).padStart(2, "0")).join("");
  const hex = css.replace("#", "").trim();
  return /^[0-9a-f]{6}$/i.test(hex) ? hex.toLowerCase() : /^[0-9a-f]{3}$/i.test(hex) ? hex.split("").map((d) => d + d).join("").toLowerCase() : "";
}
/** The run style inside `el`, given the style outside it (tags, inline CSS and data-f / data-z). */
function applyElementStyle(outer: Run | Omit<Run, "t">, el: HTMLElement): any {
  const style: any = { ...outer }, tag = el.tagName;
  if (tag === "B" || tag === "STRONG") style.b = true;
  if (tag === "I" || tag === "EM") style.i = true;
  if (tag === "U" || tag === "INS") style.u = true;
  if (tag === "S" || tag === "STRIKE" || tag === "DEL") style.s = true;
  if (tag === "FONT" && el.getAttribute("color")) style.c = cssColorHex(el.getAttribute("color")!) || style.c;
  const css = el.style;
  if (css.fontWeight) style.b = css.fontWeight === "bold" || css.fontWeight === "bolder" || +css.fontWeight >= 600;
  if (css.fontStyle) style.i = css.fontStyle === "italic" || css.fontStyle === "oblique";
  const decoration = css.textDecorationLine || css.textDecoration;
  if (decoration) {
    if (decoration.includes("underline")) style.u = true;
    if (decoration.includes("line-through")) style.s = true;
    if (decoration === "none") {
      style.u = false;
      style.s = false;
    }
  }
  if (css.color) style.c = cssColorHex(css.color) || style.c;
  if (el.dataset.f) style.f = el.dataset.f;
  if (el.dataset.z) style.z = +el.dataset.z || style.z;
  return style;
}
/**
 * Read the contenteditable editor back into paragraphs of runs and their list types. Styles equal to the
 * block defaults (colour, font, size) are left off the runs.
 */
function htmlToRich(root: HTMLElement, defaultColor: string, defaultFont = "", defaultSize = 0): { paras: Run[][]; lists: ListKind[] } {
  const paras: Run[][] = [], lists: ListKind[] = [];
  let runs: Run[] = [], hasContent = false, currentList: ListKind = null, paraList: ListKind = null;
  /** End the current paragraph. */
  const flush = () => {
    paras.push(runs);
    lists.push(paraList);
    runs = [];
    hasContent = false;
    paraList = currentList && paraList ? paraList : null;
  }, walk = (parent: HTMLElement, style: any) => {
    const children = [...parent.childNodes];
    children.forEach((node, index) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = (node.textContent || "").replace(/ /g, " ").replace(/​/g, "");
        if (text) {
          const run: Run = { t: text };
          if (style.b) run.b = true;
          if (style.i) run.i = true;
          if (style.u) run.u = true;
          if (style.s) run.s = true;
          if (style.c && style.c !== defaultColor) run.c = style.c;
          if (style.f && style.f !== defaultFont) run.f = style.f;
          if (style.z && style.z !== defaultSize) run.z = style.z;
          runs.push(run);
          hasContent = true;
        }
        return;
      }
      if (!(node instanceof HTMLElement)) return;
      if (node.tagName === "BR") {
        // a trailing <br> in a block only keeps the (empty) line open; elsewhere it breaks the paragraph
        if (index === children.length - 1 && (parent === root || BLOCK_TAGS.has(parent.tagName))) hasContent = true;
        else flush();
        return;
      }
      const isBlock = BLOCK_TAGS.has(node.tagName) || node.tagName === "UL" || node.tagName === "OL";
      if (isBlock && (hasContent || runs.length)) flush();
      const outerList = currentList;
      if (node.tagName === "UL") currentList = "b";
      else if (node.tagName === "OL") currentList = "n";
      if (node.tagName === "LI") paraList = currentList;
      walk(node, applyElementStyle(style, node));
      if (isBlock && (hasContent || runs.length)) flush();
      if (node.tagName === "LI") paraList = null;
      currentList = outerList;
    });
  };
  walk(root, { b: false, i: false, u: false, s: false, c: defaultColor });
  if (hasContent || runs.length || !paras.length) flush();
  return { paras, lists };
}
/**
 * Apply a font (`kind` "f") or size ("z") to the editor's current selection: uses execCommand with a sentinel
 * value, then replaces the generated `<font>` elements with `<span data-f|data-z>` spans (clearing the same
 * property on nested elements) and reselects them. Returns false when nothing was selected inside `editor`.
 */
function applySpanStyle(editor: HTMLElement, kind: "f" | "z", value: string, cssValue: string): boolean {
  const selection = document.getSelection();
  if (!selection || selection.isCollapsed || !editor.contains(selection.anchorNode)) return false;
  try {
    document.execCommand("styleWithCSS", false, "false");
  } catch {
  }
  if (kind === "f") document.execCommand("fontName", false, "__margin_font__");
  else document.execCommand("fontSize", false, "7");
  const spans: HTMLElement[] = [], fonts = [...editor.querySelectorAll(kind === "f" ? 'font[face="__margin_font__"]' : 'font[size="7"]')];
  for (const font of fonts) {
    const span = document.createElement("span");
    span.dataset[kind] = value;
    span.style.setProperty(kind === "f" ? "font-family" : "font-size", cssValue);
    font.querySelectorAll(`[data-${kind}]`).forEach((el) => {
      const inner = el as HTMLElement;
      delete inner.dataset[kind];
      inner.style.removeProperty(kind === "f" ? "font-family" : "font-size");
    });
    font.querySelectorAll(kind === "f" ? "font[face]" : "font[size]").forEach((el) => el.removeAttribute(kind === "f" ? "face" : "size"));
    for (; font.firstChild; ) span.append(font.firstChild);
    font.replaceWith(span);
    spans.push(span);
  }
  if (spans.length) {
    const range = document.createRange();
    range.setStartBefore(spans[0]);
    range.setEndAfter(spans[spans.length - 1]);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  return spans.length > 0;
}

export { blockFont, normalizeRuns, decodeRichText, colorHex, hexToRgba, applySpanStyle, richToHtml, richFromPlain, spliceRichText, writeRichText, htmlToRich, plainText };
