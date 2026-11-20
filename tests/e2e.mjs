// End-to-end regression run: drives Margin in headless Chromium and prints a deterministic log of what
// happened (counts, labels, styles, text found in the saved PDF). Compare logs between builds:
//   node tests/e2e.mjs http://localhost:8788/ > new.log
// Uses the Playwright copy that ships with the dev tools (PLAYWRIGHT_BROWSERS_PATH / /opt/npm-tools).
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }
const { chromium, devices } = pw;
const url = process.argv[2] || 'http://localhost:8788/';
const out = [];
const log = (k, v) => { const line = k + ' ' + (typeof v === 'string' ? v : JSON.stringify(v)); out.push(line); console.log(line); };
const r1 = (x) => Math.round(x * 10) / 10;

const b = await chromium.launch();
const mainCtx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const page = await mainCtx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && !/TUNNEL|fonts\.g|net::ERR/.test(m.text()) && errors.push(m.text()));
await page.goto(url);
await page.waitForSelector('#boot', { state: 'detached', timeout: 90000 });
await page.waitForTimeout(600);
const M = (f, a) => page.evaluate(f, a);
const annots = (i = 0) => M((i) => window.__margin.app.doc.annots(i).map((a) => [a.subtype, Math.round(a.rect.l), Math.round(a.rect.b), a.color && a.color.slice(0, 3).join(',')]), i);
const menu = async () => { await page.waitForSelector('.ctxmenu'); const t = await page.locator('.ctxmenu .ctx-label, .ctxmenu .ctx-head').allInnerTexts(); return t.join(' | '); };
const closeMenu = async () => { await page.keyboard.press('Escape'); await page.waitForTimeout(150); };
const pg = async (i = 0) => page.locator(`.page[data-index="${i}"]`).boundingBox();
const centerOf = (k) => M((k) => { const { app, viewer } = window.__margin; const a = app.doc.annots(0).find((x) => x.index === k); const pv = viewer.views[0]; const bx = pv.tf.box(a.rect); const r = pv.ov.getBoundingClientRect(); return { x: r.x + bx.x + bx.w / 2, y: r.y + bx.y + bx.h / 2 }; }, k);

// A. boot
log('version', await page.locator('#btn-version').innerText());
log('pages', await M(() => { const d = window.__margin.app.doc; return [d.pageCount, ...Array.from({ length: d.pageCount }, (_, i) => Object.values(d.pageSize(i)).map(Math.round))]; }));
log('search Margin', await M(() => window.__margin.app.doc.search('Margin').length));
log('annots0', await annots());

// B. engine annotations + styles
await M(async () => {
  const { app } = window.__margin; const d = app.doc;
  await app.mutate('t', { pages: [0] }, () => {
    d.addShape(0, 5, { l: 330, r: 450, t: 430, b: 340 }, [214, 69, 52, 255], 2, 'me');
    d.addShape(0, 6, { l: 470, r: 560, t: 430, b: 340 }, null, 2, 'me', { fill: [134, 222, 140, 255], opacity: 0.5 });
    d.addLine(0, { x: 60, y: 300 }, { x: 260, y: 250 }, [37, 99, 235, 255], 3, ['None', 'ClosedArrow'], 'me');
    d.addInk(0, [[{ x: 300, y: 250 }, { x: 350, y: 300 }, { x: 400, y: 260 }]], [24, 26, 33, 255], 2, 'me');
    d.addNote(0, { x: 560, y: 600 }, 'note text', [246, 214, 74, 255], 'me');
  });
});
const A = await M(() => window.__margin.app.doc.annots(0).map((a) => a.index));
log('annots after add', await annots());
log('styles', await M((ks) => ks.map((k) => { const s = window.__margin.app.doc.annotStyle(0, k); return s && [Math.round(s.width * 10) / 10, s.dashed, s.fill && s.fill.slice(0, 3).join(','), Math.round(s.opacity * 100), s.ends]; }), A));

// C. Select tool: context menus on each new annotation kind
await page.keyboard.press('v');
for (const k of A.slice(-5)) {
  const p = await centerOf(k);
  await page.mouse.click(p.x, p.y, { button: 'right' });
  log('menu ' + k, await menu()); await closeMenu();
}
// restyle the rectangle from the menu, duplicate, copy/paste, undo/redo
const rect = A[A.length - 5];
let p = await centerOf(rect);
await page.mouse.click(p.x, p.y, { button: 'right' }); await page.waitForSelector('.ctxmenu');
await page.locator('.ctxmenu .ctx-swatches[aria-label="Fill"] button[aria-label="Yellow"]').click(); await page.waitForTimeout(300);
await page.mouse.click(p.x, p.y, { button: 'right' }); await page.waitForSelector('.ctxmenu');
await page.locator('.ctxmenu .ctx-swatches[aria-label="Style"] button[aria-label="Dashed line"]').click(); await page.waitForTimeout(300);
log('rect style', await M((k) => window.__margin.app.doc.annotStyle(0, k), rect));
await page.mouse.click(p.x, p.y); await page.waitForTimeout(150);
log('ribbon select', (await page.locator('#ribbon .rlabel, #ribbon .rtool').allInnerTexts()).join(' | '));
await page.keyboard.press('Control+d'); await page.waitForTimeout(500);
log('after dup', (await annots()).length);
await page.keyboard.press('Control+c'); await page.waitForTimeout(400);
await M(() => window.__margin.viewer.scrollToPage(1)); await page.waitForTimeout(500);
const before1 = (await annots(1)).length;
await page.mouse.click(1200, 450); await page.keyboard.press('Control+v'); await page.waitForTimeout(700);
log('paste p2', (await annots(1)).length - before1);
await page.keyboard.press('Control+z'); await page.waitForTimeout(500);
log('undo paste', (await annots(1)).length - before1);
await page.keyboard.press('Control+y'); await page.waitForTimeout(500);
log('redo paste', (await annots(1)).length - before1);
await M(() => window.__margin.viewer.scrollToPage(0)); await page.waitForTimeout(500);

