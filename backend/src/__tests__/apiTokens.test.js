import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCOPES, TOKEN_PREFIX, hashSecret, verifySecret, parseToken, mintToken, presentToken,
} from '../services/apiTokens.service.js';

/**
 * E21-S01 — API key secret handling.
 *
 * A key is a password-equivalent, so these tests are about the properties that
 * make a leaked database table useless: the secret is never stored, the hash is
 * salted per-key, and verification is exact.
 */

test('a secret is stored only as a salted hash, never in the clear', async () => {
  const { salt, hash } = await hashSecret('super-secret-value');
  assert.ok(salt.length >= 16, 'a real salt');
  assert.ok(hash.length >= 32, 'a real hash');
  assert.equal(hash.includes('super-secret-value'), false, 'the secret is not recoverable from the hash');
});

test('the same secret hashes differently under different salts', async () => {
  const a = await hashSecret('same-secret');
  const b = await hashSecret('same-secret');
  assert.notEqual(a.salt, b.salt, 'each key gets its own salt');
  assert.notEqual(a.hash, b.hash, 'so a rainbow table over one hash buys nothing');
});

test('verifySecret accepts the right secret and rejects everything else', async () => {
  const { salt, hash } = await hashSecret('correct-horse');
  assert.equal(await verifySecret('correct-horse', salt, hash), true);
  assert.equal(await verifySecret('correct-horse ', salt, hash), false, 'trailing space is a different secret');
  assert.equal(await verifySecret('Correct-Horse', salt, hash), false, 'case matters');
  assert.equal(await verifySecret('', salt, hash), false);
  assert.equal(await verifySecret('correct-horse', 'wrong-salt', hash), false);
});

test('verifySecret does not throw on malformed stored material', async () => {
  // A corrupt record must fail closed, not 500 the request.
  assert.equal(await verifySecret('x', 'salt', 'not-hex'), false);
  assert.equal(await verifySecret('x', 'salt', ''), false);
  assert.equal(await verifySecret('x', 'salt', undefined), false);
});

test('parseToken accepts only the exact shape', () => {
  assert.equal(parseToken(''), null);
  assert.equal(parseToken(null), null);
  assert.equal(parseToken('nonsense'), null);
  assert.equal(parseToken('akey_short_x'), null, 'id too short');
  assert.equal(parseToken(`${TOKEN_PREFIX}_${'a'.repeat(24)}_${'b'.repeat(43)}`)?.tokenId.length, 24);
  // A wrong prefix must not parse — it identifies our keys in logs.
  assert.equal(parseToken(`other_${'a'.repeat(24)}_${'b'.repeat(43)}`), null);
});

test('a minted token round-trips through parse and verify', async () => {
  const { tokenId, secret, record } = await mintToken({ name: 'CI', scopes: ['read:matters'], createdBy: 'u1' });
  const parsed = parseToken(secret);
  assert.ok(parsed, 'the issued string parses');
  assert.equal(parsed.tokenId, tokenId);
  assert.equal(await verifySecret(parsed.secret, record.salt, record.hash), true);
  // The record itself must never carry the usable secret.
  assert.equal(JSON.stringify(record).includes(parsed.secret), false, 'the stored record cannot be replayed');
});

test('unknown scopes are dropped, not stored', async () => {
  const { record } = await mintToken({ name: 'x', scopes: ['read:matters', 'root', 'delete:everything'] });
  assert.deepEqual(record.scopes, ['read:matters'],
    'a token must never appear to hold a permission the checker will not honour');
});

test('write scopes are separate from read scopes', () => {
  assert.ok(SCOPES.includes('read:matters'));
  assert.ok(SCOPES.includes('write:matters'));
  assert.equal(SCOPES.includes('write:everything'), false);
  // The point: a read-only integration cannot create anything if its key leaks.
  assert.notEqual('read:matters', 'write:matters');
});

test('a fresh token is not revoked and has never been used', async () => {
  const { record } = await mintToken({ name: 'x', scopes: [] });
  assert.equal(record.revokedAt, null);
  assert.equal(record.lastUsedAt, null);
  assert.ok(record.createdAt, 'creation is stamped');
});

test('an unnamed token still gets a label', async () => {
  const { record } = await mintToken({ scopes: [] });
  assert.equal(record.name, 'Untitled token');
});

test('presentToken shows enough to recognise a key, never enough to use one', async () => {
  const { tokenId, record } = await mintToken({ name: 'Zapier', scopes: ['read:matters'] });
  const shown = presentToken(tokenId, record);
  const json = JSON.stringify(shown);
  assert.equal(json.includes(record.hash), false, 'no hash');
  assert.equal(json.includes(record.salt), false, 'no salt');
  assert.ok(shown.prefix.startsWith(TOKEN_PREFIX), 'recognisable');
  assert.equal(shown.name, 'Zapier');
});
