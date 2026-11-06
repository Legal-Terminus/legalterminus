// @ts-check
import { test, expect } from "@playwright/test";

/**
 * #221 — the trademark page asks "Proposed to be Used" or "Prior User" above
 * its plans. Nothing is chosen at first; Buy Now asks for a choice; Prior User
 * adds its surcharge to every card at once; the checkout and the cart keep the
 * choice. What is CHARGED is the server's (backend unit tests, Portal
 * pricing.spec); this spec covers the page.
 *
 * Buy Now and the cart show only when payments are on (VITE_PAYMENTS_ENABLED=
 * true, the QA build), so the spec skips against a build without them. The
 * catalogue is stubbed, so it needs no backend.
 *
 *   VITE_PAYMENTS_ENABLED=true npx vite --port 5174   # then
 *   E2E_BASE_URL=http://localhost:5174 npx playwright test trademark-user-type
 */
const BASE = process.env.E2E_BASE_URL || "";
const PAGE = "/trademark/registration-and-compliance-services/trademark-registration-in-india";
const CATALOG = {
  gstPercent: 18,
  products: {
    "trademark-application": {
      label: "Trademark Registration in India",
      plans: [
        { id: "elemental", name: "Elemental", price: 1499, oldPrice: 2249 },
        { id: "enriched", name: "Enriched", price: 4499, oldPrice: 9999 },
        { id: "supreme", name: "Supreme", price: 11999, oldPrice: 22499 },
        { id: "supreme-plus", name: "Supreme Plus", price: 21999, oldPrice: 32499 },
      ],
      // A surcharge the firm changed, so the test proves it comes from the catalogue.
      choice: { label: "User type", options: [
        { id: "proposed", name: "Proposed to be Used", surcharge: 0 },
        { id: "prior-user", name: "Prior User", surcharge: 3000 },
      ] },
    },
  },
};

test.beforeEach(async ({ page }) => {
  await page.route("**/api/public/pricing", (r) => r.fulfill({ contentType: "application/json", body: JSON.stringify(CATALOG) }));
});

const prices = (page) => page.locator(".tmark-cards-center .opcplan-price").allTextContents();

test("nothing is chosen at first; Prior User reprices every card; Buy Now asks first", async ({ page }) => {
  await page.goto(BASE + PAGE);
  const question = page.getByRole("group", { name: /Choose your user type/ });
  await expect(question).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("radio", { name: /Proposed to be Used/ })).not.toBeChecked();
  await expect(page.getByRole("radio", { name: /Prior User/ })).not.toBeChecked();
  await expect.poll(() => prices(page)).toEqual(["₹1,499", "₹4,499", "₹11,999", "₹21,999"]);

  const buy = page.getByRole("button", { name: "Buy Now" });
  test.skip((await buy.count()) === 0, "payments are off in this build");
  await buy.first().click();
  await expect(question.getByRole("alert")).toContainText("Please choose Proposed to be Used or Prior User");
  await expect(page.locator(".pco-modal")).toHaveCount(0);

  await page.getByRole("radio", { name: /Prior User/ }).check();
  await expect(question.getByRole("alert")).toHaveCount(0);
  await expect.poll(() => prices(page)).toEqual(["₹4,499", "₹7,499", "₹14,999", "₹24,999"]);
  await expect(page.getByText("Includes ₹3,000 for Prior User").first()).toBeVisible();

  await page.getByRole("radio", { name: /Proposed to be Used/ }).check();
  await expect.poll(() => prices(page)).toEqual(["₹1,499", "₹4,499", "₹11,999", "₹21,999"]);
});

test("the checkout shows the choice and its price; Add to Cart keeps it", async ({ page }) => {
  await page.goto(BASE + PAGE);
  await expect(page.getByRole("group", { name: /Choose your user type/ })).toBeVisible({ timeout: 15_000 });
  const buy = page.getByRole("button", { name: "Buy Now" });
  test.skip((await buy.count()) === 0, "payments are off in this build");
  await page.getByRole("radio", { name: /Prior User/ }).check();
  await buy.nth(2).click(); // Supreme

  const modal = page.locator(".pco-modal");
  await expect(modal).toContainText("User type: Prior User");
  // 11,999 + 3,000 = 14,999; GST 2,699.82; total 17,698.82.
  await expect(modal.locator(".pco-summary-box")).toContainText("Supreme Plan (Prior User)");
  await expect(modal.locator(".pco-total-amount")).toHaveText("₹17,698.82");

  await modal.getByRole("button", { name: "Add to Cart" }).click();
  await expect(modal.getByRole("status")).toContainText("Added to your cart.");
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("lt-cart-v1") || "[]"));
  expect(stored[0]).toMatchObject({ productKey: "trademark-application", planId: "supreme", optionId: "prior-user", price: 11999 });

  await page.goto(BASE + "/cart");
  const choice = page.getByLabel("User type for Trademark Registration in India");
  await expect(choice).toHaveValue("prior-user");
  const summary = page.getByRole("complementary", { name: "Order summary" });
  await expect(summary).toContainText("₹17,698.82");
  // Changing the answer in the cart reprices the line.
  await choice.selectOption("proposed");
  await expect(summary).toContainText("₹14,158.82"); // 11,999 + 18% GST
});

test("a cart line with no answer must be answered before paying", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("lt-cart-v1", JSON.stringify([
    { productKey: "trademark-application", planId: "elemental", label: "Trademark", planName: "Elemental", price: 1499 }])));
  await page.goto(BASE + "/cart");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15_000 });
  test.skip(await page.getByText("Online payment is not available yet").isVisible(), "payments are off in this build");
  await expect(page.getByRole("alert")).toContainText("Choose Proposed to be Used or Prior User");
  const pay = page.getByRole("button", { name: /Checkout · pay/ });
  await expect(pay).toBeDisabled();
  await page.getByLabel("User type for Trademark Registration in India").selectOption("prior-user");
  await expect(pay).toBeEnabled();
  await expect(page.getByRole("complementary", { name: "Order summary" })).toContainText("₹5,308.82"); // (1,499 + 3,000) × 1.18
});

test("phone: the question stacks above the cards with no sideways scroll", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(BASE + PAGE);
  const question = page.getByRole("group", { name: /Choose your user type/ });
  await expect(question).toBeVisible({ timeout: 15_000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  for (const r of await page.locator(".plan-choice-option").all()) {
    const box = await r.boundingBox();
    expect(box && box.height >= 44).toBe(true);
  }
});
