/**
 * LT #216 — Employee Performance report: the PURE arithmetic.
 *
 * Everything here takes plain rows (step records, activity events) and returns
 * numbers. No Firestore, no clock (callers pass `now`), so every figure a manager
 * reads can be unit-tested against the case that would make it wrong.
 *
 * Vocabulary: a "task" in the UI is a STEP record (`tasks/{id}/steps/{n}`); a
 * "matter" is the task document. A step row, as the controller builds it:
 *
 *   { taskId, stepNumber, title, status, assignees: [uid…], startedAt,
 *     completedAt, completedBy, dueAt, onTime, remark,
 *     clientName, serviceName, matterStatus, matterCreatedAt }
 *
 * What the data CAN'T tell us (said here so nobody "fixes" it by inventing):
 *  - Working hours. The portal records when a step started and finished, not
 *    when anyone was working on it. Elapsed time is reported as elapsed.
 *  - A reason for delay. There is no such field. The comment recorded when a
 *    late step was completed (`remark`) is the nearest thing, and is labelled so.
 *  - Who a step USED to belong to. Attribution is by the step's CURRENT
 *    assignees; a step reassigned away leaves the previous person's figures.
 */
import { richTextToPlain } from './richText.service.js';

export const DAY_MS = 86_400_000;

/** Events that send a step back for correction. See `returnedStepOf`. */
export const RETURN_TYPES = ['REWORK', 'CLIENT_REJECT', 'GOVT_REJECT', 'STEP_REOPENED'];
/** Events that (re)assign a step. Used only for the "assigned at" timestamp. */
export const ASSIGN_TYPES = ['STEP_REASSIGNED', 'MATTER_REASSIGNED'];

/** Matter statuses whose not-started steps are still real future work. */
export const OPEN_MATTER_STATUSES = ['pending', 'active', 'on_hold', 'pending_admin_approval'];
/** Matter statuses whose steps no longer count at all. */
export const DEAD_MATTER_STATUSES = ['cancelled', 'archived', 'rejected'];

export const MAX_RANGE_DAYS = 366;

/** ISO string / Date / Firestore Timestamp → epoch ms, or null for anything unusable. */
export function toMs(v) {
  if (v == null || v === '') return null;
  let t = NaN;
  if (typeof v === 'string') t = Date.parse(v);
  else if (typeof v === 'number') t = v;
  else if (v instanceof Date) t = v.getTime();
  else if (typeof v.toDate === 'function') t = v.toDate().getTime();
  return Number.isFinite(t) ? t : null;
}

const round1 = (n) => Math.round(n * 10) / 10;
/** Whole-number percentage, or null when there is nothing to divide by. */
export const pct = (num, den) => (den > 0 ? Math.round((num / den) * 100) : null);

/** Everyone a step is assigned to (#192 list, falling back to the single field). */
export function stepAssignees(step) {
  if (Array.isArray(step?.assignedToUids) && step.assignedToUids.length) return [...new Set(step.assignedToUids.filter(Boolean))];
  return step?.assignedTo ? [step.assignedTo] : [];
}

export const stepKey = (taskId, stepNumber) => `${taskId}#${stepNumber}`;

/** Steps assigned to `uid`. */
export const stepsFor = (uid, steps) => steps.filter((s) => (s.assignees ?? []).includes(uid));

/**
 * A completion that represents WORK. A payment gate auto-passed by a forward
 * jump is written `completed` with a `completedAt` but was never started and
 * nobody completed it — counting it would credit people for the client paying.
 */
export function isWorkCompletion(s) {
  return s?.status === 'completed' && toMs(s.completedAt) != null && (toMs(s.startedAt) != null || !!s.completedBy);
}

/**
 * Was the step completed on time? The stored `onTime` flag wins (it was decided
 * at the moment of completion against the due date then in force); without it,
 * compare the dates; with no due date there is no answer (null).
 */
export function onTimeOf(s) {
  if (typeof s?.onTime === 'boolean') return s.onTime;
  const due = toMs(s?.dueAt);
  const done = toMs(s?.completedAt);
  if (due == null || done == null) return null;
  return done <= due;
}

/** Days late (one decimal) for a completed step with a due date; 0 when on time. */
export function delayDays(s) {
  const due = toMs(s?.dueAt);
  const done = toMs(s?.completedAt);
  if (due == null || done == null || done <= due) return 0;
  return round1((done - due) / DAY_MS);
}

