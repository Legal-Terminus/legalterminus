// @ts-check
/* global process */
import { test, expect } from "@playwright/test";

/**
 * #35, sign-up: the password rules tick as they are met, a weak password or an
 * unticked Terms box stops the form before any account is created, and the
 * Google button says what choosing it agrees to.
 *
 * No account is ever created: Firebase's sign-up call is answered here with
 * "email already exists", which is enough to prove the form let it through.
 *
 *   npx vite --port 5174   # then
 *   E2E_BASE_URL=http://localhost:5174 npx playwright test signup
 */
const BASE = process.env.E2E_BASE_URL || "";
const STRONG = "Ab1!efgh";

/** Count Firebase sign-up calls, answering each as "email already in use". */
async function stubSignUp(page) {
  const calls = [];
  await page.route(/identitytoolkit\.googleapis\.com\/v1\/accounts:signUp/, (route) => {
    calls.push(route.request().url());
    return route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: { code: 400, message: "EMAIL_EXISTS", errors: [{ message: "EMAIL_EXISTS" }] } }),
    });
  });
  return calls;
}

async function fillForm(page, password) {
  await page.getByLabel("Full Name").fill("Asha Rao");
  await page.getByLabel("Email Address").fill(`e2e-signup-${Date.now()}@legalterminus.test`);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("textbox", { name: "Confirm Password" }).fill(password);
}

test("the password rules tick as they are met", async ({ page }) => {
  await page.goto(BASE + "/signup");
  const rules = page.getByRole("list", { name: "Password must have" });
  await expect(rules.getByRole("listitem")).toHaveText([
    /At least 8 characters/, /One uppercase letter/, /One lowercase letter/, /One number/, /One special character/,
  ]);
  await expect(rules.locator("li.met")).toHaveCount(0);

  await page.getByLabel("Password", { exact: true }).fill("abc");
  await expect(rules.locator("li.met")).toHaveCount(1);
  await expect(rules.locator('[data-rule="lower"]')).toContainText("(met)");
  await expect(rules.locator('[data-rule="upper"]')).toContainText("(not yet)");

  await page.getByLabel("Password", { exact: true }).fill(STRONG);
  await expect(rules.locator("li.met")).toHaveCount(5);
});

test("a weak password is refused before any account is created", async ({ page }) => {
  const calls = await stubSignUp(page);
  await page.goto(BASE + "/signup");
  await fillForm(page, "abcdef12");
  await page.getByLabel(/I agree to the/).check();
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page.getByText(/Use at least 8 characters, with an uppercase letter/)).toBeVisible();
  expect(calls).toHaveLength(0);
});

test("the Terms box must be ticked, then the form goes through", async ({ page }) => {
  const calls = await stubSignUp(page);
  await page.goto(BASE + "/signup");
  await fillForm(page, STRONG);
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page.getByRole("alert")).toHaveText(/agree to the Terms & Conditions and Privacy Policy/);
  expect(calls).toHaveLength(0);

  await expect(page.getByRole("link", { name: "Terms & Conditions" }).first()).toHaveAttribute("href", "/policies/terms");
  await expect(page.getByRole("link", { name: "Privacy Policy" }).first()).toHaveAttribute("href", "/policies/privacy");

  await page.getByLabel(/I agree to the/).check();
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page.getByText("Email already in use")).toBeVisible();
  expect(calls).toHaveLength(1);
});

test("the Google buttons say what continuing agrees to", async ({ page }) => {
  for (const path of ["/signup", "/login"]) {
    await page.goto(BASE + path);
    await expect(page.getByText(/By continuing with Google you agree to our Terms & Conditions and Privacy Policy/)).toBeVisible();
  }
});

test("sign-up fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(BASE + "/signup");
  await page.getByLabel("Password", { exact: true }).fill("a");
  await expect(page.getByRole("list", { name: "Password must have" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const box = await page.getByLabel(/I agree to the/).boundingBox();
  expect(box).not.toBeNull();
});
