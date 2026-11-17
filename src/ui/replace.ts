// Find & replace over the document's text objects. Plain text runs are rewritten in place; Margin text
// blocks (rich text) are edited through their rich-text model so styling survives the replacement.

import { spliceRichText, writeRichText, plainText } from '../engine/richtext';
import { removeById } from '../engine/text';
import { groupTextRuns, blockRichDoc, replaceRunText } from './interact';
import type { Rect } from '../engine/types';
import type { App } from '../app';

/** A text line or Margin text block as grouped by interact's line grouping (`objs`, `bounds`, `block`, `text`). */
type TextLine = any;

/** Search options shared by the find bar and the spelling panel. */
export type SearchOptions = { matchCase?: boolean; wholeWord?: boolean };

/**
 * Replaces character ranges `[start, end)` of a Margin text block with `replacement`, then re-lays the block
 * out (or just removes it when the result is empty).
 */
async function replaceInBlock(doc: any, page: number, line: any, ranges: [number, number][], replacement: string): Promise<void> {
  let rich = blockRichDoc(line);
  // Right to left, so earlier offsets stay valid.
  for (const [start, end] of [...ranges].sort((a, b) => b[0] - a[0])) rich = spliceRichText(rich, start, end, replacement);
  const blockId = line.objs[0].margin.id;
  removeById(doc, page, blockId);
  if (plainText(rich).trim()) await writeRichText(doc, page, rich, blockId);
}

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A global regex for `query` honouring the case and whole-word options. */
function searchRegExp(query: string, options: SearchOptions): RegExp {
  const pattern = escapeRegExp(query);
  return new RegExp(options.wholeWord ? `(?<![\\p{L}\\p{N}\\p{M}])${pattern}(?![\\p{L}\\p{N}\\p{M}])` : pattern, "gu" + (options.matchCase ? "" : "i"));
}

/** Number of matches of `re` in `text` (uses a fresh regex so `re.lastIndex` is untouched). */
const countIn = (text: string, re: RegExp): number => (text.match(new RegExp(re.source, re.flags)) || []).length;
/** Identifies a text line across re-reads of the page (object indices change after every edit). */
const lineKey = (line: any): string => `${line.text}|${Math.round(line.bounds.l)}|${Math.round(line.bounds.b)}`;
const rectsOverlap = (a: Rect, b: Rect): boolean => a.l < b.r && b.l < a.r && a.b < b.t && b.b < a.t;

/** Counts matches of `query` across all pages. */
function countMatches(app: App, query: string, options: SearchOptions): number {
  const re = searchRegExp(query, options);
  let count = 0;
  for (let page = 0; page < app.doc.pageCount; page++) for (const line of (groupTextRuns(app.doc.textObjects(page)) as TextLine[])) count += countIn(line.text, re);
  return count;
}

/** Replaces every match of `query` in the document as one undoable step. Throws when there is nothing to replace. */
async function replaceAll(app: App, query: string, replacement: string, options: SearchOptions): Promise<{ count: number; lines: number; pages: number }> {
  const re = searchRegExp(query, options), doc = app.doc;
  let count = 0, lines = 0;
  const pagesTouched: number[] = [];
  await app.mutate(`Replace “${query}”`, { pages: "all" }, async () => {
    for (let page = 0; page < doc.pageCount; page++) {
      const pending = new Set((groupTextRuns(doc.textObjects(page)) as TextLine[]).filter((line) => countIn(line.text, re)).map(lineKey));
      // Each edit re-reads the page; the budget guards against a line that keeps matching after replacement.
      let budget = pending.size + 5;
      while (pending.size && budget-- > 0) {
        const line = (groupTextRuns(doc.textObjects(page)) as TextLine[]).find((candidate) => pending.has(lineKey(candidate)));
        if (!line) break;
        pending.delete(lineKey(line));
        count += countIn(line.text, re);
        lines++;
        if (line.block) {
          await replaceInBlock(doc, page, line, [...line.text.matchAll(new RegExp(re.source, re.flags))].map((m) => [m.index, m.index + m[0].length]), replacement);
        } else {
          await replaceRunText(doc, page, line, line.text.replace(new RegExp(re.source, re.flags), () => replacement));
        }
        if (!pagesTouched.includes(page)) pagesTouched.push(page);
      }
    }
    if (!count) throw new Error("No matches to replace");
  });
  return { count, lines, pages: pagesTouched.length };
}

/**
 * Replaces the single match of `query` nearest to `rect` on `page` (used by the spelling panel).
 * Resolves to false when no text line there contains a match.
 */
async function replaceAt(app: App, page: number, rect: Rect, query: string, replacement: string, options: SearchOptions): Promise<boolean> {
  const re = searchRegExp(query, options), doc = app.doc, line = (groupTextRuns(doc.textObjects(page)) as TextLine[]).filter((x) => rectsOverlap(x.bounds, rect) && countIn(x.text, re))[0];
  if (!line) return false;
  if (line.block) {
    // Estimate where in the block's text `rect` falls (line number + horizontal fraction), then take the closest match.
    const rich = blockRichDoc(line),
      plain = plainText(rich),
      lineHeight = rich.lh * rich.size * Math.hypot(rich.bm[0], rich.bm[1]),
      lineCount = Math.max(1, Math.round((line.bounds.t - line.bounds.b) / lineHeight)),
      lineNo = Math.min(lineCount - 1, Math.max(0, Math.floor((line.bounds.t - rect.t) / lineHeight + 0.3))),
      xFraction = (rect.l - line.bounds.l) / Math.max(1, line.bounds.r - line.bounds.l),
      targetOffset = (lineNo + xFraction) / lineCount * plain.length,
      matches = [...plain.matchAll(new RegExp(re.source, re.flags))];
    if (!matches.length) return false;
    const nearest = matches.reduce((best, m) => Math.abs(m.index - targetOffset) < Math.abs(best.index - targetOffset) ? m : best);
    await app.mutate(`Replace “${query}”`, { pages: [page] }, () => replaceInBlock(doc, page, line, [[nearest.index, nearest.index + nearest[0].length]], replacement));
    return true;
  }
  const text = line.text, bounds = line.bounds, xFraction = (rect.l - bounds.l) / Math.max(1, bounds.r - bounds.l), matches = [...text.matchAll(new RegExp(re.source, re.flags))];
  if (!matches.length) return false;
  const nearest = matches.reduce((best, m) => Math.abs(m.index / Math.max(1, text.length) - xFraction) < Math.abs(best.index / Math.max(1, text.length) - xFraction) ? m : best),
    newText = text.slice(0, nearest.index) + replacement + text.slice(nearest.index + nearest[0].length);
  await app.mutate(`Replace “${query}”`, { pages: [page] }, () => replaceRunText(doc, page, line, newText));
  return true;
}

export { replaceAt, replaceAll, countMatches };
