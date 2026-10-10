// @ts-check
/* global process */
import { test, expect } from "@playwright/test";
import fs from "node:fs";

/**
 * Every static route the app actually defines, read from src/App.jsx.
 *
 * Why this exists beside all-pages.spec.js and the chunk-NN specs: those carry
 * a hand-written list of 73 short paths (/llp, /trust, /gst-registration…) from
 * before the site moved to its long SEO addresses. Most of them now render the
 * not-found page, which has a navbar and text and so PASSES every assertion
 * there. A list that can drift tests nothing; this one cannot drift.
 *
 * Asserts per route: it is a real page (not the not-found screen), it has
 * content, no JS error, no error text, the navbar where the page has one — and
 * no horizontal scroll on a phone, which is the usual casualty of a restyle.
 *
 *   E2E_BASE_URL=http://localhost:5184 npx playwright test all-routes
 */
const app = fs.readFileSync(new URL("../../src/App.jsx", import.meta.url), "utf8");
const ROUTES = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1])
  .filter((p, i, a) => a.indexOf(p) === i)
  // dynamic, catch-all, signed-in only, or meaningless without query parameters
  .filter((p) => !p.includes(":") && !p.includes("*") && !/my-profile|payment\/result/.test(p));

// Landing pages that hide the site header by design (STANDALONE_LANDING_ROUTES in App.jsx).
const standalone = app.match(/STANDALONE_LANDING_ROUTES\s*=\s*\[([^\]]*)\]/)?.[1] ?? "";
const STANDALONE = [...standalone.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const ERROR_PATTERNS = [/something went wrong/i, /application error/i, /unexpected error/i, /cannot read propert/i, /is not defined/i, /loading chunk/i];

test.use({ baseURL: process.env.E2E_BASE_URL ?? "http://localhost:5174" });

test("the route list was read from App.jsx", () => {
  expect(ROUTES.length, "no routes parsed — has App.jsx changed shape?").toBeGreaterThan(60);
});

for (const path of ROUTES) {
  test(`${path} — a real page, with content, no errors, no sideways scroll on a phone`, async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status() ?? 200, `HTTP error on ${path}`).toBeLessThan(400);
    await page.waitForLoadState("load");
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    await expect(page.locator(".lt-nf"), `${path} renders the not-found page`).toHaveCount(0);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.trim().length, `Page body is empty on ${path}`).toBeGreaterThan(50);

    const html = await page.content();
    for (const pattern of ERROR_PATTERNS) expect(pattern.test(html), `"${pattern}" found on ${path}`).toBe(false);

    if (!STANDALONE.includes(path)) await expect(page.locator("nav").first(), `Navbar missing on ${path}`).toBeVisible();

    expect(jsErrors, `JS errors on ${path}: ${jsErrors.join("; ")}`).toHaveLength(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${path} scrolls sideways by ${overflow}px at 390px wide`).toBeLessThanOrEqual(1);
  });
}
