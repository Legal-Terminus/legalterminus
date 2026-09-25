/**
 * Story 34.2 — step conditions.
 *
 * The design point: this module EVALUATES and explains; it never advances
 * anything (owner decision 2026-09-06 — a person confirms every skip). So the
 * tests are about truthfulness of evaluation and readability of the reason,
 * not about state transitions.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  evaluateCondition, validateCondition, describeCondition, describeSkipReason,
  CONDITION_FIELDS, CONDITION_FIELD_NAMES, OPERATORS_BY_KIND, CONDITION_OPERATORS,
} from '../../../shared/workflows/conditions.js';
import { deriveProfile } from '../services/clientProfile.service.js';

const gstClient = deriveProfile({ gstNumber: '29ABCDE1234F1Z5', entityType: 'pvt_ltd', tags: ['Retainer'] });
const plainClient = deriveProfile({ entityType: 'individual' });

test('a step with NO condition always applies', () => {
  // Most steps have none; they must be unaffected by this feature entirely.
  assert.equal(evaluateCondition(null, gstClient), true);
  assert.equal(evaluateCondition(undefined, plainClient), true);
});

test('boolean conditions read the derived profile', () => {
  assert.equal(evaluateCondition({ field: 'hasGst', op: 'is_true' }, gstClient), true);
  assert.equal(evaluateCondition({ field: 'hasGst', op: 'is_true' }, plainClient), false);
  assert.equal(evaluateCondition({ field: 'hasGst', op: 'is_false' }, plainClient), true);
});

test('entity-type conditions match, negate and list', () => {
  assert.equal(evaluateCondition({ field: 'entityType', op: 'equals', value: 'pvt_ltd' }, gstClient), true);
  assert.equal(evaluateCondition({ field: 'entityType', op: 'equals', value: 'llp' }, gstClient), false);
  assert.equal(evaluateCondition({ field: 'entityType', op: 'not_equals', value: 'llp' }, gstClient), true);
  assert.equal(evaluateCondition({ field: 'entityType', op: 'in', value: ['llp', 'pvt_ltd'] }, gstClient), true);
  assert.equal(evaluateCondition({ field: 'entityType', op: 'in', value: ['llp'] }, gstClient), false);
});

test('tag conditions are case-insensitive because the profile normalises', () => {
  // The client was tagged "Retainer"; deriveProfile lower-cases it, so a
  // condition written as 'retainer' matches. Without that normalisation this
  // whole feature would misfire on casing.
  assert.equal(evaluateCondition({ field: 'tags', op: 'contains', value: 'retainer' }, gstClient), true);
  assert.equal(evaluateCondition({ field: 'tags', op: 'not_contains', value: 'retainer' }, gstClient), false);
  assert.equal(evaluateCondition({ field: 'tags', op: 'contains', value: 'retainer' }, plainClient), false);
});

test('evaluation FAILS OPEN — a broken condition never hides a step', () => {
  // A step that quietly disappears because a profile field was blank is far
  // worse than one that appears and gets completed: the person can always skip
  // it, but they cannot do work they never saw.
  assert.equal(evaluateCondition({ field: 'nonsense', op: 'is_true' }, gstClient), true);
  assert.equal(evaluateCondition({ field: 'hasGst', op: 'not_an_op' }, gstClient), true);
  assert.equal(evaluateCondition({ field: 'hasGst', op: 'is_true' }, null), true);
  assert.equal(evaluateCondition('garbage', gstClient), true);
});

test('validation refuses an operator that cannot apply to the field', () => {
  // `hasGst in [...]` is nonsense; permitting it produces a condition that
  // silently never matches, which is the failure a closed catalog prevents.
  assert.equal(validateCondition({ field: 'hasGst', op: 'is_true' }), null);
  assert.match(validateCondition({ field: 'hasGst', op: 'contains', value: 'x' }), /does not apply/);
  assert.match(validateCondition({ field: 'entityType', op: 'is_true' }), /does not apply/);
  assert.match(validateCondition({ field: 'nope', op: 'is_true' }), /Unknown condition field/);
});

test('validation refuses a missing or wrongly-shaped value', () => {
  assert.match(validateCondition({ field: 'entityType', op: 'equals' }), /needs a value/);
  assert.match(validateCondition({ field: 'entityType', op: 'equals', value: '' }), /needs a value/);
  assert.match(validateCondition({ field: 'entityType', op: 'in', value: 'llp' }), /list of values/);
  assert.match(validateCondition({ field: 'entityType', op: 'equals', value: ['a'] }), /single value/);
  assert.equal(validateCondition(null), null, 'no condition is valid');
});

test('every condition reads as plain English for the person confirming', () => {
  // "Condition not met" tells the person nothing about whether skipping is
  // right. The reason has to be readable.
  assert.equal(
    describeSkipReason({ field: 'hasGst', op: 'is_true' }),
    'This step applies only when the client has GST.',
  );
  assert.match(describeSkipReason({ field: 'tags', op: 'contains', value: 'retainer' }), /tagged/);
  assert.match(describeSkipReason({ field: 'entityType', op: 'in', value: ['llp', 'trust'] }), /llp, trust/);
  assert.equal(describeSkipReason(null), null);
});

test('every field and operator in the catalog is describable', () => {
  // A field with no description ships a blank sentence to whoever must decide.
  for (const field of CONDITION_FIELD_NAMES) {
    const kind = CONDITION_FIELDS[field].kind;
    assert.ok(CONDITION_FIELDS[field].label?.length, `${field} needs a label`);
    for (const op of OPERATORS_BY_KIND[kind]) {
      const value = op === 'in' ? ['x'] : 'x';
      const text = describeCondition({ field, op, value });
      assert.ok(text && text !== 'an unrecognised condition', `${field}/${op} needs a description`);
    }
  }
});

test('the operator list is exactly the union of the per-kind lists', () => {
  // The Zod schema validates against CONDITION_OPERATORS; a drift here would
  // let an operator through validation that no field accepts.
  const union = [...new Set(Object.values(OPERATORS_BY_KIND).flat())].sort();
  assert.deepEqual([...CONDITION_OPERATORS].sort(), union);
});
