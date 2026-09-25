import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { richTextToPlain } from '../services/richText.service.js';
import {
  buildRollups,
  fetchCurrentSteps,
  foldClientMatters,
  clientIdentity,
  matterMoney,
  attentionScore,
  isClientStep,
} from '../services/clientRollup.service.js';

/**
 * Epic 30 (Story 30.1) — the client-relationship read API.
 *
 * `/api/clients` is a MONITORING surface: it answers "which relationships need
 * me today?" and "what is going on with this client?". People-CRUD stays at
 * `/api/portal/users` — these two never duplicate each other.
 *
 * Both endpoints are admin/manager only (route guard) and read exclusively
 * through the shared `db`; access is gated by the route's role guard.
 */

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

/** Events shown on the 360's cross-matter activity feed. */
const ACTIVITY_LIMIT = 25;

function parseLimit(raw) {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_LIMIT;
  return Math.min(n, MAX_LIMIT);
}

/**
 * GET /api/clients — one page of client rollups, attention-first.
 *
 * Cost note (CM-NFR1): the client page is bounded by `limit`, and every matter
 * read is chunked against that page's uids. Nothing here scales with the size of
 * the tasks collection.
 */
export async function listClients(req, res) {
  try {
    const limit = parseLimit(req.query.limit);
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : null;

    // `where('role') + orderBy(...)` needs a composite index, and — worse for a
    // MONITORING page — `orderBy` silently DROPS documents that lack the field,
    // so a client with no `name` would vanish from the roster entirely. The same
    // trade-off is documented in portalUsers.controller.js: filter in Firestore,
    // order and page in memory. Fine at firm scale (a firm has tens-to-
    // hundreds of clients); revisit with an index if that stops being true.
    const snap = await db.collection('users').where('role', '==', 'client').get();

    let rollups = await buildRollups(db, snap.docs);

    // Attention first (CM-FR2), then alphabetically. Sorting here rather than in
    // Firestore is also what lets the DERIVED attention score drive the order.
    rollups.sort((a, b) => (b.attentionScore - a.attentionScore)
      || a.name.localeCompare(b.name));

    if (cursor) {
      const idx = rollups.findIndex((r) => r.uid === cursor);
      if (idx >= 0) rollups = rollups.slice(idx + 1);
    }
    const hasMore = rollups.length > limit;
    const page = rollups.slice(0, limit);

    return res.json({
      data: page,
      nextCursor: hasMore && page.length ? page[page.length - 1].uid : null,
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to list client rollups');
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * GET /api/clients/:uid — the Client 360 payload: the rollup plus everything the
 * detail page renders (matters with money, renewals, attention items, activity).
 */
export async function getClient(req, res) {
  const { uid } = req.params;
  try {
    const doc = await db.collection('users').doc(uid).get();
    // A non-client uid is "not found" here rather than 403: this endpoint is
    // about clients, and a staff uid simply isn't one. This role check is the
    // ONLY thing standing between this route and a staff record, so it must not
    // be relaxed — single-tenant has no second layer behind it.
    if (!doc.exists || doc.data().role !== 'client') {
      return res.status(404).json({ message: 'Client not found' });
    }

    // #188: the matters this client can actually SEE — the ones they own, plus
    // any they are an additional contact on. Anything less makes the 360 screen
    // disagree with what the client themselves is shown.
    const email = String(doc.data().email ?? '').trim().toLowerCase();
    const [owned, cc] = await Promise.all([
      db.collection('tasks').where('clientUid', '==', uid).get(),
      email
        ? db.collection('tasks').where('ccEmails', 'array-contains', email).get()
        : Promise.resolve({ docs: [] }),
    ]);
    const byId = new Map();
    for (const d of [...owned.docs, ...cc.docs]) byId.set(d.id, { id: d.id, ...d.data() });
    const tasks = [...byId.values()];
    const currentSteps = await fetchCurrentSteps(db, tasks);

    const now = Date.now();
    const folded = foldClientMatters(tasks, currentSteps, now);
    const docsPending = await countDocsPending(db, tasks);
    const rollup = { ...clientIdentity(doc), ...folded, docsPending };

    const matters = tasks
      .map((t) => ({
        id: t.id,
        serviceName: t.serviceName ?? t.workflowType ?? '',
        serviceKey: t.serviceKey ?? t.workflowType ?? null,
        organisation: t.organisation ?? '',
        status: t.status ?? '',
        paymentStatus: t.paymentStatus ?? 'not_paid',
        currentStepNumber: t.currentStepNumber ?? null,
        totalSteps: t.totalSteps ?? 0,
        assignedTo: t.assignedTo ?? null,
        professionalUid: t.professionalUid ?? null,
        updatedAt: t.updatedAt ?? null,
        createdAt: t.createdAt ?? null,
        recurrence: t.recurrence ?? null,
        recurrenceNextDueAt: t.recurrenceNextDueAt ?? null,
        money: matterMoney(t),
      }))
      .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));

    res.json({
      client: { ...rollup, attentionScore: attentionScore(rollup) },
      matters,
      renewals: matters
        .filter((m) => m.recurrenceNextDueAt)
        .sort((a, b) => a.recurrenceNextDueAt.localeCompare(b.recurrenceNextDueAt)),
      attention: buildAttentionItems(tasks, currentSteps, now),
      activity: await fetchRecentActivity(db, tasks),
    });
  } catch (error) {
    logger.error({ err: error, uid }, 'Failed to load client detail');
    res.status(500).json({ message: 'Internal server error' });
  }
}

/** Documents awaiting firm review across this one client's matters. */
async function countDocsPending(db, tasks) {
  const counts = await Promise.all(tasks.map(async (t) => {
    try {
      const agg = await db.collection('tasks').doc(t.id).collection('documents')
        .where('status', '==', 'pending_review').count().get();
      return agg.data().count ?? 0;
    } catch {
      return 0;
    }
  }));
  return counts.reduce((a, b) => a + b, 0);
}

/**
 * The actionable list (CM-FR6): one row per thing that needs a human, oldest
 * wait first. Each row names the matter so the UI can deep-link to it.
 */
export function buildAttentionItems(tasks, currentSteps, now = Date.now()) {
  const items = [];
  for (const t of tasks) {
    const step = currentSteps.get(t.id);
    if (!step) continue;
    const base = {
      taskId: t.id,
      serviceName: t.serviceName ?? t.workflowType ?? '',
      stepNumber: step.stepNumber ?? t.currentStepNumber ?? null,
      stepTitle: step.title ?? '',
      since: step.startedAt ?? t.updatedAt ?? null,
    };
    if (isClientStep(step)) {
      items.push({ ...base, kind: 'stuck_on_client' });
    }
    if (step.dueAt) {
      const due = new Date(step.dueAt).getTime();
      if (!Number.isNaN(due) && due < now) {
        items.push({ ...base, kind: 'overdue', dueAt: step.dueAt });
      }
    }
  }
  // Oldest wait first — the thing that has been sitting longest is the thing to
  // do first.
  return items.sort((a, b) => (a.since ?? '').localeCompare(b.since ?? ''));
}

/** Newest events across the client's matters, each tagged with its matter. */
async function fetchRecentActivity(db, tasks) {
  const perMatter = await Promise.all(tasks.slice(0, 40).map(async (t) => {
    try {
      const snap = await db.collection('tasks').doc(t.id).collection('events')
        .orderBy('at', 'desc').limit(ACTIVITY_LIMIT).get();
      return snap.docs.map((d) => {
        const e = d.data();
        return {
          id: d.id,
          taskId: t.id,
          serviceName: t.serviceName ?? t.workflowType ?? '',
          ...e,
          // Comments are stored as sanitised rich-text HTML (#122). This feed
          // renders ONE TRUNCATED LINE per event, so the markup was showing up
          // literally — "<p>Dear Ma'am,</p><p></p><p>As requested…". Block tags
          // cannot render inside a single-line row anyway, so the projection is
          // plain text rather than HTML: the preview reads as a sentence, and
          // the full formatting is one click away on the matter itself.
          ...(e.comment ? { comment: richTextToPlain(e.comment) } : {}),
        };
      });
    } catch {
      return [];
    }
  }));
  return perMatter.flat()
    .sort((a, b) => String(b.at ?? '').localeCompare(String(a.at ?? '')))
    .slice(0, ACTIVITY_LIMIT);
}
