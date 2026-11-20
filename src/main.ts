import "./style.css";
import "./ui-fonts";
import { App, FULL_SAVE_MAX } from "./app";
import type { Snapshot } from "./app";
import { Session } from "./session";
import { Updates } from "./updates";
import type { SessionRecord, StoredSession } from "./session";
import { CHANGELOG, VERSION } from "./changelog";
import { loadAsset } from "./engine/assets";
import { Growable } from "./engine/growable";
import { ENGINE_FULL, ANNOT, Pdfium, ANNOT_NAMES, PdfError, isEngineAbort } from "./engine/pdfium";
import { loadFont, parseStyleCode, styleCode, initShaper, FONTS, FONT_GROUPS, fontByKey, onBigFontLoading, splitByCoverage } from "./engine/text";
import { writeRichText } from "./engine/richtext";
import { Arrange } from "./ui/arrange";
import { Bookmarks } from "./ui/bookmarks";
import { compressDialog } from "./ui/compress";
import { Crop } from "./ui/crop";
import { menuOpen, openMenu } from "./ui/ctxmenu";
import { sameColor, toast, rgbCss, icon, $, PALETTES, modal, $$, h } from "./ui/dom";
import { exportImagesDialog } from "./ui/exportimg";
import {
  extractDialog,
  reopenWithFieldValues,
  parsePageRange,
  formatPageRange,
  fieldNames,
  copyFormFields,
} from "./ui/extract";
import { Forms, FIELD_KINDS } from "./ui/forms";
import { headerFooterDialog } from "./ui/headerfooter";
import { ICONS } from "./ui/icons";
import { decodeImage, encodeImage, isImageFile, pickImageFile, encodePixels } from "./ui/images";
import { askImagePages, imagesToDoc, pdfNameFor, IMAGE_ACCEPT } from "./ui/imagepdf";
import { scanDocument } from "./ui/scan";
import { makeZip } from "./util/zip";
import { damageOf } from "./engine/repair";
import { detectFields } from "./ui/detect";
import type { FieldCandidate } from "./ui/detect";
import { recogniseText } from "./ui/ocr";
import { compareDocs } from "./ui/compare";
import { TOOL_INFO, Interact } from "./ui/interact";
import { Links } from "./ui/links";
import {
  getObjClip,
  getClip,
  onClip,
  clipMarker,
  objMarker,
  objMarkerId,
  putClip,
  putObjClip,
  markerId,
} from "./ui/pageclip";
import { CommentsPanel } from "./ui/panel";
import { printDialog } from "./ui/print";
import { protectDialog } from "./ui/protect";
import { replaceAt, replaceAll, countMatches } from "./ui/replace";
import { Spelling } from "./ui/spell";
import { STAMPS } from "./ui/stamps";
import { TextBoxes } from "./ui/textbox";
import { pageActions, Thumbs } from "./ui/thumbs";
import { Viewer } from "./ui/viewer";
import { DEFAULT_WATERMARK, watermarkDialog } from "./ui/watermark";
import type { AnnotInfo, AnnotStyle, Bookmark, FreeTextStyle, LineEnd, Pt, RGBA, Rect } from "./engine/types";
import type { Doc, LinkInfo, PageRects } from "./engine/pdfium";
import type { ArrangeItem } from "./ui/arrange";
import type { CopiedField } from "./ui/extract";
import type { ToolInfo } from "./ui/interact";
import type { ObjClip } from "./ui/pageclip";
import type { MenuItem } from "./ui/ctxmenu";
import type { ToastHandle } from "./ui/dom";

/** A context-menu row of colour swatches or text chips. */
type MenuSwatchRow = Extract<MenuItem, { swatches: unknown }>;

/** A search or replace hit: the page and the rectangles of the matched text on it. */
interface SearchHit {
  page: number;
  rects: Rect[];
}


/** An edge or centre line that Move & resize can align objects on. */
type AlignEdge = Parameters<Arrange["align"]>[0];

/** A bold/italic/underline/strike text style flag. */
type StyleFlag = "bold" | "italic" | "underline" | "strike";

/** The text-box style fields the ribbon edits (named as in the app settings). */
type FreeTextRibbonStyle = {
  ftSize: number;
  ftColor: RGBA;
  ftFill: RGBA | null;
  ftBorder: RGBA | null;
  textFont: string;
};

/** A pending touch long-press that will open a context menu if the finger stays put. */
interface LongPress {
  t: number;
  x: number;
  y: number;
  el: HTMLElement;
}

