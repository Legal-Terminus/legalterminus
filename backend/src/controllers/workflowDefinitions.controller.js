import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { validateDefinition } from '../../../shared/workflows/definitionSchema.js';

const COLLECTION = 'workflowDefinitions';
// Per-phase default assignees (E11-S02), kept SEPARATE from the versioned
// definition so ops can re-route a phase without bumping the workflow version.
const PHASE_ASSIGN_COLLECTION = 'workflowPhaseAssignments';

// GET /api/workflow-definitions — summaries for listing (no full steps payload).
export async function listDefinitions(req, res) {
  try {
    const snap = await getDb().collection(COLLECTION).get();
    const items = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: data.id ?? d.id,
        name: data.name ?? d.id,
        version: data.version ?? 1,
        serviceKeys: data.serviceKeys ?? [],
        stepCount: Array.isArray(data.steps) ? data.steps.length : 0,
        updatedAt: data.updatedAt ?? null,
      };
    });
    res.json(items);
  } catch (err) {
    logger.error({ err }, 'listDefinitions error:');
    res.status(500).json({ message: 'Failed to list workflow definitions' });
  }
}

// GET /api/workflow-definitions/:id — full definition (incl. steps) for viz/editor.
export async function getDefinition(req, res) {
  try {
    const snap = await getDb().collection(COLLECTION).doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ message: 'Workflow definition not found' });
    res.json(snap.data());
  } catch (err) {
    logger.error({ err }, 'getDefinition error:');
    res.status(500).json({ message: 'Failed to get workflow definition' });
  }
}

// ─── Config sync / health check (E10-S02, adapted) ─────────────────────────
// The original two-layer "machine totalSteps vs config step count" model is gone
// (workflows are single data-driven definitions compiled at runtime). The faithful
// equivalent of "out of sync" is a definition that won't compile/run correctly:
// structural errors (dangling transitions, bad gates, dangling phaseIds) and
// reachability/coverage warnings. matter creation should be blocked on hard errors.
function reachableSteps(def) {
  const byNum = new Map((def.steps ?? []).map((s) => [s.stepNumber, s]));
  const seen = new Set();
  const queue = [];
  if (byNum.has(def.initialStep)) queue.push(def.initialStep);
  while (queue.length) {
    const n = queue.shift();
    if (seen.has(n)) continue;
    seen.add(n);
    const s = byNum.get(n);
    if (!s) continue;
    const targets = [];
    for (const t of s.transitions ?? []) targets.push(t.to);
    if (s.gate) { targets.push(s.gate.onPass); targets.push(s.gate.onWait); }
    for (const t of targets) if (byNum.has(t) && !seen.has(t)) queue.push(t);
  }
  return seen;
}

// GET /api/workflow-definitions/:id/sync-check
export async function syncCheckDefinition(req, res) {
  try {
    const snap = await getDb().collection(COLLECTION).doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ message: 'Workflow definition not found' });
    const def = snap.data();

    // Hard errors → the workflow can't be safely used for new matters.
    const errors = validateDefinition(def);

    // Soft warnings → usable but worth fixing.
    const warnings = [];
    const steps = (def.steps ?? []).filter((s) => s.type !== 'final');
    const reachable = reachableSteps(def);
    const unreachable = steps.filter((s) => !reachable.has(s.stepNumber)).map((s) => s.stepNumber);
    if (unreachable.length) {
      warnings.push(`Unreachable step(s): ${unreachable.join(', ')} — no path leads to them from the start.`);
    }
    if ((def.phases?.length ?? 0) > 0) {
      const noPhase = steps.filter((s) => !s.phaseId).map((s) => s.stepNumber);
      if (noPhase.length) {
        warnings.push(`${noPhase.length} step(s) have no phase — they won't group on the journey tracker or inherit a phase assignee.`);
      }
    }
    // ETA coverage (E13-S01): partial ETAs make "running late" misleading (a
    // matter's projected due date only counts steps that have one). Warn — not an
    // error — when some-but-not-all steps carry typicalDurationDays.
    const withEta = steps.filter((s) => typeof s.typicalDurationDays === 'number');
    if (withEta.length > 0 && withEta.length < steps.length) {
      warnings.push(`${steps.length - withEta.length} of ${steps.length} step(s) have no ETA — matter due-date projections will undercount until every step has one.`);
    }

    res.json({
      definitionId: def.id ?? req.params.id,
      version: def.version ?? 1,
      stepCount: steps.length,
      inSync: errors.length === 0,
      errors,
      warnings,
    });
  } catch (err) {
    logger.error({ err }, 'syncCheckDefinition error:');
    res.status(500).json({ message: 'Failed to check workflow definition' });
  }
}

