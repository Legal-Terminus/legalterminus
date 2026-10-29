import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DAY_MS, toMs, pct, stepAssignees, isWorkCompletion, onTimeOf, delayDays, resolveRange,
  classifyStep, workSummary, timeOnTasks, deadlineAnalysis, pickGranularity, bucketStart,
  productivityTrend, returnedStepOf, indexReturns, qualityAnalysis, awaitingApproval,
  approvalKindOf, assignedAtOf, taskHistory, performanceStats, overviewRows, eventLabel,
  stepsFor, commentText,
} from '../services/teamPerformance.service.js';

/**
 * LT #216 — the Employee Performance arithmetic.
 *
 * Each case is one a plausible implementation gets wrong: a payment gate counted
 * as someone's work, a day that starts at UTC midnight for a firm in IST, the
 * average delay diluted by on-time work, a rejection credited to the reviewer
 * instead of the person whose work came back.
 */

const iso = (s) => new Date(s).toISOString();
// The period under test: 1–31 October 2026 (UTC), "now" is 20 October noon.
const RANGE = { ...resolveRange({ from: '2026-10-01T00:00:00.000Z', to: '2026-10-31T23:59:59.999Z' }), now: Date.parse('2026-10-20T12:00:00Z') };

const step = (over = {}) => ({
  taskId: 't1', stepNumber: 1, title: 'Draft MOA', status: 'active', assignees: ['u1'],
  startedAt: null, completedAt: null, completedBy: null, dueAt: null, onTime: null, remark: null,
  clientName: 'Acme', serviceName: 'Incorporation', matterStatus: 'active', matterCreatedAt: iso('2026-09-01'),
  ...over,
});
const done = (over = {}) => step({ status: 'completed', startedAt: iso('2026-10-05T09:00Z'), completedAt: iso('2026-10-07T09:00Z'), completedBy: 'u1', ...over });

/* ── primitives ──────────────────────────────────────────────────────────── */

test('toMs accepts ISO strings, Dates and Timestamps; rejects rubbish', () => {
  assert.equal(toMs('2026-10-01T00:00:00Z'), Date.parse('2026-10-01T00:00:00Z'));
  assert.equal(toMs(new Date(5)), 5);
  assert.equal(toMs({ toDate: () => new Date(7) }), 7);
  assert.equal(toMs(null), null);
  assert.equal(toMs(''), null);
  assert.equal(toMs('not a date'), null);
});

test('pct is a whole number and null — not 0 — when there is nothing to divide', () => {
  assert.equal(pct(1, 3), 33);
  assert.equal(pct(2, 3), 67);
  assert.equal(pct(0, 0), null);
  assert.equal(pct(0, 4), 0);
});

test('stepAssignees prefers the multi-assignee list and falls back to the single field', () => {
  assert.deepEqual(stepAssignees({ assignedToUids: ['a', 'b', 'a'], assignedTo: 'a' }), ['a', 'b']);
  assert.deepEqual(stepAssignees({ assignedToUids: [], assignedTo: 'c' }), ['c']);
  assert.deepEqual(stepAssignees({}), []);
});

test('stepsFor picks steps where the person is ANY of the assignees', () => {
  const rows = [step({ assignees: ['u1', 'u2'] }), step({ stepNumber: 2, assignees: ['u2'] })];
  assert.equal(stepsFor('u1', rows).length, 1);
  assert.equal(stepsFor('u2', rows).length, 2);
});

test('an auto-passed payment gate is not anyone’s completed work', () => {
  // A forward jump writes completed + completedAt on a gate, with no start and no completer.
  assert.equal(isWorkCompletion(step({ status: 'completed', completedAt: iso('2026-10-05') })), false);
  assert.equal(isWorkCompletion(done()), true);
  // Completed by a person but missing a start (legacy) still counts.
  assert.equal(isWorkCompletion(step({ status: 'completed', completedAt: iso('2026-10-05'), completedBy: 'u1' })), true);
  // A step completed, then sent back, keeps its old completedAt — it is not complete.
  assert.equal(isWorkCompletion(done({ status: 'active' })), false);
});