// D. drawing tools through the UI
let g = await pg(0);
for (const [key, dx, dy] of [['r', 120, 80], ['o', 90, 60], ['l', 150, 40], ['d', 100, 30]]) {
  await page.keyboard.press(key); await page.waitForTimeout(150);
  log('ribbon ' + key, (await page.locator('#ribbon .rlabel, #ribbon .rtool').allInnerTexts()).join(' | '));
  const n0 = (await annots()).length;
  await page.mouse.move(g.x + 80, g.y + 500); await page.mouse.down(); await page.mouse.move(g.x + 80 + dx, g.y + 500 + dy, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(400);
  log('drew ' + key, (await annots()).length - n0);
}
// text box
await page.keyboard.press('b'); await page.waitForTimeout(150);
await page.mouse.move(g.x + 360, g.y + 520); await page.mouse.down(); await page.mouse.move(g.x + 560, g.y + 580, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(400);
await page.keyboard.type('Box text here'); await page.mouse.click(g.x + 20, g.y + 20); await page.waitForTimeout(800);
log('textbox', await M(() => { const d = window.__margin.app.doc; const a = d.annots(0).filter((x) => x.subtype === 3); return a.map((x) => d.readFreeText(0, x.index)?.text ?? null); }));
// add text
await page.keyboard.press('t'); await page.waitForTimeout(150);
await page.mouse.click(g.x + 100, g.y + 640); await page.waitForTimeout(400);
await page.keyboard.type('Added line of text'); await page.mouse.click(g.x + 20, g.y + 20); await page.waitForTimeout(1200);
log('search added', await M(() => window.__margin.app.doc.search('Added line of text').length));
// edit text
await page.keyboard.press('e'); await page.waitForTimeout(200);
const head = await M(() => { const { app, viewer } = window.__margin; const r = app.doc.search('Welcome to Margin')[0].rects[0]; const pv = viewer.views[0]; const bx = pv.tf.box(r); const o = pv.ov.getBoundingClientRect(); return { x: o.x + bx.x + 20, y: o.y + bx.y + bx.h / 2 }; });
await page.mouse.click(head.x, head.y); await page.waitForTimeout(600);
await page.keyboard.press('Control+a'); await page.keyboard.type('Heading was edited'); await page.keyboard.press('Control+Enter'); await page.waitForTimeout(1500);
log('edit text', await M(() => [window.__margin.app.doc.search('Heading was edited').length, window.__margin.app.doc.search('Welcome to Margin').length]));
await page.keyboard.press('v');

// E. Move & resize: select all on page 1, nudge, menu
await page.keyboard.press('a'); await page.waitForTimeout(300);
await page.mouse.click(g.x + 5, g.y + 5); await page.keyboard.press('Control+a'); await page.waitForTimeout(300);
log('arrange ribbon', (await page.locator('#ribbon .iconbtn').evaluateAll((e) => e.map((x) => x.getAttribute('aria-label')))).join(','));
p = await centerOf(rect);
await page.mouse.click(p.x, p.y, { button: 'right' }); log('arrange menu', await menu()); await closeMenu();
await page.keyboard.press('Escape'); await page.keyboard.press('v');

// F. page operations from the sidebar
const thumb = page.locator('.thumb').first();
for (const item of ['Rotate right', 'Insert blank page after']) {
  await thumb.click({ button: 'right' }); await page.waitForSelector('.ctxmenu');
  await page.locator('.ctxmenu .ctx-item', { hasText: item }).first().click(); await page.waitForTimeout(700);
  log('page op ' + item, await M(() => { const d = window.__margin.app.doc; return [d.pageCount, Object.values(d.pageSize(0)).map(Math.round)]; }));
}
await page.keyboard.press('Control+z'); await page.waitForTimeout(600); await page.keyboard.press('Control+z'); await page.waitForTimeout(600);
log('undo pages', await M(() => { const d = window.__margin.app.doc; return [d.pageCount, Object.values(d.pageSize(0)).map(Math.round)]; }));

// G. dialogs and panels from the More menu
for (const item of ['Print…', 'Export pages as images…', 'Compress…', 'Password protection…', 'Watermark & background…', 'Header & footer…', 'Flatten…', 'Extract or split pages…', 'Check spelling…']) {
  await page.locator('#btn-more').click(); await page.waitForSelector('.ctxmenu');
  await page.locator('.ctxmenu .ctx-item', { hasText: item }).first().click(); await page.waitForTimeout(700);
  const t = await M(() => document.querySelector('.modal h2')?.textContent || (document.querySelector('.spell-panel:not([hidden]) h2')?.textContent ?? 'none'));
  log('dialog ' + item, t);
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await M(() => document.querySelector('.modal-host:not([hidden]) .modal-scrim')?.click());
  await page.waitForTimeout(200);
}
// bookmarks tab
await page.locator('#tab-bookmarks').click(); await page.waitForTimeout(300);
log('bookmarks', await M(() => [document.querySelector('#bm-count')?.textContent, !!document.querySelector('.bm-pane')]));
await page.locator('#tab-pages').click();
// comments panel
log('comments', await M(() => document.querySelectorAll('.ccard').length));

// H. saved file: reopen the bytes with the engine and look inside
log('saved', await M(async () => {
  const { app } = window.__margin; const bytes = await app.exportBytes();
  const d = app.lib.open(bytes);
  try {
    const res = { pages: d.pageCount, annots: Array.from({ length: d.pageCount }, (_, i) => d.annots(i).length), text: ['Heading was edited', 'Added line of text', 'Margin'].map((s) => d.search(s).length) };
    return res;
  } finally { d.close(); }
}));

// I. password protection round trip
log('protect', await M(async () => {
  const { app } = window.__margin; await app.protect('secret', 'owner-secret', 0xFFFFFFFC);
  const bytes = await app.exportBytes(); let locked = false;
  try { app.lib.open(bytes).close(); } catch { locked = true; }
  const d = app.lib.open(bytes, 'secret'); const n = d.pageCount; d.close();
  await app.unprotect(); return [locked, n];
}).catch((e) => 'error: ' + e.message));


// K. regression checks for fixes made in 2.24.2
log('link to another page', await M(async () => {
  const { app } = window.__margin; const d = app.doc;
  await app.mutate('t', { pages: [0] }, () => d.addLink(0, { l: 60, r: 160, t: 760, b: 740 }, { page: 1 }));
  const l = d.links(0).at(-1); return l ? [l.page ?? l.target?.page ?? null] : 'none';
}).catch((e) => 'error: ' + e.message));
log('text box border default', await M(async () => {
  const { app } = window.__margin; const d = app.doc;
  const data = d.annots(0).filter((a) => a.subtype === 3).map((a) => d.readFreeText(0, a.index)).filter(Boolean)[0];
  if (!data) return 'no text box';
  const k = d.annots(0).find((a) => a.subtype === 3).index;
  const style = { ...data.style, border: [214, 69, 52, 255] }; delete style.borderWidth;
  await app.mutate('t', { pages: [0] }, async () => { const ai = d.annots(0).find((a) => a.subtype === 3).index; d.writeFreeText(0, ai, { ...data, style }, data.box, ''); });
  const back = d.readFreeText(0, k); const st = d.annotStyle(0, k);
  return [back && back.style.borderWidth, st && st.width];
}).catch((e) => 'error: ' + e.message));
await page.locator('#btn-more').click(); await page.waitForSelector('.ctxmenu');
await page.locator('.ctxmenu .ctx-item', { hasText: 'Print…' }).first().click(); await page.waitForSelector('.modal');
await page.locator('.modal input[name=pr-pages][value=range]').check(); await page.locator('#print-range').fill('');
await page.locator('.modal .btn.primary').click(); await page.waitForTimeout(500);
log('print empty range message', await page.locator('#toast').innerText());
await page.keyboard.press('Escape'); await M(() => document.querySelector('.modal-host:not([hidden]) .modal-scrim')?.click()); await page.waitForTimeout(300);

// K. Move & resize picks what's in front: an image placed over a line of text, then Alt-click for the text behind
const over = await M(async () => {
  const { app, viewer, arrange } = window.__margin; const pv = viewer.views[0];
  const line = arrange.itemsOf(pv).find((it) => it.kind === 'line'); const b = line.bounds;
  await app.mutate('img', { pages: [0] }, () => app.doc.addImage(0, [b.r - b.l + 40, 0, 0, b.t - b.b + 40, b.l - 20, b.b - 20], { rgba: new Uint8ClampedArray(4 * 4).fill(200), w: 2, h: 2 }));
  app.setTool('arrange'); pv.ov.scrollIntoView({ block: 'start' }); await new Promise((r) => setTimeout(r, 400));
  const bx = pv.tf.box(b), o = pv.ov.getBoundingClientRect(); return { x: o.x + bx.x + bx.w / 2, y: o.y + bx.y + bx.h / 2 };
});
const picked = () => M(() => window.__margin.arrange.selected().map((it) => it.label).join());
await page.mouse.click(over.x, over.y); await page.waitForTimeout(300); const front = await picked();
await page.keyboard.down('Alt'); await page.mouse.click(over.x, over.y); await page.keyboard.up('Alt'); await page.waitForTimeout(300);
log('click picks front, alt-click behind', [front, await picked()]);
await page.keyboard.press('Escape'); await page.keyboard.press('Control+z'); await page.waitForTimeout(600); await page.keyboard.press('v');

// J. touch: drag an annotation with a finger
const ctx = await b.newContext({ ...devices['Pixel 7'] }); const ph = await ctx.newPage();
ph.on('pageerror', (e) => errors.push('phone: ' + e.message));
await ph.goto(url); await ph.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await ph.waitForTimeout(600);
await ph.evaluate(async () => { const { app } = window.__margin; await app.mutate('t', { pages: [0] }, () => app.doc.addShape(0, 5, { l: 250, r: 400, t: 620, b: 520 }, [214, 69, 52, 255], 3, 'me')); app.setTool('select'); });
await ph.waitForTimeout(500);
const c = await ph.evaluate(() => { const { app, viewer } = window.__margin; const a = app.doc.annots(0).at(-1); const pv = viewer.views[0]; const bx = pv.tf.box(a.rect); const r = pv.ov.getBoundingClientRect(); return { x: r.x + bx.x + bx.w / 2, y: r.y + bx.y + bx.h / 2, l: a.rect.l }; });
const cdp = await ctx.newCDPSession(ph);
const t = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
await t('touchStart', c.x, c.y); for (let i = 1; i <= 10; i++) { await t('touchMove', c.x + 6 * i, c.y + 8 * i); await ph.waitForTimeout(16); } await t('touchEnd'); await ph.waitForTimeout(800);
log('touch drag moved', await ph.evaluate((l0) => Math.round(window.__margin.app.doc.annots(0).at(-1).rect.l - l0) > 50, c.l));

// L. unsaved changes survive a refresh (with their undo history), and a closed tab's changes are offered back
const state = () => page.evaluate(() => { const { app } = window.__margin; return [app.fileName, app.dirty, app.doc.pageCount, app.doc.annots(0).length, app.undoStack.length, app.undoLabel]; });
const before = await state(); await page.waitForTimeout(1000);
await page.reload(); await page.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await page.waitForTimeout(800);
const after = await state();
log('refresh keeps unsaved changes', [JSON.stringify(after.slice(0, 4)) === JSON.stringify(before.slice(0, 4)), after[0], after[1], after[5] === before[5], before[4], after[4]]);
await page.keyboard.press('Escape'); await page.keyboard.press('Control+z'); await page.waitForTimeout(800);
log('undo after refresh', (await state())[4] === after[4] - 1);
const other = await page.context().newPage(); await other.goto(url); await other.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await other.waitForTimeout(800);
log('second open tab: nothing offered', [await other.locator('.modal').count(), await other.evaluate(() => window.__margin.app.dirty)]);
await other.close(); const kept = await state(); await page.waitForTimeout(1000); await page.close();
const next = await other.context().newPage(); next.on('pageerror', (e) => errors.push('next: ' + e.message));
await next.goto(url); await next.waitForSelector('.modal', { timeout: 90000 });
log('closed tab offered', (await next.locator('.modal').innerText()).replace(/\(last edited [^)]*\)/, '(…)').replace(/\s+/g, ' '));
await next.locator('.modal .btn.primary').click(); await next.waitForTimeout(1500);
const back = await next.evaluate(() => { const { app } = window.__margin; return [app.fileName, app.dirty, app.doc.pageCount, app.doc.annots(0).length, app.undoStack.length, app.undoLabel]; });
log('restored in new tab', JSON.stringify(back) === JSON.stringify(kept));
await next.reload(); await next.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await next.waitForTimeout(800);
log('adopted session survives its refresh', [await next.locator('.modal').count(), await next.evaluate(() => window.__margin.app.dirty)]);

// M. a newer version deployed while Margin is open: version button and toast, then the "updated" note after reload
await next.route('**/version.json', (r) => r.fulfill({ json: { version: '99.0.0', releases: [{ version: '99.0.0', date: '2099-01-01', notes: ['A test release.'] }] } }));
await next.evaluate(() => window.__margin.updates.check(true)); await next.waitForTimeout(400);
const current = await next.evaluate(() => document.querySelector('#btn-version').textContent.match(/\d+\.\d+\.\d+/)[0]);
const vx = (t) => t.split(current).join('X.Y.Z').replace(/\s+/g, ' ').trim();
log('update noticed', [vx(await next.locator('#btn-version').innerText()), vx(await next.locator('#toast').innerText())]);
await next.locator('#btn-version').click(); await next.waitForSelector('.modal');
log('update window', vx(await next.locator('.modal').innerText()));
await next.unroute('**/version.json'); await next.evaluate(() => localStorage.setItem('margin.version', '1.0.0'));
await next.locator('.modal .btn.primary').click(); await next.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await next.waitForTimeout(800);
const restoredMsg = vx(await next.locator('#toast').innerText()); await next.waitForTimeout(4500);
log('after update reload', [restoredMsg, vx(await next.locator('#toast').innerText()), await next.evaluate(() => window.__margin.app.dirty), vx(await next.locator('#btn-version').innerText())]);

// N. no width makes the page wider than the screen (phones then zoom the whole app out), e.g. a Galaxy Z Fold in landscape
const fits = [];
for (const w of [400, 700, 882, 960, 1024, 1100, 1280]) {
  const c = await b.newContext({ viewport: { width: w, height: 700 }, isMobile: w < 1100, hasTouch: w < 1100 }); const pg = await c.newPage();
  await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 });
  fits.push(await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth && innerWidth === visualViewport.width)); await c.close();
}
log('page fits the screen at every width', fits);

