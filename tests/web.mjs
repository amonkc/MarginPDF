// Checks for the self-hosted web build (npm run build:web; node scripts/serve.mjs web 8788):
// saving through a normal download, the licences link, no third-party requests, and how much a visitor
// downloads on a first visit, on a repeat visit (from cache), and for on-demand assets.
//   node tests/web.mjs http://localhost:8788/
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const url = process.argv[2] || 'http://localhost:8788/';
const origin = new URL(url).origin;
const b = await pw.chromium.launch();
const ctx = await b.newContext({ acceptDownloads: true, viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.enable');
let bytes = 0, requests = 0, cached = 0; const foreign = new Set(), sizes = {};
const urls = new Map();
cdp.on('Network.requestWillBeSent', (e) => urls.set(e.requestId, e.request.url));
cdp.on('Network.requestServedFromCache', () => cached++);
cdp.on('Network.loadingFinished', (e) => {
  const u = urls.get(e.requestId) || ''; requests++; bytes += e.encodedDataLength;
  if (!u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:')) foreign.add(u);
  const k = u.replace(origin, '').replace(/\.[0-9a-f]{10}\./, '.').replace(/-[\w-]{8}\./, '.'); sizes[k] = (sizes[k] || 0) + e.encodedDataLength;
});
const kb = (n) => (n / 1024).toFixed(0) + ' KB';
const reset = () => { bytes = 0; requests = 0; cached = 0; for (const k in sizes) delete sizes[k]; };

await page.goto(url); await page.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await page.waitForTimeout(1500);
console.log('first visit:', kb(bytes), 'in', requests, 'requests');
for (const [k, v] of Object.entries(sizes).sort((a, b) => b[1] - a[1]).slice(0, 8)) console.log('   ', kb(v).padStart(8), k);
reset();
await page.reload(); await page.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await page.waitForTimeout(1500);
console.log('repeat visit:', kb(bytes), 'transferred,', requests, 'requests,', cached, 'from cache');
reset();
// on demand: a Thai font when typing Thai text with the Add text tool, the dictionary on spell check
await page.keyboard.press('F7'); await page.waitForTimeout(2500);
console.log('spell check (dictionary):', kb(bytes)); reset();
await page.keyboard.press('Escape');
await page.evaluate(async () => { const { app } = window.__margin; app.settings.textFont = 'kanit'; });
await page.keyboard.press('t'); const g = await page.locator('.page[data-index="0"]').boundingBox();
await page.mouse.click(g.x + 100, g.y + 700); await page.waitForTimeout(400); await page.keyboard.type('สวัสดี'); await page.mouse.click(g.x + 20, g.y + 20); await page.waitForTimeout(2000);
console.log('first Thai text in a new font:', kb(bytes), Object.keys(sizes).filter((k) => /fonts\//.test(k)).join(', ')); reset();
// save: a normal download
await page.keyboard.press('v');
const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), page.keyboard.press('Control+s')]);
const p = await dl.path(); const fs = await import('fs');
console.log('save:', dl.suggestedFilename(), fs.statSync(p).size > 1000 ? 'ok' : 'empty');
// licences: in the app (What's new → Open-source licences) and at /licenses/
await page.locator('#btn-version').click(); await page.waitForSelector('.modal');
await page.locator('.modal .clink', { hasText: 'Open-source licences' }).click();
const shown = await page.locator('pre.licences').textContent({ timeout: 10000 });
console.log('licences in app:', shown.length > 50000 ? 'ok' : 'short', shown.slice(0, 39));
const r = await page.request.get(origin + '/licenses/THIRD_PARTY_NOTICES.txt'); console.log('licences:', r.status(), (await r.text()).slice(0, 39));
console.log('third-party requests:', [...foreign]);
console.log('errors', errors);
await b.close();
