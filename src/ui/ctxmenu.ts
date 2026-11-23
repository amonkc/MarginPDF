import { h, icon } from './dom';

/** One colour chip in a swatch row. */
export type MenuSwatch = {
  label: string;
  /** CSS background; "none" draws the "no colour" chip */
  css?: string;
  /** text shown on the chip instead of a colour */
  text?: string;
  /** opens the browser's colour picker */
  custom?: boolean;
  /** initial value (#rrggbb) for the custom picker */
  value?: string;
  on?: boolean;
};
/** A context-menu entry: separator, heading, swatch row or command. */
export type MenuItem =
  | "sep"
  | { heading: string }
  | { swatches: MenuSwatch[]; label: string; disabled?: boolean; pick: (index: number, custom?: number[]) => void }
  | { label: string; run: () => void; shortcut?: string; danger?: boolean; disabled?: boolean; /** shows a check mark */ checked?: boolean; /** an icon before the label (ICONS name) */ icon?: string };

/** The open menu, if any. */
let current: { el: HTMLElement; close: () => void } | null = null;

/** Closes the open context menu, if any. */
const closeMenu = (): void => current?.close();
/** Whether a context menu is open. */
const menuOpen = (): boolean => !!current;

/**
 * Opens a context menu at client position (x, y), clamped to the window. Arrow keys / Home / End / Tab move
 * focus, Escape, an outside click, blur, resize or scrolling (after 300 ms) close it; on close focus returns
 * to `returnFocus`.
 */
