import { db } from '../config/firebase.js';
import { logger } from "../config/logger.js";
import { getCompiledForServiceKey } from '../services/workflowDefinitions.service.js';

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

    // Verify the client exists and resolve a display name.
    const clientDoc = await db.collection('users').doc(clientUid).get();
    if (!clientDoc.exists) return res.status(404).json({ message: 'Client not found' });
    const c = clientDoc.data();
    const clientName = c.name || c.fullName || c.email || 'Client';

    const firstStep = definition.initialStep;

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
      status: 'pending',
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
    for (const s of stepDefs) {
      batch.set(ref.collection('steps').doc(String(s.stepNumber)), {
        stepNumber: s.stepNumber,
        title: s.title,
        assignedRole: s.assignedRole ?? null,
        status: s.stepNumber === firstStep ? 'active' : 'pending',
      });
    }
    await batch.commit();

    const steps = stepDefs.map((s) => ({
      stepNumber: s.stepNumber,
      title: s.title,
      status: s.stepNumber === firstStep ? 'active' : 'pending',
    }));
    res.status(201).json({ id: ref.id, ...task, steps });
  } catch (err) {
    logger.error({ err }, 'createTask error:');
    res.status(500).json({ message: 'Failed to create task' });
  }
}

// ─── GET /api/tasks ────────────────────────────────────────────────────────
// Paginated + role-scoped. Filters (status/assignedTo/isUrgent) combined with
// orderBy(updatedAt) require composite indexes — see firestore.indexes.json.
// Returns { data, nextCursor }.
export async function listTasks(req, res) {
  try {
    const { isUrgent, status, assignedTo, limit = 25, cursor } = req.query;
    let query = db.collection('tasks');

    const { role, uid } = req.user;

    // Clients can only see their own tasks
    if (role === 'client') {
      query = query.where('clientUid', '==', uid);
    }
    // Team members only see tasks assigned to them
    if (role === 'team_member') {
      query = query.where('assignedTo', '==', uid);
    }

    if (status)           query = query.where('status', '==', status);
    if (assignedTo && role !== 'team_member') query = query.where('assignedTo', '==', assignedTo);
    if (isUrgent === 'true') query = query.where('isUrgent', '==', true);

    query = query.orderBy('updatedAt', 'desc').limit(limit);
    if (cursor) {
      const cursorDoc = await db.collection('tasks').doc(cursor).get();
      if (cursorDoc.exists) query = query.startAfter(cursorDoc);
    }

    const snap = await query.get();
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const nextCursor = data.length === limit ? snap.docs[snap.docs.length - 1].id : null;
    res.json({ data, nextCursor });
  } catch (err) {
    logger.error({ err: err }, 'listTasks error:');
    res.status(500).json({ message: 'Failed to list tasks' });
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

    res.json({ id: doc.id, ...data, steps });
  } catch (err) {
    logger.error({ err: err }, 'getTask error:');
    res.status(500).json({ message: 'Failed to get task' });
  }
}

// ─── PATCH /api/tasks/:taskId ──────────────────────────────────────────────
// Allowed updates: isUrgent (admin/manager only). Extend later as needed.
export async function patchTask(req, res) {
  try {
    const { role } = req.user;
    if (role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: admin or manager required' });
    }

    const allowed = ['isUrgent'];
    const update = {};
    allowed.forEach((k) => { if (k in req.body) update[k] = req.body[k]; });
    if (!Object.keys(update).length) {
      return res.status(400).json({ message: 'No updatable fields provided' });
    }
    update.updatedAt = new Date().toISOString();

    await db.collection('tasks').doc(req.params.taskId).update(update);
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
    const { isUrgent } = req.body;

    // Try sub-collection approach first
    const stepRef = db.collection('tasks').doc(taskId).collection('steps').doc(stepId);
    const stepDoc = await stepRef.get();

    if (stepDoc.exists) {
      const update = { updatedAt: new Date().toISOString() };
      if (isUrgent !== undefined) update.isUrgent = isUrgent;
      await stepRef.update(update);
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
