import { y } from './dom';

let nr = null;
const kc = () => nr?.close();
const Zr = () => !!nr;
function pn(u, n, t, e) {
  kc();
  const r = [], o = y("div", { class: "ctxmenu", role: "menu", tabindex: "-1" }, ...t.map((A) => {
    if (A === "sep") return y("div", { class: "ctx-sep", role: "separator" });
    if ("heading" in A) return y("div", { class: "ctx-head", text: A.heading });
    if ("swatches" in A) return y("div", { class: "ctx-swatches", role: "group", "aria-label": A.label }, y("span", { class: "ctx-label", text: A.label }), y("span", { class: "ctx-sw" }, ...A.swatches.map((k, G) => {
      const E = y("button", { class: "sw" + (k.text != null ? " chip" : "") + (k.css === "none" ? " none" : "") + (k.custom ? " custom" : "") + (k.on ? " on" : ""), type: "button", role: "menuitemradio", "aria-checked": String(k.on), "aria-label": k.label, title: k.label, disabled: !!A.disabled, tabindex: "-1", text: k.text, style: k.css && k.css !== "none" ? { background: k.css } : {} });
      return E.addEventListener("click", () => {
        if (A.disabled) return;
        if (!k.custom) return x(), A.pick(G);
        // custom colour: the browser's own picker, opened while this click still counts as the user's
        document.querySelector("input.ctx-picker")?.remove();
        const B = E.getBoundingClientRect(), z = y("input", { type: "color", class: "ctx-picker", value: k.value || "#3b82f6", style: { position: "fixed", left: B.left + "px", top: B.top + "px", width: "1px", height: "1px", opacity: "0", border: "0", padding: "0" } });
        document.body.append(z), z.addEventListener("change", () => {
          const O = z.value;
          z.remove(), A.pick(G, [parseInt(O.slice(1, 3), 16), parseInt(O.slice(3, 5), 16), parseInt(O.slice(5, 7), 16), 255]);
        }), x();
        try {
          z.showPicker ? z.showPicker() : z.click();
        } catch {
          z.click();
        }
      }), r.push(E), E;
    })));
    const w = y("button", { class: "ctx-item" + (A.danger ? " danger" : ""), type: "button", role: "menuitem", disabled: !!A.disabled, tabindex: "-1" }, y("span", { class: "ctx-label", text: A.label }), A.shortcut ? y("span", { class: "ctx-key", text: A.shortcut }) : null);
    return w.addEventListener("click", () => {
      A.disabled || (x(), A.run());
    }), w.addEventListener("pointerenter", () => {
      A.disabled || w.focus();
    }), r.push(w), w;
  }));
  document.body.append(o);
  const a = o.getBoundingClientRect(), s = innerWidth, i = innerHeight;
  o.style.left = Math.max(4, Math.min(u, s - a.width - 4)) + "px", o.style.top = Math.max(4, n + a.height > i - 4 ? n - a.height : n) + "px";
  const l = () => r.filter((A) => !A.disabled), h = (A) => {
    const w = l();
    if (!w.length) return;
    const k = w.indexOf(document.activeElement);
    w[(k + A + w.length) % w.length].focus();
  }, m = (A) => {
    if (A.key === "Escape") {
      A.preventDefault(), x();
      return;
    }
    A.key === "ArrowDown" || A.key === "ArrowRight" && document.activeElement?.classList.contains("sw") ? (A.preventDefault(), h(1)) : A.key === "ArrowLeft" && document.activeElement?.classList.contains("sw") || A.key === "ArrowUp" ? (A.preventDefault(), h(-1)) : A.key === "Home" ? (A.preventDefault(), l()[0]?.focus()) : A.key === "End" ? (A.preventDefault(), l().at(-1)?.focus()) : A.key === "Tab" && (A.preventDefault(), h(A.shiftKey ? -1 : 1)), A.stopPropagation();
  }, _ = (A) => {
    o.contains(A.target) || x();
  }, p = performance.now(), P = () => x(), D = (A) => {
    performance.now() - p > 300 && !o.contains(A.target) && x();
  };
  o.addEventListener("keydown", m), o.addEventListener("contextmenu", (A) => A.preventDefault()), setTimeout(() => {
    document.addEventListener("pointerdown", _, true), addEventListener("blur", P), addEventListener("resize", P), document.addEventListener("scroll", D, true);
  }, 0);
  function x() {
    nr?.el === o && (nr = null, o.remove(), document.removeEventListener("pointerdown", _, true), removeEventListener("blur", P), removeEventListener("resize", P), document.removeEventListener("scroll", D, true), e?.focus({ preventScroll: true }));
  }
  nr = { el: o, close: x }, (l()[0] || o).focus({ preventScroll: true });
}

export { Zr, pn };
