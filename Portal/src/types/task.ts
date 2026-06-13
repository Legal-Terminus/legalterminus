export type TaskStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'on_hold';
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
  createdAt: string;
  updatedAt: string;
}