// O. the More (⋯) button toggles its menu: click opens, click again closes, again opens (mouse and touch)
const toggles = [];
for (const touch of [false, true]) {
  const c = await b.newContext({ viewport: { width: touch ? 700 : 1280, height: 800 }, isMobile: touch, hasTouch: touch }); const pg = await c.newPage();
  await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(300);
  const press = () => (touch ? pg.locator('#btn-more').tap() : pg.locator('#btn-more').click()).then(() => pg.waitForTimeout(300));
  for (let i = 0; i < 3; i++) { await press(); toggles.push((await pg.locator('.ctxmenu').count()) + ':' + await pg.locator('#btn-more').getAttribute('aria-expanded')); }
  await c.close();
}
log('more button toggles its menu', toggles);

// P. zoom: two-finger pinch on a touch screen, and the zoom menu on the percentage
{
  const c = await b.newContext({ ...devices['Pixel 7'] }); const pg = await c.newPage();
  pg.on('pageerror', (e) => errors.push('pinch: ' + e.message));
  await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(600);
  const before = await pg.evaluate(() => { const { viewer, app } = window.__margin; return { z: viewer.zoom, n: app.doc.annots(0).length, r: viewer.el.getBoundingClientRect() }; });
  const cx = before.r.x + before.r.width / 2, cy = before.r.y + before.r.height / 2;
  // the content point under the fingers' midpoint, as a fraction of the pages
  const under = () => pg.evaluate(([x, y]) => { const v = window.__margin.viewer, r = v.inner.getBoundingClientRect(); return [(x - r.left) / r.width, (y - r.top) / r.height]; }, [cx, cy]);
  const u0 = await under();
  const cdp = await c.newCDPSession(pg), touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], id) => ({ x, y, id })) });
  await touch('touchStart', [[cx - 40, cy], [cx + 40, cy]]);
  for (let i = 1; i <= 10; i++) { await touch('touchMove', [[cx - 40 - 4 * i, cy], [cx + 40 + 4 * i, cy]]); await pg.waitForTimeout(16); }
  const mid = await pg.evaluate(() => [window.__margin.viewer.zoom, !!window.__margin.viewer.inner.style.transform]);
  await touch('touchEnd', []); await pg.waitForTimeout(600);
  const after = await pg.evaluate(() => { const { viewer, app } = window.__margin; return { z: viewer.zoom, n: app.doc.annots(0).length, t: viewer.inner.style.transform }; });
  const u1 = await under();
  log('pinch zoom', [Math.round((after.z / before.z) * 10) / 10, mid[0] === before.z && mid[1], after.t === '', after.n === before.n, Math.abs(u1[0] - u0[0]) < 0.01 && Math.abs(u1[1] - u0[1]) < 0.01]);
  // pinching with the Draw tool zooms and draws nothing
  await pg.evaluate(() => window.__margin.app.setTool('draw')); await pg.waitForTimeout(200);
  const z1 = after.z;
  await touch('touchStart', [[cx - 60, cy], [cx + 60, cy]]);
  for (let i = 1; i <= 10; i++) { await touch('touchMove', [[cx - 60 + 3 * i, cy + 2 * i], [cx + 60 - 3 * i, cy + 2 * i]]); await pg.waitForTimeout(16); }
  await touch('touchEnd', []); await pg.waitForTimeout(600);
  log('pinch with draw tool', await pg.evaluate(([n, z]) => { const { viewer, app } = window.__margin; return [app.doc.annots(0).length === n, viewer.zoom < z, app.dirty]; }, [after.n, z1]));
  await c.close();
}
{
  const c = await b.newContext({ viewport: { width: 1280, height: 800 } }); const pg = await c.newPage();
  await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(400);
  await pg.locator('#zoom-level').click();
  const items = await pg.locator('.ctxmenu .ctx-item').evaluateAll((e) => e.map((x) => (x.getAttribute('aria-checked') === 'true' ? '✓' : '') + x.textContent));
  await pg.locator('.ctxmenu .ctx-item', { hasText: '200%' }).click(); await pg.waitForTimeout(300);
  const z200 = await pg.locator('#zoom-level').innerText();
  await pg.locator('#zoom-level').click(); await pg.locator('.ctxmenu .ctx-item', { hasText: 'Fit page' }).click(); await pg.waitForTimeout(300);
  const fitPage = await pg.evaluate(() => { const v = window.__margin.viewer, p = v.views[0].wrap.getBoundingClientRect(); return v.fit === 'page' && p.height <= v.el.clientHeight; });
  log('zoom menu', [items.join(' | '), z200, fitPage]);
  await c.close();
}

