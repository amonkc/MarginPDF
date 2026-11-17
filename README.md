# Margin PDF Editor

A Foxit/Acrobat-style PDF editor that runs entirely in the browser: edit existing text (Thai included), annotate,
fill and create forms, sign, manage pages, protect with passwords, and more. Built on PDFium (WebAssembly) with
HarfBuzz text shaping, Vite and TypeScript, and shipped as a single self-contained page.

## Develop
```sh
npm install
npm run dev        # Vite dev server; assets come from public/
npm run typecheck
npm run build      # dist/index.html, then artifact/index.html (+ artifact/local.html for local testing)
```

## Test
```sh
python3 -m http.server 8765 -d artifact &
node tests/e2e.mjs http://localhost:8765/local.html
```
The end-to-end run drives the app in headless Chromium (Playwright) and prints a deterministic log; compare it
between versions. It should end with `errors []`.

## Structure
- `src/engine/` — PDFium wrapper (`pdfium.ts`), text shaping and drawing (`text.ts`), rich text (`richtext.ts`),
  asset loading (`assets.ts`), growable file buffer (`growable.ts`), shared types (`types.ts`).
- `src/ui/` — viewer, tools, side panels, dialogs, context menu, clipboard.
- `src/app.ts` — document state, settings and undo history; `src/main.ts` — startup, ribbon, menus, shortcuts.
- `src/changelog.ts` — version and the in-app list of changes.
- `src/vendor/harfbuzz/` — harfbuzzjs 1.6.3 (MIT) with an explicit init.
- `public/` — wasm engines, fonts, spelling dictionary, welcome document.
- `scripts/artifact.mjs` — turns the Vite build into the published page, inlining `public/` as gzipped assets.

## History
The original TypeScript sources were lost in November 2026 (v2.23.2). This project was rebuilt from the
published build: split back into modules, names and types restored, libraries taken from npm again, and checked
against the published version with the end-to-end run.
