import type { WorkflowContext } from './types';

export const paymentGateGuard = ({ context }: { context: WorkflowContext }) =>
  context.paymentStatus === 'fully_paid' || context.adminOverride;

export const partPaymentGateGuard = ({ context }: { context: WorkflowContext }) =>
  context.paymentStatus === 'part_paid' ||
  context.paymentStatus === 'fully_paid' ||
  context.adminOverride;
