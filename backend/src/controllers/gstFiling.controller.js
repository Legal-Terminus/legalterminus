/**
 * #294 (firm, 17 Nov) — staff SAVE the date a GSTR-1 / GSTR-3B return was
 * filed ("Add Filing Date" on the filing task), then complete the task.
 * Completing a task never sets the date; this endpoint is the only writer.
 *
 * PUT /api/tasks/:taskId/steps/:stepNumber/filed-on { date: 'YYYY-MM-DD' | null }
 *   route: verifyToken + requireRole('admin', 'manager', 'team_member'),
 *          validate(filedOnCorrectionSchema)
 *   here:  a team member only on a matter they own or hold a task of
 *          (`canCorrectFiledOn`); only the matter's GSTR-1 / GSTR-3B filing task,
 *          once the matter has reached it (in progress or completed); the date
 *          from the 1st after the GST period ends to today (India) —
 *          `checkFilingDate`. `null` removes a saved date.
 *
 * Writes, in one transaction: `filingDate` on the step (completedAt is never
 * changed), a FILING_DATE_SET event (staff-only history: who, from, to) and the
 * matter's `updatedAt`, which is what the GST Return Filing sheet's sync
 * watches — so the row's date cell follows on the sheet's next opening (matter
 * → sheet only). Both read the date through `filedOnDateOf`.
 */
import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { canCorrectFiledOn, checkFilingDate, filingDateComment, withAuthoredOrder } from '../services/gstReturnSheet.service.js';
import { getCompiledById } from '../services/workflowDefinitions.service.js';
import { gstReturnServiceKeys, gstFrequencyOf, manualFilingDatesFrom } from '../services/gstMatterTags.service.js';

const fail = (status, message) => Object.assign(new Error(message), { status });

export async function saveFilingDate(req, res) {
  try {
    const { taskId } = req.params;
    const stepNumber = Number(req.params.stepNumber);
    if (!Number.isInteger(stepNumber) || stepNumber < 1) return res.status(400).json({ message: 'Unknown task.' });
    const date = req.body.date ?? null;
    const taskRef = db.collection('tasks').doc(taskId);
    const first = await taskRef.get();
    if (!first.exists) return res.status(404).json({ message: 'Matter not found' });
    // Read outside the transaction: the sheet's linked services, the client only
    // when it decides monthly vs quarterly (the bounds depend on the period), and
    // when manual dates began (the "from" of an older task's history line).
    const [linkedServices, frequency, compiled, manualFrom] = await Promise.all([
      gstReturnServiceKeys(), gstFrequencyOf(first.data()),
      getCompiledById(first.data().workflowDefinitionId).catch(() => null),
      manualFilingDatesFrom(),
    ]);

    const out = await db.runTransaction(async (tx) => {
      const snap = await tx.get(taskRef);
      if (!snap.exists) throw fail(404, 'Matter not found');
      const task = { id: snap.id, ...snap.data() };
      const stepDocs = (await tx.get(taskRef.collection('steps'))).docs;
      // Matched in the service's authored order, exactly as the tags and the sheet are.
      const steps = withAuthoredOrder(stepDocs.map((d) => d.data()), compiled?.definition?.steps);
      if (!canCorrectFiledOn(req.user, task, steps)) throw fail(403, 'Only staff working on this matter can save its filing dates.');
      const check = checkFilingDate({ task, steps, stepNumber, date, frequency, linkedServices, manualFrom });
      if (!check.ok) throw fail(check.status, check.message);
      if (check.from === check.to) return { form: check.form, date: check.to, changed: false };

      const now = new Date().toISOString();
      const ref = stepDocs.find((d) => d.data().stepNumber === stepNumber).ref;
      // Always an object once staff have decided, so an older task's
      // completion-day date is never read again — `date: null` = removed.
      tx.update(ref, {
        filingDate: { date: check.to, previous: check.from ?? null, byUid: req.user.uid ?? null, byRole: req.user.role ?? null, at: now },
      });
      tx.set(taskRef.collection('events').doc(), {
        type: 'FILING_DATE_SET',
        fromStep: stepNumber,
        toStep: stepNumber,
        comment: filingDateComment(check.form, check.from, check.to),
        commentClientVisible: false, // internal history; the client sees the date itself
        filedOn: { form: check.form, from: check.from ?? null, to: check.to },
        byUid: req.user.uid ?? null,
        byRole: req.user.role ?? null,
        at: now,
      });
      tx.update(taskRef, { updatedAt: now });
      return { form: check.form, date: check.to, previous: check.from ?? null, changed: true };
    });

    if (out.changed) logger.info({ taskId, stepNumber, form: out.form, actorUid: req.user.uid }, '#294 filing date saved');
    res.json({ stepNumber, ...out });
  } catch (err) {
    if (err?.status && err.status < 500) return res.status(err.status).json({ message: err.message });
    logger.error({ err }, 'saveFilingDate error');
    res.status(500).json({ message: 'Could not save the filing date' });
  }
}
