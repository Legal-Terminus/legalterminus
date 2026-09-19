/**
 * The firm-readable export (ported from Ambyflow, Story 37.4).
 *
 * These assert the file a CUSTOMER opens, not our restore artifact: that the
 * bytes are a real workbook, that the sheets use the words the UI uses, and
 * that nothing in a client's data can execute when they open it.
 *
 * Run: npm test (from backend/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';

import { buildFirmWorkbook } from '../services/workbookExport.service.js';

const SUBS = {
  t1: {
    steps: [
      ['1', { stepNumber: 1, title: 'Name search', status: 'completed', ownerType: 'team', assignedTo: 'u1' }],
      ['2', { stepNumber: 2, title: 'MCA filing', status: 'active', ownerType: 'govt' }],
    ],
    documents: [['d1', { title: 'PAN card', status: 'approved', version: 2, uploadedBy: 'u1', visibleToClient: true }]],
    payments: [['p1', { amount: 5000, mode: 'upi', createdAt: '2026-09-02T00:00:00Z', createdBy: 'u1' }]],
  },
};

const snap = (docs) => ({
  docs: docs.map(([id, data]) => ({
    id,
    data: () => data,
    ref: { collection: (c) => ({ get: async () => snap(SUBS[id]?.[c] || []) }) },
  })),
  forEach(fn) { this.docs.forEach(fn); },
});

const makeDb = (tasks, users) => ({
  collection: (c) => ({
    get: async () => {
      if (c === 'users') return snap(users);
      if (c === 'tasks') return snap(tasks);
      return snap([]);
    },
  }),
});

const USERS = [
  ['u1', { name: 'Priya Sharma', email: 'priya@x.in', role: 'admin', status: 'active' }],
  ['c1', { name: 'ABC Technologies', organisation: 'ABC Pvt Ltd', email: 'abc@x.in', role: 'client' }],
];
const TASKS = [
  ['t1', {
    clientName: 'ABC Technologies', clientUid: 'c1', organisation: 'ABC Pvt Ltd',
    serviceName: 'Company Incorporation', status: 'active', currentStepNumber: 2, totalSteps: 2,
    assignedTo: 'u1', totalCost: 25000, amountPaid: 5000, paymentStatus: 'part_paid',
    createdAt: '2026-08-01T00:00:00Z',
  }],
];

const read = async (tasks = TASKS, users = USERS) => {
  const { buffer, counts } = await buildFirmWorkbook(makeDb(tasks, users), {
    firmName: 'Acme & Co', generatedFor: 'ops@legalterminus.com',
  });
  return { wb: XLSX.read(buffer, { type: 'buffer' }), buffer, counts };
};

test('produces a real workbook with a sheet per thing a firm owns', async () => {
  const { wb } = await read();
  assert.deepEqual(wb.SheetNames, ['Read me', 'Matters', 'Tasks', 'Clients', 'Team', 'Documents', 'Payments']);
});

test('sheets use the words the UI uses, not the code terms', async () => {
  // CLAUDE.md vocabulary: a `tasks` doc is a "Matter", a step is a "Task".
  // Handing a CA a sheet of "tasks" meaning steps would describe a product
  // they do not recognise.
  const { wb } = await read();
  assert.ok(wb.SheetNames.includes('Matters'));
  const matters = XLSX.utils.sheet_to_json(wb.Sheets.Matters);
  assert.equal(matters[0]['Matter ID'], 't1');
  assert.equal(matters[0]['Total tasks'], '2');
});

test('amount due is computed, not left for the reader', async () => {
  const { wb } = await read();
  const m = XLSX.utils.sheet_to_json(wb.Sheets.Matters)[0];
  assert.equal(m['Total fees'], 25000);
  assert.equal(m['Amount paid'], 5000);
  assert.equal(m['Amount due'], 20000);
});

test('the department/client/team distinction survives the export', async () => {
  // "Waiting on MCA, not on your team" is what the product is sold on; an
  // export that flattened ownerType would lose the whole argument.
  const { wb } = await read();
  const owners = XLSX.utils.sheet_to_json(wb.Sheets.Tasks).map((r) => r.Owner);
  assert.deepEqual(owners, ['team', 'govt']);
});

test('a formula in client data cannot execute when the file is opened', async () => {
  // CSV/XLSX injection: a client-supplied name beginning = + - @ is evaluated
  // by Excel on open. Neutralised rather than stripped, so the data is intact.
  const tasks = [['t1', { ...TASKS[0][1], clientName: '=cmd|calc!A1', organisation: '+1' }]];
  const { wb } = await read(tasks);
  const m = XLSX.utils.sheet_to_json(wb.Sheets.Matters)[0];
  assert.equal(m.Client, "'=cmd|calc!A1");
  assert.equal(m.Organisation, "'+1");
});

test('uids are resolved to names a person recognises', async () => {
  const { wb } = await read();
  assert.equal(XLSX.utils.sheet_to_json(wb.Sheets.Matters)[0]['Assigned to'], 'Priya Sharma');
});

test('clients and team are separated, not one users dump', async () => {
  const { wb } = await read();
  const clients = XLSX.utils.sheet_to_json(wb.Sheets.Clients);
  const team = XLSX.utils.sheet_to_json(wb.Sheets.Team);
  assert.deepEqual(clients.map((c) => c.Name), ['ABC Technologies']);
  assert.deepEqual(team.map((t) => t.Name), ['Priya Sharma']);
});

test('the read me states what the file does NOT contain', async () => {
  // The document FILES are the obvious omission; a customer must be told,
  // not left to discover it.
  const { wb } = await read();
  const rows = XLSX.utils.sheet_to_json(wb.Sheets['Read me']);
  const note = rows.find((r) => r.Field === 'Note');
  assert.match(String(note.Value), /files themselves are not in this spreadsheet/i);
});

test('an empty workspace still produces a valid, openable file', async () => {
  const { wb, counts, buffer } = await read([], []);
  assert.equal(counts.matters, 0);
  assert.ok(buffer.length > 0);
  assert.deepEqual(XLSX.utils.sheet_to_json(wb.Sheets.Matters), []);
});
