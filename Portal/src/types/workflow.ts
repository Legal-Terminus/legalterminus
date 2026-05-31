export interface StepConfig {
  stepNumber: number;
  title: string;
  description?: string;
  assignedRole?: string;
  isPaymentGate?: boolean;
  isBranchPoint?: boolean;
  branches?: string[];
  parallelGroup?: string;
  emailTrigger?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  type: string;
  steps: StepConfig[];
  totalSteps: number;
}
