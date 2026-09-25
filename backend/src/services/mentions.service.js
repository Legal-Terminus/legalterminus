import { STAFF_ROLES } from '../config/roles.js';
import { logger } from '../config/logger.js';

/**
 * #200 — @mentions in a matter's discussion.
 *
 * A mention is `@` followed by a colleague's registered email address. It is read
 * from the PLAIN text of a message: the rich-text editor autolinks addresses, so
 * the HTML carries `@<a href="mailto:…">…</a>` while the plain projection reads
 * `@name@firm.com`.
 */

const MAX_MENTIONS = 20;
// `@` must start the text or follow a space/opening bracket/punctuation, so an
// address merely written in a sentence ("write to a@b.com") is not a mention.
const MENTION_RE = /(?:^|[\s([<,;:])@([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

/** Distinct, lower-cased mentioned addresses, capped. Pure. */
export function extractMentionEmails(plain) {
  const out = [];
  for (const m of String(plain ?? '').matchAll(MENTION_RE)) {
    const email = m[1].replace(/\.+$/, '').toLowerCase();
    if (!out.includes(email)) out.push(email);
    if (out.length >= MAX_MENTIONS) break;
  }
  return out;
}

/**
 * Resolve addresses to ACTIVE STAFF of this workspace. `db` is the workspace's
 * own database, so a user of another firm can never match. Clients and
 * professionals are dropped: an internal note must never reach them because
 * someone typed their address. Unknown addresses resolve to nothing, silently —
 * the caller answers identically either way, so nobody can probe who exists.
 */
export async function resolveStaffByEmails(db, emails) {
  if (!emails.length) return [];
  const chunks = [];
  for (let i = 0; i < emails.length; i += 30) chunks.push(emails.slice(i, i + 30));
  const snaps = await Promise.all(chunks.map((chunk) =>
    db.collection('users').where('email', 'in', chunk).get()
      .catch((err) => {
        logger.warn({ err }, 'resolveStaffByEmails: chunk lookup failed');
        return { docs: [] };
      })));
  const byUid = new Map();
  for (const snap of snaps) {
    for (const d of snap.docs) {
      const u = d.data();
      if (STAFF_ROLES.includes(u.role) && u.status !== 'deactivated') byUid.set(d.id, { uid: d.id, ...u });
    }
  }
  return [...byUid.values()];
}
