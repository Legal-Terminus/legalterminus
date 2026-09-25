import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { createNotification } from './notifications.controller.js';
import { sendTemplatedEmail } from '../services/emailService.js';
import { renderTemplate, isReminderTemplate, REMINDER_TEMPLATE_KEYS } from '../services/emailTemplates.service.js';
import { STAFF_ROLES } from '../config/roles.js';

/**
 * #111 — MANUAL reminder emails sent by staff from a workflow step.
 *
 * Staff-only (a client can't nudge themselves). The copy comes from the EDITABLE
 * template store (Settings → Email Templates), never hardcoded, and several
 * variants exist so the team can escalate tone: gentle → follow-up → urgent.
 *
 * A reminder can be sent MORE THAN ONCE; every send is recorded as a
 * `REMINDER_SENT` activity event so the trail shows who chased the client and
 * when. A short cooldown prevents accidental double-clicks spamming the client.
 */

const COOLDOWN_MS = 60 * 1000; // guard against double-click / rapid repeat

/** GET /api/tasks/:taskId/reminders — the send history for this matter. */
export async function listReminders(req, res) {
  try {
    const { taskId } = req.params;
    const snap = await db.collection('tasks').doc(taskId).get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });

    const events = await db.collection('tasks').doc(taskId).collection('events')
      .where('type', '==', 'REMINDER_SENT').get();
    const rows = events.docs
      .map((d) => d.data())
      .sort((a, b) => String(b.at ?? '').localeCompare(String(a.at ?? '')));

    res.json({
      data: rows.map((e) => ({
        at: e.at ?? null,
        stepNumber: e.stepNumber ?? null,
        template: e.reminderTemplate ?? null,
        byRole: e.byRole ?? null,
      })),
      templates: REMINDER_TEMPLATE_KEYS,
    });
  } catch (err) {
    logger.error({ err }, 'listReminders error:');
    res.status(500).json({ message: 'Failed to load reminder history' });
  }
}

/**
 * POST /api/tasks/:taskId/reminders  { template?, stepNumber? }
 * Sends the chosen reminder template to the matter's client. Staff only.
 */
