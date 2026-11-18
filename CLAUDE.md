# Margin — notes for Claude

Margin is a browser PDF editor (PDFium-wasm + HarfBuzz, Vite + TypeScript) published as one self-contained
claude.ai artifact page.

## Layout
- `src/engine/` — PDF engine wrapper (`pdfium.ts`: `Pdfium`, `Doc`), text shaping/drawing (`text.ts`),
  rich text (`richtext.ts`), asset loading, growable file buffer, shared types (`types.ts`).
- `src/ui/` — viewer, tools (`interact.ts`, `arrange.ts`, `crop.ts`, `textbox.ts`, `links.ts`, `forms.ts`),
  panels, dialogs, context menu, clipboard.
- `src/app.ts` — document state, settings, undo history. `src/main.ts` — boot, ribbon, menus, shortcuts.
- `src/changelog.ts` — `CHANGELOG` and `VERSION` (shown in the app).
- `src/vendor/harfbuzz/` — harfbuzzjs 1.6.3 with one change (explicit init); see its README.
- `public/` — pdfium.wasm, harfbuzz.wasm, fonts, spelling dictionary, welcome.pdf.

## Build, test, publish
- `npm run build` → `dist/index.html` (Vite single file) → `artifact/index.html` (published page, assets
  inlined) and `artifact/local.html` (same page with a stand-in host wrapper, for local testing).
- Tests: serve `artifact/` (`python3 -m http.server 8765 -d artifact`) and run
  `node tests/e2e.mjs http://localhost:8765/local.html > new.log`. It prints a deterministic log; diff it with
  `tests/e2e.expected.log` (only the version line, and anything the change intends, may differ), then commit
  the new log as the expected one. It must end with `errors []`.
- Web version (main delivery): `npm run build:web` → `web/`, deployed by Cloudflare Workers Builds on every push to
  `develop`. Check it locally with `npm run serve:web`, `node tests/e2e.mjs http://localhost:8788/` (same log as
  the artifact) and `node tests/web.mjs http://localhost:8788/` (downloads, licences, no third-party requests,
  first-visit size ≈ 2.5 MB, repeat visit a few KB). Keep bandwidth in mind: large assets must stay lazy-loaded and
  content-hashed (scripts/web.mjs), and `index.html` stays `no-cache`.
- Also publish `artifact/index.html` to https://claude.ai/artifact/NhLtPAncgyqMEJkLrKEenD with label = version.
- New third-party code or fonts: add their licence to `licenses/THIRD_PARTY_NOTICES.txt`.

## Release convention (owner's standing rule)
Every change bumps the version (minor for features, patch for fixes) in `src/changelog.ts` (`VERSION` plus a
new first `CHANGELOG` entry) and `package.json`, then build, test, publish. One commit per release on
`develop`, title starting with `vX.Y.Z`. Also refresh the copy of the source in `/mnt/user-data/outputs/margin/`.
