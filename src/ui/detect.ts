// Detect form fields: finds the places a printed form expects writing, so they can become fillable fields.
// Candidates: runs of underscores or dots in the text ("Name: ________"), ruled lines drawn on the page that
// aren't part of a table or underlining text, empty boxes (small square → checkbox, wider → text field) and
// ☐ characters. Each gets a name from the words just before it (or after a checkbox, or above).

import type { Doc } from '../engine/pdfium';
import type { Rect } from '../engine/types';

export type FieldCandidate = { page: number; kind: "text" | "multiline" | "checkbox"; rect: Rect; label: string };
type Word = { t: string; rects: Rect[] };

const area = (r: Rect) => Math.max(0, r.r - r.l) * Math.max(0, r.t - r.b);
const overlap = (a: Rect, b: Rect) => area({ l: Math.max(a.l, b.l), r: Math.min(a.r, b.r), b: Math.max(a.b, b.b), t: Math.min(a.t, b.t) });
/** Share of the smaller rectangle covered by the other. */
const covered = (a: Rect, b: Rect) => overlap(a, b) / Math.max(1e-6, Math.min(area(a), area(b)));
const centre = (r: Rect) => [(r.l + r.r) / 2, (r.b + r.t) / 2];

/** Collinear horizontal segments that touch, joined (a line drawn in pieces). */
function joinLines(lines: Rect[]): Rect[] {
  const sorted = [...lines].sort((a, b) => a.b - b.b || a.l - b.l), out: Rect[] = [];
  for (const line of sorted) {
    const last = out[out.length - 1];
    if (last && Math.abs(last.b - line.b) < 0.6 && line.l <= last.r + 1.5) last.r = Math.max(last.r, line.r), (last.t = Math.max(last.t, line.t));
    else out.push({ ...line });
  }
  return out;
}

/** The label for a field: words just before it on its line (after it, for a checkbox), else just above it. */
function labelFor(rect: Rect, kind: FieldCandidate["kind"], words: Word[]): string {
  const midY = (rect.b + rect.t) / 2, sameLine = words.filter((w) => w.rects.some((r) => Math.abs((r.b + r.t) / 2 - midY) < Math.max(7, (rect.t - rect.b) / 2)));
  const take = (list: { w: Word; r: Rect }[], forward: boolean) => {
    const out: string[] = [];
    let edge = forward ? rect.r : rect.l;
    for (const { w, r } of list) {
      const gap = forward ? r.l - edge : edge - r.r;
      if (gap > (out.length ? 14 : 40) || out.join(" ").length > 40) break;
      out.push(w.t);
      edge = forward ? r.r : r.l;
    }
    return (forward ? out : out.reverse()).join(" ").replace(/\s+([,.:;!?)])/g, "$1").replace(/[\s:：.。]+$/, "").trim();
  };
  const left = sameLine.flatMap((w) => w.rects.filter((r) => r.r <= rect.l + 2).map((r) => ({ w, r }))).sort((a, b) => b.r.r - a.r.r);
  const right = sameLine.flatMap((w) => w.rects.filter((r) => r.l >= rect.r - 2).map((r) => ({ w, r }))).sort((a, b) => a.r.l - b.r.l);
  let label = kind === "checkbox" ? take(right, true) || take(left, false) : take(left, false);
  if (!label) {
    const above = words.filter((w) => w.rects.some((r) => r.b >= rect.t - 1 && r.b <= rect.t + 18 && r.r > rect.l && r.l < rect.r));
    label = above.map((w) => w.t).join(" ").slice(0, 40).replace(/[\s:：]+$/, "").trim();
  }
  return label.replace(/^[^\p{L}\p{N}]+/u, "").slice(0, 40);
}

/** Field candidates on a page, leaving out places that already have a field or an annotation (`taken`). */
function detectFields(doc: Doc, page: number, taken: Rect[]): FieldCandidate[] {
  const box = doc.pageBoxes(page).crop, pageW = box.r - box.l, pageArea = area(box);
  const words: Word[] = doc.pageTokens(page).filter((w) => /[\p{L}\p{N}]/u.test(w.t));
  const wordRects = words.flatMap((w) => w.rects);
  const rules = doc.pageRules(page), vlines = rules.v;
  const out: FieldCandidate[] = [];
  const add = (kind: FieldCandidate["kind"], rect: Rect) => {
    if (rect.r - rect.l < 4 || rect.t - rect.b < 4) return;
    if ([...taken, ...out.map((c) => c.rect)].some((t) => covered(t, rect) > 0.3)) return;
    out.push({ page, kind, rect, label: labelFor(rect, kind, words) });
  };
  // ☐ characters
  for (const run of doc.findTextRuns(page, /[☐□❏❑⬜◻]/g)) for (const r of run.rects) {
    const s = Math.max(r.r - r.l, r.t - r.b, 8), [cx, cy] = centre(r);
    add("checkbox", { l: cx - s / 2, r: cx + s / 2, b: cy - s / 2, t: cy + s / 2 });
  }
  // empty boxes
  for (const r of rules.boxes) {
    const w = r.r - r.l, hgt = r.t - r.b;
    if (area(r) > pageArea * 0.3) continue;
    if (wordRects.some((t) => { const [x, y] = centre(t); return x > r.l + 1 && x < r.r - 1 && y > r.b + 1 && y < r.t - 1; })) continue;
    if (rules.boxes.some((o) => o !== r && o.l >= r.l - 0.5 && o.r <= r.r + 0.5 && o.b >= r.b - 0.5 && o.t <= r.t + 0.5 && area(o) < area(r) * 0.9)) continue; // a frame around other boxes
    if (w >= 6 && w <= 24 && hgt >= 6 && hgt <= 24 && w / hgt > 0.7 && w / hgt < 1.4) add("checkbox", r);
    else if (w >= 30 && hgt >= 10 && hgt <= 140) add(hgt > 34 ? "multiline" : "text", { l: r.l + 1, r: r.r - 1, b: r.b + 1, t: r.t - 1 });
  }
  // underscores and dot leaders typed as text
  for (const run of doc.findTextRuns(page, /_{3,}|\.{6,}|…{2,}/g)) for (const r of run.rects) {
    if (r.r - r.l < 18) continue;
    add("text", { l: r.l, r: r.r, b: r.b - 1, t: r.b + 14 });
  }
  // ruled lines: not in a table (no vertical line touching), not underlining words, not a page-wide rule
  for (const line of joinLines(rules.h)) {
    const w = line.r - line.l, y = line.t;
    if (w < 36 || w > pageW * 0.75) continue;
    if (vlines.some((v) => v.l >= line.l - 1.5 && v.l <= line.r + 1.5 && v.b <= y + 1.5 && v.t >= line.b - 1.5)) continue;
    const onTop = wordRects.filter((r) => r.b >= y - 1.5 && r.b <= y + 6 && r.r > line.l && r.l < line.r).reduce((n, r) => n + Math.min(r.r, line.r) - Math.max(r.l, line.l), 0);
    if (onTop > w * 0.4) continue;
    const above = wordRects.filter((r) => r.b > y + 2 && r.r > line.l && r.l < line.r).map((r) => r.b - y);
    add("text", { l: line.l, r: line.r, b: y + 1, t: y + 1 + Math.max(10, Math.min(18, ...above.map((d) => d - 2))) });
  }
  return out;
}

export { detectFields };
