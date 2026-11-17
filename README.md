# Margin PDF Editor — source

Rebuilt on 2026-11-17 from the published v2.23.2 build (the original TypeScript sources were lost).

- `src/margin.js` — the whole app (engine, UI, changelog `Pu`, version `Xn`), one ES module.
- `src/style.css` — styles.
- `shell/` — page skeleton (`head.html`, `body.html`, `tail.html`) and `assets.html`: the inlined, gzipped+base64
  assets (pdfium.wasm, harfbuzz.wasm, welcome.pdf, fonts, spelling dictionary) read at runtime by `data-name`.

Build: `node build.mjs [out.html]` (needs esbuild) → `dist/index.html`, the single-file app that is published.

Releases: every change bumps the version (`Xn`) and adds a changelog entry (`Pu`) in `src/margin.js`, minor for features, patch for fixes; each release is one commit on `develop` whose title starts with `vX.Y.Z`.
