/**
 * The client 360's Recent activity feed shows PLAIN TEXT, not markup.
 *
 * Comments are stored as sanitised rich-text HTML (#122). This feed renders one
 * truncated line per event, and it was interpolating the stored value directly
 * — so a real client page read:
 *
 *   <p>Dear Ma'am,</p><p></p><p>As requested by the client, I have added…
 *
 * Block tags cannot render inside a single-line row anyway, so the projection
 * is plain text rather than HTML. The full formatting is one click away on the
 * matter itself, where RichText renders it properly.
 *
 * Run: npm test (from backend/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { richTextToPlain } from '../services/richText.service.js';

test('strips the block markup that was showing literally', () => {
  // Verbatim from the reported page.
  const stored = "<p>Dear Ma'am,</p><p></p><p>As requested by the client, I have "
    + 'added the insurance services to the draft, kindly check the revised DRAFT '
    + 'TM-A in the documents section.</p>';
  const out = richTextToPlain(stored);

  assert.ok(!out.includes('<p>'), 'no paragraph tags survive');
  assert.ok(!out.includes('</p>'), 'no closing tags survive');
  assert.ok(out.startsWith("Dear Ma'am,"), `unexpected start: ${out.slice(0, 40)}`);
  assert.ok(out.includes('revised DRAFT TM-A'), 'the actual sentence survives');
});

test('inline emphasis is unwrapped, and its text kept', () => {
  const stored = '<p>The <strong>draft TM-A</strong> is available in the '
    + '<strong>Documents section</strong> for your reference.</p><p><br></p>';
  const out = richTextToPlain(stored);

  assert.ok(!out.includes('<strong>'), 'no strong tags');
  assert.equal(out, 'The draft TM-A is available in the Documents section for your reference.');
});

test('a plain-text event is left exactly as it is', () => {
  // Events like "Reminder sent to the client (gentle)" and "BRANCH_DECISION"
  // are not rich text and must not be altered.
  for (const s of ['Reminder sent to the client (gentle)', 'BRANCH_DECISION',
    'Reassigned to Matuni Swain (from Mandakini Behera)']) {
    assert.equal(richTextToPlain(s), s);
  }
});

test('empty paragraphs do not become runs of blank lines', () => {
  // The editor emits <p></p> for a blank line; several in a row would push the
  // real sentence out of a truncated preview entirely.
  const out = richTextToPlain('<p>A</p><p></p><p></p><p></p><p>B</p>');
  assert.equal(out, 'A\n\nB');
});

test('nothing in, nothing out', () => {
  for (const v of ['', '   ', null, undefined, 42]) {
    assert.equal(richTextToPlain(v), '');
  }
});

test('a script tag cannot survive the projection', () => {
  // Defence in depth: content is sanitised on write, but this feed is also the
  // place a pre-#122 or externally-written value could surface.
  const out = richTextToPlain('<p>hi</p><script>alert(1)</script>');
  assert.ok(!out.toLowerCase().includes('script'), `leaked: ${out}`);
  assert.ok(!out.includes('alert(1)'), `leaked payload: ${out}`);
});
