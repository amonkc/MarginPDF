import { unionRect } from '../engine/pdfium';
import { toast, modal, svg, h } from './dom';
import type { Pt, Rect } from '../engine/types';
import type { LinkInfo, LinkTarget } from '../engine/pdfium';
import type { App } from '../app';
import type { PageView, Viewer } from './viewer';

/** Drag helper the interact layer passes to tools (see Interact). */
type DragFn = (ev: PointerEvent, pv: PageView, onMove: (p: Pt) => void, onUp: (p: Pt) => void) => void;

/**
 * Turns what the user typed into a link URI: anything with a scheme is kept, an email address gets
 * `mailto:`, something that looks like a domain gets `https://`. Returns null when it is none of these.
 */
function normalizeLinkTarget(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return s;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return "mailto:" + s;
  if (/^[^\s]+\.[^\s]{2,}/.test(s)) return "https://" + s;
  return null;
}

/** Link tool: shows clickable link boxes on pages, follows them, and adds/edits/removes links. */
class Links {
  app: App;
  v: Viewer;
  /** Links per page index; cleared on every document change. */
  cache: Map<number, LinkInfo[]> = /* @__PURE__ */ new Map();
  constructor(app: App, viewer: Viewer) {
    this.app = app;
    this.v = viewer;
    app.on(() => this.cache.clear());
  }
  /** The links on page `page` (cached). */
  of(page: number): LinkInfo[] {
    let links = this.cache.get(page);
    if (!links) {
      links = this.app.doc.links(page) as LinkInfo[];
      this.cache.set(page, links);
    }
    return links;
  }
  /**
   * Adds a box over each link on the page. With `editing` (the link tool) clicks fall through to `down`;
   * otherwise a click follows the link.
   */
  overlay(pv: PageView, editing: boolean): void {
    for (const link of this.of(pv.index)) {
      const box = pv.tf.box(link.rect), label = link.uri ? link.uri : link.page != null && link.page >= 0 ? `Go to page ${link.page + 1}` : "Link", el = h("a", { class: "lbox" + (editing ? " edit" : ""), "data-link": String(link.index), title: editing ? `${label} — click to edit` : label, role: "link", "aria-label": label, style: { left: box.x + "px", top: box.y + "px", width: box.w + "px", height: box.h + "px" } });
      if (!editing) {
        el.addEventListener("pointerdown", (e) => e.stopPropagation());
        el.addEventListener("click", (e) => {
          e.preventDefault();
          this.follow(link);
        });
      }
      pv.ov.prepend(el);
    }
  }
  /** Opens a link's address in a new tab (or shows it if that fails), or scrolls to its page. */
  follow(link: LinkInfo): void {
    if (link.uri) {
      try {
        window.open(link.uri, "_blank", "noopener");
      } catch {
        toast(link.uri);
      }
    } else if (link.page != null && link.page >= 0 && link.page < this.app.doc.pageCount) this.v.scrollToPage(link.page);
  }
  /**
   * Pointer down with the link tool: on a link box, edit that link; otherwise drag out a new link area.
   * A thin drag over text snaps to the text it covers.
   */
  down(ev: PointerEvent, pv: PageView, drag: DragFn): void {
    const hit = (ev.target as HTMLElement).closest<HTMLElement>(".lbox");
    if (hit) {
      ev.preventDefault();
      const link = this.of(pv.index).find((l) => l.index === +hit.dataset.link!);
      if (link) this.editDialog(pv.index, link);
      return;
    }
    const start: Pt = this.v.toPage(pv, ev), areaFor = (p: Pt): Rect => {
      const rect = { l: Math.min(start.x, p.x), r: Math.max(start.x, p.x), b: Math.min(start.y, p.y), t: Math.max(start.y, p.y) };
      if (rect.t - rect.b < 10) {
        const bottom = Math.min(start.y, p.y) - 3, top = Math.max(start.y, p.y) + 3, lines = (this.app.doc.selectionRects(pv.index, start, p).rects as Rect[]).filter((r) => r.b <= top && r.t >= bottom && r.r >= rect.l - 2 && r.l <= rect.r + 2);
        if (lines.length) {
          const u = unionRect(lines);
          return { l: u.l - 1, r: u.r + 1, b: u.b - 1, t: u.t + 1 };
        }
      }
      return rect;
    };
    drag(ev, pv, (p) => {
      const box = pv.tf.box(areaFor(p));
      pv.svg.replaceChildren(svg("rect", { x: box.x, y: box.y, width: box.w, height: box.h, fill: "rgba(90,162,255,.12)", stroke: "var(--sel)", "stroke-dasharray": "4 3" }));
    }, (p) => {
      const rect = areaFor(p);
      if (rect.r - rect.l < 4 || rect.t - rect.b < 4) return;
      this.editDialog(pv.index, null, rect);
    });
  }
  /** The add/edit link dialog. `link` is the link being edited, or null to add one over `rect`. */
  async editDialog(page: number, link: LinkInfo | null, rect?: Rect): Promise<void> {
    const pageCount: number = this.app.doc.pageCount, isPageLink = link ? link.uri == null && link.page != null : false, urlInput = h("input", { class: "tinput", id: "link-url", value: link?.uri || "", placeholder: "https://example.com or name@example.com", autocomplete: "off" }) as HTMLInputElement, pageInput = h("input", { class: "rnum", id: "link-page", type: "number", min: "1", max: String(pageCount), value: String(link?.page != null && link.page >= 0 ? link.page + 1 : Math.min(pageCount, page + 2)) }) as HTMLInputElement, radio = (value: string, label: string, checked: boolean) => h("label", { class: "hf-check" }, h("input", { type: "radio", name: "link-kind", value: value, checked: checked }), label), body = h("div", { class: "stack link-dialog" }, radio("uri", "Web address or email", !isPageLink), urlInput, radio("page", "A page in this document", isPageLink), h("label", { class: "rfield" }, h("span", { class: "rlabel", text: "Page" }), pageInput, h("span", { class: "rlabel", text: `of ${pageCount}` }))), syncEnabled = () => {
      const kind = body.querySelector<HTMLInputElement>("input[name=link-kind]:checked")!.value;
      urlInput.disabled = kind !== "uri";
      pageInput.disabled = kind !== "page";
    };
    body.addEventListener("change", syncEnabled);
    syncEnabled();
    urlInput.addEventListener("focus", () => {
      body.querySelector<HTMLInputElement>("input[value=uri]")!.checked = true;
      syncEnabled();
    });
    const choice = await modal({ title: link ? "Edit link" : "Add link", body: body, actions: [...link ? [{ id: "remove", label: "Remove link", danger: true }] : [], { id: "cancel", label: "Cancel" }, { id: "ok", label: link ? "Save" : "Add link", primary: true }] });
    if (choice === "remove" && link) {
      await this.app.mutate("Remove link", { pages: [page] }, () => this.app.doc.deleteAnnot(page, link.index)).catch((err) => toast(err.message, "err"));
      return;
    }
    if (choice !== "ok") return;
    const kind = body.querySelector<HTMLInputElement>("input[name=link-kind]:checked")!.value;
    let target: LinkTarget;
    if (kind === "uri") {
      const uri = normalizeLinkTarget(urlInput.value);
      if (!uri) {
        toast("Enter a web address like example.com, or an email address", "warn");
        return;
      }
      target = { uri: uri };
    } else {
      const pageNo = Math.round(+pageInput.value);
      if (!(pageNo >= 1 && pageNo <= pageCount)) {
        toast(`Pages go from 1 to ${pageCount}`, "warn");
        return;
      }
      target = { page: pageNo - 1 };
    }
    const area = link ? link.rect : rect!;
    await this.app.mutate(link ? "Edit link" : "Add link", { pages: [page] }, () => {
      if (link) this.app.doc.deleteAnnot(page, link.index);
      this.app.doc.addLink(page, area, target);
    }).catch((err) => toast(err.message, "err"));
  }
}

export { Links };
