import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { createNotification } from './notifications.controller.js';
import { sendTemplatedEmail } from '../services/emailService.js';
import { renderTemplate } from '../services/emailTemplates.service.js';
import { sanitizeRichText, richTextToPlain } from '../services/richText.service.js';

/**
 * #123 — per-matter DISCUSSION THREAD (client ⇄ internal team).
 *
 * One thread per matter, stored at `tasks/{taskId}/messages`. Staff decide per
 * message whether the client can see it (`clientVisible`, default FALSE so an
 * internal note is never leaked by accident — same rule as #115). A client's own
 * messages are always client-visible (they wrote them).
 *
 * Deliberately SEPARATE from `events`: events are an append-only audit trail with
 * different retention/permissions; a conversation is user content that needs its
 * own visibility model. Delivery is polling-based (the app's existing pattern) —
 * no realtime listener layer, so the browser never talks to Firestore directly.
 */

const MESSAGES_SUB = 'messages';
const MAX_BODY = 4000;
// #123: how a staff sender is shown to the CLIENT in the discussion thread.
const CLIENT_FACING_SENDER = 'Legal Terminus';

const toISO = (ts) => {
  if (!ts) return null;
  if (typeof ts === 'string') return ts;
  if (typeof ts?.toDate === 'function') return ts.toDate().toISOString();
  return null;
};

const msgsCol = (taskId) => db.collection('tasks').doc(taskId).collection(MESSAGES_SUB);

/** Load the matter, enforcing that a client may only touch their own. */
async function loadAuthorizedTask(req, res, taskId) {
  const snap = await db.collection('tasks').doc(taskId).get();
  if (!snap.exists) { res.status(404).json({ message: 'Matter not found' }); return null; }
  const task = snap.data();
  if (req.user.role === 'client' && task.clientUid !== req.user.uid) {
    res.status(403).json({ message: 'Forbidden' }); return null;
  }
  return task;
}

/**
 * GET /api/tasks/:taskId/messages — the thread, oldest first.
 * Clients receive ONLY client-visible messages, and staff authors are shown as the
 * company name ("Legal Terminus") — never individual staff identities (#123).
 */
export async function listMessages(req, res) {
  try {
    const { taskId } = req.params;
    const task = await loadAuthorizedTask(req, res, taskId);
    if (!task) return;
    const isClient = req.user.role === 'client';

    const snap = await msgsCol(taskId).orderBy('createdAt', 'asc').limit(500).get();
    let rows = snap.docs.map((d) => ({ id: d.id, ...d.data(), createdAt: toISO(d.data().createdAt) }));

    if (isClient) rows = rows.filter((m) => m.clientVisible === true);

    // Resolve author names for staff; clients see "Our team" for staff authors and
    // "You" for their own (never individual staff identities).
    const uids = isClient ? [] : [...new Set(rows.map((m) => m.authorUid).filter(Boolean))];
    const names = new Map();
    if (uids.length) {
      const docs = await Promise.all(uids.map((u) => db.collection('users').doc(u).get()));
      docs.forEach((d) => { if (d.exists) names.set(d.id, d.data().name || d.data().email || 'Team member'); });
    }

    const data = rows.map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt,
      clientVisible: m.clientVisible === true,
      authorRole: m.authorRole ?? null,
      isMine: m.authorUid === req.user.uid,
      authorName: isClient
        // #123 follow-up: the client sees the COMPANY name as the sender, not the
        // generic "Our team". Their own messages still read "You".
        ? (m.authorUid === req.user.uid ? 'You' : CLIENT_FACING_SENDER)
        : (names.get(m.authorUid) ?? (m.authorRole === 'client' ? (task.clientName || 'Client') : 'Team member')),
    }));

    res.json({ data });
  } catch (err) {
    logger.error({ err }, 'listMessages error:');
    res.status(500).json({ message: 'Failed to load the discussion' });
  }
}

/**
 * POST /api/tasks/:taskId/messages — post a message.
 * Body: { body, clientVisible? }. `clientVisible` defaults to FALSE for staff
 * (fail closed) and is forced TRUE for a client's own message.
 * Notifies the other side in-app + by email (editable `matter_message` template).
 */
export async function createMessage(req, res) {
  try {
    const { taskId } = req.params;
    const task = await loadAuthorizedTask(req, res, taskId);
    if (!task) return;

    // #122: messages may be RICH TEXT. Sanitise on the server (never trust the
    // browser — a client could POST here directly), so everything stored is safe
    // and every render site can display it without re-sanitising.
    const raw = String(req.body?.body ?? '');
    const body = sanitizeRichText(raw, { maxLength: MAX_BODY });
    // Reject content that is empty once stripped (e.g. a lone <script>).
    if (!richTextToPlain(body)) return res.status(400).json({ message: 'Message cannot be empty.' });

    const isClient = req.user.role === 'client';
    // Fail closed: staff must opt IN to share a message with the client.
    const clientVisible = isClient ? true : req.body?.clientVisible === true;

    const now = new Date();
    const doc = {
      body,
      clientVisible,
      authorUid: req.user.uid ?? null,
      authorRole: req.user.role ?? null,
      createdAt: now,
    };
    const ref = await msgsCol(taskId).add(doc);

    // Notify the other side. A client's message pings the matter owner; a
    // client-visible staff message pings the client. Internal-only staff messages
    // notify nobody (they're internal chatter).
    try {
      const recipient = isClient ? (task.assignedTo ?? null) : (clientVisible ? task.clientUid : null);
      if (recipient && recipient !== req.user.uid) {
        // Notification/email previews use the PLAIN projection — HTML would be
        // noise in a bell popup and unsafe to inject into an email template.
        const plain = richTextToPlain(body);
        const preview = plain.length > 140 ? `${plain.slice(0, 140)}…` : plain;
        await createNotification({
          recipientUid: recipient,
          type: 'info',
          title: isClient ? 'New message from your client' : 'New message about your service',
          message: preview,
          taskId,
        });

        // Email via the editable template (falls back to a sensible default).
        const to = await emailFor(recipient);
        if (to) {
          const rendered = await renderTemplate('matter_message', {
            clientName: task.clientName ?? '',
            organisation: task.organisation ?? '',
            serviceName: task.serviceName ?? '',
            message: richTextToPlain(body),
            senderName: isClient ? (task.clientName || 'Your client') : CLIENT_FACING_SENDER,
          });
          if (rendered) {
            await sendTemplatedEmail({
              to, subject: rendered.subject, body: rendered.body,
              taskId, serviceName: task.serviceName, organisation: task.organisation ?? undefined,
            });
          }
        }
      }
    } catch (e) {
      logger.warn({ err: e?.message }, 'createMessage: notification/email failed (non-fatal)');
    }

    res.status(201).json({ id: ref.id, ...doc, createdAt: now.toISOString(), isMine: true });
  } catch (err) {
    logger.error({ err }, 'createMessage error:');
    res.status(500).json({ message: 'Failed to post the message' });
  }
}

/** Resolve a user's email address (best-effort). */
async function emailFor(uid) {
  try {
    const d = await db.collection('users').doc(uid).get();
    if (!d.exists) return null;
    const u = d.data();
    return u.email || (Array.isArray(u.emailIds) ? u.emailIds[0] : null) || null;
  } catch { return null; }
}
