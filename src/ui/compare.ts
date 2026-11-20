// Compare two versions of a PDF: text changes (removed words in red on the earlier version, added words in green
// on the later one, with a list to step through) and a visual overlay (pixels that differ, page by page).
// Full screen, like the scanner; both documents stay on this device.

import type { Doc } from '../engine/pdfium';
import type { Rect } from '../engine/types';
import { diffTokens } from './diff';
import { h, icon } from './dom';

type Token = { t: string; rects: Rect[]; page: number };
/** One change: tokens removed from the earlier version and/or added in the later one. */
type Hunk = { del: Token[]; ins: Token[]; page: number; side: "a" | "b" };
type Side = { doc: Doc; name: string; tokens: Token[] };

/** All pages' words and punctuation, in reading order. */
function tokensOf(doc: Doc): Token[] {
  const out: Token[] = [];
  for (let page = 0; page < doc.pageCount; page++) for (const token of doc.pageTokens(page)) out.push({ ...token, page });
  return out;
}

/** The changes between two documents' text: whole-document diff, or page by page when they differ too much. */
function changes(a: Token[], b: Token[], pagesA: number, pagesB: number): Hunk[] {
  const runs = diffTokens(a.map((t) => t.t), b.map((t) => t.t));
  if (!runs) {
    // Too different for one diff: compare page n with page n.
    const out: Hunk[] = [];
    for (let p = 0; p < Math.max(pagesA, pagesB); p++) out.push(...changes(a.filter((t) => t.page === p), b.filter((t) => t.page === p), 0, 0));
    return out;
  }
  const hunks: Hunk[] = [];
  let current: Hunk | null = null, lastB = 0;
  for (const run of runs) {
    if (run.kind === "equal") {
      current = null;
      lastB = b[run.b + run.n - 1]?.page ?? lastB;
      continue;
    }
    if (!current) hunks.push((current = { del: [], ins: [], page: lastB, side: "b" }));
    if (run.kind === "del") current.del.push(...a.slice(run.a, run.a + run.n));
    else current.ins.push(...b.slice(run.b, run.b + run.n));
  }
  for (const hunk of hunks) {
    if (hunk.ins.length) hunk.page = hunk.ins[0].page;
    else {
      hunk.side = "a";
      hunk.page = hunk.del[0].page;
    }
  }
  return hunks;
}

const snippet = (tokens: Token[]): string => {
  const text = tokens.map((t) => t.t).join(" ").replace(/\s+([,.;:!?)])/g, "$1");
  return text.length > 80 ? text.slice(0, 77) + "…" : text;
};

