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
  /** Signed in, but the role could not be read (no connection). Not the same as "no role". */
  roleUnavailable: boolean;
  setUser: (user: User | null, role: Role | null, idToken: string | null) => void;
  setRoleUnavailable: (user: User) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  idToken: null,
  isLoading: true,
  roleUnavailable: false,
  setUser: (user, role, idToken) => set({ user, role, idToken, isLoading: false, roleUnavailable: false }),
  setRoleUnavailable: (user) => set({ user, role: null, idToken: null, isLoading: false, roleUnavailable: true }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: () => set({ user: null, role: null, idToken: null, isLoading: false, roleUnavailable: false }),
}));
