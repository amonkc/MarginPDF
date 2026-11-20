// Recognise text (OCR): makes scanned pages searchable and selectable. Each page is rendered, read by Tesseract
// (tesseract.js, WebAssembly, in a worker) and the recognised lines are laid over the page as invisible text
// (text.ts, writeOcrText). The engine (~1 MB) and each language (~1–3.6 MB) download only when used, from this
// site (scripts/web.mjs copies them into one folder listed as "ocr/"); nothing leaves the device.

import type { App } from '../app';
import type { Rect } from '../engine/types';
import { assetUrl } from '../engine/assets';
import { writeOcrText } from '../engine/text';
import type { OcrLine } from '../engine/text';
import { h, modal, toast } from './dom';

/** Tesseract language codes Margin offers, with their names. */
const LANGUAGES: [string, string][] = [
  ["eng", "English"], ["tha", "Thai"], ["chi_sim", "Chinese (Simplified)"], ["chi_tra", "Chinese (Traditional)"], ["jpn", "Japanese"], ["kor", "Korean"],
  ["vie", "Vietnamese"], ["rus", "Russian"], ["hin", "Hindi"], ["ben", "Bengali"], ["tam", "Tamil"], ["tel", "Telugu"], ["lao", "Lao"], ["khm", "Khmer"], ["mya", "Burmese"],
];
/** The browser language's OCR language, if Margin has it. */
function browserLanguage(): string | null {
  const lang = (navigator.languages?.[0] || navigator.language || "").toLowerCase();
  if (/^zh-(tw|hk|mo|hant)/.test(lang)) return "chi_tra";
  const map: Record<string, string> = { th: "tha", zh: "chi_sim", ja: "jpn", ko: "kor", vi: "vie", ru: "rus", hi: "hin", bn: "ben", ta: "tam", te: "tel", lo: "lao", km: "khm", my: "mya" };
  return map[lang.split("-")[0]] || null;
}
const STORE = "margin.ocrLanguages";
/** Pages are read at up to 300 dpi, the long side at most this many pixels. */
const MAX_SIDE = 3300;

type Worker = { recognize(image: HTMLCanvasElement, options?: object, output?: object): Promise<{ data: OcrData }>; terminate(): Promise<unknown> };
type OcrData = { blocks: { paragraphs: { lines: { text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }[] }[] }[] | null };

/** Whether this browser runs WebAssembly SIMD (the faster engine build). */
const simd = (): boolean => {
  try {
    return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]));
  } catch {
    return false;
  }
};

/** A Tesseract worker for these languages; `progress` gets 0–1 of the current page. */
async function startWorker(langs: string[], progress: (status: string, value: number) => void): Promise<Worker> {
  const { createWorker } = await import("tesseract.js");
  const base = assetUrl("ocr/");
  return (await createWorker(langs, 1, {
    workerPath: base + "worker.min.js",
    corePath: base + (simd() ? "tesseract-core-simd-lstm.js" : "tesseract-core-lstm.js"),
    langPath: base.replace(/\/$/, ""),
    workerBlobURL: false,
    cacheMethod: "none", // the browser's HTTP cache keeps the language files (they never change at this address)
    logger: (m: { status: string; progress: number }) => progress(m.status, m.progress),
  })) as unknown as Worker;
}

