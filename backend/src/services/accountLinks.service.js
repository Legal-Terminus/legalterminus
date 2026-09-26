/**
 * Account links — the password-setup, password-reset and one-time sign-in
 * links we email to people (#203).
 *
 * WHY THIS EXISTS. Every link used to be the raw output of
 * `generatePasswordResetLink(email)`:
 *
 *   https://<project>.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=…&apiKey=…
 *
 * A client who had never asked for an account received an email saying
 * "set your password", pointing at a domain that is not the firm's, with an
 * `apiKey` in it, landing on an unbranded "Reset your password" page for an
 * account they never had — and, once done, stranded there with no way into the
 * portal. A real client read it as phishing.
 *
 * So the backend keeps generating the one-time code (Firebase still owns
 * verification, expiry and single use) but only the CODE leaves this module:
 * the emailed link is always the portal's own `/account/action` page, on the
 * firm's domain, and that page finishes the job and signs the person in.
 *
 * Ported from Ambyflow Story 42.9 (single-tenant: one `users` collection).
 *
 * The query shape (`mode`, `oobCode`) deliberately matches Firebase's custom
 * email-action handler, so pointing the Firebase console's "action URL" at the
 * same page makes any Firebase-sent email land there too.
 */
import { admin } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { publicSiteUrl } from './emailService.js';

/** The portal's public base URL — the site (FRONTEND_URL, else the live domain) + `/portal`. */
export const portalBase = () => `${publicSiteUrl()}/portal`;

/**
 * What the link is FOR, which the portal page uses only for its wording:
 * `setup` — first password on an account someone created for you;
 * `reset` — you asked for a new one.
 */
export const LINK_INTENTS = Object.freeze(['setup', 'reset']);

/**
 * Re-point a Firebase action link at the portal. Only `oobCode` is carried
 * across; the `apiKey` stays out of the email (the portal page adds its own).
 * Exported for tests.
 */
export const toPortalLink = (firebaseLink, { mode, intent } = {}) => {
  const code = new URL(firebaseLink).searchParams.get('oobCode');
  if (!code) throw new Error('Firebase action link carried no oobCode');
  const params = new URLSearchParams({ mode, oobCode: code });
  if (intent) params.set('intent', intent);
  return `${portalBase()}/account/action?${params.toString()}`;
};

/** A link that lets `email` choose a password, landing in the portal. */
export const passwordLinkFor = async (email, { intent = 'setup', auth = admin.auth() } = {}) => {
  // No continue URL: our page signs the person straight in and never reads
  // one, and passing it would make every invite fail wherever the portal's
  // domain is missing from Firebase's authorised domains (as localhost was on
  // one project). A sign-in link, below, cannot avoid needing it.
  const raw = await auth.generatePasswordResetLink(email);
  return toPortalLink(raw, { mode: 'resetPassword', intent: LINK_INTENTS.includes(intent) ? intent : 'setup' });
};

/**
 * A one-time, passwordless sign-in link. Throws `auth/operation-not-allowed`
 * when the project has not enabled email-link sign-in — callers decide whether
 * to fall back to a password link.
 */
export const signInLinkFor = async (email, { auth = admin.auth() } = {}) => {
  const raw = await auth.generateSignInWithEmailLink(email, {
    url: `${portalBase()}/account/action`,
    handleCodeInApp: true,
  });
  return toPortalLink(raw, { mode: 'signIn' });
};

/** True when the project has email-link sign-in switched off. */
export const isEmailLinkDisabled = (err) =>
  err?.code === 'auth/operation-not-allowed'
  || /OPERATION_NOT_ALLOWED|sign-in provider is disabled/i.test(err?.message || '');

/**
 * Name and address of whoever set the account up, for the "who is this from"
 * line. Best effort: a missing or unreadable record just drops the line.
 */
export const describeInviter = async (db, uid) => {
  if (!db || !uid || uid === 'admin' || uid === 'self') return null;
  try {
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) return null;
    const { name, email } = snap.data() || {};
    return name || email ? { name: name || email, email: email || null } : null;
  } catch (err) {
    logger.warn({ err, uid }, '[account-links] could not read inviter');
    return null;
  }
};

const firmName = () => 'Legal Terminus';

/**
 * The account-setup email. Written for someone who did NOT ask for an account:
 * it says who set it up and why, what the button does, the alternatives to a
 * password, and who to ask if it looks wrong — the four things the old one-line
 * message left a client to guess.
 */
export const setupEmail = ({ name, role, link, inviter }) => {
  const org = firmName();
  const who = inviter?.name ? `${inviter.name} at ${org}` : org;
  const purpose = role === 'client'
    ? `so you can follow your matters, share documents and approve work with ${org} in one place`
    : `so you can work on ${org}'s matters`;
  const contact = inviter?.email
    ? `Not expecting this? Contact ${inviter.name} (${inviter.email}) before using the link.`
    : `Not expecting this? Contact ${org} before using the link.`;
  return {
    title: `${who} set up your account`,
    message: [
      `Hello ${name || 'there'},`,
      '',
      `${who} has created an account for you on the ${org} portal, ${purpose}.`,
      '',
      'To get started, create your password with the button below. The link is for you alone and works once.',
      '',
      'Prefer not to use a password? On the sign-in page you can continue with Google (if this address is a Google account) or ask for a one-time sign-in link by email.',
      '',
      contact,
    ].join('\n'),
    action: { label: 'Create your password', url: link },
  };
};

/** The email for a password reset the person asked for. */
export const resetEmail = ({ link }) => ({
  title: 'Choose a new password',
  message: [
    `Someone — hopefully you — asked to reset the password for your ${firmName()} account.`,
    '',
    'Use the button below to choose a new one. The link works once and expires soon.',
    '',
    'If you did not ask for this, ignore this email: your password stays as it is.',
  ].join('\n'),
  action: { label: 'Choose a new password', url: link },
});

/** The one-time sign-in email — requested by the person, or sent by staff. */
export const signInEmail = ({ link, sentBy }) => ({
  title: `Sign in to ${firmName()}`,
  message: [
    sentBy?.name
      ? `${sentBy.name} sent you a link to sign in to the ${firmName()} portal.`
      : `Here is the sign-in link you asked for.`,
    '',
    'Use the button below to sign in — no password needed. The link works once and expires soon. Open it on the device you want to sign in on.',
    '',
    'If you did not expect this, ignore this email: nobody can sign in without the link.',
  ].join('\n'),
  action: { label: 'Sign in', url: link },
});

/**
 * The sign-in email's stand-in when the project has email-link sign-in switched
 * off: the person still gets in with one click, by choosing a password.
 */
export const passwordAccessEmail = ({ link, sentBy }) => ({
  title: `Sign in to ${firmName()}`,
  message: [
    sentBy?.name
      ? `${sentBy.name} sent you a link to get into the ${firmName()} portal.`
      : `Here is the link you asked for to get into your ${firmName()} account.`,
    '',
    'Use the button below to choose a password — you will be signed in straight away. The link works once and expires soon.',
    '',
    'If you did not expect this, ignore this email: nothing changes without the link.',
  ].join('\n'),
  action: { label: 'Choose a password and sign in', url: link },
});
