import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { BOOKS } from '../config/worksheetDefinitions.js';
import { createNotification } from '../controllers/notifications.controller.js';
import {
  pickReminder, reminderText, indiaToday, addPeriod, normalizeDate, OVERDUE_GRACE_DAYS,
} from './worksheetEngine.service.js';

/**
 * #217 — automatic KYC reminders: admins and managers are told 30 days and
 * 7 days before a director's next KYC falls due, and on the day.
 *
 * Same shape as the recurring-matter sweep (#167, runRecurringSweep): there is
 * no scheduler on Cloud Run, so the sweep runs DUE-ON-READ — any API request may
 * trigger it in the background, throttled per instance and serialised across
 * instances by a Firestore lock. It is idempotent: each record keeps
 * `remindersSent["<due>:<milestone>"]`, written BEFORE the notification goes
 * out, so a milestone is announced at most once even if two sweeps overlap.
 *
 * The query is bounded by the stored `reminderDue` (the computed due date,
 * re-derived on every write of the record): only records due within the next
 * 30 days or overdue by at most OVERDUE_GRACE_DAYS are read.
 */

const LOCK = { collection: 'system', id: 'worksheetReminderSweep' };
const RECENCY_MS = 6 * 60 * 60 * 1000;
const LOCK_MS = 2 * 60 * 1000;
const SCAN_LIMIT = 1000;

async function recipients(db) {
  const snap = await db.collection('users').where('role', 'in', ['admin', 'manager']).get();
  return snap.docs.map((d) => d.id);
}

/** True when a newer record for the same person (e.g. the same DIN) exists. */
async function isSuperseded(db, rec, rule) {
  const match = rec.values?.[rule.match];
  const mine = normalizeDate(rec.values?.[rule.later]);
  if (!match || !mine) return false;
  const snap = await db.collection('worksheetRecords')
    .where('book', '==', rec.book).where(`values.${rule.match}`, '==', match).limit(50).get();
  return snap.docs.some((d) => d.id !== rec.id && (normalizeDate(d.data().values?.[rule.later]) ?? '') > mine);
}

export async function runWorksheetReminderSweep({ force = false, now = Date.now() } = {}) {
  const db = getDb();
  const lockRef = db.collection(LOCK.collection).doc(LOCK.id);
  const claimed = await db.runTransaction(async (tx) => {
    const snap = await tx.get(lockRef);
    const d = snap.exists ? snap.data() : {};
    if (d.lockedAtMs && now - d.lockedAtMs < LOCK_MS) return 'locked';
    if (!force && d.lastRunAtMs && now - d.lastRunAtMs < RECENCY_MS) return 'recent';
    tx.set(lockRef, { lockedAtMs: now }, { merge: true });
    return 'ok';
  });
  if (claimed !== 'ok') return { sent: 0, skipped: claimed };

  let sent = 0;
  try {
    const today = indiaToday(now);
    const maxLead = Math.max(0, ...Object.values(BOOKS).flatMap((b) => b.reminder?.milestones ?? []));
    const snap = await db.collection('worksheetRecords')
      .where('reminderDue', '>=', addPeriod(today, { days: -OVERDUE_GRACE_DAYS }))
      .where('reminderDue', '<=', addPeriod(today, { days: maxLead }))
      .limit(SCAN_LIMIT).get();

    let audience = null;
    for (const doc of snap.docs) {
      const rec = { id: doc.id, ...doc.data() };
      const rule = BOOKS[rec.book]?.reminder;
      if (!rule) continue;
      const pick = pickReminder({ due: rec.reminderDue, today, milestones: rule.milestones, sent: rec.remindersSent });
      if (!pick) continue;

      const stamp = new Date(now).toISOString();
      const marks = Object.fromEntries(pick.markKeys.map((k) => [k, stamp]));
      if (rule.supersededBy && await isSuperseded(db, rec, rule.supersededBy)) {
        // A newer filing exists: this row's due date is history, not a deadline.
        await doc.ref.update({ remindersSent: { ...(rec.remindersSent ?? {}), ...marks } });
        continue;
      }
      // Marked first: at most once, even if the notification step fails.
      await doc.ref.update({ remindersSent: { ...(rec.remindersSent ?? {}), ...marks } });

      audience ??= await recipients(db);
      const { title, message } = reminderText({
        subject: rule.subject, daysLeft: pick.daysLeft, due: rec.reminderDue,
        describe: rule.describe.map((k) => rec.values?.[k]),
      });
      const taskId = typeof rec.values?.matter === 'string' ? rec.values.matter : undefined;
      for (const uid of audience) {
        try {
          await createNotification({ recipientUid: uid, type: pick.daysLeft <= 0 ? 'warning' : 'info', title, message, taskId });
        } catch (err) {
          logger.warn({ err, recordId: rec.id }, 'worksheet reminder notification failed');
        }
      }
      sent += 1;
    }
  } finally {
    await lockRef.set({ lockedAtMs: null, lastRunAtMs: Date.now(), lastSentCount: sent }, { merge: true });
  }
  if (sent) logger.info({ sent }, '#217 worksheet reminders sent');
  return { sent };
}

let lastCheckMs = 0;

/** Express middleware: fire the sweep in the background, never blocking the request. */
export function worksheetReminderTrigger(req, res, next) {
  const now = Date.now();
  if (now - lastCheckMs > 60_000) {
    lastCheckMs = now;
    setImmediate(() => {
      runWorksheetReminderSweep().catch((err) => logger.warn({ err }, '#217 background reminder sweep failed'));
    });
  }
  next();
}