test('onTimeOf trusts the stored flag, then the dates, and has no answer without a due date', () => {
  assert.equal(onTimeOf(done({ onTime: false, dueAt: iso('2026-12-01') })), false, 'stored flag wins');
  assert.equal(onTimeOf(done({ dueAt: iso('2026-10-07T09:00Z') })), true, 'on the due instant is on time');
  assert.equal(onTimeOf(done({ dueAt: iso('2026-10-06T09:00Z') })), false);
  assert.equal(onTimeOf(done()), null);
});

test('delayDays is days late to one decimal, and 0 when not late', () => {
  assert.equal(delayDays(done({ dueAt: iso('2026-10-04T21:00Z') })), 2.5);
  assert.equal(delayDays(done({ dueAt: iso('2026-10-09') })), 0);
  assert.equal(delayDays(done()), 0);
});

test('resolveRange derives the previous equal period and rejects bad ranges', () => {
  const r = resolveRange({ from: '2026-10-08T00:00:00.000Z', to: '2026-10-14T23:59:59.999Z' });
  assert.equal(r.prevTo, r.from - 1);
  assert.equal(r.to - r.from, r.prevTo - r.prevFrom, 'same length');
  assert.equal(new Date(r.prevFrom).toISOString(), '2026-10-01T00:00:00.000Z');
  assert.ok(resolveRange({ from: 'x', to: '2026-10-01' }).error);
  assert.ok(resolveRange({ from: '2026-10-02', to: '2026-10-01' }).error);
  assert.ok(resolveRange({ from: '2024-01-01', to: '2026-01-01' }).error, 'more than a year');
});

/* ── 1 + 3 — summary ─────────────────────────────────────────────────────── */

test('classifyStep: carried forward = started before the period and still open at its end', () => {
  const carried = classifyStep(step({ startedAt: iso('2026-09-28') }), RANGE);
  assert.equal(carried.carriedForward, true);
  assert.equal(carried.openAtEnd, true);
  const startedInside = classifyStep(step({ startedAt: iso('2026-10-03') }), RANGE);
  assert.equal(startedInside.carriedForward, false);
  assert.equal(startedInside.startedInRange, true);
  // Finished inside the period: neither carried forward nor open.
  const finished = classifyStep(done({ startedAt: iso('2026-09-28') }), RANGE);
  assert.equal(finished.carriedForward, false);
  assert.equal(finished.completedInRange, true);
});

test('classifyStep: for a past period, a step finished AFTER it was open at its end', () => {
  const sept = { ...resolveRange({ from: '2026-09-01T00:00:00Z', to: '2026-09-30T23:59:59.999Z' }), now: RANGE.now };
  const c = classifyStep(done({ startedAt: iso('2026-09-20'), completedAt: iso('2026-10-02') }), sept);
  assert.equal(c.completedInRange, false);
  assert.equal(c.openAtEnd, true);
  // A step that started after that period is not part of it.
  assert.equal(classifyStep(step({ startedAt: iso('2026-10-10') }), sept).openAtEnd, false);
});

test('not started counts pending steps of OPEN matters only', () => {
  assert.equal(classifyStep(step({ status: 'pending' }), RANGE).notStarted, true);
  assert.equal(classifyStep(step({ status: 'pending', matterStatus: 'completed' }), RANGE).notStarted, false);
});

test('overdue = active now with a due date in the past', () => {
  assert.equal(classifyStep(step({ dueAt: iso('2026-10-19') }), RANGE).overdueNow, true);
  assert.equal(classifyStep(step({ dueAt: iso('2026-10-21') }), RANGE).overdueNow, false);
  assert.equal(classifyStep(done({ dueAt: iso('2026-10-01') }), RANGE).overdueNow, false, 'completed is never overdue');
});

