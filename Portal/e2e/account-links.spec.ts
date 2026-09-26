import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from './fixtures';
import { request, type Browser, type Page } from '@playwright/test';
import { apiAs, createThrowawayStaff, deleteUser } from './api';
import { env } from './helpers';

/**
 * #203 — account links land in the portal, not on Firebase's hosted page.
 *
 * A client's first email used to open `<project>.firebaseapp.com`, titled
 * "Reset your password" for an account they never had, and left them there.
 * These tests open REAL links (minted by the backend's own link service via
 * scripts/e2e-account-link.js) in a signed-out browser and check the person
 * ends up inside the portal.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND = path.resolve(__dirname, '../../backend');

function mintLink(kind: 'password' | 'signin', email: string, intent = 'setup'): string {
  const out = execFileSync('node', ['scripts/e2e-account-link.js', kind, email, intent], {
    cwd: BACKEND, encoding: 'utf8',
  });
  const line = out.split('\n').find((l) => l.startsWith('LINK='));
  if (!line) throw new Error(`no link printed:\n${out}`);
  return line.slice('LINK='.length).trim();
}

/**
 * Open an emailed link on the portal UNDER TEST. The link's host is the
 * configured site (FRONTEND_URL), which in local dev can be a different port
 * from the portal Playwright is driving; its path and query are what matter.
 */
const openLink = (page: Page, link: string) => {
  const u = new URL(link);
  return page.goto(`${u.pathname}${u.search}`);
};

async function signedOutPage(browser: Browser): Promise<Page> {
  const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  return ctx.newPage();
}

test.describe('#203 account links', () => {
  test('the emailed link is on the portal domain and carries no API key', async () => {
    const staff = await createThrowawayStaff();
    try {
      const link = mintLink('password', staff.email);
      expect(link).toMatch(/\/portal\/account\/action\?mode=resetPassword&oobCode=[^&]+&intent=setup$/);
      expect(link).not.toMatch(/firebaseapp|apiKey/);
    } finally {
      await deleteUser(staff.uid);
    }
  });

  test('first-time setup: create a password and land in the portal', async ({ browser }) => {
    const staff = await createThrowawayStaff();
    const page = await signedOutPage(browser);
    try {
      const link = mintLink('password', staff.email, 'setup');
      await openLink(page, link);
      await expect(page.getByRole('heading', { name: 'Create your password' })).toBeVisible();
      await expect(page.getByText(staff.email)).toBeVisible();

      const pw = `Cf-e2e-${Date.now()}aA1!`;
      // Guard: mismatched confirmation is caught before anything is spent.
      await page.getByLabel('Password', { exact: true }).fill(pw);
      await page.getByLabel('Confirm password').fill(`${pw}x`);
      await page.getByRole('button', { name: 'Create password and sign in' }).click();
      await expect(page.getByRole('alert')).toHaveText('The two passwords do not match.');

      // Show/hide toggle reveals what was typed.
      await page.getByRole('button', { name: 'Show password' }).click();
      await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'text');

      await page.getByLabel('Confirm password').fill(pw);
      await page.getByRole('button', { name: 'Create password and sign in' }).click();
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });

      // The code is single-use: the same link now explains itself.
      const again = await signedOutPage(browser);
      await openLink(again, link);
      await expect(again.getByRole('alert')).toContainText('expired or has already been used');
      await expect(again.getByRole('link', { name: 'Send a new link' })).toBeVisible();
      await again.context().close();
    } finally {
      await page.context().close();
      await deleteUser(staff.uid);
    }
  });

  test('reset wording differs from first-time setup', async ({ browser }) => {
    const staff = await createThrowawayStaff();
    const page = await signedOutPage(browser);
    try {
      await openLink(page, mintLink('password', staff.email, 'reset'));
      await expect(page.getByRole('heading', { name: 'Choose a new password' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Save password and sign in' })).toBeVisible();
    } finally {
      await page.context().close();
      await deleteUser(staff.uid);
    }
  });

  test('passwordless link opened on another device asks for the email, then signs in', async ({ browser }) => {
    const staff = await createThrowawayStaff();
    const page = await signedOutPage(browser);
    try {
      await openLink(page, mintLink('signin', staff.email));
      await expect(page.getByText('Confirm the email address it was sent to.')).toBeVisible();
      await page.getByLabel('Email address').fill(staff.email);
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 });
    } finally {
      await page.context().close();
      await deleteUser(staff.uid);
    }
  });

  test('a broken link says so in plain words, with a way forward', async ({ browser }) => {
    const page = await signedOutPage(browser);
    try {
      await page.goto('account/action?mode=resetPassword&oobCode=not-a-real-code&intent=setup');
      await expect(page.getByRole('alert')).toContainText('expired or has already been used');
      await expect(page.getByRole('alert')).not.toContainText(/firebase|auth\//i);
      await page.goto('account/action?mode=resetPassword');
      await expect(page.getByRole('alert')).toContainText('This link is incomplete');
    } finally {
      await page.context().close();
    }
  });
});

