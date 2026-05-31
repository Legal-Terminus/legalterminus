import { create } from 'zustand';
import type { User } from 'firebase/auth';

export type Role = 'admin' | 'manager' | 'team_member' | 'client';

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
