/**
 * #279 (firm, 11 Nov) — the GST portal password in the GST Return Filing sheet:
 * masked in the report, kept out of every list and download, fetched one row at
 * a time by staff only. Not encrypted (out of scope).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  secretFieldsOf, sealSecret, openSecret, splitSecretValues,
  secretWrites, secretsSetOf, withoutSecrets, cleanSecretInput,
} from '../services/worksheetSecrets.service.js';
import { normalizeValue, resolveSheet } from '../services/worksheetEngine.service.js';
import { serialize } from '../controllers/worksheets.controller.js';
import { requireRole } from '../middleware/auth.middleware.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PW = 'Ab<c>&"d\' 1 ';

test('only GST Pswd is secret, and the sheet marks its column', () => {
  assert.deepEqual(secretFieldsOf('gst_return'), ['gst_password']);
  assert.deepEqual(secretFieldsOf('trademark'), []);
  assert.equal(resolveSheet('gst_return_monthly').columns.find((c) => c.key === 'gst_password').secret, true);
});

test('stored as typed under `secrets`, and read back unchanged', () => {
  assert.deepEqual(sealSecret(PW), { v: 0, plain: PW });
  assert.equal(openSecret(sealSecret(PW)), PW);
  assert.equal(openSecret(null), null);
  assert.equal(openSecret({ v: 9 }), null); // an unknown format is never shown as garbage
});

test('a typed or uploaded password is kept exactly as typed; an empty box changes nothing', () => {
  assert.deepEqual(splitSecretValues('gst_return', { client_name: 'A', gst_password: PW }), { values: { client_name: 'A' }, secrets: { gst_password: PW } });
  assert.deepEqual(splitSecretValues('gst_return', { gst_password: '' }).secrets, {});
  assert.deepEqual(splitSecretValues('gst_return', { gst_password: null }).secrets, {});
  assert.equal(normalizeValue({ type: 'text', secret: true }, PW).value, PW); // upload path: no tag stripping
  assert.throws(() => cleanSecretInput('x'.repeat(201)), /too long/);
  // CodeQL #73: a column named after a prototype key is dropped, never copied.
  const polluted = splitSecretValues('gst_return', JSON.parse('{"__proto__": {"x": 1}, "constructor": "c", "client_name": "A"}'));
  assert.deepEqual(polluted.values, { client_name: 'A' });
  assert.equal({}.x, undefined);
});

test('migration: a legacy password moves out of values, with no loss', () => {
  const w = secretWrites('gst_return', { values: { client_name: 'A', gst_password: PW } });
  assert.deepEqual(w.values, { client_name: 'A' });
  assert.deepEqual(w.moved, ['gst_password']);
  assert.equal(openSecret(w.secrets.gst_password), PW);
  // A new value wins over the legacy one.
  const w2 = secretWrites('gst_return', { values: { gst_password: 'old' }, incoming: { gst_password: 'new' } });
  assert.equal(openSecret(w2.secrets.gst_password), 'new');
  // A stored one is left alone when nothing new is typed.
  assert.deepEqual(secretWrites('gst_return', { values: { a: 1 }, existingSecrets: { gst_password: sealSecret(PW) } }).secrets, {});
});

test('list and write responses never include the password — only that one is set', () => {
  const doc = (data) => ({ id: 'r1', data: () => data });
  const fields = resolveSheet('gst_return_monthly').columns;
  const legacy = serialize(doc({ book: 'gst_return', values: { client_name: 'A', gst_password: PW } }), fields);
  assert.equal(legacy.values.gst_password, undefined);
  assert.deepEqual(legacy.secretsSet, { gst_password: true });
  const stored = serialize(doc({ book: 'gst_return', values: { client_name: 'A' }, secrets: { gst_password: sealSecret(PW) } }), fields);
  assert.ok(!JSON.stringify(stored).includes('Ab<c>'));
  assert.deepEqual(stored.secretsSet, { gst_password: true });
  assert.deepEqual(serialize(doc({ book: 'gst_return', values: { client_name: 'A' } }), fields).secretsSet, {});
  assert.deepEqual(withoutSecrets('gst_return', { a: 1, gst_password: 'x' }), { a: 1 });
  assert.deepEqual(secretsSetOf('trademark', { values: { gst_password: 'x' } }), {});
});

test('guard: clients and professionals never reach the reveal endpoint', () => {
  const routes = fs.readFileSync(path.join(here, '../routes/worksheets.routes.js'), 'utf8');
  assert.match(routes, /router\.use\(verifyToken, requireRole\('admin', 'manager', 'team_member'\)\)/);
  assert.match(routes, /router\.post\('\/sheets\/:sheet\/records\/:id\/secrets\/:field\/reveal', requireRole\('admin', 'manager', 'team_member'\), revealSecret\)/);
  const guard = requireRole('admin', 'manager', 'team_member');
  for (const [role, expected] of [['client', 403], ['professional', 403], ['team_member', 'next'], ['manager', 'next']]) {
    let status = 'next';
    guard({ user: { role } }, { status(c) { status = c; return this; }, json() { return this; } }, () => {});
    assert.equal(status, expected, role);
  }
});

test('the reveal response is never cached and the password is never logged', () => {
  const src = fs.readFileSync(path.join(here, '../controllers/worksheets.controller.js'), 'utf8');
  const fn = src.slice(src.indexOf('export async function revealSecret'), src.indexOf('/* ── Matter link'));
  assert.doesNotMatch(fn, /logger\.\w+\(\{[^}]*\bvalue\b/);
  assert.match(fn, /Cache-Control', 'no-store'/);
});
