/**
 * Account links (#203): the "forgot password" and "email me a sign-in link"
 * requests from the sign-in page, and the staff "Send sign-in link" action.
 *
 * The two public handlers answer 202 { success: true } BEFORE doing anything,
 * whatever the address — so neither the body, the status nor the response time
 * says whether an account exists. The work runs after the reply.
 */
import { admin, db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { canAssignRole } from '../config/roles.js';
import { sendNotificationEmail } from '../services/emailService.js';
import {
  passwordLinkFor,
  signInLinkFor,
  isEmailLinkDisabled,
  resetEmail,
  signInEmail,
  passwordAccessEmail,
} from '../services/accountLinks.service.js';

const accepted = (res) => res.status(202).json({ success: true });

/**
 * The live member behind an address, or null. A disabled Auth account or a
 * member record that is gone or deactivated means "send nothing" — the same
 * people verifyToken would refuse.
 */
const resolveMember = async (email) => {
  let record;
  try {
    record = await admin.auth().getUserByEmail(email);
  } catch {
    return null;
  }
  if (record.disabled) return null;
  const doc = await db.collection('users').doc(record.uid).get();
  if (!doc.exists || doc.data()?.status === 'deactivated') return null;
  return { uid: record.uid };
};

/**
 * Email a one-time sign-in link. Where the project has email-link sign-in
 * switched off, a password link does the same job — the person still gets in,
 * by choosing a password. Returns { sent, method }.
 */
const deliverSignIn = async ({ email, sentBy }) => {
  try {
    const link = await signInLinkFor(email);
    const sent = await sendNotificationEmail({ to: email, ...signInEmail({ link, sentBy }) });
    return { sent: Boolean(sent), method: 'link' };
  } catch (err) {
    if (!isEmailLinkDisabled(err)) throw err;
    logger.warn('[account-links] email-link sign-in is disabled — sending a password link');
    const link = await passwordLinkFor(email, { intent: 'reset' });
    const sent = await sendNotificationEmail({ to: email, ...passwordAccessEmail({ link, sentBy }) });
    return { sent: Boolean(sent), method: 'password' };
  }
};

const inBackground = (label, fn) => setImmediate(() => {
  fn().catch((err) => logger.error({ err }, `[account-links] ${label} failed`));
});

/** POST /api/public/account/password-reset — public, uniform. */
export const requestPasswordReset = (req, res) => {
  const { email } = req.body;
  accepted(res);
  inBackground('password reset', async () => {
    const member = await resolveMember(email);
    if (!member) return;
    const link = await passwordLinkFor(email, { intent: 'reset' });
    await sendNotificationEmail({ to: email, ...resetEmail({ link }) });
    logger.info({ uid: member.uid }, '[account-links] password reset sent');
  });
};

/** POST /api/public/account/sign-in-link — public, uniform. */
export const requestSignInLink = (req, res) => {
  const { email } = req.body;
  accepted(res);
  inBackground('sign-in link', async () => {
    const member = await resolveMember(email);
    if (!member) return;
    const { method } = await deliverSignIn({ email });
    logger.info({ uid: member.uid, method }, '[account-links] sign-in link sent');
  });
};

/**
 * POST /api/portal/users/:uid/sign-in-link — staff send a person a one-time
 * sign-in link, so nobody has to handle a password on a client's behalf.
 * Same privilege rule as editing them: you may only do this for someone whose
 * role you could assign.
 */
export const sendUserSignInLink = async (req, res) => {
  try {
    const { uid } = req.params;
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) return res.status(404).json({ message: 'User not found.' });
    const target = snap.data() || {};
    if (target.status === 'deactivated') {
      return res.status(409).json({ message: 'This user is deactivated. Reactivate them before sending a sign-in link.' });
    }
    if (!canAssignRole(req.user.role, target.role)) {
      return res.status(403).json({ message: 'You do not have permission to send a sign-in link to this user.' });
    }
    if (!target.email) {
      return res.status(409).json({ message: 'This user has no email address on file.' });
    }

    const actor = await db.collection('users').doc(req.user.uid).get();
    const sentBy = { name: actor.data()?.name || actor.data()?.email || null };
    const { sent, method } = await deliverSignIn({
      email: target.email, sentBy: sentBy.name ? sentBy : null,
    });
    // LT has no audit collection; the structured log is the record.
    logger.info({ actorUid: req.user.uid, targetUid: uid, method, sent }, '[account-links] staff sent sign-in link');
    return res.json({ sent, method, email: target.email });
  } catch (error) {
    logger.error({ err: error }, '[SEND_SIGN_IN_LINK_ERROR]');
    return res.status(500).json({ message: 'Could not send the sign-in link. Please try again.' });
  }
};
