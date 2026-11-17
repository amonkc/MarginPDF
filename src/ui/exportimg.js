import { vs } from '../util/zip';
import { H, nt, y } from './dom';
import { ir, ln } from './extract';
import { xs } from './print';

async function Tc(u, n) {
  const { locked: t, perms: e } = u.limits;
  if (t && !(e & 16)) return H("This PDF’s permissions don’t allow copying its content. Unlock it with its permissions password first.", "warn", 5e3);
  const r = u.doc.pageCount, o = [...u.selectedPages].sort((q, Y) => q - Y), a = (q, Y, ne = false) => y("label", { class: "hf-check" }, y("input", { type: "radio", name: "ei-pages", value: q, checked: ne }), Y), s = y("input", { class: "tinput", id: "ei-range", value: o.length ? ln(o) : `1-${r}`, autocomplete: "off" }), i = y("select", { class: "tinput", id: "ei-format" }, y("option", { value: "png", text: "PNG (sharp, larger)" }), y("option", { value: "jpeg", text: "JPEG (smaller, for photos)" })), l = y("select", { class: "tinput", id: "ei-dpi" }, ...[[72, "Screen (72 dpi)"], [150, "Standard (150 dpi)"], [300, "Print (300 dpi)"], [600, "Very high (600 dpi)"]].map(([q, Y]) => y("option", { value: String(q), text: String(Y), selected: q === 150 }))), h = y("input", { type: "range", id: "ei-quality", min: "50", max: "100", value: "90", "aria-label": "JPEG quality" }), m = y("span", { class: "rlabel", text: "90" }), _ = y("label", { class: "rfield" }, y("span", { class: "rlabel", text: "Quality" }), h, m), p = y("input", { type: "checkbox", id: "ei-annots", checked: true }), P = y("p", { class: "hint", id: "ei-size" }), D = y("div", { class: "stack" }, y("div", { class: "stack", role: "radiogroup", "aria-label": "Pages" }, a("all", `All pages (${r})`, !o.length), a("current", `Current page (${u.currentPage + 1})`), ...o.length ? [a("sel", `Selected pages (${ln(o)})`, true)] : [], y("label", { class: "hf-check" }, y("input", { type: "radio", name: "ei-pages", value: "range" }), "Pages ", s)), y("label", { class: "rfield" }, y("span", { class: "rlabel", text: "Format" }), i), y("label", { class: "rfield" }, y("span", { class: "rlabel", text: "Resolution" }), l), _, y("label", { class: "hf-check" }, p, "Include comments and markup"), P), x = () => {
    const q = D.querySelector("input[name=ei-pages]:checked").value;
    return q === "all" ? [...Array(r).keys()] : q === "current" ? [u.currentPage] : q === "sel" ? o : ir(s.value, r);
  }, A = () => {
    _.hidden = i.value !== "jpeg", m.textContent = h.value;
    try {
      const q = x(), { w: Y, h: ne } = u.doc.pageSize(q[0] ?? 0), J = +l.value;
      P.textContent = `${q.length} image${q.length === 1 ? "" : "s"}, about ${Math.round(Y / 72 * J)} × ${Math.round(ne / 72 * J)} px${q.length > 1 ? ", saved together as a .zip" : ""}`, P.classList.remove("err");
    } catch (q) {
      P.textContent = q.message, P.classList.add("err");
    }
  };
  if (s.addEventListener("focus", () => {
    D.querySelector("input[value=range]").checked = true, A();
  }), D.addEventListener("input", A), D.addEventListener("change", A), A(), await nt({ title: "Export pages as images", body: D, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Export", primary: true }] }) !== "ok") return;
  let k;
  try {
    k = x();
  } catch (q) {
    return H(q.message, "warn");
  }
  const G = i.value === "jpeg" ? "image/jpeg" : "image/png", E = i.value === "jpeg" ? "jpg" : "png";
  let B = false;
  const z = H(`Rendering page 1 of ${k.length}…`, "ok", 6e5, { label: "Cancel", run: () => {
    B = true;
  } });
  let O;
  try {
    O = await xs(u, k, +l.value, p.checked, G, +h.value / 100, (q) => (z.set(`Rendering page ${q + 1} of ${k.length}…`), !B));
  } catch (q) {
    return z.close(), H(q.message, "err");
  }
  if (z.close(), !O) return;
  const W = u.fileName.replace(/\.pdf$/i, ""), N = String(r).length, V = await Promise.all(O.map(async (q) => ({ name: `${W}_page${String(q.page + 1).padStart(N, "0")}.${E}`, data: new Uint8Array(await q.blob.arrayBuffer()) })));
  V.length === 1 ? await n(V[0].data, V[0].name, G) : await n(vs(V), `${W}_${E}.zip`, "application/zip");
}

export { Tc };
