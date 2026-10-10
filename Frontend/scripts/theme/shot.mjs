/**
 * Screenshots for the Theme C work (E-25).
 *
 *   node scripts/theme/shot.mjs <baseUrl> <path> <outPrefix> [widths] [selector] [--full]
 *   node scripts/theme/shot.mjs http://localhost:5184 / /tmp/home 1280,390
 *   node scripts/theme/shot.mjs http://localhost:5184 / /tmp/nav 1280 header
 *
 * Without a selector it captures the viewport (or the whole page with --full).
 * With one, it scrolls the first match into view and captures that element.
 * Lazy sections are forced to load by scrolling the page top to bottom first.
 */
import { chromium } from "@playwright/test";

const [base, path, out, widthsArg = "1280,390", selector, flag] = process.argv.slice(2);
const full = selector === "--full" || flag === "--full";
const sel = selector && selector !== "--full" ? selector : null;
const browser = await chromium.launch();
for (const w of widthsArg.split(",").map(Number)) {
  const page = await browser.newPage({ viewport: { width: w, height: w < 600 ? 844 : 800 } });
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const file = `${out}-${w}.png`;
  if (sel) { const el = page.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); await el.screenshot({ path: file }); }
  else await page.screenshot({ path: file, fullPage: full });
  console.log(`${file}  horizontal-overflow=${overflow}px`);
  await page.close();
}
await browser.close();
