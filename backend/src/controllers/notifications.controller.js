import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { sendNotificationEmail } from '../services/emailService.js';

const COLLECTION = 'notifications';

const toMillis = (ts) =>
  ts?.toMillis?.() ?? (ts ? new Date(ts).getTime() : 0) ?? 0;

const toISO = (ts) => {
  const ms = toMillis(ts);
  return ms ? new Date(ms).toISOString() : null;
};

const NOTIFICATION_TYPES = ['info', 'warning', 'success', 'error'];

/** Shape returned to the Portal — mirrors Portal/src/types/notification.ts. */
const serialize = (doc) => {
  const d = doc.data();
  return {
    id: doc.id,
    recipientUid: d.recipientUid,
    type: NOTIFICATION_TYPES.includes(d.type) ? d.type : 'info',
    title: d.title ?? '',
    message: d.message ?? '',
    read: d.read === true,
    taskId: d.taskId ?? undefined,
    stepNumber: d.stepNumber ?? undefined,
    createdAt: toISO(d.createdAt),
  };
};

// GET /api/notifications — the current user's notifications, newest first.
export const listNotifications = async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: 'Unauthorized' });

    const db = getDb();
    // Filter by recipient in Firestore, sort in memory to avoid a composite
    // index (recipientUid + createdAt). Volume per user is small.
    const snap = await db.collection(COLLECTION).where('recipientUid', '==', uid).get();
    const items = snap.docs
      .map(serialize)
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));

    res.status(200).json(items);
  } catch (error) {
    logger.error({ err: error }, 'Error listing notifications:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PATCH /api/notifications/:id/read — mark one as read (owner only).
export const markRead = async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { id } = req.params;
    const db = getDb();
    const ref = db.collection(COLLECTION).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: 'Notification not found' });
    if (snap.data().recipientUid !== uid) return res.status(403).json({ message: 'Forbidden' });

    await ref.set({ read: true, readAt: new Date() }, { merge: true });
    res.status(200).json({ id, read: true });
  } catch (error) {
    logger.error({ err: error }, 'Error marking notification read:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PATCH /api/notifications/read-all — mark all of the user's unread as read.
export const markAllRead = async (req, res) => {
  try {
    const uid = req.user?.uid;
    const db = getDb();
    // Single-field filter (no composite index); narrow to unread in memory.
    const snap = await db.collection(COLLECTION).where('recipientUid', '==', uid).get();
    const unread = snap.docs.filter((doc) => doc.data().read !== true);

    if (unread.length > 0) {
      const batch = db.batch();
      const now = new Date();
      unread.forEach((doc) => batch.set(doc.ref, { read: true, readAt: now }, { merge: true }));
      await batch.commit();
    }
    res.status(200).json({ updated: unread.length });
  } catch (error) {
    logger.error({ err: error }, 'Error marking all notifications read:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Reusable helper for other backend code (task transitions, document review,
 * payment events) to emit an in-app notification. Fire-and-forget friendly.
 */
export const createNotification = async ({ recipientUid, type = 'info', title, message, taskId, stepNumber }) => {
  if (!recipientUid || !title) {
    throw new Error('createNotification requires recipientUid and title');
  }
  const db = getDb();
  const ref = await db.collection(COLLECTION).add({
    recipientUid,
    type: NOTIFICATION_TYPES.includes(type) ? type : 'info',
    title,
    message: message ?? '',
    taskId: taskId ?? null,
    // Optional step linkage so step/matter completion can resolve related alerts.
    stepNumber: typeof stepNumber === 'number' ? stepNumber : null,
    read: false,
    createdAt: new Date(),
  });

  // E07-S02: mirror every in-app notification to EMAIL (Gmail SMTP). Fire-and-
  // forget — resolve the recipient's email and send without blocking or throwing.
  // No-op when email transport isn't configured (see emailService).
  (async () => {
    try {
      const u = await db.collection('users').doc(recipientUid).get();
      const to = u.exists ? (u.data().email || u.data().emailIds?.[0]) : null;
      if (to) await sendNotificationEmail({ to, title, message: message ?? '', taskId });
    } catch (err) {
      logger.warn({ err: err?.message }, '[email] notification email dispatch failed (non-fatal)');
    }
  })();

  return ref.id;
};

/**
 * Resolve (mark read) ACTIVE notifications tied to a matter — used when a matter
 * completes or a notified step is done, so stale "action needed" alerts clear from
 * everyone's unread list. Non-destructive (history is kept). When `stepNumber` is
 * given, only notifications for THAT step are resolved; otherwise ALL the matter's
 * active notifications are resolved. Fire-and-forget; never throws to the caller.
 */
export const resolveNotificationsForTask = async (taskId, { stepNumber } = {}) => {
  if (!taskId) return 0;
  try {
    const db = getDb();
    const snap = await db.collection(COLLECTION).where('taskId', '==', taskId).get();
    const match = snap.docs.filter((doc) => {
      const d = doc.data();
      if (d.read === true) return false;
      if (typeof stepNumber === 'number') return d.stepNumber === stepNumber;
      return true;
    });
    if (match.length === 0) return 0;
    const batch = db.batch();
    const now = new Date();
    match.forEach((doc) => batch.set(doc.ref, { read: true, readAt: now, resolvedAuto: true }, { merge: true }));
    await batch.commit();
    return match.length;
  } catch (err) {
    logger.warn({ err: err?.message }, 'resolveNotificationsForTask failed');
    return 0;
  }
};