/** Opens the comparison of `before` (an earlier version) with `after`; resolves when it's closed. */
function compareDocs(before: { doc: Doc; name: string }, after: { doc: Doc; name: string }): Promise<void> {
  return new Promise((resolve) => {
    let a: Side = { ...before, tokens: tokensOf(before.doc) }, b: Side = { ...after, tokens: tokensOf(after.doc) };
    let hunks: Hunk[] = [], mode: "text" | "overlay" = "text", focus = -1, narrowSide: "a" | "b" = "b";
    const summary = h("p", { class: "cmp-summary", role: "status" });
    const list = h("ol", { class: "cmp-list" });
    const colA = h("div", { class: "cmp-col", "data-side": "a" }), colB = h("div", { class: "cmp-col", "data-side": "b" }), colO = h("div", { class: "cmp-col cmp-overlay" });
    const labelA = h("span", { class: "cmp-label del" }), labelB = h("span", { class: "cmp-label ins" });
    const tab = (id: typeof mode, label: string) => h("button", { class: "scan-chip", type: "button", "data-mode": id, text: label, onclick: () => setMode(id) });
    const sideTab = (id: "a" | "b", label: string) => h("button", { class: "scan-chip", type: "button", "data-side": id, text: label, onclick: () => ((narrowSide = id), layout()) });
    const prev = h("button", { class: "btn", type: "button", "aria-label": "Previous change", title: "Previous change", onclick: () => go(focus - 1) }, icon("up"));
    const next = h("button", { class: "btn", type: "button", "aria-label": "Next change", title: "Next change", onclick: () => go(focus + 1) }, icon("down"));
    const root = h("div", { class: "scan cmp", role: "dialog", "aria-modal": "true", "aria-label": "Compare" },
      h("header", { class: "scan-head" }, h("h2", { text: "Compare" }),
        h("div", { class: "scan-chips", role: "group", "aria-label": "View" }, tab("text", "Text changes"), tab("overlay", "Overlay")),
        h("button", { class: "iconbtn", type: "button", "aria-label": "Close", title: "Close", onclick: () => close() }, icon("close"))),
      h("div", { class: "cmp-bar" }, labelA, h("button", { class: "btn", type: "button", text: "Swap", title: "Swap which is before and after", onclick: () => swap() }), labelB,
        h("div", { class: "cmp-nav" }, prev, next), h("div", { class: "scan-chips cmp-sides", role: "group", "aria-label": "Version" }, sideTab("a", "Before"), sideTab("b", "After"))),
      summary,
      h("div", { class: "cmp-body" }, h("aside", { class: "cmp-side" }, list), colA, colB, colO));
    document.body.append(root);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowDown" && !(e.target as Element).closest("input")) go(focus + 1);
      else if (e.key === "ArrowUp" && !(e.target as Element).closest("input")) go(focus - 1);
    };
    document.addEventListener("keydown", onKey);

    // ---- pages: rendered when they scroll into view, with the change boxes laid over them
    const observer = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && paint(e.target as HTMLElement)), { root: null, rootMargin: "400px" });
    const pageWidth = (col: HTMLElement) => Math.max(160, Math.min(col === colO ? 900 : 1400, col.clientWidth - 24));
    function build(col: HTMLElement, side: Side | null) {
      col.replaceChildren();
      const docs = side ? [side.doc] : [a.doc, b.doc], count = Math.max(...docs.map((d) => d.pageCount)), width = pageWidth(col);
      for (let page = 0; page < count; page++) {
        const sizeDoc = side ? side.doc : page < b.doc.pageCount ? b.doc : a.doc;
        if (page >= sizeDoc.pageCount) continue;
        const size = sizeDoc.pageSize(page), height = (width * size.h) / size.w;
        const el = h("div", { class: "cmp-page", "data-page": String(page) }, h("span", { class: "cmp-num", text: String(page + 1) }));
        el.style.width = width + "px";
        el.style.height = height + "px";
        col.append(el);
        observer.observe(el);
      }
    }
    function paint(el: HTMLElement) {
      if (el.dataset.painted) return;
      el.dataset.painted = "1";
      const page = +el.dataset.page!, col = el.parentElement!, w = el.clientWidth, hgt = el.clientHeight, dpr = devicePixelRatio || 1;
      const canvas = h("canvas") as HTMLCanvasElement;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(hgt * dpr);
      const ctx = canvas.getContext("2d")!;
      if (col === colO) ctx.putImageData(overlayImage(page, canvas.width, canvas.height), 0, 0);
      else {
        const side = col === colA ? a : b;
        ctx.putImageData(side.doc.render(page, canvas.width, canvas.height), 0, 0);
        const tf = side.doc.transform(page, w, hgt);
        hunks.forEach((hunk, n) => {
          for (const token of col === colA ? hunk.del : hunk.ins) {
            if (token.page !== page) continue;
            for (const rect of token.rects) {
              const box = tf.box(rect), mark = h("div", { class: "cmp-mark " + (col === colA ? "del" : "ins"), "data-hunk": String(n) });
              Object.assign(mark.style, { left: box.x - 1 + "px", top: box.y - 1 + "px", width: box.w + 2 + "px", height: box.h + 2 + "px" });
              el.append(mark);
            }
          }
        });
      }
      el.prepend(canvas);
    }
    /** Page n of both versions at the same size: unchanged ink faded, ink only in the earlier version red, only in the later green. */
    function overlayImage(page: number, w: number, hgt: number): ImageData {
      const blank = new ImageData(w, hgt);
      blank.data.fill(255);
      const ia = page < a.doc.pageCount ? a.doc.render(page, w, hgt) : blank, ib = page < b.doc.pageCount ? b.doc.render(page, w, hgt) : blank, out = new ImageData(w, hgt), da = ia.data, db = ib.data, d = out.data;
      for (let i = 0; i < d.length; i += 4) {
        const la = (da[i] * 77 + da[i + 1] * 150 + da[i + 2] * 29) >> 8, lb = (db[i] * 77 + db[i + 1] * 150 + db[i + 2] * 29) >> 8;
        if (Math.abs(la - lb) > 48) {
          const removed = la < lb;
          d[i] = removed ? 222 : 22;
          d[i + 1] = removed ? 45 : 160;
          d[i + 2] = removed ? 45 : 70;
        } else {
          const v = 255 - (255 - lb) * 0.35;
          d[i] = d[i + 1] = d[i + 2] = v;
        }
        d[i + 3] = 255;
      }
      return out;
    }

    // ---- the list of changes
    function refresh() {
      hunks = changes(a.tokens, b.tokens, a.doc.pageCount, b.doc.pageCount);
      const added = hunks.reduce((n, x) => n + x.ins.length, 0), removed = hunks.reduce((n, x) => n + x.del.length, 0);
      labelA.textContent = "Before: " + a.name;
      labelB.textContent = "After: " + b.name;
      summary.textContent = !a.tokens.length && !b.tokens.length
        ? "Neither version has text to compare (scans?). Use Overlay to see what changed, or recognise the text first."
        : hunks.length ? `${hunks.length} change${hunks.length === 1 ? "" : "s"}: ${added} word${added === 1 ? "" : "s"} added, ${removed} removed.` : "The text is the same. Overlay shows any differences in pictures, drawings or layout.";
      list.replaceChildren(...hunks.map((hunk, n) => h("li", {},
        h("button", { type: "button", class: "cmp-item", "data-hunk": String(n), onclick: () => go(n) },
          h("span", { class: "cmp-where", text: `Page ${hunk.page + 1}` }),
          hunk.del.length ? h("del", { text: snippet(hunk.del) }) : null,
          hunk.ins.length ? h("ins", { text: snippet(hunk.ins) }) : null))));
      focus = -1;
      layout();
    }
    function layout() {
      const narrow = innerWidth < 760;
      root.classList.toggle("narrow", narrow);
      colA.hidden = mode !== "text" || (narrow && narrowSide !== "a");
      colB.hidden = mode !== "text" || (narrow && narrowSide !== "b");
      colO.hidden = mode !== "overlay";
      root.querySelectorAll<HTMLElement>("[data-mode]").forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.mode === mode)));
      root.querySelectorAll<HTMLElement>(".cmp-sides [data-side]").forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.side === narrowSide)));
      (root.querySelector(".cmp-sides") as HTMLElement).hidden = !narrow || mode !== "text";
      (root.querySelector(".cmp-side") as HTMLElement).hidden = mode !== "text" || !hunks.length;
      prev.disabled = next.disabled = mode !== "text" || !hunks.length;
      requestAnimationFrame(() => {
        if (!colA.hidden) build(colA, a);
        if (!colB.hidden) build(colB, b);
        if (!colO.hidden) build(colO, null);
      });
    }
    function go(n: number) {
      if (!hunks.length) return;
      focus = (n + hunks.length) % hunks.length;
      const hunk = hunks[focus];
      root.querySelectorAll(".cmp-item.on, .cmp-mark.on").forEach((el) => el.classList.remove("on"));
      root.querySelector(`.cmp-item[data-hunk="${focus}"]`)?.classList.add("on");
      root.querySelector(`.cmp-item[data-hunk="${focus}"]`)?.scrollIntoView({ block: "nearest" });
      for (const [col, tokens] of [[colA, hunk.del], [colB, hunk.ins]] as [HTMLElement, Token[]][]) {
        if (col.hidden) continue;
        const page = tokens[0]?.page ?? (col === colA ? nearestPage(a, hunk) : hunk.page), el = col.querySelector<HTMLElement>(`.cmp-page[data-page="${page}"]`);
        if (!el) continue;
        paint(el);
        const mark = el.querySelector<HTMLElement>(`.cmp-mark[data-hunk="${focus}"]`);
        col.scrollTo({ top: el.offsetTop - col.offsetTop + (mark ? mark.offsetTop - col.clientHeight / 3 : 0), behavior: "smooth" });
        col.querySelectorAll(`.cmp-mark[data-hunk="${focus}"]`).forEach((m) => m.classList.add("on"));
      }
    }
    /** For a change with nothing removed: the earlier version's page at that point. */
    const nearestPage = (side: Side, hunk: Hunk) => Math.min(side.doc.pageCount - 1, hunk.page);
    function setMode(id: typeof mode) {
      mode = id;
      layout();
    }
    function swap() {
      [a, b] = [b, a];
      refresh();
    }
    // Scrolling one column scrolls the other to the same page.
    for (const [from, to] of [[colA, colB], [colB, colA]]) {
      from.addEventListener("scroll", () => {
        if (to.hidden || from.dataset.syncing) return;
        const pages = [...from.querySelectorAll<HTMLElement>(".cmp-page")], top = from.scrollTop + from.offsetTop;
        const current = pages.find((el) => el.offsetTop + el.offsetHeight > top);
        const target = current && to.querySelector<HTMLElement>(`.cmp-page[data-page="${current.dataset.page}"]`);
        if (!current || !target) return;
        to.dataset.syncing = "1";
        to.scrollTop = target.offsetTop - to.offsetTop + ((top - current.offsetTop) / current.offsetHeight) * target.offsetHeight;
        requestAnimationFrame(() => delete to.dataset.syncing);
      });
    }
    const onResize = () => layout();
    addEventListener("resize", onResize);
    function close() {
      observer.disconnect();
      document.removeEventListener("keydown", onKey);
      removeEventListener("resize", onResize);
      root.remove();
      resolve();
    }
    refresh();
  });
}

export { compareDocs, changes, tokensOf };
