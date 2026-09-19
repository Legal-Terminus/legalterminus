import crypto from 'node:crypto';
import { logger } from '../config/logger.js';
import {
  parseWebhookUrl, assertResolvableTarget, signPayload, newSigningSecret,
  SIGNATURE_HEADER, TIMESTAMP_HEADER, DELIVERY_TIMEOUT_MS, WebhookTargetError,
} from './webhookTargets.service.js';

/**
 * Story 33.2 — webhook subscriptions and delivery (Epic 33).
 *
 * ── Thin payloads ──
 *
 * A delivery carries ids and an event name, never the record itself. Three
 * reasons, all learned from the field (Karbon ships exactly this shape):
 * a payload cannot go stale between send and receipt; a leaked endpoint leaks
 * ids rather than a client's data; and the consumer re-fetches through the v1
 * API, where scopes and tenancy are already enforced.
 *
 * ── Subscriptions live in the WORKSPACE database ──
 *
 * Unlike API keys, which must be resolved before we know the tenant, a
 * subscription is only ever read while already inside a workspace's request or
 * sweep. So it belongs with that firm's own data, and workspace deletion takes
 * it along.
 */

const SUBS = 'webhookSubscriptions';
const DELIVERIES = 'deliveries';

/** The event catalog. Adding one here is the only way to add one. */
export const WEBHOOK_EVENTS = [
  'matter.created',
  'matter.step_entered',
  'matter.completed',
  'payment.recorded',
  'document.approved',
  'matter.stuck',
  // E01-S34-3: a client completed a form step. dispatchEvent DROPS unknown
  // events, so an emit without this entry would silently do nothing.
  'form.submitted',
];

/** Endpoints per workspace. A cap keeps one firm's fan-out bounded. */
export const MAX_SUBSCRIPTIONS = 10;

/** Consecutive failures before a subscription disables itself (AC4). */
export const FAILURE_LIMIT = 10;

/** Retry backoff in ms. Five attempts total, then the delivery is dead (AC3). */
export const RETRY_DELAYS_MS = [0, 1_000, 5_000, 30_000, 120_000];

/** Deliveries kept per subscription for the log (AC5). */
export const DELIVERY_HISTORY = 50;

export function presentSubscription(id, d) {
  return {
    id,
    url: d.url ?? null,
    events: d.events ?? [],
    enabled: d.enabled !== false,
    createdAt: d.createdAt ?? null,
    lastSuccessAt: d.lastSuccessAt ?? null,
    lastFailureAt: d.lastFailureAt ?? null,
    consecutiveFailures: d.consecutiveFailures ?? 0,
    disabledReason: d.disabledReason ?? null,
    // The secret is shown once at creation and never again, exactly like an API
    // key — a consumer that loses it rotates rather than recovers it.
    secretHint: d.secret ? `${String(d.secret).slice(0, 12)}…` : null,
  };
}

export async function listSubscriptions(db) {
  const snap = await db.collection(SUBS).get();
  return snap.docs
    .map((d) => presentSubscription(d.id, d.data()))
    .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));
}

/** Validate and store a subscription. Returns the secret ONCE. */
export async function createSubscription(db, { url, events, createdBy }, deps = {}) {
  const chosen = (Array.isArray(events) ? events : []).filter((e) => WEBHOOK_EVENTS.includes(e));
  if (chosen.length === 0) {
    throw new WebhookTargetError('Choose at least one event to send.', 'NO_EVENTS');
  }

  const parsed = parseWebhookUrl(url);
  await assertResolvableTarget(parsed, deps);

  const existing = await db.collection(SUBS).get();
  if (existing.size >= MAX_SUBSCRIPTIONS) {
    throw new WebhookTargetError(`A workspace can have at most ${MAX_SUBSCRIPTIONS} webhooks.`, 'TOO_MANY');
  }

  const secret = newSigningSecret();
  const id = crypto.randomBytes(10).toString('hex');
  const record = {
    url: parsed.toString(),
    events: chosen,
    secret,
    enabled: true,
    consecutiveFailures: 0,
    createdBy: createdBy ?? null,
    createdAt: new Date().toISOString(),
    lastSuccessAt: null,
    lastFailureAt: null,
    disabledReason: null,
  };
  await db.collection(SUBS).doc(id).set(record);
  return { id, secret, subscription: presentSubscription(id, record) };
}

/** The body a consumer receives. Ids only — see the header note. */
export function buildPayload({ event, data, now = Date.now() }) {
  return JSON.stringify({
    event,
    // Workspace-neutral in the sense that a consumer never needs it to act, but
    // present so a consumer serving several firms can route the callback.
    occurredAt: new Date(now).toISOString(),
    data,
  });
}

