const vc = (() => {
  const u = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let t = n;
    for (let e = 0; e < 8; e++) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
    u[n] = t >>> 0;
  }
  return u;
})();
const xc = (u) => {
  let n = 4294967295;
  for (let t = 0; t < u.length; t++) n = vc[(n ^ u[t]) & 255] ^ n >>> 8;
  return (n ^ 4294967295) >>> 0;
};
function vs(u) {
  const n = new TextEncoder(), t = [], e = [];
  let r = 0;
  const o = /* @__PURE__ */ new Date(), a = o.getHours() << 11 | o.getMinutes() << 5 | o.getSeconds() >> 1, s = o.getFullYear() - 1980 << 9 | o.getMonth() + 1 << 5 | o.getDate();
  for (const p of u) {
    const P = n.encode(p.name), D = xc(p.data), x = p.data.length, A = new DataView(new ArrayBuffer(30));
    A.setUint32(0, 67324752, true), A.setUint16(4, 20, true), A.setUint16(6, 2048, true), A.setUint16(8, 0, true), A.setUint16(10, a, true), A.setUint16(12, s, true), A.setUint32(14, D, true), A.setUint32(18, x, true), A.setUint32(22, x, true), A.setUint16(26, P.length, true), A.setUint16(28, 0, true), t.push(new Uint8Array(A.buffer), P, p.data);
    const w = new DataView(new ArrayBuffer(46));
    w.setUint32(0, 33639248, true), w.setUint16(4, 20, true), w.setUint16(6, 20, true), w.setUint16(8, 2048, true), w.setUint16(10, 0, true), w.setUint16(12, a, true), w.setUint16(14, s, true), w.setUint32(16, D, true), w.setUint32(20, x, true), w.setUint32(24, x, true), w.setUint16(28, P.length, true), w.setUint32(42, r, true), e.push(new Uint8Array(w.buffer), P), r += 30 + P.length + x;
  }
  const i = e.reduce((p, P) => p + P.length, 0), l = new DataView(new ArrayBuffer(22));
  l.setUint32(0, 101010256, true), l.setUint16(8, u.length, true), l.setUint16(10, u.length, true), l.setUint32(12, i, true), l.setUint32(16, r, true);
  const h = [...t, ...e, new Uint8Array(l.buffer)], m = new Uint8Array(h.reduce((p, P) => p + P.length, 0));
  let _ = 0;
  for (const p of h) m.set(p, _), _ += p.length;
  return m;
}

export { vs };
