import { createActor } from 'xstate';
import { db } from '../config/firebase.js';
import { logger } from "../config/logger.js";
import { getCompiledForServiceKey, getCompiledById } from '../services/workflowDefinitions.service.js';
import { loadPhaseAssignments } from './workflowDefinitions.controller.js';
import { compileDefinition } from '../../../shared/workflows/compileDefinition.js';
import { validateDefinition } from '../../../shared/workflows/definitionSchema.js';

// ─── Client-view projection (E12) ──────────────────────────────────────────
// Clients must never receive INTERNAL operational data: who on our team owns a
// matter/step, internal-only activity, or actor names of staff. We strip this
// server-side (defense in depth — not just hiding it in the UI) so the API
// cannot leak it regardless of the caller. Staff get the full payload unchanged.

// Internal step fields a client should never see (assignment/audit metadata).
const CLIENT_STEP_HIDDEN = ['assignedTo', 'assignedRole', 'completedBy', 'isUrgent'];

// Strip internal ownership/assignment from a task + its steps for a client.
function projectTaskForClient(task) {
  const { assignedTo, createdBy, isUrgent, adminOverride, ...safe } = task;
  if (Array.isArray(safe.steps)) {
    safe.steps = safe.steps.map((s) => {
      const copy = { ...s };
      for (const k of CLIENT_STEP_HIDDEN) delete copy[k];
      return copy;
    });
  }
  return safe;
}

// Which activity events a client may see, and how each reads in client-facing
// language. Internal-only events (assignment, approval gate, override) are NOT
// in this whitelist and are dropped entirely. Actor names are masked to the
// generic "Our team" so we never expose individual staff identities.
const CLIENT_EVENT_WHITELIST = new Set([
  'COMPLETE_STEP',
  'BRANCH_DECISION',
  'CLIENT_APPROVE',
  'CLIENT_REJECT',
  'GOVT_APPROVE',
  'GOVT_REJECT',
  'RECORD_PAYMENT',
]);

// Task IDs in which this user is assigned at least one STEP, across all matters.
// Firestore can't OR a task-doc field with a subcollection field in one query, so
// a team member's visible set = matters task-assigned to them ∪ matters where a
// step is assigned to them. This resolves the second half via a collection-group
// query on `steps` (needs the steps/assignedTo collection-group index).
async function taskIdsWithStepAssignedTo(uid) {
  const ids = new Set();
  try {
    const snap = await db.collectionGroup('steps').where('assignedTo', '==', uid).get();
    snap.forEach((d) => {
      const parent = d.ref.parent.parent; // tasks/{taskId}/steps/{n} → tasks/{taskId}
      if (parent) ids.add(parent.id);
    });
  } catch (err) {
    // Most likely the steps/assignedTo collection-group index isn't deployed yet
    // (FAILED_PRECONDITION). Degrade gracefully: team members still see matters
    // assigned to them at the task level; step-only delegations appear once the
    // index is live. Don't 500 the whole list.
    logger.warn({ err: err?.message }, 'taskIdsWithStepAssignedTo: collection-group query failed (index missing?)');
  }
  return ids;
}

