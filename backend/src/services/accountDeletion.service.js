/**
 * E29-S08 — a person asks for their own account to be deleted (App Store 5.1.1(v),
 * Play's Data safety answer). Design: architecture.md → "Account deletion".
 *
 * It is a REQUEST the firm completes, not a purge: a client's matters, invoices and
 * filings are records the firm must keep (Companies Act, GST). The request
 *   1. marks the profile (`deletionRequestedAt`, `deletionReason`, `status`);
 *   2. disables the sign-in account and ends its sessions, so the person cannot sign in
 *      again. (An ID token already issued stays valid until it expires, at most an
 *      hour; the app signs out at once, and refresh is revoked so none is renewed.)
 *   3. records the event (structured log line `account_deletion_requested`, plus the
 *      fields on the profile, which stay until the admin deletes the account);
 *   4. emails the firm's admins once.
 * An Admin then completes it with the existing delete on the Users page.
 *
 * Idempotent: a second request changes nothing and sends no second email.
 * Built here first (E-29); Ambyflow plans the same feature as its story 45.6.
 */
import { publicSiteUrl, sendNotificationEmail } from './emailService.js';

export const DELETION_REQUESTED_STATUS = 'deletion_requested';

/** The admin email addresses (a handful of documents, one query). */
async function adminEmails(db) {
  const snap = await db.collection('users').where('role', '==', 'admin').get();
  return snap.docs.map((d) => d.data()?.email).filter(Boolean);
}

/**
 * @param {{ db, auth, uid: string, reason?: string, log, now?: () => string, notify?: Function }} deps
 * @returns {Promise<{ alreadyRequested: boolean }>}
 */
export async function requestDeletion({
  db, auth, uid, reason, log, now = () => new Date().toISOString(), notify = sendNotificationEmail,
}) {
  const ref = db.collection('users').doc(uid);
  const at = now();
  const outcome = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : {};
    if (data.deletionRequestedAt) return { alreadyRequested: true, profile: data };
    tx.set(ref, {
      deletionRequestedAt: at,
      deletionReason: reason ? String(reason) : null,
      status: DELETION_REQUESTED_STATUS,
      updatedAt: at,
    }, { merge: true });
    return { alreadyRequested: false, profile: data };
  });

  // Disable even on a repeat: if a previous attempt marked the profile but failed
  // before this line, the account must still end up disabled.
  await auth.updateUser(uid, { disabled: true });
  await auth.revokeRefreshTokens(uid);

  if (outcome.alreadyRequested) {
    log.info({ uid, event: 'account_deletion_requested', repeat: true }, 'Account deletion already requested');
    return { alreadyRequested: true };
  }

  log.info({ uid, role: outcome.profile.role ?? null, event: 'account_deletion_requested' }, 'Account deletion requested');

  try {
    const to = await adminEmails(db);
    if (to.length) {
      const who = outcome.profile.name || outcome.profile.fullName || outcome.profile.email || 'A user';
      await notify({
        to: to.join(','),
        title: 'Account deletion requested',
        message: [
          `${who}${outcome.profile.email ? ` (${outcome.profile.email})` : ''} asked for their account to be deleted.`,
          'Their sign-in has been disabled. Open Users, filter "Deletion requested", and delete the account within 30 days.',
          reason ? `\nReason given:\n${reason}` : '',
        ].filter(Boolean).join('\n'),
        action: { label: 'Open Users', url: `${publicSiteUrl()}/portal/users` },
      });
    }
  } catch (err) {
    // The request itself has succeeded; a failed email must not undo it or fail it.
    log.warn({ err, uid }, 'Account deletion email to admins failed');
  }
  return { alreadyRequested: false };
}
