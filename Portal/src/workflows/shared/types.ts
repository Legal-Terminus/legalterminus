export type PaymentStatus = 'not_paid' | 'part_paid' | 'fully_paid';
export type StepStatus = 'pending' | 'active' | 'completed' | 'blocked' | 'skipped';

export interface WorkflowContext {
  taskId: string;
  clientUid: string;
  workflowType: string;
  paymentStatus: PaymentStatus;
  currentStepNumber: number;
  completedSteps: number[];
  activeParallelGroup: string | null;
  branchDecision: string | null;
  iterationCount: Record<string, number>;
  adminOverride: boolean;
}

export type WorkflowEvent =
  | { type: 'COMPLETE_STEP'; stepNumber: number; completedBy: string }
  | { type: 'REJECT_DOCUMENT'; stepNumber: number; remark: string }
  | { type: 'RECORD_PAYMENT'; amount: number; mode: string; newStatus: PaymentStatus }
  | { type: 'ADMIN_OVERRIDE_PAYMENT'; overriddenBy: string; reason: string }
  | { type: 'BRANCH_DECISION'; branch: 'new_name' | 'documentation' | 'information' }
  | { type: 'RESUBMIT'; stepNumber: number }
  | { type: 'CLIENT_APPROVE'; stepNumber: number }
  | { type: 'CLIENT_REJECT'; stepNumber: number; remark: string }
  | { type: 'GOVT_APPROVE' }
  | { type: 'GOVT_REJECT'; reason: string };
