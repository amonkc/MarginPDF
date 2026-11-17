import { H, nt, y } from './dom';
import { ir, ln } from './extract';

async function xs(u, n, t, e, r, o, a) {
  const s = [], i = document.createElement("canvas"), l = i.getContext("2d");
  for (let h = 0; h < n.length; h++) {
    if (!a(h)) return null;
    await new Promise((k) => setTimeout(k, 0));
    const m = n[h], { w: _, h: p } = u.doc.pageSize(m);
    let P = Math.round(_ / 72 * t), D = Math.round(p / 72 * t);
    const x = 8e3 / Math.max(P, D);
    x < 1 && (P = Math.round(P * x), D = Math.round(D * x)), u.relieveMemory(m);
    const A = u.doc.render(m, P, D, { annots: e, print: true });
    i.width = A.width, i.height = A.height, l.putImageData(A, 0, 0);
    const w = await new Promise((k) => i.toBlob(k, r, o));
    if (!w) throw new Error(`Page ${m + 1} could not be rendered`);
    s.push({ page: m, blob: w, w: _, h: p });
  }
  return i.width = i.height = 0, s;
}
async function Fa(u) {
  const { locked: n, perms: t } = u.limits;
  if (n && !(t & 4)) return H("This PDF’s permissions don’t allow printing. Unlock it with its permissions password first.", "warn", 5e3);
  const e = u.doc.pageCount, r = [...u.selectedPages].sort((A, w) => A - w), o = (A, w, k = false) => y("label", { class: "hf-check" }, y("input", { type: "radio", name: "pr-pages", value: A, checked: k }), w), a = y("input", { class: "tinput", id: "print-range", value: r.length ? ln(r) : `1-${e}`, placeholder: "e.g. 1-3, 5", autocomplete: "off" }), s = y("input", { type: "checkbox", id: "print-annots", checked: true }), i = y("select", { class: "tinput", id: "print-quality" }, y("option", { value: "150", text: "Standard (150 dpi)" }), y("option", { value: "300", text: "High (300 dpi, slower)" })), l = y("div", { class: "stack" }, y("div", { class: "stack", role: "radiogroup", "aria-label": "Pages" }, o("all", `All pages (${e})`, !r.length), o("current", `Current page (${u.currentPage + 1})`), ...r.length ? [o("sel", `Selected pages (${ln(r)})`, true)] : [], y("label", { class: "hf-check" }, y("input", { type: "radio", name: "pr-pages", value: "range" }), "Pages ", a)), y("label", { class: "hf-check" }, s, "Comments and markup"), y("label", { class: "rfield" }, y("span", { class: "rlabel", text: "Quality" }), i), y("p", { class: "hint", text: "Choose the printer, paper size and copies in the next step." }));
  if (a.addEventListener("focus", () => {
    l.querySelector("input[value=range]").checked = true;
  }), await nt({ title: "Print", body: l, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Print…", primary: true }] }) !== "ok") return;
  const m = l.querySelector("input[name=pr-pages]:checked").value;
  let _;
  try {
    _ = m === "all" ? [...Array(e).keys()] : m === "current" ? [u.currentPage] : m === "sel" ? r : ir(a.value, e);
  } catch (A) {
    return H(A.message, "warn");
  }
  const p = +i.value;
  let P = false;
  const D = H(`Preparing page 1 of ${_.length}…`, "ok", 6e5, { label: "Cancel", run: () => {
    P = true;
  } });
  let x;
  try {
    x = await xs(u, _, p, s.checked, "image/jpeg", 0.92, (A) => (D?.set?.(`Preparing page ${A + 1} of ${_.length}…`), !P));
  } catch (A) {
    return D?.close?.(), H(A.message, "err");
  }
  D?.close?.(), x && Mc(x);
}
function Mc(u) {
  document.getElementById("print-root")?.remove();
  const n = u.map((r) => URL.createObjectURL(r.blob)), t = y("div", { id: "print-root", "aria-hidden": "true" }, ...u.map((r, o) => y("div", { class: "print-page" + (r.w > r.h ? " landscape" : "") }, y("img", { src: n[o], alt: "" }))));
  document.body.append(t);
  const e = () => {
    t.remove(), n.forEach((r) => URL.revokeObjectURL(r)), removeEventListener("afterprint", e);
  };
  addEventListener("afterprint", e), Promise.all([...t.querySelectorAll("img")].map((r) => r.decode().catch(() => {
  }))).then(() => {
    try {
      window.print();
    } catch {
      H("Printing isn’t available here. Save the PDF and print it from your PDF viewer.", "warn", 6e3), e();
    }
  });
}

export { Fa, xs };