test.describe('#203 sign-in page requests', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('"Email me a sign-in link" needs an address, then confirms with "if"', async ({ page }) => {
    await page.goto('login');
    await page.getByRole('button', { name: 'Email me a sign-in link' }).click();
    await expect(page.getByRole('alert')).toContainText('Enter your email address above');

    await page.getByLabel('Email').fill(`e2e-nobody-${Date.now()}@legalterminus.test`);
    await page.getByRole('button', { name: 'Email me a sign-in link' }).click();
    await expect(page.getByRole('status')).toContainText('has an account, a sign-in link is on its way');
  });

  test('forgot password goes through the portal and never confirms an account exists', async ({ page }) => {
    await page.goto('forgot-password');
    await page.getByLabel('Email').fill(`e2e-nobody-${Date.now()}@legalterminus.test`);
    await page.getByRole('button', { name: 'Send reset link' }).click();
    await expect(page.getByText('has an account, a link to')).toBeVisible();
  });

  test('the public endpoints answer identically for a real and an unknown address', async () => {
    const ctx = await request.newContext({ baseURL: process.env.E2E_API_BASE ?? 'http://localhost:5001' });
    try {
      for (const route of ['password-reset', 'sign-in-link']) {
        const known = await ctx.post(`/api/public/account/${route}`, { data: { email: env('E2E_CLIENT_EMAIL') } });
        const unknown = await ctx.post(`/api/public/account/${route}`, { data: { email: `e2e-nobody-${Date.now()}@legalterminus.test` } });
        expect(known.status()).toBe(202);
        expect(unknown.status()).toBe(202);
        expect(await known.json()).toEqual(await unknown.json());
        // Unknown fields are stripped, not honoured.
        const smuggled = await ctx.post(`/api/public/account/${route}`, {
          data: { email: env('E2E_CLIENT_EMAIL'), workspaceId: 'someone-else', continueUrl: 'https://evil.test' },
        });
        expect(smuggled.status()).toBe(202);
      }
    } finally {
      await ctx.dispose();
    }
  });
});

test.describe('#203 staff "Send sign-in link"', () => {
  test('admin sends a client a sign-in link from the client page', async ({ adminPage: page }) => {
    {
      await page.goto(`clients/${env('E2E_CLIENT_UID')}`);
      const sent = page.waitForResponse((r) => r.url().includes('/sign-in-link') && r.request().method() === 'POST');
      await page.getByRole('button', { name: /^Send sign-in link/ }).first().click();
      const res = await sent;
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.method).toBe('link');
      // The e2e stack runs with email disabled, so the honest toast is the
      // "not set up" one; with email on it is the "sent" one.
      await expect(page.getByText(body.sent ? /Sign-in link sent to/ : /Email is not set up for this workspace/)).toBeVisible();
    }
  });

  test('only admins and managers may send one; team members get 403', async () => {
    const team = await apiAs('team');
    const manager = await apiAs('manager');
    try {
      const denied = await team.post(`/api/portal/users/${env('E2E_CLIENT_UID')}/sign-in-link`);
      expect(denied.status()).toBe(403);
      const allowed = await manager.post(`/api/portal/users/${env('E2E_CLIENT_UID')}/sign-in-link`);
      expect(allowed.status()).toBe(200);
      const missing = await manager.post('/api/portal/users/no-such-user/sign-in-link');
      expect(missing.status()).toBe(404);
    } finally {
      await team.dispose();
      await manager.dispose();
    }
  });
});
