import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { listDefinitions, getDefinition } from '../controllers/workflowDefinitions.controller.js';

const router = Router();

router.use(verifyToken);

// Listing all definitions is a staff/editor concern.
router.get('/', requireRole('admin', 'manager', 'team_member'), listDefinitions);

// A single definition is readable by ANY authenticated role — clients need their
// task's workflow (step titles/types) to render their progress + approval CTAs.
// Step metadata is not sensitive (same data the visualizer shows).
router.get('/:id', getDefinition);

export default router;
