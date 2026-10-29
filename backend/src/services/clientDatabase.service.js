import { clientLabel } from './clientGroupFees.service.js';

/**
 * LT #205 — the Client Database.
 *
 * The firm asked (6 Oct) for a SEPARATE screen holding nine contact fields per
 * client, edited only there and never through the client form. So the database
 * keeps its OWN values in `clientDatabase/{clientUid}`: editing a record never
 * touches the client's login email or profile.
 *
 * What the screen shows, per field, is the database value when one has been
 * saved, otherwise the value derived from the client's profile — so every
 * client has a row from the day it is created, without a backfill.
 *
 * Pure functions only — the controller does the reads and writes.
 */

export const CLIENT_DATABASE_COLLECTION = 'clientDatabase';

/** The nine fields, in the order the firm listed them. */
export const CLIENT_DATABASE_FIELDS = [
  'clientName',
  'contactPerson',
  'contactDesignation',
  'phone',
  'altPhone',
  'email',
  'altEmail',
  'address',
  'clientSince',
];

/**
 * Is this users doc a row of the database? A client, still active, and the
 * PRIMARY account — an additional login (#166, `primaryClientUid`) is a person
 * who signs in for that client, not a second client.
 */
export function isDatabaseClient(user) {
  return !!user
    && user.role === 'client'
    && !user.primaryClientUid
    && user.status !== 'deactivated';
}

/** A Firestore Timestamp, Date or ISO string → 'YYYY-MM-DD' (India time), or ''. */
export function toDateOnly(value) {
  if (!value) return '';
  let d;
  if (typeof value?.toDate === 'function') d = value.toDate();
  else if (value instanceof Date) d = value;
  else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  else d = new Date(value);
  if (Number.isNaN(d?.getTime?.())) return '';
  // The firm is in India: a client created at 00:30 IST joined on that IST day.
  return new Date(d.getTime() + 330 * 60_000).toISOString().slice(0, 10);
}

/** The nine values as the client's profile (its creation data) gives them. */
export function profileDefaults(user = {}) {
  const others = Array.isArray(user.emailIds)
    ? user.emailIds.filter((e) => e && e !== user.email)
    : [];
  return {
    // The firm / company when there is one, else the person — the same label
    // every report uses for a client.
    clientName: clientLabel(user),
    // The profile's "Full Name" is the person the firm deals with.
    contactPerson: user.name ?? user.fullName ?? '',
    contactDesignation: user.contactDesignation ?? '',
    phone: user.phone ?? '',
    altPhone: user.altPhone ?? '',
    email: user.email ?? '',
    altEmail: others.join(', '),
    address: [user.address, user.state].map((s) => String(s ?? '').trim()).filter(Boolean).join(', '),
    clientSince: toDateOnly(user.createdAt),
  };
}

/**
 * One row of the database: per field, the saved value when set, else the
 * profile's. A saved empty string counts as set — it is how a field is cleared
 * deliberately; only a field never saved falls back to the profile.
 */
export function mergeRecord(uid, user, saved) {
  const base = profileDefaults(user);
  const row = { uid };
  for (const f of CLIENT_DATABASE_FIELDS) {
    const v = saved?.[f];
    row[f] = typeof v === 'string' ? v : base[f];
  }
  row.updatedAt = saved?.updatedAt ?? null;
  return row;
}

/** Does this row match a free-text search (name, organisation, phone, email)? */
export function matchesSearch(row, user, search) {
  const q = String(search ?? '').trim().toLowerCase();
  if (!q) return true;
  const digits = q.replace(/\D/g, '');
  const text = [
    row.clientName, row.contactPerson, row.email, row.altEmail,
    user?.organisation, user?.businessName, user?.name,
  ].map((s) => String(s ?? '').toLowerCase());
  if (text.some((s) => s.includes(q))) return true;
  // Phone numbers match on digits, so "98765 43210" finds "9876543210".
  if (digits.length >= 3) {
    return [row.phone, row.altPhone].some((p) => String(p ?? '').replace(/\D/g, '').includes(digits));
  }
  return false;
}

/** Sort rows by client name, then uid so the order (and the cursor) is stable. */
export function sortRows(rows) {
  return rows.sort((a, b) => a.clientName.localeCompare(b.clientName, 'en', { sensitivity: 'base' })
    || a.uid.localeCompare(b.uid));
}
