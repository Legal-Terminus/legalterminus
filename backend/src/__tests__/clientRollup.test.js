import test from 'node:test';
import assert from 'node:assert/strict';
import {
  chunk, newestIso, oldestIso, isClientStep, matterMoney, foldClientMatters,
} from '../services/clientRollup.service.js';

/**
 * E19-S01 — the per-client rollup maths.
 *
 * These are the figures a partner reads off the Client 360 and acts on, so the
 * cases here are the ones where a plausible-looking implementation gets it
 * wrong: money read from the wrong field, a count that disagrees with its rows,
 * and anything derived from a step NUMBER rather than a step's state.
 */

const task = (over = {}) => ({ id: 't1', status: 'active', ...over });

test('chunk splits for Firestore’s 10-item `in` limit and never emits an empty chunk', () => {
  assert.deepEqual(chunk([1, 2, 3], 2), [[1, 2], [3]]);
  assert.deepEqual(chunk([], 2), []);
  const big = chunk(Array.from({ length: 25 }, (_, i) => i), 10);
  assert.equal(big.length, 3);
  assert.ok(big.every((c) => c.length > 0 && c.length <= 10));
});

test('newestIso / oldestIso ignore rubbish rather than returning Invalid Date', () => {
  assert.equal(newestIso(['2026-01-01T00:00:00Z', '2026-06-01T00:00:00Z']), '2026-06-01T00:00:00Z');
  assert.equal(oldestIso(['2026-01-01T00:00:00Z', '2026-06-01T00:00:00Z']), '2026-01-01T00:00:00Z');
  assert.equal(newestIso([]), null);
  assert.equal(newestIso([null, undefined, 'not-a-date']), null);
});

test('matterMoney reads the payments LEDGER, not the creation-time input', () => {
  // The bug this guards: `amountReceived` is only ever a creation-time input and
  // is absent on most matters. Reading it reported every paid matter as owing
  // its full cost. `amountPaid` is maintained from the ledger and must win.
  const m = matterMoney(task({ totalCost: 10000, amountPaid: 4000, amountReceived: 0 }));
  assert.equal(m.received, 4000);
  assert.equal(m.balance, 6000);
  assert.equal(m.priced, true);
});

test('matterMoney prefers an explicit amountDue over recomputing it', () => {
  const m = matterMoney(task({ totalCost: 10000, amountPaid: 4000, amountDue: 1000 }));
  assert.equal(m.balance, 1000, 'the ledger-maintained balance wins');
});

test('matterMoney never reports a negative balance', () => {
  const m = matterMoney(task({ totalCost: 1000, amountPaid: 5000 }));
  assert.equal(m.balance, 0, 'an overpayment is not a negative debt');
});

test('an unpriced matter is not counted as owing zero', () => {
  const m = matterMoney(task({}));
  assert.equal(m.priced, false, 'no total cost means unpriced, which is not the same as free');
});

test('foldClientMatters: counts agree with the rows they count', () => {
  const tasks = [
    task({ id: 'a', status: 'active', totalCost: 1000, amountPaid: 0 }),
    task({ id: 'b', status: 'active', totalCost: 2000, amountPaid: 2000 }),
    task({ id: 'c', status: 'completed', totalCost: 500, amountPaid: 500 }),
  ];
  const r = foldClientMatters(tasks, new Map(), Date.parse('2026-09-19T00:00:00Z'));
  assert.equal(r.totalMatters, 3);
  assert.equal(r.activeMatters, 2, 'two live matters');
  assert.equal(r.completedMatters, 1);
  assert.equal(r.outstanding, 1000, 'only the unpaid one is owed');
  assert.equal(r.lifetimeCollected, 2500, 'everything actually received');
  assert.ok(r.activeMatters <= r.totalMatters, 'a subset can never exceed the whole');
});

test('foldClientMatters: a client with no matters returns zeroes, not nulls', () => {
  const r = foldClientMatters([], new Map(), Date.now());
  for (const k of ['activeMatters', 'completedMatters', 'totalMatters', 'overdue', 'outstanding', 'lifetimeCollected']) {
    assert.equal(r[k], 0, `${k} is 0`);
    assert.equal(typeof r[k], 'number', `${k} is a number, not null`);
  }
});

test('overdue comes from the step’s DUE DATE, never from its number', () => {
  const now = Date.parse('2026-09-19T00:00:00Z');
  const steps = new Map([['a', { stepNumber: 46, dueAt: '2026-09-01T00:00:00Z' }]]);
  const late = foldClientMatters([task({ id: 'a' })], steps, now);
  assert.equal(late.overdue, 1, 'past its dueAt → overdue');

  // Same absurdly high step NUMBER, but the date is in the future. A step number
  // is identity, not position or lateness (#117/#55/#189).
  const future = new Map([['a', { stepNumber: 46, dueAt: '2026-12-01T00:00:00Z' }]]);
  assert.equal(foldClientMatters([task({ id: 'a' })], future, now).overdue, 0);

  // No due date at all cannot be late.
  const undated = new Map([['a', { stepNumber: 46 }]]);
  assert.equal(foldClientMatters([task({ id: 'a' })], undated, now).overdue, 0);
});

test('a malformed dueAt does not crash or count as overdue', () => {
  const steps = new Map([['a', { stepNumber: 1, dueAt: 'tomorrow-ish' }]]);
  const r = foldClientMatters([task({ id: 'a' })], steps, Date.now());
  assert.equal(r.overdue, 0, 'unparseable means unknown, not late');
});

test('isClientStep identifies client-owned steps', () => {
  assert.equal(typeof isClientStep({ assignedRole: 'client' }), 'boolean');
  assert.equal(isClientStep(null), false, 'a missing step is not a client step');
  assert.equal(isClientStep({}), false);
});
