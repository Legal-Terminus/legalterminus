import { test, expect } from '@playwright/test';

/**
 * #213 — "Sign-in cancelled" when a client signs in with Google on a phone.
 *
 * The page signed in with a pop-up only, and a pop-up cannot hand its result
 * back in a phone's in-app browser; Firebase reported it as the user closing the
 * window. Phones now go by redirect, desktops keep the pop-up with a redirect
 * fallback, and the messages say what actually happened.
 *
 * Google refuses automated sign-ins, so the round trip itself cannot be driven
 * from here — that is checked on a real phone against QA. What IS tested is every
 * decision the page makes, by running the page's own module in the browser, and
 * the behaviour that needs no Google at all.
 */

const UA = {
  desktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
  android: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  // An Android WebView inside another app (note "; wv)").
  webview: 'Mozilla/5.0 (Linux; Android 15; Pixel 9 Build/AP3A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.0.0 Mobile Safari/537.36',
  instagram: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0',
};

type Flow = 'redirect' | 'popup' | 'unsupported';
type Case = { userAgent: string; hostname: string; authDomain: string | null; touchMac?: boolean };

test('the sign-in route is chosen by device and by where the handler lives', async ({ page }) => {
  await page.goto('login');
  const choose = (c: Case) => page.evaluate(async (input) => {
    const m = await import('/portal/src/lib/googleSignIn.ts');
    return m.chooseGoogleFlow(input) as string;
  }, c) as Promise<Flow>;

  const live = 'legalterminus.com';
  // A phone on the live site, with the handler on the same site → redirect.
  expect(await choose({ userAgent: UA.android, hostname: live, authDomain: live })).toBe('redirect');
  expect(await choose({ userAgent: UA.iphone, hostname: `www.${live}`, authDomain: live })).toBe('redirect');
  // An iPad says it is a Mac; a touch screen gives it away.
  expect(await choose({ userAgent: UA.desktop, hostname: live, authDomain: live, touchMac: true })).toBe('redirect');
  // A desktop keeps the pop-up.
  expect(await choose({ userAgent: UA.desktop, hostname: live, authDomain: live })).toBe('popup');
  // THE SAFETY NET: with the handler on another site a redirect would come back
  // signed out, so a phone stays on the pop-up — exactly the old behaviour.
  expect(await choose({ userAgent: UA.android, hostname: live, authDomain: 'legal-terminus-web.firebaseapp.com' })).toBe('popup');
  expect(await choose({ userAgent: UA.android, hostname: 'localhost', authDomain: 'legal-terminus-web.firebaseapp.com' })).toBe('popup');
  expect(await choose({ userAgent: UA.android, hostname: live, authDomain: null })).toBe('popup');
  // A look-alike domain is not the same site.
  expect(await choose({ userAgent: UA.android, hostname: 'legalterminus.com.evil.test', authDomain: live })).toBe('popup');
  // Inside another app's own browser Google will not sign in at all.
  expect(await choose({ userAgent: UA.webview, hostname: live, authDomain: live })).toBe('unsupported');
  expect(await choose({ userAgent: UA.instagram, hostname: live, authDomain: live })).toBe('unsupported');
});

test('error codes become messages that say what happened — never "Sign-in cancelled"', async ({ page }) => {
  await page.goto('login');
  const out = await page.evaluate(async () => {
    const m = await import('/portal/src/lib/googleSignIn.ts');
    const codes = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/popup-blocked',
      'auth/network-request-failed', 'auth/unauthorized-domain', 'auth/something-new'];
    return {
      messages: Object.fromEntries(codes.map((c) => [c, m.googleSignInMessage(c)])),
      fromCode: m.authErrorCode({ code: 'auth/popup-blocked' }),
      fromMessage: m.authErrorCode(new Error('Firebase: Error (auth/popup-closed-by-user).')),
      unknown: m.authErrorCode(new Error('boom')),
    };
  });
  // Pressing the button twice is not an error to show.
  expect(out.messages['auth/cancelled-popup-request']).toBeNull();
  for (const [code, msg] of Object.entries(out.messages)) {
    if (msg === null) continue;
    expect(msg, code).not.toMatch(/cancelled/i);
    expect(msg, `${code} must not leak a Firebase code`).not.toMatch(/auth\/|Firebase/);
  }
  expect(out.messages['auth/popup-blocked']).toMatch(/pop-ups/i);
  expect(out.fromCode).toBe('auth/popup-blocked');
  expect(out.fromMessage).toBe('auth/popup-closed-by-user');
  expect(out.unknown).toBe('unknown');
});

test('inside an in-app browser, the page says to open it in Chrome or Safari', async ({ browser }) => {
  const ctx = await browser.newContext({ userAgent: UA.webview, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  try {
    await page.goto('login');
    await page.getByRole('button', { name: 'Continue with Google' }).click();
    await expect(page.getByText(/does not work inside this app's built-in browser/i)).toBeVisible();
    // The other ways in stay usable.
    await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeEnabled();
    await expect(page.getByRole('button', { name: /Email me a sign-in link/i })).toBeEnabled();
  } finally { await ctx.close(); }
});

test('an ordinary visit to the login page is not treated as a return from Google', async ({ page }) => {
  await page.goto('login');
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeEnabled();
  await expect(page.getByText(/Google sign-in did not complete/i)).toHaveCount(0);
});

test('coming back from Google with nothing says so, and the form is usable again', async ({ page }) => {
  // The flag the page sets just before leaving for Google.
  await page.addInitScript(() => window.sessionStorage.setItem('lt.googleSignInReturning', '1'));
  await page.goto('login');
  await expect(page.getByText(/Google sign-in did not complete/i)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeEnabled();
  // The flag is cleared, so a reload is an ordinary visit again.
  expect(await page.evaluate(() => window.sessionStorage.getItem('lt.googleSignInReturning'))).toBeNull();
});
