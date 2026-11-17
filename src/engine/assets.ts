/** In-flight / finished loads by asset path. A failed load is evicted so it can be retried. */
const assetCache = /* @__PURE__ */ new Map<string, Promise<ArrayBuffer>>();

/**
 * Load a binary asset (font, wasm, …) by its path under `public/`.
 * Results are cached; every caller gets its own copy of the bytes.
 */
function loadAsset(path: string): Promise<ArrayBuffer> {
  let pending = assetCache.get(path);
  if (!pending) {
    pending = fetchAsset(path);
    assetCache.set(path, pending);
    pending.catch(() => assetCache.delete(path));
  }
  return pending.then((bytes) => bytes.slice(0));
}

/**
 * The single-file build inlines assets as base64 gzip in `<script type="application/x-margin-asset" data-name=…>`
 * tags; use one of those if present, otherwise fetch the file.
 */
async function fetchAsset(path: string): Promise<ArrayBuffer> {
  const inlined = [...document.querySelectorAll<HTMLElement>('script[type="application/x-margin-asset"]')].find((el) => el.dataset.name === path);
  if (inlined) {
    const binary = atob((inlined.textContent || "").trim()), gzipped = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) gzipped[i] = binary.charCodeAt(i);
    const stream = new Blob([gzipped]).stream().pipeThrough(new DecompressionStream("gzip"));
    return new Response(stream).arrayBuffer();
  }
  const response = await fetch(path);
  if (!response.ok) throw new Error(`${path} could not be loaded (${response.status})`);
  return response.arrayBuffer();
}

export { loadAsset };
