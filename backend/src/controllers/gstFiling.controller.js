/**
 * #294 follow-up — staff correct the date a GSTR-1 / GSTR-3B return was filed,
 * when the filing task was ticked after the real filing.
 *
 * PUT /api/tasks/:taskId/steps/:stepNumber/filed-on { date: 'YYYY-MM-DD' | null }
 *   route: verifyToken + requireRole('admin', 'manager', 'team_member'),
 *          validate(filedOnCorrectionSchema)
 *   here:  a team member only on a matter they own or hold a task of
 *          (`canCorrectFiledOn`); only the matter's GSTR-1 / GSTR-3B filing task,
 *          once completed; the date from the 1st after the GST period ends to
 *          today (India) — `checkFiledOnCorrection`.
 *
 * Writes, in one transaction: `filedOnCorrection` on the step (completedAt is
 * never changed), a FILED_ON_CORRECTED event (staff-only history: who, from, to)
 * and the matter's `updatedAt`, which is what the GST Return Filing sheet's sync
 * watches — so the sheet's date cell follows on its next opening. Both read the
 * date through `filedOnDateOf`.
 */
import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { canCorrectFiledOn, checkFiledOnCorrection, longDay } from '../services/gstReturnSheet.service.js';
import { gstReturnServiceKeys, gstFrequencyOf } from '../services/gstMatterTags.service.js';
import { indiaDate } from '../../../shared/workflows/gstReturns.js';

const fail = (status, message) => Object.assign(new Error(message), { status });

export async function correctFiledOn(req, res) {
  try {
    const { taskId } = req.params;
    const stepNumber = Number(req.params.stepNumber);
    if (!Number.isInteger(stepNumber) || stepNumber < 1) return res.status(400).json({ message: 'Unknown task.' });
    const date = req.body.date ?? null;
    const taskRef = db.collection('tasks').doc(taskId);
    const first = await taskRef.get();
    if (!first.exists) return res.status(404).json({ message: 'Matter not found' });
    // Read outside the transaction: the sheet's linked services, and the client
    // only when it decides monthly vs quarterly (the bounds depend on the period).
    const [linkedServices, frequency] = await Promise.all([gstReturnServiceKeys(), gstFrequencyOf(first.data())]);

    const out = await db.runTransaction(async (tx) => {
      const snap = await tx.get(taskRef);
      if (!snap.exists) throw fail(404, 'Matter not found');
      const task = { id: snap.id, ...snap.data() };
      const stepDocs = (await tx.get(taskRef.collection('steps'))).docs;
      const steps = stepDocs.map((d) => d.data());
      if (!canCorrectFiledOn(req.user, task, steps)) throw fail(403, 'Only staff working on this matter can correct its filing dates.');
      const check = checkFiledOnCorrection({ task, steps, stepNumber, date, frequency, linkedServices });
      if (!check.ok) throw fail(check.status, check.message);
      if (check.from === check.to) return { form: check.form, date: check.to, changed: false };

      const now = new Date().toISOString();
      const completedOn = indiaDate(new Date(check.step.completedAt));
      const ref = stepDocs.find((d) => d.data().stepNumber === stepNumber).ref;
      // Back to the completion date = no correction to keep.
      tx.update(ref, {
        filedOnCorrection: check.to === completedOn ? null : {
          date: check.to, forCompletedAt: check.step.completedAt, previous: check.from,
          byUid: req.user.uid, byRole: req.user.role, at: now,
        },
      });
      tx.set(taskRef.collection('events').doc(), {
        type: 'FILED_ON_CORRECTED',
        fromStep: stepNumber,
        toStep: stepNumber,
        comment: `${check.form} filing date corrected from ${longDay(check.from)} to ${longDay(check.to)}.`,
        commentClientVisible: false, // internal history; the client sees the corrected date itself
        filedOn: { form: check.form, from: check.from, to: check.to },
        byUid: req.user.uid ?? null,
        byRole: req.user.role ?? null,
        at: now,
      });
      tx.update(taskRef, { updatedAt: now });
      return { form: check.form, date: check.to, previous: check.from, changed: true };
    });

    if (out.changed) logger.info({ taskId, stepNumber, form: out.form, actorUid: req.user.uid }, '#294 filing date corrected');
    res.json({ stepNumber, ...out });
  } catch (err) {
    if (err?.status && err.status < 500) return res.status(err.status).json({ message: err.message });
    logger.error({ err }, 'correctFiledOn error');
    res.status(500).json({ message: 'Could not save the filing date' });
  }
}
