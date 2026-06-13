import { companyIncorporationMachine } from './companyIncorporation.machine.js';

/**
 * Maps a catalog service key (from the `serviceCategories` collection, e.g.
 * 'incorporation') to the workflow machine that defines its flow. Single source
 * of truth for service → workflow linkage, shared by Portal and backend.
 *
 * Adding another service's workflow is a one-line entry here.
 */
export const WORKFLOW_BY_SERVICE_KEY = {
  incorporation: companyIncorporationMachine,
};

export const getWorkflowForServiceKey = (key) =>
  key ? WORKFLOW_BY_SERVICE_KEY[key] : undefined;

export const hasWorkflowForServiceKey = (key) => Boolean(getWorkflowForServiceKey(key));
