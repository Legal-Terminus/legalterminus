import { createMachine, assign } from 'xstate';
import type { WorkflowContext, WorkflowEvent } from '../shared/types';
import { paymentGateGuard, partPaymentGateGuard } from '../shared/guards';
import { sendEmailAction } from '../shared/actions';

export const companyIncorporationMachine = createMachine({
  id: 'companyIncorporation',
  initial: 'step_1_payment_gate',
  types: {} as { context: WorkflowContext; events: WorkflowEvent },
  context: ({ input }: { input: WorkflowContext }) => input,
  states: {
    step_1_payment_gate: {
      always: [
        { guard: paymentGateGuard, target: 'step_3_work_assignment' },
        { guard: partPaymentGateGuard, target: 'step_3_work_assignment' },
        { target: 'awaiting_payment' },
      ],
    },
    awaiting_payment: {
      on: {
        RECORD_PAYMENT: {
          actions: assign(({ event }) => ({
            paymentStatus: event.newStatus,
          })),
          target: 'step_1_payment_gate',
        },
        ADMIN_OVERRIDE_PAYMENT: {
          actions: assign(() => ({ adminOverride: true })),
          target: 'step_3_work_assignment',
        },
      },
    },
    step_3_work_assignment: {
      on: {
        COMPLETE_STEP: {
          target: 'step_4_collect_name',
          actions: assign(() => ({ currentStepNumber: 4 })),
        },
      },
    },
    step_4_collect_name: {
      on: {
        COMPLETE_STEP: {
          target: 'step_10_client_approval',
          actions: assign(() => ({ currentStepNumber: 10 })),
        },
      },
    },
    step_10_client_approval: {
      on: {
        CLIENT_APPROVE: { target: 'step_11_file_name_application' },
        CLIENT_REJECT: { target: 'step_4_collect_name' },
      },
    },
    step_11_file_name_application: {
      on: {
        COMPLETE_STEP: {
          target: 'step_12_await_govt',
          actions: assign(() => ({ currentStepNumber: 12 })),
        },
      },
    },
    step_12_await_govt: {
      on: {
        GOVT_APPROVE: { target: 'step_20_name_approval_letter' },
        GOVT_REJECT: { target: 'step_14_resubmission_branch' },
      },
    },
    step_14_resubmission_branch: {
      on: {
        BRANCH_DECISION: [
          {
            guard: ({ event }) => event.type === 'BRANCH_DECISION' && event.branch === 'new_name',
            target: 'step_4_collect_name',
          },
          {
            guard: ({ event }) => event.type === 'BRANCH_DECISION' && event.branch === 'documentation',
            target: 'step_15_prepare_docs',
          },
        ],
      },
    },
    step_15_prepare_docs: {
      on: {
        COMPLETE_STEP: { target: 'step_11_file_name_application' },
      },
    },
    step_20_name_approval_letter: {
      entry: [({ context }) => sendEmailAction({ context })],
      on: {
        COMPLETE_STEP: {
          target: 'step_21_part_payment_gate',
          actions: assign(() => ({ currentStepNumber: 21 })),
        },
      },
    },
    step_21_part_payment_gate: {
      always: [{ guard: paymentGateGuard, target: 'step_22_document_collection' }],
      on: {
        RECORD_PAYMENT: {
          actions: assign(({ event }) => ({ paymentStatus: event.newStatus })),
          target: 'step_21_part_payment_gate',
        },
        ADMIN_OVERRIDE_PAYMENT: {
          actions: assign(() => ({ adminOverride: true })),
          target: 'step_22_document_collection',
        },
      },
    },
    step_22_document_collection: {
      on: {
        COMPLETE_STEP: {
          target: 'step_27_full_payment',
          actions: assign(() => ({ currentStepNumber: 27 })),
        },
      },
    },
    step_27_full_payment: {
      always: [{ guard: paymentGateGuard, target: 'step_28_upload_forms' }],
      on: {
        RECORD_PAYMENT: {
          actions: assign(({ event }) => ({ paymentStatus: event.newStatus })),
          target: 'step_27_full_payment',
        },
        ADMIN_OVERRIDE_PAYMENT: {
          actions: assign(() => ({ adminOverride: true })),
          target: 'step_28_upload_forms',
        },
      },
    },
    step_28_upload_forms: {
      on: {
        COMPLETE_STEP: {
          target: 'step_29_challan_payment',
          actions: assign(() => ({ currentStepNumber: 29 })),
        },
      },
    },
    step_29_challan_payment: {
      on: {
        COMPLETE_STEP: {
          target: 'step_30_await_govt_final',
          actions: assign(() => ({ currentStepNumber: 30 })),
        },
      },
    },
    step_30_await_govt_final: {
      on: {
        GOVT_APPROVE: { target: 'step_38_coi_received' },
        GOVT_REJECT: { target: 'step_31_resubmission_branch_2' },
      },
    },
    step_31_resubmission_branch_2: {
      on: {
        BRANCH_DECISION: [
          {
            guard: ({ event }) => event.type === 'BRANCH_DECISION' && event.branch === 'information',
            target: 'step_32_info_resubmit',
          },
          {
            guard: ({ event }) => event.type === 'BRANCH_DECISION' && event.branch === 'documentation',
            target: 'step_33_doc_resubmit',
          },
        ],
      },
    },
    step_32_info_resubmit: {
      on: { COMPLETE_STEP: { target: 'step_30_await_govt_final' } },
    },
    step_33_doc_resubmit: {
      on: { COMPLETE_STEP: { target: 'step_30_await_govt_final' } },
    },
    step_38_coi_received: {
      entry: [({ context }) => sendEmailAction({ context })],
      on: {
        COMPLETE_STEP: {
          target: 'step_39_pan_tan_received',
          actions: assign(() => ({ currentStepNumber: 39 })),
        },
      },
    },
    step_39_pan_tan_received: {
      entry: [({ context }) => sendEmailAction({ context })],
      on: {
        COMPLETE_STEP: {
          target: 'step_40_mail_client',
          actions: assign(() => ({ currentStepNumber: 40 })),
        },
      },
    },
    step_40_mail_client: {
      on: {
        COMPLETE_STEP: {
          target: 'step_41_master_sheet_update',
          actions: assign(() => ({ currentStepNumber: 41 })),
        },
      },
    },
    step_41_master_sheet_update: {
      on: { COMPLETE_STEP: { target: 'completed' } },
    },
    completed: {
      type: 'final',
    },
  },
});
