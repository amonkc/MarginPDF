import { H, nt, y } from './dom';

const Qr = { high: { label: "High quality", note: "images up to 200 dpi, light JPEG compression", dpi: 200, q: 0.85 }, balanced: { label: "Balanced", note: "images up to 150 dpi, good for screens and office printing", dpi: 150, q: 0.75 }, small: { label: "Smallest file", note: "images up to 100 dpi, for email and the web", dpi: 100, q: 0.6 } };
const gr = (u) => u >= 1048576 ? (u / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(u / 1024)) + " KB";
async function Oc(u, n) {
  if (u.fileSize > n) return H("Files over 600 MB can’t be compressed here: it rewrites the whole file, which needs more memory than a browser tab has.", "warn", 6e3);
  const { locked: t, perms: e } = u.limits;
  if (t && !(e & 8)) return H("This PDF’s permissions don’t allow changes. Unlock it with its permissions password first.", "warn", 5e3);
  const r = u.exportBytes().length, o = (B, z) => y("label", { class: "hf-check cp-preset" }, y("input", { type: "radio", name: "cp", value: B, checked: z }), y("span", {}, y("b", { text: Qr[B].label }), y("span", { class: "hint", text: " — " + Qr[B].note }))), a = y("div", { class: "stack" }, y("p", { class: "modal-text", text: `Now ${gr(r)}. Compressing shrinks images that are sharper than they need to be; text and drawings stay exactly as they are.` }), y("div", { class: "stack", role: "radiogroup", "aria-label": "Compression" }, o("high", false), o("balanced", true), o("small", false)), y("p", { class: "hint", text: "You can undo this. The smaller size applies when you save." }));
  if (await nt({ title: "Compress", body: a, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Compress", primary: true }] }) !== "ok") return;
  const i = Qr[a.querySelector("input[name=cp]:checked").value], l = u.doc.pageCount, h = [];
  for (let B = 0; B < l; B++) {
    u.relieveMemory(B);
    for (const z of u.doc.imageList(B)) h.push({ page: B, ...z });
  }
  const m = /* @__PURE__ */ new Map();
  for (const B of h) m.set(B.print, (m.get(B.print) || 0) + 1);
  let _ = false, p = 0, P = 0, D = 0;
  const x = H("Compressing…", "ok", 6e5, { label: "Cancel", run: () => {
    _ = true;
  } }), A = document.createElement("canvas"), w = A.getContext("2d");
  try {
    await u.mutate("Compress", { pages: "all" }, async () => {
      for (let B = 0; B < h.length; B++) {
        if (_) throw new Error("Compression cancelled");
        const z = h[B];
        if (x.set(`Compressing image ${B + 1} of ${h.length}…`), await new Promise((ee) => setTimeout(ee, 0)), (m.get(z.print) || 0) > 1) continue;
        const O = Math.min(z.w / Math.max(z.ptW / 72, 1e-3), z.h / Math.max(z.ptH / 72, 1e-3)), W = Math.min(1, i.dpi / O), N = W < 0.85;
        if (!N && (z.jpeg || z.bytes < 2e5)) {
          D++;
          continue;
        }
        const V = u.doc.imagePixels(z.page, z.k);
        if (!V) {
          D++;
          continue;
        }
        let q = false;
        for (let ee = 3; ee < V.rgba.length; ee += 4) if (V.rgba[ee] < 255) {
          q = true;
          break;
        }
        const Y = Math.max(1, Math.round(V.w * W)), ne = Math.max(1, Math.round(V.h * W));
        A.width = V.w, A.height = V.h, w.putImageData(new ImageData(V.rgba, V.w, V.h), 0, 0);
        let J;
        if (q) {
          if (!N) {
            D++;
            continue;
          }
          const ee = document.createElement("canvas");
          ee.width = Y, ee.height = ne;
          const ae = ee.getContext("2d");
          ae.imageSmoothingQuality = "high", ae.drawImage(A, 0, 0, Y, ne), J = { rgba: ae.getImageData(0, 0, Y, ne).data, w: Y, h: ne };
        } else {
          const ee = document.createElement("canvas");
          ee.width = Y, ee.height = ne;
          const ae = ee.getContext("2d");
          ae.fillStyle = "#fff", ae.fillRect(0, 0, Y, ne), ae.imageSmoothingQuality = "high", ae.drawImage(A, 0, 0, Y, ne);
          const de = await new Promise((oe) => ee.toBlob(oe, "image/jpeg", i.q));
          if (!de || de.size > z.bytes * 0.9) {
            D++;
            continue;
          }
          J = { jpeg: new Uint8Array(await de.arrayBuffer()) };
        }
        u.doc.setImage(z.page, z.k, J), p++;
      }
    });
  } catch (B) {
    return x.close(), H(B.message, _ ? "warn" : "err");
  } finally {
    A.width = A.height = 0;
  }
  x.close(), P = [...m.values()].filter((B) => B > 1).length;
  const k = u.exportBytes().length, G = Math.round((1 - k / r) * 100), E = P ? ` ${P === 1 ? "One image is" : P + " images are"} used on several pages and ${P === 1 ? "was" : "were"} left as ${P === 1 ? "it is" : "they are"}.` : "";
  k >= r ? H(`No smaller: the images here are already compact (${gr(r)}).${E}`, "warn", 7e3) : H(`${gr(r)} → ${gr(k)} (${G}% smaller), ${p} image${p === 1 ? "" : "s"} recompressed. Save to keep it.${E}`, "ok", 8e3);
}

export { Oc };
