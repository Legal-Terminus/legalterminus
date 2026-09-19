import { CLIENT_ASSIGNEE } from '../../../shared/workflows/definitionSchema.js';
import { deriveProfile } from './clientProfile.service.js';

/**
 * Story 30.1 — per-client relationship rollups (Epic 30, Client Management).
 *
 * A firm's business is client relationships, but the data model is matter-centric:
 * balances, stuck steps, renewals and activity all live per matter. This service
 * aggregates them per CLIENT so the roster and Client 360 can render without the
 * Portal reconstructing state from every matter.
 *
 * ── The cost decision (PRD CM-NFR1; the epic's one real engineering risk) ──
 *
 * **Option A — on-read, page-bounded. CHOSEN.**
 * A roster page holds ≤25 clients. We fetch that page of client users, then read
 * their matters with chunked `where('clientUid','in',chunk)` queries (chunks of
 * ≤30, the Firestore ceiling) — the same shape the leads report uses. Cost scales
 * with the PAGE's working set, never the whole collection.
 *
 * **Option B — precomputed rollup docs**, maintained on every matter/step/payment
 * write. Cheapest reads, but it puts an invariant on every mutation path in the
 * product: one missed update and the dashboard lies, silently, until someone
 * notices. It also needs a backfill. Rejected for now — revisit only if measured
 * cost at a real firm's volume misbehaves.
 *
 * ── Why the step reads are cheap ──
 *
 * The expensive-looking signals (stuck-on-client, overdue) are properties of a
 * matter's CURRENT step, and the task doc already denormalizes `currentStepNumber`.
 * So we read exactly ONE step doc per in-flight matter by id — no subcollection
 * scans, no collection-group query, and nothing at all for completed matters.
 */

/** Firestore's ceiling for `in` / `array-contains-any` values. */
const IN_CHUNK = 30;

/** A matter still in flight — the only kind that can be stuck, overdue or waiting. */
const LIVE_STATUSES = ['pending', 'active', 'on_hold'];

/** Days without any activity before a relationship counts as "gone quiet" (PRD §4). */
export const QUIET_AFTER_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

export function chunk(list, size = IN_CHUNK) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

/** Newest of a set of ISO strings, ignoring blanks/garbage. */
export function newestIso(values) {
  let best = null;
  for (const v of values) {
    if (!v) continue;
    const t = new Date(v).getTime();
    if (Number.isNaN(t)) continue;
    if (best === null || t > new Date(best).getTime()) best = v;
  }
  return best;
}

/** Oldest of a set of ISO strings — used for the soonest renewal. */
export function oldestIso(values) {
  let best = null;
  for (const v of values) {
    if (!v) continue;
    const t = new Date(v).getTime();
    if (Number.isNaN(t)) continue;
    if (best === null || t < new Date(best).getTime()) best = v;
  }
  return best;
}

/**
 * Is this step the CLIENT's to act on?
 *
 * Deliberately mirrors how the engine assigns client work rather than inventing a
 * second definition (the story called this out): the step carries the
 * `__CLIENT__` sentinel as its assignee. `clientActionable` is honoured too if a
 * step ever stamps it, so a future engine change has one place to land.
 */
export function isClientStep(step) {
  if (!step) return false;
  if (step.clientActionable === true) return true;
  return step.assignedTo === CLIENT_ASSIGNEE;
}

/**
 * Money for one matter. A matter with no price is NOT zero — it is unpriced, and
 * the difference matters on a page about what a relationship is worth, so the
 * caller can tell them apart via `priced`.
 */
export function matterMoney(task) {
  const priced = typeof task.totalCost === 'number' && Number.isFinite(task.totalCost);
  const total = num(task.totalCost);
  // `amountPaid`/`amountDue` are maintained by rollUpPayments() from the payments
  // LEDGER, which is the source of truth (tasks.controller.js). `amountReceived`
  // is only ever a creation-time input and is absent on most matters — reading it
  // reported every paid matter as owing its full cost.
  const received = num(task.amountPaid ?? task.amountReceived);
  const balance = typeof task.amountDue === 'number' && Number.isFinite(task.amountDue)
    ? Math.max(0, task.amountDue)
    : Math.max(0, total - received);
  return { priced, total, received, balance };
}

/**
 * Fold one client's matters (+ their current steps) into the rollup shape the
 * roster and the 360 KPI strip both render. Pure — no I/O — so the maths is
 * unit-testable without Firestore.
 *
 * @param {object[]} tasks      the client's matters (task docs, with `id`)
 * @param {Map<string, object>} currentSteps taskId → that matter's current step doc
 * @param {number} now          epoch ms (injected so tests are deterministic)
 */
