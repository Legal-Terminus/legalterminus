import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { phaseAssignmentsSchema, stepEtasSchema, stepAssigneesSchema } from '../schemas/workflow.schema.js';
import {
  listDefinitions, getDefinition, getPhaseAssignments, putPhaseAssignments,
  syncCheckDefinition, getStepEtas, putStepEtas, getStepAssignees, putStepAssignees,
} from '../controllers/workflowDefinitions.controller.js';

const router = Router();

router.use(verifyToken);

// Listing all definitions is a staff/editor concern.
router.get('/', requireRole('admin', 'manager', 'team_member'), listDefinitions);

// Per-phase default assignees (E11-S02). Read for staff; write for admin/manager.
// MUST precede '/:id' so '/:id/phase-assignments' isn't swallowed by it.
router.get('/:id/phase-assignments', requireRole('admin', 'manager', 'team_member'), getPhaseAssignments);
router.put('/:id/phase-assignments', requireRole('admin', 'manager'), validate(phaseAssignmentsSchema), putPhaseAssignments);

// Config sync / health check (E10-S02). Staff read; also MUST precede '/:id'.
router.get('/:id/sync-check', requireRole('admin', 'manager', 'team_member'), syncCheckDefinition);

// Per-step ETAs (E13-S01). Read for staff; write for admin/manager. Precede '/:id'.
router.get('/:id/step-etas', requireRole('admin', 'manager', 'team_member'), getStepEtas);
router.put('/:id/step-etas', requireRole('admin', 'manager'), validate(stepEtasSchema), putStepEtas);

// Per-step default assignees. Read for staff; write for admin/manager. Precede '/:id'.
router.get('/:id/step-assignees', requireRole('admin', 'manager', 'team_member'), getStepAssignees);
router.put('/:id/step-assignees', requireRole('admin', 'manager'), validate(stepAssigneesSchema), putStepAssignees);

// A single definition is readable by ANY authenticated role — clients need their
// task's workflow (step titles/types) to render their progress + approval CTAs.
// Step metadata is not sensitive (same data the visualizer shows).
router.get('/:id', getDefinition);

export default router;
