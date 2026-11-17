import { defineConfig, Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// The wasm binaries are not bundled by Vite: in the published page they are inlined as gzipped assets by
// scripts/artifact.mjs, and in dev they're served from public/. Stop Vite from resolving the libraries'
// `new URL('x.wasm', import.meta.url)` and emitting/inlining them a second time.
const keepWasmExternal = (): Plugin => ({
  name: 'keep-wasm-external',
  enforce: 'pre',
  transform(code, id) {
    if (!/pdfium[\\/]dist|vendor[\\/]harfbuzz/.test(id)) return null;
    return code.replace(/new URL\((['"])([\w.-]+\.wasm)\1,\s*import\.meta\.url\)/g, (_m, _q, f) => `new URL(${JSON.stringify(f)}, document.baseURI)`);
  },
});

export default defineConfig({
  base: './',
  plugins: [keepWasmExternal(), viteSingleFile()],
  build: { target: 'es2022', assetsInlineLimit: 0, chunkSizeWarningLimit: 4000, copyPublicDir: false },
});
