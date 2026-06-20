import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastContext, type ToastApi, type ToastOptions, type ToastTone } from './toastContext';

/**
 * App-wide toast notifications — replaces native window.alert() for transient
 * feedback (errors, confirmations of background actions). Use via useToast():
 *
 *   const toast = useToast();
 *   toast.error('Could not save changes.');
 *   toast.success('Matter created.');
 *
 * Mount <ToastProvider> once near the app root. Toasts stack bottom-right and
 * auto-dismiss (errors stick a little longer); each can be dismissed manually.
 */
interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

const TONE_STYLES: Record<ToastTone, { icon: typeof Info; cls: string; iconCls: string }> = {
  error:   { icon: AlertCircle,  cls: 'border-red-200 bg-red-50',         iconCls: 'text-red-600' },
  success: { icon: CheckCircle2, cls: 'border-emerald-200 bg-emerald-50', iconCls: 'text-emerald-600' },
  info:    { icon: Info,         cls: 'border-hairline bg-white',         iconCls: 'text-ink-muted' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message: string, opts?: ToastOptions) => {
    const id = ++idRef.current;
    const tone = opts?.tone ?? 'info';
    // Errors linger longer so they're not missed; default 5s.
    const duration = opts?.duration ?? (tone === 'error' ? 6000 : 4000);
    setToasts((prev) => [...prev, { id, message, tone }]);
    if (duration > 0) {
      window.setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  const api = useMemo<ToastApi>(() => ({
    show,
    error: (m) => show(m, { tone: 'error' }),
    success: (m) => show(m, { tone: 'success' }),
    info: (m) => show(m, { tone: 'info' }),
  }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[120] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const { icon: Icon, cls, iconCls } = TONE_STYLES[t.tone];
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-card ${cls}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconCls}`} />
              <p className="text-sm text-ink flex-1 min-w-0">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-ink-faint hover:text-ink shrink-0" aria-label="Dismiss">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