/**
 * Validate a requested range and derive the comparison period (the same length,
 * immediately before). Returns `{ error }` for a caller-facing 400 message.
 */
export function resolveRange({ from, to }) {
  const f = toMs(from);
  const t = toMs(to);
  if (f == null || t == null) return { error: 'Choose a valid start and end date.' };
  if (t < f) return { error: 'The end date is before the start date.' };
  if ((t - f) / DAY_MS > MAX_RANGE_DAYS) return { error: `Choose a period of at most ${MAX_RANGE_DAYS} days.` };
  const len = t - f + 1;
  return { from: f, to: t, prevFrom: f - len, prevTo: f - 1 };
}

/**
 * Where a step stands relative to the range [from, to]. One place decides, so
 * the summary, the completion figures and the overview can never disagree.
 */
export function classifyStep(s, { from, to, now }) {
  const started = toMs(s.startedAt);
  const done = toMs(s.completedAt);
  const completed = isWorkCompletion(s);
  const completedInRange = completed && done >= from && done <= to;
  const startedInRange = started != null && started >= from && started <= to;
  // Open at the end of the range: started by then, and not finished by then.
  // A step completed AFTER the range was still open at its end.
  const openAtEnd = (s.status === 'active' && (started == null || started <= to))
    || (completed && done > to && started != null && started <= to);
  const carriedForward = openAtEnd && started != null && started < from;
  const notStarted = s.status === 'pending' && OPEN_MATTER_STATUSES.includes(s.matterStatus ?? 'active');
  const due = toMs(s.dueAt);
  const overdueNow = s.status === 'active' && due != null && due < now;
  return { completedInRange, startedInRange, openAtEnd, carriedForward, notStarted, overdueNow };
}

/**
 * 1 + 3 — the daily work summary and the completion figures.
 * `notStartedKnown` is false when the caller did not load pending steps (the
 * all-team view), so "not started" is reported as unknown rather than zero.
 */
export function workSummary(steps, range, { notStartedKnown = true } = {}) {
  let completed = 0; let inProgress = 0; let notStarted = 0; let started = 0;
  let carriedForward = 0; let overdue = 0;
  for (const s of steps) {
    const c = classifyStep(s, range);
    if (c.completedInRange) completed += 1;
    if (c.openAtEnd) inProgress += 1;
    if (c.notStarted) notStarted += 1;
    if (c.startedInRange) started += 1;
    if (c.carriedForward) carriedForward += 1;
    if (c.overdueNow) overdue += 1;
  }
  const ns = notStartedKnown ? notStarted : null;
  const assigned = completed + inProgress + (ns ?? 0);
  return {
    assigned,
    completed,
    inProgress,
    notStarted: ns,
    pending: inProgress + (ns ?? 0),
    startedInRange: started,
    completedInRange: completed,
    carriedForward,
    overdue,
    completionPct: pct(completed, assigned),
  };
}

