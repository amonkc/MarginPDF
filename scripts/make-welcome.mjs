// Builds public/welcome.pdf: scripts/welcome/base.pdf plus a "More languages" section on page 1, written with
// Margin itself (so each sample is a real Margin text block, set in the font for its script, editable in the app).
//
// Usage: npm run build && npm run serve:web, then node scripts/make-welcome.mjs http://localhost:8788/
import { createRequire } from 'module';
import fs from 'fs';
const { chromium } = createRequire(import.meta.url)('playwright');

const INK = '171a21', GREY = '5c6170';
/** [name, sample, font key] in two columns of seven. */
const LEFT = [
  ['Simplified Chinese', '欢迎 huānyíng', 'notosanssc'],
  ['Traditional Chinese', '歡迎光臨', 'notosanstc'],
  ['Japanese', 'ようこそ', 'notosansjp'],
  ['Korean', '환영합니다', 'notosanskr'],
  ['Thai', 'ยินดีต้อนรับ', 'sarabun'],
  ['Vietnamese', 'Chào mừng', 'sarabun'],
  ['Russian', 'Добро пожаловать', 'lato'],
];
const RIGHT = [
  ['Hindi', 'स्वागत है', 'notosansdevanagari'],
  ['Bengali', 'স্বাগতম', 'notosansbengali'],
  ['Tamil', 'வணக்கம்', 'notosanstamil'],
  ['Telugu', 'స్వాగతం', 'notosanstelugu'],
  ['Lao', 'ຍິນດີຕ້ອນຮັບ', 'notosanslao'],
  ['Khmer', 'សូមស្វាគមន៍', 'notosanskhmer'],
  ['Burmese', 'မင်္ဂလာပါ', 'notosansmyanmar'],
];
const PAGE_H = 792, HEAD_TOP = 528, ROW_TOP = 556, PITCH = 24;

const block = (x, top, text, opts) => ({
  v: 1, paras: [[{ t: text, ...(opts.b ? { b: true } : {}) }]], font: opts.font, size: opts.size, color: opts.color, align: 'left', lh: 1.2,
  bm: [1, 0, 0, 1, x, PAGE_H - top],
});
const blocks = [
  block(72, HEAD_TOP, 'More languages', { font: 'helv', size: 12, color: INK, b: true }),
  block(190, HEAD_TOP, 'Add text and Edit text work in these too, each in a font made for it.', { font: 'helv', size: 11, color: GREY }),
];
LEFT.forEach(([name, sample, font], i) => {
  blocks.push(block(72, ROW_TOP + i * PITCH, name, { font: 'helv', size: 12, color: INK, b: true }));
  blocks.push(block(210, ROW_TOP + i * PITCH, sample, { font, size: 13, color: INK }));
});
RIGHT.forEach(([name, sample, font], i) => {
  blocks.push(block(360, ROW_TOP + i * PITCH, name, { font: 'helv', size: 12, color: INK, b: true }));
  blocks.push(block(432, ROW_TOP + i * PITCH, sample, { font, size: 13, color: INK }));
});

const url = process.argv[2] || 'http://localhost:8788/';
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(url);
await page.waitForSelector('#boot', { state: 'detached', timeout: 90000 });
const base = [...fs.readFileSync(new URL('./welcome/base.pdf', import.meta.url))];
const out = await page.evaluate(async ([base, blocks]) => {
  const { app, writeRichText } = window.__margin;
  app.open(new Uint8Array(base), 'Welcome to Margin.pdf');
  const fallbacks = [];
  await app.mutate('More languages', { pages: [0] }, async () => {
    for (const rt of blocks) fallbacks.push(...(await writeRichText(app.doc, 0, rt)).fallbacks);
  });
  return { bytes: Array.from(app.exportBytes()), fallbacks };
}, [base, blocks]);
if (errors.length || out.fallbacks.length) throw new Error(`errors ${JSON.stringify(errors)}, fonts that needed help ${out.fallbacks}`);
fs.writeFileSync(new URL('../public/welcome.pdf', import.meta.url), Buffer.from(out.bytes));
console.log('public/welcome.pdf', out.bytes.length, 'bytes');
await browser.close();
