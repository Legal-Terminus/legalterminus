import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  globalLoading: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  globalLoading: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
}));