// Q. pages and comments panels: toggle buttons at every width, Ctrl+Alt+P / C, remembered where docked
{
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const pg = await c.newPage();
  await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(400);
  const look = () => pg.evaluate(() => {
    const vis = (sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return r.width > 0 && r.right > 0 && r.left < innerWidth && getComputedStyle(document.querySelector(sel)).display !== 'none'; };
    return [vis('#thumbs'), vis('#comments'), document.querySelector('#btn-pages').getAttribute('aria-pressed'), document.querySelector('#btn-comments').getAttribute('aria-pressed'), Math.round(window.__margin.viewer.el.clientWidth)];
  });
  const steps = [['start', await look()]];
  await pg.locator('#btn-pages').click(); await pg.waitForTimeout(300); steps.push(['pages button', await look()]);
  await pg.keyboard.press('Control+Alt+KeyC'); await pg.waitForTimeout(300); steps.push(['ctrl+alt+c', await look()]);
  await pg.reload(); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(400); steps.push(['after reload', await look()]);
  await pg.keyboard.press('Control+Alt+KeyP'); await pg.waitForTimeout(300); steps.push(['ctrl+alt+p', await look()]);
  await pg.setViewportSize({ width: 1000, height: 800 }); await pg.waitForTimeout(400); steps.push(['1000 px', await look()]);
  await pg.locator('#btn-comments').click(); await pg.waitForTimeout(400); steps.push(['1000 px comments', await look()]);
  await pg.locator('#btn-comments').click(); await pg.waitForTimeout(400);
  await pg.setViewportSize({ width: 700, height: 800 }); await pg.waitForTimeout(400); steps.push(['700 px', await look()]);
  await pg.locator('#btn-pages').click(); await pg.waitForTimeout(400); steps.push(['700 px pages', await look()]);
  for (const [name, v] of steps) log('panels ' + name, v.slice(0, 4).concat(v[4] > 0 ? [] : ['no viewer']));
  log('panels: viewer widens when both hidden', steps[2][1][4] > steps[0][1][4] + 400);
  await c.close();
}

