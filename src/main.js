import "./style.css";
import { Vl, yr } from './app';
import { Pu, Xn } from './changelog';
import { Cr } from './engine/assets';
import { Yt } from './engine/growable';
import { Ha, Q, So, Zn, rr, wo } from './engine/pdfium';
import { $t, Gr, Mr, _l, sn, ze } from './engine/text';
import { bc } from './ui/arrange';
import { Gc } from './ui/bookmarks';
import { Oc } from './ui/compress';
import { wc } from './ui/crop';
import { Zr, pn } from './ui/ctxmenu';
import { Gn, H, Mn, Ve, _e, lt, nt, ra, y } from './ui/dom';
import { Tc } from './ui/exportimg';
import { Ac, Ar, ir, ln, pa, xr } from './ui/extract';
import { _u, kr } from './ui/forms';
import { Gl, ss } from './ui/headerfooter';
import { Eo, Fs, Zl, gs, ia } from './ui/images';
import { Jr, dc } from './ui/interact';
import { mu } from './ui/links';
import { Kn, Pr, au, cu, iu, lu, ou, su, uu } from './ui/pageclip';
import { Fu } from './ui/panel';
import { Fa } from './ui/print';
import { Sc } from './ui/protect';
import { Cs, nu, tu } from './ui/replace';
import { Lr } from './ui/spell';
import { Rn } from './ui/stamps';
import { hu } from './ui/textbox';
import { bu, gu } from './ui/thumbs';
import { tc } from './ui/viewer';
import { ds, jl } from './ui/watermark';

