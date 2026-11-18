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

## Deploy (Cloudflare)
The web version is a static site served by Cloudflare (a static-assets-only Worker, `wrangler.jsonc`). With the
repository connected through Workers Builds, every push to `develop` builds and deploys it:
- build command `npm run build:web`, deploy command `npx wrangler deploy`;
- `npm run serve:web` serves `web/` locally the way Cloudflare does (headers, compression);
- `npm run deploy` builds and deploys from a machine logged in with `wrangler login`.

`scripts/web.mjs` gives every engine, font and dictionary file a content-hashed name, cached for a year, so a
visitor downloads Margin once (about 2.5 MB, mostly the PDF engine) and repeat visits transfer only `index.html`.
PDF fonts (about 60 KB each) and the spelling dictionary (about 190 KB) download only when first used. Interface
fonts are self-hosted, so the site makes no requests to other domains. Third-party licences are served at
`/licenses/THIRD_PARTY_NOTICES.txt` (source: `public/licenses/`; also shown in the app under What’s new → Open-source licences).

## Test
```sh
python3 -m http.server 8765 -d artifact &
node tests/e2e.mjs http://localhost:8765/local.html
```
The end-to-end run drives the app in headless Chromium (Playwright) and prints a deterministic log; diff it with
`tests/e2e.expected.log`. It should end with `errors []`. The same run works against the web build
(`npm run build:web && npm run serve:web`, then `node tests/e2e.mjs http://localhost:8788/`), and
`node tests/web.mjs http://localhost:8788/` checks downloads, licences, third-party requests and transfer sizes.

## Structure
- `src/engine/` — PDFium wrapper (`pdfium.ts`), text shaping and drawing (`text.ts`), rich text (`richtext.ts`),
  asset loading (`assets.ts`), growable file buffer (`growable.ts`), shared types (`types.ts`).
- `src/ui/` — viewer, tools, side panels, dialogs, context menu, clipboard.
- `src/app.ts` — document state, settings and undo history; `src/main.ts` — startup, ribbon, menus, shortcuts.
- `src/changelog.ts` — version and the in-app list of changes.
- `src/vendor/harfbuzz/` — harfbuzzjs 1.6.3 (MIT) with an explicit init.
- `public/` — wasm engines, fonts, spelling dictionary, welcome document.
- `scripts/artifact.mjs` — turns the Vite build into the claude.ai artifact page, inlining `public/` as gzipped assets.
- `scripts/web.mjs`, `scripts/serve.mjs`, `wrangler.jsonc` — the Cloudflare web build, a local stand-in server, deployment.
- `public/licenses/` — third-party notices, shipped with both builds and shown in the app.

## History
The original TypeScript sources were lost in November 2026 (v2.23.2). This project was rebuilt from the
published build: split back into modules, names and types restored, libraries taken from npm again, and checked
against the published version with the end-to-end run.

## Licence
Margin is released under the [MIT License](LICENSE). Third-party code and fonts keep their own licences,
listed in `public/licenses/THIRD_PARTY_NOTICES.txt`.
