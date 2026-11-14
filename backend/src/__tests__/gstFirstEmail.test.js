/**
 * #219 (firm, 11 Nov) — the FIRST email of a GST Return Filing matter has the
 * subject "<Company Name> - GST Return - <period>", whether the GST sweep opened
 * it or staff did by hand (or copied one). One first email, never two.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gstFirstEmail } from '../services/gstReturnSheet.service.js';
import { TEMPLATE_DEFS, fillTemplate } from '../services/emailTemplates.service.js';

const LINKED = ['gst-returns', 'gst-returns-quarterly'];
const here = path.dirname(fileURLToPath(import.meta.url));
const subjectOf = (plan) => fillTemplate(TEMPLATE_DEFS[plan.templateKey].subject, {
  companyName: plan.client.organisation || plan.client.businessName || plan.client.name, periodTitle: plan.period.title,
});

test('a monthly GST return matter opened by hand: the GST email, "<Company> - GST Return - <Month Year>"', () => {
  const plan = gstFirstEmail({
    task: { serviceKey: 'gst-returns', createdAt: '2026-10-05T05:00:00Z', organisation: 'ABC PRIVATE LIMITED' },
    client: { name: 'Ravi', gstReturnFrequency: 'monthly' }, linkedServices: LINKED,
  });
  assert.equal(plan.templateKey, 'gst_return_monthly');
  assert.equal(plan.period.title, 'September 2026');
  assert.equal(subjectOf(plan), 'ABC PRIVATE LIMITED - GST Return - September 2026');
});

test('a quarterly one: "<Company> - GST Return - Q2 2026-27"; the company falls back to the client\'s organisation', () => {
  const plan = gstFirstEmail({
    task: { serviceKey: 'gst-returns-quarterly', createdAt: '2026-10-05T05:00:00Z' },
    client: { name: 'Ravi', organisation: 'XYZ LLP' }, linkedServices: LINKED,
  });
  assert.equal(plan.templateKey, 'gst_return_quarterly');
  assert.equal(subjectOf(plan), 'XYZ LLP - GST Return - Q2 2026-27');
  // A copy of a sweep matter keeps its period.
  const copy = gstFirstEmail({
    task: { serviceKey: 'gst-returns', filingPeriod: { frequency: 'monthly', key: '2026-09', month: '2026-09', title: 'September 2026' } },
    client: { organisation: 'ABC PRIVATE LIMITED' }, linkedServices: LINKED,
  });
  assert.equal(subjectOf(copy), 'ABC PRIVATE LIMITED - GST Return - September 2026');
});

test('any other service keeps the "matter created" email', () => {
  assert.equal(gstFirstEmail({ task: { serviceKey: 'trademark-application', createdAt: '2026-10-05T05:00:00Z' }, client: { organisation: 'ABC' }, linkedServices: LINKED }), null);
});

test('the sweep path is unchanged: it suppresses the created email and sends its own, so a sweep matter gets one first email', () => {
  const sweep = fs.readFileSync(path.join(here, '../services/gstReturns.service.js'), 'utf8');
  assert.match(sweep, /suppressCreatedEmail: true/);
  assert.match(sweep, /keepSubject: true/);
  const tasks = fs.readFileSync(path.join(here, '../controllers/tasks.controller.js'), 'utf8');
  // The created-email block runs only without the sweep's flag, and sends ONE email:
  // the GST one when it rendered, else "matter created".
  assert.match(tasks, /if \(clientEmail && !req\.suppressCreatedEmail\) \{[\s\S]*?gstFirstEmailFor[\s\S]*?const rendered = gstRendered \?\? await renderTemplate\('matter_created'/);
  assert.match(tasks, /keepSubject: !!gstRendered/);
  assert.equal((tasks.match(/gstFirstEmailFor\(/g) ?? []).length, 1);
});
