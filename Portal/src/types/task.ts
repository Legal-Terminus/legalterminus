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
  professionalUid?: string | null; // #85
  professionalName?: string | null; // #85 (snapshot for display)
  currentStepNumber: number;
  totalSteps?: number;
  steps?: TaskStep[];
  isUrgent?: boolean;
  // Projected matter completion (E13-S02); null while pending approval/untracked.
  matterDueAt?: string | null;
  rejectionReason?: string;
  cancelledReason?: string; // set when a matter is stopped (#41)
  createdAt: string;
  updatedAt: string;
}
