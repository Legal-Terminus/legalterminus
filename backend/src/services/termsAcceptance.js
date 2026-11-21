/**
 * #35 — when a person agreed to the Terms & Conditions and Privacy Policy.
 *
 * The sign-up forms send `termsAccepted: true` to `POST /api/auth/register`
 * once the box is ticked (email) or next to "Continue with Google" (where the
 * agreement line is shown). The FIRST agreement is the record: a later sign-in
 * that says it again does not move the date.
 *
 * Not refused when missing: the same endpoint runs on every sign-in, and the
 * Android app already in review sends the old body. A missing flag simply
 * records nothing.
 *
 * Pure: the route reads the user's document and writes what this returns.
 */
export function termsAcceptanceFields(body, existingUser, now = new Date().toISOString()) {
  if (body?.termsAccepted !== true) return {};
  if (existingUser?.termsAcceptedAt) return {};
  return { termsAcceptedAt: now };
}
