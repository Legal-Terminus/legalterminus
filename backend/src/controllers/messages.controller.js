import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { createNotification } from './notifications.controller.js';
import { resolveClientMessageRecipients } from '../services/discussionRecipients.service.js';
import { sendTemplatedEmail } from '../services/emailService.js';
import { notifyChatMessage, CLIENT_FACING_SENDER } from '../services/chatMessageNotify.service.js';
import { renderTemplate } from '../services/emailTemplates.service.js';
import { prepareRichText, richTextToPlain } from '../services/richText.service.js';
import { extractMentionEmails, resolveStaffByEmails, listMentionableStaff } from '../services/mentions.service.js';
import { clientCanSeeMatter } from './tasks.controller.js';
import { resolveCommentImages, shareCommentImages } from '../services/commentImages.service.js';

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
// #123: how a staff sender is shown to the CLIENT is CLIENT_FACING_SENDER
// (chatMessageNotify.service.js), shared with the notification emails.

const chatNoticeDeps = { createNotification, renderTemplate, sendTemplatedEmail, resolveClientMessageRecipients, logger };

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
  // #168: a professional may READ a matter's discussion only if they are the
  // matter's professional; writes are blocked globally by denyReadOnlyRoles.
  if (req.user.role === 'professional' && task.professionalUid !== req.user.uid) {
    res.status(403).json({ message: 'Forbidden' });
    return null;
  }
  // #166: additional client logins share the primary client's scope.
  // #188: additional client contacts on this matter can take part too.
  if (req.user.role === 'client' && !clientCanSeeMatter(req.user, task)) {
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

    // Resolve author names. Staff see every author's real name. Clients see the
    // COMPANY name for staff authors (#123 — never expose individual staff
    // identities), but the REAL name for fellow client users on the same account:
    // #182 — access is granted at ACCOUNT scope (primaryClientUid), so a matter can
    // have several client logins. Labelling a colleague's message "Legal Terminus"
    // made their own team's messages look like they came from us.
    const uids = isClient
      ? [...new Set(rows.filter((m) => m.authorRole === 'client').map((m) => m.authorUid).filter(Boolean))]
      : [...new Set(rows.map((m) => m.authorUid).filter(Boolean))];
    const names = new Map();
    if (uids.length) {
      const docs = await Promise.all(uids.map((u) => db.collection('users').doc(u).get()));
      docs.forEach((d) => { if (d.exists) names.set(d.id, d.data().name || d.data().email || 'Team member'); });
    }

    const data = rows.map((m) => ({
      id: m.id,
      // A deleted message keeps its place in the thread but not its text.
      body: m.deletedAt ? '' : m.body,
      createdAt: m.createdAt,
      editedAt: m.deletedAt ? null : toISO(m.editedAt),
      deleted: Boolean(m.deletedAt),
      // #297: Edit only on your own message; Delete also for an admin.
      canEdit: canEditMessage(req.user, m),
      canDelete: canDeleteMessage(req.user, m),
      clientVisible: m.clientVisible === true,
      authorRole: m.authorRole ?? null,
      isMine: m.authorUid === req.user.uid,
      authorName: isClient
        // Own messages read "You"; a colleague on the same client account reads as
        // their real name (#182); staff authors stay masked as the company (#123).
        ? (m.authorUid === req.user.uid
          ? 'You'
          : (m.authorRole === 'client'
            ? (names.get(m.authorUid) ?? task.clientName ?? 'Client')
            : CLIENT_FACING_SENDER))
        : (names.get(m.authorUid) ?? (m.authorRole === 'client' ? (task.clientName || 'Client') : 'Team member')),
    }));

    res.json({ data });
  } catch (err) {
    logger.error({ err }, 'listMessages error:');
    res.status(500).json({ message: 'Failed to load the chat' });
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
    // #194 (reopened): the word limit is the limit. The message is stored WHOLE
    // or refused with a reason — it used to be cut to 4,000 characters here,
    // which kept about 400 of a 1,000-word message and told nobody.
    const prepared = prepareRichText(raw, { what: 'message' });
    if (!prepared.ok) {
      return res.status(prepared.status).json({ message: prepared.message, code: prepared.code });
    }
    // #122 follow-up: image references must point at THIS matter's images, and
    // a client may quote only images they can already see. Anything else is
    // dropped from the stored content.
    const { html: body, ids: imageIds } = await resolveCommentImages(
      db, taskId, prepared.html, { role: req.user.role, uid: req.user.uid },
    );
    // Reject content that is empty once stripped (e.g. a lone <script>). An
    // image on its own counts as content ("[image]" in the plain projection).
    if (!richTextToPlain(body)) return res.status(400).json({ message: 'Message cannot be empty.' });

    const isClient = req.user.role === 'client';
    // Fail closed: staff must opt IN to share a message with the client.
    const clientVisible = isClient ? true : req.body?.clientVisible === true;

    // #200: a STAFF author may @mention colleagues by email. A client's "@…"
    // stays plain text — their message already reaches the matter owner, and
    // letting a client page any staff address would be a spam channel.
    const mentioned = isClient ? [] : (await resolveStaffByEmails(db, extractMentionEmails(richTextToPlain(body))))
      .filter((u) => u.uid !== req.user.uid);

    const now = new Date();
    const doc = {
      body,
      clientVisible,
      authorUid: req.user.uid ?? null,
      authorRole: req.user.role ?? null,
      createdAt: now,
    };
    const ref = await msgsCol(taskId).add(mentioned.length
      ? { ...doc, mentionedUids: mentioned.map((u) => u.uid) } : doc);
    // A message the client can read shares its images with the client.
    if (clientVisible) await shareCommentImages(db, taskId, imageIds);

    // Notification/email previews use the PLAIN projection — HTML would be noise
    // in a bell popup and unsafe to inject into an email template.
    // #297: the same notice path announces an EDIT (updateMessage below).
    await notifyChatMessage({
      db, task, taskId, author: { uid: req.user.uid, role: req.user.role },
      plain: richTextToPlain(body), clientVisible, mentioned,
    }, chatNoticeDeps);
    res.status(201).json({ id: ref.id, ...doc, createdAt: now.toISOString(), isMine: true });
  } catch (err) {
    logger.error({ err }, 'createMessage error:');
    res.status(500).json({ message: 'Failed to post the message' });
  }
}

