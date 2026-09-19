import { apiFetch } from './client';

/**
 * E-19 — the client-relationship read API (ported from the cometflow portal).
 *
 * `/api/clients` is MONITORING ("which relationships need me today?"); people
 * CRUD stays on `api/users.ts`. The two surfaces cross-link and never duplicate
 * each other, so keep create/edit/delete out of this file.
 */

/** One client's rolled-up relationship state — the roster row and the 360 KPIs. */
export interface ClientRollup {
  uid: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  businessName: string;
  groupCompany: string;
  professionalName: string;
  createdAt: string | null;
  /** Filing fields the profile is missing (CM-FR12) — reported, never enforced. */
  missingProfileFields: string[];

  activeMatters: number;
  completedMatters: number;
  totalMatters: number;

  // Health signals.
  stuckOnClient: number;
  overdue: number;
  docsPending: number;
  isQuiet: boolean;
  quietDays: number | null;
  lastActivityAt: string | null;

  // Value. `hasPricedMatter` is false when NO matter carries a price — the UI
  // shows an em dash rather than a misleading ₹0.
  outstanding: number;
  lifetimeCollected: number;
  pipeline: number;
  hasPricedMatter: boolean;

  // Commitments and coverage.
  nextRenewalAt: string | null;
  ownerUids: string[];
  serviceKeys: string[];

  /** Server-computed ordering weight; the roster's default sort (CM-FR2). */
  attentionScore: number;
  /** Story 34.1 — the derived entity profile. Staff-only; never sent to a client. */
  tags?: string[];
  entityType?: string | null;
  hasGst?: boolean;
  hasPan?: boolean;
  isComplete?: boolean;
}

export interface ClientMatterMoney {
  priced: boolean;
  total: number;
  received: number;
  balance: number;
}

export interface ClientMatter {
  id: string;
  serviceName: string;
  serviceKey: string | null;
  organisation: string;
  status: string;
  paymentStatus: string;
  currentStepNumber: number | null;
  totalSteps: number;
  assignedTo: string | null;
  professionalUid: string | null;
  updatedAt: string | null;
  createdAt: string | null;
  recurrence: string | null;
  recurrenceNextDueAt: string | null;
  money: ClientMatterMoney;
}

/** One row of the 360's actionable list (CM-FR6). */
export interface AttentionItem {
  kind: 'stuck_on_client' | 'overdue';
  taskId: string;
  serviceName: string;
  stepNumber: number | null;
  stepTitle: string;
  since: string | null;
  dueAt?: string;
}

export interface ClientActivityEvent {
  id: string;
  taskId: string;
  serviceName: string;
  type?: string;
  comment?: string;
  at?: string;
  actorUid?: string | null;
}

export interface ClientDetail {
  client: ClientRollup;
  matters: ClientMatter[];
  renewals: ClientMatter[];
  attention: AttentionItem[];
  activity: ClientActivityEvent[];
}

export interface ClientRosterPage {
  data: ClientRollup[];
  nextCursor: string | null;
}

export const CLIENTS_QUERY_KEY = ['clients'] as const;

export function getClients(params: { limit?: number; cursor?: string } = {}) {
  const q = new URLSearchParams();
  if (params.limit) q.set('limit', String(params.limit));
  if (params.cursor) q.set('cursor', params.cursor);
  const qs = q.toString();
  return apiFetch<ClientRosterPage>(`/api/clients${qs ? `?${qs}` : ''}`);
}

export const getClient = (uid: string) => apiFetch<ClientDetail>(`/api/clients/${uid}`);

/** True when anything about this client wants a human today. */
export const needsAttention = (c: ClientRollup) =>
  c.overdue > 0 || c.stuckOnClient > 0 || c.docsPending > 0 || c.isQuiet;

/** E-19 — the managed client-tag list, merged with tags in use. */
export const getClientTags = () =>
  apiFetch<{ managed: string[]; all: string[] }>('/api/clients/tags');
