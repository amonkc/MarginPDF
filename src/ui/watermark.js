import { cr, gt, na, os, sn, wl, yl } from '../engine/text';
import { H, nt, y } from './dom';

const ds = { kind: "text", text: "CONFIDENTIAL", fontKey: "sarabun", color: [196, 40, 40, 255], image: "", opacity: 22, angle: 45, scale: 70, behind: false, range: "all", from: 1, to: 1, bg: false, bgColor: [255, 251, 235, 255] };
const In = "wm";
const bn = "bg";
function ms(u, n) {
  const t = n.range === "custom" ? Math.max(1, n.from) : 1, e = n.range === "custom" ? Math.min(u, n.to) : u, r = [];
  for (let o = t - 1; o <= e - 1; o++) r.push(o);
  return r;
}
async function fs(u, n = 1600) {
  const t = new Image();
  t.src = u, await t.decode();
  const e = Math.min(1, n / Math.max(t.naturalWidth, t.naturalHeight)), r = Math.max(1, Math.round(t.naturalWidth * e)), o = Math.max(1, Math.round(t.naturalHeight * e)), a = document.createElement("canvas");
  a.width = r, a.height = o;
  const s = a.getContext("2d");
  return s.drawImage(t, 0, 0, r, o), { data: s.getImageData(0, 0, r, o).data, w: r, h: o };
}
function Tl(u, n, t) {
  return u.pageObjects(n).filter((e) => e.blockId === t).length;
}
async function _s(u, n, t, e) {
  gt(u, n, In), gt(u, n, bn);
  const { w: r, h: o } = u.pageSize(n), a = u.transform(n, r, o).invert(), s = r / 2, i = o / 2, l = t.angle * Math.PI / 180, h = Math.cos(l), m = Math.sin(l), _ = Math.min(Math.abs(h) > 1e-6 ? r / Math.abs(h) : 1 / 0, Math.abs(m) > 1e-6 ? o / Math.abs(m) : 1 / 0) * (t.scale / 100), p = (x, A) => a.apply(s + x * h - A * m, i - (x * m + A * h));
  if (t.bg) {
    const x = a.apply(0, 0), A = a.apply(r, o), w = u.P, k = w.FPDFPageObj_CreateNewRect(Math.min(x[0], A[0]), Math.min(x[1], A[1]), Math.abs(A[0] - x[0]), Math.abs(A[1] - x[1]));
    w.FPDFPageObj_SetFillColor(k, t.bgColor[0], t.bgColor[1], t.bgColor[2], 255), w.FPDFPath_SetDrawMode(k, 1, 0), na(u, n, k, bn, 0);
  }
  const P = Math.round(t.opacity / 100 * 255);
  let D = 0;
  if (t.kind === "text" && t.text.trim()) {
    const x = 100 * _ / Math.max(1, await Ol(t));
    D = await yl(u, t.text.trim(), t.fontKey, x, p), u.P.FPDFPageObj_SetFillColor(D, t.color[0], t.color[1], t.color[2], P);
  } else if (t.kind === "image" && e) {
    const x = e.w / e.h;
    let A = _, w = _ / x;
    const k = Math.min(r, o) * (t.scale / 100);
    w > k && (w = k, A = w * x);
    const G = new Uint8ClampedArray(e.data);
    for (let O = 3; O < G.length; O += 4) G[O] = Math.round(G[O] * (t.opacity / 100));
    const E = p(-A / 2, -w / 2), B = p(A / 2, -w / 2), z = p(-A / 2, w / 2);
    D = wl(u, G, e.w, e.h, [B[0] - E[0], B[1] - E[1], z[0] - E[0], z[1] - E[1], E[0], E[1]]);
  }
  D && na(u, n, D, In, t.behind ? Tl(u, n, bn) : -1);
}
const oa = /* @__PURE__ */ new Map();
async function Ol(u) {
  const n = u.fontKey + "|" + u.text;
  let t = oa.get(n);
  return t == null && (t = await os(cr(u.fontKey, u.text).key, u.text.trim(), 100), oa.set(n, t)), t;
}
function Rl(u) {
  for (let n = 0; n < u.doc.pageCount; n++) if (u.doc.pageObjects(n).some((t) => t.blockId === In || t.blockId === bn)) return true;
  return false;
}
async function Il(u, n) {
  const t = ms(u.doc.pageCount, n);
  if (!t.length) throw new Error("That page range is empty");
  const e = n.kind === "image" && n.image ? await fs(n.image) : null;
  if (n.kind === "image" && !e) throw new Error("Choose an image first");
  for (let r = 0; r < u.doc.pageCount; r++) gt(u.doc, r, In), gt(u.doc, r, bn);
  for (const r of t) await _s(u.doc, r, n, e);
  return t.length;
}
function Ll(u) {
  for (let n = 0; n < u.doc.pageCount; n++) gt(u.doc, n, In), gt(u.doc, n, bn);
}
async function jl(u, n, t) {
  const e = JSON.parse(JSON.stringify(n)), r = u.doc.pageCount;
  (e.to < 1 || e.to > r) && (e.to = r);
  const o = (J, ee, ae, de) => {
    const oe = y("div", { class: "swatches", role: "radiogroup", "aria-label": de }), fe = () => oe.replaceChildren(...J.map((we) => {
      const ce = ee().slice(0, 3).join() === we.slice(0, 3).join();
      return y("button", { class: "sw" + (ce ? " on" : ""), type: "button", role: "radio", "aria-checked": String(ce), "aria-label": `rgb ${we.slice(0, 3).join(" ")}`, style: { background: `rgb(${we[0]},${we[1]},${we[2]})` }, onclick: () => {
        ae(we), fe(), N();
      } });
    }));
    return fe(), oe;
  }, a = (J, ...ee) => y("div", { class: "hf-row" }, y("span", { class: "rlabel", text: J }), y("div", { class: "hf-ctrl" }, ...ee)), s = (J, ee, ae, de, oe) => {
    const fe = y("input", { type: "radio", name: J, value: ee, checked: de });
    return fe.addEventListener("change", () => {
      fe.checked && (oe(), w(), N());
    }), y("label", { class: "hf-check" }, fe, ae);
  }, i = (J, ee, ae, de, oe, fe) => {
    const we = y("input", { type: "range", min: String(J), max: String(ee), value: String(ae), "aria-label": fe, class: "wm-range" }), ce = y("span", { class: "mono", text: ae + oe });
    return we.addEventListener("input", () => {
      de(+we.value), ce.textContent = we.value + oe, N();
    }), y("span", { class: "wm-slider" }, we, ce);
  }, l = y("input", { class: "tinput", value: e.text, "aria-label": "Watermark text" });
  l.addEventListener("input", () => {
    e.text = l.value, N();
  });
  const h = y("select", { class: "rselect", "aria-label": "Font" });
  for (const J of ["Standard", "Thai + Latin", "Latin"]) h.append(y("optgroup", { label: J }, ...sn.filter((ee) => ee.group === J).map((ee) => y("option", { value: ee.key, text: ee.label, selected: ee.key === e.fontKey }))));
  h.addEventListener("change", () => {
    e.fontKey = h.value, N();
  });
  const m = y("button", { class: "btn ghost small", type: "button" }, e.image ? "Change image…" : "Choose image…"), _ = y("img", { class: "wm-thumb", alt: "", hidden: !e.image, src: e.image || void 0 });
  m.addEventListener("click", () => {
    const J = y("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/svg+xml" });
    J.addEventListener("change", () => {
      const ee = J.files?.[0];
      if (!ee) return;
      const ae = new FileReader();
      ae.onload = () => {
        e.image = String(ae.result), _.src = e.image, _.hidden = false, m.textContent = "Change image…", N();
      }, ae.readAsDataURL(ee);
    }), J.click();
  });
  const p = [a("Text", l), a("Font", h), a("Colour", o([[196, 40, 40, 255], [24, 26, 33, 255], [120, 124, 134, 255], [37, 99, 235, 255], [22, 140, 82, 255]], () => e.color, (J) => e.color = J, "Watermark colour"))], P = [a("Image", m, _)], D = y("input", { class: "rnum", type: "number", min: "1", max: String(r), value: String(e.from), "aria-label": "From page" }), x = y("input", { class: "rnum", type: "number", min: "1", max: String(r), value: String(e.to), "aria-label": "To page" });
  D.addEventListener("change", () => {
    e.from = +D.value || 1, N();
  }), x.addEventListener("change", () => {
    e.to = +x.value || r, N();
  });
  const A = y("input", { type: "checkbox", checked: e.bg });
  A.addEventListener("change", () => {
    e.bg = A.checked, N();
  });
  const w = () => {
    p.forEach((J) => J.hidden = e.kind !== "text"), P.forEach((J) => J.hidden = e.kind !== "image"), D.disabled = x.disabled = e.range !== "custom";
  }, k = y("canvas", { class: "wm-canvas", "aria-label": "Preview" });
  let G = 0;
  const E = y("span", { class: "mono" }), B = (J) => y("button", { class: "iconbtn small", type: "button", "aria-label": J < 0 ? "Previous page" : "Next page", text: J < 0 ? "‹" : "›", onclick: () => {
    G = Math.max(0, Math.min(r - 1, G + J)), N();
  } }), z = y("div", { class: "wm" }, y("div", { class: "wm-form" }, a("Watermark", s("wm-kind", "text", "Text", e.kind === "text", () => e.kind = "text"), s("wm-kind", "image", "Image", e.kind === "image", () => e.kind = "image")), ...p, ...P, a("Opacity", i(5, 100, e.opacity, (J) => e.opacity = J, "%", "Opacity")), a("Angle", i(-90, 90, e.angle, (J) => e.angle = J, "°", "Angle")), a("Size", i(10, 100, e.scale, (J) => e.scale = J, "%", "Size relative to the page")), a("Layer", s("wm-layer", "top", "Over the content", !e.behind, () => e.behind = false), s("wm-layer", "behind", "Behind the content", e.behind, () => e.behind = true)), a("Background", y("label", { class: "hf-check" }, A, "Page colour"), o([[255, 251, 235, 255], [240, 249, 255, 255], [240, 253, 244, 255], [253, 242, 248, 255], [243, 244, 246, 255]], () => e.bgColor, (J) => {
    e.bgColor = J, e.bg = true, A.checked = true;
  }, "Background colour")), a("Pages", s("wm-range", "all", "All", e.range === "all", () => e.range = "all"), s("wm-range", "custom", "From", e.range === "custom", () => e.range = "custom"), D, "to", x)), y("div", { class: "wm-preview" }, y("div", { class: "hf-pv-head" }, y("span", { class: "rlabel", text: "Preview" }), B(-1), E, B(1)), k));
  w();
  let O = 0, W = 0;
  const N = () => {
    clearTimeout(W), W = window.setTimeout(V, 120);
  }, V = async () => {
    const J = ++O;
    E.textContent = `Page ${G + 1} of ${r}`;
    const ee = u.lib.create();
    try {
      if (ee.importIndices(u.doc, [G], 0), gt(ee, 0, In), gt(ee, 0, bn), ms(r, e).includes(G)) {
        const ce = e.kind === "image" && e.image ? await fs(e.image, 600) : null;
        await _s(ee, 0, e, ce);
      }
      if (J !== O) return;
      const { w: ae, h: de } = ee.pageSize(0), oe = 300 * Math.min(2, devicePixelRatio || 1), fe = oe / ae, we = ee.render(0, ae * fe, de * fe);
      k.width = we.width, k.height = we.height, k.getContext("2d").putImageData(we, 0, 0);
    } catch (ae) {
      J === O && (E.textContent = ae.message);
    } finally {
      ee.close();
    }
  };
  V();
  const q = Rl(u), Y = await nt({ title: "Watermark & background", body: z, actions: [...q ? [{ id: "remove", label: "Remove", danger: true }] : [], { id: "cancel", label: "Cancel" }, { id: "apply", label: "Apply", primary: true }] });
  if (clearTimeout(W), O++, Y === "remove") {
    await u.mutate("Remove watermark", { pages: "all" }, () => Ll(u)).catch((J) => H(J.message, "err")), H("Removed the watermark and background");
    return;
  }
  if (Y !== "apply") return;
  if (e.kind === "text" && !e.text.trim() && !e.bg) return H("Type the watermark text first", "warn");
  t(e);
  let ne = 0;
  await u.mutate(e.kind === "text" && !e.text.trim() ? "Page background" : "Watermark", { pages: "all" }, async () => {
    ne = await Il(u, e);
  }).catch((J) => H(J.message, "err")), ne && H(`Applied to ${ne} page${ne === 1 ? "" : "s"}`);
}

export { ds, jl };
