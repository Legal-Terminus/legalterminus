import { z } from "zod";

/**
 * Task schemas. Validation for the task endpoints (create/assign, list filters,
 * updates). Mirrors the Zod-on-write convention used across the API.
 */

const shortText = z.string().trim().min(1).max(200);

// POST /api/tasks — assign a service workflow to a client.
// #51: payment status is chosen at creation. For part/full payment, amount fields
// are captured and mirrored into the matter's payment module. 'not_paid' routes
// the matter to admin approval (handled in the controller) rather than going live.
export const taskCreateSchema = z.object({
  clientUid: shortText,
  serviceKey: shortText,
  serviceName: z.string().trim().max(200).optional(),
  // #104: per-matter organisation name (entered at creation), used in email subjects.
  organisation: z.string().trim().max(200).optional(),
  // #149: additional email addresses for THIS matter. The client's own address
  // stays the To recipient; these are CC'd on every automated email.
  ccEmails: z.array(z.string().trim().toLowerCase().email().max(254)).max(20).optional(),
  paymentStatus: z.enum(['not_paid', 'part_paid', 'fully_paid']).default('not_paid'),
  totalCost: z.number().min(0).max(1e9).optional(),
  amountReceived: z.number().min(0).max(1e9).optional(),
  paymentMode: z.string().trim().max(60).optional(),
  // #147: free-text note on how the payment arrived — for payments split across
  // several modes (e.g. "₹1,000 via UPI and ₹500 in Cash"). Optional.
  paymentDescription: z.string().trim().max(1000).optional(),
  // #85: optional handling professional (a staff user UID). Validated in controller.
  professionalUid: z.string().trim().max(200).nullable().optional(),
}).strict().refine(
  (b) => b.paymentStatus === 'not_paid' || typeof b.amountReceived === 'number',
  { message: 'amountReceived is required for part/full payment', path: ['amountReceived'] },
).refine(
  // #117: "Full payment" must actually BE full — reject it while a balance is due.
  // (totalCost omitted → nothing to compare against, so don't block.)
  (b) => b.paymentStatus !== 'fully_paid'
    || typeof b.totalCost !== 'number'
    || (b.amountReceived ?? 0) >= b.totalCost,
  {
    message: 'Payment Status cannot be set to "Full Payment" because an outstanding balance exists. '
      + 'Please either receive the full amount or change the Payment Status to "Part Payment".',
    path: ['paymentStatus'],
  },
);

// PATCH /api/tasks/:taskId — currently only isUrgent is writable here.
export const taskUpdateSchema = z.object({
  isUrgent: z.boolean().optional(),
  // #153: the organisation name is correctable at ANY time — during an active
  // matter and after it completes. It is a label, not workflow state: changing it
  // touches no steps, payments, documents or history.
  organisation: z.string().trim().max(200).nullable().optional(),
  // #149: add / edit / remove the matter's CC recipients at any time. An empty
  // array clears them; an absent key leaves them untouched.
  ccEmails: z.array(z.string().trim().toLowerCase().email().max(254)).max(20).optional(),
  // Assign the whole matter to a staff user (UID), or null/'' to unassign.
  assignedTo: z.string().trim().max(200).nullable().optional(),
  // #85: set/clear the handling professional (a staff user UID). Validated in controller.
  professionalUid: z.string().trim().max(200).nullable().optional(),
}).strict().refine((b) => Object.keys(b).length > 0, {
  message: 'No updatable fields provided',
});

// PATCH /api/tasks/:taskId/payment — edit payment details after creation (#78).
// Admin/manager. Any subset of fields; the controller recomputes amountDue and,
// if paymentStatus isn't given explicitly, derives it from the amounts.
export const taskPaymentUpdateSchema = z.object({
  totalCost: z.number().min(0).max(1e9).optional(),
  amountPaid: z.number().min(0).max(1e9).optional(),
  paymentMode: z.string().trim().max(60).nullable().optional(),
  paymentStatus: z.enum(['not_paid', 'part_paid', 'fully_paid']).optional(),
  // #147: editable after creation alongside the other payment details.
  paymentDescription: z.string().trim().max(1000).nullable().optional(),
}).strict().refine((b) => Object.keys(b).length > 0, {
  message: 'No payment fields provided',
});

