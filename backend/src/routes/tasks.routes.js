import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { taskCreateSchema, taskUpdateSchema, taskListQuerySchema } from '../schemas/task.schema.js';
import { listTasks, getTask, createTask, patchTask, patchStep } from '../controllers/tasks.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/',                              validate(taskListQuerySchema, 'query'), listTasks);
router.post('/',                             requireRole('admin', 'manager'), validate(taskCreateSchema), createTask);
router.get('/:taskId',                       getTask);
router.patch('/:taskId',                     validate(taskUpdateSchema), patchTask);
router.patch('/:taskId/steps/:stepId',       patchStep);

export default router;
