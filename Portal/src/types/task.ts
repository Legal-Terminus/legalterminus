import type { RefundSummary } from '../api/refunds';

export type TaskStatus =
  | 'pending' | 'active' | 'completed' | 'cancelled' | 'on_hold'
  | 'pending_admin_approval' | 'rejected' | 'archived';
export type StepStatus = 'pending' | 'active' | 'completed' | 'blocked' | 'skipped';
export type PaymentStatus = 'not_paid' | 'part_paid' | 'fully_paid';

export interface TaskStep {
  stepNumber: number;
  title: string;
  status: StepStatus;
  assignedTo?: string;
  /** Resolved assignee display name (#48) — server-provided so every staff role
   *  sees the real assignee without fetching the user list. */
  assigneeName?: string | null;
  /** #192: every assignee's uid, and their resolved names. `assignedTo` /
   *  `assigneeName` remain the primary, so single-assignee code keeps working. */
  assignedToUids?: string[];
  assigneeNames?: string[];
  /** #204: client view only — the step is assigned to this client. The
   *  assignee uids themselves are stripped from what a client receives. */
  assignedToClient?: boolean;
  completedBy?: string;
  completedAt?: string;
  deadline?: string;
  remark?: string;
  isUrgent?: boolean;
  // ETA tracking (E13-S02): set when a step becomes active / completes.
  startedAt?: string;
  dueAt?: string | null;
  onTime?: boolean;
  /** #294: on a GST return matter's GSTR-1 / GSTR-3B filing task, once completed —
   *  the India date it was completed ('YYYY-MM-DD'), shown as "Filed on". Server-derived. */
  filedOn?: string;
}

/** #294: one completed GST filing. `date` is the staff correction if any, else
 *  `completedOn` (the day its task was completed, India). */
export interface GstFiling {
  stepNumber: number;
  form: 'GSTR-1' | 'GSTR-3B';
  date: string;
  completedOn?: string | null;
  corrected?: boolean;
}

export interface Task {
  id: string;
  workflowType: string;
  serviceName?: string;
  clientUid: string;
  clientName?: string;
  /** #201: staff list only — the client's profile phone and email, looked up
   *  live. Never sent to clients or professionals. */
  clientEmail?: string | null;
  clientPhone?: string | null;
  /** #104: per-matter organisation (entered at creation; used in headers + email subjects). */
  organisation?: string;
  /** #149: extra recipients CC'd on every automated email for this matter. */
  ccEmails?: string[];
  assignedTo?: string;
  /** Resolved matter-owner display name (#48). */
  assignedToName?: string | null;
  status: TaskStatus;
  workflowDefinitionId?: string;
  paymentStatus: PaymentStatus;
  amountPaid?: number;
  amountDue?: number;
  totalCost?: number;
  paymentMode?: string | null;
  /** #147: free-text note on how the payment was received (e.g. split across modes). */
  paymentDescription?: string | null;
  /** #220: Pay Now is on unless an admin/manager switched it off (`false`). */
  onlinePaymentEnabled?: boolean;
  /** #240: rollup of the matter's refund log, kept in step server-side. Absent until a refund is recorded. */
  refundSummary?: RefundSummary;
  professionalUid?: string | null; // #85
  professionalName?: string | null; // #85 (snapshot for display)
  /** #167: recurring cadence, or null/absent when the matter is one-off. */
  /** #181: additional professionals with view-only access to THIS matter. */
  additionalProfessionalEmails?: string[];
  recurrence?: 'monthly' | 'quarterly' | null;
  recurrenceNextDueAt?: string | null;
  recurrenceEndsAt?: string | null;
  currentStepNumber: number;
  /** #139: CLIENT projection only — the real current step is hidden ("Show to
   *  Client" off), so currentStepNumber points at the LAST visible step, shown
   *  as in-progress but without action buttons. */
  currentStepFallback?: boolean;
  totalSteps?: number;
  steps?: TaskStep[];
  /** #189: denormalised count of finished (completed|skipped) steps, kept in sync
   *  server-side. Progress must come from this, never from currentStepNumber —
   *  step numbers are identity only and are not flow-ordered. */
  completedStepCount?: number;
  /** #191: the current step's name, resolved server-side from the matter's pinned
   *  workflow definition (staff list only — the list itself stores only a number). */
  currentStepTitle?: string | null;
  /** E20-S01: does this matter await the CLIENT's action? Server-derived from the
   *  current step's owner; absent (not false) when the definition is unavailable,
   *  because a wrong "needs you" is worse than no badge at all. */
  awaitingClient?: boolean;
  /** #292: a GST return matter's filing period ("September 2026", "Q2 2026-27"),
   *  server-derived by the GST Return Filing sheet's rules; absent on other matters. */
  gstFilingPeriodLabel?: string | null;
  /** #294: matter detail only — the completed GSTR-1 / GSTR-3B filings, each with
   *  the India date its task was completed ('YYYY-MM-DD'). */
  gstFilings?: GstFiling[];
  /** #294: the range a filing date may be corrected to (inclusive, 'YYYY-MM-DD'). */
  gstFilingDateBounds?: { min: string | null; max: string };
  isUrgent?: boolean;
  // Projected matter completion (E13-S02); null while pending approval/untracked.
  matterDueAt?: string | null;
  rejectionReason?: string;
  cancelledReason?: string; // set when a matter is stopped (#41)
  createdAt: string;
  updatedAt: string;
}
