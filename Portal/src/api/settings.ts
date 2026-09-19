import { apiFetch } from './client';

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface EmailTemplateDef {
  label: string;
  audience: 'client' | 'internal';
  description: string;
  placeholders: string[];
  default: EmailTemplate;
}

export interface EmailTemplatesResponse {
  templates: Record<string, EmailTemplate>;
  defs: Record<string, EmailTemplateDef>;
}

/** #107/#108/#109: fetch the editable email templates + their definitions (admin). */
export const getEmailTemplates = () =>
  apiFetch<EmailTemplatesResponse>('/api/settings/email-templates');

/** Persist admin edits to the email templates (admin). */
export const putEmailTemplates = (templates: Record<string, EmailTemplate>) =>
  apiFetch<{ templates: Record<string, EmailTemplate> }>('/api/settings/email-templates', {
    method: 'PUT',
    body: JSON.stringify({ templates }),
  });

export interface ApiTokenRow {
  id: string;
  name: string | null;
  scopes: string[];
  prefix: string;
  createdAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

export const getApiTokens = () =>
  apiFetch<{ data: ApiTokenRow[]; scopes: string[] }>('/api/settings/api-tokens');

/** The secret comes back ONCE, here. It cannot be retrieved afterwards. */
export const createApiToken = (name: string, scopes: string[]) =>
  apiFetch<{ secret: string; token: ApiTokenRow }>('/api/settings/api-tokens', {
    method: 'POST',
    body: JSON.stringify({ name, scopes }),
  });

export const revokeApiToken = (id: string) =>
  apiFetch<{ revoked: boolean }>(`/api/settings/api-tokens/${id}`, { method: 'DELETE' });

/** E21-S04 — outbound webhooks. */
export interface WebhookRow {
  id: string;
  url: string | null;
  events: string[];
  enabled: boolean;
  createdAt: string | null;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  consecutiveFailures: number;
  disabledReason: string | null;
  secretHint: string | null;
}

export interface WebhookDelivery {
  id: string;
  event: string;
  ok: boolean;
  status: number | null;
  ms: number | null;
  error: string | null;
  at: string | null;
}

export const getWebhooks = () =>
  apiFetch<{ data: WebhookRow[]; events: string[] }>('/api/settings/webhooks');

/** The signing secret comes back ONCE, here. */
export const createWebhook = (url: string, events: string[]) =>
  apiFetch<{ id: string; secret: string; subscription: WebhookRow }>('/api/settings/webhooks', {
    method: 'POST',
    body: JSON.stringify({ url, events }),
  });

export const setWebhookEnabled = (id: string, enabled: boolean) =>
  apiFetch<{ enabled: boolean }>(`/api/settings/webhooks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ enabled }),
  });

export const deleteWebhook = (id: string) =>
  apiFetch<{ deleted: boolean }>(`/api/settings/webhooks/${id}`, { method: 'DELETE' });

export const getWebhookDeliveries = (id: string) =>
  apiFetch<{ data: WebhookDelivery[] }>(`/api/settings/webhooks/${id}/deliveries`);

/** The statutory calendar (ported from Ambyflow, Story 35.3). */
export interface CalendarRow {
  key: string;
  label: string;
  kind: 'day_of_month' | 'fixed_date' | 'anchor_offset' | null;
  day: number | null;
  date: string | null;
  offsetDays: number | null;
  /** Where the answer came from, so the screen can offer a revert. */
  source: 'platform' | 'workspace' | 'period';
  resolved: string | null;
}

export const getStatutoryCalendar = (month?: string) =>
  apiFetch<{ rows: CalendarRow[]; month: string | null }>(
    `/api/settings/statutory-calendar${month ? `?month=${month}` : ''}`,
  );

/** `entry: null` reverts to the shipped default rather than freezing it. */
export const setStatutoryOverride = (
  key: string,
  entry: Record<string, unknown> | null,
  periodKey?: string,
) =>
  apiFetch<{ rows: CalendarRow[] }>(`/api/settings/statutory-calendar/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ entry, periodKey: periodKey ?? null }),
  });
