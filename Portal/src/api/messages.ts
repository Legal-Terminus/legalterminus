import { apiFetch } from './client';

/**
 * #123 — per-matter discussion thread (client ⇄ internal team).
 * Staff choose per message whether the client can see it (default OFF, #115);
 * a client's own messages are always visible to them.
 */
export interface MatterMessage {
  id: string;
  body: string;
  createdAt: string | null;
  clientVisible: boolean;
  authorRole: 'admin' | 'manager' | 'team_member' | 'client' | null;
  authorName: string;
  isMine: boolean;
}

export const getMessages = (taskId: string) =>
  apiFetch<{ data: MatterMessage[] }>(`/api/tasks/${taskId}/messages`).then((r) => r.data);

export const postMessage = (taskId: string, body: string, clientVisible: boolean) =>
  apiFetch<MatterMessage>(`/api/tasks/${taskId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body, clientVisible }),
  });
