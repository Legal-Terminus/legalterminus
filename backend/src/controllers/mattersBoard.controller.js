import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { deriveOwnerType } from '../../../shared/workflows/definitionSchema.js';
import { getCompiledById } from '../services/workflowDefinitions.service.js';
import { resolveUserNames } from './tasks.controller.js';

/**
 * Story 31.2 — the matters board's read model.
 *
 * The board needs, per live matter: which PHASE its current step sits in, and
 * WHO that step is waiting on. Neither lives on the task document — both are
 * properties of the workflow definition — and the definitions list endpoint
 * returns summaries only (no steps, no phases).
 *
 * Rather than widen that shared endpoint (other screens consume it, and Epic 31
 * is additive-only) or make the Portal fetch N definitions, this endpoint joins
 * the two server-side and returns cards ready to render.
 *
 * Read-only by construction: the board cannot move a matter. Matters advance
 * through workflow events — gates, approvals, payments — so a drag would have to
 * bypass the engine. See the story's AC6.
 */

/** Matters in flight — the board is a picture of live work, not an archive. */
const LIVE_STATUSES = ['active', 'pending', 'pending_admin_approval'];

/** Where a matter goes when its workflow declares no phases. */
const UNPHASED = '__unphased__';

/**
 * GET /api/matters/board
 *
 * Returns `{ lanes: [{ defId, name, columns: [{ id, name, cards }] }] }` —
 * one lane per workflow, whose columns are THAT workflow's own phases. A single
 * shared column set across workflows would have to invent labels no firm uses;
 * a union of every workflow's phases would be actively misleading.
 */
export async function getBoard(req, res) {
  try {
    // Role scoping mirrors the matters list: staff see the firm's live
    // matters. (A team member's narrower view is applied by the same rule the
    // list uses — see `scopeForRole` below.)
    const snap = await db.collection('tasks').where('status', 'in', LIVE_STATUSES).get();
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const scoped = scopeForRole(tasks, req.user);

    // One definition read per DISTINCT workflow on the board (a firm has a
    // handful), memoised by the registry.
    const defIds = [...new Set(scoped.map((t) => t.workflowDefinitionId).filter(Boolean))];
    const defs = new Map();
    for (const id of defIds) {
      try {
        const compiled = await getCompiledById(id);
        if (compiled?.definition) defs.set(id, compiled.definition);
      } catch {
        // A matter whose definition is missing still belongs on the board — it
        // simply lands in the generic column rather than vanishing.
      }
    }

    // `assignedToName` is NOT a field on the task document — it is resolved at
    // read time, the way getTask does it. Reading `t.assignedToName` gave every
    // card `null`, so the board showed "Our team" for work that was in fact
    // assigned to a named person, which is the one thing a board is for.
    // Single-tenant: resolveUserNames takes the uid list only (no db handle).
    const names = await resolveUserNames(scoped.map((t) => t.assignedTo));
    const withNames = scoped.map((t) => ({
      ...t,
      assignedToName: t.assignedTo ? (names[t.assignedTo] ?? null) : null,
    }));

    res.json({ lanes: buildLanes(withNames, defs) });
  } catch (error) {
    logger.error({ err: error }, 'Failed to build the matters board');
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * A team member sees the matters they are on; admin and manager see everything.
 * Deliberately the same rule the matters LIST applies, so the board can never
 * show someone a matter the list would hide.
 */
export function scopeForRole(tasks, user) {
  const role = user?.role;
  if (role === 'admin' || role === 'manager') return tasks;
  const uid = user?.uid;
  return tasks.filter((t) => t.assignedTo === uid || t.professionalUid === uid);
}


/**
 * A matter's progress through its workflow, by step POSITION.
 *
 * `stepNumber` is an identity, not an index — `din-creation` runs
 * 1,45,46,47,28 — so "step 45 of 14" is the reading this avoids. Returns
 * nulls rather than guessing when the definition is unavailable.
 */
export function stepProgress(def, currentStepNumber) {
  const steps = def?.steps ?? [];
  const total = steps.length;
  if (!total || typeof currentStepNumber !== 'number') {
    return { stepPosition: null, stepTotal: null, progressPct: null };
  }
  const i = steps.findIndex((s) => s.stepNumber === currentStepNumber);
  if (i < 0) return { stepPosition: null, stepTotal: total, progressPct: null };
  return {
    stepPosition: i + 1,
    stepTotal: total,
    // Steps BEFORE the current one are done; the current one is in flight.
    progressPct: Math.round((i / total) * 100),
  };
}

/** Pure: fold matters + their definitions into swimlanes. Unit-testable. */
export function buildLanes(tasks, defs, now = Date.now()) {
  const byDef = new Map();

  for (const t of tasks) {
    const def = t.workflowDefinitionId ? defs.get(t.workflowDefinitionId) : null;
    const step = (def?.steps ?? []).find((s) => s.stepNumber === t.currentStepNumber);
    const key = t.workflowDefinitionId ?? t.workflowType ?? 'unknown';

    const card = {
      id: t.id,
      clientName: t.clientName ?? '',
      organisation: t.organisation ?? '',
      serviceName: t.serviceName ?? t.workflowType ?? '',
      stepTitle: step?.title ?? '',
      stepNumber: t.currentStepNumber ?? null,
      // `deriveOwnerType` is the engine's own rule (payment gates and
      // client-approval steps are the client's; govt-response steps the
      // registrar's). Never re-derived in the UI.
      owner: step ? deriveOwnerType(step) : 'team',
      // How far along, for the card. Derived from the step's POSITION in the
      // definition, never from `stepNumber` — that is a stable identity, so a
      // workflow running 1,45,46,28 would otherwise report "step 45 of 14".
      // Null when the definition is missing: a card still belongs on the board,
      // but an invented percentage would be worse than none.
      ...stepProgress(def, t.currentStepNumber),
      phaseId: step?.phaseId ?? UNPHASED,
      isUrgent: Boolean(t.isUrgent),
      assignedTo: t.assignedTo ?? null,
      assignedToName: t.assignedToName ?? null,
      daysInStep: daysSince(t.updatedAt, now),
    };

    if (!byDef.has(key)) byDef.set(key, { def, cards: [] });
    byDef.get(key).cards.push(card);
  }

  return [...byDef.entries()].map(([defId, { def, cards }]) => {
    const phases = [...(def?.phases ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const columns = phases.map((p) => ({ id: p.id, name: p.name }));
    columns.push({ id: UNPHASED, name: phases.length ? 'Unphased' : 'In progress' });

    const buckets = new Map(columns.map((c) => [c.id, []]));
    for (const card of cards) {
      (buckets.get(card.phaseId) ?? buckets.get(UNPHASED)).push(card);
    }

    return {
      defId,
      name: def?.name ?? cards[0]?.serviceName ?? 'Other matters',
      total: cards.length,
      // EVERY authored phase is shown, empty or not — that is what makes this a
      // board rather than a list. A gap between "Documents" and "Filing" is
      // information: nothing is at that stage. An earlier version hid empty
      // columns, which made the same workflow render a different shape from one
      // day to the next and left an author unable to see their own phases.
      //
      // The one exception is the UNPHASED catch-all, which is a fallback rather
      // than a real stage — it appears only when something actually lands in it.
      columns: columns
        .map((c) => ({ ...c, cards: buckets.get(c.id) }))
        .filter((c) => c.id !== UNPHASED || c.cards.length > 0),
    };
  }).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
}

function daysSince(iso, now) {
  if (!iso) return null;
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.floor((now - ms) / 86_400_000));
}
