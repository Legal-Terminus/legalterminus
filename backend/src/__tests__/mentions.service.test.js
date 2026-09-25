/**
 * #200 — @mention parsing. Mentions are read from the PLAIN text of a message
 * (the editor autolinks addresses, which the plain projection flattens).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractMentionEmails } from '../services/mentions.service.js';

test('finds @email mentions, lower-cased and de-duplicated', () => {
  assert.deepEqual(
    extractMentionEmails('@Asha@firm.com please check, and @ravi@firm.com too. cc @asha@FIRM.com'),
    ['asha@firm.com', 'ravi@firm.com'],
  );
});

test('an address written in a sentence is not a mention', () => {
  assert.deepEqual(extractMentionEmails('write to asha@firm.com about it'), []);
});

test('trailing punctuation is not part of the address', () => {
  assert.deepEqual(extractMentionEmails('Thanks (@asha@firm.com).'), ['asha@firm.com']);
  assert.deepEqual(extractMentionEmails('Over to @asha@firm.com.'), ['asha@firm.com']);
});

test('mentions are capped at 20', () => {
  const many = Array.from({ length: 30 }, (_, i) => `@u${i}@firm.com`).join(' ');
  assert.equal(extractMentionEmails(many).length, 20);
});

test('empty input yields nothing', () => {
  assert.deepEqual(extractMentionEmails(''), []);
  assert.deepEqual(extractMentionEmails(null), []);
});
