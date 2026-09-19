/**
 * Story 35.3 — the statutory calendar.
 *
 * The layering is the point: CBDT and GSTN extend dates at short notice, and a
 * firm must be able to apply an extension without a deploy — while a platform
 * re-seed must never clobber that edit, and a one-off extension must not
 * silently become the firm's permanent rule.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveStatutoryDate, resolveEntry, validateCalendarEntry, calendarKeys,
  presentCalendar, DEFAULT_CALENDAR, DEFAULT_KEYS, RULE_KINDS,
} from '../../../shared/workflows/statutoryCalendar.js';

test('a monthly return is due in the month AFTER the period', () => {
  // September's GSTR-1 is filed in October. Resolving it to 11 September would
  // make every monthly deadline a month early.
  assert.equal(resolveStatutoryDate('gstr1', { month: '2026-09' }), '2026-10-11');
  assert.equal(resolveStatutoryDate('gstr3b', { month: '2026-09' }), '2026-10-20');
});

test('a December period rolls into the next YEAR', () => {
  assert.equal(resolveStatutoryDate('gstr1', { month: '2026-12' }), '2027-01-11');
});

test('a WORKSPACE override replaces the platform default permanently', () => {
  const overrides = { gstr1: { entry: { kind: 'day_of_month', day: 13 } } };
  assert.equal(resolveStatutoryDate('gstr1', { overrides, month: '2026-09' }), '2026-10-13');
  assert.equal(resolveEntry('gstr1', { overrides }).source, 'workspace');
});

test('a PERIOD override applies to that period ONLY — an extension stays one-off', () => {
  // The failure this prevents: a firm applies an extension for one month and
  // silently works to the wrong date for every month after.
  const overrides = {
    gstr1: { periods: { '2026-09': { kind: 'day_of_month', day: 13 } } },
  };
  assert.equal(
    resolveStatutoryDate('gstr1', { overrides, month: '2026-09', periodKey: '2026-09' }),
    '2026-10-13',
    'the extended month uses the extension',
  );
  assert.equal(
    resolveStatutoryDate('gstr1', { overrides, month: '2026-10', periodKey: '2026-10' }),
    '2026-11-11',
    'the NEXT month reverts to the standard date',
  );
});

test('precedence is period > workspace > platform', () => {
  const overrides = {
    gstr1: {
      entry: { kind: 'day_of_month', day: 12 },
      periods: { '2026-09': { kind: 'day_of_month', day: 13 } },
    },
  };
  assert.equal(resolveEntry('gstr1', { overrides, periodKey: '2026-09' }).source, 'period');
  assert.equal(resolveEntry('gstr1', { overrides, periodKey: '2026-10' }).source, 'workspace');
  assert.equal(resolveEntry('gstr1', {}).source, 'platform');
});

test('a platform default change reaches a workspace that has NOT overridden (AC3)', () => {
  // Overrides are stored separately from defaults, so a re-seed is additive.
  const newDefaults = { ...DEFAULT_CALENDAR, gstr1: { ...DEFAULT_CALENDAR.gstr1, day: 12 } };
  assert.equal(resolveStatutoryDate('gstr1', { defaults: newDefaults, month: '2026-09' }), '2026-10-12');
  // …and does NOT reach one that has.
  const overrides = { gstr1: { entry: { kind: 'day_of_month', day: 15 } } };
  assert.equal(
    resolveStatutoryDate('gstr1', { defaults: newDefaults, overrides, month: '2026-09' }),
    '2026-10-15',
    "a firm's edit survives a platform re-seed",
  );
});

test('an ANCHORED rule needs the matter’s own date', () => {
  // AOC-4 is 30 days after the AGM — a date that only exists once the company
  // has held its meeting.
  assert.equal(resolveStatutoryDate('roc_aoc4', { anchorDate: '2026-09-30' }), '2026-10-30');
  assert.equal(resolveStatutoryDate('roc_mgt7', { anchorDate: '2026-09-30' }), '2026-11-29');
  // Without the anchor it resolves to nothing, so 35.1 falls back to the
  // duration ETA rather than inventing a date.
  assert.equal(resolveStatutoryDate('roc_aoc4', {}), null);
});

test('an unknown key resolves to null, never a guess', () => {
  assert.equal(resolveStatutoryDate('not_a_filing', { month: '2026-09' }), null);
  assert.equal(resolveStatutoryDate('gstr1', {}), null, 'a monthly rule needs a month');
  assert.equal(resolveStatutoryDate('gstr1', { month: 'nonsense' }), null);
});

test('day_of_month is capped at 28, because later days are undefined in February', () => {
  // Clamping "the 30th" would make the deadline wrong two months in twelve.
  assert.equal(validateCalendarEntry({ kind: 'day_of_month', day: 28 }), null);
  assert.match(validateCalendarEntry({ kind: 'day_of_month', day: 30 }), /between 1 and 28/);
  assert.match(validateCalendarEntry({ kind: 'day_of_month', day: 0 }), /between 1 and 28/);
  assert.match(validateCalendarEntry({ kind: 'day_of_month', day: 11.5 }), /whole number/);
});

test('every rule kind validates its own shape', () => {
  assert.equal(validateCalendarEntry({ kind: 'fixed_date', date: '2026-10-31' }), null);
  assert.match(validateCalendarEntry({ kind: 'fixed_date', date: '31/10/2026' }), /YYYY-MM-DD/);
  assert.equal(validateCalendarEntry({ kind: 'anchor_offset', offsetDays: 30 }), null);
  assert.match(validateCalendarEntry({ kind: 'anchor_offset' }), /whole number/);
  assert.match(validateCalendarEntry({ kind: 'invented' }), /Unknown rule kind/);
  assert.match(validateCalendarEntry(null), /must be an object/);
});

test('every shipped default is valid and labelled', () => {
  // A wrong date here is worse than a missing one, because a firm would trust
  // it. A default with no label ships a blank row on the settings screen.
  for (const key of DEFAULT_KEYS) {
    const entry = DEFAULT_CALENDAR[key];
    assert.equal(validateCalendarEntry(entry), null, `${key} must be valid`);
    assert.ok(entry.label?.length, `${key} needs a label`);
    assert.ok(RULE_KINDS.includes(entry.kind));
  }
});

test('a workspace can ADD a key the platform never shipped', () => {
  const overrides = { state_pt: { entry: { kind: 'day_of_month', day: 21, label: 'Professional tax' } } };
  assert.ok(calendarKeys({ overrides }).includes('state_pt'));
  assert.equal(resolveStatutoryDate('state_pt', { overrides, month: '2026-09' }), '2026-10-21');
});

test('the settings view says WHERE each date came from', () => {
  // Without this a firm cannot tell an edit of theirs from a platform default,
  // and cannot know what "revert" would do.
  const overrides = { gstr1: { entry: { kind: 'day_of_month', day: 13 } } };
  const rows = presentCalendar({ overrides, month: '2026-09' });
  const gstr1 = rows.find((r) => r.key === 'gstr1');
  assert.equal(gstr1.source, 'workspace');
  assert.equal(gstr1.resolved, '2026-10-13');
  const gstr3b = rows.find((r) => r.key === 'gstr3b');
  assert.equal(gstr3b.source, 'platform');
  assert.ok(rows.length >= DEFAULT_KEYS.length);
});