// ─── POST /api/tasks ───────────────────────────────────────────────────────
// Assign a service's workflow to a client → create a task. Admin/manager only.
// Body: { clientUid, serviceKey, serviceName? }
//
// The workflow comes from a DATA definition (workflowDefinitions), compiled at
// runtime. The task pins workflowDefinitionId + version (immutable per task), so
// later edits to the definition never alter in-flight tasks. We persist only
// per-step INSTANCE state; transition rules stay in the (versioned) definition.
export async function createTask(req, res) {
  try {
    const { role } = req.user;
    if (role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: admin or manager required' });
    }

    // Body shape (clientUid, serviceKey, serviceName?) validated by taskCreateSchema.
    const { clientUid, serviceKey, serviceName } = req.body;

    const compiled = await getCompiledForServiceKey(serviceKey);
    if (!compiled) {
      return res.status(400).json({ message: `No workflow configured for service '${serviceKey}'` });
    }
    const { definition } = compiled;

    // Config sync guard (E10-S02): never instantiate a structurally-broken
    // definition (dangling transitions/gates, bad phaseIds) — it would create a
    // matter that can't advance. Block with 409 so the admin fixes the workflow.
    const defErrors = validateDefinition(definition);
    if (defErrors.length) {
      return res.status(409).json({
        message: 'This service\'s workflow is misconfigured and cannot be used until fixed.',
        code: 'WORKFLOW_OUT_OF_SYNC',
        errors: defErrors,
      });
    }

    // Verify the client exists and resolve a display name.
    const clientDoc = await db.collection('users').doc(clientUid).get();
    if (!clientDoc.exists) return res.status(404).json({ message: 'Client not found' });
    const c = clientDoc.data();
    const clientName = c.name || c.fullName || c.email || 'Client';

    const firstStep = definition.initialStep;

    // Per-phase default assignees (E11-S02): pre-route each step to the person
    // configured for its phase, so work lands in the right "My Tasks" with no
    // manual assignment. Map is phaseId → uid; steps in unconfigured phases stay
    // in the shared pool. Validation (staff-only, phase exists) happened on write.
    const phaseAssignees = await loadPhaseAssignments(definition.id);
    const assigneeForStep = (s) => (s.phaseId && phaseAssignees[s.phaseId]) || null;

    // Approval gate (E03-S04): a manager-created matter must be approved by an
    // admin before it goes active; an admin-created matter activates immediately.
    // While pending, the first step is held `pending` (not `active`) so no work
    // starts and it stays out of "My Tasks" until approved.
    const needsApproval = role === 'manager';
    const initialStatus = needsApproval ? 'pending_admin_approval' : 'pending';

    // Per-step INSTANCE state, built from the definition's EXPLICIT step identity
    // (no regex parsing). Stored in a SUBCOLLECTION (tasks/{id}/steps/{stepNumber})
    // so independent step updates never race on a whole-array overwrite.
    const stepDefs = definition.steps.filter((s) => s.type !== 'final');

    const now = new Date().toISOString();
    const task = {
      // Workflow identity: definition + pinned version (NOT the service key).
      workflowDefinitionId: definition.id,
      workflowVersion: definition.version ?? 1,
      workflowType: definition.id, // back-compat for reports/list display
      serviceKey,
      serviceName: serviceName || definition.name || serviceKey,
      clientUid,
      clientName,
      assignedTo: null,
      status: initialStatus,
      paymentStatus: 'not_paid',
      amountPaid: 0,
      amountDue: 0,
      isUrgent: false,
      currentStepNumber: firstStep,
      totalSteps: stepDefs.length, // denormalized count for list/report display
      createdAt: now,
      updatedAt: now,
      createdBy: req.user.uid ?? null,
    };

    // Atomically create the task doc + its step subcollection.
    const ref = db.collection('tasks').doc();
    const batch = db.batch();
    batch.set(ref, task);
    // While pending approval, even the first step stays `pending` (no work starts).
    const firstStepStatus = needsApproval ? 'pending' : 'active';
    for (const s of stepDefs) {
      batch.set(ref.collection('steps').doc(String(s.stepNumber)), {
        stepNumber: s.stepNumber,
        title: s.title,
        assignedRole: s.assignedRole ?? null,
        assignedTo: assigneeForStep(s),
        status: s.stepNumber === firstStep ? firstStepStatus : 'pending',
      });
    }
    await batch.commit();

    const steps = stepDefs.map((s) => ({
      stepNumber: s.stepNumber,
      title: s.title,
      status: s.stepNumber === firstStep ? firstStepStatus : 'pending',
    }));
    res.status(201).json({ id: ref.id, ...task, steps });
  } catch (err) {
    logger.error({ err }, 'createTask error:');
    res.status(500).json({ message: 'Failed to create task' });
  }
}

// ─── POST /api/tasks/:taskId/approve ───────────────────────────────────────
// Admin approves a matter that is `pending_admin_approval` (E03-S04). The matter
// goes `active` and its first step is activated, so normal execution begins and
// it appears in worklists. Records the approval in the events thread.
export async function approveTask(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin required' });
    }
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();
    if (task.status !== 'pending_admin_approval') {
      return res.status(409).json({ message: 'Matter is not pending approval' });
    }

    const now = new Date().toISOString();
    const batch = db.batch();
    batch.set(taskRef, { status: 'active', updatedAt: now }, { merge: true });
    // Activate the current (first) step so work can begin.
    batch.set(
      taskRef.collection('steps').doc(String(task.currentStepNumber)),
      { status: 'active' },
      { merge: true },
    );
    batch.set(taskRef.collection('events').doc(), {
      type: 'TASK_APPROVED',
      fromStep: task.currentStepNumber,
      toStep: task.currentStepNumber,
      comment: null,
      byUid: req.user.uid ?? null,
      byRole: req.user.role ?? null,
      at: now,
    });
    await batch.commit();
    res.json({ success: true, status: 'active' });
  } catch (err) {
    logger.error({ err }, 'approveTask error:');
    res.status(500).json({ message: 'Failed to approve matter' });
  }
}

