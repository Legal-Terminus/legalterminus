/**
 * #194 (reopened) — the 1,000-word limit must be reachable.
 *
 * The first fix tested with one-letter "words", so a 1,000-word message was only
 * ~2,000 characters and sailed under every character cap. Real prose did not:
 * a Discussion message was cut to 4,000 characters (about 400 words kept), a
 * comment or note to 8,000, and a note was refused by its schema outright.
 *
 * These tests use realistic words on purpose. If a character cap ever again
 * sits below what 1,000 real words produce, they fail.
 *
 * Run: npm test (from backend/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  COMMENT_WORD_LIMIT,
  RICH_TEXT_MAX_CHARS,
  countWords,
  prepareRichText,
} from '../services/richText.service.js';
import { stepNoteSchema, taskTransitionSchema, messageCreateSchema } from '../schemas/task.schema.js';

const VOCAB = ('the registration application requires supporting documents including incorporation '
  + 'certificate director identification and registered office address proof before submission').split(' ');
const prose = (n, offset = 0) => Array.from({ length: n }, (_, i) => VOCAB[(i + offset) % VOCAB.length]).join(' ');

/** `n` words as the editor emits them: paragraphs, one coloured, one highlighted, a list. */
function realisticHtml(n) {
  const per = Math.floor(n / 10);
  let html = '';
  for (let p = 0; p < 10; p += 1) {
    const words = p === 9 ? n - per * 9 : per;
    const text = prose(words, p);
    if (p === 3) html += `<p><span style="color: #dc2626">${text}</span></p>`;
    else if (p === 5) html += `<p><mark style="background-color: #fef08a">${text}</mark></p>`;
    else if (p === 7) html += `<ul><li><p>${text}</p></li></ul>`;
    else html += `<p>${text}</p>`;
  }
  return html;
}

test('the fixture really is 1,000 ordinary words, and long enough to have hit the old caps', () => {
  const html = realisticHtml(COMMENT_WORD_LIMIT);
  assert.equal(countWords(html), 1000);
  assert.ok(html.length > 8000, `expected realistic markup well past 8,000 chars, got ${html.length}`);
});

for (const what of ['message', 'comment', 'note']) {
  test(`a 1,000-word ${what} is stored WHOLE — nothing is cut`, () => {
    const html = realisticHtml(COMMENT_WORD_LIMIT);
    const out = prepareRichText(html, { what });
    assert.equal(out.ok, true, out.message);
    assert.equal(countWords(out.html), 1000, 'every word survives');
    assert.ok(out.html.trimEnd().endsWith('</p>'), 'the markup is intact, not cut mid-tag');
    assert.ok(out.html.includes('color:#dc2626') || out.html.includes('color: #dc2626'), 'formatting survives too');
  });
}

test('1,001 words is refused with the real count, and nothing is returned to store', () => {
  const out = prepareRichText(realisticHtml(1001), { what: 'message' });
  assert.equal(out.ok, false);
  assert.equal(out.status, 400);
  assert.equal(out.code, 'WORD_LIMIT_EXCEEDED');
  assert.match(out.message, /at most 1000 words \(this one has 1001\)/);
  assert.equal(out.html, undefined);
});

test('the article agrees with the noun in the message', () => {
  assert.match(prepareRichText(realisticHtml(1001), { what: 'note' }).message, /^A note may/);
  assert.match(prepareRichText(realisticHtml(1001), { what: 'answer' }).message, /^An answer may/);
});

test('content inside the word limit but pathologically large is REFUSED, never truncated', () => {
  // 900 "words" of 100 characters each: within the word limit, far past any
  // sensible size. The old code would have cut this at a byte offset.
  const html = `<p>${Array.from({ length: 900 }, () => 'x'.repeat(100)).join(' ')}</p>`;
  assert.ok(countWords(html) <= COMMENT_WORD_LIMIT);
  const out = prepareRichText(html, { what: 'comment' });
  assert.equal(out.ok, false);
  assert.equal(out.code, 'RICH_TEXT_TOO_LARGE');
  assert.match(out.message, /too much formatting/);
});

test('the size cap leaves generous room above 1,000 real words', () => {
  const stored = prepareRichText(realisticHtml(COMMENT_WORD_LIMIT)).html.length;
  assert.ok(stored * 4 < RICH_TEXT_MAX_CHARS, `1,000 words used ${stored} of ${RICH_TEXT_MAX_CHARS} chars`);
});

test('scripts and handlers are still stripped on the way in', () => {
  const out = prepareRichText('<p>hello <b>there</b></p><script>alert(1)</script><img src=x onerror=alert(1)>');
  assert.equal(out.ok, true);
  assert.equal(/script|onerror|<img/i.test(out.html), false);
  assert.ok(out.html.includes('<b>there</b>'));
});

test('empty and non-string input is handled without throwing', () => {
  assert.deepEqual(prepareRichText(''), { ok: true, html: '', words: 0 });
  assert.equal(prepareRichText(undefined).html, '');
  assert.equal(prepareRichText(null).html, '');
});

// ── the schemas in front of the controllers ────────────────────────────────

test('the schemas accept a 1,000-word note, step comment and message', () => {
  const html = realisticHtml(COMMENT_WORD_LIMIT);
  assert.equal(stepNoteSchema.safeParse({ note: html }).success, true,
    'the note schema used to cap at 8,000 chars → "Validation failed"');
  assert.equal(taskTransitionSchema.safeParse({ event: { type: 'COMPLETE_STEP', remark: html } }).success, true);
  assert.equal(messageCreateSchema.safeParse({ body: html }).success, true);
});

test('a heavily formatted 1,000-word comment (every word coloured) still fits the schemas', () => {
  const html = `<p>${Array.from({ length: 1000 }, (_, i) =>
    `<span style="color: #dc2626">${VOCAB[i % VOCAB.length]}</span>`).join(' ')}</p>`;
  assert.equal(countWords(html), 1000);
  assert.equal(taskTransitionSchema.safeParse({ event: { type: 'COMPLETE_STEP', remark: html } }).success, true);
  assert.equal(stepNoteSchema.safeParse({ note: html }).success, true);
  const out = prepareRichText(html, { what: 'comment' });
  assert.equal(out.ok, true, out.message);
  assert.equal(countWords(out.html), 1000);
});
