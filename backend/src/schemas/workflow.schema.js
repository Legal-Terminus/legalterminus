import { z } from 'zod';

/**
 * Workflow config schemas. Per-phase default assignees (E11-S02): a map of
 * phaseId → user UID (or null to clear). Phase-id and assignee validity (exists +
 * is staff) are checked in the controller against the live definition/users.
 */
export const phaseAssignmentsSchema = z.object({
  assignments: z.record(
    z.string().trim().min(1).max(100),                 // phaseId
    z.string().trim().max(200).nullable(),             // uid | null
  ),
}).strict();
