import { Tr, gl, gt, os, sn } from '../engine/text';
import { H, Ve, nt, y } from './dom';

const ue = (u) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${u}</svg>`;
const ss = { select: ue('<path d="M5 3l6 17 2.5-7L20 10.5z"/>'), edittext: ue('<path d="M4 6V4h12v2"/><path d="M10 4v15"/><path d="M8 19h4"/><path d="M14.5 17.5l5-5 2 2-5 5H14.5z"/>'), addtext: ue('<rect x="3.5" y="5" width="17" height="14" rx="2" stroke-dasharray="2.5 2"/><path d="M8 9h8M12 9v7"/>'), highlight: ue('<path d="M8 14l-3 3v3h3l3-3"/><path d="M11.5 6.5l6 6"/><path d="M8 14l7.5-7.5a2.1 2.1 0 013 3L11 17z"/>'), underline: ue('<path d="M7 4v6a5 5 0 0010 0V4"/><path d="M5 20h14"/>'), strike: ue('<path d="M16 6.5C15 5 13.6 4.5 12 4.5c-2.5 0-4 1.3-4 3 0 4 8 2.5 8 7 0 1.8-1.7 3-4 3-1.8 0-3.4-.7-4.3-2"/><path d="M4 12h16"/>'), draw: ue('<path d="M3 17c3-1 3.5-7 6.5-7s2 6 5 6 3-4 6.5-5"/>'), rect: ue('<rect x="4" y="5.5" width="16" height="13" rx="1"/>'), ellipse: ue('<ellipse cx="12" cy="12" rx="8.5" ry="6.5"/>'), note: ue('<path d="M5 4h14v11l-5 5H5z"/><path d="M14 20v-5h5"/><path d="M8.5 9h7M8.5 12.5h4"/>'), sign: ue('<path d="M3 16c2.5 0 3-8 5.5-8S9 15 11 15s1.5-3 3.5-3 1 3 3.5 3H21"/><path d="M3 20h18"/>'), open: ue('<path d="M3.5 7a2 2 0 012-2h4l2 2.5h7a2 2 0 012 2V17a2 2 0 01-2 2h-13a2 2 0 01-2-2z"/>'), merge: ue('<path d="M7 4v5a3 3 0 003 3h4a3 3 0 013 3v5"/><path d="M17 4v5a3 3 0 01-3 3"/><path d="M14 17l3 3 3-3"/>'), save: ue('<path d="M12 4v11"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M5 20h14"/>'), undo: ue('<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>'), redo: ue('<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 000 11H13"/>'), zoomin: ue('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20M8 10.5h5M10.5 8v5"/>'), zoomout: ue('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20M8 10.5h5"/>'), fit: ue('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'), search: ue('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>'), up: ue('<path d="M6 15l6-6 6 6"/>'), arrange: ue('<rect x="6.5" y="6.5" width="11" height="11" stroke-dasharray="2 2"/><path d="M3 3h4M3 3v4M21 3h-4M21 3v4M3 21h4M3 21v-4M21 21h-4M21 21v-4"/>'), alignl: ue('<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>'), alignc: ue('<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>'), alignr: ue('<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>'), left: ue('<path d="M15 6l-6 6 6 6"/>'), right: ue('<path d="M9 6l6 6-6 6"/>'), down: ue('<path d="M6 9l6 6 6-6"/>'), close: ue('<path d="M6 6l12 12M18 6L6 18"/>'), rotl: ue('<path d="M4 4v5h5"/><path d="M4.5 9A8 8 0 1112 20"/>'), rotr: ue('<path d="M20 4v5h-5"/><path d="M19.5 9A8 8 0 1012 20"/>'), trash: ue('<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12"/><path d="M9 7V4h6v3"/>'), plus: ue('<path d="M12 5v14M5 12h14"/>'), extract: ue('<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/><path d="M12 18v-6M9 15l3 3 3-3"/>'), pages: ue('<rect x="4" y="3" width="11" height="14" rx="1.5"/><path d="M9 21h9a2 2 0 002-2V8"/>'), comments: ue('<path d="M4 5h16v11H9l-5 4z"/>'), image: ue('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M20 16l-5-5-8 8"/>'), line: ue('<path d="M5 19L19 5"/><path d="M11 5h8v8"/>'), textbox: ue('<rect x="3.5" y="4.5" width="17" height="12" rx="1.5"/><path d="M7 8.5h10M7 12.5h6"/><path d="M8 16.5l-2 4"/>'), stamp: ue('<path d="M9 11V6a3 3 0 016 0v5"/><path d="M5 11h14l-1 5H6z"/><path d="M4 20h16"/>'), watermark: ue('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 16l8-8" stroke-width="2.6" opacity=".45"/>'), replace: ue('<path d="M4 7h11l-3-3M20 17H9l3 3"/>'), link: ue('<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'), alignj: ue('<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>'), more: ue('<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>'), image2: ue('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/>'), "al-left": ue('<path d="M4 3v18"/><rect x="7" y="6" width="11" height="4" rx="1"/><rect x="7" y="14" width="7" height="4" rx="1"/>'), "al-hcenter": ue('<path d="M12 3v18"/><rect x="5" y="6" width="14" height="4" rx="1"/><rect x="8" y="14" width="8" height="4" rx="1"/>'), "al-right": ue('<path d="M20 3v18"/><rect x="6" y="6" width="11" height="4" rx="1"/><rect x="10" y="14" width="7" height="4" rx="1"/>'), "al-top": ue('<path d="M3 4h18"/><rect x="6" y="7" width="4" height="11" rx="1"/><rect x="14" y="7" width="4" height="7" rx="1"/>'), "al-vmiddle": ue('<path d="M3 12h18"/><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="8" width="4" height="8" rx="1"/>'), "al-bottom": ue('<path d="M3 20h18"/><rect x="6" y="6" width="4" height="11" rx="1"/><rect x="14" y="10" width="4" height="7" rx="1"/>'), "dist-h": ue('<path d="M3 4v16M21 4v16"/><rect x="9" y="7" width="6" height="10" rx="1"/>'), "dist-v": ue('<path d="M4 3h16M4 21h16"/><rect x="7" y="9" width="10" height="6" rx="1"/>'), "match-w": ue('<rect x="4" y="5" width="16" height="5" rx="1"/><rect x="4" y="14" width="16" height="5" rx="1" stroke-dasharray="2 2"/>'), "match-h": ue('<rect x="5" y="4" width="5" height="16" rx="1"/><rect x="14" y="4" width="5" height="16" rx="1" stroke-dasharray="2 2"/>'), "match-both": ue('<rect x="3" y="3" width="9" height="9" rx="1"/><rect x="12" y="12" width="9" height="9" rx="1" stroke-dasharray="2 2"/>'), "z-front": ue('<rect x="4" y="4" width="10" height="10" rx="1" opacity=".45"/><rect x="10" y="10" width="10" height="10" rx="1" fill="currentColor" fill-opacity=".35"/>'), "z-forward": ue('<rect x="4" y="4" width="10" height="10" rx="1" opacity=".45"/><rect x="10" y="10" width="10" height="10" rx="1"/><path d="M15 3l3 3-3 3"/>'), "z-backward": ue('<rect x="10" y="10" width="10" height="10" rx="1" opacity=".45"/><rect x="4" y="4" width="10" height="10" rx="1"/><path d="M9 21l-3-3 3-3"/>'), "z-back": ue('<rect x="10" y="10" width="10" height="10" rx="1"/><rect x="4" y="4" width="10" height="10" rx="1" fill="currentColor" fill-opacity=".35" opacity=".45"/>'), print: ue('<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'), copy: ue('<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/>'), paste: ue('<path d="M9 4h6v3H9z"/><path d="M9 5.5H7a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5a2 2 0 0 0-2-2h-2"/><path d="M9 13h6M9 16.5h4"/>'), lock: ue('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2" stroke-width="2.2"/>'), flatten: ue('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5" opacity=".55"/><path d="M3 17.5l9 5 9-5" opacity=".3"/>'), redact: ue('<rect x="3" y="6" width="18" height="5" rx="1" fill="currentColor" stroke="none"/><path d="M3 15h8M3 19h13"/>'), formfield: ue('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="6" height="6" rx="1"/><path d="M4.5 17l1.3 1.3L8 15.5M12 17h8"/>'), listb: ue('<circle cx="5" cy="7" r="1.3" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="5" cy="17" r="1.3" fill="currentColor" stroke="none"/><path d="M9.5 7H20M9.5 12H20M9.5 17H20"/>'), listn: ue('<path d="M4 5.5h1.5V9M4 9h3M4 14.5c0-1 2.8-1 2.8.3 0 1.2-2.8 1.6-2.8 3.2h3"/><path d="M10 7H20M10 12H20M10 17H20"/>'), fliph: ue('<path d="M12 3v18" stroke-dasharray="2 2"/><path d="M9 7L4 17h5zM15 7l5 10h-5z"/>'), flipv: ue('<path d="M3 12h18" stroke-dasharray="2 2"/><path d="M7 9L17 4v5zM7 15l10 5v-5z"/>'), crop: ue('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'), hf: ue('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7 6.5h10M7 17.5h4M15 17.5h2"/><path d="M7 10.5h10M7 13.5h7" opacity=".45"/>'), form: ue('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>') };
const gn = ["hl", "hc", "hr", "fl", "fc", "fr"];
const xl = { text: { hl: "", hc: "", hr: "", fl: "{file}", fc: "", fr: "Page {page} of {pages}" }, fontKey: "sarabun", size: 9, color: [90, 94, 104, 255], margin: 28, range: "all", from: 1, to: 1, start: 1, thaiDigits: false, images: {}, imageHeight: 24 };
const Al = "๐๑๒๓๔๕๖๗๘๙";
const kl = () => (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
function El(u, n, t) {
  const e = u.replace(/\{(page|pages|date|file)\}/g, (r, o) => n[o]);
  return t ? e.replace(/[0-9]/g, (r) => Al[+r]) : e;
}
async function Sl(u, n) {
  const t = new Image();
  t.src = u, await t.decode();
  const e = (t.naturalWidth || 1) / (t.naturalHeight || 1), r = Math.max(8, Math.min(1200, Math.round(n * 4))), o = Math.max(8, Math.min(2400, Math.round(r * e))), a = document.createElement("canvas");
  a.width = o, a.height = r;
  const s = a.getContext("2d");
  return s.drawImage(t, 0, 0, o, r), { rgba: s.getImageData(0, 0, o, r).data, w: o, h: r, aspect: e };
}
function is(u, n) {
  for (const t of n) for (const e of gn) gt(u.doc, t, "hf-" + e);
}
function ls(u, n) {
  const t = n.range === "skipFirst" ? 1 : n.range === "custom" ? Math.max(0, n.from - 1) : 0, e = n.range === "custom" ? Math.min(u - 1, n.to - 1) : u - 1, r = [];
  for (let o = t; o <= e; o++) r.push(o);
  return { pages: r, first: t, total: n.start + r.length - 1 };
}
const Cn = /* @__PURE__ */ new Map();
async function cs(u) {
  const n = {};
  for (const t of gn) {
    const e = u.images?.[t];
    if (!e) continue;
    const r = u.imageHeight + "|" + e;
    let o = Cn.get(r);
    o || (o = Sl(e, u.imageHeight), Cn.set(r, o), Cn.size > 24 && Cn.delete(Cn.keys().next().value)), n[t] = await o.catch(() => {
      throw Cn.delete(r), new Error("One of the images could not be read");
    });
  }
  return n;
}
async function us(u, n, t, e, r, o, a) {
  const s = { page: String(t), pages: String(e), date: kl(), file: r }, { w: i, h: l } = u.pageSize(n), h = u.transform(n, i, l).invert(), [m, _] = h.apply(0, 0), [p, P] = h.apply(1, 0), [D, x] = h.apply(0, 1), A = p - m, w = P - _, k = -(D - m), G = -(x - _);
  for (const E of gn) {
    const B = El(o.text[E] || "", s, o.thaiDigits).trim(), z = a[E];
    if (!B && !z) continue;
    const O = o.imageHeight, W = z ? O * z.aspect : 0, N = z && B ? o.size * 0.6 : 0, V = B ? await os(o.fontKey, B, o.size) : 0, q = W + N + V, Y = E[1] === "l" ? o.margin : E[1] === "c" ? (i - q) / 2 : i - o.margin - q, ne = Math.max(z ? O : 0, o.size), J = E[0] === "h" ? o.margin : l - o.margin - ne, ee = "hf-" + E;
    if (z) {
      const ae = J + (ne - O) / 2, [de, oe] = h.apply(Y, ae + O);
      gl(u, n, z.rgba, z.w, z.h, [A * W, w * W, k * O, G * O, de, oe], ee);
    }
    if (B) {
      const ae = z ? J + ne / 2 + o.size * 0.35 : E[0] === "h" ? o.margin + o.size * 0.8 : l - o.margin, [de, oe] = h.apply(Y + W + N, ae);
      await Tr(u, n, { lines: [B], fontKey: o.fontKey, size: o.size, color: o.color, matrix: [A, w, k, G, de, oe], id: ee });
    }
  }
}
const hs = (u) => u.fileName.replace(/\.pdf$/i, "");
async function Cl(u, n) {
  const t = u.doc, e = t.pageCount, { pages: r, total: o } = ls(e, n);
  if (!r.length) throw new Error("That page range is empty");
  const a = await cs(n);
  is(u, [...Array(e).keys()]);
  for (const [s, i] of r.entries()) await us(t, i, n.start + s, o, hs(u), n, a);
  return r.length;
}
async function Ml(u, n, t, e) {
  const { pages: r, first: o, total: a } = ls(u.doc.pageCount, t), s = u.lib.create();
  try {
    s.importIndices(u.doc, [n], 0);
    for (const _ of gn) gt(s, 0, "hf-" + _);
    const i = r.includes(n);
    i && await us(s, 0, t.start + (n - o), a, hs(u), t, await cs(t));
    const { w: l, h } = s.pageSize(0), m = e / l * Math.min(2, devicePixelRatio || 1);
    return { img: s.render(0, l * m, h * m), w: l, h, scale: m, inRange: i };
  } finally {
    s.close();
  }
}
async function Gl(u, n, t) {
  const e = JSON.parse(JSON.stringify(n));
  e.images ||= {}, e.imageHeight ||= 24;
  const r = u.doc.pageCount;
  (e.to < 1 || e.to > r) && (e.to = r);
  const o = {};
  let a = () => {
  };
  const s = (ce, Ge) => {
    const ge = (ce[0] === "h" ? "Header " : "Footer ") + Ge.toLowerCase(), $e = y("input", { class: "tinput", id: "hf-" + ce, type: "text", value: e.text[ce], placeholder: Ge, "aria-label": ge + " text" });
    $e.addEventListener("focus", () => i = $e), o[ce] = $e;
    const Ce = y("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/svg+xml", hidden: true, id: "hf-img-" + ce }), Ee = y("button", { class: "hf-img", type: "button", title: "Add an image", "aria-label": ge + " image" }), Oe = y("button", { class: "hf-img-x", type: "button", title: "Remove image", "aria-label": "Remove " + ge + " image", text: "×" }), Ke = () => {
      const Xe = e.images[ce];
      Ee.replaceChildren(Xe ? y("img", { src: Xe, alt: "" }) : Ve("image")), Ee.classList.toggle("has", !!Xe), Oe.hidden = !Xe;
    };
    return Ee.addEventListener("click", () => Ce.click()), Oe.addEventListener("click", () => {
      delete e.images[ce], Ke();
    }), Ce.addEventListener("change", () => {
      const Xe = Ce.files?.[0];
      if (Ce.value = "", !Xe) return;
      if (Xe.size > 4 * 1024 * 1024) return H("Choose an image under 4 MB", "warn");
      const dt = new FileReader();
      dt.onload = () => {
        e.images[ce] = String(dt.result), Ke(), a();
      }, dt.readAsDataURL(Xe);
    }), Ke(), y("div", { class: "hf-slot" }, $e, Ee, Oe, Ce);
  };
  let i = null;
  const l = (ce, Ge) => y("button", { class: "chip", type: "button", text: Ge, onclick: () => {
    const ge = i || o.fr, $e = ge.selectionStart ?? ge.value.length, Ce = ge.selectionEnd ?? $e;
    ge.value = ge.value.slice(0, $e) + ce + ge.value.slice(Ce), ge.focus(), ge.setSelectionRange($e + ce.length, $e + ce.length);
  } }), h = y("select", { class: "rselect", id: "hf-font", "aria-label": "Font" }, ...["Thai + Latin", "Latin", "Standard"].map((ce) => y("optgroup", { label: ce }, ...sn.filter((Ge) => Ge.group === ce).map((Ge) => y("option", { value: Ge.key, text: Ge.label, selected: Ge.key === e.fontKey }))))), m = (ce, Ge, ge, $e, Ce) => y("input", { class: "rnum", id: ce, type: "number", value: String(Ge), min: String(ge), max: String($e), "aria-label": Ce }), _ = m("hf-size", e.size, 5, 36, "Font size"), p = m("hf-margin", e.margin, 6, 144, "Margin from page edge"), P = m("hf-start", e.start, 0, 99999, "First page number"), D = m("hf-imgh", e.imageHeight, 6, 120, "Image height"), x = m("hf-from", e.from, 1, r, "From page"), A = m("hf-to", e.to, 1, r, "To page"), w = y("select", { class: "rselect", id: "hf-range", "aria-label": "Pages" }, y("option", { value: "all", text: `All ${r} pages`, selected: e.range === "all" }), y("option", { value: "skipFirst", text: "All except the first page", selected: e.range === "skipFirst" }), y("option", { value: "custom", text: "Page range", selected: e.range === "custom" })), k = y("span", { class: "withunit" }, x, y("span", { class: "unit", text: "to" }), A), G = () => {
    k.hidden = w.value !== "custom";
  };
  w.addEventListener("change", G), G();
  const E = y("input", { type: "checkbox", id: "hf-thai", checked: e.thaiDigits }), B = (ce) => y("button", { class: "sw" + (ce.join() === e.color.join() ? " on" : ""), type: "button", "aria-label": `rgb ${ce.slice(0, 3).join(" ")}`, style: { background: `rgb(${ce[0]},${ce[1]},${ce[2]})` }, onclick: (Ge) => {
    e.color = ce, Ge.currentTarget.parentElement.querySelectorAll(".sw").forEach((ge) => ge.classList.remove("on")), Ge.currentTarget.classList.add("on");
  } }), z = (ce, ...Ge) => y("div", { class: "hf-row" }, y("span", { class: "rlabel", text: ce }), y("div", { class: "hf-ctrl" }, ...Ge)), O = y("div", { class: "hf" }, y("div", { class: "hf-grid" }, y("span", { class: "rlabel", text: "Header" }), s("hl", "Left"), s("hc", "Center"), s("hr", "Right"), y("span", { class: "rlabel", text: "Footer" }), s("fl", "Left"), s("fc", "Center"), s("fr", "Right")), y("div", { class: "hf-tokens" }, y("span", { class: "hint", text: "Insert:" }), l("{page}", "Page number"), l("{pages}", "Page count"), l("{date}", "Date"), l("{file}", "File name")), z("Text", h, y("span", { class: "withunit" }, _, y("span", { class: "unit", text: "pt" })), y("div", { class: "swatches" }, ...[[90, 94, 104, 255], [24, 26, 33, 255], [214, 69, 52, 255], [37, 99, 235, 255]].map(B))), z("Pages", w, k), z("Numbering", y("span", { class: "withunit" }, y("span", { class: "unit", text: "Start at" }), P), y("label", { class: "hf-check" }, E, "Thai digits (๑ ๒ ๓)")), z("Images", y("span", { class: "withunit" }, y("span", { class: "unit", text: "Height" }), D, y("span", { class: "unit", text: "pt" })), y("span", { class: "hint", text: "Use the image button beside a position. Images sit before that position’s text." })), z("Margin", y("span", { class: "withunit" }, p, y("span", { class: "unit", text: "pt from the edge" })))), W = () => {
    for (const ce of gn) e.text[ce] = o[ce].value;
    e.fontKey = h.value, e.size = Math.max(5, Math.min(36, +_.value || 9)), e.margin = Math.max(6, Math.min(144, +p.value || 28)), e.imageHeight = Math.max(6, Math.min(120, +D.value || 24)), e.start = Math.max(0, Math.round(+P.value || 1)), e.range = w.value, e.from = Math.max(1, Math.min(r, +x.value || 1)), e.to = Math.max(e.from, Math.min(r, +A.value || r)), e.thaiDigits = E.checked;
  };
  let N = Math.min(u.currentPage, r - 1);
  const V = y("canvas", { class: "hf-strip", "aria-label": "Preview of the top of the page" }), q = y("canvas", { class: "hf-strip", "aria-label": "Preview of the bottom of the page" }), Y = y("span", { class: "mono", text: "" }), ne = y("span", { class: "hint", text: "" }), J = (ce) => y("button", { class: "iconbtn small", type: "button", "aria-label": ce < 0 ? "Previous page" : "Next page", onclick: () => {
    N = Math.max(0, Math.min(r - 1, N + ce)), fe();
  } }, Ve(ce < 0 ? "left" : "right")), ee = y("div", { class: "hf-preview" }, y("div", { class: "hf-pv-head" }, y("span", { class: "rlabel", text: "Preview" }), J(-1), Y, J(1), ne), y("div", { class: "hf-band" }, V), y("div", { class: "hf-gap", "aria-hidden": "true" }), y("div", { class: "hf-band" }, q));
  O.append(ee);
  let ae = 0, de = 0;
  const oe = async () => {
    const ce = ++de;
    W(), Y.textContent = `Page ${N + 1} of ${r}`;
    const Ge = Math.max(240, ee.clientWidth || 600);
    try {
      const ge = await Ml(u, N, e, Ge);
      if (ce !== de) return;
      ne.textContent = ge.inRange ? "" : "This page is outside the chosen range.";
      const $e = Math.min(ge.h / 2, e.margin + Math.max(e.size, gn.some((Oe) => e.images[Oe]) ? e.imageHeight : 0) + 18), Ce = Math.round($e * ge.scale), Ee = document.createElement("canvas");
      Ee.width = ge.img.width, Ee.height = ge.img.height, Ee.getContext("2d").putImageData(ge.img, 0, 0);
      for (const [Oe, Ke] of [[V, 0], [q, ge.img.height - Ce]]) Oe.width = ge.img.width, Oe.height = Ce, Oe.style.aspectRatio = `${ge.img.width} / ${Ce}`, Oe.getContext("2d").drawImage(Ee, 0, Ke, ge.img.width, Ce, 0, 0, ge.img.width, Ce);
    } catch (ge) {
      ce === de && (ne.textContent = ge.message || "Preview unavailable");
    }
  }, fe = () => {
    clearTimeout(ae), ae = window.setTimeout(oe, 220);
  };
  O.addEventListener("input", fe), O.addEventListener("change", fe), O.addEventListener("click", (ce) => {
    ce.target.closest(".sw,.chip,.hf-img-x") && fe();
  }), a = fe;
  const we = await nt({ title: "Header & footer", onOpen: () => requestAnimationFrame(() => oe()), body: O, actions: [{ id: "remove", label: "Remove from all pages" }, { id: "cancel", label: "Cancel" }, { id: "apply", label: "Apply", primary: true }] });
  if (we === "remove") {
    await u.mutate("Remove header & footer", { pages: "all" }, () => is(u, [...Array(u.doc.pageCount).keys()])).catch((ce) => H(ce.message, "err")), H("Removed header and footer");
    return;
  }
  if (clearTimeout(ae), de++, we === "apply") {
    if (W(), t(e), !gn.some((ce) => e.text[ce].trim() || e.images[ce])) return H("Add text or an image to at least one position", "warn");
    try {
      let ce = 0;
      await u.mutate("Header & footer", { pages: "all" }, async () => {
        ce = await Cl(u, e);
      }), H(`Header and footer added to ${ce} page${ce === 1 ? "" : "s"}`);
    } catch (ce) {
      H(ce.message, "err");
    }
  }
}

export { Gl, ss, xl };
