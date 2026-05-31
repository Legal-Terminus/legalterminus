import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../store/authStore';

export function useAuthListener() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Read role from Firestore /users/{uid} document
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let role: Role = 'client'; // Default role
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            role = (userData?.role as Role) ?? 'client';
          }
          
          const idToken = await firebaseUser.getIdToken();
          setUser(firebaseUser, role, idToken);
        } catch (error) {
          console.error('Error reading user role from Firestore:', error);
          // Fallback to client role if Firestore read fails
          const idToken = await firebaseUser.getIdToken();
          setUser(firebaseUser, 'client', idToken);
        }
      } else {
        setUser(null, null, null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);
}
