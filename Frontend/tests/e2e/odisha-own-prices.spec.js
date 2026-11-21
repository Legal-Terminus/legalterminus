// @ts-check
/* global process */
import { test, expect } from "@playwright/test";

/**
 * #241 (the firm, 21 Nov): the Odisha landing pages are priced on their own.
 * Each sells its own product under Website Prices, so the India pages and the
 * Odisha pages can carry different prices. The hero's "starting from" and the
 * trademark terms quote the live prices too, instead of typed figures.
 *
 * The catalogue is stubbed with DIFFERENT prices for the India and the Odisha
 * products, so each assertion proves which product a page reads. No backend.
 *
 *   npx vite --port 5174   # then
 *   E2E_BASE_URL=http://localhost:5174 npx playwright test odisha-own-prices
 */
const BASE = process.env.E2E_BASE_URL || "";
const plans = (e, en, s, sp) => [
  { id: "elemental", name: "Elemental", price: e, oldPrice: null },
  { id: "enriched", name: "Enriched", price: en, oldPrice: null },
  { id: "supreme", name: "Supreme", price: s, oldPrice: null },
  { id: "supreme-plus", name: "Supreme Plus", price: sp, oldPrice: null },
];
const choice = { label: "User type", options: [
  { id: "proposed", name: "Proposed to be Used", surcharge: 0 },
  { id: "prior-user", name: "Prior User", surcharge: 2500 },
] };
const CATALOG = {
  gstPercent: 18,
  products: {
    "private-limited": { label: "Private Limited Company Registration in India", plans: plans(6111, 9111, 15111, 25111) },
    "private-limited-odisha": { label: "Company Registration in Odisha — landing pages", plans: plans(4444, 7444, 12444, 22444) },
    "trademark-application": { label: "Trademark Registration in India", plans: plans(1611, 4611, 12111, 22111), choice },
    "trademark-application-odisha": { label: "Trademark Registration in Odisha — landing page", plans: plans(1222, 3222, 9222, 19222), choice },
  },
};

test.beforeEach(async ({ page }) => {
  await page.route("**/api/public/pricing", (r) => r.fulfill({ contentType: "application/json", body: JSON.stringify(CATALOG) }));
});

for (const path of ["/company-registration-consultancy-in-odisha", "/company-registration-odisha"]) {
  test(`${path}: the Odisha company prices, on the cards and in the hero`, async ({ page }) => {
    await page.goto(BASE + path);
    await expect(page.locator(".plan-price")).toHaveText(["₹4,444", "₹7,444", "₹12,444", "₹22,444"]);
    await expect(page.locator(".crh-price-text strong")).toHaveText("Company registration starting from ₹4,444");
  });
}

test("the India Private Limited page keeps the India prices", async ({ page }) => {
  await page.goto(BASE + "/setting-up-a-business/profit-making-structures/private-limited-company-registration-in-india");
  await expect(page.locator(".plan-price")).toHaveText(["₹6,111", "₹9,111", "₹15,111", "₹25,111"]);
});

test("/trademark-registration-in-odisha: the Odisha trademark prices on the cards, the hero and the terms", async ({ page }) => {
  await page.goto(BASE + "/trademark-registration-in-odisha");
  await expect(page.locator(".tmark-cards-center .opcplan-price")).toHaveText(["₹1,222", "₹3,222", "₹9,222", "₹19,222"]);
  await expect(page.locator(".crh-price-text strong")).toHaveText("Trademark filing starting from ₹1,222");
  const terms = page.locator(".pvtltd-tc-item", { hasText: "Plan Eligibility" });
  await terms.scrollIntoViewIfNeeded();
  await expect(terms).toContainText("ELEMENTAL (₹1,222)");
  await expect(terms).toContainText("ENRICHED (₹3,222)");
  await expect(terms).toContainText("SUPREME (₹9,222)");
  await expect(terms).toContainText("SUPREME PLUS (₹19,222)");
});

test("the India trademark page keeps the India prices", async ({ page }) => {
  await page.goto(BASE + "/trademark/registration-and-compliance-services/trademark-registration-in-india");
  await expect(page.locator(".tmark-cards-center .opcplan-price")).toHaveText(["₹1,611", "₹4,611", "₹12,111", "₹22,111"]);
});
