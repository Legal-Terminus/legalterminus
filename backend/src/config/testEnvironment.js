/**
 * Keeps test accounts and real accounts apart, in both directions.
 *
 * WHY. The QA deployment (E24-S00) runs in the live project with its own
 * Firestore database and bucket. Data is separate; ACCOUNTS ARE NOT. A Firebase
 * project has one set of Auth users, and a user's role lives in a custom claim
 * on that one account. So without a guard:
 *
 *   - on QA, a real person signing in would be registered against the empty QA
 *     database as a `client`, and that claim would overwrite their LIVE role;
 *     adding, editing or deleting a user with a real address would change or
 *     delete that person's live account;
 *   - on PRODUCTION, a QA test account — whose password is handed to testers,
 *     and which carries an `admin` claim — would be a signed-in admin.
 *
 * The rule, enforced here for the API and in firestore.rules for the database:
 *
 *   - `TEST_ACCOUNT_EMAIL_DOMAINS` set (QA, and the local e2e stack): ONLY
 *     accounts on those domains may sign in or be created, changed or deleted.
 *   - unset (production, and plain local development): every account EXCEPT
 *     those on a `.test` address. `.test` is a reserved domain — no real person
 *     can have one — so nothing legitimate is refused.
 */
const domains = () => String(process.env.TEST_ACCOUNT_EMAIL_DOMAINS ?? '')
  .split(',').map((d) => d.trim().toLowerCase()).filter(Boolean);

const domainOf = (email) => String(email ?? '').trim().toLowerCase().split('@')[1] || '';

/** An address on the reserved `.test` domain — a test account, never a person's. */
export const isTestAddress = (email) => /(^|\.)test$/.test(domainOf(email));

/** True when this deployment is a guarded test environment. */
export const isTestEnvironment = () => domains().length > 0;

/** True when `email` may be used in this deployment. */
export function isAllowedAccountEmail(email) {
  const allowed = domains();
  if (!allowed.length) return !isTestAddress(email);
  return allowed.includes(domainOf(email));
}

/** What to tell someone refused by the guard, for this deployment. */
export const accountRefusedMessage = () => (isTestEnvironment()
  ? 'This is a test environment. Only test accounts can be used here.'
  : 'This is a test account. It cannot be used here.');

/** @deprecated use accountRefusedMessage() — kept for callers that import the constant. */
export const TEST_ENVIRONMENT_MESSAGE =
  'This is a test environment. Only test accounts can be used here.';

/** Throw (status 403) when `email` is not usable in this deployment. */
export function assertAllowedAccountEmail(email) {
  if (isAllowedAccountEmail(email)) return;
  const err = new Error(accountRefusedMessage());
  err.status = 403;
  err.code = isTestEnvironment() ? 'TEST_ENVIRONMENT' : 'TEST_ACCOUNT';
  throw err;
}
