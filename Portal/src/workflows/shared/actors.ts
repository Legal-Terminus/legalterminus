import { fromPromise } from 'xstate';
import type { WorkflowContext } from './types';

/**
 * Stub actor: simulates a document review process.
 * Replace with real Firestore listener or API call in production.
 */
export const documentReviewActor = fromPromise(
  async ({ input }: { input: { context: WorkflowContext; stepNumber: number } }) => {
    console.info('[documentReviewActor] Reviewing docs for task:', input.context.taskId);
    // Simulate async document review
    return { approved: false };
  }
);
