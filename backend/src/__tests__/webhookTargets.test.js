import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isBlockedAddress, parseWebhookUrl, signPayload, SIGNATURE_HEADER, TIMESTAMP_HEADER,
} from '../services/webhookTargets.service.js';

/**
 * E21-S04 — webhook target safety.
 *
 * A webhook lets an admin name a URL the SERVER will then fetch, which is a
 * server-side request forgery primitive unless the target is constrained. These
 * tests are the constraint: anything that could reach our own network, or the
 * cloud metadata endpoint, must be refused.
 */

test('loopback is blocked in every spelling', () => {
  for (const ip of ['127.0.0.1', '127.1.2.3', '::1', '::ffff:127.0.0.1']) {
    assert.equal(isBlockedAddress(ip), true, `${ip} must be blocked`);
  }
});

test('private ranges are blocked', () => {
  for (const ip of ['10.0.0.1', '192.168.1.1', '172.16.0.1', '172.31.255.255']) {
    assert.equal(isBlockedAddress(ip), true, `${ip} must be blocked`);
  }
});

test('the cloud metadata endpoint is blocked', () => {
  // 169.254.169.254 hands out service-account credentials on GCP/AWS. This is
  // the single most valuable SSRF target in a cloud deployment.
  assert.equal(isBlockedAddress('169.254.169.254'), true);
  assert.equal(isBlockedAddress('169.254.0.1'), true, 'the whole link-local range');
});

test('carrier-grade NAT is blocked', () => {
  assert.equal(isBlockedAddress('100.64.0.1'), true);
});

test('rubbish input fails CLOSED', () => {
  // An unparseable address must be treated as blocked, never as allowed.
  for (const v of ['', null, undefined, 'not-an-ip', 123, {}]) {
    assert.equal(isBlockedAddress(v), true, `${JSON.stringify(v)} must fail closed`);
  }
});

test('a genuine public address is allowed', () => {
  assert.equal(isBlockedAddress('93.184.216.34'), false, 'example.com must be reachable');
  assert.equal(isBlockedAddress('8.8.8.8'), false);
});

test('parseWebhookUrl demands https and rejects everything else', () => {
  assert.ok(parseWebhookUrl('https://example.com/hook'), 'https is accepted');
  for (const bad of ['http://example.com/hook', 'ftp://example.com', 'file:///etc/passwd',
                     'javascript:alert(1)', 'not a url', '']) {
    assert.throws(() => parseWebhookUrl(bad), `${bad} must be refused`);
  }
});

test('the signature is stable for the same input and changes with any of it', () => {
  const base = { secret: 's3cret', timestamp: '1700000000', body: '{"event":"matter.created"}' };
  const sig = signPayload(base);
  assert.equal(signPayload(base), sig, 'deterministic');
  assert.notEqual(signPayload({ ...base, secret: 'other' }), sig, 'a different secret signs differently');
  assert.notEqual(signPayload({ ...base, timestamp: '1700000001' }), sig, 'the timestamp is signed');
  assert.notEqual(signPayload({ ...base, body: '{"event":"matter.completed"}' }), sig, 'the body is signed');
});

test('the signature does not leak the secret', () => {
  const sig = signPayload({ secret: 'hunter2', timestamp: '1', body: '{}' });
  assert.equal(sig.includes('hunter2'), false);
  assert.ok(/^[a-f0-9]{32,}$/i.test(sig.replace(/^sha256=/, '')), 'a hex digest');
});

test('headers are branded for THIS product', () => {
  // A copied header name would tell every subscriber which product this really
  // is, and would collide with the other one if a firm used both.
  assert.equal(SIGNATURE_HEADER.includes('cometflow'), false);
  assert.equal(TIMESTAMP_HEADER.includes('cometflow'), false);
  assert.ok(SIGNATURE_HEADER.startsWith('x-'));
});
