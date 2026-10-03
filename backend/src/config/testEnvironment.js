/**
 * Guard for a TEST environment that shares its Firebase project — and so its
 * sign-in accounts — with production.
 *
 * WHY. The QA deployment (E24-S00) runs in the live project with its own
 * Firestore database and bucket. Data is separate; ACCOUNTS ARE NOT. A Firebase
 * project has one set of Auth users, and a user's role lives in a custom claim
 * on that one account. So in QA, without this guard:
 *
 *   - a real person signing in would be registered against the empty QA
 *     database as a `client`, and that claim would overwrite their LIVE role;
 *   - adding, editing or deleting a user with a real address would change or
 *     delete that person's live account.
 *
 * When `TEST_ACCOUNT_EMAIL_DOMAINS` is set (comma-separated, e.g.
 * `legalterminus.test`), only accounts on those domains may sign in or be
 * created, changed or deleted. Unset — as it is in production — nothing here
 * has any effect.
 */
const domains = () => String(process.env.TEST_ACCOUNT_EMAIL_DOMAINS ?? '')
  .split(',').map((d) => d.trim().toLowerCase()).filter(Boolean);

/** True when this deployment is a guarded test environment. */
export const isTestEnvironment = () => domains().length > 0;

/** True when `email` may be used here. Always true outside a test environment. */
export function isAllowedAccountEmail(email) {
  const allowed = domains();
  if (!allowed.length) return true;
  const domain = String(email ?? '').trim().toLowerCase().split('@')[1];
  return !!domain && allowed.includes(domain);
}

export const TEST_ENVIRONMENT_MESSAGE =
  'This is a test environment. Only test accounts can be used here.';

/** Throw (status 403) when `email` is not usable in this environment. */
export function assertAllowedAccountEmail(email) {
  if (isAllowedAccountEmail(email)) return;
  const err = new Error(TEST_ENVIRONMENT_MESSAGE);
  err.status = 403;
  err.code = 'TEST_ENVIRONMENT';
  throw err;
}
