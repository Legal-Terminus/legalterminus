import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { taskCreateSchema, taskUpdateSchema, taskListQuerySchema, taskTransitionSchema, taskRejectSchema, taskStopSchema, signedUploadUrlSchema, confirmUploadSchema, reviewDocumentSchema } from '../schemas/task.schema.js';
import { listTasks, getTask, createTask, patchTask, patchStep, transitionTask, deleteTask, listMySteps, listTaskEvents, approveTask, rejectTask, stopTask, archiveTask } from '../controllers/tasks.controller.js';
import { listDocuments, createSignedUploadUrl, confirmUpload, downloadDocument, reviewDocument } from '../controllers/documents.controller.js';

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
router.post('/:taskId/transition',           validate(taskTransitionSchema), transitionTask);
// Approval chain (E03-S04): admin-only approve / reject of a pending matter.
router.post('/:taskId/approve',              requireRole('admin'), approveTask);
router.post('/:taskId/reject',               requireRole('admin'), validate(taskRejectSchema), rejectTask);
// Stop/cancel an in-flight matter when a client discontinues (#41) — staff.
router.post('/:taskId/stop',                 requireRole('admin', 'manager', 'team_member'), validate(taskStopSchema), stopTask);
// Archive a matter (non-destructive; staff) — the alternative to admin-only delete.
router.post('/:taskId/archive',              requireRole('admin', 'manager', 'team_member'), archiveTask);

// Document cycle (E-05). Upload (signed URL → confirm), list, download, review.
// Clients may upload/confirm/list/download on their OWN matter; only staff review.
router.get('/:taskId/documents',                       listDocuments);
router.post('/:taskId/documents/signed-upload-url',    validate(signedUploadUrlSchema), createSignedUploadUrl);
router.post('/:taskId/documents/:docId/confirm',       validate(confirmUploadSchema), confirmUpload);
router.get('/:taskId/documents/:docId/download',       downloadDocument);
router.post('/:taskId/documents/:docId/review',        requireRole('admin', 'manager', 'team_member'), validate(reviewDocumentSchema), reviewDocument);

router.delete('/:taskId',                    requireRole('admin'), deleteTask);

export default router;
