// Margin build: minify src/margin.js + src/style.css and assemble the single-file app
// (shell/*.html hold the page skeleton and the inlined assets: wasm, fonts, dictionary).
import { transform } from '/opt/npm-tools/node_modules/esbuild/lib/main.js';
import fs from 'fs';
const r = (p) => fs.readFileSync(new URL(p, import.meta.url), 'utf8');
const js = (await transform(r('src/margin.js'), { loader: 'js', minify: true, format: 'esm', charset: 'utf8', target: 'es2022' })).code;
const css = (await transform(r('src/style.css'), { loader: 'css', minify: true, charset: 'utf8' })).code;
const html = r('shell/head.html') + '<style rel="stylesheet" crossorigin>' + css.trim() + '</style>' + r('shell/body.html') + r('shell/assets.html') + '<script type="module">' + js.trim() + '</script>' + r('shell/tail.html');
const out = process.argv[2] || new URL('dist/index.html', import.meta.url).pathname;
fs.mkdirSync(out.replace(/\/[^/]+$/, ''), { recursive: true });
fs.writeFileSync(out, html);
console.log(out, (html.length / 1e6).toFixed(2) + ' MB');
