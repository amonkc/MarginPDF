import { ss } from './headerfooter';

const _e = (u, n = document) => n.querySelector(u);
const ra = (u, n = document) => [...n.querySelectorAll(u)];
function y(u, n = {}, ...t) {
  const e = document.createElement(u);
  for (const [r, o] of Object.entries(n)) o == null || o === false || (r === "class" ? e.className = o : r === "style" && typeof o == "object" ? Object.assign(e.style, o) : r.startsWith("on") && typeof o == "function" ? e.addEventListener(r.slice(2), o) : r === "text" ? e.textContent = o : r in e && typeof o != "string" ? e[r] = o : e.setAttribute(r, o === true ? "" : String(o)));
  for (const r of t) r != null && r !== false && e.append(r);
  return e;
}
const vl = "http://www.w3.org/2000/svg";
function pt(u, n = {}) {
  const t = document.createElementNS(vl, u);
  for (const [e, r] of Object.entries(n)) r != null && t.setAttribute(e, String(r));
  return t;
}
let qr = 0;
function H(u, n = "ok", t = 2800, e) {
  const r = _e("#toast"), o = y("span", { text: u });
  r.replaceChildren(o), r.dataset.kind = n, r.hidden = false, e && r.append(y("button", { class: "toast-btn", type: "button", text: e.label, onclick: () => {
    e.run(), s();
  } })), requestAnimationFrame(() => r.classList.add("show")), clearTimeout(qr);
  const a = ++pr, s = () => {
    a === pr && (clearTimeout(qr), r.classList.remove("show"), window.setTimeout(() => {
      a === pr && (r.hidden = true);
    }, 250));
  };
  return qr = window.setTimeout(s, t), { set: (i) => {
    a === pr && (o.textContent = i);
  }, close: s };
}
let pr = 0;
function nt(u) {
  return new Promise((n) => {
    const t = _e("#modal-host"), e = (a) => {
      t.hidden = true, t.replaceChildren(), document.removeEventListener("keydown", r), n(a);
    }, r = (a) => {
      a.key === "Escape" && e(null);
    }, o = y("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-label": u.title }, y("h2", { text: u.title }), typeof u.body == "string" ? y("p", { class: "modal-text", text: u.body }) : u.body || null, y("div", { class: "modal-actions" }, ...u.actions.map((a) => y("button", { class: "btn" + (a.primary ? " primary" : "") + (a.danger ? " danger" : ""), text: a.label, onclick: () => e(a.id) }))));
    t.replaceChildren(y("div", { class: "modal-scrim", onclick: () => e(null) }), o), t.hidden = false, document.addEventListener("keydown", r), u.onOpen?.(o), o.querySelector("input,textarea,button.primary")?.focus();
  });
}
const Ve = (u) => {
  const n = y("span", { class: "ic", "aria-hidden": "true" });
  return n.innerHTML = ss[u] || "", n;
};
const Mn = (u) => `rgb(${u[0]},${u[1]},${u[2]})`;
const lt = { highlight: [[246, 214, 74, 255], [134, 222, 140, 255], [120, 196, 246, 255], [246, 150, 198, 255], [250, 172, 92, 255]], pen: [[24, 26, 33, 255], [214, 69, 52, 255], [37, 99, 235, 255], [22, 140, 82, 255], [124, 77, 219, 255]] };
const Gn = (u, n) => u[0] === n[0] && u[1] === n[1] && u[2] === n[2];

export { Gn, H, Mn, Ve, _e, lt, nt, pt, ra, y };
