/**
 * Two internal review marks on a matter, shown in the reports. Both are staff
 * detail: stripped from everything a client or professional receives
 * (`projectTaskForClient`).
 *
 * LT #369 — Admin Remarks.
 *   PUT /api/tasks/:taskId/admin-remarks { adminRemarks }
 *   route: verifyToken + requireRole('admin') + validate(adminRemarksSchema)
 *   Free text the admin types in the Master Sheet's last column. Blank clears it.
 *   Fields: `adminRemarks` (string | null), `adminRemarksAt`, `adminRemarksBy`.
 *
 * LT #368 — Audit.
 *   PUT /api/tasks/:taskId/audit { audited }
 *   route: verifyToken + requireRole('admin', 'manager') + validate(auditSchema)
 *   An admin or manager (owner, 28 Nov) marks a matter Audited — only once it is fully paid ("audited
 *   along with the payment received") — or back to Un-audited.
 *   Fields: `auditStatus` ('audited' | 'unaudited'; absent = un-audited),
 *   `auditedAt`, `auditedBy`, `auditedByName`; an AUDIT_SET event in the
 *   matter's staff-only history.
 *
 * Neither changes `updatedAt`: they are notes about the matter, not work on it,
 * so they do not move it up the "recently updated" lists.
 */
import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';

async function actorName(uid) {
  if (!uid) return null;
  const u = await db.collection('users').doc(uid).get().catch(() => null);
  return u?.exists ? (u.data().name || u.data().fullName || u.data().email || null) : null;
}

export async function setAdminRemarks(req, res) {
  try {
    const ref = db.collection('tasks').doc(req.params.taskId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const adminRemarks = req.body.adminRemarks ? req.body.adminRemarks : null;
    const now = new Date().toISOString();
    await ref.update({ adminRemarks, adminRemarksAt: now, adminRemarksBy: req.user.uid ?? null });
    res.json({ taskId: ref.id, adminRemarks, adminRemarksAt: now });
  } catch (err) {
    logger.error({ err }, 'setAdminRemarks error');
    res.status(500).json({ message: 'Could not save the remarks' });
  }
}

/** Whether a matter may be marked Audited: its payment is complete. */
export function auditBlockReason(task) {
  if ((task?.paymentStatus ?? 'not_paid') !== 'fully_paid' || Number(task?.amountDue ?? 0) > 0) {
    return 'A matter can be marked Audited only once its payment is fully received.';
  }
  return null;
}

export async function setAudit(req, res) {
  try {
    const ref = db.collection('tasks').doc(req.params.taskId);
    const audited = req.body.audited === true;
    const name = await actorName(req.user.uid);
    const out = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw Object.assign(new Error('Matter not found'), { status: 404 });
      const task = snap.data();
      const was = task.auditStatus === 'audited';
      if (was === audited) return { auditStatus: audited ? 'audited' : 'unaudited', changed: false };
      if (audited) {
        const why = auditBlockReason(task);
        if (why) throw Object.assign(new Error(why), { status: 409 });
      }
      const now = new Date().toISOString();
      tx.update(ref, {
        auditStatus: audited ? 'audited' : 'unaudited',
        auditedAt: audited ? now : null,
        auditedBy: audited ? (req.user.uid ?? null) : null,
        auditedByName: audited ? name : null,
      });
      tx.set(ref.collection('events').doc(), {
        type: 'AUDIT_SET',
        fromStep: task.currentStepNumber ?? null,
        toStep: task.currentStepNumber ?? null,
        comment: audited ? 'Marked the matter Audited.' : 'Marked the matter Un-audited.',
        commentClientVisible: false,
        byUid: req.user.uid ?? null,
        byRole: req.user.role ?? null,
        at: now,
      });
      return { auditStatus: audited ? 'audited' : 'unaudited', auditedAt: audited ? now : null, auditedByName: audited ? name : null, changed: true };
    });
    if (out.changed) logger.info({ taskId: ref.id, auditStatus: out.auditStatus, actorUid: req.user.uid }, '#368 audit status set');
    res.json({ taskId: ref.id, ...out });
  } catch (err) {
    if (err?.status && err.status < 500) return res.status(err.status).json({ message: err.message });
    logger.error({ err }, 'setAudit error');
    res.status(500).json({ message: 'Could not save the audit status' });
  }
}