const plain = (html, max = 300) => {
  const t = richTextToPlain(html ?? '');
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

const ref = (s) => ({
  taskId: s.taskId, stepNumber: s.stepNumber, title: s.title ?? `Step ${s.stepNumber}`,
  clientName: s.clientName ?? '', serviceName: s.serviceName ?? '',
});

/**
 * 2 — time on tasks. ELAPSED time from a step starting to it being completed —
 * not hours worked (the portal has no time tracking). A step redone after a
 * correction restarts its clock, so this is the last round only.
 */
export function timeOnTasks(steps, range) {
  const items = [];
  for (const s of steps) {
    if (!classifyStep(s, range).completedInRange) continue;
    const started = toMs(s.startedAt);
    if (started == null) continue;
    const elapsedMs = Math.max(0, toMs(s.completedAt) - started);
    items.push({ ...ref(s), startedAt: s.startedAt, completedAt: s.completedAt, elapsedMs });
  }
  items.sort((a, b) => toMs(b.completedAt) - toMs(a.completedAt));
  const total = items.reduce((n, i) => n + i.elapsedMs, 0);
  return {
    count: items.length,
    totalElapsedMs: total,
    avgElapsedMs: items.length ? Math.round(total / items.length) : null,
    items,
  };
}

/** 5 — completed before/after the due date, currently overdue, average delay. */
export function deadlineAnalysis(steps, range) {
  let onTime = 0; let late = 0; let noDue = 0; let delaySum = 0;
  const lateItems = [];
  const overdueItems = [];
  for (const s of steps) {
    const c = classifyStep(s, range);
    if (c.completedInRange) {
      const ot = onTimeOf(s);
      if (ot === true) onTime += 1;
      else if (ot === false) {
        late += 1;
        const d = delayDays(s);
        delaySum += d;
        lateItems.push({
          ...ref(s), dueAt: s.dueAt ?? null, completedAt: s.completedAt, delayDays: d,
          // No delay-reason field exists: this is the comment recorded when the
          // late step was completed, and the UI says so.
          completionComment: plain(s.remark) || null,
        });
      } else noDue += 1;
    }
    if (c.overdueNow) {
      overdueItems.push({
        ...ref(s), dueAt: s.dueAt, startedAt: s.startedAt ?? null,
        daysOverdue: round1((range.now - toMs(s.dueAt)) / DAY_MS),
      });
    }
  }
  lateItems.sort((a, b) => b.delayDays - a.delayDays);
  overdueItems.sort((a, b) => b.daysOverdue - a.daysOverdue);
  return {
    completedOnTime: onTime,
    completedLate: late,
    completedWithoutDueDate: noDue,
    onTimePct: pct(onTime, onTime + late),
    overdueNow: overdueItems.length,
    // Average over LATE completions only — on-time ones would dilute it to noise.
    avgDelayDays: late ? round1(delaySum / late) : null,
    lateItems,
    overdueItems,
  };
}

/* ── 6 — trend ─────────────────────────────────────────────────────────────── */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Daily up to a month, weekly up to ~4 months, monthly beyond. */
export function pickGranularity(from, to, requested) {
  const days = (to - from) / DAY_MS;
  if (requested === 'month') return 'month';
  if (requested === 'week') return 'week';
  // Daily over more than a quarter is a wall of bars — cap it at weekly.
  if (requested === 'day') return days > 92 ? 'week' : 'day';
  if (days <= 31) return 'day';
  if (days <= 120) return 'week';
  return 'month';
}

/**
 * The local-time bucket an instant falls in. `tzOffsetMin` is minutes EAST of
 * UTC (IST = 330) — a day starts at local midnight, not UTC midnight, or every
 * completion between 00:00 and 05:30 IST lands on the previous day.
 * Weeks start on Monday.
 */
export function bucketStart(ms, granularity, tzOffsetMin = 0) {
  const off = tzOffsetMin * 60_000;
  const local = ms + off;
  const day = Math.floor(local / DAY_MS);
  if (granularity === 'day') return day * DAY_MS - off;
  if (granularity === 'week') {
    const monday = day - ((day + 3) % 7); // 1970-01-01 was a Thursday
    return monday * DAY_MS - off;
  }
  const d = new Date(local);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) - off;
}

function nextBucket(start, granularity, tzOffsetMin) {
  if (granularity === 'day') return start + DAY_MS;
  if (granularity === 'week') return start + 7 * DAY_MS;
  const off = tzOffsetMin * 60_000;
  const d = new Date(start + off);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) - off;
}

function bucketLabel(start, granularity, tzOffsetMin) {
  const d = new Date(start + tzOffsetMin * 60_000);
  const dd = d.getUTCDate();
  const mon = MONTHS[d.getUTCMonth()];
  if (granularity === 'day') return `${dd} ${mon}`;
  if (granularity === 'week') return `Week of ${dd} ${mon}`;
  return `${mon} ${d.getUTCFullYear()}`;
}

function periodTotals(steps, from, to) {
  let completed = 0; let onTime = 0; let withDue = 0;
  for (const s of steps) {
    if (!isWorkCompletion(s)) continue;
    const done = toMs(s.completedAt);
    if (done < from || done > to) continue;
    completed += 1;
    const ot = onTimeOf(s);
    if (ot != null) { withDue += 1; if (ot) onTime += 1; }
  }
  return { completed, onTime, withDue, onTimePct: pct(onTime, withDue) };
}

