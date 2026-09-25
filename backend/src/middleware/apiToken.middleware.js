import { logger } from '../config/logger.js';
import { resolveToken, touchToken } from '../services/apiTokens.service.js';

/**
 * E21-S01/S02 — authentication for the public `/api/v1` surface.
 *
 * Deliberately a SEPARATE middleware rather than a branch inside `verifyToken`.
 * Every authenticated route in the product runs through that function; adding a
 * second credential type to it would put the entire session surface one bug
 * away from accepting an API key, and key-holders are not people — they have no
 * role, no seat, and must never reach a session route.
 *
 * So the split is structural: `/api/v1` accepts ONLY API keys, and everything
 * else accepts only Firebase ID tokens. Neither can be used on the other.
 *
 * After this runs, `req.user` carries a synthetic principal identifying the key
 * — never a person.
 */

/**
 * Every failure answers identically: same status, same body. A caller
 * that could tell "no such token" from "wrong secret" from "revoked" could
 * enumerate valid ids and learn which firms exist.
 */
function unauthorized(res) {
  return res.status(401).json({
    error: 'unauthorized',
    message: 'A valid API key is required. Pass it as: Authorization: Bearer akey_…',
  });
}

export async function verifyApiToken(req, res, next) {
  const header = req.headers.authorization ?? '';
  const raw = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!raw) return unauthorized(res);

  const principal = await resolveToken(raw);
  if (!principal) return unauthorized(res);

  // A synthetic principal. `role` is deliberately absent rather than faked: a
  // key is not a person, and any code that reads `req.user.role` to make a
  // decision must fail loudly here rather than silently treating a key as an
  // admin.
  req.user = {
    uid: `token:${principal.tokenId}`,
    apiToken: true,
    tokenId: principal.tokenId,
    scopes: principal.scopes,
  };
  req.apiToken = principal;

  // Fire-and-forget: last-used is telemetry and must never delay a request.
  touchToken(principal.tokenId);

  // Logged with the token id, NEVER the secret.
  req.log?.info?.({ tokenId: principal.tokenId }, 'api token request');
  next();
}

/**
 * Require a scope. Unlike authentication, a scope failure names the missing
 * scope: the caller has already proved who they are, so telling them what
 * they lack is help rather than disclosure.
 */
export function requireScope(scope) {
  return (req, res, next) => {
    if (!req.user?.apiToken) {
      // Belt and braces: a scope check on a route that somehow skipped auth
      // must fail closed rather than pass.
      logger.error({ path: req.path }, 'requireScope reached without an API token');
      return unauthorized(res);
    }
    if (!req.user.scopes?.includes(scope)) {
      return res.status(403).json({
        error: 'insufficient_scope',
        message: `This API key does not have the '${scope}' scope.`,
        required: scope,
      });
    }
    next();
  };
}
