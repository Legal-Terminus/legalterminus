import { db } from '../config/firebase.js';
import { logger } from "../config/logger.js";
import { getCompiledById } from '../services/workflowDefinitions.service.js';

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
    let query = db.collection('tasks')
      .where('status', 'in', ['pending', 'active', 'on_hold', 'pending_admin_approval']);

    if (startDate) query = query.where('createdAt', '>=', startDate);
    if (endDate)   query = query.where('createdAt', '<=', endDate);

    const snap = await query.get();
    const tasks = snap.docs.map((doc) => {
      const data = doc.data();
      // Classify pending reason from status, paymentStatus and task state.
      // `pending_admin_approval` (E03-S04) is its own bucket — the matter is held
      // for an approver, distinct from operational blockers.
      let pendingReason = 'government'; // default — waiting on external party
      if (data.status === 'pending_admin_approval') {
        pendingReason = 'approval';
      } else if (data.paymentStatus === 'not_paid' || data.paymentStatus === 'part_paid') {
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

// ─── GET /api/reports/payment-overrides ────────────────────────────────────
// #58: matters where Admin overrode payment — either the payment GATE was
// admin-overridden (`adminOverride === true`) or the matter was created with NO
// payment and approved into existence (`createdWithoutPayment === true`). Surfaced
// separately so finance can track/monitor matters progressing ahead of payment.
export async function getPaymentOverrides(req, res) {
  try {
    const snap = await db.collection('tasks').get();
    const rows = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((t) => t.adminOverride === true || t.createdWithoutPayment === true)
      .map((t) => ({
        taskId: t.id,
        clientName: t.clientName ?? t.clientUid ?? 'Unknown',
        serviceName: t.serviceName ?? t.workflowType ?? '',
        status: t.status ?? '',
        paymentStatus: t.paymentStatus ?? 'not_paid',
        amountPaid: t.amountPaid ?? 0,
        amountDue: t.amountDue ?? 0,
        // Why it's here: created without payment, gate-overridden, or both.
        overrideReason: t.createdWithoutPayment && t.adminOverride ? 'created_no_payment+gate_override'
          : t.createdWithoutPayment ? 'created_no_payment' : 'gate_override',
        updatedAt: t.updatedAt ?? '',
      }))
      .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, 'getPaymentOverrides report error:');
    res.status(500).json({ message: 'Failed to fetch payment-overrides report' });
  }
}

// ─── GET /api/reports/unassigned ────────────────────────────────────────────
// Active steps with NO assignee, across all in-flight matters — the shared pickup
// pool, surfaced for admin/manager to triage/assign. (Complements #50: those rows
// also appear as "Available" in each staff member's My Tasks.)
export async function getUnassignedTasks(req, res) {
  try {
    const snap = await db.collection('tasks').where('status', 'in', ['pending', 'active']).get();
    const rows = [];
    await Promise.all(snap.docs.map(async (taskDoc) => {
      const t = taskDoc.data();
      const active = await taskDoc.ref.collection('steps').where('status', '==', 'active').limit(1).get();
      if (active.empty) return;
      const step = active.docs[0].data();
      if (step.assignedTo) return; // assigned → not in the unassigned pool
      rows.push({
        taskId: taskDoc.id,
        clientName: t.clientName ?? t.clientUid ?? 'Unknown',
        serviceName: t.serviceName ?? t.workflowType ?? '',
        stepNumber: step.stepNumber,
        stepTitle: step.title ?? `Step ${step.stepNumber}`,
        assignedRole: step.assignedRole ?? null,
        dueAt: step.dueAt ?? null,
        isUrgent: !!t.isUrgent || !!step.isUrgent,
        updatedAt: t.updatedAt ?? '',
      });
    }));
    rows.sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0) || (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
    res.json(rows);
  } catch (err) {
    logger.error({ err }, 'getUnassignedTasks report error:');
    res.status(500).json({ message: 'Failed to fetch unassigned-tasks report' });
  }
}

// ─── GET /api/reports/professional-mapping ──────────────────────────────────
// #62: how many clients are handled under each professional / group company, with
// the client list per group, so the firm can track volume per professional/entity.
export async function getProfessionalMapping(req, res) {
  try {
    const snap = await db.collection('users').where('role', '==', 'client').get();
    const byProfessional = new Map();
    const byGroup = new Map();
    const bump = (map, key, client) => {
      const k = (key || '').trim() || '— Unassigned —';
      const e = map.get(k) ?? { name: k, count: 0, clients: [] };
      e.count += 1;
      e.clients.push(client);
      map.set(k, e);
    };
    snap.docs.forEach((d) => {
      const u = d.data();
      const client = { uid: d.id, name: u.name || u.fullName || u.email || d.id };
      bump(byProfessional, u.professionalName, client);
      bump(byGroup, u.groupCompany, client);
    });
    const sortDesc = (m) => [...m.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    res.json({
      totalClients: snap.size,
      byProfessional: sortDesc(byProfessional),
      byGroup: sortDesc(byGroup),
    });
  } catch (err) {
    logger.error({ err }, 'getProfessionalMapping report error:');
    res.status(500).json({ message: 'Failed to fetch professional-mapping report' });
  }
}

// ─── GET /api/reports/sla ──────────────────────────────────────────────────
// SLA / Delay report (E13-S04). Aggregates lateness across all in-flight matters:
//   1. `breaches[]` — every ACTIVE step that is overdue or at-risk (approaching
//      its dueAt), with service / phase / assignee / breach-age so management can
//      see where matters are slipping and click through to the matter.
//   2. `onTimeRate` — completed-step on-time-completion rate, summarised per
//      service and per phase (from each completed step's stored `onTime` flag).
//
// Lateness is read from the per-step `dueAt`/`completedAt`/`onTime` already
// stamped server-side (E13-S02) — this report only aggregates, never recomputes.
// Steps without a `dueAt` (no ETA configured) are excluded from breach detection
// and from the on-time denominator, so partial ETA coverage can't skew the rate.
export async function getSlaReport(req, res) {
  try {
    // `atRiskDays` (default 2): an active step whose dueAt is within this many days
    // (but not yet past) is reported as `at_risk`; past dueAt is `overdue`.
    const atRiskDays = Math.max(0, Number(req.query.atRiskDays ?? 2) || 0);
    const { serviceType, assignee } = req.query;
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;

    // In-flight matters only — completed/stopped/archived matters can't breach.
    let query = db.collection('tasks').where('status', 'in', ['pending', 'active', 'on_hold']);
    if (serviceType) query = query.where('workflowType', '==', serviceType);
    const snap = await query.get();

    // Caches so we resolve each definition / user once per request.
    const defCache = new Map();  // definitionId → { stepPhase: Map, phaseName: Map } | null
    const resolveDef = async (definitionId) => {
      if (!definitionId) return null;
      if (defCache.has(definitionId)) return defCache.get(definitionId);
      let meta = null;
      try {
        const compiled = await getCompiledById(definitionId);
        if (compiled?.definition) {
          const def = compiled.definition;
          const stepPhase = new Map((def.steps ?? []).map((s) => [s.stepNumber, s.phaseId ?? null]));
          const phaseName = new Map((def.phases ?? []).map((p) => [p.id, p.name]));
          meta = { stepPhase, phaseName };
        }
      } catch { /* non-fatal: report without phase grouping */ }
      defCache.set(definitionId, meta);
      return meta;
    };

    const userCache = new Map();
    const resolveUser = async (uid) => {
      if (!uid) return null;
      if (userCache.has(uid)) return userCache.get(uid);
      let name = uid;
      try {
        const u = await db.collection('users').doc(uid).get();
        if (u.exists) name = u.data().displayName ?? u.data().name ?? u.data().email ?? uid;
      } catch { /* fall back to uid */ }
      userCache.set(uid, name);
      return name;
    };

    const breaches = [];
    // Per-service / per-phase on-time tallies: key → { onTime, total }.
    const svcTally = new Map();
    const phaseTally = new Map();
    const bump = (map, key, label, wasOnTime) => {
      const e = map.get(key) ?? { key, label, onTime: 0, total: 0 };
      e.total += 1;
      if (wasOnTime) e.onTime += 1;
      map.set(key, e);
    };

    await Promise.all(snap.docs.map(async (taskDoc) => {
      const t = taskDoc.data();
      const definitionId = t.workflowType ?? null;
      const meta = await resolveDef(definitionId);
      const serviceKey = t.workflowType ?? 'unknown';
      const serviceLabel = t.serviceName ?? t.workflowType ?? 'Unknown service';

      const stepsSnap = await taskDoc.ref.collection('steps').get();
      for (const stepDoc of stepsSnap.docs) {
        const s = stepDoc.data();
        const phaseId = meta?.stepPhase.get(s.stepNumber) ?? null;
        const phaseLabel = (phaseId && meta?.phaseName.get(phaseId)) || 'Unphased';

        // (2) On-time tally from completed steps that had a due date.
        if (s.status === 'completed' && typeof s.onTime === 'boolean') {
          bump(svcTally, serviceKey, serviceLabel, s.onTime);
          bump(phaseTally, `${serviceKey}::${phaseId ?? 'none'}`, `${serviceLabel} — ${phaseLabel}`, s.onTime);
        }

        // (1) Breach detection on ACTIVE steps with a due date.
        if (s.status === 'active' && s.dueAt) {
          const due = new Date(s.dueAt).getTime();
          if (Number.isNaN(due)) continue;
          const daysLeft = Math.ceil((due - now) / DAY_MS);
          let severity = null;
          if (due < now) severity = 'overdue';
          else if (daysLeft <= atRiskDays) severity = 'at_risk';
          if (!severity) continue;

          const assigneeUid = s.assignedTo ?? t.assignedTo ?? null;
          if (assignee && assigneeUid !== assignee) continue;

          breaches.push({
            taskId: taskDoc.id,
            clientName: t.clientName ?? t.clientUid ?? 'Unknown',
            serviceType: serviceKey,
            serviceName: serviceLabel,
            stepNumber: s.stepNumber,
            stepTitle: s.title ?? `Step ${s.stepNumber}`,
            phaseId,
            phaseName: phaseLabel,
            assigneeUid,
            assigneeName: await resolveUser(assigneeUid),
            dueAt: s.dueAt,
            startedAt: s.startedAt ?? null,
            severity,                       // 'overdue' | 'at_risk'
            daysOverdue: severity === 'overdue' ? Math.ceil((now - due) / DAY_MS) : 0,
            daysLeft: severity === 'at_risk' ? daysLeft : 0,
            isUrgent: Boolean(t.isUrgent),
          });
        }
      }
    }));

    // Worst breaches first: overdue before at-risk, then by days overdue desc.
    breaches.sort((a, b) => {
      if (a.severity !== b.severity) return a.severity === 'overdue' ? -1 : 1;
      return b.daysOverdue - a.daysOverdue || b.daysLeft - a.daysLeft;
    });

    const toRate = (e) => ({ ...e, rate: e.total ? Math.round((e.onTime / e.total) * 100) : null });
    res.json({
      atRiskDays,
      breaches,
      summary: {
        overdue: breaches.filter((b) => b.severity === 'overdue').length,
        atRisk: breaches.filter((b) => b.severity === 'at_risk').length,
      },
      onTimeByService: [...svcTally.values()].map(toRate).sort((a, b) => a.label.localeCompare(b.label)),
      onTimeByPhase: [...phaseTally.values()].map(toRate).sort((a, b) => a.label.localeCompare(b.label)),
    });
  } catch (err) {
    logger.error({ err }, 'getSlaReport error:');
    res.status(500).json({ message: 'Failed to fetch SLA report' });
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
