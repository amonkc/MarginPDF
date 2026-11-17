import { Dl } from '../engine/text';
import { H } from './dom';

const Fr = [22, 140, 82, 255];
const Wn = [196, 40, 40, 255];
const Yr = [37, 99, 235, 255];
const Kl = [124, 77, 219, 255];
const Rn = [{ key: "approved", label: "APPROVED", color: Fr }, { key: "rejected", label: "REJECTED", color: Wn }, { key: "draft", label: "DRAFT", color: Yr }, { key: "final", label: "FINAL", color: Fr }, { key: "confidential", label: "CONFIDENTIAL", color: Wn }, { key: "forcomment", label: "FOR COMMENT", color: Yr }, { key: "received", label: "RECEIVED", color: Kl }, { key: "paid", label: "PAID", color: Fr }, { key: "void", label: "VOID", color: Wn }, { key: "th-copy", label: "สำเนาถูกต้อง", color: Yr }, { key: "th-approved", label: "อนุมัติ", color: Fr }, { key: "th-urgent", label: "ด่วน", color: Wn }, { key: "th-secret", label: "ลับ", color: Wn }];
function Xl(u) {
  const n = u.settings;
  if (n.stamp === "custom") {
    const t = n.stampCustom.trim();
    return t ? { label: t, color: n.stampColor } : null;
  }
  return Rn.find((t) => t.key === n.stamp) || Rn[0];
}
const ql = () => (/* @__PURE__ */ new Date()).toLocaleString(void 0, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
async function Yl(u, n, t) {
  const e = Xl(u);
  if (!e) return H("Type the custom stamp text first", "warn"), null;
  const r = u.settings.stampDated ? `${u.settings.author} · ${ql()}` : void 0;
  let o = null;
  return await u.mutate("Stamp", { pages: [n.index] }, async () => {
    const a = await Dl({ label: e.label, color: e.color, sub: r }, t);
    o = u.doc.addDrawnStamp(n.index, a.rect, r ? `${e.label} — ${r}` : e.label, a.content, u.settings.author);
  }).catch((a) => H(a.message, "err")), o;
}

export { Rn, Yl };
