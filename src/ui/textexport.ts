// Save as Markdown or plain text: the document's text in reading order, with paragraphs rejoined and, for
// Markdown, headings (from larger or bold text) and lists. A heuristic, not AI: tables come out as lines of text.

import type { App } from '../app';
import type { Doc } from '../engine/pdfium';
import { h, modal, toast } from './dom';

type Line = { text: string; size: number; bold: boolean; x: number; top: number; bottom: number; page: number };

/** Characters of scripts written without spaces between words (lines join without a space). */
const NO_SPACE = /[฀-໿က-႟ក-៿぀-ヿ㐀-鿿豈-﫿＀-￯]/;
const BULLET = /^([•◦▪▫‣⁃∙●○■□–—*-])\s+/;
const NUMBERED = /^(\(?\d{1,3}[.)]|\(?[a-z][.)])\s+/i;

/** The most common font size of the body text (weighted by length). */
function bodySize(lines: Line[]): number {
  const weight = new Map<number, number>();
  for (const line of lines) weight.set(Math.round(line.size), (weight.get(Math.round(line.size)) || 0) + line.text.length);
  return [...weight.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 11;
}

/** Joins two lines of one paragraph: no space for Thai/Chinese/Japanese, end-of-line hyphenation undone. */
function join(a: string, b: string): string {
  if (/[a-z]-$/.test(a) && /^[a-z]/.test(b)) return a.slice(0, -1) + b;
  if (NO_SPACE.test(a.slice(-1)) && NO_SPACE.test(b[0])) return a + b;
  return a + " " + b;
}

/**
 * The text of `lines` as Markdown (headings, lists, paragraphs) or plain text (paragraphs). Standalone page
 * numbers at the top or bottom of a page are left out.
 */
function linesToText(lines: Line[], markdown: boolean): string {
  const body = bodySize(lines), blocks: string[] = [];
  const byPage = new Map<number, Line[]>();
  for (const line of lines) byPage.set(line.page, [...(byPage.get(line.page) || []), line]);
  const kept = lines.filter((line) => {
    const page = byPage.get(line.page)!;
    return !(/^(page\s*)?\d{1,4}(\s*(of|\/)\s*\d{1,4})?$/i.test(line.text) && (line === page[0] || line === page[page.length - 1]));
  });
  let para: Line | null = null, text = "", kind: "p" | "li" = "p";
  const end = () => {
    if (para) blocks.push(text);
    para = null;
  };
  /** A line that runs on into the next (or follows on from the previous) at the same size: part of a paragraph. */
  const runsOn = (i: number) => [kept[i - 1], kept[i + 1]].some((other) => other && other.page === kept[i].page && Math.abs(other.size - kept[i].size) < 0.6 && Math.min(Math.abs(other.bottom - kept[i].top), Math.abs(kept[i].bottom - other.top)) < kept[i].size * 0.9);
  for (const [i, line] of kept.entries()) {
    const ratio = line.size / body, short = line.text.length <= 80;
    // Headings: much larger text, or short bold text that isn't a sentence; never a line of a paragraph.
    const level = !short || runsOn(i) ? 0 : ratio >= 1.6 ? 1 : ratio >= 1.3 ? 2 : line.bold && ratio >= 0.95 && !/[.,;:!?。]$/.test(line.text) ? 3 : 0;
    const bullet = BULLET.exec(line.text), numbered = !bullet && NUMBERED.exec(line.text);
    if (level) {
      end();
      blocks.push(markdown ? "#".repeat(level) + " " + line.text : line.text);
      continue;
    }
    if (bullet || numbered) {
      end();
      para = line;
      kind = "li";
      text = markdown ? (bullet ? "- " + line.text.slice(bullet[0].length) : line.text.replace(NUMBERED, (m) => m.trim().replace(/[()]/g, "").replace(/\)$/, ".") + " ")) : line.text;
      continue;
    }
    // Same paragraph: next line on the same page, close below, about the same size, not a new indented start.
    const prev: Line | null = para;
    const continues = prev && prev.page === line.page && prev.bottom - line.top < Math.max(prev.size, line.size) * 0.9 && prev.bottom > line.top - 2 && Math.abs(prev.size - line.size) < 1.2 && (kind === "li" || line.x - prev.x < prev.size * 1.5);
    if (continues) {
      text = join(text, line.text);
      para = { ...line, x: kind === "li" ? prev!.x : Math.min(prev!.x, line.x) };
    } else {
      end();
      para = line;
      kind = "p";
      text = line.text;
    }
  }
  end();
  // List items sit together without blank lines between them.
  return blocks.reduce((out, block, i) => out + (i === 0 ? "" : /^(- |\d+\. )/.test(block) && /^(- |\d+\. )/.test(blocks[i - 1]) ? "\n" : "\n\n") + block, "") + "\n";
}

/** All the lines of the given pages. */
function linesOf(doc: Doc, pages: number[]): Line[] {
  return pages.flatMap((page) => doc.pageLines(page).map((line) => ({ ...line, page })));
}

/** Asks for the format and pages, then saves the text (or says there is none: a scan needs OCR first). */
async function saveAsText(app: App, save: (bytes: Uint8Array, name: string, mime: string) => Promise<void>): Promise<void> {
  const { locked, perms } = app.limits;
  if (locked && !(perms & 16)) return void toast("This PDF’s permissions don’t allow copying its content", "warn");
  const radio = (name: string, value: string, label: string, checked: boolean) => h("label", { class: "hf-check" }, h("input", { type: "radio", name, value, checked }), label);
  const selected = [...app.selectedPages].sort((a, b) => a - b), count = app.doc.pageCount;
  const body = h("div", { class: "stack" },
    h("div", { class: "stack", role: "radiogroup", "aria-label": "Format" },
      radio("tx-format", "md", "Markdown (.md): headings, lists and paragraphs", true),
      radio("tx-format", "txt", "Plain text (.txt)", false)),
    h("div", { class: "stack", role: "radiogroup", "aria-label": "Pages" },
      radio("tx-pages", "all", `All pages (${count})`, selected.length <= 1),
      selected.length > 1 ? radio("tx-pages", "selected", `Selected pages (${selected.length})`, true) : null),
    h("p", { class: "hint", text: "Headings are guessed from larger or bold text; tables come out as lines of text." }));
  if ((await modal({ title: "Save as text", body, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Save", primary: true }] })) !== "ok") return;
  const markdown = (body.querySelector("input[name=tx-format]:checked") as HTMLInputElement).value === "md";
  const pages = (body.querySelector("input[name=tx-pages]:checked") as HTMLInputElement).value === "selected" ? selected : Array.from({ length: count }, (_, i) => i);
  const lines = linesOf(app.doc, pages);
  if (!lines.length) return void toast("These pages have no text to save. If they’re scans, recognise the text first (More → Recognise text).", "ok", 6e3);
  const text = linesToText(lines, markdown), base = app.fileName.replace(/\.pdf$/i, "");
  await save(new TextEncoder().encode(text), `${base}.${markdown ? "md" : "txt"}`, markdown ? "text/markdown" : "text/plain");
}

export { saveAsText, linesToText };
