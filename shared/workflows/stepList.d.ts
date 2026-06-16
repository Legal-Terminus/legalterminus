import type { AnyStateMachine } from 'xstate';

export interface WorkflowStep {
  stepNumber: number;
  key: string;
  title: string;
}

export declare function parseStepKey(stateKey: string): { stepNumber: number; title: string } | null;
export declare function getStepList(machine: AnyStateMachine): WorkflowStep[];
