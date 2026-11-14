/**
 * #279 (firm, 11 Nov) — the GST portal password in the GST Return Filing sheet:
 * kept out of every list, encrypted at rest, revealed one row at a time to
 * staff only, and every reveal audited.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  secretFieldsOf, secretsKey, encryptSecret, decryptSecret, sealSecret, openSecret, splitSecretValues,
  secretWrites, secretsSetOf, withoutSecrets, cleanSecretInput,
} from '../services/worksheetSecrets.service.js';
import { normalizeValue, resolveSheet } from '../services/worksheetEngine.service.js';
import { serialize } from '../controllers/worksheets.controller.js';
import { secretRevealSchema } from '../schemas/worksheet.schema.js';
import { requireRole } from '../middleware/auth.middleware.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const KEY = crypto.randomBytes(32);
const PW = 'Ab<c>&"d\' 1 ';

test('only GST Pswd is secret, and the sheet marks its column', () => {
  assert.deepEqual(secretFieldsOf('gst_return'), ['gst_password']);
  assert.deepEqual(secretFieldsOf('trademark'), []);
  assert.equal(resolveSheet('gst_return_monthly').columns.find((c) => c.key === 'gst_password').secret, true);
});

test('encryption round-trip: AES-256-GCM, a fresh IV each time, tampering and a wrong key fail', () => {
  const a = encryptSecret(PW, KEY);
  const b = encryptSecret(PW, KEY);
  assert.equal(a.v, 1);
  assert.notEqual(a.iv, b.iv);
  assert.notEqual(a.ct, b.ct);
  assert.ok(!JSON.stringify(a).includes('Ab<c>'));
  assert.equal(decryptSecret(a, KEY), PW);
  assert.equal(openSecret(a, KEY), PW);
  const tampered = { ...a, ct: Buffer.from(Buffer.from(a.ct, 'base64').map((x, i) => (i === 0 ? x ^ 1 : x))).toString('base64') };
  assert.throws(() => decryptSecret(tampered, KEY));
  assert.throws(() => openSecret(a, crypto.randomBytes(32)));
  assert.throws(() => openSecret(a, null)); // encrypted, no key: refused, never garbage
});

test('the key comes from WORKSHEET_SECRETS_KEY (32 bytes, base64); anything else is no key', () => {
  assert.equal(secretsKey({ WORKSHEET_SECRETS_KEY: KEY.toString('base64') }).equals(KEY), true);
  assert.equal(secretsKey({ WORKSHEET_SECRETS_KEY: 'short' }), null);
  assert.equal(secretsKey({}), null);
  // Without a key a value is still kept out of `values`, as { v: 0, plain }.
  assert.deepEqual(sealSecret('x', null), { v: 0, plain: 'x' });
  assert.equal(openSecret({ v: 0, plain: 'x' }, null), 'x');
});

test('a typed or uploaded password is kept exactly as typed; an empty box changes nothing', () => {
  assert.deepEqual(splitSecretValues('gst_return', { client_name: 'A', gst_password: PW }), { values: { client_name: 'A' }, secrets: { gst_password: PW } });
  assert.deepEqual(splitSecretValues('gst_return', { gst_password: '' }).secrets, {});
  assert.deepEqual(splitSecretValues('gst_return', { gst_password: null }).secrets, {});
  assert.equal(normalizeValue({ type: 'text', secret: true }, PW).value, PW); // upload path: no tag stripping
  assert.throws(() => cleanSecretInput('x'.repeat(201)), /too long/);
});

test('migration: a legacy plaintext password moves out of values (encrypted), with no loss', () => {
  const w = secretWrites('gst_return', { values: { client_name: 'A', gst_password: PW } }, KEY);
  assert.deepEqual(w.values, { client_name: 'A' });
  assert.deepEqual(w.moved, ['gst_password']);
  assert.equal(openSecret(w.secrets.gst_password, KEY), PW);
  // A new value wins over the legacy one.
  const w2 = secretWrites('gst_return', { values: { gst_password: 'old' }, incoming: { gst_password: 'new' } }, KEY);
  assert.equal(openSecret(w2.secrets.gst_password, KEY), 'new');
  // Stored without a key earlier: encrypted at the next write once a key exists.
  const w3 = secretWrites('gst_return', { values: {}, existingSecrets: { gst_password: { v: 0, plain: PW } } }, KEY);
  assert.equal(w3.secrets.gst_password.v, 1);
  assert.equal(openSecret(w3.secrets.gst_password, KEY), PW);
  // An encrypted one is left alone when nothing new is typed.
  assert.deepEqual(secretWrites('gst_return', { values: { a: 1 }, existingSecrets: { gst_password: encryptSecret(PW, KEY) } }, KEY).secrets, {});
});

test('list and write responses never include the password — only that one is set', () => {
  const doc = (data) => ({ id: 'r1', data: () => data });
  const fields = resolveSheet('gst_return_monthly').columns;
  const legacy = serialize(doc({ book: 'gst_return', values: { client_name: 'A', gst_password: PW } }), fields);
  assert.equal(legacy.values.gst_password, undefined);
  assert.deepEqual(legacy.secretsSet, { gst_password: true });
  const sealed = serialize(doc({ book: 'gst_return', values: { client_name: 'A' }, secrets: { gst_password: encryptSecret(PW, KEY) } }), fields);
  assert.ok(!JSON.stringify(sealed).includes('ct'));
  assert.deepEqual(sealed.secretsSet, { gst_password: true });
  assert.deepEqual(serialize(doc({ book: 'gst_return', values: { client_name: 'A' } }), fields).secretsSet, {});
  assert.deepEqual(withoutSecrets('gst_return', { a: 1, gst_password: 'x' }), { a: 1 });
  assert.deepEqual(secretsSetOf('trademark', { values: { gst_password: 'x' } }), {});
});

test('guard: clients and professionals never reach the reveal endpoint; a reason is required', () => {
  const routes = fs.readFileSync(path.join(here, '../routes/worksheets.routes.js'), 'utf8');
  assert.match(routes, /router\.use\(verifyToken, requireRole\('admin', 'manager', 'team_member'\)\)/);
  assert.match(routes, /router\.post\('\/sheets\/:sheet\/records\/:id\/secrets\/:field\/reveal', requireRole\('admin', 'manager', 'team_member'\), validate\(secretRevealSchema\), revealSecret\)/);
  const guard = requireRole('admin', 'manager', 'team_member');
  for (const [role, expected] of [['client', 403], ['professional', 403], ['team_member', 'next'], ['manager', 'next']]) {
    let status = 'next';
    guard({ user: { role } }, { status(c) { status = c; return this; }, json() { return this; } }, () => {});
    assert.equal(status, expected, role);
  }
  assert.equal(secretRevealSchema.safeParse({ purpose: 'login' }).success, true);
  assert.equal(secretRevealSchema.safeParse({}).success, false);
  assert.equal(secretRevealSchema.safeParse({ purpose: 'login', value: 'x' }).success, false);
});

test('audit: every reveal is recorded (who, which client, why, when) BEFORE the password is sent; never logged', () => {
  const src = fs.readFileSync(path.join(here, '../controllers/worksheets.controller.js'), 'utf8');
  const fn = src.slice(src.indexOf('export async function revealSecret'), src.indexOf('/* ── Matter link'));
  const audit = fn.indexOf("db.collection(AUDIT).add(");
  const send = fn.indexOf('res.json({ value');
  assert.ok(audit > 0 && send > audit, 'audit entry is written before the response');
  for (const k of ["action: 'secret_revealed'", 'purpose: req.body.purpose', 'clientName: v.client_name', 'gstin: v.gstin', 'byUid: req.user.uid', 'at: now']) {
    assert.ok(fn.includes(k), k);
  }
  assert.doesNotMatch(fn, /logger\.\w+\(\{[^}]*\bvalue\b/);
  assert.match(fn, /Cache-Control', 'no-store'/);
});
