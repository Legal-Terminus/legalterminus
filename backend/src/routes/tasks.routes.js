import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { taskCreateSchema, taskUpdateSchema, taskListQuerySchema, taskTransitionSchema, taskRejectSchema, stepOfferSchema } from '../schemas/task.schema.js';
import { listTasks, getTask, createTask, patchTask, patchStep, transitionTask, deleteTask, listMySteps, listTaskEvents, approveTask, rejectTask, offerStep, acceptStepOffer, declineStepOffer } from '../controllers/tasks.controller.js';

const router = Router();

router.use(verifyToken);

router.get('/',                              validate(taskListQuerySchema, 'query'), listTasks);
// Cross-matter step worklist for staff ("My Tasks"). MUST precede '/:taskId'.
router.get('/my-steps',                      requireRole('admin', 'manager', 'team_member'), listMySteps);
router.post('/',                             requireRole('admin', 'manager'), validate(taskCreateSchema), createTask);
router.get('/:taskId',                       getTask);
router.get('/:taskId/events',                listTaskEvents);
router.patch('/:taskId',                     validate(taskUpdateSchema), patchTask);
router.patch('/:taskId/steps/:stepId',       patchStep);
// Reassign-with-accept handshake (E03-S02): offer a step; the proposed user
// accepts/declines. Allowed for staff manager/admin or the step's current owner.
router.post('/:taskId/steps/:stepNumber/offer',   requireRole('admin', 'manager', 'team_member'), validate(stepOfferSchema), offerStep);
router.post('/:taskId/steps/:stepNumber/accept',  requireRole('admin', 'manager', 'team_member'), acceptStepOffer);
router.post('/:taskId/steps/:stepNumber/decline', requireRole('admin', 'manager', 'team_member'), declineStepOffer);
router.post('/:taskId/transition',           validate(taskTransitionSchema), transitionTask);
// Approval chain (E03-S04): admin-only approve / reject of a pending matter.
router.post('/:taskId/approve',              requireRole('admin'), approveTask);
router.post('/:taskId/reject',               requireRole('admin'), validate(taskRejectSchema), rejectTask);
router.delete('/:taskId',                    requireRole('admin'), deleteTask);

export default router;
