import type { Box, ImageSrc, Matrix } from '../engine/types';

/** An image file decoded for placing on a page. `url` is an object URL the caller must revoke. */
export type DecodedImage = { bitmap: ImageBitmap; w: number; h: number; jpeg: boolean; url: string; name: string };

/** `accept` list for image file pickers. */
const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/avif";

/** True if a file looks like an image Margin can place (by MIME type or extension). */
const isImageFile = (file: File): boolean => /^image\/(png|jpe?g|webp|gif|bmp|avif)$/i.test(file.type) || /\.(png|jpe?g|webp|gif|bmp|avif)$/i.test(file.name);

/** Placed images keep at most this many pixels per inch at their placed size. */
const IMAGE_DPI = 300;
/** Hard cap on the long side of a placed image, in pixels. */
const MAX_IMAGE_PX = 4e3;

/** Decodes an image file (honouring EXIF orientation). Throws a readable error if the browser can't decode it. */
async function decodeImage(file: Blob, name = "Image"): Promise<DecodedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("That file is not an image this browser can read");
  }
  const jpeg = /jpe?g/i.test(file.type) || /\.jpe?g$/i.test(name);
  return { bitmap, w: bitmap.width, h: bitmap.height, jpeg, url: URL.createObjectURL(file), name };
}

/**
 * Screen box for an image dropped or clicked at (x, y) on a page: its natural size at 96 dpi,
 * shrunk to fit 80% of the page, centred on the point and kept inside the page.
 */
function defaultImageBox(img: { w: number; h: number }, page: { w: number; h: number }, scale: number, x: number, y: number): Box {
  let w = img.w * 0.75 * scale, h = img.h * 0.75 * scale;
  const maxW = page.w * scale * 0.8, maxH = page.h * scale * 0.8, fit = Math.min(1, maxW / w, maxH / h);
  w *= fit;
  h *= fit;
  const pageW = page.w * scale, pageH = page.h * scale, left = Math.max(0, Math.min(pageW - w, x - w / 2)), top = Math.max(0, Math.min(pageH - h, y - h / 2));
  return { x: left, y: top, w, h };
}

/** Screen box for an image dragged out from (x0, y0) to (x1, y1), keeping the image's aspect ratio. */
function dragImageBox(img: { w: number; h: number }, x0: number, y0: number, x1: number, y1: number): Box {
  const dragW = Math.abs(x1 - x0), dragH = Math.abs(y1 - y0), aspect = img.w / img.h, w = Math.min(dragW, dragH * aspect), h = w / aspect;
  return { x: x1 >= x0 ? x0 : x0 - w, y: y1 >= y0 ? y0 : y0 - h, w, h };
}

/** PDF image matrix that maps the unit square onto a screen box of a page view (via its inverse transform). */
function imageMatrix(view: any, box: Box): Matrix {
  const [x0, y0] = view.inv.apply(box.x, box.y + box.h), [x1, y1] = view.inv.apply(box.x + box.w, box.y + box.h), [x2, y2] = view.inv.apply(box.x, box.y);
  return [x1 - x0, y1 - y0, x2 - x0, y2 - y0, x0, y0];
}

/**
 * Scales a decoded image down to what a placement of `widthPt` × `heightPt` needs (≤ IMAGE_DPI, ≤ MAX_IMAGE_PX)
 * and returns it as JPEG bytes (for JPEG sources, flattened onto white) or as raw RGBA.
 */
async function encodeImage(img: DecodedImage, widthPt: number, heightPt: number): Promise<ImageSrc> {
  const k = Math.min(1, Math.max(widthPt, heightPt) / 72 * IMAGE_DPI / Math.max(img.w, img.h), MAX_IMAGE_PX / Math.max(img.w, img.h)), w = Math.max(1, Math.round(img.w * k)), h = Math.max(1, Math.round(img.h * k)), canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  if (img.jpeg) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img.bitmap, 0, 0, w, h);
  if (img.jpeg) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
    if (blob) return { jpeg: new Uint8Array(await blob.arrayBuffer()) };
  }
  return { rgba: ctx.getImageData(0, 0, w, h).data, w, h };
}

/** Opens the system file picker for one image. Resolves with the file, or null if the picker was cancelled. */
function pickImageFile(): Promise<File | null> {
  return new Promise((resolve) => {
    document.querySelectorAll("input.img-file").forEach((old) => old.remove());
    const input = document.createElement("input");
    input.type = "file";
    input.accept = IMAGE_ACCEPT;
    input.className = "img-file";
    let done = false;
    const finish = (file: File | null) => {
      if (!done) {
        done = true;
        input.remove();
        resolve(file);
      }
    };
    input.addEventListener("change", () => finish(input.files?.[0] || null));
    input.addEventListener("cancel", () => finish(null));
    input.style.display = "none";
    document.body.append(input);
    input.click();
  });
}

/** Wraps raw RGBA pixels as an ImageSrc, re-encoding them as JPEG first when `asJpeg` is set (falls back to RGBA). */
async function encodePixels(rgba: any, w: number, h: number, asJpeg: any): Promise<ImageSrc> {
  if (asJpeg) {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.putImageData(new ImageData(new Uint8ClampedArray(rgba), w, h), 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (blob) return { jpeg: new Uint8Array(await blob.arrayBuffer()) };
  }
  return { rgba, w, h };
}

export { decodeImage, encodeImage, isImageFile, defaultImageBox, pickImageFile, encodePixels, imageMatrix, dragImageBox };
