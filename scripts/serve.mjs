// Local stand-in for Cloudflare's static hosting, for testing the web build (npm run serve:web):
// serves a directory, applies its _headers file, and compresses the content types Cloudflare compresses.
//   node scripts/serve.mjs web 8788
import http from 'http';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const [dir = 'web', port = '8788'] = process.argv.slice(2);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml' };
const COMPRESSIBLE = /^(text\/|application\/(javascript|json|wasm)|font\/(ttf|otf)|image\/svg)/;

// _headers: blocks of "<path pattern>" followed by indented "Name: value" lines; * matches anything
const rules = [];
const hf = path.join(dir, '_headers');
if (fs.existsSync(hf)) {
  let cur = null;
  for (const line of fs.readFileSync(hf, 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) { cur = { re: new RegExp('^' + line.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'), headers: [] }; rules.push(cur); }
    else if (cur) { const i = line.indexOf(':'); cur.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]); }
  }
}

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(dir, url);
  if (!file.startsWith(path.resolve(dir)) && !path.resolve(file).startsWith(path.resolve(dir))) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) || path.basename(file) === '_headers') { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); return; }
  const headers = { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' };
  for (const r of rules) if (r.re.test(url)) for (const [k, v] of r.headers) headers[k] = v;
  let body = fs.readFileSync(file);
  const ae = req.headers['accept-encoding'] || '';
  if (COMPRESSIBLE.test(headers['Content-Type']) && body.length > 50) {
    if (/\bbr\b/.test(ae)) { body = zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }); headers['Content-Encoding'] = 'br'; }
    else if (/gzip/.test(ae)) { body = zlib.gzipSync(body); headers['Content-Encoding'] = 'gzip'; }
    headers['Vary'] = 'Accept-Encoding';
  }
  headers['Content-Length'] = body.length;
  res.writeHead(200, headers).end(req.method === 'HEAD' ? undefined : body);
}).listen(+port, () => console.log(`Serving ${dir}/ on http://localhost:${port}`));
