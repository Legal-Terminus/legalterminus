import { test, expect, type Page } from '@playwright/test';

/**
 * #35 — the Portal's sign-up: the password rules tick as they are met, and a
 * weak password or an unticked Terms box stops the form before an account is
 * created. Firebase's sign-up call is answered here ("email already exists"),
 * so no account is ever made.
 */
const STRONG = 'Ab1!efgh';

async function stubSignUp(page: Page) {
  const calls: string[] = [];
  await page.route(/identitytoolkit\.googleapis\.com\/v1\/accounts:signUp/, (route) => {
    calls.push(route.request().url());
    return route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ error: { code: 400, message: 'EMAIL_EXISTS', errors: [{ message: 'EMAIL_EXISTS' }] } }),
    });
  });
  return calls;
}

test.use({ storageState: { cookies: [], origins: [] } });

test('#35 sign-up: rules tick, weak password and missing Terms are refused, then it goes through', async ({ page }) => {
  const calls = await stubSignUp(page);
  await page.goto('signup');
  await page.getByLabel('Full Name').fill('Asha Rao');
  await page.getByLabel('Email').fill(`e2e-signup-${Date.now()}@legalterminus.test`);

  const rules = page.getByRole('list', { name: 'Password must have' });
  await expect(rules.getByRole('listitem')).toHaveCount(5);
  await page.getByRole('textbox', { name: /^Password/ }).fill('abcdef12');
  await expect(rules.locator('[data-rule="length"]')).toContainText('(met)');
  await expect(rules.locator('[data-rule="upper"]')).toContainText('(not yet)');

  await page.getByLabel(/I agree to the/).check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('alert')).toContainText('Use at least 8 characters, with an uppercase letter');

  await page.getByRole('textbox', { name: /^Password/ }).fill(STRONG);
  await page.getByLabel(/I agree to the/).uncheck();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('alert')).toContainText('agree to the Terms & Conditions and Privacy Policy');
  expect(calls).toHaveLength(0);

  await page.getByLabel(/I agree to the/).check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('alert')).toContainText('An account with this email already exists');
  expect(calls).toHaveLength(1);
});

test('#35 the Google button on the sign-in page says what continuing agrees to', async ({ page }) => {
  await page.goto('login');
  await expect(page.getByText(/By continuing with Google you agree to our Terms & Conditions and Privacy Policy/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Terms & Conditions' })).toHaveAttribute('href', '/policies/terms');
});
