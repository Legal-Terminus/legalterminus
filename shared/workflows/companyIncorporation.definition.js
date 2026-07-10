/**
 * Company Incorporation — hand-authored workflow DEFINITION (data), reflecting the
 * 44-step business sheet ("Services Steps for AP", Company Incorporation tab).
 *
 * This replaces the machine-converted definition as the source of truth. Steps,
 * phases, payment gates, the two resubmission loops (name reservation; final COI),
 * and per-step CLIENT VISIBILITY (`clientVisible`) all come from the sheet:
 *   - The sheet's "Steps viewed in client interface" (violet / YES) rows are
 *     `clientVisible: true`; every other step is `clientVisible: false`.
 *   - Client-visible per the sheet: SI 3,4,5,8,9,10,13,14,19,20,25,26,33,34,40,41.
 *
 * Topology notes (best-effort from the sheet; refine in the Workflow Editor):
 *   - Payment gate up front (SI 1–2): full payment passes; part/none waits.
 *   - Name reservation resubmission loop: SI 13 "Pending Name Approval" can be
 *     rejected by the department → SI 14 "Resubmission Received" → loops back to
 *     SI 6 (name search) → ... → SI 19 "Resubmit of Name reservation" → SI 13.
 *   - Final COI resubmission loop: SI 33 "Pending for Approval (Final COI)" can be
 *     rejected → SI 34 "Resubmission Received on Incorporation" → SI 35–39 rework →
 *     SI 40 "Pending for Approval (Final COI)" again → SI 41 "COI Received".
 *
 * Editable from the UI (E10-S01) — this file just provides the initial seed.
 *
 * GitHub issue mapping (2026-06-27):
 *   #51 — "Work Assigning" (old SI 3) removed; matter starts at step 4. Payment
 *         status + No-Payment→admin-approval handled at matter creation (code).
 *   #52 — step 4 "Name & Objects received" carries a `checklistItems` list.
 *   #54 — "Part Payment Due" (old SI 21) removed; part-payment shown as an alert.
 *   #56 — step 28 "Form Check" is an approval step: COMPLETE_STEP→29 (approve),
 *         REWORK→27 (reject/need-correction, notifies the step-27 owner).
 *   #59 — "Email Trigger to Client" (old SI 35) removed.
 *   #60 — step 34 fires `NOTIFY_CLIENT_RESUBMISSION` (in-app now; email TODO).
 *   #61 — step 38 renamed "Client Approval/Signature Required" + per-step doc
 *         upload; CLIENT_APPROVE ("Please Proceed") auto-completes → 39.
 *   #57 — Early DSC (23) & MCA registration (31): once the checklist + full
 *         payment are in, these may start early. Represented as editable
 *         transitions (refine in the Workflow Editor); the engine advances on the
 *         configured events, so early-start is a config change, not code.
 */

// Phases (journey "stations") grouping the 44 steps for the client tracker.
const PHASES = [
  { id: 'onboarding',     name: 'Onboarding & Payment',   order: 1 },
  { id: 'name_reservation', name: 'Name Reservation',     order: 2 },
  { id: 'documentation',  name: 'Documentation',          order: 3 },
  { id: 'filing',         name: 'Filing & Approval',      order: 4 },
  { id: 'completion',     name: 'Incorporation Complete',  order: 5 },
];

// Helper to keep the step list readable. `cv` = clientVisible.
const step = (stepNumber, title, opts = {}) => ({
  stepNumber,
  title,
  type: opts.type ?? 'step',
  phaseId: opts.phaseId,
  clientVisible: opts.cv ?? false,
  ...(opts.description ? { description: opts.description } : {}),
  ...(opts.gate ? { gate: opts.gate } : {}),
  ...(opts.transitions ? { transitions: opts.transitions } : {}),
  ...(opts.effects ? { effects: opts.effects } : {}),
  ...(opts.checklistItems ? { checklistItems: opts.checklistItems } : {}),
  ...(opts.allowDocUpload ? { allowDocUpload: opts.allowDocUpload } : {}),
  ...(opts.clientActionLabel ? { clientActionLabel: opts.clientActionLabel } : {}),
});

