import { logger } from '../config/logger.js';
import { db } from '../config/firebase.js';
import { mintToken, listTokens, presentToken, SCOPES } from '../services/apiTokens.service.js';

/**
 * E21-S01 — API key management, admin only.
 *
 * Access is gated entirely by the route's role guard: this portal is
 * single-tenant, so there is no second scoping layer behind it. The secret is
 * returned exactly ONCE, at creation — a lost key is replaced, never recovered.
 */

const COLLECTION = 'apiTokens';

export async function listApiTokens(req, res) {
  try {
    res.json({ data: await listTokens(), scopes: SCOPES });
  } catch (err) {
    logger.error({ err }, 'listApiTokens failed');
    res.status(500).json({ message: 'Failed to load API keys' });
  }
}

/**
 * Create a key. The secret is returned EXACTLY ONCE, here — it is stored only
 * as a hash, so there is no later endpoint that can reveal it. That is the
 * point: a leaked database does not leak working keys.
 */
export async function createApiToken(req, res) {
  try {
    const { name, scopes } = req.body ?? {};
    const requested = Array.isArray(scopes) ? scopes : [];
    const unknown = requested.filter((s) => !SCOPES.includes(s));
    if (unknown.length) {
      return res.status(400).json({ message: `Unknown scope(s): ${unknown.join(', ')}` });
    }
    if (requested.length === 0) {
      // A key with no scopes can do nothing; creating one is always a mistake.
      return res.status(400).json({ message: 'Choose at least one scope for this key.' });
    }

    const { tokenId, secret, record } = await mintToken({
      name, scopes: requested, createdBy: req.user.uid,
    });
    await db.collection(COLLECTION).doc(tokenId).set(record);

    logger.info({ tokenId, by: req.user.uid }, 'api token created');
    res.status(201).json({
      // Shown once and never again.
      secret,
      token: presentToken(tokenId, record),
    });
  } catch (err) {
    logger.error({ err }, 'createApiToken failed');
    res.status(500).json({ message: 'Failed to create the API key' });
  }
}

/**
 * Revoke a key. A soft revoke (a `revokedAt` stamp) rather than a delete, so
 * the audit trail of what a key did survives it — `resolveToken` refuses a
 * revoked record immediately.
 */
export async function revokeApiToken(req, res) {
  try {
    const ref = db.collection(COLLECTION).doc(req.params.tokenId);
    const snap = await ref.get();
    // An unknown id is "not found", never "forbidden" — the latter would confirm
    // that the id exists.
    if (!snap.exists) {
      return res.status(404).json({ message: 'API key not found' });
    }
    if (snap.data()?.revokedAt) {
      return res.status(409).json({ message: 'That API key is already revoked.' });
    }

    await ref.set({ revokedAt: new Date().toISOString(), revokedBy: req.user.uid }, { merge: true });
    logger.info({ tokenId: req.params.tokenId, by: req.user.uid },
      'api token revoked');
    res.json({ revoked: true });
  } catch (err) {
    logger.error({ err }, 'revokeApiToken failed');
    res.status(500).json({ message: 'Failed to revoke the API key' });
  }
}
