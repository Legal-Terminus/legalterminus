// @ts-check
import { test, expect } from "@playwright/test";

/**
 * #244, the cart's layout: the services on the left and a sticky order summary
 * on the right on desktop, one column on a phone. A plan change reprices the
 * line and the total; Remove takes the line out.
 *
 * The cart shows only when payments are on (VITE_PAYMENTS_ENABLED=true, the QA
 * build), so the spec skips against a build without them. The catalogue is
 * stubbed, so it needs no backend.
 *
 *   VITE_PAYMENTS_ENABLED=true npx vite --port 5174   # then
 *   E2E_BASE_URL=http://localhost:5174 npx playwright test cart
 */
const BASE = process.env.E2E_BASE_URL || "";
const CATALOG = {
  gstPercent: 18,
  products: {
    "private-limited": {
      label: "Private Limited Company Registration in India",
      plans: [
        { id: "elemental", name: "Elemental", price: 5999, oldPrice: 7999 },
        { id: "enriched", name: "Enriched", price: 9499, oldPrice: 13999 },
      ],
    },
    "gst-registration": {
      label: "GST Registration in India",
      plans: [{ id: "supreme", name: "SUPREME", price: 7999 }],
    },
  },
};
const CART = [
  { productKey: "private-limited", planId: "enriched", label: "Private Limited", planName: "Enriched", price: 9499 },
  { productKey: "gst-registration", planId: "supreme", label: "GST", planName: "Supreme", price: 7999 },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/api/public/pricing", (r) => r.fulfill({ contentType: "application/json", body: JSON.stringify(CATALOG) }));
  await page.addInitScript((c) => {
    if (!sessionStorage.getItem("cart-seeded")) {
      localStorage.setItem("lt-cart-v1", JSON.stringify(c));
      sessionStorage.setItem("cart-seeded", "1");
    }
  }, CART);
});

async function openCart(page) {
  await page.goto(BASE + "/cart");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15_000 });
  test.skip(await page.getByText("Online payment is not available yet").isVisible(), "payments are off in this build");
}

test("desktop: the services beside a sticky order summary, priced from the catalogue", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openCart(page);
  const summary = page.getByRole("complementary", { name: "Order summary" });
  const items = page.getByRole("region", { name: "Services in your cart" });
  const [s, i] = [await summary.boundingBox(), await items.boundingBox()];
  expect(s && i && s.x > i.x + i.width - 1).toBe(true);
  expect(await summary.evaluate((el) => getComputedStyle(el).position)).toBe("sticky");

  // 9,499 + 7,999 = 17,498; GST 3,149.64; total 20,647.64; saved 13,999 - 9,499.
  await expect(summary).toContainText("₹17,498");
  await expect(summary).toContainText("₹20,647.64");
  await expect(summary).toContainText("You save ₹4,500");
  await expect(page.getByRole("button", { name: /Checkout · pay ₹20,647.64/ })).toBeEnabled();
  // left-aligned, although the site centres h2 everywhere else
  for (const h of await page.locator(".cart-line-name, .cart-summary-title").all()) {
    expect(await h.evaluate((el) => getComputedStyle(el).textAlign)).toBe("left");
  }
  // a plan named in capitals reads as a word
  await expect(page.locator(".cart-plan-text")).toContainText("Supreme");
});

test("changing a plan reprices the cart; Remove takes a service out", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openCart(page);
  await page.getByLabel("Plan for Private Limited Company Registration in India").selectOption("elemental");
  const summary = page.getByRole("complementary", { name: "Order summary" });
  await expect(summary).toContainText("₹13,998");

  await page.getByRole("button", { name: "Remove GST Registration in India from your cart" }).click();
  await expect(page.locator(".cart-line")).toHaveCount(1);
  await expect(summary).toContainText("Price (1 service)");

  await page.getByRole("button", { name: /Remove Private Limited/ }).click();
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
});

test("phone: one column, no sideways scroll", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openCart(page);
  await expect(page.locator(".cart-line")).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const summary = await page.getByRole("complementary", { name: "Order summary" }).boundingBox();
  const items = await page.getByRole("region", { name: "Services in your cart" }).boundingBox();
  expect(summary && items && summary.y > items.y + items.height - 1).toBe(true);
});

// #256: a coupon code is applied at checkout (the server checks and prices it);
// the cart only says so, and its total stays the price without a code.
test("the summary says a coupon code is applied at checkout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openCart(page);
  const summary = page.getByRole("complementary", { name: "Order summary" });
  await expect(summary).toContainText("Have a coupon code? You can apply it at checkout.");
  await expect(page.getByRole("button", { name: /Checkout · pay ₹20,647.64/ })).toBeEnabled();
});

test("an amount with paise shows two decimals (₹299.80, not ₹299.8)", async ({ page }) => {
  await page.route("**/api/public/pricing", (r) => r.fulfill({ contentType: "application/json", body: JSON.stringify({
    gstPercent: 18, products: { "gst-registration": { label: "GST Registration in India", plans: [{ id: "supreme", name: "Supreme", price: 1010 }] } },
  }) }));
  await page.addInitScript(() => localStorage.setItem("lt-cart-v1", JSON.stringify([
    { productKey: "gst-registration", planId: "supreme", label: "GST", planName: "Supreme", price: 1010 }])));
  await openCart(page);
  // 18% of 1,010 is 181.80
  await expect(page.locator(".cart-line-gst")).toHaveText("+ ₹181.80 GST");
});
