/**
 * Review slices for the Theme C work (E-25): the whole page as a few half-scale
 * images, each a tall strip, so a long page can be looked over quickly.
 *
 *   node scripts/theme/slices.mjs <url> <outPrefix> [width=1280] [sliceHeight=2400]
 */
import { chromium } from "@playwright/test";
const [url, out, width = "1280", slice = "2400"] = process.argv.slice(2);
const W = Number(width), H = Number(slice);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: 900 }, deviceScaleFactor: W < 600 ? 1 : 0.5 });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1500);
// Some pages (Home) lay out inside a scrolling root, so documentElement reports
// only one screen: take the tallest scroll height on the page and grow the
// viewport to it, which makes a full-page capture show everything.
const total = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight,
  ...[...document.querySelectorAll("#root, #root > *, main")].map((e) => e.scrollHeight + e.getBoundingClientRect().top + window.scrollY)));
await page.setViewportSize({ width: W, height: Math.min(Math.ceil(total), 30000) });
await page.waitForTimeout(800);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const buf = await page.screenshot({ fullPage: true });
await page.close();
// cut the full-page capture into strips by re-rendering it in a page
const p2 = await browser.newPage({ viewport: { width: 100, height: 100 } });
const scale = W < 600 ? 1 : 0.5;
await p2.setContent(`<img id="i" src="data:image/png;base64,${buf.toString("base64")}" style="display:block">`);
await p2.waitForFunction(() => document.getElementById("i").complete);
const n = Math.ceil(total / H);
for (let k = 0; k < n; k++) {
  const y = k * H * scale, h = Math.min(H, total - k * H) * scale;
  await p2.setViewportSize({ width: Math.round(W * scale), height: Math.max(1, Math.round(h)) });
  await p2.evaluate((yy) => window.scrollTo(0, yy), y);
  await p2.screenshot({ path: `${out}-${k}.png` });
}
await browser.close();
console.log(`${n} slices ${out}-0..${n - 1}.png  page=${total}px  overflow=${overflow}px  errors=${errors.length}${errors.length ? " " + errors[0] : ""}`);
