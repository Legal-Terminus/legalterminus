/**
 * #222 — additional payment requests. The total is always the server's sum of
 * the lines; a request is paid once; Pay Now pays only the rest of the balance.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  breakupText, cancelRefusal, normaliseLines, outstandingTotal, payRefusal, projectRequest,
  requestSummary, requestTotal, sendRefusal, settleRefusal,
} from '../services/paymentRequests.service.js';
import {
  paymentRequestCancelSchema, paymentRequestCreateSchema, paymentRequestPaySchema, paymentRequestRecordSchema,
} from '../schemas/paymentRequest.schema.js';
import { isMatterKind, payNowAmount, payNowRefusal, publicOrder } from '../services/orders.service.js';

const lines = [
  { name: 'ROC filing fee', description: 'Form INC-32', amount: 1500 },
  { name: 'Stamp duty', amount: 0.1 },
  { name: 'Name reservation', amount: 0.2 },
];

test('the total is the sum of the lines, added in paise', () => {
  assert.equal(requestTotal(lines), 1500.3);
  assert.equal(requestTotal([{ amount: 0.1 }, { amount: 0.2 }]), 0.3);
  assert.equal(requestTotal([]), 0);
});

test('lines are stored trimmed, to the paisa, without empty descriptions', () => {
  assert.deepEqual(normaliseLines([{ name: '  Fee ', description: '  ', amount: 10.004 }]), [
    { name: 'Fee', description: null, amount: 10 },
  ]);
});

test('the request body carries lines only: a total sent by a page is refused', () => {
  assert.equal(paymentRequestCreateSchema.safeParse({ lines }).success, true);
  assert.equal(paymentRequestCreateSchema.safeParse({ lines, total: 1 }).success, false);
  assert.equal(paymentRequestCreateSchema.safeParse({ lines, status: 'paid' }).success, false);
});

test('each line needs a name and a positive amount of at most two decimals', () => {
  const one = (l) => paymentRequestCreateSchema.safeParse({ lines: [l] }).success;
  assert.equal(one({ name: 'Fee', amount: 100.25 }), true);
  assert.equal(one({ name: '', amount: 100 }), false);
  assert.equal(one({ name: '<b></b>', amount: 100 }), false, 'a name of only tags is empty');
  assert.equal(one({ name: 'Fee', amount: 0 }), false);
  assert.equal(one({ name: 'Fee', amount: -5 }), false);
  assert.equal(one({ name: 'Fee', amount: 1.234 }), false);
  assert.equal(one({ name: 'Fee', amount: '100' }), false);
  assert.equal(one({ name: 'Fee', amount: 100, total: 100 }), false, 'a line is strict too');
  assert.equal(paymentRequestCreateSchema.safeParse({ lines: [] }).success, false);
  assert.equal(paymentRequestCreateSchema.safeParse({ lines: Array(21).fill({ name: 'Fee', amount: 1 }) }).success, false);
});

test('fee names lose any markup before they reach an email', () => {
  const r = paymentRequestCreateSchema.parse({ lines: [{ name: '<script>x</script>Stamp duty', amount: 1 }] });
  assert.equal(r.lines[0].name, 'xStamp duty');
});

test('paying, cancelling and recording carry no amount', () => {
  assert.equal(paymentRequestPaySchema.safeParse({ amount: 1 }).success, false);
  assert.equal(paymentRequestCancelSchema.safeParse({ reason: 'Raised twice' }).success, true);
  assert.equal(paymentRequestCancelSchema.safeParse({ amount: 1 }).success, false);
  assert.equal(paymentRequestRecordSchema.safeParse({ mode: 'Bank transfer' }).success, true);
  assert.equal(paymentRequestRecordSchema.safeParse({ mode: 'Bank transfer', amount: 1 }).success, false);
});

test('a request is added to the matter total, so an unpriced matter is refused', () => {
  assert.equal(sendRefusal({ totalCost: 10000 }), null);
  assert.equal(sendRefusal({ totalCost: 0 }).code, 'NO_TOTAL_COST');
  assert.equal(sendRefusal({}).code, 'NO_TOTAL_COST');
  assert.equal(sendRefusal(null).status, 404);
});

test('only an open request can be cancelled', () => {
  assert.equal(cancelRefusal({ status: 'sent' }), null);
  assert.equal(cancelRefusal({ status: 'paid' }).code, 'ALREADY_PAID');
  assert.equal(cancelRefusal({ status: 'cancelled' }).code, 'ALREADY_CANCELLED');
  assert.equal(cancelRefusal(null).status, 404);
});

test('a payment settles a request once, and only for its exact total', () => {
  const r = { status: 'sent', total: 1500.3 };
  assert.equal(settleRefusal(r, 1500.3), null);
  assert.equal(settleRefusal(r, undefined), null, 'staff recording it pay the request total');
  assert.equal(settleRefusal(r, 1500).code, 'AMOUNT_MISMATCH');
  assert.equal(settleRefusal({ ...r, status: 'paid' }, 1500.3).code, 'ALREADY_PAID');
  assert.equal(settleRefusal({ ...r, status: 'cancelled' }, 1500.3).code, 'REQUEST_CANCELLED');
});

test('the client may pay an open request on their own matter only', () => {
  const task = { clientUid: 'c1' };
  assert.equal(payRefusal(task, true, { status: 'sent', total: 100 }), null);
  assert.equal(payRefusal(task, false, { status: 'sent', total: 100 }).status, 404);
  assert.equal(payRefusal(task, true, null).status, 404);
  assert.equal(payRefusal(task, true, { status: 'paid', total: 100 }).code, 'ALREADY_PAID');
  assert.equal(payRefusal(task, true, { status: 'cancelled', total: 100 }).code, 'REQUEST_CANCELLED');
});

test('Pay Now pays the balance less what open requests ask for', () => {
  const task = { paymentStatus: 'part_paid', totalCost: 11500, amountPaid: 4000, amountDue: 7500 };
  const open = outstandingTotal([{ status: 'sent', total: 1500 }, { status: 'paid', total: 900 }, { status: 'cancelled', total: 50 }]);
  assert.equal(open, 1500);
  assert.equal(payNowAmount(task, open), 6000);
  assert.equal(payNowRefusal(task, true, open), null);
  // A fully paid matter given a request: everything due is the request's.
  const onlyRequest = { paymentStatus: 'part_paid', totalCost: 11500, amountPaid: 10000, amountDue: 1500 };
  assert.equal(payNowRefusal(onlyRequest, true, 1500).code, 'NOTHING_DUE');
  // Without requests Pay Now is unchanged.
  assert.equal(payNowAmount(task), 7500);
});

test('a payment-request order is a matter order and names its matter', () => {
  assert.equal(isMatterKind('payment_request'), true);
  assert.equal(isMatterKind('matter_balance'), true);
  assert.equal(isMatterKind(undefined), false);
  const o = publicOrder({ orderId: 'LT-1', kind: 'payment_request', taskId: 't1', requestId: 'r1', matter: { state: 'request', taskId: 't1' }, amount: 1500, status: 'created' });
  assert.equal(o.matterId, 't1');
  assert.equal(o.requestId, 'r1');
});

test('the client sees the breakup but not who raised or cancelled it', () => {
  const r = { lines, total: 1500.3, status: 'sent', createdBy: 'staff1', createdByName: 'Asha', orderId: 'LT-1' };
  const client = projectRequest('r1', r, 'client');
  assert.equal(client.total, 1500.3);
  assert.equal(client.lines.length, 3);
  assert.equal('createdByName' in client, false);
  assert.equal('orderId' in client, false);
  assert.equal(projectRequest('r1', r, 'manager').createdByName, 'Asha');
});

test('the email lists every fee and the total', () => {
  const r = { lines, total: 1500.3 };
  const text = breakupText(r);
  assert.match(text, /ROC filing fee — Form INC-32: ₹1,500/);
  assert.match(text, /Total payable: ₹1,500\.3/);
  assert.equal(requestSummary(r), 'Additional payment: ROC filing fee, Stamp duty, Name reservation');
  assert.equal(requestSummary({ lines: [...lines, { name: 'Extra' }] }), 'Additional payment: ROC filing fee, Stamp duty, Name reservation and 1 more');
});
