import { sc, tr, ur } from '../engine/richtext';
import { gt } from '../engine/text';
import { Pn, To, ws } from './interact';

async function Ss(u, n, t, e, r) {
  let o = To(t);
  for (const [s, i] of [...e].sort((l, h) => h[0] - l[0])) o = sc(o, s, i, r);
  const a = t.objs[0].margin.id;
  gt(u, n, a), ur(o).trim() && await tr(u, n, o, a);
}
const Qc = (u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function Ro(u, n) {
  const t = Qc(u);
  return new RegExp(n.wholeWord ? `(?<![\\p{L}\\p{N}\\p{M}])${t}(?![\\p{L}\\p{N}\\p{M}])` : t, "gu" + (n.matchCase ? "" : "i"));
}
const Ir = (u, n) => (u.match(new RegExp(n.source, n.flags)) || []).length;
const Do = (u) => `${u.text}|${Math.round(u.bounds.l)}|${Math.round(u.bounds.b)}`;
const eu = (u, n) => u.l < n.r && n.l < u.r && u.b < n.t && n.b < u.t;
function tu(u, n, t) {
  const e = Ro(n, t);
  let r = 0;
  for (let o = 0; o < u.doc.pageCount; o++) for (const a of Pn(u.doc.textObjects(o))) r += Ir(a.text, e);
  return r;
}
async function nu(u, n, t, e) {
  const r = Ro(n, e), o = u.doc;
  let a = 0, s = 0;
  const i = [];
  return await u.mutate(`Replace “${n}”`, { pages: "all" }, async () => {
    for (let l = 0; l < o.pageCount; l++) {
      const h = new Set(Pn(o.textObjects(l)).filter((_) => Ir(_.text, r)).map(Do));
      let m = h.size + 5;
      for (; h.size && m-- > 0; ) {
        const _ = Pn(o.textObjects(l)).find((p) => h.has(Do(p)));
        if (!_) break;
        h.delete(Do(_)), a += Ir(_.text, r), s++, _.block ? await Ss(o, l, _, [..._.text.matchAll(new RegExp(r.source, r.flags))].map((p) => [p.index, p.index + p[0].length]), t) : await ws(o, l, _, _.text.replace(new RegExp(r.source, r.flags), () => t)), i.includes(l) || i.push(l);
      }
    }
    if (!a) throw new Error("No matches to replace");
  }), { count: a, lines: s, pages: i.length };
}
async function Cs(u, n, t, e, r, o) {
  const a = Ro(e, o), s = u.doc, l = Pn(s.textObjects(n)).filter((x) => eu(x.bounds, t) && Ir(x.text, a))[0];
  if (!l) return false;
  if (l.block) {
    const x = To(l), A = ur(x), w = x.lh * x.size * Math.hypot(x.bm[0], x.bm[1]), k = Math.max(1, Math.round((l.bounds.t - l.bounds.b) / w)), G = Math.min(k - 1, Math.max(0, Math.floor((l.bounds.t - t.t) / w + 0.3))), E = (t.l - l.bounds.l) / Math.max(1, l.bounds.r - l.bounds.l), B = (G + E) / k * A.length, z = [...A.matchAll(new RegExp(a.source, a.flags))];
    if (!z.length) return false;
    const O = z.reduce((W, N) => Math.abs(N.index - B) < Math.abs(W.index - B) ? N : W);
    return await u.mutate(`Replace “${e}”`, { pages: [n] }, () => Ss(s, n, l, [[O.index, O.index + O[0].length]], r)), true;
  }
  const h = l.text, m = l.bounds, _ = (t.l - m.l) / Math.max(1, m.r - m.l), p = [...h.matchAll(new RegExp(a.source, a.flags))];
  if (!p.length) return false;
  const P = p.reduce((x, A) => Math.abs(A.index / Math.max(1, h.length) - _) < Math.abs(x.index / Math.max(1, h.length) - _) ? A : x), D = h.slice(0, P.index) + r + h.slice(P.index + P[0].length);
  return await u.mutate(`Replace “${e}”`, { pages: [n] }, () => ws(s, n, l, D)), true;
}

export { Cs, nu, tu };