// R. rotate and delete on each page thumbnail: shown on hover or selection; act on the selection if the page is in it
{
  const c = await b.newContext({ viewport: { width: 1280, height: 800 } }); const pg = await c.newPage();
  await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(500);
  const rot = () => pg.evaluate(() => { const d = window.__margin.app.doc; return Array.from({ length: d.pageCount }, (_, i) => d.pageSize(i).w > d.pageSize(i).h ? 'L' : 'P').join(''); });
  const shown = (i) => pg.locator('.thumb').nth(i).locator('.tactions').evaluate((e) => getComputedStyle(e).opacity === '1');
  const steps = [['start', await rot(), await shown(0), await shown(1)]];
  await pg.locator('.thumb').nth(1).hover(); await pg.waitForTimeout(200); steps.push(['hover page 2', await shown(1)]);
  await pg.locator('.thumb').nth(1).locator('[data-act=rotr]').click(); await pg.waitForTimeout(400);
  steps.push(['rotate page 2', await rot(), await pg.evaluate(() => [...window.__margin.app.selectedPages].join())]);
  await pg.locator('.thumb').nth(0).click(); await pg.locator('.thumb').nth(2).click({ modifiers: ['Control'] }); await pg.waitForTimeout(200);
  await pg.locator('.thumb').nth(2).hover(); await pg.locator('.thumb').nth(2).locator('[data-act=rotl]').click(); await pg.waitForTimeout(400);
  steps.push(['rotate selection 1+3', await rot()]);
  await pg.locator('.thumb').nth(1).hover(); await pg.locator('.thumb').nth(1).locator('[data-act=delete]').click(); await pg.waitForSelector('.modal');
  steps.push(['delete page 2 asks', (await pg.locator('.modal h2, .modal .modal-title').first().innerText()).trim()]);
  await pg.locator('.modal .btn', { hasText: 'Cancel' }).click(); await pg.waitForTimeout(200);
  steps.push(['toolbar', await pg.locator('.page-actions [data-act]').evaluateAll((e) => e.map((x) => x.dataset.act).join())]);
  for (const st of steps) log('page buttons ' + st[0], st.slice(1));
  await c.close();
  const t = await b.newContext({ ...devices['Pixel 7'] }); const tp = await t.newPage();
  await tp.goto(url); await tp.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await tp.waitForTimeout(400);
  await tp.locator('#btn-pages').tap(); await tp.waitForTimeout(400);
  const vis = (i) => tp.locator('.thumb').nth(i).locator('.tactions').evaluate((e) => getComputedStyle(e).opacity === '1');
  const before = [await vis(0), await vis(1)]; await tp.locator('.thumb').nth(1).tap(); await tp.waitForTimeout(300);
  log('page buttons on touch: only on the selected page', [before, [await vis(0), await vis(1)]]);
  await t.close();
}

