/**
 * LT #293 — who is told that a step is now theirs, and the one place that
 * tells them.
 *
 * ROOT CAUSE of the missing assignment email: a matter created with NO PAYMENT
 * (every GST return matter the monthly/quarterly sweep opens, every recurring
 * copy, and any matter a person creates as "No payment") starts in
 * `pending_admin_approval`. Creation deliberately told only the admins that it
 * needed approving, and `approveTask` — the moment the first step actually goes
 * live — told only the matter's CREATOR ("Matter approved"). Nobody ever told
 * the people the first step is assigned to, so the team member never got the
 * "New step assigned to you" email. A paid matter skips approval and was
 * announced at creation, which is why the bug showed up "especially on matters
 * with no payment".
 *
 * Two smaller gaps had the same shape and are closed here too: creation and
 * step transitions told only the step's PRIMARY assignee (`assignedTo`), never
 * the other people on a shared step (`assignedToUids`, #192).
 *
 * The rule, used at creation, at approval and on every forward move:
 *   - everyone the step is assigned to, except the client (a client step is
 *     announced with the client's own prompt, not internal "assigned" wording);
 *   - if nobody on our side holds the step and it is not the client's step,
 *     the matter's owner — the same fallback the transitions always used;
 *   - never the person whose action caused it, and never a system actor
 *     (`system:gst-returns`), which has no inbox.
 */
import { stepAssignees } from './discussionRecipients.service.js';

const isSystemActor = (uid) => typeof uid === 'string' && uid.startsWith('system:');

/**
 * The staff to tell that `step` is theirs. Pure — the callers own the reads.
 * `clientOwned` is true for a step the definition gives to the client.
 */
export function stepAssignmentRecipients(step, { clientUid = null, ownerUid = null, actorUid = null, clientOwned = false } = {}) {
  const staff = stepAssignees(step).filter((u) => u && u !== clientUid);
  const pool = staff.length ? staff : (!clientOwned && ownerUid && ownerUid !== clientUid ? [ownerUid] : []);
  return [...new Set(pool)].filter((u) => u !== actorUid && !isSystemActor(u));
}

/**
 * Tell each internal assignee of `stepNumber` that the step is theirs: one
 * in-app notification each, mirrored to email by `createNotification` (which
 * honours the EMAIL_DISABLED kill-switch). Copy comes from the editable
 * `step_assigned` template unless the caller supplies its own (a transition's
 * "Client approval received" / "Correction required").
 *
 * `step` may be passed when the caller already has it; otherwise it is read.
 * Never throws — an assignment email must not fail the action that caused it.
 * Returns the uids that were told.
 */
export async function announceStepAssignment(db, {
  taskId, task, stepNumber, stepTitle, step = undefined, clientOwned = false, actorUid = null,
  title = null, message = null, type = 'info',
}, { createNotification, renderTemplate, logger }) {
  try {
    let stepData = step;
    if (stepData === undefined) {
      const snap = await db.collection('tasks').doc(taskId).collection('steps').doc(String(stepNumber)).get();
      stepData = snap.exists ? snap.data() : null;
    }
    const uids = stepAssignmentRecipients(stepData, {
      clientUid: task?.clientUid ?? null, ownerUid: task?.assignedTo ?? null, actorUid, clientOwned,
    });
    if (!uids.length) return [];

    const name = stepTitle || stepData?.title || `Step ${stepNumber}`;
    let t = null;
    if (!title) {
      t = await renderTemplate('step_assigned', {
        clientName: task?.clientName ?? '', serviceName: task?.serviceName ?? task?.workflowType ?? '', stepName: name,
      });
    }
    const finalTitle = title || t?.subject || 'New step assigned to you';
    const finalMessage = message || t?.body
      || `${task?.clientName ?? ''} · ${task?.serviceName ?? task?.workflowType ?? ''}: ${name}`;

    const told = [];
    for (const uid of uids) {
      try {
        await createNotification({ recipientUid: uid, type, title: finalTitle, message: finalMessage, taskId, stepNumber });
        told.push(uid);
      } catch (err) {
        logger?.warn({ err, taskId, recipientUid: uid }, 'step assignment notice failed (non-fatal)');
      }
    }
    return told;
  } catch (err) {
    logger?.warn({ err, taskId, stepNumber }, 'step assignment notice skipped (non-fatal)');
    return [];
  }
}
