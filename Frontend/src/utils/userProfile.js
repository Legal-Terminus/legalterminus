/**
 * userProfile.js
 *
 * Helpers for reading and writing the logged-in user's profile in localStorage.
 *
 * Keys used:
 *   lt_logged_in  – "true" when a user is logged in (already used by Navbar)
 *   lt_user       – JSON object with the user's profile fields
 *
 * Call saveUserProfile() from your login flow after a successful login.
 * Call clearUserProfile() on logout.
 *
 * Profile shape:
 * {
 *   fullName:     string,
 *   email:        string,
 *   mobile:       string,   // 10-digit, digits only
 *   businessName: string,   // optional
 *   state:        string,   // must match one of the state names used in the checkout form
 * }
 */

const USER_KEY = "lt_user";
const LOGIN_KEY = "lt_logged_in";

/**
 * Save profile and mark as logged in.
 * @param {{ fullName, email, mobile, businessName?, state? }} profile
 */
export function saveUserProfile(profile) {
  localStorage.setItem(LOGIN_KEY, "true");
  localStorage.setItem(USER_KEY, JSON.stringify(profile));
}

/**
 * Read the current user's profile.
 * Returns null if not logged in or no profile saved.
 * @returns {{ fullName, email, mobile, businessName, state } | null}
 */
export function getUserProfile() {
  try {
    if (!localStorage.getItem(LOGIN_KEY)) return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clear profile and log the user out.
 */
export function clearUserProfile() {
  localStorage.removeItem(LOGIN_KEY);
  localStorage.removeItem(USER_KEY);
}