test('workSummary adds up, and assigned = completed + in progress + not started', () => {
  const rows = [
    done(),                                                    // completed in range
    done({ stepNumber: 2, completedAt: iso('2026-09-15'), startedAt: iso('2026-09-10') }), // before range
    step({ stepNumber: 3, startedAt: iso('2026-09-28'), dueAt: iso('2026-10-10') }),       // carried + overdue
    step({ stepNumber: 4, startedAt: iso('2026-10-18') }),     // started in range
    step({ stepNumber: 5, status: 'pending' }),                // not started
  ];
  const s = workSummary(rows, RANGE);
  assert.equal(s.completed, 1);
  assert.equal(s.inProgress, 2);
  assert.equal(s.notStarted, 1);
  assert.equal(s.pending, 3);
  assert.equal(s.assigned, 4);
  assert.equal(s.startedInRange, 2, 'step 1 (started 5 Oct) and step 4');
  assert.equal(s.carriedForward, 1);
  assert.equal(s.overdue, 1);
  assert.equal(s.completionPct, 25);
});

test('workSummary reports not-started as unknown when it was not loaded', () => {
  const s = workSummary([done(), step({ stepNumber: 5, status: 'pending' })], RANGE, { notStartedKnown: false });
  assert.equal(s.notStarted, null);
  assert.equal(s.assigned, 1);
});

/* ── 2 — time on tasks ───────────────────────────────────────────────────── */

test('timeOnTasks is elapsed start→finish for work completed in the period, newest first', () => {
  const rows = [
    done(), // 2 days
    done({ stepNumber: 2, startedAt: iso('2026-10-10T09:00Z'), completedAt: iso('2026-10-10T15:00Z') }), // 6 h
    done({ stepNumber: 3, startedAt: null, completedBy: 'u1' }), // no start: no elapsed
    step({ stepNumber: 4, startedAt: iso('2026-10-01') }),       // still open
  ];
  const t = timeOnTasks(rows, RANGE);
  assert.equal(t.count, 2);
  assert.equal(t.items[0].stepNumber, 2, 'newest completion first');
  assert.equal(t.items[0].elapsedMs, 6 * 3600_000);
  assert.equal(t.totalElapsedMs, 2 * DAY_MS + 6 * 3600_000);
  assert.equal(t.avgElapsedMs, Math.round((2 * DAY_MS + 6 * 3600_000) / 2));
  assert.equal(timeOnTasks([], RANGE).avgElapsedMs, null);
});

/* ── 5 — deadlines ───────────────────────────────────────────────────────── */

test('deadlineAnalysis: average delay is over LATE completions only', () => {
  const rows = [
    done({ dueAt: iso('2026-10-08') }),                                    // on time
    done({ stepNumber: 2, dueAt: iso('2026-10-06T09:00Z') }),              // 1 day late
    done({ stepNumber: 3, dueAt: iso('2026-10-04T09:00Z'), remark: '<p>Client sent papers late</p>' }), // 3 days late
    done({ stepNumber: 4 }),                                               // no due date
    step({ stepNumber: 5, startedAt: iso('2026-10-01'), dueAt: iso('2026-10-15') }), // overdue now
  ];
  const d = deadlineAnalysis(rows, RANGE);
  assert.equal(d.completedOnTime, 1);
  assert.equal(d.completedLate, 2);
  assert.equal(d.completedWithoutDueDate, 1);
  assert.equal(d.avgDelayDays, 2, '(1 + 3) / 2 — the on-time one does not dilute it');
  assert.equal(d.onTimePct, 33);
  assert.equal(d.overdueNow, 1);
  assert.equal(d.overdueItems[0].daysOverdue, 5.5);
  assert.equal(d.lateItems[0].stepNumber, 3, 'worst first');
  assert.equal(d.lateItems[0].completionComment, 'Client sent papers late', 'HTML stripped');
  assert.equal(d.lateItems[1].completionComment, null);
});

test('deadlineAnalysis with no late work has no average delay (not 0)', () => {
  assert.equal(deadlineAnalysis([done({ dueAt: iso('2026-10-30') })], RANGE).avgDelayDays, null);
});