/** Asks which pages and languages; resolves to the choice, or null if cancelled. */
async function askOcr(app: App): Promise<{ pages: number[]; langs: string[]; skipText: boolean } | null> {
  let saved: string[] = [];
  try {
    saved = JSON.parse(localStorage.getItem(STORE) || "[]");
  } catch {}
  const initial = new Set(saved.length ? saved : ["eng", browserLanguage()].filter((l): l is string => !!l));
  const selected = [...app.selectedPages].sort((a, b) => a - b), count = app.doc.pageCount;
  const radio = (value: string, label: string, checked: boolean) => h("label", { class: "hf-check" }, h("input", { type: "radio", name: "ocr-pages", value, checked }), label);
  const skip = h("input", { type: "checkbox", id: "ocr-skip", checked: true }) as HTMLInputElement;
  const body = h("div", { class: "stack ocr" },
    h("div", { class: "stack", role: "radiogroup", "aria-label": "Pages" },
      radio("all", `All pages (${count})`, selected.length <= 1),
      radio("current", `This page (${app.currentPage + 1})`, false),
      selected.length > 1 ? radio("selected", `Selected pages (${selected.length})`, true) : null),
    h("label", { class: "hf-check" }, skip, "Skip pages that already have text"),
    h("span", { class: "rlabel", text: "Languages in the document" }),
    h("div", { class: "ocr-langs" }, ...LANGUAGES.map(([code, name]) => h("label", { class: "hf-check" }, h("input", { type: "checkbox", value: code, checked: initial.has(code) }), name))),
    h("p", { class: "hint", text: "Each language downloads once (about 1–3 MB) and stays on this device. Choose only the languages the pages use: each extra one makes reading slower." }));
  for (;;) {
    const choice = await modal({ title: "Recognise text (OCR)", body, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Recognise", primary: true }] });
    if (choice !== "ok") return null;
    const langs = [...body.querySelectorAll<HTMLInputElement>(".ocr-langs input:checked")].map((i) => i.value);
    if (!langs.length) {
      toast("Choose at least one language", "warn", 3e3);
      continue;
    }
    try {
      localStorage.setItem(STORE, JSON.stringify(langs));
    } catch {}
    const mode = (body.querySelector("input[name=ocr-pages]:checked") as HTMLInputElement).value;
    const pages = mode === "current" ? [app.currentPage] : mode === "selected" ? selected : Array.from({ length: count }, (_, i) => i);
    return { pages, langs, skipText: skip.checked };
  }
}

/** Recognised lines of a rendered page, mapped back to PDF points. */
function linesOf(data: OcrData, toPage: (x: number, y: number) => [number, number]): OcrLine[] {
  const out: OcrLine[] = [];
  for (const block of data.blocks || []) for (const para of block.paragraphs) for (const line of para.lines) {
    const text = line.text.replace(/\s+$/, "");
    if (!text.trim() || line.confidence < 30) continue;
    const corners = [toPage(line.bbox.x0, line.bbox.y0), toPage(line.bbox.x1, line.bbox.y1)];
    const box: Rect = { l: Math.min(corners[0][0], corners[1][0]), r: Math.max(corners[0][0], corners[1][0]), b: Math.min(corners[0][1], corners[1][1]), t: Math.max(corners[0][1], corners[1][1]) };
    out.push({ text, box });
  }
  return out;
}

/** The OCR command: asks, then reads the pages one by one (stoppable), as one undoable step. */
async function recogniseText(app: App): Promise<void> {
  const choice = await askOcr(app);
  if (!choice) return;
  let pages = choice.pages;
  if (choice.skipText) pages = pages.filter((i) => app.doc.charCount(i) === 0);
  if (!pages.length) {
    toast("Those pages already have text, so there’s nothing to recognise. Untick “Skip pages that already have text” to read them anyway.", "ok", 6e3);
    return;
  }
  let stopped = false, current = 0, written = 0, done = 0;
  const note = toast("Loading the text recogniser…", "ok", 600e3, { label: "Stop", run: () => (stopped = true) });
  const say = (status: string, value: number) => {
    if (stopped) return;
    if (/recogniz/.test(status)) note.set(`Reading page ${pages[current] + 1}${pages.length > 1 ? ` (${current + 1} of ${pages.length})` : ""}… ${Math.round(value * 100)}%`);
    else if (/load|initiali/.test(status)) note.set(/language|traineddata/.test(status) ? "Loading languages…" : "Loading the text recogniser…");
  };
  let worker: Worker | null = null;
  try {
    worker = await startWorker(choice.langs, say);
    await app.mutate("Recognise text", { pages }, async () => {
      for (current = 0; current < pages.length && !stopped; current++) {
        const index = pages[current], size = app.doc.pageSize(index), k = Math.min(300 / 72, MAX_SIDE / Math.max(size.w, size.h));
        const w = Math.round(size.w * k), hgt = Math.round(size.h * k), canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = hgt;
        canvas.getContext("2d")!.putImageData(app.doc.render(index, w, hgt, { annots: false }), 0, 0);
        const { data } = await worker!.recognize(canvas, {}, { blocks: true, text: false });
        if (stopped) break;
        const toPage = app.doc.transform(index, w, hgt).invert();
        written += await writeOcrText(app.doc, index, linesOf(data, (x, y) => toPage.apply(x, y)));
        done++;
      }
    });
    note.close();
    if (stopped) toast(`Stopped after ${done} page${done === 1 ? "" : "s"}${done ? "; their text is kept" : ""}.`, "ok", 4e3);
    else toast(written ? `Recognised ${written} line${written === 1 ? "" : "s"} of text on ${done} page${done === 1 ? "" : "s"}. You can now search, select and copy it.` : "No text was recognised. Check the languages, or that the pages are scans of text.", written ? "ok" : "warn", 6e3);
  } catch (err) {
    note.close();
    toast(`Text recognition failed: ${(err as Error).message || err}`, "err", 6e3);
  } finally {
    worker?.terminate().catch(() => {});
  }
}

export { recogniseText, LANGUAGES };
