/**
 * Chat messages (#123) — LT #295 (5,000-word messages and their edit history)
 * and #297 (edit only your own message; an edit notifies like a new message).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { appendRevision, MESSAGE_DOC_BUDGET_BYTES } from '../controllers/messages.controller.js';

const rev = (chars) => ({ body: 'x'.repeat(chars), replacedAt: new Date(), replacedBy: 'u' });

test('#295: edit history is kept whole while it fits', () => {
  const { revisions, dropped } = appendRevision([rev(10)], rev(20), 'current');
  assert.equal(dropped, 0);
  assert.deepEqual(revisions.map((r) => r.body.length), [10, 20]);
});

test('#295: a long message edited many times never outgrows a Firestore document', () => {
  const big = 250_000; // a long, heavily formatted 5,000-word message
  let revisions = [];
  for (let i = 0; i < 10; i += 1) {
    ({ revisions } = appendRevision(revisions, rev(big), 'y'.repeat(big)));
    const bytes = revisions.reduce((n, r) => n + r.body.length + 200, 0) + big;
    assert.ok(bytes <= MESSAGE_DOC_BUDGET_BYTES, `edit ${i + 1}: ${bytes} bytes`);
  }
  assert.ok(revisions.length >= 2, 'the newest revisions are the ones kept');
});

test('#295: multi-byte text is measured in bytes, not characters', () => {
  const hindi = 'क'.repeat(200_000); // 3 bytes each in UTF-8
  const { revisions } = appendRevision([], { body: hindi }, hindi);
  assert.equal(revisions.length, 0, '600 KB + 600 KB does not fit; the old text is not kept');
});
