/**
 * #240 — the refund log, and #242 — where a client's website order stands.
 * These pin the pure rules: never refund more than was paid, credited needs a
 * transaction id, final is final, the client never sees who recorded it, and a
 * refund before approval stops the order being approved.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  activeRefundTotal, clientOrderStage, orderRefundRefusal, refundForViewer, refundRefusal,
  refundUpdateRefusal, summariseRefunds, REFUND_LABEL,
} from '../services/refunds.service.js';
import { canApprove, clientOrderView } from '../services/orders.service.js';
import { refundCreateSchema, refundUpdateSchema } from '../schemas/refund.schema.js';

const r = (over) => ({ id: 'r1', refundAmount: 1000, status: 'initiated', reason: 'Cancelled', initiatedAt: '2026-11-01', recordedAt: '2026-11-01T10:00:00Z', ...over });

test('a failed refund no longer counts against what was paid', () => {
  assert.equal(activeRefundTotal([r(), r({ id: 'r2', refundAmount: 500, status: 'failed' }), r({ id: 'r3', refundAmount: 250, status: 'credited' })]), 1250);
  assert.equal(activeRefundTotal([r()], 'r1'), 0, 'the excluded refund is left out');
});

test('a refund may never exceed the amount paid, counting every refund still standing', () => {
  assert.equal(refundRefusal({ refundAmount: 5000, paid: 5000, refunds: [], status: 'initiated' }), null);
  const over = refundRefusal({ refundAmount: 4001, paid: 5000, refunds: [r()], status: 'initiated' });
  assert.equal(over.status, 400);
  assert.equal(over.code, 'REFUND_EXCEEDS_PAID');
  assert.match(over.message, /4,000/);
  // A failed one frees its amount again.
  assert.equal(refundRefusal({ refundAmount: 5000, paid: 5000, refunds: [r({ status: 'failed' })], status: 'initiated' }), null);
  assert.match(refundRefusal({ refundAmount: 1, paid: 1000, refunds: [r()], status: 'initiated' }).message, /already been refunded/);
  assert.equal(refundRefusal({ refundAmount: 1, paid: 0, refunds: [], status: 'initiated' }).code, 'NOTHING_PAID');
  // Paise are compared as paise, not floats.
  assert.equal(refundRefusal({ refundAmount: 0.3, paid: 0.1 + 0.2, refunds: [], status: 'initiated' }), null);
});

test('"Successfully Credited" needs the transaction id that confirms it', () => {
  assert.equal(refundRefusal({ refundAmount: 10, paid: 100, refunds: [], status: 'credited' }).code, 'TRANSACTION_ID_REQUIRED');
  assert.equal(refundRefusal({ refundAmount: 10, paid: 100, refunds: [], status: 'credited', transactionId: 'rfnd_1' }), null);
  assert.equal(refundUpdateRefusal(r(), { status: 'credited' }).code, 'TRANSACTION_ID_REQUIRED');
  assert.equal(refundUpdateRefusal(r({ transactionId: 'rfnd_1' }), { status: 'credited' }), null);
  assert.equal(refundUpdateRefusal(r(), { status: 'credited', transactionId: 'rfnd_2' }), null);
  assert.equal(REFUND_LABEL.credited, 'Successfully Credited');
});

test('credited and failed are final; the others move on by hand', () => {
  assert.equal(refundUpdateRefusal(r(), { status: 'processing' }), null);
  assert.equal(refundUpdateRefusal(r({ status: 'processing' }), { status: 'failed' }), null);
  assert.equal(refundUpdateRefusal(r({ status: 'credited', transactionId: 'x' }), { status: 'failed' }).code, 'REFUND_FINAL');
  assert.equal(refundUpdateRefusal(r({ status: 'failed' }), { status: 'initiated' }).status, 409);
});

test('the rollup carries totals and the latest refund, and no staff names', () => {
  const s = summariseRefunds([
    r({ recordedByName: 'Staff A' }),
    r({ id: 'r2', refundAmount: 300, status: 'credited', initiatedAt: '2026-11-03', reason: 'Duplicate payment', transactionId: 'rfnd_9' }),
    r({ id: 'r3', refundAmount: 50, status: 'failed', initiatedAt: '2026-10-01' }),
  ]);
  assert.equal(s.count, 3);
  assert.equal(s.activeTotal, 1300);
  assert.equal(s.creditedTotal, 300);
  assert.deepEqual(s.latest, { id: 'r2', status: 'credited', refundAmount: 300, reason: 'Duplicate payment', initiatedAt: '2026-11-03', transactionId: 'rfnd_9' });
  assert.ok(!JSON.stringify(s).includes('Staff A'));
  assert.deepEqual(summariseRefunds([]), { count: 0, activeTotal: 0, creditedTotal: 0, latest: null });
});

test('a client never sees who recorded a refund, or its internal history', () => {
  const row = r({ recordedBy: 'uid-staff', recordedByName: 'Staff A', statusHistory: [{ status: 'initiated' }] });
  const mine = refundForViewer(row, { client: true });
  assert.equal(mine.recordedBy, undefined);
  assert.equal(mine.recordedByName, undefined);
  assert.equal(mine.statusHistory, undefined);
  assert.equal(mine.reason, 'Cancelled');
  assert.equal(refundForViewer(row).recordedByName, 'Staff A');
});

const order = (over = {}) => ({ orderId: 'LT-1', uid: 'c1', status: 'paid', amount: 5900, amountPaid: 5900, matter: { state: 'awaiting_approval' }, ...over });

test('an order is refunded here only before its matter exists', () => {
  assert.equal(orderRefundRefusal(order()), null);
  assert.equal(orderRefundRefusal(order({ status: 'review' })), null);
  assert.equal(orderRefundRefusal(order({ matter: { state: 'not_applicable' } })), null);
  assert.equal(orderRefundRefusal(order({ matter: { state: 'created', taskId: 't1' } })).code, 'USE_MATTER');
  assert.equal(orderRefundRefusal(order({ kind: 'matter_balance', matter: { state: 'credited' } })).code, 'USE_MATTER');
  assert.equal(orderRefundRefusal(order({ status: 'created' })).code, 'NOT_PAID');
  assert.equal(orderRefundRefusal(order({ matter: { state: 'pending' } })).code, 'BUSY');
  assert.equal(orderRefundRefusal(null).status, 404);
});

test('a standing refund stops an order being approved; a failed one does not', () => {
  assert.equal(canApprove(order()), null);
  assert.match(canApprove(order({ refundSummary: { activeTotal: 100, creditedTotal: 0 } })), /refund has been recorded/);
  assert.equal(canApprove(order({ refundSummary: { activeTotal: 0, creditedTotal: 0, count: 1 } })), null);
});

test('#242: where a client\'s order stands — approval is its own stage, never inferred from payment', () => {
  assert.equal(clientOrderStage(order()), 'awaiting_approval');
  assert.equal(clientOrderStage(order({ matter: { state: 'not_applicable' } })), 'awaiting_approval');
  assert.equal(clientOrderStage(order({ status: 'review' })), 'under_review');
  assert.equal(clientOrderStage(order({ matter: { state: 'created', taskId: 't' } })), 'approved');
  assert.equal(clientOrderStage(order({ status: 'refunded' })), 'refunded');
  assert.equal(clientOrderStage(order({ refundSummary: { activeTotal: 5900, creditedTotal: 0 } })), 'refund_in_progress');
  assert.equal(clientOrderStage(order({ refundSummary: { activeTotal: 5900, creditedTotal: 5900 } })), 'refunded');
  // Not service requests: never paid, or a Pay Now payment.
  assert.equal(clientOrderStage(order({ status: 'created' })), null);
  assert.equal(clientOrderStage(order({ status: 'abandoned' })), null);
  assert.equal(clientOrderStage(order({ kind: 'matter_balance' })), null);
});

test('#242: the client\'s view of an order says what was paid and how any refund stands', () => {
  const v = clientOrderView(order({
    label: 'Trademark', planName: 'Basic', gatewayPaymentId: 'pay_1',
    refundSummary: { count: 1, activeTotal: 5900, creditedTotal: 0, latest: { id: 'r1', status: 'processing', refundAmount: 5900, reason: 'Cancelled before work began', initiatedAt: '2026-11-02', transactionId: null } },
  }));
  assert.equal(v.stage, 'refund_in_progress');
  assert.equal(v.amountPaid, 5900);
  assert.equal(v.matterId, null, 'no matter until approval');
  assert.equal(v.refund.latest.reason, 'Cancelled before work began');
  assert.equal(v.refund.latest.id, undefined);
  assert.equal(v.uid, undefined, 'the order\'s internals are not echoed');
  assert.equal(clientOrderView(order()).refund, null);
});

test('the refund schema takes no payment amount or client — those are the server\'s', () => {
  const ok = refundCreateSchema.parse({ reason: '<b>Cancelled</b>', refundAmount: 500, initiatedAt: '2026-11-05' });
  assert.equal(ok.status, 'initiated');
  assert.equal(ok.reason, 'Cancelled', 'tags are stripped');
  assert.equal(refundCreateSchema.safeParse({ reason: 'x', refundAmount: 500, initiatedAt: '2026-11-05', paymentAmount: 99999 }).success, false);
  assert.equal(refundCreateSchema.safeParse({ reason: 'x', refundAmount: 500, initiatedAt: '2026-11-05', clientUid: 'other' }).success, false);
  assert.equal(refundCreateSchema.safeParse({ reason: 'x', refundAmount: 0, initiatedAt: '2026-11-05' }).success, false);
  assert.equal(refundCreateSchema.safeParse({ reason: '  ', refundAmount: 5, initiatedAt: '2026-11-05' }).success, false);
  assert.equal(refundCreateSchema.safeParse({ reason: 'x', refundAmount: 5, initiatedAt: 'yesterday' }).success, false);
  assert.equal(refundCreateSchema.safeParse({ reason: 'x', refundAmount: 5, initiatedAt: '2026-11-05', status: 'refunded' }).success, false);
  assert.equal(refundUpdateSchema.safeParse({}).success, false);
  assert.equal(refundUpdateSchema.safeParse({ status: 'credited', transactionId: 'rfnd_1' }).success, true);
  assert.equal(refundUpdateSchema.safeParse({ refundAmount: 1 }).success, false);
});

test('routes: refunds are written by admin/manager only; /mine precedes /:orderId', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const tasks = fs.readFileSync(path.join(here, '..', 'routes', 'tasks.routes.js'), 'utf8');
  const orders = fs.readFileSync(path.join(here, '..', 'routes', 'orders.routes.js'), 'utf8');
  assert.match(tasks, /router\.get\('\/:taskId\/refunds',\s+requireRole\('admin', 'manager', 'client'\)/);
  assert.match(tasks, /router\.post\('\/:taskId\/refunds',\s+requireRole\('admin', 'manager'\), validate\(refundCreateSchema\)/);
  assert.match(tasks, /router\.patch\('\/:taskId\/refunds\/:refundId',\s+requireRole\('admin', 'manager'\), validate\(refundUpdateSchema\)/);
  for (const m of ['get', 'post', 'patch']) {
    assert.match(orders, new RegExp(`router\\.${m}\\('/:orderId/refunds[^']*', requireRole\\('admin', 'manager'\\)`));
  }
  assert.ok(orders.indexOf("router.get('/mine'") < orders.indexOf("router.get('/:orderId'"));
  assert.match(orders, /router\.get\('\/mine', requireRole\('client'\)/);
});
