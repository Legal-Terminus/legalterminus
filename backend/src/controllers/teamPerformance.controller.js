/**
 * LT #216 — Employee Performance report (route: /api/reports/team-performance).
 *
 * This file only LOADS rows; every number is computed by the pure functions in
 * `services/teamPerformance.service.js`.
 *
 * Reads are bounded by the period and by live workload — never a whole
 * collection (the report it replaces read every user and every matter):
 *
 *  One person (`uid`):
 *    steps  (collection group) assignedToUids ∋ uid, completedAt ≥ comparison start
 *    steps  (collection group) assignedTo == uid,    completedAt ≥ comparison start
 *    steps  (collection group) assignedToUids ∋ uid, status in [active, pending]
 *    steps  (collection group) assignedTo == uid,    status in [active, pending]
 *  Whole team:
 *    steps  (collection group) completedAt ≥ comparison start
 *    steps  (collection group) status == active
 *  Both:
 *    users  role in staff roles                    (the picker, names)
 *    tasks  status == active                       (approval steps now waiting)
 *    tasks  status == pending_admin_approval
 *    the matter documents of the steps found       (db.getAll, targeted)
 *    per matter in scope: events where type in [returns, reassignments]
 *
 * `assignedTo` is queried beside `assignedToUids` because steps written before
 * #192 carry only the single field. Composite indexes: firestore.indexes.json.
 */
import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { STAFF_ROLES } from '../config/roles.js';
import { getCompiledById } from '../services/workflowDefinitions.service.js';
import {
  ASSIGN_TYPES, DAY_MS, DEAD_MATTER_STATUSES, RETURN_TYPES,
  approvalKindOf, bucketStart, commentText, eventLabel, overviewRows,
  performanceStats, resolveRange, stepAssignees, stepKey, stepsFor,
} from '../services/teamPerformance.service.js';

const STEP_QUERY_LIMIT = 3000;
const MATTER_QUERY_LIMIT = 2000;
const EVENT_LOOKUP_LIMIT = 1000;
const FAILED_PRECONDITION = 9;

const isTaskStep = (doc) => doc.ref.parent.parent?.parent?.id === 'tasks';

function stepRow(doc) {
  const d = doc.data();
  const n = d.stepNumber ?? Number(doc.id);
  return {
    taskId: doc.ref.parent.parent.id,
    stepNumber: Number.isFinite(Number(n)) ? Number(n) : null,
    title: d.title ?? null,
    status: d.status ?? null,
    assignees: stepAssignees(d),
    startedAt: d.startedAt ?? null,
    completedAt: d.completedAt ?? null,
    completedBy: d.completedBy ?? null,
    dueAt: d.dueAt ?? null,
    onTime: typeof d.onTime === 'boolean' ? d.onTime : null,
    remark: d.remark ?? null,
  };
}

/** Run `fn` over `items`, at most `n` at a time. */
async function mapLimit(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  const worker = async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k]); }
  };
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker));
  return out;
}

async function getAllDocs(refs) {
  const out = [];
  for (let i = 0; i < refs.length; i += 100) {
    const chunk = refs.slice(i, i + 100);
    if (chunk.length) out.push(...(await db.getAll(...chunk)));
  }
  return out;
}

const displayName = (d) => d?.name || d?.fullName || d?.displayName || d?.email || 'Unnamed';

