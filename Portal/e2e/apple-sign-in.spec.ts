import { test, expect } from '@playwright/test';

/**
 * E29-S11 — Sign in with Apple, and E29-S06's guarantee that the website is untouched
 * by the app shell.
 *
 * Apple, like Google, refuses automated sign-ins, so the round trip is checked on a
 * real iPhone (TestFlight) and in Safari. What is tested here is every decision the
 * page makes, by running the page's own module in the browser, plus what a website
 * visitor sees.
 */

test('the Apple button: always in the iPhone app, never on Android, on the web only when switched on', async ({ page }) => {
  await page.goto('login');
  const show = (platform: string, flag?: string) => page.evaluate(async ([p, f]) => {
    const m = await import('/portal/src/lib/nativeRules.ts');
    return m.showAppleSignIn(p as string, f ?? undefined) as boolean;
  }, [platform, flag] as const);
  expect(await show('ios')).toBe(true);
  expect(await show('android', 'true')).toBe(false);
  expect(await show('web')).toBe(false);
  expect(await show('web', 'true')).toBe(true);
});

test('Apple sign-in errors read as sentences', async ({ page }) => {
  await page.goto('login');
  const out = await page.evaluate(async () => {
    const m = await import('/portal/src/lib/nativeRules.ts');
    return ['auth/cancelled-popup-request', 'auth/user-cancelled', 'auth/account-exists-with-different-credential', 'auth/internal-error']
      .map((c) => m.appleSignInMessage(c));
  });
  expect(out[0]).toBeNull();
  expect(out[1]).toContain('closed before sign-in finished');
  expect(out[2]).toContain('already has an account');
  expect(out[3]).toContain('did not complete');
  for (const msg of out.filter(Boolean)) expect(msg).not.toMatch(/auth\//);
});

test('the website login has no Apple button until the firm switches it on', async ({ page }) => {
  await page.goto('login');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  // The e2e build does not set VITE_APPLE_SIGN_IN, as QA and production do not yet.
  await expect(page.getByRole('button', { name: 'Sign in with Apple' })).toHaveCount(0);
  await expect(page.getByText('By continuing with Google you agree')).toBeVisible();
});

test('E29-S06: the website never gets the app shell (no data-native, no viewport-fit)', async ({ page }) => {
  await page.goto('login');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.locator('html')).not.toHaveAttribute('data-native', /.+/);
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).not.toContain('viewport-fit');
});

test('E29-S07: only the account-action path of an emailed link is routed in the app', async ({ page }) => {
  await page.goto('login');
  const out = await page.evaluate(async () => {
    const m = await import('/portal/src/lib/nativeRules.ts');
    return [
      m.accountLinkPath('https://legal-terminus-qa.web.app/portal/account/action?mode=signIn&oobCode=x'),
      m.accountLinkPath('https://legalterminus.com/portal/tasks/1'),
    ];
  });
  expect(out).toEqual(['/account/action?mode=signIn&oobCode=x', null]);
});