// ─── POST /api/tasks/:taskId/reject ────────────────────────────────────────
// Admin rejects a matter pending approval (E03-S04). Requires a reason, which is
// recorded on the events thread so the creator can see why. The matter moves to
// `rejected` (terminal for now); re-creation is the path forward.
export async function rejectTask(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin required' });
    }
    const { reason } = req.body; // validated non-empty by taskRejectSchema
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();
    if (task.status !== 'pending_admin_approval') {
      return res.status(409).json({ message: 'Matter is not pending approval' });
    }

    const now = new Date().toISOString();
    const comment = reason.toString().trim().slice(0, 500);
    const batch = db.batch();
    batch.set(taskRef, { status: 'rejected', rejectionReason: comment, updatedAt: now }, { merge: true });
    batch.set(taskRef.collection('events').doc(), {
      type: 'TASK_REJECTED',
      fromStep: task.currentStepNumber,
      toStep: task.currentStepNumber,
      comment,
      byUid: req.user.uid ?? null,
      byRole: req.user.role ?? null,
      at: now,
    });
    await batch.commit();
    res.json({ success: true, status: 'rejected' });
  } catch (err) {
    logger.error({ err }, 'rejectTask error:');
    res.status(500).json({ message: 'Failed to reject matter' });
  }
}

// ─── GET /api/tasks ────────────────────────────────────────────────────────
// Paginated + role-scoped. Filters (status/assignedTo/isUrgent) combined with
// orderBy(updatedAt) require composite indexes — see firestore.indexes.json.
// Returns { data, nextCursor }.
export async function listTasks(req, res) {
  try {
    const { isUrgent, status, assignedTo, limit = 25, cursor } = req.query;
    const { role, uid } = req.user;

    // Team members see matters task-assigned to them ∪ matters where a STEP is
    // assigned to them. Firestore can't OR those in one query, so fetch both,
    // merge, filter and sort in memory. (Volumes per member are small; this also
    // means cursor pagination doesn't apply to the team-member view.)
    if (role === 'team_member') {
      const [byTask, stepTaskIds] = await Promise.all([
        db.collection('tasks').where('assignedTo', '==', uid).get(),
        taskIdsWithStepAssignedTo(uid),
      ]);
      const byId = new Map(byTask.docs.map((d) => [d.id, { id: d.id, ...d.data() }]));
      // Add step-assigned matters not already captured by task-level assignment.
      const missing = [...stepTaskIds].filter((id) => !byId.has(id));
      await Promise.all(missing.map(async (id) => {
        const d = await db.collection('tasks').doc(id).get();
        if (d.exists) byId.set(id, { id: d.id, ...d.data() });
      }));
      let rows = [...byId.values()];
      if (status) rows = rows.filter((t) => t.status === status);
      if (isUrgent === 'true') rows = rows.filter((t) => t.isUrgent === true);
      rows.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
      return res.json({ data: rows, nextCursor: null });
    }

    let query = db.collection('tasks');
    // Clients can only see their own tasks
    if (role === 'client') {
      query = query.where('clientUid', '==', uid);
    }

    if (status)           query = query.where('status', '==', status);
    if (assignedTo)       query = query.where('assignedTo', '==', assignedTo);
    if (isUrgent === 'true') query = query.where('isUrgent', '==', true);

    query = query.orderBy('updatedAt', 'desc').limit(limit);
    if (cursor) {
      const cursorDoc = await db.collection('tasks').doc(cursor).get();
      if (cursorDoc.exists) query = query.startAfter(cursorDoc);
    }

    const snap = await query.get();
    let data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const nextCursor = data.length === limit ? snap.docs[snap.docs.length - 1].id : null;
    // E12-S01: strip internal ownership from the client's own matter list.
    if (role === 'client') data = data.map(projectTaskForClient);
    res.json({ data, nextCursor });
  } catch (err) {
    logger.error({ err: err }, 'listTasks error:');
    res.status(500).json({ message: 'Failed to list tasks' });
  }
}

