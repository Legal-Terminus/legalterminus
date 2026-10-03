/**
 * Who hears about a CLIENT's message in a matter's discussion (LT #200).
 *
 * It used to be the matter's owner and nobody else — so a matter with no owner
 * told no one, and the person actually working the current step never knew the
 * client had written. The firm chose the rule below over "tell everyone":
 *
 *   the matter's owner + everyone assigned to the matter's CURRENT step;
 *   if that is nobody, the admins.
 *
 * Only active staff are told. A step can stay assigned to someone who has
 * since been deactivated or removed, and they must not be emailed about a
 * client; if dropping them leaves nobody, the admin fallback applies.
 */
import { STAFF_ROLES } from '../config/roles.js';
import { logger } from '../config/logger.js';

/** Everyone a step is assigned to. `assignedToUids` holds all of them (#192). */
export const stepAssignees = (step) => {
  if (!step) return [];
  if (Array.isArray(step.assignedToUids) && step.assignedToUids.length) return step.assignedToUids;
  return step.assignedTo ? [step.assignedTo] : [];
};

/** Owner first, then the step's assignees — unique, and never the author. */
export function candidateUids(task, step, authorUid) {
  return [...new Set([task?.assignedTo, ...stepAssignees(step)].filter(Boolean))]
    .filter((uid) => uid !== authorUid);
}

const isActiveStaff = (u) => !!u && STAFF_ROLES.includes(u.role) && u.status !== 'deactivated';

const toRecipient = (uid, u) => ({
  uid,
  name: u.name || u.fullName || '',
  email: u.email || (Array.isArray(u.emailIds) ? u.emailIds[0] : null) || null,
});

/**
 * Resolve the people to notify for a client's message on `task`.
 * Returns `{ recipients: [{ uid, name, email }], fallback }` — `fallback` is
 * true when nobody owns the matter or its current step and the admins were
 * told instead. Never throws: a lookup that fails yields fewer recipients.
 */
export async function resolveClientMessageRecipients(db, task, authorUid) {
  let step = null;
  if (typeof task.currentStepNumber === 'number') {
    try {
      const snap = await db.collection('tasks').doc(task.id)
        .collection('steps').doc(String(task.currentStepNumber)).get();
      step = snap.exists ? snap.data() : null;
    } catch (err) {
      logger.warn({ err, taskId: task.id }, 'discussion recipients: current step lookup failed');
    }
  }

  const docs = await Promise.all(candidateUids(task, step, authorUid).map(async (uid) => {
    try {
      const d = await db.collection('users').doc(uid).get();
      return d.exists ? [uid, d.data()] : null;
    } catch {
      return null;
    }
  }));
  const recipients = docs.filter(Boolean).filter(([, u]) => isActiveStaff(u)).map(([uid, u]) => toRecipient(uid, u));
  if (recipients.length) return { recipients, fallback: false };

  // Nobody owns this matter or its step: a client's message must still land
  // somewhere, so the admins get it.
  try {
    const snap = await db.collection('users').where('role', '==', 'admin').get();
    const admins = snap.docs
      .filter((d) => d.id !== authorUid && isActiveStaff(d.data()))
      .map((d) => toRecipient(d.id, d.data()));
    return { recipients: admins, fallback: true };
  } catch (err) {
    logger.warn({ err, taskId: task.id }, 'discussion recipients: admin fallback lookup failed');
    return { recipients: [], fallback: true };
  }
}