/** Completions and on-time % per bucket, plus this period vs the one before. */
export function productivityTrend(steps, range, { granularity, tzOffsetMin = 0 } = {}) {
  const g = pickGranularity(range.from, range.to, granularity);
  const buckets = [];
  const index = new Map();
  for (let b = bucketStart(range.from, g, tzOffsetMin); b <= range.to && buckets.length < 400; b = nextBucket(b, g, tzOffsetMin)) {
    const row = { start: new Date(b).toISOString(), label: bucketLabel(b, g, tzOffsetMin), completed: 0, onTime: 0, withDue: 0, onTimePct: null };
    index.set(b, row);
    buckets.push(row);
  }
  for (const s of steps) {
    if (!isWorkCompletion(s)) continue;
    const done = toMs(s.completedAt);
    if (done < range.from || done > range.to) continue;
    const row = index.get(bucketStart(done, g, tzOffsetMin));
    if (!row) continue;
    row.completed += 1;
    const ot = onTimeOf(s);
    if (ot != null) { row.withDue += 1; if (ot) row.onTime += 1; }
  }
  for (const r of buckets) r.onTimePct = pct(r.onTime, r.withDue);
  const current = periodTotals(steps, range.from, range.to);
  const previous = range.prevFrom != null ? periodTotals(steps, range.prevFrom, range.prevTo) : null;
  return {
    granularity: g,
    buckets,
    current,
    previous,
    completedChange: previous ? current.completed - previous.completed : null,
    onTimePctChange: previous && current.onTimePct != null && previous.onTimePct != null
      ? current.onTimePct - previous.onTimePct : null,
  };
}

/* ── 7 — quality & approval ────────────────────────────────────────────────── */

/**
 * Which step a "sent back" event sends back. A correction (REWORK), a client's
 * request for changes and an admin reopening a step all name the step that must
 * be REDONE as `toStep` — including a request for changes that stays on the same
 * step (#214, toStep === fromStep). A government rejection is different: it moves
 * FORWARD to the resubmission steps, so the rejected work is the step it left.
 */
export function returnedStepOf(ev) {
  if (!ev || !RETURN_TYPES.includes(ev.type)) return null;
  const n = ev.type === 'GOVT_REJECT' ? ev.fromStep : ev.toStep;
  if (n == null || n === '') return null;
  return Number.isFinite(Number(n)) ? Number(n) : null;
}

/** taskId#step → [{ at, type, comment }] of every recorded return, oldest first. */
export function indexReturns(events) {
  const map = new Map();
  for (const ev of events ?? []) {
    const n = returnedStepOf(ev);
    if (n == null || !ev.taskId) continue;
    const k = stepKey(ev.taskId, n);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push({ at: ev.at ?? null, type: ev.type, comment: ev.comment ?? null });
  }
  for (const list of map.values()) list.sort((a, b) => (toMs(a.at) ?? 0) - (toMs(b.at) ?? 0));
  return map;
}

/**
 * First-time-right and returns.
 *  - First-time right: a step completed in the period with NO return ever
 *    recorded against it.
 *  - Returned: a step of theirs that was sent back DURING the period (with how
 *    many times), whether or not it has been completed since.
 */
export function qualityAnalysis(steps, events, range) {
  const returns = indexReturns(events);
  let completed = 0; let ftr = 0; let returnCount = 0;
  const returnedItems = [];
  for (const s of steps) {
    const c = classifyStep(s, range);
    const list = returns.get(stepKey(s.taskId, s.stepNumber)) ?? [];
    if (c.completedInRange) {
      completed += 1;
      if (list.length === 0) ftr += 1;
    }
    const inRange = list.filter((r) => { const t = toMs(r.at); return t != null && t >= range.from && t <= range.to; });
    if (inRange.length) {
      returnCount += inRange.length;
      const last = inRange[inRange.length - 1];
      returnedItems.push({
        ...ref(s), status: s.status, returns: inRange.length, totalReturns: list.length,
        lastReturnAt: last.at, lastReturnType: last.type, lastComment: plain(last.comment) || null,
      });
    }
  }
  returnedItems.sort((a, b) => (toMs(b.lastReturnAt) ?? 0) - (toMs(a.lastReturnAt) ?? 0));
  return {
    completed,
    firstTimeRight: ftr,
    firstTimeRightPct: pct(ftr, completed),
    returnedSteps: returnedItems.length,
    returnCount,
    returnedItems,
  };
}

/**
 * Work waiting on someone else's approval.
 *  - Submitted for approval: an approval step (admin approval, or a client
 *    approval) is the matter's active step, and it was started by completing a
 *    step of THIS person's — the transition writes the departing step's
 *    `completedAt` and the arriving step's `startedAt` from one clock reading,
 *    so they are equal. Each approval step carries `submitted`: the step rows of
 *    its matter completed at that instant (the controller looks them up).
 *  - Matters awaiting approval to open: created by, or owned by, this person.
 *
 * `uid` null = the whole team: any submission by an assigned person counts.
 */
