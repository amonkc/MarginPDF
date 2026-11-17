// Turns Vite's single-file build (dist/index.html) into the published page, artifact/index.html.
// The artifact host wraps the page in its own doctype/head/body, so this emits title, font links, styles,
// markup and script without those wrappers, plus every file in public/ inlined as a gzipped, base64
// <script type="application/x-margin-asset" data-name="…"> that engine/assets.ts reads at runtime.
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
const src = fs.readFileSync('dist/index.html', 'utf8');
const pick = (re) => [...src.matchAll(re)].map((m) => m[0]);
const title = pick(/<title>[\s\S]*?<\/title>/g)[0];
const links = pick(/<link\b[^>]*>/g).filter((l) => /fonts\.(googleapis|gstatic)\.com/.test(l)).join('\n');
const styles = pick(/<style\b[^>]*>[\s\S]*?<\/style>/g).join('\n');
const scripts = pick(/<script\b[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g).map((s) => s.replace(/\s+crossorigin(="[^"]*")?/, '')).join('\n');
const body = src.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1].replace(/<script\b[\s\S]*?<\/script>/g, '').trim();
const files = [];
const walk = (dir) => { for (const f of fs.readdirSync(dir).sort()) { const p = path.join(dir, f); fs.statSync(p).isDirectory() ? walk(p) : files.push(p); } };
walk('public');
const order = (p) => (/\.wasm$/.test(p) ? 0 : /welcome/.test(p) ? 1 : /dict\//.test(p) ? 2 : 3); // same order as before: engines first
files.sort((a, b) => order(a) - order(b) || a.localeCompare(b));
const assets = files.map((p) => `<script type="application/x-margin-asset" data-name="${path.relative('public', p).split(path.sep).join('/')}">${zlib.gzipSync(fs.readFileSync(p), { level: 9 }).toString('base64')}</script>`).join('\n');
fs.mkdirSync('artifact', { recursive: true });
const page = [title, links, styles, body, assets, scripts].join('\n');
fs.writeFileSync('artifact/index.html', page);
// local.html: the same page inside a minimal stand-in for the host's wrapper, for local testing
fs.writeFileSync('artifact/local.html', '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>\n' + page + '\n</body></html>');
console.log('artifact/index.html', (fs.statSync('artifact/index.html').size / 1e6).toFixed(2), 'MB');
