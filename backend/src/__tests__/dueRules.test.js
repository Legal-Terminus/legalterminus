/**
 * Story 35.1 — date-anchored due rules.
 *
 * Date arithmetic is where off-by-one bugs live, and a deadline that is one day
 * wrong is worse than none: a firm plans around it. So the boundaries are
 * asserted explicitly — month ends, year ends, leap days, and the timezone trap
 * that shifts a date for readers east or west of UTC.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveDueDate, validateDueRule, addDays, toDateOnly, daysUntil,
  definitionNeedsAnchorDate, describeDueRule, DUE_ANCHORS,
} from '../../../shared/workflows/dueRules.js';

test('a date is a CALENDAR fact — no timezone may shift it', () => {
  // The trap: parsing "2026-03-01" through a local timezone yields Feb 28 for
  // anyone west of UTC. A deadline must read the same everywhere.
  assert.equal(toDateOnly('2026-03-01'), '2026-03-01');
  assert.equal(toDateOnly('2026-03-01T23:59:59.999Z'), '2026-03-01');
  assert.equal(toDateOnly('2026-03-01T00:00:00+05:30'), '2026-03-01');
  assert.equal(toDateOnly(null), null);
  assert.equal(toDateOnly('not a date'), null);
});

test('day arithmetic crosses month, year and leap boundaries correctly', () => {
  assert.equal(addDays('2026-01-31', 1), '2026-02-01');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2027-01-01', -1), '2026-12-31');
  // 2028 is a leap year: Feb has 29 days.
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(addDays('2028-03-01', -1), '2028-02-29');
  // 2026 is not.
  assert.equal(addDays('2026-02-28', 1), '2026-03-01');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
});

test('BACKWARD scheduling: "5 days before the filing date"', () => {
  // The capability no accounting tool observed has, and the reason this story
  // exists. A negative offset counts back from the anchor.
  const due = resolveDueDate(
    { anchor: 'anchor_date', offsetDays: -5 },
    { anchorDate: '2026-09-30' },
  );
  assert.equal(due, '2026-09-25');
});

test('backward scheduling across a month boundary', () => {
  assert.equal(
    resolveDueDate({ anchor: 'anchor_date', offsetDays: -5 }, { anchorDate: '2026-03-03' }),
    '2026-02-26',
  );
});

test('forward from the matter start, and from the step start', () => {
  assert.equal(
    resolveDueDate({ anchor: 'matter_start', offsetDays: 30 }, { matterStart: '2026-09-01' }),
    '2026-10-01',
  );
  assert.equal(
    resolveDueDate({ anchor: 'step_start', offsetDays: 2 }, { stepStart: '2026-09-05T14:00:00.000Z' }),
    '2026-09-07',
  );
});

test('a zero offset means the anchor date itself', () => {
  // "GSTR-1 by the 11th" is due ON the 11th, not the 12th.
  assert.equal(
    resolveDueDate({ anchor: 'statutory', statutoryKey: 'gstr1', offsetDays: 0 },
      { resolveStatutory: () => '2026-09-11' }),
    '2026-09-11',
  );
  // An omitted offset behaves the same.
  assert.equal(
    resolveDueDate({ anchor: 'statutory', statutoryKey: 'gstr1' },
      { resolveStatutory: () => '2026-09-11' }),
    '2026-09-11',
  );
});

test('an unresolvable rule returns null so the caller falls back', () => {
  // Returning null is SAFE: the caller uses the duration ETA instead, so a
  // matter created without an anchor still gets a sensible deadline rather
  // than none at all.
  assert.equal(resolveDueDate({ anchor: 'anchor_date', offsetDays: -5 }, {}), null);
  assert.equal(resolveDueDate({ anchor: 'statutory', statutoryKey: 'gstr1' }, {}), null);
  assert.equal(resolveDueDate({ anchor: 'statutory', statutoryKey: 'nope' },
    { resolveStatutory: () => null }), null);
  assert.equal(resolveDueDate(null, {}), null);
});

test('validation refuses a rule that could never resolve', () => {
  // Caught at SAVE time: a deadline that silently fails to resolve leaves a
  // step with no date, and nobody notices until it is late.
  assert.equal(validateDueRule({ anchor: 'matter_start', offsetDays: 3 }), null);
  assert.match(validateDueRule({ anchor: 'nonsense' }), /Unknown due anchor/);
  assert.match(validateDueRule({ anchor: 'statutory' }), /needs a statutoryKey/);
  assert.match(validateDueRule({ anchor: 'matter_start', offsetDays: 1.5 }), /whole number/);
  assert.equal(validateDueRule(null), null, 'no rule is valid — durations still work');
});

test('a statutory key is checked against the calendar when one is supplied', () => {
  const keys = ['gstr1', 'gstr3b'];
  assert.equal(validateDueRule({ anchor: 'statutory', statutoryKey: 'gstr1' }, { statutoryKeys: keys }), null);
  assert.match(
    validateDueRule({ anchor: 'statutory', statutoryKey: 'gstr9' }, { statutoryKeys: keys }),
    /Unknown statutory date/,
  );
});

test('a definition needing an anchor date is detectable at creation (AC2)', () => {
  const withAnchor = { steps: [{ stepNumber: 1, dueRule: { anchor: 'anchor_date', offsetDays: -5 } }] };
  const without = { steps: [{ stepNumber: 1, dueRule: { anchor: 'matter_start', offsetDays: 3 } }] };
  assert.equal(definitionNeedsAnchorDate(withAnchor), true);
  assert.equal(definitionNeedsAnchorDate(without), false);
  assert.equal(definitionNeedsAnchorDate({ steps: [{ stepNumber: 1 }] }), false);
  assert.equal(definitionNeedsAnchorDate(null), false);
});

test('every rule reads as plain English, forwards and backwards', () => {
  assert.equal(describeDueRule({ anchor: 'anchor_date', offsetDays: -5 }),
    "Due 5 days before the matter's key date");
  assert.equal(describeDueRule({ anchor: 'matter_start', offsetDays: 1 }),
    'Due 1 day after the matter starts');
  assert.equal(describeDueRule({ anchor: 'statutory', statutoryKey: 'gstr1', offsetDays: 0 }),
    'Due on gstr1');
  assert.equal(describeDueRule(null), null);
  // Every anchor must be describable, or the editor row ships blank.
  for (const anchor of DUE_ANCHORS) {
    assert.ok(describeDueRule({ anchor, statutoryKey: 'k', offsetDays: 1 }), `${anchor} needs copy`);
  }
});

test('daysUntil is whole days, and negative when overdue', () => {
  const now = Date.parse('2026-09-06T15:00:00.000Z');
  assert.equal(daysUntil('2026-09-06', now), 0, 'due today is zero, not -1');
  assert.equal(daysUntil('2026-09-11', now), 5);
  assert.equal(daysUntil('2026-09-01', now), -5, 'overdue is negative');
  assert.equal(daysUntil(null, now), null);
});
