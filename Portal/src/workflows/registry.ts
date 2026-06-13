import type { AnyStateMachine } from 'xstate';
import { companyIncorporationMachine } from './configs/companyIncorporation.machine';

/**
 * Maps a catalog service key (from the `serviceCategories` collection, e.g.
 * 'incorporation') to the XState machine that defines its workflow. This is the
 * single place that links a service to its configured workflow.
 *
 * Only Company Incorporation has a machine today; adding another service's
 * workflow is a one-line entry here. Services without an entry render a
 * "No workflow configured yet" state on the service detail page.
 */
export const WORKFLOW_BY_SERVICE_KEY: Record<string, AnyStateMachine> = {
  incorporation: companyIncorporationMachine,
};

export const getWorkflowForServiceKey = (key: string | undefined): AnyStateMachine | undefined =>
  key ? WORKFLOW_BY_SERVICE_KEY[key] : undefined;