export function awaitingApproval(approvalSteps, pendingMatters, uid = null) {
  const items = [];
  for (const a of approvalSteps ?? []) {
    const started = toMs(a.startedAt);
    if (started == null) continue;
    const submitted = (a.submitted ?? []).find((s) => isWorkCompletion(s)
      && s.stepNumber !== a.stepNumber
      && Math.abs(toMs(s.completedAt) - started) <= 1000
      && (uid ? (s.assignees ?? []).includes(uid) : (s.assignees ?? []).length > 0));
    if (!submitted) continue;
    items.push({
      kind: 'step', waitingOn: a.kind, taskId: a.taskId, stepNumber: submitted.stepNumber,
      title: submitted.title ?? `Step ${submitted.stepNumber}`, approvalTitle: a.title ?? `Step ${a.stepNumber}`,
      clientName: a.clientName ?? submitted.clientName ?? '', serviceName: a.serviceName ?? submitted.serviceName ?? '',
      since: a.startedAt,
    });
  }
  for (const m of pendingMatters ?? []) {
    if (uid && m.createdBy !== uid && m.assignedTo !== uid) continue;
    items.push({
      kind: 'matter', waitingOn: 'admin', taskId: m.taskId, stepNumber: null, title: 'Matter awaiting approval to start',
      approvalTitle: 'Admin approval', clientName: m.clientName ?? '', serviceName: m.serviceName ?? '', since: m.createdAt ?? null,
    });
  }
  items.sort((a, b) => (toMs(a.since) ?? 0) - (toMs(b.since) ?? 0));
  return { count: items.length, items };
}

/**
 * Is a workflow step an APPROVAL someone else gives? An admin-approval step
 * (#90, `assignedRole: 'admin'`) or a client approval (it takes CLIENT_APPROVE).
 * Returns 'admin' | 'client' | null.
 */
export function approvalKindOf(stepDef) {
  if (!stepDef) return null;
  if (stepDef.assignedRole === 'admin') return 'admin';
  if ((stepDef.transitions ?? []).some((t) => t?.event === 'CLIENT_APPROVE')) return 'client';
  return null;
}

/* ── 4 — per-task history ──────────────────────────────────────────────────── */

/**
 * When the step was assigned to its CURRENT assignee: the latest reassignment
 * recorded on it, or — with none — when the matter was opened (steps are
 * pre-assigned at creation). A matter reassignment only moves the active step,
 * and only when it went to someone this step now belongs to.
 */
export function assignedAtOf(s, events) {
  let best = null;
  for (const ev of events ?? []) {
    if (ev.taskId !== s.taskId || !ASSIGN_TYPES.includes(ev.type) || Number(ev.toStep) !== Number(s.stepNumber)) continue;
    if (ev.type === 'MATTER_REASSIGNED' && !(s.assignees ?? []).includes(ev.newAssignee)) continue;
    if (best == null || (toMs(ev.at) ?? 0) > (toMs(best) ?? 0)) best = ev.at;
  }
  return best ? { at: best, source: 'reassigned' } : { at: s.matterCreatedAt ?? null, source: 'matter-opened' };
}

/** One row per step with activity in the period, newest first. */
export function taskHistory(steps, events, range, { limit = 300 } = {}) {
  const rows = [];
  for (const s of steps) {
    const c = classifyStep(s, range);
    if (!c.completedInRange && !c.openAtEnd && !c.startedInRange) continue;
    const assigned = assignedAtOf(s, events);
    rows.push({
      ...ref(s),
      status: c.completedInRange ? 'completed' : (s.status === 'pending' ? 'waiting' : 'in_progress'),
      matterCreatedAt: s.matterCreatedAt ?? null,
      assignedAt: assigned.at,
      assignedVia: assigned.source,
      startedAt: s.startedAt ?? null,
      completedAt: c.completedInRange ? s.completedAt : null,
      dueAt: s.dueAt ?? null,
      lastComment: plain(s.remark) || null,
    });
  }
  const latest = (r) => Math.max(toMs(r.completedAt) ?? 0, toMs(r.startedAt) ?? 0);
  rows.sort((a, b) => latest(b) - latest(a));
  return { total: rows.length, rows: rows.slice(0, limit) };
}

