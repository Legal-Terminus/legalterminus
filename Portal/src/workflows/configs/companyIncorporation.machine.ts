/**
 * Company Incorporation workflow machine.
 *
 * The definition now lives in the SHARED module (repo-root `shared/workflows`) so
 * the backend (authoritative transitions) and the Portal (visualizer + runtime)
 * use one source with no drift. This file re-exports it for existing Portal
 * imports and keeps the Portal-side typings.
 */
export {
  companyIncorporationMachine,
  paymentGateGuard,
  partPaymentGateGuard,
  sendEmailAction,
} from '@shared/workflows/companyIncorporation.machine.js';
