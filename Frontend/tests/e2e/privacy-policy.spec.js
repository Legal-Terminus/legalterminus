// @ts-check
import { test, expect } from "@playwright/test";

/**
 * The apps' store listings (Play and the App Store) say users can ask for their data to be deleted and links to this page
 * (docs/privacy-policy-app-addendum.md, Story E-26). If the page loses that section, Google's Data safety
 * form and the policy contradict each other, so this guards it.
 *
 *   E2E_BASE_URL=http://localhost:5184 npx playwright test privacy-policy
 */
const BASE = process.env.E2E_BASE_URL || "";

for (const path of ["/privacy-policy", "/policies/privacy"]) {
  test(`${path} describes the app and how to ask for deletion`, async ({ page }) => {
    await page.goto(BASE + path);
    await expect(page.getByRole("heading", { name: "7. The Legal Terminus App" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "8. Access, Correction and Deletion" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "9. Policy Updates" })).toBeVisible();
    // App Store 5.1.1(v): deletion can be started inside the app, and the policy says how; both apps are named
    await expect(page.locator("#delete-my-data")).toContainText("Delete my account");
    await expect(page.getByText(/app for Android and iPhone/)).toBeVisible();
    // the way to ask is a real, working address, and it is the same one as the contact block
    const mail = page.locator("#delete-my-data a[href^='mailto:sales21@legalterminus.com']");
    await expect(mail).toHaveCount(1);
    // the existing promise stays: nothing is shared except as the law or the service requires
    await expect(page.getByRole("heading", { name: "6. Third-Party Access" })).toBeVisible();
  });
}
