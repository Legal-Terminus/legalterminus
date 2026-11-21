import { logger } from '../config/logger.js';

/**
 * #277 — a client's name on their matters.
 *
 * Every matter carries `clientName`, copied from the client's profile when the
 * matter is created. Twenty-odd readers use that copy — the Matters list, the
 * board, search, reports, the Excel workbook, the public API, every email — so
 * it is not something to remove in a bug fix. What was wrong is that nothing
 * ever refreshed it: rename a client and their existing matters kept the old
 * name forever.
 *
 * The rule here is "one source of truth, one writer": the client's PROFILE owns
 * the name, and `clientName` on a matter is a read-only cache of it that ONLY
 * this module rewrites, at the moment the profile's name changes. Every path
 * that can change a client's name (staff edit, the client's own profile edit,
 * a re-invite through upsertUser) calls `afterClientProfileWrite`.
 *
 * Reading the name at display time instead was the alternative. It was rejected
 * because it would mean a users lookup in every one of those readers — several
 * of them run outside a request (emails, the recurring sweep) — and any reader
 * that was missed would silently go on showing the stale copy, which is the bug.
 *
 * Records that are HISTORICAL by nature keep the name as it was: a refund, an
 * online order's customer name, a sent notification's text. Those describe what
 * happened at the time and must not be rewritten.
 */

/** The name a matter shows for its client — the same rule createTask always used. */
export function clientDisplayName(user) {
  if (!user) return '';
  return String(user.name || user.fullName || user.email || 'Client').trim();
}

/**
 * The client's name for the RENAME sync: their real name, or '' when the
 * profile has none. Unlike clientDisplayName it never falls back to the email
 * address, and a "name" that is an email is no name at all: sign-in used to
 * write the email over a client's name (#277), and copying that onto their
 * matters would replace a real name with an address. '' makes the sync a no-op.
 */
export function clientRealName(user) {
  if (!user) return '';
  const name = String(user.name || user.fullName || '').trim();
  return name && !name.includes('@') ? name : '';
}

/** Firestore caps a batch at 500 writes; stay clear of it. */
const BATCH_SIZE = 400;

/**
 * Rewrite `clientName` on every matter the client OWNS (`clientUid`).
 *
 * Matters where this client is only an additional contact (#188, `ccEmails`)
 * are untouched: their `clientName` names a different client — the owner.
 *
 * `updatedAt` is deliberately NOT bumped: renaming a client is not activity on
 * the matter, and bumping it would reshuffle the Matters list (ordered by
 * `updatedAt`) and wake every "quiet" signal.
 *
 * Idempotent — a matter already showing the name is skipped, so a second call
 * writes nothing. Returns the number of matters changed.
 */
export async function syncClientNameOnMatters(db, clientUid, name) {
  const next = String(name ?? '').trim();
  if (!clientUid || !next) return 0;

  const snap = await db.collection('tasks').where('clientUid', '==', clientUid).get();
  const stale = snap.docs.filter((d) => (d.data().clientName ?? '') !== next);
  for (let i = 0; i < stale.length; i += BATCH_SIZE) {
    const batch = db.batch();
    for (const d of stale.slice(i, i + BATCH_SIZE)) batch.update(d.ref, { clientName: next });
    await batch.commit();
  }
  if (stale.length) logger.info({ clientUid, matters: stale.length }, 'Client renamed: matter names refreshed');
  return stale.length;
}

/**
 * Call after a write to a users document that included a name. `user` is the
 * document as it now stands (the merge of what was there and what was written).
 *
 * Does nothing unless the user is a client. It does not compare against the
 * previous name: the sync is idempotent (a matter already right costs a read,
 * not a write), and NOT skipping means a save also repairs matters that an
 * earlier, failed sync left behind.
 *
 * Never throws: the profile save has already succeeded and must not be reported
 * as failed because the copy on the matters could not be refreshed. The failure
 * is logged, and `scripts/syncClientNamesOnMatters.mjs` repairs what it left.
 */
export async function afterClientProfileWrite(db, uid, user) {
  try {
    if (!user || user.role !== 'client') return 0;
    return await syncClientNameOnMatters(db, uid, clientRealName(user));
  } catch (err) {
    logger.error({ err, clientUid: uid }, 'Could not refresh the client name on their matters');
    return 0;
  }
}