/* ── 6 — trend ───────────────────────────────────────────────────────────── */

test('pickGranularity: daily to a month, weekly to ~4 months, monthly beyond; daily is capped', () => {
  const f = Date.parse('2026-01-01');
  assert.equal(pickGranularity(f, f + 30 * DAY_MS), 'day');
  assert.equal(pickGranularity(f, f + 90 * DAY_MS), 'week');
  assert.equal(pickGranularity(f, f + 200 * DAY_MS), 'month');
  assert.equal(pickGranularity(f, f + 200 * DAY_MS, 'day'), 'week');
  assert.equal(pickGranularity(f, f + 5 * DAY_MS, 'month'), 'month');
});

test('bucketStart: a day starts at LOCAL midnight (IST), weeks on Monday', () => {
  // 00:30 IST on 2 Oct is 19:00 UTC on 1 Oct — it belongs to 2 Oct in India.
  const ms = Date.parse('2026-10-01T19:00:00Z');
  assert.equal(new Date(bucketStart(ms, 'day', 330)).toISOString(), '2026-10-01T18:30:00.000Z');
  assert.equal(new Date(bucketStart(ms, 'day', 0)).toISOString(), '2026-10-01T00:00:00.000Z');
  // Thursday 29 Oct 2026 → Monday 26 Oct.
  assert.equal(new Date(bucketStart(Date.parse('2026-10-29T10:00:00Z'), 'week', 0)).toISOString(), '2026-10-26T00:00:00.000Z');
  // A Monday is its own week start.
  assert.equal(new Date(bucketStart(Date.parse('2026-10-26T00:00:00Z'), 'week', 0)).toISOString(), '2026-10-26T00:00:00.000Z');
  assert.equal(new Date(bucketStart(Date.parse('2026-10-29T10:00:00Z'), 'month', 330)).toISOString(), '2026-09-30T18:30:00.000Z');
});

test('productivityTrend fills empty buckets and compares with the previous equal period', () => {
  const week = { ...resolveRange({ from: '2026-10-05T00:00:00Z', to: '2026-10-11T23:59:59.999Z' }), now: RANGE.now };
  const rows = [
    done({ completedAt: iso('2026-10-06T10:00Z'), dueAt: iso('2026-10-07') }),                // on time
    done({ stepNumber: 2, completedAt: iso('2026-10-06T11:00Z'), dueAt: iso('2026-10-05') }), // late
    done({ stepNumber: 3, completedAt: iso('2026-10-09T11:00Z') }),                           // no due
    done({ stepNumber: 4, completedAt: iso('2026-09-30T11:00Z'), dueAt: iso('2026-10-01') }), // previous week, on time
    done({ stepNumber: 5, completedAt: iso('2026-10-12T11:00Z') }),                           // after the period
  ];
  const t = productivityTrend(rows, week, { tzOffsetMin: 0 });
  assert.equal(t.granularity, 'day');
  assert.equal(t.buckets.length, 7, 'every day, including empty ones');
  const tue = t.buckets.find((b) => b.label === '6 Oct');
  assert.equal(tue.completed, 2);
  assert.equal(tue.onTimePct, 50);
  assert.equal(t.buckets.find((b) => b.label === '7 Oct').onTimePct, null, 'no work: no percentage');
  assert.equal(t.current.completed, 3);
  assert.equal(t.current.onTimePct, 50);
  assert.equal(t.previous.completed, 1);
  assert.equal(t.previous.onTimePct, 100);
  assert.equal(t.completedChange, 2);
  assert.equal(t.onTimePctChange, -50);
});

test('productivityTrend labels weeks and months', () => {
  const q = { ...resolveRange({ from: '2026-08-01T00:00:00Z', to: '2026-10-31T23:59:59.999Z' }), now: RANGE.now };
  assert.match(productivityTrend([], q, { granularity: 'week' }).buckets[0].label, /^Week of \d+ \w{3}$/);
  const m = productivityTrend([], q, { granularity: 'month' });
  assert.deepEqual(m.buckets.map((b) => b.label), ['Aug 2026', 'Sep 2026', 'Oct 2026']);
});

