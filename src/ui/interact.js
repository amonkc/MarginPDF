import { Jt, Q, wr, ye } from '../engine/pdfium';
import { Ds, Go, Mo, On, bs, ha, lc, oc, tr, uc, ur } from '../engine/richtext';
import { $t, Dr, Fn, Gr, Mr, Tr, an, ar, gt, ns, on, rs, ts, ze } from '../engine/text';
import { H, Mn, nt, pt, y } from './dom';
import { Eo, Fs, aa, gs, ps, sa } from './images';
import { Yl } from './stamps';

const hc = (u) => {
  const n = parseInt(u.padEnd(6, "0").slice(0, 6), 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255, 255];
};
const Vn = (u, n) => Math.hypot(u.x - n.x, u.y - n.y);
class dc {
  app;
  v;
  editor = null;
  onEditor = () => {
  };
  onSelect = () => {
  };
  onNoteCreated = () => {
  };
  onFormatKey = () => {
  };
  arrange = null;
  image = null;
  crop = null;
  textbox = null;
  links = null;
  forms = null;
  lastDown = null;
  onImage = () => {
  };
  constructor(n, t) {
    this.app = n, this.v = t, t.onOverlay = (e) => this.overlay(e), t.inner.addEventListener("pointerdown", (e) => this.down(e)), this.loadSaved();
  }
  pvFrom(n) {
    const t = n.target.closest(".page");
    return t ? this.v.views[+t.dataset.index] : null;
  }
  refreshOverlays() {
    for (const n of this.v.views) this.v.overlayOf(n);
  }
  overlay(n) {
    if (this.editor?.pv === n || this.textbox?.open?.pv === n) return;
    n.ov.replaceChildren(), n.ov.dataset.tool = this.app.tool;
    const t = this.app.tool;
    if (t === "arrange") {
      this.arrange?.overlay(n);
      return;
    }
    if (t === "crop") {
      this.crop?.overlay(n);
      return;
    }
    if (t === "link") {
      this.links?.overlay(n, true);
      return;
    }
    if (t === "form") {
      this.forms?.overlay(n);
      return;
    }
    if (t === "select") {
      for (const e of this.v.annotsOf(n)) {
        const r = n.tf.box(e.rect), o = this.app.selectedAnnot?.page === n.index && this.app.selectedAnnot.index === e.index;
        n.ov.append(y("div", { class: "abox" + (o ? " sel" : "") + (wr(e.subtype) ? " markup" : ""), "data-annot": String(e.index), title: (e.contents || "").slice(0, 140), style: { left: r.x + "px", top: r.y + "px", width: Math.max(r.w, 6) + "px", height: Math.max(r.h, 6) + "px" } }));
      }
      this.fieldControls(n), this.links?.overlay(n, false);
    } else if (t === "edittext") for (const e of Pn(this.v.textsOf(n))) {
      const r = n.tf.box(e.bounds);
      n.ov.append(y("div", { class: "tbox" + (e.block ? " block" : ""), "data-obj": String(e.objs[0].index), title: "Click to edit", style: { left: r.x - 2 + "px", top: r.y - 2 + "px", width: r.w + 4 + "px", height: r.h + 4 + "px" } }));
    }
  }
  fieldControls(n) {
    for (const t of this.v.fieldsOf(n)) {
      const e = n.tf.box(t.rect), r = { left: e.x + "px", top: e.y + "px", width: e.w + "px", height: e.h + "px" }, o = (a, s) => this.app.mutate(a, { pages: [n.index] }, s).catch((i) => H(i.message, "err"));
      if (t.type === ye.TEXT) {
        const a = Math.max(9, Math.min(e.h * 0.62, 18)) + "px", s = t.multiline ? y("textarea", { class: "fld", "aria-label": t.name || "Text field", disabled: t.readOnly, style: { ...r, fontSize: a } }) : y("input", { class: "fld", type: "text", "aria-label": t.name || "Text field", disabled: t.readOnly, style: { ...r, fontSize: a } });
        s.value = t.value, s.addEventListener("pointerdown", (i) => i.stopPropagation()), s.addEventListener("keydown", (i) => {
          i.key === "Enter" && !t.multiline && s.blur(), i.stopPropagation();
        }), s.addEventListener("change", () => {
          const i = s.value;
          this.app.mutate("Fill field", { pages: [n.index] }, async () => {
            this.app.doc.setFieldText(n.index, t.index, i), ar(i) && await ns(this.app.doc, n.index, t.index, i);
          }).catch((l) => H(l.message, "err"));
        }), n.ov.append(s);
      } else if (t.type === ye.CHECKBOX || t.type === ye.RADIO) {
        const a = y("button", { class: "fld toggle", type: "button", role: t.type === ye.RADIO ? "radio" : "checkbox", "aria-checked": String(t.checked), "aria-label": t.name || "Option", disabled: t.readOnly, style: r });
        a.addEventListener("pointerdown", (s) => s.stopPropagation()), a.addEventListener("click", () => o(t.type === ye.RADIO ? "Choose option" : "Toggle checkbox", () => this.app.doc.clickField(n.index, t.index))), n.ov.append(a);
      } else if (t.type === ye.SIGNATURE) {
        const a = { x: (t.rect.l + t.rect.r) / 2, y: (t.rect.b + t.rect.t) / 2 };
        if (this.v.annotsOf(n).some((l) => l.subtype === Q.STAMP && l.rect.l <= a.x && l.rect.r >= a.x && l.rect.b <= a.y && l.rect.t >= a.y) || t.readOnly) continue;
        const i = y("button", { class: "fld sigfld", type: "button", "aria-label": `Sign “${t.name || "signature"}”`, title: "Click to sign", style: r }, y("span", { text: "Sign here" }));
        i.addEventListener("pointerdown", (l) => l.stopPropagation()), i.addEventListener("click", () => this.signField(n, t.rect)), n.ov.append(i);
      } else if (t.type === ye.COMBO || t.type === ye.LIST) {
        const a = y("select", { class: "fld", "aria-label": t.name || "Choice", disabled: t.readOnly, style: r }, ...t.options.map((s, i) => y("option", { value: String(i), text: s.label, selected: s.selected })));
        a.addEventListener("pointerdown", (s) => s.stopPropagation()), a.addEventListener("change", () => o("Choose option", () => this.app.doc.selectOption(n.index, t.index, +a.value))), n.ov.append(a);
      }
    }
  }
  down(n) {
    if (n.button !== 0) return;
    const t = this.pvFrom(n);
    if (!t || n.target.closest(".editor")) return;
    if (this.editor) {
      this.commitEditor();
      return;
    }
    const e = this.app.tool, r = this.v.toPage(t, n), o = performance.now(), a = this.lastDown;
    if (this.lastDown = { t: o, x: n.clientX, y: n.clientY, page: t.index }, e === "select" && a && a.page === t.index && o - a.t < 450 && Math.hypot(n.clientX - a.x, n.clientY - a.y) < 6) {
      this.lastDown = null, this.dbl(n);
      return;
    }
    switch (e) {
      case "select":
        return this.selectDown(n, t);
      case "arrange":
        return this.arrange?.down(n, t);
      case "edittext":
        return this.editTextDown(n, t);
      case "addtext":
        return this.addTextDown(n, t);
      case "highlight":
      case "underline":
      case "strike":
        return this.markupDown(n, t, e);
      case "draw":
        return this.drawDown(n, t);
      case "rect":
      case "ellipse":
        return this.shapeDown(n, t, e);
      case "line":
        return this.lineDown(n, t);
      case "stamp":
        return this.stampDown(t, r);
      case "redact":
        return this.redactDown(n, t);
      case "form":
        return this.forms?.down(n, t, (s, i, l, h) => this.drag(s, i, l, h));
      case "link":
        return this.links?.down(n, t, (s, i, l, h) => this.drag(s, i, l, h));
      case "textbox":
        return this.textbox?.down(n, t, (s, i, l, h) => this.drag(s, i, l, h));
      case "note":
        return this.noteDown(t, r);
      case "sign":
        return this.signDown(t, r);
      case "image":
        return this.imageDown(n, t);
      case "crop":
        return this.crop?.down(n, t);
    }
  }
  drag(n, t, e, r) {
    n.preventDefault();
    const o = t.ov;
    o.setPointerCapture(n.pointerId);
    let a = null, s = 0;
    const i = (h) => {
      a = h, s || (s = requestAnimationFrame(() => {
        s = 0, a && e(this.v.toPage(t, a), a);
      }));
    }, l = (h) => {
      if (o.removeEventListener("pointermove", i), o.removeEventListener("pointerup", l), o.removeEventListener("pointercancel", l), cancelAnimationFrame(s), t.svg.replaceChildren(), h.type === "pointercancel") {
        this.refreshOverlays();
        return;
      }
      r(this.v.toPage(t, h), h);
    };
    o.addEventListener("pointermove", i), o.addEventListener("pointerup", l), o.addEventListener("pointercancel", l);
  }
  selectDown(n, t) {
    const e = n.target.closest(".abox");
    if (!e) {
      this.app.selectedAnnot && (this.app.selectedAnnot = null, this.refreshOverlays(), this.onSelect());
      return;
    }
    const r = +e.dataset.annot;
    this.app.selectedAnnot = { page: t.index, index: r }, this.refreshOverlays(), this.onSelect();
    const o = this.v.annotsOf(t).find((_) => _.index === r);
    if (!o || wr(o.subtype)) return;
    const a = this.v.toPage(t, n), s = t.ov.querySelector(`.abox[data-annot="${r}"]`), i = parseFloat(s.style.left), l = parseFloat(s.style.top);
    t.ov.getBoundingClientRect();
    const h = n.clientX, m = n.clientY;
    this.drag(n, t, (_, p) => {
      s.style.left = i + (p.clientX - h) + "px", s.style.top = l + (p.clientY - m) + "px";
    }, (_) => {
      Vn(_, a) < 1.5 || this.app.mutate("Move annotation", { pages: [t.index] }, () => {
        this.app.doc.moveAnnot(t.index, r, _.x - a.x, _.y - a.y);
      }).catch((p) => H(p.message, "err"));
    });
  }
  dbl(n) {
    const t = this.pvFrom(n);
    if (!t || this.app.tool !== "select") return;
    const e = n.target.closest(".abox"), r = this.v.toPage(t, n), o = e ? +e.dataset.annot : this.v.annotsOf(t).filter((s) => !wr(s.subtype) && r.x >= s.rect.l && r.x <= s.rect.r && r.y >= s.rect.b && r.y <= s.rect.t).sort((s, i) => (s.rect.r - s.rect.l) * (s.rect.t - s.rect.b) - (i.rect.r - i.rect.l) * (i.rect.t - i.rect.b))[0]?.index;
    if (o == null) return;
    const a = o;
    if (this.v.annotsOf(t).find((s) => s.index === a)?.subtype === Q.FREETEXT && this.textbox) {
      this.textbox.edit(t, a);
      return;
    }
    this.onNoteCreated(t.index, a);
  }
  markupDown(n, t, e) {
    const r = this.v.toPage(t, n);
    let o = [];
    const a = e === "highlight" ? this.app.settings.markupColor : this.app.settings.lineMarkupColor, s = e === "highlight" ? Q.HIGHLIGHT : e === "underline" ? Q.UNDERLINE : Q.STRIKEOUT, i = a;
    this.drag(n, t, (l) => {
      o = this.app.doc.selectionRects(t.index, r, l).rects, t.svg.replaceChildren(...(o.length ? o : [fn(r, l)]).map((h) => {
        const m = t.tf.box(h);
        return pt("rect", { x: m.x, y: m.y, width: m.w, height: m.h, fill: Mn(i), "fill-opacity": o.length ? 0.35 : 0.12, stroke: o.length ? "none" : Mn(i), "stroke-dasharray": "4 3" });
      }));
    }, (l) => {
      if (!o.length) if (e === "highlight" && Math.abs(l.x - r.x) > 4 && Math.abs(l.y - r.y) > 4) o = [fn(r, l)];
      else {
        Vn(l, r) > 3 && H("Drag across text to mark it up", "warn");
        return;
      }
      const h = a;
      this.app.mutate(e === "highlight" ? "Highlight" : e === "underline" ? "Underline" : "Strikeout", { pages: [t.index] }, () => this.app.doc.addMarkup(t.index, s, o, h, this.app.settings.author)).catch((m) => H(m.message, "err"));
    });
  }
  drawDown(n, t) {
    const e = [this.v.toPage(t, n)], { inkColor: r, inkWidth: o } = this.app.settings, a = pt("polyline", { fill: "none", stroke: Mn(r), "stroke-width": o * this.v.zoom, "stroke-linecap": "round", "stroke-linejoin": "round" });
    t.svg.replaceChildren(a), this.drag(n, t, (s) => {
      Vn(s, e[e.length - 1]) < 0.6 || (e.push(s), a.isConnected || t.svg.replaceChildren(a), a.setAttribute("points", e.map((i) => this.v.toDev(t, i.x, i.y).join(",")).join(" ")));
    }, () => {
      e.length < 2 || this.app.mutate("Draw", { pages: [t.index] }, () => this.app.doc.addInk(t.index, [mc(e, 0.35)], r, o, this.app.settings.author)).catch((s) => H(s.message, "err"));
    });
  }
  shapeDown(n, t, e) {
    const r = this.v.toPage(t, n), { shapeColor: o, shapeWidth: a, shapeFill: c, shapeOpacity: d = 1 } = this.app.settings;
    if (!o && !c) return H("Pick an outline or a fill colour first", "warn");
    this.drag(n, t, (s) => {
      const i = t.tf.box(fn(r, s)), l = { fill: c ? Mn(c) : "none", stroke: o ? Mn(o) : "none", "stroke-width": a * this.v.zoom, opacity: d };
      t.svg.replaceChildren(e === "rect" ? pt("rect", { x: i.x, y: i.y, width: i.w, height: i.h, ...l }) : pt("ellipse", { cx: i.x + i.w / 2, cy: i.y + i.h / 2, rx: i.w / 2, ry: i.h / 2, ...l }));
    }, (s) => {
      Math.abs(s.x - r.x) < 3 || Math.abs(s.y - r.y) < 3 || this.app.mutate(e === "rect" ? "Rectangle" : "Ellipse", { pages: [t.index] }, () => this.app.doc.addShape(t.index, e === "rect" ? Q.SQUARE : Q.CIRCLE, fn(r, s), o, a, this.app.settings.author, { fill: c, opacity: d })).catch((i) => H(i.message, "err"));
    });
  }
  async stampDown(n, t) {
    const e = await Yl(this.app, n, t);
    e != null && this.arrange && (this.arrange.sel = { page: n.index, key: "a" + e }, this.arrange.extra = [], this.app.setTool("arrange"));
  }
  redactDown(n, t) {
    const e = this.v.toPage(t, n), r = this.app.settings.redactMode === "area";
    let o = [];
    this.drag(n, t, (a) => {
      o = r ? [fn(e, a)] : this.app.doc.selectionRects(t.index, e, a).rects;
      const s = o.length ? o : [fn(e, a)];
      t.svg.replaceChildren(...s.map((i) => {
        const l = t.tf.box(i);
        return pt("rect", { x: l.x, y: l.y, width: l.w, height: l.h, fill: "rgba(214,40,40,.18)", stroke: "#d62828", "stroke-dasharray": "4 3" });
      }));
    }, (a) => {
      r && (o = [fn(e, a)]), o = o.filter((s) => s.r - s.l > 1 && s.t - s.b > 1), !(!o.length || r && Vn(e, a) < 4) && this.app.mutate("Mark for redaction", { pages: [t.index] }, () => this.app.doc.addRedactMark(t.index, o, this.app.settings.author)).catch((s) => H(s.message, "err"));
    });
  }
  lineDown(n, t) {
    const e = this.v.toPage(t, n), { lineColor: r, lineWidth: o, lineEnds: a } = this.app.settings, s = a === "double" ? ["OpenArrow", "OpenArrow"] : a === "arrow" ? ["None", "OpenArrow"] : ["None", "None"];
    let i = e;
    const l = (h, m) => {
      if (!m.shiftKey) return h;
      const _ = h.x - e.x, p = h.y - e.y, P = Math.hypot(_, p), D = Math.round(Math.atan2(p, _) / (Math.PI / 4)) * (Math.PI / 4);
      return { x: e.x + P * Math.cos(D), y: e.y + P * Math.sin(D) };
    };
    this.drag(n, t, (h, m) => {
      i = l(h, m);
      const [_, p] = t.tf.apply(e.x, e.y), [P, D] = t.tf.apply(i.x, i.y), x = this.v.zoom, A = Mn(r), w = o * x, k = [pt("line", { x1: _, y1: p, x2: P, y2: D, stroke: A, "stroke-width": w, "stroke-linecap": "round" })], G = (E, B, z, O) => {
        const W = Math.max(7, o * 4.5) * x, N = Math.atan2(B - O, E - z), V = 28 * Math.PI / 180;
        k.push(pt("path", { d: `M${E - W * Math.cos(N - V)},${B - W * Math.sin(N - V)} L${E},${B} L${E - W * Math.cos(N + V)},${B - W * Math.sin(N + V)}`, fill: "none", stroke: A, "stroke-width": w }));
      };
      s[1] !== "None" && G(P, D, _, p), s[0] !== "None" && G(_, p, P, D), t.svg.replaceChildren(...k);
    }, (h, m) => {
      i = l(h, m), !(Vn(e, i) < 3) && this.app.mutate(s[1] === "None" ? "Line" : "Arrow", { pages: [t.index] }, () => this.app.doc.addLine(t.index, e, i, r, o, s, this.app.settings.author)).catch((_) => H(_.message, "err"));
    });
  }
  async noteDown(n, t) {
    const e = this.app.doc.annots(n.index).length;
    await this.app.mutate("Add note", { pages: [n.index] }, () => this.app.doc.addNote(n.index, { x: t.x - 10, y: t.y + 10 }, "", this.app.settings.noteColor, this.app.settings.author));
    const r = this.app.doc.annots(n.index), o = r[r.length - 1];
    this.app.setTool("select"), o && r.length > e && (this.app.selectedAnnot = { page: n.index, index: o.index }, this.refreshOverlays(), this.onNoteCreated(n.index, o.index));
  }
  saved = [];
  activeSig = -1;
  get signature() {
    return this.saved[this.activeSig] || null;
  }
  onSignatures = () => {
  };
  loadSaved() {
    try {
      const n = JSON.parse(localStorage.getItem("margin.signatures") || "null"), t = localStorage.getItem("margin.signature");
      for (const e of n || (t ? [t] : [])) this.addSaved(e, false);
    } catch {
    }
  }
  persist() {
    try {
      localStorage.setItem("margin.signatures", JSON.stringify(this.saved.map((n) => n.url))), localStorage.removeItem("margin.signature");
    } catch {
    }
  }
  addSaved(n, t = true) {
    const e = { url: n, w: 1, h: 1 };
    this.saved.unshift(e), this.saved.length > 6 && (this.saved.length = 6), this.activeSig = 0;
    const r = new Image();
    r.onload = () => {
      const a = y("canvas", { width: r.width, height: r.height }).getContext("2d");
      a.drawImage(r, 0, 0), Object.assign(e, { rgba: a.getImageData(0, 0, r.width, r.height).data, w: r.width, h: r.height }), this.onSignatures();
    }, r.src = n, t && this.persist();
  }
  removeSaved(n) {
    this.saved.splice(n, 1), this.activeSig = this.saved.length ? Math.min(this.activeSig, this.saved.length - 1) : -1, this.persist(), this.onSignatures();
  }
  chooseSaved(n) {
    this.activeSig = n, this.onSignatures();
  }
  async chooseSignature() {
    if (!this.saved.length) return this.captureSignature();
    let n = this.activeSig;
    const t = y("div", { class: "sig-choices", role: "listbox", "aria-label": "Saved signatures" }), e = () => t.replaceChildren(...this.saved.map((o, a) => y("div", { class: "sig-choice" + (a === n ? " on" : ""), role: "option", "aria-selected": String(a === n), tabindex: "0", onclick: () => {
      n = a, e();
    }, ondblclick: () => document.querySelector(".modal .btn.primary")?.click() }, y("img", { src: o.url, alt: `Signature ${a + 1}` }), y("button", { class: "sig-del", type: "button", "aria-label": "Remove this signature", title: "Remove", text: "×", onclick: (s) => {
      s.stopPropagation(), this.removeSaved(a), n >= this.saved.length && (n = this.saved.length - 1), this.saved.length ? e() : document.querySelector('.modal .btn[data-id="new"]')?.click();
    } }))));
    e();
    const r = await nt({ title: "Choose a signature", body: y("div", { class: "stack" }, t, y("p", { class: "hint", text: "Pick one, then click the page where it should go. Signatures are saved in this browser only." })), actions: [{ id: "new", label: "Draw a new one" }, { id: "cancel", label: "Cancel" }, { id: "use", label: "Use selected", primary: true }], onOpen: (o) => o.querySelectorAll(".modal-actions .btn").forEach((a, s) => a.dataset.id = ["new", "cancel", "use"][s]) });
    return r === "new" ? this.captureSignature() : r === "use" && this.saved[n] ? (this.chooseSaved(n), true) : false;
  }
  async captureSignature() {
    const n = y("canvas", { class: "sigpad", width: 1040, height: 360, "aria-label": "Signature pad" }), t = n.getContext("2d");
    t.lineCap = "round", t.lineJoin = "round", t.strokeStyle = "#141a2e", t.lineWidth = 9;
    let e = false, r = false, o = null;
    const a = (m) => {
      const _ = n.getBoundingClientRect();
      return { x: (m.clientX - _.left) * (n.width / _.width), y: (m.clientY - _.top) * (n.height / _.height) };
    };
    n.addEventListener("pointerdown", (m) => {
      e = true, r = true, n.setPointerCapture(m.pointerId), o = a(m);
    }), n.addEventListener("pointermove", (m) => {
      if (!e || !o) return;
      const _ = a(m);
      t.beginPath(), t.moveTo(o.x, o.y), t.lineTo(_.x, _.y), t.stroke(), o = _;
    }), n.addEventListener("pointerup", () => {
      e = false, o = null;
    });
    const s = y("button", { class: "btn ghost small", type: "button", text: "Clear", onclick: () => {
      t.clearRect(0, 0, n.width, n.height), r = false;
    } }), i = y("div", { class: "sig-body" }, y("div", { class: "sigwrap" }, n, y("div", { class: "sigline" })), y("div", { class: "sig-row" }, y("span", { class: "hint", text: "Sign with a mouse, trackpad, or finger." }), s));
    if (await nt({ title: "Draw your signature", body: i, actions: [{ id: "cancel", label: "Cancel" }, { id: "use", label: "Use signature", primary: true }] }) !== "use") return false;
    if (!r) return H("Draw a signature first", "warn"), false;
    const h = fc(n);
    return h ? (this.addSaved(h.toDataURL("image/png")), await new Promise((m) => setTimeout(m, 60)), true) : false;
  }
  async signDown(n, t) {
    if (!this.signature && !await this.chooseSignature()) return;
    const e = this.signature;
    if (e.rgba || await new Promise((s) => setTimeout(s, 80)), !e.rgba) return H("The signature is still loading. Click again.", "warn");
    const r = 150, o = r * (e.h / e.w), a = { l: t.x - r / 2, r: t.x + r / 2, t: t.y + o / 2, b: t.y - o / 2 };
    await this.app.mutate("Place signature", { pages: [n.index] }, () => this.app.doc.addImageStamp(n.index, a, e.rgba, e.w, e.h, this.app.settings.author)).catch((s) => H(s.message, "err")), this.app.setTool("select");
  }
  async signField(n, t) {
    if ((this.saved.length > 1 || !this.signature) && !await this.chooseSignature()) return;
    const e = this.signature;
    if (e.rgba || await new Promise((p) => setTimeout(p, 120)), !e.rgba) return H("The signature is still loading. Click again.", "warn");
    const r = Math.min(4, (t.t - t.b) * 0.08), o = t.r - t.l - r * 2, a = t.t - t.b - r * 2, s = Math.min(o / e.w, a / e.h), i = e.w * s, l = e.h * s, h = (t.l + t.r) / 2, m = t.b + r + (a - l) * 0.35, _ = { l: h - i / 2, r: h + i / 2, b: m, t: m + l };
    await this.app.mutate("Sign field", { pages: [n.index] }, () => this.app.doc.addImageStamp(n.index, _, e.rgba, e.w, e.h, this.app.settings.author)).catch((p) => H(p.message, "err"));
  }
  async chooseImage() {
    const n = await gs();
    if (!n) return false;
    try {
      return this.setImage(await Eo(n, n.name)), true;
    } catch (t) {
      return H(t.message, "err"), false;
    }
  }
  setImage(n) {
    this.image && this.image !== n && (URL.revokeObjectURL(this.image.url), this.image.bitmap.close()), this.image = n, this.onImage();
  }
  scaleOf(n) {
    return n.ov.clientWidth / n.w || this.v.zoom;
  }
  imageDown(n, t) {
    if (!this.image) {
      n.preventDefault(), this.chooseImage();
      return;
    }
    const e = this.image, r = t.ov.getBoundingClientRect(), o = n.clientX - r.left, a = n.clientY - r.top;
    let s = { x: o, y: a };
    this.drag(n, t, (i, l) => {
      s = { x: l.clientX - r.left, y: l.clientY - r.top };
      const h = sa(e, o, a, s.x, s.y);
      t.svg.replaceChildren(pt("rect", { x: Math.min(o, s.x), y: Math.min(a, s.y), width: Math.abs(s.x - o), height: Math.abs(s.y - a), fill: "none", stroke: "var(--sel)", "stroke-dasharray": "4 3", opacity: 0.5 }), pt("image", { href: e.url, x: h.x, y: h.y, width: h.w, height: h.h, opacity: 0.75, preserveAspectRatio: "none" }));
    }, () => {
      const l = Math.abs(s.x - o) > 8 && Math.abs(s.y - a) > 8 ? sa(e, o, a, s.x, s.y) : aa(e, t, this.scaleOf(t), o, a);
      this.placeImage(t, e, l);
    });
  }
  async placeImage(n, t, e) {
    const r = this.scaleOf(n);
    try {
      const o = await Fs(t, e.w / r, e.h / r);
      let a = -1;
      await this.app.mutate("Insert image", { pages: [n.index] }, () => {
        a = this.app.doc.addImage(n.index, ps(n, e), o);
      }), this.arrange && a >= 0 && (this.arrange.sel = { page: n.index, key: "o" + a }, this.arrange.extra = [], this.app.setTool("arrange"));
    } catch (o) {
      H(o.message || "The image could not be placed", "err");
    }
  }
  async placeImageFile(n, t) {
    let e;
    try {
      e = await Eo(n, n.name || "Pasted image");
    } catch (s) {
      return H(s.message, "err");
    }
    let r = t?.pv, o, a;
    if (r && t) {
      const s = r.ov.getBoundingClientRect();
      o = t.clientX - s.left, a = t.clientY - s.top;
    } else {
      if (r = this.v.views[this.app.currentPage] || this.v.views[0], !r) return;
      const s = r.ov.getBoundingClientRect(), i = this.v.el.getBoundingClientRect(), l = Math.max(s.top, i.top), h = Math.min(s.bottom, i.bottom);
      o = s.width / 2, a = (h > l ? (l + h) / 2 : s.top + s.height / 2) - s.top;
    }
    await this.placeImage(r, e, aa(e, r, this.scaleOf(r), o, a)), URL.revokeObjectURL(e.url), e.bitmap.close();
  }
  editTextDown(n, t) {
    const e = n.target.closest(".tbox");
    if (!e) return;
    n.preventDefault();
    const r = +e.dataset.obj, o = Pn(this.v.textsOf(t)), a = o.find((w) => w.objs[0].index === r);
    if (!a) return;
    if (a.block) {
      const w = To(a);
      this.openEditor(t, { kind: "block", blockId: a.objs[0].margin.id, rd: w, scale: sr(w.bm) }, a.bounds);
      return;
    }
    const s = _c(o, a), i = s[0].objs[0], l = i.fontName.replace(/^[A-Z]{6}\+/, ""), h = /bold|black|heavy|semibold|demi/i.test(l), m = /italic|oblique/i.test(l) || Math.abs(i.matrix[2]) > 0.05 * Math.abs(i.matrix[3]), _ = pc(s.map((w) => w.text)), p = sr(i.matrix), P = Rr(i.matrix), D = Math.min(...s.map((w) => w.bounds.l)), x = s.length > 1, A = { v: 1, paras: [[{ t: _, ...h ? { b: h } : {}, ...m ? { i: m } : {} }]], font: rs(i.fontName, _), size: i.fontSize, color: On(i.color), align: "left", lh: x ? Math.max(1, (s[0].objs[0].matrix[5] - s[1].objs[0].matrix[5]) / (i.fontSize * p)) : 1.5, width: x ? (Math.max(...s.map((w) => w.bounds.r)) - D) / p * 1.02 : void 0, bm: x ? [P[0], P[1], P[2], P[3], D, P[5]] : P };
    this.openEditor(t, { kind: x ? "para" : "object", objs: s.flatMap((w) => w.objs), rd: A, scale: p }, Jt(s.map((w) => w.bounds)));
  }
  addTextDown(n, t) {
    const e = this.v.toPage(t, n);
    let r = e;
    this.drag(n, t, (o) => {
      r = o;
      const a = t.tf.box({ l: Math.min(e.x, o.x), r: Math.max(e.x, o.x), t: e.y, b: e.y - this.app.settings.textSize * 1.4 });
      t.svg.replaceChildren(pt("rect", { x: a.x, y: a.y, width: a.w, height: a.h, fill: "none", stroke: "var(--accent)", "stroke-dasharray": "4 3" }));
    }, () => {
      const o = { x: Math.min(e.x, r.x), y: e.y }, a = Math.abs(r.x - e.x) > 24;
      this.openNewEditor(t, o, a ? Math.abs(r.x - e.x) : void 0);
    });
  }
  openNewEditor(n, t, e) {
    const r = this.app.settings, o = Gr(r.textStyle), s = { v: 1, paras: [[{ t: "", ...o.bold ? { b: true } : {}, ...o.italic ? { i: true } : {}, ...o.underline ? { u: true } : {}, ...o.strike ? { s: true } : {} }]], font: r.textFont, size: r.textSize, color: On(r.textColor), align: r.textAlign, lh: r.textLh, width: e, bm: [1, 0, 0, 1, t.x, t.y] };
    this.openEditor(n, { kind: "new", at: t, rd: s, scale: 1 }, null);
  }
  openEditor(n, t, e) {
    const r = t.rd, o = y("div", { class: "editor rich", contenteditable: "true", spellcheck: "true", role: "textbox", "aria-multiline": "true", "aria-label": "Text" });
    o.innerHTML = lc(r, (i) => i * t.scale * this.v.zoom, (i) => Dr(ze(i))), n.ov.append(o);
    const a = r.paras[0]?.[0] || {};
    this.editor = { pv: n, el: o, ...t, fontKey: r.font, size: r.size, color: bs(r.color), align: r.align, lh: r.lh, style: { bold: !!a.b, italic: !!a.i, underline: !!a.u, strike: !!a.s }, bounds: e };
    try {
      document.execCommand("styleWithCSS", false, "false"), document.execCommand("defaultParagraphSeparator", false, "div");
    } catch {
    }
    this.styleEditor(), o.addEventListener("input", () => this.placeEditor()), o.addEventListener("paste", (i) => {
      i.preventDefault();
      const l = i.clipboardData?.getData("text/plain") || "";
      document.execCommand("insertText", false, l.replace(/\r/g, ""));
    }), o.addEventListener("keydown", (i) => {
      i.stopPropagation(), i.key === "Escape" ? (i.preventDefault(), this.cancelEditor()) : (i.metaKey || i.ctrlKey) && !i.altKey && ["b", "i", "u"].includes(i.key.toLowerCase()) && !i.shiftKey ? (i.preventDefault(), this.onFormatKey(i.key.toLowerCase())) : (i.metaKey || i.ctrlKey) && i.shiftKey && i.key.toLowerCase() === "x" ? (i.preventDefault(), this.onFormatKey("x")) : i.key === "Enter" && (i.metaKey || i.ctrlKey || t.kind === "object" && !i.shiftKey) && (i.preventDefault(), this.commitEditor());
    }), o.addEventListener("pointerdown", (i) => i.stopPropagation());
    const s = () => {
      const i = this.editor;
      if (!i || i.el !== o) {
        document.removeEventListener("selectionchange", s);
        return;
      }
      if (!o.contains(document.getSelection()?.anchorNode || null)) return;
      const l = document.getSelection();
      l.rangeCount && (i.range = l.getRangeAt(0).cloneRange());
      const h = (A) => {
        try {
          return document.queryCommandState(A);
        } catch {
          return false;
        }
      }, m = { bold: h("bold"), italic: h("italic"), underline: h("underline"), strike: h("strikeThrough") }, _ = this.listState(), p = document.getSelection()?.anchorNode, P = (p instanceof HTMLElement ? p : p?.parentElement) || null;
      let D = P?.closest("[data-f]")?.dataset.f, x = +(P?.closest("[data-z]")?.dataset.z || 0) || void 0;
      if ((!D || !x) && l.rangeCount && !l.isCollapsed) {
        const A = l.getRangeAt(0).cloneContents(), w = (k) => {
          const G = [...A.querySelectorAll(`[data-${k}]`)].map((E) => E.dataset[k]);
          return G.length && G.every((E) => E === G[0]) ? G[0] : void 0;
        };
        D ||= w("f"), x ||= +(w("z") || 0) || void 0;
      }
      (Mr(m) !== Mr(i.style) || _ !== i.list || D !== i.selFont || x !== i.selSize) && (i.style = m, i.list = _, i.selFont = D, i.selSize = x, this.onEditor(i));
    };
    document.addEventListener("selectionchange", s), this.onEditor(this.editor), requestAnimationFrame(() => {
      o.focus();
      const i = document.createRange();
      i.selectNodeContents(o), i.collapse(false);
      const l = document.getSelection();
      l?.removeAllRanges(), l?.addRange(i), this.placeEditor();
    }), an(on(ze(r.font), {})).then(() => this.placeEditor()).catch(() => {
    });
  }
  toggleList(n) {
    const t = this.editor;
    t && (t.el.focus(), document.execCommand(n === "b" ? "insertUnorderedList" : "insertOrderedList"), this.onEditor(t));
  }
  listState() {
    const n = (t) => {
      try {
        return document.queryCommandState(t);
      } catch {
        return false;
      }
    };
    return n("insertUnorderedList") ? "b" : n("insertOrderedList") ? "n" : null;
  }
  setEditorStyle(n) {
    const t = this.editor;
    if (!t) return;
    if (t.el.focus(), t.range && t.el.contains(t.range.startContainer)) {
      const o = document.getSelection();
      o?.removeAllRanges(), o?.addRange(t.range);
    }
    const e = document.getSelection(), r = !!e && !e.isCollapsed && t.el.contains(e.anchorNode);
    if (n.style) {
      const o = { bold: "bold", italic: "italic", underline: "underline", strike: "strikeThrough" };
      for (const a of Object.keys(o)) n.style[a] !== void 0 && !!n.style[a] != !!t.style[a] && document.execCommand(o[a]);
      t.style = { ...t.style, ...n.style };
    }
    n.color && (r ? document.execCommand("foreColor", false, "#" + On(n.color)) : t.color = n.color), n.fontKey && (r && ha(t.el, "f", n.fontKey, Dr(ze(n.fontKey))) ? (t.selFont = n.fontKey, an(on(ze(n.fontKey), {})).catch(() => {
    }), delete n.fontKey) : t.fontKey = n.fontKey), n.size && (r && ha(t.el, "z", String(n.size), n.size * t.scale * this.v.zoom + "px") ? (t.selSize = n.size, delete n.size) : t.size = n.size);
    {
      const o = document.getSelection();
      o?.rangeCount && t.el.contains(o.anchorNode) && (t.range = o.getRangeAt(0).cloneRange());
    }
    n.align && (t.align = n.align), n.lh && (t.lh = n.lh), this.styleEditor(), n.fontKey && an(on(ze(t.fontKey), {})).then(() => this.placeEditor()).catch((o) => H(o.message, "err")), this.onEditor(t);
  }
  styleEditor() {
    const n = this.editor;
    if (!n) return;
    const t = ze(n.fontKey), e = this.v.zoom, r = n.size * n.scale * e;
    Object.assign(n.el.style, { fontFamily: Dr(t), fontSize: r + "px", color: Mn(n.color), lineHeight: String(n.lh), textAlign: n.align, whiteSpace: n.rd.width ? "pre-wrap" : "pre", width: n.rd.width ? n.rd.width * n.scale * e + "px" : "auto" }), this.placeEditor();
  }
  placeEditor() {
    const n = this.editor;
    if (!n) return;
    const t = this.v.zoom, e = n.size * n.scale * t, r = n.lh * e;
    let o, a;
    if (n.kind === "new") {
      const [i, l] = this.v.toDev(n.pv, n.at.x, n.at.y);
      o = i, a = l + 0.8 * e;
    } else [o, a] = this.v.toDev(n.pv, n.rd.bm[4], n.rd.bm[5]);
    const s = a - ((r - 1.2 * e) / 2 + 0.92 * e) - 3;
    n.el.style.left = o - 4 + "px", n.el.style.top = s + "px", n.rd.width || (n.el.style.width = "auto", n.el.style.minWidth = Math.max(40, (n.bounds ? this.v.zoom * (n.bounds.r - n.bounds.l) : 0) + 8) + "px");
  }
  cancelEditor() {
    const n = this.editor;
    n && (this.editor = null, n.el.remove(), this.onEditor(null), this.overlay(n.pv));
  }
  editorDoc(n) {
    const t = uc(n.el, On(n.color), n.fontKey, n.size), e = t.paras.map(Go), r = t.lists.some(Boolean) ? t.lists : void 0, o = { ...n.rd, paras: e, font: n.fontKey, size: n.size, color: On(n.color), align: n.align, lh: n.lh };
    return r ? o.lists = r : delete o.lists, o;
  }
  async commitEditor() {
    const n = this.editor;
    if (!n) return;
    const t = this.editorDoc(n);
    this.editor = null, n.el.remove(), this.onEditor(null);
    const e = this.app.doc, r = n.pv.index, o = ur(t), a = gc(t, n.rd);
    try {
      if (n.kind === "new") {
        if (!o.trim()) return this.overlay(n.pv);
        const s = await this.newBlockMatrix(n), i = Ds(t).key !== t.font;
        await this.app.mutate("Add text", { pages: [r] }, async () => {
          await tr(e, r, { ...t, bm: s });
        }), i && H(`${ze(t.font).label} can't show these characters, so Margin used Sarabun.`, "warn", 4200);
      } else if (n.kind === "block") {
        if (a) return this.overlay(n.pv);
        await this.app.mutate("Edit text", { pages: [r] }, async () => {
          gt(e, r, n.blockId), o.trim() && await tr(e, r, t);
        });
      } else {
        if (a) return this.overlay(n.pv);
        const s = n.objs, i = s[0], l = s.map((m) => m.index), h = t.paras.length === 1 && t.paras[0].length === 1 && Fc(t.paras[0][0], n.rd.paras[0][0]) && t.font === n.rd.font && t.size === n.rd.size && t.color === n.rd.color;
        await this.app.mutate("Edit text", { pages: [r] }, async () => {
          if (!o.trim()) return Fn(e, r, l);
          n.kind === "object" && h && s.length === 1 && !ar(o) && ts(e, r, i.index, o) || (Fn(e, r, l), await tr(e, r, t));
        });
      }
    } catch (s) {
      H(s.message || "Edit failed", "err"), this.overlay(n.pv);
    }
  }
  async newBlockMatrix(n) {
    const t = n.pv, e = t.inv, [r, o] = e.apply(0, 0), [a, s] = e.apply(1, 0), [i, l] = e.apply(0, 1);
    let h = a - r, m = s - o;
    const _ = Math.hypot(h, m);
    h /= _, m /= _;
    let p = -(i - r), P = -(l - o);
    const D = Math.hypot(p, P);
    p /= D, P /= D;
    const A = ((await $t(ze(n.fontKey)).catch(() => null))?.ascent ?? 0.8) * n.size, w = n.at;
    return [h, m, p, P, w.x - p * A, w.y - P * A];
  }
}
function Pn(u) {
  const n = [], t = /* @__PURE__ */ new Map(), e = [];
  for (const l of u) if (l.margin?.id) {
    const h = t.get(l.margin.id) || [];
    h.push(l), t.set(l.margin.id, h);
  } else e.push(l);
  for (const l of t.values()) {
    l.sort((_, p) => _.margin.ln - p.margin.ln);
    const h = l.find((_) => _.margin.rt)?.margin.rt, m = h ? Mo(h) : null;
    n.push({ objs: l, bounds: Jt(l.map((_) => _.bounds)), block: true, text: m ? ur(m) : l.map((_) => _.text).join(`
`) });
  }
  const r = (l) => l.fontSize * sr(l.matrix), o = (l) => Math.abs(l.matrix[1]) < 1e-3 && Math.abs(l.matrix[2]) < 1e-3 && l.matrix[0] > 0 && l.matrix[3] > 0, a = e.filter((l) => !o(l));
  for (const l of a) n.push({ objs: [l], bounds: l.bounds, block: false, text: l.text });
  const s = e.filter(o).sort((l, h) => h.matrix[5] - l.matrix[5] || l.matrix[4] - h.matrix[4]), i = [];
  for (const l of s) {
    const h = i.find((m) => Math.abs(m[0].matrix[5] - l.matrix[5]) < r(m[0]) * 0.2 && Math.abs(r(m[0]) - r(l)) < r(m[0]) * 0.15);
    h ? h.push(l) : i.push([l]);
  }
  for (const l of i) {
    l.sort((_, p) => _.bounds.l - p.bounds.l);
    let h = [];
    const m = () => {
      if (h.length) {
        if (!da(h).trim()) {
          h = [];
          return;
        }
        n.push({ objs: h, bounds: Jt(h.map((_) => _.bounds)), block: false, text: da(h) }), h = [];
      }
    };
    for (const _ of l) {
      const p = h[h.length - 1];
      p && (_.bounds.l - p.bounds.r > r(p) * 1.6 || _.color.slice(0, 3).join() !== p.color.slice(0, 3).join() || _.fontName !== p.fontName) && m(), h.push(_);
    }
    m();
  }
  return n;
}
function da(u) {
  let n = "", t = null;
  for (const e of u) if (e.text) {
    if (t) {
      if (e.bounds.l >= t.bounds.l - 0.6 && e.bounds.r <= t.bounds.r + 0.6 && e.text.trim() === t.text.trim()) {
        /\s$/.test(e.text) && !/\s$/.test(n) && (n += " ");
        continue;
      }
      const o = e.bounds.l - t.bounds.r, a = e.fontSize * sr(e.matrix);
      o > a * 0.22 && !/\s$/.test(n) && !/^\s/.test(e.text) && (n += " ");
    }
    n += /\s$/.test(n) ? e.text.replace(/^\s+/, "") : e.text, t = e;
  }
  return n.replace(/\s+$/, "");
}
const sr = (u) => Math.hypot(u[0], u[1]) || 1;
function Rr(u) {
  const [n, t, e, r, o, a] = u, s = n * n + t * t || 1, i = (n * e + t * r) / s;
  return [n, t, e - i * n, r - i * t, o, a];
}
const fn = (u, n) => ({ l: Math.min(u.x, n.x), r: Math.max(u.x, n.x), b: Math.min(u.y, n.y), t: Math.max(u.y, n.y) });
function mc(u, n) {
  if (u.length < 3) return u;
  const t = new Uint8Array(u.length);
  t[0] = t[u.length - 1] = 1;
  const e = [[0, u.length - 1]];
  for (; e.length; ) {
    const [r, o] = e.pop();
    let a = 0, s = -1;
    for (let i = r + 1; i < o; i++) {
      const l = u[r], h = u[o], m = u[i], _ = h.x - l.x, p = h.y - l.y, P = Math.hypot(_, p) || 1, D = Math.abs(p * m.x - _ * m.y + h.x * l.y - h.y * l.x) / P;
      D > a && (a = D, s = i);
    }
    a > n && s > 0 && (t[s] = 1, e.push([r, s], [s, o]));
  }
  return u.filter((r, o) => t[o]);
}
function fc(u) {
  const n = u.getContext("2d"), { data: t, width: e, height: r } = n.getImageData(0, 0, u.width, u.height);
  let o = e, a = 0, s = r, i = 0;
  for (let m = 0; m < r; m++) for (let _ = 0; _ < e; _++) t[(m * e + _) * 4 + 3] > 8 && (_ < o && (o = _), _ > a && (a = _), m < s && (s = m), m > i && (i = m));
  if (a <= o || i <= s) return null;
  const l = 6;
  o = Math.max(0, o - l), s = Math.max(0, s - l), a = Math.min(e - 1, a + l), i = Math.min(r - 1, i + l);
  const h = y("canvas", { width: a - o + 1, height: i - s + 1 });
  return h.getContext("2d").drawImage(u, o, s, a - o + 1, i - s + 1, 0, 0, a - o + 1, i - s + 1), h;
}
const Jr = { select: { label: "Select", key: "V", icon: "select", hint: "Select, move or delete annotations. Fill form fields." }, arrange: { label: "Move & resize", key: "A", icon: "arrange", hint: "Click text, an image or an annotation. Drag to move, drag a corner to resize. Alt turns off snapping." }, edittext: { label: "Edit text", key: "E", icon: "edittext", hint: "Click any text on the page to edit it." }, addtext: { label: "Add text", key: "T", icon: "addtext", hint: "Click where the new text should start." }, highlight: { label: "Highlight", key: "H", icon: "highlight", hint: "Drag across text to highlight it." }, underline: { label: "Underline", key: "U", icon: "underline", hint: "Drag across text to underline it." }, strike: { label: "Strikeout", key: "K", icon: "strike", hint: "Drag across text to strike it out." }, draw: { label: "Draw", key: "D", icon: "draw", hint: "Draw freehand on the page." }, rect: { label: "Rectangle", key: "R", icon: "rect", hint: "Drag to draw a rectangle." }, form: { label: "Form field", key: "F", icon: "formfield", hint: "Pick a field type, then drag a box (or click). Click a field to rename it, change its options or delete it." }, redact: { label: "Redact", key: "X", icon: "redact", hint: "Sweep across text or drag over an area to mark it. Nothing is removed until you apply." }, link: { label: "Link", key: "G", icon: "link", hint: "Sweep across text or drag a box to add a link. Click a link to edit or remove it." }, stamp: { label: "Stamp", key: "P", icon: "stamp", hint: "Pick a stamp, then click the page." }, textbox: { label: "Text box & callout", key: "B", icon: "textbox", hint: "Drag a box, or click, then type. Double-click a text box with Select to edit it." }, line: { label: "Line & arrow", key: "L", icon: "line", hint: "Drag to draw. Shift keeps it to 45° steps." }, ellipse: { label: "Ellipse", key: "O", icon: "ellipse", hint: "Drag to draw an ellipse." }, note: { label: "Note", key: "N", icon: "note", hint: "Click to pin a sticky note." }, sign: { label: "Signature", key: "S", icon: "sign", hint: "Click the page where the signature should go." }, crop: { label: "Crop pages", key: "C", icon: "crop", hint: "Drag a rectangle around the part of the page to keep." }, image: { label: "Image", key: "I", icon: "image", hint: "Click to place at natural size, or drag a box to size it. You can also paste or drop an image." } };
async function ws(u, n, t, e) {
  if (t.block) {
    const h = t.objs[0], m = h.margin;
    if (gt(u, n, m.id), !e.trim()) return;
    const _ = m.bm || Rr(h.matrix), p = m.color ? hc(m.color) : h.color;
    await Tr(u, n, { lines: e.split(`
`), fontKey: m.font || "sarabun", size: m.size || h.fontSize, color: p, matrix: _, ...Gr(m.st), align: m.al || "left", lineHeight: m.lh || 1.5 });
    return;
  }
  const r = t.objs, o = r[0], a = r.map((h) => h.index), s = e.replace(/\n+/g, " ");
  if (!s.trim()) return Fn(u, n, a);
  if (r.length === 1 && !ar(s) && ts(u, n, o.index, s)) return;
  const i = o.fontName.replace(/^[A-Z]{6}\+/, ""), l = { bold: /bold|black|heavy|semibold|demi/i.test(i), italic: /italic|oblique/i.test(i) || Math.abs(o.matrix[2]) > 0.05 * Math.abs(o.matrix[3]) };
  Fn(u, n, a), await Tr(u, n, { lines: [s], fontKey: rs(o.fontName, s), size: o.fontSize, color: o.color, matrix: Rr(o.matrix), ...l });
}
function To(u) {
  const n = u.objs.find((i) => i.margin?.rt), t = n ? Mo(n.margin.rt) : null;
  if (t) return t;
  const e = u.objs[0], r = e.margin, o = /* @__PURE__ */ new Map();
  for (const i of u.objs) o.set(i.margin.ln, (o.get(i.margin.ln) || "") + i.text);
  const a = Math.max(...o.keys()) + 1, s = [];
  for (let i = 0; i < a; i++) s.push(o.get(i) || "");
  return oc(s, { font: r.font || "sarabun", size: r.size || e.fontSize, color: r.color || On(e.color), st: r.st || "", align: r.al || "left", lh: r.lh || 1.5, bm: r.bm || Rr(e.matrix) });
}
function _c(u, n) {
  const t = (i) => {
    const l = i.objs[0];
    return { font: l.fontName, size: l.fontSize * sr(l.matrix), color: l.color.slice(0, 3).join(), left: i.bounds.l, base: l.matrix[5] };
  }, e = t(n), r = (i) => i.objs.every((l) => Math.abs(l.matrix[1]) < 1e-3 && Math.abs(l.matrix[2]) < 1e-3 && l.matrix[0] > 0 && l.matrix[3] > 0);
  if (!r(n)) return [n];
  const o = u.filter((i) => {
    if (i.block || !r(i)) return false;
    const l = t(i);
    return l.font === e.font && Math.abs(l.size - e.size) < e.size * 0.05 && l.color === e.color && Math.abs(l.left - e.left) < Math.max(2, e.size * 0.3);
  }).sort((i, l) => t(l).base - t(i).base), a = (i) => i.bounds.r - i.bounds.l, s = [];
  for (const i of o) {
    const l = s[s.length - 1], h = l?.[l.length - 1];
    let m = !!h;
    if (h) {
      const _ = t(h).base - t(i).base;
      if (_ < e.size * 0.9 || _ > e.size * 2.2) m = false;
      else if (l.length > 1) {
        const p = t(l[l.length - 2]).base - t(h).base;
        Math.abs(p - _) > e.size * 0.25 && (m = false);
      }
      m && a(h) < Math.max(...l.map(a)) * 0.8 && l.length > 1 && (m = false), m && l.length === 1 && a(h) < a(i) * 0.6 && (m = false);
    }
    m ? l.push(i) : s.push([i]);
  }
  return s.find((i) => i.includes(n)) || [n];
}
function pc(u) {
  let n = "";
  for (const t of u.map((e) => e.trim())) {
    if (!n) {
      n = t;
      continue;
    }
    const e = n[n.length - 1], r = t[0];
    if (e === "-" && /[a-z]/i.test(r)) {
      n = n.slice(0, -1) + t;
      continue;
    }
    n += /[\u0E00-\u0E7F]/.test(e) && /[\u0E00-\u0E7F]/.test(r) ? t : " " + t;
  }
  return n;
}
const Fc = (u, n) => !!u?.b == !!n?.b && !!u?.i == !!n?.i && !!u?.u == !!n?.u && !!u?.s == !!n?.s && (u?.c || "") === (n?.c || "");
function gc(u, n) {
  const t = (e) => JSON.stringify({ p: e.paras.map((r) => Go(r).map((o) => ({ ...o }))), f: e.font, s: e.size, c: e.color, a: e.align, l: e.lh, w: e.width || 0, li: (e.lists || []).map((r) => r || "").join(",").replace(/,+$/, "") });
  return t(u) === t(n);
}

export { Jr, Pn, To, dc, ws };
