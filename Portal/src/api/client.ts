import { getIdToken } from 'firebase/auth';
import { auth } from '../lib/firebase';

// Empty string = relative URLs → Vite proxy forwards /api/* to backend:5001
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // Always get a fresh token (Firebase SDK auto-refreshes if expired)
  let authHeader: Record<string, string> = {};
  if (auth.currentUser) {
    const idToken = await getIdToken(auth.currentUser);
    authHeader = { Authorization: `Bearer ${idToken}` };
  }

  // Only set Content-Type for non-FormData bodies
  const contentTypeHeader: Record<string, string> =
    options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...contentTypeHeader,
      ...authHeader,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    // Attach the HTTP status + parsed body so callers can branch on it (e.g. a
    // 409 conflict offering a recovery flow) without re-parsing the message.
    // Some guards (e.g. the QA/production test-account guard) answer { error, code } with no
    // `message`; read both so the person sees the real reason, not a bare "API error".
    const b = body as { message?: string; error?: string };
    const err = new Error(b.message ?? b.error ?? 'API error') as ApiError;
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json() as Promise<T>;
}

/** Error thrown by apiFetch on a non-2xx response — carries the HTTP status. */
export interface ApiError extends Error {
  status?: number;
  body?: unknown;
}
