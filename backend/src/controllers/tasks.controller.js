import { createActor } from 'xstate';
import { db, getBucket } from '../config/firebase.js';
import { logger } from "../config/logger.js";
import { getCompiledForServiceKey, getCompiledById } from '../services/workflowDefinitions.service.js';
import { loadPhaseAssignments } from './workflowDefinitions.controller.js';
import { createNotification, resolveNotificationsForTask } from './notifications.controller.js';
import { finalizeMatterDocuments } from './documents.controller.js';
import { sendTemplatedEmail } from '../services/emailService.js';
import { renderTemplate } from '../services/emailTemplates.service.js';
import { sanitizeRichText, richTextToPlain } from '../services/richText.service.js';
import { compileDefinition } from '../../../shared/workflows/compileDefinition.js';
import { validateDefinition, deriveOwnerType, CLIENT_ASSIGNEE, materialisableSteps, isTerminalStep } from '../../../shared/workflows/definitionSchema.js';

// ─── ETA / due-date helpers (E13-S02) ──────────────────────────────────────
// Add `days` (may be fractional) to an ISO instant, returning an ISO string.
function addDaysIso(iso, days) {
  if (days == null || !Number.isFinite(days)) return null;
  return new Date(new Date(iso).getTime() + days * 86_400_000).toISOString();
}

// Default ETA (days) applied to any step whose definition doesn't set one, so
// every step — and therefore every matter — has a projected due date.
const DEFAULT_STEP_ETA_DAYS = 2;

// A step's ETA in days. Uses the definition's `typicalDurationDays` when present,
// otherwise falls back to the 2-day default.
function etaDaysOf(stepDef) {
  return typeof stepDef?.typicalDurationDays === 'number'
    ? stepDef.typicalDurationDays
    : DEFAULT_STEP_ETA_DAYS;
}

// Projected whole-matter completion: `from` + the sum of ETAs of the steps that
// still lie ahead (current step included). Every step has an ETA (its configured
// value or the 2-day default), so this always projects a date.
function projectMatterDueAt(stepDefs, fromStepNumber, fromIso) {
  // #140/#55: `stepDefs` arrives in the definition's AUTHORED (flow) order —
  // "remaining work" = the current step and everything AFTER it in that order.
  // Identity numbers aren't flow-ordered, so a numeric comparison over- or
  // under-counted the remaining ETAs. Falls back to the numeric filter only if
  // the current step isn't in the definition (legacy/defensive).
  let total = 0;
  let any = false;
  let reached = false;
  const present = stepDefs.some((s) => s.stepNumber === fromStepNumber);
  for (const s of stepDefs) {
    if (present) {
      if (s.stepNumber === fromStepNumber) reached = true;
      if (!reached) continue;
    } else if (s.stepNumber < fromStepNumber) continue;
    total += etaDaysOf(s);
    any = true;
  }
  return any ? addDaysIso(fromIso, total) : null;
}

// ─── Assignee name resolution (#48) ─────────────────────────────────────────
// Resolve a set of user UIDs → display names in one batched pass (deduped). The
// frontend showed "Unassigned" for team members because it derived the name from
// a staff list it only fetches for admins/managers; returning the name from the
// API removes that client-side dependency entirely.
/**
 * #149: clean a matter's CC list. Lowercases, trims, de-duplicates and drops the
 * primary (To) address, so a recipient can never appear as both To and CC.
 * Returns [] for an empty/absent list — the stored shape is always an array.
 */
function dedupeCcEmails(list, primaryEmail) {
  const primary = String(primaryEmail ?? '').trim().toLowerCase();
  const seen = new Set();
  const out = [];
  for (const raw of list ?? []) {
    const addr = String(raw ?? '').trim().toLowerCase();
    if (!addr || addr === primary || seen.has(addr)) continue;
    seen.add(addr);
    out.push(addr);
  }
  return out;
}

async function resolveUserNames(uids) {
  const unique = [...new Set(uids.filter(Boolean))];
  const byUid = {};
  await Promise.all(unique.map(async (uid) => {
    try {
      const u = await db.collection('users').doc(uid).get();
      const d = u.exists ? u.data() : null;
      byUid[uid] = d ? (d.displayName || d.name || d.fullName || d.email || 'User') : null;
    } catch { byUid[uid] = null; }
  }));
  return byUid;
}

// #164: `clientName` is a SNAPSHOT written at creation, so a matter created
// before the field existed (or whose client was renamed/removed since) carries an
// empty name and the list rendered the literal "Unknown client". Backfill the
// missing ones live from `clientUid` in one batched pass; genuinely unresolvable
// clients keep an empty name so the UI can show its own placeholder.
async function backfillClientNames(rows) {
  const missing = rows.filter((t) => !t.clientName && t.clientUid);
  if (missing.length === 0) return rows;
  const byUid = await resolveUserNames(missing.map((t) => t.clientUid));
  for (const t of missing) {
    const name = byUid[t.clientUid];
    if (name) t.clientName = name;
  }
  return rows;
}

// ─── Notifications (E07-S01) ────────────────────────────────────────────────
// Fire-and-forget in-app notification. NEVER let a notification failure break the
// workflow action that triggered it — we log and move on. Skips self-notification
// (don't ping someone for their own action) and empty recipients.
async function notify({ recipientUid, actorUid, type = 'info', title, message, taskId, stepNumber }) {
  try {
    if (!recipientUid || recipientUid === actorUid) return;
    await createNotification({ recipientUid, type, title, message, taskId, stepNumber });
  } catch (err) {
    logger.warn({ err: err?.message }, 'notify: failed to create notification');
  }
}

// All admin UIDs — recipients for "needs approval" notifications. Best-effort.
async function adminUids() {
  try {
    const snap = await db.collection('users').where('role', '==', 'admin').get();
    return snap.docs.map((d) => d.id);
  } catch (err) {
    logger.warn({ err: err?.message }, 'adminUids lookup failed');
    return [];
  }
}

// ─── Client-view projection (E12) ──────────────────────────────────────────
// Clients must never receive INTERNAL operational data: who on our team owns a
// matter/step, internal-only activity, or actor names of staff. We strip this
// server-side (defense in depth — not just hiding it in the UI) so the API
// cannot leak it regardless of the caller. Staff get the full payload unchanged.

// Internal step fields a client should never see (assignment/audit metadata).
// #137/#115: `remark` mirrors the completing transition's comment. The EVENT feed
// masks comments that aren't client-visible (fail closed), but the raw remark on
// the step record bypassed that — so it must never reach the client either. The
// client sees a comment only via the (filtered) event feed.
const CLIENT_STEP_HIDDEN = ['assignedTo', 'assignedRole', 'completedBy', 'isUrgent', 'remark'];

/**
 * #166 — the client identity a request acts as.
 *
 * A client organisation can have several logins (a partner, a team member). Each
 * gets its OWN Firebase Auth account so passwords and audit trails stay separate,
 * with `primaryClientUid` pointing at the account that owns the matters. Matter
 * ownership is always keyed on that primary uid, so every `clientUid` comparison
 * must go through here rather than using `req.user.uid` directly.
 *
 * A primary client has no `primaryClientUid` and simply resolves to itself.
 */
export function clientScopeUid(user) {
  return user?.primaryClientUid || user?.uid;
}

/**
 * #168 — may this professional see this matter? Explicit allowlist only: being
 * the client's referrer grants nothing on its own, so a professional named on
 * Matter 2 cannot reach Matters 1, 3 or 4 of the same client.
 */
export function professionalCanSee(task, uid) {
  return Array.isArray(task?.accessProfessionalUids)
    && task.accessProfessionalUids.includes(uid);
}

/**
 * #168 — validate a requested professional allowlist.
 *
 * Every uid must exist AND hold the `professional` role. Granting access to a
 * staff or client account here would hand it a second, unaudited route into the
 * matter, so a wrong uid is a 400 rather than a silent no-op. Returns
 * `{ uids }` on success or `{ error }` for the caller to surface.
 */
async function resolveAccessProfessionals(uids) {
  if (uids === undefined) return { uids: [] };
  const unique = [...new Set((uids ?? []).filter(Boolean))];
  if (unique.length === 0) return { uids: [] };

  const snaps = await Promise.all(
    unique.map((u) => db.collection('users').doc(u).get()),
  );
  for (let i = 0; i < snaps.length; i++) {
    if (!snaps[i].exists) return { error: `Professional not found: ${unique[i]}` };
    if (snaps[i].data().role !== 'professional') {
      return { error: `User ${unique[i]} is not a professional and cannot be granted matter access.` };
    }
  }
  return { uids: unique };
}

// Strip internal ownership/assignment from a task + its steps for a client, and
// (when a visibility set is supplied) DROP steps the workflow marks as not
// client-visible (`clientVisible === false` on the definition step). When no set
// is given, all steps are kept (back-compat / staff projection).
function projectTaskForClient(task, view = null) {
  const visibleStepNumbers = view?.visible ?? null;
  // #149: ccEmails is staff configuration (who gets copied on this matter's mail)
  // — not the client's to enumerate, so it is stripped alongside the other
  // internal fields.
  const { assignedTo, createdBy, isUrgent, adminOverride, ccEmails, ...safe } = task;
  if (Array.isArray(safe.steps)) {
    safe.steps = safe.steps
      .filter((s) => !visibleStepNumbers || visibleStepNumbers.has(s.stepNumber))
      // #90: admin-approval steps (assignedRole === 'admin') are internal controls —
      // never surface them to the client.
      .filter((s) => s.assignedRole !== 'admin')
      .map((s) => {
        const copy = { ...s };
        // #103: the client sees the client-facing step name when one is set,
        // falling back to the internal title. clientTitle itself is then dropped.
        if (copy.clientTitle) copy.title = copy.clientTitle;
        delete copy.clientTitle;
        for (const k of CLIENT_STEP_HIDDEN) delete copy[k];
        return copy;
      });
  }
  // #139: while the matter sits on a step hidden from the client ("Show to
  // Client" off), the client keeps seeing the LAST visible step before it (in
  // AUTHORED order) as the current, in-progress step — until the flow reaches the
  // next visible one. `currentStepFallback` tells the UI to render that step
  // without action buttons (it is not truly actionable).
  // #141: NEVER on a finished matter — presenting the last visible step as
  // "active" after completion showed the final step as In Progress forever. On a
  // terminal status every step keeps its real (completed) state.
  const terminal = ['completed', 'cancelled', 'archived', 'rejected'].includes(safe.status);
  if (
    !terminal
    && visibleStepNumbers && Array.isArray(view?.authored)
    && typeof safe.currentStepNumber === 'number'
    && !visibleStepNumbers.has(safe.currentStepNumber)
  ) {
    const idx = view.authored.indexOf(safe.currentStepNumber);
    if (idx !== -1) {
      // #144: if NOTHING client-visible remains ahead, the client's journey is
      // genuinely over — only internal wrap-up (e.g. the final master-sheet
      // update) is left. Reactivating the last visible step here would show it
      // as "In Progress" forever, which is exactly the #141 symptom arriving
      // through a different door. Leave every step in its real (completed)
      // state so the client's timeline simply ends.
      const moreVisibleAhead = view.authored
        .slice(idx + 1)
        .some((n) => visibleStepNumbers.has(n));
      if (moreVisibleAhead) {
        for (let i = idx - 1; i >= 0; i--) {
          const n = view.authored[i];
          if (visibleStepNumbers.has(n)) {
            safe.currentStepNumber = n;
            safe.currentStepFallback = true;
            if (Array.isArray(safe.steps)) {
              safe.steps = safe.steps.map((s) =>
                s.stepNumber === n ? { ...s, status: 'active' } : s);
            }
            break;
          }
        }
      }
    }
  }
  return safe;
}

