import { init as ji } from '@embedpdf/pdfium';

const Q = { TEXT: 1, LINK: 2, FREETEXT: 3, LINE: 4, SQUARE: 5, CIRCLE: 6, HIGHLIGHT: 9, UNDERLINE: 10, SQUIGGLY: 11, STRIKEOUT: 12, STAMP: 13, INK: 15, POPUP: 16, WIDGET: 20, REDACT: 28 };
const Zn = { 1: "Note", 3: "Text box", 4: "Line", 5: "Rectangle", 6: "Ellipse", 9: "Highlight", 10: "Underline", 11: "Squiggly", 12: "Strikeout", 13: "Stamp", 15: "Drawing", 28: "Redaction" };
const ye = { PUSHBUTTON: 1, CHECKBOX: 2, RADIO: 3, COMBO: 4, LIST: 5, TEXT: 6, SIGNATURE: 7 };
const Xo = 17;
function Ua(u) {
  let n = "";
  for (let t = 0; t < u.length; t += 32768) n += String.fromCharCode.apply(null, u.subarray(t, t + 32768));
  return n;
}
function za(u) {
  const n = Ua(u);
  if (!n.includes("/MarginOn") && !n.includes("/MarginSig")) return u;
  const t = u.slice(), e = /(\d+ \d+ obj)([\s\S]*?)endobj/g;
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const s of n.matchAll(/(\d+ \d+) obj((?:(?!endobj)[\s\S])*?\/MarginSig[\s\S]*?)endobj/g)) {
    const i = s[2].match(/\/Parent\s*(\d+ \d+) R/);
    i && o.add(i[1]);
  }
  const a = (s, i) => {
    for (let l = 0; l < i.length; l++) t[s + l] = i.charCodeAt(l) & 255;
  };
  for (; r = e.exec(n); ) {
    const s = r[2];
    if (o.has(r[1].replace(/ obj$/, "")) || /\/MarginSig\s*\(/.test(s)) {
      let m = s.replace(/\/MarginSig\s*\((?:[^()\\]|\\.)*\)/, "").replace(/\/Ff\s*8388608\b/, "").replace(/\/FT\s*\/Tx\b/, "/FT/Sig").replace(/\/DA\s*\((?:[^()\\]|\\.)*\)/, "");
      m.length > s.length && (m = m.replace(/\/Kids\s*\[\s+/, "/Kids[").replace(/\/T\s+\(/, "/T(")), m.length <= s.length && a(r.index + r[1].length, m + " ".repeat(s.length - m.length));
      continue;
    }
    const i = s.match(/\/MarginOn\s*\(((?:[^()\\]|\\.)*)\)/);
    if (!i) continue;
    const l = i[1].replace(/\\(.)/g, "$1").trim().replace(/[^A-Za-z0-9_.-]/g, "").slice(0, 24) || "On";
    let h = s.replace(i[0], "").replace(/\/Yes\b/g, "/" + l);
    h.length > s.length || a(r.index + r[1].length, h + " ".repeat(s.length - h.length));
  }
  return t;
}
function qo(u) {
  const n = (s) => (Math.round(s * 100) / 100).toString(), t = u.r - u.l, e = u.t - u.b, r = Math.min(8, t * 0.06), o = u.b + Math.max(4, e * 0.28), a = Math.min(7, e * 0.18);
  return [`q 0.47 0.49 0.53 RG 0.75 w ${n(u.l + 0.4)} ${n(u.b + 0.4)} ${n(t - 0.8)} ${n(e - 0.8)} re S`, `0.35 0.37 0.42 RG 0.6 w ${n(u.l + r)} ${n(o)} m ${n(u.r - r)} ${n(o)} l S`, `0.9 w ${n(u.l + r)} ${n(o + 3)} m ${n(u.l + r + a)} ${n(o + 3 + a)} l ${n(u.l + r)} ${n(o + 3 + a)} m ${n(u.l + r + a)} ${n(o + 3)} l S Q`].join(`
`);
}
function Bi(u) {
  const n = /* @__PURE__ */ new Map(), t = (r) => r === 32 || r === 10 || r === 13 || r === 9 || r === 12 || r === 0, e = (r) => r >= 48 && r <= 57;
  for (let r = u.indexOf(111, 4); r >= 0; r = u.indexOf(111, r + 1)) {
    if (u[r + 1] !== 98 || u[r + 2] !== 106 || u[r - 1] !== 32) continue;
    let o = r - 2;
    if (!e(u[o])) continue;
    for (; o > 0 && e(u[o - 1]); ) o--;
    if (u[o - 1] !== 32) continue;
    let a = o - 2;
    if (!e(u[a])) continue;
    for (; a > 0 && e(u[a - 1]); ) a--;
    if (a > 0 && !t(u[a - 1])) continue;
    let s = 0;
    for (let i = a; i < o - 1; i++) s = s * 10 + u[i] - 48;
    n.set(s, a);
  }
  return n;
}
function Ni(u, n, t, e) {
  try {
    const r = n.length;
    let o = -1;
    for (let O = r - 4; O > 0; O--) if (n[O] === 120 && n[O + 1] === 114 && n[O + 2] === 101 && n[O + 3] === 102 && (n[O - 1] === 10 || n[O - 1] === 13)) {
      o = O;
      break;
    }
    if (o < 0) return n;
    const a = Ua(n.subarray(o)), s = a.indexOf("trailer");
    if (s < 0) return n;
    const i = a.slice(4, s).trim().split(/\r\n|\r|\n/).map((O) => O.trim()).filter(Boolean), l = [];
    for (let O = 0; O < i.length; ) {
      const W = i[O++].split(/\s+/);
      if (W.length !== 2) return n;
      const N = +W[0], V = +W[1];
      for (let q = 0; q < V; q++) {
        const Y = (i[O++] || "").split(/\s+/);
        if (Y.length !== 3) return n;
        l.push({ num: N + q, off: +Y[0], gen: Y[1], t: Y[2] });
      }
    }
    const h = a.slice(s, a.indexOf("startxref")), m = l.filter((O) => O.t === "n").sort((O, W) => O.off - W.off), _ = u.length;
    if (m.some((O) => O.off < _ || O.off - _ >= o)) return n;
    const p = [];
    let P = 0;
    for (let O = 0; O < m.length; O++) {
      const W = m[O], N = W.off - _, V = O + 1 < m.length ? m[O + 1].off - _ : o, q = n.subarray(N, V);
      let Y = -1;
      for (let ee = q.length - 6; ee >= 0; ee--) if (q[ee] === 101 && q[ee + 1] === 110 && q[ee + 2] === 100 && q[ee + 3] === 111 && q[ee + 4] === 98 && q[ee + 5] === 106) {
        Y = ee + 6;
        break;
      }
      const ne = t.get(W.num);
      let J = Y > 0 && ne != null && ne + Y <= _;
      if (J) {
        for (let ee = 0; ee < Y; ee++) if (u[ne + ee] !== q[ee]) {
          J = false;
          break;
        }
      }
      J ? P++ : p.push({ e: W, bytes: q });
    }
    if (!P) {
      for (const O of m) e?.set(O.num, O.off);
      return n;
    }
    const D = n.subarray(0, m.length ? m[0].off - _ : o), x = [D];
    let A = D.length;
    const w = /* @__PURE__ */ new Map();
    for (const O of p) w.set(O.e.num, _ + A), e?.set(O.e.num, _ + A), x.push(O.bytes), A += O.bytes.length;
    const k = l.filter((O) => O.t !== "n" || w.has(O.num)).sort((O, W) => O.num - W.num);
    let G = `xref\r
`;
    for (let O = 0; O < k.length; ) {
      let W = O;
      for (; W + 1 < k.length && k[W + 1].num === k[W].num + 1; ) W++;
      G += `${k[O].num} ${W - O + 1}\r
`;
      for (let N = O; N <= W; N++) {
        const V = k[N];
        G += `${String(V.t === "n" ? w.get(V.num) : V.off).padStart(10, "0")} ${V.gen.padStart(5, "0")} ${V.t}\r
`;
      }
      O = W + 1;
    }
    G += h + `startxref\r
${_ + A}\r
%%EOF\r
`;
    const E = new Uint8Array(G.length);
    for (let O = 0; O < G.length; O++) E[O] = G.charCodeAt(O) & 255;
    x.push(E), A += E.length;
    const B = new Uint8Array(A);
    let z = 0;
    for (const O of x) B.set(O, z), z += O.length;
    return B;
  } catch {
    return n;
  }
}
function $i(u) {
  const n = new TextDecoder("latin1").decode(u);
  if (n.indexOf("/Parent") < 0) return u;
  const t = /* @__PURE__ */ new Set();
  for (const e of n.matchAll(/(?:^|[\r\n\s])(\d+)\s+(\d+)\s+obj\b/g)) t.add(e[1] + " " + e[2]);
  for (const e of n.matchAll(/\/Parent\s*(\d+)\s+(\d+)\s+R/g)) t.has(e[1] + " " + e[2]) || u.fill(32, e.index, e.index + e[0].length);
  return u;
}
class So {
  P;
  M;
  constructor(n) {
    this.P = n, this.M = n.pdfium, n.PDFiumExt_Init();
  }
  static async load(n) {
    const t = await ji({ wasmBinary: n });
    return new So(t);
  }
  alloc(n) {
    return this.M.wasmExports.malloc(Math.max(1, n));
  }
  free(n) {
    n && this.M.wasmExports.free(n);
  }
  bytes(n) {
    const t = this.alloc(n.length);
    return this.M.HEAPU8.set(n, t), t;
  }
  wstr(n) {
    const t = (n.length + 1) * 2, e = this.alloc(t);
    return this.M.stringToUTF16(n, e, t), e;
  }
  floats(n) {
    const t = this.alloc(n.length * 4);
    return n.forEach((e, r) => this.M.setValue(t + r * 4, e, "float")), t;
  }
  readFloats(n, t) {
    const e = [];
    for (let r = 0; r < t; r++) e.push(this.M.getValue(n + r * 4, "float"));
    return e;
  }
  readDoubles(n, t) {
    const e = [];
    for (let r = 0; r < t; r++) e.push(this.M.getValue(n + r * 8, "double"));
    return e;
  }
  readU32(n, t) {
    const e = [];
    for (let r = 0; r < t; r++) e.push(this.M.getValue(n + r * 4, "i32") >>> 0);
    return e;
  }
  readW(n) {
    const t = n(0, 0);
    if (!t || t <= 2) return "";
    const e = this.alloc(t);
    n(e, t);
    const r = this.M.UTF16ToString(e);
    return this.free(e), r;
  }
  tmp(n) {
    const t = [], e = (r) => {
      const o = this.alloc(r);
      return t.push(o), o;
    };
    try {
      return n(e);
    } finally {
      t.forEach((r) => this.free(r));
    }
  }
  open(n, t = "") {
    const e = this.source(n), r = this.P.FPDF_LoadCustomDocument(e.fa, t);
    if (!r) {
      const o = this.P.FPDF_GetLastError();
      throw this.dropSource(e), new rr(o);
    }
    return new Yo(this, r, e);
  }
  source(n) {
    if (n.length > 4294967295) throw new Error("Files over 4 GB can’t be opened");
    const t = this.M, e = t.addFunction((o, a, s, i) => (a >>>= 0, i >>>= 0, s >>>= 0, a + i > n.length ? 0 : (t.HEAPU8.set(n.subarray(a, a + i), s), 1)), "iiiii"), r = this.alloc(12);
    return t.setValue(r, n.length | 0, "i32"), t.setValue(r + 4, e, "i32"), t.setValue(r + 8, 0, "i32"), { bytes: n, fa: r, cb: e };
  }
  dropSource(n) {
    this.M.removeFunction(n.cb), this.free(n.fa);
  }
  create() {
    return new Yo(this, this.P.FPDF_CreateNewDocument(), null);
  }
}
const wo = (u) => /Aborted|out of memory|Cannot enlarge memory/i.test(String(u?.message ?? u));
const Ha = "The PDF engine ran out of memory: this file is too large to edit in a browser tab. Reload Margin to keep working.";
class rr extends Error {
  code;
  constructor(n) {
    super({ 1: "Unknown error", 2: "File not found", 3: "Not a PDF or the file is damaged", 4: "Password required", 5: "Unsupported security scheme", 6: "Page not found" }[n] || "Could not open the PDF"), this.code = n;
  }
}
const zn = { None: 0, OpenArrow: 4, ClosedArrow: 5 };
const Ui = { 0: "None", 4: "OpenArrow", 5: "ClosedArrow" };
const Ue = (u) => (Math.abs(u) < 1e-4 ? 0 : u).toFixed(3).replace(/\.?0+$/, "") || "0";
class Yo {
  lib;
  P;
  h;
  src;
  form;
  finfo;
  imported = false;
  loaded = /* @__PURE__ */ new Set();
  depth = 0;
  constructor(n, t, e) {
    this.lib = n, this.P = n.P, this.h = t, this.src = e, this.finfo = this.P.PDFiumExt_OpenFormFillInfo(), this.form = this.P.PDFiumExt_InitFormFillEnvironment(t, this.finfo), this.form && this.P.FPDF_SetFormFieldHighlightColor(this.form, 0, 0);
  }
  close() {
    this.h && (this.form && this.P.PDFiumExt_ExitFormFillEnvironment(this.form), this.finfo && this.P.PDFiumExt_CloseFormFillInfo(this.finfo), this.P.FPDF_CloseDocument(this.h), this.src && this.lib.dropSource(this.src), this.form = 0, this.finfo = 0, this.src = null, this.h = 0);
  }
  swap(n, t = "", e, r = "") {
    this.close();
    const o = this.lib, a = this.P, s = (l) => {
      const h = o.source(l), m = a.FPDF_LoadCustomDocument(h.fa, t);
      return m || o.dropSource(h), m ? { h: m, src: h } : null;
    }, i = s(n) || (e ? s(e) : null);
    if (!i) throw new rr(a.FPDF_GetLastError());
    this.h = i.h, this.src = i.src, this.imported = false, this.loaded.clear(), r && a.EPDF_UnlockOwnerPermissions(this.h, r), this.finfo = a.PDFiumExt_OpenFormFillInfo(), this.form = a.PDFiumExt_InitFormFillEnvironment(this.h, this.finfo), this.form && a.FPDF_SetFormFieldHighlightColor(this.form, 0, 0);
  }
  get pageCount() {
    return this.P.FPDF_GetPageCount(this.h);
  }
  withPage(n, t, e = {}) {
    const r = this.P.FPDF_LoadPage(this.h, n);
    if (!r) throw new rr(6);
    this.loaded.add(n), this.depth++, this.form && this.P.FORM_OnAfterLoadPage(r, this.form);
    const o = e.text ? this.P.FPDFText_LoadPage(r) : 0;
    try {
      return t(r, o);
    } finally {
      o && this.P.FPDFText_ClosePage(o), this.form && this.P.FORM_OnBeforeClosePage(r, this.form), this.P.FPDF_ClosePage(r), this.depth--;
    }
  }
  pageSize(n) {
    const t = this.lib, e = t.alloc(8);
    try {
      if (this.P.FPDF_GetPageSizeByIndexF(this.h, n, e)) return { w: t.M.getValue(e, "float"), h: t.M.getValue(e + 4, "float") };
    } finally {
      t.free(e);
    }
    return this.withPage(n, (r) => ({ w: this.P.FPDF_GetPageWidthF(r), h: this.P.FPDF_GetPageHeightF(r) }));
  }
  pageBoxes(n) {
    const t = this.P, e = this.lib;
    return this.withPage(n, (r) => e.tmp((o) => {
      const a = o(16), s = (m) => t[m](r, a, a + 4, a + 8, a + 12) ? (([_, p, P, D]) => ({ l: Math.min(_, P), b: Math.min(p, D), r: Math.max(_, P), t: Math.max(p, D) }))(e.readFloats(a, 4)) : null, i = s("FPDFPage_GetMediaBox") || { l: 0, b: 0, r: t.FPDF_GetPageWidthF(r), t: t.FPDF_GetPageHeightF(r) }, l = s("FPDFPage_GetCropBox"), h = l ? { l: Math.max(l.l, i.l), b: Math.max(l.b, i.b), r: Math.min(l.r, i.r), t: Math.min(l.t, i.t) } : i;
      return { media: i, crop: h };
    }));
  }
  setCropBox(n, t) {
    const e = t || this.pageBoxes(n).media;
    this.withPage(n, (r) => this.P.FPDFPage_SetCropBox(r, e.l, e.b, e.r, e.t));
  }
  transform(n, t, e) {
    const o = this.lib;
    return this.withPage(n, (a) => o.tmp((s) => {
      const i = s(4), l = s(4), h = (P, D) => (this.P.FPDF_PageToDevice(a, 0, 0, Math.round(t * 64), Math.round(e * 64), 0, P, D, i, l), [o.M.getValue(i, "i32") / 64, o.M.getValue(l, "i32") / 64]), m = h(0, 0), _ = h(1e3, 0), p = h(0, 1e3);
      return new yt((_[0] - m[0]) / 1e3, (_[1] - m[1]) / 1e3, (p[0] - m[0]) / 1e3, (p[1] - m[1]) / 1e3, m[0], m[1]);
    }));
  }
  render(n, t, e, r = {}) {
    t = Math.max(1, Math.round(t)), e = Math.max(1, Math.round(e));
    const o = (r.annots === false ? Xo & -2 : Xo) | (r.print ? 2048 : 0);
    return this.withPage(n, (a) => {
      const s = this.P.FPDFBitmap_Create(t, e, 1);
      this.P.FPDFBitmap_FillRect(s, 0, 0, t, e, 4294967295), this.P.FPDF_RenderPageBitmap(s, a, 0, 0, t, e, 0, o), this.form && this.P.FPDF_FFLDraw(this.form, s, a, 0, 0, t, e, 0, o | 1);
      const i = this.P.FPDFBitmap_GetStride(s), l = this.P.FPDFBitmap_GetBuffer(s), h = this.lib.M.HEAPU8, m = new ImageData(t, e);
      if (i === t * 4) m.data.set(h.subarray(l, l + t * e * 4));
      else for (let _ = 0; _ < e; _++) m.data.set(h.subarray(l + _ * i, l + _ * i + t * 4), _ * t * 4);
      return this.P.FPDFBitmap_Destroy(s), m;
    });
  }
  save() {
    const n = this.write(0, 0);
    if (!n) throw new Error("PDFium could not write the file");
    return this.imported ? $i(n) : n;
  }
  write(n, t) {
    const e = this.P, r = this.lib, o = r.M;
    this.form && e.FORM_ForceToKillFocus(this.form);
    const a = this.src?.bytes;
    let s = new Uint8Array(t ? 0 : Math.max(65536, (a?.length ?? 0) + (1 << 20))), i = 0, l = 0, h = true;
    const m = [], _ = o.addFunction((D, x, A) => {
      x >>>= 0, A >>>= 0;
      const w = o.HEAPU8;
      if (l < t && a) {
        const G = Math.min(A, t - l, 32);
        for (let E = 0; E < G; E++) if (w[x + E] !== a[l + E]) {
          h = false;
          break;
        }
      }
      const k = Math.max(l, t);
      if (l + A > k) {
        const G = w.subarray(x + (k - l), x + A);
        if (t) m.push(G.slice());
        else {
          if (i + G.length > s.length) {
            const E = new Uint8Array(Math.max(i + G.length, Math.floor(s.length * 1.5)));
            E.set(s.subarray(0, i)), s = E;
          }
          s.set(G, i);
        }
        i += G.length;
      }
      return l += A, 1;
    }, "iiii"), p = r.alloc(8);
    o.setValue(p, 1, "i32"), o.setValue(p + 4, _, "i32");
    let P = false;
    try {
      P = !!e.FPDF_SaveAsCopy(this.h, p, n);
    } finally {
      o.removeFunction(_), r.free(p);
    }
    if (!P || !h || l < t) return null;
    if (t) {
      const D = new Uint8Array(i);
      let x = 0;
      for (const A of m) D.set(A, x), x += A.length;
      return D;
    }
    return i === s.length ? s : s.slice(0, i);
  }
  saveDelta(n) {
    return !this.src || this.src.bytes.length !== n ? null : this.write(1, n);
  }
  restackObjects(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPage_CountObjects(a), i = new Set(t);
      if (!t.length) return false;
      const l = (w) => o.tmp((k) => {
        const G = k(16);
        r.FPDFPageObj_GetBounds(w, G, G + 4, G + 8, G + 12);
        const [E, B, z, O] = o.readFloats(G, 4);
        return { l: E, b: B, r: z, t: O };
      }), h = [...i].sort((w, k) => w - k).map((w) => r.FPDFPage_GetObject(a, w)), m = h.map(l).reduce((w, k) => ({ l: Math.min(w.l, k.l), b: Math.min(w.b, k.b), r: Math.max(w.r, k.r), t: Math.max(w.t, k.t) })), _ = (w) => {
        const k = l(r.FPDFPage_GetObject(a, w));
        return k.l < m.r && k.r > m.l && k.b < m.t && k.t > m.b;
      }, p = Math.min(...i), P = Math.max(...i);
      let D = -1;
      if (e === "front") {
        if (P === s - 1 && i.size === P - p + 1) return false;
        D = s - 1;
      } else if (e === "back") {
        if (p === 0 && i.size === P - p + 1) return false;
        D = -1;
      } else if (e === "forward") {
        for (let w = P + 1; w < s; w++) if (!i.has(w) && _(w)) {
          D = w;
          break;
        }
        if (D < 0) return false;
      } else {
        let w = false;
        for (let k = p - 1; k >= 0; k--) if (!i.has(k) && _(k)) {
          D = k - 1, w = true;
          break;
        }
        if (!w) return false;
      }
      const x = [...i].filter((w) => w <= D).length;
      let A = D - x + 1;
      for (let w = h.length - 1; w >= 0; w--) r.FPDFPage_RemoveObject(a, h[w]);
      for (const w of h) r.FPDFPage_InsertObjectAtIndex(a, w, A++);
      return r.FPDFPage_GenerateContent(a), true;
    });
  }
  restackAnnots(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnotCount(a), i = new Set(t.filter((w) => w >= 0 && w < s));
      if (!i.size) return false;
      const l = (w) => {
        const k = r.FPDFPage_GetAnnot(a, w);
        try {
          return { r: ft(o, k), st: r.FPDFAnnot_GetSubtype(k) };
        } finally {
          r.FPDFPage_CloseAnnot(k);
        }
      }, h = [...i].sort((w, k) => w - k), m = h.map((w) => l(w).r).reduce((w, k) => ({ l: Math.min(w.l, k.l), b: Math.min(w.b, k.b), r: Math.max(w.r, k.r), t: Math.max(w.t, k.t) })), _ = (w) => {
        const { r: k, st: G } = l(w);
        return G !== Q.POPUP && k.l < m.r && k.r > m.l && k.b < m.t && k.t > m.b;
      }, p = h[0], P = h[h.length - 1], D = P - p + 1 === h.length;
      let x = -1;
      if (e === "front") {
        if (P === s - 1 && D) return false;
        x = s - h.length;
      } else if (e === "back") {
        if (p === 0 && D) return false;
        x = 0;
      } else if (e === "forward") {
        for (let w = P + 1; w < s; w++) if (!i.has(w) && _(w)) {
          x = w - h.length + 1;
          break;
        }
      } else for (let w = p - 1; w >= 0; w--) if (!i.has(w) && _(w)) {
        x = w;
        break;
      }
      if (x < 0) return false;
      const A = o.alloc(4 * h.length);
      h.forEach((w, k) => o.M.setValue(A + 4 * k, w, "i32"));
      try {
        return !!r.EPDFPage_MoveAnnots(a, A, h.length, x);
      } finally {
        o.free(A);
      }
    });
  }
  outline() {
    const n = this.P, t = this.lib, e = /* @__PURE__ */ new Set(), r = (o, a, s) => {
      const i = [];
      if (s > 32) return i;
      for (let l = n.FPDFBookmark_GetFirstChild(this.h, o), h = 0; l && i.length < 5e3 && !e.has(l); l = n.FPDFBookmark_GetNextSibling(this.h, l), h++) {
        e.add(l);
        const m = [...a, h], _ = this.bmTarget(l);
        i.push({ title: t.readW((p, P) => n.FPDFBookmark_GetTitle(l, p, P)), ..._, path: m, children: r(l, m, s + 1) });
      }
      return i;
    };
    return r(0, [], 0);
  }
  bmTarget(n) {
    const t = this.P, e = this.lib;
    let r = t.FPDFBookmark_GetDest(this.h, n), o = null;
    if (!r) {
      const i = t.FPDFBookmark_GetAction(n);
      if (i) {
        const l = t.FPDFAction_GetType(i);
        if (l === 1) r = t.FPDFAction_GetDest(this.h, i);
        else if (l === 3) {
          const h = t.FPDFAction_GetURIPath(this.h, i, 0, 0);
          if (h > 1) {
            const m = e.alloc(h);
            t.FPDFAction_GetURIPath(this.h, i, m, h), o = e.M.UTF8ToString(m), e.free(m);
          }
        }
      }
    }
    if (!r) return { page: -1, top: null, uri: o };
    const a = t.FPDFDest_GetDestPageIndex(this.h, r), s = e.alloc(24);
    try {
      const l = t.FPDFDest_GetLocationInPage(r, s, s + 4, s + 8, s + 12, s + 16, s + 20) && e.M.getValue(s + 4, "i32") ? e.M.getValue(s + 16, "float") : null;
      return { page: a, top: l, uri: o };
    } finally {
      e.free(s);
    }
  }
  bmAt(n) {
    let t = 0;
    for (const e of n) {
      let r = this.P.FPDFBookmark_GetFirstChild(this.h, t);
      for (let o = 0; o < e && r; o++) r = this.P.FPDFBookmark_GetNextSibling(this.h, r);
      if (!r) return 0;
      t = r;
    }
    return t;
  }
  bmChild(n, t) {
    let e = this.P.FPDFBookmark_GetFirstChild(this.h, n);
    for (let r = 0; r < t && e; r++) e = this.P.FPDFBookmark_GetNextSibling(this.h, e);
    return e;
  }
  bmInsert(n, t, e) {
    const r = this.P, o = this.lib, a = n.length ? this.bmAt(n) : 0;
    if (n.length && !a) throw new Error("That bookmark no longer exists");
    const s = o.wstr(e);
    try {
      return t <= 0 ? r.EPDFBookmark_InsertAfter(this.h, a, 0, s) : r.EPDFBookmark_InsertAfter(this.h, a, this.bmChild(a, t - 1), s);
    } finally {
      o.free(s);
    }
  }
  addBookmark(n, t, e, r, o) {
    const a = this.bmInsert(n, t, e);
    if (!a) throw new Error("The bookmark could not be added");
    this.withPage(r, (s) => {
      const i = this.P.EPDFDest_CreateXYZ(s, false, 0, o != null, o ?? 0, false, 0);
      if (!i || !this.P.EPDFBookmark_SetDest(this.h, a, i)) throw new Error("The bookmark’s page could not be set");
    });
  }
  renameBookmark(n, t) {
    const e = this.bmAt(n);
    if (!e) throw new Error("That bookmark no longer exists");
    const r = this.lib.wstr(t);
    try {
      if (!this.P.EPDFBookmark_SetTitle(e, r)) throw new Error("The bookmark could not be renamed");
    } finally {
      this.lib.free(r);
    }
  }
  retargetBookmark(n, t, e) {
    const r = this.bmAt(n);
    if (!r) throw new Error("That bookmark no longer exists");
    this.withPage(t, (o) => {
      const a = this.P.EPDFDest_CreateXYZ(o, false, 0, e != null, e ?? 0, false, 0);
      this.P.EPDFBookmark_ClearTarget(r), this.P.EPDFBookmark_SetDest(this.h, r, a);
    });
  }
  deleteBookmark(n) {
    const t = this.bmAt(n);
    if (!t || !this.P.EPDFBookmark_Delete(this.h, t)) throw new Error("The bookmark could not be deleted");
  }
  moveBookmark(n, t, e) {
    const r = this.P, o = this.lib;
    if (t.length >= n.length && n.every((h, m) => t[m] === h)) throw new Error("A bookmark can’t go inside itself");
    const a = this.bmAt(n);
    if (!a) throw new Error("That bookmark no longer exists");
    const s = (h, m) => {
      const _ = r.FPDFBookmark_GetDest(this.h, h), p = r.FPDFBookmark_GetAction(h);
      _ ? r.EPDFBookmark_SetDest(this.h, m, _) : p && r.EPDFBookmark_SetAction(this.h, m, p);
      for (let P = r.FPDFBookmark_GetFirstChild(this.h, h); P; P = r.FPDFBookmark_GetNextSibling(this.h, P)) {
        const D = o.wstr(o.readW((A, w) => r.FPDFBookmark_GetTitle(P, A, w))), x = r.EPDFBookmark_AppendChild(this.h, m, D);
        o.free(D), x && s(P, x);
      }
    }, i = o.readW((h, m) => r.FPDFBookmark_GetTitle(a, h, m)), l = this.bmInsert(t, e, i);
    if (!l) throw new Error("The bookmark could not be moved");
    s(a, l), r.EPDFBookmark_Delete(this.h, a);
  }
  security() {
    const n = this.P.FPDF_GetSecurityHandlerRevision(this.h);
    return { encrypted: n > 0, revision: n, perms: this.P.FPDF_GetDocPermissions(this.h) >>> 0 };
  }
  unlockOwner(n) {
    return !!this.P.EPDF_UnlockOwnerPermissions(this.h, n);
  }
  setProtection(n, t, e) {
    return !!this.P.EPDF_SetEncryption(this.h, n, t, e | 0);
  }
  removeProtection() {
    return !!this.P.EPDF_RemoveEncryption(this.h);
  }
  rotate(n, t) {
    this.withPage(n, (e) => {
      this.P.FPDFPage_SetRotation(e, ((this.P.FPDFPage_GetRotation(e) + t) % 4 + 4) % 4);
    });
  }
  deletePage(n) {
    this.P.FPDFPage_Delete(this.h, n);
  }
  insertBlank(n, t, e) {
    const r = this.P.FPDFPage_New(this.h, n, t, e);
    this.P.FPDF_ClosePage(r);
  }
  movePages(n, t) {
    return this.lib.tmp((e) => {
      const r = e(n.length * 4);
      return n.forEach((o, a) => this.lib.M.setValue(r + a * 4, o, "i32")), !!this.P.FPDF_MovePages(this.h, r, n.length, t);
    });
  }
  importAll(n, t) {
    return this.imported = true, !!this.P.FPDF_ImportPagesByIndex(this.h, n.h, 0, 0, t);
  }
  importIndices(n, t, e) {
    return this.imported = true, this.lib.tmp((r) => {
      const o = r(t.length * 4);
      return t.forEach((a, s) => this.lib.M.setValue(o + s * 4, a, "i32")), !!this.P.FPDF_ImportPagesByIndex(this.h, n.h, o, t.length, e);
    });
  }
  textObjects(n) {
    const t = this.P, e = this.lib;
    return this.withPage(n, (r, o) => {
      const a = [], s = t.FPDFPage_CountObjects(r);
      for (let i = 0; i < s; i++) {
        const l = t.FPDFPage_GetObject(r, i);
        if (t.FPDFPageObj_GetType(l) !== 1) continue;
        const h = e.readW((P, D) => t.FPDFTextObj_GetText(l, o, P, D)), m = e.tmp((P) => {
          const D = P(16);
          t.FPDFPageObj_GetBounds(l, D, D + 4, D + 8, D + 12);
          const [x, A, w, k] = e.readFloats(D, 4), G = P(4);
          t.FPDFTextObj_GetFontSize(l, G);
          const E = P(16);
          t.FPDFPageObj_GetFillColor(l, E, E + 4, E + 8, E + 12);
          const B = P(24);
          t.FPDFPageObj_GetMatrix(l, B);
          const z = t.FPDFTextObj_GetFont(l);
          let O = "";
          if (z) {
            const W = P(256);
            O = t.FPDFFont_GetBaseFontName(z, W, 256) ? e.M.UTF8ToString(W) : "";
          }
          return { bounds: { l: x, b: A, r: w, t: k }, fontSize: e.readFloats(G, 1)[0], color: e.readU32(E, 4), matrix: e.readFloats(B, 6), fontName: O };
        }), _ = rn(e, l, "MarginText"), p = t.FPDFTextObj_GetTextRenderMode(l) === 3;
        p && !_ || a.push({ index: i, text: h, ...m, invisible: p, margin: _ || void 0 });
      }
      return a;
    }, { text: true });
  }
  pageWords(n, t) {
    const e = this.P, r = this.lib;
    return this.withPage(n, (o, a) => {
      const s = e.FPDFText_CountChars(a);
      if (s <= 0) return [];
      const i = r.tmp((h) => {
        const m = h((s + 1) * 2);
        return e.FPDFText_GetText(a, 0, s, m), r.M.UTF16ToString(m);
      }), l = [];
      return r.tmp((h) => {
        const m = h(32);
        for (const _ of i.matchAll(/[A-Za-z\u00C0-\u024F]+(?:['’][A-Za-z]+)*/g)) {
          const p = _[0];
          if (!t(p)) continue;
          const P = _.index, D = e.FPDFText_CountRects(a, P, p.length), x = [];
          for (let k = 0; k < D; k++) {
            e.FPDFText_GetRect(a, k, m, m + 8, m + 16, m + 24);
            const [G, E, B, z] = r.readDoubles(m, 4);
            x.push({ l: G, t: E, r: B, b: z });
          }
          const A = Math.max(0, P - 30), w = Math.min(i.length, P + p.length + 30);
          l.push({ word: p, rects: x, context: (A > 0 ? "…" : "") + i.slice(A, w).replace(/\s+/g, " ") + (w < i.length ? "…" : "") });
        }
      }), l;
    }, { text: true });
  }
  selectionRects(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a, s) => {
      let i = r.FPDFText_GetCharIndexAtPos(s, t.x, t.y, 6, 6), l = r.FPDFText_GetCharIndexAtPos(s, e.x, e.y, 6, 6);
      if (i < 0 || l < 0) return { rects: [], text: "" };
      i > l && ([i, l] = [l, i]);
      const h = l - i + 1, m = r.FPDFText_CountRects(s, i, h), _ = [];
      o.tmp((P) => {
        const D = P(32);
        for (let x = 0; x < m; x++) {
          r.FPDFText_GetRect(s, x, D, D + 8, D + 16, D + 24);
          const [A, w, k, G] = o.readDoubles(D, 4);
          _.push({ l: A, t: w, r: k, b: G });
        }
      });
      const p = o.tmp((P) => {
        const D = P((h + 1) * 2);
        return r.FPDFText_GetText(s, i, h, D), o.M.UTF16ToString(D);
      });
      return { rects: _, text: p };
    }, { text: true });
  }
  search(n, t = {}) {
    const e = this.P, r = this.lib, o = [];
    if (!n) return o;
    const a = (t.matchCase ? 1 : 0) | (t.wholeWord ? 2 : 0), s = r.wstr(n);
    try {
      for (let i = 0; i < this.pageCount; i++) this.withPage(i, (l, h) => {
        const m = e.FPDFText_FindStart(h, s, a, 0);
        m && (r.tmp((_) => {
          const p = _(32);
          for (; e.FPDFText_FindNext(m); ) {
            const P = e.FPDFText_GetSchResultIndex(m), D = e.FPDFText_GetSchCount(m), x = e.FPDFText_CountRects(h, P, D), A = [];
            for (let w = 0; w < x; w++) {
              e.FPDFText_GetRect(h, w, p, p + 8, p + 16, p + 24);
              const [k, G, E, B] = r.readDoubles(p, 4);
              A.push({ l: k, t: G, r: E, b: B });
            }
            if (A.length && o.push({ page: i, rects: A }), o.length > 2e3) break;
          }
        }), e.FPDFText_FindClose(m));
      }, { text: true });
    } finally {
      r.free(s);
    }
    return o;
  }
  annots(n) {
    const t = this.P, e = this.lib;
    return this.withPage(n, (r) => {
      const o = [], a = t.FPDFPage_GetAnnotCount(r);
      for (let s = 0; s < a; s++) {
        const i = t.FPDFPage_GetAnnot(r, s);
        try {
          const l = t.FPDFAnnot_GetSubtype(i);
          if (l === Q.POPUP || l === Q.LINK || l === Q.WIDGET) continue;
          const h = ft(e, i), m = e.tmp((D) => {
            const x = D(16);
            return t.EPDFAnnot_GetColor(i, 0, x, x + 4, x + 8) ? [...e.readU32(x, 3), 255] : t.FPDFAnnot_GetColor(i, 0, x, x + 4, x + 8, x + 12) ? e.readU32(x, 4) : null;
          }), _ = (D) => e.readW((x, A) => t.FPDFAnnot_GetStringValue(i, D, x, A)), p = { index: s, subtype: l, rect: h, color: m, contents: _("Contents"), author: _("T"), modified: _("M"), isMargin: _("NM").startsWith("margin-") };
          l === Q.LINE && (p.line = this.readLine(i) || void 0);
          const P = t.FPDFAnnot_GetLinkedAnnot(i, "IRT");
          if (P) {
            const D = t.FPDFPage_GetAnnotIndex(r, P);
            t.FPDFPage_CloseAnnot(P), D >= 0 && (p.irt = D);
          }
          if (l === Q.FREETEXT) try {
            const D = JSON.parse(_("MarginFT"));
            D?.box && (p.ft = { box: D.box, tip: D.tip });
          } catch {
          }
          o.push(p);
        } finally {
          t.FPDFPage_CloseAnnot(i);
        }
      }
      return o;
    });
  }
  newAnnot(n, t, e, r) {
    const o = this.P, a = this.lib, s = o.FPDFPage_CreateAnnot(n, t);
    if (!s) throw new Error("Could not create annotation");
    e && o.FPDFAnnot_SetColor(s, 0, e[0], e[1], e[2], e[3]);
    const i = (l, h) => {
      const m = a.wstr(h);
      o.FPDFAnnot_SetStringValue(s, l, m), a.free(m);
    };
    return i("T", r), i("M", _r()), i("NM", "margin-" + Math.random().toString(36).slice(2, 10)), o.FPDFAnnot_SetFlags(s, 4), s;
  }
  addMarkup(n, t, e, r, o, a = "") {
    const s = this.P, i = this.lib;
    this.withPage(n, (l) => {
      const h = this.newAnnot(l, t, r, o);
      try {
        for (const _ of e) {
          const p = i.floats([_.l, _.t, _.r, _.t, _.l, _.b, _.r, _.b]);
          s.FPDFAnnot_AppendAttachmentPoints(h, p), i.free(p);
        }
        const m = Jt(e);
        if (tt(i, h, m), a) {
          const _ = i.wstr(a);
          s.FPDFAnnot_SetStringValue(h, "Contents", _), i.free(_);
        }
        s.EPDFAnnot_GenerateAppearance(h);
      } finally {
        s.FPDFPage_CloseAnnot(h);
      }
    });
  }
  addInk(n, t, e, r, o) {
    const a = this.P, s = this.lib;
    this.withPage(n, (i) => {
      const l = this.newAnnot(i, Q.INK, e, o);
      try {
        a.FPDFAnnot_SetBorder(l, 0, 0, r);
        for (const _ of t) {
          const p = s.floats(_.flatMap((P) => [P.x, P.y]));
          a.FPDFAnnot_AddInkStroke(l, p, _.length), s.free(p);
        }
        const h = t.flat(), m = r;
        tt(s, l, { l: Math.min(...h.map((_) => _.x)) - m, r: Math.max(...h.map((_) => _.x)) + m, b: Math.min(...h.map((_) => _.y)) - m, t: Math.max(...h.map((_) => _.y)) + m }), a.EPDFAnnot_GenerateAppearance(l);
      } finally {
        a.FPDFPage_CloseAnnot(l);
      }
    });
  }
  addShape(n, t, e, r, o, a, c = {}) {
    const s = this.P, i = this.lib;
    this.withPage(n, (l) => {
      const h = this.newAnnot(l, t, r, a);
      try {
        s.FPDFAnnot_SetBorder(h, 0, 0, o), s.EPDFAnnot_SetBorderStyle(h, 1, o), tt(i, h, e);
        c.fill && s.EPDFAnnot_SetColor(h, 1, c.fill[0], c.fill[1], c.fill[2]);
        c.opacity != null && c.opacity < 1 && s.EPDFAnnot_SetOpacity(h, Math.round(Math.max(0.05, c.opacity) * 255));
        this.shapeAP(h);
      } finally {
        s.FPDFPage_CloseAnnot(h);
      }
    });
  }
  readLine(n) {
    const t = this.lib;
    return t.tmp((e) => {
      const r = e(16);
      if (!this.P.FPDFAnnot_GetLine(n, r, r + 8)) return null;
      const [o, a, s, i] = t.readFloats(r, 4);
      return [{ x: o, y: a }, { x: s, y: i }];
    });
  }
  writeLine(n, t, e) {
    const r = this.lib, o = r.floats([t.x, t.y]), a = r.floats([e.x, e.y]);
    this.P.EPDFAnnot_SetLine(n, o, a), r.free(o), r.free(a);
  }
  /** Rectangles and ellipses get Margin's own appearance: PDFium's strokes black when the outline
   *  colour (/C) is absent, but no /C means "no outline". Drawn in page space; BBox == Rect. */
  shapeAP(n) {
    const t = this.P, e = this.lib, r = ft(e, n), o = this.readStyle(n), a = e.tmp((x) => {
      const A = x(12);
      return t.EPDFAnnot_GetColor(n, 0, A, A + 4, A + 8) ? e.readU32(A, 3) : null;
    }), s = a && o.width > 0 ? o.width : 0, i = s / 2, l = r.l + i, h = r.r - i, m = r.b + i, _ = r.t - i;
    if (h - l <= 0 || _ - m <= 0) return;
    const p = (x) => x.slice(0, 3).map((A) => Ue(A / 255)).join(" "), P = o.dashed && s ? `[${Ue(Math.max(3, s * 3))} ${Ue(Math.max(2, s * 2))}] 0 d ` : "";
    let D;
    if (t.FPDFAnnot_GetSubtype(n) === Q.CIRCLE) {
      const x = (l + h) / 2, A = (m + _) / 2, w = (h - l) / 2, k = (_ - m) / 2, G = 0.5523;
      D = `${Ue(x + w)} ${Ue(A)} m ${Ue(x + w)} ${Ue(A + k * G)} ${Ue(x + w * G)} ${Ue(A + k)} ${Ue(x)} ${Ue(A + k)} c ${Ue(x - w * G)} ${Ue(A + k)} ${Ue(x - w)} ${Ue(A + k * G)} ${Ue(x - w)} ${Ue(A)} c ${Ue(x - w)} ${Ue(A - k * G)} ${Ue(x - w * G)} ${Ue(A - k)} ${Ue(x)} ${Ue(A - k)} c ${Ue(x + w * G)} ${Ue(A - k)} ${Ue(x + w)} ${Ue(A - k * G)} ${Ue(x + w)} ${Ue(A)} c h`;
    } else D = `${Ue(l)} ${Ue(m)} ${Ue(h - l)} ${Ue(_ - m)} re`;
    const x = o.fill ? s ? "B" : "f" : s ? "S" : "n", A = `q ${t.FPDFAnnot_HasKey(n, "CA") ? "/GS gs " : ""}${o.fill ? p(o.fill) + " rg " : ""}${s ? `${p(a)} RG ${Ue(s)} w 0 j ${P}` : ""}${D} ${x} Q`, w = e.wstr(A);
    t.FPDFAnnot_SetAP(n, 0, w), e.free(w);
  }
  /** Redraw an annotation's appearance after a change, by kind. */
  regenAP(n) {
    const t = this.P, e = t.FPDFAnnot_GetSubtype(n);
    e === Q.LINE ? this.lineAP(n) : e === Q.SQUARE || e === Q.CIRCLE ? this.shapeAP(n) : e !== Q.STAMP && e !== Q.FREETEXT && !this.isDrawn(n) && t.EPDFAnnot_GenerateAppearance(n);
  }
  lineAP(n) {
    const t = this.P, e = this.lib, r = this.readLine(n);
    if (!r) return;
    const [o, a] = r, s = e.tmp((z) => {
      const O = z(12);
      return t.FPDFAnnot_GetBorder(n, O, O + 4, O + 8) ? e.readFloats(O + 8, 1)[0] : 1;
    }) || 1, i = e.tmp((z) => {
      const O = z(12);
      return t.EPDFAnnot_GetColor(n, 0, O, O + 4, O + 8) ? e.readU32(O, 3) : [0, 0, 0];
    }), l = e.tmp((z) => {
      const O = z(8);
      return t.EPDFAnnot_GetLineEndings(n, O, O + 4) ? [e.M.getValue(O, "i32"), e.M.getValue(O + 4, "i32")] : [0, 0];
    }), h = e.tmp((z) => {
      const O = z(8);
      if (t.EPDFAnnot_GetBorderStyle(n, O) !== 2) return "";
      const W = t.EPDFAnnot_GetBorderDashPatternCount(n);
      if (W <= 0 || W > 8) return `[${Ue(s * 3)} ${Ue(s * 2)}] 0 d `;
      const N = z(W * 4);
      return t.EPDFAnnot_GetBorderDashPattern(n, N, W), `[${e.readFloats(N, W).map(Ue).join(" ")}] 0 d `;
    }), m = t.FPDFAnnot_HasKey(n, "CA") ? "/GS gs " : "", _ = i.map((z) => Ue(z / 255)).join(" "), p = Math.max(7, s * 4.5), P = 28 * Math.PI / 180, D = [o, a], x = [];
    let A = o, w = a;
    const k = (z, O, W) => {
      if (W !== 4 && W !== 5) return z;
      const N = z.x - O.x, V = z.y - O.y, q = Math.hypot(N, V) || 1, Y = N / q, ne = V / q, J = (de) => {
        const oe = Math.cos(P), fe = Math.sin(P) * de;
        return { x: z.x - p * (Y * oe - ne * fe), y: z.y - p * (ne * oe + Y * fe) };
      }, ee = J(1), ae = J(-1);
      return D.push(ee, ae), x.push(`${Ue(ee.x)} ${Ue(ee.y)} m ${Ue(z.x)} ${Ue(z.y)} l ${Ue(ae.x)} ${Ue(ae.y)} l ${W === 5 ? "h B" : "S"}`), W === 5 ? { x: z.x - Y * p * Math.cos(P) * 0.9, y: z.y - ne * p * Math.cos(P) * 0.9 } : z;
    };
    A = k(o, a, l[0]), w = k(a, o, l[1]);
    const G = s / 2 + 1.5;
    tt(e, n, { l: Math.min(...D.map((z) => z.x)) - G, r: Math.max(...D.map((z) => z.x)) + G, b: Math.min(...D.map((z) => z.y)) - G, t: Math.max(...D.map((z) => z.y)) + G });
    const E = `q ${m}${_} RG ${_} rg ${Ue(s)} w ${h ? "0 J" : "1 J"} 1 j ${h}${Ue(A.x)} ${Ue(A.y)} m ${Ue(w.x)} ${Ue(w.y)} l S 0 J 0 j ${h ? "[] 0 d " : ""}${x.join(" ")} Q`, B = e.wstr(E);
    t.FPDFAnnot_SetAP(n, 0, B), e.free(B);
  }
  addLine(n, t, e, r, o, a, s) {
    const i = this.P;
    this.withPage(n, (l) => {
      const h = this.newAnnot(l, Q.LINE, null, s);
      try {
        i.EPDFAnnot_SetColor(h, 0, r[0], r[1], r[2]), i.FPDFAnnot_SetBorder(h, 0, 0, o), this.writeLine(h, t, e), i.EPDFAnnot_SetLineEndings(h, zn[a[0]], zn[a[1]]), tt(this.lib, h, { l: Math.min(t.x, e.x), r: Math.max(t.x, e.x), b: Math.min(t.y, e.y), t: Math.max(t.y, e.y) }), this.lineAP(h);
      } finally {
        i.FPDFPage_CloseAnnot(h);
      }
    });
  }
  createFreeText(n, t) {
    return this.withPage(n, (e) => {
      const r = this.newAnnot(e, Q.FREETEXT, null, t);
      return this.P.FPDFPage_CloseAnnot(r), this.P.FPDFPage_GetAnnotCount(e) - 1;
    });
  }
  writeFreeText(n, t, e, r, o) {
    const a = this.P, s = this.lib;
    this.withPage(n, (i) => {
      const l = a.FPDFPage_GetAnnot(i, t);
      try {
        const h = (p, P) => {
          const D = s.wstr(P);
          a.FPDFAnnot_SetStringValue(l, p, D), s.free(D);
        };
        h("Contents", e.text), h("M", _r()), h("MarginFT", JSON.stringify(e));
        const m = e.style.color;
        if (a.EPDFAnnot_SetDefaultAppearance(l, 4, e.style.size, m[0], m[1], m[2]), e.style.border ? a.EPDFAnnot_SetColor(l, 0, e.style.border[0], e.style.border[1], e.style.border[2]) : a.EPDFAnnot_ClearColor(l, 0), e.style.fill ? a.EPDFAnnot_SetColor(l, 1, e.style.fill[0], e.style.fill[1], e.style.fill[2]) : a.EPDFAnnot_ClearColor(l, 1), a.FPDFAnnot_SetBorder(l, 0, 0, e.style.border ? e.style.borderWidth : 0), tt(s, l, r), a.EPDFAnnot_SetRectangleDifferences(l, e.box.l - r.l, r.t - e.box.t, r.r - e.box.r, e.box.b - r.b), e.tip) {
          const p = vo(e.box, e.tip), P = s.floats([e.tip.x, e.tip.y, p.x, p.y]);
          a.EPDFAnnot_SetCalloutLine(l, P, 2), s.free(P), a.EPDFAnnot_SetIntent(l, "FreeTextCallout"), a.EPDFAnnot_SetLineEndings(l, zn.OpenArrow, 0);
        } else a.EPDFAnnot_SetCalloutLine(l, 0, 0), a.EPDFAnnot_SetIntent(l, "FreeText");
        const _ = s.wstr(o);
        a.FPDFAnnot_SetAP(l, 0, _), s.free(_);
      } finally {
        a.FPDFPage_CloseAnnot(l);
      }
    });
  }
  readFreeText(n, t) {
    const e = this.P, r = this.lib;
    return this.withPage(n, (o) => {
      const a = e.FPDFPage_GetAnnot(o, t);
      try {
        if (e.FPDFAnnot_GetSubtype(a) !== Q.FREETEXT) return null;
        const s = (p) => r.readW((P, D) => e.FPDFAnnot_GetStringValue(a, p, P, D));
        try {
          const p = JSON.parse(s("MarginFT"));
          if (p?.box && p?.style) return { ...p, text: s("Contents") };
        } catch {
        }
        const i = ft(r, a), l = s("DA"), h = +(l.match(/([\d.]+)\s+Tf/)?.[1] || 12) || 12, m = l.match(/([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+rg/), _ = m ? [Math.round(+m[1] * 255), Math.round(+m[2] * 255), Math.round(+m[3] * 255), 255] : [0, 0, 0, 255];
        return { box: i, text: s("Contents"), style: { fontKey: "sarabun", size: h, color: _, fill: null, border: null, borderWidth: 1 } };
      } finally {
        e.FPDFPage_CloseAnnot(a);
      }
    });
  }
  flattenCounts() {
    const n = this.P;
    let t = 0, e = 0;
    for (let r = 0; r < this.pageCount; r++) this.withPage(r, (o) => {
      const a = n.FPDFPage_GetAnnotCount(o);
      for (let s = 0; s < a; s++) {
        const i = n.FPDFPage_GetAnnot(o, s), l = n.FPDFAnnot_GetSubtype(i);
        n.FPDFPage_CloseAnnot(i), l === Q.WIDGET ? e++ : l !== Q.LINK && l !== Q.POPUP && l !== Q.REDACT && t++;
      }
    });
    return { annots: t, fields: e };
  }
  flatten(n) {
    const t = this.P, e = this.lib;
    let r = 0, o = 0;
    this.form && t.FORM_ForceToKillFocus(this.form);
    for (let a = 0; a < this.pageCount; a++) this.withPage(a, (s) => {
      for (let i = t.FPDFPage_GetAnnotCount(s) - 1; i >= 0; i--) {
        const l = t.FPDFPage_GetAnnot(s, i);
        if (!l) continue;
        const h = t.FPDFAnnot_GetSubtype(l);
        let m = false, _ = false;
        try {
          if (h === Q.LINK || h === Q.REDACT || (h === Q.WIDGET ? !n.fields : !n.annots)) continue;
          if (h === Q.POPUP || t.FPDFAnnot_GetFlags(l) & 2) {
            m = true;
            continue;
          }
          if (_ = !!t.EPDFAnnot_Flatten(s, l), !_ && h === Q.WIDGET) {
            const p = t.FPDFAnnot_GetFormFieldType(this.form, l);
            if (p === ye.CHECKBOX || p === ye.RADIO) {
              const P = ft(e, l), D = !!t.FPDFAnnot_IsChecked(this.form, l), x = P.r - P.l, A = P.t - P.b, w = (E) => Ue(E);
              let k = "q 0 0 0 RG 0 0 0 rg 1 w ";
              if (p === ye.CHECKBOX) k += `${w(P.l + 0.5)} ${w(P.b + 0.5)} ${w(x - 1)} ${w(A - 1)} re S`, D && (k += ` 1.6 w 1 J 1 j ${w(P.l + x * 0.22)} ${w(P.b + A * 0.52)} m ${w(P.l + x * 0.42)} ${w(P.b + A * 0.28)} l ${w(P.l + x * 0.8)} ${w(P.b + A * 0.76)} l S`);
              else {
                const E = (P.l + P.r) / 2, B = (P.b + P.t) / 2, z = Math.min(x, A) / 2 - 0.5, O = 0.5523, W = (N) => `${w(E + N)} ${w(B)} m ${w(E + N)} ${w(B + N * O)} ${w(E + N * O)} ${w(B + N)} ${w(E)} ${w(B + N)} c ${w(E - N * O)} ${w(B + N)} ${w(E - N)} ${w(B + N * O)} ${w(E - N)} ${w(B)} c ${w(E - N)} ${w(B - N * O)} ${w(E - N * O)} ${w(B - N)} ${w(E)} ${w(B - N)} c ${w(E + N * O)} ${w(B - N)} ${w(E + N)} ${w(B - N * O)} ${w(E + N)} ${w(B)} c h`;
                k += W(z) + " S", D && (k += " " + W(z * 0.45) + " f");
              }
              k += " Q";
              const G = e.wstr(k);
              t.FPDFAnnot_SetAP(l, 0, G), e.free(G), _ = !!t.EPDFAnnot_Flatten(s, l);
            }
          } else _ || (t.EPDFAnnot_GenerateAppearance(l), _ = !!t.EPDFAnnot_Flatten(s, l));
        } finally {
          t.FPDFPage_CloseAnnot(l), m ? t.FPDFPage_RemoveAnnot(s, i) : h !== Q.LINK && h !== Q.REDACT && (h === Q.WIDGET ? n.fields : n.annots) && (_ ? r++ : o++);
        }
      }
      t.FPDFPage_GenerateContent(s);
    });
    return { done: r, failed: o };
  }
  addRedactMark(n, t, e) {
    const r = this.P, o = this.lib;
    this.withPage(n, (a) => {
      const s = this.newAnnot(a, Q.REDACT, null, e);
      try {
        for (const m of t) {
          const _ = o.floats([m.l, m.t, m.r, m.t, m.l, m.b, m.r, m.b]);
          r.FPDFAnnot_AppendAttachmentPoints(s, _), o.free(_);
        }
        const i = Jt(t);
        tt(o, s, { l: i.l - 1, r: i.r + 1, b: i.b - 1, t: i.t + 1 }), r.EPDFAnnot_SetColor(s, 0, 214, 40, 40), r.EPDFAnnot_SetColor(s, 1, 0, 0, 0);
        const l = ["q 0.84 0.16 0.16 RG 1.2 w [3 2] 0 d"];
        for (const m of t) l.push(`${Ue(m.l)} ${Ue(m.b)} ${Ue(m.r - m.l)} ${Ue(m.t - m.b)} re S ${Ue(m.l)} ${Ue(m.b)} m ${Ue(m.r)} ${Ue(m.t)} l S`);
        l.push("Q");
        const h = o.wstr(l.join(" "));
        r.FPDFAnnot_SetAP(s, 0, h), o.free(h);
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  redactMarks() {
    const n = this.P, t = this.lib, e = [];
    for (let r = 0; r < this.pageCount; r++) this.withPage(r, (o) => {
      const a = [];
      for (let s = 0; s < n.FPDFPage_GetAnnotCount(o); s++) {
        const i = n.FPDFPage_GetAnnot(o, s);
        try {
          if (n.FPDFAnnot_GetSubtype(i) !== Q.REDACT) continue;
          const l = n.FPDFAnnot_CountAttachmentPoints(i);
          if (!l) {
            a.push(ft(t, i));
            continue;
          }
          for (let h = 0; h < l; h++) t.tmp((m) => {
            const _ = m(32);
            if (n.FPDFAnnot_GetAttachmentPoints(i, h, _)) {
              const p = t.readFloats(_, 8), P = [p[0], p[2], p[4], p[6]], D = [p[1], p[3], p[5], p[7]];
              a.push({ l: Math.min(...P), r: Math.max(...P), b: Math.min(...D), t: Math.max(...D) });
            }
          });
        } finally {
          n.FPDFPage_CloseAnnot(i);
        }
      }
      a.length && e.push({ page: r, rects: a });
    });
    return e;
  }
  clearRedactMarks() {
    const n = this.P;
    for (let t = 0; t < this.pageCount; t++) this.withPage(t, (e) => {
      for (let r = n.FPDFPage_GetAnnotCount(e) - 1; r >= 0; r--) {
        const o = n.FPDFPage_GetAnnot(e, r), a = n.FPDFAnnot_GetSubtype(o) === Q.REDACT;
        n.FPDFPage_CloseAnnot(o), a && n.FPDFPage_RemoveAnnot(e, r);
      }
    });
  }
  applyRedactions(n) {
    const t = this.P, e = this.lib, r = this.redactMarks();
    for (const { page: o, rects: a } of r) this.withPage(o, (s) => {
      t.EPDFPage_ApplyRedactions(s);
      const i = (l, h) => Math.max(0, Math.min(l.r, h.r) - Math.max(l.l, h.l)) * Math.max(0, Math.min(l.t, h.t) - Math.max(l.b, h.b));
      for (let l = t.FPDFPage_GetAnnotCount(s) - 1; l >= 0; l--) {
        const h = t.FPDFPage_GetAnnot(s, l), m = t.FPDFAnnot_GetSubtype(h), _ = ft(e, h);
        t.FPDFPage_CloseAnnot(h);
        const p = Math.max(1e-3, (_.r - _.l) * (_.t - _.b)), P = a.reduce((D, x) => D + i(_, x), 0);
        (m === Q.REDACT || P / p > 0.3) && t.FPDFPage_RemoveAnnot(s, l);
      }
      if (n) for (const l of a) {
        const h = t.FPDFPageObj_CreateNewRect(l.l, l.b, l.r - l.l, l.t - l.b);
        t.FPDFPageObj_SetFillColor(h, n[0], n[1], n[2], 255), t.FPDFPath_SetDrawMode(h, 1, 0), t.FPDFPage_InsertObject(s, h);
      }
      t.FPDFPage_GenerateContent(s);
    });
    return r.length;
  }
  links(n) {
    const t = this.P, e = this.lib;
    return this.withPage(n, (r) => {
      const o = [], a = t.FPDFPage_GetAnnotCount(r);
      for (let s = 0; s < a; s++) {
        const i = t.FPDFPage_GetAnnot(r, s);
        try {
          if (t.FPDFAnnot_GetSubtype(i) !== Q.LINK) continue;
          const l = { index: s, rect: ft(e, i) }, h = t.FPDFAnnot_GetLink(i);
          if (h) {
            const m = t.FPDFLink_GetAction(h), _ = m ? t.FPDFAction_GetType(m) : 0;
            if (_ === 3) {
              const p = t.FPDFAction_GetURIPath(this.h, m, 0, 0);
              if (p > 1) {
                const P = e.alloc(p);
                t.FPDFAction_GetURIPath(this.h, m, P, p), l.uri = e.M.UTF8ToString(P), e.free(P);
              }
            } else {
              const p = (m && _ === 1 ? t.FPDFAction_GetDest(this.h, m) : 0) || t.FPDFLink_GetDest(this.h, h);
              p && (l.page = t.FPDFDest_GetDestPageIndex(this.h, p));
            }
          }
          o.push(l);
        } finally {
          t.FPDFPage_CloseAnnot(i);
        }
      }
      return o;
    });
  }
  addLink(n, t, e) {
    const r = this.P, o = this.lib, a = "page" in e ? r.FPDF_LoadPage(this.h, e.page) : 0;
    this.depth++;
    try {
      this.withPage(n, (s) => {
        const i = r.FPDFPage_CreateAnnot(s, Q.LINK);
        if (!i) throw new Error("Could not create the link");
        try {
          tt(o, i, t), r.FPDFAnnot_SetBorder(i, 0, 0, 0);
          let l = 0;
          if ("uri" in e) l = r.EPDFAction_CreateURI(this.h, e.uri);
          else {
            const h = r.EPDFDest_CreateXYZ(a, false, 0, true, r.FPDF_GetPageHeightF(a), false, 0);
            l = h ? r.EPDFAction_CreateGoTo(this.h, h) : 0;
          }
          if (!l || !r.EPDFAnnot_SetAction(i, l)) throw new Error("Could not set the link target");
        } finally {
          r.FPDFPage_CloseAnnot(i);
        }
      });
    } finally {
      this.depth--, a && r.FPDF_ClosePage(a);
    }
  }
  setLinePoints(n, t, e, r) {
    this.withPage(n, (o) => {
      const a = this.P.FPDFPage_GetAnnot(o, t);
      try {
        this.writeLine(a, e, r), this.lineAP(a);
      } finally {
        this.P.FPDFPage_CloseAnnot(a);
      }
    });
  }
  addNote(n, t, e, r, o) {
    const a = this.P, s = this.lib;
    this.withPage(n, (i) => {
      const l = this.newAnnot(i, Q.TEXT, r, o);
      try {
        tt(s, l, { l: t.x, r: t.x + 20, t: t.y, b: t.y - 20 });
        const h = s.wstr(e);
        a.FPDFAnnot_SetStringValue(l, "Contents", h), s.free(h), a.EPDFAnnot_GenerateAppearance(l);
      } finally {
        a.FPDFPage_CloseAnnot(l);
      }
    });
  }
  addImageStamp(n, t, e, r, o, a, s = "Signature") {
    const i = this.P, l = this.lib, h = l.M;
    this.withPage(n, (m) => {
      const _ = i.FPDFBitmap_Create(r, o, 1), p = i.FPDFBitmap_GetBuffer(_), P = i.FPDFBitmap_GetStride(_);
      for (let w = 0; w < o; w++) for (let k = 0; k < r; k++) {
        const G = (w * r + k) * 4, E = p + w * P + k * 4;
        h.HEAPU8[E] = e[G + 2], h.HEAPU8[E + 1] = e[G + 1], h.HEAPU8[E + 2] = e[G], h.HEAPU8[E + 3] = e[G + 3];
      }
      const D = i.FPDFPageObj_NewImageObj(this.h);
      i.FPDFImageObj_SetBitmap(0, 0, D, _), i.FPDFBitmap_Destroy(_);
      const x = l.floats([t.r - t.l, 0, 0, t.t - t.b, t.l, t.b]);
      i.FPDFPageObj_SetMatrix(D, x), l.free(x);
      const A = this.newAnnot(m, Q.STAMP, null, a);
      try {
        tt(l, A, t);
        const w = l.wstr(s);
        i.FPDFAnnot_SetStringValue(A, "Contents", w), l.free(w), i.FPDFAnnot_AppendObject(A, D);
      } finally {
        i.FPDFPage_CloseAnnot(A);
      }
    });
  }
  addDrawnStamp(n, t, e, r, o) {
    const a = this.P, s = this.lib;
    return this.withPage(n, (i) => {
      const l = this.newAnnot(i, Q.STAMP, null, o);
      try {
        tt(s, l, t);
        const h = s.wstr(e);
        a.FPDFAnnot_SetStringValue(l, "Contents", h), s.free(h);
        const m = s.wstr(r);
        a.FPDFAnnot_SetAP(l, 0, m), s.free(m);
        const _ = s.wstr("1");
        a.FPDFAnnot_SetStringValue(l, "MarginAP", _), s.free(_);
      } finally {
        a.FPDFPage_CloseAnnot(l);
      }
      return a.FPDFPage_GetAnnotCount(i) - 1;
    });
  }
  addImage(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPageObj_NewImageObj(this.h);
      this.fillImage(s, e);
      const i = o.floats(t);
      return r.FPDFPageObj_SetMatrix(s, i), o.free(i), r.FPDFPage_InsertObject(a, s), r.FPDFPage_GenerateContent(a), r.FPDFPage_CountObjects(a) - 1;
    });
  }
  fillImage(n, t) {
    const e = this.P, r = this.lib, o = r.M;
    if ("jpeg" in t) {
      const a = r.bytes(t.jpeg), s = t.jpeg.length, i = o.addFunction((m, _, p, P) => _ + P > s ? 0 : (o.HEAPU8.copyWithin(p, a + _, a + _ + P), 1), "iiiii"), l = r.alloc(12);
      o.setValue(l, s, "i32"), o.setValue(l + 4, i, "i32"), o.setValue(l + 8, 0, "i32");
      const h = e.FPDFImageObj_LoadJpegFileInline(0, 0, n, l);
      if (o.removeFunction(i), r.free(l), r.free(a), !h) throw e.FPDFPageObj_Destroy(n), new Error("That JPEG could not be read");
    } else {
      const { rgba: a, w: s, h: i } = t, l = e.FPDFBitmap_Create(s, i, 1), h = e.FPDFBitmap_GetBuffer(l), m = e.FPDFBitmap_GetStride(l);
      for (let _ = 0; _ < i; _++) for (let p = 0; p < s; p++) {
        const P = (_ * s + p) * 4, D = h + _ * m + p * 4;
        o.HEAPU8[D] = a[P + 2], o.HEAPU8[D + 1] = a[P + 1], o.HEAPU8[D + 2] = a[P], o.HEAPU8[D + 3] = a[P + 3];
      }
      e.FPDFImageObj_SetBitmap(0, 0, n, l), e.FPDFBitmap_Destroy(l);
    }
  }
  imageInfo(n, t) {
    const e = this.P, r = this.lib;
    return this.withPage(n, (o) => {
      const a = e.FPDFPage_GetObject(o, t);
      return !a || e.FPDFPageObj_GetType(a) !== 3 ? null : r.tmp((s) => {
        const i = s(24);
        e.FPDFPageObj_GetMatrix(a, i);
        const l = r.readFloats(i, 6), h = s(8);
        e.FPDFImageObj_GetImagePixelSize(a, h, h + 4);
        const [m, _] = [r.M.getValue(h, "i32"), r.M.getValue(h + 4, "i32")];
        let p = false;
        const P = e.FPDFImageObj_GetImageFilterCount(a);
        for (let D = 0; D < P; D++) {
          const x = e.FPDFImageObj_GetImageFilter(a, D, 0, 0), A = r.alloc(x);
          e.FPDFImageObj_GetImageFilter(a, D, A, x), r.M.UTF8ToString(A) === "DCTDecode" && (p = true), r.free(A);
        }
        return { matrix: l, w: m, h: _, jpeg: p };
      });
    });
  }
  imageList(n) {
    const t = this.P, e = this.lib, r = e.M;
    return this.withPage(n, (o) => {
      const a = [], s = t.FPDFPage_CountObjects(o);
      for (let i = 0; i < s; i++) {
        const l = t.FPDFPage_GetObject(o, i);
        if (t.FPDFPageObj_GetType(l) !== 3) continue;
        const h = e.tmp((D) => {
          const x = D(24);
          t.FPDFPageObj_GetMatrix(l, x);
          const [A, w, k, G] = e.readFloats(x, 4), E = D(8);
          return t.FPDFImageObj_GetImagePixelSize(l, E, E + 4), { w: r.getValue(E, "i32"), h: r.getValue(E + 4, "i32"), ptW: Math.hypot(A, w), ptH: Math.hypot(k, G) };
        });
        let m = false;
        const _ = t.FPDFImageObj_GetImageFilterCount(l);
        for (let D = 0; D < _; D++) {
          const x = t.FPDFImageObj_GetImageFilter(l, D, 0, 0), A = e.alloc(x);
          t.FPDFImageObj_GetImageFilter(l, D, A, x), e.M.UTF8ToString(A) === "DCTDecode" && (m = true), e.free(A);
        }
        const p = t.FPDFImageObj_GetImageDataRaw(l, 0, 0) >>> 0;
        let P = `${p}:${h.w}x${h.h}`;
        if (p) {
          const D = Math.min(p, 65536), x = e.alloc(p);
          t.FPDFImageObj_GetImageDataRaw(l, x, p);
          let A = 2166136261;
          for (let w = 0; w < D; w++) A = Math.imul(A ^ r.HEAPU8[x + w], 16777619);
          e.free(x), P += ":" + (A >>> 0).toString(36);
        }
        a.push({ k: i, ...h, jpeg: m, bytes: p, print: P });
      }
      return a;
    });
  }
  imagePixels(n, t) {
    const e = this.P, r = this.lib, o = r.M;
    return this.withPage(n, (a) => {
      const s = e.FPDFPage_GetObject(a, t);
      if (!s) return null;
      const i = r.tmp((A) => {
        const w = A(24);
        e.FPDFPageObj_GetMatrix(s, w);
        const k = A(8);
        return e.FPDFImageObj_GetImagePixelSize(s, k, k + 4), { m: r.readFloats(w, 6), w: o.getValue(k, "i32"), h: o.getValue(k + 4, "i32") };
      }), l = r.floats([i.w, 0, 0, i.h, 0, 0]);
      e.FPDFPageObj_SetMatrix(s, l), r.free(l);
      const h = e.FPDFImageObj_GetRenderedBitmap(this.h, a, s), m = r.floats(i.m);
      if (e.FPDFPageObj_SetMatrix(s, m), r.free(m), !h) return null;
      const _ = e.FPDFBitmap_GetWidth(h), p = e.FPDFBitmap_GetHeight(h), P = e.FPDFBitmap_GetStride(h), D = e.FPDFBitmap_GetBuffer(h), x = new Uint8ClampedArray(_ * p * 4);
      for (let A = 0; A < p; A++) for (let w = 0; w < _; w++) {
        const k = D + A * P + w * 4, G = (A * _ + w) * 4;
        x[G] = o.HEAPU8[k + 2], x[G + 1] = o.HEAPU8[k + 1], x[G + 2] = o.HEAPU8[k], x[G + 3] = o.HEAPU8[k + 3];
      }
      return e.FPDFBitmap_Destroy(h), { rgba: x, w: _, h: p };
    });
  }
  setImage(n, t, e, r) {
    const o = this.P, a = this.lib;
    this.withPage(n, (s) => {
      const i = o.FPDFPage_GetObject(s, t);
      if (!i) throw new Error("The image is gone");
      if (this.fillImage(i, e), r) {
        const l = a.floats(r);
        o.FPDFPageObj_SetMatrix(i, l), a.free(l);
      }
      o.FPDFPage_GenerateContent(s);
    });
  }
  deleteAnnot(n, t) {
    const e = this.P;
    this.withPage(n, (r) => {
      const o = /* @__PURE__ */ new Set([t]);
      for (let a = true; a; ) {
        a = false;
        for (let s = 0; s < e.FPDFPage_GetAnnotCount(r); s++) {
          if (o.has(s)) continue;
          const i = e.FPDFPage_GetAnnot(r, s), l = e.FPDFAnnot_GetLinkedAnnot(i, "IRT");
          let h = -1;
          l && (h = e.FPDFPage_GetAnnotIndex(r, l), e.FPDFPage_CloseAnnot(l)), e.FPDFPage_CloseAnnot(i), h >= 0 && o.has(h) && (o.add(s), a = true);
        }
      }
      for (const a of [...o].sort((s, i) => i - s)) e.FPDFPage_RemoveAnnot(r, a);
    });
  }
  addReply(n, t, e, r) {
    const o = this.P, a = this.lib;
    this.withPage(n, (s) => {
      const i = o.FPDFPage_GetAnnot(s, t);
      if (!i) throw new Error("That comment is gone");
      const l = ft(a, i), h = this.newAnnot(s, Q.TEXT, null, r);
      try {
        tt(a, h, { l: l.r, r: l.r + 1, t: l.t, b: l.t - 1 }), o.FPDFAnnot_SetFlags(h, 28);
        const m = a.wstr(e);
        if (o.FPDFAnnot_SetStringValue(h, "Contents", m), a.free(m), !o.EPDFAnnot_SetLinkedAnnot(h, "IRT", i)) throw new Error("Could not link the reply");
        const _ = a.wstr(" ");
        o.FPDFAnnot_SetAP(h, 0, _), a.free(_);
      } finally {
        o.FPDFPage_CloseAnnot(h), o.FPDFPage_CloseAnnot(i);
      }
    });
  }
  setAnnotContents(n, t, e) {
    const r = this.P, o = this.lib;
    this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnot(a, t);
      try {
        const i = o.wstr(e);
        r.FPDFAnnot_SetStringValue(s, "Contents", i), o.free(i);
        const l = o.wstr(_r());
        r.FPDFAnnot_SetStringValue(s, "M", l), o.free(l);
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  setAnnotColor(n, t, e) {
    const r = this.P;
    this.withPage(n, (o) => {
      const a = r.FPDFPage_GetAnnot(o, t);
      try {
        e ? r.EPDFAnnot_SetColor(a, 0, e[0], e[1], e[2]) || r.FPDFAnnot_SetColor(a, 0, e[0], e[1], e[2], e[3]) : r.EPDFAnnot_ClearColor(a, 0);
        const s = r.FPDFAnnot_GetSubtype(a);
        s === Q.SQUARE || s === Q.CIRCLE ? this.shapeAP(a) : s === Q.LINE ? this.lineAP(a) : s !== Q.STAMP && s !== Q.FREETEXT && r.EPDFAnnot_GenerateAppearance(a);
      } finally {
        r.FPDFPage_CloseAnnot(a);
      }
    });
  }
  annotStyle(n, t) {
    const e = this.P;
    return this.withPage(n, (r) => {
      const o = e.FPDFPage_GetAnnot(r, t);
      if (!o) return null;
      try {
        return this.readStyle(o);
      } finally {
        e.FPDFPage_CloseAnnot(o);
      }
    });
  }
  readStyle(n) {
    const t = this.P, e = this.lib;
    return e.tmp((r) => {
      const o = r(16), a = t.EPDFAnnot_GetBorderStyle(n, o);
      let s = a > 0 ? e.readFloats(o, 1)[0] : 0;
      a > 0 || (s = t.FPDFAnnot_GetBorder(n, o, o + 4, o + 8) ? e.readFloats(o + 8, 1)[0] : 1);
      const i = a === 2, l = t.EPDFAnnot_GetColor(n, 1, o, o + 4, o + 8) ? [...e.readU32(o, 3), 255] : null, h = t.FPDFAnnot_HasKey(n, "CA") && t.EPDFAnnot_GetOpacity(n, o) ? (e.M.getValue(o, "i32") & 255) / 255 : 1, m = { width: s, dashed: i, fill: l, opacity: h };
      if (t.FPDFAnnot_GetSubtype(n) === Q.LINE) {
        const _ = t.EPDFAnnot_GetLineEndings(n, o, o + 4) ? [e.M.getValue(o, "i32"), e.M.getValue(o + 4, "i32")] : [0, 0];
        m.ends = _.map((p) => Ui[p] || "None");
      }
      return m;
    });
  }
  writeStyle(n, t) {
    const e = this.P, r = this.lib, o = this.readStyle(n), a = t.width ?? o.width, s = t.dashed ?? o.dashed;
    if ((t.width != null || t.dashed != null) && (e.FPDFAnnot_SetBorder(n, 0, 0, a), e.EPDFAnnot_SetBorderStyle(n, s ? 2 : 1, a), s)) {
      const h = r.floats([Math.max(3, a * 3), Math.max(2, a * 2)]);
      e.EPDFAnnot_SetBorderDashPattern(n, h, 2), r.free(h);
    }
    "fill" in t && (t.fill ? e.EPDFAnnot_SetColor(n, 1, t.fill[0], t.fill[1], t.fill[2]) : e.EPDFAnnot_ClearColor(n, 1)), t.opacity != null && e.EPDFAnnot_SetOpacity(n, Math.round(Math.max(0.05, Math.min(1, t.opacity)) * 255)), t.ends && e.EPDFAnnot_SetLineEndings(n, zn[t.ends[0]], zn[t.ends[1]]);
    const i = r.wstr(_r());
    e.FPDFAnnot_SetStringValue(n, "M", i), r.free(i);
    this.regenAP(n);
  }
  setAnnotStyle(n, t, e) {
    const r = this.P;
    this.withPage(n, (o) => {
      const a = r.FPDFPage_GetAnnot(o, t);
      if (!a) throw new Error("That annotation is gone");
      try {
        this.writeStyle(a, e);
      } finally {
        r.FPDFPage_CloseAnnot(a);
      }
    });
  }
  reverseLine(n, t) {
    const e = this.P;
    this.withPage(n, (r) => {
      const o = e.FPDFPage_GetAnnot(r, t);
      try {
        const a = this.readLine(o);
        if (!a) throw new Error("Not a line");
        this.writeLine(o, a[1], a[0]), this.lineAP(o);
      } finally {
        e.FPDFPage_CloseAnnot(o);
      }
    });
  }
  imageJpeg(n, t) {
    const e = this.P, r = this.lib;
    return this.withPage(n, (o) => {
      const a = e.FPDFPage_GetObject(o, t);
      if (!a || e.FPDFPageObj_GetType(a) !== 3) return null;
      const s = e.FPDFImageObj_GetImageDataRaw(a, 0, 0);
      if (s <= 0) return null;
      const i = r.alloc(s);
      e.FPDFImageObj_GetImageDataRaw(a, i, s);
      const l = r.M.HEAPU8.slice(i, i + s);
      return r.free(i), l[0] === 255 && l[1] === 216 ? l : null;
    });
  }
  readClip(n, t, e) {
    const r = this.P, o = this.lib, a = [];
    let s = 0;
    for (const i of t) {
      const l = this.withPage(n, (m) => {
        const _ = r.FPDFPage_GetAnnot(m, i);
        if (!_) return null;
        try {
          const p = r.FPDFAnnot_GetSubtype(_);
          if (p === Q.FREETEXT || ![Q.SQUARE, Q.CIRCLE, Q.LINE, Q.INK, Q.TEXT, Q.STAMP].includes(p)) return null;
          const P = (A) => o.readW((w, k) => r.FPDFAnnot_GetStringValue(_, A, w, k)), D = o.tmp((A) => {
            const w = A(16);
            return r.EPDFAnnot_GetColor(_, 0, w, w + 4, w + 8) ? [...o.readU32(w, 3), 255] : r.FPDFAnnot_GetColor(_, 0, w, w + 4, w + 8, w + 12) ? o.readU32(w, 4) : null;
          }), x = { t: "annot", subtype: p, rect: ft(o, _), color: D, contents: P("Contents"), style: this.readStyle(_) };
          if (p === Q.LINE) {
            const A = this.readLine(_);
            if (!A) return null;
            x.line = A;
          }
          if (p === Q.INK) {
            x.ink = [];
            for (let A = 0, w = r.FPDFAnnot_GetInkListCount(_); A < w; A++) {
              const k = r.FPDFAnnot_GetInkListPath(_, A, 0, 0), G = o.alloc(k * 8);
              r.FPDFAnnot_GetInkListPath(_, A, G, k), x.ink.push(o.readFloats(G, k * 2)), o.free(G);
            }
          }
          if (p === Q.STAMP) if (this.isDrawn(_)) {
            const A = o.readW((w, k) => r.FPDFAnnot_GetAP(_, 0, w, k));
            if (!A) return null;
            x.ap = A;
          } else {
            x.images = [];
            for (let A = 0, w = r.FPDFAnnot_GetObjectCount(_); A < w; A++) {
              const k = r.FPDFAnnot_GetObject(_, A);
              if (r.FPDFPageObj_GetType(k) !== 3) return null;
              const G = this.renderImageObj(m, k);
              if (!G) return null;
              x.images.push(G);
            }
            if (!x.images.length) return null;
          }
          return x;
        } finally {
          r.FPDFPage_CloseAnnot(_);
        }
      });
      if (l) {
        a.push(l);
        continue;
      }
      const h = this.withPage(n, (m) => {
        const _ = r.FPDFPage_GetAnnot(m, i);
        if (!_) return false;
        const p = r.FPDFAnnot_GetSubtype(_);
        return r.FPDFPage_CloseAnnot(_), p === Q.FREETEXT;
      }) ? this.readFreeText(n, i) : null;
      h ? a.push({ t: "ft", data: h }) : s++;
    }
    for (const i of e) {
      const l = this.imageInfo(n, i);
      if (!l) {
        s++;
        continue;
      }
      const h = l.jpeg ? this.imageJpeg(n, i) : null;
      if (h) {
        a.push({ t: "img", m: l.matrix, src: { jpeg: h } });
        continue;
      }
      const m = this.imagePixels(n, i);
      if (!m) {
        s++;
        continue;
      }
      a.push({ t: "img", m: l.matrix, src: { rgba: m.rgba, w: m.w, h: m.h } });
    }
    return { items: a, skipped: s };
  }
  renderImageObj(n, t) {
    const e = this.P, r = this.lib, o = r.M, a = r.tmp((x) => {
      const A = x(24);
      return e.FPDFPageObj_GetMatrix(t, A), r.readFloats(A, 6);
    }), s = r.tmp((x) => {
      const A = x(8);
      return e.FPDFImageObj_GetImagePixelSize(t, A, A + 4), [o.getValue(A, "i32"), o.getValue(A + 4, "i32")];
    }), i = r.floats([s[0] || 1, 0, 0, s[1] || 1, 0, 0]);
    e.FPDFPageObj_SetMatrix(t, i), r.free(i);
    const l = e.FPDFImageObj_GetRenderedBitmap(this.h, n, t), h = r.floats(a);
    if (e.FPDFPageObj_SetMatrix(t, h), r.free(h), !l) return null;
    const m = e.FPDFBitmap_GetWidth(l), _ = e.FPDFBitmap_GetHeight(l), p = e.FPDFBitmap_GetStride(l), P = e.FPDFBitmap_GetBuffer(l), D = new Uint8ClampedArray(m * _ * 4);
    for (let x = 0; x < _; x++) for (let A = 0; A < m; A++) {
      const w = P + x * p + A * 4, k = (x * m + A) * 4;
      D[k] = o.HEAPU8[w + 2], D[k + 1] = o.HEAPU8[w + 1], D[k + 2] = o.HEAPU8[w], D[k + 3] = o.HEAPU8[w + 3];
    }
    return e.FPDFBitmap_Destroy(l), { m: a, rgba: D, w: m, h: _ };
  }
  writeClip(n, t, e, r, o) {
    const a = this.P, s = this.lib, i = s.M, l = [], h = (m) => ({ l: m.l + e, r: m.r + e, t: m.t + r, b: m.b + r });
    for (const m of t) {
      if (m.t === "ft") continue;
      if (m.t === "img") {
        const P = m.m;
        l.push("o" + this.addImage(n, [P[0], P[1], P[2], P[3], P[4] + e, P[5] + r], m.src));
        continue;
      }
      const _ = m.subtype, p = this.withPage(n, (P) => {
        let D = 0;
        if (_ === Q.STAMP) if (D = this.newAnnot(P, Q.STAMP, null, o), tt(s, D, h(m.rect)), m.ap != null) {
          const x = s.wstr(`q 1 0 0 1 ${Ue(e)} ${Ue(r)} cm
${m.ap}
Q`);
          a.FPDFAnnot_SetAP(D, 0, x), s.free(x);
          const A = s.wstr("1");
          a.FPDFAnnot_SetStringValue(D, "MarginAP", A), s.free(A);
        } else for (const x of m.images || []) {
          const A = a.FPDFBitmap_Create(x.w, x.h, 1), w = a.FPDFBitmap_GetBuffer(A), k = a.FPDFBitmap_GetStride(A);
          for (let B = 0; B < x.h; B++) for (let z = 0; z < x.w; z++) {
            const O = (B * x.w + z) * 4, W = w + B * k + z * 4;
            i.HEAPU8[W] = x.rgba[O + 2], i.HEAPU8[W + 1] = x.rgba[O + 1], i.HEAPU8[W + 2] = x.rgba[O], i.HEAPU8[W + 3] = x.rgba[O + 3];
          }
          const G = a.FPDFPageObj_NewImageObj(this.h);
          a.FPDFImageObj_SetBitmap(0, 0, G, A), a.FPDFBitmap_Destroy(A);
          const E = s.floats([x.m[0], x.m[1], x.m[2], x.m[3], x.m[4] + e, x.m[5] + r]);
          a.FPDFPageObj_SetMatrix(G, E), s.free(E), a.FPDFAnnot_AppendObject(D, G);
        }
        else {
          D = this.newAnnot(P, _, _ === Q.LINE ? null : m.color, o), _ === Q.LINE && m.line && (m.color && a.EPDFAnnot_SetColor(D, 0, m.color[0], m.color[1], m.color[2]), this.writeLine(D, { x: m.line[0].x + e, y: m.line[0].y + r }, { x: m.line[1].x + e, y: m.line[1].y + r })), tt(s, D, h(m.rect));
          for (const x of m.ink || []) {
            const A = s.floats(x.map((w, k) => w + (k % 2 ? r : e)));
            a.FPDFAnnot_AddInkStroke(D, A, x.length / 2), s.free(A);
          }
        }
        try {
          if (m.contents) {
            const x = s.wstr(m.contents);
            a.FPDFAnnot_SetStringValue(D, "Contents", x), s.free(x);
          }
          _ === Q.TEXT ? a.EPDFAnnot_GenerateAppearance(D) : _ !== Q.STAMP && this.writeStyle(D, m.style);
        } finally {
          a.FPDFPage_CloseAnnot(D);
        }
        return a.FPDFPage_GetAnnotCount(P) - 1;
      });
      l.push("a" + p);
    }
    return l;
  }
  reframeAP(n, t, e) {
    const r = this.P, o = this.lib, a = o.readW((h, m) => r.FPDFAnnot_GetAP(n, 0, h, m));
    if (tt(o, n, e), !a) return;
    const s = (e.r - e.l) / Math.max(1e-6, t.r - t.l), i = (e.t - e.b) / Math.max(1e-6, t.t - t.b), l = o.wstr(`q ${Ue(s)} 0 0 ${Ue(i)} ${Ue(e.l - t.l * s)} ${Ue(e.b - t.b * i)} cm
${a}
Q`);
    r.FPDFAnnot_SetAP(n, 0, l), o.free(l);
  }
  isDrawn(n) {
    return this.P.FPDFAnnot_HasKey(n, "MarginAP") || this.P.FPDFAnnot_HasKey(n, "MarginFT");
  }
  moveAnnot(n, t, e, r) {
    const o = this.P, a = this.lib;
    return this.withPage(n, (s) => {
      const i = o.FPDFPage_GetAnnot(s, t);
      try {
        const l = o.FPDFAnnot_GetSubtype(i);
        if ([Q.HIGHLIGHT, Q.UNDERLINE, Q.STRIKEOUT, Q.SQUIGGLY, Q.REDACT].includes(l)) return false;
        if (l === Q.LINE) {
          const _ = this.readLine(i);
          return _ ? (this.writeLine(i, { x: _[0].x + e, y: _[0].y + r }, { x: _[1].x + e, y: _[1].y + r }), this.lineAP(i), true) : false;
        }
        if (l === Q.WIDGET) {
          const _ = ft(a, i);
          return tt(a, i, { l: _.l + e, r: _.r + e, t: _.t + r, b: _.b + r }), true;
        }
        const h = ft(a, i), m = { l: h.l + e, r: h.r + e, t: h.t + r, b: h.b + r };
        if (this.isDrawn(i) ? this.reframeAP(i, h, m) : tt(a, i, m), l === Q.FREETEXT) {
          const _ = (p) => a.readW((P, D) => o.FPDFAnnot_GetStringValue(i, p, P, D));
          try {
            const p = JSON.parse(_("MarginFT")), P = (x) => ({ l: x.l + e, r: x.r + e, t: x.t + r, b: x.b + r });
            p.box = P(p.box), p.tip && (p.tip = { x: p.tip.x + e, y: p.tip.y + r });
            const D = a.wstr(JSON.stringify(p));
            if (o.FPDFAnnot_SetStringValue(i, "MarginFT", D), a.free(D), p.tip) {
              const x = vo(p.box, p.tip), A = a.floats([p.tip.x, p.tip.y, x.x, x.y]);
              o.EPDFAnnot_SetCalloutLine(i, A, 2), a.free(A);
            }
          } catch {
          }
          return true;
        }
        if (l === Q.INK) {
          const _ = o.FPDFAnnot_GetInkListCount(i), p = [];
          for (let P = 0; P < _; P++) {
            const D = o.FPDFAnnot_GetInkListPath(i, P, 0, 0), x = a.alloc(D * 8);
            o.FPDFAnnot_GetInkListPath(i, P, x, D);
            const A = a.readFloats(x, D * 2);
            a.free(x), p.push(A.map((w, k) => w + (k % 2 ? r : e)));
          }
          o.FPDFAnnot_RemoveInkList(i);
          for (const P of p) {
            const D = a.floats(P);
            o.FPDFAnnot_AddInkStroke(i, D, P.length / 2), a.free(D);
          }
        }
        return l !== Q.STAMP && this.regenAP(i), true;
      } finally {
        o.FPDFPage_CloseAnnot(i);
      }
    });
  }
  resizeAnnot(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnot(a, t);
      try {
        const i = r.FPDFAnnot_GetSubtype(s);
        if (i === Q.FREETEXT || i === Q.TEXT || i === Q.REDACT || [Q.HIGHLIGHT, Q.UNDERLINE, Q.STRIKEOUT, Q.SQUIGGLY].includes(i)) return false;
        const l = ft(o, s), h = (e.r - e.l) / Math.max(1e-6, l.r - l.l), m = (e.t - e.b) / Math.max(1e-6, l.t - l.b), _ = (p, P) => [e.l + (p - l.l) * h, e.b + (P - l.b) * m];
        if (this.isDrawn(s)) return this.reframeAP(s, l, e), true;
        if (i === Q.WIDGET) {
          tt(o, s, e);
          const p = r.FPDFAnnot_GetFormFieldType(this.form, s);
          if (p === ye.SIGNATURE) {
            const P = o.wstr(qo(e));
            r.FPDFAnnot_SetAP(s, 0, P), o.free(P);
          } else p !== ye.CHECKBOX && p !== ye.RADIO && r.EPDFAnnot_GenerateFormFieldAP(s);
          return true;
        }
        if (i === Q.LINE) {
          const p = this.readLine(s);
          if (!p) return false;
          const [P, D] = p.map((x) => _(x.x, x.y));
          return this.writeLine(s, { x: P[0], y: P[1] }, { x: D[0], y: D[1] }), this.lineAP(s), true;
        }
        if (tt(o, s, e), i === Q.INK) {
          const p = r.FPDFAnnot_GetInkListCount(s), P = [];
          for (let D = 0; D < p; D++) {
            const x = r.FPDFAnnot_GetInkListPath(s, D, 0, 0), A = o.alloc(x * 8);
            r.FPDFAnnot_GetInkListPath(s, D, A, x);
            const w = o.readFloats(A, x * 2);
            o.free(A);
            const k = [];
            for (let G = 0; G < w.length; G += 2) k.push(..._(w[G], w[G + 1]));
            P.push(k);
          }
          r.FPDFAnnot_RemoveInkList(s);
          for (const D of P) {
            const x = o.floats(D);
            r.FPDFAnnot_AddInkStroke(s, x, D.length / 2), o.free(x);
          }
        }
        return i !== Q.STAMP && this.regenAP(s), true;
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  pageObjects(n) {
    const t = this.P, e = this.lib;
    return this.withPage(n, (r) => {
      const o = [], a = t.FPDFPage_CountObjects(r);
      for (let s = 0; s < a; s++) {
        const i = t.FPDFPage_GetObject(r, s), l = t.FPDFPageObj_GetType(i), h = rn(e, i, "MarginText") || rn(e, i, "MarginGlyph");
        if (!h && l !== 1 && l !== 3 && l !== 5) continue;
        const m = e.tmp((_) => {
          const p = _(16);
          t.FPDFPageObj_GetBounds(i, p, p + 4, p + 8, p + 12);
          const [P, D, x, A] = e.readFloats(p, 4);
          return { l: P, b: D, r: x, t: A };
        });
        o.push({ index: s, type: l, bounds: m, blockId: h?.id || "" });
      }
      return o;
    });
  }
  transformObjects(n, t, e) {
    const r = this.P, o = this.lib;
    this.withPage(n, (a) => {
      const s = t.map((l) => r.FPDFPage_GetObject(a, l)).filter(Boolean), i = o.floats(e);
      for (const l of s) r.FPDFPageObj_TransformF(l, i);
      o.free(i), r.FPDFPage_GenerateContent(a);
    });
  }
  transformBlock(n, t, e, r) {
    const o = this.P, a = this.lib;
    this.withPage(n, (s) => {
      const i = a.floats(e);
      for (let l = 0; l < o.FPDFPage_CountObjects(s); l++) {
        const h = o.FPDFPage_GetObject(s, l), m = rn(a, h, "MarginText") || rn(a, h, "MarginGlyph");
        if (!m || m.id !== t) continue;
        o.FPDFPageObj_TransformF(h, i);
        const _ = rn(a, h, "MarginText");
        if (_) {
          const p = zi(a, h, "MarginText");
          if (!p) continue;
          if (_.bm) {
            const [P, D, x, A, w, k] = _.bm, G = e[0] * w + e[2] * k + e[4], E = e[1] * w + e[3] * k + e[5];
            o.FPDFPageObjMark_SetStringParam(this.h, h, p, "bm", [P, D, x, A, G, E].map((B) => +B.toFixed(4)).join(","));
          }
          if (r !== 1 && _.size && o.FPDFPageObjMark_SetStringParam(this.h, h, p, "size", String(+(_.size * r).toFixed(2))), _.rt) try {
            const P = JSON.parse(decodeURIComponent(_.rt)), [D, x, A, w, k, G] = P.bm;
            P.bm = [D, x, A, w, +(e[0] * k + e[2] * G + e[4]).toFixed(4), +(e[1] * k + e[3] * G + e[5]).toFixed(4)], r !== 1 && (P.size = +(P.size * r).toFixed(2), P.width && (P.width = +(P.width * r).toFixed(2))), o.FPDFPageObjMark_SetStringParam(this.h, h, p, "rt", encodeURIComponent(JSON.stringify(P)));
          } catch {
          }
        }
      }
      a.free(i), o.FPDFPage_GenerateContent(s);
    });
  }
  fields(n) {
    const t = this.P, e = this.lib, r = this.form;
    return r ? this.withPage(n, (o) => {
      const a = [], s = t.FPDFPage_GetAnnotCount(o);
      for (let i = 0; i < s; i++) {
        const l = t.FPDFPage_GetAnnot(o, i);
        try {
          if (t.FPDFAnnot_GetSubtype(l) !== Q.WIDGET) continue;
          const h = t.FPDFAnnot_GetFormFieldType(r, l);
          if (h <= 0) continue;
          const m = t.FPDFAnnot_GetFormFieldFlags(r, l), _ = [];
          if (h === ye.COMBO || h === ye.LIST) {
            const p = t.FPDFAnnot_GetOptionCount(r, l);
            for (let P = 0; P < p; P++) _.push({ label: e.readW((D, x) => t.FPDFAnnot_GetOptionLabel(r, l, P, D, x)), selected: !!t.FPDFAnnot_IsOptionSelected(r, l, P) });
          }
          a.push({ index: i, type: h, rect: ft(e, l), options: _, name: e.readW((p, P) => t.FPDFAnnot_GetFormFieldName(r, l, p, P)), value: e.readW((p, P) => t.FPDFAnnot_GetFormFieldValue(r, l, p, P)), checked: h === ye.CHECKBOX || h === ye.RADIO ? !!t.FPDFAnnot_IsChecked(r, l) : false, readOnly: !!(m & 1), multiline: h === ye.TEXT && !!(m & 4096), exportValue: h === ye.CHECKBOX || h === ye.RADIO ? e.readW((p, P) => t.FPDFAnnot_GetFormFieldExportValue(r, l, p, P)) : "" });
        } finally {
          t.FPDFPage_CloseAnnot(l);
        }
      }
      return a;
    }) : [];
  }
  createField(n, t, e, r, o = {}) {
    const a = this.P, s = this.lib, i = this.form;
    if (!i) throw new Error("Form fields aren’t available for this document");
    const l = { text: ye.TEXT, multiline: ye.TEXT, signature: ye.TEXT, checkbox: ye.CHECKBOX, radio: ye.RADIO, dropdown: ye.COMBO, list: ye.LIST }[t];
    let h = o.joinTo || null;
    if (t === "radio" && !h) for (let _ = 0; _ < this.pageCount && !h; _++) {
      const p = this.fields(_).find((P) => P.type === ye.RADIO && P.name === r);
      p && (h = { page: _, annot: p.index });
    }
    const m = h && h.page !== n ? a.FPDF_LoadPage(this.h, h.page) : 0;
    m && a.FORM_OnAfterLoadPage(m, i), this.depth++;
    try {
      return this.withPage(n, (_) => {
        const p = s.wstr(h ? r + "__margin_new" : r), P = a.EPDFPage_CreateFormField(_, i, l, p);
        if (s.free(p), !P) throw new Error("Could not create the field");
        try {
          if (tt(s, P, e), a.FPDFAnnot_SetFlags(P, 4), a.FPDFAnnot_SetBorder(P, 0, 0, 1), a.EPDFAnnot_SetMKColor(P, 0, 120, 124, 134), t !== "checkbox" && t !== "radio" && t !== "signature" && a.EPDFAnnot_SetMKColor(P, 1, 255, 255, 255), a.EPDFAnnot_SetDefaultAppearance(P, 4, o.size ?? (t === "checkbox" || t === "radio" ? 0 : 11), 0, 0, 0), t === "multiline" && a.FPDFAnnot_SetFormFieldFlags(i, P, 4096), (t === "dropdown" || t === "list") && o.options?.length) {
            const D = o.options.map((A) => s.wstr(A)), x = s.alloc(D.length * 4);
            D.forEach((A, w) => s.M.setValue(x + w * 4, A, "i32")), a.EPDFAnnot_SetFormFieldOptions(i, P, x, D.length), D.forEach((A) => s.free(A)), s.free(x);
          }
          if (t === "radio") {
            if (h) {
              const x = a.FPDFPage_GetAnnot(m || _, h.annot);
              try {
                if (!a.EPDFAnnot_ShareFormField(i, x, P)) throw new Error("Could not add the button to its group");
              } finally {
                a.FPDFPage_CloseAnnot(x);
              }
              const A = s.wstr(r);
              a.EPDFAnnot_SetFormFieldName(i, P, A), s.free(A);
            }
            const D = s.wstr((o.onValue || "Choice").slice(0, 24) + " ".repeat(60));
            a.FPDFAnnot_SetStringValue(P, "MarginOn", D), s.free(D);
          }
          if (a.EPDFAnnot_GenerateFormFieldAP(P), t === "signature") {
            const D = s.wstr(" ".repeat(40));
            a.FPDFAnnot_SetStringValue(P, "MarginSig", D), s.free(D), a.FPDFAnnot_SetFormFieldFlags(i, P, 1 << 23);
            const x = s.wstr(qo(e));
            a.FPDFAnnot_SetAP(P, 0, x), s.free(x);
          }
        } finally {
          a.FPDFPage_CloseAnnot(P);
        }
        return a.FPDFPage_GetAnnotCount(_) - 1;
      });
    } finally {
      this.depth--, m && (a.FORM_OnBeforeClosePage(m, i), a.FPDF_ClosePage(m));
    }
  }
  removeWidgets(n) {
    const t = this.P;
    this.withPage(n, (e) => {
      for (let r = t.FPDFPage_GetAnnotCount(e) - 1; r >= 0; r--) {
        const o = t.FPDFPage_GetAnnot(e, r), a = t.FPDFAnnot_GetSubtype(o) === Q.WIDGET;
        t.FPDFPage_CloseAnnot(o), a && t.FPDFPage_RemoveAnnot(e, r);
      }
    });
  }
  setFieldName(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnot(a, t);
      try {
        const i = o.wstr(e), l = r.EPDFAnnot_SetFormFieldName(this.form, s, i);
        return o.free(i), !!l;
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  setFieldOptions(n, t, e) {
    const r = this.P, o = this.lib;
    this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnot(a, t);
      try {
        const i = e.map((h) => o.wstr(h)), l = o.alloc(Math.max(1, i.length) * 4);
        i.forEach((h, m) => o.M.setValue(l + m * 4, h, "i32")), r.EPDFAnnot_SetFormFieldOptions(this.form, s, l, i.length), i.forEach((h) => o.free(h)), o.free(l), r.EPDFAnnot_GenerateFormFieldAP(s);
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  setFieldText(n, t, e) {
    const r = this.P, o = this.lib, a = this.form;
    this.withPage(n, (s) => {
      const i = r.FPDFPage_GetAnnot(s, t);
      try {
        r.FORM_SetFocusedAnnot(a, i), r.FORM_SelectAllText(a, s);
        const l = o.wstr(e);
        r.FORM_ReplaceSelection(a, s, l), o.free(l), r.FORM_ForceToKillFocus(a);
      } finally {
        r.FPDFPage_CloseAnnot(i);
      }
    });
  }
  fieldLook(n, t) {
    const e = this.P, r = this.lib;
    return this.withPage(n, (o) => {
      const a = e.FPDFPage_GetAnnot(o, t);
      try {
        return r.tmp((s) => {
          const i = s(12), l = (A) => e.EPDFAnnot_GetMKColor(a, A, i, i + 4, i + 8) ? r.readU32(i, 3) : null, h = s(4), m = e.FPDFAnnot_GetFontSize(this.form, a, h) ? r.readFloats(h, 1)[0] : 0, _ = s(4), p = s(4), P = s(4), D = e.FPDFAnnot_GetBorder(a, _, p, P) ? r.readFloats(P, 1)[0] : 1, x = e.FPDFAnnot_GetFormFieldFlags(this.form, a);
          return { rect: ft(r, a), border: l(0), background: l(1), size: m, borderWidth: D, multiline: !!(x & 4096) };
        });
      } finally {
        e.FPDFPage_CloseAnnot(a);
      }
    });
  }
  setNormalAppearance(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnot(a, t);
      try {
        const i = o.wstr(e), l = !!r.FPDFAnnot_SetAP(s, 0, i);
        return o.free(i), l;
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  clickField(n, t) {
    const e = this.P, r = this.lib;
    this.withPage(n, (o) => {
      const a = e.FPDFPage_GetAnnot(o, t);
      try {
        const s = ft(r, a), i = (s.l + s.r) / 2, l = (s.t + s.b) / 2;
        e.FORM_OnMouseMove(this.form, o, 0, i, l), e.FORM_OnLButtonDown(this.form, o, 0, i, l), e.FORM_OnLButtonUp(this.form, o, 0, i, l), e.FORM_ForceToKillFocus(this.form);
      } finally {
        e.FPDFPage_CloseAnnot(a);
      }
    });
  }
  selectOption(n, t, e) {
    const r = this.P;
    this.withPage(n, (o) => {
      const a = r.FPDFPage_GetAnnot(o, t);
      try {
        r.FORM_SetFocusedAnnot(this.form, a), r.FORM_SetIndexSelected(this.form, o, e, true), r.FORM_ForceToKillFocus(this.form);
      } finally {
        r.FPDFPage_CloseAnnot(a);
      }
    });
  }
}
class yt {
  constructor(n, t, e, r, o, a) {
    this.a = n, this.b = t, this.c = e, this.d = r, this.e = o, this.f = a;
  }
  apply(n, t) {
    return [this.a * n + this.c * t + this.e, this.b * n + this.d * t + this.f];
  }
  invert() {
    const n = this.a * this.d - this.b * this.c, t = this.d / n, e = -this.b / n, r = -this.c / n, o = this.a / n;
    return new yt(t, e, r, o, -(t * this.e + r * this.f), -(e * this.e + o * this.f));
  }
  box(n) {
    const t = [this.apply(n.l, n.b), this.apply(n.r, n.t), this.apply(n.l, n.t), this.apply(n.r, n.b)], e = t.map((s) => s[0]), r = t.map((s) => s[1]), o = Math.min(...e), a = Math.min(...r);
    return { x: o, y: a, w: Math.max(...e) - o, h: Math.max(...r) - a };
  }
}
function ft(u, n) {
  return u.tmp((t) => {
    const e = t(16);
    u.P.FPDFAnnot_GetRect(n, e);
    const [r, o, a, s] = u.readFloats(e, 4);
    return { l: Math.min(r, a), r: Math.max(r, a), t: Math.max(o, s), b: Math.min(o, s) };
  });
}
function vo(u, n) {
  const t = (u.l + u.r) / 2, e = (u.b + u.t) / 2, r = n.x - t, o = n.y - e, a = (u.r - u.l) / 2, s = (u.t - u.b) / 2, i = Math.min(r ? a / Math.abs(r) : 1 / 0, o ? s / Math.abs(o) : 1 / 0);
  return i >= 1 ? { x: n.x, y: n.y } : { x: t + r * i, y: e + o * i };
}
function tt(u, n, t) {
  const e = u.floats([t.l, t.t, t.r, t.b]);
  u.P.FPDFAnnot_SetRect(n, e), u.free(e);
}
function Jt(u) {
  return { l: Math.min(...u.map((n) => n.l)), r: Math.max(...u.map((n) => n.r)), b: Math.min(...u.map((n) => n.b)), t: Math.max(...u.map((n) => n.t)) };
}
function _r(u = /* @__PURE__ */ new Date()) {
  const n = (t) => String(t).padStart(2, "0");
  return `D:${u.getFullYear()}${n(u.getMonth() + 1)}${n(u.getDate())}${n(u.getHours())}${n(u.getMinutes())}${n(u.getSeconds())}`;
}
function zi(u, n, t) {
  const e = u.P, r = e.FPDFPageObj_CountMarks(n);
  for (let o = 0; o < r; o++) {
    const a = e.FPDFPageObj_GetMark(n, o);
    if (u.tmp((i) => {
      const l = i(128), h = i(4);
      return e.FPDFPageObjMark_GetName(a, l, 128, h) && u.M.UTF16ToString(l) === t;
    })) return a;
  }
  return 0;
}
function rn(u, n, t) {
  const e = u.P, r = e.FPDFPageObj_CountMarks(n);
  for (let o = 0; o < r; o++) {
    const a = e.FPDFPageObj_GetMark(n, o), s = u.tmp((i) => {
      const l = i(128), h = i(4);
      if (!e.FPDFPageObjMark_GetName(a, l, 128, h) || u.M.UTF16ToString(l) !== t) return null;
      const m = (P) => {
        const D = i(512);
        return e.FPDFPageObjMark_GetParamStringValue(a, P, D, 512, h) ? u.M.UTF16ToString(D) : "";
      }, _ = m("bm").split(",").map(Number);
      let p = "";
      if (e.FPDFPageObjMark_GetParamStringValue(a, "rt", 0, 0, h)) {
        const P = u.M.getValue(h, "i32") >>> 0;
        if (P > 2) {
          const D = u.alloc(P);
          e.FPDFPageObjMark_GetParamStringValue(a, "rt", D, P, h), p = u.M.UTF16ToString(D), u.free(D);
        }
      }
      return { id: m("id"), font: m("font"), ln: +m("ln") || 0, size: +m("size") || 0, color: m("color"), lh: +m("lh") || 1.5, st: m("st"), al: m("al") || "left", bm: _.length === 6 && _.every(Number.isFinite) ? _ : null, rt: p };
    });
    if (s) return s;
  }
  return null;
}
const wr = (u) => u === Q.HIGHLIGHT || u === Q.UNDERLINE || u === Q.STRIKEOUT || u === Q.SQUIGGLY;

export { Bi, Ha, Jt, Ni, Q, So, Zn, rn, rr, vo, wo, wr, ye, yt, za };
