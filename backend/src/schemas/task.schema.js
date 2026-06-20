import { z } from "zod";

/**
 * Task schemas. Validation for the task endpoints (create/assign, list filters,
 * updates). Mirrors the Zod-on-write convention used across the API.
 */

const shortText = z.string().trim().min(1).max(200);

// POST /api/tasks — assign a service workflow to a client.
export const taskCreateSchema = z.object({
  clientUid: shortText,
  serviceKey: shortText,
  serviceName: z.string().trim().max(200).optional(),
}).strict();

// PATCH /api/tasks/:taskId — currently only isUrgent is writable here.
export const taskUpdateSchema = z.object({
  isUrgent: z.boolean().optional(),
  // Assign the whole matter to a staff user (UID), or null/'' to unassign.
  assignedTo: z.string().trim().max(200).nullable().optional(),
}).strict().refine((b) => Object.keys(b).length > 0, {
  message: 'No updatable fields provided',
});

// POST /api/tasks/:taskId/transition — fire a workflow event (intent).
const WORKFLOW_EVENTS = [
  'COMPLETE_STEP', 'RECORD_PAYMENT', 'ADMIN_OVERRIDE_PAYMENT', 'BRANCH_DECISION',
  'CLIENT_APPROVE', 'CLIENT_REJECT', 'GOVT_APPROVE', 'GOVT_REJECT', 'RESUBMIT', 'REJECT_DOCUMENT',
];
export const taskTransitionSchema = z.object({
  event: z.object({
    type: z.enum(WORKFLOW_EVENTS),
    // Event-specific optional fields (validated loosely; controller/engine enforce semantics).
    newStatus: z.enum(['not_paid', 'part_paid', 'fully_paid']).optional(),
    branch: z.string().trim().max(40).optional(),
    remark: z.string().trim().max(2000).optional(),
    amount: z.number().optional(),
    mode: z.string().trim().max(40).optional(),
    reason: z.string().trim().max(500).optional(),
  }).passthrough(),
}).strict();

// POST /api/tasks/:taskId/reject — reject a matter pending approval (reason required).
export const taskRejectSchema = z.object({
  reason: z.string().trim().min(1).max(500),
}).strict();

// ─── Document cycle (E-05) ─────────────────────────────────────────────────
// POST /api/tasks/:taskId/documents/signed-upload-url
export const signedUploadUrlSchema = z.object({
  stepNumber: z.coerce.number().int().min(0).optional(),
  fileName: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(120),
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

// GET /api/tasks list filters (+ pagination merged in route).
export const taskListQuerySchema = z.object({
  status: z.enum([
    'pending', 'active', 'completed', 'cancelled', 'on_hold',
    'pending_admin_approval', 'rejected',
  ]).optional(),
  assignedTo: z.string().trim().max(200).optional(),
  isUrgent: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().trim().min(1).max(1500).optional(),
}).strip();