async function loadStaff() {
  const snap = await db.collection('users').where('role', 'in', STAFF_ROLES).get();
  return snap.docs
    .map((d) => ({ uid: d.id, name: displayName(d.data()), role: d.data().role }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function matterOf(doc) {
  const d = doc.data();
  return {
    id: doc.id,
    status: d.status ?? null,
    clientName: d.clientName ?? '',
    serviceName: d.serviceName ?? d.workflowType ?? '',
    createdAt: d.createdAt ?? null,
    createdBy: d.createdBy ?? null,
    assignedTo: d.assignedTo ?? null,
    workflowDefinitionId: d.workflowDefinitionId ?? null,
    currentStepNumber: d.currentStepNumber ?? null,
  };
}

async function loadMatters(ids, into) {
  const missing = ids.filter((id) => !into.has(id));
  const docs = await getAllDocs(missing.map((id) => db.collection('tasks').doc(id)));
  for (const d of docs) if (d.exists) into.set(d.id, matterOf(d));
  return into;
}

/** definitionId → Map(stepNumber → step definition), one compile per definition. */
async function loadDefinitions(matters) {
  const ids = [...new Set([...matters.values()].map((m) => m.workflowDefinitionId).filter(Boolean))];
  const out = new Map();
  await Promise.all(ids.map(async (id) => {
    try {
      const compiled = await getCompiledById(id);
      const steps = compiled?.definition?.steps ?? [];
      out.set(id, new Map(steps.map((s) => [s.stepNumber, s])));
    } catch (err) {
      logger.warn({ err, definitionId: id }, 'team performance: definition unavailable');
    }
  }));
  return out;
}

/**
 * Approval steps waiting right now, each with the step(s) whose completion
 * started it (see `awaitingApproval`). Bounded by the number of open matters.
 */
async function loadApprovalSteps(matters, defs) {
  const candidates = [];
  for (const m of matters.values()) {
    if (m.status !== 'active' || m.currentStepNumber == null) continue;
    const kind = approvalKindOf(defs.get(m.workflowDefinitionId)?.get(m.currentStepNumber));
    if (kind) candidates.push({ m, kind });
  }
  const stepDocs = await getAllDocs(candidates.map(({ m }) =>
    db.collection('tasks').doc(m.id).collection('steps').doc(String(m.currentStepNumber))));
  const out = await mapLimit(candidates.map((c, i) => ({ ...c, doc: stepDocs[i] })), 20, async ({ m, kind, doc }) => {
    const d = doc?.exists ? doc.data() : null;
    if (!d || d.status !== 'active' || !d.startedAt) return null;
    // The step(s) completed at the instant this one started submitted it.
    const sub = await db.collection('tasks').doc(m.id).collection('steps')
      .where('completedAt', '==', d.startedAt).limit(5).get();
    return {
      taskId: m.id,
      stepNumber: m.currentStepNumber,
      title: d.title ?? `Step ${m.currentStepNumber}`,
      kind,
      startedAt: d.startedAt,
      clientName: m.clientName,
      serviceName: m.serviceName,
      submitted: sub.docs.map((x) => ({ ...stepRow(x), clientName: m.clientName, serviceName: m.serviceName })),
    };
  });
  return out.filter(Boolean);
}

/** Return + reassignment events of the matters in scope, tagged with their taskId. */
async function loadEvents(taskIds) {
  const ids = taskIds.slice(0, EVENT_LOOKUP_LIMIT);
  const lists = await mapLimit(ids, 25, async (id) => {
    const snap = await db.collection('tasks').doc(id).collection('events')
      .where('type', 'in', [...RETURN_TYPES, ...ASSIGN_TYPES]).get();
    return snap.docs.map((d) => ({ taskId: id, ...d.data() }));
  });
  return { events: lists.flat(), truncated: taskIds.length > ids.length };
}

function indexError(res, err) {
  if (err?.code === FAILED_PRECONDITION) {
    logger.error({ err }, 'team performance: Firestore index missing or still building');
    res.status(503).json({ message: 'This report is still being set up. Please try again in a few minutes.' });
    return true;
  }
  return false;
}

// ─── GET /api/reports/team-performance ─────────────────────────────────────
// Query (validated by teamPerformanceQuerySchema): from, to (ISO instants),
// uid (one person; absent = whole team), tz (minutes east of UTC), granularity.
export async function getTeamPerformanceReport(req, res) {
  try {
    const { uid, tz, granularity } = req.query;
    const now = Date.now();
    let { from, to } = req.query;
    if (!from || !to) {
      const start = bucketStart(now, 'day', tz);
      from = from ?? new Date(start).toISOString();
      to = to ?? new Date(start + DAY_MS - 1).toISOString();
    }
    const range = resolveRange({ from, to });
    if (range.error) return res.status(400).json({ message: range.error });
    range.now = now;

    const staff = await loadStaff();
    const staffByUid = new Map(staff.map((p) => [p.uid, p]));
    if (uid && !staffByUid.has(uid)) return res.status(404).json({ message: 'That team member was not found.' });

    // ISO strings sort chronologically, so a string bound is a time bound.
    const since = new Date(range.prevFrom).toISOString();
    const steps = db.collectionGroup('steps');
    const queries = uid
      ? [
        steps.where('assignedToUids', 'array-contains', uid).where('completedAt', '>=', since),
        steps.where('assignedTo', '==', uid).where('completedAt', '>=', since),
        steps.where('assignedToUids', 'array-contains', uid).where('status', 'in', ['active', 'pending']),
        steps.where('assignedTo', '==', uid).where('status', 'in', ['active', 'pending']),
      ]
      : [
        steps.where('completedAt', '>=', since),
        steps.where('status', '==', 'active'),
      ];
    const [stepSnaps, activeMatterSnap, pendingMatterSnap] = await Promise.all([
      Promise.all(queries.map((q) => q.limit(STEP_QUERY_LIMIT).get())),
      db.collection('tasks').where('status', '==', 'active').limit(MATTER_QUERY_LIMIT).get(),
      db.collection('tasks').where('status', '==', 'pending_admin_approval').limit(500).get(),
    ]);
    let truncated = stepSnaps.some((s) => s.size >= STEP_QUERY_LIMIT) || activeMatterSnap.size >= MATTER_QUERY_LIMIT;

    // Union of the queries, one row per step record.
    const byKey = new Map();
    for (const snap of stepSnaps) {
      for (const doc of snap.docs) {
        if (!isTaskStep(doc)) continue;
        const r = stepRow(doc);
        if (r.stepNumber == null) continue;
        byKey.set(stepKey(r.taskId, r.stepNumber), r);
      }
    }
    const raw = [...byKey.values()];

    const matters = new Map();
    activeMatterSnap.docs.forEach((d) => matters.set(d.id, matterOf(d)));
    await loadMatters([...new Set(raw.map((r) => r.taskId))], matters);
    const defs = await loadDefinitions(matters);

    const rows = [];
    for (const r of raw) {
      const m = matters.get(r.taskId);
      // A deleted, stopped, archived or rejected matter is no longer anyone's work.
      if (!m || DEAD_MATTER_STATUSES.includes(m.status)) continue;
      if (r.status === 'cancelled' || r.status === 'skipped') continue;
      const def = defs.get(m.workflowDefinitionId);
      // #215: a never-started record of a step since deleted from the service
      // is not work anyone owes.
      if (r.status === 'pending' && !r.startedAt && def && !def.has(r.stepNumber)) continue;
      // Only staff work: client-assigned steps belong to the client.
      if (!r.assignees.some((u) => staffByUid.has(u))) continue;
      rows.push({
        ...r,
        title: r.title ?? def?.get(r.stepNumber)?.title ?? `Step ${r.stepNumber}`,
        clientName: m.clientName,
        serviceName: m.serviceName,
        matterStatus: m.status,
        matterCreatedAt: m.createdAt,
      });
    }
    const scoped = uid ? stepsFor(uid, rows) : rows;

    // Events only for matters where the period has something to show: not for
    // matters whose only link is a future, not-started step.
    const eventMatterIds = [...new Set(scoped.filter((r) => r.status !== 'pending' || r.startedAt).map((r) => r.taskId))];
    const [{ events, truncated: eventsTruncated }, approvalSteps] = await Promise.all([
      loadEvents(eventMatterIds),
      loadApprovalSteps(matters, defs),
    ]);
    truncated = truncated || eventsTruncated;

    const pendingMatters = pendingMatterSnap.docs.map((d) => {
      const m = matterOf(d);
      return { taskId: m.id, createdBy: m.createdBy, assignedTo: m.assignedTo, clientName: m.clientName, serviceName: m.serviceName, createdAt: m.createdAt };
    });

    const stats = performanceStats(scoped, events, range, {
      approvalSteps, pendingMatters, uid: uid ?? null,
      // The whole-team view does not load every future step of every matter.
      notStartedKnown: !!uid,
      granularity: granularity === 'auto' ? undefined : granularity,
      tzOffsetMin: tz,
    });

    res.json({
      range: {
        from: new Date(range.from).toISOString(),
        to: new Date(range.to).toISOString(),
        previousFrom: new Date(range.prevFrom).toISOString(),
        previousTo: new Date(range.prevTo).toISOString(),
      },
      generatedAt: new Date(now).toISOString(),
      staff: staff.map(({ uid: u, name, role }) => ({ uid: u, name, role })),
      employee: uid ? { uid, name: staffByUid.get(uid).name, role: staffByUid.get(uid).role } : null,
      overview: uid ? [] : overviewRows(staff, rows, events, range, { notStartedKnown: false }),
      ...stats,
      truncated,
    });
  } catch (err) {
    if (indexError(res, err)) return;
    logger.error({ err }, 'getTeamPerformanceReport error');
    res.status(500).json({ message: 'Failed to load the performance report' });
  }
}

// ─── GET /api/reports/team-performance/activity ────────────────────────────
// The activity feed, newest first, one page at a time. With `uid`: what that
// person did. Without: everything recorded in the period.
export async function getTeamPerformanceActivity(req, res) {
  try {
    const { uid, from, to, cursor, limit } = req.query;
    const range = resolveRange({ from, to });
    if (range.error) return res.status(400).json({ message: range.error });

    let q = db.collectionGroup('events');
    if (uid) q = q.where('byUid', '==', uid);
    q = q.where('at', '>=', new Date(range.from).toISOString())
      .where('at', '<=', new Date(range.to).toISOString())
      .orderBy('at', 'desc');
    if (cursor) {
      const c = await db.doc(cursor).get();
      if (!c.exists) return res.status(400).json({ message: 'The activity list has changed. Please reload it.' });
      q = q.startAfter(c);
    }
    const snap = await q.limit(limit + 1).get();
    const page = snap.docs.slice(0, limit);
    const nextCursor = snap.size > limit ? page[page.length - 1].ref.path : null;
    const docs = page.filter((d) => d.ref.parent.parent?.parent?.id === 'tasks');

    // Enrich by targeted lookup: the page's matters, step titles and people.
    const matters = await loadMatters([...new Set(docs.map((d) => d.ref.parent.parent.id))], new Map());
    const stepRefs = new Map();
    for (const d of docs) {
      const taskId = d.ref.parent.parent.id;
      for (const n of [d.data().fromStep, d.data().toStep]) {
        if (n == null || !Number.isFinite(Number(n))) continue;
        const k = stepKey(taskId, Number(n));
        if (!stepRefs.has(k)) stepRefs.set(k, db.collection('tasks').doc(taskId).collection('steps').doc(String(n)));
      }
    }
    const keys = [...stepRefs.keys()];
    const stepDocs = await getAllDocs([...stepRefs.values()]);
    const titles = new Map(keys.map((k, i) => [k, stepDocs[i]?.exists ? (stepDocs[i].data().title ?? null) : null]));
    const staff = await loadStaff();
    const names = new Map(staff.map((p) => [p.uid, p.name]));

    const data = docs.map((d) => {
      const e = d.data();
      const taskId = d.ref.parent.parent.id;
      const m = matters.get(taskId);
      const title = (n) => (n == null ? null : (titles.get(stepKey(taskId, Number(n))) ?? `Step ${n}`));
      return {
        id: d.ref.path,
        taskId,
        type: e.type ?? null,
        label: eventLabel(e.type),
        at: e.at ?? null,
        byUid: e.byUid ?? null,
        byName: (e.byUid && names.get(e.byUid)) || (e.byRole === 'client' ? 'Client' : (e.byUid ? 'Former user' : 'System')),
        fromStep: e.fromStep ?? null,
        fromTitle: title(e.fromStep),
        toStep: e.toStep ?? null,
        toTitle: title(e.toStep),
        comment: commentText(e.comment),
        clientName: m?.clientName ?? '',
        serviceName: m?.serviceName ?? '',
      };
    });
    res.json({ data, nextCursor });
  } catch (err) {
    if (indexError(res, err)) return;
    logger.error({ err }, 'getTeamPerformanceActivity error');
    res.status(500).json({ message: 'Failed to load the activity history' });
  }
}
