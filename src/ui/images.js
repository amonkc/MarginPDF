const Jl = "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/avif";
const Zl = (u) => /^image\/(png|jpe?g|webp|gif|bmp|avif)$/i.test(u.type) || /\.(png|jpe?g|webp|gif|bmp|avif)$/i.test(u.name);
const Ql = 300;
const ec = 4e3;
async function Eo(u, n = "Image") {
  let t;
  try {
    t = await createImageBitmap(u, { imageOrientation: "from-image" });
  } catch {
    throw new Error("That file is not an image this browser can read");
  }
  const e = /jpe?g/i.test(u.type) || /\.jpe?g$/i.test(n);
  return { bitmap: t, w: t.width, h: t.height, jpeg: e, url: URL.createObjectURL(u), name: n };
}
function aa(u, n, t, e, r) {
  let o = u.w * 0.75 * t, a = u.h * 0.75 * t;
  const s = n.w * t * 0.8, i = n.h * t * 0.8, l = Math.min(1, s / o, i / a);
  o *= l, a *= l;
  const h = n.w * t, m = n.h * t, _ = Math.max(0, Math.min(h - o, e - o / 2)), p = Math.max(0, Math.min(m - a, r - a / 2));
  return { x: _, y: p, w: o, h: a };
}
function sa(u, n, t, e, r) {
  const o = Math.abs(e - n), a = Math.abs(r - t), s = u.w / u.h, i = Math.min(o, a * s), l = i / s;
  return { x: e >= n ? n : n - i, y: r >= t ? t : t - l, w: i, h: l };
}
function ps(u, n) {
  const [t, e] = u.inv.apply(n.x, n.y + n.h), [r, o] = u.inv.apply(n.x + n.w, n.y + n.h), [a, s] = u.inv.apply(n.x, n.y);
  return [r - t, o - e, a - t, s - e, t, e];
}
async function Fs(u, n, t) {
  const e = Math.min(1, Math.max(n, t) / 72 * Ql / Math.max(u.w, u.h), ec / Math.max(u.w, u.h)), r = Math.max(1, Math.round(u.w * e)), o = Math.max(1, Math.round(u.h * e)), a = document.createElement("canvas");
  a.width = r, a.height = o;
  const s = a.getContext("2d");
  if (s.imageSmoothingQuality = "high", u.jpeg && (s.fillStyle = "#fff", s.fillRect(0, 0, r, o)), s.drawImage(u.bitmap, 0, 0, r, o), u.jpeg) {
    const i = await new Promise((l) => a.toBlob(l, "image/jpeg", 0.9));
    if (i) return { jpeg: new Uint8Array(await i.arrayBuffer()) };
  }
  return { rgba: s.getImageData(0, 0, r, o).data, w: r, h: o };
}
function gs() {
  return new Promise((u) => {
    document.querySelectorAll("input.img-file").forEach((r) => r.remove());
    const n = document.createElement("input");
    n.type = "file", n.accept = Jl, n.className = "img-file";
    let t = false;
    const e = (r) => {
      t || (t = true, n.remove(), u(r));
    };
    n.addEventListener("change", () => e(n.files?.[0] || null)), n.addEventListener("cancel", () => e(null)), n.style.display = "none", document.body.append(n), n.click();
  });
}
async function ia(u, n, t, e) {
  if (e) {
    const r = document.createElement("canvas");
    r.width = n, r.height = t, r.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(u), n, t), 0, 0);
    const o = await new Promise((a) => r.toBlob(a, "image/jpeg", 0.92));
    if (o) return { jpeg: new Uint8Array(await o.arrayBuffer()) };
  }
  return { rgba: u, w: n, h: t };
}

export { Eo, Fs, Zl, aa, gs, ia, ps, sa };
