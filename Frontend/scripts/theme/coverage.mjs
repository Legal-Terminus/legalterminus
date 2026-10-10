/**
 * Theme C coverage audit (E-25): which sections of which pages has the redesign
 * not reached yet?
 *
 *   node scripts/theme/coverage.mjs <baseUrl> [outJson]     (Theme C must be ON at baseUrl)
 *
 * For every static route in src/App.jsx it finds the page's full-width
 * bands (the innermost elements at least 90% of the viewport wide and 200px
 * tall) and counts, in each, the elements matched by a Theme C rule — any rule
 * scoped under html.theme-c other than the site-wide font rule and the shell.
 * A band with none is still in the old design. Prints one line per route and a
 * tally of the unreached bands by class name, which is the work list.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";

const [base, outJson] = process.argv.slice(2);
// Routes come from App.jsx itself: the list in tests/e2e/all-pages.spec.js has
// drifted, and most of its paths now land on the not-found page.
const app = fs.readFileSync(new URL("../../src/App.jsx", import.meta.url), "utf8");
const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1])
  .filter((p, i, a) => a.indexOf(p) === i && !p.includes(":") && !p.includes("*") && !/my-profile|payment/.test(p));

const browser = await chromium.launch();
const results = [];
for (const path of routes) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  try {
    await page.goto(base + path, { waitUntil: "load", timeout: 60_000 });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});  // /media never idles (video embeds)
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    });
    // Lazy sections can take many seconds on a busy dev server; a page read too
    // early reports no bands at all. Wait until the page has stopped growing.
    let last = -1;
    for (let i = 0; i < 40; i++) {
      const h = await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight); return document.body.scrollHeight + document.querySelectorAll("#root *").length; });
      if (h === last && i > 2) break;
      last = h; await page.waitForTimeout(700);
    }
    const r = await page.evaluate(() => {
      const themed = new Set();
      for (const sheet of document.styleSheets) {
        let rules; try { rules = sheet.cssRules; } catch { continue; }
        const walk = (list) => { for (const rule of list) {
          if (rule.cssRules && !rule.selectorText) { walk(rule.cssRules); continue; }
          const sel = rule.selectorText;
          if (!sel || !sel.includes("html.theme-c") || sel.includes(":where(") || sel.trim() === "html.theme-c") continue;
          if (/^html\.theme-c\s+(body|\*|:focus-visible)/.test(sel)) continue;
          try { document.querySelectorAll(sel).forEach((e) => themed.add(e)); } catch { /* unsupported selector */ }
        } };
        walk(rules);
      }
      const vw = window.innerWidth;
      const big = (e) => { const b = e.getBoundingClientRect(); return b.width >= vw * 0.9 && b.height >= 200; };
      const shell = (e) => e.closest("header, footer, nav, .header-wrapper, .premium-footer, .premium-drawer, .premium-drawer-overlay, .float-icons, .page-loader");
      const bands = [...document.querySelectorAll("#root *")].filter((e) => big(e) && !shell(e) && ![...e.children].some(big));
      return bands.map((b) => {
        const all = b.querySelectorAll("*");
        let n = themed.has(b) ? 1 : 0; all.forEach((e) => { if (themed.has(e)) n++; });
        const name = (b.className && typeof b.className === "string" ? b.className.trim().split(/\s+/)[0] : "") || b.id || b.tagName.toLowerCase();
        return { name, themed: n, elements: all.length, height: Math.round(b.getBoundingClientRect().height) };
      });
    });
    results.push({ path, bands: r });
  } catch (err) { results.push({ path, error: String(err).slice(0, 120), bands: [] }); }
  await page.close();
}
await browser.close();

const tally = new Map(); let total = 0, bare = 0;
for (const { path, bands, error } of results) {
  const un = bands.filter((b) => b.themed === 0);
  total += bands.length; bare += un.length;
  for (const b of un) tally.set(b.name, [...(tally.get(b.name) || []), path]);
  console.log(`${String(bands.length - un.length).padStart(2)}/${String(bands.length).padEnd(2)} ${path}${error ? "  ERROR " + error : un.length ? "   ✗ " + un.map((b) => b.name).join(", ") : ""}`);
}
console.log(`\n${total - bare} of ${total} bands reached on ${results.length} routes; ${results.filter((r) => r.bands.length && r.bands.every((b) => b.themed > 0)).length} routes fully reached.`);
console.log("\nUnreached bands by class (count × pages):");
for (const [name, paths] of [...tally].sort((a, b) => b[1].length - a[1].length).slice(0, 80)) console.log(`${String(paths.length).padStart(3)}  ${name}`);
if (outJson) fs.writeFileSync(outJson, JSON.stringify(results, null, 1));
