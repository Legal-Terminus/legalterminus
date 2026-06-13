import { db } from '../config/firebase.js';
import { logger } from "../config/logger.js";

// ─── Helper: map Firestore doc → plain object ──────────────────────────────
function docToTask(doc) {
  return { id: doc.id, ...doc.data() };
}

// ─── GET /api/reports/all-tasks ────────────────────────────────────────────
export async function getAllTasks(req, res) {
  try {
    const { status, serviceType, teamMember, paymentStatus, startDate, endDate } = req.query;
    let query = db.collection('tasks');

    if (status)        query = query.where('status', '==', status);
    if (serviceType)   query = query.where('workflowType', '==', serviceType);
    if (teamMember)    query = query.where('assignedTo', '==', teamMember);
    if (paymentStatus) query = query.where('paymentStatus', '==', paymentStatus);
    if (startDate)     query = query.where('createdAt', '>=', startDate);
    if (endDate)       query = query.where('createdAt', '<=', endDate);

    query = query.orderBy('createdAt', 'desc');
    const snap = await query.get();
    res.json(snap.docs.map(docToTask));
  } catch (err) {
    logger.error({ err: err }, 'getAllTasks report error:');
    res.status(500).json({ message: 'Failed to fetch all-tasks report' });
  }
}

// ─── GET /api/reports/completed ────────────────────────────────────────────
export async function getCompletedTasks(req, res) {
  try {
    const { serviceType, teamMember, paymentStatus, startDate, endDate } = req.query;
    let query = db.collection('tasks').where('status', '==', 'completed');

    if (serviceType)   query = query.where('workflowType', '==', serviceType);
    if (teamMember)    query = query.where('assignedTo', '==', teamMember);
    if (paymentStatus) query = query.where('paymentStatus', '==', paymentStatus);
    if (startDate)     query = query.where('updatedAt', '>=', startDate);
    if (endDate)       query = query.where('updatedAt', '<=', endDate);

    query = query.orderBy('updatedAt', 'desc');
    const snap = await query.get();
    res.json(snap.docs.map(docToTask));
  } catch (err) {
    logger.error({ err: err }, 'getCompletedTasks report error:');
    res.status(500).json({ message: 'Failed to fetch completed-tasks report' });
  }
}

// ─── GET /api/reports/pending ──────────────────────────────────────────────
// Returns active tasks tagged with the primary reason they are blocked.
export async function getPendingTasks(req, res) {
  try {
    const { startDate, endDate } = req.query;
    let query = db.collection('tasks').where('status', 'in', ['pending', 'active', 'on_hold']);

    if (startDate) query = query.where('createdAt', '>=', startDate);
    if (endDate)   query = query.where('createdAt', '<=', endDate);

    const snap = await query.get();
    const tasks = snap.docs.map((doc) => {
      const data = doc.data();
      // Classify pending reason from paymentStatus and task state
      let pendingReason = 'government'; // default — waiting on external party
      if (data.paymentStatus === 'not_paid' || data.paymentStatus === 'part_paid') {
        pendingReason = 'payment';
      } else if (data.status === 'on_hold') {
        pendingReason = 'client_action';
      } else if (data.pendingReason) {
        pendingReason = data.pendingReason;
      }
      return { id: doc.id, ...data, pendingReason };
    });
    res.json(tasks);
  } catch (err) {
    logger.error({ err: err }, 'getPendingTasks report error:');
    res.status(500).json({ message: 'Failed to fetch pending-tasks report' });
  }
}

// ─── GET /api/reports/master-sheet ────────────────────────────────────────
export async function getMasterSheet(req, res) {
  try {
    const { format, startDate, endDate } = req.query;
    let query = db.collection('tasks').orderBy('updatedAt', 'desc');

    if (startDate) query = query.where('updatedAt', '>=', startDate);
    if (endDate)   query = query.where('updatedAt', '<=', endDate);

    const snap = await query.get();

    // Resolve client names in parallel
    const clientCache = new Map();
    const resolveClient = async (uid) => {
      if (!uid) return 'Unknown';
      if (clientCache.has(uid)) return clientCache.get(uid);
      try {
        const userDoc = await db.collection('users').doc(uid).get();
        const name = userDoc.exists ? (userDoc.data().displayName ?? userDoc.data().name ?? uid) : uid;
        clientCache.set(uid, name);
        return name;
      } catch {
        return uid;
      }
    };

    const rows = await Promise.all(
      snap.docs.map(async (doc) => {
        const d = doc.data();
        // Prefer the denormalized count (steps now live in a subcollection);
        // fall back to legacy inline steps[] length.
        const totalSteps = d.totalSteps ?? d.steps?.length ?? 0;
        return {
          taskId: doc.id,
          clientName: await resolveClient(d.clientUid),
          serviceType: d.workflowType ?? '',
          currentStep: d.currentStepNumber ?? 0,
          totalSteps,
          assignedTo: d.assignedTo ?? '',
          paymentStatus: d.paymentStatus ?? 'not_paid',
          amountPaid: d.amountPaid ?? 0,
          amountDue: d.amountDue ?? 0,
          lastUpdated: d.updatedAt ?? '',
          taskStatus: d.status ?? '',
        };
      })
    );

    if (format === 'csv') {
      const headers = [
        'Task ID', 'Client', 'Service', 'Step', 'Total Steps',
        'Assigned To', 'Payment Status', 'Amount Paid', 'Amount Due',
        'Status', 'Last Updated',
      ];
      const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const csvLines = [
        headers.join(','),
        ...rows.map((r) =>
          [
            r.taskId, r.clientName, r.serviceType, r.currentStep, r.totalSteps,
            r.assignedTo, r.paymentStatus, r.amountPaid, r.amountDue,
            r.taskStatus, r.lastUpdated,
          ]
            .map(escape)
            .join(',')
        ),
      ];
      const csv = csvLines.join('\r\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="master-sheet.csv"');
      return res.send(csv);
    }

    res.json(rows);
  } catch (err) {
    logger.error({ err: err }, 'getMasterSheet error:');
    res.status(500).json({ message: 'Failed to fetch master sheet' });
  }
}
