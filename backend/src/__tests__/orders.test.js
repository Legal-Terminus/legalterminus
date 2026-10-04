/**
 * E24-S02…S04 — the rules of a website payment: settle once, never on an
 * unproven claim, and the simulator only where no money moves.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import {
  activeGateway, parseWebhookEvent, paymentSignature,
} from '../services/paymentGateway.service.js';
import {
  decideSettlement, matterOutcome, newOrderId, publicOrder,
} from '../services/orders.service.js';
import { createOrderSchema, simulateSchema, verifyOrderSchema } from '../schemas/order.schema.js';

const prev = process.env.TEST_ACCOUNT_EMAIL_DOMAINS;
test.afterEach(() => {
  if (prev === undefined) delete process.env.TEST_ACCOUNT_EMAIL_DOMAINS; else process.env.TEST_ACCOUNT_EMAIL_DOMAINS = prev;
});

test('the simulator is the gateway only in a guarded test environment', () => {
  delete process.env.TEST_ACCOUNT_EMAIL_DOMAINS;
  // Production: asking for the simulator does not get it. It takes "payment" for free.
  assert.equal(activeGateway({ PAYMENT_GATEWAY: 'simulated' }), null);
  assert.equal(activeGateway({}), null, 'nothing configured = payments off');
  process.env.TEST_ACCOUNT_EMAIL_DOMAINS = 'legalterminus.test';
  assert.equal(activeGateway({ PAYMENT_GATEWAY: 'simulated' }), 'simulated');
  assert.equal(activeGateway({}), null);
  // Real keys win everywhere.
  assert.equal(activeGateway({ PAYMENT_GATEWAY: 'simulated', RAZORPAY_KEY_ID: 'k', RAZORPAY_KEY_SECRET: 's' }), 'razorpay');
  delete process.env.TEST_ACCOUNT_EMAIL_DOMAINS;
  assert.equal(activeGateway({ RAZORPAY_KEY_ID: 'k', RAZORPAY_KEY_SECRET: 's' }), 'razorpay');
  assert.equal(activeGateway({ RAZORPAY_KEY_ID: 'k' }), null, 'half a key pair is no gateway');
});

test('the payment signature is Razorpay’s scheme: HMAC-SHA256 of "order|payment"', () => {
  const expected = crypto.createHmac('sha256', 'secret').update('order_1|pay_1').digest('hex');
  assert.equal(paymentSignature('secret', 'order_1', 'pay_1'), expected);
  assert.notEqual(paymentSignature('secret', 'order_1', 'pay_2'), expected);
  assert.notEqual(paymentSignature('other', 'order_1', 'pay_1'), expected);
});

test('parseWebhookEvent reads Razorpay’s payload and converts paise to rupees', () => {
  const body = (event, extra = {}) => ({ event, payload: { payment: { entity: { id: 'pay_1', order_id: 'order_1', amount: 649900, method: 'upi', ...extra } } } });
  assert.deepEqual(parseWebhookEvent(body('payment.captured')), { type: 'paid', gatewayOrderId: 'order_1', gatewayPaymentId: 'pay_1', amount: 6499, method: 'upi' });
  assert.equal(parseWebhookEvent(body('order.paid')).type, 'paid');
  assert.equal(parseWebhookEvent(body('payment.failed', { error_description: 'Declined' })).reason, 'Declined');
  assert.equal(parseWebhookEvent(body('refund.processed')).type, 'refunded');
  assert.equal(parseWebhookEvent(body('payment.authorized')), null, 'not money in the bank yet');
  assert.equal(parseWebhookEvent({ event: 'payment.captured', payload: {} }), null);
  assert.equal(parseWebhookEvent(null), null);
});

const order = (over = {}) => ({ status: 'created', amount: 6499, ...over });

test('a verified payment settles an order once; a repeat changes nothing', () => {
  assert.deepEqual(decideSettlement(order(), { amount: 6499 }), { action: 'paid' });
  assert.deepEqual(decideSettlement(order(), { amount: null }), { action: 'paid' }, 'a return carries no amount');
  for (const status of ['paid', 'review', 'refunded']) {
    assert.deepEqual(decideSettlement(order({ status }), { amount: 6499 }), { action: 'noop' }, status);
  }
});

test('a late payment still settles an order that had failed or been abandoned', () => {
  assert.equal(decideSettlement(order({ status: 'failed' }), { amount: 6499 }).action, 'paid');
  assert.equal(decideSettlement(order({ status: 'abandoned' }), { amount: 6499 }).action, 'paid');
});

test('the wrong amount is held for review, never settled', () => {
  const d = decideSettlement(order(), { amount: 6498 });
  assert.equal(d.action, 'review');
  assert.match(d.reason, /6498.*6499/);
  assert.equal(decideSettlement(order(), { amount: 6499.004 }).action, 'paid', 'float noise is not a mismatch');
});

test('a matter is opened only for a service with a workflow', () => {
  assert.deepEqual(matterOutcome({ serviceKey: 'incorporation' }, true), { open: true });
  assert.equal(matterOutcome({ serviceKey: 'trademark-application' }, false).open, false);
  assert.equal(matterOutcome({ serviceKey: null }, true).open, false);
});

test('the customer’s view of an order hides internals', () => {
  const view = publicOrder({
    orderId: 'LT-1', status: 'paid', label: 'Incorporation', planName: 'Elemental', amount: 7999, currency: 'INR',
    createdAt: 'c', paidAt: 'p', gatewayPaymentId: 'pay_1', gatewayOrderId: 'order_1', uid: 'u', serviceKey: 'incorporation',
    customer: { email: 'a@b.test' }, matter: { state: 'failed', error: 'boom' }, settledBy: 'webhook',
  });
  assert.equal(view.matterId, null, 'a matter that failed to open is not shown as one');
  for (const hidden of ['uid', 'gatewayOrderId', 'serviceKey', 'customer', 'matter', 'settledBy']) assert.equal(hidden in view, false, hidden);
  assert.equal(publicOrder({ matter: { state: 'created', taskId: 't1' } }).matterId, 't1');
});

test('order references are readable and unique', () => {
  const a = newOrderId(new Date('2026-10-04T10:00:00Z'));
  assert.match(a, /^LT-20261004-[A-Z0-9]{6}$/);
  assert.notEqual(a, newOrderId(new Date('2026-10-04T10:00:00Z')));
});

test('the request schemas refuse an amount from the browser and unknown outcomes', () => {
  assert.equal(createOrderSchema.safeParse({ productKey: 'incorporation', planId: 'wos-a-elemental' }).success, true);
  assert.equal(createOrderSchema.safeParse({ productKey: 'incorporation', planId: 'x', amount: 1 }).success, false);
  assert.equal(createOrderSchema.safeParse({ productKey: 'incorporation', planId: 'x', customer: { uid: 'someone-else' } }).success, false);
  assert.equal(createOrderSchema.safeParse({ planId: 'x' }).success, false);
  assert.equal(verifyOrderSchema.safeParse({ gatewayPaymentId: 'p', signature: 's' }).success, true);
  assert.equal(verifyOrderSchema.safeParse({ gatewayPaymentId: 'p' }).success, false);
  assert.equal(simulateSchema.safeParse({ outcome: 'success' }).success, true);
  assert.equal(simulateSchema.safeParse({ outcome: 'free_money' }).success, false);
});
