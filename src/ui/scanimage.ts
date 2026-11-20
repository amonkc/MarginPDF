// Image processing for scanning documents with a camera: find the page in a photo, straighten it, clean it up.
// Plain JavaScript on RGBA pixel buffers (no OpenCV: that would be ~8 MB to download).

/** A point in image pixels. */
export type P2 = [number, number];
/** The page's corners in a photo, in image pixels: top-left, top-right, bottom-right, bottom-left. */
export type Quad = [P2, P2, P2, P2];
/** RGBA pixels (the shape of ImageData, without needing a DOM). */
export type Pixels = { data: Uint8ClampedArray; width: number; height: number };
/** Clean-up applied to a straightened page. */
export type ScanFilter = "colour" | "clean" | "bw";

const lum = (d: Uint8ClampedArray, i: number) => (d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8;

/** Box blur of a grey image in place (separable, radius r). */
function blurGrey(g: Float32Array, w: number, h: number, r: number): void {
  const tmp = new Float32Array(g.length), n = 2 * r + 1;
  for (let y = 0; y < h; y++) {
    let sum = 0;
    for (let x = -r; x <= r; x++) sum += g[y * w + Math.min(w - 1, Math.max(0, x))];
    for (let x = 0; x < w; x++) {
      tmp[y * w + x] = sum / n;
      sum += g[y * w + Math.min(w - 1, x + r + 1)] - g[y * w + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = -r; y <= r; y++) sum += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (let y = 0; y < h; y++) {
      g[y * w + x] = sum / n;
      sum += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x];
    }
  }
}

/** Otsu's threshold of a grey image (0–255 values). */
function otsu(g: Float32Array): number {
  const hist = new Float64Array(256);
  for (const v of g) hist[Math.max(0, Math.min(255, v | 0))]++;
  let total = 0, sum = 0;
  for (let i = 0; i < 256; i++) {
    total += hist[i];
    sum += i * hist[i];
  }
  let best = 0, bestT = 128, wB = 0, sumB = 0;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB || wB === total) continue;
    sumB += t * hist[t];
    const mB = sumB / wB, mF = (sum - sumB) / (total - wB), between = wB * (total - wB) * (mB - mF) ** 2;
    if (between > best) {
      best = between;
      bestT = t;
    }
  }
  return bestT;
}

const area = (q: Quad) => Math.abs(q.reduce((s, p, i) => s + p[0] * q[(i + 1) % 4][1] - q[(i + 1) % 4][0] * p[1], 0)) / 2;

/**
 * Finds the page in a (small, ~500 px) photo: the largest region brighter than its surroundings, its corners
 * taken as the extreme points along the diagonals. Null when nothing page-like stands out (the caller then
 * proposes the whole photo).
 */
function detectQuad(img: Pixels): Quad | null {
  const { width: w, height: h, data } = img, n = w * h, g = new Float32Array(n);
  for (let i = 0; i < n; i++) g[i] = lum(data, i * 4);
  blurGrey(g, w, h, 2);
  const t = otsu(g), mask = new Uint8Array(n);
  for (let i = 0; i < n; i++) mask[i] = g[i] > t ? 1 : 0;
  // Largest 4-connected bright region.
  const label = new Int32Array(n), stack = new Int32Array(n);
  let best = 0, bestLabel = 0, next = 1;
  for (let s = 0; s < n; s++) {
    if (!mask[s] || label[s]) continue;
    let top = 0, size = 0;
    stack[top++] = s;
    label[s] = next;
    while (top) {
      const i = stack[--top], x = i % w;
      size++;
      if (x > 0 && mask[i - 1] && !label[i - 1]) (label[i - 1] = next), (stack[top++] = i - 1);
      if (x < w - 1 && mask[i + 1] && !label[i + 1]) (label[i + 1] = next), (stack[top++] = i + 1);
      if (i >= w && mask[i - w] && !label[i - w]) (label[i - w] = next), (stack[top++] = i - w);
      if (i < n - w && mask[i + w] && !label[i + w]) (label[i + w] = next), (stack[top++] = i + w);
    }
    if (size > best) (best = size), (bestLabel = next);
    next++;
  }
  if (best < n * 0.12) return null;
  let tl: P2 = [0, 0], tr: P2 = [0, 0], br: P2 = [0, 0], bl: P2 = [0, 0], minS = Infinity, maxS = -Infinity, minD = Infinity, maxD = -Infinity;
  for (let i = 0; i < n; i++) {
    if (label[i] !== bestLabel) continue;
    const x = i % w, y = (i / w) | 0, s = x + y, d = x - y;
    if (s < minS) (minS = s), (tl = [x, y]);
    if (s > maxS) (maxS = s), (br = [x, y]);
    if (d > maxD) (maxD = d), (tr = [x, y]);
    if (d < minD) (minD = d), (bl = [x, y]);
  }
  const quad: Quad = [tl, tr, br, bl], a = area(quad);
  // Too small, or the whole frame (the background was the bright part): not a page.
  if (a < n * 0.12 || a > n * 0.985) return null;
  return quad;
}

/** The whole photo, inset a little: what's proposed when no page is found. */
const insetQuad = (w: number, h: number, k = 0.04): Quad => [[w * k, h * k], [w * (1 - k), h * k], [w * (1 - k), h * (1 - k)], [w * k, h * (1 - k)]];

/** 3×3 projective transform (row-major, h33 = 1) taking the four points `from` to `to`. */
function homography(from: P2[], to: P2[]): number[] {
  const A: number[][] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = from[i], [u, v] = to[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]);
  }
  // Gaussian elimination with partial pivoting on the 8×9 augmented matrix.
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 9; k++) A[r][k] -= f * A[c][k];
    }
  }
  return [...A.map((row, i) => row[8] / row[i]), 1];
}