// POST /api/tasks/:taskId/payments — record ONE payment against a matter (#148).
// Payments accumulate in a subcollection; the task doc keeps amountPaid/amountDue
// as rollups recomputed from the ledger, so instalments never overwrite each other.
export const paymentCreateSchema = z.object({
  amount: z.number().positive().max(1e9),
  mode: z.string().trim().min(1).max(60),
  // Defaults to "now" when omitted; back-dating a received payment is allowed.
  paidAt: z.string().trim().max(40).optional(),
  reference: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(1000).optional(),
}).strict();

// PATCH /api/tasks/:taskId/payments/:paymentId — correct a recorded payment.
export const paymentUpdateSchema = z.object({
  amount: z.number().positive().max(1e9).optional(),
  mode: z.string().trim().min(1).max(60).optional(),
  paidAt: z.string().trim().max(40).optional(),
  reference: z.string().trim().max(200).nullable().optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
}).strict().refine((b) => Object.keys(b).length > 0, {
  message: 'No payment fields provided',
});

// POST /api/tasks/:taskId/transition — fire a workflow event (intent).
const WORKFLOW_EVENTS = [
  'COMPLETE_STEP', 'RECORD_PAYMENT', 'ADMIN_OVERRIDE_PAYMENT', 'BRANCH_DECISION',
  'CLIENT_APPROVE', 'CLIENT_REJECT', 'GOVT_APPROVE', 'GOVT_REJECT', 'RESUBMIT', 'REJECT_DOCUMENT',
  'REWORK', // #56: staff "Reject / Need Correction" — reverts to a prior step
];
export const taskTransitionSchema = z.object({
  event: z.object({
    type: z.enum(WORKFLOW_EVENTS),
    // Event-specific optional fields (validated loosely; controller/engine enforce semantics).
    newStatus: z.enum(['not_paid', 'part_paid', 'fully_paid']).optional(),
    branch: z.string().trim().max(40).optional(),
    // #122: comments may be rich text (HTML), so the cap is generous — the
    // controller sanitises and re-caps to 8000 chars of CLEAN markup.
    remark: z.string().trim().max(20000).optional(),
    amount: z.number().optional(),
    mode: z.string().trim().max(40).optional(),
    reason: z.string().trim().max(500).optional(),
    // #115: staff opt-in to share this step comment with the client (default off).
    commentClientVisible: z.boolean().optional(),
  }).passthrough(),
}).strict();

// POST /api/tasks/:taskId/reject — reject a matter pending approval (reason required).
export const taskRejectSchema = z.object({
  reason: z.string().trim().min(1).max(500),
}).strict();

// POST /api/tasks/:taskId/stop — stop/cancel an in-flight matter (reason required, #41).
export const taskStopSchema = z.object({
  reason: z.string().trim().min(1).max(500),
}).strict();

// ─── Document cycle (E-05) ─────────────────────────────────────────────────
// POST /api/tasks/:taskId/documents/signed-upload-url
export const signedUploadUrlSchema = z.object({
  stepNumber: z.coerce.number().int().min(0).optional(),
  fileName: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(120),
  docType: z.string().trim().max(100).optional(), // #79: e.g. PAN, TAN, Address proof
}).strict();

// POST /api/tasks/:taskId/documents/:docId/confirm
export const confirmUploadSchema = z.object({
  uploaded: z.boolean().optional(),
}).strip();

// POST /api/tasks/:taskId/documents/:docId/review
export const reviewDocumentSchema = z.object({
  action: z.enum(['approve', 'reject']),
  remark: z.string().trim().max(1000).optional(),
}).strict().refine((b) => b.action === 'approve' || (b.remark && b.remark.trim().length > 0), {
  message: 'A rejection remark is required.',
  path: ['remark'],
});

// #125: PATCH document visibility — staff share/hide a doc from the client.
export const documentVisibilitySchema = z.object({
  clientVisible: z.boolean(),
}).strict();

// GET /api/tasks list filters (+ pagination merged in route).
export const taskListQuerySchema = z.object({
  status: z.enum([
    'pending', 'active', 'completed', 'cancelled', 'on_hold',
    'pending_admin_approval', 'rejected', 'archived',
  ]).optional(),
  assignedTo: z.string().trim().max(200).optional(),
  isUrgent: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().trim().min(1).max(1500).optional(),
}).strip();

// #105: staff "Note to client" on a step — comment-only, no transition.
export const stepNoteSchema = z.object({
  note: z.string().trim().min(1).max(8000),
}).strict();
