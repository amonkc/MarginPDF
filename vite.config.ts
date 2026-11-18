import { defineConfig, type Plugin } from 'vite';
import { CHANGELOG, VERSION } from './src/changelog';

// One build: a static site for Cloudflare. scripts/web.mjs then copies public/ into web/ with content-hashed
// names and writes caching/security headers. Interface fonts are self-hosted (src/ui-fonts.ts).

// The wasm binaries are loaded by Margin itself (engine/assets.ts), never bundled: stop Vite from resolving the
// libraries' `new URL('x.wasm', import.meta.url)` and emitting/inlining them a second time.
const keepWasmExternal = (): Plugin => ({
  name: 'keep-wasm-external',
  enforce: 'pre',
  transform(code, id) {
    if (!/pdfium[\\/]dist|vendor[\\/]harfbuzz/.test(id)) return null;
    return code.replace(/new URL\((['"])([\w.-]+\.wasm)\1,\s*import\.meta\.url\)/g, (_m, _q, f) => `new URL(${JSON.stringify(f)}, document.baseURI)`);
  },
});

/** /version.json: what the open app compares itself with to notice a new deployment (src/updates.ts). */
const versionFile = (): Plugin => ({
  name: 'version-file',
  apply: 'build',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version: VERSION, releases: CHANGELOG.slice(0, 10) }) });
  },
});

export default defineConfig({
  base: '/',
  plugins: [keepWasmExternal(), versionFile()],
  build: {
    target: 'es2022',
    outDir: 'web',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 4000,
    copyPublicDir: false,
  },
});
