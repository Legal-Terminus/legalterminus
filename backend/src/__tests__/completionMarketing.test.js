/**
 * #310 — the "Explore more services" block on the client's completion email.
 *
 *   • on and filled  → the completion email carries the block (HTML + text);
 *   • off, or empty  → the email is byte-for-byte what it was before #310;
 *   • the editable text is escaped: nothing typed in Settings becomes markup;
 *   • only the CLIENT's completion notice asks for the block.
 *
 * Run: npm test (from backend/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderEmail } from '../services/emailService.js';
import {
  COMPLETION_MARKETING_DEFAULT, mergeCompletionMarketing, marketingBlockForEmail,
} from '../services/emailTemplates.service.js';
import { completionMarketingSchema } from '../schemas/settings.schema.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const completion = { title: 'Your service is complete', message: 'A Client · GST Registration', taskId: 'abc123xyz' };

test('the default block is the firm\'s text, switched on, and appears in the completion email', () => {
  const block = marketingBlockForEmail(mergeCompletionMarketing({}));
  assert.ok(block, 'the default block is sent without anything stored');
  assert.equal(block.heading, 'Explore More Services with Us');
  const { html, text } = renderEmail({ ...completion, appendix: block });
  assert.match(html, /Explore More Services with Us/);
  assert.match(html, /Trademark Registration &amp; Renewal/);
  assert.ok(html.includes('<a href="https://legalterminus.com/"'), 'the bare URL becomes a link');
  assert.match(html, /• Business Registration/, 'a "- " line becomes a bullet');
  // The original message is still there, above the block.
  assert.ok(html.indexOf('A Client · GST Registration') < html.indexOf('Explore More Services'));
  assert.match(text, /Explore More Services with Us\n\n• Business Registration/);
  assert.ok(text.includes('https://legalterminus.com/'));
});

test('off, or empty: the completion email is exactly as before', () => {
  const before = renderEmail(completion);
  for (const stored of [
    { enabled: false },
    { enabled: true, heading: '', body: '' },
    { enabled: true, heading: '   ', body: '\n\n' },
  ]) {
    const block = marketingBlockForEmail(mergeCompletionMarketing(stored));
    assert.equal(block, null, JSON.stringify(stored));
    assert.deepEqual(renderEmail({ ...completion, appendix: block ?? undefined }), before);
  }
});

test('an empty stored field stays empty; a field never stored keeps the default', () => {
  const m = mergeCompletionMarketing({ body: '' });
  assert.equal(m.body, '');
  assert.equal(m.heading, COMPLETION_MARKETING_DEFAULT.heading);
  assert.equal(m.enabled, true);
  // Heading only is still a block worth sending.
  assert.deepEqual(marketingBlockForEmail(m), { heading: COMPLETION_MARKETING_DEFAULT.heading, body: '' });
});

test('the editable text cannot inject markup', () => {
  const { html } = renderEmail({ ...completion, appendix: {
    heading: '<b onmouseover="x()">Hi</b>',
    body: '<script>alert(1)</script>\nVisit javascript:alert(1) or "https://example.test/?a=1&b=2".',
  } });
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<b onmouseover'));
  assert.ok(!/href="javascript:/i.test(html), 'only http(s) is linked');
  assert.match(html, /<a href="https:\/\/example\.test\/\?a=1&amp;b=2"/);
  assert.ok(!/href="[^"]*&quot;/.test(html), 'a quote never ends up inside an href');
});

test('the Settings input is plain text, sized, and has no extra fields', () => {
  const ok = completionMarketingSchema.parse({ enabled: true, heading: '<i>Hello</i>', body: 'Line' });
  assert.equal(ok.heading, 'Hello');
  assert.throws(() => completionMarketingSchema.parse({ enabled: true, heading: '', body: '', extra: 1 }));
  assert.throws(() => completionMarketingSchema.parse({ heading: '', body: '' }), 'the switch is required');
  assert.equal(completionMarketingSchema.parse({ enabled: false, heading: '', body: 'x'.repeat(5000) }).body.length, 4000);
});

test('only the client\'s completion notice carries the block', () => {
  const src = fs.readFileSync(path.join(here, '..', 'controllers', 'tasks.controller.js'), 'utf8');
  // Calls, not the helper's own definition (`async function notify({ … })`).
  const calls = src.match(/(?<!function )notify\(\{[^}]*\}\)/g) || [];
  const carrying = calls.filter((c) => c.includes('emailAppendix'));
  assert.equal(carrying.length, 1, 'exactly one notify() passes the block');
  assert.match(carrying[0], /recipientUid: task\.clientUid/);
  assert.match(carrying[0], /'Your service is complete'/);
});
