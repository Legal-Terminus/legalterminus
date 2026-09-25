import crypto from 'node:crypto';
import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';

/**
 * E21-S01 — API keys.
 *
 * Until now the only authentication was a Firebase ID token from an interactive
 * session, so a firm could not read its own data programmatically at all. This
 * adds a second strategy: a workspace-scoped API key.
 *
 * ── Secret handling ──
 *
 * The secret is shown once and stored only as a hash. `scrypt` is used rather
 * than a bare SHA: a token is a password-equivalent, and the whole point of a
 * KDF is that a leaked table is not directly usable. Comparison is
 * constant-time.
 */

const COLLECTION = 'apiTokens';

/** Identifies our keys in logs and support tickets without revealing anything. */
export const TOKEN_PREFIX = 'akey';

/** v1 scopes. Reads shipped before writes: a leaked read key cannot change anything. */
export const SCOPES = [
  'read:matters', 'read:clients', 'read:documents_meta',
  // Story 33.3. Writes are separate scopes so a read-only integration — the
  // common case — cannot create anything if its key leaks.
  'write:matters', 'write:clients',
];

const SCRYPT_KEYLEN = 32;
/** Cost parameters. N=16384 keeps verification ~50ms, which is fine per request. */
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

/** scrypt as a promise, so callers stay async/await. */
function scrypt(secret, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(secret, salt, SCRYPT_KEYLEN, SCRYPT_PARAMS, (err, key) => {
      if (err) reject(err); else resolve(key);
    });
  });
}

export async function hashSecret(secret, salt = crypto.randomBytes(16).toString('hex')) {
  const key = await scrypt(secret, salt);
  return { salt, hash: key.toString('hex') };
}

/**
 * Constant-time verification. A length mismatch is compared against a dummy of
 * equal length so the failure path does not leak the stored hash's size.
 */
export async function verifySecret(secret, salt, expectedHex) {
  try {
    const key = await scrypt(secret, salt);
    const expected = Buffer.from(expectedHex, 'hex');
    if (expected.length !== key.length) return false;
    return crypto.timingSafeEqual(key, expected);
  } catch {
    return false;
  }
}

/**
 * Parse `akey_<tokenId>_<secret>`. Returns null for anything malformed — the
 * caller must answer a bad token identically to a revoked one (AC4).
 */
export function parseToken(raw) {
  if (typeof raw !== 'string') return null;
  // Split on the FIRST TWO separators only. `base64url` legitimately contains
  // `_`, so a plain split('_') tears a valid secret apart — which silently made
  // a fraction of every batch of issued tokens permanently unusable, and looked
  // like flakiness rather than a bug.
  const match = /^([a-z]+)_([A-Za-z0-9]+)_(.+)$/.exec(raw);
  if (!match) return null;
  const [, prefix, tokenId, secret] = match;
  if (prefix !== TOKEN_PREFIX) return null;
  if (!/^[A-Za-z0-9]{16,40}$/.test(tokenId)) return null;
  if (!/^[A-Za-z0-9_-]{32,128}$/.test(secret)) return null;
  return { tokenId, secret };
}

/** A new token: the id, the secret shown once, and the record to store. */
export async function mintToken({ name, scopes, createdBy }) {
  const tokenId = crypto.randomBytes(12).toString('hex');
  const secret = crypto.randomBytes(32).toString('base64url');
  const { salt, hash } = await hashSecret(secret);

  const record = {
    name: String(name ?? '').trim().slice(0, 80) || 'Untitled token',
    // Unknown scopes are dropped rather than rejected silently later — a token
    // must never appear to hold a permission the checker will not honour.
    scopes: (Array.isArray(scopes) ? scopes : []).filter((s) => SCOPES.includes(s)),
    salt,
    hash,
    createdBy: createdBy ?? null,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    revokedAt: null,
  };

  return { tokenId, secret: `${TOKEN_PREFIX}_${tokenId}_${secret}`, record };
}

/**
 * Resolve a raw token to its principal, or null.
 *
 * EVERY failure returns null — malformed, unknown, revoked, wrong secret. A
 * caller that distinguished them would let an attacker enumerate valid ids.
 */
export async function resolveToken(raw, { db: dbOverride } = {}) {
  const parsed = parseToken(raw);
  if (!parsed) return null;

  try {
    const conn = dbOverride ?? db;
    const snap = await conn.collection(COLLECTION).doc(parsed.tokenId).get();
    if (!snap.exists) return null;
    const rec = snap.data();
    if (rec.revokedAt) return null;
    if (!(await verifySecret(parsed.secret, rec.salt, rec.hash))) return null;

    return {
      tokenId: parsed.tokenId,
      scopes: Array.isArray(rec.scopes) ? rec.scopes : [],
      name: rec.name ?? null,
    };
  } catch (err) {
    logger.error({ err }, 'resolveToken failed');
    return null;
  }
}

/** Stamp last-used. Fire-and-forget: never delay or fail a request for it. */
export function touchToken(tokenId, { db: dbOverride } = {}) {
  (dbOverride ?? db).collection(COLLECTION).doc(tokenId)
    .set({ lastUsedAt: new Date().toISOString() }, { merge: true })
    .catch(() => { /* telemetry must not break the request */ });
}

/** The safe projection: everything except the material that proves ownership. */
export function presentToken(id, rec) {
  return {
    id,
    name: rec.name ?? null,
    scopes: rec.scopes ?? [],
    createdAt: rec.createdAt ?? null,
    createdBy: rec.createdBy ?? null,
    lastUsedAt: rec.lastUsedAt ?? null,
    revokedAt: rec.revokedAt ?? null,
    // Enough to recognise a key in a list; never enough to use one.
    prefix: `${TOKEN_PREFIX}_${id.slice(0, 6)}…`,
  };
}

export async function listTokens({ db: dbOverride } = {}) {
  const snap = await (dbOverride ?? db).collection(COLLECTION).get();
  return snap.docs
    .map((d) => presentToken(d.id, d.data()))
    // Ordered in memory: an orderBy would silently DROP any record missing the
    // field, and a token that vanishes from the list is one nobody can revoke.
    .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));
}
