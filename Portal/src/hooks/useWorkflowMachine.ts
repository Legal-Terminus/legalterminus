import { useMachine } from '@xstate/react';
import { companyIncorporationMachine } from '../workflows/configs/companyIncorporation.machine';
import type { WorkflowContext } from '../workflows/shared/types';

export function useWorkflowMachine(initialContext: WorkflowContext) {
  return useMachine(companyIncorporationMachine, {
    input: initialContext,
  });
}
