import { ANNOT_NAMES } from '../engine/pdfium';
import { toast, icon, h } from './dom';
import type { AnnotInfo, RGBA } from '../engine/types';
import type { App, Change } from '../app';

/** A top-level annotation with the replies threaded under it. */
type CommentEntry = { page: number; a: AnnotInfo; replies: AnnotInfo[] };

/** Formats a PDF date ("D:YYYYMMDDHHmm…") as a short local date and time; "" when it can't be parsed. */
const formatPdfDate = (value: string | null | undefined): string => {
  const m = /^D:(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?/.exec(value || "");
  return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
};
const colorCss = (color: RGBA | null): string => color ? `rgb(${color[0]},${color[1]},${color[2]})` : "transparent";

/** The Comments side panel: every markup annotation in the document with its contents and reply thread. */
class CommentsPanel {
  /** Text boxes are edited through their own editor, not by setting /Contents. */
  onEditFreeText: ((page: number, index: number, text: string) => void) | null = null;
  el: HTMLElement;
  app: App;
  list: HTMLElement;
  count: HTMLElement;
  onGo: (page: number, annot: AnnotInfo) => void = () => {
  };
  cache: CommentEntry[] = [];
  /** Cards ("page:index") whose reply form is open. */
  replying: Set<string> = new Set();
  constructor(el: HTMLElement, app: App) {
    this.el = el;
    this.app = app;
    this.count = h("span", { class: "count" });
    this.list = h("div", { class: "clist" });
    el.append(h("div", { class: "panel-head" }, h("h2", { text: "Comments" }), this.count), this.list);
  }
  /** Comment entries per page. */
  perPage: CommentEntry[][] = [];
  known = false;
  /** Re-reads one page's annotations and groups replies under their root annotation. */
  readPage(page: number): void {
    this.app.relieveMemory(page);
    const annots: AnnotInfo[] = this.app.doc.annots(page), threadRoot = (annot: AnnotInfo) => {
      let current = annot;
      // Follow /IRT up to the root; the step cap guards against cycles.
      for (let step = 0; current.irt != null && step < 20; step++) {
        const parent = annots.find((x) => x.index === current.irt);
        if (!parent) break;
        current = parent;
      }
      return current;
    }, entries: CommentEntry[] = [];
    for (const annot of annots) {
      if (annot.irt == null && ANNOT_NAMES[annot.subtype]) entries.push({ page, a: annot, replies: annots.filter((x) => x.irt != null && threadRoot(x) === annot).sort((x, z) => x.modified < z.modified ? -1 : 1) });
    }
    this.perPage[page] = entries;
  }
  /** Re-reads the changed pages (or everything) and rebuilds the list. */
  refresh(change?: Change): void {
    const doc = this.app.doc, pageCount = doc.pageCount;
    if (!this.known || change && (change.pages === "all" || change.structure) || this.perPage.length !== pageCount) {
      this.perPage = [];
      for (let page = 0; page < pageCount; page++) this.readPage(page);
      this.known = true;
    } else if (change && Array.isArray(change.pages)) for (const page of change.pages) {
      if (page >= 0 && page < pageCount) this.readPage(page);
    }
    this.cache = this.perPage.flat();
    this.count.textContent = String(this.cache.length);
    this.list.replaceChildren();
    if (!this.cache.length) {
      this.list.append(h("div", { class: "empty-note" }, h("p", { text: "No comments yet." }), h("p", { class: "hint", text: "Highlights, notes, drawings and shapes you add appear here, ready to reply to or edit." })));
      return;
    }
    let lastPage = -1;
    for (const { page, a: annot, replies } of this.cache) {
      if (page !== lastPage) {
        this.list.append(h("div", { class: "cpage", text: `Page ${page + 1}` }));
        lastPage = page;
      }
      const selected = this.app.selectedAnnot?.page === page && this.app.selectedAnnot.index === annot.index, textarea = h("textarea", { class: "ctext", rows: 2, placeholder: "Add a comment", "aria-label": `Comment on ${ANNOT_NAMES[annot.subtype]}, page ${page + 1}` });
      textarea.value = annot.contents;
      const autosize = () => {
        textarea.style.height = "auto";
        textarea.style.height = Math.min(220, textarea.scrollHeight + 2) + "px";
      };
      textarea.addEventListener("input", autosize);
      requestAnimationFrame(autosize);
      textarea.addEventListener("change", () => {
        // Subtype 3 is FreeText.
        if (annot.subtype === 3 && this.onEditFreeText) {
          this.onEditFreeText(page, annot.index, textarea.value);
          return;
        }
        this.app.mutate("Edit comment", { pages: [page] }, () => this.app.doc.setAnnotContents(page, annot.index, textarea.value)).catch((err) => toast(err.message, "err"));
      });
      textarea.addEventListener("keydown", (e) => e.stopPropagation());
      const deleteBtn = h("button", { class: "iconbtn small", type: "button", title: "Delete", "aria-label": "Delete annotation", onclick: (e: MouseEvent) => {
        e.stopPropagation();
        this.app.mutate("Delete annotation", { pages: [page] }, () => this.app.doc.deleteAnnot(page, annot.index)).catch((err) => toast(err.message, "err"));
      } }, icon("trash")), card = h("div", { class: "ccard" + (selected ? " sel" : ""), "data-key": `${page}:${annot.index}` }, h("div", { class: "chead", onclick: () => this.onGo(page, annot) }, h("span", { class: "cdot", style: { background: colorCss(annot.color) } }), h("span", { class: "ctype", text: annot.subtype === 13 && annot.contents === "Signature" ? "Signature" : ANNOT_NAMES[annot.subtype] }), h("span", { class: "cmeta", text: [annot.author, formatPdfDate(annot.modified)].filter(Boolean).join(" · ") }), deleteBtn), textarea);
      for (const reply of replies) {
        const replyText = h("textarea", { class: "ctext reply", rows: 1, "aria-label": `Reply by ${reply.author}` });
        replyText.value = reply.contents;
        const autosizeReply = () => {
          replyText.style.height = "auto";
          replyText.style.height = Math.min(200, replyText.scrollHeight + 2) + "px";
        };
        replyText.addEventListener("input", autosizeReply);
        requestAnimationFrame(autosizeReply);
        replyText.addEventListener("keydown", (e) => e.stopPropagation());
        replyText.addEventListener("change", () => this.app.mutate("Edit reply", { pages: [page] }, () => this.app.doc.setAnnotContents(page, reply.index, replyText.value)).catch((err) => toast(err.message, "err")));
        card.append(h("div", { class: "creply" }, h("div", { class: "chead" }, h("span", { class: "ctype small", text: reply.author || "Reply" }), h("span", { class: "cmeta", text: formatPdfDate(reply.modified) }), h("button", { class: "iconbtn small", type: "button", title: "Delete reply", "aria-label": "Delete reply", onclick: () => this.app.mutate("Delete reply", { pages: [page] }, () => this.app.doc.deleteAnnot(page, reply.index)).catch((err) => toast(err.message, "err")) }, icon("trash"))), replyText));
      }
      const key = `${page}:${annot.index}`, replyInput = h("textarea", { class: "ctext", rows: 2, placeholder: "Write a reply", "aria-label": "Reply" });
      replyInput.addEventListener("keydown", (e) => {
        e.stopPropagation();
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply();
        if (e.key === "Escape") {
          this.replying.delete(key);
          this.refresh();
        }
      });
      const sendReply = () => {
        const text = replyInput.value.trim();
        if (text) {
          this.replying.delete(key);
          this.app.mutate("Reply", { pages: [page] }, () => this.app.doc.addReply(page, annot.index, text, this.app.settings.author)).catch((err) => toast(err.message, "err"));
        }
      }, replyForm = h("div", { class: "creply-form", hidden: !this.replying.has(key) }, replyInput, h("div", { class: "creply-actions" }, h("button", { class: "btn ghost small", type: "button", onclick: () => {
        this.replying.delete(key);
        replyForm.hidden = true;
      } }, "Cancel"), h("button", { class: "btn primary small", type: "button", onclick: sendReply }, "Reply"))), replyLink = h("button", { class: "clink", type: "button", hidden: this.replying.has(key), onclick: () => {
        this.replying.add(key);
        replyForm.hidden = false;
        replyLink.hidden = true;
        replyInput.focus();
      } }, replies.length ? `Reply (${replies.length} so far)` : "Reply");
      card.append(replyForm, replyLink);
      this.list.append(card);
    }
  }
  /** Highlights the card for annotation `index` on `page`, scrolls to it and focuses its text. */
  focus(page: number, index: number): void {
    const card = this.list.querySelector(`[data-key="${page}:${index}"]`);
    if (card) {
      this.list.querySelectorAll(".ccard.sel").forEach((x) => x.classList.remove("sel"));
      card.classList.add("sel");
      card.scrollIntoView({ block: "nearest", behavior: "smooth" });
      card.querySelector("textarea")!.focus();
    }
  }
  /** Opens the reply form on an annotation's card. */
  reply(page: number, index: number): void {
    this.replying.add(`${page}:${index}`);
    this.refresh();
    const card = this.list.querySelector(`[data-key="${page}:${index}"]`);
    if (card) {
      card.scrollIntoView({ block: "nearest" });
      card.querySelector<HTMLTextAreaElement>(".creply-form textarea")?.focus();
    }
  }
  /** Syncs the cards' selected state with the app's selected annotation. */
  markSelected(): void {
    const sel = this.app.selectedAnnot;
    this.list.querySelectorAll<HTMLElement>(".ccard").forEach((card) => card.classList.toggle("sel", !!sel && card.dataset.key === `${sel.page}:${sel.index}`));
  }
}

export { CommentsPanel };
