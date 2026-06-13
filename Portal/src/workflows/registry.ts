/**
 * Service → workflow registry. Re-exported from the SHARED module so Portal and
 * backend share one mapping (no drift). See repo-root `shared/workflows`.
 */
export {
  WORKFLOW_BY_SERVICE_KEY,
  getWorkflowForServiceKey,
  hasWorkflowForServiceKey,
} from '@shared/workflows/registry.js';
