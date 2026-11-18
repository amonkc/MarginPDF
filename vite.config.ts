import { defineConfig, Plugin } from 'vite';
import { fileURLToPath } from 'url';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Two builds:
//  - default ("artifact"): one self-contained HTML file for the claude.ai artifact; scripts/artifact.mjs then
//    inlines public/ into it as gzipped assets. Interface fonts come from Google Fonts (the artifact host allows it).
//  - "web" (npm run build:web): a normal static site for Cloudflare; scripts/web.mjs copies public/ with
//    content-hashed names and writes caching/security headers. Interface fonts are self-hosted.

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

/** `virtual:ui-fonts`: the self-hosted interface fonts in the web build, nothing in the artifact build. */
const uiFonts = (web: boolean): Plugin => ({
  name: 'ui-fonts',
  resolveId: (id) => (id === 'virtual:ui-fonts' ? (web ? fileURLToPath(new URL('./src/ui-fonts.web.ts', import.meta.url)) : '\0ui-fonts-none') : null),
  load: (id) => (id === '\0ui-fonts-none' ? 'export {};' : null),
  // the web build doesn't talk to Google Fonts at all
  transformIndexHtml: (html) => (web ? html.replace(/\s*<link\b[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>/g, '') : html),
});

export default defineConfig(({ mode }) => {
  const web = mode === 'web';
  return {
    base: web ? '/' : './',
    plugins: [keepWasmExternal(), uiFonts(web), ...(web ? [] : [viteSingleFile()])],
    build: {
      target: 'es2022',
      outDir: web ? 'web' : 'dist',
      emptyOutDir: true,
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 4000,
      copyPublicDir: false,
    },
  };
});
