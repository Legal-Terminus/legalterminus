import type { AnyStateMachine } from 'xstate';

export declare const companyIncorporationMachine: AnyStateMachine;
export declare const paymentGateGuard: (args: { context: { paymentStatus: string; adminOverride: boolean } }) => boolean;
export declare const partPaymentGateGuard: (args: { context: { paymentStatus: string; adminOverride: boolean } }) => boolean;
export declare const sendEmailAction: (args: { context: { taskId?: string } }) => void;
