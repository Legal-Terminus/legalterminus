import { getIdToken } from 'firebase/auth';
import { auth } from '../lib/firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001';

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
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((error as { message?: string }).message ?? 'API error');
  }
  return res.json() as Promise<T>;
}
