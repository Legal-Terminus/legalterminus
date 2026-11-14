/**
 * LT #296 / #293 — payment entries are not step information. One shared list
 * decides which events carry payment figures; the API keeps them from every
 * role that may not see payments, and the Steps tab never shows them.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PAYMENT_LEDGER_EVENT_TYPES, isPaymentLedgerEvent } from '../../../shared/payments/ledgerEvents.js';

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, p), 'utf8');

test('every event type that writes a payment figure is on the list', () => {
  // Each writer below puts "₹… remaining of ₹…" (or a refund amount) in its comment.
  const writers = [
    read('../controllers/tasks.controller.js'),
    read('../services/paymentRequests.service.js'),
    read('../services/refunds.service.js'),
  ].join('\n');
  const written = [...writers.matchAll(/type: '((?:PAYMENT|REFUND)_[A-Z_]+)'/g)].map((m) => m[1]);
  assert.ok(written.length >= 5, 'found the payment event writers');
  for (const t of new Set(written)) assert.ok(isPaymentLedgerEvent(t), `${t} must be a payment ledger event`);
});

test('gate transitions are step events, not ledger entries', () => {
  assert.equal(isPaymentLedgerEvent('RECORD_PAYMENT'), false);
  assert.equal(isPaymentLedgerEvent('ADMIN_OVERRIDE_PAYMENT'), false);
  assert.equal(isPaymentLedgerEvent('COMPLETE_STEP'), false);
  assert.equal(isPaymentLedgerEvent(undefined), false);
  assert.ok(Object.isFrozen(PAYMENT_LEDGER_EVENT_TYPES));
});

test('the activity feed drops payment entries for roles that may not see payments', () => {
  const src = read('../controllers/tasks.controller.js');
  assert.match(src, /const PAYMENT_VIEW_ROLES = \['admin', 'manager'\];/);
  const start = src.indexOf('export async function listTaskEvents(');
  const body = src.slice(start, src.indexOf('\nexport ', start + 10));
  assert.match(body, /!PAYMENT_VIEW_ROLES\.includes\(req\.user\.role\)/);
  assert.match(body, /isPaymentLedgerEvent\(e\.type\)/);
});

test('the Steps tab never carries a payment entry forward as a step note', () => {
  const page = read('../../../Portal/src/pages/tasks/TaskDetailPage.tsx');
  const start = page.indexOf('const approvalNoteFor');
  assert.ok(start > 0);
  assert.match(page.slice(start, start + 1500), /!isPaymentEvent\(e\.type\)/);
  assert.doesNotMatch(page, /Part payment received/, 'the blinking part-payment banner is gone');
});
