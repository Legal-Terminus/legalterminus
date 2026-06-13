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
  isUrgent: z.boolean(),
}).strict();

// GET /api/tasks list filters (+ pagination merged in route).
export const taskListQuerySchema = z.object({
  status: z.enum(['pending', 'active', 'completed', 'cancelled', 'on_hold']).optional(),
  assignedTo: z.string().trim().max(200).optional(),
  isUrgent: z.enum(['true', 'false']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().trim().min(1).max(1500).optional(),
}).strip();
