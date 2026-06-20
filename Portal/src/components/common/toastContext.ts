import { createContext, useContext } from 'react';

/**
 * Context + hook for the app-wide toast system. Kept separate from the provider
 * component so the file only exports hooks/constants (satisfies the
 * react-refresh/only-export-components rule).
 */
export type ToastTone = 'error' | 'success' | 'info';

export interface ToastOptions {
  /** Tone drives the icon + accent colour. Defaults to 'info'. */
  tone?: ToastTone;
  /** Auto-dismiss after this many ms. Defaults to 5000; 0 = sticky. */
  duration?: number;
}

export interface ToastApi {
  show: (message: string, opts?: ToastOptions) => void;
  error: (message: string) => void;
  success: (message: string) => void;
  info: (message: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

/** Returns the toast API: toast.error('…'), toast.success('…'), toast.show(…). */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}
