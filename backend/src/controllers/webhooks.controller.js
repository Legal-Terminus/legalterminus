import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import {
  listSubscriptions, createSubscription, listDeliveries, WEBHOOK_EVENTS,
} from '../services/webhooks.service.js';
import { WebhookTargetError } from '../services/webhookTargets.service.js';

/**
 * E21-S04 — webhook subscription management, ADMIN only.
 *
 * Subscriptions live alongside the rest of the firm's data. Admin-gated on the
 * route: a webhook target receives matter and payment events.
 */

const SUBS = 'webhookSubscriptions';

export async function listWebhooks(req, res) {
  try {
    res.json({ data: await listSubscriptions(db), events: WEBHOOK_EVENTS });
  } catch (err) {
    logger.error({ err }, 'listWebhooks failed');
    res.status(500).json({ message: 'Failed to load webhooks' });
  }
}

export async function createWebhook(req, res) {
  try {
    const { url, events } = req.body ?? {};
    const created = await createSubscription(db, { url, events, createdBy: req.user.uid });
    logger.info({ subId: created.id, by: req.user.uid }, 'webhook created');
    // The signing secret is returned ONCE, here.
    res.status(201).json(created);
  } catch (err) {
    // A target error is the CALLER's mistake and its message was written for
    // them ("that address is not reachable"), so it is safe and useful to
    // return. Anything else stays generic.
    if (err instanceof WebhookTargetError) {
      return res.status(400).json({ message: err.message, code: err.code });
    }
    logger.error({ err }, 'createWebhook failed');
    res.status(500).json({ message: 'Failed to create the webhook' });
  }
}

/** Disable or re-enable (AC4 — an auto-disabled subscription is re-enabled here). */
export async function setWebhookEnabled(req, res) {
  try {
    const ref = db.collection(SUBS).doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: 'Webhook not found' });

    const enabled = req.body?.enabled !== false;
    await ref.set({
      enabled,
      // Re-enabling clears the failure count, so a fixed endpoint gets a clean
      // run at the limit rather than being disabled again on its next stumble.
      ...(enabled ? { consecutiveFailures: 0, disabledReason: null } : {}),
    }, { merge: true });
    res.json({ enabled });
  } catch (err) {
    logger.error({ err }, 'setWebhookEnabled failed');
    res.status(500).json({ message: 'Failed to update the webhook' });
  }
}

export async function deleteWebhook(req, res) {
  try {
    const ref = db.collection(SUBS).doc(req.params.id);
    if (!(await ref.get()).exists) return res.status(404).json({ message: 'Webhook not found' });
    await ref.delete();
    logger.info({ subId: req.params.id, by: req.user.uid }, 'webhook deleted');
    res.json({ deleted: true });
  } catch (err) {
    logger.error({ err }, 'deleteWebhook failed');
    res.status(500).json({ message: 'Failed to delete the webhook' });
  }
}

export async function listWebhookDeliveries(req, res) {
  try {
    const snap = await db.collection(SUBS).doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ message: 'Webhook not found' });
    res.json({ data: await listDeliveries(db, req.params.id) });
  } catch (err) {
    logger.error({ err }, 'listWebhookDeliveries failed');
    res.status(500).json({ message: 'Failed to load deliveries' });
  }
}