/* ── 7 — quality & approval ──────────────────────────────────────────────── */

test('returnedStepOf credits the step that must be redone, not the reviewer’s step', () => {
  assert.equal(returnedStepOf({ type: 'REWORK', fromStep: 2, toStep: 1 }), 1);
  assert.equal(returnedStepOf({ type: 'CLIENT_REJECT', fromStep: 10, toStep: 6 }), 6);
  assert.equal(returnedStepOf({ type: 'CLIENT_REJECT', fromStep: 49, toStep: 49 }), 49, '#214: changes requested on the same step');
  assert.equal(returnedStepOf({ type: 'STEP_REOPENED', fromStep: 9, toStep: 4 }), 4);
  // A government rejection moves FORWARD to resubmission — the rejected work is where it came from.
  assert.equal(returnedStepOf({ type: 'GOVT_REJECT', fromStep: 13, toStep: 14 }), 13);
  assert.equal(returnedStepOf({ type: 'COMPLETE_STEP', fromStep: 1, toStep: 2 }), null);
  assert.equal(returnedStepOf({ type: 'REWORK', fromStep: 2, toStep: null }), null);
});

test('indexReturns keys by matter + step and orders oldest first', () => {
  const m = indexReturns([
    { taskId: 't1', type: 'REWORK', fromStep: 2, toStep: 1, at: iso('2026-10-09') },
    { taskId: 't1', type: 'REWORK', fromStep: 2, toStep: 1, at: iso('2026-10-03') },
    { taskId: 't2', type: 'REWORK', fromStep: 2, toStep: 1, at: iso('2026-10-03') },
    { taskId: 't1', type: 'STEP_NOTE', fromStep: 1, toStep: 1, at: iso('2026-10-03') },
  ]);
  assert.equal(m.get('t1#1').length, 2);
  assert.equal(m.get('t1#1')[0].at, iso('2026-10-03'));
  assert.equal(m.get('t2#1').length, 1);
});

test('qualityAnalysis: first-time right excludes any step ever returned; returns are counted in the period', () => {
  const rows = [
    done(),                                     // returned once in Oct → not FTR
    done({ stepNumber: 2 }),                    // clean → FTR
    done({ stepNumber: 3 }),                    // returned in September → not FTR, not "returned in period"
    step({ stepNumber: 4, startedAt: iso('2026-10-10') }), // open, returned twice in Oct
  ];
  const events = [
    { taskId: 't1', type: 'REWORK', fromStep: 9, toStep: 1, at: iso('2026-10-06'), comment: '<b>Wrong DIN</b>' },
    { taskId: 't1', type: 'REWORK', fromStep: 9, toStep: 3, at: iso('2026-09-20') },
    { taskId: 't1', type: 'CLIENT_REJECT', fromStep: 9, toStep: 4, at: iso('2026-10-11') },
    { taskId: 't1', type: 'STEP_REOPENED', fromStep: 9, toStep: 4, at: iso('2026-10-15'), comment: 'Step reopened: typo' },
    { taskId: 't9', type: 'REWORK', fromStep: 2, toStep: 2, at: iso('2026-10-06') }, // another matter
  ];
  const q = qualityAnalysis(rows, events, RANGE);
  assert.equal(q.completed, 3);
  assert.equal(q.firstTimeRight, 1);
  assert.equal(q.firstTimeRightPct, 33);
  assert.equal(q.returnedSteps, 2);
  assert.equal(q.returnCount, 3);
  assert.equal(q.returnedItems[0].stepNumber, 4, 'most recently returned first');
  assert.equal(q.returnedItems[0].returns, 2);
  assert.equal(q.returnedItems[0].lastReturnType, 'STEP_REOPENED');
  assert.equal(q.returnedItems[1].lastComment, 'Wrong DIN');
});

