/**
 * #219 (firm, 16 Nov) — two follow-ups:
 *   1. A GST return matter created as QUARTERLY ("Repeats: Quarterly" in Create
 *      Matter) showed as monthly in its tag, its emails and the GST Return
 *      Filing sheet. The frequency chosen at creation now drives all three.
 *   2. Every email about a GST return matter — client or staff — carries the
 *      first email's subject, "<Company> - GST Return - <Month Year | Qn YYYY-YY>".
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  frequencyOf, frequencyOfMatter, gstMatterTags, deriveRow, gstFirstEmail, gstSubjectFallback, matterIdentityOf,
} from '../services/gstReturnSheet.service.js';
import { TEMPLATE_DEFS, fillTemplate } from '../services/emailTemplates.service.js';

const LINKED = ['gst-returns', 'gst-returns-quarterly'];
const here = path.dirname(fileURLToPath(import.meta.url));
const read = (rel) => fs.readFileSync(path.join(here, rel), 'utf8');

// Opened by hand on 5 Oct 2026 on the (monthly) GST Return Filing service, "Repeats: Quarterly".
const quarterlyByHand = {
  id: 'm1', serviceKey: 'gst-returns', serviceName: 'GST Return Filing', createdAt: '2026-10-05T05:00:00Z',
  organisation: 'ABC PRIVATE LIMITED', recurrence: 'quarterly', status: 'active', currentStepNumber: 1,
};
const monthlyClient = { name: 'Ravi', gstReturnFrequency: 'monthly', gstNumber: '27abcde1234f1z5' };
const noSettingClient = { name: 'Ravi' };

test('root cause: "Repeats: Quarterly" chosen in Create Matter makes the matter quarterly, whatever the client\'s setting', () => {
  assert.equal(frequencyOf(quarterlyByHand, monthlyClient), 'quarterly');
  assert.equal(frequencyOf(quarterlyByHand, noSettingClient), 'quarterly');
  assert.equal(frequencyOf({ ...quarterlyByHand, recurrence: 'monthly' }, { gstReturnFrequency: 'quarterly' }), 'monthly');
  // No choice on the matter: the client's setting, as before.
  assert.equal(frequencyOf({ ...quarterlyByHand, recurrence: null }, noSettingClient), 'monthly');
  assert.equal(frequencyOf({ ...quarterlyByHand, recurrence: null }, { gstReturnFrequency: 'quarterly' }), 'quarterly');
  assert.equal(frequencyOfMatter({ ...quarterlyByHand, recurrence: null }), null);
});

test('the frequency frozen at creation wins over a later "Repeats" or client change; the sweep\'s period wins over all', () => {
  const frozen = { ...quarterlyByHand, gstFrequency: 'quarterly', recurrence: null }; // the series ended
  assert.equal(frequencyOf(frozen, monthlyClient), 'quarterly');
  assert.equal(frequencyOf({ ...frozen, recurrence: 'monthly' }, monthlyClient), 'quarterly');
  const sweep = { ...frozen, filingPeriod: { frequency: 'monthly', key: '2026-09', month: '2026-09', title: 'September 2026' } };
  assert.equal(frequencyOf(sweep, null), 'monthly');
});

test('a quarterly service by its key or its name', () => {
  assert.equal(frequencyOf({ serviceKey: 'gst-returns-quarterly' }, noSettingClient), 'quarterly');
  assert.equal(frequencyOf({ serviceKey: 'gst-return-qtr', serviceName: 'GST Return Filing (Quarterly)' }, noSettingClient), 'quarterly');
  assert.equal(frequencyOf({ serviceKey: 'gst-returns', serviceName: 'GST Return Filing (Monthly)' }, noSettingClient), 'monthly');
});

test('(a) the tag: the quarter and financial year, not the month', () => {
  const tags = gstMatterTags({ task: quarterlyByHand, client: monthlyClient, linkedServices: LINKED });
  assert.equal(tags.frequency, 'quarterly');
  assert.equal(tags.period, 'Q2 2026-27');
  const monthly = gstMatterTags({ task: { ...quarterlyByHand, recurrence: 'monthly' }, client: monthlyClient, linkedServices: LINKED });
  assert.equal(monthly.period, 'September 2026');
});

test('(b) the first email: the QUARTERLY template, its subject and its body name the quarter', () => {
  const plan = gstFirstEmail({ task: quarterlyByHand, client: monthlyClient, linkedServices: LINKED });
  assert.equal(plan.templateKey, 'gst_return_quarterly');
  assert.equal(plan.period.title, 'Q2 2026-27');
  assert.match(plan.period.label, /^Q2 26-27 \(July–September\)$/);
  const subject = fillTemplate(TEMPLATE_DEFS[plan.templateKey].subject, { companyName: 'ABC PRIVATE LIMITED', periodTitle: plan.period.title });
  assert.equal(subject, 'ABC PRIVATE LIMITED - GST Return - Q2 2026-27');
});

test('(c) the sheet: the row goes to Quarterly with the quarter as its Return Period', () => {
  const { frequency, values } = deriveRow({ task: quarterlyByHand, client: monthlyClient, steps: [] });
  assert.equal(frequency, 'quarterly');
  assert.equal(values.period, 'Q2 2026-27');
  assert.equal(matterIdentityOf({ task: quarterlyByHand, client: monthlyClient }).frequency, 'quarterly');
});

test('every-email subject: built-in format for monthly and quarterly; null for any other matter', () => {
  const q = gstFirstEmail({ task: quarterlyByHand, client: monthlyClient, linkedServices: LINKED });
  assert.equal(gstSubjectFallback(q), 'ABC PRIVATE LIMITED - GST Return - Q2 2026-27');
  const m = gstFirstEmail({ task: { ...quarterlyByHand, recurrence: 'monthly' }, client: monthlyClient, linkedServices: LINKED });
  assert.equal(gstSubjectFallback(m), 'ABC PRIVATE LIMITED - GST Return - September 2026');
  assert.equal(gstSubjectFallback(gstFirstEmail({ task: { serviceKey: 'trademark-application', createdAt: quarterlyByHand.createdAt, organisation: 'X' }, client: null, linkedServices: LINKED })), null);
});

test('one place: both matter-email send paths take the GST subject first; the first email keeps its own', () => {
  const email = read('../services/emailService.js');
  assert.match(email, /async function gstSubjectOf\(taskId\)/);
  // sendTemplatedEmail: keepSubject (the first GST email) → as written; a matter email → GST subject, else the standard one.
  assert.match(email, /keepSubject\s*\? subject\s*: taskId\s*\? \(await gstSubjectOf\(taskId\)\) \|\| matterSubject\(/);
  // sendNotificationEmail (createNotification: assignment, approval, internal notices …).
  assert.match(email, /const subject = \(await gstSubjectOf\(taskId\)\) \|\| matterSubject\(/);
  // Every matter-scoped templated email passes its taskId — reminders, chat notices, the sweep.
  for (const rel of ['../controllers/reminders.controller.js', '../services/chatMessageNotify.service.js']) {
    const src = read(rel);
    const sends = src.match(/sendTemplatedEmail\(\{[\s\S]*?\}\);/g) ?? [];
    assert.ok(sends.length > 0, rel);
    for (const s of sends) assert.match(s, /taskId/, `${rel}: ${s.slice(0, 80)}`);
  }
  const notif = read('../controllers/notifications.controller.js');
  assert.match(notif, /sendNotificationEmail\(\{[^}]*taskId/);
});

test('creation freezes the frequency on a GST matter; a copy inherits its source\'s', () => {
  const tasks = read('../controllers/tasks.controller.js');
  assert.match(tasks, /if \(!filingPeriod && isGstReturnMatter\(task, await gstReturnServiceKeys\(\)\)\) \{\s*task\.gstFrequency = frequencyOf\(\{ \.\.\.task, gstFrequency: req\.gstFrequency \?\? null \}, c\);/);
  assert.match(tasks, /gstFrequency: await gstFrequencyOf\(src\)/);
  // Never from the request body.
  assert.doesNotMatch(read('../schemas/task.schema.js'), /gstFrequency/);
});

test('existing rows re-derive once: the sheet sync rules version moved on', () => {
  assert.match(read('../services/gstReturnSheetSync.service.js'), /const RULES_VERSION = 4;/);
});

test('#219 (28 Nov): a sheet request that finds a sync running waits for it before reading (source check)', () => {
  const ctl = read('../controllers/worksheets.controller.js');
  assert.match(ctl, /run\?\.skipped === 'locked'/);
  assert.match(ctl, /await waitForSheetSync\(sheet\.book\)/);
  const svc = read('../services/gstReturnSheetSync.service.js');
  assert.match(svc, /export async function waitForSheetSync\(/);
  // A dead run's lock (older than LOCK_MS) is not waited on.
  assert.match(svc, /Date\.now\(\) - d\.lockedAtMs >= LOCK_MS\) return true/);
});
