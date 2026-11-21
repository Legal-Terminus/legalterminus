/**
 * utils/sanitize.js — the one linear sanitiser the backend uses (CodeQL
 * js/polynomial-redos, js/incomplete-multi-character-sanitization,
 * js/remote-property-injection, js/log-injection).
 *
 * Two properties are proved here: on ordinary input every function returns
 * exactly what the regex it replaced returned, and on adversarial input it
 * finishes in linear time.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { stripTags, removeDelimited, isPlausibleEmail, isSafeKey, logValue } from '../utils/sanitize.js';
import { cleanRecordValues, applyOptionsEdit, applyColumnEdit, bookFields } from '../services/worksheetEngine.service.js';
import { cleanColumns } from '../services/marketingSheets.service.js';
import { setOverride, invalidateCalendarCache } from '../services/statutoryCalendar.service.js';

const legacyStrip = (s) => s.replace(/<[^>]*>/g, '');
const legacyParens = (s) => s.replace(/\([^)]*\)/g, '');
const legacyEmail = (s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);

/** Deterministic pseudo-random strings, so a failure reproduces. */
function* randomStrings(alphabet, count, maxLen, seed = 7) {
  let x = seed;
  const next = () => { x = (x * 1103515245 + 12345) % 2147483648; return x; };
  for (let n = 0; n < count; n += 1) {
    const len = next() % maxLen;
    let s = '';
    for (let i = 0; i < len; i += 1) s += alphabet[next() % alphabet.length];
    yield s;
  }
}

/** Under this many ms for 100 000 characters — the old regexes took seconds. */
const LINEAR_BUDGET_MS = 250;
const timeIt = (fn) => { const t = process.hrtime.bigint(); fn(); return Number(process.hrtime.bigint() - t) / 1e6; };

test('stripTags matches the old regex on ordinary text', () => {
  const cases = [
    'Plain text', '<b>Acme</b> Pvt Ltd', '  <p>Hi</p>  ', '5 < 10 and 10 > 5', 'a < b', '<<a>b>',
    '<img src=x onerror=alert(1)>', 'Fee <i>(govt)</i>', '', 'no > open', '<a href="x">link</a> tail',
  ];
  for (const s of cases) assert.equal(stripTags(s), legacyStrip(s), s);
});

test('stripTags matches the old regex on random input whose openers are all closed', () => {
  // A '<' followed by markup with no '>' after it is the one case that differs
  // (deliberately — see the next test); every string here closes its openers.
  for (const s of randomStrings('ab <>/xé1 ', 3000, 40)) {
    const closed = s.lastIndexOf('<') < s.lastIndexOf('>') || !s.includes('<') ? s : `${s}>`;
    assert.equal(stripTags(closed), legacyStrip(closed), JSON.stringify(closed));
  }
});

test('stripTags never leaves the start of a tag behind', () => {
  assert.equal(stripTags('hello <script'), 'hello script');
  assert.equal(stripTags('<scr<script>ipt>alert(1)'), 'ipt>alert(1)');
  assert.equal(stripTags('x </div'), 'x /div');
  assert.equal(stripTags('a <!-- c'), 'a !-- c');
  for (const s of randomStrings('<>s/ !a', 3000, 30, 11)) {
    assert.doesNotMatch(stripTags(s), /<[a-zA-Z/!?]/, JSON.stringify(s));
  }
  // A '<' that cannot begin markup stays.
  assert.equal(stripTags('if a <5 or a < b'), 'if a <5 or a < b');
});

test('stripTags stringifies non-strings', () => {
  assert.equal(stripTags(undefined), '');
  assert.equal(stripTags(null), '');
  assert.equal(stripTags(12345), '12345');
});

test('stripTags and removeDelimited are linear on adversarial input', () => {
  const attacks = ['<'.repeat(1e5), '<a'.repeat(5e4), `${'<'.repeat(1e5)}>`, '('.repeat(1e5)];
  for (const a of attacks) {
    assert.ok(timeIt(() => stripTags(a)) < LINEAR_BUDGET_MS, `stripTags slow on ${a.slice(0, 4)}…`);
    assert.ok(timeIt(() => removeDelimited(a, '(', ')')) < LINEAR_BUDGET_MS, `removeDelimited slow on ${a.slice(0, 4)}…`);
  }
});

test('removeDelimited matches the old parenthetical regex exactly', () => {
  assert.equal(removeDelimited('CONSTITUTION (COMPANY/LLP)', '(', ')'), 'CONSTITUTION ');
  for (const s of randomStrings('ab ()x', 3000, 40, 3)) {
    assert.equal(removeDelimited(s, '(', ')'), legacyParens(s), JSON.stringify(s));
  }
});

