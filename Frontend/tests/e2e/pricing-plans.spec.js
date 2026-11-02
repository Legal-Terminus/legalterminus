// @ts-check
/* global document */
import { test, expect } from "@playwright/test";

/**
 * #209, the firm on 2 Nov: OPC and Trademark Registration get a fourth plan,
 * "Supreme Plus", as Private Limited has. The Odisha trademark page sells the
 * same product, so it shows the same four.
 *
 *   E2E_BASE_URL=http://localhost:5184 npx playwright test pricing-plans
 */
const BASE = process.env.E2E_BASE_URL || "";
const PAGES = [
  { name: "OPC", path: "/setting-up-a-business/profit-making-structures/one-person-company-registration-in-india", plus: "₹24,999" },
  { name: "Trademark", path: "/trademark/registration-and-compliance-services/trademark-registration-in-india", plus: "₹21,999" },
  { name: "Trademark Odisha", path: "/trademark-registration-in-odisha", plus: "₹21,999" },
];

for (const p of PAGES) {
  test(`${p.name}: four plans, Supreme Plus last, in one row on desktop`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE + p.path);
    const names = page.locator(".opcplan-card .opcplan-name");
    await expect(names).toHaveText(["Elemental", "Enriched", "Supreme", "Supreme Plus"], { timeout: 15_000 });
    await expect(page.locator(".opcplan-card").last().locator(".opcplan-price")).toHaveText(p.plus);
    const tops = await page.locator(".opcplan-card").evaluateAll((cards) => cards.map((c) => Math.round(c.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
  });

  test(`${p.name}: four plans fit a phone`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(BASE + p.path);
    await expect(page.locator(".opcplan-card")).toHaveCount(4, { timeout: 15_000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}
