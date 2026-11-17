import { toast, modal, h } from './dom';

/** A compression preset: target image resolution (dpi) and JPEG quality (0–1). */
type CompressPreset = { label: string; note: string; dpi: number; q: number };

const COMPRESS_PRESETS: Record<string, CompressPreset> = {
  high: { label: "High quality", note: "images up to 200 dpi, light JPEG compression", dpi: 200, q: 0.85 },
  balanced: { label: "Balanced", note: "images up to 150 dpi, good for screens and office printing", dpi: 150, q: 0.75 },
  small: { label: "Smallest file", note: "images up to 100 dpi, for email and the web", dpi: 100, q: 0.6 },
};

/** Byte count as "1.2 MB" or "345 KB" (at least 1 KB). */
const formatSize = (bytes: number): string => bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(bytes / 1024)) + " KB";

/**
 * Compress dialog: downsamples and re-encodes images that are sharper than the chosen preset as one undoable step.
 * Images used on several pages are left alone; a result is kept only if it is clearly smaller.
 * `maxFileSize` is the largest file the browser tab can rewrite.
 */
async function compressDialog(app: any, maxFileSize: number): Promise<any> {
  if (app.fileSize > maxFileSize) return toast("Files over 600 MB can’t be compressed here: it rewrites the whole file, which needs more memory than a browser tab has.", "warn", 6e3);
  const { locked, perms } = app.limits;
  if (locked && !(perms & 8)) return toast("This PDF’s permissions don’t allow changes. Unlock it with its permissions password first.", "warn", 5e3);
  const sizeBefore = app.exportBytes().length, presetRadio = (key: string, checked: boolean) => h("label", { class: "hf-check cp-preset" }, h("input", { type: "radio", name: "cp", value: key, checked }), h("span", {}, h("b", { text: COMPRESS_PRESETS[key].label }), h("span", { class: "hint", text: " — " + COMPRESS_PRESETS[key].note }))), body = h("div", { class: "stack" }, h("p", { class: "modal-text", text: `Now ${formatSize(sizeBefore)}. Compressing shrinks images that are sharper than they need to be; text and drawings stay exactly as they are.` }), h("div", { class: "stack", role: "radiogroup", "aria-label": "Compression" }, presetRadio("high", false), presetRadio("balanced", true), presetRadio("small", false)), h("p", { class: "hint", text: "You can undo this. The smaller size applies when you save." }));
  if (await modal({ title: "Compress", body, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Compress", primary: true }] }) !== "ok") return;
  const preset = COMPRESS_PRESETS[(body.querySelector("input[name=cp]:checked") as HTMLInputElement).value], pageCount = app.doc.pageCount, images: any[] = [];
  for (let page = 0; page < pageCount; page++) {
    app.relieveMemory(page);
    for (const img of app.doc.imageList(page)) images.push({ page, ...img });
  }
  // How many times each image (by fingerprint) is placed; shared images are skipped.
  const uses = /* @__PURE__ */ new Map<any, number>();
  for (const img of images) uses.set(img.print, (uses.get(img.print) || 0) + 1);
  let cancelled = false, recompressed = 0, shared = 0, skipped = 0;
  const progress = toast("Compressing…", "ok", 6e5, { label: "Cancel", run: () => {
    cancelled = true;
  } }), canvas = document.createElement("canvas"), ctx = canvas.getContext("2d")!;
  try {
    await app.mutate("Compress", { pages: "all" }, async () => {
      for (let i = 0; i < images.length; i++) {
        if (cancelled) throw new Error("Compression cancelled");
        const img = images[i];
        progress.set(`Compressing image ${i + 1} of ${images.length}…`);
        await new Promise((resolve) => setTimeout(resolve, 0));
        if ((uses.get(img.print) || 0) > 1) continue;
        // Effective resolution as placed, and the scale that brings it down to the preset's dpi.
        const dpi = Math.min(img.w / Math.max(img.ptW / 72, 1e-3), img.h / Math.max(img.ptH / 72, 1e-3)), scale = Math.min(1, preset.dpi / dpi), downsample = scale < 0.85;
        if (!downsample && (img.jpeg || img.bytes < 2e5)) {
          skipped++;
          continue;
        }
        const pixels = app.doc.imagePixels(img.page, img.k);
        if (!pixels) {
          skipped++;
          continue;
        }
        let hasAlpha = false;
        for (let a = 3; a < pixels.rgba.length; a += 4) if (pixels.rgba[a] < 255) {
          hasAlpha = true;
          break;
        }
        const newW = Math.max(1, Math.round(pixels.w * scale)), newH = Math.max(1, Math.round(pixels.h * scale));
        canvas.width = pixels.w;
        canvas.height = pixels.h;
        ctx.putImageData(new ImageData(pixels.rgba, pixels.w, pixels.h), 0, 0);
        let src;
        if (hasAlpha) {
          // Transparent images can't be JPEG: only worth it when downsampling, kept as RGBA.
          if (!downsample) {
            skipped++;
            continue;
          }
          const out = document.createElement("canvas");
          out.width = newW;
          out.height = newH;
          const outCtx = out.getContext("2d")!;
          outCtx.imageSmoothingQuality = "high";
          outCtx.drawImage(canvas, 0, 0, newW, newH);
          src = { rgba: outCtx.getImageData(0, 0, newW, newH).data, w: newW, h: newH };
        } else {
          const out = document.createElement("canvas");
          out.width = newW;
          out.height = newH;
          const outCtx = out.getContext("2d")!;
          outCtx.fillStyle = "#fff";
          outCtx.fillRect(0, 0, newW, newH);
          outCtx.imageSmoothingQuality = "high";
          outCtx.drawImage(canvas, 0, 0, newW, newH);
          const blob = await new Promise<Blob | null>((resolve) => out.toBlob(resolve, "image/jpeg", preset.q));
          if (!blob || blob.size > img.bytes * 0.9) {
            skipped++;
            continue;
          }
          src = { jpeg: new Uint8Array(await blob.arrayBuffer()) };
        }
        app.doc.setImage(img.page, img.k, src);
        recompressed++;
      }
    });
  } catch (err: any) {
    progress.close();
    return toast(err.message, cancelled ? "warn" : "err");
  } finally {
    canvas.width = canvas.height = 0;
  }
  progress.close();
  shared = [...uses.values()].filter((n) => n > 1).length;
  const sizeAfter = app.exportBytes().length, percent = Math.round((1 - sizeAfter / sizeBefore) * 100), sharedNote = shared ? ` ${shared === 1 ? "One image is" : shared + " images are"} used on several pages and ${shared === 1 ? "was" : "were"} left as ${shared === 1 ? "it is" : "they are"}.` : "";
  if (sizeAfter >= sizeBefore) toast(`No smaller: the images here are already compact (${formatSize(sizeBefore)}).${sharedNote}`, "warn", 7e3);
  else toast(`${formatSize(sizeBefore)} → ${formatSize(sizeAfter)} (${percent}% smaller), ${recompressed} image${recompressed === 1 ? "" : "s"} recompressed. Save to keep it.${sharedNote}`, "ok", 8e3);
}

export { compressDialog };