// Can this user approve a matter that is awaiting approval? Role-derived, NOT
// hardcoded — today only an admin approves a `pending_admin_approval` matter
// (the manager→admin gate, E03-S04). Extend here as approval rules grow (e.g. a
// manager approving team-member-created matters) without touching call sites.
function canApprove(user, matter) {
  if (matter.status === 'pending_admin_approval') return user.role === 'admin';
  return false;
}

// ─── GET /api/tasks/my-steps ───────────────────────────────────────────────
// Consolidated, cross-matter STEP worklist for a staff user ("My Tasks"). A
// Matter (task) has many steps; at any time one step is `active`. This returns
// the active step of every OPEN matter the caller is involved in, enriched with
// matter context (client, service, urgency, age) so staff get a single to-do
// inbox instead of opening matters one by one.
//
// "Mine" is phased:
//   • Per-person assignment (step.assignedTo == me)  → bucket 'assigned'
//   • Unassigned active steps                        → bucket 'unassigned'
// The frontend groups by bucket so a user sees their own queue first, plus the
// shared pool they can pick up. Admin/manager see all open matters; team members
// see matters assigned to them (task-level assignedTo) OR steps assigned to them.
export async function listMySteps(req, res) {
  try {
    const { role, uid } = req.user;
    if (role === 'client') return res.status(403).json({ message: 'Forbidden' });

    // Resolve the set of OPEN matters in scope.
    const openByDoc = new Map(); // taskId → task data
    if (role === 'team_member') {
      // Team members: matters task-assigned to them ∪ matters where a step is
      // assigned to them. Merge both, keep only open ones.
      const [byTask, stepTaskIds] = await Promise.all([
        db.collection('tasks')
          .where('status', 'in', ['pending', 'active'])
          .where('assignedTo', '==', uid).get(),
        taskIdsWithStepAssignedTo(uid),
      ]);
      byTask.docs.forEach((d) => openByDoc.set(d.id, d.data()));
      const missing = [...stepTaskIds].filter((id) => !openByDoc.has(id));
      await Promise.all(missing.map(async (id) => {
        const d = await db.collection('tasks').doc(id).get();
        const data = d.exists ? d.data() : null;
        if (data && (data.status === 'pending' || data.status === 'active')) openByDoc.set(id, data);
      }));
    } else {
      const snap = await db.collection('tasks').where('status', 'in', ['pending', 'active']).get();
      snap.docs.forEach((d) => openByDoc.set(d.id, d.data()));
    }

    const rows = [];
    await Promise.all(
      [...openByDoc.entries()].map(async ([taskId, t]) => {
        const active = await db.collection('tasks').doc(taskId).collection('steps')
          .where('status', '==', 'active').limit(1).get();
        if (active.empty) return;
        const step = active.docs[0].data();
        const assignedTo = step.assignedTo ?? null;
        // Team members only see active steps that are theirs or unassigned.
        if (role === 'team_member' && assignedTo && assignedTo !== uid) return;
        rows.push({
          taskId,
          clientName: t.clientName ?? '',
          serviceName: t.serviceName ?? t.workflowType ?? '',
          // Effective urgency (E11-S03): the matter is urgent OR its active step is.
          // An urgent step flags the row even if the matter itself isn't.
          isUrgent: !!t.isUrgent || !!step.isUrgent,
          updatedAt: t.updatedAt ?? null,
          stepNumber: step.stepNumber,
          stepTitle: step.title ?? `Step ${step.stepNumber}`,
          assignedRole: step.assignedRole ?? null,
          assignedTo,
          bucket: assignedTo === uid ? 'assigned' : (assignedTo ? 'other' : 'unassigned'),
        });
      })
    );

    // Urgent first, then most recently updated matter.
    rows.sort((a, b) => {
      if (a.isUrgent !== b.isUrgent) return a.isUrgent ? -1 : 1;
      return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '');
    });

    // Approvals as worklist items (E11-S04): matters awaiting THIS user's approval.
    // A `pending_admin_approval` matter has no active step, so it never appears in
    // `rows` — but approving it IS a to-do for the approver. Surface it separately,
    // enriched with creator + age. Approver is role-derived via canApprove().
    let approvals = [];
    try {
      const pendSnap = await db.collection('tasks')
        .where('status', '==', 'pending_admin_approval').get();
      const pending = pendSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((m) => canApprove(req.user, m));
      // Resolve creator display names in one batched pass.
      const creatorUids = [...new Set(pending.map((m) => m.createdBy).filter(Boolean))];
      const nameByUid = {};
      await Promise.all(creatorUids.map(async (u) => {
        const us = await db.collection('users').doc(u).get();
        const data = us.exists ? us.data() : null;
        nameByUid[u] = data ? (data.name || data.fullName || data.email || 'User') : 'User';
      }));
      approvals = pending.map((m) => ({
        taskId: m.id,
        clientName: m.clientName ?? '',
        serviceName: m.serviceName ?? m.workflowType ?? '',
        createdByName: m.createdBy ? (nameByUid[m.createdBy] ?? 'User') : 'Unknown',
        isUrgent: !!m.isUrgent,
        createdAt: m.createdAt ?? null,
        updatedAt: m.updatedAt ?? null,
      }));
      approvals.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    } catch (err) {
      logger.warn({ err: err?.message }, 'listMySteps: approvals lookup failed');
    }

    res.json({ data: rows, approvals });
  } catch (err) {
    logger.error({ err }, 'listMySteps error:');
    res.status(500).json({ message: 'Failed to load your tasks' });
  }
}

