import { apiFetch } from './client';

/**
 * LT #205 — the Client Database: nine contact fields per client, kept apart
 * from the client's profile. Editing a record here never changes the client
 * form, the client's login email or anything else on the client.
 */

/** What a contact person can be at the client. Mirrors the API's fixed list. */
export const CONTACT_DESIGNATIONS = ['Owner', 'Director', 'Accountant', 'Manager'] as const;

export interface ClientDatabaseRecord {
  uid: string;
  clientName: string;
  contactPerson: string;
  contactDesignation: string;
  phone: string;
  altPhone: string;
  email: string;
  /** One or more addresses, comma-separated. */
  altEmail: string;
  address: string;
  /** YYYY-MM-DD, or '' when unknown. */
  clientSince: string;
  updatedAt: string | null;
}

export type ClientDatabaseFields = Omit<ClientDatabaseRecord, 'uid' | 'updatedAt'>;

/** The nine fields, in the firm's order, with their on-screen labels. */
export const CLIENT_DATABASE_COLUMNS: { key: keyof ClientDatabaseFields; label: string }[] = [
  { key: 'clientName', label: 'Client Name' },
  { key: 'contactPerson', label: 'Contact Person Name' },
  { key: 'contactDesignation', label: 'Contact Person Designation' },
  { key: 'phone', label: 'Contact Number' },
  { key: 'altPhone', label: 'Alternative Number' },
  { key: 'email', label: 'Email ID' },
  { key: 'altEmail', label: 'Alternative Email' },
  { key: 'address', label: 'Business Address' },
  { key: 'clientSince', label: 'Client Since' },
];

export interface ClientDatabasePage {
  data: ClientDatabaseRecord[];
  nextCursor: string | null;
}

export const CLIENT_DATABASE_KEY = ['client-database'] as const;

export function getClientDatabase(params: { search?: string; cursor?: string; limit?: number } = {}) {
  const q = new URLSearchParams();
  if (params.limit) q.set('limit', String(params.limit));
  if (params.cursor) q.set('cursor', params.cursor);
  if (params.search) q.set('search', params.search);
  const qs = q.toString();
  return apiFetch<ClientDatabasePage>(`/api/client-database${qs ? `?${qs}` : ''}`);
}

export const getClientDatabaseNames = () =>
  apiFetch<{ data: { uid: string; clientName: string }[] }>('/api/client-database/names').then((r) => r.data);

export const getClientDatabaseRecord = (uid: string) =>
  apiFetch<{ data: ClientDatabaseRecord }>(`/api/client-database/${uid}`).then((r) => r.data);

export const saveClientDatabaseRecord = (uid: string, fields: Partial<ClientDatabaseFields>) =>
  apiFetch<{ data: ClientDatabaseRecord }>(`/api/client-database/${uid}`, {
    method: 'PUT',
    body: JSON.stringify(fields),
  }).then((r) => r.data);

/** Every record, page by page — for the Excel download only. */
export async function getAllClientDatabase(): Promise<ClientDatabaseRecord[]> {
  const out: ClientDatabaseRecord[] = [];
  let cursor: string | undefined;
  do {
    const page = await getClientDatabase({ limit: 100, cursor });
    out.push(...page.data);
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  return out;
}
