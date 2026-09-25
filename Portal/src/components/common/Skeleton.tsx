/**
 * Story 27.6 (G8) — stable loading placeholders.
 *
 * Lists used to flash a centred spinner and then reflow into content, so the
 * page jumped on every load and screen readers were told nothing was happening.
 * A skeleton reserves the real layout and the container announces `aria-busy`.
 *
 * Spinners remain correct for in-button pending states (a button keeps its own
 * size), which is why this only replaces list/table/card-level loading.
 *
 * The pulse honours `prefers-reduced-motion` via the global rule in index.css.
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded bg-surface-strong/70 ${className}`} />;
}

/** Placeholder rows for a table body — matches the row rhythm of our tables. */
export function SkeletonRows({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`divide-y divide-hairline ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full shrink-0 hidden sm:block" />
        </div>
      ))}
    </div>
  );
}

/** Placeholder cards for grid surfaces (services, reports, dashboards). */
export function SkeletonCards({ count = 6, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card p-4 space-y-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

/**
 * Wraps a loading region: renders the skeleton while `loading`, and marks the
 * region busy so assistive tech announces the wait instead of silence.
 */
export function LoadingRegion({ loading, skeleton, children, label = 'Loading' }: {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div aria-busy={loading || undefined} aria-label={loading ? label : undefined}>
      {loading ? skeleton : children}
    </div>
  );
}
