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
  /** Set when the text was changed after sending. */
  editedAt?: string | null;
  /** A deleted message keeps its place in the thread, with no text. */
  deleted?: boolean;
  /** #297: only the author may edit it. */
  canEdit?: boolean;
  /** The author, or an admin, may delete it. */
  canDelete?: boolean;
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

/**
 * Change your own message's text. #297: announced like a new message — a
 * shared staff message emails the client, a client's message emails the team —
 * saying it was edited and giving the new text.
 */
export const editMessage = (taskId: string, messageId: string, body: string) =>
  apiFetch<{ id: string; body: string; editedAt: string | null }>(`/api/tasks/${taskId}/messages/${messageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ body }),
  });

/** Remove a message for everyone. Sends no email. */
export const deleteMessage = (taskId: string, messageId: string) =>
  apiFetch<{ id: string; deleted: true }>(`/api/tasks/${taskId}/messages/${messageId}`, { method: 'DELETE' });

/** #200: colleagues a staff member can @mention here (staff only). */
export const getMentionable = (taskId: string) =>
  apiFetch<{ data: { uid: string; name: string; email: string }[] }>(`/api/tasks/${taskId}/mentionable`).then((r) => r.data);
