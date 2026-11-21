/**
 * #279 (firm, 11 Nov) — secret cells of a worksheet: the GST Return Filing
 * sheet's "GST Pswd". Pure.
 *
 * WHAT THE FIRM ASKED FOR: the password masked in the report, opened from the
 * report with one click, and changed through Edit by Admin, Manager and Team.
 *
 * WHERE. A secret field is never kept in `values` (which every list response and
 * every Excel download sends). It lives in `secrets.<field>` on the record as
 * { v: 0, plain } and leaves the server only through the staff-only reveal
 * endpoint, one row at a time. "Masked" therefore means not in the browser at
 * all until someone clicks, not just dots over a value the page already holds.
 *
 * NOT ENCRYPTED. Stored as typed. Encryption at rest, an access log and the
 * other sensitive columns (Traces / IT passwords) are out of scope for now; the
 * `v` tag leaves room for an encrypted format later without a data migration.
 *
 * MIGRATION. Records written before #279 kept the password in
 * `values.gst_password`. Every write and every reveal of such a record moves it
 * into `secrets` and deletes it from `values`; list responses never send it
 * meanwhile.
 *
 * Never log a secret value.
 */
import { BOOKS } from '../config/worksheetDefinitions.js';
import { isSafeKey } from '../utils/sanitize.js';

export const SECRET_MAX_LEN = 200;

/** The secret fields of a book (fields defined with `secret: true`). */
export function secretFieldsOf(bookKey) {
  return (BOOKS[bookKey]?.fields ?? []).filter((fd) => fd.secret).map((fd) => fd.key);
}

/** How a value is stored. */
export function sealSecret(plain) {
  return { v: 0, plain: String(plain) };
}

/** The plain value of a stored secret, or null. */
export function openSecret(stored) {
  if (!stored) return null;
  return stored.v === 0 ? (stored.plain ?? null) : null;
}

/**
 * A typed or uploaded secret: kept exactly as typed (no tag stripping — it is
 * never shown as HTML), only bounded. Empty → null ("no change": an empty
 * password box never wipes the stored one).
 */
export function cleanSecretInput(raw) {
  if (raw == null) return null;
  const s = String(raw);
  if (!s.trim()) return null;
  if (s.length > SECRET_MAX_LEN) {
    throw Object.assign(new Error('The password is too long.'), { status: 400 });
  }
  return s;
}

/**
 * Split incoming cell values: `values` without the secret fields, and the
 * secret ones (non-empty only) to be stored under `secrets`.
 */
export function splitSecretValues(bookKey, values = {}) {
  const fields = secretFieldsOf(bookKey);
  // CodeQL #73: the keys are the request's column names. Prototype names
  // (`__proto__`, `constructor`, `prototype`) are dropped, and both objects are
  // built with Object.fromEntries — no `obj[userKey] = …` write at all.
  const entries = Object.entries(values ?? {}).filter(([k]) => isSafeKey(k));
  const rest = Object.fromEntries(entries.filter(([k]) => !fields.includes(k)));
  const secrets = Object.fromEntries(entries
    .filter(([k]) => fields.includes(k))
    .map(([k, v]) => [k, cleanSecretInput(v)])
    .filter(([, clean]) => clean != null));
  return { values: rest, secrets };
}

/**
 * The Firestore fields to write for a record of `bookKey`: each new secret
 * stored, and each legacy value still in `values` moved out
 * unless a new one replaces it. `values` is the record's values after the write;
 * the returned `values` has every secret field removed.
 *   → { values, secrets: { field: sealed }, moved: [field] }
 */
export function secretWrites(bookKey, { values = {}, existingSecrets = {}, incoming = {} }) {
  const fields = secretFieldsOf(bookKey);
  const clean = { ...values };
  const secrets = {};
  const moved = [];
  for (const f of fields) {
    const legacy = clean[f];
    delete clean[f];
    if (incoming[f] != null) secrets[f] = sealSecret(incoming[f]);
    else if (legacy != null && legacy !== '' && !existingSecrets?.[f]) { secrets[f] = sealSecret(legacy); moved.push(f); }
  }
  return { values: clean, secrets, moved };
}

/** For list responses: which secret fields a record has, never their values. */
export function secretsSetOf(bookKey, data) {
  const out = {};
  for (const f of secretFieldsOf(bookKey)) {
    if (data?.secrets?.[f] || (data?.values?.[f] != null && data.values[f] !== '')) out[f] = true;
  }
  return out;
}

/** A record's values with every secret field removed (list and write responses). */
export function withoutSecrets(bookKey, values = {}) {
  const fields = secretFieldsOf(bookKey);
  return Object.fromEntries(Object.entries(values ?? {}).filter(([k]) => !fields.includes(k)));
}
