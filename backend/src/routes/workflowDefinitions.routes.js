import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { listDefinitions, getDefinition } from '../controllers/workflowDefinitions.controller.js';

const router = Router();

// Workflow definitions are internal config — staff only. (Write/publish endpoints
// for the admin editor are added in the Workflow Editor phase.)
router.use(verifyToken, requireRole('admin', 'manager', 'team_member'));

router.get('/', listDefinitions);          // list all definitions (id, name, version, serviceKeys)
router.get('/:id', getDefinition);         // full definition (steps) for one workflow

export default router;
