import { create } from 'zustand';
import type { User } from 'firebase/auth';

// Roles are defined once in lib/roles.ts; re-exported here for existing importers.
export type { Role } from '../lib/roles';
import type { Role } from '../lib/roles';

interface AuthState {
  user: User | null;
  role: Role | null;
  idToken: string | null;
  isLoading: boolean;
  setUser: (user: User | null, role: Role | null, idToken: string | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  idToken: null,
  isLoading: true,
  setUser: (user, role, idToken) => set({ user, role, idToken, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: () => set({ user: null, role: null, idToken: null, isLoading: false }),
}));
