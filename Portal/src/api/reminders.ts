import { apiFetch } from './client';

/**
 * #111 — manual reminder emails sent by staff from a workflow step. Copy comes
 * from the editable template store (Settings → Email Templates); several tone
 * variants exist and a reminder may be sent more than once (each is audited).
 */
export type ReminderTemplate = 'reminder_gentle' | 'reminder_followup' | 'reminder_urgent';

export const REMINDER_OPTIONS: { key: ReminderTemplate; label: string; hint: string }[] = [
  { key: 'reminder_gentle',   label: 'Gentle nudge',  hint: 'A friendly first reminder' },
  { key: 'reminder_followup', label: 'Follow-up',     hint: 'Firmer — the first nudge went unanswered' },
  { key: 'reminder_urgent',   label: 'Urgent',        hint: 'Time-critical or repeatedly ignored' },
];

export interface ReminderSend {
  at: string | null;
  stepNumber: number | null;
  template: ReminderTemplate | null;
  byRole: string | null;
}

export const getReminders = (taskId: string) =>
  apiFetch<{ data: ReminderSend[] }>(`/api/tasks/${taskId}/reminders`).then((r) => r.data);

export const sendReminder = (taskId: string, template: ReminderTemplate, stepNumber?: number | null) =>
  apiFetch<{ success: boolean; emailed: boolean; template: string; at: string }>(
    `/api/tasks/${taskId}/reminders`,
    { method: 'POST', body: JSON.stringify({ template, stepNumber }) },
  );