export async function sendReminder(req, res) {
  try {
    const { taskId } = req.params;
    const template = req.body?.template || 'reminder_gentle';
    if (!isReminderTemplate(template)) {
      return res.status(400).json({ message: 'Unknown reminder template.', code: 'BAD_TEMPLATE' });
    }

    const taskRef = db.collection('tasks').doc(taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();

    // Terminal matters shouldn't be chased.
    if (['completed', 'cancelled', 'rejected', 'archived'].includes(task.status)) {
      return res.status(409).json({
        message: `This matter is ${task.status} — no reminder is needed.`,
        code: 'MATTER_NOT_ACTIVE',
      });
    }

    // Cooldown: block an accidental burst of identical reminders.
    const recent = await taskRef.collection('events').where('type', '==', 'REMINDER_SENT').get();
    const lastAt = recent.docs
      .map((d) => d.data().at)
      .filter(Boolean)
      .sort()
      .pop();
    if (lastAt && Date.now() - new Date(lastAt).getTime() < COOLDOWN_MS) {
      return res.status(429).json({
        message: 'A reminder was just sent for this matter. Please wait a minute before sending another.',
        code: 'REMINDER_COOLDOWN',
      });
    }

    // Resolve the client's email + a readable current-step name.
    const clientDoc = await db.collection('users').doc(task.clientUid).get();
    const client = clientDoc.exists ? clientDoc.data() : null;
    const to = client?.email || (Array.isArray(client?.emailIds) ? client.emailIds[0] : null);
    if (!to) {
      return res.status(409).json({ message: 'This client has no email address on file.', code: 'NO_CLIENT_EMAIL' });
    }

    const stepNumber = req.body?.stepNumber ?? task.currentStepNumber ?? null;
    let currentStep = stepNumber != null ? `Step ${stepNumber}` : '';
    try {
      if (stepNumber != null) {
        const sd = await taskRef.collection('steps').doc(String(stepNumber)).get();
        // Prefer the CLIENT-facing step name (#103) — this email goes to the client.
        if (sd.exists) currentStep = sd.data().clientTitle || sd.data().title || currentStep;
      }
    } catch { /* fall back to "Step N" */ }

    const rendered = await renderTemplate(template, {
      clientName: task.clientName ?? '',
      organisation: task.organisation ?? '',
      serviceName: task.serviceName ?? '',
      matterId: taskId,
      currentStep,
    });
    if (!rendered) return res.status(500).json({ message: 'Could not render the reminder template.' });

    const sent = await sendTemplatedEmail({
      to,
      // #149: the matter's additional recipients are CC'd — this email goes to
      // the client, so everyone they nominated should see it.
      cc: task.ccEmails,
      subject: rendered.subject, body: rendered.body,
      taskId, serviceName: task.serviceName, organisation: task.organisation ?? undefined,
    });

    const now = new Date().toISOString();

    // Audit trail — every send is recorded, including repeats.
    await taskRef.collection('events').add({
      type: 'REMINDER_SENT',
      reminderTemplate: template,
      stepNumber,
      comment: `Reminder sent to the client (${template.replace('reminder_', '')})`,
      // #115: this is an internal action note — not client-facing.
      commentClientVisible: false,
      byUid: req.user.uid ?? null,
      byRole: req.user.role ?? null,
      at: now,
    });

    // Also raise the client's in-app alert so it's visible in the portal, not just email.
    try {
      await createNotification({
        recipientUid: task.clientUid,
        type: 'warning',
        title: rendered.subject,
        message: currentStep ? `Pending: ${currentStep}` : 'Your service needs your attention.',
        taskId,
      });
    } catch (e) {
      logger.warn({ err: e?.message }, 'sendReminder: in-app notification failed');
    }

    res.json({ success: true, emailed: sent, template, at: now, to });
  } catch (err) {
    logger.error({ err }, 'sendReminder error:');
    res.status(500).json({ message: 'Failed to send the reminder' });
  }
}

/* ── #198: INTERNAL step reminders — to the step's assignee(s) ────────────
 *
 * The same idea as the client reminder, aimed inward: a colleague nudges whoever
 * owns a step. Every assignee gets it when the step has several (#192). Kept
 * apart from client reminders in every way — its own event type, template,
 * history and cooldown — so a client is never reached and the two histories
 * never mix. Only STAFF are ever recipients: a client-assigned step (#204)
 * has no internal assignee to remind, and says so.
 */

const INTERNAL_EVENT = 'INTERNAL_REMINDER_SENT';
const escapeHtml = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const displayNameOf = (u) => u?.displayName || u?.name || u?.fullName || u?.email || 'A colleague';

/** GET /api/tasks/:taskId/internal-reminders — who was reminded, and when. */
export async function listInternalReminders(req, res) {
  try {
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    if (!(await taskRef.get()).exists) return res.status(404).json({ message: 'Matter not found' });
    const events = await taskRef.collection('events').where('type', '==', INTERNAL_EVENT).get();
    const rows = events.docs
      .map((d) => d.data())
      .sort((a, b) => String(b.at ?? '').localeCompare(String(a.at ?? '')));
    res.json({
      data: rows.map((e) => ({
        at: e.at ?? null,
        stepNumber: e.stepNumber ?? null,
        recipients: Array.isArray(e.recipientNames) ? e.recipientNames : [],
        note: e.note ?? null,
        byName: e.byName ?? null,
      })),
    });
  } catch (err) {
    logger.error({ err }, 'listInternalReminders error:');
    res.status(500).json({ message: 'Failed to load the internal reminder history' });
  }
}

/**
 * POST /api/tasks/:taskId/internal-reminders  { stepNumber, note? }
 * Emails and notifies every STAFF assignee of the step, except the sender.
 */
export async function sendInternalReminder(req, res) {
  try {
    const { taskId } = req.params;
    const { stepNumber, note } = req.body;
    const taskRef = db.collection('tasks').doc(taskId);
    const taskSnap = await taskRef.get();
    if (!taskSnap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = taskSnap.data();
    if (['completed', 'cancelled', 'rejected', 'archived'].includes(task.status)) {
      return res.status(409).json({ message: `This matter is ${task.status} — no reminder was sent.`, code: 'MATTER_NOT_ACTIVE' });
    }

    const stepSnap = await taskRef.collection('steps').doc(String(stepNumber)).get();
    if (!stepSnap.exists) return res.status(404).json({ message: 'Step not found', code: 'STEP_NOT_FOUND' });
    const step = stepSnap.data();

    // Same double-click guard as the client reminder, per step.
    const recent = await taskRef.collection('events').where('type', '==', INTERNAL_EVENT).get();
    const cutoff = Date.now() - COOLDOWN_MS;
    if (recent.docs.some((d) => d.data().stepNumber === stepNumber && Date.parse(d.data().at ?? '') > cutoff)) {
      return res.status(429).json({ message: 'A reminder for this step was just sent. Please wait a minute before sending another.', code: 'REMINDER_COOLDOWN' });
    }

    const owners = Array.isArray(step.assignedToUids) && step.assignedToUids.length
      ? step.assignedToUids : (step.assignedTo ? [step.assignedTo] : []);
    const candidates = [...new Set(owners)].filter((u) => u && u !== task.clientUid && u !== req.user.uid);
    const userDocs = await Promise.all(candidates.map((u) => db.collection('users').doc(u).get()));
    const recipients = userDocs
      .filter((d) => d.exists)
      .map((d) => ({ uid: d.id, ...d.data() }))
      .filter((u) => STAFF_ROLES.includes(u.role) && u.status !== 'deactivated')
      .map((u) => ({ uid: u.uid, name: displayNameOf(u), email: u.email || (Array.isArray(u.emailIds) ? u.emailIds[0] : null) }));
    if (recipients.length === 0) {
      return res.status(409).json({
        message: owners.includes(task.clientUid)
          ? 'This step is assigned to the client. Use the client reminder instead.'
          : 'This step has no other team member assigned to remind. Assign someone first.',
        code: 'NO_STAFF_ASSIGNEE',
      });
    }

    const senderSnap = await db.collection('users').doc(req.user.uid).get();
    const senderName = displayNameOf(senderSnap.exists ? senderSnap.data() : null);
    const stepName = step.title ?? `Step ${stepNumber}`; // internal name: this is for the team
    const now = new Date().toISOString();

    let emailed = 0;
    for (const r of recipients) {
      const rendered = await renderTemplate('internal_step_reminder', {
        recipientName: r.name, senderName, clientName: task.clientName ?? '',
        organisation: task.organisation ?? '', serviceName: task.serviceName ?? '',
        stepName, note: note ? `Note: ${note}` : '',
      });
      // No cc: `ccEmails` are the CLIENT's extra addresses, and this is internal.
      if (r.email && rendered) {
        const ok = await sendTemplatedEmail({
          to: r.email, subject: rendered.subject, body: rendered.body,
          taskId, serviceName: task.serviceName, organisation: task.organisation ?? undefined,
        });
        if (ok) emailed += 1;
      }
      // In-app too; email:false because the templated email above already went.
      await createNotification({
        recipientUid: r.uid, type: 'warning',
        title: rendered?.subject || `Reminder: ${stepName}`,
        message: note ? `${senderName}: ${note}` : `${senderName} sent you a reminder about ${stepName}.`,
        taskId, stepNumber, email: false,
      }).catch((e) => logger.warn({ err: e?.message }, 'sendInternalReminder: in-app notification failed'));
    }

    const names = recipients.map((r) => r.name);
    await taskRef.collection('events').add({
      type: INTERNAL_EVENT,
      stepNumber,
      fromStep: stepNumber,
      toStep: stepNumber,
      recipientUids: recipients.map((r) => r.uid),
      recipientNames: names,
      note: note ?? null,
      byName: senderName,
      comment: `Reminded ${escapeHtml(names.join(', '))}${note ? ` — ${escapeHtml(note)}` : ''}`,
      commentClientVisible: false, // internal: also not on the client event whitelist
      byUid: req.user.uid ?? null,
      byRole: req.user.role ?? null,
      at: now,
    });

    res.json({ success: true, emailed, at: now, recipients: names });
  } catch (err) {
    logger.error({ err }, 'sendInternalReminder error:');
    res.status(500).json({ message: 'Failed to send the internal reminder' });
  }
}
