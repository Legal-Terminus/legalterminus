import { db } from '../config/firebase.js';

// ─── GET /api/tasks ────────────────────────────────────────────────────────
export async function listTasks(req, res) {
  try {
    const { isUrgent, status, assignedTo } = req.query;
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

    query = query.orderBy('updatedAt', 'desc');
    const snap = await query.get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    console.error('listTasks error:', err);
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
    res.json({ id: doc.id, ...data });
  } catch (err) {
    console.error('getTask error:', err);
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
    console.error('patchTask error:', err);
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
    console.error('patchStep error:', err);
    res.status(500).json({ message: 'Failed to update step' });
  }
}
