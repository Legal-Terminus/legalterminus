import type { AnyStateMachine } from 'xstate';

export declare const WORKFLOW_BY_SERVICE_KEY: Record<string, AnyStateMachine>;
export declare const getWorkflowForServiceKey: (key: string | undefined) => AnyStateMachine | undefined;
export declare const hasWorkflowForServiceKey: (key: string | undefined) => boolean;