/* ── Overview across employees ─────────────────────────────────────────────── */

/** Every section for one set of steps. */
export function performanceStats(steps, events, range, opts = {}) {
  const { approvalSteps = [], pendingMatters = [], uid = null, notStartedKnown = true, granularity, tzOffsetMin = 0, itemLimit = 200 } = opts;
  const cap = (list) => list.slice(0, itemLimit);
  const summary = workSummary(steps, range, { notStartedKnown });
  const time = timeOnTasks(steps, range);
  const deadlines = deadlineAnalysis(steps, range);
  const quality = qualityAnalysis(steps, events, range);
  const approval = awaitingApproval(approvalSteps, pendingMatters, uid);
  return {
    summary: { ...summary, awaitingApproval: approval.count },
    time: { ...time, items: cap(time.items) },
    deadlines: { ...deadlines, lateItems: cap(deadlines.lateItems), overdueItems: cap(deadlines.overdueItems) },
    trend: productivityTrend(steps, range, { granularity, tzOffsetMin }),
    quality: { ...quality, returnedItems: cap(quality.returnedItems), awaitingApproval: approval.count, awaitingItems: cap(approval.items) },
    history: taskHistory(steps, events, range, { limit: itemLimit }),
  };
}

/** The overview table: one row per staff member, busiest first. */
export function overviewRows(staff, steps, events, range, opts = {}) {
  const returns = indexReturns(events);
  return staff.map((p) => {
    const mine = stepsFor(p.uid, steps);
    const sum = workSummary(mine, range, { notStartedKnown: opts.notStartedKnown ?? false });
    const dl = deadlineAnalysis(mine, range);
    let ftr = 0; let returned = 0;
    for (const s of mine) {
      const list = returns.get(stepKey(s.taskId, s.stepNumber)) ?? [];
      const c = classifyStep(s, range);
      if (c.completedInRange && list.length === 0) ftr += 1;
      if (list.some((r) => { const t = toMs(r.at); return t != null && t >= range.from && t <= range.to; })) returned += 1;
    }
    return {
      uid: p.uid,
      name: p.name,
      role: p.role ?? null,
      assigned: sum.assigned,
      completed: sum.completed,
      inProgress: sum.inProgress,
      overdue: sum.overdue,
      completedLate: dl.completedLate,
      onTimePct: dl.onTimePct,
      avgDelayDays: dl.avgDelayDays,
      returned,
      firstTimeRightPct: pct(ftr, sum.completed),
    };
  }).sort((a, b) => (b.assigned - a.assigned) || a.name.localeCompare(b.name));
}

/* ── Activity feed labels ──────────────────────────────────────────────────── */

const EVENT_LABELS = {
  COMPLETE_STEP: 'Completed a task',
  REWORK: 'Sent back for correction',
  CLIENT_APPROVE: 'Client approved',
  CLIENT_REJECT: 'Changes requested',
  GOVT_APPROVE: 'Government approved',
  GOVT_REJECT: 'Government rejected',
  BRANCH_DECISION: 'Decision recorded',
  STEP_REOPENED: 'Task reopened',
  STEP_REASSIGNED: 'Task reassigned',
  MATTER_REASSIGNED: 'Matter reassigned',
  STEP_NOTE: 'Note to client',
  RECORD_PAYMENT: 'Payment recorded',
  PAYMENT_RECORDED: 'Payment recorded',
  PAYMENT_UPDATED: 'Payment updated',
  PAYMENT_DELETED: 'Payment deleted',
  REFUND_RECORDED: 'Refund recorded',
  REFUND_UPDATED: 'Refund updated',
  ADMIN_OVERRIDE_PAYMENT: 'Payment requirement overridden',
  TASK_APPROVED: 'Matter approved',
  TASK_REJECTED: 'Matter rejected',
  TASK_STOPPED: 'Matter stopped',
  TASK_RESTARTED: 'Matter restarted',
  TASK_ARCHIVED: 'Matter archived',
};

/** Human label for an activity event type; unknown types are de-shouted, never hidden. */
export function eventLabel(type) {
  if (!type) return 'Activity';
  if (EVENT_LABELS[type]) return EVENT_LABELS[type];
  const t = String(type).toLowerCase().replace(/_/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Plain-text, length-capped comment for the activity feed. */
export const commentText = (html) => plain(html, 500) || null;
