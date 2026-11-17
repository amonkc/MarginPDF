harfbuzzjs 1.6.3 (`harfbuzz.js` is the stock Emscripten loader; `index.mjs` is the stock wrapper).
The only change: `index.mjs` exports `initHarfBuzz(options)` instead of initialising itself on import, so Margin
can pass in the wasm it ships inside the page. `public/harfbuzz.wasm` is the matching binary from the same release.
