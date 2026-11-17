import { Blob as ol, Buffer as ll, Face as Xa, Font as Ya, Variation as cl, initHarfBuzz as hl, shape as ul } from '../vendor/harfbuzz';
import { Cr } from './assets';
import { rn, vo } from './pdfium';

const sn = [{ key: "helv", label: "Helvetica", group: "Standard", css: "Helvetica, Arial, sans-serif", std: ["Helvetica", "Helvetica-Bold", "Helvetica-Oblique", "Helvetica-BoldOblique"] }, { key: "times", label: "Times", group: "Standard", css: '"Times New Roman", Times, serif', std: ["Times-Roman", "Times-Bold", "Times-Italic", "Times-BoldItalic"] }, { key: "courier", label: "Courier", group: "Standard", css: '"Courier New", Courier, monospace', std: ["Courier", "Courier-Bold", "Courier-Oblique", "Courier-BoldOblique"] }, { key: "sarabun", label: "Sarabun", group: "Thai + Latin", css: "MarginSarabun", file: "Sarabun-Regular.ttf", b: "Sarabun-Bold.ttf", i: "Sarabun-Italic.ttf", bi: "Sarabun-BoldItalic.ttf" }, { key: "notosansthai", label: "Noto Sans Thai", group: "Thai + Latin", css: "MarginNotoSansThai", file: "NotoSansThai.ttf", vw: true }, { key: "notoserifthai", label: "Noto Serif Thai", group: "Thai + Latin", css: "MarginNotoSerifThai", file: "NotoSerifThai.ttf", vw: true }, { key: "kanit", label: "Kanit", group: "Thai + Latin", css: "MarginKanit", file: "Kanit-Regular.ttf", b: "Kanit-Bold.ttf", i: "Kanit-Italic.ttf", bi: "Kanit-BoldItalic.ttf" }, { key: "prompt", label: "Prompt", group: "Thai + Latin", css: "MarginPrompt", file: "Prompt-Regular.ttf", b: "Prompt-Bold.ttf", i: "Prompt-Italic.ttf", bi: "Prompt-BoldItalic.ttf" }, { key: "mitr", label: "Mitr", group: "Thai + Latin", css: "MarginMitr", file: "Mitr-Regular.ttf", b: "Mitr-Bold.ttf" }, { key: "baijamjuree", label: "Bai Jamjuree", group: "Thai + Latin", css: "MarginBaiJamjuree", file: "BaiJamjuree-Regular.ttf", b: "BaiJamjuree-Bold.ttf", i: "BaiJamjuree-Italic.ttf", bi: "BaiJamjuree-BoldItalic.ttf" }, { key: "chakrapetch", label: "Chakra Petch", group: "Thai + Latin", css: "MarginChakraPetch", file: "ChakraPetch-Regular.ttf", b: "ChakraPetch-Bold.ttf", i: "ChakraPetch-Italic.ttf", bi: "ChakraPetch-BoldItalic.ttf" }, { key: "plexthai", label: "IBM Plex Sans Thai", group: "Thai + Latin", css: "MarginPlexThai", file: "IBMPlexSansThai-Regular.ttf", b: "IBMPlexSansThai-Bold.ttf" }, { key: "roboto", label: "Roboto", group: "Latin", css: "MarginRoboto", file: "Roboto.ttf", i: "Roboto-Italic.ttf", vw: true }, { key: "opensans", label: "Open Sans", group: "Latin", css: "MarginOpenSans", file: "OpenSans.ttf", i: "OpenSans-Italic.ttf", vw: true }, { key: "lato", label: "Lato", group: "Latin", css: "MarginLato", file: "Lato-Regular.ttf", b: "Lato-Bold.ttf" }, { key: "montserrat", label: "Montserrat", group: "Latin", css: "MarginMontserrat", file: "Montserrat.ttf", i: "Montserrat-Italic.ttf", vw: true }, { key: "poppins", label: "Poppins", group: "Latin", css: "MarginPoppins", file: "Poppins-Regular.ttf", b: "Poppins-Bold.ttf", i: "Poppins-Italic.ttf", bi: "Poppins-BoldItalic.ttf" }, { key: "nunito", label: "Nunito", group: "Latin", css: "MarginNunito", file: "Nunito.ttf", i: "Nunito-Italic.ttf", vw: true }, { key: "playfair", label: "Playfair Display", group: "Latin", css: "MarginPlayfair", file: "PlayfairDisplay.ttf", i: "PlayfairDisplay-Italic.ttf", vw: true }, { key: "oswald", label: "Oswald", group: "Latin", css: "MarginOswald", file: "Oswald.ttf", vw: true }, { key: "robotomono", label: "Roboto Mono", group: "Latin", css: "MarginRobotoMono", file: "RobotoMono.ttf", i: "RobotoMono-Italic.ttf", vw: true }];
const ze = (u) => sn.find((n) => n.key === u) || sn[0];
const Dr = (u) => u.std ? u.css : `"${u.css}", sans-serif`;
const ml = /[฀-๿຀-໿က-႟ក-៿ऀ-෿]/;
const ar = (u) => ml.test(u);
const es = (u) => /[฀-๿]/.test(u);
const Br = (u) => [...u].every((n) => n.codePointAt(0) < 256 || "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ".includes(n));
const Mr = (u) => (u.bold ? "b" : "") + (u.italic ? "i" : "") + (u.underline ? "u" : "") + (u.strike ? "s" : "");
const Gr = (u) => ({ bold: u.includes("b"), italic: u.includes("i"), underline: u.includes("u"), strike: u.includes("s") });
function on(u, n) {
  const t = !!n.bold, e = !!n.italic;
  if (u.std) return { def: u, std: u.std[(t ? 1 : 0) + (e ? 2 : 0)], fakeBold: false, fakeItalic: false, key: u.key + (t ? "b" : "") + (e ? "i" : "") };
  let r = u.file, o, a = false, s = false;
  return t && e ? u.bi ? r = u.bi : u.i && u.vw ? (r = u.i, o = 700) : u.b ? (r = u.b, s = true) : u.i ? (r = u.i, a = true) : u.vw ? (o = 700, s = true) : a = s = true : t ? u.b ? r = u.b : u.vw ? o = 700 : a = true : e && (u.i ? r = u.i : s = true), { def: u, file: r, wght: o, fakeBold: a, fakeItalic: s, key: r + (o ? "@" + o : "") };
}
const fl = Math.tan(12 * Math.PI / 180);
const Xr = /* @__PURE__ */ new Map();
let Ao = null;
function _l(u) {
  return Ao = hl({ wasmBinary: u }), Ao;
}
function $t(u) {
  return an(on(u, {}));
}
function an(u) {
  if (u.std) return Promise.resolve({ bytes: new Uint8Array(), upem: 1e3, ascent: 0.75 });
  let n = Xr.get(u.key);
  return n || (n = (async () => {
    const t = u.def, e = u.file, r = await Cr("fonts/" + e).catch(() => {
      throw new Error(`Font ${t.label} failed to load`);
    }), o = new Uint8Array(r), a = { weight: t.vw ? "100 900" : e === t.b || e === t.bi ? "700" : "400", style: e === t.i || e === t.bi ? "italic" : "normal" };
    try {
      const m = new FontFace(t.css, r.slice(0), a);
      await m.load(), document.fonts.add(m);
    } catch {
    }
    await Ao;
    const s = new Xa(new ol(r.slice(0))), i = new Ya(s);
    if (u.wght) {
      const m = cl.fromString("wght=" + u.wght);
      m && i.setVariations([m]);
    }
    const l = s.upem;
    let h = 0.8;
    try {
      const m = i.hExtents ? i.hExtents() : null;
      m?.ascender && (h = m.ascender / l);
    } catch {
    }
    return { bytes: o, hbFont: i, upem: l, ascent: h, file: e };
  })(), Xr.set(u.key, n), n.catch(() => Xr.delete(u.key))), n;
}
const Qo = /* @__PURE__ */ new WeakMap();
function pl(u, n, t) {
  let e = Qo.get(u);
  (!e || e.h !== u.h) && (e = { h: u.h, m: /* @__PURE__ */ new Map() }, Qo.set(u, e));
  const r = e.m, o = n.std || n.file;
  let a = r.get(o);
  if (!a) {
    if (a = n.std ? u.P.FPDFText_LoadStandardFont(u.h, n.std) : u.P.FPDFText_LoadFont(u.h, u.lib.bytes(t.bytes), t.bytes.length, 2, true), !a) throw new Error(`PDFium could not embed ${n.def.label}`);
    r.set(o, a);
  }
  return a;
}
function Zt(u, n) {
  const t = new ll();
  t.addText(n), t.guessSegmentProperties(), ul(u.hbFont, t);
  const e = t.getGlyphInfos(), r = t.getGlyphPositions(), o = [];
  let a = 0;
  for (let s = 0; s < e.length; s++) o.push({ gid: e[s].codepoint, x: a + r[s].xOffset, y: r[s].yOffset, adv: r[s].xAdvance }), a += r[s].xAdvance;
  return { glyphs: o, width: a / u.upem };
}
function Co(u, n, t, e) {
  if (u.std) {
    const r = document.createElement("canvas").getContext("2d");
    return r.font = `${u.std.includes("Oblique") || u.std.includes("Italic") ? "italic " : ""}${u.std.includes("Bold") ? "bold " : ""}${e * 10}px ${u.def.css}`, r.measureText(t).width / 10;
  }
  return Zt(n, t).width * e;
}
async function Tr(u, n, t) {
  let e = ze(t.fontKey), r = false;
  const o = t.lines.join("");
  e.std && !Br(o) && (e = ze("sarabun"), r = true);
  const a = on(e, t), s = await an(a), i = t.id || "b" + Math.random().toString(36).slice(2, 9), l = t.lineHeight ?? 1.5, h = l * t.size, m = t.size, [_, p, P, D, x, A] = t.matrix, w = u.lib, k = u.P, G = pl(u, a, s), E = t.color, B = E.slice(0, 3).map((q) => q.toString(16).padStart(2, "0")).join(""), z = t.lines.map((q) => q ? Co(a, s, q, m) : 0), O = Math.max(0, ...z), W = a.fakeItalic ? fl : 0, N = a.fakeBold ? m * 0.035 * Math.hypot(_, p) : 0, V = { ...t.extra || {}, id: i, font: e.key, size: String(m), color: B, lh: String(l), st: Mr(t), al: t.align || "left", bm: t.matrix.map((q) => +q.toFixed(4)).join(",") };
  return u.withPage(n, (q) => {
    t.lines.forEach((Y, ne) => {
      if (!Y) return;
      const J = t.align === "center" ? (O - z[ne]) / 2 : t.align === "right" ? O - z[ne] : 0, ee = x - P * h * ne + _ * J, ae = A - D * h * ne + p * J, de = !a.std && (ar(Y) || !!a.wght);
      if (de) {
        const ce = m / s.upem;
        for (const Ge of Zt(s, Y).glyphs) {
          const ge = Fl(w, s.hbFont, Ge.gid, ($e, Ce) => {
            let Ee = (Ge.x + $e) * ce;
            const Oe = (Ge.y + Ce) * ce;
            return Ee += W * Oe, [_ * Ee + P * Oe + ee, p * Ee + D * Oe + ae];
          });
          ge && (k.FPDFPageObj_SetFillColor(ge, E[0], E[1], E[2], E[3]), N && (k.FPDFPageObj_SetStrokeColor(ge, E[0], E[1], E[2], E[3]), k.FPDFPageObj_SetStrokeWidth(ge, N), k.FPDFPageObj_SetLineJoin(ge, 1)), k.FPDFPath_SetDrawMode(ge, 1, !!N), Qn(u, ge, "MarginGlyph", { id: i }), k.FPDFPage_InsertObject(q, ge));
        }
      }
      const oe = k.FPDFPageObj_CreateTextObj(u.h, G, m), fe = w.wstr(Y);
      k.FPDFText_SetText(oe, fe), w.free(fe), k.FPDFPageObj_SetFillColor(oe, E[0], E[1], E[2], E[3]), de ? k.FPDFTextObj_SetTextRenderMode(oe, 3) : N && (k.FPDFTextObj_SetTextRenderMode(oe, 2), k.FPDFPageObj_SetStrokeColor(oe, E[0], E[1], E[2], E[3]), k.FPDFPageObj_SetStrokeWidth(oe, N));
      const we = w.floats([_, p, P + W * _, D + W * p, ee, ae]);
      k.FPDFPageObj_SetMatrix(oe, we), w.free(we), Qn(u, oe, "MarginText", { ...V, ln: String((t.ln0 || 0) + ne) }), k.FPDFPage_InsertObject(q, oe);
      for (const [ce, Ge] of [[t.underline, -0.13], [t.strike, 0.27]]) {
        if (!ce) continue;
        const ge = m * 0.055, $e = Ge * m, Ce = 0, Ee = z[ne], Oe = (f, Ct) => [_ * f + P * Ct + ee, p * f + D * Ct + ae], [Ke, Xe] = Oe(Ce, $e - ge / 2), [dt, Rt] = Oe(Ee, $e - ge / 2), [It, Le] = Oe(Ee, $e + ge / 2), [Ut, St] = Oe(Ce, $e + ge / 2), Qe = k.FPDFPageObj_CreateNewPath(Ke, Xe);
        k.FPDFPath_LineTo(Qe, dt, Rt), k.FPDFPath_LineTo(Qe, It, Le), k.FPDFPath_LineTo(Qe, Ut, St), k.FPDFPath_Close(Qe), k.FPDFPageObj_SetFillColor(Qe, E[0], E[1], E[2], E[3]), k.FPDFPath_SetDrawMode(Qe, 1, false), Qn(u, Qe, "MarginGlyph", { id: i }), k.FPDFPage_InsertObject(q, Qe);
      }
    }), k.FPDFPage_GenerateContent(q);
  }), { fontKey: e.key, fellBack: r };
}
function Qn(u, n, t, e) {
  const r = u.P.FPDFPageObj_AddMark(n, t);
  for (const [o, a] of Object.entries(e)) u.P.FPDFPageObjMark_SetStringParam(u.h, n, r, o, a);
}
function lr(u, n, t, e) {
  const r = u.glyphToPath(n);
  if (!r) return false;
  const o = r.match(/[MLQCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
  let a = 0, s = 0, i = 0;
  const l = () => +o[a++];
  for (; a < o.length; ) {
    const h = o[a++];
    if (h === "M") s = l(), i = l(), e.move(...t(s, i));
    else if (h === "L") s = l(), i = l(), e.line(...t(s, i));
    else if (h === "Q") {
      const m = l(), _ = l(), p = l(), P = l();
      e.curve(...t(s + 2 / 3 * (m - s), i + 2 / 3 * (_ - i)), ...t(p + 2 / 3 * (m - p), P + 2 / 3 * (_ - P)), ...t(p, P)), s = p, i = P;
    } else if (h === "C") {
      const m = [l(), l(), l(), l(), l(), l()];
      e.curve(...t(m[0], m[1]), ...t(m[2], m[3]), ...t(m[4], m[5])), s = m[4], i = m[5];
    } else h === "Z" && e.close();
  }
  return true;
}
function Fl(u, n, t, e) {
  const r = u.P;
  let o = 0;
  return lr(n, t, e, { move: (a, s) => {
    o ? r.FPDFPath_MoveTo(o, a, s) : o = r.FPDFPageObj_CreateNewPath(a, s);
  }, line: (a, s) => r.FPDFPath_LineTo(o, a, s), curve: (a, s, i, l, h, m) => r.FPDFPath_BezierTo(o, a, s, i, l, h, m), close: () => {
    o && r.FPDFPath_Close(o);
  } }), o;
}
function gt(u, n, t) {
  const e = u.P;
  u.withPage(n, (r) => {
    for (let o = e.FPDFPage_CountObjects(r) - 1; o >= 0; o--) {
      const a = e.FPDFPage_GetObject(r, o), s = rn(u.lib, a, "MarginGlyph") || rn(u.lib, a, "MarginText");
      s && s.id === t && (e.FPDFPage_RemoveObject(r, a), e.FPDFPageObj_Destroy(a));
    }
    e.FPDFPage_GenerateContent(r);
  });
}
function Fn(u, n, t) {
  const e = u.P;
  u.withPage(n, (r) => {
    const o = t.map((a) => e.FPDFPage_GetObject(r, a)).filter(Boolean);
    for (const a of o) e.FPDFPage_RemoveObject(r, a) && e.FPDFPageObj_Destroy(a);
    e.FPDFPage_GenerateContent(r);
  });
}
function ts(u, n, t, e) {
  const r = u.P, o = u.lib;
  return u.withPage(n, (a, s) => {
    const i = r.FPDFPage_GetObject(a, t), l = o.readW((p, P) => r.FPDFTextObj_GetText(i, s, p, P)), h = o.wstr(e);
    r.FPDFText_SetText(i, h), o.free(h);
    const m = r.FPDFText_LoadPage(a), _ = o.readW((p, P) => r.FPDFTextObj_GetText(i, m, p, P));
    if (r.FPDFText_ClosePage(m), _.replace(/\s+/g, " ").trim() !== e.replace(/\s+/g, " ").trim()) {
      const p = o.wstr(l);
      return r.FPDFText_SetText(i, p), o.free(p), false;
    }
    return r.FPDFPage_GenerateContent(a), true;
  }, { text: true });
}
async function ns(u, n, t, e, r = "sarabun") {
  const o = u.fieldLook(n, t), a = o.rect, s = a.r - a.l, i = a.t - a.b, l = o.borderWidth || 0, h = await $t(ze(r)), m = 2 + l, _ = o.multiline ? e.replace(/\r/g, "").split(`
`) : [e.replace(/[\r\n]+/g, " ")];
  let p = o.size || (o.multiline ? 11 : Math.max(6, Math.min(14, i * 0.62)));
  if (!o.multiline && !o.size) {
    const k = Zt(h, _[0]).width * p;
    k > s - m * 2 && (p = Math.max(5, p * (s - m * 2) / k));
  }
  const P = (k) => (Math.round(k * 1e3) / 1e3).toString(), D = ["q"];
  o.background && D.push(`${o.background.map((k) => P(k / 255)).join(" ")} rg ${P(a.l)} ${P(a.b)} ${P(s)} ${P(i)} re f`), o.border && l > 0 && D.push(`${o.border.map((k) => P(k / 255)).join(" ")} RG ${P(l)} w ${P(a.l + l / 2)} ${P(a.b + l / 2)} ${P(s - l)} ${P(i - l)} re S`), D.push(`${P(a.l + l)} ${P(a.b + l)} ${P(s - 2 * l)} ${P(i - 2 * l)} re W n 0 0 0 rg`);
  const x = p / h.upem, A = p * 1.2;
  let w = o.multiline ? a.t - m - h.ascent * p : a.b + (i - p) / 2 + p * 0.24;
  for (const k of _) {
    const { glyphs: G } = Zt(h, k);
    for (const E of G) lr(h.hbFont, E.gid, (z, O) => [a.l + m + (E.x + z) * x, w + (E.y + O) * x], { move: (z, O) => D.push(`${P(z)} ${P(O)} m`), line: (z, O) => D.push(`${P(z)} ${P(O)} l`), curve: (z, O, W, N, V, q) => D.push(`${P(z)} ${P(O)} ${P(W)} ${P(N)} ${P(V)} ${P(q)} c`), close: () => D.push("h") }) && D.push("f");
    w -= A;
  }
  if (D.push("Q"), !u.setNormalAppearance(n, t, D.join(`
`))) throw new Error("Could not draw the field");
}
function rs(u, n) {
  const t = u.toLowerCase().replace(/^[a-z]{6}\+/, "");
  if (es(n)) {
    for (const e of sn) if (e.group === "Thai + Latin" && t.replace(/[^a-z]/g, "").includes(e.label.toLowerCase().replace(/[^a-z]/g, ""))) return e.key;
    return "sarabun";
  }
  for (const e of sn) if (!e.std && t.replace(/[^a-z]/g, "").includes(e.label.toLowerCase().replace(/[^a-z]/g, ""))) return e.key;
  return /times|serif|georgia|garamond|roman/.test(t) ? "times" : /courier|mono|consol/.test(t) ? "courier" : "helv";
}
async function os(u, n, t) {
  let e = ze(u);
  e.std && !Br(n) && (e = ze("sarabun"));
  const r = on(e, {});
  return Co(r, await an(r), n, t);
}
function gl(u, n, t, e, r, o, a) {
  const s = u.P, i = u.lib, l = i.M;
  u.withPage(n, (h) => {
    const m = s.FPDFBitmap_Create(e, r, 1), _ = s.FPDFBitmap_GetBuffer(m), p = s.FPDFBitmap_GetStride(m);
    for (let x = 0; x < r; x++) for (let A = 0; A < e; A++) {
      const w = (x * e + A) * 4, k = _ + x * p + A * 4;
      l.HEAPU8[k] = t[w + 2], l.HEAPU8[k + 1] = t[w + 1], l.HEAPU8[k + 2] = t[w], l.HEAPU8[k + 3] = t[w + 3];
    }
    const P = s.FPDFPageObj_NewImageObj(u.h);
    s.FPDFImageObj_SetBitmap(0, 0, P, m), s.FPDFBitmap_Destroy(m);
    const D = i.floats(o);
    s.FPDFPageObj_SetMatrix(P, D), i.free(D), Qn(u, P, "MarginGlyph", { id: a }), s.FPDFPage_InsertObject(h, P), s.FPDFPage_GenerateContent(h);
  });
}
function cr(u, n) {
  let t = ze(u);
  return t.std && (t = ze({ helv: "roboto", times: "notoserifthai", courier: "robotomono" }[t.key] || "sarabun")), es(n) && t.group !== "Thai + Latin" && (t = ze("sarabun")), t;
}
const bl = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "word" }) : null;
const Pl = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "grapheme" }) : null;
const ea = (u, n) => n ? [...n.segment(u)].map((t) => t.segment) : u.split(/(?<=\s)/);
function as(u, n, t, e) {
  const r = (a) => Zt(u, a).width * t, o = [];
  for (const a of n.replace(/\r/g, "").split(`
`)) {
    let s = "";
    for (const i of ea(a, bl)) {
      if (!s || r(s + i) <= e) {
        if (s += i, r(s) <= e || /^\s+$/.test(i)) continue;
      } else if (o.push(s.trimEnd()), s = i.trimStart(), r(s) <= e) continue;
      const l = ea(s, Pl);
      s = "";
      for (const h of l) s && r(s + h) > e ? (o.push(s), s = h) : s += h;
    }
    o.push(s.trimEnd());
  }
  return o;
}
const er = 4;
async function ta(u) {
  const n = await $t(cr(u.style.fontKey, u.text)), t = u.style.border ? u.style.borderWidth : 0;
  return as(n, u.text || " ", u.style.size, u.box.r - u.box.l - 2 * (er + t)).length * u.style.size * 1.3 + 2 * (er + t);
}
async function ko(u, n, t, e) {
  const r = await $t(cr(e.style.fontKey, e.text)), { box: o, style: a } = e, s = a.border ? a.borderWidth : 0, i = (w) => (Math.round(w * 1e3) / 1e3).toString(), l = (w) => w.slice(0, 3).map((k) => i(k / 255)).join(" "), h = o.r - o.l, m = o.t - o.b, _ = ["q"];
  let p = { ...o };
  if (e.tip && a.border) {
    const w = vo(o, e.tip);
    if (Math.hypot(w.x - e.tip.x, w.y - e.tip.y) > 2) {
      const k = Math.max(1, s), G = Math.max(7, k * 4.5), E = 28 * Math.PI / 180, B = e.tip.x - w.x, z = e.tip.y - w.y, O = Math.hypot(B, z), W = B / O, N = z / O, V = (ee) => ({ x: e.tip.x - G * (W * Math.cos(E) - N * Math.sin(E) * ee), y: e.tip.y - G * (N * Math.cos(E) + W * Math.sin(E) * ee) }), q = V(1), Y = V(-1);
      _.push(`${l(a.border)} RG ${i(k)} w 1 J 1 j ${i(w.x)} ${i(w.y)} m ${i(e.tip.x)} ${i(e.tip.y)} l S ${i(q.x)} ${i(q.y)} m ${i(e.tip.x)} ${i(e.tip.y)} l ${i(Y.x)} ${i(Y.y)} l S`);
      const ne = [o.l, o.r, e.tip.x, q.x, Y.x], J = [o.b, o.t, e.tip.y, q.y, Y.y];
      p = { l: Math.min(...ne) - k, r: Math.max(...ne) + k, b: Math.min(...J) - k, t: Math.max(...J) + k };
    }
  }
  a.fill && _.push(`${l(a.fill)} rg ${i(o.l)} ${i(o.b)} ${i(h)} ${i(m)} re f`), a.border && s > 0 && _.push(`${l(a.border)} RG ${i(s)} w 0 J 0 j ${i(o.l + s / 2)} ${i(o.b + s / 2)} ${i(h - s)} ${i(m - s)} re S`), _.push(`${i(o.l + s)} ${i(o.b + s)} ${i(h - 2 * s)} ${i(m - 2 * s)} re W n ${l(a.color)} rg`);
  const P = a.size, D = P / r.upem, x = P * 1.3;
  let A = o.t - s - er - r.ascent * P - (x - P) / 2;
  for (const w of as(r, e.text, P, h - 2 * (er + s))) {
    const { glyphs: k } = Zt(r, w);
    for (const G of k) lr(r.hbFont, G.gid, (B, z) => [o.l + s + er + (G.x + B) * D, A + (G.y + z) * D], { move: (B, z) => _.push(`${i(B)} ${i(z)} m`), line: (B, z) => _.push(`${i(B)} ${i(z)} l`), curve: (B, z, O, W, N, V) => _.push(`${i(B)} ${i(z)} ${i(O)} ${i(W)} ${i(N)} ${i(V)} c`), close: () => _.push("h") }) && _.push("f");
    A -= x;
  }
  _.push("Q"), u.writeFreeText(n, t, e, p, _.join(`
`));
}
async function Dl(u, n) {
  const t = await an(on(ze("sarabun"), { bold: true })), e = u.sub ? await $t(ze("sarabun")) : null, r = 22, o = 8.5, a = 12, s = 7, i = 2.2, l = Zt(t, u.label), h = u.sub && e ? Zt(e, u.sub) : null, _ = Math.max(l.width * r, h ? h.width * o : 0) + a * 2, p = r * 1.05 + (h ? o * 1.5 : 0) + s * 2, P = { l: n.x - _ / 2, r: n.x + _ / 2, b: n.y - p / 2, t: n.y + p / 2 }, D = (E) => (Math.round(E * 1e3) / 1e3).toString(), x = u.color.slice(0, 3).map((E) => D(E / 255)).join(" "), A = ["q", `${x} RG ${x} rg`], w = (E, B, z, O, W) => {
    const N = 0.5523 * W;
    A.push(`${D(E + W)} ${D(B)} m ${D(E + z - W)} ${D(B)} l ${D(E + z - W + N)} ${D(B)} ${D(E + z)} ${D(B + W - N)} ${D(E + z)} ${D(B + W)} c ${D(E + z)} ${D(B + O - W)} l ${D(E + z)} ${D(B + O - W + N)} ${D(E + z - W + N)} ${D(B + O)} ${D(E + z - W)} ${D(B + O)} c ${D(E + W)} ${D(B + O)} l ${D(E + W - N)} ${D(B + O)} ${D(E)} ${D(B + O - W + N)} ${D(E)} ${D(B + O - W)} c ${D(E)} ${D(B + W)} l ${D(E)} ${D(B + W - N)} ${D(E + W - N)} ${D(B)} ${D(E + W)} ${D(B)} c h S`);
  };
  A.push(`${D(i)} w`), w(P.l + i / 2, P.b + i / 2, _ - i, p - i, 6), A.push(`${D(i * 0.45)} w`), w(P.l + i * 2.2, P.b + i * 2.2, _ - i * 4.4, p - i * 4.4, 4);
  const k = (E, B, z, O) => {
    const W = z / E.upem, N = n.x - B.width * z / 2;
    for (const V of B.glyphs) lr(E.hbFont, V.gid, (Y, ne) => [N + (V.x + Y) * W, O + (V.y + ne) * W], { move: (Y, ne) => A.push(`${D(Y)} ${D(ne)} m`), line: (Y, ne) => A.push(`${D(Y)} ${D(ne)} l`), curve: (Y, ne, J, ee, ae, de) => A.push(`${D(Y)} ${D(ne)} ${D(J)} ${D(ee)} ${D(ae)} ${D(de)} c`), close: () => A.push("h") }) && A.push("f");
  }, G = P.t - s;
  return k(t, l, r, G - r * 0.82), h && e && k(e, h, o, G - r * 1.05 - o * 1.05), A.push("Q"), { rect: P, content: A.join(`
`) };
}
async function yl(u, n, t, e, r) {
  const o = await $t(cr(t, n)), a = Zt(o, n), s = e / o.upem, i = -(a.width * e) / 2, l = -e * 0.35, h = u.P;
  let m = 0;
  for (const _ of a.glyphs) lr(o.hbFont, _.gid, (p, P) => r(i + (_.x + p) * s, l + (_.y + P) * s), { move: (p, P) => {
    m ? h.FPDFPath_MoveTo(m, p, P) : m = h.FPDFPageObj_CreateNewPath(p, P);
  }, line: (p, P) => h.FPDFPath_LineTo(m, p, P), curve: (p, P, D, x, A, w) => h.FPDFPath_BezierTo(m, p, P, D, x, A, w), close: () => {
    m && h.FPDFPath_Close(m);
  } });
  if (!m) throw new Error("Nothing to draw");
  return h.FPDFPath_SetDrawMode(m, 1, 0), m;
}
function na(u, n, t, e, r) {
  const o = u.P;
  u.withPage(n, (a) => {
    Qn(u, t, "MarginGlyph", { id: e }), r < 0 ? o.FPDFPage_InsertObject(a, t) : o.FPDFPage_InsertObjectAtIndex(a, t, r), o.FPDFPage_GenerateContent(a);
  });
}
function wl(u, n, t, e, r) {
  const o = u.P, a = u.lib.M, s = o.FPDFBitmap_Create(t, e, 1), i = o.FPDFBitmap_GetBuffer(s), l = o.FPDFBitmap_GetStride(s);
  for (let _ = 0; _ < e; _++) for (let p = 0; p < t; p++) {
    const P = (_ * t + p) * 4, D = i + _ * l + p * 4;
    a.HEAPU8[D] = n[P + 2], a.HEAPU8[D + 1] = n[P + 1], a.HEAPU8[D + 2] = n[P], a.HEAPU8[D + 3] = n[P + 3];
  }
  const h = o.FPDFPageObj_NewImageObj(u.h);
  o.FPDFImageObj_SetBitmap(0, 0, h, s), o.FPDFBitmap_Destroy(s);
  const m = u.lib.floats(r);
  return o.FPDFPageObj_SetMatrix(h, m), u.lib.free(m), h;
}

export { $t, Br, Co, Dl, Dr, Fn, Gr, Mr, Tr, _l, an, ar, cr, gl, gt, ko, na, ns, on, os, rs, sn, ta, ts, wl, yl, ze };
