import { Link } from 'react-router-dom';
import {
  ListChecks, CheckCircle2, Clock, FileSpreadsheet, Inbox, ArrowRight,
} from 'lucide-react';

const REPORTS = [
  { to: '/reports/all-tasks',    title: 'All Matters',       desc: 'Filterable view of every matter in the system.', icon: ListChecks },
  { to: '/reports/completed',    title: 'Completed Matters', desc: 'Matters marked complete — sorted by finish date.', icon: CheckCircle2 },
  { to: '/reports/pending',      title: 'Pending Matters',   desc: 'Pending matters grouped by blocking reason.', icon: Clock },
  { to: '/reports/master-sheet', title: 'Master Sheet',      desc: 'Full matter summary table with CSV export.', icon: FileSpreadsheet },
  { to: '/reports/leads',        title: 'Contact Leads',   desc: 'Website enquiries — flags leads already registered as clients.', icon: Inbox },
];

export default function ReportsPage() {
  return (
    <div className="page-content">
      <h1 className="text-base font-semibold text-ink mb-1">Reports</h1>
      <p className="text-sm text-ink-muted mb-6">Operational and lead insights.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {REPORTS.map((r) => {
          const Icon = r.icon;
          return (
            <Link
              key={r.to}
              to={r.to}
              className="group card p-5 hover:shadow-card-hover hover:border-ink/15 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-surface-card flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-ink" />
                </div>
                <ArrowRight className="w-4 h-4 text-ink-faint opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="mt-3 text-sm font-semibold text-ink">{r.title}</p>
              <p className="mt-1 text-sm text-ink-muted leading-snug">{r.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