// S. writing in other languages: each script gets a font that has it (Helvetica chosen, so all need one), the
// text stays searchable after saving and reopening, and saved files embed only the characters used
{
  const SAMPLES = [['Simplified Chinese + pinyin', '你好，世界。nǐ hǎo'], ['Traditional Chinese', '繁體中文測試'], ['Japanese', 'こんにちは、日本語です'], ['Korean', '안녕하세요 한국어'],
    ['Hindi', 'नमस्ते दुनिया'], ['Bengali', 'আমার সোনার বাংলা'], ['Tamil', 'வணக்கம் உலகம்'], ['Telugu', 'నమస్కారం'], ['Lao', 'ສະບາຍດີ'], ['Khmer', 'សួស្តីពិភពលោក'],
    ['Burmese', 'မင်္ဂလာပါ'], ['Thai + Chinese + English', 'ภาษาไทย 中文 English'], ['Russian', 'Привет, мир'], ['Vietnamese', 'Tiếng Việt có dấu']];
  const c = await b.newContext({ viewport: { width: 1400, height: 1000 } }); const pg = await c.newPage();
  pg.on('pageerror', (e) => errors.push('languages: ' + e.message));
  await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(400);
  await pg.evaluate(async () => { const { app, viewer } = window.__margin; await app.mutate('blank', { pages: 'all', structure: true }, () => app.doc.insertBlank(0, 612, 792)); app.settings.textFont = 'helv'; viewer.scrollToPage(0); });
  await pg.waitForTimeout(600);
  const before = await pg.evaluate(() => window.__margin.app.exportBytes().length);
  const o = await pg.evaluate(() => { const r = window.__margin.viewer.views[0].ov.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width }; });
  const used = [];
  for (const [i, [, text]] of SAMPLES.entries()) {
    await pg.keyboard.press('t'); await pg.waitForTimeout(150);
    await pg.mouse.click(o.x + 40, o.y + 30 + i * 46); await pg.waitForTimeout(300);
    await pg.keyboard.insertText(text); await pg.mouse.click(o.x + o.w - 10, o.y + 5);
    for (let k = 0; k < 150 && await pg.evaluate(() => !!window.__margin.ix.editor || /^Loading/.test(document.querySelector('#toast').textContent)); k++) await pg.waitForTimeout(200);
    await pg.waitForTimeout(400); used.push((await pg.locator('#toast').innerText()).replace(/^.* so Margin used (.*) for them\.$/, '$1'));
  }
  const first = (t) => t.split(/[，、 ]/)[0];
  const found = await pg.evaluate((words) => words.map((w) => window.__margin.app.doc.search(w).length > 0), SAMPLES.map(([, t]) => first(t)));
  const bytes = await pg.evaluate(() => Array.from(window.__margin.app.exportBytes()));
  const reopened = await pg.evaluate(([bytes, words]) => { const { app } = window.__margin; app.open(new Uint8Array(bytes), 'languages.pdf'); return words.map((w) => app.doc.search(w).length > 0); }, [bytes, SAMPLES.map(([, t]) => first(t))]);
  SAMPLES.forEach(([name], i) => log('language ' + name, [used[i], found[i], reopened[i]]));
  log('languages: saved file grew by under 200 KB', bytes.length - before < 200 * 1024);
  await c.close();
}

