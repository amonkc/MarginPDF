import { Jt } from '../engine/pdfium';
import { H, nt, pt, y } from './dom';

function du(u) {
  const n = u.trim();
  return n ? /^[a-z][a-z0-9+.-]*:/i.test(n) ? n : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n) ? "mailto:" + n : /^[^\s]+\.[^\s]{2,}/.test(n) ? "https://" + n : null : null;
}
class mu {
  app;
  v;
  cache = /* @__PURE__ */ new Map();
  constructor(n, t) {
    this.app = n, this.v = t, n.on(() => this.cache.clear());
  }
  of(n) {
    let t = this.cache.get(n);
    return t || (t = this.app.doc.links(n), this.cache.set(n, t)), t;
  }
  overlay(n, t) {
    for (const e of this.of(n.index)) {
      const r = n.tf.box(e.rect), o = e.uri ? e.uri : e.page != null && e.page >= 0 ? `Go to page ${e.page + 1}` : "Link", a = y("a", { class: "lbox" + (t ? " edit" : ""), "data-link": String(e.index), title: t ? `${o} — click to edit` : o, role: "link", "aria-label": o, style: { left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px" } });
      t || (a.addEventListener("pointerdown", (s) => s.stopPropagation()), a.addEventListener("click", (s) => {
        s.preventDefault(), this.follow(e);
      })), n.ov.prepend(a);
    }
  }
  follow(n) {
    if (n.uri) try {
      window.open(n.uri, "_blank", "noopener");
    } catch {
      H(n.uri);
    }
    else n.page != null && n.page >= 0 && n.page < this.app.doc.pageCount && this.v.scrollToPage(n.page);
  }
  down(n, t, e) {
    const r = n.target.closest(".lbox");
    if (r) {
      n.preventDefault();
      const s = this.of(t.index).find((i) => i.index === +r.dataset.link);
      s && this.editDialog(t.index, s);
      return;
    }
    const o = this.v.toPage(t, n), a = (s) => {
      const i = { l: Math.min(o.x, s.x), r: Math.max(o.x, s.x), b: Math.min(o.y, s.y), t: Math.max(o.y, s.y) };
      if (i.t - i.b < 10) {
        const l = Math.min(o.y, s.y) - 3, h = Math.max(o.y, s.y) + 3, m = this.app.doc.selectionRects(t.index, o, s).rects.filter((_) => _.b <= h && _.t >= l && _.r >= i.l - 2 && _.l <= i.r + 2);
        if (m.length) {
          const _ = Jt(m);
          return { l: _.l - 1, r: _.r + 1, b: _.b - 1, t: _.t + 1 };
        }
      }
      return i;
    };
    e(n, t, (s) => {
      const i = t.tf.box(a(s));
      t.svg.replaceChildren(pt("rect", { x: i.x, y: i.y, width: i.w, height: i.h, fill: "rgba(90,162,255,.12)", stroke: "var(--sel)", "stroke-dasharray": "4 3" }));
    }, (s) => {
      const i = a(s);
      i.r - i.l < 4 || i.t - i.b < 4 || this.editDialog(t.index, null, i);
    });
  }
  async editDialog(n, t, e) {
    const r = this.app.doc.pageCount, o = t ? t.uri == null && t.page != null : false, a = y("input", { class: "tinput", id: "link-url", value: t?.uri || "", placeholder: "https://example.com or name@example.com", autocomplete: "off" }), s = y("input", { class: "rnum", id: "link-page", type: "number", min: "1", max: String(r), value: String(t?.page != null && t.page >= 0 ? t.page + 1 : Math.min(r, n + 2)) }), i = (D, x, A) => y("label", { class: "hf-check" }, y("input", { type: "radio", name: "link-kind", value: D, checked: A }), x), l = y("div", { class: "stack link-dialog" }, i("uri", "Web address or email", !o), a, i("page", "A page in this document", o), y("label", { class: "rfield" }, y("span", { class: "rlabel", text: "Page" }), s, y("span", { class: "rlabel", text: `of ${r}` }))), h = () => {
      const D = l.querySelector("input[name=link-kind]:checked").value;
      a.disabled = D !== "uri", s.disabled = D !== "page";
    };
    l.addEventListener("change", h), h(), a.addEventListener("focus", () => {
      l.querySelector("input[value=uri]").checked = true, h();
    });
    const m = await nt({ title: t ? "Edit link" : "Add link", body: l, actions: [...t ? [{ id: "remove", label: "Remove link", danger: true }] : [], { id: "cancel", label: "Cancel" }, { id: "ok", label: t ? "Save" : "Add link", primary: true }] });
    if (m === "remove" && t) {
      await this.app.mutate("Remove link", { pages: [n] }, () => this.app.doc.deleteAnnot(n, t.index)).catch((D) => H(D.message, "err"));
      return;
    }
    if (m !== "ok") return;
    const _ = l.querySelector("input[name=link-kind]:checked").value;
    let p;
    if (_ === "uri") {
      const D = du(a.value);
      if (!D) {
        H("Enter a web address like example.com, or an email address", "warn");
        return;
      }
      p = { uri: D };
    } else {
      const D = Math.round(+s.value);
      if (!(D >= 1 && D <= r)) {
        H(`Pages go from 1 to ${r}`, "warn");
        return;
      }
      p = { page: D - 1 };
    }
    const P = t ? t.rect : e;
    await this.app.mutate(t ? "Edit link" : "Add link", { pages: [n] }, () => {
      t && this.app.doc.deleteAnnot(n, t.index), this.app.doc.addLink(n, P, p);
    }).catch((D) => H(D.message, "err"));
  }
}

export { mu };
