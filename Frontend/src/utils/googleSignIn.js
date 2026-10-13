/**
 * googleSignIn.js — #213, the website side.
 *
 * Login, Signup and the Buy Now popup signed in with Google by POP-UP only. On a
 * phone — above all in the browser a link opens in from WhatsApp or Gmail — a
 * pop-up cannot hand its result back, and the sign-in silently did nothing.
 *
 * So: on a phone, sign in by REDIRECT (leave for Google, come back signed in);
 * on a desktop keep the pop-up, falling back to a redirect if it is blocked.
 *
 * A redirect only comes back signed in when the sign-in handler is on the SAME
 * SITE as the page (the build's VITE_FIREBASE_AUTH_DOMAIN). Where it is another
 * site — local development — this stays on the pop-up, i.e. the old behaviour.
 *
 * The same rules as the Portal's `src/lib/googleSignIn.ts`. Two apps, no shared
 * package: change one, change the other.
 */
import {
  GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "./firebase";
import { registerUser } from "./registerUser";
import { saveUserProfile } from "./userProfile";

/** Browsers embedded INSIDE another app. Google refuses to sign in there at all. */
const EMBEDDED = /; wv\)|\bFBAN\b|\bFBAV\b|Instagram|\bLine\/|MicroMessenger|LinkedInApp|Snapchat/i;
const PHONE = /Android|iPhone|iPad|iPod/i;

/** True when `authDomain` is the page's own host, or a parent of it (www → apex). */
export function isSameSite(hostname, authDomain) {
  const d = String(authDomain ?? "").trim().toLowerCase();
  const h = String(hostname ?? "").trim().toLowerCase();
  if (!d || !h) return false;
  return h === d || h.endsWith(`.${d}`);
}

/** Which way to sign in: 'redirect' | 'popup' | 'unsupported'. Pure, so it is tested without a device. */
export function chooseGoogleFlow({ userAgent, hostname, authDomain, touchMac = false }) {
  if (EMBEDDED.test(userAgent)) return "unsupported";
  // iPadOS reports itself as a Mac; a touch screen gives it away.
  const phone = PHONE.test(userAgent) || touchMac;
  return phone && isSameSite(hostname, authDomain) ? "redirect" : "popup";
}

/** A pop-up the browser would not open — the cases a redirect can rescue. */
const POPUP_UNAVAILABLE = new Set([
  "auth/popup-blocked",
  "auth/operation-not-supported-in-this-environment",
  "auth/web-storage-unsupported",
]);

/** What the person sees. `null` means say nothing (they closed the window themselves). */
export function googleSignInMessage(code) {
  switch (code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
    case "auth/user-cancelled":
      return null;
    case "auth/popup-blocked":
      return "Your browser blocked the Google window. Allow pop-ups for this site and try again.";
    case "auth/network-request-failed":
      return "Could not reach Google. Check your connection and try again.";
    case "auth/account-exists-with-different-credential":
      return "This email already has an account with a password. Please sign in with your password.";
    default:
      return "Google sign-in did not complete. Please try again, or use your email and password.";
  }
}

export const UNSUPPORTED_BROWSER_MESSAGE =
  "Google sign-in does not work inside this app's built-in browser. Open this page in Chrome or Safari, or use your email and password.";

// Set just before leaving for Google, so the page that loads afterwards knows a
// sign-in is on its way back (and can say so if it returns with nothing).
const RETURN_KEY = "lt.googleSignInReturning";
const ERROR_KEY = "lt.googleSignInError";

const session = {
  get(key) { try { return window.sessionStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { window.sessionStorage.setItem(key, value); } catch { /* private mode */ } },
  remove(key) { try { window.sessionStorage.removeItem(key); } catch { /* private mode */ } },
};

const currentFlow = (auth) => chooseGoogleFlow({
  userAgent: navigator.userAgent,
  hostname: window.location.hostname,
  authDomain: auth.config.authDomain,
  touchMac: /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1,
});

const leaveForGoogle = async (auth, provider) => {
  session.set(RETURN_KEY, "1");
  await signInWithRedirect(auth, provider);
  return "redirecting";
};

/**
 * Start a Google sign-in.
 *
 * Resolves with the credential when a pop-up completed it; with `'redirecting'`
 * when the page is leaving for Google (`finishGoogleRedirect` picks the result
 * up when it comes back); and with `'unsupported'` when this browser cannot do
 * it at all. Throws Firebase's error otherwise.
 */
export async function startGoogleSignIn(auth = getFirebaseAuth()) {
  const provider = new GoogleAuthProvider();
  const flow = currentFlow(auth);
  if (flow === "unsupported") return "unsupported";
  if (flow === "redirect") return leaveForGoogle(auth, provider);
  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
    // The browser would not open a pop-up: go by redirect instead of failing,
    // but only where a redirect can actually come back signed in.
    if (POPUP_UNAVAILABLE.has(err?.code) && isSameSite(window.location.hostname, auth.config.authDomain)) {
      return leaveForGoogle(auth, provider);
    }
    throw err;
  }
}

/**
 * What every Google sign-in does once Firebase has the user: sync the account
 * through the backend, then cache the profile the site reads.
 */
export async function syncGoogleUser(user) {
  await registerUser(user, { provider: "google", fullName: user.displayName || "" });
  let data = {};
  try {
    const snap = await getDoc(doc(getFirebaseDb(), "users", user.uid));
    if (snap.exists()) data = snap.data();
  } catch { /* the cached profile is a convenience; the account is already synced */ }
  saveUserProfile({
    fullName: data.fullName || data.name || user.displayName || "",
    email: user.email,
    mobile: data.mobile || data.phone || "",
    businessName: data.businessName || "",
    state: data.state || "",
  });
}

/**
 * Called when the site starts. If this page load is the return from Google,
 * finish the sign-in. It lives at start-up, not in the Login page, because the
 * Buy Now popup returns to whatever page it was opened on.
 */
let redirectSettled = null;
export function finishGoogleRedirect(auth = getFirebaseAuth()) {
  // One run per page load: start-up calls this, and the Login and Signup pages
  // call it again to wait for the same result.
  redirectSettled ??= settleGoogleRedirect(auth);
  return redirectSettled;
}

async function settleGoogleRedirect(auth) {
  const returning = session.get(RETURN_KEY) === "1";
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) await syncGoogleUser(result.user);
    else if (returning) session.set(ERROR_KEY, googleSignInMessage("no-result"));
  } catch (err) {
    console.error("[google-sign-in]", err?.code, err);
    const message = googleSignInMessage(err?.code);
    if (message) session.set(ERROR_KEY, message);
  } finally {
    session.remove(RETURN_KEY);
  }
}

/** The message left by a return from Google that failed, if any. Read once. */
export function takeGoogleRedirectError() {
  const message = session.get(ERROR_KEY);
  if (message) session.remove(ERROR_KEY);
  return message;
}