// ─── GET /api/tasks/:taskId ────────────────────────────────────────────────
export async function getTask(req, res) {
  try {
    const doc = await db.collection('tasks').doc(req.params.taskId).get();
    if (!doc.exists) return res.status(404).json({ message: 'Task not found' });

    const data = doc.data();
    // Clients can only see their own task
    if (req.user.role === 'client' && data.clientUid !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Steps live in a subcollection; attach them ordered by stepNumber.
    const stepsSnap = await doc.ref.collection('steps').orderBy('stepNumber').get();
    const steps = stepsSnap.empty
      ? (data.steps ?? []) // back-compat: legacy tasks stored steps inline
      : stepsSnap.docs.map((s) => s.data());

    const full = { id: doc.id, ...data, steps };
    // E12-S01: clients get a projection with internal ownership/assignment removed.
    res.json(req.user.role === 'client' ? projectTaskForClient(full) : full);
  } catch (err) {
    logger.error({ err: err }, 'getTask error:');
    res.status(500).json({ message: 'Failed to get task' });
  }
}

// ─── GET /api/tasks/:taskId/events ─────────────────────────────────────────
// The matter's activity thread: who did what, when, with their comment. Reads
// the `events` audit subcollection and enriches each entry with the actor's
// display name. Clients may read their own matter's thread (it's their history).
export async function listTaskEvents(req, res) {
  try {
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const taskSnap = await taskRef.get();
    if (!taskSnap.exists) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role === 'client' && taskSnap.data().clientUid !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const snap = await taskRef.collection('events').orderBy('at', 'asc').get();
    let events = snap.docs.map((d) => d.data());

    const isClient = req.user.role === 'client';

    // E12-S02: clients get a CLIENT-SAFE feed — internal-only events (assignment,
    // approval gate, override) are dropped, and staff actor names are masked to a
    // generic label so we never expose individual team-member identities.
    if (isClient) {
      events = events.filter((e) => CLIENT_EVENT_WHITELIST.has(e.type));
    }

    // Resolve actor names in one batched pass (small N; dedupe uids). For clients
    // we skip the lookup entirely — staff actors are masked, the client sees self.
    const uids = isClient ? [] : [...new Set(events.map((e) => e.byUid).filter(Boolean))];
    const nameByUid = {};
    await Promise.all(uids.map(async (u) => {
      const us = await db.collection('users').doc(u).get();
      const d = us.exists ? us.data() : null;
      nameByUid[u] = d ? (d.name || d.fullName || d.email || 'User') : 'User';
    }));

    // Mask the actor for a client: their own actions read as "You"; everyone
    // else (staff, registrar, system) is collapsed to "Our team".
    const nameForClient = (e) =>
      e.byUid && e.byUid === req.user.uid ? 'You' : 'Our team';

    res.json({
      data: events.map((e) => ({
        type: e.type,
        comment: e.comment ?? null,
        fromStep: e.fromStep ?? null,
        toStep: e.toStep ?? null,
        // Internal role is hidden from clients; staff keep it for context.
        byRole: isClient ? null : (e.byRole ?? null),
        byName: isClient
          ? nameForClient(e)
          : (e.byUid ? (nameByUid[e.byUid] ?? 'User') : (e.byRole ?? 'System')),
        at: e.at ?? null,
      })),
    });
  } catch (err) {
    logger.error({ err }, 'listTaskEvents error:');
    res.status(500).json({ message: 'Failed to load activity' });
  }
}

// ─── PATCH /api/tasks/:taskId ──────────────────────────────────────────────
// Allowed updates (admin/manager): isUrgent, assignedTo (matter owner).
// Assigning a matter to a user makes the matter appear in that user's lists and
// routes its ACTIVE step to them (unless that step already has its own assignee),
// so the work shows up in their My Tasks immediately.
export async function patchTask(req, res) {
  try {
    const { role } = req.user;
    if (role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: admin or manager required' });
    }

    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const taskSnap = await taskRef.get();
    if (!taskSnap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = taskSnap.data();

    const update = {};
    if ('isUrgent' in req.body) update.isUrgent = req.body.isUrgent;

    // Matter-level assignment. null/'' clears it.
    let newAssignee; // undefined = not changing
    if ('assignedTo' in req.body) {
      newAssignee = req.body.assignedTo || null;
      if (newAssignee) {
        // Validate the assignee exists and is a STAFF user (never a client).
        const u = await db.collection('users').doc(newAssignee).get();
        if (!u.exists) return res.status(400).json({ message: 'Assignee not found' });
        if (u.data().role === 'client') {
          return res.status(400).json({ message: 'Cannot assign a matter to a client' });
        }
      }
      update.assignedTo = newAssignee;
    }

    if (!Object.keys(update).length) {
      return res.status(400).json({ message: 'No updatable fields provided' });
    }
    update.updatedAt = new Date().toISOString();

    const batch = db.batch();
    batch.set(taskRef, update, { merge: true });

    // Cascade the matter owner onto the ACTIVE step so it routes to them now —
    // but don't clobber a step that was explicitly delegated to someone else.
    if (newAssignee !== undefined) {
      const activeSnap = await taskRef.collection('steps')
        .where('status', '==', 'active').limit(1).get();
      if (!activeSnap.empty) {
        const stepRef = activeSnap.docs[0].ref;
        const stepData = activeSnap.docs[0].data();
        const stepOwnedByOther = stepData.assignedTo && stepData.assignedTo !== task.assignedTo;
        if (!stepOwnedByOther) {
          batch.set(stepRef, { assignedTo: newAssignee, updatedAt: update.updatedAt }, { merge: true });
        }
      }
    }

    await batch.commit();
    res.json({ success: true });
  } catch (err) {
    logger.error({ err: err }, 'patchTask error:');
    res.status(500).json({ message: 'Failed to update task' });
  }
}

// ─── PATCH /api/tasks/:taskId/steps/:stepId ────────────────────────────────
// stepId is the Firestore doc ID inside tasks/{taskId}/steps/{stepId}.
// Also supports updating the step inline if steps are stored as an array on the task doc.
export async function patchStep(req, res) {
  try {
    const { role } = req.user;
    if (role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: admin or manager required' });
    }

    const { taskId, stepId } = req.params;
    const { isUrgent, assignedTo } = req.body;

    // Try sub-collection approach first
    const stepRef = db.collection('tasks').doc(taskId).collection('steps').doc(stepId);
    const stepDoc = await stepRef.get();

    if (stepDoc.exists) {
      const prev = stepDoc.data();
      const now = new Date().toISOString();
      const update = { updatedAt: now };
      if (isUrgent !== undefined) update.isUrgent = isUrgent;
      // Assign/unassign this step to a specific staff user. `null`/'' clears it
      // (back to the shared/unassigned pool). Surfaced in the My Tasks worklist.
      const reassigning = assignedTo !== undefined && (assignedTo || null) !== (prev.assignedTo ?? null);
      if (assignedTo !== undefined) update.assignedTo = assignedTo || null;

      const batch = db.batch();
      batch.set(stepRef, update, { merge: true });

      // Record reassignment in the activity thread (E03-S02, direct model). The
      // change takes effect immediately — no acceptance needed — but is audited so
      // everyone can see who routed the step to whom.
      if (reassigning) {
        const nameFor = async (u) => {
          if (!u) return null;
          const s = await db.collection('users').doc(u).get();
          const d = s.exists ? s.data() : null;
          return d ? (d.name || d.fullName || d.email || 'User') : 'User';
        };
        const [fromName, toName] = await Promise.all([nameFor(prev.assignedTo), nameFor(update.assignedTo)]);
        const comment = update.assignedTo
          ? `Reassigned to ${toName}${prev.assignedTo ? ` (from ${fromName})` : ''}`
          : `Unassigned${prev.assignedTo ? ` (was ${fromName})` : ''}`;
        batch.set(db.collection('tasks').doc(taskId).collection('events').doc(), {
          type: 'STEP_REASSIGNED',
          fromStep: prev.stepNumber ?? parseInt(stepId, 10),
          toStep: prev.stepNumber ?? parseInt(stepId, 10),
          comment,
          byUid: req.user.uid ?? null,
          byRole: req.user.role ?? null,
          at: now,
        });
      }
      await batch.commit();
      return res.json({ success: true });
    }

    // Fallback: steps stored as array on task doc — update by stepNumber
    const taskRef = db.collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();
    if (!taskDoc.exists) return res.status(404).json({ message: 'Task not found' });

    const data = taskDoc.data();
    const steps = data.steps ?? [];
    const stepNumber = parseInt(stepId, 10);
    const idx = steps.findIndex((s) => s.stepNumber === stepNumber);
    if (idx === -1) return res.status(404).json({ message: 'Step not found' });

    if (isUrgent !== undefined) {
      steps[idx] = { ...steps[idx], isUrgent };
    }
    await taskRef.update({ steps, updatedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (err) {
    logger.error({ err: err }, 'patchStep error:');
    res.status(500).json({ message: 'Failed to update step' });
  }
}

// ─── POST /api/tasks/:taskId/transition ────────────────────────────────────
// Backend-AUTHORITATIVE step execution. The client sends an INTENT (an event);
// the backend rebuilds the workflow machine from the task's PINNED definition,
// resumes it at the task's current step, applies the event under the engine's
// guards (payment gates etc.), and persists the resulting state. Invalid moves
// are rejected. Body: { event: { type, ... } }.
export async function transitionTask(req, res) {
  try {
    const { role, uid } = req.user;
    const { taskId } = req.params;
    const { event } = req.body;

    const taskRef = db.collection('tasks').doc(taskId);
    const taskSnap = await taskRef.get();
    if (!taskSnap.exists) return res.status(404).json({ message: 'Task not found' });
    const task = taskSnap.data();

    // Authorization: admin/manager always; team_member only if assigned; clients
    // may only fire client-facing approval events on their own task.
    const isStaff = role === 'admin' || role === 'manager';
    const isAssignedTeam = role === 'team_member' && task.assignedTo === uid;
    const isOwnerClient = role === 'client' && task.clientUid === uid;
    const clientEvents = new Set(['CLIENT_APPROVE', 'CLIENT_REJECT']);
    if (!isStaff && !isAssignedTeam && !(isOwnerClient && clientEvents.has(event?.type))) {
      return res.status(403).json({ message: 'Not allowed to advance this task' });
    }

    // Load the task's PINNED definition (immutable per task), compile it, then
    // recompile with initial = current step so we resume exactly where we are.
    const compiled = await getCompiledById(task.workflowDefinitionId);
    if (!compiled) return res.status(409).json({ message: 'Workflow definition unavailable' });
    const resumed = compileDefinition({ ...compiled.definition, initialStep: task.currentStepNumber });

    const context = {
      taskId,
      clientUid: task.clientUid,
      workflowType: task.workflowDefinitionId,
      paymentStatus: task.paymentStatus ?? 'not_paid',
      currentStepNumber: task.currentStepNumber,
      completedSteps: [],
      activeParallelGroup: null,
      branchDecision: null,
      iterationCount: {},
      adminOverride: task.adminOverride === true,
    };

    const actor = createActor(resumed, { input: context });
    actor.start();
    const before = String(actor.getSnapshot().value);
    actor.send(event);
    const snap = actor.getSnapshot();
    const after = String(snap.value);
    actor.stop();

    // No state change AND not a payment event that mutated context → invalid move.
    const ctxChanged =
      snap.context.currentStepNumber !== task.currentStepNumber ||
      snap.context.paymentStatus !== context.paymentStatus ||
      snap.context.adminOverride !== context.adminOverride;
    if (before === after && !ctxChanged) {
      return res.status(400).json({ message: `Event '${event?.type}' is not valid in step ${task.currentStepNumber}` });
    }

    const newStep = snap.context.currentStepNumber;
    const isComplete = after === 'completed' || snap.status === 'done';

    // Persist task-level state.
    const taskUpdate = {
      currentStepNumber: newStep,
      paymentStatus: snap.context.paymentStatus,
      adminOverride: snap.context.adminOverride,
      status: isComplete ? 'completed' : 'active',
      updatedAt: new Date().toISOString(),
    };

    const now = new Date().toISOString();
    const comment = (event?.remark || event?.reason || '').toString().trim().slice(0, 2000) || null;

    // Update step statuses: mark the step we LEFT as completed (on a forward move),
    // and the step we landed on as active. Done in a batch with the task update.
    const batch = db.batch();
    batch.set(taskRef, taskUpdate, { merge: true });

    if (newStep !== task.currentStepNumber) {
      const leftRef = taskRef.collection('steps').doc(String(task.currentStepNumber));
      batch.set(leftRef, {
        status: 'completed',
        completedBy: uid ?? null,
        completedAt: now,
        ...(comment ? { remark: comment } : {}),
      }, { merge: true });
    } else if (comment) {
      // No step change (e.g. payment/override) — still record the comment on the step.
      const sameRef = taskRef.collection('steps').doc(String(task.currentStepNumber));
      batch.set(sameRef, { remark: comment }, { merge: true });
    }
    if (!isComplete) {
      const nextRef = taskRef.collection('steps').doc(String(newStep));
      batch.set(nextRef, { status: 'active' }, { merge: true });
    }

    // Forward JUMP over intermediate steps. Two reasons a step can be bypassed:
    //  - a payment GATE that auto-passed because payment was already satisfied →
    //    it was effectively completed, not skipped (it just didn't need action);
    //  - a conditional branch step that doesn't apply on this path (e.g. the
    //    resubmission steps 14–19 when Govt approves at 13) → genuinely skipped.
    const fromStep = task.currentStepNumber;
    if (newStep > fromStep + 1) {
      const typeByNum = new Map(compiled.definition.steps.map((s) => [s.stepNumber, s.type]));
      const between = await taskRef.collection('steps')
        .where('stepNumber', '>', fromStep)
        .where('stepNumber', '<', newStep)
        .get();
      between.forEach((d) => {
        if (d.data().status !== 'pending') return;
        const isGate = typeByNum.get(d.data().stepNumber) === 'payment_gate';
        batch.set(d.ref, isGate
          ? { status: 'completed', completedAt: now }
          : { status: 'skipped' }, { merge: true });
      });
    }

    // Append to the task's event history (audit trail of who did what, when).
    const eventRef = taskRef.collection('events').doc();
    batch.set(eventRef, {
      type: event?.type,
      branch: event?.branch ?? null,
      fromStep: task.currentStepNumber,
      toStep: newStep,
      comment,
      byUid: uid ?? null,
      byRole: role ?? null,
      at: now,
    });

    await batch.commit();

    // Return the refreshed task with steps.
    const stepsSnap = await taskRef.collection('steps').orderBy('stepNumber').get();
    res.json({
      id: taskId,
      ...task,
      ...taskUpdate,
      steps: stepsSnap.docs.map((s) => s.data()),
    });
  } catch (err) {
    logger.error({ err }, 'transitionTask error:');
    res.status(500).json({ message: 'Failed to advance task' });
  }
}

// ─── DELETE /api/tasks/:taskId ─────────────────────────────────────────────
// Admin-only. Deletes a matter and its subcollections (Firestore does NOT
// cascade): tasks/{id}/steps/* and tasks/{id}/events/* are removed first, then
// the task doc.
export async function deleteTask(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin required' });
    }
    const { taskId } = req.params;
    const taskRef = db.collection('tasks').doc(taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });

    let stepsDeleted = 0;
    let eventsDeleted = 0;
    for (const sub of ['steps', 'events']) {
      const subSnap = await taskRef.collection(sub).get();
      if (subSnap.empty) continue;
      // Batches cap at 500 writes; chunk to be safe for large event logs.
      for (let i = 0; i < subSnap.docs.length; i += 450) {
        const batch = db.batch();
        subSnap.docs.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
      if (sub === 'steps') stepsDeleted = subSnap.size;
      else eventsDeleted = subSnap.size;
    }

    await taskRef.delete();
    logger.info(`[deleteTask] Matter ${taskId} deleted (steps=${stepsDeleted}, events=${eventsDeleted})`);
    res.status(200).json({ id: taskId, deleted: true, stepsDeleted, eventsDeleted });
  } catch (err) {
    logger.error({ err }, 'deleteTask error:');
    res.status(500).json({ message: 'Failed to delete matter' });
  }
}