let Du = null;
function yu() {
  const u = window.claude;
  return u?.use ? Du ??= Promise.resolve(u.use("downloads")).catch(() => null) : Promise.resolve(null);
}
async function wu() {
  ra("[data-i]").forEach((g) => {
    g.innerHTML = ss[g.dataset.i] || "", g.setAttribute("aria-hidden", "true");
  });
  const u = _e("#boot-status");
  _e("#boot-version").textContent = "v" + Xn, document.documentElement.dataset.version = Xn;
  const n = Cr;
  let t;
  try {
    u.textContent = "Starting the PDF engine…";
    const [g, S] = await Promise.all([n("pdfium.wasm"), n("harfbuzz.wasm")]);
    t = await So.load(g), await _l(S);
  } catch (g) {
    u.textContent = `The PDF engine couldn't start in this browser: ${g?.message || g}. Try a current version of Chrome, Edge, Safari or Firefox.`, _e("#boot").classList.add("failed");
    return;
  }
  const e = new Vl(t), r = new tc(_e("#viewer"), e), o = new dc(e, r), a = new bc(e, r);
  o.arrange = a, a.onChange = () => V();
  const s = new wc(e, r);
  o.crop = s, s.onChange = () => V();
  const i = new hu(e, r);
  o.textbox = i, o.links = new mu(e, r), o.forms = new _u(e, r), i.onChange = () => V(), a.onFreeText = (g, S, I, R) => {
    i.update(g, S, I, R);
  };
  const l = () => e.selectedPages.size > 1 ? [...e.selectedPages].sort((g, S) => g - S) : null, h = new gu(_e("#thumbs"), e), m = new Fu(_e("#comments"), e);
  window.__margin = { app: e, viewer: r, ix: o, arrange: a, Growable: Yt };
  const _ = new Gc(e, r), p = y("div", { class: "side-pane", id: "pane-pages" }, bu((g) => ve(g)), h.list);
  _.el.id = "pane-bookmarks", _.el.classList.add("side-pane"), _.el.hidden = true;
  const P = (g, S, I) => y("button", { class: "side-tab", type: "button", role: "tab", id: "tab-" + g, "aria-controls": "pane-" + g, onclick: () => D(g) }, y("span", { text: S }), y("span", { class: "count", id: I })), D = (g) => {
    for (const S of ["pages", "bookmarks"]) {
      const I = S === g;
      _e("#tab-" + S).setAttribute("aria-selected", String(I)), _e("#tab-" + S).classList.toggle("on", I), _e("#pane-" + S).hidden = !I;
    }
    try {
      localStorage.setItem("margin.side", g);
    } catch {
    }
  };
  _e("#thumbs").append(y("div", { class: "panel-head side-tabs", role: "tablist", "aria-label": "Sidebar" }, P("pages", "Pages", "page-count"), P("bookmarks", "Bookmarks", "bm-count")), p, _.el), _.onCount = (g) => {
    _e("#bm-count").textContent = g ? String(g) : "";
  }, D((() => {
    try {
      return localStorage.getItem("margin.side") === "bookmarks" ? "bookmarks" : "pages";
    } catch {
      return "pages";
    }
  })());
  const x = _e("#rail");
  [["select", "arrange", "edittext", "addtext"], ["highlight", "underline", "strike"], ["textbox", "draw", "line", "rect", "ellipse", "note"], ["image", "stamp", "sign", "link"], ["form", "redact", "crop"]].forEach((g, S) => {
    S && x.append(y("div", { class: "rail-sep", role: "separator" }));
    for (const I of g) {
      const R = Jr[I];
      x.append(y("button", { class: "tool", type: "button", "data-tool": I, "aria-label": `${R.label} (${R.key})`, title: `${R.label}  ${R.key}`, onclick: () => e.setTool(I) }, Ve(R.icon), y("span", { class: "tool-label", text: R.label })));
    }
  }), x.addEventListener("pointerover", (g) => {
    const S = g.target.closest(".tool");
    if (!S) return;
    const I = S.getBoundingClientRect();
    S.style.setProperty("--lx", I.right + 8 + "px"), S.style.setProperty("--ly", I.top + I.height / 2 + "px");
  }), x.addEventListener("focusin", (g) => {
    const S = g.target.closest(".tool");
    if (!S) return;
    const I = S.getBoundingClientRect();
    S.style.setProperty("--lx", I.right + 8 + "px"), S.style.setProperty("--ly", I.top + I.height / 2 + "px");
  }), e.onTool((g) => x.querySelector(`.tool[data-tool="${g}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" }));
  const w = _e("#ribbon"), k = (g, S, I, R) => y("div", { class: "swatches", role: "radiogroup", "aria-label": R }, ...g.map((L) => y("button", { class: "sw" + (Gn(L, S) ? " on" : ""), type: "button", role: "radio", "aria-checked": String(Gn(L, S)), "aria-label": `rgb ${L.slice(0, 3).join(" ")}`, style: { background: `rgb(${L[0]},${L[1]},${L[2]})` }, onclick: () => {
    I(L), e.saveSettings(), V();
  } }))), G = (g, S) => y("div", { class: "chips", role: "radiogroup", "aria-label": "Stroke width" }, ...[1, 2, 4, 8].map((I) => y("button", { class: "chip" + (I === g ? " on" : ""), type: "button", role: "radio", "aria-checked": String(I === g), title: `${I} pt`, onclick: () => {
    S(I), e.saveSettings(), V();
  } }, y("span", { class: "wline", style: { height: Math.min(I, 6) + "px" } }), y("span", { class: "num", text: `${I}` })))), E = (g, S) => y("label", { class: "rfield" }, y("span", { class: "rlabel", text: g }), S);
  // colour swatches with an optional None and a custom colour picker; pick(c) gets an RGBA or null
  const Hx = (g) => "#" + g.slice(0, 3).map((S) => S.toString(16).padStart(2, "0")).join(""), Ux = (g) => [parseInt(g.slice(1, 3), 16), parseInt(g.slice(3, 5), 16), parseInt(g.slice(5, 7), 16), 255];
  function Cp(g, S, I, R, L = false) {
    const j = !S || g.some((K) => Gn(K, S)), F = y("input", { type: "color", class: "sw custom" + (j ? "" : " on"), title: "Custom colour…", "aria-label": `${R}: custom colour`, value: S ? Hx(S) : "#3b82f6", style: j ? {} : { background: Mn(S) } });
    return F.addEventListener("change", () => I(Ux(F.value))), y("div", { class: "swatches", role: "radiogroup", "aria-label": R }, ...L ? [y("button", { class: "sw none" + (S ? "" : " on"), type: "button", role: "radio", "aria-checked": String(!S), title: "None", "aria-label": "None", onclick: () => I(null) })] : [], ...g.map((K) => {
      const se = !!S && Gn(K, S);
      return y("button", { class: "sw" + (se ? " on" : ""), type: "button", role: "radio", "aria-checked": String(se), "aria-label": `rgb ${K.slice(0, 3).join(" ")}`, style: { background: Mn(K) }, onclick: () => I(K) });
    }), F);
  }
  // opacity slider (10–100 %); commits on release
  function Op(g, S) {
    const I = y("span", { class: "unit op-val", text: Math.round(g * 100) + "%" }), R = y("input", { type: "range", class: "op-range", min: "10", max: "100", step: "5", value: String(Math.round(g * 100)), "aria-label": "Opacity" });
    return R.addEventListener("input", () => I.textContent = R.value + "%"), R.addEventListener("change", () => S(+R.value / 100)), E("Opacity", y("span", { class: "withunit" }, R, I));
  }
  const SFILLS = [[255, 255, 255, 255], ...lt.highlight];
  function B() {
    const g = o.editor, S = g ? { fontKey: g.selFont || g.fontKey, size: g.selSize || g.size, color: g.color } : { fontKey: e.settings.textFont, size: e.settings.textSize, color: e.settings.textColor }, I = y("select", { class: "rselect", id: "font-select", "aria-label": "Font" });
    for (const re of ["Standard", "Thai + Latin", "Latin"]) I.append(y("optgroup", { label: re }, ...sn.filter((ie) => ie.group === re).map((ie) => y("option", { value: ie.key, text: ie.label, selected: ie.key === S.fontKey }))));
    I.addEventListener("change", () => {
      o.editor ? o.setEditorStyle({ fontKey: I.value }) : (e.settings.textFont = I.value, e.saveSettings(), $t(ze(I.value)).catch((re) => H(re.message, "err")));
    });
    const R = y("input", { class: "rnum", id: "font-size", type: "number", min: "4", max: "144", step: "0.5", value: String(Math.round(S.size * 10) / 10), "aria-label": "Font size in points" });
    R.addEventListener("change", () => {
      const re = Math.max(4, Math.min(144, +R.value || 12));
      o.editor ? o.setEditorStyle({ size: re }) : (e.settings.textSize = re, e.saveSettings());
    });
    const L = k(lt.pen, S.color, (re) => {
      o.editor ? o.setEditorStyle({ color: re }) : e.settings.textColor = re;
    }, "Text color"), j = g ? g.style : Gr(e.settings.textStyle), F = (re) => re.preventDefault(), K = (re, ie, me, pe, Ie) => y("button", { class: "fmt " + pe + (j[re] ? " on" : ""), type: "button", "aria-pressed": String(!!j[re]), "aria-label": ie, title: `${ie} (Ctrl+${Ie})`, text: me, onmousedown: F, onclick: () => W({ [re]: !j[re] }) }), se = y("div", { class: "fmt-group", role: "group", "aria-label": "Text style" }, K("bold", "Bold", "B", "b", "B"), K("italic", "Italic", "I", "i", "I"), K("underline", "Underline", "U", "u", "U"), K("strike", "Strikethrough", "S", "s", "Shift+X")), te = [E("Font", I), E("Size", y("span", { class: "withunit" }, R, y("span", { class: "unit", text: "pt" }))), se];
    if (!g || g.kind !== "object") {
      const re = g ? g.align : e.settings.textAlign, ie = (Me, Ye, Je) => y("button", { class: "fmt" + (re === Me ? " on" : ""), type: "button", "aria-pressed": String(re === Me), "aria-label": Ye, title: Ye, onmousedown: F, onclick: () => N(Me) }, Ve(Je));
      if (g) {
        const Me = g.list || null, Ye = (Je, Vt, En) => y("button", { class: "fmt" + (Me === Je ? " on" : ""), type: "button", "aria-pressed": String(Me === Je), "aria-label": Vt, title: Vt, onmousedown: F, onclick: () => o.toggleList(Je) }, Ve(En));
        te.push(y("div", { class: "fmt-group", role: "group", "aria-label": "Lists" }, Ye("b", "Bulleted list", "listb"), Ye("n", "Numbered list", "listn")));
      }
      te.push(y("div", { class: "fmt-group", role: "group", "aria-label": "Alignment" }, ie("left", "Align left", "alignl"), ie("center", "Center", "alignc"), ie("right", "Align right", "alignr"), ie("justify", "Justify (wrapped text)", "alignj")));
      const me = g ? g.lh : e.settings.textLh, pe = [1, 1.15, 1.5, 2, 2.5];
      pe.some((Me) => Math.abs(Me - me) < 0.01) || (pe.push(+me.toFixed(2)), pe.sort((Me, Ye) => Me - Ye));
      const Ie = y("select", { class: "rselect narrow", id: "line-height", "aria-label": "Line spacing" }, ...pe.map((Me) => y("option", { value: String(Me), text: String(Me), selected: Math.abs(Me - me) < 0.01 })));
      Ie.addEventListener("change", () => {
        const Me = +Ie.value;
        o.editor ? o.setEditorStyle({ lh: Me }) : (e.settings.textLh = Me, e.saveSettings());
      }), te.push(E("Spacing", Ie));
    }
    return te.push(L), te;
  }
  function z(g, S) {
    const I = y("select", { class: "rselect", "aria-label": "Font" });
    for (const j of ["Standard", "Thai + Latin", "Latin"]) I.append(y("optgroup", { label: j }, ...sn.filter((F) => F.group === j).map((F) => y("option", { value: F.key, text: F.label, selected: F.key === g.textFont }))));
    I.addEventListener("change", () => S({ textFont: I.value }));
    const R = y("input", { class: "rnum", type: "number", min: "4", max: "96", step: "0.5", value: String(g.ftSize), "aria-label": "Font size in points" });
    R.addEventListener("change", () => S({ ftSize: Math.max(4, Math.min(96, +R.value || 12)) }));
    const L = (j, F, K, se) => y("div", { class: "swatches", role: "radiogroup", "aria-label": se }, ...j.map((te) => {
      const re = te === null ? F === null : !!F && Gn(te, F);
      return y("button", { class: "sw" + (re ? " on" : "") + (te ? "" : " none"), type: "button", role: "radio", "aria-checked": String(re), title: te ? `rgb ${te.slice(0, 3).join(" ")}` : "None", "aria-label": te ? `rgb ${te.slice(0, 3).join(" ")}` : "None", style: te ? { background: `rgb(${te[0]},${te[1]},${te[2]})` } : {}, onclick: () => K(te) });
    }));
    return [I, y("span", { class: "withunit" }, R, y("span", { class: "unit", text: "pt" })), E("Text", L(lt.pen, g.ftColor, (j) => S({ ftColor: j }), "Text color")), E("Fill", L([null, [255, 255, 255, 255], [255, 249, 196, 255], [219, 234, 254, 255], [252, 231, 243, 255]], g.ftFill, (j) => S({ ftFill: j }), "Fill")), E("Border", L([null, ...lt.pen], g.ftBorder, (j) => S({ ftBorder: j }), "Border"))];
  }
  async function O() {
    const g = e.doc.redactMarks(), S = g.reduce((L, j) => L + j.rects.length, 0);
    if (!S || await nt({ title: `Apply ${S} redaction${S === 1 ? "" : "s"}?`, body: y("div", { class: "stack" }, y("p", { class: "modal-text", text: `Text, images and drawings under the marks on ${g.length} page${g.length === 1 ? "" : "s"} are removed from the file, along with comments and form fields that sit mostly inside them.` }), y("p", { class: "modal-text", text: "Undo works until you close this file, but a saved copy can’t be un-redacted." })), actions: [{ id: "cancel", label: "Cancel" }, { id: "go", label: "Redact", danger: true }] }) !== "go") return;
    let R = 0;
    await e.mutate("Apply redactions", { pages: "all" }, () => {
      R = e.doc.applyRedactions(e.settings.redactFill), e.mustRewrite = true;
    }).catch((L) => H(L.message, "err")), R && H(`Redacted ${S} area${S === 1 ? "" : "s"} on ${R} page${R === 1 ? "" : "s"}`);
  }
  function W(g) {
    o.editor ? o.setEditorStyle({ style: g }) : (e.settings.textStyle = Mr({ ...Gr(e.settings.textStyle), ...g }), e.saveSettings()), V();
  }
  function N(g) {
    o.editor ? o.setEditorStyle({ align: g }) : (e.settings.textAlign = g, e.saveSettings()), V();
  }
  function V() {
    const g = e.tool, S = e.settings, I = Jr[g], R = [y("span", { class: "rtool", text: I.label })];
    if (g === "select") {
      const L = e.selectedAnnot;
      if (L) {
        const j = e.doc.annots(L.page).find((F) => F.index === L.index);
        if (j) {
          if (j.subtype === 3 && j.ft) {
            const F = e.doc.readFreeText(L.page, L.index), K = { ftSize: F.style.size, ftColor: F.style.color, ftFill: F.style.fill, ftBorder: F.style.border, textFont: F.style.fontKey };
            R.push(...z(K, (se) => i.update(L.page, L.index, (te) => ({ ...te, style: { ...te.style, ...se.ftSize ? { size: se.ftSize } : {}, ...se.ftColor ? { color: se.ftColor } : {}, ..."ftFill" in se ? { fill: se.ftFill } : {}, ..."ftBorder" in se ? { border: se.ftBorder } : {}, ...se.textFont ? { fontKey: se.textFont } : {} } }), "Restyle text box")));
          } else if (j.subtype === Q.SQUARE || j.subtype === Q.CIRCLE) {
            const F = e.doc.annotStyle(L.page, L.index) || { width: 1, dashed: false, fill: null, opacity: 1 }, K = (te, re) => e.mutate(re, { pages: [L.page] }, te).catch((ie) => H(ie.message, "err")), se = (te, re) => K(() => e.doc.setAnnotStyle(L.page, L.index, te), re);
            R.push(E("Outline", Cp(lt.pen, j.color, (te) => !te && !F.fill ? H("A shape needs an outline or a fill", "warn") : K(() => e.doc.setAnnotColor(L.page, L.index, te), te ? "Outline colour" : "Remove outline"), "Outline colour", true)), E("Fill", Cp(SFILLS, F.fill, (te) => !te && !j.color ? H("A shape needs an outline or a fill", "warn") : se({ fill: te }, te ? "Fill shape" : "Remove fill"), "Fill colour", true)), y("div", { class: "chips", role: "radiogroup", "aria-label": "Outline width" }, ...[1, 2, 4, 8].map((te) => {
              const re = Math.abs(F.width - te) < 0.26;
              return y("button", { class: "chip" + (re ? " on" : ""), type: "button", role: "radio", "aria-checked": String(re), title: `${te} pt`, onclick: () => se({ width: te }, "Outline width") }, y("span", { class: "wline", style: { height: Math.min(te, 6) + "px" } }), y("span", { class: "num", text: `${te}` }));
            }), y("button", { class: "chip" + (F.dashed ? " on" : ""), type: "button", "aria-pressed": String(F.dashed), title: "Dashed outline", onclick: () => se({ dashed: !F.dashed }, F.dashed ? "Solid outline" : "Dashed outline") }, "Dashed")), Op(F.opacity, (te) => se({ opacity: te }, "Opacity")));
          } else if (j.subtype !== 13 && j.color) {
            R.push(Cp(j.subtype === 9 || j.subtype === 1 ? lt.highlight : lt.pen, j.color, (F) => e.mutate("Change color", { pages: [L.page] }, () => e.doc.setAnnotColor(L.page, L.index, F)).catch((K) => H(K.message, "err")), "Annotation color"));
            if (j.subtype === Q.LINE || j.subtype === Q.INK || j.subtype >= 9 && j.subtype <= 12) {
              const F = e.doc.annotStyle(L.page, L.index);
              F && R.push(Op(F.opacity, (K) => e.mutate("Opacity", { pages: [L.page] }, () => e.doc.setAnnotStyle(L.page, L.index, { opacity: K })).catch((se) => H(se.message, "err"))));
            }
          }
          R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => Lt() }, Ve("trash"), "Delete")), R.push(y("span", { class: "hint", text: j.subtype >= 9 && j.subtype <= 12 ? "Text markup stays attached to its text." : j.subtype === 3 ? "Drag to move. Double-click to edit the text." : "Drag to move. Double-click to comment." }));
        }
      } else R.push(y("span", { class: "hint", text: I.hint }));
    } else if (g === "arrange") {
      const L = a.sel, j = a.current();
      if (a.cropping) R.push(y("button", { class: "btn primary small", type: "button", title: "Enter", onclick: () => a.applyCrop(ia) }, Ve("crop"), "Apply crop"), y("button", { class: "btn ghost small", type: "button", title: "Esc", onclick: () => a.cancelCrop() }, "Cancel"), y("span", { class: "hint", text: "Drag the edges to choose what to keep. Cropping trims the picture itself, so the cut part leaves the file." }));
      else if (L) {
        const F = (se, te, re, ie = false) => y("button", { class: "iconbtn", type: "button", title: se, "aria-label": se, disabled: ie, onclick: re }, Ve(te)), K = a.selected().length;
        R.push(y("div", { class: "fmt-group", role: "group", "aria-label": K > 1 ? "Align" : "Align to page" }, F(K > 1 ? "Align left edges" : "Align to the page’s left edge", "al-left", () => a.align("left")), F(K > 1 ? "Align centres" : "Centre on the page", "al-hcenter", () => a.align("hcenter")), F(K > 1 ? "Align right edges" : "Align to the page’s right edge", "al-right", () => a.align("right")), F(K > 1 ? "Align tops" : "Align to the page’s top", "al-top", () => a.align("top")), F(K > 1 ? "Align middles" : "Centre on the page vertically", "al-vmiddle", () => a.align("vmiddle")), F(K > 1 ? "Align bottoms" : "Align to the page’s bottom", "al-bottom", () => a.align("bottom"))), y("div", { class: "fmt-group", role: "group", "aria-label": "Distribute and match size" }, F("Distribute across (3 or more)", "dist-h", () => a.distribute("h"), K < 3), F("Distribute down (3 or more)", "dist-v", () => a.distribute("v"), K < 3), F("Match width of the last clicked", "match-w", () => a.matchSize("w"), K < 2), F("Match height of the last clicked", "match-h", () => a.matchSize("h"), K < 2), F("Match size of the last clicked", "match-both", () => a.matchSize("both"), K < 2)), y("div", { class: "fmt-group", role: "group", "aria-label": "Order" }, F("Bring to front (Ctrl+Shift+])", "z-front", () => a.restack("front")), F("Bring forward (Ctrl+])", "z-forward", () => a.restack("forward")), F("Send backward (Ctrl+[)", "z-backward", () => a.restack("backward")), F("Send to back (Ctrl+Shift+[)", "z-back", () => a.restack("back")))), j?.kind === "image" && (R.push(y("div", { class: "fmt-group", role: "group", "aria-label": "Image" }, F("Rotate left", "rotl", () => a.turn("rotl")), F("Rotate right", "rotr", () => a.turn("rotr")), F("Flip horizontally", "fliph", () => a.turn("fliph")), F("Flip vertically", "flipv", () => a.turn("flipv")))), j.label === "Image" && R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => a.startCrop() }, Ve("crop"), "Crop"), y("button", { class: "btn ghost small", type: "button", onclick: () => xt() }, Ve("image"), "Replace"))), R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => a.remove() }, Ve("trash"), K > 1 ? `Delete ${K}` : "Delete")), K === 1 && j?.kind !== "image" && R.push(y("span", { class: "hint", text: "Shift-click or drag a box to select more. Arrows nudge 1 pt (Shift: 10)." }));
      } else R.push(y("span", { class: "hint", text: I.hint }));
    } else if (g === "highlight") R.push(k(lt.highlight, S.markupColor, (L) => S.markupColor = L, "Highlight color"), y("span", { class: "hint", text: I.hint }));
    else if (g === "underline" || g === "strike") R.push(k(lt.pen, S.lineMarkupColor, (L) => S.lineMarkupColor = L, "Line color"), y("span", { class: "hint", text: I.hint }));
    else if (g === "draw") R.push(k(lt.pen, S.inkColor, (L) => S.inkColor = L, "Pen color"), G(S.inkWidth, (L) => S.inkWidth = L));
    else if (g === "stamp") {
      const L = y("select", { class: "rselect", "aria-label": "Stamp" }, y("optgroup", { label: "English" }, ...Rn.filter((K) => !K.key.startsWith("th-")).map((K) => y("option", { value: K.key, text: K.label, selected: S.stamp === K.key }))), y("optgroup", { label: "ไทย" }, ...Rn.filter((K) => K.key.startsWith("th-")).map((K) => y("option", { value: K.key, text: K.label, selected: S.stamp === K.key }))), y("option", { value: "custom", text: "Custom…", selected: S.stamp === "custom" }));
      L.addEventListener("change", () => {
        S.stamp = L.value, e.saveSettings(), V();
      });
      const j = S.stamp === "custom" ? { label: S.stampCustom || "CUSTOM", color: S.stampColor } : Rn.find((K) => K.key === S.stamp) || Rn[0];
      if (R.push(L, y("span", { class: "stamp-chip", style: { color: `rgb(${j.color[0]},${j.color[1]},${j.color[2]})` }, text: j.label })), S.stamp === "custom") {
        const K = y("input", { class: "tinput narrow", id: "stamp-text", value: S.stampCustom, placeholder: "Stamp text", "aria-label": "Custom stamp text" });
        K.addEventListener("input", () => {
          S.stampCustom = K.value, e.saveSettings();
        }), R.push(K, k([[196, 40, 40, 255], [37, 99, 235, 255], [22, 140, 82, 255], [124, 77, 219, 255], [24, 26, 33, 255]], S.stampColor, (se) => S.stampColor = se, "Stamp color"));
      }
      const F = y("input", { type: "checkbox", checked: S.stampDated });
      if (F.addEventListener("change", () => {
        S.stampDated = F.checked, e.saveSettings(), V();
      }), R.push(y("label", { class: "hf-check" }, F, "Name & date")), S.stampDated) {
        const K = y("input", { class: "tinput narrow", value: S.author, "aria-label": "Your name", placeholder: "Your name" });
        K.addEventListener("change", () => {
          S.author = K.value.trim() || "Me", e.saveSettings();
        }), R.push(K);
      }
      R.push(y("span", { class: "hint", text: I.hint }));
    } else if (g === "form") R.push(y("div", { class: "chips", role: "radiogroup", "aria-label": "Field type" }, ...kr.map((L) => y("button", { class: "chip" + (S.formKind === L.kind ? " on" : ""), type: "button", role: "radio", "aria-checked": String(S.formKind === L.kind), onclick: () => {
      S.formKind = L.kind, e.saveSettings(), V();
    } }, L.label))), y("span", { class: "hint", text: I.hint }));
    else if (g === "redact") {
      const j = e.doc.redactMarks().reduce((te, re) => te + re.rects.length, 0), F = (te, re) => y("button", { class: "chip" + (S.redactMode === te ? " on" : ""), type: "button", role: "radio", "aria-checked": String(S.redactMode === te), onclick: () => {
        S.redactMode = te, e.saveSettings(), V();
      } }, re);
      R.push(y("div", { class: "chips", role: "radiogroup", "aria-label": "Mark" }, F("text", "Text"), F("area", "Area")));
      const K = y("input", { class: "tinput narrow", placeholder: "Mark every…", "aria-label": "Mark every match of this text", id: "redact-find" }), se = async () => {
        const te = K.value.trim();
        if (!te) return;
        const re = e.doc.search(te);
        if (!re.length) return H(`No matches for “${te}”`, "warn");
        const ie = /* @__PURE__ */ new Map();
        for (const me of re) ie.set(me.page, [...ie.get(me.page) || [], ...me.rects]);
        await e.mutate(`Mark “${te}” for redaction`, { pages: [...ie.keys()] }, () => {
          for (const [me, pe] of ie) e.doc.addRedactMark(me, pe, S.author);
        }).catch((me) => H(me.message, "err")), H(`Marked ${re.length} match${re.length === 1 ? "" : "es"}`);
      };
      K.addEventListener("keydown", (te) => {
        te.stopPropagation(), te.key === "Enter" && se();
      }), R.push(K, y("button", { class: "btn ghost small", type: "button", onclick: se }, "Mark all")), R.push(E("Cover", y("div", { class: "swatches", role: "radiogroup", "aria-label": "Cover colour" }, ...[[0, 0, 0, 255], [255, 255, 255, 255], null].map((te) => {
        const re = te === null ? S.redactFill === null : !!S.redactFill && Gn(te, S.redactFill);
        return y("button", { class: "sw" + (re ? " on" : "") + (te ? "" : " none"), type: "button", role: "radio", "aria-checked": String(re), title: te ? te[0] ? "White" : "Black" : "No cover (leave the area blank)", "aria-label": te ? te[0] ? "White" : "Black" : "None", style: te ? { background: `rgb(${te[0]},${te[1]},${te[2]})` } : {}, onclick: () => {
          S.redactFill = te, e.saveSettings(), V();
        } });
      })))), j ? R.push(y("button", { class: "btn danger small", type: "button", onclick: () => O() }, `Apply ${j} mark${j === 1 ? "" : "s"}`), y("button", { class: "btn ghost small", type: "button", onclick: () => e.mutate("Clear redaction marks", { pages: "all" }, () => e.doc.clearRedactMarks()) }, "Clear")) : R.push(y("span", { class: "hint", text: I.hint }));
    } else if (g === "textbox") {
      const L = (j, F) => y("button", { class: "chip" + (S.ftCallout === j ? " on" : ""), type: "button", role: "radio", "aria-checked": String(S.ftCallout === j), onclick: () => {
        S.ftCallout = j, e.saveSettings(), V();
      } }, F);
      R.push(y("div", { class: "chips", role: "radiogroup", "aria-label": "Kind" }, L(false, "Text box"), L(true, "Callout")), ...z(S, (j) => {
        Object.assign(S, j), e.saveSettings(), V();
      }), y("span", { class: "hint", text: i.open ? "Ctrl+Enter or click outside to finish · Esc to cancel" : S.ftCallout ? "Press on the target, drag to place the box, type." : I.hint }));
    } else if (g === "line") {
      const L = (j, F, K) => y("button", { class: "chip" + (S.lineEnds === j ? " on" : ""), type: "button", role: "radio", "aria-checked": String(S.lineEnds === j), onclick: () => {
        S.lineEnds = j, e.saveSettings(), V();
      } }, y("span", { class: "num", text: K }), F);
      R.push(y("div", { class: "chips", role: "radiogroup", "aria-label": "Line ends" }, L("none", "Line", "—"), L("arrow", "Arrow", "→"), L("double", "Double", "↔")), k(lt.pen, S.lineColor, (j) => S.lineColor = j, "Line color"), G(S.lineWidth, (j) => S.lineWidth = j), y("span", { class: "hint", text: I.hint }));
    } else if (g === "rect" || g === "ellipse") {
      const L = (j) => (j(), e.saveSettings(), V());
      R.push(E("Outline", Cp(lt.pen, S.shapeColor, (j) => L(() => S.shapeColor = j), "Outline colour", true)), E("Fill", Cp(SFILLS, S.shapeFill, (j) => L(() => S.shapeFill = j), "Fill colour", true)), G(S.shapeWidth, (j) => S.shapeWidth = j), Op(S.shapeOpacity ?? 1, (j) => L(() => S.shapeOpacity = j)));
    }
    else if (g === "note") R.push(k(lt.highlight, S.noteColor, (L) => S.noteColor = L, "Note color"), y("span", { class: "hint", text: I.hint }));
    else if (g === "addtext") R.push(...B(), y("span", { class: "hint", text: o.editor ? "Select words to style them · Ctrl+Enter or click outside to finish" : "Click to type, or drag across to set a width the text wraps to." }));
    else if (g === "edittext") o.editor ? R.push(...B(), y("span", { class: "hint", text: o.editor.kind === "object" ? "Enter to save · Shift+Enter adds a line · Esc cancels" : "Select words to style them · Ctrl+Enter or click outside to save · Esc cancels" })) : R.push(y("span", { class: "hint", text: I.hint }));
    else if (g === "crop") {
      const L = s.sel, j = l(), F = [...Array(e.doc.pageCount).keys()];
      if (L) R.push(y("button", { class: "btn primary small", type: "button", title: "Enter", onclick: () => s.apply([L.page]) }, Ve("crop"), `Crop page ${L.page + 1}`)), j && R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => s.apply(j) }, `Crop ${j.length} selected pages`)), e.doc.pageCount > 1 && R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => s.apply(F) }, "Crop all pages")), R.push(y("button", { class: "btn ghost small", type: "button", title: "Esc", onclick: () => {
        s.sel = null, s.refresh(), V();
      } }, "Cancel")), R.push(y("span", { class: "hint", text: "Drag the edges to adjust. Other pages lose the same margins." }));
      else {
        R.push(y("span", { class: "hint", text: I.hint }));
        const K = e.currentPage;
        s.isCropped(K) && R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => s.reset([K]) }, `Uncrop page ${K + 1}`)), e.doc.pageCount > 1 && F.some((se) => se !== K && s.isCropped(se)) && R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => s.reset(F) }, "Uncrop all pages"));
      }
    } else if (g === "image") {
      const L = o.image;
      L && R.push(y("span", { class: "img-pick" }, y("img", { src: L.url, alt: "" }), y("span", { class: "mono", text: `${L.w}×${L.h}` }))), R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => o.chooseImage() }, Ve("image"), L ? "Choose another" : "Choose image")), R.push(y("span", { class: "hint", text: L ? I.hint : "Choose an image to place." }));
    } else g === "sign" && (o.saved.length && R.push(y("div", { class: "sig-strip", role: "radiogroup", "aria-label": "Signature to place" }, ...o.saved.map((L, j) => y("button", { class: "sig-pick" + (j === o.activeSig ? " on" : ""), type: "button", role: "radio", "aria-checked": String(j === o.activeSig), "aria-label": `Signature ${j + 1}`, onclick: () => o.chooseSaved(j) }, y("img", { src: L.url, alt: "" }))))), R.push(y("button", { class: "btn ghost small", type: "button", onclick: async () => {
      await o.captureSignature(), V();
    } }, Ve("plus"), o.saved.length ? "New signature" : "Draw signature")), o.signature && R.push(y("button", { class: "btn ghost small", type: "button", title: "Remove the selected signature from this browser", onclick: () => o.removeSaved(o.activeSig) }, Ve("trash"), "Remove")), R.push(y("span", { class: "hint", text: o.signature ? I.hint : "Draw a signature to start." })));
    R.length === 1 && R.push(y("span", { class: "hint", text: I.hint })), w.replaceChildren(...R);
  }
  const q = y("input", { type: "file", accept: "application/pdf,.pdf", hidden: true, id: "file-open" }), Y = y("input", { type: "file", accept: "application/pdf,.pdf", multiple: true, hidden: true, id: "file-merge" }), ne = y("input", { type: "file", accept: "application/pdf,.pdf", hidden: true, id: "file-replace" });
  ne.addEventListener("change", () => {
    const g = ne.files?.[0];
    ne.value = "", g && It(g);
  }), document.body.append(q, Y, ne), _e("#btn-open").addEventListener("click", () => q.click()), _e("#btn-merge").addEventListener("click", () => Y.click()), _e("#btn-version").textContent = "v" + Xn, _e("#btn-version").addEventListener("click", () => nt({ title: `Margin ${Xn}`, body: y("div", { class: "changelog" }, ...Pu.map((g) => y("section", {}, y("h3", {}, y("span", { class: "mono", text: "v" + g.version }), g.version === Xn ? y("span", { class: "dirty", text: "Current" }) : null), y("ul", {}, ...g.notes.map((S) => y("li", { text: S })))))), actions: [{ id: "ok", label: "Close", primary: true }] })), _e("#btn-flatten").addEventListener("click", async () => {
    o.editor && o.commitEditor();
    const g = e.doc.flattenCounts();
    if (!g.annots && !g.fields) return H("Nothing to flatten: this document has no comments, markup or form fields", "warn", 4e3);
    const S = y("input", { type: "checkbox", id: "fl-annots", checked: g.annots > 0, disabled: g.annots === 0 }), I = y("input", { type: "checkbox", id: "fl-fields", checked: g.fields > 0, disabled: g.fields === 0 }), R = y("div", { class: "stack" }, y("p", { class: "modal-text", text: "Flattening draws these into the page itself. They will look the same everywhere but can no longer be edited, moved or filled in. Links stay clickable." }), y("label", { class: "hf-check" }, S, `Comments, markup, shapes, stamps and text boxes (${g.annots})`), y("label", { class: "hf-check" }, I, `Form fields, with what is filled in now (${g.fields})`));
    if (await nt({ title: "Flatten", body: R, actions: [{ id: "cancel", label: "Cancel" }, { id: "go", label: "Flatten", primary: true }] }) !== "go") return;
    const j = { annots: S.checked, fields: I.checked };
    if (!j.annots && !j.fields) return;
    let F = { done: 0, failed: 0 };
    await e.mutate("Flatten", { pages: "all" }, () => {
      F = e.doc.flatten(j);
    }).catch((K) => H(K.message, "err")), H(F.failed ? `Flattened ${F.done}; ${F.failed} couldn’t be flattened and were left as they are` : `Flattened ${F.done} item${F.done === 1 ? "" : "s"}. Undo is available until you close the file.`, F.failed ? "warn" : "ok", 4500);
  });
  const J = new Lr(e, r), ee = () => {
    o.editor && o.commitEditor(), Tc(e, Ne);
  };
  _e("#btn-more").addEventListener("click", () => {
    const g = _e("#btn-more").getBoundingClientRect(), S = (I) => () => _e("#" + I).click();
    pn(g.right - 240, g.bottom + 6, [{ label: "Print…", shortcut: "Ctrl+P", run: S("btn-print") }, { label: "Export pages as images…", run: ee }, { label: "Compress…", run: () => {
      o.editor && o.commitEditor(), Oc(e, yr);
    } }, { label: "Check spelling…", shortcut: "F7", run: () => {
      o.editor && o.commitEditor(), J.open();
    } }, "sep", { label: "Password protection…", run: S("btn-protect") }, { label: "Watermark & background…", run: S("btn-wm") }, { label: "Header & footer…", run: S("btn-hf") }, { label: "Flatten…", run: S("btn-flatten") }, "sep", { label: "Insert pages from PDF…", run: () => Y.click() }, { label: "Replace pages…", run: () => ne.click() }, { label: "Extract or split pages…", run: () => ve("extract") }], _e("#btn-more"));
  }), _e("#btn-print").addEventListener("click", () => {
    o.editor && o.commitEditor(), Fa(e);
  }), _e("#btn-protect").addEventListener("click", () => {
    o.editor && o.commitEditor(), Sc(e);
  }), _e("#btn-wm").addEventListener("click", () => {
    o.editor && o.commitEditor(), jl(e, { ...ds, ...e.settings.wm || {} }, (g) => {
      e.settings.wm = g, e.saveSettings();
    });
  }), _e("#btn-hf").addEventListener("click", () => {
    o.editor && o.commitEditor(), Gl(e, { ...e.settings.hf, images: e.settings.hf.images || {}, imageHeight: e.settings.hf.imageHeight || 24 }, (g) => {
      e.settings.hf = g, e.saveSettings();
    });
  }), q.addEventListener("change", () => {
    const g = q.files?.[0];
    g && Ke(g), q.value = "";
  });
  let ae = null;
  Y.addEventListener("change", async () => {
    const g = [...Y.files || []];
    Y.value = "";
    const S = ae;
    ae = null, g.length && Le(g, S ?? void 0);
  }), _e("#btn-undo").addEventListener("click", () => Ae()), _e("#btn-redo").addEventListener("click", () => kn()), _e("#btn-save").addEventListener("click", () => Re()), _e("#btn-zoomin").addEventListener("click", () => r.setZoom(r.zoom * 1.2)), _e("#btn-zoomout").addEventListener("click", () => r.setZoom(r.zoom / 1.2)), _e("#btn-fit").addEventListener("click", () => {
    r.fit = "width", r.applyFit();
  }), _e("#btn-pages").addEventListener("click", () => document.body.classList.toggle("show-thumbs")), _e("#btn-comments").addEventListener("click", () => document.body.classList.toggle("show-comments"));
  const de = _e("#search-input");
  let oe = [], fe = -1;
  const we = () => {
    if (_e("#search-count").textContent = oe.length ? `${fe + 1} of ${oe.length}` : de.value ? "No matches" : "", r.setHits(oe, fe), fe >= 0) {
      const g = oe[fe];
      r.scrollToPage(g.page, g.rects[0]);
    }
  }, ce = () => {
    oe = e.doc.search(de.value.trim()), fe = oe.length ? 0 : -1, we();
  };
  de.addEventListener("keydown", (g) => {
    g.stopPropagation(), g.key === "Enter" && (!oe.length || de.dataset.last !== de.value ? (de.dataset.last = de.value, ce()) : (fe = (fe + (g.shiftKey ? -1 : 1) + oe.length) % oe.length, we())), g.key === "Escape" && (de.value = "", oe = [], fe = -1, we(), de.blur());
  }), _e("#search-next").addEventListener("click", () => {
    if (!oe.length) return ce();
    fe = (fe + 1) % oe.length, we();
  });
  const Ge = _e("#replace-panel"), ge = _e("#replace-input"), $e = _e("#rp-status"), Ce = () => ({ matchCase: _e("#rp-case").checked, wholeWord: _e("#rp-word").checked }), Ee = (g = Ge.hidden) => {
    Ge.hidden = !g, _e("#btn-replace").setAttribute("aria-expanded", String(g)), g && (de.value ? ge : de).focus();
  };
  _e("#btn-replace").addEventListener("click", () => Ee()), Ge.addEventListener("keydown", (g) => {
    g.stopPropagation(), g.key === "Escape" && Ee(false), g.key === "Enter" && g.target === ge && _e("#rp-one").click();
  }), _e("#rp-one").addEventListener("click", async () => {
    const g = de.value.trim();
    if (!g) {
      de.focus();
      return;
    }
    if (!oe.length || de.dataset.last !== de.value) {
      if (de.dataset.last = de.value, ce(), !oe.length) {
        $e.textContent = "No matches";
        return;
      }
      return;
    }
    const S = oe[fe];
    if (S) try {
      const I = await Cs(e, S.page, S.rects[0], g, ge.value, Ce());
      ce();
      const R = oe.findIndex((L) => L.page > S.page || L.page === S.page && L.rects[0].t <= S.rects[0].t + 1);
      oe.length && (fe = Math.max(0, R), we()), $e.textContent = I ? `Replaced 1 · ${oe.length} left` : "That match spans lines or differs in case; skipped", !I && oe.length && (fe = (oe.indexOf(S) + 1) % oe.length, we());
    } catch (I) {
      H(I.message, "err");
    }
  }), _e("#rp-all").addEventListener("click", async () => {
    const g = de.value.trim();
    if (!g) {
      de.focus();
      return;
    }
    try {
      const S = await nu(e, g, ge.value, Ce());
      ce();
      const I = tu(e, g, Ce());
      $e.textContent = `Replaced ${S.count} on ${S.pages} page${S.pages === 1 ? "" : "s"}${I ? ` · ${I} couldn’t be replaced` : ""}`, H(`Replaced ${S.count} match${S.count === 1 ? "" : "es"}`);
    } catch (S) {
      $e.textContent = S.message;
    }
  }), _e("#search-prev").addEventListener("click", () => {
    oe.length && (fe = (fe - 1 + oe.length) % oe.length, we());
  });
  const Oe = () => {
    _e("#file-name").textContent = e.fileName, _e("#file-name").title = e.fileName, _e("#dirty").hidden = !e.dirty;
    const g = _e("#btn-undo"), S = _e("#btn-redo");
    g.disabled = !e.canUndo, S.disabled = !e.canRedo, g.title = e.canUndo ? `Undo ${e.undoLabel}` : "Nothing to undo", S.title = e.canRedo ? `Redo ${e.redoLabel}` : "Nothing to redo", _e("#page-count").textContent = String(e.doc.pageCount), _e("#page-indicator").textContent = `${e.currentPage + 1} / ${e.doc.pageCount}`;
    const I = e.doc.security(), R = _e("#btn-protect");
    R.classList.toggle("on", I.encrypted), R.classList.toggle("limited", e.limits.locked), R.title = I.encrypted ? e.limits.locked ? "Protected: changes are limited. Click to unlock" : "Password protected (AES-256)" : "Password protection";
  };
  r.onZoom = (g) => {
    _e("#zoom-level").textContent = Math.round(g * 100) + "%";
  }, r.onPage = (g) => {
    h.follow(g), e.tool === "crop" && !s.sel && V(), _e("#page-indicator").textContent = `${g + 1} / ${e.doc.pageCount}`;
  }, h.onGo = (g) => r.scrollToPage(g), h.onSelection = () => {
  }, h.onInsertBlank = (g) => {
    const S = Math.max(0, Math.min(e.doc.pageCount - 1, g > 0 ? g - 1 : 0)), { w: I, h: R } = e.doc.pageSize(S);
    e.mutate("Insert blank page", { pages: "all", structure: true }, () => e.doc.insertBlank(g, I, R)).then(() => {
      e.selectedPages = /* @__PURE__ */ new Set([g]), h.mark(), r.scrollToPage(g), H(`Inserted a blank page as page ${g + 1}`);
    }).catch((L) => H(L.message, "err"));
  }, h.onInsertFrom = (g, S) => {
    S ? Le(S, g) : (ae = g, Y.click());
  }, h.onMove = (g, S) => e.mutate(g.length > 1 ? "Move pages" : "Move page", { pages: "all", structure: true }, () => {
    if (!e.doc.movePages(g, S)) throw new Error("Those pages could not be moved");
    e.selectedPages = new Set(g.map((I, R) => S + R));
  }).catch((I) => H(I.message, "err")), m.onGo = (g, S) => {
    e.setTool("select"), e.selectedAnnot = { page: g, index: S.index }, o.refreshOverlays(), r.scrollToPage(g, S.rect), m.markSelected(), V();
  }, o.onSelect = () => {
    m.markSelected(), V();
  }, o.onEditor = () => V(), m.onEditFreeText = (g, S, I) => {
    i.update(g, S, (R) => ({ ...R, text: I }), "Edit text box");
  }, o.onImage = () => {
    e.tool === "image" && V();
  }, o.onSignatures = () => {
    e.tool === "sign" && V();
  }, o.onFormatKey = (g) => {
    const S = o.editor;
    if (!S) return;
    const R = { b: "bold", i: "italic", u: "underline", x: "strike" }[g];
    R && W({ [R]: !S.style[R] });
  }, o.onNoteCreated = (g, S) => {
    document.body.classList.add("show-comments"), m.refresh(), m.focus(g, S);
  }, e.on((g) => {
    g.structure ? (r.rebuild(), h.rebuild()) : (r.invalidate(g.pages), h.invalidate(g.pages)), r.hits.length && (r.setHits([], -1), oe = [], fe = -1, _e("#search-count").textContent = ""), m.refresh(g), Oe(), V();
  }), e.onTool((g) => {
    ra(".tool").forEach((S) => {
      S.classList.toggle("on", S.dataset.tool === g), S.setAttribute("aria-pressed", String(S.dataset.tool === g));
    }), document.body.dataset.tool = g, o.editor && o.commitEditor(), i.open && i.open.done(true), o.refreshOverlays(), m.markSelected(), V(), (g === "addtext" || g === "edittext") && $t(ze(e.settings.textFont)).catch(() => {
    }), g !== "image" && o.image && o.setImage(null), g === "image" && (o.setImage(null), o.chooseImage().then((S) => {
      !S && e.tool === "image" && !o.image && e.setTool("select");
    })), g === "sign" && o.chooseSignature().then((S) => {
      !S && e.tool === "sign" ? e.setTool("select") : V();
    });
  });
  async function Ke(g) {
    if (e.dirty && !await ot()) return;
    let S;
    try {
      S = await Yt.fromFile(g);
    } catch (I) {
      H(`${g.name}: ${I.message || "could not be read"}`, "err", 6e3);
      return;
    }
    await dt(S, g.name);
  }
  async function Xe(g, S, I = "open") {
    const R = y("input", { class: "tinput", type: "password", id: "pdf-password", autocomplete: "off", "aria-label": "Password" });
    return await nt({ title: S ? "That password didn’t work" : "This PDF is password protected", body: y("div", { class: "stack" }, y("p", { class: "modal-text", text: `Enter the password to ${I} ${g}.` }), R), actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: I === "open" ? "Open" : "Continue", primary: true }], onOpen: () => {
      R.focus(), R.addEventListener("keydown", (j) => {
        j.key === "Enter" && _e(".modal .btn.primary").click();
      });
    } }) === "ok" ? R.value : null;
  }
  async function dt(g, S, I = "") {
    try {
      e.open(g, S, I), r.el.scrollTop = 0, h.list.scrollTop = 0, e.limits.locked && H("This PDF limits what can be changed. To edit it, unlock it with its permissions password (the lock button).", "warn", 7e3);
    } catch (R) {
      if (R instanceof rr && R.code === 4) {
        const L = await Xe(S, !!I);
        return L != null ? dt(g, S, L) : void 0;
      }
      H(wo(R) ? `${S} is too large to open in a browser tab.` : `${S}: ${R.message}`, "err", 6e3);
    }
  }
  async function Rt(g, S) {
    const I = new Uint8Array(await g.arrayBuffer());
    let R = "", L = 0;
    for (; ; ) try {
      return t.open(I, R);
    } catch (j) {
      if (!(j instanceof rr && j.code === 4)) throw j;
      const F = await Xe(g.name, L++ > 0, S);
      if (F == null) return null;
      R = F;
    }
  }
  async function It(g) {
    const { locked: S, perms: I } = e.limits;
    if (S && !(I & 8)) return H("This PDF’s permissions don’t allow changes. Unlock it with its permissions password first.", "warn", 5e3);
    let R;
    try {
      R = await Rt(g, "replace pages with");
    } catch (Ze) {
      return H(`${g.name}: ${Ze.message}`, "err", 5e3);
    }
    if (!R) return;
    const L = e.doc.pageCount, j = R.pageCount, F = St(), K = y("input", { class: "tinput", id: "rp-target", value: ln(F), autocomplete: "off" }), se = y("input", { class: "tinput", id: "rp-source", value: j === 1 ? "1" : `1-${Math.min(j, F.length)}`, autocomplete: "off" }), te = y("p", { class: "modal-text", id: "rp-note" }), re = y("div", { class: "stack" }, y("label", { class: "rfield" }, y("span", { class: "rlabel", text: `Replace pages (of ${L})` }), K), y("label", { class: "rfield" }, y("span", { class: "rlabel", text: `with pages from ${g.name} (of ${j})` }), se), te, y("p", { class: "hint", text: "Comments and form fields on the replaced pages go with them. Bookmarks to them now point to the new pages. You can undo this." })), ie = () => {
      const Ze = ir(K.value, L), at = ir(se.value, j);
      if (Ze.some((Ft, mr) => mr && Ft !== Ze[mr - 1] + 1)) throw new Error("Choose a run of pages to replace, like 3-5");
      return { t: Ze, s: at };
    }, me = () => {
      try {
        const { t: Ze, s: at } = ie();
        te.textContent = `${Ze.length} page${Ze.length === 1 ? "" : "s"} out, ${at.length} in: the document will have ${L - Ze.length + at.length} pages.`, te.classList.remove("err");
      } catch (Ze) {
        te.textContent = Ze.message, te.classList.add("err");
      }
    };
    re.addEventListener("input", me), me();
    const pe = await nt({ title: "Replace pages", body: re, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Replace", primary: true }] });
    let Ie;
    try {
      if (pe !== "ok") {
        R.close();
        return;
      }
      Ie = ie();
    } catch (Ze) {
      return R.close(), H(Ze.message, "warn");
    }
    const { t: Me, s: Ye } = Ie, Je = Me[0], Vt = Me[Me.length - 1], En = [], dr = (Ze) => {
      for (const at of Ze) at.page >= Je && at.page <= Vt && En.push({ path: at.path, page: Je + Math.min(at.page - Je, Ye.length - 1), top: at.top }), dr(at.children);
    };
    try {
      dr(e.doc.outline());
    } catch {
    }
    try {
      await e.mutate(Me.length === 1 ? `Replace page ${Je + 1}` : `Replace pages ${Je + 1}-${Vt + 1}`, { pages: "all", structure: true }, async () => {
        const Ze = pa(e.doc);
        if (!e.doc.importIndices(R, Ye, Je)) throw new Error(`${g.name} could not be inserted`);
        const at = xr(R, Ye, e.doc, Je, Ze);
        for (let Ft = Vt + Ye.length; Ft >= Je + Ye.length; Ft--) e.doc.deletePage(Ft);
        for (const Ft of En) try {
          e.doc.retargetBookmark(Ft.path, Ft.page, Ft.top ?? void 0);
        } catch {
        }
        if (at.length) {
          const Ft = await Ar(t, e.doc.save(), at);
          e.replaceDoc(Ft.save()), Ft.close();
        }
      }), H(`Replaced ${Me.length === 1 ? "page " + (Je + 1) : `pages ${Je + 1}–${Vt + 1}`} with ${Ye.length} page${Ye.length === 1 ? "" : "s"} from ${g.name}`), e.selectedPages = new Set(Ye.map((Ze, at) => Je + at)), h.mark(), r.scrollToPage(Je);
    } catch (Ze) {
      H(Ze.message, "err", 5e3);
    } finally {
      R.close();
    }
  }
  async function Le(g, S) {
    const I = S ?? (e.selectedPages.size ? Math.max(...e.selectedPages) + 1 : e.doc.pageCount), R = [];
    try {
      for (const L of g) {
        const j = await Rt(L, "insert pages from");
        if (!j) {
          R.forEach((F) => F.doc.close());
          return;
        }
        R.push({ f: L, doc: j });
      }
    } catch (L) {
      R.forEach((j) => j.doc.close()), H(L.message, "err", 5e3);
      return;
    }
    await Ut(R.map(({ f: L, doc: j }) => ({ name: L.name, doc: j })), I, "Insert pages", g.length === 1 ? g[0].name : g.length + " files");
  }
  async function Ut(g, S, I, R) {
    let L = 0;
    try {
      await e.mutate(I, { pages: "all", structure: true }, async () => {
        let j = S;
        const F = [];
        for (const { name: K, doc: se } of g) try {
          const te = se.pageCount, re = pa(e.doc);
          if (!e.doc.importAll(se, j)) throw new Error(`${K} could not be inserted`);
          F.push(...xr(se, [...Array(te).keys()], e.doc, j, re)), j += te, L += te;
        } finally {
          se.close();
        }
        if (F.length) {
          const K = await Ar(t, e.doc.save(), F);
          e.replaceDoc(K.save()), K.close();
        }
      });
    } catch (j) {
      return g.forEach((F) => F.doc.close()), H(j.message, "err", 5e3), false;
    }
    return H(`Inserted ${L} page${L === 1 ? "" : "s"} from ${R} as page${L === 1 ? "" : "s"} ${S + 1}${L > 1 ? "–" + (S + L) : ""}`), e.selectedPages = new Set(Array.from({ length: L }, (j, F) => S + F)), h.mark(), r.scrollToPage(S), true;
  }
  const St = () => e.selectedPages.size ? [...e.selectedPages].sort((g, S) => g - S) : [e.currentPage];
  function Qe(g) {
    const { locked: S, perms: I } = e.limits;
    if (S && !(I & 16)) return H("This PDF’s permissions don’t allow copying. Unlock it with its permissions password first.", "warn", 5e3), null;
    const R = Math.random().toString(36).slice(2, 10), L = e.fileName, j = g.length, F = cu({ id: R, pages: j, from: L });
    return (async () => {
      let K = t.create();
      try {
        if (!K.importIndices(e.doc, g, 0)) throw new Error("Those pages could not be copied");
        const se = xr(e.doc, g, K, 0, /* @__PURE__ */ new Set());
        if (se.length) {
          const ie = await Ar(t, K.save(), se);
          K.close(), K = ie;
        }
        const te = await ou({ id: R, bytes: K.save(), pages: j, from: L, at: Date.now() }), re = `${j === 1 ? "Page " + (g[0] + 1) : j + " pages"} copied`;
        H(te ? `${re}. Paste with Ctrl+V here or in another Margin window.` : `${re}. Paste with Ctrl+V in this window (this browser won’t let Margin windows share them).`), Ct();
      } catch (se) {
        H(se.message, "err");
      } finally {
        K.close();
      }
    })(), F;
  }
  async function f(g, S) {
    const I = await Pr();
    if (!I) return H("No copied pages yet. Select pages in the sidebar and press Ctrl+C (or Copy).", "warn", 4500);
    if (g && I.id !== g) return H("Those copied pages are no longer available: copy them again.", "warn");
    let R;
    try {
      R = t.open(I.bytes);
    } catch (j) {
      return H(j.message, "err");
    }
    const L = S ?? Math.max(...St()) + 1;
    await Ut([{ name: I.from, doc: R }], L, I.pages === 1 ? "Paste page" : "Paste pages", I.from);
  }
  const Ct = () => Pr().then((g) => {
    const S = document.querySelector('.page-actions [data-act="paste"]');
    S && (S.disabled = !g, S.title = g ? `Paste ${g.pages} copied page${g.pages === 1 ? "" : "s"} from ${g.from} after the selected page` : "Paste copied pages (copy pages first)");
  });
  au(() => Ct()), Ct();
  async function wt(g, S, I, R) {
    e.selectedPages.has(g) || (e.selectedPages = /* @__PURE__ */ new Set([g]), h.mark());
    const L = St(), j = e.doc.pageCount, F = L[0], K = L[L.length - 1], { locked: se, perms: te } = e.limits, re = !se || !!(te & 8), ie = !se || !!(te & 16), me = await Pr(), pe = L.length === 1 ? `Page ${F + 1}` : `${L.length} pages`, Ie = me ? `${me.pages} page${me.pages === 1 ? "" : "s"}` : "";
    pn(S, I, [{ heading: L.length === 1 ? pe : `${pe} (${ln(L)})` }, { label: "Copy", shortcut: "Ctrl+C", disabled: !ie, run: () => ve("copy") }, { label: me ? `Paste ${Ie} after` : "Paste after", shortcut: "Ctrl+V", disabled: !me || !re, run: () => f(null, K + 1) }, { label: me ? `Paste ${Ie} before` : "Paste before", disabled: !me || !re, run: () => f(null, F) }, "sep", { label: "Rotate left", disabled: !re, run: () => ve("rotl") }, { label: "Rotate right", disabled: !re, run: () => ve("rotr") }, { label: "Insert blank page after", disabled: !re, run: () => ve("insert") }, { label: "Insert pages from PDF…", disabled: !re, run: () => {
      ae = K + 1, Y.click();
    } }, { label: L.length === 1 ? "Replace with page from PDF…" : "Replace with pages from PDF…", disabled: !re, run: () => ne.click() }, "sep", { label: "Extract…", disabled: !ie, run: () => ve("extract") }, { label: "Export as images…", disabled: !ie, run: () => ee() }, { label: L.length === 1 ? "Delete page" : `Delete ${L.length} pages`, shortcut: "Del", danger: true, disabled: !re || L.length >= j, run: () => ve("delete") }, ...L.length === 1 ? ["sep", { label: "Go to page", run: () => r.scrollToPage(F) }] : []], R);
  }
  const Dn = { "246,214,74": "Yellow", "134,222,140": "Green", "120,196,246": "Blue", "246,150,198": "Pink", "250,172,92": "Orange", "24,26,33": "Black", "214,69,52": "Red", "37,99,235": "Blue", "22,140,82": "Green", "124,77,219": "Purple" }, jn = [null, [255, 255, 255, 255], [255, 249, 196, 255], [219, 234, 254, 255], [220, 252, 231, 255], [252, 231, 243, 255]], yn = (g) => Dn[g.slice(0, 3).join(",")] || (g[0] + g[1] + g[2] > 740 ? "White" : "Color");
  function zt(g, S, I, R, L = false) {
    const j = !!I && !S.some((F) => F && Gn(F, I)), F = I ? "#" + I.slice(0, 3).map((K) => K.toString(16).padStart(2, "0")).join("") : "";
    return { label: g, disabled: L, swatches: [...S.map((K) => ({ css: K ? `rgb(${K[0]},${K[1]},${K[2]})` : "none", label: K ? yn(K) : "None", on: K ? !!I && Gn(K, I) : !I })), { custom: true, css: j ? `rgb(${I[0]},${I[1]},${I[2]})` : void 0, value: F, label: "Custom colour…", on: j }], pick: (K, se) => R(se || S[K]) };
  }
  function bt(g, S, I, R, L = false) {
    return { label: g, disabled: L, swatches: S.map((j) => ({ text: j.text, label: j.label, on: I(j.v) })), pick: (j) => R(S[j].v) };
  }
  const Bn = (g, S, I, R) => e.mutate(R, { pages: [g] }, () => e.doc.setAnnotStyle(g, S, I)).catch((L) => H(L.message, "err"));
  function be(g, S, I) {
    const R = [], L = S.subtype;
    if (L === Q.FREETEXT) {
      const ie = S.ft ? e.doc.readFreeText(g, S.index) : null;
      if (!ie) return R;
      const me = (pe, Ie) => i.update(g, S.index, (Me) => ({ ...Me, style: { ...Me.style, ...pe } }), Ie);
      return R.push(zt("Text", lt.pen, ie.style.color, (pe) => me({ color: pe }, "Text color"), !I), zt("Fill", jn, ie.style.fill, (pe) => me({ fill: pe }, "Text box fill"), !I), zt("Border", [null, ...lt.pen], ie.style.border, (pe) => me({ border: pe }, "Text box border"), !I), bt("Size", [9, 11, 14, 18, 24].map((pe) => ({ text: String(pe), label: `${pe} pt`, v: pe })), (pe) => Math.abs(ie.style.size - pe) < 0.01, (pe) => me({ size: pe }, "Text size"), !I)), R;
    }
    if (L === Q.SQUARE || L === Q.CIRCLE) {
      // a shape keeps an outline or a fill: removing the last one is refused
      const ie = e.doc.annotStyle(g, S.index);
      R.push(zt("Outline", [null, ...lt.pen], S.color, (me) => !me && !ie?.fill ? H("A shape needs an outline or a fill", "warn") : e.mutate(me ? "Outline colour" : "Remove outline", { pages: [g] }, () => e.doc.setAnnotColor(g, S.index, me)).catch((pe) => H(pe.message, "err")), !I));
    } else if (L !== Q.STAMP && S.color) {
      const ie = lt.highlight.some((me) => Gn(me, S.color)) || L === 9 || L === 1 ? lt.highlight : lt.pen;
      R.push(zt("Color", ie, S.color, (me) => e.mutate("Change color", { pages: [g] }, () => e.doc.setAnnotColor(g, S.index, me)).catch((pe) => H(pe.message, "err")), !I));
    }
    const j = L === Q.SQUARE || L === Q.CIRCLE, F = L === Q.LINE, K = L === Q.INK, se = L >= 9 && L <= 12;
    if (!j && !F && !K && !se) return R;
    const te = e.doc.annotStyle(g, S.index);
    if (!te) return R;
    const re = (ie, me) => Bn(g, S.index, ie, me);
    if (j && R.push(zt("Fill", [null, [255, 255, 255, 255], ...lt.highlight], te.fill, (ie) => !ie && !S.color ? H("A shape needs an outline or a fill", "warn") : re({ fill: ie }, ie ? "Fill shape" : "Remove fill"), !I)), (j || F || K) && R.push(bt("Width", [1, 2, 4, 8].map((ie) => ({ text: String(ie), label: `${ie} pt`, v: ie })), (ie) => Math.abs(te.width - ie) < 0.26, (ie) => re({ width: ie }, "Line width"), !I), bt("Style", [{ text: "Solid", label: "Solid line", v: false }, { text: "Dashed", label: "Dashed line", v: true }], (ie) => ie === te.dashed, (ie) => re({ dashed: ie }, ie ? "Dashed line" : "Solid line"), !I)), F && te.ends) {
      const ie = te.ends, me = ie[1] !== "None" ? ie[1] : ie[0] !== "None" ? ie[0] : "OpenArrow", pe = (ie[0] !== "None" ? 1 : 0) | (ie[1] !== "None" ? 2 : 0);
      R.push(bt("Arrows", [{ text: "—", label: "No arrowheads", v: 0 }, { text: "→", label: "Arrowhead at the end", v: 2 }, { text: "←", label: "Arrowhead at the start", v: 1 }, { text: "↔", label: "Arrowheads at both ends", v: 3 }], (Ie) => Ie === pe, (Ie) => re({ ends: [Ie & 1 ? me : "None", Ie & 2 ? me : "None"] }, "Arrowheads"), !I)), pe && R.push(bt("Heads", [{ text: "Open", label: "Open arrowheads", v: "OpenArrow" }, { text: "Filled", label: "Filled arrowheads", v: "ClosedArrow" }], (Ie) => Ie === me, (Ie) => re({ ends: [ie[0] !== "None" ? Ie : "None", ie[1] !== "None" ? Ie : "None"] }, "Arrowhead style"), !I)), (pe === 1 || pe === 2) && R.push({ label: "Reverse direction", disabled: !I, run: () => e.mutate("Reverse arrow", { pages: [g] }, () => e.doc.reverseLine(g, S.index)).catch((Ie) => H(Ie.message, "err")) });
    }
    return R.push(bt("Opacity", [100, 75, 50, 25, 10].map((ie) => ({ text: ie + "%", label: `${ie}% opaque`, v: ie / 100 })), (ie) => Math.abs(te.opacity - ie) < 0.03, (ie) => re({ opacity: ie }, "Opacity"), !I)), R;
  }
  const je = () => {
    const { locked: g, perms: S } = e.limits;
    return !g || !!(S & 8) || !!(S & 32);
  }, mt = () => {
    const { locked: g, perms: S } = e.limits;
    return !g || !!(S & 8);
  };
  async function wn(g, S) {
    const I = a.itemOfAnnot(g, S);
    if (!I) {
      H("Couldn’t find that annotation to duplicate", "err");
      return;
    }
    const R = await a.duplicate(g, [I]);
    e.tool === "select" && R[0]?.startsWith("a") && (e.selectedAnnot = { page: g, index: +R[0].slice(1) }, o.refreshOverlays(), m.markSelected(), V());
  }
  const Qt = (g, S, I) => e.mutate(I === "front" ? "Bring to front" : "Send to back", { pages: [g] }, () => {
    if (!e.doc.restackAnnots(g, [S], I)) throw new Error(I === "front" ? "Already in front of what it overlaps" : "Already behind what it overlaps");
  }).then(() => {
    e.selectedAnnot = null, o.refreshOverlays(), V();
  }).catch((R) => H(R.message, "warn")), vn = /* @__PURE__ */ new Set([Q.TEXT, Q.FREETEXT, Q.LINE, Q.SQUARE, Q.CIRCLE, Q.INK, Q.STAMP]), cn = Math.random().toString(36).slice(2, 10), xn = () => cn + "|" + e.fileName;
  let ct = { id: "", page: -1, n: 0 }, Mt = false, un = false;
  const st = () => {
    const { locked: g, perms: S } = e.limits;
    return !g || !!(S & 16);
  };
  function en() {
    if (e.tool === "arrange" && a.sel && !a.cropping) {
      const g = a.selected();
      return g.length ? { page: a.sel.page, items: g } : null;
    }
    if (e.tool === "select" && e.selectedAnnot) {
      const g = a.itemOfAnnot(e.selectedAnnot.page, e.selectedAnnot.index);
      return g ? { page: e.selectedAnnot.page, items: [g] } : null;
    }
    return null;
  }
  function rt(g = false) {
    const S = en();
    if (!S) return null;
    if (!st()) return H("This PDF’s permissions don’t allow copying. Unlock it with its permissions password first.", "warn", 5e3), null;
    if (g && !(e.tool === "arrange" ? mt() : je())) return H("This PDF’s permissions don’t allow removing objects", "warn"), null;
    const I = a.clipOf(S.page, S.items);
    if (!I) return H("Only annotations and pictures can be copied", "warn"), null;
    const R = Math.random().toString(36).slice(2, 10), L = e.fileName, j = I.items.length, F = { id: R, items: I.items, bounds: I.bounds, count: j, from: L, src: xn(), page: S.page, at: Date.now() };
    ct = { id: R, page: S.page, n: 0 };
    const K = j === 1 ? S.items.length === 1 ? S.items[0].label : "Object" : `${j} objects`;
    if (su(F).then((se) => {
      const te = I.skipped ? ` ${I.skipped} other${I.skipped === 1 ? "" : "s"} (text, links, form fields or markup) can’t be copied.` : "";
      H(`${K} ${g ? "cut" : "copied"}. Paste with Ctrl+V on any page${se ? ", here or in another Margin window" : ""}.${te}`, I.skipped ? "warn" : "ok", I.skipped ? 4500 : 2800);
    }), g) {
      const se = S.items.filter((te) => a.canDuplicate(te));
      a.removeItems(S.page, se, se.length > 1 ? `Cut ${se.length} objects` : `Cut ${se[0].label.toLowerCase()}`).then(() => {
        e.selectedAnnot = null, o.refreshOverlays(), V();
      }).catch((te) => H(te.message, "err"));
    }
    return iu(F);
  }
  function ut(g) {
    Mt = g, un = false;
    try {
      document.execCommand("copy");
    } catch {
    }
    if (Mt = false, !un) {
      const S = rt(g);
      S && navigator.clipboard?.writeText(S).catch(() => {
      });
    }
  }
  async function ht(g, S) {
    const I = await Kn();
    if (!I) return H("Nothing copied yet. Select an annotation or picture and press Ctrl+C.", "warn", 4e3);
    if (g && I.id !== g) return H("Those copied objects are no longer available: copy them again.", "warn");
    if (!(I.items.some((Ye) => Ye.t === "img") ? mt() : je())) return H("This PDF’s permissions don’t allow adding these", "warn");
    const L = S?.page ?? (e.tool === "arrange" && a.sel ? a.sel.page : e.currentPage), j = r.views[L];
    if (!j) return;
    const F = I.bounds;
    let K = 0, se = 0;
    S ? (K = S.p.x - F.l, se = S.p.y - F.t) : I.src === xn() && I.page === L && (ct = ct.id === I.id && ct.page === L ? { ...ct, n: ct.n + 1 } : { id: I.id, page: L, n: 1 }, [K, se] = a.screenOffset(L, 12 * ct.n));
    const te = r.zoom, re = j.w * te, ie = j.h * te, me = j.tf.box({ l: F.l + K, r: F.r + K, t: F.t + se, b: F.b + se });
    let pe = 0, Ie = 0;
    if (me.w <= re && (pe = me.x < 0 ? -me.x : me.x + me.w > re ? re - me.x - me.w : 0), me.h <= ie && (Ie = me.y < 0 ? -me.y : me.y + me.h > ie ? ie - me.y - me.h : 0), pe || Ie) {
      const [Ye, Je] = a.screenOffset(L, pe / te, Ie / te);
      K += Ye, se += Je;
    }
    const Me = await a.paste(L, I.items, K, se, I.count > 1 ? `Paste ${I.count} objects` : "Paste");
    Me.length && (e.tool === "select" && Me.length === 1 && Me[0][0] === "a" ? (e.selectedAnnot = { page: L, index: +Me[0].slice(1) }, o.refreshOverlays(), m.markSelected(), V()) : e.tool !== "arrange" && (e.setTool("arrange"), a.invalidate(L), a.sel = { page: L, key: Me[0] }, a.extra = Me.slice(1), a.refresh(), V()));
  }
  const hn = (g, S) => {
    const I = en(), R = !!I && I.items.some((L) => a.canDuplicate(L));
    return [{ label: "Cut", shortcut: "Ctrl+X", disabled: !R || !st() || !S, run: () => ut(true) }, { label: "Copy", shortcut: "Ctrl+C", disabled: !R || !st(), run: () => ut(false) }, { label: g ? `Paste ${g.count === 1 ? "" : g.count + " objects"}`.trim() : "Paste", shortcut: "Ctrl+V", disabled: !g || !S, run: () => ht() }];
  };
  async function vt(g, S, I, R, L) {
    const j = e.doc.annots(g).find((Me) => Me.index === S);
    if (!j) return;
    const F = await Kn();
    e.selectedAnnot = { page: g, index: S }, o.refreshOverlays(), m.markSelected(), V();
    const K = je(), se = j.subtype >= 9 && j.subtype <= 12, te = j.subtype === 3, re = j.subtype === 13, ie = re && j.contents === "Signature" ? "Signature" : te && j.ft?.tip ? "Callout" : j.subtype === Q.LINE && e.doc.annotStyle(g, S)?.ends?.some((Me) => Me !== "None") ? "Arrow" : Zn[j.subtype] || "Annotation", me = r.views[g], pe = [{ heading: `${ie}${j.author ? " · " + j.author : ""}` }];
    te && o.textbox && me ? pe.push({ label: "Edit text", disabled: !K, run: () => o.textbox.edit(me, S) }) : pe.push({ label: j.contents && !(re && j.contents === "Signature") ? "Edit comment" : "Add comment", disabled: !K, run: () => o.onNoteCreated(g, S) }), pe.push({ label: "Reply", disabled: !K, run: () => {
      document.body.classList.add("show-comments"), m.reply(g, S);
    } }), j.contents && !te && !(re && j.contents === "Signature") && pe.push({ label: "Copy comment text", run: () => navigator.clipboard?.writeText(j.contents).then(() => H("Comment text copied"), () => H("Couldn’t reach the clipboard", "warn")) });
    const Ie = be(g, j, K);
    Ie.length && pe.push("sep", ...Ie), pe.push("sep"), vn.has(j.subtype) && (!te || j.ft) && pe.push(...hn(F, K), { label: "Duplicate", shortcut: "Ctrl+D", disabled: !K, run: () => wn(g, S) }), pe.push({ label: "Bring to front", disabled: !K, run: () => Qt(g, S, "front") }, { label: "Send to back", disabled: !K, run: () => Qt(g, S, "back") }), se || pe.push({ label: "Move & resize", disabled: !K, run: () => {
      e.setTool("arrange"), a.sel = { page: g, key: "a" + S }, a.extra = [], a.refresh(), V();
    } }), pe.push("sep", { label: "Delete", shortcut: "Del", danger: true, disabled: !K, run: () => Lt() }), pn(I, R, pe, L);
  }
  async function xt() {
    const g = a.sel, S = a.current();
    if (!g || !S || S.kind !== "image") return;
    const I = await gs();
    if (I) try {
      const R = await Eo(I, I.name), L = e.doc.imageInfo(g.page, S.objs[0]), j = L ? Math.hypot(L.matrix[0], L.matrix[1]) : 300, F = L ? Math.hypot(L.matrix[2], L.matrix[3]) : 300;
      await a.replaceImage(await Fs(R, j, F), R.w, R.h), R.bitmap.close(), URL.revokeObjectURL(R.url);
    } catch (R) {
      H(R.message, "err");
    }
  }
  async function An() {
    const g = a.sel, S = a.current();
    if (!g || !S || S.kind !== "image") return;
    const { locked: I, perms: R } = e.limits;
    if (I && !(R & 16)) return H("This PDF’s permissions don’t allow copying its content", "warn");
    const L = e.editedName.replace(/\.pdf$/i, "") + `-p${g.page + 1}-image`;
    try {
      const j = e.doc.imageJpeg(g.page, S.objs[0]);
      if (j) return await Ne(j, L + ".jpg", "image/jpeg");
      const F = e.doc.imagePixels(g.page, S.objs[0]);
      if (!F) throw new Error("Couldn’t read that image");
      const K = document.createElement("canvas");
      K.width = F.w, K.height = F.h, K.getContext("2d").putImageData(new ImageData(F.rgba, F.w, F.h), 0, 0);
      const se = await new Promise((te) => K.toBlob(te, "image/png"));
      if (!se) throw new Error("Couldn’t encode the image");
      await Ne(new Uint8Array(await se.arrayBuffer()), L + ".png", "image/png");
    } catch (j) {
      H(j.message, "err");
    }
  }
  async function Gt(g, S, I) {
    const R = await Kn(), L = a.selected(), j = L.length;
    if (!j) return;
    const F = a.sel.page, K = mt(), se = [];
    if (j === 1) {
      const re = L[0];
      se.push({ heading: re.label });
      const ie = re.kind === "annot" ? e.doc.annots(F).find((me) => me.index === re.annot) : void 0;
      if (ie) {
        const me = r.views[F];
        ie.subtype === Q.FREETEXT && o.textbox && me ? se.push({ label: "Edit text", run: () => {
          e.setTool("select"), o.textbox.edit(me, ie.index);
        } }) : se.push({ label: ie.contents ? "Edit comment" : "Add comment", run: () => {
          e.setTool("select"), e.selectedAnnot = { page: F, index: ie.index }, o.refreshOverlays(), o.onNoteCreated(F, ie.index);
        } });
        const pe = be(F, ie, je());
        pe.length && se.push("sep", ...pe);
      } else if (re.label === "Link") {
        const me = o.links?.of(F).find((pe) => pe.index === re.annot);
        me && o.links && se.push({ label: "Edit link…", disabled: !K, run: () => o.links.editDialog(F, me) });
      } else re.kind === "image" && (se.push({ label: "Rotate left", run: () => a.turn("rotl") }, { label: "Rotate right", run: () => a.turn("rotr") }, { label: "Flip horizontally", run: () => a.turn("fliph") }, { label: "Flip vertically", run: () => a.turn("flipv") }), re.label === "Image" && se.push("sep", { label: "Crop", run: () => a.startCrop() }, { label: "Replace image…", run: () => xt() }, { label: "Save image…", run: () => An() }));
      se.push("sep");
    } else se.push({ heading: `${j} objects` });
    const te = (re) => a.align(re);
    se.push(bt(j > 1 ? "Align" : "Align to page", [{ text: "Left", label: j > 1 ? "Align left edges" : "Page’s left edge", v: "left" }, { text: "Centre", label: j > 1 ? "Align centres" : "Centre on the page", v: "hcenter" }, { text: "Right", label: j > 1 ? "Align right edges" : "Page’s right edge", v: "right" }], () => false, te, !K), bt("", [{ text: "Top", label: j > 1 ? "Align tops" : "Page’s top", v: "top" }, { text: "Middle", label: j > 1 ? "Align middles" : "Centre on the page vertically", v: "vmiddle" }, { text: "Bottom", label: j > 1 ? "Align bottoms" : "Page’s bottom", v: "bottom" }], () => false, te, !K)), j >= 3 && se.push({ label: "Distribute across", disabled: !K, run: () => a.distribute("h") }, { label: "Distribute down", disabled: !K, run: () => a.distribute("v") }), j >= 2 && se.push(bt("Match", [{ text: "Width", label: "Match width of the last clicked", v: "w" }, { text: "Height", label: "Match height of the last clicked", v: "h" }, { text: "Both", label: "Match size of the last clicked", v: "both" }], () => false, (re) => a.matchSize(re), !K)), se.push("sep", { label: "Bring to front", shortcut: "Ctrl+Shift+]", disabled: !K, run: () => a.restack("front") }, { label: "Bring forward", shortcut: "Ctrl+]", disabled: !K, run: () => a.restack("forward") }, { label: "Send backward", shortcut: "Ctrl+[", disabled: !K, run: () => a.restack("backward") }, { label: "Send to back", shortcut: "Ctrl+Shift+[", disabled: !K, run: () => a.restack("back") }, "sep", ...hn(R, K), { label: j > 1 ? `Duplicate ${j}` : "Duplicate", shortcut: "Ctrl+D", disabled: !K || !L.some((re) => a.canDuplicate(re)), run: () => a.duplicate(F) }, { label: j > 1 ? `Delete ${j} objects` : "Delete", shortcut: "Del", danger: true, disabled: !K, run: () => a.remove() }), pn(g, S, se, I);
  }
  async function At(g, S, I, R) {
    const L = r.views[g];
    if (!L) return;
    const j = await Kn(), F = je(), K = mt();
    e.selectedPages = /* @__PURE__ */ new Set([g]), h.mark();
    const se = [{ heading: `Page ${g + 1}` }];
    e.tool === "arrange" && se.push({ label: "Select all objects", shortcut: "Ctrl+A", run: () => {
      a.sel = null, e.currentPage = g, a.selectAll(), V();
    } }, "sep"), j && se.push({ label: j.count === 1 ? "Paste here" : `Paste ${j.count} objects here`, shortcut: "Ctrl+V", disabled: !(j.items.some((te) => te.t === "img") ? K : F), run: () => ht(null, { page: g, p: R }) }, "sep"), se.push({ label: "Add note here", disabled: !F, run: () => {
      e.setTool("select"), o.noteDown(L, R);
    } }, { label: "Add text box here", disabled: !F || !o.textbox, run: () => {
      e.setTool("select"), o.textbox.edit(L, null, { box: { l: R.x, r: R.x + 200, t: R.y, b: R.y - e.settings.ftSize * 2.2 }, text: "", style: o.textbox.style() });
    } }, "sep", { label: "Copy page", shortcut: "Ctrl+C", run: () => ve("copy") }, { label: "Rotate page left", disabled: !K, run: () => ve("rotl") }, { label: "Rotate page right", disabled: !K, run: () => ve("rotr") }, { label: "Insert blank page after", disabled: !K, run: () => ve("insert") }, "sep", { label: "Delete page", danger: true, disabled: !K || e.doc.pageCount <= 1, run: () => ve("delete") }), pn(S, I, se);
  }
  function Be(g, S, I, R, L) {
    const j = o.links?.of(g).find((re) => re.index === S);
    if (!j || !o.links) return;
    const { locked: F, perms: K } = e.limits, se = !F || !!(K & 8), te = j.uri ? j.uri : j.page != null && j.page >= 0 ? `page ${j.page + 1}` : "nowhere";
    pn(I, R, [{ heading: `Link to ${te.length > 40 ? te.slice(0, 39) + "…" : te}` }, { label: j.uri ? "Open link" : "Go to page", disabled: !j.uri && !(j.page != null && j.page >= 0), run: () => o.links.follow(j) }, ...j.uri ? [{ label: "Copy link address", run: () => {
      navigator.clipboard?.writeText(j.uri).then(() => H("Link address copied"), () => H("Couldn’t reach the clipboard", "warn"));
    } }] : [], "sep", { label: "Edit link…", disabled: !se, run: () => o.links.editDialog(g, j) }, { label: "Remove link", danger: true, disabled: !se, run: () => e.mutate("Remove link", { pages: [g] }, () => e.doc.deleteAnnot(g, j.index)).catch((re) => H(re.message, "err")) }], L);
  }
  r.el.addEventListener("contextmenu", (g) => {
    if (e.tool !== "select" && e.tool !== "arrange" || M(g.target)) return;
    const S = g.target, I = S.closest(".page");
    if (!I) return;
    const R = +I.dataset.index, L = r.views[R];
    if (!L) return;
    if (e.tool === "arrange") {
      if (a.cropping) return;
      g.preventDefault();
      const K = S.closest("[data-k]")?.dataset.k;
      K ? (a.sel?.page === R && (a.sel.key === K || a.extra.includes(K)) || (a.sel = { page: R, key: K }, a.extra = [], a.refresh(), V()), Gt(g.clientX, g.clientY)) : S.closest(".ogroup") && a.sel?.page === R ? Gt(g.clientX, g.clientY) : (a.sel && a.clear(), At(R, g.clientX, g.clientY, r.toPage(L, g)));
      return;
    }
    if (window.getSelection()?.toString()) return;
    const j = S.closest(".abox"), F = S.closest(".lbox");
    if (g.preventDefault(), j) vt(R, +j.dataset.annot, g.clientX, g.clientY, j);
    else if (F) Be(R, +F.dataset.link, g.clientX, g.clientY, F);
    else {
      if (S.closest(".fld,.sigfld,input,select,button")) return;
      e.selectedAnnot && (e.selectedAnnot = null, o.refreshOverlays(), V()), At(R, g.clientX, g.clientY, r.toPage(L, g));
    }
  }), document.addEventListener("keydown", (g) => {
    if (!(g.key === "ContextMenu" || g.shiftKey && g.key === "F10") || M(g.target) || Zr() || He(g.target)) return;
    if (e.tool === "arrange" && a.sel && !a.cropping) {
      const L = r.views[a.sel.page]?.ov.querySelector(".oframe.primary, .oframe:not(.multi)");
      if (!L) return;
      g.preventDefault();
      const j = L.getBoundingClientRect();
      Gt(j.left + Math.min(j.width, 40), j.bottom + 4);
      return;
    }
    const S = e.selectedAnnot;
    if (!S || e.tool !== "select") return;
    const I = r.views[S.page]?.ov.querySelector(`.abox[data-annot="${S.index}"]`);
    if (!I) return;
    g.preventDefault();
    const R = I.getBoundingClientRect();
    vt(S.page, S.index, R.left + Math.min(R.width, 40), R.bottom + 4, I);
  });
  let qe = null;
  r.el.addEventListener("pointerdown", (g) => {
    if (g.pointerType !== "touch" || e.tool !== "select") return;
    const S = g.target.closest(".abox,.lbox");
    S && (qe = { t: window.setTimeout(() => {
      if (!qe || Zr()) return;
      const R = +qe.el.closest(".page").dataset.index;
      qe.el.classList.contains("abox") ? vt(R, +qe.el.dataset.annot, qe.x, qe.y, qe.el) : Be(R, +qe.el.dataset.link, qe.x, qe.y, qe.el), qe = null;
    }, 550), x: g.clientX, y: g.clientY, el: S });
  }, true);
  const dn = (g) => {
    qe && (g.type !== "pointermove" || Math.hypot(g.clientX - qe.x, g.clientY - qe.y) > 10) && (clearTimeout(qe.t), qe = null);
  };
  for (const g of ["pointermove", "pointerup", "pointercancel"]) r.el.addEventListener(g, dn, true);
  const He = (g) => g?.closest?.(".thumb");
  h.list.addEventListener("contextmenu", (g) => {
    const S = He(g.target);
    S && (g.preventDefault(), wt(+S.dataset.index, g.clientX, g.clientY, S));
  }), h.list.addEventListener("keydown", (g) => {
    const S = He(g.target);
    if (S) if (g.key === "ContextMenu" || g.shiftKey && g.key === "F10") {
      g.preventDefault();
      const I = S.getBoundingClientRect();
      wt(+S.dataset.index, I.left + I.width / 2, I.top + I.height / 2, S);
    } else (g.key === "Delete" || g.key === "Backspace") && !g.metaKey && !g.ctrlKey && (g.preventDefault(), g.stopPropagation(), ve("delete"));
  });
  let et = null;
  h.list.addEventListener("pointerdown", (g) => {
    if (g.pointerType !== "touch") return;
    const S = He(g.target);
    S && (et = { t: window.setTimeout(() => {
      et && !Zr() && wt(+et.el.dataset.index, et.x, et.y, et.el), et = null;
    }, 550), x: g.clientX, y: g.clientY, el: S });
  });
  const Ht = (g) => {
    et && (g.type !== "pointermove" || Math.hypot(g.clientX - et.x, g.clientY - et.y) > 10) && (clearTimeout(et.t), et = null);
  };
  for (const g of ["pointermove", "pointerup", "pointercancel"]) h.list.addEventListener(g, Ht);
  const M = (g) => !!g?.closest?.("input,textarea,select,[contenteditable]") || !!o.editor, he = () => !!document.activeElement?.closest?.("#thumbs");
  document.addEventListener("copy", (g) => {
    if (M(g.target) || document.querySelector(".modal") || window.getSelection()?.toString()) return;
    if (!he() && en()) {
      const R = Mt;
      Mt = false, un = true;
      const L = rt(R);
      L && (g.preventDefault(), g.clipboardData?.setData("text/plain", L));
      return;
    }
    if (!he() && !e.selectedPages.size) return;
    const I = Qe(St());
    I && (g.preventDefault(), g.clipboardData?.setData("text/plain", I));
  });
  async function ve(g) {
    const S = e.doc.pageCount, I = e.selectedPages.size ? [...e.selectedPages].sort((L, j) => L - j) : [e.currentPage], R = I.length > 1 ? `${I.length} pages` : `page ${I[0] + 1}`;
    try {
      if (g === "rotl" || g === "rotr") await e.mutate(`Rotate ${R}`, { pages: I, structure: true }, () => I.forEach((L) => e.doc.rotate(L, g === "rotl" ? -1 : 1)));
      else if (g === "insert") {
        const L = I[I.length - 1], { w: j, h: F } = e.doc.pageSize(L);
        await e.mutate("Insert blank page", { pages: "all", structure: true }, () => e.doc.insertBlank(L + 1, j, F)), e.selectedPages = /* @__PURE__ */ new Set([L + 1]), h.mark(), r.scrollToPage(L + 1);
      } else if (g === "delete") {
        if (I.length >= S) return H("A PDF needs at least one page", "warn");
        if (await nt({ title: `Delete ${R}?`, body: "You can undo this.", actions: [{ id: "no", label: "Cancel" }, { id: "yes", label: "Delete", danger: true }] }) !== "yes") return;
        await e.mutate(`Delete ${R}`, { pages: "all", structure: true }, () => {
          for (const j of [...I].reverse()) e.doc.deletePage(j);
          e.selectedPages.clear();
        });
      } else if (g === "merge") {
        Y.click();
        return;
      } else if (g === "copy") {
        const L = Qe(I);
        L && navigator.clipboard?.writeText(L).catch(() => {
        });
      } else g === "paste" ? await f() : g === "extract" && await Ac(e, t, I, Ne);
    } catch (L) {
      H(L.message, "err");
    }
  }
  async function Re() {
    let g;
    try {
      g = e.exportBytes();
    } catch (S) {
      return H(wo(S) ? Ha : S.message, "err", 8e3), false;
    }
    return await Ne(g, e.editedName), true;
  }
  async function Ne(g, S, I = "application/pdf") {
    const R = await yu();
    if (R) {
      try {
        await R.save({ filename: S, data: new Blob([g], { type: I }) }), S === e.editedName && (e.dirty = false, Oe()), H(`Saved ${S}`);
      } catch (L) {
        L?.code === "declined" ? H("Save cancelled", "warn") : L?.code === "rate_limited" ? H("A save prompt is already open", "warn") : H(`Couldn’t save: ${L?.message || L?.code || "unknown error"}`, "err", 5e3);
      }
      return;
    }
    try {
      const L = URL.createObjectURL(new Blob([g], { type: I })), j = y("a", { href: L, download: S });
      document.body.append(j), j.click(), j.remove(), setTimeout(() => URL.revokeObjectURL(L), 4e3), S === e.editedName && (e.dirty = false, Oe()), H(`Saved ${S}`);
    } catch {
      H("Saving isn’t available in this view", "err");
    }
  }
  async function ot() {
    return await nt({ title: "Discard your changes?", body: `${e.fileName} has edits you haven’t saved.`, actions: [{ id: "no", label: "Keep editing" }, { id: "save", label: "Save first" }, { id: "yes", label: "Discard", danger: true }] }).then(async (g) => g === "save" ? await Re() ? "yes" : "no" : g) === "yes";
  }
  function Lt() {
    const g = e.selectedAnnot;
    g && e.mutate("Delete annotation", { pages: [g.page] }, () => e.doc.deleteAnnot(g.page, g.index)).then(() => {
      e.selectedAnnot = null, V();
    }).catch((S) => H(S.message, "err"));
  }
  function Ae() {
    const g = e.undo();
    g && H(`Undid ${g.toLowerCase()}`);
  }
  function kn() {
    const g = e.redo();
    g && H(`Redid ${g.toLowerCase()}`);
  }
  const Wt = _e("#viewer");
  Wt.addEventListener("dragover", (g) => {
    g.dataTransfer?.types.includes("Files") && (g.preventDefault(), Wt.classList.add("dropping"));
  }), Wt.addEventListener("dragleave", (g) => {
    g.target === Wt && Wt.classList.remove("dropping");
  }), Wt.addEventListener("drop", (g) => {
    Wt.classList.remove("dropping");
    const S = [...g.dataTransfer?.files || []].filter(Zl);
    if (S.length) {
      g.preventDefault();
      const R = g.target.closest(".page"), L = R ? r.views[+R.dataset.index] : void 0;
      o.editor && o.commitEditor(), (async () => {
        for (const [j, F] of S.entries()) await o.placeImageFile(F, L ? { pv: L, clientX: g.clientX + j * 16, clientY: g.clientY + j * 16 } : void 0);
      })();
      return;
    }
    const I = [...g.dataTransfer?.files || []].filter((R) => /pdf$/i.test(R.type) || /\.pdf$/i.test(R.name));
    I.length && (g.preventDefault(), Ke(I[0]));
  }), _e("#thumbs").addEventListener("dragover", (g) => {
    g.dataTransfer?.types.includes("Files") && g.preventDefault();
  }), _e("#thumbs").addEventListener("drop", (g) => {
    const S = [...g.dataTransfer?.files || []].filter((I) => /\.pdf$/i.test(I.name));
    S.length && (g.preventDefault(), Le(S));
  });
  const hr = Object.fromEntries(Object.entries(Jr).map(([g, S]) => [S.key.toLowerCase(), g]));
  document.addEventListener("keydown", (g) => {
    const S = g.target.closest("input,textarea,select,[contenteditable]"), I = g.metaKey || g.ctrlKey;
    if (I && g.key.toLowerCase() === "s") {
      g.preventDefault(), Re();
      return;
    }
    if (g.key === "F7" && !I) {
      g.preventDefault(), o.editor && o.commitEditor(), J.open();
      return;
    }
    if (I && g.key.toLowerCase() === "p") {
      g.preventDefault(), o.editor && o.commitEditor(), Fa(e);
      return;
    }
    if (I && g.key.toLowerCase() === "f") {
      g.preventDefault(), de.focus(), de.select();
      return;
    }
    if (I && g.key.toLowerCase() === "h") {
      g.preventDefault(), Ee(true);
      return;
    }
    if (I && g.key.toLowerCase() === "o") {
      g.preventDefault(), q.click();
      return;
    }
    if (!S) {
      if (I && g.key.toLowerCase() === "z") {
        g.preventDefault(), g.shiftKey ? kn() : Ae();
        return;
      }
      if (I && g.key.toLowerCase() === "y") {
        g.preventDefault(), kn();
        return;
      }
      if (I && (g.key === "=" || g.key === "+")) {
        g.preventDefault(), r.setZoom(r.zoom * 1.2);
        return;
      }
      if (I && g.key === "-") {
        g.preventDefault(), r.setZoom(r.zoom / 1.2);
        return;
      }
      if (I && g.key === "0") {
        g.preventDefault(), r.fit = "width", r.applyFit();
        return;
      }
      if (e.tool === "crop" && s.sel) {
        if (g.key === "Enter") {
          g.preventDefault(), s.apply([s.sel.page]);
          return;
        }
        if (g.key === "Escape") {
          s.sel = null, s.refresh(), V();
          return;
        }
      }
      if (e.tool === "arrange" && a.cropping) {
        if (g.key === "Enter") {
          g.preventDefault(), a.applyCrop(ia);
          return;
        }
        if (g.key === "Escape") {
          g.preventDefault(), a.cancelCrop();
          return;
        }
      }
      if (I && !g.shiftKey && g.key.toLowerCase() === "d") {
        if (e.tool === "arrange" && a.sel && !a.cropping) {
          g.preventDefault(), mt() && a.duplicate(a.sel.page);
          return;
        }
        if (e.tool === "select" && e.selectedAnnot) {
          g.preventDefault(), je() && wn(e.selectedAnnot.page, e.selectedAnnot.index);
          return;
        }
      }
      if (e.tool === "arrange" && !S && I && g.key.toLowerCase() === "a") {
        g.preventDefault(), a.selectAll(), V();
        return;
      }
      if (e.tool === "arrange" && a.sel && I && (g.key === "]" || g.key === "[" || g.code === "BracketRight" || g.code === "BracketLeft")) {
        g.preventDefault();
        const R = g.key === "]" || g.code === "BracketRight";
        a.restack(g.shiftKey ? R ? "front" : "back" : R ? "forward" : "backward");
        return;
      }
      if (e.tool === "arrange" && a.sel) {
        const R = g.shiftKey ? 10 : 1, L = { ArrowLeft: [-R, 0], ArrowRight: [R, 0], ArrowUp: [0, -R], ArrowDown: [0, R] };
        if (L[g.key]) {
          g.preventDefault(), a.nudge(...L[g.key]);
          return;
        }
        if (g.key === "Delete" || g.key === "Backspace") {
          g.preventDefault(), a.remove();
          return;
        }
        if (g.key === "Escape") {
          a.clear(), V();
          return;
        }
      }
      if ((g.key === "Delete" || g.key === "Backspace") && e.selectedAnnot) {
        g.preventDefault(), Lt();
        return;
      }
      if (g.key === "Escape") {
        e.setTool("select");
        return;
      }
      !I && !g.altKey && hr[g.key.toLowerCase()] && e.setTool(hr[g.key.toLowerCase()]);
    }
  }), document.addEventListener("cut", (g) => {
    if (M(g.target) || document.querySelector(".modal") || window.getSelection()?.toString() || he() || !en()) return;
    const S = rt(true);
    S && (g.preventDefault(), g.clipboardData?.setData("text/plain", S));
  }), document.addEventListener("paste", (g) => {
    if (M(g.target) || document.querySelector(".modal")) return;
    const S = [...g.clipboardData?.items || []].find((j) => j.kind === "file" && j.type.startsWith("image/"))?.getAsFile();
    if (S) {
      g.preventDefault(), o.placeImageFile(S);
      return;
    }
    const I = g.clipboardData?.getData("text/plain") || "", R = uu(I), L = lu(I);
    if (he()) {
      g.preventDefault(), f(R);
      return;
    }
    !R && !L && I.trim() || (g.preventDefault(), Promise.all([Pr(), Kn()]).then(([j, F]) => {
      F && (!j || F.at >= j.at) ? ht(L && L === F.id ? L : null) : j ? f(R && R === j.id ? R : null) : L ? ht(L) : R && f(R);
    }));
  }), window.addEventListener("beforeunload", (g) => {
    e.dirty && g.preventDefault();
  });
  try {
    const g = new Uint8Array(await n("welcome.pdf"));
    e.open(g, "Welcome to Margin.pdf");
  } catch {
    const g = t.create();
    g.insertBlank(0, 612, 792), e.open(g.save(), "Untitled.pdf"), g.close();
  }
  e.setTool("select"), _e("#boot").remove(), $t(ze("sarabun")).catch(() => {
  });
}
wu();

