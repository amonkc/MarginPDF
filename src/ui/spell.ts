import { loadAsset } from '../engine/assets';
import { unionRect } from '../engine/pdfium';
import { toast, icon, h } from './dom';
import { replaceAt } from './replace';
import { default as Zc } from 'nspell';
import type { Rect } from '../engine/types';
import type { App } from '../app';

/** A word found on a page by Doc.pageWords. */
type PageWord = { word: string; rects: Rect[]; context: string };
/** A possible misspelling. */
type Issue = PageWord & { page: number };

/** The loaded English dictionary (shared; reset on failure so the next open retries). */
let dictPromise: Promise<any> | null = null;
/** localStorage key of the words the user added to the dictionary. */
const USER_WORDS_KEY = "margin.spell.words";
const loadUserWords = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(USER_WORDS_KEY) || "[]");
  } catch {
    return [];
  }
};
/** Loads the Hunspell en dictionary into nspell, plus the user's own words. */
function loadDictionary(): Promise<any> {
  dictPromise ??= Promise.all([loadAsset("dict/en.aff"), loadAsset("dict/en.dic")]).then(([aff, dic]) => {
    const decoder = new TextDecoder(), speller = Zc({ aff: decoder.decode(aff), dic: decoder.decode(dic) });
    for (const word of loadUserWords()) speller.add(word);
    return speller;
  });
  dictPromise.catch(() => {
    dictPromise = null;
  });
  return dictPromise;
}

