/**
 * Pure rules behind the app-only behaviour, kept free of imports so they can be unit
 * tested with plain Node (`npm test` in Portal/). The callers are lib/native.ts,
 * lib/appleSignIn.ts and the login page.
 */

/** Where an emailed account link should land inside the app, or null to ignore it. */
export function accountLinkPath(raw: string): string | null {
  let url: URL;
  try { url = new URL(raw); } catch { return null; }
  if (url.protocol !== 'https:') return null;
  if (url.pathname !== '/portal/account/action' && !url.pathname.startsWith('/portal/account/action/')) return null;
  return url.pathname.replace(/^\/portal/, '') + url.search;
}

/**
 * The Portal's entry script path (e.g. /portal/assets/index-AbC123.js) from its index.html,
 * or null. Vite gives every build a new hashed name, so a different name means a new
 * website version was deployed.
 */
export function entryScriptOf(html: string): string | null {
  const tag = /<script\b[^>]*\btype="module"[^>]*>/i.exec(html)?.[0];
  const src = tag ? /\bsrc="([^"]+)"/i.exec(tag)?.[1] : null;
  if (!src) return null;
  try { return new URL(src, 'https://site.invalid/').pathname; } catch { return null; }
}

/**
 * Whether the app should reload to pick up a newly deployed website version: only after it
 * has been in the background long enough (not on every quick app switch), only when the
 * entry script really changed, and never while the person is busy (an upload in flight, or
 * typing in a field).
 */
export function shouldReloadForUpdate(o: {
  hiddenMs: number;
  minHiddenMs: number;
  current: string | null;
  latest: string | null;
  busy: boolean;
  editing: boolean;
}): boolean {
  if (o.hiddenMs < o.minHiddenMs) return false;
  if (o.busy || o.editing) return false;
  if (!o.current || !o.latest) return false;
  return o.current !== o.latest;
}

/**
 * E29-S11 / D6: where the "Sign in with Apple" button shows. Always in the iPhone app
 * (App Store guideline 4.8: an app offering Google sign-in must offer Apple's too);
 * never in the Android app for the first release; on the website only once the firm
 * has switched the Apple provider on (VITE_APPLE_SIGN_IN=true), so an unconfigured
 * deployment never shows a button that cannot work.
 */
export function showAppleSignIn(platform: string, webFlag: string | undefined): boolean {
  if (platform === 'ios') return true;
  if (platform === 'android') return false;
  return webFlag === 'true';
}

/** What the person sees when Apple sign-in fails. `null` means say nothing. */
export function appleSignInMessage(code: string): string | null {
  switch (code) {
    case 'auth/cancelled-popup-request':
      return null;
    case 'auth/popup-closed-by-user':
    case 'auth/user-cancelled':
      return 'The Apple window was closed before sign-in finished. Please try again.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Apple window. Allow pop-ups for this site and try again.';
    case 'auth/network-request-failed':
      return 'Could not reach Apple. Check your connection and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'This email already has an account with a password or Google. Sign in that way, or use "Email me a sign-in link".';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact your firm.';
    case 'auth/unauthorized-domain':
    case 'auth/operation-not-allowed':
      return 'Apple sign-in is not available right now. Please use your password or "Email me a sign-in link".';
    default:
      return 'Apple sign-in did not complete. Please try again, or use "Email me a sign-in link".';
  }
}

/** The name Apple sends on the FIRST sign-in only (null when it sent none). */
export function appleFullName(profile: unknown, fallback?: string | null): string | null {
  const name = (profile as { name?: { firstName?: string; lastName?: string } } | null | undefined)?.name;
  const joined = [name?.firstName, name?.lastName].filter(Boolean).join(' ').trim();
  return joined || (fallback?.trim() || null);
}
