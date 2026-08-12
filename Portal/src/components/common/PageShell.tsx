import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  back?: ReactNode;
}

export default function PageShell({ title, subtitle, children, action, back }: Props) {
  return (
    <div className="flex flex-col min-h-full">
      <div className="page-header">
        {/* #157: `min-w-0` on BOTH the row and the text block so the title can
            shrink-and-ellipsis instead of wrapping a word per line; the header
            itself stacks below md (see .page-header) so actions never squeeze it. */}
        <div className="flex items-center gap-2 min-w-0 w-full md:w-auto">
          {back && <div className="shrink-0">{back}</div>}
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-ink">{title}</h1>
            {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action && (
          <div className="w-full md:w-auto md:shrink-0 flex flex-wrap items-center gap-2">{action}</div>
        )}
      </div>
      <div className="page-content flex-1">
        {children}
      </div>
    </div>
  );
}
