/**
 * The profile fields a sign-in writes (POST /api/auth/register). Pure.
 *
 * #277: /register runs on EVERY sign-in, not only the first. The sign-in page
 * sends `fullName: displayName || email`, and an email-and-password account has
 * no displayName, so for those users the "name" sent is their email address.
 * Merging that over an existing profile replaced a client's real name with
 * their email on every sign-in (three live clients were found like that on
 * 2026-11-10), and the blank `mobile` / `businessName` / `state` sent wiped
 * what staff had entered.
 *
 * So for a user who already exists, a sign-in fills a field only when the
 * profile has nothing there (for the name: nothing, or only an email address)
 * and the value sent is real. A new user is created exactly as before.
 */
const clip = (v, n) => String(v ?? '').trim().slice(0, n);
const looksLikeEmail = (v) => String(v ?? '').includes('@');
const has = (v) => String(v ?? '').trim() !== '';

export function buildSignInProfile(existingUser, {
  email, fullName, mobile, businessName, state, provider, photoURL, terms = {},
}) {
  const name = clip(fullName, 200);
  const phone = clip(String(mobile ?? '').replace(/[^0-9+\-() ]/g, ''), 20);
  const business = clip(businessName, 200);
  const st = clip(state, 100);
  const picture = photoURL && provider === 'google' ? { profilePictureUrl: photoURL } : {};

  if (!existingUser) {
    return { name, fullName: name, email, mobile: phone, businessName: business, state: st, ...picture, ...terms };
  }
  const nameIsMissing = !has(existingUser.name) || looksLikeEmail(existingUser.name);
  return {
    email,
    ...(name && !looksLikeEmail(name) && nameIsMissing && { name, fullName: name }),
    ...(phone && !has(existingUser.mobile) && { mobile: phone }),
    ...(business && !has(existingUser.businessName) && { businessName: business }),
    ...(st && !has(existingUser.state) && { state: st }),
    ...picture,
    ...terms,
  };
}