test('isPlausibleEmail accepts exactly what the old regex accepted', () => {
  const cases = ['a@b.co', 'first.last@firm.in', 'a@b', 'a@.b', 'a@b.', '@b.co', 'a b@c.d', 'a@@b.c', 'a@b.c.d', 'a@b..c', ''];
  for (const s of cases) assert.equal(isPlausibleEmail(s), legacyEmail(s), s);
  for (const s of randomStrings('a@. b', 5000, 12, 5)) assert.equal(isPlausibleEmail(s), legacyEmail(s), JSON.stringify(s));
});

test('isPlausibleEmail is linear and refuses over-long addresses', () => {
  const attack = `!@!${'.!'.repeat(5e4)}`;
  assert.ok(timeIt(() => isPlausibleEmail(attack)) < LINEAR_BUDGET_MS);
  assert.equal(isPlausibleEmail(attack), false); // longer than 254
  assert.equal(isPlausibleEmail(`${'a'.repeat(250)}@b.co`), false);
});

test('isSafeKey refuses the names that reach a prototype', () => {
  for (const k of ['__proto__', 'constructor', 'prototype', '', 5, null]) assert.equal(isSafeKey(k), false, String(k));
  for (const k of ['gstr1', 'trademark_name', 'proto', '__x__']) assert.equal(isSafeKey(k), true, k);
});

test('logValue cannot start a second log line', () => {
  assert.equal(logValue('txn1\r\nINFO forged entry'), 'txn1 INFO forged entry');
  assert.equal(logValue(undefined), undefined);
  assert.equal(logValue(42), '42');
  assert.equal(logValue('x'.repeat(500)).length, 200);
});

/* ── js/remote-property-injection: the write sites refuse prototype keys ── */

const attack = (key) => JSON.parse(`{"${key}": "x"}`); // how a request body carries it

test('a worksheet record edit refuses a __proto__ / constructor column', () => {
  const fields = bookFields('trademark');
  for (const k of ['__proto__', 'constructor', 'prototype']) {
    assert.throws(() => cleanRecordValues(fields, attack(k)), /Unknown column/, k);
  }
  const ok = cleanRecordValues(fields, { trademark_name: 'ACME' });
  assert.deepEqual(ok, { trademark_name: 'ACME' });
  assert.equal(Object.getPrototypeOf(ok), Object.prototype);
});

test('a dropdown edit refuses a __proto__ column, and a sheet edit an inherited sheet name', () => {
  assert.throws(() => applyOptionsEdit('tds', {}, '__proto__', ['a']), /Unknown column/);
  assert.throws(() => applyOptionsEdit('constructor', {}, 'x', ['a']), /Unknown worksheet/);
  assert.throws(() => applyColumnEdit('__proto__', {}, { columns: [{ label: 'A' }] }), /Unknown worksheet/);
  assert.throws(() => applyColumnEdit('tds', {}, { columns: [{ key: '__proto__', label: 'A' }] }), /Unknown column/);
});

test('a marketing column cannot be keyed __proto__, constructor or prototype', () => {
  for (const key of ['__proto__', 'constructor', 'prototype']) {
    assert.throws(() => cleanColumns([{ key, label: 'Evil' }]), /Invalid column key/, key);
  }
});

function fakeDb(initial = {}) {
  const store = { data: initial };
  const ref = {
    get: async () => ({ exists: true, data: () => store.data }),
    set: async (d) => { store.data = { ...store.data, ...d }; },
  };
  return { store, collection: () => ({ doc: () => ref }) };
}

test('a statutory override cannot be written to a prototype key', async () => {
  for (const key of ['__proto__', 'constructor', 'prototype']) {
    invalidateCalendarCache();
    await assert.rejects(
      setOverride(fakeDb({ overrides: {} }), key, { kind: 'day_of_month', day: 10 }),
      /Unknown calendar key/, key,
    );
  }
  invalidateCalendarCache();
  await assert.rejects(
    setOverride(fakeDb({ overrides: {} }), 'gstr1', { kind: 'day_of_month', day: 10 }, { periodKey: '__proto__' }),
    /periodKey/,
  );
});

test('a statutory override still saves, adds a period and reverts', async () => {
  invalidateCalendarCache();
  const db = fakeDb({ overrides: { tds_payment: { entry: { kind: 'day_of_month', day: 8 } } } });
  let o = await setOverride(db, 'gstr1', { kind: 'day_of_month', day: 13 }, { periodKey: '2026-09' });
  assert.deepEqual(o.gstr1, { periods: { '2026-09': { kind: 'day_of_month', day: 13 } } });
  assert.deepEqual(o.tds_payment, { entry: { kind: 'day_of_month', day: 8 } });
  invalidateCalendarCache();
  o = await setOverride(db, 'gstr1', null, { periodKey: '2026-09' });
  assert.equal(Object.hasOwn(o, 'gstr1'), false);
  assert.ok(Object.hasOwn(o, 'tds_payment'));
});
