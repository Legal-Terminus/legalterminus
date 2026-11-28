/**
 * LT #368 (Audit) / #369 (Admin Remarks) — the admin's review marks on a matter.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditBlockReason } from '../controllers/matterReview.controller.js';
import { adminRemarksSchema, auditSchema } from '../schemas/task.schema.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(path.join(here, p), 'utf8');

test('#368 a matter is marked Audited only once fully paid', () => {
  assert.equal(auditBlockReason({ paymentStatus: 'fully_paid', amountDue: 0 }), null);
  assert.match(auditBlockReason({ paymentStatus: 'part_paid', amountDue: 500 }), /fully received/);
  assert.match(auditBlockReason({ paymentStatus: 'not_paid' }), /fully received/);
  assert.match(auditBlockReason({ paymentStatus: 'fully_paid', amountDue: 1 }), /fully received/);
});

test('#368 / #369 request shapes', () => {
  assert.equal(auditSchema.safeParse({ audited: true }).success, true);
  assert.equal(auditSchema.safeParse({ audited: 'yes' }).success, false);
  assert.equal(adminRemarksSchema.safeParse({ adminRemarks: '' }).success, true);
  assert.equal(adminRemarksSchema.safeParse({ adminRemarks: 'x'.repeat(2001) }).success, false);
  assert.equal(adminRemarksSchema.safeParse({ adminRemarks: 'ok', other: 1 }).success, false);
});

test('#369 admin-only, #368 admin and manager; never sent to a client or professional (source check)', () => {
  const routes = read('../routes/tasks.routes.js');
  assert.match(routes, /router\.put\('\/:taskId\/admin-remarks', requireRole\('admin'\), validate\(adminRemarksSchema\), setAdminRemarks\)/);
  assert.match(routes, /router\.put\('\/:taskId\/audit', +requireRole\('admin', 'manager'\), validate\(auditSchema\), setAudit\)/);
  const ctl = read('../controllers/tasks.controller.js');
  const projection = ctl.slice(ctl.indexOf('function projectTaskForClient('));
  for (const f of ['adminRemarks', 'adminRemarksBy', 'auditStatus', 'auditedBy', 'auditedByName']) {
    assert.match(projection.slice(0, 1200), new RegExp(`\\b${f}\\b`), `${f} is stripped for clients`);
  }
});