export function foldClientMatters(tasks, currentSteps = new Map(), now = Date.now()) {
  let activeMatters = 0;
  let completedMatters = 0;
  let stuckOnClient = 0;
  let overdue = 0;
  let outstanding = 0;
  let lifetimeCollected = 0;
  let pipeline = 0;
  const ownerUids = new Set();
  const serviceKeys = new Set();
  const renewalDates = [];
  const activityDates = [];

  for (const t of tasks) {
    const live = LIVE_STATUSES.includes(t.status);
    if (live) activeMatters += 1;
    if (t.status === 'completed') completedMatters += 1;

    const money = matterMoney(t);
    lifetimeCollected += money.received;
    if (live) {
      outstanding += money.balance;
      pipeline += money.total;
    }

    if (t.assignedTo) ownerUids.add(t.assignedTo);
    if (t.professionalUid) ownerUids.add(t.professionalUid);
    const key = t.serviceKey ?? t.workflowType;
    if (key) serviceKeys.add(key);

    // A renewal only counts while the matter is live; a stopped recurring matter
    // is not a commitment.
    if (live && t.recurrenceNextDueAt) renewalDates.push(t.recurrenceNextDueAt);
    activityDates.push(t.updatedAt);

    if (!live) continue;
    const step = currentSteps.get(t.id);
    if (!step) continue;
    if (isClientStep(step)) stuckOnClient += 1;
    if (step.dueAt) {
      const due = new Date(step.dueAt).getTime();
      if (!Number.isNaN(due) && due < now) overdue += 1;
    }
  }

  const lastActivityAt = newestIso(activityDates);
  const quietDays = lastActivityAt
    ? Math.floor((now - new Date(lastActivityAt).getTime()) / DAY_MS)
    : null;

  return {
    activeMatters,
    completedMatters,
    totalMatters: tasks.length,
    stuckOnClient,
    overdue,
    outstanding,
    lifetimeCollected,
    pipeline,
    // `pricedPipeline` would double as "is any of this priced" — callers render
    // an em dash rather than ₹0 when a client has no priced matter at all.
    hasPricedMatter: tasks.some((t) => matterMoney(t).priced),
    ownerUids: [...ownerUids],
    serviceKeys: [...serviceKeys],
    nextRenewalAt: oldestIso(renewalDates),
    lastActivityAt,
    quietDays,
    isQuiet: quietDays != null && quietDays >= QUIET_AFTER_DAYS && activeMatters > 0,
  };
}

/**
 * How loudly does this client need attention? Drives the roster's default order
 * (PRD CM-FR2 — the owner opens the page and the top rows are today's problems).
 * Higher sorts first. Overdue outranks stuck-on-client because the firm is late,
 * not the client.
 */
export function attentionScore(r) {
  return (r.overdue * 100)
    + (r.stuckOnClient * 50)
    + (r.docsPending * 25)
    + (r.isQuiet ? 10 : 0)
    + (r.outstanding > 0 ? 5 : 0);
}

/** The identity fields the roster shows for a client user. */
export function clientIdentity(doc) {
  const d = doc.data();
  return {
    uid: doc.id,
    name: d.name ?? d.fullName ?? d.email ?? doc.id,
    email: d.email ?? '',
    phone: d.phone ?? '',
    organisation: d.organisation ?? '',
    businessName: d.businessName ?? '',
    groupCompany: d.groupCompany ?? '',
    professionalName: d.professionalName ?? '',
    createdAt: d.createdAt ?? null,
    // Profile completeness for filings (CM-FR12) — reported, never enforced here.
    missingProfileFields: ['panNumber', 'gstNumber', 'address', 'state']
      .filter((f) => !d[f]),
    // E01-S34-1: tags and the derived profile, from the SINGLE derivation every
    // consumer shares — so the roster, Client 360 and (later) 34.2's condition
    // evaluation can never disagree about whether a client has GST.
    ...deriveProfile(d),
  };
}

/**
 * Fetch every matter belonging to the given clients, chunked to stay inside the
 * `in` ceiling. Returns clientUid → task docs (with ids).
 */
