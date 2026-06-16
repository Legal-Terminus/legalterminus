import { createContext, useContext, type ReactNode } from 'react';

/**
 * Context + hook for the app-wide confirmation dialog. Kept separate from the
 * provider component so the file only exports hooks/constants (satisfies the
 * react-refresh/only-export-components rule).
 */
export interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
}

export const ConfirmContext = createContext<((opts: ConfirmOptions) => Promise<boolean>) | null>(null);

/** Returns an async confirm() — resolves true if the user confirms. */
export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within <ConfirmProvider>');
  return ctx;
}
