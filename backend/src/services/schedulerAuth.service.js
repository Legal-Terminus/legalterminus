import { OAuth2Client } from 'google-auth-library';

/**
 * Is this request from our Cloud Scheduler job?
 *
 * The job signs each call with a Google ID token (OIDC) for a service account
 * that exists only for this purpose. We check Google's signature, that the
 * token was minted for our audience, and that it names that account. No shared
 * secret is stored anywhere: nothing to leak, rotate or paste into a console.
 *
 * Configuration (not secrets): SCHEDULER_SA_EMAIL, and optionally
 * SCHEDULER_AUDIENCE. With no SCHEDULER_SA_EMAIL set, nothing is accepted.
 * A Firebase sign-in token fails verification here and falls through to the
 * normal admin check.
 */
export const DEFAULT_SCHEDULER_AUDIENCE = 'legal-terminus-internal-scheduler';

const google = new OAuth2Client();

export async function isSchedulerCall(req, {
  expectedEmail = process.env.SCHEDULER_SA_EMAIL,
  audience = process.env.SCHEDULER_AUDIENCE || DEFAULT_SCHEDULER_AUDIENCE,
  verify = (opts) => google.verifyIdToken(opts),
} = {}) {
  if (!expectedEmail) return false;
  const header = req.headers?.authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return false;
  try {
    const ticket = await verify({ idToken: header.slice(7), audience });
    const p = ticket.getPayload();
    return p?.email === expectedEmail && p?.email_verified === true;
  } catch {
    return false;
  }
}