export async function fetchMattersForClients(db, uids, emailByUid = new Map()) {
  const byClient = new Map(uids.map((u) => [u, []]));
  const seen = new Map(uids.map((u) => [u, new Set()]));

  for (const part of chunk(uids)) {
    const snap = await db.collection('tasks').where('clientUid', 'in', part).get();
    for (const doc of snap.docs) {
      const t = { id: doc.id, ...doc.data() };
      const list = byClient.get(t.clientUid);
      if (list) { list.push(t); seen.get(t.clientUid).add(doc.id); }
    }
  }

  // #188: an ADDITIONAL CONTACT on a matter can genuinely see it, so the roster
  // must count it too — otherwise the figures contradict the access rule and a
  // client with real work shows "0 matters". Matched on email, exactly as
  // `clientCanSeeMatter` does; a client added by email but never made the
  // matter's owner is the whole point of that feature.
  const emails = [...new Set([...emailByUid.values()].map((e) => String(e).trim().toLowerCase()).filter(Boolean))];
  if (emails.length) {
    const byEmail = new Map();
    for (const [uid, e] of emailByUid) {
      const k = String(e).trim().toLowerCase();
      if (k) byEmail.set(k, uid);
    }
    for (const part of chunk(emails)) {
      const snap = await db.collection('tasks').where('ccEmails', 'array-contains-any', part).get();
      for (const doc of snap.docs) {
        const t = { id: doc.id, ...doc.data() };
        for (const raw of t.ccEmails ?? []) {
          const uid = byEmail.get(String(raw).trim().toLowerCase());
          // Skip a matter the client already owns — it must not be counted twice.
          if (!uid || seen.get(uid)?.has(doc.id)) continue;
          byClient.get(uid)?.push(t);
          seen.get(uid)?.add(doc.id);
        }
      }
    }
  }

  return byClient;
}

/**
 * Read the CURRENT step of each in-flight matter — one doc get per matter, by id.
 * Completed matters are skipped: they cannot be stuck or overdue, so their steps
 * are never read.
 */
export async function fetchCurrentSteps(db, tasks) {
  const live = tasks.filter(
    (t) => LIVE_STATUSES.includes(t.status) && typeof t.currentStepNumber === 'number',
  );
  const entries = await Promise.all(live.map(async (t) => {
    try {
      const snap = await db.collection('tasks').doc(t.id)
        .collection('steps').doc(String(t.currentStepNumber)).get();
      return snap.exists ? [t.id, snap.data()] : null;
    } catch {
      return null; // a missing step must not fail the whole roster
    }
  }));
  return new Map(entries.filter(Boolean));
}

/**
 * Documents awaiting the FIRM's review, counted per client. Uses a collection
 * group over the pending statuses and buckets by the matters we already hold, so
 * it costs one query per page rather than one per matter.
 */
export async function fetchDocsPending(db, taskIdToClient) {
  const counts = new Map();
  if (taskIdToClient.size === 0) return counts;
  try {
    const snap = await db.collectionGroup('documents')
      .where('status', '==', 'pending_review')
      .get();
    for (const doc of snap.docs) {
      // documents live at tasks/{taskId}/documents/{docId}
      const taskId = doc.ref.parent.parent?.id;
      const owners = taskId ? taskIdToClient.get(taskId) : null;
      if (!owners) continue;
      // #188: a matter can be visible to several clients (its owner and each CC
      // contact); the pending-document count belongs to each of them.
      for (const client of Array.isArray(owners) ? owners : [owners]) {
        counts.set(client, (counts.get(client) ?? 0) + 1);
      }
    }
  } catch {
    // The collection-group index may not be deployed yet — a missing docs count
    // must degrade to zero, never break the roster.
  }
  return counts;
}

/**
 * Build rollups for a page of client user docs. This is the one function the
 * controller calls for the roster.
 */
export async function buildRollups(db, clientDocs, now = Date.now()) {
  const uids = clientDocs.map((d) => d.id);
  if (uids.length === 0) return [];

  // #188: pass each client's email so matters they are only a CC contact on are
  // counted too — they can genuinely see those, so the roster must agree.
  const emailByUid = new Map(
    clientDocs.map((d) => [d.id, (d.data()?.email ?? '').toString()]).filter(([, e]) => e),
  );
  const mattersByClient = await fetchMattersForClients(db, uids, emailByUid);

  // De-duplicate for the shared lookups: one matter can now appear under several
  // clients (its owner and each CC contact), and fetching its steps twice would
  // double the reads for no benefit.
  const allTasks = [...new Map([...mattersByClient.values()].flat().map((t) => [t.id, t])).values()];

  // Attribute a matter's pending documents to EVERY client who can see it, not
  // just its owner — otherwise a CC contact's count silently belongs to someone
  // else. A Map keyed by task id would collapse those, so this is a list.
  const taskIdToClient = new Map();
  for (const [uid, tasks] of mattersByClient) {
    for (const t of tasks) {
      if (!taskIdToClient.has(t.id)) taskIdToClient.set(t.id, []);
      taskIdToClient.get(t.id).push(uid);
    }
  }
  const [currentSteps, docsPending] = await Promise.all([
    fetchCurrentSteps(db, allTasks),
    fetchDocsPending(db, taskIdToClient),
  ]);

  return clientDocs.map((doc) => {
    const tasks = mattersByClient.get(doc.id) ?? [];
    const folded = foldClientMatters(tasks, currentSteps, now);
    const rollup = {
      ...clientIdentity(doc),
      ...folded,
      docsPending: docsPending.get(doc.id) ?? 0,
    };
    return { ...rollup, attentionScore: attentionScore(rollup) };
  });
}
