const xo = 4294967295;
function Vr(u, n) {
  const t = ArrayBuffer;
  if (typeof t.prototype.resize == "function") for (const e of [n, u * 2 + (64 << 20), u + (256 << 20), u + (16 << 20)]) {
    const r = Math.min(xo, Math.max(u, e));
    try {
      return new t(u, { maxByteLength: r });
    } catch {
    }
  }
  return new ArrayBuffer(u);
}
class Yt {
  buf;
  len;
  constructor(n, t) {
    this.buf = n, this.len = t;
  }
  static from(n) {
    const t = Vr(n.length, n.length * 2 + 67108864);
    return new Uint8Array(t, 0, n.length).set(n), new Yt(t, n.length);
  }
  static async fromFile(n) {
    if (n.size > xo) throw new Error("Files over 4 GB can’t be opened");
    const t = Vr(n.size, n.size * 2 + (64 << 20)), e = new Uint8Array(t, 0, n.size);
    let r = 0;
    const o = n.stream().getReader();
    for (; ; ) {
      const { done: a, value: s } = await o.read();
      if (a) break;
      e.set(s.subarray(0, Math.max(0, n.size - r)), r), r += s.length;
    }
    if (r !== n.size) throw new Error("The file changed while it was being read");
    return new Yt(t, n.size);
  }
  view(n = this.len) {
    return new Uint8Array(this.buf, 0, n);
  }
  writeAt(n, t) {
    const e = n + t.length;
    if (e > xo) throw new Error("This document has grown past 4 GB");
    const r = this.buf;
    if (e > r.byteLength) if (r.resizable && e <= r.maxByteLength) r.resize(Math.min(r.maxByteLength, Math.max(e, r.byteLength + (1 << 20))));
    else {
      const o = Vr(e, e * 2 + 67108864);
      new Uint8Array(o, 0, n).set(new Uint8Array(this.buf, 0, n)), o.byteLength < e && o.resize?.(e), this.buf = o;
    }
    new Uint8Array(this.buf, n, t.length).set(t), this.len = e;
  }
}

export { Yt };
