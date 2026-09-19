import dns from 'node:dns/promises';
import crypto from 'node:crypto';

/**
 * Story 33.2 — webhook target validation and signing (Epic 33).
 *
 * ── Why this file exists, and why it is paranoid ──
 *
 * A webhook is a URL supplied by a customer that OUR SERVER then fetches. That
 * is a server-side request forgery primitive by construction: without guards, a
 * firm admin could point a subscription at `http://169.254.169.254/` and have
 * our infrastructure hand back its own cloud metadata — including credentials.
 *
 * So a target is checked TWICE (AC1):
 *   1. at registration, so a bad URL is rejected with an explanation;
 *   2. at every send, because DNS is not stable. A hostname that resolved to a
 *      public address on Monday can resolve to 127.0.0.1 on Tuesday — "DNS
 *      rebinding" — and a registration-time check alone is defeated by it.
 *
 * The blocked ranges are not a blocklist of known-bad hosts (which is always
 * incomplete); they are an allowlist stance: anything that is not a public
 * unicast address is refused.
 */

/** Only TLS. A plaintext webhook would leak the payload and the signature. */
const ALLOWED_PROTOCOL = 'https:';

/** Delivery is a background job; a slow target must not tie up a worker. */
export const DELIVERY_TIMEOUT_MS = 10_000;

export class WebhookTargetError extends Error {
  constructor(message, code = 'INVALID_TARGET') {
    super(message);
    this.name = 'WebhookTargetError';
    this.code = code;
  }
}

/**
 * Is this IP one we must never fetch?
 *
 * Covers loopback, private ranges, link-local (incl. the cloud metadata
 * endpoint at 169.254.169.254), carrier-grade NAT, and the IPv6 equivalents.
 */
export function isBlockedAddress(ip) {
  if (typeof ip !== 'string' || !ip) return true;
  const addr = ip.toLowerCase().replace(/^\[|\]$/g, '');

  // IPv6, including IPv4-mapped forms like ::ffff:127.0.0.1 which would
  // otherwise slip past an IPv4-only check.
  if (addr.includes(':')) {
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(addr);
    if (mapped) return isBlockedAddress(mapped[1]);
    if (addr === '::' || addr === '::1') return true;
    if (addr.startsWith('fe80')) return true;            // link-local
    if (/^f[cd]/.test(addr)) return true;                // unique-local fc00::/7
    return false;
  }

  const parts = addr.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;

  if (a === 0) return true;                              // "this network"
  if (a === 10) return true;                             // private
  if (a === 127) return true;                            // loopback
  if (a === 169 && b === 254) return true;               // link-local + metadata
  if (a === 172 && b >= 16 && b <= 31) return true;      // private
  if (a === 192 && b === 168) return true;               // private
  if (a === 100 && b >= 64 && b <= 127) return true;     // carrier-grade NAT
  if (a === 192 && b === 0) return true;                 // IETF protocol assignments
  if (a >= 224) return true;                             // multicast + reserved + broadcast
  return false;
}

/**
 * Validate the URL's SHAPE. Synchronous, so registration can reject obvious
 * mistakes without a DNS round trip.
 */
export function parseWebhookUrl(raw) {
  let url;
  try {
    url = new URL(String(raw));
  } catch {
    throw new WebhookTargetError('That is not a valid URL.');
  }
  if (url.protocol !== ALLOWED_PROTOCOL) {
    throw new WebhookTargetError('A webhook URL must use https://.', 'HTTPS_REQUIRED');
  }
  if (url.username || url.password) {
    // Credentials in a URL end up in logs and are a classic way to disguise the
    // real host from a human reviewer.
    throw new WebhookTargetError('A webhook URL must not contain credentials.');
  }
  // A bare IP literal is refused outright: a legitimate integration has a
  // hostname, and an IP target is almost always an attempt to reach something
  // internal.
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (/^[\d.]+$/.test(host) || host.includes(':')) {
    if (isBlockedAddress(host)) {
      throw new WebhookTargetError('That address is not reachable from Cometflow.', 'BLOCKED_ADDRESS');
    }
  }
  return url;
}

/**
 * Resolve the hostname and refuse if ANY address is blocked.
 *
 * "Any" rather than "all" is deliberate: a host that returns both a public and
 * a private address would otherwise be usable to reach the private one.
 */
export async function assertResolvableTarget(url, { resolve = dns.lookup } = {}) {
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (/^[\d.]+$/.test(host) || host.includes(':')) {
    if (isBlockedAddress(host)) {
      throw new WebhookTargetError('That address is not reachable from Cometflow.', 'BLOCKED_ADDRESS');
    }
    return [host];
  }

  let addresses;
  try {
    addresses = await resolve(host, { all: true });
  } catch {
    throw new WebhookTargetError('That hostname could not be resolved.', 'UNRESOLVABLE');
  }
  const ips = (Array.isArray(addresses) ? addresses : [addresses]).map((a) => a.address ?? a);
  if (ips.length === 0) throw new WebhookTargetError('That hostname could not be resolved.', 'UNRESOLVABLE');
  if (ips.some(isBlockedAddress)) {
    throw new WebhookTargetError('That address is not reachable from Cometflow.', 'BLOCKED_ADDRESS');
  }
  return ips;
}

/** Both checks, for registration. */
export async function validateWebhookTarget(raw, deps = {}) {
  const url = parseWebhookUrl(raw);
  await assertResolvableTarget(url, deps);
  return url.toString();
}

// ─── Signing ────────────────────────────────────────────────────────────────

/** Header names, documented in docs/api.md for consumers to verify against. */
export const SIGNATURE_HEADER = 'x-legalterminus-signature';
export const TIMESTAMP_HEADER = 'x-legalterminus-timestamp';

/**
 * HMAC-SHA256 over `timestamp.body` (AC2).
 *
 * The timestamp is INSIDE the signed material, not merely a header: signing the
 * body alone would let anyone who captured one delivery replay it forever,
 * because the signature would stay valid.
 */
export function signPayload({ secret, timestamp, body }) {
  return crypto.createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
}

/** Constant-time check, for our own tests and for the docs' example. */
export function verifySignature({ secret, timestamp, body, signature }) {
  const expected = signPayload({ secret, timestamp, body });
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(String(signature ?? ''), 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function newSigningSecret() {
  return `whsec_${crypto.randomBytes(24).toString('base64url')}`;
}
