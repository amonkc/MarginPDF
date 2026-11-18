/**
 * The web build (scripts/web.mjs) serves assets under content-hashed names so browsers can cache them forever;
 * it lists them in `<script type="application/json" id="margin-assets">{ "fonts/x.ttf": "a/fonts/x.1a2b3c4d.ttf" }`.
 * Without that map (dev server), assets are fetched by their plain path.
 */
let assetMap: Record<string, string> | undefined;
function assetUrl(path: string): string {
  if (!assetMap) {
    const el = document.getElementById("margin-assets");
    try {
      assetMap = el ? (JSON.parse(el.textContent || "{}") as Record<string, string>) : {};
    } catch {
      assetMap = {};
    }
  }
  return assetMap[path] ?? path;
}

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

/** Fetches an asset by its (hashed) URL. */
async function fetchAsset(path: string): Promise<ArrayBuffer> {
  const response = await fetch(assetUrl(path));
  if (!response.ok) throw new Error(`${path} could not be loaded (${response.status})`);
  return response.arrayBuffer();
}

export { loadAsset };