function openMenu(clientX: number, clientY: number, items: MenuItem[], returnFocus?: HTMLElement | null): void {
  closeMenu();
  const focusables: HTMLButtonElement[] = [];
  const menu = h("div", { class: "ctxmenu", role: "menu", tabindex: "-1" }, ...items.map((item) => {
    if (item === "sep") return h("div", { class: "ctx-sep", role: "separator" });
    if ("heading" in item) return h("div", { class: "ctx-head", text: item.heading });
    if ("swatches" in item) return h("div", { class: "ctx-swatches", role: "group", "aria-label": item.label }, h("span", { class: "ctx-label", text: item.label }), h("span", { class: "ctx-sw" }, ...item.swatches.map((swatch: MenuSwatch, index: number) => {
      const chip = h("button", { class: "sw" + (swatch.text != null ? " chip" : "") + (swatch.css === "none" ? " none" : "") + (swatch.custom ? " custom" : "") + (swatch.on ? " on" : ""), type: "button", role: "menuitemradio", "aria-checked": String(swatch.on), "aria-label": swatch.label, title: swatch.label, disabled: !!item.disabled, tabindex: "-1", text: swatch.text, style: swatch.css && swatch.css !== "none" ? { background: swatch.css } : {} });
      chip.addEventListener("click", () => {
        if (item.disabled) return;
        if (!swatch.custom) {
          close();
          return item.pick(index);
        }
        // custom colour: the browser's own picker, opened while this click still counts as the user's
        document.querySelector("input.ctx-picker")?.remove();
        const box = chip.getBoundingClientRect(), picker = h("input", { type: "color", class: "ctx-picker", value: swatch.value || "#3b82f6", style: { position: "fixed", left: box.left + "px", top: box.top + "px", width: "1px", height: "1px", opacity: "0", border: "0", padding: "0" } });
        document.body.append(picker);
        picker.addEventListener("change", () => {
          const hex = picker.value;
          picker.remove();
          item.pick(index, [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), 255]);
        });
        close();
        try {
          if (picker.showPicker) picker.showPicker();
          else picker.click();
        } catch {
          picker.click();
        }
      });
      focusables.push(chip);
      return chip;
    })));
    const checkable = item.checked != null;
    const button = h("button", { class: "ctx-item" + (item.danger ? " danger" : "") + (checkable ? " checkable" : ""), type: "button", role: checkable ? "menuitemradio" : "menuitem", "aria-checked": checkable ? String(item.checked) : null, disabled: !!item.disabled, tabindex: "-1" }, item.icon ? icon(item.icon) : null, h("span", { class: "ctx-label", text: item.label }), item.shortcut ? h("span", { class: "ctx-key", text: item.shortcut }) : null);
    button.addEventListener("click", () => {
      if (!item.disabled) {
        close();
        item.run();
      }
    });
    button.addEventListener("pointerenter", () => {
      if (!item.disabled) button.focus();
    });
    focusables.push(button);
    return button;
  }));
  document.body.append(menu);
  const rect = menu.getBoundingClientRect(), winW = innerWidth, winH = innerHeight;
  menu.style.left = Math.max(4, Math.min(clientX, winW - rect.width - 4)) + "px";
  menu.style.top = Math.max(4, clientY + rect.height > winH - 4 ? clientY - rect.height : clientY) + "px";
  const enabled = () => focusables.filter((el) => !el.disabled);
  const moveFocus = (step: number) => {
    const list = enabled();
    if (!list.length) return;
    const at = list.indexOf(document.activeElement as HTMLButtonElement);
    list[(at + step + list.length) % list.length].focus();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    // Left/Right only move between swatches; Up/Down move through everything
    if (e.key === "ArrowDown" || e.key === "ArrowRight" && document.activeElement?.classList.contains("sw")) {
      e.preventDefault();
      moveFocus(1);
    } else if (e.key === "ArrowLeft" && document.activeElement?.classList.contains("sw") || e.key === "ArrowUp") {
      e.preventDefault();
      moveFocus(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      enabled()[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      enabled().at(-1)?.focus();
    } else if (e.key === "Tab") {
      e.preventDefault();
      moveFocus(e.shiftKey ? -1 : 1);
    }
    e.stopPropagation();
  };
  // A menu button (aria-haspopup) that opened the menu toggles it: pressing it again closes the menu, and the
  // click that follows is swallowed so it doesn't open the menu straight back.
  const toggle = returnFocus?.getAttribute("aria-haspopup") === "menu" ? returnFocus : null;
  toggle?.setAttribute("aria-expanded", "true");
  const onOutsideDown = (e: PointerEvent) => {
    if (menu.contains(e.target as Node)) return;
    if (toggle?.contains(e.target as Node)) {
      // only the click of this same press (the next click, if it comes soon)
      const swallow = (ev: MouseEvent) => {
        stop();
        if (toggle.contains(ev.target as Node)) {
          ev.stopImmediatePropagation();
          ev.preventDefault();
        }
      };
      const stop = () => {
        document.removeEventListener("click", swallow, true);
        clearTimeout(timer);
      };
      document.addEventListener("click", swallow, true);
      const timer = setTimeout(stop, 1000);
    }
    close();
  };
  const openedAt = performance.now();
  const onBlurOrResize = () => close();
  // ignore the scroll that can follow the opening gesture
  const onScroll = (e: Event) => {
    if (performance.now() - openedAt > 300 && !menu.contains(e.target as Node)) close();
  };
  menu.addEventListener("keydown", onKey);
  menu.addEventListener("contextmenu", (e) => e.preventDefault());
  setTimeout(() => {
    document.addEventListener("pointerdown", onOutsideDown, true);
    addEventListener("blur", onBlurOrResize);
    addEventListener("resize", onBlurOrResize);
    document.addEventListener("scroll", onScroll, true);
  }, 0);
  function close() {
    if (current?.el === menu) {
      current = null;
      menu.remove();
      document.removeEventListener("pointerdown", onOutsideDown, true);
      removeEventListener("blur", onBlurOrResize);
      removeEventListener("resize", onBlurOrResize);
      document.removeEventListener("scroll", onScroll, true);
      toggle?.setAttribute("aria-expanded", "false");
      returnFocus?.focus({ preventScroll: true });
    }
  }
  current = { el: menu, close };
  (enabled()[0] || menu).focus({ preventScroll: true });
}

export { menuOpen, openMenu };
