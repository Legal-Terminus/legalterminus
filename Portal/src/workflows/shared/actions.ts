import type { WorkflowContext } from './types';

/**
 * Stub action: triggers an email notification.
 * In production, the backend handles actual email delivery via SendGrid.
 * The machine calls this action as an entry action on relevant states.
 */
export const sendEmailAction = ({ context }: { context: WorkflowContext }) => {
  console.info('[sendEmailAction] Email triggered for task:', context.taskId);
};
