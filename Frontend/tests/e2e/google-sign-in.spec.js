// @ts-check
import { test, expect } from "@playwright/test";

/**
 * #213 on the website — Login, Signup and the Buy Now popup signed in with Google
 * by pop-up only, which cannot return its result in a phone's in-app browser.
 *
 * Google refuses automated sign-ins, so the round trip is checked on a real
 * phone. What is tested here is every decision the site makes, by running its
 * own module in the browser, and the behaviour that needs no Google at all.
 * The same cases as the Portal's e2e/google-sign-in.spec.ts.
 */

const UA = {
  desktop: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  android: "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
  iphone: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  // An Android WebView inside another app (note "; wv)").
  webview: "Mozilla/5.0 (Linux; Android 15; Pixel 9 Build/AP3A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.0.0 Mobile Safari/537.36",
};
const MODULE = "/src/utils/googleSignIn.js";

test("the sign-in route is chosen by device and by where the handler lives", async ({ page }) => {
  await page.goto("/login");
  const choose = (c) => page.evaluate(async ([path, input]) => (await import(path)).chooseGoogleFlow(input), [MODULE, c]);
  const live = "legalterminus.com";
  expect(await choose({ userAgent: UA.android, hostname: live, authDomain: live })).toBe("redirect");
  expect(await choose({ userAgent: UA.iphone, hostname: `www.${live}`, authDomain: live })).toBe("redirect");
  expect(await choose({ userAgent: UA.desktop, hostname: live, authDomain: live, touchMac: true })).toBe("redirect");
  expect(await choose({ userAgent: UA.desktop, hostname: live, authDomain: live })).toBe("popup");
  // THE SAFETY NET: with the handler on another site a redirect would come back
  // signed out, so a phone stays on the pop-up — the old behaviour.
  expect(await choose({ userAgent: UA.android, hostname: live, authDomain: "legal-terminus-web.firebaseapp.com" })).toBe("popup");
  expect(await choose({ userAgent: UA.android, hostname: live, authDomain: undefined })).toBe("popup");
  // A look-alike domain is not the same site.
  expect(await choose({ userAgent: UA.android, hostname: "legalterminus.com.evil.test", authDomain: live })).toBe("popup");
  expect(await choose({ userAgent: UA.webview, hostname: live, authDomain: live })).toBe("unsupported");
});

test("error codes become plain messages, and closing the window says nothing", async ({ page }) => {
  await page.goto("/login");
  const messages = await page.evaluate(async (path) => {
    const m = await import(path);
    const codes = ["auth/popup-closed-by-user", "auth/cancelled-popup-request", "auth/popup-blocked",
      "auth/network-request-failed", "auth/unauthorized-domain", "auth/something-new"];
    return Object.fromEntries(codes.map((c) => [c, m.googleSignInMessage(c)]));
  }, MODULE);
  expect(messages["auth/popup-closed-by-user"]).toBeNull();
  expect(messages["auth/cancelled-popup-request"]).toBeNull();
  expect(messages["auth/popup-blocked"]).toMatch(/pop-ups/i);
  for (const [code, msg] of Object.entries(messages)) {
    if (msg !== null) expect(msg, `${code} must not leak a Firebase code`).not.toMatch(/auth\/|Firebase/);
  }
});

for (const path of ["/login", "/signup"]) {
  test(`${path}: inside an in-app browser, the page says to open it in Chrome or Safari`, async ({ browser }) => {
    const ctx = await browser.newContext({ userAgent: UA.webview, viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    try {
      await page.goto(path);
      await page.getByRole("button", { name: /google/i }).click();
      await expect(page.getByText(/does not work inside this app's built-in browser/i)).toBeVisible();
    } finally { await ctx.close(); }
  });

  test(`${path}: coming back from Google with nothing says so, once`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByText(/Google sign-in did not complete/i)).toHaveCount(0);
    // The flag the site sets just before leaving for Google.
    await page.evaluate(() => window.sessionStorage.setItem("lt.googleSignInReturning", "1"));
    await page.reload();
    await expect(page.getByText(/Google sign-in did not complete/i)).toBeVisible({ timeout: 20_000 });
    expect(await page.evaluate(() => window.sessionStorage.getItem("lt.googleSignInReturning"))).toBeNull();
    await page.reload();
    await expect(page.getByRole("button", { name: /google/i })).toBeEnabled();
    await expect(page.getByText(/Google sign-in did not complete/i)).toHaveCount(0);
  });
}