test('approvalKindOf recognises admin approvals and client approvals only', () => {
  assert.equal(approvalKindOf({ assignedRole: 'admin', transitions: [{ event: 'COMPLETE_STEP' }] }), 'admin');
  assert.equal(approvalKindOf({ transitions: [{ event: 'CLIENT_APPROVE' }, { event: 'CLIENT_REJECT' }] }), 'client');
  assert.equal(approvalKindOf({ transitions: [{ event: 'COMPLETE_STEP' }] }), null);
  assert.equal(approvalKindOf(undefined), null);
});

test('awaitingApproval: the approval step was started by completing THIS person’s step', () => {
  const at = iso('2026-10-18T10:00:00.000Z');
  const approvals = [
    { taskId: 't1', stepNumber: 2, title: 'Partner approval', kind: 'admin', startedAt: at, clientName: 'Acme', serviceName: 'Inc',
      submitted: [done({ completedAt: at, assignees: ['u1'] })] },
    { taskId: 't2', stepNumber: 7, title: 'Client approval', kind: 'client', startedAt: at, clientName: 'Beta', serviceName: 'TM',
      submitted: [done({ taskId: 't2', stepNumber: 6, completedAt: at, assignees: ['u2'] })] },
    // Same matter, but the completion is not the one that started the approval.
    { taskId: 't3', stepNumber: 4, title: 'Approve', kind: 'admin', startedAt: at,
      submitted: [done({ taskId: 't3', stepNumber: 3, completedAt: iso('2026-10-17'), assignees: ['u1'] })] },
    // An auto-passed gate does not "submit" anything.
    { taskId: 't4', stepNumber: 4, title: 'Approve', kind: 'admin', startedAt: at,
      submitted: [step({ taskId: 't4', stepNumber: 3, status: 'completed', completedAt: at, assignees: ['u1'] })] },
  ];
  const pending = [
    { taskId: 'm1', createdBy: 'u1', assignedTo: null, clientName: 'Gamma', serviceName: 'GST', createdAt: iso('2026-10-15') },
    { taskId: 'm2', createdBy: 'u3', assignedTo: null, createdAt: iso('2026-10-15') },
  ];
  const mine = awaitingApproval(approvals, pending, 'u1');
  assert.equal(mine.count, 2);
  assert.deepEqual(mine.items.map((i) => i.taskId).sort(), ['m1', 't1']);
  const step1 = mine.items.find((i) => i.taskId === 't1');
  assert.equal(step1.waitingOn, 'admin');
  assert.equal(step1.title, 'Draft MOA');
  assert.equal(step1.approvalTitle, 'Partner approval');
  // The whole team: every genuine submission and every pending matter.
  assert.equal(awaitingApproval(approvals, pending, null).count, 4);
});

/* ── 4 — history ─────────────────────────────────────────────────────────── */

test('assignedAtOf: latest reassignment of this step, else when the matter opened', () => {
  const s = step({ stepNumber: 3 });
  assert.deepEqual(assignedAtOf(s, []), { at: iso('2026-09-01'), source: 'matter-opened' });
  const events = [
    { taskId: 't1', type: 'STEP_REASSIGNED', toStep: 3, at: iso('2026-10-02') },
    { taskId: 't1', type: 'STEP_REASSIGNED', toStep: 3, at: iso('2026-10-04') },
    { taskId: 't1', type: 'STEP_REASSIGNED', toStep: 4, at: iso('2026-10-09') },          // another step
    { taskId: 't1', type: 'MATTER_REASSIGNED', toStep: 3, newAssignee: 'u9', at: iso('2026-10-08') }, // not to them
  ];
  assert.deepEqual(assignedAtOf(s, events), { at: iso('2026-10-04'), source: 'reassigned' });
  const toThem = [...events, { taskId: 't1', type: 'MATTER_REASSIGNED', toStep: 3, newAssignee: 'u1', at: iso('2026-10-06') }];
  assert.equal(assignedAtOf(s, toThem).at, iso('2026-10-06'));
});