const dist = (a: P2, b: P2) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** Size of the straightened page: the quad's longer opposite sides, the long side capped at `maxLong`. */
function outputSize(q: Quad, maxLong = 2400): [number, number] {
  let w = Math.max(dist(q[0], q[1]), dist(q[3], q[2])), h = Math.max(dist(q[0], q[3]), dist(q[1], q[2]));
  const k = Math.min(1, maxLong / Math.max(w, h));
  w = Math.max(1, Math.round(w * k));
  h = Math.max(1, Math.round(h * k));
  return [w, h];
}

/** The quad's contents mapped onto a w × h rectangle (bilinear sampling). */
function warp(src: Pixels, q: Quad, w: number, h: number): Pixels {
  const H = homography([[0, 0], [w, 0], [w, h], [0, h]], q), out = new Uint8ClampedArray(w * h * 4), sd = src.data, sw = src.width, sh = src.height;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cx = x + 0.5, cy = y + 0.5, z = H[6] * cx + H[7] * cy + 1;
      let sx = (H[0] * cx + H[1] * cy + H[2]) / z - 0.5, sy = (H[3] * cx + H[4] * cy + H[5]) / z - 0.5;
      sx = Math.max(0, Math.min(sw - 1.001, sx));
      sy = Math.max(0, Math.min(sh - 1.001, sy));
      const x0 = sx | 0, y0 = sy | 0, fx = sx - x0, fy = sy - y0, i00 = (y0 * sw + x0) * 4, i10 = i00 + 4, i01 = i00 + sw * 4, i11 = i01 + 4, o = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        out[o + c] = (sd[i00 + c] * (1 - fx) + sd[i10 + c] * fx) * (1 - fy) + (sd[i01 + c] * (1 - fx) + sd[i11 + c] * fx) * fy;
      }
      out[o + 3] = 255;
    }
  }
  return { data: out, width: w, height: h };
}

/**
 * Paper brightness across the page (to even out shadows): the bright end of each 32 px block, smoothed and
 * interpolated back to every pixel.
 */
function background(g: Float32Array, w: number, h: number): Float32Array {
  const B = 32, bw = Math.ceil(w / B), bh = Math.ceil(h / B), blocks = new Float32Array(bw * bh), hist = new Uint32Array(256);
  for (let by = 0; by < bh; by++) {
    for (let bx = 0; bx < bw; bx++) {
      hist.fill(0);
      let count = 0;
      for (let y = by * B; y < Math.min(h, (by + 1) * B); y++) for (let x = bx * B; x < Math.min(w, (bx + 1) * B); x++) (hist[g[y * w + x] | 0]++, count++);
      let acc = 0, v = 255;
      for (; v > 0; v--) if ((acc += hist[v]) >= count * 0.1) break; // 90th percentile
      blocks[by * bw + bx] = Math.max(v, 40);
    }
  }
  blurGrey(blocks, bw, bh, 1);
  const bg = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const fy = Math.max(0, Math.min(bh - 1, y / B - 0.5)), y0 = fy | 0, y1 = Math.min(bh - 1, y0 + 1), ty = fy - y0;
    for (let x = 0; x < w; x++) {
      const fx = Math.max(0, Math.min(bw - 1, x / B - 0.5)), x0 = fx | 0, x1 = Math.min(bw - 1, x0 + 1), tx = fx - x0;
      bg[y * w + x] = (blocks[y0 * bw + x0] * (1 - tx) + blocks[y0 * bw + x1] * tx) * (1 - ty) + (blocks[y1 * bw + x0] * (1 - tx) + blocks[y1 * bw + x1] * tx) * ty;
    }
  }
  return bg;
}

/**
 * Cleans up a straightened page in place. Colour: each channel stretched to its 1st–99th percentile. Clean:
 * greyscale, shadows evened out and the paper made white. Black & white: Clean, then thresholded.
 */
function applyFilter(img: Pixels, filter: ScanFilter): void {
  const { data, width: w, height: h } = img, n = w * h;
  if (filter === "colour") {
    for (let c = 0; c < 3; c++) {
      const hist = new Uint32Array(256);
      for (let i = 0; i < n; i++) hist[data[i * 4 + c]]++;
      let lo = 0, hi = 255, acc = 0;
      for (; lo < 255; lo++) if ((acc += hist[lo]) > n * 0.01) break;
      acc = 0;
      for (; hi > 0; hi--) if ((acc += hist[hi]) > n * 0.01) break;
      if (hi - lo < 32) continue;
      const k = 255 / (hi - lo);
      for (let i = 0; i < n; i++) data[i * 4 + c] = (data[i * 4 + c] - lo) * k;
    }
    return;
  }
  const g = new Float32Array(n);
  for (let i = 0; i < n; i++) g[i] = lum(data, i * 4);
  const bg = background(g, w, h);
  for (let i = 0; i < n; i++) {
    const norm = g[i] / bg[i];
    const v = filter === "bw" ? (norm < 0.72 ? 0 : 255) : Math.max(0, Math.min(255, (255 * (norm - 0.3)) / 0.62));
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = v;
  }
}

/** The quad turned a quarter: the straightened page comes out rotated 90° clockwise. */
const rotateQuad = (q: Quad): Quad => [q[3], q[0], q[1], q[2]];

export { detectQuad, insetQuad, homography, outputSize, warp, applyFilter, rotateQuad, area };
