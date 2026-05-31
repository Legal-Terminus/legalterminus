import { Link } from 'react-router-dom';

const REPORTS = [
  { to: '/admin/reports/all-tasks',   title: 'All Tasks',       desc: 'Filterable view of every task in the system.' },
  { to: '/admin/reports/completed',   title: 'Completed Tasks', desc: 'Tasks marked complete — sorted by finish date.' },
  { to: '/admin/reports/pending',     title: 'Pending Tasks',   desc: 'Pending tasks grouped by blocking reason.' },
  { to: '/admin/reports/master-sheet', title: 'Master Sheet',   desc: 'Full task summary table with CSV export.' },
];

export default function ReportsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map((r) => (
          <Link
            key={r.to}
            to={r.to}
            className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all"
          >
            <p className="text-base font-semibold text-gray-900">{r.title}</p>
            <p className="mt-1 text-sm text-gray-500">{r.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