/**
 * #295: a message may now be 5,000 words, and every edit or delete keeps the
 * replaced text in `revisions` on the same document. Firestore refuses a
 * document over 1 MiB, so a few edits of a long message would start failing.
 * Keep the NEWEST revisions that fit beside the current text; the oldest go
 * first, and only when they would not fit.
 */
export const MESSAGE_DOC_BUDGET_BYTES = 900_000;
export function appendRevision(revisions, entry, currentBody = '', budget = MESSAGE_DOC_BUDGET_BYTES) {
  const size = (r) => Buffer.byteLength(String(r?.body ?? ''), 'utf8') + 200; // + the entry's other fields
  const list = [...(Array.isArray(revisions) ? revisions : []), entry];
  const room = budget - Buffer.byteLength(String(currentBody ?? ''), 'utf8');
  let total = list.reduce((n, r) => n + size(r), 0);
  let dropped = 0;
  while (list.length && total > room) { total -= size(list.shift()); dropped += 1; }
  return { revisions: list, dropped };
}

/**
 * #297: only the AUTHOR may edit a message — staff could edit a client's words,
 * which the firm does not allow ("an admin may change anyone's" was the
 * 2026-11-05 rule). Identity is the verified token's uid, never anything the
 * request says. Deleting stays open to an admin as moderation: removing a
 * message does not put words in anyone's mouth.
 */
export function canEditMessage(user, m) {
  return Boolean(user?.uid) && !m?.deletedAt && m?.authorUid === user.uid;
}
export function canDeleteMessage(user, m) {
  return Boolean(user?.uid) && !m?.deletedAt && (m?.authorUid === user.uid || user.role === 'admin');
}

/**
 * Load a message the caller may edit (`action: 'edit'`) or delete, or answer
 * the request. A client never learns that an internal message exists: it 404s
 * for them.
 */
async function loadModifiableMessage(req, res, action) {
  const { taskId, messageId } = req.params;
  const task = await loadAuthorizedTask(req, res, taskId);
  if (!task) return null;
  const ref = msgsCol(taskId).doc(messageId);
  const snap = await ref.get();
  const m = snap.exists ? snap.data() : null;
  if (!m || (req.user.role === 'client' && m.clientVisible !== true)) {
    res.status(404).json({ message: 'Message not found' }); return null;
  }
  if (m.deletedAt) { res.status(409).json({ message: 'This message has already been deleted.' }); return null; }
  const allowed = action === 'edit' ? canEditMessage(req.user, m) : canDeleteMessage(req.user, m);
  if (!allowed) {
    res.status(403).json({
      message: action === 'edit'
        ? 'You can only edit messages you wrote.'
        : 'Only the person who wrote this message, or an admin, can delete it.',
    });
    return null;
  }
  return { ref, m, task };
}

/**
 * PATCH /api/tasks/:taskId/messages/:messageId — change a message's text.
 * Author only (#297, `canEditMessage`). The earlier text is kept in `revisions`
 * (never returned by the API) so the firm has a record of what was actually sent.
 *
 * #297: an edit is announced exactly like a new message — a staff edit of a
 * message the client can see emails the client; a client's edit emails the
 * people working the matter — with "edited" wording and the NEW text. An
 * internal staff message tells only colleagues @mentioned for the first time.
 * The read-compare-write runs in a transaction, so a double-clicked Save (two
 * identical PATCHes) changes the message once and notifies once.
 */
