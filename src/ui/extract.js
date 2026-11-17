import { ye, za } from '../engine/pdfium';
import { ar, ns } from '../engine/text';
import { vs } from '../util/zip';
import { H, nt, y } from './dom';

function xr(u, n, t, e, r) {
  const o = /* @__PURE__ */ new Map(), a = (l) => {
    let h = o.get(l);
    if (h) return h;
    h = l;
    let m = 2;
    for (; r.has(h); ) h = `${l}_${m++}`;
    return o.set(l, h), r.add(h), h;
  }, s = [], i = /* @__PURE__ */ new Map();
  for (const [l, h] of n.entries()) {
    const m = e + l, _ = u.fields(h).filter((p) => p.type !== ye.PUSHBUTTON);
    if (!(!_.length && !t.fields(m).length)) {
      t.removeWidgets(m);
      for (const p of _) {
        const P = p.type === ye.TEXT ? p.multiline ? "multiline" : "text" : p.type === ye.CHECKBOX ? "checkbox" : p.type === ye.RADIO ? "radio" : p.type === ye.COMBO ? "dropdown" : p.type === ye.LIST ? "list" : p.type === ye.SIGNATURE ? "signature" : null;
        if (!P) continue;
        const D = a(p.name || "Field"), x = t.createField(m, P, p.rect, D, { options: p.options.map((w) => w.label), onValue: p.exportValue || "On", joinTo: P === "radio" ? i.get(D) : void 0 });
        P === "radio" && !i.has(D) && i.set(D, { page: m, annot: x });
        const A = p.options.findIndex((w) => w.selected);
        s.push({ page: m, name: D, kind: P, value: p.value, checked: p.checked, exportValue: p.exportValue, selected: A >= 0 ? A : p.options.findIndex((w) => w.label === p.value), options: p.options.map((w) => w.label) });
      }
    }
  }
  return s;
}
async function Ar(u, n, t) {
  const e = u.open(za(n));
  for (const r of t) {
    const o = e.fields(r.page).filter((s) => s.name === r.name), a = r.kind === "radio" ? o.find((s) => s.exportValue === r.exportValue) : o[0];
    a && ((r.kind === "text" || r.kind === "multiline") && r.value ? (e.setFieldText(r.page, a.index, r.value), ar(r.value) && await ns(e, r.page, a.index, r.value)) : (r.kind === "checkbox" || r.kind === "radio") && r.checked && !a.checked ? e.clickField(r.page, a.index) : (r.kind === "dropdown" || r.kind === "list") && (a.options.map((s) => s.label).join(`
`) !== r.options.join(`
`) && e.setFieldOptions(r.page, a.index, r.options), r.selected >= 0 && e.selectOption(r.page, a.index, r.selected)));
  }
  return e;
}
function pa(u) {
  const n = /* @__PURE__ */ new Set();
  for (let t = 0; t < u.pageCount; t++) for (const e of u.fields(t)) n.add(e.name);
  return n;
}
function ir(u, n) {
  const t = /* @__PURE__ */ new Set(), e = u.trim();
  if (!e) throw new Error("Enter the pages to extract");
  for (const r of e.split(/[,;\s]+/).filter(Boolean)) {
    const o = r.match(/^(\d*)\s*[-–]\s*(\d*)$/) || r.match(/^(\d+)$/);
    if (!o) throw new Error(`“${r}” isn’t a page or a range`);
    const a = o[2] === void 0 || o[1] ? +o[1] : 1, s = o[2] === void 0 ? +o[1] : o[2] ? +o[2] : n;
    if (a < 1 || s > n || a > s) throw new Error(`Pages go from 1 to ${n}`);
    for (let i = a; i <= s; i++) t.add(i - 1);
  }
  return [...t].sort((r, o) => r - o);
}
function ln(u) {
  const n = [];
  for (let t = 0; t < u.length; ) {
    let e = t;
    for (; e + 1 < u.length && u[e + 1] === u[e] + 1; ) e++;
    n.push(e > t ? `${u[t] + 1}-${u[e] + 1}` : `${u[t] + 1}`), t = e + 1;
  }
  return n.join(", ");
}
async function Ac(u, n, t, e) {
  const r = u.doc.pageCount, o = y("input", { class: "tinput", id: "ex-range", value: ln(t), placeholder: "e.g. 1-3, 5, 8-", autocomplete: "off" }), a = y("input", { class: "rnum", type: "number", min: "1", max: String(r), value: "2", id: "ex-every", "aria-label": "Pages per file" }), s = (k, G, E = false) => y("label", { class: "hf-check" }, y("input", { type: "radio", name: "ex-mode", value: k, checked: E }), ...G), i = y("input", { type: "checkbox", id: "ex-del" }), l = y("p", { class: "modal-text", id: "ex-status" }), h = y("div", { class: "stack extract" }, y("label", { class: "rfield" }, y("span", { class: "rlabel", text: `Pages (of ${r})` }), o), y("div", { class: "stack", role: "radiogroup", "aria-label": "Output" }, s("one", ["As one PDF"], true), s("each", ["One PDF per page"]), s("every", ["Split every ", a, " pages"])), y("label", { class: "hf-check" }, i, "Remove these pages from this document afterwards"), l), m = () => h.querySelector("input[name=ex-mode]:checked").value, _ = () => {
    const k = ir(o.value, r), G = m();
    if (G === "one") return [k];
    const E = G === "each" ? 1 : Math.max(1, Math.floor(+a.value || 1)), B = [];
    for (let z = 0; z < k.length; z += E) B.push(k.slice(z, z + E));
    return B;
  }, p = () => {
    try {
      const k = _(), G = k.reduce((E, B) => E + B.length, 0);
      l.textContent = k.length === 1 ? `${G} page${G === 1 ? "" : "s"} → 1 PDF` : `${G} pages → ${k.length} PDFs, saved together as a .zip`, l.classList.remove("err"), i.disabled = G >= r, i.disabled && (i.checked = false);
    } catch (k) {
      l.textContent = k.message, l.classList.add("err");
    }
  };
  if (h.addEventListener("input", p), h.addEventListener("change", p), p(), await nt({ title: "Extract pages", body: h, actions: [{ id: "cancel", label: "Cancel" }, { id: "go", label: "Extract", primary: true }] }) !== "go") return;
  let D;
  try {
    D = _();
  } catch (k) {
    H(k.message, "warn");
    return;
  }
  const x = u.fileName.replace(/\.pdf$/i, ""), A = (k) => k.length === 1 ? `${x}_page${k[0] + 1}.pdf` : `${x}_pages${ln(k).replace(/, /g, "_")}.pdf`, w = [];
  for (const k of D) {
    let G = n.create();
    try {
      if (!G.importIndices(u.doc, k, 0)) throw new Error("Those pages could not be copied");
      const E = xr(u.doc, k, G, 0, /* @__PURE__ */ new Set());
      if (E.length) {
        const B = await Ar(n, G.save(), E);
        G.close(), G = B;
      }
      w.push({ name: A(k), data: G.save() });
    } finally {
      G.close();
    }
  }
  if (w.length === 1 ? await e(w[0].data, w[0].name, "application/pdf") : await e(vs(w), `${x}_split.zip`, "application/zip"), i.checked) {
    const k = D.flat().sort((G, E) => E - G);
    await u.mutate(`Remove ${k.length} extracted page${k.length === 1 ? "" : "s"}`, { pages: "all", structure: true }, () => {
      for (const G of k) u.doc.deletePage(G);
      u.selectedPages.clear();
    });
  }
}

export { Ac, Ar, ir, ln, pa, xr };
