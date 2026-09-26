import { apiFetch } from './client';

/**
 * #203 — the sign-in page's two "I can't get in" requests. Both always answer
 * the same way, whether or not the address has an account (so they cannot be
 * used to find out who does) — the UI must never promise that an email is
 * on its way, only that one will arrive IF the address has an account.
 */
const BASE = '/api/public/account';

export const requestPasswordReset = (email: string) =>
  apiFetch<{ success: boolean }>(`${BASE}/password-reset`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

export const requestSignInLink = (email: string) =>
  apiFetch<{ success: boolean }>(`${BASE}/sign-in-link`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

/**
 * Where a sign-in link was asked for on THIS device, so opening it here does
 * not have to ask for the address again. Firebase's own recommendation.
 */
export const EMAIL_FOR_SIGN_IN_KEY = 'emailForSignIn';
