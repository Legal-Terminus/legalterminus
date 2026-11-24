/**
 * #358 — a client's document upload emails the people on that step.
 *
 * Run: npm test (from backend/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { notifyClientDocumentsSubmitted, DOCUMENTS_NOTICE } from '../services/documentSubmitNotify.service.js';
import { resolveClientMessageRecipients } from '../services/discussionRecipients.service.js';
import { TEMPLATE_DEFS, fillTemplate } from '../services/emailTemplates.service.js';

const TASK = {
  clientUid: 'client1', clientName: 'Acme', serviceName: 'GST Return', organisation: 'Acme Pvt Ltd',
  ccEmails: ['cc@acme.test'], assignedTo: 'owner1', currentStepNumber: 1,
};
const USERS = {
  owner1: { role: 'manager', name: 'Olga', email: 'owner@firm.test' },
  step2a: { role: 'team_member', name: 'Sam', email: 'sam@firm.test' },
  step2b: { role: 'team_member', name: 'Tia', email: 'tia@firm.test' },
  step1: { role: 'team_member', name: 'Uma', email: 'uma@firm.test' },
  gone: { role: 'team_member', name: 'Gone', email: 'gone@firm.test', status: 'deactivated' },
  admin1: { role: 'admin', name: 'Ada', email: 'ada@firm.test' },
};

/** A tiny in-memory Firestore: users + one matter's steps. */
function fakeDb({ users = USERS, steps = {} } = {}) {
  const docOf = (data) => ({ get: async () => ({ exists: !!data, data: () => data }) });
  return {
    collection: (name) => {
      if (name === 'users') {
        return {
          doc: (uid) => docOf(users[uid]),
          where: (_f, _op, role) => ({
            get: async () => ({
              docs: Object.entries(users).filter(([, u]) => u.role === role).map(([id, u]) => ({ id, data: () => u })),
            }),
          }),
        };
      }
      return { doc: () => ({ collection: () => ({ doc: (n) => docOf(steps[n]) }) }) };
    },
  };
}

function recorder() {
  const notes = [];
  const emails = [];
  const deps = {
    createNotification: async (n) => { notes.push(n); return 'n'; },
    renderTemplate: async (key, vars) => {
      const def = TEMPLATE_DEFS[key];
      const filled = { ...vars };
      return { subject: fillTemplate(def.subject, filled), body: fillTemplate(def.body, filled) };
    },
    sendTemplatedEmail: async (e) => { emails.push(e); return true; },
    resolveClientMessageRecipients,
    logger: { warn: () => {}, info: () => {} },
  };
  return { notes, emails, deps };
}

const client = { uid: 'client1', role: 'client' };

test('#358: the step\'s assignees are emailed, not just the matter owner', async () => {
  const db = fakeDb({ steps: { 1: { assignedTo: 'step1' }, 2: { title: 'Collect invoices', assignedToUids: ['step2a', 'step2b'] } } });
  const r = recorder();
  const told = await notifyClientDocumentsSubmitted({
    db, task: TASK, taskId: 't1', author: client,
    submitted: [{ id: 'd1', fileName: 'sales.pdf', stepNumber: 2 }],
  }, r.deps);
  assert.equal(told, 3);
  assert.deepEqual(r.emails.map((e) => e.to).sort(), ['owner@firm.test', 'sam@firm.test', 'tia@firm.test']);
  assert.ok(!r.emails.some((e) => e.to === 'uma@firm.test'), 'the CURRENT step is not told about another step\'s upload');
  for (const e of r.emails) {
    assert.equal(e.cc, undefined, 'internal: never cc the client\'s extra addresses');
    assert.match(e.body, /sales\.pdf \(Step 2: Collect invoices\)/);
    assert.match(e.subject, /Acme uploaded documents · GST Return/);
  }
  assert.ok(r.notes.every((n) => n.email === false), 'one email per person: no mirror email');
  assert.equal(r.notes[0].title, DOCUMENTS_NOTICE.title(1));
});

test('#358: a batch across steps is one email per person, listing every file', async () => {
  const db = fakeDb({ steps: { 1: { assignedTo: 'step1' }, 2: { assignedToUids: ['step2a'] } } });
  const r = recorder();
  await notifyClientDocumentsSubmitted({
    db, task: TASK, taskId: 't1', author: client,
    submitted: [
      { id: 'd1', fileName: 'a.pdf', stepNumber: 1 },
      { id: 'd2', fileName: 'b.pdf', stepNumber: 2 },
      { id: 'd3', fileName: 'c.pdf', stepNumber: null },
    ],
  }, r.deps);
  const owner = r.emails.filter((e) => e.to === 'owner@firm.test');
  assert.equal(owner.length, 1, 'the owner is on every step but gets ONE email');
  assert.match(owner[0].body, /a\.pdf[\s\S]*b\.pdf[\s\S]*c\.pdf/);
  assert.match(owner[0].body, /uploaded 3 document/);
  // A step-less document goes to the current step (1), so Uma hears about a and c.
  const uma = r.emails.find((e) => e.to === 'uma@firm.test');
  assert.match(uma.body, /a\.pdf/);
  assert.match(uma.body, /c\.pdf/);
  assert.doesNotMatch(uma.body, /b\.pdf/);
});

test('#358: nobody on the matter or step → the admins; deactivated staff never', async () => {
  const db = fakeDb({ steps: { 2: { assignedTo: 'gone' } } });
  const r = recorder();
  await notifyClientDocumentsSubmitted({
    db, task: { ...TASK, assignedTo: null }, taskId: 't1', author: client,
    submitted: [{ id: 'd1', fileName: 'a.pdf', stepNumber: 2 }],
  }, r.deps);
  assert.deepEqual(r.emails.map((e) => e.to), ['ada@firm.test']);
});

test('#358: a failing email never fails the submit', async () => {
  const db = fakeDb({ steps: { 2: { assignedTo: 'step2a' } } });
  const r = recorder();
  r.deps.sendTemplatedEmail = async () => { throw new Error('smtp down'); };
  const told = await notifyClientDocumentsSubmitted({
    db, task: TASK, taskId: 't1', author: client,
    submitted: [{ id: 'd1', fileName: 'a.pdf', stepNumber: 2 }],
  }, r.deps);
  assert.equal(told, 0);
});

test('#358: the template is editable and fills every placeholder it lists', () => {
  const def = TEMPLATE_DEFS.documents_submitted_team;
  assert.equal(def.audience, 'internal');
  for (const p of ['recipientName', 'clientName', 'serviceName', 'documents', 'documentCount']) {
    assert.ok(def.placeholders.includes(p), p);
    assert.match(def.subject + def.body, new RegExp(`\\{\\{${p}\\}\\}`), p);
  }
});
