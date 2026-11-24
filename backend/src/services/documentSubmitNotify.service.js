/**
 * Who is told when a CLIENT submits documents, and how (#358).
 *
 * It used to be one in-app notice to the matter's owner — or, only when the
 * matter had no owner, to the step's single `assignedTo` — mirrored as a
 * generic email. The person actually working the step never heard about it.
 * Now it works like a client's Chat message (#200, chatMessageNotify.service.js):
 *
 *   the matter's owner + everyone assigned to the step the documents were
 *   uploaded for (the current step, for documents not tied to a step);
 *   if that is nobody, the admins.
 *
 * One in-app notification and ONE email per person per submit, from the
 * internal template `documents_submitted_team`. A batch that spans steps is
 * grouped per person, so nobody gets two emails for one press of Submit.
 * `createNotification` passes `email: false` — the templated email is the email.
 * Never throws: a notification failure must not fail the submit.
 */

export const DOCUMENTS_NOTICE = {
  template: 'documents_submitted_team',
  title: (n) => (n === 1 ? 'Your client uploaded a document' : `Your client uploaded ${n} documents`),
};

const stepLabel = (stepNumber, step) => {
  if (stepNumber == null) return '';
  const name = step?.title || step?.name || '';
  return name ? `Step ${stepNumber}: ${name}` : `Step ${stepNumber}`;
};

/**
 * `submitted` is `[{ id, fileName, stepNumber }]`. Returns the number of people
 * told, for logging and tests.
 */
export async function notifyClientDocumentsSubmitted({
  db, task, taskId, author, submitted,
}, {
  createNotification, renderTemplate, sendTemplatedEmail, resolveClientMessageRecipients, logger,
}) {
  let told = 0;
  try {
    // Group the files by the step they belong to; resolve each step's people once.
    const byStep = new Map();
    for (const d of submitted) {
      const key = typeof d.stepNumber === 'number' ? d.stepNumber : null;
      if (!byStep.has(key)) byStep.set(key, []);
      byStep.get(key).push(d);
    }

    // uid → { recipient, lines[] } so a person on several steps gets one email.
    const people = new Map();
    let fallback = false;
    for (const [stepNumber, files] of byStep) {
      const res = await resolveClientMessageRecipients(
        db, { id: taskId, ...task }, author.uid, stepNumber == null ? {} : { stepNumber },
      );
      fallback = fallback || res.fallback;
      const label = stepLabel(stepNumber, res.step);
      for (const r of res.recipients) {
        if (!people.has(r.uid)) people.set(r.uid, { recipient: r, files: [] });
        for (const f of files) people.get(r.uid).files.push(label ? `${f.fileName} (${label})` : f.fileName);
      }
    }

    const clientName = task.clientName || 'Your client';
    for (const { recipient: r, files } of people.values()) {
      try {
        const title = DOCUMENTS_NOTICE.title(files.length);
        await createNotification({
          recipientUid: r.uid, type: 'info', title,
          message: `${clientName} · ${task.serviceName ?? ''}: ${files.join(', ')}`.slice(0, 500),
          taskId, email: false,
        });
        const rendered = r.email ? await renderTemplate(DOCUMENTS_NOTICE.template, {
          recipientName: r.name, clientName,
          organisation: task.organisation ?? '', serviceName: task.serviceName ?? '',
          documentCount: String(files.length),
          documents: files.map((f) => `- ${f}`).join('\n'),
        }) : null;
        // No cc: the matter's ccEmails are the client's, and this is internal.
        if (rendered) {
          await sendTemplatedEmail({
            to: r.email, subject: rendered.subject, body: rendered.body,
            taskId, serviceName: task.serviceName, organisation: task.organisation ?? undefined,
          });
        }
        told += 1;
      } catch (e) {
        logger?.warn({ err: e, recipientUid: r.uid, taskId }, 'documents submitted: notify failed (non-fatal)');
      }
    }
    logger?.info({ taskId, notified: told, fallback, documents: submitted.length }, 'client documents submitted: team notified');
  } catch (e) {
    logger?.warn({ err: e, taskId }, 'documents submitted: team notification failed (non-fatal)');
  }
  return told;
}