// ─── Per-phase default assignees (E11-S02) ─────────────────────────────────
// GET /api/workflow-definitions/:id/phase-assignments — staff read. Returns the
// stored phaseId→uid map (empty if never configured).
export async function getPhaseAssignments(req, res) {
  try {
    const { id } = req.params;
    const snap = await getDb().collection(PHASE_ASSIGN_COLLECTION).doc(id).get();
    const data = snap.exists ? snap.data() : null;
    res.json({ definitionId: id, assignments: data?.assignments ?? {} });
  } catch (err) {
    logger.error({ err }, 'getPhaseAssignments error:');
    res.status(500).json({ message: 'Failed to get phase assignments' });
  }
}

// PUT /api/workflow-definitions/:id/phase-assignments — admin/manager write.
// Body: { assignments: { [phaseId]: uid | null } }. Validates every phaseId
// exists on the definition and every uid is a STAFF user (rejects clients).
export async function putPhaseAssignments(req, res) {
  try {
    const { id } = req.params;
    const { assignments } = req.body; // shape validated by phaseAssignmentsSchema

    const defSnap = await getDb().collection(COLLECTION).doc(id).get();
    if (!defSnap.exists) return res.status(404).json({ message: 'Workflow definition not found' });
    const def = defSnap.data();
    const validPhaseIds = new Set((def.phases ?? []).map((p) => p.id));

    // Validate phase ids + assignees. Normalize '' → null (unassigned).
    const clean = {};
    const uidsToCheck = new Set();
    for (const [phaseId, uid] of Object.entries(assignments)) {
      if (!validPhaseIds.has(phaseId)) {
        return res.status(400).json({ message: `Unknown phase '${phaseId}' for this workflow` });
      }
      const norm = uid || null;
      clean[phaseId] = norm;
      if (norm) uidsToCheck.add(norm);
    }

    // Every assignee must exist and be staff (never a client).
    await Promise.all([...uidsToCheck].map(async (uid) => {
      const u = await getDb().collection('users').doc(uid).get();
      if (!u.exists) throw { status: 400, message: `Assignee ${uid} not found` };
      if (u.data().role === 'client') throw { status: 400, message: 'Cannot assign a phase to a client' };
    })).catch((e) => { throw e; });

    await getDb().collection(PHASE_ASSIGN_COLLECTION).doc(id).set({
      definitionId: id,
      assignments: clean,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid ?? null,
    }, { merge: true });

    res.json({ definitionId: id, assignments: clean });
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ message: err.message });
    logger.error({ err }, 'putPhaseAssignments error:');
    res.status(500).json({ message: 'Failed to save phase assignments' });
  }
}

// ─── Per-step ETAs (E13-S01) ───────────────────────────────────────────────
// GET /api/workflow-definitions/:id/step-etas — staff read. Returns the ordered
// step list with each step's stepNumber, title, and current ETA (typicalDurationDays),
// so the service-config UI can render an editable row per step.
export async function getStepEtas(req, res) {
  try {
    const snap = await getDb().collection(COLLECTION).doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ message: 'Workflow definition not found' });
    const def = snap.data();
    const steps = (def.steps ?? [])
      .filter((s) => s.type !== 'final')
      .map((s) => ({
        stepNumber: s.stepNumber,
        title: s.title,
        phaseId: s.phaseId ?? null,
        typicalDurationDays: typeof s.typicalDurationDays === 'number' ? s.typicalDurationDays : null,
      }));
    res.json({ definitionId: def.id ?? req.params.id, version: def.version ?? 1, steps });
  } catch (err) {
    logger.error({ err }, 'getStepEtas error:');
    res.status(500).json({ message: 'Failed to get step ETAs' });
  }
}

// PUT /api/workflow-definitions/:id/step-etas — admin/manager write.
// Body: { etas: { [stepNumber]: number | null } }. Writes typicalDurationDays onto
// the matching steps WITHIN the definition and bumps `version`. Definitions are
// version-pinned per matter, so in-flight matters are unaffected; matters created
// after this change inherit the new ETAs. null clears a step's ETA.
export async function putStepEtas(req, res) {
  try {
    const { id } = req.params;
    const { etas } = req.body; // shape validated by stepEtasSchema

    const ref = getDb().collection(COLLECTION).doc(id);
    const defSnap = await ref.get();
    if (!defSnap.exists) return res.status(404).json({ message: 'Workflow definition not found' });
    const def = defSnap.data();

    const byNum = new Map((def.steps ?? []).map((s) => [s.stepNumber, s]));
    // Validate every referenced step exists before mutating anything.
    for (const key of Object.keys(etas)) {
      const num = Number(key);
      if (!byNum.has(num)) {
        return res.status(400).json({ message: `Unknown step ${key} for this workflow` });
      }
    }

    // Apply: set or clear typicalDurationDays per step.
    const steps = (def.steps ?? []).map((s) => {
      if (!(String(s.stepNumber) in etas)) return s;
      const v = etas[String(s.stepNumber)];
      const copy = { ...s };
      if (v == null) delete copy.typicalDurationDays;
      else copy.typicalDurationDays = v;
      return copy;
    });

    const version = (def.version ?? 1) + 1;
    await ref.set({
      steps,
      version,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid ?? null,
    }, { merge: true });

    res.json({
      definitionId: id,
      version,
      steps: steps.filter((s) => s.type !== 'final').map((s) => ({
        stepNumber: s.stepNumber,
        title: s.title,
        phaseId: s.phaseId ?? null,
        typicalDurationDays: typeof s.typicalDurationDays === 'number' ? s.typicalDurationDays : null,
      })),
    });
  } catch (err) {
    logger.error({ err }, 'putStepEtas error:');
    res.status(500).json({ message: 'Failed to save step ETAs' });
  }
}

