import { expect, type Page } from '@playwright/test';

/** Role keys used across the suite. */
// #168: 'pro' is the external view-only professional.
export type RoleKey = 'admin' | 'manager' | 'team' | 'client' | 'pro';

/** Read a required env var with a clear, actionable error. */
export function env(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing ${name}. Run: cd backend && node scripts/seed-e2e.js --write-env (seeds users + fixtures).`,
    );
  }
  return v;
}

/** Credentials for a role from the seeded env. */
export function creds(role: RoleKey): { email: string; password: string } {
  const key = role === 'team' ? 'TEAM' : role.toUpperCase();
  return { email: env(`E2E_${key}_EMAIL`), password: env(`E2E_${key}_PASSWORD`) };
}

/**
 * Log in through the real Firebase email/password form and wait for the app to
 * leave /login. Firebase persists the session in the page context.
 */
export async function login(page: Page, role: RoleKey) {
  const { email, password } = creds(role);

  await page.goto('login');
  await page.getByRole('heading', { name: 'Sign in' }).waitFor({ timeout: 20_000 });
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Success = the SPA navigates away from /login. Race it against an inline auth
  // error so wrong creds fail fast instead of waiting out the full timeout.
  const left = page.waitForURL((url) => !/\/login(\?|$)/.test(url.pathname + url.search), { timeout: 60_000 });
  const errEl = page.locator('.text-red-600, [role="alert"]').first();
  const shownError = errEl.waitFor({ state: 'visible', timeout: 60_000 })
    .then(() => errEl.textContent())
    .catch(() => null);

  const result = await Promise.race([
    left.then(() => 'ok' as const),
    shownError.then((t) => (t && /password|email|credential|disabled|invalid/i.test(t) ? `err:${t.trim()}` : null)),
  ]);
  if (typeof result === 'string' && result.startsWith('err:')) {
    throw new Error(`Login as ${role} rejected: ${result.slice(4)}`);
  }
  // If neither resolved as success yet, give the redirect its full window.
  await left;
}

/** Open a matter detail page and switch to a tab (Steps/Documents/Payments). */
export async function openMatter(page: Page, taskId: string, tab?: 'Steps' | 'Documents' | 'Payments') {
  await page.goto(`tasks/${taskId}`);
  if (tab) {
    await page.getByRole('button', { name: tab, exact: true }).click();
  }
}

/** Open the Documents tab and wait for the uploader (stable readiness anchor). */
export async function openDocumentsTab(page: Page, taskId: string) {
  await openMatter(page, taskId, 'Documents');
  await expect(page.getByText('Upload a document', { exact: true })).toBeVisible();
}

/** A minimal valid single-page PDF for upload tests. */
export const TINY_PDF = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
  '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
  '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\n' +
  'trailer<</Root 1 0 R>>\n%%EOF\n',
  'utf8',
);

export function pdfFile(label: string) {
  return { name: `e2e-${label}-${Date.now()}.pdf`, mimeType: 'application/pdf', buffer: TINY_PDF };
}
