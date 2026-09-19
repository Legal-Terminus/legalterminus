import { logger } from '../config/logger.js';
import { dispatchEvent } from './webhooks.service.js';

/**
 * E21-S04 — the fire-and-forget emit helper.
 *
 * Every call site is inside a request that has ALREADY committed its work. A
 * webhook must therefore never:
 *
 *   - delay the response (a firm's endpoint may take ten seconds), or
 *   - fail the action (a broken endpoint must not roll back a real transition).
 *
 * So this returns immediately and does the delivery on the next tick, swallowing
 * everything. `setImmediate` rather than a queue is the honest v1 answer: an
 * in-process send loses anything still queued if the instance is replaced
 * mid-flight. That is acceptable while deliveries are retried and visible in the
 * delivery log, and the durable upgrade (Cloud Tasks) is a drop-in replacement
 * for this one function — which is exactly why the indirection exists.
 */
export function emitWebhook(db, event, data) {
  if (!db || !event) return;
  setImmediate(() => {
    dispatchEvent(db, { event, data })
      .catch((err) => logger.warn({ err: err?.message, event }, 'webhook emit failed'));
  });
}
