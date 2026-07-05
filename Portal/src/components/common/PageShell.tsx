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
        <div className="flex items-center gap-2 min-w-0">
          {back && <div className="shrink-0">{back}</div>}
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-ink">{title}</h1>
            {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="page-content flex-1">
        {children}
      </div>
    </div>
  );
}