/** Boots the PDF engine and HarfBuzz, builds the whole UI and wires every control, then opens the welcome PDF. */
async function main(): Promise<void> {
  $$("[data-i]").forEach((el) => {
    el.innerHTML = ICONS[el.dataset.i!] || "";
    el.setAttribute("aria-hidden", "true");
  });
  const bootStatus = $("#boot-status");
  $("#boot-version").textContent = "v" + VERSION;
  document.documentElement.dataset.version = VERSION;
  const fetchAsset = loadAsset;
  let pdfium: Pdfium;
  try {
    bootStatus.textContent = "Starting the PDF engine…";
    const [pdfiumWasm, harfbuzzWasm] = await Promise.all([fetchAsset("pdfium.wasm"), fetchAsset("harfbuzz.wasm")]);
    pdfium = await Pdfium.load(pdfiumWasm);
    await initShaper(harfbuzzWasm);
  } catch (err) {
    bootStatus.textContent = `The PDF engine couldn't start in this browser: ${(err as Error | null)?.message || err}. Try a current version of Chrome, Edge, Safari or Firefox.`;
    $("#boot").classList.add("failed");
    return;
  }
  const app = new App(pdfium);
  const viewer = new Viewer($("#viewer"), app);
  const interact = new Interact(app, viewer);
  const arrange = new Arrange(app, viewer);
  interact.arrange = arrange;
  arrange.onChange = () => renderRibbon();
  const crop = new Crop(app, viewer);
  interact.crop = crop;
  crop.onChange = () => renderRibbon();
  const textBoxes = new TextBoxes(app, viewer);
  interact.textbox = textBoxes;
  interact.links = new Links(app, viewer);
  interact.forms = new Forms(app, viewer);
  textBoxes.onChange = () => renderRibbon();
  arrange.onFreeText = (page, index, fn, label) => {
    textBoxes.update(page, index, fn, label);
  };
  /** The selected pages in order when more than one is selected, else null. */
  const multiSelectedPages = (): number[] | null =>
    app.selectedPages.size > 1 ? [...app.selectedPages].sort((a, b) => a - b) : null;
  const thumbs = new Thumbs($("#thumbs"), app);
  const commentsPanel = new CommentsPanel($("#comments"), app);
  // debugging/test hook: the main objects, reachable from the console and the e2e tests
  (window as unknown as { __margin: unknown }).__margin = { app, viewer, ix: interact, arrange, Growable: Growable, splitByCoverage, writeRichText };
  const bookmarks = new Bookmarks(app, viewer);
  const pagesPane = h(
    "div",
    { class: "side-pane", id: "pane-pages" },
    pageActions((action) => pageAction(action)),
    thumbs.list,
  );
  bookmarks.el.id = "pane-bookmarks";
  bookmarks.el.classList.add("side-pane");
  bookmarks.el.hidden = true;
  /** A sidebar tab button ("pages" or "bookmarks") with a count badge. */
  const sideTab = (name: string, label: string, countId: string) =>
    h(
      "button",
      {
        class: "side-tab",
        type: "button",
        role: "tab",
        id: "tab-" + name,
        "aria-controls": "pane-" + name,
        onclick: () => showSidePane(name),
      },
      h("span", { text: label }),
      h("span", { class: "count", id: countId }),
    );
  /** Shows one sidebar pane and remembers the choice in localStorage. */
  const showSidePane = (name: string) => {
    for (const pane of ["pages", "bookmarks"]) {
      const isOn = pane === name;
      $("#tab-" + pane).setAttribute("aria-selected", String(isOn));
      $("#tab-" + pane).classList.toggle("on", isOn);
      $("#pane-" + pane).hidden = !isOn;
    }
    try {
      localStorage.setItem("margin.side", name);
    } catch {}
  };
  $("#thumbs").append(
    h(
      "div",
      { class: "panel-head side-tabs", role: "tablist", "aria-label": "Sidebar" },
      sideTab("pages", "Pages", "page-count"),
      sideTab("bookmarks", "Bookmarks", "bm-count"),
    ),
    pagesPane,
    bookmarks.el,
  );
  bookmarks.onCount = (count) => {
    $("#bm-count").textContent = count ? String(count) : "";
  };
  showSidePane(
    (() => {
      try {
        return localStorage.getItem("margin.side") === "bookmarks" ? "bookmarks" : "pages";
      } catch {
        return "pages";
      }
    })(),
  );
  const rail = $("#rail");
  [
    ["select", "arrange", "edittext", "addtext"],
    ["highlight", "underline", "strike"],
    ["textbox", "draw", "line", "rect", "ellipse", "note"],
    ["image", "stamp", "sign", "link"],
    ["form", "redact", "crop"],
  ].forEach((group, groupIndex) => {
    if (groupIndex) {
      rail.append(h("div", { class: "rail-sep", role: "separator" }));
    }
    for (const tool of group) {
      const info = TOOL_INFO[tool];
      rail.append(
        h(
          "button",
          {
            class: "tool",
            type: "button",
            "data-tool": tool,
            "aria-label": `${info.label} (${info.key})`,
            title: `${info.label}  ${info.key}`,
            onclick: () => app.setTool(tool),
          },
          icon(info.icon),
          h("span", { class: "tool-label", text: info.label }),
        ),
      );
    }
  });
  rail.addEventListener("pointerover", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>(".tool");
    if (!button) return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--lx", rect.right + 8 + "px");
    button.style.setProperty("--ly", rect.top + rect.height / 2 + "px");
  });
  rail.addEventListener("focusin", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>(".tool");
    if (!button) return;
    const rect = button.getBoundingClientRect();
    button.style.setProperty("--lx", rect.right + 8 + "px");
    button.style.setProperty("--ly", rect.top + rect.height / 2 + "px");
  });
  app.onTool((tool) =>
    rail.querySelector(`.tool[data-tool="${tool}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" }),
  );
  const ribbon = $("#ribbon");
  /** Ribbon colour swatches for a tool setting; picking saves the settings and re-renders the ribbon. */
  const swatchRow = (colors: RGBA[], current: RGBA, pick: (color: RGBA) => unknown, label: string) =>
    h(
      "div",
      { class: "swatches", role: "radiogroup", "aria-label": label },
      ...colors.map((color) =>
        h("button", {
          class: "sw" + (sameColor(color, current) ? " on" : ""),
          type: "button",
          role: "radio",
          "aria-checked": String(sameColor(color, current)),
          "aria-label": `rgb ${color.slice(0, 3).join(" ")}`,
          style: { background: `rgb(${color[0]},${color[1]},${color[2]})` },
          onclick: () => {
            pick(color);
            app.saveSettings();
            renderRibbon();
          },
        }),
      ),
    );
  /** Ribbon stroke-width chips (1, 2, 4, 8 pt) for a tool setting; picking saves and re-renders. */
  const widthChips = (current: number, pick: (width: number) => unknown) =>
    h(
      "div",
      { class: "chips", role: "radiogroup", "aria-label": "Stroke width" },
      ...[1, 2, 4, 8].map((width) =>
        h(
          "button",
          {
            class: "chip" + (width === current ? " on" : ""),
            type: "button",
            role: "radio",
            "aria-checked": String(width === current),
            title: `${width} pt`,
            onclick: () => {
              pick(width);
              app.saveSettings();
              renderRibbon();
            },
          },
          h("span", { class: "wline", style: { height: Math.min(width, 6) + "px" } }),
          h("span", { class: "num", text: `${width}` }),
        ),
      ),
    );
  /** A labelled ribbon control. */
  const field = (label: string, control: Node) =>
    h("label", { class: "rfield" }, h("span", { class: "rlabel", text: label }), control);
  /** "#rrggbb" for an RGBA colour (alpha dropped). */
  const toHex = (rgba: RGBA): string =>
    "#" +
    rgba
      .slice(0, 3)
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("");
  /** Opaque RGBA from a "#rrggbb" string. */
  const fromHex = (hex: string): RGBA => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
    255,
  ];
  /**
   * Colour swatches with an optional None and a custom colour picker; `pick` gets an RGBA or null.
   * Unlike swatchRow it does not save settings or re-render by itself.
   */
  function colorPickerRow(
    colors: RGBA[],
    current: RGBA | null,
    pick: (color: RGBA | null) => unknown,
    label: string,
    allowNone = false,
  ) {
    const isPreset = !current || colors.some((color) => sameColor(color, current));
    const customInput = h("input", {
      type: "color",
      class: "sw custom" + (isPreset ? "" : " on"),
      title: "Custom colour…",
      "aria-label": `${label}: custom colour`,
      value: current ? toHex(current) : "#3b82f6",
      style: isPreset ? {} : { background: rgbCss(current) },
    });
    customInput.addEventListener("change", () => pick(fromHex(customInput.value)));
    return h(
      "div",
      { class: "swatches", role: "radiogroup", "aria-label": label },
      ...(allowNone
        ? [
            h("button", {
              class: "sw none" + (current ? "" : " on"),
              type: "button",
              role: "radio",
              "aria-checked": String(!current),
              title: "None",
              "aria-label": "None",
              onclick: () => pick(null),
            }),
          ]
        : []),
      ...colors.map((color) => {
        const isOn = !!current && sameColor(color, current);
        return h("button", {
          class: "sw" + (isOn ? " on" : ""),
          type: "button",
          role: "radio",
          "aria-checked": String(isOn),
          "aria-label": `rgb ${color.slice(0, 3).join(" ")}`,
          style: { background: rgbCss(color) },
          onclick: () => pick(color),
        });
      }),
      customInput,
    );
  }
  /** Opacity slider (10–100 %); shows the value while dragging and commits on release. */
  function opacityField(opacity: number, commit: (opacity: number) => unknown) {
    const valueLabel = h("span", { class: "unit op-val", text: Math.round(opacity * 100) + "%" });
    const slider = h("input", {
      type: "range",
      class: "op-range",
      min: "10",
      max: "100",
      step: "5",
      value: String(Math.round(opacity * 100)),
      "aria-label": "Opacity",
    });
    slider.addEventListener("input", () => (valueLabel.textContent = slider.value + "%"));
    slider.addEventListener("change", () => commit(+slider.value / 100));
    return field("Opacity", h("span", { class: "withunit" }, slider, valueLabel));
  }
  /** Fill colours offered for rectangles and ellipses: white plus the highlight palette. */
  const SHAPE_FILLS: RGBA[] = [[255, 255, 255, 255], ...PALETTES.highlight];
  /**
   * Ribbon controls for typed text (Add text / Edit text): font, size, bold/italic/underline/strike, list and
   * alignment buttons, line spacing and colour. They act on the open editor, or on the defaults when none is open.
   */
  function textStyleItems(): Node[] {
    const editor = interact.editor;
    const current = editor
      ? { fontKey: editor.selFont || editor.fontKey, size: editor.selSize || editor.size, color: editor.color }
      : { fontKey: app.settings.textFont, size: app.settings.textSize, color: app.settings.textColor };
    const fontSelect = h("select", { class: "rselect", id: "font-select", "aria-label": "Font" });
    for (const group of FONT_GROUPS)
      fontSelect.append(
        h(
          "optgroup",
          { label: group },
          ...FONTS.filter((font) => font.group === group).map((font) =>
            h("option", { value: font.key, text: font.label, selected: font.key === current.fontKey }),
          ),
        ),
      );
    fontSelect.addEventListener("change", () => {
      if (interact.editor) {
        interact.setEditorStyle({ fontKey: fontSelect.value });
      } else {
        app.settings.textFont = fontSelect.value;
        app.saveSettings();
        loadFont(fontByKey(fontSelect.value)).catch((err) => toast(err.message, "err"));
      }
    });
    const sizeInput = h("input", {
      class: "rnum",
      id: "font-size",
      type: "number",
      min: "4",
      max: "144",
      step: "0.5",
      value: String(Math.round(current.size * 10) / 10),
      "aria-label": "Font size in points",
    });
    sizeInput.addEventListener("change", () => {
      const size = Math.max(4, Math.min(144, +sizeInput.value || 12));
      if (interact.editor) {
        interact.setEditorStyle({ size });
      } else {
        app.settings.textSize = size;
        app.saveSettings();
      }
    });
    const colorSwatches = swatchRow(
      PALETTES.pen,
      current.color as RGBA,
      (color) => {
        if (interact.editor) {
          interact.setEditorStyle({ color });
        } else {
          app.settings.textColor = color;
        }
      },
      "Text color",
    );
    const style = editor ? editor.style : parseStyleCode(app.settings.textStyle);
    const keepFocus = (event: MouseEvent) => event.preventDefault();
    const styleButton = (
      key: StyleFlag,
      label: string,
      text: string,
      cls: string,
      shortcut: string,
    ) =>
      h("button", {
        class: "fmt " + cls + (style[key] ? " on" : ""),
        type: "button",
        "aria-pressed": String(!!style[key]),
        "aria-label": label,
        title: `${label} (Ctrl+${shortcut})`,
        text,
        onmousedown: keepFocus,
        onclick: () => applyTextStyle({ [key]: !style[key] }),
      });
    const styleGroup = h(
      "div",
      { class: "fmt-group", role: "group", "aria-label": "Text style" },
      styleButton("bold", "Bold", "B", "b", "B"),
      styleButton("italic", "Italic", "I", "i", "I"),
      styleButton("underline", "Underline", "U", "u", "U"),
      styleButton("strike", "Strikethrough", "S", "s", "Shift+X"),
    );
    const items = [
      field("Font", fontSelect),
      field("Size", h("span", { class: "withunit" }, sizeInput, h("span", { class: "unit", text: "pt" }))),
      styleGroup,
    ];
    if (!editor || editor.kind !== "object") {
      const align = editor ? editor.align : app.settings.textAlign;
      const alignButton = (value: string, label: string, iconName: string) =>
        h(
          "button",
          {
            class: "fmt" + (align === value ? " on" : ""),
            type: "button",
            "aria-pressed": String(align === value),
            "aria-label": label,
            title: label,
            onmousedown: keepFocus,
            onclick: () => applyTextAlign(value),
          },
          icon(iconName),
        );
      if (editor) {
        const list = editor.list || null;
        const listButton = (kind: "b" | "n", label: string, iconName: string) =>
          h(
            "button",
            {
              class: "fmt" + (list === kind ? " on" : ""),
              type: "button",
              "aria-pressed": String(list === kind),
              "aria-label": label,
              title: label,
              onmousedown: keepFocus,
              onclick: () => interact.toggleList(kind),
            },
            icon(iconName),
          );
        items.push(
          h(
            "div",
            { class: "fmt-group", role: "group", "aria-label": "Lists" },
            listButton("b", "Bulleted list", "listb"),
            listButton("n", "Numbered list", "listn"),
          ),
        );
      }
      items.push(
        h(
          "div",
          { class: "fmt-group", role: "group", "aria-label": "Alignment" },
          alignButton("left", "Align left", "alignl"),
          alignButton("center", "Center", "alignc"),
          alignButton("right", "Align right", "alignr"),
          alignButton("justify", "Justify (wrapped text)", "alignj"),
        ),
      );
      const lineHeight = editor ? editor.lh : app.settings.textLh;
      const spacings = [1, 1.15, 1.5, 2, 2.5];
      if (!spacings.some((v) => Math.abs(v - lineHeight) < 0.01)) {
        spacings.push(+lineHeight.toFixed(2));
        spacings.sort((a, b) => a - b);
      }
      const spacingSelect = h(
        "select",
        { class: "rselect narrow", id: "line-height", "aria-label": "Line spacing" },
        ...spacings.map((v) =>
          h("option", { value: String(v), text: String(v), selected: Math.abs(v - lineHeight) < 0.01 }),
        ),
      );
      spacingSelect.addEventListener("change", () => {
        const value = +spacingSelect.value;
        if (interact.editor) {
          interact.setEditorStyle({ lh: value });
        } else {
          app.settings.textLh = value;
          app.saveSettings();
        }
      });
      items.push(field("Spacing", spacingSelect));
    }
    items.push(colorSwatches);
    return items;
  }
  /** Ribbon controls for a text box: font, size, text colour, fill and border; `change` gets the edited fields. */
  function freeTextStyleItems(
    style: FreeTextRibbonStyle,
    change: (patch: Partial<FreeTextRibbonStyle>) => unknown,
  ): Node[] {
    const fontSelect = h("select", { class: "rselect", "aria-label": "Font" });
    for (const group of FONT_GROUPS)
      fontSelect.append(
        h(
          "optgroup",
          { label: group },
          ...FONTS.filter((font) => font.group === group).map((font) =>
            h("option", { value: font.key, text: font.label, selected: font.key === style.textFont }),
          ),
        ),
      );
    fontSelect.addEventListener("change", () => change({ textFont: fontSelect.value }));
    const sizeInput = h("input", {
      class: "rnum",
      type: "number",
      min: "4",
      max: "96",
      step: "0.5",
      value: String(style.ftSize),
      "aria-label": "Font size in points",
    });
    sizeInput.addEventListener("change", () => change({ ftSize: Math.max(4, Math.min(96, +sizeInput.value || 12)) }));
    const swatches = (
      colors: (RGBA | null)[],
      current: RGBA | null,
      pick: (color: RGBA | null) => unknown,
      label: string,
    ) =>
      h(
        "div",
        { class: "swatches", role: "radiogroup", "aria-label": label },
        ...colors.map((color) => {
          const isOn = color === null ? current === null : !!current && sameColor(color, current);
          return h("button", {
            class: "sw" + (isOn ? " on" : "") + (color ? "" : " none"),
            type: "button",
            role: "radio",
            "aria-checked": String(isOn),
            title: color ? `rgb ${color.slice(0, 3).join(" ")}` : "None",
            "aria-label": color ? `rgb ${color.slice(0, 3).join(" ")}` : "None",
            style: color ? { background: `rgb(${color[0]},${color[1]},${color[2]})` } : {},
            onclick: () => pick(color),
          });
        }),
      );
    return [
      fontSelect,
      h("span", { class: "withunit" }, sizeInput, h("span", { class: "unit", text: "pt" })),
      field(
        "Text",
        swatches(PALETTES.pen, style.ftColor, (color) => change({ ftColor: color as RGBA }), "Text color"),
      ),
      field(
        "Fill",
        swatches(
          [null, [255, 255, 255, 255], [255, 249, 196, 255], [219, 234, 254, 255], [252, 231, 243, 255]],
          style.ftFill,
          (color) => change({ ftFill: color }),
          "Fill",
        ),
      ),
      field(
        "Border",
        swatches([null, ...PALETTES.pen], style.ftBorder, (color) => change({ ftBorder: color }), "Border"),
      ),
    ];
  }
  /** Confirms, then applies every redaction mark in the document (removing what lies under them). */
  async function confirmApplyRedactions(): Promise<void> {
    const marks = app.doc.redactMarks();
    const count = marks.reduce((sum: number, mark: PageRects) => sum + mark.rects.length, 0);
    if (
      !count ||
      (await modal({
        title: `Apply ${count} redaction${count === 1 ? "" : "s"}?`,
        body: h(
          "div",
          { class: "stack" },
          h("p", {
            class: "modal-text",
            text: `Text, images and drawings under the marks on ${marks.length} page${marks.length === 1 ? "" : "s"} are removed from the file, along with comments and form fields that sit mostly inside them.`,
          }),
          h("p", {
            class: "modal-text",
            text: "Undo works until you close this file, but a saved copy can’t be un-redacted.",
          }),
        ),
        actions: [
          { id: "cancel", label: "Cancel" },
          { id: "go", label: "Redact", danger: true },
        ],
      })) !== "go"
    )
      return;
    let pages = 0;
    await app
      .mutate("Apply redactions", { pages: "all" }, () => {
        pages = app.doc.applyRedactions(app.settings.redactFill);
        app.mustRewrite = true;
      })
      .catch((err) => toast(err.message, "err"));
    if (pages) {
      toast(`Redacted ${count} area${count === 1 ? "" : "s"} on ${pages} page${pages === 1 ? "" : "s"}`);
    }
  }
  /** Toggles bold/italic/underline/strike on the editor selection, or on the default text style. */
  function applyTextStyle(style: Record<string, boolean>): void {
    if (interact.editor) {
      interact.setEditorStyle({ style });
    } else {
      app.settings.textStyle = styleCode({ ...parseStyleCode(app.settings.textStyle), ...style });
      app.saveSettings();
    }
    renderRibbon();
  }
  /** Sets the paragraph alignment of the open editor, or the default alignment. */
  function applyTextAlign(align: string): void {
    if (interact.editor) {
      interact.setEditorStyle({ align });
    } else {
      app.settings.textAlign = align;
      app.saveSettings();
    }
    renderRibbon();
  }
  /** Rebuilds the ribbon (tool options bar) for the current tool and selection. */
  function renderRibbon(): void {
    const tool = app.tool;
    const settings = app.settings;
    const info = TOOL_INFO[tool];
    const items: Node[] = [h("span", { class: "rtool", text: info.label })];
    if (tool === "select") {
      const sel = app.selectedAnnot;
      if (sel) {
        const annot = app.doc.annots(sel.page).find((candidate: AnnotInfo) => candidate.index === sel.index);
        if (annot) {
          if (annot.subtype === 3 && annot.ft) {
            const freeText = app.doc.readFreeText(sel.page, sel.index)!;
            const ftStyle: FreeTextRibbonStyle = {
              ftSize: freeText.style.size,
              ftColor: freeText.style.color,
              ftFill: freeText.style.fill,
              ftBorder: freeText.style.border,
              textFont: freeText.style.fontKey,
            };
            items.push(
              ...freeTextStyleItems(ftStyle, (change) =>
                textBoxes.update(
                  sel.page,
                  sel.index,
                  (data) => ({
                    ...data,
                    style: {
                      ...data.style,
                      ...(change.ftSize ? { size: change.ftSize } : {}),
                      ...(change.ftColor ? { color: change.ftColor } : {}),
                      ...("ftFill" in change ? { fill: change.ftFill } : {}),
                      ...("ftBorder" in change ? { border: change.ftBorder } : {}),
                      ...(change.textFont ? { fontKey: change.textFont } : {}),
                    },
                  }),
                  "Restyle text box",
                ),
              ),
            );
          } else if (annot.subtype === ANNOT.SQUARE || annot.subtype === ANNOT.CIRCLE) {
            const style = app.doc.annotStyle(sel.page, sel.index) || {
              width: 1,
              dashed: false,
              fill: null,
              opacity: 1,
            };
            const run = (apply: () => unknown, label: string) =>
              app.mutate(label, { pages: [sel.page] }, apply).catch((err) => toast(err.message, "err"));
            const setStyle = (patch: Partial<AnnotStyle>, label: string) => run(() => app.doc.setAnnotStyle(sel.page, sel.index, patch), label);
            items.push(
              field(
                "Outline",
                colorPickerRow(
                  PALETTES.pen,
                  annot.color,
                  (color) =>
                    !color && !style.fill
                      ? toast("A shape needs an outline or a fill", "warn")
                      : run(
                          () => app.doc.setAnnotColor(sel.page, sel.index, color),
                          color ? "Outline colour" : "Remove outline",
                        ),
                  "Outline colour",
                  true,
                ),
              ),
              field(
                "Fill",
                colorPickerRow(
                  SHAPE_FILLS,
                  style.fill,
                  (color) =>
                    !color && !annot.color
                      ? toast("A shape needs an outline or a fill", "warn")
                      : setStyle({ fill: color }, color ? "Fill shape" : "Remove fill"),
                  "Fill colour",
                  true,
                ),
              ),
              h(
                "div",
                { class: "chips", role: "radiogroup", "aria-label": "Outline width" },
                ...[1, 2, 4, 8].map((width) => {
                  const isOn = Math.abs(style.width - width) < 0.26;
                  return h(
                    "button",
                    {
                      class: "chip" + (isOn ? " on" : ""),
                      type: "button",
                      role: "radio",
                      "aria-checked": String(isOn),
                      title: `${width} pt`,
                      onclick: () => setStyle({ width }, "Outline width"),
                    },
                    h("span", { class: "wline", style: { height: Math.min(width, 6) + "px" } }),
                    h("span", { class: "num", text: `${width}` }),
                  );
                }),
                h(
                  "button",
                  {
                    class: "chip" + (style.dashed ? " on" : ""),
                    type: "button",
                    "aria-pressed": String(style.dashed),
                    title: "Dashed outline",
                    onclick: () =>
                      setStyle({ dashed: !style.dashed }, style.dashed ? "Solid outline" : "Dashed outline"),
                  },
                  "Dashed",
                ),
              ),
              opacityField(style.opacity, (opacity) => setStyle({ opacity }, "Opacity")),
            );
          } else if (annot.subtype !== 13 && annot.color) {
            items.push(
              colorPickerRow(
                annot.subtype === 9 || annot.subtype === 1 ? PALETTES.highlight : PALETTES.pen,
                annot.color,
                (color) =>
                  app
                    .mutate("Change color", { pages: [sel.page] }, () =>
                      app.doc.setAnnotColor(sel.page, sel.index, color),
                    )
                    .catch((err) => toast(err.message, "err")),
                "Annotation color",
              ),
            );
            if (
              annot.subtype === ANNOT.LINE ||
              annot.subtype === ANNOT.INK ||
              (annot.subtype >= 9 && annot.subtype <= 12)
            ) {
              const style = app.doc.annotStyle(sel.page, sel.index);
              if (style) {
                items.push(
                  opacityField(style.opacity, (opacity) =>
                    app
                      .mutate("Opacity", { pages: [sel.page] }, () =>
                        app.doc.setAnnotStyle(sel.page, sel.index, { opacity }),
                      )
                      .catch((err) => toast(err.message, "err")),
                  ),
                );
              }
            }
          }
          items.push(
            h(
              "button",
              { class: "btn ghost small", type: "button", onclick: () => deleteSelectedAnnot() },
              icon("trash"),
              "Delete",
            ),
          );
          items.push(
            h("span", {
              class: "hint",
              text:
                annot.subtype >= 9 && annot.subtype <= 12
                  ? "Text markup stays attached to its text."
                  : annot.subtype === 3
                    ? "Drag to move. Double-click to edit the text."
                    : "Drag to move. Double-click to comment.",
            }),
          );
        }
      } else items.push(h("span", { class: "hint", text: info.hint }));
    } else if (tool === "arrange") {
      const sel = arrange.sel;
      const current = arrange.current();
      if (arrange.cropping)
        items.push(
          h(
            "button",
            {
              class: "btn primary small",
              type: "button",
              title: "Enter",
              onclick: () => arrange.applyCrop(encodePixels),
            },
            icon("crop"),
            "Apply crop",
          ),
          h(
            "button",
            { class: "btn ghost small", type: "button", title: "Esc", onclick: () => arrange.cancelCrop() },
            "Cancel",
          ),
          h("span", {
            class: "hint",
            text: "Drag the edges to choose what to keep. Cropping trims the picture itself, so the cut part leaves the file.",
          }),
        );
      else if (sel) {
        const iconButton = (title: string, iconName: string, onClick: () => unknown, disabled = false) =>
          h(
            "button",
            {
              class: "iconbtn",
              type: "button",
              title,
              "aria-label": title,
              disabled,
              onclick: onClick,
            },
            icon(iconName),
          );
        const count = arrange.selected().length;
        items.push(
          h(
            "div",
            { class: "fmt-group", role: "group", "aria-label": count > 1 ? "Align" : "Align to page" },
            iconButton(count > 1 ? "Align left edges" : "Align to the page’s left edge", "al-left", () =>
              arrange.align("left"),
            ),
            iconButton(count > 1 ? "Align centres" : "Centre on the page", "al-hcenter", () =>
              arrange.align("hcenter"),
            ),
            iconButton(count > 1 ? "Align right edges" : "Align to the page’s right edge", "al-right", () =>
              arrange.align("right"),
            ),
            iconButton(count > 1 ? "Align tops" : "Align to the page’s top", "al-top", () => arrange.align("top")),
            iconButton(count > 1 ? "Align middles" : "Centre on the page vertically", "al-vmiddle", () =>
              arrange.align("vmiddle"),
            ),
            iconButton(count > 1 ? "Align bottoms" : "Align to the page’s bottom", "al-bottom", () =>
              arrange.align("bottom"),
            ),
          ),
          h(
            "div",
            { class: "fmt-group", role: "group", "aria-label": "Distribute and match size" },
            iconButton("Distribute across (3 or more)", "dist-h", () => arrange.distribute("h"), count < 3),
            iconButton("Distribute down (3 or more)", "dist-v", () => arrange.distribute("v"), count < 3),
            iconButton("Match width of the last clicked", "match-w", () => arrange.matchSize("w"), count < 2),
            iconButton("Match height of the last clicked", "match-h", () => arrange.matchSize("h"), count < 2),
            iconButton("Match size of the last clicked", "match-both", () => arrange.matchSize("both"), count < 2),
          ),
          h(
            "div",
            { class: "fmt-group", role: "group", "aria-label": "Order" },
            iconButton("Bring to front (Ctrl+Shift+])", "z-front", () => arrange.restack("front")),
            iconButton("Bring forward (Ctrl+])", "z-forward", () => arrange.restack("forward")),
            iconButton("Send backward (Ctrl+[)", "z-backward", () => arrange.restack("backward")),
            iconButton("Send to back (Ctrl+Shift+[)", "z-back", () => arrange.restack("back")),
          ),
        );
        if (current?.kind === "image") {
          items.push(
            h(
              "div",
              { class: "fmt-group", role: "group", "aria-label": "Image" },
              iconButton("Rotate left", "rotl", () => arrange.turn("rotl")),
              iconButton("Rotate right", "rotr", () => arrange.turn("rotr")),
              iconButton("Flip horizontally", "fliph", () => arrange.turn("fliph")),
              iconButton("Flip vertically", "flipv", () => arrange.turn("flipv")),
            ),
          );
          if (current.label === "Image") {
            items.push(
              h(
                "button",
                { class: "btn ghost small", type: "button", onclick: () => arrange.startCrop() },
                icon("crop"),
                "Crop",
              ),
              h(
                "button",
                { class: "btn ghost small", type: "button", onclick: () => replaceSelectedImage() },
                icon("image"),
                "Replace",
              ),
            );
          }
        }
        items.push(
          h(
            "button",
            { class: "btn ghost small", type: "button", onclick: () => arrange.remove() },
            icon("trash"),
            count > 1 ? `Delete ${count}` : "Delete",
          ),
        );
        if (count === 1 && current?.kind !== "image") {
          items.push(
            h("span", {
              class: "hint",
              text: "Shift-click or drag a box to select more; Alt-click selects what’s behind. Arrows nudge 1 pt (Shift: 10).",
            }),
          );
        }
      } else items.push(h("span", { class: "hint", text: info.hint }));
    } else if (tool === "highlight")
      items.push(
        swatchRow(
          PALETTES.highlight,
          settings.markupColor,
          (color) => (settings.markupColor = color),
          "Highlight color",
        ),
        h("span", { class: "hint", text: info.hint }),
      );
    else if (tool === "underline" || tool === "strike")
      items.push(
        swatchRow(PALETTES.pen, settings.lineMarkupColor, (color) => (settings.lineMarkupColor = color), "Line color"),
        h("span", { class: "hint", text: info.hint }),
      );
    else if (tool === "draw")
      items.push(
        swatchRow(PALETTES.pen, settings.inkColor, (color) => (settings.inkColor = color), "Pen color"),
        widthChips(settings.inkWidth, (width) => (settings.inkWidth = width)),
      );
    else if (tool === "stamp") {
      const stampSelect = h(
        "select",
        { class: "rselect", "aria-label": "Stamp" },
        h(
          "optgroup",
          { label: "English" },
          ...STAMPS.filter((stamp) => !stamp.key.startsWith("th-")).map((stamp) =>
            h("option", { value: stamp.key, text: stamp.label, selected: settings.stamp === stamp.key }),
          ),
        ),
        h(
          "optgroup",
          { label: "ไทย" },
          ...STAMPS.filter((stamp) => stamp.key.startsWith("th-")).map((stamp) =>
            h("option", { value: stamp.key, text: stamp.label, selected: settings.stamp === stamp.key }),
          ),
        ),
        h("option", { value: "custom", text: "Custom…", selected: settings.stamp === "custom" }),
      );
      stampSelect.addEventListener("change", () => {
        settings.stamp = stampSelect.value;
        app.saveSettings();
        renderRibbon();
      });
      const stamp =
        settings.stamp === "custom"
          ? { label: settings.stampCustom || "CUSTOM", color: settings.stampColor }
          : STAMPS.find((stamp) => stamp.key === settings.stamp) || STAMPS[0];
      items.push(
        stampSelect,
        h("span", {
          class: "stamp-chip",
          style: { color: `rgb(${stamp.color[0]},${stamp.color[1]},${stamp.color[2]})` },
          text: stamp.label,
        }),
      );
      if (settings.stamp === "custom") {
        const customText = h("input", {
          class: "tinput narrow",
          id: "stamp-text",
          value: settings.stampCustom,
          placeholder: "Stamp text",
          "aria-label": "Custom stamp text",
        });
        customText.addEventListener("input", () => {
          settings.stampCustom = customText.value;
          app.saveSettings();
        });
        items.push(
          customText,
          swatchRow(
            [
              [196, 40, 40, 255],
              [37, 99, 235, 255],
              [22, 140, 82, 255],
              [124, 77, 219, 255],
              [24, 26, 33, 255],
            ],
            settings.stampColor,
            (color) => (settings.stampColor = color),
            "Stamp color",
          ),
        );
      }
      const datedCheck = h("input", { type: "checkbox", checked: settings.stampDated });
      datedCheck.addEventListener("change", () => {
        settings.stampDated = datedCheck.checked;
        app.saveSettings();
        renderRibbon();
      });
      items.push(h("label", { class: "hf-check" }, datedCheck, "Name & date"));
      if (settings.stampDated) {
        const authorInput = h("input", {
          class: "tinput narrow",
          value: settings.author,
          "aria-label": "Your name",
          placeholder: "Your name",
        });
        authorInput.addEventListener("change", () => {
          settings.author = authorInput.value.trim() || "Me";
          app.saveSettings();
        });
        items.push(authorInput);
      }
      items.push(h("span", { class: "hint", text: info.hint }));
    } else if (tool === "form")
      items.push(
        h(
          "div",
          { class: "chips", role: "radiogroup", "aria-label": "Field type" },
          ...FIELD_KINDS.map((field) =>
            h(
              "button",
              {
                class: "chip" + (settings.formKind === field.kind ? " on" : ""),
                type: "button",
                role: "radio",
                "aria-checked": String(settings.formKind === field.kind),
                onclick: () => {
                  settings.formKind = field.kind;
                  app.saveSettings();
                  renderRibbon();
                },
              },
              field.label,
            ),
          ),
        ),
        h("span", { class: "hint", text: info.hint }),
      );
    else if (tool === "redact") {
      const markCount = app.doc
        .redactMarks()
        .reduce((sum: number, mark: PageRects) => sum + mark.rects.length, 0);
      const modeChip = (mode: string, label: string) =>
        h(
          "button",
          {
            class: "chip" + (settings.redactMode === mode ? " on" : ""),
            type: "button",
            role: "radio",
            "aria-checked": String(settings.redactMode === mode),
            onclick: () => {
              settings.redactMode = mode;
              app.saveSettings();
              renderRibbon();
            },
          },
          label,
        );
      items.push(
        h(
          "div",
          { class: "chips", role: "radiogroup", "aria-label": "Mark" },
          modeChip("text", "Text"),
          modeChip("area", "Area"),
        ),
      );
      const findInput = h("input", {
        class: "tinput narrow",
        placeholder: "Mark every…",
        "aria-label": "Mark every match of this text",
        id: "redact-find",
      });
      const markAll = async () => {
        const text = findInput.value.trim();
        if (!text) return;
        const hits = app.doc.search(text);
        if (!hits.length) return toast(`No matches for “${text}”`, "warn");
        const byPage = new Map<number, Rect[]>();
        for (const hit of hits) byPage.set(hit.page, [...(byPage.get(hit.page) || []), ...hit.rects]);
        await app
          .mutate(`Mark “${text}” for redaction`, { pages: [...byPage.keys()] }, () => {
            for (const [page, rects] of byPage) app.doc.addRedactMark(page, rects, settings.author);
          })
          .catch((err) => toast(err.message, "err"));
        toast(`Marked ${hits.length} match${hits.length === 1 ? "" : "es"}`);
      };
      findInput.addEventListener("keydown", (event) => {
        event.stopPropagation();
        if (event.key === "Enter") {
          markAll();
        }
      });
      items.push(findInput, h("button", { class: "btn ghost small", type: "button", onclick: markAll }, "Mark all"));
      items.push(
        field(
          "Cover",
          h(
            "div",
            { class: "swatches", role: "radiogroup", "aria-label": "Cover colour" },
            ...([[0, 0, 0, 255], [255, 255, 255, 255], null] as Array<RGBA | null>).map((cover) => {
              const isOn =
                cover === null
                  ? settings.redactFill === null
                  : !!settings.redactFill && sameColor(cover, settings.redactFill);
              return h("button", {
                class: "sw" + (isOn ? " on" : "") + (cover ? "" : " none"),
                type: "button",
                role: "radio",
                "aria-checked": String(isOn),
                title: cover ? (cover[0] ? "White" : "Black") : "No cover (leave the area blank)",
                "aria-label": cover ? (cover[0] ? "White" : "Black") : "None",
                style: cover ? { background: `rgb(${cover[0]},${cover[1]},${cover[2]})` } : {},
                onclick: () => {
                  settings.redactFill = cover;
                  app.saveSettings();
                  renderRibbon();
                },
              });
            }),
          ),
        ),
      );
      if (markCount) {
        items.push(
          h(
            "button",
            { class: "btn danger small", type: "button", onclick: () => confirmApplyRedactions() },
            `Apply ${markCount} mark${markCount === 1 ? "" : "s"}`,
          ),
          h(
            "button",
            {
              class: "btn ghost small",
              type: "button",
              onclick: () =>
                app
                  .mutate("Clear redaction marks", { pages: "all" }, () => app.doc.clearRedactMarks())
                  .catch((err) => toast(err.message, "err")),
            },
            "Clear",
          ),
        );
      } else {
        items.push(h("span", { class: "hint", text: info.hint }));
      }
    } else if (tool === "textbox") {
      const kindChip = (callout: boolean, label: string) =>
        h(
          "button",
          {
            class: "chip" + (settings.ftCallout === callout ? " on" : ""),
            type: "button",
            role: "radio",
            "aria-checked": String(settings.ftCallout === callout),
            onclick: () => {
              settings.ftCallout = callout;
              app.saveSettings();
              renderRibbon();
            },
          },
          label,
        );
      items.push(
        h(
          "div",
          { class: "chips", role: "radiogroup", "aria-label": "Kind" },
          kindChip(false, "Text box"),
          kindChip(true, "Callout"),
        ),
        ...freeTextStyleItems(settings, (patch) => {
          Object.assign(settings, patch);
          app.saveSettings();
          renderRibbon();
        }),
        h("span", {
          class: "hint",
          text: textBoxes.open
            ? "Ctrl+Enter or click outside to finish · Esc to cancel"
            : settings.ftCallout
              ? "Press on the target, drag to place the box, type."
              : info.hint,
        }),
      );
    } else if (tool === "line") {
      const endsChip = (ends: string, label: string, glyph: string) =>
        h(
          "button",
          {
            class: "chip" + (settings.lineEnds === ends ? " on" : ""),
            type: "button",
            role: "radio",
            "aria-checked": String(settings.lineEnds === ends),
            onclick: () => {
              settings.lineEnds = ends;
              app.saveSettings();
              renderRibbon();
            },
          },
          h("span", { class: "num", text: glyph }),
          label,
        );
      items.push(
        h(
          "div",
          { class: "chips", role: "radiogroup", "aria-label": "Line ends" },
          endsChip("none", "Line", "—"),
          endsChip("arrow", "Arrow", "→"),
          endsChip("double", "Double", "↔"),
        ),
        swatchRow(PALETTES.pen, settings.lineColor, (color) => (settings.lineColor = color), "Line color"),
        widthChips(settings.lineWidth, (width) => (settings.lineWidth = width)),
        h("span", { class: "hint", text: info.hint }),
      );
    } else if (tool === "rect" || tool === "ellipse") {
      const applySetting = (assign: () => unknown) => (assign(), app.saveSettings(), renderRibbon());
      items.push(
        field(
          "Outline",
          colorPickerRow(
            PALETTES.pen,
            settings.shapeColor,
            (color) => applySetting(() => (settings.shapeColor = color)),
            "Outline colour",
            true,
          ),
        ),
        field(
          "Fill",
          colorPickerRow(
            SHAPE_FILLS,
            settings.shapeFill,
            (fill) => applySetting(() => (settings.shapeFill = fill)),
            "Fill colour",
            true,
          ),
        ),
        widthChips(settings.shapeWidth, (width) => (settings.shapeWidth = width)),
        opacityField(settings.shapeOpacity ?? 1, (opacity) => applySetting(() => (settings.shapeOpacity = opacity))),
      );
    } else if (tool === "note")
      items.push(
        swatchRow(PALETTES.highlight, settings.noteColor, (color) => (settings.noteColor = color), "Note color"),
        h("span", { class: "hint", text: info.hint }),
      );
    else if (tool === "addtext")
      items.push(
        ...textStyleItems(),
        h("span", {
          class: "hint",
          text: interact.editor
            ? "Select words to style them · Ctrl+Enter or click outside to finish"
            : "Click to type, or drag across to set a width the text wraps to.",
        }),
      );
    else if (tool === "edittext")
      if (interact.editor) {
        items.push(
          ...textStyleItems(),
          h("span", {
            class: "hint",
            text:
              interact.editor.kind === "object"
                ? "Enter to save · Shift+Enter adds a line · Esc cancels"
                : "Select words to style them · Ctrl+Enter or click outside to save · Esc cancels",
          }),
        );
      } else {
        items.push(h("span", { class: "hint", text: info.hint }));
      }
    else if (tool === "crop") {
      const sel = crop.sel;
      const multiPages = multiSelectedPages();
      const allPages = [...Array(app.doc.pageCount).keys()];
      if (sel) {
        items.push(
          h(
            "button",
            { class: "btn primary small", type: "button", title: "Enter", onclick: () => crop.apply([sel.page]) },
            icon("crop"),
            `Crop page ${sel.page + 1}`,
          ),
        );
        if (multiPages) {
          items.push(
            h(
              "button",
              { class: "btn ghost small", type: "button", onclick: () => crop.apply(multiPages) },
              `Crop ${multiPages.length} selected pages`,
            ),
          );
        }
        if (app.doc.pageCount > 1) {
          items.push(
            h(
              "button",
              { class: "btn ghost small", type: "button", onclick: () => crop.apply(allPages) },
              "Crop all pages",
            ),
          );
        }
        items.push(
          h(
            "button",
            {
              class: "btn ghost small",
              type: "button",
              title: "Esc",
              onclick: () => {
                crop.sel = null;
                crop.refresh();
                renderRibbon();
              },
            },
            "Cancel",
          ),
        );
        items.push(h("span", { class: "hint", text: "Drag the edges to adjust. Other pages lose the same margins." }));
      } else {
        items.push(h("span", { class: "hint", text: info.hint }));
        const page = app.currentPage;
        if (crop.isCropped(page)) {
          items.push(
            h(
              "button",
              { class: "btn ghost small", type: "button", onclick: () => crop.reset([page]) },
              `Uncrop page ${page + 1}`,
            ),
          );
        }
        if (app.doc.pageCount > 1 && allPages.some((other) => other !== page && crop.isCropped(other))) {
          items.push(
            h(
              "button",
              { class: "btn ghost small", type: "button", onclick: () => crop.reset(allPages) },
              "Uncrop all pages",
            ),
          );
        }
      }
    } else if (tool === "image") {
      const image = interact.image;
      if (image) {
        items.push(
          h(
            "span",
            { class: "img-pick" },
            h("img", { src: image.url, alt: "" }),
            h("span", { class: "mono", text: `${image.w}×${image.h}` }),
          ),
        );
      }
      items.push(
        h(
          "button",
          { class: "btn ghost small", type: "button", onclick: () => interact.chooseImage() },
          icon("image"),
          image ? "Choose another" : "Choose image",
        ),
      );
      items.push(h("span", { class: "hint", text: image ? info.hint : "Choose an image to place." }));
    } else if (tool === "sign") {
      if (interact.saved.length) {
        items.push(
          h(
            "div",
            { class: "sig-strip", role: "radiogroup", "aria-label": "Signature to place" },
            ...interact.saved.map((sig, idx) =>
              h(
                "button",
                {
                  class: "sig-pick" + (idx === interact.activeSig ? " on" : ""),
                  type: "button",
                  role: "radio",
                  "aria-checked": String(idx === interact.activeSig),
                  "aria-label": `Signature ${idx + 1}`,
                  onclick: () => interact.chooseSaved(idx),
                },
                h("img", { src: sig.url, alt: "" }),
              ),
            ),
          ),
        );
      }
      items.push(
        h(
          "button",
          {
            class: "btn ghost small",
            type: "button",
            onclick: async () => {
              await interact.captureSignature();
              renderRibbon();
            },
          },
          icon("plus"),
          interact.saved.length ? "New signature" : "Draw signature",
        ),
      );
      if (interact.signature) {
        items.push(
          h(
            "button",
            {
              class: "btn ghost small",
              type: "button",
              title: "Remove the selected signature from this browser",
              onclick: () => interact.removeSaved(interact.activeSig),
            },
            icon("trash"),
            "Remove",
          ),
        );
      }
      items.push(h("span", { class: "hint", text: interact.signature ? info.hint : "Draw a signature to start." }));
    }
    if (items.length === 1) {
      items.push(h("span", { class: "hint", text: info.hint }));
    }
    ribbon.replaceChildren(...items);
  }
  const isPdfFile = (file: File) => /pdf$/i.test(file.type) || /\.pdf$/i.test(file.name);
  const openFileInput = h("input", { type: "file", accept: "application/pdf,.pdf," + IMAGE_ACCEPT, multiple: true, hidden: true, id: "file-open" });
  const insertFileInput = h("input", {
    type: "file",
    accept: "application/pdf,.pdf," + IMAGE_ACCEPT,
    multiple: true,
    hidden: true,
    id: "file-merge",
  });
  const replaceFileInput = h("input", {
    type: "file",
    accept: "application/pdf,.pdf",
    hidden: true,
    id: "file-replace",
  });
  // Compare: the picked file is the earlier version, the open document the later one (Swap in the view).
  const compareFileInput = h("input", { type: "file", accept: "application/pdf,.pdf", hidden: true, id: "file-compare" });
  compareFileInput.addEventListener("change", async () => {
    const file = compareFileInput.files?.[0];
    compareFileInput.value = "";
    if (!file) return;
    if (interact.editor) interact.commitEditor();
    let other: Doc | null = null;
    try {
      other = await loadPdfFile(file, "compare with");
    } catch (err) {
      toast((err as Error).message, "err", 5e3);
    }
    if (!other) return;
    try {
      await compareDocs({ doc: other, name: file.name }, { doc: app.doc, name: app.fileName });
    } finally {
      other.close();
    }
  });
  document.body.append(compareFileInput);
  replaceFileInput.addEventListener("change", () => {
    const file = replaceFileInput.files?.[0];
    replaceFileInput.value = "";
    if (file) {
      replacePagesFromFile(file);
    }
  });
  document.body.append(openFileInput, insertFileInput, replaceFileInput);
  $("#btn-open").addEventListener("click", () => openFileInput.click());
  $("#btn-merge").addEventListener("click", () => insertFileInput.click());
  /** The third-party notices shipped with Margin (public/licenses/), in a window. */
  async function showLicences(): Promise<void> {
    let text: string;
    try {
      text = new TextDecoder().decode(await loadAsset("licenses/THIRD_PARTY_NOTICES.txt"));
    } catch (err) {
      toast((err as Error).message, "err");
      return;
    }
    modal({ title: "Open-source licences", body: h("pre", { class: "licences", text }), actions: [{ id: "ok", label: "Close", primary: true }] });
  }
  $("#btn-version").textContent = "v" + VERSION;
  /** The What's new window: every release, the current one marked. */
  const showWhatsNew = () =>
    modal({
      title: `Margin ${VERSION}`,
      body: h(
        "div",
        { class: "changelog" },
        ...CHANGELOG.map((release) =>
          h(
            "section",
            {},
            h(
              "h3",
              {},
              h("span", { class: "mono", text: "v" + release.version }),
              release.version === VERSION ? h("span", { class: "dirty", text: "Current" }) : null,
            ),
            h("ul", {}, ...release.notes.map((note) => h("li", { text: note }))),
          ),
        ),
        h("p", { class: "hint" }, h("button", { class: "clink", type: "button", text: "Open-source licences", onclick: () => showLicences() })),
      ),
      actions: [{ id: "ok", label: "Close", primary: true }],
    });
  // New versions deployed while Margin is open (updates.ts); the version button offers them.
  const updates = new Updates({
    beforeReload: async () => {
      if (interact.editor) interact.commitEditor();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await session.flush();
    },
    showWhatsNew: () => void showWhatsNew(),
  });
  $("#btn-version").addEventListener("click", () => (updates.available ? updates.offer() : showWhatsNew()));
  $("#btn-flatten").addEventListener("click", async () => {
    if (interact.editor) {
      interact.commitEditor();
    }
    const counts = app.doc.flattenCounts();
    if (!counts.annots && !counts.fields)
      return toast("Nothing to flatten: this document has no comments, markup or form fields", "warn", 4e3);
    const annotsCheck = h("input", {
      type: "checkbox",
      id: "fl-annots",
      checked: counts.annots > 0,
      disabled: counts.annots === 0,
    });
    const fieldsCheck = h("input", {
      type: "checkbox",
      id: "fl-fields",
      checked: counts.fields > 0,
      disabled: counts.fields === 0,
    });
    const body = h(
      "div",
      { class: "stack" },
      h("p", {
        class: "modal-text",
        text: "Flattening draws these into the page itself. They will look the same everywhere but can no longer be edited, moved or filled in. Links stay clickable.",
      }),
      h(
        "label",
        { class: "hf-check" },
        annotsCheck,
        `Comments, markup, shapes, stamps and text boxes (${counts.annots})`,
      ),
      h("label", { class: "hf-check" }, fieldsCheck, `Form fields, with what is filled in now (${counts.fields})`),
    );
    if (
      (await modal({
        title: "Flatten",
        body,
        actions: [
          { id: "cancel", label: "Cancel" },
          { id: "go", label: "Flatten", primary: true },
        ],
      })) !== "go"
    )
      return;
    const choice = { annots: annotsCheck.checked, fields: fieldsCheck.checked };
    if (!choice.annots && !choice.fields) return;
    let result = { done: 0, failed: 0 };
    await app
      .mutate("Flatten", { pages: "all" }, () => {
        result = app.doc.flatten(choice);
      })
      .catch((err) => toast(err.message, "err"));
    toast(
      result.failed
        ? `Flattened ${result.done}; ${result.failed} couldn’t be flattened and were left as they are`
        : `Flattened ${result.done} item${result.done === 1 ? "" : "s"}. Undo is available until you close the file.`,
      result.failed ? "warn" : "ok",
      4500,
    );
  });
  const spelling = new Spelling(app, viewer);
  /** Opens the "Export pages as images" dialog (finishing any text edit first). */
  const openExportImages = () => {
    if (interact.editor) {
      interact.commitEditor();
    }
    exportImagesDialog(app, saveFile);
  };
  $("#btn-more").addEventListener("click", () => {
    const rect = $("#btn-more").getBoundingClientRect();
    const clickById = (id: string) => () => $("#" + id).click();
    openMenu(
      rect.right - 240,
      rect.bottom + 6,
      [
        { label: "Scan with camera…", run: () => void scanPages() },
        { label: "Recognise text (OCR)…", disabled: app.limits.locked, run: () => void runOcr() },
        { label: "Compare with another PDF…", run: () => compareFileInput.click() },
        { label: "Detect form fields…", disabled: app.limits.locked, run: () => void detectFormFields() },
        { label: "Print…", shortcut: "Ctrl+P", run: clickById("btn-print") },
        { label: "Export pages as images…", run: openExportImages },
        { label: "Save all images…", run: () => void saveAllImages() },
        { label: "Save a repaired copy", run: () => void saveRepairedCopy() },
        {
          label: "Compress…",
          run: () => {
            if (interact.editor) {
              interact.commitEditor();
            }
            compressDialog(app, FULL_SAVE_MAX);
          },
        },
        {
          label: "Check spelling…",
          shortcut: "F7",
          run: () => {
            if (interact.editor) {
              interact.commitEditor();
            }
            spelling.open();
          },
        },
        "sep",
        { label: "Password protection…", run: clickById("btn-protect") },
        { label: "Watermark & background…", run: clickById("btn-wm") },
        { label: "Header & footer…", run: clickById("btn-hf") },
        { label: "Flatten…", run: clickById("btn-flatten") },
        "sep",
        { label: "Insert pages from PDF or images…", run: () => insertFileInput.click() },
        { label: "Replace pages…", run: () => replaceFileInput.click() },
        { label: "Extract or split pages…", run: () => pageAction("extract") },
      ],
      $<HTMLElement>("#btn-more"),
    );
  });
  $("#btn-print").addEventListener("click", () => {
    if (interact.editor) {
      interact.commitEditor();
    }
    printDialog(app);
  });
  $("#btn-protect").addEventListener("click", () => {
    if (interact.editor) {
      interact.commitEditor();
    }
    protectDialog(app);
  });
  $("#btn-wm").addEventListener("click", () => {
    if (interact.editor) {
      interact.commitEditor();
    }
    watermarkDialog(app, { ...DEFAULT_WATERMARK, ...(app.settings.wm || {}) }, (wm) => {
      app.settings.wm = wm;
      app.saveSettings();
    });
  });
  $("#btn-hf").addEventListener("click", () => {
    if (interact.editor) {
      interact.commitEditor();
    }
    headerFooterDialog(
      app,
      { ...app.settings.hf, images: app.settings.hf.images || {}, imageHeight: app.settings.hf.imageHeight || 24 },
      (hf) => {
        app.settings.hf = hf;
        app.saveSettings();
      },
    );
  });
  openFileInput.addEventListener("change", () => {
    const files = [...(openFileInput.files || [])];
    openFileInput.value = "";
    if (files.length) {
      openFiles(files);
    }
  });
  /** Where the next "Insert pages from PDF" pick goes (set by menus before opening the file picker). */
  let pendingInsertAt: number | null = null;
  insertFileInput.addEventListener("change", async () => {
    const files = [...(insertFileInput.files || [])];
    insertFileInput.value = "";
    const at = pendingInsertAt;
    pendingInsertAt = null;
    if (files.length) {
      insertFiles(files, at ?? undefined);
    }
  });
  $("#btn-undo").addEventListener("click", () => undo());
  $("#btn-redo").addEventListener("click", () => redo());
  $("#btn-save").addEventListener("click", () => saveCurrent());
  $("#btn-zoomin").addEventListener("click", () => viewer.setZoom(viewer.zoom * 1.2));
  $("#btn-zoomout").addEventListener("click", () => viewer.setZoom(viewer.zoom / 1.2));
  $("#btn-fit").addEventListener("click", () => {
    viewer.fit = "width";
    viewer.applyFit();
  });
  // The zoom percentage opens a menu: fit width, fit page, or a set size.
  $("#zoom-level").addEventListener("click", () => {
    const button = $("#zoom-level"), rect = button.getBoundingClientRect();
    const fit = (mode: "width" | "page") => () => {
      viewer.fit = mode;
      viewer.applyFit();
    };
    openMenu(
      rect.left - 40,
      rect.bottom + 6,
      [
        { label: "Fit width", checked: viewer.fit === "width", run: fit("width") },
        { label: "Fit page", checked: viewer.fit === "page", run: fit("page") },
        "sep",
        ...[50, 75, 100, 125, 150, 200, 300, 400].map((pct) => ({
          label: pct + "%",
          checked: !viewer.fit && Math.round(viewer.zoom * 100) === pct,
          run: () => viewer.setZoom(pct / 100),
        })),
      ],
      button,
    );
  });
  // Pages and Comments panels. Where a panel sits beside the page (pages above 860 px, comments above 1180 px)
  // the toggle docks or undocks it and the choice is remembered on this device (body.hide-thumbs / hide-comments);
  // on narrower screens it slides over the page and isn't remembered (body.show-thumbs / show-comments).
  const PANELS = {
    pages: { el: "thumbs", docked: matchMedia("(min-width: 861px)"), button: "#btn-pages", name: "pages", key: "Ctrl+Alt+P" },
    comments: { el: "comments", docked: matchMedia("(min-width: 1181px)"), button: "#btn-comments", name: "comments", key: "Ctrl+Alt+C" },
  } as const;
  type PanelName = keyof typeof PANELS;
  const panelOpen = (name: PanelName) => {
    const panel = PANELS[name];
    return panel.docked.matches ? !document.body.classList.contains("hide-" + panel.el) : document.body.classList.contains("show-" + panel.el);
  };
  const refreshPanelButton = (name: PanelName) => {
    const panel = PANELS[name], open = panelOpen(name), button = $(panel.button);
    button.setAttribute("aria-pressed", String(open));
    button.setAttribute("aria-label", (open ? "Hide " : "Show ") + panel.name);
    button.title = `${open ? "Hide" : "Show"} ${panel.name} (${panel.key})`;
  };
  const setPanel = (name: PanelName, open: boolean) => {
    const panel = PANELS[name];
    if (panel.docked.matches) {
      document.body.classList.toggle("hide-" + panel.el, !open);
      try {
        localStorage.setItem("margin.hide." + name, open ? "0" : "1");
      } catch {}
    } else {
      document.body.classList.toggle("show-" + panel.el, open);
    }
    refreshPanelButton(name);
  };
  const togglePanel = (name: PanelName) => setPanel(name, !panelOpen(name));
  for (const name of Object.keys(PANELS) as PanelName[]) {
    try {
      document.body.classList.toggle("hide-" + PANELS[name].el, localStorage.getItem("margin.hide." + name) === "1");
    } catch {}
    $(PANELS[name].button).addEventListener("click", () => togglePanel(name));
    PANELS[name].docked.addEventListener("change", () => refreshPanelButton(name));
    refreshPanelButton(name);
  }
  const searchInput = $<HTMLInputElement>("#search-input");
  let searchHits: SearchHit[] = [];
  let hitIndex = -1;
  /** Updates the match counter and highlights, and scrolls to the current hit. */
  const showHit = () => {
    $("#search-count").textContent = searchHits.length
      ? `${hitIndex + 1} of ${searchHits.length}`
      : searchInput.value
        ? "No matches"
        : "";
    viewer.setHits(searchHits, hitIndex);
    if (hitIndex >= 0) {
      const hit = searchHits[hitIndex];
      viewer.scrollToPage(hit.page, hit.rects[0]);
    }
  };
  /** Searches the document for the search box text and shows the first hit. */
  const runSearch = () => {
    searchHits = app.doc.search(searchInput.value.trim());
    hitIndex = searchHits.length ? 0 : -1;
    showHit();
  };
  searchInput.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      if (!searchHits.length || searchInput.dataset.last !== searchInput.value) {
        searchInput.dataset.last = searchInput.value;
        runSearch();
      } else {
        hitIndex = (hitIndex + (event.shiftKey ? -1 : 1) + searchHits.length) % searchHits.length;
        showHit();
      }
    }
    if (event.key === "Escape") {
      searchInput.value = "";
      searchHits = [];
      hitIndex = -1;
      showHit();
      searchInput.blur();
    }
  });
  $("#search-next").addEventListener("click", () => {
    if (!searchHits.length) return runSearch();
    hitIndex = (hitIndex + 1) % searchHits.length;
    showHit();
  });
  const replacePanel = $("#replace-panel");
  const replaceTextInput = $<HTMLInputElement>("#replace-input");
  const replaceStatus = $("#rp-status");
  /** Match case / whole words options from the replace panel. */
  const replaceOptions = () => ({
    matchCase: $<HTMLInputElement>("#rp-case").checked,
    wholeWord: $<HTMLInputElement>("#rp-word").checked,
  });
  /** Shows or hides the find & replace panel (toggles by default). */
  const toggleReplacePanel = (show: boolean = replacePanel.hidden) => {
    replacePanel.hidden = !show;
    $("#btn-replace").setAttribute("aria-expanded", String(show));
    if (show) {
      (searchInput.value ? replaceTextInput : searchInput).focus();
    }
  };
  $("#btn-replace").addEventListener("click", () => toggleReplacePanel());
  replacePanel.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Escape") {
      toggleReplacePanel(false);
    }
    if (event.key === "Enter" && event.target === replaceTextInput) {
      $("#rp-one").click();
    }
  });
  $("#rp-one").addEventListener("click", async () => {
    const find = searchInput.value.trim();
    if (!find) {
      searchInput.focus();
      return;
    }
    if (!searchHits.length || searchInput.dataset.last !== searchInput.value) {
      searchInput.dataset.last = searchInput.value;
      runSearch();
      if (!searchHits.length) {
        replaceStatus.textContent = "No matches";
        return;
      }
      return;
    }
    const hit = searchHits[hitIndex];
    if (hit)
      try {
        const replaced = await replaceAt(app, hit.page, hit.rects[0], find, replaceTextInput.value, replaceOptions());
        runSearch();
        const nextIndex = searchHits.findIndex(
          (candidate) =>
            candidate.page > hit.page || (candidate.page === hit.page && candidate.rects[0].t <= hit.rects[0].t + 1),
        );
        if (searchHits.length) {
          hitIndex = Math.max(0, nextIndex);
          showHit();
        }
        replaceStatus.textContent = replaced
          ? `Replaced 1 · ${searchHits.length} left`
          : "That match spans lines or differs in case; skipped";
        if (!replaced && searchHits.length) {
          hitIndex = (searchHits.indexOf(hit) + 1) % searchHits.length;
          showHit();
        }
      } catch (err) {
        toast((err as Error).message, "err");
      }
  });
  $("#rp-all").addEventListener("click", async () => {
    const find = searchInput.value.trim();
    if (!find) {
      searchInput.focus();
      return;
    }
    try {
      const result = await replaceAll(app, find, replaceTextInput.value, replaceOptions());
      runSearch();
      const skipped = countMatches(app, find, replaceOptions());
      replaceStatus.textContent = `Replaced ${result.count} on ${result.pages} page${result.pages === 1 ? "" : "s"}${skipped ? ` · ${skipped} couldn’t be replaced` : ""}`;
      toast(`Replaced ${result.count} match${result.count === 1 ? "" : "es"}`);
    } catch (err) {
      replaceStatus.textContent = (err as Error).message;
    }
  });
  $("#search-prev").addEventListener("click", () => {
    if (searchHits.length) {
      hitIndex = (hitIndex - 1 + searchHits.length) % searchHits.length;
      showHit();
    }
  });
  /** Refreshes the file name, dirty marker, undo/redo buttons, page counter and protection button. */
  const refreshTopBar = () => {
    $("#file-name").textContent = app.fileName;
    $("#file-name").title = app.fileName;
    $("#dirty").hidden = !app.dirty;
    const undoBtn = $<HTMLButtonElement>("#btn-undo");
    const redoBtn = $<HTMLButtonElement>("#btn-redo");
    undoBtn.disabled = !app.canUndo;
    redoBtn.disabled = !app.canRedo;
    undoBtn.title = app.canUndo ? `Undo ${app.undoLabel}` : "Nothing to undo";
    redoBtn.title = app.canRedo ? `Redo ${app.redoLabel}` : "Nothing to redo";
    $("#page-count").textContent = String(app.doc.pageCount);
    $("#page-indicator").textContent = `${app.currentPage + 1} / ${app.doc.pageCount}`;
    const security = app.doc.security();
    const protectBtn = $("#btn-protect");
    protectBtn.classList.toggle("on", security.encrypted);
    protectBtn.classList.toggle("limited", app.limits.locked);
    protectBtn.title = security.encrypted
      ? app.limits.locked
        ? "Protected: changes are limited. Click to unlock"
        : "Password protected (AES-256)"
      : "Password protection";
  };
  viewer.onZoom = (zoom) => {
    $("#zoom-level").textContent = Math.round(zoom * 100) + "%";
  };
  viewer.onPage = (page) => {
    thumbs.follow(page);
    if (app.tool === "crop" && !crop.sel) {
      renderRibbon();
    }
    $("#page-indicator").textContent = `${page + 1} / ${app.doc.pageCount}`;
  };
  thumbs.onGo = (page) => viewer.scrollToPage(page);
  thumbs.onPageAction = (page, action) => {
    if (!app.selectedPages.has(page)) {
      app.selectedPages = new Set([page]);
      thumbs.mark();
    }
    void pageAction(action);
  };
  thumbs.onSelection = () => {};
  thumbs.onInsertBlank = (at) => {
    const refPage = Math.max(0, Math.min(app.doc.pageCount - 1, at > 0 ? at - 1 : 0));
    const { w: width, h: height } = app.doc.pageSize(refPage);
    app
      .mutate("Insert blank page", { pages: "all", structure: true }, () => app.doc.insertBlank(at, width, height))
      .then(() => {
        app.selectedPages = new Set([at]);
        thumbs.mark();
        viewer.scrollToPage(at);
        toast(`Inserted a blank page as page ${at + 1}`);
      })
      .catch((err) => toast(err.message, "err"));
  };
  thumbs.onInsertFrom = (at, files) => {
    if (files) {
      insertFiles(files, at);
    } else {
      pendingInsertAt = at;
      insertFileInput.click();
    }
  };
  thumbs.onMove = (pages, to) =>
    app
      .mutate(pages.length > 1 ? "Move pages" : "Move page", { pages: "all", structure: true }, () => {
        if (!app.doc.movePages(pages, to)) throw new Error("Those pages could not be moved");
        app.selectedPages = new Set(pages.map((page, i) => to + i));
      })
      .catch((err) => toast(err.message, "err"));
  commentsPanel.onGo = (page, annot) => {
    app.setTool("select");
    app.selectedAnnot = { page, index: annot.index };
    interact.refreshOverlays();
    viewer.scrollToPage(page, annot.rect);
    commentsPanel.markSelected();
    renderRibbon();
  };
  interact.onSelect = () => {
    commentsPanel.markSelected();
    renderRibbon();
  };
  interact.onEditor = () => renderRibbon();
  commentsPanel.onEditFreeText = (page, index, text) => {
    textBoxes.update(page, index, (data) => ({ ...data, text }), "Edit text box");
  };
  interact.onImage = () => {
    if (app.tool === "image") {
      renderRibbon();
    }
  };
  interact.onSignatures = () => {
    if (app.tool === "sign") {
      renderRibbon();
    }
  };
  interact.onFormatKey = (key) => {
    const editor = interact.editor;
    if (!editor) return;
    const styleKey = ({ b: "bold", i: "italic", u: "underline", x: "strike" } as Record<string, StyleFlag | undefined>)[key];
    if (styleKey) {
      applyTextStyle({ [styleKey]: !editor.style[styleKey] });
    }
  };
  interact.onNoteCreated = (page, index) => {
    setPanel("comments", true);
    commentsPanel.refresh();
    commentsPanel.focus(page, index);
  };
  app.on((change) => {
    if (change.structure) {
      viewer.rebuild();
      thumbs.rebuild();
    } else {
      viewer.invalidate(change.pages);
      thumbs.invalidate(change.pages);
    }
    if (viewer.hits.length) {
      viewer.setHits([], -1);
      searchHits = [];
      hitIndex = -1;
      $("#search-count").textContent = "";
    }
    commentsPanel.refresh(change);
    refreshTopBar();
    renderRibbon();
  });
  app.onTool((tool) => {
    $$(".tool").forEach((button) => {
      button.classList.toggle("on", button.dataset.tool === tool);
      button.setAttribute("aria-pressed", String(button.dataset.tool === tool));
    });
    document.body.dataset.tool = tool;
    if (interact.editor) {
      interact.commitEditor();
    }
    if (textBoxes.open) {
      textBoxes.open.done(true);
    }
    interact.refreshOverlays();
    commentsPanel.markSelected();
    renderRibbon();
    if (tool === "addtext" || tool === "edittext") {
      loadFont(fontByKey(app.settings.textFont)).catch(() => {});
    }
    if (tool !== "image" && interact.image) {
      interact.setImage(null);
    }
    if (tool === "image") {
      interact.setImage(null);
      interact.chooseImage().then((chosen) => {
        if (!chosen && app.tool === "image" && !interact.image) {
          app.setTool("select");
        }
      });
    }
    if (tool === "sign") {
      interact.chooseSignature().then((chosen) => {
        if (!chosen && app.tool === "sign") {
          app.setTool("select");
        } else {
          renderRibbon();
        }
      });
    }
  });
  /** Opens a PDF file in place of the current document, asking first if there are unsaved changes. */
  /** Opens what the user picked: a PDF, or images as a new PDF (one page each). */
  async function openFiles(files: File[]): Promise<void> {
    const usable = files.filter((file) => isPdfFile(file) || isImageFile(file));
    if (!usable.length) {
      toast(`${files[0].name} isn’t a PDF or an image Margin can open`, "err", 5e3);
      return;
    }
    const pdfs = usable.filter(isPdfFile);
    if (pdfs.length === 1 && usable.length === 1) return openFile(pdfs[0]);
    if (!pdfs.length) return openImages(usable);
    return combineFiles(usable);
  }
  /**
   * Several files at once: put them in order, then one new document with all their pages (images as pages).
   * The combined document starts unsaved, with no undo history of its own making.
   */
  async function combineFiles(files: File[]): Promise<void> {
    if (app.dirty && !(await confirmDiscard())) return;
    const order = await askFileOrder(files);
    if (!order) return;
    const [first, ...rest] = order;
    if (isPdfFile(first)) {
      await openFile(first);
      if (app.fileName !== first.name) return; // not opened (cancelled password, unreadable)
    } else {
      // A leading run of images becomes the first pages.
      let n = 0;
      while (n < order.length && !isPdfFile(order[n])) n++;
      const options = await askImagePages(order.filter((f) => !isPdfFile(f)).length, "Create PDF");
      if (!options) return;
      const made = await imagesAsDoc(order.slice(0, n), options);
      if (!made) return;
      const bytes = made.save();
      made.close();
      await openSource(bytes, pdfNameFor(first));
      rest.splice(0, n - 1);
      pendingImageOptions = options;
    }
    if (rest.length) await insertFiles(rest, app.doc.pageCount);
    pendingImageOptions = null;
    app.undoStack = [];
    app.redoStack = [];
    app.dirty = true;
    app.fileName = app.fileName.replace(/\.pdf$/i, "") + "-combined.pdf";
    refreshTopBar();
    session.schedule();
    app.emit({ pages: "all", structure: true });
    toast(`Combined ${order.length} files into one PDF of ${app.doc.pageCount} pages.`, "ok", 4e3);
  }
  /** Image page options already chosen during a combine (so they aren't asked twice). */
  let pendingImageOptions: Parameters<typeof imagesToDoc>[2] | null = null;
  /** The order to combine files in: a list with move up / down / remove. Null if cancelled. */
  async function askFileOrder(files: File[]): Promise<File[] | null> {
    const order = [...files], list = h("ol", { class: "combine-list" });
    const kb = (n: number) => (n < 1048576 ? Math.max(1, Math.round(n / 1024)) + " KB" : (n / 1048576).toFixed(1) + " MB");
    const draw = () => list.replaceChildren(...order.map((file, i) => h("li", {},
      h("span", { class: "combine-name", text: file.name, title: file.name }),
      h("span", { class: "combine-kind", text: (isPdfFile(file) ? "PDF" : "image") + " · " + kb(file.size) }),
      h("button", { class: "tact", type: "button", "aria-label": `Move ${file.name} up`, title: "Move up", disabled: i === 0, onclick: () => (([order[i - 1], order[i]] = [order[i], order[i - 1]]), draw()) }, icon("up")),
      h("button", { class: "tact", type: "button", "aria-label": `Move ${file.name} down`, title: "Move down", disabled: i === order.length - 1, onclick: () => (([order[i + 1], order[i]] = [order[i], order[i + 1]]), draw()) }, icon("down")),
      h("button", { class: "tact danger", type: "button", "aria-label": `Leave out ${file.name}`, title: "Leave out", disabled: order.length < 2, onclick: () => (order.splice(i, 1), draw()) }, icon("close")))));
    draw();
    const choice = await modal({
      title: `Combine ${files.length} files`,
      body: h("div", { class: "stack" }, h("p", { class: "modal-text", text: "Their pages go into one new PDF in this order. You can still reorder pages afterwards." }), list),
      actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Combine", primary: true }],
    });
    return choice === "ok" && order.length ? order : null;
  }
  /** Recognise text (OCR) on scanned pages (ui/ocr.ts). */
  async function runOcr(): Promise<void> {
    if (interact.editor) interact.commitEditor();
    await recogniseText(app);
  }
  /**
   * Scan with camera: the scanner (ui/scan.ts), then its pages as a new PDF or added after the current page.
   * Scanned pages keep their own shape (long side as A4's), without margins.
   */
  async function scanPages(): Promise<void> {
    if (interact.editor) interact.commitEditor();
    const scanned = await scanDocument(!app.limits.locked);
    if (!scanned) return;
    const options = { size: "image" as const, margin: 0 };
    if (scanned.target === "insert") {
      const doc = await imagesAsDoc(scanned.files, options);
      if (doc) await insertDocs([{ name: "Scan", doc }], app.currentPage + 1, "Insert scanned pages", scanned.files.length === 1 ? "the scan" : scanned.files.length + " scanned pages");
      return;
    }
    if (app.dirty && !(await confirmDiscard())) return;
    const doc = await imagesAsDoc(scanned.files, options);
    if (!doc) return;
    const bytes = doc.save();
    doc.close();
    const now = new Date(), two = (n: number) => String(n).padStart(2, "0");
    const stamp = `${now.getFullYear()}-${two(now.getMonth() + 1)}-${two(now.getDate())} ${two(now.getHours())}.${two(now.getMinutes())}`;
    await openSource(bytes, `Scan ${stamp}.pdf`);
    app.dirty = true;
    refreshTopBar();
    session.schedule();
    toast("Scanned. Recognise the text to make it searchable?", "ok", 10e3, { label: "Recognise text", run: () => void runOcr() });
  }
  /** Makes a new, unsaved PDF from images (asking for page size and margins). */
  async function openImages(images: File[]): Promise<void> {
    if (app.dirty && !(await confirmDiscard())) return;
    const options = await askImagePages(images.length, "Create PDF");
    if (!options) return;
    const made = await imagesAsDoc(images, options);
    if (!made) return;
    const bytes = made.save();
    made.close();
    await openSource(bytes, pdfNameFor(images[0]));
    app.dirty = true; // a new document: nothing saved yet
    refreshTopBar();
    session.schedule();
  }
  /** imagesToDoc with progress and error messages; null (after a toast) if no image could be read. */
  async function imagesAsDoc(images: File[], options: Parameters<typeof imagesToDoc>[2]): Promise<Doc | null> {
    const note = images.length > 3 ? toast(`Adding images… 0 of ${images.length}`, "ok", 120e3) : null;
    try {
      const { doc, skipped } = await imagesToDoc(pdfium, images, options, (done) => {
        note?.set(`Adding images… ${done} of ${images.length}`);
      });
      note?.close();
      if (skipped.length) toast(`${skipped.length === images.length ? "" : "Skipped "}${skipped.join(", ")}: not an image this browser can read`, skipped.length === images.length ? "err" : "warn", 6e3);
      if (!doc.pageCount) {
        doc.close();
        return null;
      }
      return doc;
    } catch (err) {
      note?.close();
      toast((err as Error).message, "err", 6e3);
      return null;
    }
  }
  async function openFile(file: File): Promise<void> {
    if (app.dirty && !(await confirmDiscard())) return;
    let source;
    try {
      source = await Growable.fromFile(file);
    } catch (err) {
      toast(`${file.name}: ${(err as Error).message || "could not be read"}`, "err", 6e3);
      return;
    }
    await openSource(source, file.name);
  }
  /** Asks for a PDF password; resolves to the entered text, or null when cancelled. */
  async function askPassword(name: string, retry: boolean, verb = "open"): Promise<string | null> {
    const input = h("input", {
      class: "tinput",
      type: "password",
      id: "pdf-password",
      autocomplete: "off",
      "aria-label": "Password",
    });
    return (await modal({
      title: retry ? "That password didn’t work" : "This PDF is password protected",
      body: h(
        "div",
        { class: "stack" },
        h("p", { class: "modal-text", text: `Enter the password to ${verb} ${name}.` }),
        input,
      ),
      actions: [
        { id: "cancel", label: "Cancel" },
        { id: "ok", label: verb === "open" ? "Open" : "Continue", primary: true },
      ],
      onOpen: () => {
        input.focus();
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            $(".modal .btn.primary").click();
          }
        });
      },
    })) === "ok"
      ? input.value
      : null;
  }
  /** Opens a file source as the document, asking for a password (and retrying) when it is encrypted. */
  async function openSource(source: Growable | Uint8Array, name: string, password = ""): Promise<void> {
    try {
      app.open(source, name, password);
      viewer.el.scrollTop = 0;
      thumbs.list.scrollTop = 0;
      const damage = damageOf(source instanceof Uint8Array ? source : source.view());
      if (damage) {
        toast(`This PDF was damaged (${damage}). Margin recovered it; save a repaired copy to open it in other apps.`, "warn", 12e3, { label: "Save repaired copy", run: () => void saveRepairedCopy() });
      } else if (app.limits.locked) {
        toast(
          "This PDF limits what can be changed. To edit it, unlock it with its permissions password (the lock button).",
          "warn",
          7e3,
        );
      }
    } catch (err) {
      if (err instanceof PdfError && err.code === 4) {
        const retryPassword = await askPassword(name, !!password);
        return retryPassword != null ? openSource(source, name, retryPassword) : undefined;
      }
      toast(
        isEngineAbort(err) ? `${name} is too large to open in a browser tab.` : `${name}: ${(err as Error).message}`,
        "err",
        6e3,
      );
    }
  }
  /**
   * Loads a PDF as a separate document (for inserting or replacing pages), asking for its password as needed.
   * Resolves to null when the password prompt is cancelled.
   */
  async function loadPdfFile(file: File, verb: string): Promise<Doc | null> {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let password = "";
    let attempts = 0;
    for (;;)
      try {
        return pdfium.open(bytes, password);
      } catch (err) {
        if (!(err instanceof PdfError && err.code === 4)) throw err;
        const entered = await askPassword(file.name, attempts++ > 0, verb);
        if (entered == null) return null;
        password = entered;
      }
  }
  /**
   * Replace pages: asks which run of pages to replace and which pages of `file` take their place, then swaps
   * them in one undoable step. Bookmarks into the replaced run are re-pointed at the new pages and form fields
   * of the new pages are made to work.
   */
  async function replacePagesFromFile(file: File) {
    const { locked, perms } = app.limits;
    if (locked && !(perms & 8))
      return toast(
        "This PDF’s permissions don’t allow changes. Unlock it with its permissions password first.",
        "warn",
        5e3,
      );
    let source;
    try {
      source = await loadPdfFile(file, "replace pages with");
    } catch (err) {
      return toast(`${file.name}: ${(err as Error).message}`, "err", 5e3);
    }
    if (!source) return;
    const pageCount = app.doc.pageCount;
    const sourceCount = source.pageCount;
    const selection = selectedOrCurrentPages();
    const targetInput = h("input", {
      class: "tinput",
      id: "rp-target",
      value: formatPageRange(selection),
      autocomplete: "off",
    });
    const sourceInput = h("input", {
      class: "tinput",
      id: "rp-source",
      value: sourceCount === 1 ? "1" : `1-${Math.min(sourceCount, selection.length)}`,
      autocomplete: "off",
    });
    const note = h("p", { class: "modal-text", id: "rp-note" });
    const body = h(
      "div",
      { class: "stack" },
      h(
        "label",
        { class: "rfield" },
        h("span", { class: "rlabel", text: `Replace pages (of ${pageCount})` }),
        targetInput,
      ),
      h(
        "label",
        { class: "rfield" },
        h("span", { class: "rlabel", text: `with pages from ${file.name} (of ${sourceCount})` }),
        sourceInput,
      ),
      note,
      h("p", {
        class: "hint",
        text: "Comments and form fields on the replaced pages go with them. Bookmarks to them now point to the new pages. You can undo this.",
      }),
    );
    const parseRanges = () => {
      const targets = parsePageRange(targetInput.value, pageCount);
      const sources = parsePageRange(sourceInput.value, sourceCount);
      if (targets.some((page, i) => i && page !== targets[i - 1] + 1))
        throw new Error("Choose a run of pages to replace, like 3-5");
      return { t: targets, s: sources };
    };
    const updateNote = () => {
      try {
        const { t: targets, s: sources } = parseRanges();
        note.textContent = `${targets.length} page${targets.length === 1 ? "" : "s"} out, ${sources.length} in: the document will have ${pageCount - targets.length + sources.length} pages.`;
        note.classList.remove("err");
      } catch (err) {
        note.textContent = (err as Error).message;
        note.classList.add("err");
      }
    };
    body.addEventListener("input", updateNote);
    updateNote();
    const choice = await modal({
      title: "Replace pages",
      body,
      actions: [
        { id: "cancel", label: "Cancel" },
        { id: "ok", label: "Replace", primary: true },
      ],
    });
    let ranges;
    try {
      if (choice !== "ok") {
        source.close();
        return;
      }
      ranges = parseRanges();
    } catch (err) {
      source.close();
      return toast((err as Error).message, "warn");
    }
    const { t: targets, s: sources } = ranges;
    const first = targets[0];
    const last = targets[targets.length - 1];
    const bookmarks: Array<{ path: number[]; page: number; top: number | null }> = [];
    const collectBookmarks = (items: Bookmark[]) => {
      for (const item of items) {
        if (item.page >= first && item.page <= last) {
          bookmarks.push({
            path: item.path,
            page: first + Math.min(item.page - first, sources.length - 1),
            top: item.top,
          });
        }
        collectBookmarks(item.children);
      }
    };
    try {
      collectBookmarks(app.doc.outline());
    } catch {}
    try {
      await app.mutate(
        targets.length === 1 ? `Replace page ${first + 1}` : `Replace pages ${first + 1}-${last + 1}`,
        { pages: "all", structure: true },
        async () => {
          const usedNames = fieldNames(app.doc);
          if (!app.doc.importIndices(source, sources, first)) throw new Error(`${file.name} could not be inserted`);
          const fieldFixes = copyFormFields(source, sources, app.doc, first, usedNames);
          for (let i = last + sources.length; i >= first + sources.length; i--) app.doc.deletePage(i);
          for (const bookmark of bookmarks)
            try {
              app.doc.retargetBookmark(bookmark.path, bookmark.page, bookmark.top ?? undefined);
            } catch {}
          if (fieldFixes.length) {
            const fixed = await reopenWithFieldValues(pdfium, app.doc.save(), fieldFixes);
            app.replaceDoc(fixed.save());
            fixed.close();
          }
        },
      );
      toast(
        `Replaced ${targets.length === 1 ? "page " + (first + 1) : `pages ${first + 1}–${last + 1}`} with ${sources.length} page${sources.length === 1 ? "" : "s"} from ${file.name}`,
      );
      app.selectedPages = new Set(sources.map((page, i) => first + i));
      thumbs.mark();
      viewer.scrollToPage(first);
    } catch (err) {
      toast((err as Error).message, "err", 5e3);
    } finally {
      source.close();
    }
  }
  /** Inserts every page of the given PDFs at `at` (default: after the last selected page, else at the end). */
  async function insertFiles(files: File[], at?: number): Promise<void> {
    const insertAt = at ?? (app.selectedPages.size ? Math.max(...app.selectedPages) + 1 : app.doc.pageCount);
    const docs: Array<{ f: File; doc: Doc }> = [];
    const images = files.filter((file) => !isPdfFile(file) && isImageFile(file));
    const imageOptions = images.length ? pendingImageOptions || (await askImagePages(images.length, "Insert")) : null;
    if (images.length && !imageOptions) return;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // A run of images in a row becomes one document of image pages.
        if (!isPdfFile(file) && isImageFile(file)) {
          const run: File[] = [];
          while (i < files.length && !isPdfFile(files[i]) && isImageFile(files[i])) run.push(files[i++]);
          i--;
          const doc = await imagesAsDoc(run, imageOptions!);
          if (doc) docs.push({ f: run[0], doc });
          continue;
        }
        const doc = await loadPdfFile(file, "insert pages from");
        if (!doc) {
          docs.forEach((entry) => entry.doc.close());
          return;
        }
        docs.push({ f: file, doc });
      }
      if (!docs.length) return;
    } catch (err) {
      docs.forEach((entry) => entry.doc.close());
      toast((err as Error).message, "err", 5e3);
      return;
    }
    await insertDocs(
      docs.map(({ f: file, doc }) => ({ name: file.name, doc })),
      insertAt,
      "Insert pages",
      files.length === 1 ? files[0].name : files.length + " files",
    );
  }
  /**
   * Inserts all pages of already-open documents at `at` in one undoable step, keeping their form fields working,
   * and closes them. Resolves to false (with a toast) if it failed.
   */
  async function insertDocs(
    docs: Array<{ name: string; doc: Doc }>,
    at: number,
    label: string,
    fromLabel: string,
  ): Promise<boolean> {
    let inserted = 0;
    /** The documents not closed yet: each is closed exactly once, whether the insert succeeds or fails. */
    const unclosed = new Set(docs.map((entry) => entry.doc));
    const closeDoc = (doc: Doc) => {
      if (unclosed.delete(doc)) doc.close();
    };
    try {
      await app.mutate(label, { pages: "all", structure: true }, async () => {
        let pos = at;
        const fieldFixes: CopiedField[] = [];
        for (const { name, doc } of docs)
          try {
            const count = doc.pageCount;
            const usedNames = fieldNames(app.doc);
            if (!app.doc.importAll(doc, pos)) throw new Error(`${name} could not be inserted`);
            fieldFixes.push(...copyFormFields(doc, [...Array(count).keys()], app.doc, pos, usedNames));
            pos += count;
            inserted += count;
          } finally {
            closeDoc(doc);
          }
        if (fieldFixes.length) {
          const fixed = await reopenWithFieldValues(pdfium, app.doc.save(), fieldFixes);
          app.replaceDoc(fixed.save());
          fixed.close();
        }
      });
    } catch (err) {
      docs.forEach((entry) => closeDoc(entry.doc));
      toast((err as Error).message, "err", 5e3);
      return false;
    }
    toast(
      `Inserted ${inserted} page${inserted === 1 ? "" : "s"} from ${fromLabel} as page${inserted === 1 ? "" : "s"} ${at + 1}${inserted > 1 ? "–" + (at + inserted) : ""}`,
    );
    app.selectedPages = new Set(Array.from({ length: inserted }, (_, i) => at + i));
    thumbs.mark();
    viewer.scrollToPage(at);
    return true;
  }
  /** The selected pages in order, or the current page when none is selected. */
  const selectedOrCurrentPages = (): number[] =>
    app.selectedPages.size ? [...app.selectedPages].sort((a, b) => a - b) : [app.currentPage];
  /**
   * Copies pages to the page clipboard (shared with other Margin windows when the browser allows). Returns the
   * marker text to put on the system clipboard, or null when copying isn’t allowed; the copy itself finishes
   * asynchronously.
   */
  function copyPages(pages: number[]): string | null {
    const { locked, perms } = app.limits;
    if (locked && !(perms & 16)) {
      toast("This PDF’s permissions don’t allow copying. Unlock it with its permissions password first.", "warn", 5e3);
      return null;
    }
    const id = Math.random().toString(36).slice(2, 10);
    const from = app.fileName;
    const count = pages.length;
    const marker = clipMarker({ id, pages: count, from });
    (async () => {
      let copy = pdfium.create();
      try {
        if (!copy.importIndices(app.doc, pages, 0)) throw new Error("Those pages could not be copied");
        const fieldFixes = copyFormFields(app.doc, pages, copy, 0, new Set());
        if (fieldFixes.length) {
          const fixed = await reopenWithFieldValues(pdfium, copy.save(), fieldFixes);
          copy.close();
          copy = fixed;
        }
        const shared = await putClip({ id, bytes: copy.save(), pages: count, from, at: Date.now() });
        const message = `${count === 1 ? "Page " + (pages[0] + 1) : count + " pages"} copied`;
        toast(
          shared
            ? `${message}. Paste with Ctrl+V here or in another Margin window.`
            : `${message}. Paste with Ctrl+V in this window (this browser won’t let Margin windows share them).`,
        );
        updatePasteButton();
      } catch (err) {
        toast((err as Error).message, "err");
      } finally {
        copy.close();
      }
    })();
    return marker;
  }
  /** Pastes the copied pages at `at` (default: after the selected pages); `expectId` must match the copy if given. */
  async function pastePages(expectId?: string | null, at?: number): Promise<ToastHandle | void> {
    const clip = await getClip();
    if (!clip)
      return toast("No copied pages yet. Select pages in the sidebar and press Ctrl+C (or Copy).", "warn", 4500);
    if (expectId && clip.id !== expectId)
      return toast("Those copied pages are no longer available: copy them again.", "warn");
    let doc;
    try {
      doc = pdfium.open(clip.bytes);
    } catch (err) {
      return toast((err as Error).message, "err");
    }
    const insertAt = at ?? Math.max(...selectedOrCurrentPages()) + 1;
    await insertDocs([{ name: clip.from, doc }], insertAt, clip.pages === 1 ? "Paste page" : "Paste pages", clip.from);
  }
  /** Enables the sidebar Paste button when there are copied pages, with a tooltip naming them. */
  const updatePasteButton = () =>
    getClip().then((clip) => {
      const button = document.querySelector<HTMLButtonElement>('.page-actions [data-act="paste"]');
      if (button) {
        button.disabled = !clip;
        button.title = clip
          ? `Paste ${clip.pages} copied page${clip.pages === 1 ? "" : "s"} from ${clip.from} after the selected page`
          : "Paste copied pages (copy pages first)";
      }
    });
  onClip(() => updatePasteButton());
  updatePasteButton();
  /** Right-click menu for a page thumbnail; acts on the whole selection when the page is part of it. */
  async function pageMenu(page: number, clientX: number, clientY: number, anchor?: HTMLElement): Promise<void> {
    if (!app.selectedPages.has(page)) {
      app.selectedPages = new Set([page]);
      thumbs.mark();
    }
    const pages = selectedOrCurrentPages();
    const pageCount = app.doc.pageCount;
    const first = pages[0];
    const last = pages[pages.length - 1];
    const { locked, perms } = app.limits;
    const editAllowed = !locked || !!(perms & 8);
    const copyAllowed = !locked || !!(perms & 16);
    const clip = await getClip();
    const title = pages.length === 1 ? `Page ${first + 1}` : `${pages.length} pages`;
    const clipLabel = clip ? `${clip.pages} page${clip.pages === 1 ? "" : "s"}` : "";
    openMenu(
      clientX,
      clientY,
      [
        { heading: pages.length === 1 ? title : `${title} (${formatPageRange(pages)})` },
        { label: "Copy", shortcut: "Ctrl+C", disabled: !copyAllowed, run: () => pageAction("copy") },
        {
          label: clip ? `Paste ${clipLabel} after` : "Paste after",
          shortcut: "Ctrl+V",
          disabled: !clip || !editAllowed,
          run: () => pastePages(null, last + 1),
        },
        {
          label: clip ? `Paste ${clipLabel} before` : "Paste before",
          disabled: !clip || !editAllowed,
          run: () => pastePages(null, first),
        },
        "sep",
        { label: "Rotate left", disabled: !editAllowed, run: () => pageAction("rotl") },
        { label: "Rotate right", disabled: !editAllowed, run: () => pageAction("rotr") },
        { label: "Insert blank page after", disabled: !editAllowed, run: () => pageAction("insert") },
        {
          label: "Insert pages from PDF or images…",
          disabled: !editAllowed,
          run: () => {
            pendingInsertAt = last + 1;
            insertFileInput.click();
          },
        },
        {
          label: pages.length === 1 ? "Replace with page from PDF…" : "Replace with pages from PDF…",
          disabled: !editAllowed,
          run: () => replaceFileInput.click(),
        },
        "sep",
        { label: "Extract…", disabled: !copyAllowed, run: () => pageAction("extract") },
        { label: "Export as images…", disabled: !copyAllowed, run: () => openExportImages() },
        {
          label: pages.length === 1 ? "Delete page" : `Delete ${pages.length} pages`,
          shortcut: "Del",
          danger: true,
          disabled: !editAllowed || pages.length >= pageCount,
          run: () => pageAction("delete"),
        },
        ...(pages.length === 1
          ? (["sep", { label: "Go to page", run: () => viewer.scrollToPage(first) }] as MenuItem[])
          : []),
      ],
      anchor,
    );
  }
  /** Names for the palette colours, keyed by "r,g,b", used as swatch labels in menus. */
  const COLOR_NAMES: Record<string, string> = {
    "246,214,74": "Yellow",
    "134,222,140": "Green",
    "120,196,246": "Blue",
    "246,150,198": "Pink",
    "250,172,92": "Orange",
    "24,26,33": "Black",
    "214,69,52": "Red",
    "37,99,235": "Blue",
    "22,140,82": "Green",
    "124,77,219": "Purple",
  };
  /** Fill choices for text boxes (null = no fill). */
  const TEXTBOX_FILLS: Array<RGBA | null> = [
    null,
    [255, 255, 255, 255],
    [255, 249, 196, 255],
    [219, 234, 254, 255],
    [220, 252, 231, 255],
    [252, 231, 243, 255],
  ];
  /** Human name of a colour for menus. */
  const colorName = (color: RGBA): string =>
    COLOR_NAMES[color.slice(0, 3).join(",")] || (color[0] + color[1] + color[2] > 740 ? "White" : "Color");
  /** A context-menu colour row: preset swatches (null = None) plus a custom colour swatch. */
  function colorRow(
    label: string,
    colors: Array<RGBA | null>,
    current: RGBA | null,
    pick: (color: RGBA | null) => unknown,
    disabled = false,
  ): MenuSwatchRow {
    const isCustom = !!current && !colors.some((c) => c && sameColor(c, current));
    const hex = current
      ? "#" +
        current
          .slice(0, 3)
          .map((channel) => channel.toString(16).padStart(2, "0"))
          .join("")
      : "";
    return {
      label,
      disabled,
      swatches: [
        ...colors.map((c) => ({
          css: c ? `rgb(${c[0]},${c[1]},${c[2]})` : "none",
          label: c ? colorName(c) : "None",
          on: c ? !!current && sameColor(c, current) : !current,
        })),
        {
          custom: true,
          css: isCustom ? `rgb(${current[0]},${current[1]},${current[2]})` : undefined,
          value: hex,
          label: "Custom colour…",
          on: isCustom,
        },
      ],
      pick: (index, custom) => pick((custom as RGBA | undefined) || colors[index]),
    };
  }
  /** A context-menu row of text chips, each standing for a value. */
  function chipRow<T>(
    label: string,
    options: Array<{ text: string; label: string; v: T }>,
    isOn: (v: T) => boolean,
    pick: (v: T) => unknown,
    disabled = false,
  ): MenuSwatchRow {
    return {
      label,
      disabled,
      swatches: options.map((opt) => ({ text: opt.text, label: opt.label, on: isOn(opt.v) })),
      pick: (index) => pick(options[index].v),
    };
  }
  /** Changes an annotation’s style (width, dashes, fill, opacity, line ends) as one undoable step. */
  const mutateAnnotStyle = (page: number, index: number, patch: Partial<AnnotStyle>, label: string) =>
    app
      .mutate(label, { pages: [page] }, () => app.doc.setAnnotStyle(page, index, patch))
      .catch((err) => toast(err.message, "err"));
  /**
   * The per-type style rows of the annotation menu: text boxes get text colour, fill, border and size; shapes
   * outline, fill, width and dashes; lines width, dashes, arrowheads and direction; drawings width and dashes;
   * everything with a style also gets opacity.
   */
  function styleItems(page: number, annot: AnnotInfo, canEdit: boolean): MenuItem[] {
    const items: MenuItem[] = [];
    const subtype = annot.subtype;
    if (subtype === ANNOT.FREETEXT) {
      const freeText = annot.ft ? app.doc.readFreeText(page, annot.index) : null;
      if (!freeText) return items;
      const restyle = (patch: Partial<FreeTextStyle>, label: string) =>
        textBoxes.update(page, annot.index, (data) => ({ ...data, style: { ...data.style, ...patch } }), label);
      items.push(
        colorRow("Text", PALETTES.pen, freeText.style.color, (color) => restyle({ color: color as RGBA }, "Text color"), !canEdit),
        colorRow("Fill", TEXTBOX_FILLS, freeText.style.fill, (fill) => restyle({ fill }, "Text box fill"), !canEdit),
        colorRow(
          "Border",
          [null, ...PALETTES.pen],
          freeText.style.border,
          (border) => restyle({ border }, "Text box border"),
          !canEdit,
        ),
        chipRow(
          "Size",
          [9, 11, 14, 18, 24].map((size) => ({ text: String(size), label: `${size} pt`, v: size })),
          (size) => Math.abs(freeText.style.size - size) < 0.01,
          (size) => restyle({ size }, "Text size"),
          !canEdit,
        ),
      );
      return items;
    }
    if (subtype === ANNOT.SQUARE || subtype === ANNOT.CIRCLE) {
      // a shape keeps an outline or a fill: removing the last one is refused
      const style = app.doc.annotStyle(page, annot.index);
      items.push(
        colorRow(
          "Outline",
          [null, ...PALETTES.pen],
          annot.color,
          (color) =>
            !color && !style?.fill
              ? toast("A shape needs an outline or a fill", "warn")
              : app
                  .mutate(color ? "Outline colour" : "Remove outline", { pages: [page] }, () =>
                    app.doc.setAnnotColor(page, annot.index, color),
                  )
                  .catch((err) => toast(err.message, "err")),
          !canEdit,
        ),
      );
    } else if (subtype !== ANNOT.STAMP && annot.color) {
      const palette =
        PALETTES.highlight.some((c) => sameColor(c, annot.color!)) || subtype === 9 || subtype === 1
          ? PALETTES.highlight
          : PALETTES.pen;
      items.push(
        colorRow(
          "Color",
          palette,
          annot.color,
          (color) =>
            app
              .mutate("Change color", { pages: [page] }, () => app.doc.setAnnotColor(page, annot.index, color))
              .catch((err) => toast(err.message, "err")),
          !canEdit,
        ),
      );
    }
    const isShape = subtype === ANNOT.SQUARE || subtype === ANNOT.CIRCLE;
    const isLine = subtype === ANNOT.LINE;
    const isInk = subtype === ANNOT.INK;
    const isMarkup = subtype >= 9 && subtype <= 12;
    if (!isShape && !isLine && !isInk && !isMarkup) return items;
    const style = app.doc.annotStyle(page, annot.index);
    if (!style) return items;
    const setStyle = (patch: Partial<AnnotStyle>, label: string) => mutateAnnotStyle(page, annot.index, patch, label);
    if (isShape) {
      items.push(
        colorRow(
          "Fill",
          [null, [255, 255, 255, 255], ...PALETTES.highlight],
          style.fill,
          (fill) =>
            !fill && !annot.color
              ? toast("A shape needs an outline or a fill", "warn")
              : setStyle({ fill }, fill ? "Fill shape" : "Remove fill"),
          !canEdit,
        ),
      );
    }
    if (isShape || isLine || isInk) {
      items.push(
        chipRow(
          "Width",
          [1, 2, 4, 8].map((w) => ({ text: String(w), label: `${w} pt`, v: w })),
          (w) => Math.abs(style.width - w) < 0.26,
          (w) => setStyle({ width: w }, "Line width"),
          !canEdit,
        ),
        chipRow(
          "Style",
          [
            { text: "Solid", label: "Solid line", v: false },
            { text: "Dashed", label: "Dashed line", v: true },
          ],
          (dashed) => dashed === style.dashed,
          (dashed) => setStyle({ dashed }, dashed ? "Dashed line" : "Solid line"),
          !canEdit,
        ),
      );
    }
    if (isLine && style.ends) {
      const ends = style.ends;
      const head = ends[1] !== "None" ? ends[1] : ends[0] !== "None" ? ends[0] : "OpenArrow";
      const arrows = (ends[0] !== "None" ? 1 : 0) | (ends[1] !== "None" ? 2 : 0);
      items.push(
        chipRow(
          "Arrows",
          [
            { text: "—", label: "No arrowheads", v: 0 },
            { text: "→", label: "Arrowhead at the end", v: 2 },
            { text: "←", label: "Arrowhead at the start", v: 1 },
            { text: "↔", label: "Arrowheads at both ends", v: 3 },
          ],
          (v) => v === arrows,
          (v) => setStyle({ ends: [v & 1 ? head : "None", v & 2 ? head : "None"] }, "Arrowheads"),
          !canEdit,
        ),
      );
      if (arrows) {
        items.push(
          chipRow(
            "Heads",
            [
              { text: "Open", label: "Open arrowheads", v: "OpenArrow" as LineEnd },
              { text: "Filled", label: "Filled arrowheads", v: "ClosedArrow" as LineEnd },
            ],
            (v) => v === head,
            (v) =>
              setStyle({ ends: [ends[0] !== "None" ? v : "None", ends[1] !== "None" ? v : "None"] }, "Arrowhead style"),
            !canEdit,
          ),
        );
      }
      if (arrows === 1 || arrows === 2) {
        items.push({
          label: "Reverse direction",
          disabled: !canEdit,
          run: () =>
            app
              .mutate("Reverse arrow", { pages: [page] }, () => app.doc.reverseLine(page, annot.index))
              .catch((err) => toast(err.message, "err")),
        });
      }
    }
    items.push(
      chipRow(
        "Opacity",
        [100, 75, 50, 25, 10].map((pct) => ({ text: pct + "%", label: `${pct}% opaque`, v: pct / 100 })),
        (v) => Math.abs(style.opacity - v) < 0.03,
        (v) => setStyle({ opacity: v }, "Opacity"),
        !canEdit,
      ),
    );
    return items;
  }
  /** Whether the PDF’s permissions allow adding or changing annotations. */
  const canAnnotate = () => {
    const { locked, perms } = app.limits;
    return !locked || !!(perms & 8) || !!(perms & 32);
  };
  /** Whether the PDF’s permissions allow changing the document. */
  const canModify = () => {
    const { locked, perms } = app.limits;
    return !locked || !!(perms & 8);
  };
  /** Duplicates one annotation (with Select) and selects the copy. */
  async function duplicateAnnot(page: number, index: number): Promise<void> {
    const item = arrange.itemOfAnnot(page, index);
    if (!item) {
      toast("Couldn’t find that annotation to duplicate", "err");
      return;
    }
    const keys = await arrange.duplicate(page, [item]);
    if (app.tool === "select" && keys[0]?.startsWith("a")) {
      app.selectedAnnot = { page, index: +keys[0].slice(1) };
      interact.refreshOverlays();
      commentsPanel.markSelected();
      renderRibbon();
    }
  }
  /** Brings an annotation to the front or sends it to the back among the page’s annotations. */
  const restackAnnot = (page: number, index: number, where: "front" | "back") =>
    app
      .mutate(where === "front" ? "Bring to front" : "Send to back", { pages: [page] }, () => {
        if (!app.doc.restackAnnots(page, [index], where))
          throw new Error(
            where === "front" ? "Already in front of what it overlaps" : "Already behind what it overlaps",
          );
      })
      .then(() => {
        app.selectedAnnot = null;
        interact.refreshOverlays();
        renderRibbon();
      })
      .catch((err) => toast(err.message, "warn"));
  /** Annotation subtypes that can be copied, cut and duplicated. */
  const COPYABLE_SUBTYPES = new Set<number>([
    ANNOT.TEXT,
    ANNOT.FREETEXT,
    ANNOT.LINE,
    ANNOT.SQUARE,
    ANNOT.CIRCLE,
    ANNOT.INK,
    ANNOT.STAMP,
  ]);
  const windowId = Math.random().toString(36).slice(2, 10);
  /** Identifies this window and document, so a paste can tell whether it is pasting back where it copied. */
  const clipSource = () => windowId + "|" + app.fileName;
  let pasteRun = { id: "", page: -1, n: 0 };
  let copyIsCut = false;
  let copyHandled = false;
  /** Whether the PDF’s permissions allow copying content. */
  const canCopy = () => {
    const { locked, perms } = app.limits;
    return !locked || !!(perms & 16);
  };
  /** The objects that Copy/Cut would act on: the Move & resize selection or the selected annotation. */
  function objectSelection(): { page: number; items: ArrangeItem[] } | null {
    if (app.tool === "arrange" && arrange.sel && !arrange.cropping) {
      const items = arrange.selected();
      return items.length ? { page: arrange.sel.page, items } : null;
    }
    if (app.tool === "select" && app.selectedAnnot) {
      const item = arrange.itemOfAnnot(app.selectedAnnot.page, app.selectedAnnot.index);
      return item ? { page: app.selectedAnnot.page, items: [item] } : null;
    }
    return null;
  }
  /**
   * Copies (or cuts) the selected objects to the object clipboard. Returns the marker text for the system
   * clipboard, or null when nothing could be copied.
   */
  function copyObjects(cut = false): string | null {
    const selection = objectSelection();
    if (!selection) return null;
    if (!canCopy()) {
      toast("This PDF’s permissions don’t allow copying. Unlock it with its permissions password first.", "warn", 5e3);
      return null;
    }
    if (cut && !(app.tool === "arrange" ? canModify() : canAnnotate())) {
      toast("This PDF’s permissions don’t allow removing objects", "warn");
      return null;
    }
    const removable = cut ? selection.items.filter((item) => arrange.canDuplicate(item)) : [];
    const clip = cut && !removable.length ? null : arrange.clipOf(selection.page, selection.items);
    if (!clip) {
      toast("Only annotations and pictures can be copied", "warn");
      return null;
    }
    const id = Math.random().toString(36).slice(2, 10);
    const from = app.fileName;
    const count = clip.items.length;
    const payload = {
      id,
      items: clip.items,
      bounds: clip.bounds,
      count,
      from,
      src: clipSource(),
      page: selection.page,
      at: Date.now(),
    };
    pasteRun = { id, page: selection.page, n: 0 };
    const what =
      count === 1 ? (selection.items.length === 1 ? selection.items[0].label : "Object") : `${count} objects`;
    putObjClip(payload).then((shared) => {
      const skippedNote = clip.skipped
        ? ` ${clip.skipped} other${clip.skipped === 1 ? "" : "s"} (text, links, form fields or markup) can’t be copied.`
        : "";
      toast(
        `${what} ${cut ? "cut" : "copied"}. Paste with Ctrl+V on any page${shared ? ", here or in another Margin window" : ""}.${skippedNote}`,
        clip.skipped ? "warn" : "ok",
        clip.skipped ? 4500 : 2800,
      );
    });
    if (cut) {
      arrange
        .removeItems(
          selection.page,
          removable,
          removable.length > 1 ? `Cut ${removable.length} objects` : `Cut ${removable[0].label.toLowerCase()}`,
        )
        .then(() => {
          app.selectedAnnot = null;
          interact.refreshOverlays();
          renderRibbon();
        })
        .catch((err) => toast(err.message, "err"));
    }
    return objMarker(payload);
  }
  /**
   * Copy/Cut from a menu: runs the browser copy command so the document "copy" handler can put the marker on
   * the clipboard; if that handler didn’t run, copies directly and writes the marker with the async API.
   */
  function copyObjectsViaClipboard(cut: boolean): void {
    copyIsCut = cut;
    copyHandled = false;
    try {
      document.execCommand("copy");
    } catch {}
    copyIsCut = false;
    if (!copyHandled) {
      const marker = copyObjects(cut);
      if (marker) {
        navigator.clipboard?.writeText(marker).catch(() => {});
      }
    }
  }
  /**
   * Pastes copied objects: at a clicked point, or onto the current page (stepping repeated pastes on the same
   * page down and to the right), kept inside the page. Selects what was pasted.
   */
  async function pasteObjects(expectId?: string | null, at?: { page: number; p: Pt }): Promise<ToastHandle | void> {
    const clip = await getObjClip();
    if (!clip) return toast("Nothing copied yet. Select an annotation or picture and press Ctrl+C.", "warn", 4e3);
    if (expectId && clip.id !== expectId)
      return toast("Those copied objects are no longer available: copy them again.", "warn");
    if (!(clip.items.some((item) => item.t === "img") ? canModify() : canAnnotate()))
      return toast("This PDF’s permissions don’t allow adding these", "warn");
    const page = at?.page ?? (app.tool === "arrange" && arrange.sel ? arrange.sel.page : app.currentPage);
    const view = viewer.views[page];
    if (!view) return;
    const bounds = clip.bounds;
    let dx = 0;
    let dy = 0;
    if (at) {
      dx = at.p.x - bounds.l;
      dy = at.p.y - bounds.t;
    } else if (clip.src === clipSource() && clip.page === page) {
      pasteRun =
        pasteRun.id === clip.id && pasteRun.page === page
          ? { ...pasteRun, n: pasteRun.n + 1 }
          : { id: clip.id, page, n: 1 };
      [dx, dy] = arrange.screenOffset(page, 12 * pasteRun.n);
    }
    const zoom = viewer.zoom;
    const viewW = view.w * zoom;
    const viewH = view.h * zoom;
    const box = view.tf.box({ l: bounds.l + dx, r: bounds.r + dx, t: bounds.t + dy, b: bounds.b + dy });
    let shiftX = 0;
    let shiftY = 0;
    if (box.w <= viewW) {
      shiftX = box.x < 0 ? -box.x : box.x + box.w > viewW ? viewW - box.x - box.w : 0;
    }
    if (box.h <= viewH) {
      shiftY = box.y < 0 ? -box.y : box.y + box.h > viewH ? viewH - box.y - box.h : 0;
    }
    if (shiftX || shiftY) {
      const [offX, offY] = arrange.screenOffset(page, shiftX / zoom, shiftY / zoom);
      dx += offX;
      dy += offY;
    }
    const keys = await arrange.paste(
      page,
      clip.items,
      dx,
      dy,
      clip.count > 1 ? `Paste ${clip.count} objects` : "Paste",
    );
    if (keys.length) {
      if (app.tool === "select" && keys.length === 1 && keys[0][0] === "a") {
        app.selectedAnnot = { page, index: +keys[0].slice(1) };
        interact.refreshOverlays();
        commentsPanel.markSelected();
        renderRibbon();
      } else if (app.tool !== "arrange") {
        app.setTool("arrange");
        arrange.invalidate(page);
        arrange.sel = { page, key: keys[0] };
        arrange.extra = keys.slice(1);
        arrange.refresh();
        renderRibbon();
      }
    }
  }
  /** Cut, Copy and Paste entries for the object menus. */
  const clipboardItems = (clip: ObjClip | null, canEdit: boolean): MenuItem[] => {
    const selection = objectSelection();
    const copyable = !!selection && selection.items.some((item) => arrange.canDuplicate(item));
    return [
      {
        label: "Cut",
        shortcut: "Ctrl+X",
        disabled: !copyable || !canCopy() || !canEdit,
        run: () => copyObjectsViaClipboard(true),
      },
      {
        label: "Copy",
        shortcut: "Ctrl+C",
        disabled: !copyable || !canCopy(),
        run: () => copyObjectsViaClipboard(false),
      },
      {
        label: clip ? `Paste ${clip.count === 1 ? "" : clip.count + " objects"}`.trim() : "Paste",
        shortcut: "Ctrl+V",
        disabled: !clip || !canEdit,
        run: () => pasteObjects(),
      },
    ];
  };
  /** Right-click menu for an annotation with Select. */
  async function annotMenu(
    page: number,
    index: number,
    clientX: number,
    clientY: number,
    anchor?: HTMLElement,
  ): Promise<void> {
    const annot = app.doc.annots(page).find((a: AnnotInfo) => a.index === index);
    if (!annot) return;
    const clip = await getObjClip();
    app.selectedAnnot = { page, index };
    interact.refreshOverlays();
    commentsPanel.markSelected();
    renderRibbon();
    const canEdit = canAnnotate();
    const isMarkup = annot.subtype >= 9 && annot.subtype <= 12;
    const isFreeText = annot.subtype === 3;
    const isStamp = annot.subtype === 13;
    const kind =
      isStamp && annot.contents === "Signature"
        ? "Signature"
        : isFreeText && annot.ft?.tip
          ? "Callout"
          : annot.subtype === ANNOT.LINE && app.doc.annotStyle(page, index)?.ends?.some((end: LineEnd) => end !== "None")
            ? "Arrow"
            : ANNOT_NAMES[annot.subtype] || "Annotation";
    const view = viewer.views[page];
    const items: MenuItem[] = [{ heading: `${kind}${annot.author ? " · " + annot.author : ""}` }];
    if (isFreeText && interact.textbox && view) {
      items.push({ label: "Edit text", disabled: !canEdit, run: () => interact.textbox!.edit(view, index) });
    } else {
      items.push({
        label: annot.contents && !(isStamp && annot.contents === "Signature") ? "Edit comment" : "Add comment",
        disabled: !canEdit,
        run: () => interact.onNoteCreated(page, index),
      });
    }
    items.push({
      label: "Reply",
      disabled: !canEdit,
      run: () => {
        setPanel("comments", true);
        commentsPanel.reply(page, index);
      },
    });
    if (annot.contents && !isFreeText && !(isStamp && annot.contents === "Signature")) {
      items.push({
        label: "Copy comment text",
        run: () =>
          navigator.clipboard?.writeText(annot.contents).then(
            () => toast("Comment text copied"),
            () => toast("Couldn’t reach the clipboard", "warn"),
          ),
      });
    }
    const styleRows = styleItems(page, annot, canEdit);
    if (styleRows.length) {
      items.push("sep", ...styleRows);
    }
    items.push("sep");
    if (COPYABLE_SUBTYPES.has(annot.subtype) && (!isFreeText || annot.ft)) {
      items.push(...clipboardItems(clip, canEdit), {
        label: "Duplicate",
        shortcut: "Ctrl+D",
        disabled: !canEdit,
        run: () => duplicateAnnot(page, index),
      });
    }
    items.push(
      { label: "Bring to front", disabled: !canEdit, run: () => restackAnnot(page, index, "front") },
      { label: "Send to back", disabled: !canEdit, run: () => restackAnnot(page, index, "back") },
    );
    if (!isMarkup) {
      items.push({
        label: "Move & resize",
        disabled: !canEdit,
        run: () => {
          app.setTool("arrange");
          arrange.sel = { page, key: "a" + index };
          arrange.extra = [];
          arrange.refresh();
          renderRibbon();
        },
      });
    }
    items.push("sep", {
      label: "Delete",
      shortcut: "Del",
      danger: true,
      disabled: !canEdit,
      run: () => deleteSelectedAnnot(),
    });
    openMenu(clientX, clientY, items, anchor);
  }
  /** Replaces the picture selected in Move & resize with an image file, fitted to its box. */
  async function replaceSelectedImage(): Promise<void> {
    const sel = arrange.sel;
    const current = arrange.current();
    if (!sel || !current || current.kind !== "image") return;
    const file = await pickImageFile();
    if (file)
      try {
        const picked = await decodeImage(file, file.name);
        const info = app.doc.imageInfo(sel.page, current.objs[0]);
        const width = info ? Math.hypot(info.matrix[0], info.matrix[1]) : 300;
        const height = info ? Math.hypot(info.matrix[2], info.matrix[3]) : 300;
        await arrange.replaceImage(await encodeImage(picked, width, height), picked.w, picked.h);
        picked.bitmap.close();
        URL.revokeObjectURL(picked.url);
      } catch (err) {
        toast((err as Error).message, "err");
      }
  }
  /** Saves the picture selected in Move & resize as JPEG (if stored as JPEG) or PNG. */
  async function saveSelectedImage(): Promise<ToastHandle | void> {
    const sel = arrange.sel;
    const current = arrange.current();
    if (!sel || !current || current.kind !== "image") return;
    const { locked, perms } = app.limits;
    if (locked && !(perms & 16)) return toast("This PDF’s permissions don’t allow copying its content", "warn");
    const baseName = app.editedName.replace(/\.pdf$/i, "") + `-p${sel.page + 1}-image`;
    try {
      const jpeg = app.doc.imageJpeg(sel.page, current.objs[0]);
      if (jpeg) return await saveFile(jpeg, baseName + ".jpg", "image/jpeg");
      const pixels = app.doc.imagePixels(sel.page, current.objs[0]);
      if (!pixels) throw new Error("Couldn’t read that image");
      const canvas = document.createElement("canvas");
      canvas.width = pixels.w;
      canvas.height = pixels.h;
      canvas.getContext("2d")!.putImageData(new ImageData(pixels.rgba, pixels.w, pixels.h), 0, 0);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Couldn’t encode the image");
      await saveFile(new Uint8Array(await blob.arrayBuffer()), baseName + ".png", "image/png");
    } catch (err) {
      toast((err as Error).message, "err");
    }
  }
  /**
   * Detect form fields (ui/detect.ts): finds fill-in lines, boxes and checkboxes on every page, says what it
   * found, and adds them as fields in one undoable step (named after their labels), then shows the Form tool.
   */
  async function detectFormFields(): Promise<void> {
    if (interact.editor) interact.commitEditor();
    const found: FieldCandidate[] = [];
    for (let page = 0; page < app.doc.pageCount; page++) {
      const taken = [...app.doc.fields(page).map((f) => f.rect), ...app.doc.annots(page).map((a) => a.rect)];
      found.push(...detectFields(app.doc, page, taken));
    }
    if (!found.length) return void toast("No fill-in lines, boxes or checkboxes were found. Add fields by hand with the Form tool.", "ok", 6e3);
    const pages = [...new Set(found.map((c) => c.page))], boxes = found.filter((c) => c.kind === "checkbox").length, texts = found.length - boxes;
    const parts = [texts && `${texts} text field${texts === 1 ? "" : "s"}`, boxes && `${boxes} checkbox${boxes === 1 ? "" : "es"}`].filter(Boolean).join(" and ");
    const choice = await modal({
      title: "Detect form fields",
      body: h("div", { class: "stack" },
        h("p", { class: "modal-text", text: `Found ${found.length} place${found.length === 1 ? "" : "s"} to fill in on ${pages.length === 1 ? "page " + (pages[0] + 1) : pages.length + " pages"}: ${parts}.` }),
        h("p", { class: "hint", text: "Each is named after the words next to it. Check them afterwards with the Form tool: rename, resize or delete any that aren’t right. Undo removes them all." })),
      actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Add fields", primary: true }],
    });
    if (choice !== "ok") return;
    const names = new Set<string>();
    for (let page = 0; page < app.doc.pageCount; page++) for (const field of app.doc.fields(page)) names.add(field.name);
    const nameFor = (label: string, kind: string) => {
      const base = (label || (kind === "checkbox" ? "Check" : "Text")).replace(/\./g, " ").trim();
      let name = base, n = 2;
      while (names.has(name)) name = `${base} ${n++}`;
      names.add(name);
      return name;
    };
    try {
      await app.mutate("Detect form fields", { pages: "all" }, () => {
        for (const c of found) app.doc.createField(c.page, c.kind, c.rect, nameFor(c.label, c.kind));
      });
      app.setTool("form");
      toast(`Added ${found.length} field${found.length === 1 ? "" : "s"}. Click one to fill it in, or right-click to rename or delete.`, "ok", 6e3);
    } catch (err) {
      toast((err as Error).message, "err", 5e3);
    }
  }
  /**
   * Saves the document rewritten in full (fresh cross-reference index, no leftover updates), named
   * "<name>-repaired.pdf". What fixes a damaged file for other apps (engine/repair.ts).
   */
  async function saveRepairedCopy(): Promise<void> {
    if (interact.editor) interact.commitEditor();
    if (app.cur > FULL_SAVE_MAX) return void toast("This file is too large to rewrite in a browser tab.", "err", 5e3);
    try {
      await saveFile(app.doc.save(), app.fileName.replace(/\.pdf$/i, "") + "-repaired.pdf");
    } catch (err) {
      toast((err as Error).message, "err", 5e3);
    }
  }
  /**
   * Every picture in the document, as its original JPEG where it is one, else PNG; tiny images (under 8 px) and
   * repeats (the same picture on several pages) left out. One file, or a ZIP for several.
   */
  async function saveAllImages(): Promise<void> {
    const { locked, perms } = app.limits;
    if (locked && !(perms & 16)) return void toast("This PDF’s permissions don’t allow copying its content", "warn");
    const base = app.fileName.replace(/\.pdf$/i, ""), files: { name: string; data: Uint8Array }[] = [], seen = new Set<string>();
    const note = app.doc.pageCount > 20 ? toast("Collecting images…", "ok", 120e3) : null;
    try {
      for (let page = 0; page < app.doc.pageCount; page++) {
        note?.set(`Collecting images… page ${page + 1} of ${app.doc.pageCount}`);
        let k = 0;
        for (const objIndex of app.doc.imageObjects(page)) {
          let data: Uint8Array | null = app.doc.imageJpeg(page, objIndex), ext = "jpg";
          if (!data) {
            const pixels = app.doc.imagePixels(page, objIndex);
            if (!pixels || pixels.w < 8 || pixels.h < 8) continue;
            const canvas = new OffscreenCanvas(pixels.w, pixels.h);
            canvas.getContext("2d")!.putImageData(new ImageData(pixels.rgba, pixels.w, pixels.h), 0, 0);
            data = new Uint8Array(await (await canvas.convertToBlob({ type: "image/png" })).arrayBuffer());
            ext = "png";
          }
          const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", data)), (x) => x.toString(16).padStart(2, "0")).join("");
          if (seen.has(digest)) continue;
          seen.add(digest);
          files.push({ name: `${base}-p${page + 1}-${++k}.${ext}`, data });
        }
        if (page % 10 === 9) await new Promise((r) => setTimeout(r)); // keep the page responsive
      }
    } catch (err) {
      note?.close();
      return void toast((err as Error).message, "err");
    }
    note?.close();
    if (!files.length) return void toast("This PDF has no pictures to save.", "ok", 4e3);
    if (files.length === 1) return void (await saveFile(files[0].data, files[0].name, /png$/.test(files[0].name) ? "image/png" : "image/jpeg"));
    await saveFile(makeZip(files), `${base}-images.zip`, "application/zip");
    toast(`Saved ${files.length} images in ${base}-images.zip`, "ok", 4e3);
  }
  /** Right-click menu for the Move & resize selection (one or several objects). */
  async function arrangeMenu(clientX: number, clientY: number, anchor?: HTMLElement): Promise<void> {
    const clip = await getObjClip();
    const items = arrange.selected();
    const count = items.length;
    if (!count) return;
    const page = arrange.sel!.page;
    const canEdit = canModify();
    const menu: MenuItem[] = [];
    if (count === 1) {
      const item = items[0];
      menu.push({ heading: item.label });
      const annot =
        item.kind === "annot" ? app.doc.annots(page).find((a: AnnotInfo) => a.index === item.annot) : undefined;
      if (annot) {
        const view = viewer.views[page];
        if (annot.subtype === ANNOT.FREETEXT && interact.textbox && view) {
          menu.push({
            label: "Edit text",
            run: () => {
              app.setTool("select");
              interact.textbox!.edit(view, annot.index);
            },
          });
        } else {
          menu.push({
            label: annot.contents ? "Edit comment" : "Add comment",
            run: () => {
              app.setTool("select");
              app.selectedAnnot = { page, index: annot.index };
              interact.refreshOverlays();
              interact.onNoteCreated(page, annot.index);
            },
          });
        }
        const styleRows = styleItems(page, annot, canAnnotate());
        if (styleRows.length) {
          menu.push("sep", ...styleRows);
        }
      } else if (item.label === "Link") {
        const link = interact.links?.of(page).find((l: LinkInfo) => l.index === item.annot);
        if (link && interact.links) {
          menu.push({ label: "Edit link…", disabled: !canEdit, run: () => interact.links!.editDialog(page, link) });
        }
      } else if (item.kind === "image") {
        menu.push(
          { label: "Rotate left", run: () => arrange.turn("rotl") },
          { label: "Rotate right", run: () => arrange.turn("rotr") },
          { label: "Flip horizontally", run: () => arrange.turn("fliph") },
          { label: "Flip vertically", run: () => arrange.turn("flipv") },
        );
        if (item.label === "Image") {
          menu.push(
            "sep",
            { label: "Crop", run: () => arrange.startCrop() },
            { label: "Replace image…", run: () => replaceSelectedImage() },
            { label: "Save image…", run: () => saveSelectedImage() },
          );
        }
      }
      menu.push("sep");
    } else menu.push({ heading: `${count} objects` });
    const align = (where: AlignEdge) => arrange.align(where);
    menu.push(
      chipRow(
        count > 1 ? "Align" : "Align to page",
        [
          { text: "Left", label: count > 1 ? "Align left edges" : "Page’s left edge", v: "left" as AlignEdge },
          { text: "Centre", label: count > 1 ? "Align centres" : "Centre on the page", v: "hcenter" as AlignEdge },
          { text: "Right", label: count > 1 ? "Align right edges" : "Page’s right edge", v: "right" as AlignEdge },
        ],
        () => false,
        align,
        !canEdit,
      ),
      chipRow(
        "",
        [
          { text: "Top", label: count > 1 ? "Align tops" : "Page’s top", v: "top" as AlignEdge },
          { text: "Middle", label: count > 1 ? "Align middles" : "Centre on the page vertically", v: "vmiddle" as AlignEdge },
          { text: "Bottom", label: count > 1 ? "Align bottoms" : "Page’s bottom", v: "bottom" as AlignEdge },
        ],
        () => false,
        align,
        !canEdit,
      ),
    );
    if (count >= 3) {
      menu.push(
        { label: "Distribute across", disabled: !canEdit, run: () => arrange.distribute("h") },
        { label: "Distribute down", disabled: !canEdit, run: () => arrange.distribute("v") },
      );
    }
    if (count >= 2) {
      menu.push(
        chipRow(
          "Match",
          [
            { text: "Width", label: "Match width of the last clicked", v: "w" },
            { text: "Height", label: "Match height of the last clicked", v: "h" },
            { text: "Both", label: "Match size of the last clicked", v: "both" },
          ],
          () => false,
          (mode) => arrange.matchSize(mode as "w" | "h" | "both"),
          !canEdit,
        ),
      );
    }
    menu.push(
      "sep",
      { label: "Bring to front", shortcut: "Ctrl+Shift+]", disabled: !canEdit, run: () => arrange.restack("front") },
      { label: "Bring forward", shortcut: "Ctrl+]", disabled: !canEdit, run: () => arrange.restack("forward") },
      { label: "Send backward", shortcut: "Ctrl+[", disabled: !canEdit, run: () => arrange.restack("backward") },
      { label: "Send to back", shortcut: "Ctrl+Shift+[", disabled: !canEdit, run: () => arrange.restack("back") },
      "sep",
      ...clipboardItems(clip, canEdit),
      {
        label: count > 1 ? `Duplicate ${count}` : "Duplicate",
        shortcut: "Ctrl+D",
        disabled: !canEdit || !items.some((item) => arrange.canDuplicate(item)),
        run: () => arrange.duplicate(page),
      },
      {
        label: count > 1 ? `Delete ${count} objects` : "Delete",
        shortcut: "Del",
        danger: true,
        disabled: !canEdit,
        run: () => arrange.remove(),
      },
    );
    openMenu(clientX, clientY, menu, anchor);
  }
  /** Right-click menu for empty page space; `point` is the clicked spot in page coordinates. */
  async function pageSpaceMenu(page: number, clientX: number, clientY: number, point: Pt): Promise<void> {
    const view = viewer.views[page];
    if (!view) return;
    const clip = await getObjClip();
    const canAnnot = canAnnotate();
    const canEdit = canModify();
    app.selectedPages = new Set([page]);
    thumbs.mark();
    const menu: MenuItem[] = [{ heading: `Page ${page + 1}` }];
    if (app.tool === "arrange") {
      menu.push(
        {
          label: "Select all objects",
          shortcut: "Ctrl+A",
          run: () => {
            arrange.sel = null;
            app.currentPage = page;
            arrange.selectAll();
            renderRibbon();
          },
        },
        "sep",
      );
    }
    if (clip) {
      menu.push(
        {
          label: clip.count === 1 ? "Paste here" : `Paste ${clip.count} objects here`,
          shortcut: "Ctrl+V",
          disabled: !(clip.items.some((item) => item.t === "img") ? canEdit : canAnnot),
          run: () => pasteObjects(null, { page, p: point }),
        },
        "sep",
      );
    }
    menu.push(
      {
        label: "Add note here",
        disabled: !canAnnot,
        run: () => {
          app.setTool("select");
          interact.noteDown(view, point);
        },
      },
      {
        label: "Add text box here",
        disabled: !canAnnot || !interact.textbox,
        run: () => {
          app.setTool("select");
          interact.textbox!.edit(view, null, {
            box: { l: point.x, r: point.x + 200, t: point.y, b: point.y - app.settings.ftSize * 2.2 },
            text: "",
            style: interact.textbox!.style(),
          });
        },
      },
      "sep",
      { label: "Copy page", shortcut: "Ctrl+C", run: () => pageAction("copy") },
      { label: "Rotate page left", disabled: !canEdit, run: () => pageAction("rotl") },
      { label: "Rotate page right", disabled: !canEdit, run: () => pageAction("rotr") },
      { label: "Insert blank page after", disabled: !canEdit, run: () => pageAction("insert") },
      "sep",
      {
        label: "Delete page",
        danger: true,
        disabled: !canEdit || app.doc.pageCount <= 1,
        run: () => pageAction("delete"),
      },
    );
    openMenu(clientX, clientY, menu);
  }
  /** Right-click menu for a link with Select. */
  function linkMenu(page: number, index: number, clientX: number, clientY: number, anchor?: HTMLElement): void {
    const link = interact.links?.of(page).find((l: LinkInfo) => l.index === index);
    if (!link || !interact.links) return;
    const { locked, perms } = app.limits;
    const canEdit = !locked || !!(perms & 8);
    const target = link.uri ? link.uri : link.page != null && link.page >= 0 ? `page ${link.page + 1}` : "nowhere";
    openMenu(
      clientX,
      clientY,
      [
        { heading: `Link to ${target.length > 40 ? target.slice(0, 39) + "…" : target}` },
        {
          label: link.uri ? "Open link" : "Go to page",
          disabled: !link.uri && !(link.page != null && link.page >= 0),
          run: () => interact.links!.follow(link),
        },
        ...(link.uri
          ? [
              {
                label: "Copy link address",
                run: () => {
                  navigator.clipboard?.writeText(link.uri!).then(
                    () => toast("Link address copied"),
                    () => toast("Couldn’t reach the clipboard", "warn"),
                  );
                },
              },
            ]
          : []),
        "sep",
        { label: "Edit link…", disabled: !canEdit, run: () => interact.links!.editDialog(page, link) },
        {
          label: "Remove link",
          danger: true,
          disabled: !canEdit,
          run: () =>
            app
              .mutate("Remove link", { pages: [page] }, () => app.doc.deleteAnnot(page, link.index))
              .catch((err) => toast(err.message, "err")),
        },
      ],
      anchor,
    );
  }
  viewer.el.addEventListener("contextmenu", (event) => {
    if ((app.tool !== "select" && app.tool !== "arrange") || isTypingIn(event.target)) return;
    const target = event.target as HTMLElement;
    const pageEl = target.closest<HTMLElement>(".page");
    if (!pageEl) return;
    const page = +pageEl.dataset.index!;
    const view = viewer.views[page];
    if (!view) return;
    if (app.tool === "arrange") {
      if (arrange.cropping) return;
      event.preventDefault();
      const key = target.closest<HTMLElement>("[data-k]")?.dataset.k;
      if (key) {
        if (!(arrange.sel?.page === page && (arrange.sel.key === key || arrange.extra.includes(key)))) {
          arrange.sel = { page, key };
          arrange.extra = [];
          arrange.refresh();
          renderRibbon();
        }
        arrangeMenu(event.clientX, event.clientY);
      } else if (target.closest<HTMLElement>(".ogroup") && arrange.sel?.page === page) {
        arrangeMenu(event.clientX, event.clientY);
      } else {
        if (arrange.sel) {
          arrange.clear();
        }
        pageSpaceMenu(page, event.clientX, event.clientY, viewer.toPage(view, event));
      }
      return;
    }
    if (window.getSelection()?.toString()) return;
    const annotBox = target.closest<HTMLElement>(".abox");
    const linkBox = target.closest<HTMLElement>(".lbox");
    event.preventDefault();
    if (annotBox) annotMenu(page, +annotBox.dataset.annot!, event.clientX, event.clientY, annotBox);
    else if (linkBox) linkMenu(page, +linkBox.dataset.link!, event.clientX, event.clientY, linkBox);
    else {
      if (target.closest<HTMLElement>(".fld,.sigfld,input,select,button")) return;
      if (app.selectedAnnot) {
        app.selectedAnnot = null;
        interact.refreshOverlays();
        renderRibbon();
      }
      pageSpaceMenu(page, event.clientX, event.clientY, viewer.toPage(view, event));
    }
  });
  document.addEventListener("keydown", (event) => {
    if (
      !(event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) ||
      isTypingIn(event.target) ||
      menuOpen() ||
      thumbOf(event.target)
    )
      return;
    if (app.tool === "arrange" && arrange.sel && !arrange.cropping) {
      const frame = viewer.views[arrange.sel.page]?.ov.querySelector(".oframe.primary, .oframe:not(.multi)");
      if (!frame) return;
      event.preventDefault();
      const rect = frame.getBoundingClientRect();
      arrangeMenu(rect.left + Math.min(rect.width, 40), rect.bottom + 4);
      return;
    }
    const sel = app.selectedAnnot;
    if (!sel || app.tool !== "select") return;
    const box = viewer.views[sel.page]?.ov.querySelector<HTMLElement>(`.abox[data-annot="${sel.index}"]`);
    if (!box) return;
    event.preventDefault();
    const boxRect = box.getBoundingClientRect();
    annotMenu(sel.page, sel.index, boxRect.left + Math.min(boxRect.width, 40), boxRect.bottom + 4, box);
  });
  let annotPress: LongPress | null = null;
  viewer.el.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType !== "touch" || app.tool !== "select") return;
      const box = (event.target as HTMLElement).closest<HTMLElement>(".abox,.lbox");
      if (box) {
        annotPress = {
          t: window.setTimeout(() => {
            if (!annotPress || menuOpen()) return;
            const page = +annotPress.el.closest<HTMLElement>(".page")!.dataset.index!;
            if (annotPress.el.classList.contains("abox")) {
              annotMenu(page, +annotPress.el.dataset.annot!, annotPress.x, annotPress.y, annotPress.el);
            } else {
              linkMenu(page, +annotPress.el.dataset.link!, annotPress.x, annotPress.y, annotPress.el);
            }
            annotPress = null;
          }, 550),
          x: event.clientX,
          y: event.clientY,
          el: box,
        };
      }
    },
    true,
  );
  /** Cancels the annotation long-press when the finger lifts or moves more than 10 px. */
  const cancelAnnotPress = (event: PointerEvent) => {
    if (
      annotPress &&
      (event.type !== "pointermove" || Math.hypot(event.clientX - annotPress.x, event.clientY - annotPress.y) > 10)
    ) {
      clearTimeout(annotPress.t);
      annotPress = null;
    }
  };
  for (const type of ["pointermove", "pointerup", "pointercancel"] as const)
    viewer.el.addEventListener(type, cancelAnnotPress, true);
  /** The page thumbnail containing an element, if any. */
  const thumbOf = (el: EventTarget | null) => (el as Element | null)?.closest?.<HTMLElement>(".thumb");
  thumbs.list.addEventListener("contextmenu", (event) => {
    const thumb = thumbOf(event.target);
    if (thumb) {
      event.preventDefault();
      pageMenu(+thumb.dataset.index!, event.clientX, event.clientY, thumb);
    }
  });
  thumbs.list.addEventListener("keydown", (event) => {
    const thumb = thumbOf(event.target);
    if (thumb)
      if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
        event.preventDefault();
        const rect = thumb.getBoundingClientRect();
        pageMenu(+thumb.dataset.index!, rect.left + rect.width / 2, rect.top + rect.height / 2, thumb);
      } else if ((event.key === "Delete" || event.key === "Backspace") && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();
        pageAction("delete");
      }
  });
  let thumbPress: LongPress | null = null;
  thumbs.list.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    const thumb = thumbOf(event.target);
    if (thumb) {
      thumbPress = {
        t: window.setTimeout(() => {
          if (thumbPress && !menuOpen()) {
            pageMenu(+thumbPress.el.dataset.index!, thumbPress.x, thumbPress.y, thumbPress.el);
          }
          thumbPress = null;
        }, 550),
        x: event.clientX,
        y: event.clientY,
        el: thumb,
      };
    }
  });
  /** Cancels the thumbnail long-press when the finger lifts or moves more than 10 px. */
  const cancelThumbPress = (event: PointerEvent) => {
    if (
      thumbPress &&
      (event.type !== "pointermove" || Math.hypot(event.clientX - thumbPress.x, event.clientY - thumbPress.y) > 10)
    ) {
      clearTimeout(thumbPress.t);
      thumbPress = null;
    }
  };
  for (const type of ["pointermove", "pointerup", "pointercancel"] as const)
    thumbs.list.addEventListener(type, cancelThumbPress);
  /** Whether keys and clipboard events belong to a text field (or the text editor is open). */
  const isTypingIn = (el: EventTarget | null): boolean =>
    !!(el as Element | null)?.closest?.("input,textarea,select,[contenteditable]") || !!interact.editor;
  /** Whether focus is in the page sidebar. */
  const thumbsFocused = (): boolean => !!document.activeElement?.closest?.("#thumbs");
  document.addEventListener("copy", (event) => {
    if (isTypingIn(event.target) || document.querySelector(".modal") || window.getSelection()?.toString()) return;
    if (!thumbsFocused() && objectSelection()) {
      const cut = copyIsCut;
      copyIsCut = false;
      copyHandled = true;
      const marker = copyObjects(cut);
      if (marker) {
        event.preventDefault();
        event.clipboardData?.setData("text/plain", marker);
      }
      return;
    }
    if (!thumbsFocused() && !app.selectedPages.size) return;
    const pagesMarker = copyPages(selectedOrCurrentPages());
    if (pagesMarker) {
      event.preventDefault();
      event.clipboardData?.setData("text/plain", pagesMarker);
    }
  });
  /** Runs a page command (sidebar buttons and page menus) on the selected pages, or the current page. */
  async function pageAction(action: string): Promise<ToastHandle | void> {
    const pageCount = app.doc.pageCount;
    const pages = app.selectedPages.size ? [...app.selectedPages].sort((a, b) => a - b) : [app.currentPage];
    const what = pages.length > 1 ? `${pages.length} pages` : `page ${pages[0] + 1}`;
    try {
      if (action === "rotl" || action === "rotr")
        await app.mutate(`Rotate ${what}`, { pages, structure: true }, () =>
          pages.forEach((p) => app.doc.rotate(p, action === "rotl" ? -1 : 1)),
        );
      else if (action === "insert") {
        const last = pages[pages.length - 1];
        const { w: width, h: height } = app.doc.pageSize(last);
        await app.mutate("Insert blank page", { pages: "all", structure: true }, () =>
          app.doc.insertBlank(last + 1, width, height),
        );
        app.selectedPages = new Set([last + 1]);
        thumbs.mark();
        viewer.scrollToPage(last + 1);
      } else if (action === "delete") {
        if (pages.length >= pageCount) return toast("A PDF needs at least one page", "warn");
        if (
          (await modal({
            title: `Delete ${what}?`,
            body: "You can undo this.",
            actions: [
              { id: "no", label: "Cancel" },
              { id: "yes", label: "Delete", danger: true },
            ],
          })) !== "yes"
        )
          return;
        await app.mutate(`Delete ${what}`, { pages: "all", structure: true }, () => {
          for (const p of [...pages].reverse()) app.doc.deletePage(p);
          app.selectedPages.clear();
        });
      } else if (action === "merge") {
        insertFileInput.click();
        return;
      } else if (action === "copy") {
        const marker = copyPages(pages);
        if (marker) {
          navigator.clipboard?.writeText(marker).catch(() => {});
        }
      } else if (action === "paste") {
        await pastePages();
      } else if (action === "extract") {
        await extractDialog(app, pdfium, pages, saveFile);
      }
    } catch (err) {
      toast((err as Error).message, "err");
    }
  }
  /** Saves the edited document; resolves to false if it couldn’t be written. */
  async function saveCurrent(): Promise<boolean> {
    let bytes;
    try {
      bytes = app.exportBytes();
    } catch (err) {
      toast(isEngineAbort(err) ? ENGINE_FULL : (err as Error).message, "err", 8e3);
      return false;
    }
    await saveFile(bytes, app.editedName);
    return true;
  }
  /**
   * Saves bytes as a file through a download link.
   * Saving the edited document under its name clears the dirty flag.
   */
  async function saveFile(bytes: Uint8Array, filename: string, mime = "application/pdf"): Promise<void> {
    try {
      const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
      const link = h("a", { href: url, download: filename });
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4e3);
      if (filename === app.editedName) {
        app.dirty = false;
        refreshTopBar();
        session.schedule();
      }
      toast(`Saved ${filename}`);
    } catch {
      toast("Saving isn’t available in this view", "err");
    }
  }
  /** Asks whether to discard unsaved changes (offering to save first); resolves to true to go ahead. */
  async function confirmDiscard(): Promise<boolean> {
    return (
      (await modal({
        title: "Discard your changes?",
        body: `${app.fileName} has edits you haven’t saved.`,
        actions: [
          { id: "no", label: "Keep editing" },
          { id: "save", label: "Save first" },
          { id: "yes", label: "Discard", danger: true },
        ],
      }).then(async (choice) => (choice === "save" ? ((await saveCurrent()) ? "yes" : "no") : choice))) === "yes"
    );
  }
  /** Deletes the annotation selected with Select. */
  function deleteSelectedAnnot(): void {
    const sel = app.selectedAnnot;
    if (sel) {
      app
        .mutate("Delete annotation", { pages: [sel.page] }, () => app.doc.deleteAnnot(sel.page, sel.index))
        .then(() => {
          app.selectedAnnot = null;
          renderRibbon();
        })
        .catch((err) => toast(err.message, "err"));
    }
  }
  function undo(): void {
    const label = app.undo();
    if (label) {
      toast(`Undid ${label.toLowerCase()}`);
    }
  }
  function redo(): void {
    const label = app.redo();
    if (label) {
      toast(`Redid ${label.toLowerCase()}`);
    }
  }
  const viewerEl = $("#viewer");
  viewerEl.addEventListener("dragover", (event) => {
    if (event.dataTransfer?.types.includes("Files")) {
      event.preventDefault();
      viewerEl.classList.add("dropping");
    }
  });
  viewerEl.addEventListener("dragleave", (event) => {
    if (event.target === viewerEl) {
      viewerEl.classList.remove("dropping");
    }
  });
  viewerEl.addEventListener("drop", (event) => {
    viewerEl.classList.remove("dropping");
    const images = [...(event.dataTransfer?.files || [])].filter(isImageFile);
    if (images.length) {
      event.preventDefault();
      const pageEl = (event.target as HTMLElement).closest<HTMLElement>(".page");
      const view = pageEl ? viewer.views[+pageEl.dataset.index!] : undefined;
      if (interact.editor) {
        interact.commitEditor();
      }
      (async () => {
        for (const [i, file] of images.entries())
          await interact.placeImageFile(
            file,
            view ? { pv: view, clientX: event.clientX + i * 16, clientY: event.clientY + i * 16 } : undefined,
          );
      })();
      return;
    }
    const pdfs = [...(event.dataTransfer?.files || [])].filter(
      (file) => /pdf$/i.test(file.type) || /\.pdf$/i.test(file.name),
    );
    if (pdfs.length) {
      event.preventDefault();
      openFiles(pdfs);
    }
  });
  $("#thumbs").addEventListener("dragover", (event) => {
    if (event.dataTransfer?.types.includes("Files")) {
      event.preventDefault();
    }
  });
  $("#thumbs").addEventListener("drop", (event) => {
    const files = [...(event.dataTransfer?.files || [])].filter((file) => isPdfFile(file) || isImageFile(file));
    if (files.length) {
      event.preventDefault();
      insertFiles(files);
    }
  });
  /** Tool name by its single-key shortcut (lower case). */
  const TOOL_BY_KEY = Object.fromEntries(
    (Object.entries(TOOL_INFO) as Array<[string, ToolInfo]>).map(([tool, info]) => [info.key.toLowerCase(), tool]),
  );
  document.addEventListener("keydown", (event) => {
    const inField = (event.target as Element).closest<HTMLElement>("input,textarea,select,[contenteditable]");
    const mod = event.metaKey || event.ctrlKey;
    if (mod && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveCurrent();
      return;
    }
    if (event.ctrlKey && event.altKey && !event.shiftKey && !inField && (event.code === "KeyP" || event.code === "KeyC")) {
      event.preventDefault();
      togglePanel(event.code === "KeyP" ? "pages" : "comments");
      return;
    }
    if (event.key === "F7" && !mod) {
      event.preventDefault();
      if (interact.editor) {
        interact.commitEditor();
      }
      spelling.open();
      return;
    }
    if (mod && event.key.toLowerCase() === "p") {
      event.preventDefault();
      if (interact.editor) {
        interact.commitEditor();
      }
      printDialog(app);
      return;
    }
    if (mod && event.key.toLowerCase() === "f") {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
      return;
    }
    if (mod && event.key.toLowerCase() === "h") {
      event.preventDefault();
      toggleReplacePanel(true);
      return;
    }
    if (mod && event.key.toLowerCase() === "o") {
      event.preventDefault();
      openFileInput.click();
      return;
    }
    if (!inField) {
      if (mod && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
      if (mod && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
        return;
      }
      if (mod && (event.key === "=" || event.key === "+")) {
        event.preventDefault();
        viewer.setZoom(viewer.zoom * 1.2);
        return;
      }
      if (mod && event.key === "-") {
        event.preventDefault();
        viewer.setZoom(viewer.zoom / 1.2);
        return;
      }
      if (mod && event.key === "0") {
        event.preventDefault();
        viewer.fit = "width";
        viewer.applyFit();
        return;
      }
      if (app.tool === "crop" && crop.sel) {
        if (event.key === "Enter") {
          event.preventDefault();
          crop.apply([crop.sel.page]);
          return;
        }
        if (event.key === "Escape") {
          event.preventDefault();
          crop.sel = null;
          crop.refresh();
          renderRibbon();
          return;
        }
      }
      if (app.tool === "arrange" && arrange.cropping) {
        if (event.key === "Enter") {
          event.preventDefault();
          arrange.applyCrop(encodePixels);
          return;
        }
        if (event.key === "Escape") {
          event.preventDefault();
          arrange.cancelCrop();
          return;
        }
      }
      if (mod && !event.shiftKey && event.key.toLowerCase() === "d") {
        if (app.tool === "arrange" && arrange.sel && !arrange.cropping) {
          event.preventDefault();
          if (canModify()) {
            arrange.duplicate(arrange.sel.page);
          }
          return;
        }
        if (app.tool === "select" && app.selectedAnnot) {
          event.preventDefault();
          if (canAnnotate()) {
            duplicateAnnot(app.selectedAnnot.page, app.selectedAnnot.index);
          }
          return;
        }
      }
      if (app.tool === "arrange" && !inField && mod && event.key.toLowerCase() === "a") {
        event.preventDefault();
        arrange.selectAll();
        renderRibbon();
        return;
      }
      if (
        app.tool === "arrange" &&
        arrange.sel &&
        mod &&
        (event.key === "]" || event.key === "[" || event.code === "BracketRight" || event.code === "BracketLeft")
      ) {
        event.preventDefault();
        const forward = event.key === "]" || event.code === "BracketRight";
        arrange.restack(event.shiftKey ? (forward ? "front" : "back") : forward ? "forward" : "backward");
        return;
      }
      if (app.tool === "arrange" && arrange.sel) {
        const step = event.shiftKey ? 10 : 1;
        const moves: Record<string, [number, number]> = {
          ArrowLeft: [-step, 0],
          ArrowRight: [step, 0],
          ArrowUp: [0, -step],
          ArrowDown: [0, step],
        };
        if (moves[event.key]) {
          event.preventDefault();
          arrange.nudge(...moves[event.key]);
          return;
        }
        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault();
          arrange.remove();
          return;
        }
        if (event.key === "Escape") {
          arrange.clear();
          renderRibbon();
          return;
        }
      }
      if ((event.key === "Delete" || event.key === "Backspace") && app.selectedAnnot) {
        event.preventDefault();
        deleteSelectedAnnot();
        return;
      }
      if (event.key === "Escape") {
        app.setTool("select");
        return;
      }
      if (!mod && !event.altKey && TOOL_BY_KEY[event.key.toLowerCase()]) {
        app.setTool(TOOL_BY_KEY[event.key.toLowerCase()]);
      }
    }
  });
  document.addEventListener("cut", (event) => {
    if (
      isTypingIn(event.target) ||
      document.querySelector(".modal") ||
      window.getSelection()?.toString() ||
      thumbsFocused() ||
      !objectSelection()
    )
      return;
    const marker = copyObjects(true);
    if (marker) {
      event.preventDefault();
      event.clipboardData?.setData("text/plain", marker);
    }
  });
  document.addEventListener("paste", (event) => {
    if (isTypingIn(event.target) || document.querySelector(".modal")) return;
    const image = [...(event.clipboardData?.items || [])]
      .find((item) => item.kind === "file" && item.type.startsWith("image/"))
      ?.getAsFile();
    if (image) {
      event.preventDefault();
      interact.placeImageFile(image);
      return;
    }
    const text = event.clipboardData?.getData("text/plain") || "";
    const pageMarker = markerId(text);
    const objMarker = objMarkerId(text);
    if (thumbsFocused()) {
      event.preventDefault();
      pastePages(pageMarker);
      return;
    }
    if (!(!pageMarker && !objMarker && text.trim())) {
      event.preventDefault();
      Promise.all([getClip(), getObjClip()]).then(([pageClip, objClip]) => {
        if (objClip && (!pageClip || objClip.at >= pageClip.at)) {
          pasteObjects(objMarker && objMarker === objClip.id ? objMarker : null);
        } else if (pageClip) {
          pastePages(pageMarker && pageMarker === pageClip.id ? pageMarker : null);
        } else if (objMarker) {
          pasteObjects(objMarker);
        } else if (pageMarker) {
          pastePages(pageMarker);
        }
      });
    }
  });
  // Unsaved changes are kept in the browser (session.ts), so leaving only needs a warning when that failed.
  const session = new Session(app);
  Object.assign((window as unknown as { __margin: Record<string, unknown> }).__margin, { session, updates });
  session.onTooLarge = () => toast("This document is too large to keep through a refresh. Save it before you close the tab.", "warn", 8e3);
  window.addEventListener("beforeunload", (event) => {
    if (session.atRisk) event.preventDefault();
    else session.flush();
  });
  /** Reopens a stored session; resolves to false if it couldn't be (or its password prompt was cancelled). */
  async function resumeSession(stored: StoredSession): Promise<boolean> {
    const { record, bufs } = stored, buf = (id: number) => bufs.get(id)!;
    const snap = (s: SessionRecord["undo"][number]): Snapshot => ({ label: s.label, file: buf(s.buf), len: s.len, change: s.change });
    const state = { file: buf(record.buf), cur: record.cur, name: record.name, undo: record.undo.map(snap), redo: record.redo.map(snap), page: record.page, mustRewrite: record.mustRewrite };
    if (record.sid === session.sid) await session.adopt(stored);
    for (let password = "", attempt = 0; ; attempt++) {
      try {
        app.resume(state, password);
        break;
      } catch (err) {
        if (!(err instanceof PdfError && err.code === 4)) {
          toast(`Your unsaved changes to ${record.name} couldn’t be restored: ${(err as Error).message}`, "err", 8e3);
          return false;
        }
        document.getElementById("boot")?.remove(); // the prompt can’t sit behind the loading screen
        const entered = await askPassword(record.name, attempt > 0, "restore");
        if (entered == null) return false;
        password = entered;
      }
    }
    if (record.sid !== session.sid) {
      await session.flush();
      await session.remove(record.sid);
    }
    requestAnimationFrame(() => viewer.scrollToPage(app.currentPage));
    toast(`Restored your unsaved changes to ${record.name}`, "ok", 4e3);
    restoredAt = Date.now();
    return true;
  }
  /** Offers back unsaved changes left by a tab that was closed or crashed. */
  async function offerOrphan(record: SessionRecord): Promise<void> {
    const ago = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }), mins = Math.round((record.updated - Date.now()) / 60000);
    const when = mins > -60 ? ago.format(mins, "minute") : mins > -1440 ? ago.format(Math.round(mins / 60), "hour") : ago.format(Math.round(mins / 1440), "day");
    const choice = await modal({
      title: "Unsaved changes found",
      body: h("p", { class: "modal-text", text: `${record.name} was closed with unsaved changes (last edited ${when}). Restore them?` }),
      actions: [
        { id: "discard", label: "Discard" },
        { id: "restore", label: "Restore", primary: true },
      ],
    });
    if (choice === "discard") await session.remove(record.sid).catch(() => {});
    else if (choice === "restore") {
      const stored = await session.read(record.sid).catch(() => null);
      if (stored) await resumeSession(stored);
    }
  }
  let restoredAt = 0;
  const own = await session.start();
  if (!own || !(await resumeSession(own))) {
    try {
      const welcome = new Uint8Array(await fetchAsset("welcome.pdf"));
      app.open(welcome, "Welcome to Margin.pdf");
    } catch {
      const blank = pdfium.create();
      blank.insertBlank(0, 612, 792);
      app.open(blank.save(), "Untitled.pdf");
      blank.close();
    }
  }
  app.setTool("select");
  document.getElementById("boot")?.remove();
  updates.start(restoredAt ? 4500 : 0);
  if (!own) {
    const orphan = await session.orphan();
    if (orphan) await offerOrphan(orphan);
  }
  loadFont(fontByKey("sarabun")).catch(() => {});
  // Chinese, Japanese and Korean fonts are about a megabyte: say so while one downloads (once per font).
  onBigFontLoading((def) => {
    const note = toast(`Loading ${def.label.split(" · ")[0]}…`, "ok", 60e3);
    return () => note.close();
  });
}
main();
