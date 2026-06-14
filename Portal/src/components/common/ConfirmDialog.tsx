import { useCallback, useRef, useState, type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { ConfirmContext, type ConfirmOptions } from './confirmContext';

/**
 * App-wide confirmation dialog — replaces native window.confirm() with our own
 * styled modal. Promise-based via the `useConfirm()` hook (in ./confirmContext):
 *
 *   const confirm = useConfirm();
 *   if (await confirm({ title: 'Delete?', message: '…', tone: 'danger' })) { … }
 *
 * Mount <ConfirmProvider> once near the app root.
 */
type Resolver = (ok: boolean) => void;

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<Resolver | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    setOpts(options);
    return new Promise<boolean>((resolve) => { resolverRef.current = resolve; });
  }, []);

  const close = useCallback((ok: boolean) => {
    resolverRef.current?.(ok);
    resolverRef.current = null;
    setOpts(null);
  }, []);

  const tone = opts?.tone ?? 'default';

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {opts && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => close(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="card w-full max-w-sm p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3 p-5">
              {tone === 'danger' && (
                <span className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-600" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-ink">{opts.title}</h2>
                {opts.message && <div className="text-sm text-ink-muted mt-1">{opts.message}</div>}
              </div>
              <button onClick={() => close(false)} className="text-ink-faint hover:text-ink shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 bg-surface-soft border-t border-hairline">
              <button onClick={() => close(false)} className="btn-ghost">
                {opts.cancelLabel ?? 'Cancel'}
              </button>
              <button
                onClick={() => close(true)}
                className={tone === 'danger' ? 'btn-primary bg-red-600 hover:bg-red-700' : 'btn-primary'}
              >
                {opts.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
