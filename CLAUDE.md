# Margin — notes for Claude

Margin is a browser PDF editor (PDFium-wasm + HarfBuzz, Vite + TypeScript) delivered as a website on Cloudflare
(deployed from GitHub `develop`).

## Layout
- `src/engine/` — PDF engine wrapper (`pdfium.ts`: `Pdfium`, `Doc`), text shaping/drawing (`text.ts`),
  rich text (`richtext.ts`), asset loading, growable file buffer, shared types (`types.ts`).
- `src/ui/` — viewer, tools (`interact.ts`, `arrange.ts`, `crop.ts`, `textbox.ts`, `links.ts`, `forms.ts`),
  panels, dialogs, context menu, clipboard.
- `src/app.ts` — document state, settings, undo history. `src/main.ts` — boot, ribbon, menus, shortcuts.
- `src/session.ts` — keeps unsaved work (file buffers + undo history) in IndexedDB `margin-session` through a
  refresh or a closed tab; never stores passwords.
- `src/updates.ts` — checks `/version.json` (emitted by `vite.config.ts` from the changelog, `no-cache`) when the tab
  regains focus and every 30 min; marks the version button and offers Reload.
- `src/changelog.ts` — `CHANGELOG` and `VERSION` (shown in the app).
- `src/vendor/harfbuzz/` — harfbuzzjs 1.6.3 with one change (explicit init); see its README.
- `public/` — pdfium.wasm, harfbuzz.wasm, fonts, spelling dictionary, welcome.pdf (content-hashed into `web/a/`).
- `site/` — favicon and home-screen icons ("M." in Fraunces ExtraBold as outlines), copied to the site root and
  linked by `scripts/web.mjs`.

## Build, test, release
- `npm run build` (alias `build:web`, which Cloudflare runs) → `web/`: Vite build plus `scripts/web.mjs` (content-hashed
  assets under `web/a/`, `_headers`, `/licenses/`). Keep bandwidth in mind: large assets must stay lazy-loaded and
  content-hashed, and `index.html` stays `no-cache`.
- Tests: `npm run serve:web` (local stand-in for Cloudflare on port 8788), then
  `node tests/e2e.mjs http://localhost:8788/ > new.log`. It prints a deterministic log; diff it with
  `tests/e2e.expected.log` (only the version line, and anything the change intends, may differ), then commit the new
  log as the expected one. It must end with `errors []`. Also `node tests/web.mjs http://localhost:8788/` (downloads,
  licences, no third-party requests, first-visit size ≈ 2.5 MB, repeat visit a few KB).
- Pushing to `develop` deploys the website (Cloudflare Workers Builds). The old claude.ai artifact page and the
  single-file build were retired in v2.25.3 (owner's decision); don't publish artifacts or copy the source elsewhere.
- New third-party code or fonts: add their licence to `public/licenses/THIRD_PARTY_NOTICES.txt` (shown in the app
  from What's new → Open-source licences, and served at /licenses/ on the website).

## Release convention (owner's standing rule)
Every change bumps the version (minor for features, patch for fixes) in `src/changelog.ts` (`VERSION` plus a
new first `CHANGELOG` entry) and `package.json`, then build, test, and push (the push deploys the website). One commit per release on
`develop`, title starting with `vX.Y.Z`.
