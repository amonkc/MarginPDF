// Turns `vite build` (web/) into the deployable static site for Cloudflare (Workers static assets):
//  - copies public/ into web/a/ under content-hashed names and lists them in index.html (engine/assets.ts reads
//    the list), so every asset can be cached by browsers and Cloudflare for a year and is downloaded once;
//  - writes web/_headers: long caching for hashed files, revalidation for index.html, security headers, and a
//    text content type for the spelling dictionary so Cloudflare compresses it;
//  - copies the OCR engine and language data (from node_modules) into one content-hashed folder;
//  - copies the third-party licence notices (public/licenses/) to web/licenses/ as well;
//  - copies site/ (favicon, home-screen icons, social card image, the about page) to the site root;
//  - writes robots.txt and sitemap.xml for search engines, using the address in package.json "homepage".
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const out = 'web';
const files = [];
const walk = (dir) => { for (const f of fs.readdirSync(dir).sort()) { const p = path.join(dir, f); fs.statSync(p).isDirectory() ? walk(p) : files.push(p); } };
walk('public');
const map = {};
let bytes = 0;
for (const src of files) {
  const rel = path.relative('public', src).split(path.sep).join('/');
  const data = fs.readFileSync(src);
  const hash = crypto.createHash('sha256').update(data).digest('hex').slice(0, 10);
  const ext = path.extname(rel), hashed = `a/${rel.slice(0, rel.length - ext.length)}.${hash}${ext}`;
  fs.mkdirSync(path.join(out, path.dirname(hashed)), { recursive: true });
  fs.copyFileSync(src, path.join(out, hashed));
  map[rel] = '/' + hashed;
  bytes += data.length;
}
// OCR (Tesseract.js, src/ui/ocr.ts): the worker loads the engine and language data by file name from one folder,
// so the folder is copied as is under a content-hashed name (listed as "ocr/"). Downloaded only when OCR runs.
const OCR_LANGS = ['eng', 'tha', 'chi_sim', 'chi_tra', 'jpn', 'kor', 'vie', 'hin', 'ben', 'tam', 'tel', 'lao', 'khm', 'mya', 'rus'];
const ocrFiles = [
  ['worker.min.js', 'node_modules/tesseract.js/dist/worker.min.js'],
  ...['tesseract-core-simd-lstm', 'tesseract-core-lstm'].flatMap((core) => ['.js', '.wasm'].map((ext) => [core + ext, `node_modules/tesseract.js-core/${core}${ext}`])),
  ...OCR_LANGS.map((lang) => [`${lang}.traineddata.gz`, `node_modules/@tesseract.js-data/${lang}/4.0.0_best_int/${lang}.traineddata.gz`]),
];
const ocrHash = crypto.createHash('sha256');
for (const [name, src] of ocrFiles) ocrHash.update(name).update(fs.readFileSync(src));
const ocrDir = `a/ocr-${ocrHash.digest('hex').slice(0, 10)}`;
fs.mkdirSync(path.join(out, ocrDir), { recursive: true });
for (const [name, src] of ocrFiles) fs.copyFileSync(src, path.join(out, ocrDir, name));
map['ocr/'] = `/${ocrDir}/`;
const indexPath = path.join(out, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
// Site icons keep fixed names (browsers ask for /favicon.ico by themselves); a content hash in the links
// makes browsers fetch a changed icon.
// The site's address (package.json "homepage") goes into the canonical link, social cards, robots.txt and the sitemap.
const site = JSON.parse(fs.readFileSync('package.json', 'utf8')).homepage.replace(/\/?$/, '/');
const siteHash = crypto.createHash('sha256');
for (const f of fs.readdirSync('site', { recursive: true }).map(String).sort()) {
  const src = path.join('site', f);
  if (fs.statSync(src).isDirectory()) continue;
  let data = fs.readFileSync(src);
  if (f.endsWith('.html')) data = Buffer.from(data.toString('utf8').replaceAll('__SITE__', site));
  siteHash.update(data);
  fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true });
  fs.writeFileSync(path.join(out, f), data);
}
// Search engines: crawl everything; the sitemap lists the app and the about page, dated by the latest release.
const released = /date:\s*"(\d{4}-\d{2}-\d{2})"/.exec(fs.readFileSync('src/changelog.ts', 'utf8'))[1];
fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}sitemap.xml\n`);
fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['', 'about/'].map((p) => `  <url><loc>${site}${p}</loc><lastmod>${released}</lastmod></url>`).join('\n')}
</urlset>
`);
const v = siteHash.digest('hex').slice(0, 8);
const icons = [
  `<link rel="icon" href="/favicon.ico?v=${v}" sizes="32x32">`,
  `<link rel="icon" href="/favicon.svg?v=${v}" type="image/svg+xml">`,
  `<link rel="icon" href="/icon-192.png?v=${v}" sizes="192x192" type="image/png">`,
  `<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=${v}">`,
].join('\n');
const tag = `${icons}\n<script type="application/json" id="margin-assets">${JSON.stringify(map)}</script>`;
html = html.replace('</head>', `${tag}\n</head>`).replaceAll('__SITE__', site);
fs.writeFileSync(indexPath, html);

// Content-Security-Policy: everything from this site only; wasm needs 'wasm-unsafe-eval'; page images and saved
// files use blob: URLs; signatures and previews use data: URLs; inline styles are set from script.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self' data:",
  "connect-src 'self' blob: data:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'self'",
].join('; ');
const headers = `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Cross-Origin-Opener-Policy: same-origin

/
  Cache-Control: no-cache

/index.html
  Cache-Control: no-cache

/version.json
  Cache-Control: no-cache

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/a/*
  Cache-Control: public, max-age=31536000, immutable

/a/dict/*
  Content-Type: text/plain; charset=utf-8

/licenses/*
  Cache-Control: public, max-age=86400
/favicon.*
  Cache-Control: public, max-age=604800
/icon-*
  Cache-Control: public, max-age=604800
/apple-touch-icon.png
  Cache-Control: public, max-age=604800
/og.png
  Cache-Control: public, max-age=604800
/about/*
  Cache-Control: public, max-age=3600
/robots.txt
  Cache-Control: public, max-age=3600
/sitemap.xml
  Cache-Control: public, max-age=3600
`;
fs.writeFileSync(path.join(out, '_headers'), headers);

// also at a stable, readable address (the app itself loads the hashed copy listed above)
fs.mkdirSync(path.join(out, 'licenses'), { recursive: true });
for (const f of fs.readdirSync('public/licenses')) fs.copyFileSync(path.join('public/licenses', f), path.join(out, 'licenses', f));

const total = (dir) => fs.readdirSync(dir).reduce((n, f) => { const p = path.join(dir, f); return n + (fs.statSync(p).isDirectory() ? total(p) : fs.statSync(p).size); }, 0);
console.log(`${out}/: ${files.length} assets (${(bytes / 1e6).toFixed(1)} MB), site ${(total(out) / 1e6).toFixed(1)} MB`);
