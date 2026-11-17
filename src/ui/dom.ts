import { ICONS } from './headerfooter';
import type { RGBA } from '../engine/types';

/** First element matching `selector` under `root` (default: the document). Used for the page's fixed markup,
 *  so it is typed as present; use `root.querySelector` directly when absence is expected. */
const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T =>
  root.querySelector(selector) as T;

/** All elements matching `selector` under `root`, as an array. */
const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] =>
  [...root.querySelectorAll(selector)] as T[];

/** Attribute bag for {@link h}: `class`, `style` (object), `on*` listeners, `text`, DOM properties or plain attributes. */
export type Attrs = Record<string, any>;
/** A child accepted by {@link h}; null/undefined/false are skipped. */
export type Child = Node | string | null | undefined | false;

/**
 * Creates an HTML element. For each attribute (null/undefined/false are skipped):
 * `class` sets className, an object `style` is assigned to the style, `onX` functions become listeners,
 * `text` sets textContent, non-string values for existing DOM properties are assigned as properties,
 * and anything else becomes an attribute (`true` → empty attribute).
 */
function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs?: Attrs, ...children: Child[]): HTMLElementTagNameMap[K];
function h(tag: string, attrs?: Attrs, ...children: Child[]): HTMLElement;
function h(tag: string, attrs: Attrs = {}, ...children: Child[]): HTMLElement {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") el.className = value;
    else if (key === "style" && typeof value == "object") Object.assign(el.style, value);
    else if (key.startsWith("on") && typeof value == "function") el.addEventListener(key.slice(2), value);
    else if (key === "text") el.textContent = value;
    else if (key in el && typeof value != "string") (el as any)[key] = value;
    else el.setAttribute(key, value === true ? "" : String(value));
  }
  for (const child of children) if (child != null && child !== false) el.append(child);
  return el;
}

const SVG_NS = "http://www.w3.org/2000/svg";

/** Creates an SVG element with the given attributes (null/undefined values are skipped). */
function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs?: Record<string, unknown>): SVGElementTagNameMap[K];
function svg(tag: string, attrs?: Record<string, unknown>): SVGElement;
function svg(tag: string, attrs: Record<string, unknown> = {}): SVGElement {
  const el = document.createElementNS(SVG_NS, tag) as SVGElement;
  for (const [key, value] of Object.entries(attrs)) if (value != null) el.setAttribute(key, String(value));
  return el;
}

/** Optional button shown in a toast. */
export type ToastAction = { label: string; run: () => void };
/** Handle to a shown toast: change its text or close it early (no-ops once a newer toast replaced it). */
export type ToastHandle = { set: (text: string) => void; close: () => void };

let toastTimer = 0;
/** Bumped for every toast so stale handles and timers leave a newer toast alone. */
let toastSeq = 0;

/** Shows a message in the #toast strip for `ms` milliseconds. `kind` is e.g. "ok", "warn" or "err". */
function toast(message: string, kind = "ok", ms = 2800, action?: ToastAction): ToastHandle {
  const host = $("#toast")!, text = h("span", { text: message });
  host.replaceChildren(text);
  host.dataset.kind = kind;
  host.hidden = false;
  if (action) {
    host.append(h("button", { class: "toast-btn", type: "button", text: action.label, onclick: () => {
      action.run();
      close();
    } }));
  }
  requestAnimationFrame(() => host.classList.add("show"));
  clearTimeout(toastTimer);
  const seq = ++toastSeq;
  const close = () => {
    if (seq === toastSeq) {
      clearTimeout(toastTimer);
      host.classList.remove("show");
      window.setTimeout(() => {
        if (seq === toastSeq) host.hidden = true;
      }, 250);
    }
  };
  toastTimer = window.setTimeout(close, ms);
  return { set: (value) => {
    if (seq === toastSeq) text.textContent = value;
  }, close };
}

/** A button in a {@link modal}; its `id` is what the modal resolves to. */
export type ModalAction = { id: string; label: string; primary?: boolean; danger?: boolean };
export type ModalOptions = {
  title: string;
  /** a paragraph of text, or any node */
  body?: string | Node | null;
  actions: ModalAction[];
  /** called with the dialog element once it is in the page */
  onOpen?: (dialog: HTMLElement) => void;
};

/**
 * Shows a modal dialog in #modal-host. Resolves with the id of the clicked action, or null when dismissed
 * (Escape or a click on the scrim).
 */
function modal(options: ModalOptions): Promise<string | null> {
  return new Promise((resolve) => {
    const host = $("#modal-host")!;
    const finish = (result: string | null) => {
      host.hidden = true;
      host.replaceChildren();
      document.removeEventListener("keydown", onKey);
      resolve(result);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish(null);
    };
    const dialog = h("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-label": options.title },
      h("h2", { text: options.title }),
      typeof options.body == "string" ? h("p", { class: "modal-text", text: options.body }) : options.body || null,
      h("div", { class: "modal-actions" }, ...options.actions.map((action) => h("button", { class: "btn" + (action.primary ? " primary" : "") + (action.danger ? " danger" : ""), text: action.label, onclick: () => finish(action.id) }))));
    host.replaceChildren(h("div", { class: "modal-scrim", onclick: () => finish(null) }), dialog);
    host.hidden = false;
    document.addEventListener("keydown", onKey);
    options.onOpen?.(dialog);
    dialog.querySelector<HTMLElement>("input,textarea,button.primary")?.focus();
  });
}

/** A `<span class="ic">` holding the named inline SVG icon (empty if unknown). */
const icon = (name: string): HTMLSpanElement => {
  const el = h("span", { class: "ic", "aria-hidden": "true" });
  el.innerHTML = ICONS[name] || "";
  return el;
};

/** CSS `rgb()` for a colour (alpha ignored). */
const rgbCss = (color: RGBA | number[]): string => `rgb(${color[0]},${color[1]},${color[2]})`;

/** Preset colour swatches for the highlight and pen tools. */
const PALETTES: { highlight: RGBA[]; pen: RGBA[] } = { highlight: [[246, 214, 74, 255], [134, 222, 140, 255], [120, 196, 246, 255], [246, 150, 198, 255], [250, 172, 92, 255]], pen: [[24, 26, 33, 255], [214, 69, 52, 255], [37, 99, 235, 255], [22, 140, 82, 255], [124, 77, 219, 255]] };

/** Same RGB (alpha ignored). */
const sameColor = (a: RGBA | number[], b: RGBA | number[]): boolean => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

export { sameColor, toast, rgbCss, icon, $, PALETTES, modal, svg, $$, h };
