// Font subsetting with HarfBuzz (harfbuzz-subset.wasm from harfbuzzjs, loaded the first time it's needed).
//
// PDFium embeds the whole font file it is given, so a PDF with one word in Montserrat carried 745 KB, and a
// Chinese font would add megabytes. Margin hands PDFium a copy of the font cut down to the characters of the
// text being written instead (usually a few KB). Variable fonts are pinned to their default instance: the
// embedded font only has to show and extract text, and other weights are drawn as outlines (text.ts).

import { loadAsset } from "./assets";

type SubsetExports = {
  memory: WebAssembly.Memory;
  malloc(size: number): number;
  free(ptr: number): void;
  _initialize?(): void;
  hb_blob_create(data: number, length: number, mode: number, userData: number, destroy: number): number;
  hb_blob_destroy(blob: number): void;
  hb_blob_get_data(blob: number, length: number): number;
  hb_face_create(blob: number, index: number): number;
  hb_face_destroy(face: number): void;
  hb_face_reference_blob(face: number): number;
  hb_set_add(set: number, codepoint: number): void;
  hb_subset_input_create_or_fail(): number;
  hb_subset_input_destroy(input: number): void;
  hb_subset_input_unicode_set(input: number): number;
  hb_subset_input_set_flags(input: number, flags: number): void;
  hb_subset_input_pin_all_axes_to_default(input: number, face: number): number;
  hb_subset_or_fail(face: number, input: number): number;
};

/** HB_MEMORY_MODE_WRITABLE; HB_SUBSET_FLAGS_NO_HINTING. */
const MEMORY_WRITABLE = 2, NO_HINTING = 1;

let module: Promise<SubsetExports> | null = null;
function subsetter(): Promise<SubsetExports> {
  if (!module) {
    module = (async () => {
      const { instance } = await WebAssembly.instantiate(await loadAsset("harfbuzz-subset.wasm"), {});
      const exports = instance.exports as unknown as SubsetExports;
      exports._initialize?.();
      return exports;
    })();
    module.catch(() => (module = null));
  }
  return module;
}

/**
 * The font cut down to the given characters (plus what HarfBuzz keeps by itself: .notdef, and glyphs reached
 * from them through layout). Returns null when the font can't be subset, so the caller can embed it whole.
 */
async function subsetFont(font: Uint8Array, text: string): Promise<Uint8Array | null> {
  let hb: SubsetExports;
  try {
    hb = await subsetter();
  } catch {
    return null;
  }
  const data = hb.malloc(font.length);
  new Uint8Array(hb.memory.buffer, data, font.length).set(font);
  const blob = hb.hb_blob_create(data, font.length, MEMORY_WRITABLE, 0, 0), face = hb.hb_face_create(blob, 0);
  hb.hb_blob_destroy(blob);
  const input = hb.hb_subset_input_create_or_fail();
  let result: Uint8Array | null = null;
  if (input) {
    const unicodes = hb.hb_subset_input_unicode_set(input);
    for (const ch of new Set([...text, " "])) hb.hb_set_add(unicodes, ch.codePointAt(0)!);
    hb.hb_subset_input_set_flags(input, NO_HINTING);
    hb.hb_subset_input_pin_all_axes_to_default(input, face);
    const subset = hb.hb_subset_or_fail(face, input);
    if (subset) {
      const out = hb.hb_face_reference_blob(subset), lengthPtr = hb.malloc(4);
      const ptr = hb.hb_blob_get_data(out, lengthPtr), length = new Uint32Array(hb.memory.buffer, lengthPtr, 1)[0];
      if (ptr && length) result = new Uint8Array(hb.memory.buffer, ptr, length).slice();
      hb.free(lengthPtr);
      hb.hb_blob_destroy(out);
      hb.hb_face_destroy(subset);
    }
    hb.hb_subset_input_destroy(input);
  }
  hb.hb_face_destroy(face);
  hb.free(data);
  return result;
}

export { subsetFont };
