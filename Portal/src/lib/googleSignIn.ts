import {
  GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect,
  type Auth, type UserCredential,
} from 'firebase/auth';

/**
 * #213 — Google sign-in that works on phones.
 *
 * The login page signed in with a POP-UP only. On a phone — and above all in the
 * in-app browser a link opens in from WhatsApp or Gmail — a pop-up either cannot
 * open or cannot hand its result back to the page. Firebase then reports
 * `auth/popup-closed-by-user`, which the page showed as "Sign-in cancelled"
 * although nobody had cancelled anything.
 *
 * So: on a phone, sign in by REDIRECT (leave for Google, come back signed in),
 * and on a desktop keep the pop-up but fall back to a redirect if the browser
 * will not open one.
 *
 * A redirect only works when the sign-in handler is served from the SAME SITE as
 * the portal. Browsers now block the cross-site storage it would otherwise use,
 * and the sign-in returns with nothing. That is decided by the build's
 * `VITE_FIREBASE_AUTH_DOMAIN`; where it is still a different site (local
 * development, or a deployment not yet switched) this stays on the pop-up, i.e.
 * exactly the old behaviour.
 */

export type GoogleFlow = 'redirect' | 'popup' | 'unsupported';

/** Browsers embedded INSIDE another app. Google refuses to sign in there at all. */
const EMBEDDED = /; wv\)|\bFBAN\b|\bFBAV\b|Instagram|\bLine\/|MicroMessenger|LinkedInApp|Snapchat/i;
const PHONE = /Android|iPhone|iPad|iPod/i;

/** True when `authDomain` is the page's own host, or a parent of it (www → apex). */
export function isSameSite(hostname: string, authDomain: string | undefined | null): boolean {
  const d = String(authDomain ?? '').trim().toLowerCase();
  const h = String(hostname ?? '').trim().toLowerCase();
  if (!d || !h) return false;
  return h === d || h.endsWith(`.${d}`);
}

/** Which way to sign in. Pure, so every case is tested without a device. */
export function chooseGoogleFlow({ userAgent, hostname, authDomain, touchMac = false }: {
  userAgent: string; hostname: string; authDomain?: string | null; touchMac?: boolean;
}): GoogleFlow {
  if (EMBEDDED.test(userAgent)) return 'unsupported';
  // iPadOS reports itself as a Mac; a touch screen gives it away.
  const phone = PHONE.test(userAgent) || touchMac;
  return phone && isSameSite(hostname, authDomain) ? 'redirect' : 'popup';
}

/** Firebase's code for an error, e.g. `auth/popup-closed-by-user`. */
export function authErrorCode(err: unknown): string {
  const code = (err as { code?: unknown } | null)?.code;
  if (typeof code === 'string') return code;
  const m = /\((auth\/[a-z-]+)\)/.exec(err instanceof Error ? err.message : '');
  return m ? m[1] : 'unknown';
}

/** A pop-up the browser would not open — the cases a redirect can rescue. */
const POPUP_UNAVAILABLE = new Set([
  'auth/popup-blocked',
  'auth/operation-not-supported-in-this-environment',
  'auth/web-storage-unsupported',
]);

/** What the person sees. `null` means say nothing (they pressed the button twice). */
export function googleSignInMessage(code: string): string | null {
  switch (code) {
    case 'auth/cancelled-popup-request':
      return null;
    case 'auth/popup-closed-by-user':
    case 'auth/user-cancelled':
      return 'The Google window was closed before sign-in finished. Please try again.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google window. Allow pop-ups for this site and try again.';
    case 'auth/network-request-failed':
      return 'Could not reach Google. Check your connection and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'This email already has an account with a password. Sign in with your password, or use "Email me a sign-in link".';
    case 'auth/unauthorized-domain':
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not available right now. Please use your password or "Email me a sign-in link".';
    default:
      return 'Google sign-in did not complete. Please try again, or use "Email me a sign-in link".';
  }
}

export const UNSUPPORTED_BROWSER_MESSAGE =
  'Google sign-in does not work inside this app\'s built-in browser. Open this page in Chrome or Safari, or use "Email me a sign-in link" below.';

const currentFlow = (auth: Auth): GoogleFlow => chooseGoogleFlow({
  userAgent: navigator.userAgent,
  hostname: window.location.hostname,
  authDomain: auth.config.authDomain,
  touchMac: /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1,
});

/**
 * Start a Google sign-in.
 *
 * Resolves with the credential when a pop-up completed it; resolves with
 * `'redirecting'` when the page is leaving for Google (the result is then picked
 * up by `finishGoogleRedirect` after it comes back); and `'unsupported'` when
 * this browser cannot do it at all.
 */
export async function startGoogleSignIn(auth: Auth): Promise<UserCredential | 'redirecting' | 'unsupported'> {
  const provider = new GoogleAuthProvider();
  const flow = currentFlow(auth);
  if (flow === 'unsupported') return 'unsupported';
  if (flow === 'redirect') {
    await signInWithRedirect(auth, provider);
    return 'redirecting';
  }
  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
    // The browser would not open a pop-up: go by redirect instead of failing,
    // but only where a redirect can actually come back signed in.
    if (POPUP_UNAVAILABLE.has(authErrorCode(err)) && isSameSite(window.location.hostname, auth.config.authDomain)) {
      await signInWithRedirect(auth, provider);
      return 'redirecting';
    }
    throw err;
  }
}

/** After coming back from Google: the credential, or null if this was not a return. */
export const finishGoogleRedirect = (auth: Auth): Promise<UserCredential | null> => getRedirectResult(auth);
