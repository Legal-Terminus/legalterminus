/**
 * #279 (firm, 11 Nov) — secret cells of a worksheet: the GST Return Filing
 * sheet's "GST Pswd". Pure, apart from reading the key from the environment.
 *
 * WHERE. A secret field is never kept in `values` (which every list response
 * sends). It lives in `secrets.<field>` on the record and leaves the server only
 * through the guarded reveal endpoint, one row at a time, audited.
 *
 * ENCRYPTED AT REST. AES-256-GCM, a fresh 12-byte IV per value, key from
 * `WORKSHEET_SECRETS_KEY` (32 bytes, base64; Secret Manager → Cloud Run env).
 * Stored as { v: 1, iv, tag, ct } (base64). Without the key (a deployment not
 * yet given one) a value is stored as { v: 0, plain } — still out of `values`
 * and out of every list, but NOT encrypted; it is encrypted the next time the
 * record is written or revealed once the key exists. Nothing is lost either way.
 *
 * MIGRATION. Records written before this kept the password in
 * `values.gst_password`. Every write and every reveal of such a record moves it
 * into `secrets` (encrypted when the key exists) and deletes it from `values`;
 * list responses never send it meanwhile.
 *
 * Never log a secret value.
 */
import crypto from 'node:crypto';
import { BOOKS } from '../config/worksheetDefinitions.js';

export const SECRET_MAX_LEN = 200;

/** The secret fields of a book (fields defined with `secret: true`). */
export function secretFieldsOf(bookKey) {
  return (BOOKS[bookKey]?.fields ?? []).filter((fd) => fd.secret).map((fd) => fd.key);
}

/** The key, or null when the deployment has none (or a malformed one). */
export function secretsKey(env = process.env) {
  const raw = env.WORKSHEET_SECRETS_KEY;
  if (!raw) return null;
  const key = Buffer.from(String(raw).trim(), 'base64');
  return key.length === 32 ? key : null;
}

export function encryptSecret(plain, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  return { v: 1, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), ct: ct.toString('base64') };
}

export function decryptSecret(blob, key) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(blob.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(blob.tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(blob.ct, 'base64')), decipher.final()]).toString('utf8');
}

/** How a value is stored: encrypted with the key, else plain (see the header). */
export function sealSecret(plain, key) {
  return key ? encryptSecret(plain, key) : { v: 0, plain: String(plain) };
}

/**
 * The plain value of a stored secret, or null. Throws when it is encrypted and
 * the key is missing or wrong (the caller answers with a generic error).
 */
export function openSecret(stored, key) {
  if (!stored) return null;
  if (stored.v === 0) return stored.plain ?? null;
  if (stored.v === 1) {
    if (!key) throw new Error('worksheet secrets key missing');
    return decryptSecret(stored, key);
  }
  return null;
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
 * secret ones (non-empty only) to be sealed.
 */
export function splitSecretValues(bookKey, values = {}) {
  const fields = secretFieldsOf(bookKey);
  const rest = {};
  const secrets = {};
  for (const [k, v] of Object.entries(values ?? {})) {
    if (fields.includes(k)) {
      const clean = cleanSecretInput(v);
      if (clean != null) secrets[k] = clean;
    } else rest[k] = v;
  }
  return { values: rest, secrets };
}

/**
 * The Firestore fields to write for a record of `bookKey`: each new secret
 * sealed, and each legacy plaintext value still in `values` moved out (sealed)
 * unless a new one replaces it. `values` is the record's values after the write;
 * the returned `values` has every secret field removed.
 *   → { values, secrets: { field: sealed }, moved: [field] }
 */
export function secretWrites(bookKey, { values = {}, existingSecrets = {}, incoming = {} }, key) {
  const fields = secretFieldsOf(bookKey);
  const clean = { ...values };
  const secrets = {};
  const moved = [];
  for (const f of fields) {
    const legacy = clean[f];
    delete clean[f];
    if (incoming[f] != null) secrets[f] = sealSecret(incoming[f], key);
    else if (legacy != null && legacy !== '' && !existingSecrets?.[f]) { secrets[f] = sealSecret(legacy, key); moved.push(f); }
    else if (existingSecrets?.[f]?.v === 0 && key) secrets[f] = sealSecret(existingSecrets[f].plain, key); // encrypt once a key exists
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
