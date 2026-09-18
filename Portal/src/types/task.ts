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
  completedBy?: string;
  completedAt?: string;
  deadline?: string;
  remark?: string;
  isUrgent?: boolean;
  // ETA tracking (E13-S02): set when a step becomes active / completes.
  startedAt?: string;
  dueAt?: string | null;
  onTime?: boolean;
}

export interface Task {
  id: string;
  workflowType: string;
  serviceName?: string;
  clientUid: string;
  clientName?: string;
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
  isUrgent?: boolean;
  // Projected matter completion (E13-S02); null while pending approval/untracked.
  matterDueAt?: string | null;
  rejectionReason?: string;
  cancelledReason?: string; // set when a matter is stopped (#41)
  createdAt: string;
  updatedAt: string;
}
