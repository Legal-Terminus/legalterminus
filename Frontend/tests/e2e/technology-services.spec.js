// @ts-check
/* global document */
import { test, expect } from "@playwright/test";

/**
 * Technology Services (/technology-services) — software development sold by
 * Legal Terminus and delivered by Infynia Labs. Two catalogue plans that check
 * out like every other product, and a custom Supreme plan priced on request.
 *
 * Prices are not asserted: the firm sets them under Website Prices. Buy Now is
 * only on builds with payments switched on (QA), so the checkout test skips
 * itself on a build without them.
 *
 *   E2E_BASE_URL=http://localhost:5174 npx playwright test technology-services
 */
const BASE = process.env.E2E_BASE_URL || "";
const PATH = "/technology-services";

test("the main menu links to Technology Services", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + "/");
  const link = page.locator('a.nav-link[href="/technology-services"]');
  await expect(link).toHaveText("Technology Services", { timeout: 15_000 });
  await link.click();
  await expect(page.locator("h1")).toHaveText("Technology Services For Your New Business");
});

test("the menu item is not bold; only Home is", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + "/");
  const tech = page.locator('a.nav-link[href="/technology-services"]');
  await expect(tech).toBeVisible({ timeout: 15_000 });
  const weight = (l) => l.evaluate((el) => Number(getComputedStyle(el).fontWeight));
  expect(await weight(page.locator('a.nav-link[href="/"]'))).toBe(700);
  expect(await weight(tech)).toBeLessThan(700);
});

test("the footer's Service Links include Technology Services", async ({ page }) => {
  await page.goto(BASE + "/");
  const link = page.locator('footer a[href="/technology-services"]');
  await link.scrollIntoViewIfNeeded({ timeout: 15_000 });
  await expect(link).toHaveText(/Technology Services/);
});

test("the home page has a Technology Services tile above PDF tools", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + "/");
  const tile = page.locator("section.hpt-cta--tech");
  await expect(tile.locator("h2")).toHaveText("Technology Services for Your Business", { timeout: 15_000 });
  // the tile comes straight before the PDF tools tile
  await expect(tile.locator("xpath=following-sibling::section[1]")).toContainText("All-in-One PDF Tools");
  await tile.getByRole("link", { name: /Explore Technology Services/ }).click();
  await expect(page).toHaveURL(/\/technology-services$/);
});

test("three plans; Supreme is custom and asks for a quote", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + PATH);
  const cards = page.locator("#plans .Add-pp-card");
  await expect(cards.locator(".Add-pp-name")).toHaveText(["Elemental", "Enriched", "Supreme"], { timeout: 15_000 });
  for (const i of [0, 1]) await expect(cards.nth(i).locator(".Add-pp-price")).toHaveText(/^[\d,]+$/);
  const supreme = cards.nth(2);
  await expect(supreme.locator(".Add-pp-price")).toHaveText("Custom");
  await expect(supreme.locator(".Add-pp-meta")).toHaveText("Pricing on request");
  await supreme.getByRole("button", { name: "Request a Quote" }).click();
  await expect(page.locator(".cf-title").last()).toBeVisible();
});

test("Buy Now opens the checkout with the plan and GST", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + PATH);
  await expect(page.locator("#plans .Add-pp-card")).toHaveCount(3, { timeout: 15_000 });
  const buy = page.getByRole("button", { name: "Buy Now" });
  test.skip((await buy.count()) === 0, "payments are switched off in this build");
  await expect(buy).toHaveCount(2); // never on the custom plan
  await buy.first().click();
  await expect(page.getByText("Elemental Plan").first()).toBeVisible();
  await expect(page.getByText("GST (18%)")).toBeVisible();
});

// #243: the firm does not want this page to send visitors to infynialabs.com for
// the portfolio. "Request Portfolio" opens the consultation form instead, and the
// lead says what was asked for.
test("Request Portfolio opens the form and never leaves the site", async ({ page, context }) => {
  let lead = null;
  await page.route("**/api/contact", async (route) => {
    lead = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"success":true}' });
  });
  let newTabs = 0;
  context.on("page", () => { newTabs += 1; });

  await page.goto(BASE + PATH);
  await expect(page.getByText("View Portfolio")).toHaveCount(0);
  await expect(page.locator('a[href*="infynialabs.com/#work"]')).toHaveCount(0);

  const button = page.getByRole("button", { name: "Request Portfolio" });
  await button.scrollIntoViewIfNeeded();
  await button.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Request Portfolio" })).toBeVisible();
  expect(page.url()).toContain(PATH);

  await dialog.getByPlaceholder("Full Name *").fill("Test Visitor");
  await dialog.getByPlaceholder("Email Address *").fill("visitor@example.com");
  await dialog.getByPlaceholder(/Mobile Number/).fill("9876543210");
  await dialog.locator('select[name="state"]').selectOption({ index: 1 });
  await dialog.getByRole("button", { name: "Request Portfolio" }).click();

  await expect.poll(() => lead).not.toBeNull();
  expect(lead.subject).toBe("Portfolio request – technology-services");
  expect(lead.message).toMatch(/^Portfolio request\./);
  expect(lead.source).toBe("technology-services");
  expect(newTabs).toBe(0);
});

test("the in-text portfolio link asks for the portfolio too; infynialabs.com stays a plain link", async ({ page }) => {
  await page.goto(BASE + PATH);
  const link = page.getByRole("button", { name: "request the portfolio" });
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Request Portfolio" })).toBeVisible();
  await expect(page.getByRole("link", { name: "infynialabs.com", exact: true })).toHaveAttribute("href", "https://infynialabs.com/");
});

test("the page fits a phone", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(BASE + PATH);
  await expect(page.locator("#plans .Add-pp-card")).toHaveCount(3, { timeout: 15_000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