export async function updateMessage(req, res) {
  try {
    const found = await loadModifiableMessage(req, res, 'edit');
    if (!found) return;
    const { ref, task } = found;
    const { taskId } = req.params;

    const prepared = prepareRichText(String(req.body?.body ?? ''), { what: 'message' });
    if (!prepared.ok) return res.status(prepared.status).json({ message: prepared.message, code: prepared.code });
    const { html: body, ids: imageIds } = await resolveCommentImages(
      db, taskId, prepared.html, { role: req.user.role, uid: req.user.uid },
    );
    if (!richTextToPlain(body)) {
      return res.status(400).json({ message: 'Message cannot be empty. To remove it, delete it instead.' });
    }

    // #200 on an edit: colleagues @mentioned now who were not before.
    const isClient = req.user.role === 'client';
    const mentionedNow = isClient ? [] : (await resolveStaffByEmails(db, extractMentionEmails(richTextToPlain(body))))
      .filter((u) => u.uid !== req.user.uid);

    const now = new Date();
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const cur = snap.exists ? snap.data() : null;
      // Re-checked inside the transaction: deleted or re-authored meanwhile.
      if (!cur || !canEditMessage(req.user, cur)) return { gone: true };
      if (cur.body === body) return { unchanged: true, editedAt: cur.editedAt };
      const before = new Set(Array.isArray(cur.mentionedUids) ? cur.mentionedUids : []);
      const kept = appendRevision(cur.revisions, { body: cur.body, replacedAt: now, replacedBy: req.user.uid }, body);
      if (kept.dropped) logger.warn({ taskId, messageId: ref.id, dropped: kept.dropped }, 'chat message: oldest revisions dropped to stay under the document limit');
      const allMentioned = [...new Set([...before, ...mentionedNow.map((u) => u.uid)])];
      tx.update(ref, {
        body, editedAt: now, editedBy: req.user.uid, revisions: kept.revisions,
        ...(allMentioned.length ? { mentionedUids: allMentioned } : {}),
      });
      return { newlyMentioned: mentionedNow.filter((u) => !before.has(u.uid)), clientVisible: cur.clientVisible === true };
    });
    if (result.gone) return res.status(409).json({ message: 'This message has already been deleted.' });
    if (result.unchanged) return res.json({ id: ref.id, body, editedAt: toISO(result.editedAt) });

    if (result.clientVisible) await shareCommentImages(db, taskId, imageIds);
    logger.info({ taskId, messageId: ref.id, by: req.user.uid }, 'chat message edited');

    await notifyChatMessage({
      db, task, taskId, author: { uid: req.user.uid, role: req.user.role },
      plain: richTextToPlain(body), clientVisible: isClient ? true : result.clientVisible,
      edited: true, mentioned: result.newlyMentioned,
    }, chatNoticeDeps);

    res.json({ id: ref.id, body, editedAt: now.toISOString() });
  } catch (err) {
    logger.error({ err }, 'updateMessage error:');
    res.status(500).json({ message: 'Failed to edit the message' });
  }
}

/**
 * DELETE /api/tasks/:taskId/messages/:messageId — remove a message for everyone.
 * The thread shows "This message was deleted" in its place, so replies around
 * it still make sense. Like an edit, the text is kept in `revisions`.
 */
export async function deleteMessage(req, res) {
  try {
    const found = await loadModifiableMessage(req, res, 'delete');
    if (!found) return;
    const { ref, m } = found;
    const now = new Date();
    const kept = appendRevision(m.revisions, { body: m.body, replacedAt: now, replacedBy: req.user.uid }, '');
    await ref.update({ body: '', deletedAt: now, deletedBy: req.user.uid, revisions: kept.revisions });
    logger.info({ taskId: req.params.taskId, messageId: ref.id, by: req.user.uid }, 'chat message deleted');
    res.json({ id: ref.id, deleted: true });
  } catch (err) {
    logger.error({ err }, 'deleteMessage error:');
    res.status(500).json({ message: 'Failed to delete the message' });
  }
}

/**
 * GET /api/tasks/:taskId/mentionable — #200: the colleagues a staff member
 * can @mention in this matter's discussion (the composer's suggestion list).
 * Staff only at the route: a client never sees the firm's staff directory.
 */
export async function listMentionable(req, res) {
  try {
    const task = await loadAuthorizedTask(req, res, req.params.taskId);
    if (!task) return;
    const staff = await listMentionableStaff(db);
    res.json({ data: staff.filter((u) => u.uid !== req.user.uid) });
  } catch (err) {
    logger.error({ err }, 'listMentionable error:');
    res.status(500).json({ message: 'Failed to load colleagues' });
  }
}
