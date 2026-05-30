/**
 * userProfile.js
 *
 * Single source of truth for reading / writing the logged-in user's
 * profile in localStorage.
 *
 * Keys:
 *   lt_logged_in  – "true" when a user is logged in
 *   lt_user       – JSON with { fullName, email, mobile, businessName?, state? }
 *
 * Usage:
 *   saveUserProfile(profile)   – call this on login / after successful checkout
 *   getUserProfile()           – call this anywhere you need the user data
 *   clearUserProfile()         – call this on logout
 *
 * Any component that needs to react to login/logout changes should
 * listen for the custom "lt-auth-change" event on window.
 */

const USER_KEY  = "lt_user";
const LOGIN_KEY = "lt_logged_in";

/** Dispatch so Navbar and other components re-render immediately. */
function notifyAuthChange() {
  window.dispatchEvent(new Event("lt-auth-change"));
}

/**
 * Save profile and mark as logged in.
 * @param {{ fullName, email, mobile, businessName?, state? }} profile
 */
export function saveUserProfile(profile) {
  localStorage.setItem(LOGIN_KEY, "true");
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
  notifyAuthChange();
}

/**
 * Read the current user's profile.
 * Returns null when no profile has been saved yet.
 * Does NOT gate on lt_logged_in so callers get data even if the flag
 * was set by an external system that didn't also write lt_user.
 *
 * @returns {{ fullName, email, mobile, businessName, state } | null}
 */
export function getUserProfile() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Returns true when the user is considered logged in. */
export function isLoggedIn() {
  return !!localStorage.getItem(LOGIN_KEY);
}

/**
 * Clear profile and log the user out.
 */
export function clearUserProfile() {
  localStorage.removeItem(LOGIN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthChange();
}
