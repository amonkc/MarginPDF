import { Br, Co, Tr, an, on, ze } from './text';

const nc = 1.6;
const On = (u) => u.slice(0, 3).map((n) => n.toString(16).padStart(2, "0")).join("");
const bs = (u) => {
  const n = parseInt((u || "000000").padEnd(6, "0").slice(0, 6), 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255, 255];
};
const Ps = (u, n) => !!u.b == !!n.b && !!u.i == !!n.i && !!u.u == !!n.u && !!u.s == !!n.s && (u.c || "") === (n.c || "") && (u.f || "") === (n.f || "") && (u.z || 0) === (n.z || 0);
const Or = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "grapheme" }) : null;
const la = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "word" }) : null;
const ur = (u) => u.paras.map((n) => n.map((t) => t.t).join("")).join(`
`);
const rc = (u) => encodeURIComponent(JSON.stringify(u));
function Mo(u) {
  try {
    const n = JSON.parse(decodeURIComponent(u));
    return n?.v === 1 && Array.isArray(n.paras) ? n : null;
  } catch {
    return null;
  }
}
function Go(u) {
  const n = u.map((o) => o.t).join("");
  if (!n) return [{ t: "" }];
  const t = [];
  for (const o of u) for (let a = 0; a < o.t.length; a++) t.push(o);
  const e = [], r = Or ? [...Or.segment(n)] : [...n].map((o, a) => ({ segment: o, index: a }));
  for (const o of r) {
    const a = t[o.index], s = e[e.length - 1];
    if (s && Ps(s, a)) s.t += o.segment;
    else {
      const i = { t: o.segment };
      a.b && (i.b = true), a.i && (i.i = true), a.u && (i.u = true), a.s && (i.s = true), a.c && (i.c = a.c), a.f && (i.f = a.f), a.z && (i.z = a.z), e.push(i);
    }
  }
  return e;
}
function oc(u, n) {
  const t = n.st.includes("b"), e = n.st.includes("i"), r = n.st.includes("u"), o = n.st.includes("s");
  return { v: 1, paras: u.map((a) => [{ t: a, ...t ? { b: t } : {}, ...e ? { i: e } : {}, ...r ? { u: r } : {}, ...o ? { s: o } : {} }]), font: n.font, size: n.size, color: n.color, align: n.align, lh: n.lh, bm: n.bm };
}
function Ds(u) {
  const n = ze(u.font);
  return n.std && !Br(ur(u).replace(/\n/g, "")) ? ze("sarabun") : n;
}
function ys(u, n) {
  if (!n.f) return Ds(u);
  const t = ze(n.f);
  return t.std && !Br(n.t) ? ze("sarabun") : t;
}
const vr = (u, n) => n.z || u.size;
async function ac(u) {
  const n = /* @__PURE__ */ new Map(), t = async (l, h) => {
    const m = ys(u, { ...l, t: h }), _ = m.key + (l.b ? "b" : "") + (l.i ? "i" : "");
    let p = n.get(_);
    if (!p) {
      const P = on(m, { bold: l.b, italic: l.i });
      p = { face: P, l: await an(P) }, n.set(_, p);
    }
    return p;
  }, e = async (l, h) => {
    if (!h) return 0;
    const m = await t(l, l.t || h);
    return Co(m.face, m.l, h, vr(u, l));
  };
  let r = 0, o = true;
  const a = u.width && u.width > 0 ? u.width : 1 / 0, s = [];
  let i = 0;
  for (const [l, h] of u.paras.entries()) {
    const m = u.lists?.[l] || null;
    i = m === "n" ? i + 1 : 0;
    const _ = m ? u.size * nc : 0, p = a - _, P = h.length ? h : [{ t: "" }], D = P.map((O) => O.t).join(""), x = [];
    let A = 0;
    for (const O of P) x.push(A), A += O.t.length;
    const w = (O) => {
      let W = 0;
      for (; W + 1 < x.length && x[W + 1] <= O; ) W++;
      return W;
    }, k = la ? [...la.segment(D)] : D.split(/(\s+)/).filter(Boolean).reduce((O, W) => (O.push({ segment: W, index: O.length ? O[O.length - 1].index + O[O.length - 1].segment.length : 0 }), O), []), G = [];
    for (const O of k) {
      const W = [];
      let N = O.index;
      const V = O.index + O.segment.length;
      for (; N < V; ) {
        const q = w(N), Y = Math.min(V, q + 1 < x.length ? x[q + 1] : V), ne = D.slice(N, Y);
        W.push({ run: P[q], text: ne, w: await e(P[q], ne) }), N = Y;
      }
      G.push({ parts: W, w: W.reduce((q, Y) => q + Y.w, 0), space: /^\s+$/.test(O.segment) });
    }
    const E = [];
    for (const O of G) {
      if (O.w <= p || O.space) {
        E.push(O);
        continue;
      }
      let W = [], N = 0;
      for (const V of O.parts) {
        const q = Or ? [...Or.segment(V.text)].map((Y) => Y.segment) : [...V.text];
        for (const Y of q) {
          const ne = await e(V.run, Y);
          W.length && N + ne > p && (E.push({ parts: W, w: N, space: false }), W = [], N = 0);
          const J = W[W.length - 1];
          J && J.run === V.run ? (J.text += Y, J.w += ne) : W.push({ run: V.run, text: Y, w: ne }), N += ne;
        }
      }
      W.length && E.push({ parts: W, w: N, space: false });
    }
    const B = [[]];
    let z = 0;
    for (const O of E) {
      const W = B[B.length - 1];
      if (W.length && !O.space && z + O.w > p) {
        B.push([O]), z = O.w;
        continue;
      }
      !W.length && O.space && B.length > 1 || (W.push(O), z += O.w);
    }
    for (const [O, W] of B.entries()) {
      for (; W.length && W[W.length - 1].space; ) W.pop();
      const N = W.reduce((oe, fe) => oe + fe.w, 0), V = O === B.length - 1, q = p === 1 / 0 ? 0 : p - N;
      let Y = _ + (u.align === "center" ? q / 2 : u.align === "right" ? q : 0);
      const ne = u.align === "justify" && !V ? W.filter((oe) => oe.space).length : 0, J = ne ? q / ne : 0, ee = [];
      for (const oe of W) {
        for (const fe of oe.parts) {
          const we = ee[ee.length - 1];
          we && we.run === fe.run && !ne ? (we.text += fe.text, we.w += fe.w) : ee.push({ text: fe.text, run: fe.run, x: Y, w: fe.w }), Y += fe.w;
        }
        oe.space && ne && (Y += J);
      }
      const ae = ee.filter((oe) => oe.text.trim() || oe.run.u || oe.run.s);
      if (m && O === 0) {
        const oe = { t: "", ...P[0].c ? { c: P[0].c } : {}, ...P[0].b ? { b: true } : {}, ...P[0].z ? { z: P[0].z } : {}, ...P[0].f ? { f: P[0].f } : {} }, fe = m === "b" ? "•" : `${i}.`, we = await e(oe, fe);
        ae.unshift({ text: fe, run: oe, x: Math.max(0, _ - u.size * 0.45 - we), w: we });
      }
      const de = Math.max(...ae.length ? ae.map((oe) => vr(u, oe.run)) : P.map((oe) => vr(u, oe)));
      o || (r += u.lh * de), o = false, s.push({ segs: ae, width: N, para: l, lastOfPara: V, y: r, size: de });
    }
  }
  return s;
}
async function tr(u, n, t, e) {
  const r = await ac(t), o = e || "b" + Math.random().toString(36).slice(2, 9), [a, s, i, l, h, m] = t.bm;
  let _ = true;
  for (const [p, P] of r.entries()) for (const D of P.segs) {
    const x = h - i * P.y + a * D.x, A = m - l * P.y + s * D.x;
    await Tr(u, n, { lines: [D.text], fontKey: ys(t, D.run).key, size: vr(t, D.run), color: bs(D.run.c || t.color), matrix: [a, s, i, l, x, A], bold: D.run.b, italic: D.run.i, underline: D.run.u, strike: D.run.s, id: o, lineHeight: t.lh, align: "left", ln0: p, extra: _ ? { rt: rc(t) } : void 0 }), _ = false;
  }
  return _ ? { id: o, lines: 0 } : { id: o, lines: r.length };
}
function sc(u, n, t, e) {
  const r = [];
  u.paras.forEach((P, D) => {
    D && r.push({ ch: `
`, run: {} });
    for (const x of P) for (const A of x.t) r.push({ ch: A, run: x });
  });
  const o = [];
  for (const P of r) for (const D of P.ch.split("")) o.push({ ch: D, run: P.run });
  const a = o[n]?.run && o[n].ch !== `
` ? o[n].run : o[Math.max(0, n - 1)]?.run || {}, s = e.split("").map((P) => ({ ch: P, run: P === `
` ? {} : a })), i = [...o.slice(0, n), ...s, ...o.slice(t)], l = [[]];
  for (const P of i) {
    if (P.ch === `
`) {
      l.push([]);
      continue;
    }
    const D = l[l.length - 1], x = D[D.length - 1];
    x && Ps(x, P.run) ? x.t += P.ch : D.push({ ...P.run, t: P.ch });
  }
  const h = o.slice(0, n).filter((P) => P.ch === `
`).length, m = o.slice(n, t).filter((P) => P.ch === `
`).length, _ = e.split(`
`).length - 1, p = u.lists ? [...u.lists.slice(0, h + 1), ...Array(_).fill(u.lists[h] ?? null), ...u.lists.slice(h + 1 + m)] : void 0;
  return { ...u, paras: l.map(Go), ...p ? { lists: p } : {} };
}
const ic = (u) => u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function lc(u, n, t) {
  const e = u.paras.map((o, a) => ({ inner: o.filter((i) => i.t).map((i) => {
    let l = ic(i.t);
    return i.s && (l = `<s>${l}</s>`), i.u && (l = `<u>${l}</u>`), i.i && (l = `<i>${l}</i>`), i.b && (l = `<b>${l}</b>`), i.c && i.c !== u.color && (l = `<font color="#${i.c}">${l}</font>`), i.z && i.z !== u.size && (l = `<span data-z="${i.z}" style="font-size:${n(i.z)}px">${l}</span>`), i.f && i.f !== u.font && (l = `<span data-f="${i.f}" style="font-family:${t(i.f).replace(/"/g, "&quot;")}">${l}</span>`), l;
  }).join("") || "<br>", list: u.lists?.[a] || null, first: a === 0 }));
  let r = "";
  for (let o = 0; o < e.length; ) {
    const a = e[o];
    if (a.list) {
      const s = a.list === "n" ? "ol" : "ul";
      let i = "";
      for (; o < e.length && e[o].list === a.list; ) i += `<li>${e[o++].inner}</li>`;
      r += `<${s}>${i}</${s}>`;
    } else r += a.first ? a.inner : `<div>${a.inner}</div>`, o++;
  }
  return r;
}
const ca = /* @__PURE__ */ new Set(["DIV", "P", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "PRE"]);
function ua(u) {
  const n = u.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (n) return [n[1], n[2], n[3]].map((e) => (+e).toString(16).padStart(2, "0")).join("");
  const t = u.replace("#", "").trim();
  return /^[0-9a-f]{6}$/i.test(t) ? t.toLowerCase() : /^[0-9a-f]{3}$/i.test(t) ? t.split("").map((e) => e + e).join("").toLowerCase() : "";
}
function cc(u, n) {
  const t = { ...u }, e = n.tagName;
  (e === "B" || e === "STRONG") && (t.b = true), (e === "I" || e === "EM") && (t.i = true), (e === "U" || e === "INS") && (t.u = true), (e === "S" || e === "STRIKE" || e === "DEL") && (t.s = true), e === "FONT" && n.getAttribute("color") && (t.c = ua(n.getAttribute("color")) || t.c);
  const r = n.style;
  r.fontWeight && (t.b = r.fontWeight === "bold" || r.fontWeight === "bolder" || +r.fontWeight >= 600), r.fontStyle && (t.i = r.fontStyle === "italic" || r.fontStyle === "oblique");
  const o = r.textDecorationLine || r.textDecoration;
  return o && (o.includes("underline") && (t.u = true), o.includes("line-through") && (t.s = true), o === "none" && (t.u = false, t.s = false)), r.color && (t.c = ua(r.color) || t.c), n.dataset.f && (t.f = n.dataset.f), n.dataset.z && (t.z = +n.dataset.z || t.z), t;
}
function uc(u, n, t = "", e = 0) {
  const r = [], o = [];
  let a = [], s = false, i = null, l = null;
  const h = () => {
    r.push(a), o.push(l), a = [], s = false, l = i && l ? l : null;
  }, m = (_, p) => {
    const P = [..._.childNodes];
    P.forEach((D, x) => {
      if (D.nodeType === Node.TEXT_NODE) {
        const k = (D.textContent || "").replace(/\u00a0/g, " ").replace(/\u200b/g, "");
        if (k) {
          const G = { t: k };
          p.b && (G.b = true), p.i && (G.i = true), p.u && (G.u = true), p.s && (G.s = true), p.c && p.c !== n && (G.c = p.c), p.f && p.f !== t && (G.f = p.f), p.z && p.z !== e && (G.z = p.z), a.push(G), s = true;
        }
        return;
      }
      if (!(D instanceof HTMLElement)) return;
      if (D.tagName === "BR") {
        x === P.length - 1 && (_ === u || ca.has(_.tagName)) ? s = true : h();
        return;
      }
      const A = ca.has(D.tagName) || D.tagName === "UL" || D.tagName === "OL";
      A && (s || a.length) && h();
      const w = i;
      D.tagName === "UL" ? i = "b" : D.tagName === "OL" && (i = "n"), D.tagName === "LI" && (l = i), m(D, cc(p, D)), A && (s || a.length) && h(), D.tagName === "LI" && (l = null), i = w;
    });
  };
  return m(u, { b: false, i: false, u: false, s: false, c: n }), (s || a.length || !r.length) && h(), { paras: r, lists: o };
}
function ha(u, n, t, e) {
  const r = document.getSelection();
  if (!r || r.isCollapsed || !u.contains(r.anchorNode)) return false;
  try {
    document.execCommand("styleWithCSS", false, "false");
  } catch {
  }
  n === "f" ? document.execCommand("fontName", false, "__margin_font__") : document.execCommand("fontSize", false, "7");
  const o = [], a = [...u.querySelectorAll(n === "f" ? 'font[face="__margin_font__"]' : 'font[size="7"]')];
  for (const s of a) {
    const i = document.createElement("span");
    for (i.dataset[n] = t, i.style.setProperty(n === "f" ? "font-family" : "font-size", e), s.querySelectorAll(`[data-${n}]`).forEach((l) => {
      const h = l;
      delete h.dataset[n], h.style.removeProperty(n === "f" ? "font-family" : "font-size");
    }), s.querySelectorAll(n === "f" ? "font[face]" : "font[size]").forEach((l) => l.removeAttribute(n === "f" ? "face" : "size")); s.firstChild; ) i.append(s.firstChild);
    s.replaceWith(i), o.push(i);
  }
  if (o.length) {
    const s = document.createRange();
    s.setStartBefore(o[0]), s.setEndAfter(o[o.length - 1]), r.removeAllRanges(), r.addRange(s);
  }
  return o.length > 0;
}

export { Ds, Go, Mo, On, bs, ha, lc, oc, sc, tr, uc, ur };
