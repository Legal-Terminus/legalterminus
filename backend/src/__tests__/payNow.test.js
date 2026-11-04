/**
 * #220 Pay Now — who may pay a matter online, and for how much. The amount is
 * always the matter's own amount due; the page sends nothing.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { amountDueOf, payNowRefusal, publicOrder } from '../services/orders.service.js';
import { matterPayNowSchema } from '../schemas/order.schema.js';
import { taskPaymentUpdateSchema } from '../schemas/task.schema.js';

const partPaid = { paymentStatus: 'part_paid', totalCost: 5000, amountPaid: 2000, amountDue: 3000 };

test('the amount due is the matter rollup — the issue example is exactly 3000', () => {
  assert.equal(amountDueOf(partPaid), 3000);
  // A matter written before amountDue existed falls back to cost minus paid.
  assert.equal(amountDueOf({ totalCost: 5000, amountPaid: 2000 }), 3000);
  assert.equal(amountDueOf({ totalCost: 1000, amountPaid: 1500 }), 0);
});

test('a part-paid matter the client can see may be paid', () => {
  assert.equal(payNowRefusal(partPaid, true), null);
  // On by default: only an explicit `false` switches it off.
  assert.equal(payNowRefusal({ ...partPaid, onlinePaymentEnabled: true }, true), null);
});

test('refused: someone else’s matter answers as if it did not exist', () => {
  assert.equal(payNowRefusal(partPaid, false).status, 404);
  assert.equal(payNowRefusal(null, false).status, 404);
});

test('refused: switched off for this matter by an admin or manager', () => {
  const r = payNowRefusal({ ...partPaid, onlinePaymentEnabled: false }, true);
  assert.equal(r.status, 409);
  assert.equal(r.code, 'PAY_NOW_OFF');
});

test('refused: nothing part-paid is due', () => {
  for (const t of [
    { paymentStatus: 'fully_paid', totalCost: 5000, amountPaid: 5000, amountDue: 0 },
    { paymentStatus: 'not_paid', totalCost: 5000, amountPaid: 0, amountDue: 5000 },
    { paymentStatus: 'part_paid', totalCost: 0, amountPaid: 100, amountDue: 0 },
  ]) {
    assert.equal(payNowRefusal(t, true).code, 'NOTHING_DUE');
  }
});

test('the request carries no amount: one sent by a tampered page is refused', () => {
  assert.equal(matterPayNowSchema.safeParse({}).success, true);
  assert.equal(matterPayNowSchema.safeParse({ amount: 1 }).success, false);
});

test('only an admin/manager payment update can switch Pay Now', () => {
  assert.equal(taskPaymentUpdateSchema.safeParse({ onlinePaymentEnabled: false }).success, true);
  assert.equal(taskPaymentUpdateSchema.safeParse({ onlinePaymentEnabled: 'no' }).success, false);
});

test('the client sees which matter a Pay Now order paid', () => {
  const o = publicOrder({ orderId: 'LT-1', kind: 'matter_balance', taskId: 't1', matter: { state: 'balance', taskId: 't1' }, amount: 3000, status: 'created' });
  assert.equal(o.matterId, 't1');
  assert.equal(o.kind, 'matter_balance');
  assert.equal(publicOrder({ orderId: 'LT-2', matter: { state: 'awaiting_approval' }, amount: 1, status: 'paid' }).matterId, null);
});
