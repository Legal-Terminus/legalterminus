/**
 * #207 — one event, one email.
 *
 * `createNotification` mirrors every in-app notification to email unless the
 * caller passes `email: false`. Two handlers sent a TEMPLATED email and then
 * created a notification without that flag, so the client received two emails:
 *
 *   • a client reminder        — the second copy even had the same subject;
 *   • a client-visible message — "New message about your service" on top of the
 *     message email.
 *
 * No handler-level harness exists for these controllers (they need Firestore
 * and a mail transport), so this is a tripwire on the source: in the two
 * controllers whose every email is a template, each createNotification call
 * must opt out of the mirror. A new call that forgets it fails here.
 *
 * Run: npm test (from backend/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (rel) => fs.readFileSync(path.join(here, '..', rel), 'utf8');

/** The argument text of every `createNotification(` call in `source`. */
function notificationCalls(source) {
  const calls = [];
  let at = 0;
  for (;;) {
    const start = source.indexOf('createNotification(', at);
    if (start === -1) break;
    let depth = 0;
    let end = start + 'createNotification'.length;
    for (; end < source.length; end += 1) {
      if (source[end] === '(') depth += 1;
      else if (source[end] === ')') { depth -= 1; if (depth === 0) break; }
    }
    const text = source.slice(start, end + 1);
    // Skip the import line and prose mentions: a real call has an object argument.
    if (text.includes('recipientUid')) calls.push({ text, line: source.slice(0, start).split('\n').length });
    at = end + 1;
  }
  return calls;
}

for (const file of ['controllers/reminders.controller.js', 'controllers/messages.controller.js']) {
  test(`${file}: every notification leaves the email to the template that was already sent`, () => {
    const source = read(file);
    assert.ok(source.includes('sendTemplatedEmail('), 'this controller is expected to send templated emails');
    const calls = notificationCalls(source);
    assert.ok(calls.length >= 2, `expected to find the notification calls, found ${calls.length}`);
    const mirrored = calls.filter((c) => !/email:\s*false/.test(c.text));
    assert.deepEqual(mirrored.map((c) => `line ${c.line}`), [],
      'these createNotification calls would send a SECOND email beside the templated one — pass `email: false`');
  });
}

test('every sent email is logged once, without addresses or subject', () => {
  const source = read('services/emailService.js');
  const at = source.indexOf("'[email] sent'");
  assert.notEqual(at, -1, 'a successful send must be logged, or duplicates cannot be counted from the logs');
  const call = source.slice(source.lastIndexOf('logger.info(', at), at);
  for (const leaked of [' to,', 'to:', 'cc:', 'subject:', 'finalSubject', 'heading']) {
    assert.equal(call.includes(leaked), false, `the send log must not carry ${leaked}`);
  }
  assert.match(call, /messageId/);
  assert.match(call, /recipients/);
});