/**
 * Deliver once. Returns `{ ok, status, ms, error }` and NEVER throws — a failed
 * webhook is a logged delivery, not an exception in a background worker.
 */
export async function deliverOnce({ subscription, body, now = Date.now(), fetchImpl = fetch, deps = {} }) {
  const startedAt = Date.now();
  try {
    // Re-validate the TARGET, not just the URL string: DNS may have changed
    // since registration (rebinding). See webhookTargets.service.js.
    const parsed = parseWebhookUrl(subscription.url);
    await assertResolvableTarget(parsed, deps);

    const timestamp = String(Math.floor(now / 1000));
    const signature = signPayload({ secret: subscription.secret, timestamp, body });

    const res = await fetchImpl(subscription.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        [SIGNATURE_HEADER]: signature,
        [TIMESTAMP_HEADER]: timestamp,
        'user-agent': 'Cometflow-Webhook/1',
      },
      body,
      signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
      // A redirect could bounce us to an internal address AFTER the check, so
      // redirects are refused rather than followed.
      redirect: 'manual',
    });

    const ms = Date.now() - startedAt;
    // 2xx only. A 3xx is a redirect we deliberately did not follow.
    const ok = res.status >= 200 && res.status < 300;
    return { ok, status: res.status, ms, error: ok ? null : `HTTP ${res.status}` };
  } catch (err) {
    return {
      ok: false,
      status: null,
      ms: Date.now() - startedAt,
      error: String(err?.message ?? err).slice(0, 200),
    };
  }
}

/** Record the attempt and apply the auto-disable rule (AC4/AC5). */
export async function recordDelivery(db, subId, { event, result, now = Date.now() }) {
  const ref = db.collection(SUBS).doc(subId);
  const at = new Date(now).toISOString();

  await ref.collection(DELIVERIES).doc(`${now}-${crypto.randomBytes(4).toString('hex')}`).set({
    event,
    ok: result.ok,
    status: result.status ?? null,
    ms: result.ms ?? null,
    error: result.error ?? null,
    at,
  }).catch(() => { /* the log must never fail the delivery */ });

  if (result.ok) {
    await ref.set({ lastSuccessAt: at, consecutiveFailures: 0 }, { merge: true });
    return { disabled: false };
  }

  // Read-then-write rather than an atomic increment: this runs in a background
  // worker where a lost count is harmless, and it keeps the double testable.
  const snap = await ref.get();
  const failures = (Number(snap.data()?.consecutiveFailures) || 0) + 1;
  const disable = failures >= FAILURE_LIMIT;
  await ref.set({
    lastFailureAt: at,
    consecutiveFailures: failures,
    ...(disable ? { enabled: false, disabledReason: `${FAILURE_LIMIT} consecutive delivery failures` } : {}),
  }, { merge: true });

  if (disable) logger.warn({ subId, failures }, 'webhook subscription auto-disabled');
  return { disabled: disable, failures };
}

/**
 * Send one event to every enabled subscription that wants it.
 *
 * Called AFTER the triggering action has committed and never awaited on the
 * request path (AC3): a firm's slow endpoint must not slow down the person who
 * clicked the button.
 */
export async function dispatchEvent(db, { event, data, now = Date.now(), fetchImpl, deps }) {
  if (!WEBHOOK_EVENTS.includes(event)) return { sent: 0 };

  let subs;
  try {
    subs = await db.collection(SUBS).where('events', 'array-contains', event).get();
  } catch (err) {
    logger.warn({ err: err?.message, event }, 'webhook dispatch: subscription lookup failed');
    return { sent: 0 };
  }

  const body = buildPayload({ event, data, now });
  let sent = 0;

  for (const doc of subs.docs) {
    const sub = doc.data();
    if (sub.enabled === false) continue;
    try {
      const result = await deliverOnce({ subscription: sub, body, now, fetchImpl, deps });
      await recordDelivery(db, doc.id, { event, result, now });
      if (result.ok) sent += 1;
    } catch (err) {
      // One broken subscription must not stop the others.
      logger.warn({ err: err?.message, subId: doc.id }, 'webhook delivery threw');
    }
  }
  return { sent };
}

/** The last N attempts, newest first (AC5). */
export async function listDeliveries(db, subId) {
  const snap = await db.collection(SUBS).doc(subId).collection(DELIVERIES).get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => String(b.at ?? '').localeCompare(String(a.at ?? '')))
    .slice(0, DELIVERY_HISTORY);
}
