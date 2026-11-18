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

log('errors', errors);
await b.close();
