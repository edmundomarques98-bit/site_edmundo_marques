// node render.mjs [final|overlay|preview] [n...]
import { createRequire } from 'module';
import path from 'path';
const require = createRequire('/usr/local/lib/node_modules/');
const { chromium } = require('playwright');
const dir = path.dirname(new URL(import.meta.url).pathname);
const mode = process.argv[2] || 'final';
const nums = process.argv.slice(3).map(Number);
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1440 } });
if (mode === 'preview') {
  await page.setViewportSize({ width: 1400, height: 2000 });
  await page.goto(`file://${dir}/posts.html?mode=final`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${dir}/out/preview.png`, fullPage: true });
} else {
  for (const n of nums.length ? nums : [1,2,3,4,5,6,7,8,9,10,11]) {
    await page.goto(`file://${dir}/posts.html?mode=${mode}&n=${n}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.locator(`#p${n}`).screenshot({ path: `${dir}/out/${mode}-${String(n).padStart(2,'0')}.png`, omitBackground: mode === 'overlay' });
  }
}
await browser.close();
