import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';

/**
 * User-friendly route error boundary (errorElement). Shown when a page throws an
 * unexpected error. End users get a calm message + recovery actions — never a raw
 * stack trace. The technical detail is logged to the console (and shown only in
 * dev, collapsed) for developers.
 */
export default function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  // Always log the real error for developers / monitoring.
  console.error('Route error:', error);

  const status = isRouteErrorResponse(error) ? error.status : undefined;
  const detail =
    isRouteErrorResponse(error) ? `${error.status} ${error.statusText}`
    : error instanceof Error ? error.message
    : 'Unknown error';

  const isDev = import.meta.env?.DEV;

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="card max-w-md w-full p-8 text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
        <h1 className="text-lg font-semibold text-ink mb-1">
          {status === 404 ? 'Page not found' : 'Something went wrong'}
        </h1>
        <p className="text-sm text-ink-muted mb-6">
          {status === 404
            ? 'The page you’re looking for doesn’t exist or has moved.'
            : 'We hit an unexpected problem on this page. Your work is safe — please try again.'}
        </p>

        <div className="flex items-center justify-center gap-2">
          <button onClick={() => navigate(0)} className="btn-primary inline-flex items-center gap-1.5">
            <RotateCw className="w-4 h-4" /> Try again
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary inline-flex items-center gap-1.5">
            <Home className="w-4 h-4" /> Go to dashboard
          </button>
        </div>

        {isDev && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-ink-faint cursor-pointer">Technical details (dev only)</summary>
            <pre className="mt-2 text-[11px] text-ink-muted bg-surface-card rounded-md p-2 overflow-auto max-h-48 whitespace-pre-wrap break-all">
              {error instanceof Error ? (error.stack ?? error.message) : detail}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
