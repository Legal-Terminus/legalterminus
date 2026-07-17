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