test('taskHistory lists only steps with activity in the period, newest first', () => {
  const rows = [
    done({ remark: '<p>Filed</p>' }),
    step({ stepNumber: 2, startedAt: iso('2026-10-12') }),
    step({ stepNumber: 3, status: 'pending' }),                                 // nothing happened
    done({ stepNumber: 4, completedAt: iso('2026-08-01'), startedAt: iso('2026-07-30') }), // long ago
  ];
  const h = taskHistory(rows, [], RANGE);
  assert.equal(h.total, 2);
  assert.deepEqual(h.rows.map((r) => r.stepNumber), [2, 1]);
  assert.equal(h.rows[0].status, 'in_progress');
  assert.equal(h.rows[1].status, 'completed');
  assert.equal(h.rows[1].lastComment, 'Filed');
  assert.equal(h.rows[1].assignedVia, 'matter-opened');
});

/* ── combined ────────────────────────────────────────────────────────────── */

test('performanceStats agrees with itself across sections', () => {
  const rows = [done({ dueAt: iso('2026-10-06') }), done({ stepNumber: 2, dueAt: iso('2026-10-09') }), step({ stepNumber: 3, startedAt: iso('2026-10-15') })];
  const events = [{ taskId: 't1', type: 'REWORK', fromStep: 5, toStep: 1, at: iso('2026-10-06') }];
  const s = performanceStats(rows, events, RANGE, { uid: 'u1' });
  assert.equal(s.summary.completed, s.deadlines.completedOnTime + s.deadlines.completedLate + s.deadlines.completedWithoutDueDate);
  assert.equal(s.summary.completed, s.trend.current.completed);
  assert.equal(s.summary.completed, s.quality.completed);
  assert.equal(s.summary.completed, s.time.count);
  assert.equal(s.quality.firstTimeRight, 1);
  assert.equal(s.summary.awaitingApproval, 0);
  assert.equal(s.history.total, 3);
});

test('overviewRows: one row per person, busiest first, nobody’s zero is coloured as a problem', () => {
  const staff = [{ uid: 'u1', name: 'Asha' }, { uid: 'u2', name: 'Bala' }, { uid: 'u3', name: 'Chitra' }];
  const rows = [
    done({ dueAt: iso('2026-10-06'), assignees: ['u1'] }),                     // late
    done({ stepNumber: 2, dueAt: iso('2026-10-09'), assignees: ['u1', 'u2'] }), // on time, shared
    step({ stepNumber: 3, startedAt: iso('2026-10-10'), dueAt: iso('2026-10-12'), assignees: ['u2'] }), // overdue
  ];
  const events = [{ taskId: 't1', type: 'REWORK', fromStep: 9, toStep: 2, at: iso('2026-10-08') }];
  const o = overviewRows(staff, rows, events, RANGE);
  assert.deepEqual(o.map((r) => r.uid), ['u1', 'u2', 'u3']);
  const [a, b, c] = o;
  assert.equal(a.completed, 2);
  assert.equal(a.onTimePct, 50);
  assert.equal(a.avgDelayDays, 1.4, 'due 6 Oct 00:00, done 7 Oct 09:00');
  assert.equal(a.firstTimeRightPct, 50);
  assert.equal(a.returned, 1);
  assert.equal(b.completed, 1);
  assert.equal(b.inProgress, 1);
  assert.equal(b.overdue, 1);
  assert.equal(c.assigned, 0);
  assert.equal(c.onTimePct, null, 'no work: no percentage, not 0%');
  assert.equal(c.firstTimeRightPct, null);
});

test('eventLabel names known events and de-shouts unknown ones', () => {
  assert.equal(eventLabel('REWORK'), 'Sent back for correction');
  assert.equal(eventLabel('SOMETHING_NEW'), 'Something new');
  assert.equal(eventLabel(null), 'Activity');
});

test('commentText strips markup and caps length', () => {
  assert.equal(commentText('<p>Hi <b>there</b></p>'), 'Hi there');
  assert.equal(commentText(''), null);
  assert.equal(commentText(`<p>${'x'.repeat(600)}</p>`).length, 500);
});
