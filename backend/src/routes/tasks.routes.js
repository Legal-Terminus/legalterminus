import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { verifyToken, requireRole, denyReadOnlyRoles } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { taskCreateSchema, taskUpdateSchema, taskPaymentUpdateSchema, paymentCreateSchema, paymentUpdateSchema, taskListQuerySchema, taskTransitionSchema, taskRejectSchema, taskStopSchema, signedUploadUrlSchema, confirmUploadSchema, reviewDocumentSchema, documentVisibilitySchema, stepNoteSchema, internalReminderSchema, messageCreateSchema, messageUpdateSchema } from '../schemas/task.schema.js';
import { listTasks, getTask, createTask, patchTask, updatePayment, listPayments, createPayment, patchPayment, deletePayment, patchStep, transitionTask, deleteTask, listMySteps, listTaskEvents, approveTask, rejectTask, stopTask, restartTask, archiveTask, reopenStep, postStepNote, listRecurringDue, duplicateTask } from '../controllers/tasks.controller.js';
import { listDocuments, createSignedUploadUrl, confirmUpload, downloadDocument, reviewDocument, submitDocuments, deleteDocument, setDocumentVisibility } from '../controllers/documents.controller.js';
import { listMessages, createMessage, updateMessage, deleteMessage, listMentionable } from '../controllers/messages.controller.js';
import { listReminders, sendReminder, listInternalReminders, sendInternalReminder } from '../controllers/reminders.controller.js';
import { postMatterPayNow } from '../controllers/orders.controller.js';
import { matterPayNowSchema } from '../schemas/order.schema.js';
import { listMatterRefunds, createMatterRefund, patchMatterRefund } from '../controllers/refunds.controller.js';
import { refundCreateSchema, refundUpdateSchema } from '../schemas/refund.schema.js';
import { paymentRequestCreateSchema, paymentRequestCancelSchema, paymentRequestRecordSchema, paymentRequestPaySchema } from '../schemas/paymentRequest.schema.js';
import { getPaymentRequests, postPaymentRequest, postCancelPaymentRequest, postRecordPaymentRequest, postPayPaymentRequest } from '../controllers/paymentRequests.controller.js';
import { getFormStep, saveFormStep } from '../controllers/forms.controller.js';
import { uploadCommentImage, getCommentImage } from '../controllers/commentImages.controller.js';
import { commentImageUpload } from '../middleware/commentImageUpload.middleware.js';

const router = Router();

router.use(verifyToken);
// #168: professionals are view-only — block every mutating method up front so a
// new route cannot accidentally grant them write access.
router.use(denyReadOnlyRoles);

