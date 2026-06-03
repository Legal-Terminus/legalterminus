// @ts-check
import { test, expect } from "@playwright/test";

/**
 * Test chunk 7: Pages 31-35 (from all-pages.spec.js)
 */
const ROUTES = [
  { path: "/epf-return", label: "EPF Return" },
  { path: "/esi-return", label: "ESI Return" },
  { path: "/professional-tax-return", label: "Professional Tax Return" },
  { path: "/iec", label: "IEC" },
  { path: "/food-license", label: "Food License" },
];

const ERROR_PATTERNS = [
  /something went wrong/i,
  /application error/i,
  /unexpected error/i,
  /cannot read propert/i,
  /is not defined/i,
  /loading chunk/i,
];

const MAX_LOAD_TIME_MS = 2000;

for (const { path, label } of ROUTES) {
  test(`[${label}] ${path} — loads with visible content`, async ({ page }) => {
    const consoleErrors = [];
    const jsErrors = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => jsErrors.push(err.message));

    const navigationStartTime = Date.now();
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    const domContentLoadedTime = Date.now() - navigationStartTime;

    expect(response?.status() ?? 200, `HTTP error on ${path}`).toBeLessThan(400);

    await page.waitForLoadState("load");
    const fullLoadTime = Date.now() - navigationStartTime;

    expect(
      fullLoadTime,
      `⚠️ PERF: Page load took ${fullLoadTime}ms (threshold: ${MAX_LOAD_TIME_MS}ms) on ${path}`
    ).toBeLessThanOrEqual(MAX_LOAD_TIME_MS);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.trim().length, `Page body is empty on ${path}`).toBeGreaterThan(50);

    const pageContent = await page.content();
    for (const pattern of ERROR_PATTERNS) {
      expect(
        pattern.test(pageContent),
        `Error pattern "${pattern}" found in page content of ${path}`
      ).toBe(false);
    }

    await expect(page.locator("nav").first(), `Navbar missing on ${path}`).toBeVisible();

    expect(jsErrors, `JS errors on ${path}: ${jsErrors.join("; ")}`).toHaveLength(0);

    test.info().annotations.push({
      type: "Load Time",
      description: `DCL: ${domContentLoadedTime}ms | Full Load: ${fullLoadTime}ms`,
    });

    if (consoleErrors.length) {
      test.info().annotations.push({
        type: "Console Errors",
        description: consoleErrors.slice(0, 5).join("\n"),
      });
    }
  });
}
