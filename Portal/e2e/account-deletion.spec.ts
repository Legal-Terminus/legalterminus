import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';
import { apiAs, apiAsCredentials, deleteUser, signUpWithPassword } from './api';

/**
 * E29-S08 — a person asks, from the app or the website, for their account to be deleted
 * (App Store 5.1.1(v), Play's Data safety answer). The request disables the sign-in,
 * marks the profile and tells the admins; an admin completes it with the existing delete.
 *
 * The person is a throwaway client made here — never the seeded qa-client, whose account
 * every other spec signs in with and which this flow would disable for good.
 */

const stamp = Date.now();
const email = `e2e-delete-${stamp}@legalterminus.test`;
const password = `Lt-e2e-${stamp}aA1!`;
let uid = '';

test.beforeAll(async () => {
  await signUpWithPassword(email, password);
  const api = await apiAsCredentials(email, password);
  const res = await api.post('/api/auth/register', { data: { fullName: `E2E Leaver ${stamp}`, provider: 'email' } });
  expect(res.ok()).toBeTruthy();
  uid = (await res.json()).user.uid;
  await api.dispose();
});

test.afterAll(async () => {
  // The admin's delete completes the request (and cleans up if a step failed).
  await deleteUser(uid);
});

async function signIn(page: Page, who: string, pw: string) {
  await page.goto('login');
  await page.locator('input[type="email"]').fill(who);
  await page.locator('input[type="password"]').fill(pw);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

test('a client asks for deletion, is signed out and cannot sign in again; admin sees it', async ({ browser, adminPage }) => {
  // Keep a token from before the request, to prove the repeat is idempotent.
  const before = await apiAsCredentials(email, password);

  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await signIn(page, email, password);
  await page.waitForURL((u) => !/\/login/.test(u.pathname), { timeout: 60_000 });

  // The account menu offers it to a client.
  await page.getByRole('button', { name: /E2E Leaver|e2e-delete/ }).first().click();
  await page.getByRole('link', { name: 'Delete my account' }).click();
  await expect(page.getByRole('heading', { name: 'Delete my account' })).toBeVisible();

  const send = page.getByRole('button', { name: 'Delete my account' });
  await expect(send).toBeDisabled(); // nothing happens until the person confirms
  await page.getByLabel('Reason (optional)').fill('E2E: closing the company');
  await page.getByLabel(/I understand/).check();
  await send.click();

  await page.waitForURL(/\/login\?notice=deletion-requested/, { timeout: 30_000 });
  await expect(page.getByText('Your deletion request was received.')).toBeVisible();

  // Disabled: the friendly sentence, never a Firebase code.
  await signIn(page, email, password);
  await expect(page.getByText('This account has been disabled. Contact your firm.')).toBeVisible({ timeout: 30_000 });
  await ctx.close();

  // A repeat is accepted and changes nothing (no second email).
  const again = await before.post('/api/auth/me/deletion-request', { data: {} });
  expect(again.status()).toBe(202);
  await before.dispose();

  // The admin sees who asked.
  await adminPage.goto('users');
  await adminPage.getByRole('button', { name: /Deletion requested/ }).click();
  await expect(adminPage.getByText(`E2E Leaver ${stamp}`).first()).toBeVisible();
  await expect(adminPage.locator('.badge', { hasText: 'Deletion requested' }).first()).toBeVisible();
});

test('an admin cannot ask (403) and is not offered the page', async ({ adminPage }) => {
  const api = await apiAs('admin');
  const res = await api.post('/api/auth/me/deletion-request', { data: {} });
  expect(res.status()).toBe(403);
  await api.dispose();

  await adminPage.goto('dashboard');
  await adminPage.locator('header button').last().click();
  await expect(adminPage.getByRole('link', { name: 'Delete my account' })).toHaveCount(0);
});

test('the request accepts only a reason', async () => {
  const api = await apiAs('client');
  // Validation runs before anything is written, so the seeded client is untouched.
  const res = await api.post('/api/auth/me/deletion-request', { data: { uid: 'someone-else' } });
  expect(res.status()).toBe(400);
  await api.dispose();
});