// COMPLETE_STEP → next step number (the default linear advance).
const next = (to) => ([{ event: 'COMPLETE_STEP', to }]);

export const companyIncorporationDefinition = {
  id: 'company-incorporation',
  name: 'Company Incorporation',
  version: 1,
  initialStep: 1,
  serviceKeys: ['incorporation'],
  phases: PHASES,
  steps: [
    // ── Onboarding & Payment ──
    step(1, 'Payment', { phaseId: 'onboarding', type: 'payment_gate',
      gate: { requires: 'part_paid', onPass: 4, onWait: 4 } }),
    // SI 2 in the sheet is the payment-status legend (Full/Part/None) — represented
    // by the gate above, not a discrete step. SI 3 "Work Assigning" removed (#51).
    // #51: "Work Assigning" removed as a discrete step — adding a workflow to a
    // client IS the assignment. The matter now starts at step 4.
    step(4, 'Name & Objects received', { phaseId: 'onboarding', cv: true, transitions: next(5),
      // #52: tracked as a checklist for verification/usability.
      checklistItems: [
        'Proposed company name(s) received',
        'Business objects / main activities received',
        'Promoter / director details received',
        'Registered office details received',
      ] }),
    step(5, 'Checklist Received', { phaseId: 'onboarding', cv: true, transitions: next(6) }),

    // ── Name Reservation ──
    step(6, 'Name Search & Object Preparation (Incorporation)', { phaseId: 'name_reservation', transitions: next(7) }),
    step(7, 'Name Search & Object finalization', { phaseId: 'name_reservation', transitions: next(8) }),
    step(8, 'Search report and Objects mail to client', { phaseId: 'name_reservation', cv: true, transitions: next(9) }),
    step(9, 'Client Approval pending on final Name & Object', { phaseId: 'name_reservation', cv: true,
      transitions: [{ event: 'CLIENT_APPROVE', to: 10 }, { event: 'CLIENT_REJECT', to: 6 }] }),
    step(10, 'Client Approval on final Name & Object', { phaseId: 'name_reservation', cv: true, transitions: next(11) }),
    step(11, 'Name Application Filing (Incorporation)', { phaseId: 'name_reservation', transitions: next(12) }),
    step(12, 'Payment for Name Application', { phaseId: 'name_reservation', transitions: next(13) }),
    step(13, 'Pending Name Approval (Department)', { phaseId: 'name_reservation', cv: true,
      transitions: [{ event: 'GOVT_APPROVE', to: 20 }, { event: 'GOVT_REJECT', to: 14 }] }),
    // Resubmission loop (SI 14–19): rework then resubmit → back to pending approval.
    step(14, 'Resubmission Received on name reservation', { phaseId: 'name_reservation', cv: true, type: 'branch',
      transitions: [{ event: 'BRANCH_DECISION', to: 15, branch: 'new_name' }, { event: 'BRANCH_DECISION', to: 16, branch: 'documentation' }] }),
    step(15, 'Resubmission — For new name', { phaseId: 'name_reservation', transitions: next(19) }),
    step(16, 'Resubmission — Preparation of document', { phaseId: 'name_reservation', transitions: next(17) }),
    step(17, 'Resubmission — Approval', { phaseId: 'name_reservation', transitions: next(18) }),
    step(18, 'Resubmission — Signature of client if required', { phaseId: 'name_reservation', transitions: next(19) }),
    step(19, 'Resubmit of Name reservation', { phaseId: 'name_reservation', cv: true, transitions: next(13) }),
    // #76: on completion, remind the client to clear any outstanding part payment
    // (in-app + email). Configurable — move this effect to a different step to
    // re-time the reminder; it only fires while the matter is still part-paid.
    step(20, 'Name Approval Letter Received (Department)', { phaseId: 'name_reservation', cv: true,
      effects: ['REMIND_PART_PAYMENT'], transitions: next(22) }),

    // ── Documentation ──
    // #54: "Part Payment Due" removed as a step — part-payment is surfaced as a
    // blinking alert + client message instead (handled in the app, not the flow).
    step(22, 'Documents received from client', { phaseId: 'documentation', transitions: next(23) }),
    step(23, 'DSC preparation', { phaseId: 'documentation', transitions: next(24) }),
    step(24, 'Preparation of Incorporation Documents', { phaseId: 'documentation', transitions: next(25) }),
    step(25, 'Waiting for Client Signature & Other documents', { phaseId: 'documentation', cv: true, transitions: next(26) }),
    step(26, 'Collection of Documents (For Incorporation)', { phaseId: 'documentation', cv: true, transitions: next(27) }),

    // ── Filing & Approval ──
    step(27, 'Form Fill up (Incorporation)', { phaseId: 'filing', transitions: next(28) }),
    // #56: Form Check is an APPROVAL step owned by the step owner. Approve advances
    // to 29; Reject / "Need Correction" reverts to 27 (and notifies the 27 owner).
    step(28, 'Form Check (Incorporation Form)', { phaseId: 'filing',
      transitions: [{ event: 'COMPLETE_STEP', to: 29 }, { event: 'REWORK', to: 27 }] }),
    step(29, 'Full Payment Received', { phaseId: 'filing', type: 'payment_gate',
      gate: { requires: 'fully_paid', onPass: 30, onWait: 30 } }),
    step(30, 'Uploading of Incorporation Forms', { phaseId: 'filing', transitions: next(31) }),
    step(31, 'DSC Registration in MCA portal', { phaseId: 'filing', transitions: next(32) }),
    step(32, 'Payment of Challan for Incorporation', { phaseId: 'filing', transitions: next(33) }),
    step(33, 'Pending for Approval (Final COI) from Department', { phaseId: 'filing', cv: true,
      transitions: [{ event: 'GOVT_APPROVE', to: 41 }, { event: 'GOVT_REJECT', to: 34 }] }),
    // Final-COI resubmission loop (SI 34–40).
    // #60: on "Resubmission Received from Department" the client is notified of the
    // requirement (info / document / both). #59: the separate "Email Trigger" step
    // (old SI 35) is removed — the notification is an effect of THIS step, not a step.
    step(34, 'Resubmission Received on Incorporation', { phaseId: 'filing', cv: true, type: 'branch',
      transitions: [{ event: 'BRANCH_DECISION', to: 36, branch: 'information' }, { event: 'BRANCH_DECISION', to: 37, branch: 'document' }],
      effects: ['NOTIFY_CLIENT_RESUBMISSION'] }),
    // (SI 35 "Email triggered to client" removed — #59.)
    step(36, 'Collection of Information, if required', { phaseId: 'filing', transitions: next(38) }),
    step(37, 'Preparation & collation of document', { phaseId: 'filing', transitions: next(38) }),
    // #61: client approval + signature, with a per-step document upload; on
    // "Please Proceed" (CLIENT_APPROVE) the step auto-completes and advances to 39.
    step(38, 'Client Approval/Signature Required', { phaseId: 'filing', cv: true, allowDocUpload: true,
      clientActionLabel: 'Please Proceed',
      transitions: [{ event: 'CLIENT_APPROVE', to: 39 }, { event: 'CLIENT_REJECT', to: 37 }] }),
    step(39, 'Form Fill up & Resubmission', { phaseId: 'filing', transitions: next(40) }),
    step(40, 'Pending for Approval (Final COI) from Department', { phaseId: 'filing', cv: true,
      transitions: [{ event: 'GOVT_APPROVE', to: 41 }, { event: 'GOVT_REJECT', to: 34 }] }),

    // ── Incorporation Complete ──
    step(41, 'COI Received', { phaseId: 'completion', cv: true, transitions: next(42) }),
    step(42, 'PAN & TAN certificate received from department', { phaseId: 'completion', transitions: next(43) }),
    step(43, 'Mail to Client for Final COI', { phaseId: 'completion', effects: ['SEND_EMAIL'], transitions: next(44) }),
    step(44, 'Final Incorporation Master Sheet update', { phaseId: 'completion', type: 'final' }),
  ],
};
