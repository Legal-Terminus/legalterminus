import { useEffect } from 'react';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../store/authStore';

export function useAuthListener() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await getIdTokenResult(firebaseUser);
        let role = (tokenResult.claims['role'] as Role) ?? null;
        const idToken = await firebaseUser.getIdToken();
        
        // Default to 'client' if no role is set (Google users or guests)
        if (!role) {
          console.warn('No role found for user, defaulting to client');
          role = 'client';
        }
        
        setUser(firebaseUser, role, idToken);
      } else {
        setUser(null, null, null);
      }
    });
    return unsubscribe;
  }, [setUser, setLoading]);
}
