import { useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../store/authStore';

/**
 * Errors that mean "could not reach the server", as opposed to "the server said no".
 * Only these are worth retrying; anything else keeps the old behaviour.
 */
export function isConnectionError(err: unknown): boolean {
  const code = (err as { code?: unknown } | null)?.code;
  if (code === 'unavailable' || code === 'deadline-exceeded' || code === 'auth/network-request-failed') return true;
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

/**
 * Read the signed-in user's role and put it in the store.
 *
 * If the role cannot be read because there is no connection, the role is NOT
 * guessed. It used to fall back to 'client' for the whole session, so an Admin who
 * opened the app with a bad signal was shown the Client screens, with no hint that
 * anything was wrong. Now the store says the role is unavailable and the app shows
 * a "try again" screen; it retries by itself when the connection returns.
 */
export async function loadRole(firebaseUser: User): Promise<void> {
  const { setUser, setRoleUnavailable } = useAuthStore.getState();
  try {
    // Get the ID token BEFORE the Firestore read. On a Capacitor cold start,
    // onAuthStateChanged can fire with a user restored from IndexedDB before its
    // token has finished validating; a getDoc() in that window goes out
    // unauthenticated, firestore.rules denies it (isCurrentUser needs
    // request.auth), and the role silently fell back to 'client'. A no-op on web.
    const idToken = await firebaseUser.getIdToken();
    // Read role from Firestore /users/{uid} document
    const userDocSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
    let role: Role = 'client'; // Default role: a new user with no profile yet
    if (userDocSnap.exists()) {
      role = (userDocSnap.data()?.role as Role) ?? 'client';
    }
    setUser(firebaseUser, role, idToken);
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn('Could not read the user role: no connection.', error);
      setRoleUnavailable(firebaseUser);
      return;
    }
    console.error('Error reading user role from Firestore:', error);
    // Any other failure keeps the previous behaviour: fall back to the client role.
    let idToken: string | null = null;
    try { idToken = await firebaseUser.getIdToken(); } catch { /* signed in, token unavailable */ }
    setUser(firebaseUser, 'client', idToken);
  }
}

/** Try again now (the "Try again" button, and the browser's `online` event). */
export async function retryRole(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  useAuthStore.getState().setLoading(true);
  await loadRole(user);
}

export function useAuthListener() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await loadRole(firebaseUser);
      } else {
        setUser(null, null, null);
      }
      setLoading(false);
    });
    // The connection came back while the "try again" screen was showing.
    const onOnline = () => { if (useAuthStore.getState().roleUnavailable) void retryRole(); };
    window.addEventListener('online', onOnline);
    return () => { unsubscribe(); window.removeEventListener('online', onOnline); };
  }, [setUser, setLoading]);
}