// T. images to PDF: open images as a new PDF (one page each, paper turned to fit), insert images as pages
{
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await c.newPage();
  pg.on('pageerror', (e) => errors.push('images: ' + e.message));
  await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(300);
  const make = (w, h, type, colour) => pg.evaluate(async ([w, h, type, colour]) => {
    const cv = new OffscreenCanvas(w, h), ctx = cv.getContext('2d'); ctx.fillStyle = colour; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#fff'; ctx.fillRect(w / 4, h / 4, w / 2, h / 2);
    return Array.from(new Uint8Array(await (await cv.convertToBlob({ type, quality: 0.9 })).arrayBuffer()));
  }, [w, h, type, colour]);
  const files = [
    { name: 'landscape.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(await make(1600, 1000, 'image/jpeg', '#c0392b')) },
    { name: 'portrait.png', mimeType: 'image/png', buffer: Buffer.from(await make(800, 1200, 'image/png', '#2471a3')) },
    { name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') },
  ];
  await pg.locator('#file-open').setInputFiles(files); await pg.waitForSelector('.modal');
  const dialog = (await pg.locator('.modal').innerText()).replace(/\s+/g, ' ');
  await pg.locator('.modal .btn.primary').click(); await pg.waitForTimeout(1500);
  const doc = () => pg.evaluate(() => { const { app } = window.__margin; return { name: app.fileName, dirty: app.dirty, pages: Array.from({ length: app.doc.pageCount }, (_, i) => { const s = app.doc.pageSize(i); return Math.round(s.w) + 'x' + Math.round(s.h); }) }; });
  log('images to PDF dialog', dialog);
  log('images to PDF', [JSON.stringify(await doc()), (await pg.locator('#toast').innerText()).replace(/\s+/g, ' ')]);
  // insert one more image as a page, after the selected page, Letter size with a small margin
  await pg.locator('.thumb').nth(0).click();
  await pg.locator('#file-merge').setInputFiles([{ name: 'more.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(await make(900, 900, 'image/jpeg', '#1e8449')) }]);
  await pg.waitForSelector('.modal'); await pg.locator('.modal input[value=letter]').check(); await pg.locator('.modal input[name=ip-margin][value="18"]').check();
  await pg.locator('.modal .btn.primary').click(); await pg.waitForTimeout(1500);
  log('image inserted as page 2', JSON.stringify(await doc()));
  await c.close();
}

// U. scan with camera: a photo of a tilted page is found, straightened and cleaned, then becomes a new PDF
{
  const c = await b.newContext({ ...devices['Pixel 7'] }); const pg = await c.newPage();
  pg.on('pageerror', (e) => errors.push('scan: ' + e.message));
  await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(300);
  const photo = await pg.evaluate(async () => {
    const cv = new OffscreenCanvas(1600, 1200), x = cv.getContext('2d');
    x.fillStyle = '#3b332c'; x.fillRect(0, 0, 1600, 1200);
    x.save(); x.translate(800, 600); x.rotate(0.12); const g = x.createLinearGradient(-450, 0, 450, 0); g.addColorStop(0, '#f2efe8'); g.addColorStop(1, '#a9a69f');
    x.fillStyle = g; x.fillRect(-420, -540, 840, 1080); x.fillStyle = '#222'; x.font = '30px serif';
    for (let i = 0; i < 14; i++) x.fillText('Line ' + (i + 1) + ' of the scanned document text', -360, -330 + i * 56); x.restore();
    return Array.from(new Uint8Array(await (await cv.convertToBlob({ type: 'image/jpeg', quality: 0.9 })).arrayBuffer()));
  });
  await pg.locator('#btn-more').tap(); await pg.locator('.ctxmenu .ctx-item', { hasText: 'Scan with camera' }).tap(); await pg.waitForSelector('.scan');
  const finishHidden = await pg.locator('#scan-finish').isHidden();
  const [chooser] = await Promise.all([pg.waitForEvent('filechooser'), pg.locator('#scan-choose').tap()]);
  await chooser.setFiles({ name: 'photo.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(photo) }); await pg.waitForSelector('.scan-edit:not([hidden])'); await pg.waitForTimeout(300);
  // the corners found, in photo pixels, against the page's true corners (rotated 0.12 rad about the centre)
  const found = await pg.evaluate(() => [...document.querySelectorAll('.scan-handle')].map((el) => { const c = document.querySelector('.scan-photo'), k = 1600 / c.getBoundingClientRect().width; return [parseFloat(el.style.left) * k, parseFloat(el.style.top) * k]; }));
  const truth = [[-420, -540], [420, -540], [420, 540], [-420, 540]].map(([x, y]) => [800 + x * Math.cos(0.12) - y * Math.sin(0.12), 600 + x * Math.sin(0.12) + y * Math.cos(0.12)]);
  const error = Math.max(...found.map((p, i) => Math.hypot(p[0] - truth[i][0], p[1] - truth[i][1])));
  await pg.locator('#scan-keep').tap(); await pg.waitForSelector('.scan-thumb', { timeout: 20000 });
  await pg.locator('#scan-create').tap(); await pg.waitForTimeout(1500);
  const result = await pg.evaluate(() => { const { app } = window.__margin, s = app.doc.pageSize(0); return [/^Scan \d{4}-\d\d-\d\d \d\d\.\d\d\.pdf$/.test(app.fileName), app.dirty, app.doc.pageCount, Math.round(s.h), Math.abs(s.w / s.h - 840 / 1080) < 0.03]; });
  log('scan', [finishHidden, error < 30, ...result]);
  await c.close();
}

// V. recognise text (OCR): a picture of English and Thai text, read with English + Thai, becomes searchable
{
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await c.newPage();
  pg.on('pageerror', (e) => errors.push('ocr: ' + e.message));
  await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(300);
  const img = await pg.evaluate(async () => {
    const cv = new OffscreenCanvas(1700, 1100), x = cv.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 1700, 1100); x.fillStyle = '#111';
    x.font = '56px serif'; x.fillText('The quick brown fox jumps over the lazy dog.', 80, 200); x.fillText('Invoice number 2026-118, total 4,250 baht.', 80, 320);
    x.font = '60px sans-serif'; x.fillText('ภาษาไทยอ่านได้ถูกต้อง', 80, 460);
    return Array.from(new Uint8Array(await (await cv.convertToBlob({ type: 'image/png' })).arrayBuffer()));
  });
  await pg.locator('#file-open').setInputFiles([{ name: 'scan.png', mimeType: 'image/png', buffer: Buffer.from(img) }]); await pg.waitForSelector('.modal'); await pg.locator('.modal .btn.primary').click(); await pg.waitForTimeout(1200);
  await pg.locator('#btn-more').click(); await pg.locator('.ctxmenu .ctx-item', { hasText: 'Recognise text' }).click(); await pg.waitForSelector('.modal');
  await pg.locator('.modal .ocr-langs input').evaluateAll((els) => els.forEach((e) => (e.checked = ['eng', 'tha'].includes(e.value))));
  await pg.locator('.modal .btn.primary').click();
  await pg.waitForFunction(() => /^Recognised|^No text|failed/.test(document.querySelector('#toast')?.textContent || ''), null, { timeout: 180000 });
  const found = await pg.evaluate(() => { const d = window.__margin.app.doc; return ['quick', 'lazy', '2026-118', 'ภาษาไทย'].map((w) => d.search(w).length > 0); });
  const quick = await pg.evaluate(() => window.__margin.app.doc.search('quick')[0].rects[0]);
  log('ocr', [(await pg.locator('#toast').innerText()).replace(/\d+ lines?/, 'N lines'), ...found, quick.l > 75 && quick.l < 95]);
  // running it again with "skip pages that already have text" finds nothing to do
  await pg.locator('#btn-more').click(); await pg.locator('.ctxmenu .ctx-item', { hasText: 'Recognise text' }).click(); await pg.waitForSelector('.modal'); await pg.locator('.modal .btn.primary').click(); await pg.waitForTimeout(500);
  log('ocr again skips pages with text', (await pg.locator('#toast').innerText()).startsWith('Those pages already have text'));
  await c.close();
}

log('errors', errors);
await b.close();