router.get('/',                              validate(taskListQuerySchema, 'query'), listTasks);
// Cross-matter step worklist for staff ("My Tasks"). MUST precede '/:taskId'.
router.get('/my-steps',                      requireRole('admin', 'manager', 'team_member'), listMySteps);
router.post('/',                             requireRole('admin', 'manager'), validate(taskCreateSchema), createTask);
// #167 — recurring matters. NOTE: /recurring/due is registered before /:taskId
// so it isn't captured as a task id.
router.get('/recurring/due',                 requireRole('admin', 'manager'), listRecurringDue);
router.post('/:taskId/duplicate',            requireRole('admin', 'manager'), duplicateTask);
router.get('/:taskId',                       getTask);
router.get('/:taskId/events',                listTaskEvents);
// #123: per-matter discussion thread (client + internal). Clients see only
// client-visible messages; staff opt in per message (controller-enforced).
// #111: manual reminder emails from a step — STAFF ONLY (a client can't nudge
// themselves). Copy comes from the editable template store; repeats are allowed
// and each send is audited.
router.get('/:taskId/reminders',             requireRole('admin', 'manager', 'team_member'), listReminders);
router.post('/:taskId/reminders',            requireRole('admin', 'manager', 'team_member'), sendReminder);
// #198: internal reminders to the step's assignee(s) — staff only, separate
// history, recipients resolved server-side from the step.
router.get('/:taskId/internal-reminders',    requireRole('admin', 'manager', 'team_member'), listInternalReminders);
router.post('/:taskId/internal-reminders',   requireRole('admin', 'manager', 'team_member'), validate(internalReminderSchema), sendInternalReminder);
// #200: explicit guards (were implicit) — the controller still enforces
// matter ownership; a professional may read but never post.
router.get('/:taskId/messages',              requireRole('admin', 'manager', 'team_member', 'client', 'professional'), listMessages);
router.post('/:taskId/messages',             requireRole('admin', 'manager', 'team_member', 'client'), validate(messageCreateSchema), createMessage);
// Chat: the author (or an admin) may edit or delete a message. Neither sends
// an email; the controller checks authorship and matter access.
router.patch('/:taskId/messages/:messageId',  requireRole('admin', 'manager', 'team_member', 'client'), validate(messageUpdateSchema), updateMessage);
router.delete('/:taskId/messages/:messageId', requireRole('admin', 'manager', 'team_member', 'client'), deleteMessage);
// #122 follow-up: images in step comments and Discussion messages. Upload is
// staff + client (role guard BEFORE multer, so a refused caller never streams
// 5 MB); the controller then checks the client can see THIS matter. Reading
// streams through the backend after a per-image check (never a signed URL).
router.post('/:taskId/comment-images',          requireRole('admin', 'manager', 'team_member', 'client'), commentImageUpload, uploadCommentImage);
router.get('/:taskId/comment-images/:imageId',  requireRole('admin', 'manager', 'team_member', 'client', 'professional'), getCommentImage);
// #200: the @mention suggestion list — staff only (a client never sees the directory).
router.get('/:taskId/mentionable',           requireRole('admin', 'manager', 'team_member'), listMentionable);
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
// #240 refund log — admin/manager record and move a refund on BY HAND (no
// Razorpay refund automation). The client READS their own matter's refunds
// (the controller answers 404 for anyone else's); team members see no payment
// data at all (#148), so they are refused here too.
router.get('/:taskId/refunds',               requireRole('admin', 'manager', 'client'), listMatterRefunds);
router.post('/:taskId/refunds',              requireRole('admin', 'manager'), validate(refundCreateSchema), createMatterRefund);
router.patch('/:taskId/refunds/:refundId',   requireRole('admin', 'manager'), validate(refundUpdateSchema), patchMatterRefund);
// #220 Pay Now — the CLIENT pays the amount due on their matter online. Creates
// an order at the gateway, so it is rate-limited like POST /api/orders.
const isE2E = String(process.env.EMAIL_DISABLED ?? '').toLowerCase() === 'true' || process.env.NODE_ENV === 'test';
const payNowLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isE2E ? 100_000 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait a few minutes and try again.' },
});
router.post('/:taskId/pay-now', requireRole('client'), payNowLimiter, validate(matterPayNowSchema), postMatterPayNow);
// #222 Additional payment requests (government fees etc.). Any member of staff
// raises and sends one; admin / manager cancel one or record it paid by hand;
// the CLIENT pays one online (amount = the request's server-computed total).
// Team members may read the requests on a matter (they raise them) but still
// not its payment history (#148).
router.get('/:taskId/payment-requests', requireRole('admin', 'manager', 'team_member', 'client'), getPaymentRequests);
router.post('/:taskId/payment-requests', requireRole('admin', 'manager', 'team_member'), validate(paymentRequestCreateSchema), postPaymentRequest);
router.post('/:taskId/payment-requests/:requestId/cancel', requireRole('admin', 'manager'), validate(paymentRequestCancelSchema), postCancelPaymentRequest);
router.post('/:taskId/payment-requests/:requestId/record', requireRole('admin', 'manager'), validate(paymentRequestRecordSchema), postRecordPaymentRequest);
router.post('/:taskId/payment-requests/:requestId/pay', requireRole('client'), payNowLimiter, validate(paymentRequestPaySchema), postPayPaymentRequest);
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

// E34: form steps. The CLIENT fills these in, so there is no requireRole here
// — ownership is checked inside the controller via clientScopeUid (#166), the
// same rule every other client-facing read applies.
router.get('/:taskId/form/:stepNumber', getFormStep);
router.put('/:taskId/form/:stepNumber', saveFormStep);

export default router;