/** The floating Spelling panel: checks every page, steps through possible misspellings and fixes them in place. */
class Spelling {
  app: App;
  /** The viewer. */
  v: any;
  el: HTMLElement | null = null;
  issues: Issue[] = [];
  /** Index of the issue shown. */
  at = 0;
  /** Lower-cased words ignored for this session. */
  ignored: Set<string> = new Set();
  busy = false;
  constructor(app: App, viewer: any) {
    this.app = app;
    this.v = viewer;
  }
  /** Whether a word is worth checking: longer than one letter, not an acronym, not camelCase. */
  static candidate(word: string): boolean {
    return word.length > 1 && (word.match(/[A-ZÀ-Þ]/g)?.length ?? 0) < 2 && !/[a-z].*[A-Z]/.test(word);
  }
  /** Shows the panel and checks the whole document (yielding to the UI every few pages). */
  async open(): Promise<void> {
    if (!this.el) this.build();
    this.el!.hidden = false;
    this.status("Loading the English dictionary…");
    this.render();
    let speller;
    try {
      speller = await loadDictionary();
      this.sync = speller;
    } catch (err: any) {
      this.status("The dictionary couldn’t be loaded: " + err.message);
      return;
    }
    this.busy = true;
    this.issues = [];
    this.at = 0;
    const verdicts = new Map<string, boolean>(), isMisspelt = (word: string) => {
      const normalized = word.replace(/’/g, "'");
      let wrong = verdicts.get(normalized);
      if (wrong == null) {
        wrong = !(speller.correct(normalized) || speller.correct(normalized.toLowerCase()));
        verdicts.set(normalized, wrong);
      }
      return wrong;
    }, pageCount = this.app.doc.pageCount;
    for (let page = 0; page < pageCount; page++) {
      // Stop if the panel was closed meanwhile.
      if (!this.el || this.el.hidden) {
        this.busy = false;
        return;
      }
      this.status(`Checking page ${page + 1} of ${pageCount}…`);
      if (page % 4 === 0) await new Promise((resolve) => setTimeout(resolve, 0));
      this.app.relieveMemory(page);
      try {
        for (const w of this.app.doc.pageWords(page, Spelling.candidate) as PageWord[]) {
          if (!this.ignored.has(w.word.toLowerCase()) && isMisspelt(w.word)) this.issues.push({ page, ...w });
        }
      } catch {
      }
    }
    this.busy = false;
    this.render();
  }
  close(): void {
    if (this.el) this.el.hidden = true;
    this.v.setHits([], -1);
  }
  build(): void {
    this.el = h("section", { class: "spell-panel", role: "dialog", "aria-label": "Spelling", hidden: true });
    document.body.append(this.el!);
    // Escape closes the panel, unless a modal/menu is open or focus is in a text field outside the panel.
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !this.el || this.el.hidden || document.querySelector(".modal, .ctxmenu")) return;
      const target = e.target as HTMLElement;
      if (target.closest?.("input,textarea,[contenteditable]") && !this.el.contains(target)) return;
      e.stopPropagation();
      this.close();
    }, true);
  }
  /** Updates the status line (rendering the panel if it has none yet). */
  status(text: string): void {
    const line = this.el?.querySelector(".sp-status");
    if (line) line.textContent = text;
    else this.render(text);
  }
  /** Renders the panel for the current issue and highlights it in the viewer. */
  render(statusText?: string): void {
    const panel = this.el!, issue = this.issues[this.at], head = h("div", { class: "sp-head" }, h("h2", { text: "Spelling" }), h("span", { class: "hint", text: "English" }), h("button", { class: "iconbtn small", type: "button", "aria-label": "Close", title: "Close (Esc)", onclick: () => this.close() }, icon("close"))), statusEl = h("p", { class: "sp-status", text: statusText ?? (this.busy ? "" : this.issues.length ? `${this.at + 1} of ${this.issues.length} possible misspelling${this.issues.length === 1 ? "" : "s"}` : "No spelling problems found.") });
    panel.replaceChildren(head, statusEl);
    if (!issue || this.busy) {
      this.v.setHits([], -1);
      return;
    }
    const contextEl = h("p", { class: "sp-context" }), at = issue.context.indexOf(issue.word);
    if (at >= 0) contextEl.append(issue.context.slice(0, at), h("mark", { text: issue.word }), issue.context.slice(at + issue.word.length));
    else contextEl.textContent = issue.context;
    const suggestions = this.suggest(issue.word);
    panel.append(h("div", { class: "sp-word" }, h("b", { text: issue.word }), h("span", { class: "hint", text: ` page ${issue.page + 1}` })), contextEl, h("div", { class: "sp-sugg" }, ...suggestions.length ? suggestions.map((s) => h("button", { class: "chip", type: "button", title: `Replace with “${s}”`, onclick: () => this.replace(issue, s) }, s)) : [h("span", { class: "hint", text: "No suggestions" })]), h("div", { class: "sp-actions" }, h("button", { class: "btn ghost small", type: "button", onclick: () => this.skip() }, "Ignore"), h("button", { class: "btn ghost small", type: "button", onclick: () => this.ignoreAll(issue.word) }, "Ignore all"), h("button", { class: "btn ghost small", type: "button", onclick: () => this.learn(issue.word) }, "Add to dictionary"), h("span", { class: "sp-nav" }, h("button", { class: "iconbtn small", type: "button", "aria-label": "Previous", title: "Previous", disabled: this.at === 0, onclick: () => {
      this.at--;
      this.render();
    } }, icon("up")), h("button", { class: "iconbtn small", type: "button", "aria-label": "Next", title: "Next", disabled: this.at >= this.issues.length - 1, onclick: () => {
      this.at++;
      this.render();
    } }, icon("down")))));
    this.v.setHits([{ page: issue.page, rects: issue.rects }], 0);
    if (issue.rects[0]) this.v.scrollToPage(issue.page, issue.rects[0]);
  }
  suggestCache: Map<string, string[]> = new Map();
  /**
   * Up to five suggestions for `word`: adjacent-letter swaps that are correct, plus nspell's suggestions,
   * matched to the word's capitalisation and ranked by Damerau–Levenshtein distance.
   */
  suggest(word: string): string[] {
    let result = this.suggestCache.get(word);
    if (result) return result;
    const speller = this.sync;
    if (!speller) return [];
    const capitalized = /^[A-Z]/.test(word), lower = word.toLowerCase(), matchCase = (s: string) => capitalized ? s[0].toUpperCase() + s.slice(1) : s, candidates = new Set<string>();
    for (let i = 0; i + 1 < lower.length; i++) {
      const swapped = lower.slice(0, i) + lower[i + 1] + lower[i] + lower.slice(i + 2);
      if (speller.correct(swapped)) candidates.add(matchCase(swapped));
    }
    for (const s of [...speller.suggest(lower), ...capitalized ? speller.suggest(word) : []]) candidates.add(/^[A-Z]{2,}/.test(s) ? s : matchCase(s));
    candidates.delete(word);
    /** Case-insensitive optimal-string-alignment (Damerau–Levenshtein) distance. */
    const distance = (a: string, b: string) => {
      a = a.toLowerCase();
      b = b.toLowerCase();
      const d: number[][] = [];
      for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
        for (let j = 1; j <= b.length; j++) d[i][j] = i ? 0 : j;
      }
      for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
      return d[a.length][b.length];
    };
    result = [...candidates].map((s, order) => ({ x: s, k: order, d: distance(word, s) })).sort((p, q) => p.d - q.d || p.k - q.k).map((c) => c.x).slice(0, 5);
    this.suggestCache.set(word, result);
    return result;
  }
  /** The loaded nspell instance, once available (for synchronous suggestions). */
  sync: any = null;
  /** Ignores the current issue once. */
  skip(): void {
    this.issues.splice(this.at, 1);
    if (this.at >= this.issues.length) this.at = Math.max(0, this.issues.length - 1);
    this.render();
  }
  /** Ignores every occurrence of `word` for this session. */
  ignoreAll(word: string): void {
    const lower = word.toLowerCase();
    this.ignored.add(lower);
    this.issues = this.issues.filter((issue) => issue.word.toLowerCase() !== lower);
    if (this.at >= this.issues.length) this.at = Math.max(0, this.issues.length - 1);
    this.render();
  }
  /** Adds `word` to the user's dictionary (stored in this browser). */
  learn(word: string): void {
    try {
      const words = loadUserWords();
      if (!words.includes(word)) {
        words.push(word);
        localStorage.setItem(USER_WORDS_KEY, JSON.stringify(words));
      }
    } catch {
    }
    this.sync?.add(word);
    this.ignoreAll(word);
    toast(`Added “${word}” to your dictionary (this browser)`);
  }
  /**
   * Replaces the issue's word with `replacement`, then re-checks that page and splices its new issues into
   * the list, keeping the position at the next issue after the replaced word.
   */
  async replace(issue: Issue, replacement: string): Promise<any> {
    if (!await replaceAt(this.app, issue.page, unionRect(issue.rects), issue.word, replacement, { matchCase: true, wholeWord: true }).catch((err) => (toast(err.message, "err"), false))) return toast(`“${issue.word}” couldn’t be replaced here (it may be part of an image or a locked text block)`, "warn", 5e3);
    const speller = await loadDictionary(), pageIssues = (this.app.doc.pageWords(issue.page, Spelling.candidate) as PageWord[]).filter((w) => !this.ignored.has(w.word.toLowerCase()) && !(speller.correct(w.word) || speller.correct(w.word.toLowerCase()))), others = this.issues.filter((x) => x.page !== issue.page), insertAt = others.filter((x) => x.page < issue.page).length, firstRect = issue.rects[0], before = firstRect ? pageIssues.filter((w) => w.rects[0] && (w.rects[0].t > firstRect.t + 1 || Math.abs(w.rects[0].t - firstRect.t) <= 1 && w.rects[0].l < firstRect.l)).length : 0;
    this.issues = [...others.slice(0, insertAt), ...pageIssues.map((w) => ({ page: issue.page, ...w })), ...others.slice(insertAt)];
    this.at = Math.min(insertAt + before, Math.max(0, this.issues.length - 1));
    this.render();
  }
}

export { Spelling };
