import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { listTasks, getTask, patchTask, patchStep } from '../controllers/tasks.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/',                              listTasks);
router.get('/:taskId',                       getTask);
router.patch('/:taskId',                     patchTask);
router.patch('/:taskId/steps/:stepId',       patchStep);

export default router;
