import { Router } from 'express';
import { verifyToken, requireRole, denyReadOnlyRoles } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { taskCreateSchema, taskUpdateSchema, taskPaymentUpdateSchema, paymentCreateSchema, paymentUpdateSchema, taskListQuerySchema, taskTransitionSchema, taskRejectSchema, taskStopSchema, signedUploadUrlSchema, confirmUploadSchema, reviewDocumentSchema, documentVisibilitySchema, stepNoteSchema } from '../schemas/task.schema.js';
import { listTasks, getTask, createTask, patchTask, updatePayment, listPayments, createPayment, patchPayment, deletePayment, patchStep, transitionTask, deleteTask, listMySteps, listTaskEvents, approveTask, rejectTask, stopTask, restartTask, archiveTask, reopenStep, postStepNote } from '../controllers/tasks.controller.js';
import { listDocuments, createSignedUploadUrl, confirmUpload, downloadDocument, reviewDocument, submitDocuments, deleteDocument, setDocumentVisibility } from '../controllers/documents.controller.js';
import { listMessages, createMessage } from '../controllers/messages.controller.js';
import { listReminders, sendReminder } from '../controllers/reminders.controller.js';

const router = Router();

router.use(verifyToken);
// #168: professionals are view-only — block every mutating method up front so a
// new route cannot accidentally grant them write access.
router.use(denyReadOnlyRoles);

router.get('/',                              validate(taskListQuerySchema, 'query'), listTasks);
// Cross-matter step worklist for staff ("My Tasks"). MUST precede '/:taskId'.
router.get('/my-steps',                      requireRole('admin', 'manager', 'team_member'), listMySteps);
router.post('/',                             requireRole('admin', 'manager'), validate(taskCreateSchema), createTask);
router.get('/:taskId',                       getTask);
router.get('/:taskId/events',                listTaskEvents);
// #123: per-matter discussion thread (client + internal). Clients see only
// client-visible messages; staff opt in per message (controller-enforced).
// #111: manual reminder emails from a step — STAFF ONLY (a client can't nudge
// themselves). Copy comes from the editable template store; repeats are allowed
// and each send is audited.
router.get('/:taskId/reminders',             requireRole('admin', 'manager', 'team_member'), listReminders);
router.post('/:taskId/reminders',            requireRole('admin', 'manager', 'team_member'), sendReminder);
router.get('/:taskId/messages',              listMessages);
router.post('/:taskId/messages',             createMessage);
router.patch('/:taskId',                     validate(taskUpdateSchema), patchTask);
// Edit payment details after creation (#78) — admin/manager.
router.patch('/:taskId/payment',             requireRole('admin', 'manager'), validate(taskPaymentUpdateSchema), updatePayment);
// Payment HISTORY (#148) — a matter's payments are a ledger, since clients pay in
// instalments. Admin/manager only; Team must not see payment data at all.
// #165: clients may READ their own matter's ledger (ownership enforced in the
// controller); writing stays admin/manager. Team members remain excluded (#148).
router.get('/:taskId/payments',              requireRole('admin', 'manager', 'client'), listPayments);
router.post('/:taskId/payments',             requireRole('admin', 'manager'), validate(paymentCreateSchema), createPayment);
router.patch('/:taskId/payments/:paymentId', requireRole('admin', 'manager'), validate(paymentUpdateSchema), patchPayment);
router.delete('/:taskId/payments/:paymentId', requireRole('admin', 'manager'), deletePayment);
router.patch('/:taskId/steps/:stepId',       patchStep);
router.post('/:taskId/transition',           validate(taskTransitionSchema), transitionTask);
// Approval chain (E03-S04): admin-only approve / reject of a pending matter.
router.post('/:taskId/approve',              requireRole('admin'), approveTask);
router.post('/:taskId/reject',               requireRole('admin'), validate(taskRejectSchema), rejectTask);
// Stop/cancel an in-flight matter when a client discontinues (#41) — admin-only (#70).
router.post('/:taskId/stop',                 requireRole('admin'), validate(taskStopSchema), stopTask);
// Restart a previously stopped matter, resuming from where it left off (#71) — admin-only.
router.post('/:taskId/restart',              requireRole('admin'), restartTask);
// #116: reopen a completed step (admin-only rewind). Controller enforces the rest.
router.post('/:taskId/steps/:stepNumber/reopen', requireRole('admin'), reopenStep);
// #105: staff post a client-visible note onto a step without advancing it.
router.post('/:taskId/steps/:stepNumber/note', requireRole('admin', 'manager', 'team_member'), validate(stepNoteSchema), postStepNote);
// Archive a matter (non-destructive) — admin-only (#70); the alternative to admin-only delete.
router.post('/:taskId/archive',              requireRole('admin'), archiveTask);

// Document cycle (E-05). Upload (signed URL → confirm), list, download, review.
// Clients may upload/confirm/list/download on their OWN matter; only staff review.
router.get('/:taskId/documents',                       listDocuments);
router.post('/:taskId/documents/signed-upload-url',    validate(signedUploadUrlSchema), createSignedUploadUrl);
// #113: literal path registered BEFORE the /:docId routes so it can never be
// captured as a docId. Drafts become reviewable only on SUBMIT.
router.post('/:taskId/documents/submit',               submitDocuments);
router.post('/:taskId/documents/:docId/confirm',       validate(confirmUploadSchema), confirmUpload);
router.get('/:taskId/documents/:docId/download',       downloadDocument);
router.post('/:taskId/documents/:docId/review',        requireRole('admin', 'manager', 'team_member'), validate(reviewDocumentSchema), reviewDocument);
// #125: internal team toggles whether a document is shared with the client.
router.patch('/:taskId/documents/:docId/visibility',   requireRole('admin', 'manager', 'team_member'), validate(documentVisibilitySchema), setDocumentVisibility);
router.delete('/:taskId/documents/:docId',             deleteDocument);

router.delete('/:taskId',                    requireRole('admin'), deleteTask);

export default router;