// Build the set of client-visible step numbers for a task's pinned workflow.
// A step is visible unless its definition explicitly sets clientVisible === false
// (default-visible preserves behavior for workflows authored before the flag).
// Returns null if the definition can't be loaded (→ caller keeps all steps).
async function clientVisibleStepSet(task) {
  try {
    const compiled = await getCompiledById(task.workflowDefinitionId);
    const steps = compiled?.definition?.steps;
    if (!Array.isArray(steps)) return null;
    return {
      visible: new Set(steps.filter((s) => s.clientVisible !== false).map((s) => s.stepNumber)),
      // #139: authored (flow) order — used to fall back to the LAST visible step
      // while the matter sits on a hidden one.
      authored: steps.map((s) => s.stepNumber),
    };
  } catch {
    return null;
  }
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
  'STEP_NOTE', // #105: a client-visible note the team posted onto a step
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

    // Body validated by taskCreateSchema (incl. #51 payment fields).
    const { clientUid, serviceKey, serviceName, organisation, ccEmails,
            paymentStatus = 'not_paid', totalCost, amountReceived, paymentMode, paymentDescription,
            professionalUid, accessProfessionalUids } = req.body;

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

    // #85: optional handling professional — must be a STAFF user (never a client).
    // Snapshot the name for display/exports; store the UID as the stable ref.
    // #168: validate every granted professional exists and actually holds the
    // `professional` role — a stray uid here would silently grant nothing, or
    // worse, grant a staff/client account an unintended view.
    const accessUids = await resolveAccessProfessionals(accessProfessionalUids);
    if (accessUids.error) return res.status(400).json({ message: accessUids.error });

    let professional = { professionalUid: null, professionalName: null };
    if (professionalUid) {
      const pDoc = await db.collection('users').doc(professionalUid).get();
      if (!pDoc.exists) return res.status(400).json({ message: 'Professional not found' });
      const p = pDoc.data();
      if (p.role === 'client') return res.status(400).json({ message: 'Professional must be a staff user' });
      professional = { professionalUid, professionalName: p.name || p.fullName || p.email || null };
    }

    const firstStep = definition.initialStep;

    // Per-phase default assignees (E11-S02): pre-route each step to the person
    // configured for its phase, so work lands in the right "My Tasks" with no
    // manual assignment. Map is phaseId → uid; steps in unconfigured phases stay
    // in the shared pool. Validation (staff-only, phase exists) happened on write.
    // A step's own `defaultAssigneeUid` (configured in Workflow Settings) wins
    // over the phase-level default; steps with neither stay in the shared pool.
    const phaseAssignees = await loadPhaseAssignments(definition.id);
    // #46: resolve a step's default assignee. The CLIENT_ASSIGNEE sentinel (set on
    // the step or its phase) resolves to THIS matter's client. As a fallback, any
    // client-owned step (e.g. CLIENT_APPROVE) with no explicit assignee auto-routes
    // to the client too. Otherwise: step default → phase default → unassigned.
    const assigneeForStep = (s) => {
      const configured = s.defaultAssigneeUid || (s.phaseId && phaseAssignees[s.phaseId]) || null;
      if (configured === CLIENT_ASSIGNEE) return clientUid;
      if (configured) return configured;
      if (deriveOwnerType(s) === 'client') return clientUid; // auto-assign client steps
      return null;
    };

    // Approval gate: matter creation does NOT require admin approval in general
    // (#47 — the old manager-created-needs-approval rule from E03-S04 is removed).
    // The ONE remaining case that still routes to the admin approval box is a matter
    // created with NO PAYMENT (#51): admin can override-approve or keep it on hold.
    // Any paid matter (manager- or admin-created) activates immediately. While
    // pending, the first step is held `pending` so no work starts / it stays out of
    // "My Tasks" until approved.
    const noPaymentNeedsApproval = paymentStatus === 'not_paid';
    const needsApproval = noPaymentNeedsApproval;
    const initialStatus = needsApproval ? 'pending_admin_approval' : 'pending';

    // #51 payment capture: mirror the chosen amounts into the matter's payment
    // fields (which the Payment module reads). amountDue = totalCost − received.
    const received = typeof amountReceived === 'number' ? amountReceived : 0;
    const cost = typeof totalCost === 'number' ? totalCost : received;
    const amountDue = Math.max(0, cost - received);

    // #94: if the FIRST step is a payment gate and the matter is created already
    // (part- or fully-)paid, the gate's `always` transition should pass on creation
    // — otherwise the matter is stranded on step 1 "Waiting for payment to be
    // recorded" until someone manually re-records payment. Creation previously
    // hard-wrote `definition.initialStep`; instead RUN the compiled machine with
    // the initial payment status in context and take the SETTLED step (the `always`
    // gates fire on actor.start()). Only applies to active (not approval-pending)
    // matters; a no-payment matter stays pending_admin_approval on step 1 as before.
    let resolvedFirstStep = firstStep;
    if (!needsApproval) {
      try {
        const machine = compileDefinition(definition);
        const actor = createActor(machine, {
          input: {
            taskId: null,
            clientUid,
            workflowType: definition.id,
            paymentStatus,
            currentStepNumber: firstStep,
            completedSteps: [],
            activeParallelGroup: null,
            branchDecision: null,
            iterationCount: {},
            adminOverride: false,
          },
        });
        actor.start();
        const settled = actor.getSnapshot().context.currentStepNumber;
        actor.stop();
        if (typeof settled === 'number') resolvedFirstStep = settled;
      } catch (e) {
        logger.warn({ err: e?.message }, 'createTask: initial gate resolution skipped (using initialStep)');
      }
    }

    // Per-step INSTANCE state, built from the definition's EXPLICIT step identity
    // (no regex parsing). Stored in a SUBCOLLECTION (tasks/{id}/steps/{stepNumber})
    // so independent step updates never race on a whole-array overwrite.
    const stepDefs = materialisableSteps(definition.steps);

    const now = new Date().toISOString();
    // Due-date projection (E13-S02). Only start the clock when work actually
    // starts: an admin-created matter is active now; a manager-created one waits
    // for approval, so its due dates are stamped at approval time instead. Project
    // from the RESOLVED step (#94) — a payment gate that auto-passes on creation
    // leaves the matter on a later step.
    const firstStepDef = stepDefs.find((s) => s.stepNumber === resolvedFirstStep);
    const firstStepEta = etaDaysOf(firstStepDef);
    const matterDueAt = needsApproval ? null : projectMatterDueAt(stepDefs, resolvedFirstStep, now);

    const task = {
      // Workflow identity: definition + pinned version (NOT the service key).
      workflowDefinitionId: definition.id,
      workflowVersion: definition.version ?? 1,
      workflowType: definition.id, // back-compat for reports/list display
      serviceKey,
      serviceName: serviceName || definition.name || serviceKey,
      clientUid,
      clientName,
      // #104: organisation is entered per-matter at creation (a client can have
      // several orgs). Stored ON the matter and used in all its email subjects.
      // Falls back to the client profile's organisation when not supplied.
      organisation: (organisation && organisation.trim()) || c.organisation || null,
      // #149: additional recipients for this matter. The client's own address is
      // always the To; these ride along as CC on every automated email. The
      // client's own address is filtered out so nobody is both To and CC.
      ccEmails: dedupeCcEmails(ccEmails, c.email),
      assignedTo: null,
      professionalUid: professional.professionalUid, // #85
      professionalName: professional.professionalName, // #85 (snapshot for display/reports)
      // #168: allowlist of EXTERNAL professionals with view-only access to this
      // matter. Distinct from professionalUid above (the internal staff handler).
      accessProfessionalUids: accessUids.uids,
      status: initialStatus,
      paymentStatus,
      amountPaid: received,
      amountDue,
      totalCost: cost,
      paymentMode: paymentMode ?? null,
      // #147: how the payment arrived, when split across modes. Free text, optional.
      paymentDescription: paymentDescription || null,
      // #51: matters created with no payment require admin approval before going live.
      createdWithoutPayment: noPaymentNeedsApproval,
      isUrgent: false,
      currentStepNumber: resolvedFirstStep, // #94: after any creation-time gate auto-pass
      totalSteps: stepDefs.length, // denormalized count for list/report display
      matterDueAt, // projected completion (E13-S02); null while pending approval/untracked
      createdAt: now,
      updatedAt: now,
      createdBy: req.user.uid ?? null,
    };

    // Atomically create the task doc + its step subcollection.
    const ref = db.collection('tasks').doc();
    const batch = db.batch();
    batch.set(ref, task);
    // Step statuses at creation:
    //  - pending approval → every step stays `pending` (no work starts);
    //  - #94: any step the creation-time gate AUTO-PASSED (< resolvedFirstStep) is
    //    marked `completed` (e.g. the step-1 payment gate on a part/fully-paid
    //    matter), so the matter opens cleanly on the resolved step;
    //  - the resolved step is `active`; later steps `pending`.
    const statusForStep = (n) => {
      if (needsApproval) return 'pending';
      if (n < resolvedFirstStep) return 'completed';
      if (n === resolvedFirstStep) return 'active';
      return 'pending';
    };
    for (const s of stepDefs) {
      const isActive = s.stepNumber === resolvedFirstStep && !needsApproval;
      batch.set(ref.collection('steps').doc(String(s.stepNumber)), {
        stepNumber: s.stepNumber,
        title: s.title,
        // #103: separate client-facing step name (falls back to the internal title
        // when unset). Stamped at creation so the client's matter shows it.
        clientTitle: s.clientTitle ?? null,
        assignedRole: s.assignedRole ?? null,
        assignedTo: assigneeForStep(s),
        status: statusForStep(s.stepNumber),
        ...(s.stepNumber < resolvedFirstStep && !needsApproval ? { completedAt: now } : {}),
        // ETA clock (E13-S02): only the active resolved step gets a running due date.
        ...(isActive ? { startedAt: now, dueAt: addDaysIso(now, firstStepEta) } : {}),
      });
    }
    await batch.commit();

    // Notifications (E07-S01). A manager-created matter pings admins to approve;
    // an active matter pings the first step's pre-assigned owner that work is theirs.
    // #109: internal notification copy comes from EDITABLE templates.
    if (needsApproval) {
      const admins = await adminUids();
      const t = await renderTemplate('approval_needed', {
        clientName, organisation: task.organisation ?? '', serviceName: task.serviceName,
      });
      await Promise.all(admins.map((a) => notify({
        recipientUid: a, actorUid: req.user.uid, type: 'warning',
        title: t?.subject || 'Matter awaiting your approval',
        message: t?.body || `${clientName} · ${task.serviceName} was created and needs admin approval.`,
        taskId: ref.id,
      })));
    } else {
      const firstAssignee = assigneeForStep(firstStepDef ?? {});
      // #106/#103: when the FIRST step is client-owned the recipient is the
      // client — use the step's custom client prompt (and client-facing name),
      // not internal staff wording.
      const firstIsClientOwned = firstAssignee === clientUid;
      if (firstIsClientOwned) {
        const title = (firstStepDef?.clientPromptTitle ?? '').trim() || 'Action needed on your service';
        const message = (firstStepDef?.clientPromptMessage ?? '').trim()
          || `${task.serviceName}: ${firstStepDef?.clientTitle || firstStepDef?.title || `Step ${resolvedFirstStep}`}`;
        await notify({ recipientUid: firstAssignee, actorUid: req.user.uid, type: 'info', title, message, taskId: ref.id });
      } else {
        // #109: internal "step assigned" copy from the editable template.
        const t = await renderTemplate('step_assigned', {
          clientName, serviceName: task.serviceName,
          stepName: firstStepDef?.title ?? `Step ${resolvedFirstStep}`,
        });
        await notify({
          recipientUid: firstAssignee, actorUid: req.user.uid, type: 'info',
          title: t?.subject || 'New step assigned to you',
          message: t?.body || `${clientName} · ${task.serviceName}: ${firstStepDef?.title ?? `Step ${resolvedFirstStep}`}`,
          taskId: ref.id,
        });
      }
    }

    // #108: send the CLIENT a "matter created" confirmation email (editable
    // template). Fire-and-forget; never blocks creation. Uses the matter's
    // organisation + service in the subject.
    try {
      const clientEmail = c.email || (Array.isArray(c.emailIds) ? c.emailIds[0] : null);
      if (clientEmail) {
        const rendered = await renderTemplate('matter_created', {
          clientName, organisation: task.organisation ?? '', serviceName: task.serviceName,
          portalUrl: (process.env.FRONTEND_URL || '').replace(/\/$/, '') + '/portal/',
        });
        if (rendered) {
          await sendTemplatedEmail({
            to: clientEmail,
            cc: task.ccEmails, // #149: additional recipients for this matter
            subject: rendered.subject, body: rendered.body,
            taskId: ref.id, serviceName: task.serviceName, organisation: task.organisation ?? undefined,
          });
        }
      }
    } catch (e) {
      logger.warn({ err: e?.message }, '[EMAIL] matter-created email failed');
    }

    const steps = stepDefs.map((s) => ({
      stepNumber: s.stepNumber,
      title: s.title,
      status: statusForStep(s.stepNumber),
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

    // Start the ETA clock now (E13-S02): approval is when a manager-created matter
    // actually begins, so the first step's due date and the matter projection are
    // stamped here (they were deferred at creation). Best-effort: if the pinned
    // definition can't be loaded, fall back to no due dates rather than failing.
    let matterDueAt = null;
    let firstDueAt = null;
    try {
      const compiled = await getCompiledById(task.workflowDefinitionId);
      if (compiled) {
        const stepDefs = materialisableSteps(compiled.definition.steps);
        const firstDef = stepDefs.find((s) => s.stepNumber === task.currentStepNumber);
        firstDueAt = addDaysIso(now, etaDaysOf(firstDef));
        matterDueAt = projectMatterDueAt(stepDefs, task.currentStepNumber, now);
      }
    } catch (e) {
      logger.warn({ err: e?.message }, 'approveTask: ETA stamping skipped (definition unavailable)');
    }

    const batch = db.batch();
    batch.set(taskRef, { status: 'active', updatedAt: now, matterDueAt }, { merge: true });
    // Activate the current (first) step so work can begin, and start its clock.
    batch.set(
      taskRef.collection('steps').doc(String(task.currentStepNumber)),
      { status: 'active', startedAt: now, ...(firstDueAt ? { dueAt: firstDueAt } : {}) },
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

    // Notify the creator their matter was approved and is now live (E07-S01).
    await notify({
      recipientUid: task.createdBy, actorUid: req.user.uid, type: 'success',
      title: 'Matter approved',
      message: `${task.clientName ?? ''} · ${task.serviceName ?? ''} was approved and is now active.`,
      taskId: req.params.taskId,
    });

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

    // Notify the creator their matter was rejected, with the reason (E07-S01).
    await notify({
      recipientUid: task.createdBy, actorUid: req.user.uid, type: 'error',
      title: 'Matter rejected',
      message: `${task.clientName ?? ''} · ${task.serviceName ?? ''} was rejected: ${comment}`,
      taskId: req.params.taskId,
    });

    res.json({ success: true, status: 'rejected' });
  } catch (err) {
    logger.error({ err }, 'rejectTask error:');
    res.status(500).json({ message: 'Failed to reject matter' });
  }
}

// ─── POST /api/tasks/:taskId/stop ──────────────────────────────────────────
// Stop/cancel an in-flight matter when a client discontinues the service midway
// (GitHub #41). Admin-only (GitHub #70). Requires a reason, recorded on the
// activity thread. The matter moves to `cancelled` (terminal) and its active
// step is marked cancelled so it leaves worklists. Already-finished matters
// (completed/cancelled/rejected) can't be stopped.
export async function stopTask(req, res) {
  try {
    const { role, uid } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }
    const { reason } = req.body; // validated non-empty by taskStopSchema
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();
    if (['completed', 'cancelled', 'rejected'].includes(task.status)) {
      return res.status(409).json({ message: `Matter is already ${task.status} and cannot be stopped.` });
    }

    const now = new Date().toISOString();
    const comment = reason.toString().trim().slice(0, 500);
    const batch = db.batch();
    batch.set(taskRef, { status: 'cancelled', cancelledReason: comment, updatedAt: now }, { merge: true });
    // Take the active step out of worklists.
    const activeSnap = await taskRef.collection('steps').where('status', '==', 'active').limit(1).get();
    if (!activeSnap.empty) {
      batch.set(activeSnap.docs[0].ref, { status: 'cancelled' }, { merge: true });
    }
    batch.set(taskRef.collection('events').doc(), {
      type: 'TASK_STOPPED',
      fromStep: task.currentStepNumber,
      toStep: task.currentStepNumber,
      comment,
      byUid: uid ?? null,
      byRole: role ?? null,
      at: now,
    });
    await batch.commit();

    // A stopped matter shouldn't leave stale "action needed" alerts — resolve them.
    await resolveNotificationsForTask(req.params.taskId);

    // Notify the matter owner + client that the service was stopped (E07-S01).
    const ctx = `${task.clientName ?? ''} · ${task.serviceName ?? task.workflowType ?? ''}`;
    await notify({ recipientUid: task.assignedTo, actorUid: uid, type: 'warning', title: 'Matter stopped', message: `${ctx}: ${comment}`, taskId: req.params.taskId });

    res.json({ success: true, status: 'cancelled' });
  } catch (err) {
    logger.error({ err }, 'stopTask error:');
    res.status(500).json({ message: 'Failed to stop matter' });
  }
}

// ─── POST /api/tasks/:taskId/restart ───────────────────────────────────────
// Restart a previously stopped (`cancelled`) matter (GitHub #71). Admin-only.
// The matter resumes from where it left off: `currentStepNumber` was preserved
// on stop, so we re-activate that step and the matter goes back to `active`.
// The full history is retained — stop/restart are appended as events, nothing is
// overwritten. Only stopped matters can be restarted; archived matters are out of
// scope (#71). The ETA clock restarts now, mirroring approve (E13-S02).
export async function restartTask(req, res) {
  try {
    const { role, uid } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();
    if (task.status !== 'cancelled') {
      return res.status(409).json({ message: `Only a stopped matter can be restarted (this one is ${task.status}).` });
    }

    const now = new Date().toISOString();

    // Restart the ETA clock from the resumed step, best-effort (as in approveTask):
    // if the pinned definition can't be loaded, resume without due dates rather
    // than failing the restart.
    let matterDueAt = null;
    let stepDueAt = null;
    try {
      const compiled = await getCompiledById(task.workflowDefinitionId);
      if (compiled) {
        const stepDefs = materialisableSteps(compiled.definition.steps);
        const currentDef = stepDefs.find((s) => s.stepNumber === task.currentStepNumber);
        stepDueAt = addDaysIso(now, etaDaysOf(currentDef));
        matterDueAt = projectMatterDueAt(stepDefs, task.currentStepNumber, now);
      }
    } catch (e) {
      logger.warn({ err: e?.message }, 'restartTask: ETA stamping skipped (definition unavailable)');
    }

    const batch = db.batch();
    // Clear the stopped marker and go back to active.
    batch.set(taskRef, { status: 'active', cancelledReason: null, updatedAt: now, matterDueAt }, { merge: true });
    // Re-activate the step that was active when stopped — its assignment and other
    // fields were preserved (stop only flipped `status` to cancelled).
    batch.set(
      taskRef.collection('steps').doc(String(task.currentStepNumber)),
      { status: 'active', startedAt: now, ...(stepDueAt ? { dueAt: stepDueAt } : {}) },
      { merge: true },
    );
    batch.set(taskRef.collection('events').doc(), {
      type: 'TASK_RESTARTED',
      fromStep: task.currentStepNumber,
      toStep: task.currentStepNumber,
      comment: null,
      byUid: uid ?? null,
      byRole: role ?? null,
      at: now,
    });
    await batch.commit();

    // Notify the matter owner that work has resumed (E07-S01).
    const ctx = `${task.clientName ?? ''} · ${task.serviceName ?? task.workflowType ?? ''}`;
    await notify({ recipientUid: task.assignedTo, actorUid: uid, type: 'info', title: 'Matter restarted', message: `${ctx} was restarted and is active again.`, taskId: req.params.taskId });

    res.json({ success: true, status: 'active' });
  } catch (err) {
    logger.error({ err }, 'restartTask error:');
    res.status(500).json({ message: 'Failed to restart matter' });
  }
}

// ─── POST /api/tasks/:taskId/steps/:stepNumber/reopen ──────────────────────
// #116 — REOPEN a completed step (ADMIN ONLY, per the stakeholder's decision:
// "Option A — Rewind Workflow, with Admin approval").
//
// Semantics chosen (rewind, not edit-in-place): the workflow moves BACK to the
// chosen step. That step becomes `active` again; every step AFTER it that had
// already been done reverts to `pending` so the work is re-done in order. This
// keeps the engine consistent (exactly one active step) and leaves a clear audit
// trail, rather than allowing two "active" steps at once (which is where state
// corruption lives). A completed matter is reactivated in the process.
export async function reopenStep(req, res) {
  try {
    const { role, uid } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: only an admin can reopen a completed step.' });
    }
    const { taskId } = req.params;
    const target = Number(req.params.stepNumber);
    if (!Number.isInteger(target)) return res.status(400).json({ message: 'Invalid step number.' });

    const taskRef = db.collection('tasks').doc(taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();

    // Only a live or completed matter can be rewound. A stopped/rejected/archived
    // matter must go through its own restart path first.
    if (!['active', 'pending', 'completed'].includes(task.status)) {
      return res.status(409).json({
        message: `This matter is ${task.status} and cannot have a step reopened.`,
        code: 'MATTER_NOT_REOPENABLE',
      });
    }
    // Can't reopen the current or a future step — there's nothing to rewind to.
    if (task.status !== 'completed' && target >= task.currentStepNumber) {
      return res.status(409).json({
        message: 'Only a step BEFORE the current one can be reopened.',
        code: 'STEP_NOT_BEFORE_CURRENT',
      });
    }

    const targetRef = taskRef.collection('steps').doc(String(target));
    const targetSnap = await targetRef.get();
    if (!targetSnap.exists) return res.status(404).json({ message: 'Step not found on this matter.' });
    if (!['completed', 'skipped'].includes(targetSnap.data().status)) {
      return res.status(409).json({ message: 'Only a completed step can be reopened.', code: 'STEP_NOT_COMPLETED' });
    }

    const now = new Date().toISOString();
    const comment = (req.body?.reason || '').toString().trim().slice(0, 500) || null;
    const batch = db.batch();

    // Target step → active again.
    batch.set(targetRef, { status: 'active', startedAt: now, completedAt: null, reopenedAt: now }, { merge: true });

    // Every step AFTER the target that was already done reverts to pending, so the
    // remaining workflow is worked through again in order.
    // #143: "after" is measured in the definition's AUTHORED order — identity
    // numbers are not flow-ordered, so `stepNumber > target` also reset steps that
    // come BEFORE the target in the flow but happen to carry higher numbers
    // (e.g. 45/46/47 sit between steps 5 and 6). Those must stay completed.
    const laterNums = await (async () => {
      try {
        const compiled = await getCompiledById(task.workflowDefinitionId);
        const authored = compiled?.definition?.steps?.map((s) => s.stepNumber);
        if (Array.isArray(authored)) {
          const i = authored.indexOf(target);
          if (i !== -1) return new Set(authored.slice(i + 1));
        }
      } catch { /* fall through to the numeric fallback */ }
      return null;
    })();
    const laterDone = await taskRef.collection('steps').get();
    laterDone.forEach((d) => {
      const { stepNumber, status: st } = d.data();
      const isLater = laterNums ? laterNums.has(stepNumber) : stepNumber > target;
      if (!isLater) return;
      if (st === 'completed' || st === 'skipped' || st === 'active') {
        batch.set(d.ref, { status: 'pending', completedAt: null, startedAt: null }, { merge: true });
      }
    });

    // Re-project the matter's due date from the reopened step; reactivate a
    // completed matter.
    let matterDueAt = null;
    try {
      const compiled = await getCompiledById(task.workflowDefinitionId);
      if (compiled) {
        const etaStepDefs = materialisableSteps(compiled.definition.steps);
        matterDueAt = projectMatterDueAt(etaStepDefs, target, now);
      }
    } catch (e) {
      logger.warn({ err: e?.message }, 'reopenStep: ETA re-projection skipped');
    }

    batch.set(taskRef, {
      status: 'active',
      currentStepNumber: target,
      matterDueAt,
      updatedAt: now,
    }, { merge: true });

    // Audit trail.
    batch.set(taskRef.collection('events').doc(), {
      type: 'STEP_REOPENED',
      fromStep: task.currentStepNumber,
      toStep: target,
      comment: comment ? `Step reopened: ${comment}` : 'Step reopened by admin.',
      commentClientVisible: false, // internal action
      byUid: uid ?? null,
      byRole: role ?? null,
      at: now,
    });

    await batch.commit();

    res.json({ success: true, status: 'active', currentStepNumber: target });
  } catch (err) {
    logger.error({ err }, 'reopenStep error:');
    res.status(500).json({ message: 'Failed to reopen the step' });
  }
}

// ─── POST /api/tasks/:taskId/steps/:stepNumber/note ────────────────────────
// #105 — staff post a CLIENT-VISIBLE note onto a step WITHOUT advancing it.
// A comment normally rides along with a step action, but a client-approval step
// the matter LANDS on has no incoming comment — so the team had no way to put
// the review info ("proposed names & objects…") in front of the client. This
// records a comment-only STEP_NOTE event (always client-visible: sharing is the
// point) that the step's info box surfaces, and pings the client.
export async function postStepNote(req, res) {
  try {
    const { taskId } = req.params;
    const stepNumber = Number(req.params.stepNumber);
    const snap = await db.collection('tasks').doc(taskId).get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();

    const clean = sanitizeRichText((req.body?.note ?? '').toString(), { maxLength: 8000 });
    if (!richTextToPlain(clean)) {
      return res.status(400).json({ message: 'The note is empty.' });
    }

    const now = new Date().toISOString();
    await db.collection('tasks').doc(taskId).collection('events').add({
      type: 'STEP_NOTE',
      fromStep: stepNumber,
      toStep: stepNumber,
      comment: clean,
      commentClientVisible: true, // sharing with the client IS the intent
      byUid: req.user.uid ?? null,
      byRole: req.user.role ?? null,
      at: now,
    });

    // Ping the client — the note is information they should review.
    try {
      if (task.clientUid) {
        await createNotification({
          recipientUid: task.clientUid,
          type: 'info',
          title: 'New information on your service',
          message: `${task.serviceName ?? task.workflowType ?? 'Your service'}: our team shared details for your review.`,
          taskId,
          stepNumber,
        });
      }
    } catch (e) {
      logger.warn({ err: e?.message }, 'postStepNote: client notification failed');
    }

    res.status(201).json({ success: true, at: now });
  } catch (err) {
    logger.error({ err }, 'postStepNote error:');
    res.status(500).json({ message: 'Failed to save the note' });
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
      await backfillClientNames(rows); // #164
      return res.json({ data: rows, nextCursor: null });
    }

    let query = db.collection('tasks');
    // Clients can only see their own tasks
    if (role === 'client') {
      query = query.where('clientUid', '==', clientScopeUid(req.user));
    }
    // #168: a professional sees ONLY the matters they are explicitly granted,
    // never the rest of that client's book. `accessProfessionalUids` is an
    // allowlist per matter (distinct from #85's `professionalUid`, which is the
    // internal staff member handling the work).
    if (role === 'professional') {
      query = query.where('accessProfessionalUids', 'array-contains', uid);
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
    await backfillClientNames(data); // #164
    // E12-S01: strip internal ownership from the client's own matter list.
    // #168: a professional gets the same external-facing projection — they are
    // an outside party, so internal assignment/urgency must not leak either.
    if (role === 'client' || role === 'professional') data = data.map(projectTaskForClient);
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
        const stepDoc = active.docs[0];
        const step = stepDoc.data();
        // #164: a step record can be missing its denormalised title (and even its
        // stepNumber — the doc id IS the step number). Resolve the title from the
        // pinned workflow DEFINITION first, then the doc id, so the row never
        // renders the literal "Step undefined".
        const stepNumber = step.stepNumber ?? Number(stepDoc.id);
        const hasStepNumber = Number.isFinite(stepNumber);
        let stepTitle = step.title;
        if (!stepTitle && hasStepNumber) {
          try {
            const compiled = await getCompiledById(t.workflowDefinitionId);
            stepTitle = compiled?.definition?.steps?.find((x) => x.stepNumber === stepNumber)?.title;
          } catch { /* definition unavailable — fall through to the generic label */ }
        }
        if (!stepTitle) stepTitle = hasStepNumber ? `Step ${stepNumber}` : 'Untitled step';
        const assignedTo = step.assignedTo ?? null;
        // #50: "My Tasks" shows only steps that are MINE or UNASSIGNED (the shared
        // pickup pool) — for EVERY staff role, incl. admin/manager. Steps assigned
        // to someone ELSE never belong in my basket (admins still see all work via
        // Matters / Reports). This drops the old "Elsewhere" bucket.
        if (assignedTo && assignedTo !== uid) return;
        rows.push({
          taskId,
          clientName: t.clientName ?? '', // #164: backfilled below when empty
          clientUid: t.clientUid ?? null,
          serviceName: t.serviceName ?? t.workflowType ?? '',
          // Effective urgency (E11-S03): the matter is urgent OR its active step is.
          // An urgent step flags the row even if the matter itself isn't.
          isUrgent: !!t.isUrgent || !!step.isUrgent,
          updatedAt: t.updatedAt ?? null,
          stepNumber: hasStepNumber ? stepNumber : null,
          stepTitle,
          assignedRole: step.assignedRole ?? null,
          assignedTo,
          // Due date of the active step (E13-S03) — drives the lateness column.
          dueAt: step.dueAt ?? null,
          // After the #50 filter only 'assigned' (mine) or 'unassigned' (pool) remain.
          bucket: assignedTo === uid ? 'assigned' : 'unassigned',
        });
      })
    );

    // Resolve assignee names for the rows (#48) in one batched pass.
    await backfillClientNames(rows); // #164
    for (const r of rows) delete r.clientUid; // helper-only; not part of the payload
    const stepNames = await resolveUserNames(rows.map((r) => r.assignedTo));
    rows.forEach((r) => { r.assigneeName = r.assignedTo ? (stepNames[r.assignedTo] ?? null) : null; });

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
    // Clients can only see their own task (#166: via the primary client uid, so
    // additional logins on the same organisation resolve to the same matters).
    if (req.user.role === 'client' && data.clientUid !== clientScopeUid(req.user)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    // #168: a professional reaches ONLY the matters they are named on. Direct URL
    // access to any other matter — including another matter of the same client —
    // must 403, which is the isolation the issue asks for.
    if (req.user.role === 'professional' && !professionalCanSee(data, req.user.uid)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Steps live in a subcollection; attach them ordered by stepNumber.
    const stepsSnap = await doc.ref.collection('steps').orderBy('stepNumber').get();
    const steps = stepsSnap.empty
      ? (data.steps ?? []) // back-compat: legacy tasks stored steps inline
      : stepsSnap.docs.map((s) => s.data());

    const full = { id: doc.id, ...data, steps };
    // E12-S01: clients get a projection with internal ownership/assignment removed,
    // plus steps the workflow marks as not client-visible (clientVisible === false)
    // are dropped from the client's step list.
    if (req.user.role === 'client') {
      const visible = await clientVisibleStepSet(full);
      return res.json(projectTaskForClient(full, visible));
    }
    // Staff view (#48): resolve assignee UIDs → names server-side so EVERY staff
    // role (incl. team members, who don't fetch the user list) sees the real
    // assignee instead of a false "Unassigned".
    const names = await resolveUserNames([data.assignedTo, ...steps.map((s) => s.assignedTo)]);
    full.assignedToName = data.assignedTo ? (names[data.assignedTo] ?? null) : null;
    full.steps = steps.map((s) => ({ ...s, assigneeName: s.assignedTo ? (names[s.assignedTo] ?? null) : null }));
    res.json(full);
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
    if (req.user.role === 'professional' && !professionalCanSee(taskSnap.data(), req.user.uid)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (req.user.role === 'client' && taskSnap.data().clientUid !== clientScopeUid(req.user)) {
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

      // #115: internal team COMMENTS are private by default. A staff comment is
      // only shown to the client when it was explicitly marked "Visible to client"
      // (`commentClientVisible === true`). This FAILS CLOSED: comments written
      // before the toggle existed have no flag, so they stay internal — a privacy
      // fix must not keep leaking historic notes. The event itself still shows
      // (so the client sees that the step progressed), just without the note.
      // The client's OWN comments are always visible back to them.
      events = events.map((e) => {
        if (!e.comment) return e;
        const isOwn = e.byUid && e.byUid === req.user.uid;
        if (isOwn || e.commentClientVisible === true) return e;
        return { ...e, comment: null };
      });
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
        // Staff-only flag: this client step was advanced by staff on the client's
        // behalf (override). Hidden from clients.
        onBehalfOfClient: isClient ? undefined : (e.onBehalfOfClient || false),
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
    const { role, uid } = req.user;

    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const taskSnap = await taskRef.get();
    if (!taskSnap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = taskSnap.data();

    // Admin/manager may patch anything. A team member may ONLY set the handling
    // professional on a matter assigned to them (#85) — nothing else.
    if (role !== 'admin' && role !== 'manager') {
      const onlyProfessional = Object.keys(req.body).every((k) => k === 'professionalUid');
      const isMatterAssignee = task.assignedTo === uid;
      if (!(role === 'team_member' && onlyProfessional && isMatterAssignee)) {
        return res.status(403).json({ message: 'Forbidden: admin or manager required' });
      }
    }

    const update = {};
    if ('isUrgent' in req.body) update.isUrgent = req.body.isUrgent;

    // #153: correct the organisation name at any point in the matter's life,
    // including after completion. Deliberately NOT gated on task.status — a typo
    // discovered after closing is exactly the case this exists for. Purely a
    // display label: no step, payment, document or activity state depends on it.
    if ('organisation' in req.body) {
      const org = (req.body.organisation ?? '').trim();
      update.organisation = org || null;
    }

    // #149: add / edit / remove the matter's CC recipients at any time. An empty
    // array clears them. The client's own address is stripped — it is the To.
    if ('ccEmails' in req.body) {
      let primaryEmail = null;
      if (task.clientUid) {
        const c = await db.collection('users').doc(task.clientUid).get();
        if (c.exists) primaryEmail = c.data().email ?? null;
      }
      update.ccEmails = dedupeCcEmails(req.body.ccEmails, primaryEmail);
    }

    // #168: grant/revoke external professional access AFTER creation. Sending a
    // shorter array revokes; [] revokes all. A revoked professional loses the
    // matter from their list immediately — access is read live, never snapshotted.
    if ('accessProfessionalUids' in req.body) {
      const resolved = await resolveAccessProfessionals(req.body.accessProfessionalUids);
      if (resolved.error) return res.status(400).json({ message: resolved.error });
      update.accessProfessionalUids = resolved.uids;
    }

    // #85: set/clear the handling professional (staff user). Snapshot the name.
    if ('professionalUid' in req.body) {
      const pUid = req.body.professionalUid || null;
      if (pUid) {
        const p = await db.collection('users').doc(pUid).get();
        if (!p.exists) return res.status(400).json({ message: 'Professional not found' });
        if (p.data().role === 'client') return res.status(400).json({ message: 'Professional must be a staff user' });
        update.professionalUid = pUid;
        update.professionalName = p.data().name || p.data().fullName || p.data().email || null;
      } else {
        update.professionalUid = null;
        update.professionalName = null;
      }
    }

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

    // Notify the new matter owner that a matter was assigned to them (E07-S01).
    if (newAssignee) {
      await notify({
        recipientUid: newAssignee, actorUid: req.user.uid, type: 'info',
        title: 'Matter assigned to you',
        message: `${task.clientName ?? ''} · ${task.serviceName ?? task.workflowType ?? ''}`,
        taskId: req.params.taskId,
      });
    }

    res.json({ success: true });
  } catch (err) {
    logger.error({ err: err }, 'patchTask error:');
    res.status(500).json({ message: 'Failed to update task' });
  }
}

// ─── Payment history (#148) ────────────────────────────────────────────────
// Clients pay in instalments, so a matter needs a LEDGER, not a single latest
// figure. Each payment is its own doc in tasks/{id}/payments; the task doc keeps
// amountPaid/amountDue/paymentStatus as rollups recomputed from that ledger after
// every change. Writing per-payment docs (rather than an array field) is what
// makes concurrent instalment entry safe — two admins recording at once can't
// clobber each other. Admin/manager only; Team never sees payments at all.

/** Recompute the task's payment rollups from its ledger, inside a batch. */
async function rollUpPayments(taskRef, task, batch, now) {
  const snap = await taskRef.collection('payments').get();
  const amountPaid = snap.docs.reduce((sum, d) => sum + (d.data().amount ?? 0), 0);
  const totalCost = task.totalCost ?? 0;
  const amountDue = Math.max(0, totalCost - amountPaid);
  // Derive status from the amounts — the ledger is now the source of truth. With
  // no agreed cost, money received is a part payment, never "fully paid": calling
  // it full would open a payment gate on a matter nobody has priced.
  const paymentStatus = amountPaid <= 0
    ? 'not_paid'
    : (amountDue > 0 || totalCost <= 0) ? 'part_paid' : 'fully_paid';
  batch.set(taskRef, { amountPaid, amountDue, paymentStatus, updatedAt: now }, { merge: true });
  return { amountPaid, amountDue, paymentStatus, totalCost };
}

/** Shape one ledger doc for the API. The running `dueAfter` is added by the
 *  caller, which needs the whole ordered list to compute it. */
function paymentRow(doc) {
  const d = doc.data();
  return {
    id: doc.id,
    amount: d.amount ?? 0,
    mode: d.mode ?? '',
    paidAt: d.paidAt ?? d.recordedAt ?? null,
    reference: d.reference ?? null,
    notes: d.notes ?? null,
    recordedBy: d.recordedBy ?? null,
    recordedByName: d.recordedByName ?? null,
    recordedAt: d.recordedAt ?? null,
  };
}

// GET /api/tasks/:taskId/payments — the matter's payment history, oldest first.
export async function listPayments(req, res) {
  try {
    const { role } = req.user;
    // #148: Team must not see payment information at all.
    // #165: a CLIENT may read the ledger for THEIR OWN matter — they are the one
    // paying, and the tab already shows them what they owe, so a 403 here just
    // rendered "Could not load the payment history" on their own invoice.
    // Ownership is checked below once the matter is loaded.
    if (role !== 'admin' && role !== 'manager' && role !== 'client') {
      return res.status(403).json({ message: 'Forbidden: admin or manager required' });
    }
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();
    if (role === 'professional' && !professionalCanSee(task, req.user.uid)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (role === 'client' && task.clientUid !== clientScopeUid(req.user)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const ledger = await taskRef.collection('payments').get();
    const rows = ledger.docs
      .map(paymentRow)
      .sort((a, b) => String(a.paidAt ?? '').localeCompare(String(b.paidAt ?? '')));

    // Running balance per row: what remained due immediately after that payment.
    const totalCost = task.totalCost ?? 0;
    let running = 0;
    const payments = rows.map((r) => {
      running += r.amount;
      const row = { ...r, dueAfter: Math.max(0, totalCost - running) };
      // #165: the client sees their OWN ledger, but never which staff member
      // recorded a payment — internal identities are masked for clients across
      // the portal (events, documents), and this is no exception.
      if (role === 'client') { delete row.recordedBy; delete row.recordedByName; }
      return row;
    });

    res.json({
      payments,
      totalCost,
      amountPaid: task.amountPaid ?? 0,
      amountDue: task.amountDue ?? Math.max(0, totalCost - (task.amountPaid ?? 0)),
      paymentStatus: task.paymentStatus ?? 'not_paid',
    });
  } catch (err) {
    logger.error({ err }, 'listPayments error:');
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
}

// POST /api/tasks/:taskId/payments — record one received payment.
export async function createPayment(req, res) {
  try {
    const { role, uid } = req.user;
    if (role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: admin or manager required' });
    }
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();

    const now = new Date().toISOString();
    const { amount, mode, paidAt, reference, notes } = req.body;

    // Overpayment guard, mirroring the single-figure editor: the ledger total
    // may not exceed the agreed cost.
    const existing = await taskRef.collection('payments').get();
    const already = existing.docs.reduce((sum, d) => sum + (d.data().amount ?? 0), 0);
    const totalCost = task.totalCost ?? 0;
    // totalCost 0 means "no fee agreed yet" — don't block recording against it.
    if (totalCost > 0 && already + amount > totalCost) {
      return res.status(400).json({
        message: `This payment would exceed the total cost. ₹${Math.max(0, totalCost - already)} remains due.`,
        code: 'PAYMENT_EXCEEDS_TOTAL',
      });
    }

    const actor = await db.collection('users').doc(uid).get().catch(() => null);
    const actorName = actor?.exists
      ? (actor.data().name || actor.data().fullName || actor.data().email || null)
      : null;

    const paymentRef = taskRef.collection('payments').doc();
    const batch = db.batch();
    batch.set(paymentRef, {
      amount,
      mode,
      paidAt: paidAt || now,
      reference: reference ?? null,
      notes: notes ?? null,
      recordedBy: uid ?? null,
      recordedByName: actorName,
      recordedAt: now,
    });
    // The rollup must count the payment we're about to write, which the ledger
    // read above cannot see yet — fold it in explicitly.
    const newPaid = already + amount;
    const newDue = Math.max(0, totalCost - newPaid);
    // Same rule as rollUpPayments: unpriced matters can't reach "fully paid".
    const newStatus = newPaid <= 0
      ? 'not_paid'
      : (newDue > 0 || totalCost <= 0) ? 'part_paid' : 'fully_paid';
    batch.set(taskRef, {
      amountPaid: newPaid, amountDue: newDue, paymentStatus: newStatus,
      // Keep the single-figure fields meaningful: the latest mode is the one shown
      // in the matter header and reports.
      paymentMode: mode,
      updatedAt: now,
    }, { merge: true });
    batch.set(taskRef.collection('events').doc(), {
      type: 'PAYMENT_RECORDED',
      fromStep: task.currentStepNumber,
      toStep: task.currentStepNumber,
      comment: `Payment received: ₹${amount} via ${mode}. ₹${newDue} remaining of ₹${totalCost}.`,
      byUid: uid ?? null,
      byRole: role ?? null,
      at: now,
    });
    await batch.commit();

    res.status(201).json({
      id: paymentRef.id,
      amountPaid: newPaid, amountDue: newDue, paymentStatus: newStatus, totalCost,
    });
  } catch (err) {
    logger.error({ err }, 'createPayment error:');
    res.status(500).json({ message: 'Failed to record payment' });
  }
}

// PATCH /api/tasks/:taskId/payments/:paymentId — correct a recorded payment.
export async function patchPayment(req, res) {
  try {
    const { role, uid } = req.user;
    if (role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: admin or manager required' });
    }
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();

    const paymentRef = taskRef.collection('payments').doc(req.params.paymentId);
    const paymentSnap = await paymentRef.get();
    if (!paymentSnap.exists) return res.status(404).json({ message: 'Payment not found' });

    const now = new Date().toISOString();
    const patch = {};
    for (const k of ['amount', 'mode', 'paidAt']) {
      if (k in req.body) patch[k] = req.body[k];
    }
    for (const k of ['reference', 'notes']) {
      if (k in req.body) patch[k] = req.body[k] || null;
    }

    // Overpayment guard against the ledger MINUS this row's old amount.
    if ('amount' in patch) {
      const all = await taskRef.collection('payments').get();
      const others = all.docs
        .filter((d) => d.id !== paymentRef.id)
        .reduce((sum, d) => sum + (d.data().amount ?? 0), 0);
      const totalCost = task.totalCost ?? 0;
      if (totalCost > 0 && others + patch.amount > totalCost) {
        return res.status(400).json({
          message: `This amount would exceed the total cost. ₹${Math.max(0, totalCost - others)} is available.`,
          code: 'PAYMENT_EXCEEDS_TOTAL',
        });
      }
    }

    await paymentRef.set(patch, { merge: true });

    const batch = db.batch();
    const rolled = await rollUpPayments(taskRef, task, batch, now);
    batch.set(taskRef.collection('events').doc(), {
      type: 'PAYMENT_UPDATED',
      fromStep: task.currentStepNumber,
      toStep: task.currentStepNumber,
      comment: `Payment corrected: ₹${rolled.amountPaid} paid of ₹${rolled.totalCost} (${rolled.paymentStatus.replace('_', ' ')}).`,
      byUid: uid ?? null,
      byRole: role ?? null,
      at: now,
    });
    await batch.commit();

    res.json({ success: true, ...rolled });
  } catch (err) {
    logger.error({ err }, 'patchPayment error:');
    res.status(500).json({ message: 'Failed to update payment' });
  }
}

// DELETE /api/tasks/:taskId/payments/:paymentId — remove a mistaken entry.
export async function deletePayment(req, res) {
  try {
    const { role, uid } = req.user;
    if (role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: admin or manager required' });
    }
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();

    const paymentRef = taskRef.collection('payments').doc(req.params.paymentId);
    const paymentSnap = await paymentRef.get();
    if (!paymentSnap.exists) return res.status(404).json({ message: 'Payment not found' });
    const removed = paymentSnap.data().amount ?? 0;

    await paymentRef.delete();

    const now = new Date().toISOString();
    const batch = db.batch();
    const rolled = await rollUpPayments(taskRef, task, batch, now);
    batch.set(taskRef.collection('events').doc(), {
      type: 'PAYMENT_DELETED',
      fromStep: task.currentStepNumber,
      toStep: task.currentStepNumber,
      comment: `Payment of ₹${removed} removed. ₹${rolled.amountDue} remaining of ₹${rolled.totalCost}.`,
      byUid: uid ?? null,
      byRole: role ?? null,
      at: now,
    });
    await batch.commit();

    res.json({ success: true, ...rolled });
  } catch (err) {
    logger.error({ err }, 'deletePayment error:');
    res.status(500).json({ message: 'Failed to delete payment' });
  }
}

// ─── PATCH /api/tasks/:taskId/payment ──────────────────────────────────────
// Edit a matter's payment details after creation (#78). Admin/manager only.
// Accepts any subset of { totalCost, amountPaid, paymentMode, paymentStatus }.
// amountDue is always recomputed (max(0, totalCost − amountPaid)); paymentStatus
// is derived from the amounts when not given explicitly. When the balance is now
// fully received, the workflow's paymentStatus context is set to `fully_paid` so
// a payment gate can pass — this is the "update workflow payment status after the
// remaining amount is received" from the issue. Every edit is audited.
export async function updatePayment(req, res) {
  try {
    const { role, uid } = req.user;
    if (role !== 'admin' && role !== 'manager') {
      return res.status(403).json({ message: 'Forbidden: admin or manager required' });
    }
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();

    // #148: once a payment LEDGER exists it is the source of truth for how much
    // has been received — this endpoint must not set a conflicting figure behind
    // its back. Editing the total cost, mode or description stays allowed; the
    // paid amount is then only movable by adding/correcting a ledger entry.
    const ledger = await taskRef.collection('payments').get();
    const hasLedger = !ledger.empty;
    if (hasLedger && 'amountPaid' in req.body) {
      const ledgerTotal = ledger.docs.reduce((sum, d) => sum + (d.data().amount ?? 0), 0);
      if (req.body.amountPaid !== ledgerTotal) {
        return res.status(400).json({
          message: 'This matter has a payment history, so the amount paid is the sum of its payments. '
            + 'Record, edit or remove a payment instead of setting the total directly.',
          code: 'PAYMENT_LEDGER_AUTHORITATIVE',
        });
      }
    }

    // Start from current values, overlay the provided fields.
    const totalCost = 'totalCost' in req.body ? req.body.totalCost : (task.totalCost ?? 0);
    const amountPaid = hasLedger
      ? ledger.docs.reduce((sum, d) => sum + (d.data().amount ?? 0), 0)
      : ('amountPaid' in req.body ? req.body.amountPaid : (task.amountPaid ?? 0));
    const paymentMode = 'paymentMode' in req.body ? (req.body.paymentMode || null) : (task.paymentMode ?? null);
    // #147: preserved unless explicitly provided.
    const paymentDescription = 'paymentDescription' in req.body
      ? (req.body.paymentDescription || null)
      : (task.paymentDescription ?? null);
    if (amountPaid > totalCost) {
      return res.status(400).json({ message: 'Amount paid cannot exceed the total cost.' });
    }
    const amountDue = Math.max(0, totalCost - amountPaid);

    // paymentStatus: explicit wins; otherwise derive from the amounts.
    const derived = amountPaid <= 0 ? 'not_paid' : amountDue > 0 ? 'part_paid' : 'fully_paid';
    const paymentStatus = req.body.paymentStatus ?? derived;

    // #117: "Full payment" must actually BE full. An explicit fully_paid while a
    // balance remains would otherwise persist a wrong payment record. (The same
    // rule is enforced at creation by taskCreateSchema.)
    if (paymentStatus === 'fully_paid' && amountDue > 0) {
      return res.status(400).json({
        message: 'Payment Status cannot be set to "Full Payment" because an outstanding balance exists. '
          + 'Please either receive the full amount or change the Payment Status to "Part Payment".',
        code: 'PAYMENT_BALANCE_DUE',
      });
    }

    const now = new Date().toISOString();
    const update = { totalCost, amountPaid, amountDue, paymentMode, paymentDescription, paymentStatus, updatedAt: now };

    const batch = db.batch();
    batch.set(taskRef, update, { merge: true });
    batch.set(taskRef.collection('events').doc(), {
      type: 'PAYMENT_UPDATED',
      fromStep: task.currentStepNumber,
      toStep: task.currentStepNumber,
      comment: `Payment updated: ₹${amountPaid} paid / ₹${totalCost} total (${paymentStatus.replace('_', ' ')})${paymentMode ? ` · ${paymentMode}` : ''}`,
      byUid: uid ?? null,
      byRole: role ?? null,
      at: now,
    });
    await batch.commit();

    res.json({ success: true, paymentStatus, amountPaid, amountDue, totalCost, paymentMode, paymentDescription });
  } catch (err) {
    logger.error({ err }, 'updatePayment error:');
    res.status(500).json({ message: 'Failed to update payment' });
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

      // Notify the new step assignee that work was routed to them (E07-S01).
      if (reassigning && update.assignedTo) {
        const t = (await db.collection('tasks').doc(taskId).get()).data() ?? {};
        await notify({
          recipientUid: update.assignedTo, actorUid: req.user.uid, type: 'info',
          title: 'Step assigned to you',
          message: `${t.clientName ?? ''} · ${t.serviceName ?? t.workflowType ?? ''}: ${prev.title ?? `Step ${prev.stepNumber}`}`,
          taskId,
        });
      }

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

    // ── #89: a stopped/terminal matter can't be advanced by anyone ───────────
    // When an admin STOPS a workflow it becomes `cancelled`. Previously any staff
    // member could still fire a step event (e.g. a manager completing a step),
    // which silently re-activated the matter — bypassing the admin-only restart.
    // Terminal matters are frozen: the ONLY way to reactivate a cancelled matter
    // is the admin-only restart endpoint (`restartTask`). completed/rejected/
    // archived are likewise not advanceable.
    if (['cancelled', 'rejected', 'archived', 'completed'].includes(task.status)) {
      return res.status(409).json({
        message: task.status === 'cancelled'
          ? 'This matter was stopped. Only an admin can restart it.'
          : `This matter is ${task.status} and cannot be advanced.`,
        code: 'MATTER_NOT_ACTIVE',
      });
    }

    // Authorization: admin/manager always; team_member if assigned the MATTER or
    // the CURRENT ACTIVE STEP; clients only their own client-facing approval events.
    // Step-level assignment matters for steps a team member owns without being the
    // matter owner — e.g. Government Approval / Name Approval tasks routed to them
    // via phase pre-assignment or per-step assignment (GitHub #44).
    const isStaff = role === 'admin' || role === 'manager';
    let isAssignedTeam = role === 'team_member' && task.assignedTo === uid;
    if (role === 'team_member' && !isAssignedTeam) {
      const activeSnap = await taskRef.collection('steps')
        .where('status', '==', 'active').limit(1).get();
      if (!activeSnap.empty && activeSnap.docs[0].data().assignedTo === uid) {
        isAssignedTeam = true; // owns the active step → may advance it
      }
    }
    // #166: an additional client login approves/rejects exactly as the primary.
    const isOwnerClient = role === 'client' && task.clientUid === clientScopeUid(req.user);
    const clientEvents = new Set(['CLIENT_APPROVE', 'CLIENT_REJECT']);
    if (!isStaff && !isAssignedTeam && !(isOwnerClient && clientEvents.has(event?.type))) {
      return res.status(403).json({ message: 'Not allowed to advance this task' });
    }

    // ── #90: ADMIN-APPROVAL steps are admin-only ─────────────────────────────
    // A step whose active assignee role is `admin` requires admin approval: it is
    // client-hidden (see projectTaskForClient) and ONLY an admin may approve /
    // complete it. Managers may view but not act; a client cannot act even via the
    // client-approve path. This gate covers ALL step-advancing events (client +
    // completion) before any other allowance below.
    const activeStepSnap = await taskRef.collection('steps')
      .where('status', '==', 'active').limit(1).get();
    const activeStepData = activeStepSnap.empty ? null : activeStepSnap.docs[0].data();
    const isAdminApprovalStep = activeStepData?.assignedRole === 'admin';
    const ADVANCING_EVENTS = new Set([
      'CLIENT_APPROVE', 'CLIENT_REJECT', 'COMPLETE_STEP', 'GOVT_APPROVE', 'GOVT_REJECT',
      'BRANCH_DECISION', 'REWORK',
    ]);
    if (isAdminApprovalStep && ADVANCING_EVENTS.has(event?.type) && role !== 'admin') {
      return res.status(403).json({
        message: 'This step requires admin approval. Only an admin can approve or complete it.',
        code: 'ADMIN_APPROVAL_REQUIRED',
      });
    }

    // Override-on-behalf-of-client: admin/manager may advance a CLIENT-owned step
    // (approve / request changes) when the client can't act themselves (e.g. they
    // approved over the phone/email). Only admin & manager — a team member cannot
    // act on the client's behalf. Flagged so the audit log records it as an
    // override (who did it, on behalf of the client), not as the client acting.
    const isClientOverride =
      clientEvents.has(event?.type) && (role === 'admin' || role === 'manager');
    if (clientEvents.has(event?.type) && role === 'team_member') {
      return res.status(403).json({ message: 'A team member cannot act on the client’s behalf — ask an admin or manager to override.' });
    }

    // ── #74: overriding the payment gate is ADMIN-ONLY ───────────────────────
    // Only an admin may bypass the payment restriction to start/advance a matter
    // that isn't fully paid. Managers, team members and clients cannot — despite
    // the event otherwise being an ordinary staff advance.
    if (event?.type === 'ADMIN_OVERRIDE_PAYMENT' && role !== 'admin') {
      return res.status(403).json({ message: 'Only an admin can override the payment restriction.' });
    }

    // ── #49: restrict step COMPLETION to the assigned user ───────────────────
    // A step's work-advancing events may only be fired by the active step's
    // assignee. A manager's power over someone else's step is limited to REASSIGN
    // (a separate endpoint) — they cannot complete it. ADMIN keeps an explicit,
    // audited override (the issue's chosen exception). Payment + client events are
    // governed by their own rules above, so they're excluded here.
    const COMPLETION_EVENTS = new Set([
      'COMPLETE_STEP', 'GOVT_APPROVE', 'GOVT_REJECT', 'BRANCH_DECISION',
      'REWORK', // #56: the form-check owner decides approve vs. reject
    ]);
    let isAdminCompletionOverride = false;
    if (COMPLETION_EVENTS.has(event?.type)) {
      const activeSnap = await taskRef.collection('steps')
        .where('status', '==', 'active').limit(1).get();
      const stepAssignee = activeSnap.empty ? null : (activeSnap.docs[0].data().assignedTo ?? null);
      const isAssignee = stepAssignee != null && stepAssignee === uid;
      if (!isAssignee) {
        if (role === 'admin') {
          isAdminCompletionOverride = true; // allowed, but flagged + audited below
        } else if (stepAssignee != null) {
          // Manager or a non-assignee team member trying to complete another's step.
          return res.status(403).json({
            message: 'Only the assigned user can complete this step. Reassign it to yourself (or someone else) first.',
            code: 'NOT_STEP_ASSIGNEE',
          });
        }
        // stepAssignee == null (unassigned) → fall through: existing role checks
        // above already decided whether this actor may act on an unassigned step.
      }
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

    const now = new Date().toISOString();
    // #122: a step comment may be RICH TEXT (pasted tables/formatting). Sanitise
    // on the server — never trust HTML from a browser — so every render site can
    // display it safely without re-sanitising.
    const rawComment = (event?.remark || event?.reason || '').toString();
    const cleanComment = sanitizeRichText(rawComment, { maxLength: 8000 });
    // Empty once stripped (e.g. a lone <script>) counts as no comment.
    const comment = richTextToPlain(cleanComment) ? cleanComment : null;

    // ── Due-date stamping (E13-S02) ──
    // ETAs come from the pinned definition (already loaded as `compiled`).
    const etaStepDefs = materialisableSteps(compiled.definition.steps);
    const etaByNum = new Map(etaStepDefs.map((s) => [s.stepNumber, etaDaysOf(s)]));
    // Re-project the matter's completion from the step we're landing on.
    const matterDueAt = isComplete ? null : projectMatterDueAt(etaStepDefs, newStep, now);

    // Persist task-level state.
    const taskUpdate = {
      currentStepNumber: newStep,
      paymentStatus: snap.context.paymentStatus,
      adminOverride: snap.context.adminOverride,
      status: isComplete ? 'completed' : 'active',
      matterDueAt,
      updatedAt: now,
    };

    // Update step statuses: mark the step we LEFT as completed (on a forward move),
    // and the step we landed on as active. Done in a batch with the task update.
    const batch = db.batch();
    batch.set(taskRef, taskUpdate, { merge: true });

    // #140/#117/#55: direction and "between" are measured in the definition's
    // AUTHORED order — step identity numbers are NOT flow-ordered (a forward move
    // can land on a LOWER number, e.g. …39 → 4). Comparing numbers misread such
    // moves as REWORK and reset the completed step to 'pending' (#140).
    const authoredNums = compiled.definition.steps.map((s) => s.stepNumber);
    const authFromIdx = authoredNums.indexOf(task.currentStepNumber);
    const authToIdx = authoredNums.indexOf(newStep);
    const authOrdered = authFromIdx !== -1 && authToIdx !== -1;
    const isForwardMove = authOrdered
      ? authToIdx > authFromIdx
      : newStep > task.currentStepNumber; // defensive fallback (legacy data)

    if (newStep !== task.currentStepNumber) {
      const leftRef = taskRef.collection('steps').doc(String(task.currentStepNumber));
      // #56: a backward move (REWORK / reject) does NOT complete the rejected step
      // — it goes back to `pending` to be redone; the prior step reactivates below.
      const isBackward = !isForwardMove;
      if (isBackward) {
        batch.set(leftRef, {
          status: 'pending',
          ...(comment ? { remark: comment } : {}),
        }, { merge: true });
      } else {
        // onTime (E13-S02): compare completion to the step's stored due date (if any).
        const leftSnap = await leftRef.get();
        const leftDueAt = leftSnap.exists ? leftSnap.data().dueAt : null;
        const onTime = leftDueAt ? (new Date(now).getTime() <= new Date(leftDueAt).getTime()) : null;
        batch.set(leftRef, {
          status: 'completed',
          completedBy: uid ?? null,
          completedAt: now,
          ...(onTime != null ? { onTime } : {}),
          ...(comment ? { remark: comment } : {}),
        }, { merge: true });
      }
    } else if (comment) {
      // No step change (e.g. payment/override) — still record the comment on the step.
      const sameRef = taskRef.collection('steps').doc(String(task.currentStepNumber));
      batch.set(sameRef, { remark: comment }, { merge: true });
    }
    if (!isComplete) {
      const nextRef = taskRef.collection('steps').doc(String(newStep));
      // Start the new active step's clock (only on an actual step change, so a
      // payment/override that stays on the same step doesn't reset its due date).
      const startedNew = newStep !== task.currentStepNumber
        ? { startedAt: now, dueAt: addDaysIso(now, etaByNum.get(newStep) ?? null) }
        : {};
      batch.set(nextRef, { status: 'active', ...startedNew }, { merge: true });
    } else if (newStep === task.currentStepNumber) {
      // #144: completing an AUTHORED final step (e.g. "Final Incorporation Master
      // Sheet update") terminates the machine WITHOUT changing currentStepNumber
      // — step_44 targets the `completed` state directly, so no setStep runs and
      // the "step we left" branch above never fires. Close the step explicitly,
      // otherwise it would sit `active` forever on a finished matter (the very
      // symptom #141 fixed for the client projection).
      const finalRef = taskRef.collection('steps').doc(String(newStep));
      const finalSnap = await finalRef.get();
      const finalDueAt = finalSnap.exists ? finalSnap.data().dueAt : null;
      const onTime = finalDueAt ? (new Date(now).getTime() <= new Date(finalDueAt).getTime()) : null;
      batch.set(finalRef, {
        status: 'completed',
        completedBy: uid ?? null,
        completedAt: now,
        ...(onTime != null ? { onTime } : {}),
        ...(comment ? { remark: comment } : {}),
      }, { merge: true });
    }

    // Forward JUMP over intermediate steps. Two reasons a step can be bypassed:
    //  - a payment GATE that auto-passed because payment was already satisfied →
    //    it was effectively completed, not skipped (it just didn't need action);
    //  - a conditional branch step that doesn't apply on this path (e.g. the
    //    resubmission steps 14–19 when Govt approves at 13) → genuinely skipped.
    //
    // #117/#55: "between" is measured in the definition's AUTHORED order (the
    // editor's sequence), NOT the numeric stepNumber range. Steps inserted later
    // in the editor keep high identity numbers, so the flow can legitimately jump
    // e.g. 3 → 37 with steps 4–36 still AHEAD in the flow. The old numeric sweep
    // treated everything in 4..36 as bypassed — wrongly auto-completing the
    // "Full Payment Received" gate (#117) and mass-skipping upcoming steps. Only
    // the steps the flow actually passed over — those sitting between the departed
    // and the landed step in authored order — are swept.
    const fromStep = task.currentStepNumber;
    {
      // Fall back to the legacy numeric range only if either step is missing from
      // the pinned definition (shouldn't happen; defensive for legacy data).
      const betweenNums = authOrdered
        ? (authToIdx > authFromIdx + 1 ? authoredNums.slice(authFromIdx + 1, authToIdx) : [])
        : (newStep > fromStep + 1
            ? authoredNums.filter((n) => n > fromStep && n < newStep)
            : []);
      if (betweenNums.length) {
        const typeByNum = new Map(compiled.definition.steps.map((s) => [s.stepNumber, s.type]));
        const docs = await Promise.all(
          betweenNums.map((n) => taskRef.collection('steps').doc(String(n)).get()),
        );
        docs.forEach((d) => {
          if (!d.exists || d.data().status !== 'pending') return;
          const isGate = typeByNum.get(d.data().stepNumber) === 'payment_gate';
          batch.set(d.ref, isGate
            ? { status: 'completed', completedAt: now }
            : { status: 'skipped' }, { merge: true });
        });
      }
    }

    // The step we're ARRIVING at — used to decide whether a comment is a
    // client-facing hand-off note (#115/#105) and for ETA stamping below.
    const arrivingDef = compiled.definition.steps.find((s) => s.stepNumber === newStep) ?? null;

    // Append to the task's event history (audit trail of who did what, when).
    const eventRef = taskRef.collection('events').doc();
    batch.set(eventRef, {
      type: event?.type,
      branch: event?.branch ?? null,
      fromStep: task.currentStepNumber,
      toStep: newStep,
      comment,
      // #115: staff comments are INTERNAL by default — the client only sees this
      // note if it was explicitly marked "Visible to client". Two exceptions where
      // sharing IS the intent, so the default flips to visible:
      //   • the client's own comment (inherently theirs), and
      //   • a HAND-OFF comment: the move lands on a client-owned step, so the note
      //     is what the client must read before acting (#105's info box). Staff can
      //     still force it internal by sending commentClientVisible: false.
      commentClientVisible: role === 'client'
        ? true
        : (event?.commentClientVisible === true
            || (event?.commentClientVisible !== false && deriveOwnerType(arrivingDef ?? {}) === 'client')),
      byUid: uid ?? null,
      byRole: role ?? null,
      // Records that staff advanced a client-owned step on the client's behalf, so
      // the activity trail reads "Admin approved on behalf of the client".
      onBehalfOfClient: isClientOverride || false,
      // #49: an admin completed a step assigned to someone else (audited override).
      adminCompletionOverride: isAdminCompletionOverride || false,
      at: now,
    });

    await batch.commit();

    // Resolve stale notifications (#100). Notifications are keyed to the step the
    // ball ARRIVES at (the step the recipient must act on). On any FORWARD move we
    // must clear the alerts of EVERY vacated step up to the one we're landing on —
    // not just the single departed step — because a payment-gate auto-pass, a
    // branch skip, or any multi-step jump would otherwise orphan the skipped
    // steps' alerts forever. On a BACKWARD move (REWORK re-entry) clear any alert
    // for a step at/after where we land (its forward alert is now stale).
    // Completion clears everything. Runs before we create fresh notifications.
    // #131: when the MATTER completes, collapse superseded document versions into
    // Version History (keep the latest approved per scope). Until then every
    // version stays visible in the main list. Best-effort — never blocks the move.
    if (isComplete) {
      try { await finalizeMatterDocuments(taskId); }
      catch (e) { logger.warn({ err: e?.message }, 'transitionTask: document finalisation failed'); }
    }

    try {
      if (isComplete) {
        await resolveNotificationsForTask(taskId);
      } else if (isForwardMove && newStep !== task.currentStepNumber) {
        // Forward: clear every step strictly before the arrival step — in
        // AUTHORED order (#140), since identity numbers aren't flow-ordered.
        await resolveNotificationsForTask(taskId, authOrdered
          ? { stepNumberIn: authoredNums.slice(0, authToIdx) }
          : { stepNumberLte: newStep - 1 });
      } else if (!isForwardMove && newStep !== task.currentStepNumber) {
        // Backward (REWORK): clear stale alerts for the step we left and anything
        // after the step we return to, then the fresh notification below re-arms
        // the returned-to step.
        await resolveNotificationsForTask(taskId, { stepNumber: task.currentStepNumber });
      }
    } catch (e) {
      logger.warn({ err: e?.message }, 'transitionTask: notification resolution failed');
    }

    // ── Notifications (E07-S01): tell whoever the ball moves to. ──
    try {
      const ctx = `${task.clientName ?? ''} · ${task.serviceName ?? task.workflowType ?? ''}`;
      if (isComplete) {
        // Matter finished — congratulate the client + tell the matter owner.
        await notify({ recipientUid: task.clientUid, actorUid: uid, type: 'success',
          title: 'Your service is complete', message: ctx, taskId });
        await notify({ recipientUid: task.assignedTo, actorUid: uid, type: 'success',
          title: 'Matter completed', message: ctx, taskId });
      } else if (newStep !== task.currentStepNumber) {
        const newDef = etaStepDefs.find((s) => s.stepNumber === newStep);
        const owner = deriveOwnerType(newDef);
        if (owner === 'client') {
          // The ball is now with the client — prompt them to act. #106: the
          // operations team can customise this prompt per step in the workflow
          // editor (clientPromptTitle / clientPromptMessage); fall back to the
          // generic auto-generated text when unset.
          const promptTitle = (newDef?.clientPromptTitle ?? '').trim() || 'Action needed on your service';
          // #103: the client-facing prompt names the step by its CLIENT title.
          const promptMessage = (newDef?.clientPromptMessage ?? '').trim()
            || `${ctx}: ${newDef?.clientTitle || newDef?.title || `Step ${newStep}`}`;
          await notify({ recipientUid: task.clientUid, actorUid: uid, type: 'info',
            title: promptTitle, message: promptMessage, taskId, stepNumber: newStep });
        } else {
          // Internal step — notify its assignee (pre-assigned or matter owner).
          const nextStepSnap = await taskRef.collection('steps').doc(String(newStep)).get();
          const nextAssignee = nextStepSnap.exists ? nextStepSnap.data().assignedTo : null;
          // #53: client-approval → explicit "proceed" copy.
          // #56: REWORK (form-check reject) → tell the prior-step owner correction
          // is required so they can rectify and resubmit for approval.
          const clientApproved = event?.type === 'CLIENT_APPROVE';
          const isRework = event?.type === 'REWORK';
          let title = 'Step ready for you';
          let message = `${ctx}: ${newDef?.title ?? `Step ${newStep}`}`;
          if (clientApproved) {
            title = 'Client approval received';
            message = `Client approval has been received for ${ctx}. Please proceed with the next step: ${newDef?.title ?? `Step ${newStep}`}.`;
          } else if (isRework) {
            title = 'Correction required';
            message = `Correction required for ${ctx}: ${newDef?.title ?? `Step ${newStep}`}.${comment ? ` Note: ${comment}` : ''} Please review, rectify and resubmit for approval.`;
          }
          await notify({ recipientUid: nextAssignee || task.assignedTo, actorUid: uid, type: isRework ? 'warning' : 'info',
            title, message, taskId, stepNumber: newStep });
        }
        // If the CLIENT just acted, also let the matter owner know they responded.
        if (role === 'client') {
          await notify({ recipientUid: task.assignedTo, actorUid: uid, type: 'info',
            title: 'Client responded', message: ctx, taskId });
        }
      }

      // #99: close the "Action needed" loop — when a step that was PENDING ON THE
      // CLIENT completes (they acted, OR staff completed it on their behalf via
      // override), send the client a confirmation that their action landed. Gated
      // strictly on the DEPARTED step being client-owned, so internal→internal
      // completions never spam the client. Fire-and-forget like every notify.
      const departedDef = etaStepDefs.find((s) => s.stepNumber === task.currentStepNumber);
      const departedWasClientStep = departedDef && deriveOwnerType(departedDef) === 'client';
      // #140: forward is measured in authored order, not by identity number.
      const advancedForward = !isComplete && isForwardMove && newStep !== task.currentStepNumber;
      if ((departedWasClientStep && (advancedForward || isComplete)) && task.clientUid) {
        const stepTitle = departedDef?.title ?? `Step ${task.currentStepNumber}`;
        const confirmMsg = role === 'client'
          ? `Thanks — your action on “${stepTitle}” has been received. We'll take it from here.`
          : `“${stepTitle}” has been completed on your matter. No further action is needed from you on this step.`;
        // Use createNotification DIRECTLY (not notify()) so it is NOT suppressed
        // when the client is the actor — the confirmation is FOR the client even
        // when they completed the step themselves.
        await createNotification({ recipientUid: task.clientUid, type: 'success',
          title: 'Action received', message: confirmMsg, taskId, stepNumber: task.currentStepNumber })
          .catch((e) => logger.warn({ err: e?.message }, '#99 client confirmation notify failed'));
      }

      // #60: declarative step EFFECTS. When the step we just acted on carries
      // NOTIFY_CLIENT_RESUBMISSION (e.g. "Resubmission Received from Department"),
      // notify the client that a resubmission requirement has been raised. The
      // notification path now also sends an EMAIL (E07-S02 Gmail transport), so
      // #60's "automatic email to the client" is delivered via the same call.
      const actedDef = etaStepDefs.find((s) => s.stepNumber === task.currentStepNumber);
      const effects = actedDef?.effects ?? [];
      if (effects.includes('NOTIFY_CLIENT_RESUBMISSION')) {
        const branchTxt = event?.branch ? ` (${String(event.branch).replace(/_/g, ' ')} required)` : '';
        await notify({ recipientUid: task.clientUid, actorUid: uid, type: 'warning',
          title: 'Resubmission required',
          message: `A resubmission has been raised by the department for ${ctx}${branchTxt}. Our team will reach out with the details.`,
          taskId });
      }
      // #76: configurable part-payment reminder. When a step carrying
      // REMIND_PART_PAYMENT completes AND the matter is still only part-paid,
      // push the client an in-app + email reminder to clear the balance. Which
      // step triggers this is data (the effect on the definition step), so it is
      // per-workflow configurable via the editor — not hardcoded to a step number.
      // A fully-paid matter passing the step gets nothing (the guard), matching
      // "continue until the remaining payment is received."
      if (effects.includes('REMIND_PART_PAYMENT') && task.paymentStatus === 'part_paid') {
        await notify({ recipientUid: task.clientUid, actorUid: uid, type: 'warning',
          title: 'Payment reminder',
          message: `Please make the remaining payment for ${ctx} so we can proceed with completion and filing.${task.amountDue ? ` Balance due: ₹${task.amountDue}.` : ''}`,
          taskId });
      }
    } catch (e) {
      logger.warn({ err: e?.message }, 'transitionTask: notification step failed');
    }

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
// Admin-only. Deletes a matter and EVERYTHING tied to it (Firestore does NOT
// cascade): the steps/events/documents subcollections, the matter's Storage
// objects, and its top-level notifications, then the task doc itself.
export async function deleteTask(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin required' });
    }
    const { taskId } = req.params;
    const taskRef = db.collection('tasks').doc(taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });

    // Full cleanup — Firestore does NOT cascade. Remove EVERY subcollection
    // (steps, events, documents metadata AND the #148 payment ledger) plus the
    // matter's Storage objects, so deleting a matter leaves nothing orphaned.
    // NOTE: this list is explicit — a NEW subcollection must be added here too.
    const counts = {};
    for (const sub of ['steps', 'events', 'documents', 'payments']) {
      const subSnap = await taskRef.collection(sub).get();
      counts[sub] = subSnap.size;
      if (subSnap.empty) continue;
      // Batches cap at 500 writes; chunk to be safe for large logs.
      for (let i = 0; i < subSnap.docs.length; i += 450) {
        const batch = db.batch();
        subSnap.docs.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    }

    // Notifications reference the matter by `taskId` but live in a TOP-LEVEL
    // collection (not a subcollection), so the sweep above misses them. Delete
    // them here so a removed matter leaves no dangling bell entries that would
    // deep-link to a 404.
    {
      const notifSnap = await db.collection('notifications').where('taskId', '==', taskId).get();
      counts.notifications = notifSnap.size;
      for (let i = 0; i < notifSnap.docs.length; i += 450) {
        const batch = db.batch();
        notifSnap.docs.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    }

    // Delete the matter's uploaded files from Cloud Storage (E-05 docs live under
    // tasks/{taskId}/...). Best-effort: a storage failure must not block the
    // Firestore delete, but is logged so orphans can be swept later.
    let filesDeleted = 0;
    try {
      const [files] = await getBucket().getFiles({ prefix: `tasks/${taskId}/` });
      filesDeleted = files.length;
      await Promise.all(files.map((f) => f.delete().catch(() => {})));
    } catch (e) {
      logger.warn({ err: e?.message }, `[deleteTask] storage cleanup failed for ${taskId}`);
    }

    await taskRef.delete();
    logger.info(`[deleteTask] Matter ${taskId} deleted (steps=${counts.steps}, events=${counts.events}, documents=${counts.documents}, notifications=${counts.notifications}, files=${filesDeleted})`);
    res.status(200).json({
      id: taskId, deleted: true,
      stepsDeleted: counts.steps, eventsDeleted: counts.events,
      documentsDeleted: counts.documents, notificationsDeleted: counts.notifications, filesDeleted,
    });
  } catch (err) {
    logger.error({ err }, 'deleteTask error:');
    res.status(500).json({ message: 'Failed to delete matter' });
  }
}

// ─── POST /api/tasks/:taskId/archive ───────────────────────────────────────
// Archive a matter (admin-only, GitHub #70). Archiving is the non-destructive
// alternative to deletion — it gets a finished/abandoned matter OUT of active
// worklists without losing its history. Sets status `archived` (terminal); the
// active step (if any) is closed. Data + documents are preserved; only admin
// `deleteTask` purges them.
export async function archiveTask(req, res) {
  try {
    const { role, uid } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }
    const taskRef = db.collection('tasks').doc(req.params.taskId);
    const snap = await taskRef.get();
    if (!snap.exists) return res.status(404).json({ message: 'Matter not found' });
    const task = snap.data();
    if (task.status === 'archived') {
      return res.status(409).json({ message: 'Matter is already archived.' });
    }

    const now = new Date().toISOString();
    const batch = db.batch();
    batch.set(taskRef, { status: 'archived', archivedAt: now, archivedBy: uid ?? null, updatedAt: now }, { merge: true });
    const activeSnap = await taskRef.collection('steps').where('status', '==', 'active').limit(1).get();
    if (!activeSnap.empty) {
      batch.set(activeSnap.docs[0].ref, { status: 'archived' }, { merge: true });
    }
    batch.set(taskRef.collection('events').doc(), {
      type: 'TASK_ARCHIVED',
      fromStep: task.currentStepNumber,
      toStep: task.currentStepNumber,
      comment: null,
      byUid: uid ?? null,
      byRole: role ?? null,
      at: now,
    });
    await batch.commit();
    res.json({ success: true, status: 'archived' });
  } catch (err) {
    logger.error({ err }, 'archiveTask error:');
    res.status(500).json({ message: 'Failed to archive matter' });
  }
}
