/**
 * #276 — Razorpay "Customer Fee Bearer": Razorpay adds its fee for the chosen
 * payment method at checkout and the client pays order + fee. A payment is
 * settled when its verified amount is the order's amount, OR the order's
 * amount + the fee the gateway reports for THAT payment; anything else is
 * held for review. The fee is recorded for staff, never shown to the client,
 * and never changes what is credited to a matter.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { feeOf, parseWebhookEvent } from '../services/paymentGateway.service.js';
import {
  MAX_FEE_SHARE, MIN_FEE_ALLOWANCE, clientOrderView, convenienceFee, decideSettlement, feeFields, publicOrder,
} from '../services/orders.service.js';
import { simulateSchema } from '../schemas/order.schema.js';

// Razorpay's standard rate on ₹1,180: 2% = 23.60, GST 18% on it = 4.25 → fee 27.85.
const website = (over = {}) => ({ status: 'created', kind: 'website', amount: 1180, ...over });
const payNow = (over = {}) => ({ status: 'created', kind: 'matter_balance', taskId: 't1', amount: 3000, ...over });
const request = (over = {}) => ({ status: 'created', kind: 'payment_request', taskId: 't1', requestId: 'r1', amount: 4500, ...over });

for (const [name, make] of [['website order', website], ['Pay Now', payNow], ['payment request', request]]) {
  test(`${name}: the base amount alone settles, exactly as before (account not yet fee bearer)`, () => {
    const o = make();
    assert.deepEqual(decideSettlement(o, { amount: o.amount }), { action: 'paid' });
    // An ordinary account's entity still carries Razorpay's fee — the FIRM's cost, not the client's.
    assert.deepEqual(decideSettlement(o, { amount: o.amount, fee: 27.85, tax: 4.25 }), { action: 'paid' });
    assert.deepEqual(decideSettlement(o, { amount: null }), { action: 'paid' }, 'a return without figures, as before');
  });

  test(`${name}: base + the fee reported for that payment settles, and the fee is recorded apart`, () => {
    const o = make();
    const fee = Math.round(o.amount * 2 * 1.18) / 100;
    const payment = { amount: Math.round((o.amount + fee) * 100) / 100, fee, tax: Math.round(o.amount * 2 * 0.18) / 100 };
    const d = decideSettlement(o, payment);
    assert.equal(d.action, 'paid');
    assert.equal(d.convenienceFee, fee);
    assert.equal(d.convenienceFeeTax, payment.tax);
    assert.deepEqual(feeFields(d, payment), { convenienceFee: fee, convenienceFeeTax: payment.tax, gatewayAmount: payment.amount });
  });

  test(`${name}: any other amount is held for review — with or without a fee reported`, () => {
    const o = make();
    assert.equal(decideSettlement(o, { amount: o.amount - 1 }).action, 'review');
    assert.equal(decideSettlement(o, { amount: o.amount + 10 }).action, 'review', 'more, with no fee to explain it');
    assert.equal(decideSettlement(o, { amount: o.amount + 28.85, fee: 27.85 }).action, 'review', 'a rupee over base + fee');
    assert.equal(decideSettlement(o, { amount: o.amount + 26.85, fee: 27.85 }).action, 'review', 'a rupee under base + fee');
    assert.equal(decideSettlement(o, { amount: o.amount - 27.85, fee: 27.85 }).action, 'review', 'less than the order is never a fee');
    assert.match(decideSettlement(o, { amount: o.amount + 30, fee: 27.85 }).reason, /reported a fee of ₹27\.85/);
  });
}

test('a missing, zero, negative, non-numeric or absurd fee is never accepted', () => {
  const o = website();
  for (const fee of [undefined, null, 0, -27.85, '27.85', NaN, Infinity]) {
    assert.equal(convenienceFee(o, { amount: 1207.85, fee }), null, `fee ${String(fee)}`);
    assert.equal(decideSettlement(o, { amount: 1207.85, fee }).action, 'review', `fee ${String(fee)}`);
  }
  // Absurd: more than 10% of the order (₹118 here) — even if the arithmetic adds up.
  assert.equal(MAX_FEE_SHARE, 0.10);
  assert.equal(decideSettlement(o, { amount: 1180 + 200, fee: 200 }).action, 'review');
  assert.equal(decideSettlement(o, { amount: 1180 + 118, fee: 118 }).action, 'paid', 'exactly 10% is the limit');
  // A small order may carry up to ₹25.
  assert.equal(MIN_FEE_ALLOWANCE, 25);
  assert.equal(decideSettlement(website({ amount: 50 }), { amount: 75, fee: 25 }).action, 'paid');
  assert.equal(decideSettlement(website({ amount: 50 }), { amount: 76, fee: 26 }).action, 'review');
});

test('the fee’s GST is kept only when it is a sane part of the fee', () => {
  const o = website();
  assert.equal(convenienceFee(o, { amount: 1207.85, fee: 27.85, tax: 4.25 }).tax, 4.25);
  assert.equal(convenienceFee(o, { amount: 1207.85, fee: 27.85 }).tax, null);
  assert.equal(convenienceFee(o, { amount: 1207.85, fee: 27.85, tax: -1 }).tax, null);
  assert.equal(convenienceFee(o, { amount: 1207.85, fee: 27.85, tax: 30 }).tax, null);
});

test('a repeat after settlement changes nothing, fee or not', () => {
  for (const status of ['paid', 'review', 'refunded']) {
    assert.deepEqual(decideSettlement(website({ status }), { amount: 1207.85, fee: 27.85 }), { action: 'noop' });
  }
});

test('feeFields records nothing when the client paid no fee', () => {
  assert.deepEqual(feeFields({ action: 'paid' }, { amount: 1180, fee: 27.85 }), {});
});

test('the gateway reads fee and tax from the payment entity (paise → rupees), only from whole non-negative paise', () => {
  assert.deepEqual(feeOf({ fee: 2785, tax: 425 }), { fee: 27.85, tax: 4.25 });
  assert.deepEqual(feeOf({}), { fee: null, tax: null });
  assert.deepEqual(feeOf({ fee: -5, tax: 1.5 }), { fee: null, tax: null });
  assert.deepEqual(feeOf({ fee: '2785' }), { fee: null, tax: null });
  const hook = parseWebhookEvent({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_1', order_id: 'order_1', amount: 120785, fee: 2785, tax: 425, method: 'card' } } } });
  assert.deepEqual([hook.amount, hook.fee, hook.tax], [1207.85, 27.85, 4.25]);
  const d = decideSettlement(website(), hook);
  assert.deepEqual([d.action, d.convenienceFee], ['paid', 27.85]);
});

test('the client never sees the fee: their order shows the base amount paid', () => {
  const paid = website({
    orderId: 'LT-1', status: 'paid', label: 'GST', planName: 'Elemental', price: 1000, gst: 180,
    amountPaid: 1180, convenienceFee: 27.85, convenienceFeeTax: 4.25, gatewayAmount: 1207.85,
  });
  for (const view of [publicOrder(paid), clientOrderView(paid)]) {
    const json = JSON.stringify(view);
    assert.equal(/convenience|gatewayAmount|27\.85|1207/.test(json), false, json);
  }
  assert.equal(clientOrderView(paid).amountPaid, 1180);
});

test('the simulator can play a fee-bearer account (test environments only)', () => {
  for (const outcome of ['success_fee', 'fee_webhook', 'fee_mismatch']) {
    assert.equal(simulateSchema.safeParse({ outcome }).success, true);
  }
  assert.equal(simulateSchema.safeParse({ outcome: 'success_fee', fee: 1 }).success, false, 'no fee from the browser');
});
