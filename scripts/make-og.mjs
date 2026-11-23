// Builds site/og.png, the 1200×630 image shown when a link to Margin is shared (Open Graph / Twitter card):
// the built app with the welcome PDF open. Run against the local server: npm run build && npm run serve:web, then
//   node scripts/make-og.mjs http://localhost:8788/
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
const url = process.argv[2] || 'http://localhost:8788/';
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await pg.goto(url); await pg.waitForSelector('#boot', { state: 'detached', timeout: 90000 }); await pg.waitForTimeout(1200);
await pg.addStyleTag({ content: '#btn-version { visibility: hidden }' }); // the image outlives the version
await pg.screenshot({ path: 'site/og.png' });
await b.close();
console.log('site/og.png written');
