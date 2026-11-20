# Margin PDF Editor

A Foxit/Acrobat-style PDF editor that runs entirely in the browser: edit existing text (Thai included), annotate,
fill and create forms, sign, manage pages, protect with passwords, and more. Built on PDFium (WebAssembly) with
HarfBuzz text shaping, Vite and TypeScript, and served as a static website.

## Develop
```sh
npm install
npm run dev        # Vite dev server; assets come from public/
npm run typecheck
npm run build      # web/: the site Cloudflare serves (build:web is an alias)
npm run serve:web  # serve web/ locally the way Cloudflare does
```

## Deploy (Cloudflare)
The web version is a static site served by Cloudflare (a static-assets-only Worker, `wrangler.jsonc`). With the
repository connected through Workers Builds, every push to `develop` builds and deploys it:
- build command `npm run build:web`, deploy command `npx wrangler deploy`;
- `npm run deploy` builds and deploys from a machine logged in with `wrangler login`.

`scripts/web.mjs` gives every engine, font and dictionary file a content-hashed name, cached for a year, so a
visitor downloads Margin once (about 2.65 MB, mostly the PDF engine) and repeat visits transfer only `index.html`.
PDF fonts (about 60 KB each) and the spelling dictionary (about 190 KB) download only when first used. Interface
fonts are self-hosted, so the site makes no requests to other domains. Third-party licences are served at
`/licenses/THIRD_PARTY_NOTICES.txt` (source: `public/licenses/`; also shown in the app under What’s new → Open-source licences).

## Test
```sh
npm run build && npm run serve:web &
node tests/e2e.mjs http://localhost:8788/
node tests/web.mjs http://localhost:8788/
```
The end-to-end run drives the app in headless Chromium (Playwright) and prints a deterministic log; diff it with
`tests/e2e.expected.log`. It should end with `errors []`. `tests/web.mjs` checks downloads, licences, third-party
requests and transfer sizes.

## Structure
- `src/engine/` — PDFium wrapper (`pdfium.ts`), text shaping and drawing (`text.ts`), rich text (`richtext.ts`),
  asset loading (`assets.ts`), growable file buffer (`growable.ts`), shared types (`types.ts`).
- `src/ui/` — viewer, tools, side panels, dialogs, context menu, clipboard.
- `src/app.ts` — document state, settings and undo history; `src/main.ts` — startup, ribbon, menus, shortcuts.
- `src/session.ts` — keeps unsaved work in the browser (IndexedDB) through a refresh or a closed tab.
- `src/updates.ts` — notices a new deployment (via `/version.json`) while Margin is open and offers Reload.
- `src/changelog.ts` — version and the in-app list of changes.
- `src/vendor/harfbuzz/` — harfbuzzjs 1.6.3 (MIT) with an explicit init.
- `public/` — wasm engines, fonts, spelling dictionary, welcome document.
- `scripts/make-fonts.py` — builds the Chinese, Japanese, Korean, Indic and Southeast Asian fonts from Noto sources.
- `scripts/make-welcome.mjs` — builds the welcome document (`public/welcome.pdf`) from `scripts/welcome/base.pdf`.
- `site/` — favicon and home-screen icons, served from the site root.
- `scripts/web.mjs`, `scripts/serve.mjs`, `wrangler.jsonc` — the site build step, a local stand-in for Cloudflare, deployment.
- `public/licenses/` — third-party notices, shipped with both builds and shown in the app.

## History
The original TypeScript sources were lost in November 2026 (v2.23.2). This project was rebuilt from the
published build: split back into modules, names and types restored, libraries taken from npm again, and checked
against the published version with the end-to-end run. Margin was first published as a claude.ai artifact page;
since v2.25.3 it is only a website.

## Licence
Margin is released under the [MIT License](LICENSE). Third-party code and fonts keep their own licences,
listed in `public/licenses/THIRD_PARTY_NOTICES.txt`.
