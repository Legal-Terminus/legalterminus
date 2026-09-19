import { logger } from '../config/logger.js';
import { db } from '../config/firebase.js';
import { getCompiledById } from '../services/workflowDefinitions.service.js';
import { emitWebhook } from '../services/webhookEmit.service.js';
import { createNotification } from './notifications.controller.js';
import { clientScopeUid } from './tasks.controller.js';
import {
  validateAnswers, profileUpdatesFrom, formForClient,
} from '../../../shared/workflows/forms.js';

/**
 * Form steps: the client fills, staff review (ported from Ambyflow, Story 34.3).
 *
 * ── Submission is a TRIGGER, not an advance ──
 *
 * Submitting completes the CLIENT's part and notifies staff. It does NOT move
 * the matter: the 2026-09-05 decision keeps a human in the loop for every state
 * change (it cancelled 31.5), and 34.2 was built the same way. Staff read the
 * answers and advance, exactly as after any other client action.
 *
 * ── Where answers live ──
 *
 * On the matter, at `tasks/{taskId}/formResponses/{stepNumber}`, so they travel
 * with the record they describe and are deleted with it. One document per step
 * rather than per submission: a resubmission REPLACES the answers, and the
 * previous version is preserved in `history` on the same document so a firm can
 * see what changed without a second collection.
 */

const RESPONSES = 'formResponses';

/** Locate the step definition and its form, or explain why not. */
async function loadForm(task, stepNumber) {
  const compiled = await getCompiledById(task.workflowDefinitionId);
  const step = (compiled?.definition?.steps ?? []).find((s) => s.stepNumber === stepNumber);
  if (!step) return { error: 'That step does not exist in this workflow.' };
  if (!step.form) return { error: 'That step does not ask any questions.' };
  return { step, form: step.form };
}

/**
 * A client may only touch their OWN matter's form.
 *
 * Uses the shared `clientScopeUid` (#166) rather than `uid` directly, so
 * additional logins on one client account resolve to the same matters — the
 * same rule every other client-facing read applies.
 */
function clientOwns(task, req) {
  return req.user.role !== 'client' || task.clientUid === clientScopeUid(req.user);
}

// ─── GET /api/tasks/:taskId/form/:stepNumber ────────────────────────────────

export async function getFormStep(req, res) {
  try {
    const stepNumber = Number(req.params.stepNumber);
    const snap = await db.collection('tasks').doc(req.params.taskId).get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();
    if (!clientOwns(task, req)) return res.status(403).json({ message: 'Forbidden' });

    const { form, error } = await loadForm(task, stepNumber);
    if (error) return res.status(404).json({ message: error });

    const saved = await db.collection('tasks').doc(req.params.taskId)
      .collection(RESPONSES).doc(String(stepNumber)).get();

    res.json({
      // A client never receives internal notes or the profile mapping (AC5).
      form: req.user.role === 'client' ? formForClient(form) : form,
      answers: saved.exists ? saved.data().answers ?? {} : {},
      status: saved.exists ? saved.data().status ?? 'draft' : 'empty',
      submittedAt: saved.exists ? saved.data().submittedAt ?? null : null,
    });
  } catch (err) {
    logger.error({ err }, 'getFormStep failed');
    res.status(500).json({ message: 'Failed to load the form' });
  }
}

// ─── PUT /api/tasks/:taskId/form/:stepNumber ────────────────────────────────

/**
 * Save or submit. `submit: true` enforces required fields; a plain save does
 * not, which is what makes "come back to it later" work.
 */
export async function saveFormStep(req, res) {
  try {
    const stepNumber = Number(req.params.stepNumber);
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = { id: snap.id, ...snap.data() };
    if (!clientOwns(task, req)) return res.status(403).json({ message: 'Forbidden' });

    const { form, error } = await loadForm(task, stepNumber);
    if (error) return res.status(404).json({ message: error });

    const submit = req.body?.submit === true;
    const { answers, errors } = validateAnswers(form, req.body?.answers);
    // On a partial save, missing REQUIRED fields are not an error — only a
    // genuine type problem is.
    const blocking = submit ? errors : errors.filter((e) => !/is required/.test(e.message));
    if (blocking.length) return res.status(400).json({ message: 'Please check your answers.', errors: blocking });

    const ref = taskRef.collection(RESPONSES).doc(String(stepNumber));
    const existing = await ref.get();
    const now = new Date().toISOString();

    // A resubmission replaces the answers; the previous set is kept on the same
    // document so a firm can see what changed without a second collection.
    const history = existing.exists ? (existing.data().history ?? []) : [];
    if (existing.exists && existing.data().status === 'submitted') {
      history.push({ answers: existing.data().answers ?? {}, at: existing.data().submittedAt ?? null });
    }

    await ref.set({
      stepNumber,
      answers,
      status: submit ? 'submitted' : 'draft',
      updatedAt: now,
      updatedBy: req.user.uid,
      ...(submit ? { submittedAt: now, submittedBy: req.user.uid } : {}),
      history: history.slice(-10),
    }, { merge: true });

    if (!submit) return res.json({ status: 'draft', answers });

    // Mapped answers write to the client profile, so a GSTIN answer immediately
    // feeds 34.2's conditions. Only the allowlisted fields, and never blanking
    // one that went unanswered.
    const updates = profileUpdatesFrom(form, answers);
    if (Object.keys(updates).length && task.clientUid) {
      await db.collection('users').doc(task.clientUid).set({
        ...updates,
        updatedAt: now,
        // Audited like any other profile write: a form is not a side door.
        updatedBy: req.user.uid,
        updatedVia: `form:${req.params.taskId}:${stepNumber}`,
      }, { merge: true });
    }

    // Tell staff. The matter does NOT advance — a person reviews and decides.
    try {
      if (task.assignedTo) {
        await createNotification(db, {
          recipientUid: task.assignedTo,
          type: 'info',
          title: 'Form submitted',
          message: `${task.clientName ?? 'The client'} completed the questions on ${task.serviceName ?? 'a matter'}. Review and advance when ready.`,
          taskId: req.params.taskId,
          stepNumber,
        });
      }
    } catch (e) {
      logger.warn({ err: e?.message }, 'form submit: staff notification failed');
    }

    emitWebhook(db, 'form.submitted', {
      matterId: req.params.taskId, stepNumber, fieldCount: Object.keys(answers).length,
    });

    res.json({ status: 'submitted', answers, profileUpdated: Object.keys(updates) });
  } catch (err) {
    logger.error({ err }, 'saveFormStep failed');
    res.status(500).json({ message: 'Failed to save the form' });
  }
}
