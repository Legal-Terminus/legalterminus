import { createMachine, assign } from 'xstate';
import type { WorkflowContext, WorkflowEvent } from '../shared/types';
import { paymentGateGuard, partPaymentGateGuard } from '../shared/guards';
import { sendEmailAction } from '../shared/actions';

/**
 * Company Incorporation Workflow - 41 Sequential Steps
 * Maps directly to business spec with continuous step numbering (1-41)
 * 
 * Payment Gates: Steps 1, 21, 27
 * Client Approval: Step 10
 * Govt Response: Steps 13, 31
 * Resubmission: Steps 15-19 (after rejection at 13), Steps 33-37 (after rejection at 31)
 * Email Triggers: Steps 20, 38, 39
 */
export const companyIncorporationMachine = createMachine({
  id: 'companyIncorporation',
  initial: 'step_1_payment_gate',
  types: {} as { context: WorkflowContext; events: WorkflowEvent },
  context: ({ input }: { input: WorkflowContext }) => input,
  states: {
    // PHASE 1: INITIAL PAYMENT & NAME APPROVAL (Steps 1-20)
    
    step_1_payment_gate: {
      always: [
        { guard: paymentGateGuard, target: 'step_2_work_assigning' },
        { guard: partPaymentGateGuard, target: 'step_2_work_assigning' },
        { target: 'awaiting_payment_phase1' },
      ],
    },
    awaiting_payment_phase1: {
      on: {
        RECORD_PAYMENT: {
          actions: assign(({ event }) => ({ paymentStatus: event.newStatus })),
          target: 'step_1_payment_gate',
        },
        ADMIN_OVERRIDE_PAYMENT: {
          actions: assign(() => ({ adminOverride: true })),
          target: 'step_2_work_assigning',
        },
      },
    },
    step_2_work_assigning: {
      on: {
        COMPLETE_STEP: {
          target: 'step_3_name_objects_received',
          actions: assign(() => ({ currentStepNumber: 3 })),
        },
      },
    },
    step_3_name_objects_received: {
      on: {
        COMPLETE_STEP: {
          target: 'step_4_checklist_received',
          actions: assign(() => ({ currentStepNumber: 4 })),
        },
      },
    },
    step_4_checklist_received: {
      on: {
        COMPLETE_STEP: {
          target: 'step_5_name_search_prep',
          actions: assign(() => ({ currentStepNumber: 5 })),
        },
      },
    },
    step_5_name_search_prep: {
      on: {
        COMPLETE_STEP: {
          target: 'step_6_name_search_final',
          actions: assign(() => ({ currentStepNumber: 6 })),
        },
      },
    },
    step_6_name_search_final: {
      on: {
        COMPLETE_STEP: {
          target: 'step_7_search_report_mail',
          actions: assign(() => ({ currentStepNumber: 7 })),
        },
      },
    },
    step_7_search_report_mail: {
      on: {
        COMPLETE_STEP: {
          target: 'step_8_client_approval_pending',
          actions: assign(() => ({ currentStepNumber: 8 })),
        },
      },
    },
    step_8_client_approval_pending: {
      on: {
        COMPLETE_STEP: {
          target: 'step_9_client_approval_final',
          actions: assign(() => ({ currentStepNumber: 9 })),
        },
      },
    },
    step_9_client_approval_final: {
      on: {
        CLIENT_APPROVE: {
          target: 'step_10_name_application_filing',
          actions: assign(() => ({ currentStepNumber: 10 })),
        },
        CLIENT_REJECT: {
          target: 'step_5_name_search_prep',
          actions: assign(() => ({ currentStepNumber: 5 })),
        },
      },
    },
    step_10_name_application_filing: {
      on: {
        COMPLETE_STEP: {
          target: 'step_11_payment_name_application',
          actions: assign(() => ({ currentStepNumber: 11 })),
        },
      },
    },
    step_11_payment_name_application: {
      on: {
        COMPLETE_STEP: {
          target: 'step_12_pending_name_approval',
          actions: assign(() => ({ currentStepNumber: 12 })),
        },
      },
    },
    step_12_pending_name_approval: {
      on: {
        COMPLETE_STEP: {
          target: 'step_13_await_govt_name_approval',
          actions: assign(() => ({ currentStepNumber: 13 })),
        },
      },
    },
    step_13_await_govt_name_approval: {
      on: {
        GOVT_APPROVE: {
          target: 'step_14_resubmission_decision',
          actions: assign(() => ({ currentStepNumber: 14 })),
        },
        GOVT_REJECT: {
          target: 'step_15_resubmission_branch',
          actions: assign(() => ({ currentStepNumber: 15 })),
        },
      },
    },
    step_14_resubmission_decision: {
      on: {
        BRANCH_DECISION: [
          {
            guard: ({ event }) => event.type === 'BRANCH_DECISION' && event.branch === 'new_name',
            target: 'step_5_name_search_prep',
            actions: assign(() => ({ currentStepNumber: 5 })),
          },
          {
            guard: ({ event }) => event.type === 'BRANCH_DECISION' && event.branch === 'documentation',
            target: 'step_16_preparation_of_document',
            actions: assign(() => ({ currentStepNumber: 16 })),
          },
        ],
      },
    },
    step_15_resubmission_branch: {
      on: {
        COMPLETE_STEP: {
          target: 'step_14_resubmission_decision',
          actions: assign(() => ({ currentStepNumber: 14 })),
        },
      },
    },
    step_16_preparation_of_document: {
      on: {
        COMPLETE_STEP: {
          target: 'step_17_repeat_from_step_5',
          actions: assign(() => ({ currentStepNumber: 17 })),
        },
      },
    },
    step_17_repeat_from_step_5: {
      on: {
        COMPLETE_STEP: {
          target: 'step_5_name_search_prep',
          actions: assign(() => ({ currentStepNumber: 5 })),
        },
      },
    },
    step_18_internal_checkpoint: {
      on: {
        COMPLETE_STEP: {
          target: 'step_19_internal_checkpoint_2',
          actions: assign(() => ({ currentStepNumber: 19 })),
        },
      },
    },
    step_19_internal_checkpoint_2: {
      on: {
        COMPLETE_STEP: {
          target: 'step_20_name_approval_letter',
          actions: assign(() => ({ currentStepNumber: 20 })),
        },
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

    // PHASE 2: DOCUMENT COLLECTION & FORMS (Steps 21-30)

    step_21_part_payment_gate: {
      always: [
        { guard: paymentGateGuard, target: 'step_22_document_prep' },
        { target: 'awaiting_payment_phase2' },
      ],
      on: {
        RECORD_PAYMENT: {
          actions: assign(({ event }) => ({ paymentStatus: event.newStatus })),
          target: 'step_21_part_payment_gate',
        },
        ADMIN_OVERRIDE_PAYMENT: {
          actions: assign(() => ({ adminOverride: true })),
          target: 'step_22_document_prep',
        },
      },
    },
    awaiting_payment_phase2: {
      on: {
        RECORD_PAYMENT: {
          actions: assign(({ event }) => ({ paymentStatus: event.newStatus })),
          target: 'step_21_part_payment_gate',
        },
        ADMIN_OVERRIDE_PAYMENT: {
          actions: assign(() => ({ adminOverride: true })),
          target: 'step_22_document_prep',
        },
      },
    },
    step_22_document_prep: {
      on: {
        COMPLETE_STEP: {
          target: 'step_23_waiting_client_signature',
          actions: assign(() => ({ currentStepNumber: 23 })),
        },
      },
    },
    step_23_waiting_client_signature: {
      on: {
        COMPLETE_STEP: {
          target: 'step_24_collection_documents',
          actions: assign(() => ({ currentStepNumber: 24 })),
        },
      },
    },
    step_24_collection_documents: {
      on: {
        COMPLETE_STEP: {
          target: 'step_25_form_fill_up',
          actions: assign(() => ({ currentStepNumber: 25 })),
        },
      },
    },
    step_25_form_fill_up: {
      on: {
        COMPLETE_STEP: {
          target: 'step_26_form_check',
          actions: assign(() => ({ currentStepNumber: 26 })),
        },
      },
    },
    step_26_form_check: {
      on: {
        COMPLETE_STEP: {
          target: 'step_27_full_payment_gate',
          actions: assign(() => ({ currentStepNumber: 27 })),
        },
      },
    },
    step_27_full_payment_gate: {
      always: [
        { guard: paymentGateGuard, target: 'step_28_upload_forms' },
        { target: 'awaiting_payment_phase3' },
      ],
      on: {
        RECORD_PAYMENT: {
          actions: assign(({ event }) => ({ paymentStatus: event.newStatus })),
          target: 'step_27_full_payment_gate',
        },
        ADMIN_OVERRIDE_PAYMENT: {
          actions: assign(() => ({ adminOverride: true })),
          target: 'step_28_upload_forms',
        },
      },
    },
    awaiting_payment_phase3: {
      on: {
        RECORD_PAYMENT: {
          actions: assign(({ event }) => ({ paymentStatus: event.newStatus })),
          target: 'step_27_full_payment_gate',
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
          target: 'step_30_pending_approval_coi',
          actions: assign(() => ({ currentStepNumber: 30 })),
        },
      },
    },
    step_30_pending_approval_coi: {
      on: {
        COMPLETE_STEP: {
          target: 'step_31_await_govt_final_approval',
          actions: assign(() => ({ currentStepNumber: 31 })),
        },
      },
    },

    // PHASE 3: FINAL APPROVAL & COMPLETION (Steps 31-41)

    step_31_await_govt_final_approval: {
      on: {
        GOVT_APPROVE: {
          target: 'step_32_resubmission_info_branch',
          actions: assign(() => ({ currentStepNumber: 32 })),
        },
        GOVT_REJECT: {
          target: 'step_33_resubmission_decision_final',
          actions: assign(() => ({ currentStepNumber: 33 })),
        },
      },
    },
    step_32_resubmission_info_branch: {
      on: {
        COMPLETE_STEP: {
          target: 'step_34_collection_info_or_docs',
          actions: assign(() => ({ currentStepNumber: 34 })),
        },
      },
    },
    step_33_resubmission_decision_final: {
      on: {
        BRANCH_DECISION: [
          {
            guard: ({ event }) => event.type === 'BRANCH_DECISION' && event.branch === 'information',
            target: 'step_34_collection_info_or_docs',
            actions: assign(() => ({ currentStepNumber: 34 })),
          },
          {
            guard: ({ event }) => event.type === 'BRANCH_DECISION' && event.branch === 'documentation',
            target: 'step_34_collection_info_or_docs',
            actions: assign(() => ({ currentStepNumber: 34 })),
          },
        ],
      },
    },
    step_34_collection_info_or_docs: {
      on: {
        COMPLETE_STEP: {
          target: 'step_35_client_approval_resubmit',
          actions: assign(() => ({ currentStepNumber: 35 })),
        },
      },
    },
    step_35_client_approval_resubmit: {
      on: {
        CLIENT_APPROVE: {
          target: 'step_36_form_fill_resubmit',
          actions: assign(() => ({ currentStepNumber: 36 })),
        },
        CLIENT_REJECT: {
          target: 'step_34_collection_info_or_docs',
          actions: assign(() => ({ currentStepNumber: 34 })),
        },
      },
    },
    step_36_form_fill_resubmit: {
      on: {
        COMPLETE_STEP: {
          target: 'step_37_pending_approval_final_coi',
          actions: assign(() => ({ currentStepNumber: 37 })),
        },
      },
    },
    step_37_pending_approval_final_coi: {
      on: {
        GOVT_APPROVE: {
          target: 'step_38_coi_received',
          actions: assign(() => ({ currentStepNumber: 38 })),
        },
        GOVT_REJECT: {
          target: 'step_33_resubmission_decision_final',
          actions: assign(() => ({ currentStepNumber: 33 })),
        },
      },
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
          target: 'step_40_mail_client_final_coi',
          actions: assign(() => ({ currentStepNumber: 40 })),
        },
      },
    },
    step_40_mail_client_final_coi: {
      on: {
        COMPLETE_STEP: {
          target: 'step_41_master_sheet_update',
          actions: assign(() => ({ currentStepNumber: 41 })),
        },
      },
    },
    step_41_master_sheet_update: {
      on: {
        COMPLETE_STEP: {
          target: 'completed',
          actions: assign(() => ({ currentStepNumber: 41 })),
        },
      },
    },
    completed: {
      type: 'final',
    },
  },
});