// ─── Per-step default assignees ────────────────────────────────────────────
// GET /api/workflow-definitions/:id/step-assignees — staff read. Returns the
// ordered step list with each step's current default assignee uid, so the
// service-config UI can render an editable assignee picker per step.
export async function getStepAssignees(req, res) {
  try {
    const snap = await getDb().collection(COLLECTION).doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ message: 'Workflow definition not found' });
    const def = snap.data();
    const steps = (def.steps ?? [])
      .filter((s) => s.type !== 'final')
      .map((s) => ({
        stepNumber: s.stepNumber,
        title: s.title,
        phaseId: s.phaseId ?? null,
        defaultAssigneeUid: s.defaultAssigneeUid ?? null,
      }));
    res.json({ definitionId: def.id ?? req.params.id, version: def.version ?? 1, steps });
  } catch (err) {
    logger.error({ err }, 'getStepAssignees error:');
    res.status(500).json({ message: 'Failed to get step assignees' });
  }
}

// PUT /api/workflow-definitions/:id/step-assignees — admin/manager write.
// Body: { assignees: { [stepNumber]: uid | null } }. Validates every step exists
// and every uid is a STAFF user (rejects clients), writes defaultAssigneeUid onto
// the matching steps and bumps `version`. Definitions are version-pinned per
// matter, so in-flight matters are unaffected; matters created after this change
// route the step to the configured person. null clears a step's default assignee.
export async function putStepAssignees(req, res) {
  try {
    const { id } = req.params;
    const { assignees } = req.body; // shape validated by stepAssigneesSchema

    const ref = getDb().collection(COLLECTION).doc(id);
    const defSnap = await ref.get();
    if (!defSnap.exists) return res.status(404).json({ message: 'Workflow definition not found' });
    const def = defSnap.data();

    const byNum = new Map((def.steps ?? []).map((s) => [s.stepNumber, s]));
    // Validate every referenced step exists, and collect the uids to verify.
    const uidsToCheck = new Set();
    for (const [key, uid] of Object.entries(assignees)) {
      if (!byNum.has(Number(key))) {
        return res.status(400).json({ message: `Unknown step ${key} for this workflow` });
      }
      if (uid) uidsToCheck.add(uid);
    }

    // Every assignee must exist and be staff (never a client).
    await Promise.all([...uidsToCheck].map(async (uid) => {
      const u = await getDb().collection('users').doc(uid).get();
      if (!u.exists) throw { status: 400, message: `Assignee ${uid} not found` };
      if (u.data().role === 'client') throw { status: 400, message: 'Cannot assign a step to a client' };
    }));

    // Apply: set or clear defaultAssigneeUid per step.
    const steps = (def.steps ?? []).map((s) => {
      if (!(String(s.stepNumber) in assignees)) return s;
      const v = assignees[String(s.stepNumber)] || null;
      const copy = { ...s };
      if (v == null) delete copy.defaultAssigneeUid;
      else copy.defaultAssigneeUid = v;
      return copy;
    });

    const version = (def.version ?? 1) + 1;
    await ref.set({
      steps,
      version,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid ?? null,
    }, { merge: true });

    res.json({
      definitionId: id,
      version,
      steps: steps.filter((s) => s.type !== 'final').map((s) => ({
        stepNumber: s.stepNumber,
        title: s.title,
        phaseId: s.phaseId ?? null,
        defaultAssigneeUid: s.defaultAssigneeUid ?? null,
      })),
    });
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ message: err.message });
    logger.error({ err }, 'putStepAssignees error:');
    res.status(500).json({ message: 'Failed to save step assignees' });
  }
}

// Helper for createTask: returns the phaseId→uid map for a definition (or {}).
export async function loadPhaseAssignments(definitionId) {
  try {
    const snap = await getDb().collection(PHASE_ASSIGN_COLLECTION).doc(definitionId).get();
    return snap.exists ? (snap.data().assignments ?? {}) : {};
  } catch (err) {
    logger.warn({ err: err?.message }, 'loadPhaseAssignments failed');
    return {};
  }
}
