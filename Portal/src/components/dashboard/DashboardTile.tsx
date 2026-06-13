import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface Props {
  to: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

export default function DashboardTile({ to, title, desc, icon: Icon }: Props) {
  return (
    <Link
      to={to}
      className="group card p-5 hover:shadow-card-hover hover:border-ink/15 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg bg-surface-card flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-ink" />
        </div>
        <ArrowRight className="w-4 h-4 text-ink-faint opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-muted leading-snug">{desc}</p>
    </Link>
  );
}
