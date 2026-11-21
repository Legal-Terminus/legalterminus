/**
 * Chat messages (#123) — LT #295 (5,000-word messages and their edit history)
 * and #297 (edit only your own message; an edit notifies like a new message).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { appendRevision, MESSAGE_DOC_BUDGET_BYTES } from '../controllers/messages.controller.js';

import { canEditMessage, canDeleteMessage } from '../controllers/messages.controller.js';
import { notifyChatMessage, CHAT_NOTICE } from '../services/chatMessageNotify.service.js';
import { TEMPLATE_DEFS, fillTemplate } from '../services/emailTemplates.service.js';

const here = dirname(fileURLToPath(import.meta.url));

const rev = (chars) => ({ body: 'x'.repeat(chars), replacedAt: new Date(), replacedBy: 'u' });

test('#295: edit history is kept whole while it fits', () => {
  const { revisions, dropped } = appendRevision([rev(10)], rev(20), 'current');
  assert.equal(dropped, 0);
  assert.deepEqual(revisions.map((r) => r.body.length), [10, 20]);
});

test('#295: a long message edited many times never outgrows a Firestore document', () => {
  const big = 250_000; // a long, heavily formatted 5,000-word message
  let revisions = [];
  for (let i = 0; i < 10; i += 1) {
    ({ revisions } = appendRevision(revisions, rev(big), 'y'.repeat(big)));
    const bytes = revisions.reduce((n, r) => n + r.body.length + 200, 0) + big;
    assert.ok(bytes <= MESSAGE_DOC_BUDGET_BYTES, `edit ${i + 1}: ${bytes} bytes`);
  }
  assert.ok(revisions.length >= 2, 'the newest revisions are the ones kept');
});

test('#295: multi-byte text is measured in bytes, not characters', () => {
  const hindi = 'क'.repeat(200_000); // 3 bytes each in UTF-8
  const { revisions } = appendRevision([], { body: hindi }, hindi);
  assert.equal(revisions.length, 0, '600 KB + 600 KB does not fit; the old text is not kept');
});

// ── #297: edit only your own message ───────────────────────────────────────

const admin = { uid: 'admin1', role: 'admin' };
const manager = { uid: 'mgr1', role: 'manager' };
const team = { uid: 'team1', role: 'team_member' };
const client = { uid: 'client1', role: 'client' };
const msgBy = (u, extra = {}) => ({ authorUid: u.uid, authorRole: u.role, body: '<p>hi</p>', ...extra });

test('#297: nobody — admin included — may edit a client\'s message', () => {
  const m = msgBy(client, { clientVisible: true });
  for (const u of [admin, manager, team]) assert.equal(canEditMessage(u, m), false, u.role);
  assert.equal(canEditMessage(client, m), true, 'the client may edit their own');
});

test('#297: staff may edit only their own messages', () => {
  assert.equal(canEditMessage(manager, msgBy(manager)), true);
  assert.equal(canEditMessage(admin, msgBy(manager)), false, 'an admin no longer edits a colleague\'s words');
  assert.equal(canEditMessage(team, msgBy(admin)), false);
  assert.equal(canEditMessage({ role: 'admin' }, msgBy(admin)), false, 'no uid, no edit');
  assert.equal(canEditMessage(admin, msgBy(admin, { deletedAt: new Date() })), false, 'a deleted message is final');
});

test('#297: delete stays author-or-admin (moderation), never a colleague or the client', () => {
  assert.equal(canDeleteMessage(admin, msgBy(client)), true);
  assert.equal(canDeleteMessage(manager, msgBy(client)), false);
  assert.equal(canDeleteMessage(client, msgBy(admin)), false);
  assert.equal(canDeleteMessage(team, msgBy(team)), true);
});

test('#297: the API checks edit rights itself, from the verified token — not only the UI', () => {
  const src = readFileSync(join(here, '../controllers/messages.controller.js'), 'utf8');
  const start = src.indexOf('export async function updateMessage(');
  const body = src.slice(start, src.indexOf('\nexport ', start + 10));
  assert.match(body, /loadModifiableMessage\(req, res, 'edit'\)/);
  assert.match(body, /canEditMessage\(req\.user, cur\)/, 're-checked inside the transaction');
  assert.doesNotMatch(body, /req\.body\??\.(authorUid|uid|userId)/, 'identity never comes from the body');
  const routes = readFileSync(join(here, '../routes/tasks.routes.js'), 'utf8');
  assert.match(routes, /router\.patch\('\/:taskId\/messages\/:messageId',\s+requireRole\(/);
});

// ── #297: an edit is announced like a new message ──────────────────────────

/** Records notifications and emails. */
function recorder({ recipients = [], users = {} } = {}) {
  const notes = [];
  const emails = [];
  const deps = {
    createNotification: async (n) => { notes.push(n); return 'n'; },
    // The built-in defaults, filled — never a Firestore read from a unit test.
    renderTemplate: async (key, vars) => (TEMPLATE_DEFS[key]
      ? { subject: fillTemplate(TEMPLATE_DEFS[key].subject, vars), body: fillTemplate(TEMPLATE_DEFS[key].body, vars) }
      : null),
    sendTemplatedEmail: async (e) => { emails.push(e); return true; },
    resolveClientMessageRecipients: async () => ({ recipients, fallback: false }),
    logger: { warn: () => {}, info: () => {} },
  };
  const db = {
    collection: () => ({ doc: (uid) => ({ get: async () => ({ exists: !!users[uid], data: () => users[uid] }) }) }),
  };
  return { notes, emails, deps, db };
}
const TASK = { clientUid: 'client1', clientName: 'Acme', serviceName: 'GST Return', organisation: 'Acme Pvt Ltd', ccEmails: ['cc@acme.test'] };

