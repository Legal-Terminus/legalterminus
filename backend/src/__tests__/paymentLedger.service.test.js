/**
 * #202 — the amount paid is the sum of the payment history.
 * These pin the pure rules every payment writer now shares.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveRollup, sumLedger, creationPaymentRow, openingBalanceRow,
} from '../services/paymentLedger.service.js';

test('the paid figure is the sum of the ledger', () => {
  assert.equal(sumLedger([{ amount: 4000 }, { amount: 2500 }, { amount: 3500 }]), 10000);
  assert.equal(sumLedger([]), 0);
  assert.equal(sumLedger([{ amount: undefined }, { amount: 100 }]), 100);
});

test('status and amount due follow from the figures', () => {
  assert.deepEqual(deriveRollup(10000, 0), { amountPaid: 0, amountDue: 10000, paymentStatus: 'not_paid' });
  assert.deepEqual(deriveRollup(10000, 4000), { amountPaid: 4000, amountDue: 6000, paymentStatus: 'part_paid' });
  assert.deepEqual(deriveRollup(10000, 10000), { amountPaid: 10000, amountDue: 0, paymentStatus: 'fully_paid' });
});

test('money received on an unpriced matter is never "fully paid"', () => {
  assert.equal(deriveRollup(0, 5000).paymentStatus, 'part_paid');
});

test('a creation payment becomes the first ledger row', () => {
  const row = creationPaymentRow({ amount: 4000, mode: 'UPI', description: '', actorUid: 'a1', actorName: 'Asha', now: 'T' });
  assert.equal(row.amount, 4000);
  assert.equal(row.mode, 'UPI');
  assert.equal(row.recordedBy, 'a1');
  assert.equal(row.source, 'matter_creation');
  // A ledger row requires a mode; creation does not.
  assert.equal(creationPaymentRow({ amount: 1, now: 'T' }).mode, 'Not specified');
});

test('nothing received at creation writes no row', () => {
  assert.equal(creationPaymentRow({ amount: 0, now: 'T' }), null);
  assert.equal(creationPaymentRow({ amount: undefined, now: 'T' }), null);
});

test('a pre-ledger paid figure becomes an opening balance, not a wipe', () => {
  const row = openingBalanceRow({ amountPaid: 4000, paymentMode: 'Cash', createdAt: 'C' }, 'T');
  assert.equal(row.amount, 4000);
  assert.equal(row.paidAt, 'C');
  assert.equal(row.source, 'opening_balance');
  assert.equal(openingBalanceRow({ amountPaid: 0 }, 'T'), null);
});
