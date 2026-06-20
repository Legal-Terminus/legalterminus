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
  assignedTo?: string;
  status: TaskStatus;
  workflowDefinitionId?: string;
  paymentStatus: PaymentStatus;
  amountPaid?: number;
  amountDue?: number;
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