test('#297: a staff edit of a shared message emails the client ONCE, says "edited", carries the new text', async () => {
  const r = recorder({ users: { client1: { email: 'client@acme.test' } } });
  const out = await notifyChatMessage({
    db: r.db, task: TASK, taskId: 't1', author: manager, plain: 'Please send the details of ABC.',
    clientVisible: true, edited: true,
  }, r.deps);
  assert.deepEqual(out, { team: 0, client: 1, mentions: 0 });
  assert.equal(r.notes.length, 1);
  assert.equal(r.notes[0].recipientUid, 'client1');
  assert.equal(r.notes[0].title, CHAT_NOTICE.client.edited.title);
  assert.equal(r.notes[0].email, false, 'no second email from the notification mirror');
  assert.equal(r.emails.length, 1);
  assert.equal(r.emails[0].to, 'client@acme.test');
  assert.deepEqual(r.emails[0].cc, ['cc@acme.test']);
  assert.match(r.emails[0].subject, /edited/i);
  assert.match(r.emails[0].body, /edited a message/);
  assert.match(r.emails[0].body, /Please send the details of ABC\./);
  assert.match(r.emails[0].body, /Legal Terminus/, 'staff are shown to the client as the firm');
});

test('#297: a client\'s edit emails the people working the matter, with the internal edited wording', async () => {
  const r = recorder({ recipients: [{ uid: 'owner', name: 'Owner', email: 'o@firm.test' }, { uid: 'team1', name: 'T', email: 't@firm.test' }] });
  const out = await notifyChatMessage({
    db: r.db, task: TASK, taskId: 't1', author: client, plain: 'Name is XYZ, not XZY.', clientVisible: true, edited: true,
  }, r.deps);
  assert.equal(out.team, 2);
  assert.deepEqual(r.emails.map((e) => e.to), ['o@firm.test', 't@firm.test']);
  assert.ok(r.emails.every((e) => /Acme edited a message/.test(e.subject) && /XYZ, not XZY/.test(e.body)));
  assert.ok(r.emails.every((e) => e.cc === undefined), 'internal email never copies the client\'s CC list');
  assert.ok(r.notes.every((n) => n.email === false && n.title === CHAT_NOTICE.team.edited.title));
});

test('#297: an internal staff message edit tells nobody but newly mentioned colleagues', async () => {
  const r = recorder({ users: { mgr1: { name: 'Mina' } } });
  const out = await notifyChatMessage({
    db: r.db, task: TASK, taskId: 't1', author: manager, plain: 'note for @t@firm.test', clientVisible: false,
    edited: true, mentioned: [{ uid: 'team1', email: 't@firm.test', name: 'T' }],
  }, r.deps);
  assert.deepEqual(out, { team: 0, client: 0, mentions: 1 });
  assert.equal(r.emails.length, 1);
  assert.equal(r.emails[0].to, 't@firm.test');
  assert.ok(!r.notes.some((n) => n.recipientUid === 'client1'), 'the client is never told about an internal note');
});

test('#297: a new message keeps its original wording (no regression)', async () => {
  const r = recorder({ users: { client1: { email: 'client@acme.test' } } });
  await notifyChatMessage({ db: r.db, task: TASK, taskId: 't1', author: admin, plain: 'Hello', clientVisible: true }, r.deps);
  assert.equal(r.notes[0].title, 'New message about your service');
  assert.equal(r.emails[0].subject, TEMPLATE_DEFS.matter_message.subject);
});

test('#297: both edited templates exist, are editable, and carry the message', () => {
  for (const key of ['matter_message_edited', 'matter_message_team_edited']) {
    assert.ok(TEMPLATE_DEFS[key], key);
    assert.ok(TEMPLATE_DEFS[key].placeholders.includes('message'));
    assert.match(TEMPLATE_DEFS[key].body, /\{\{message\}\}/);
    assert.match(TEMPLATE_DEFS[key].subject + TEMPLATE_DEFS[key].body, /edited/i);
  }
});
