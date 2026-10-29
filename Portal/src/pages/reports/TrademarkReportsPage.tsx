import { useAuthStore } from '../../store/authStore';
import WorksheetModulePage from '../worksheets/WorksheetModulePage';

/**
 * #210 — Trademark Reports: TM Master, Register TM, Opposition Raised,
 * Opposition Received and TM Assignment in one dropdown. One record per
 * trademark (firm, 29 Oct 2026): its common details are shared by every report
 * it is in, and its renewal milestones are calculated.
 */
export default function TrademarkReportsPage() {
  const role = useAuthStore((s) => s.role);
  // Team members reach this page from the dashboard; the Reports hub is admin/manager only.
  const back = role === 'admin' || role === 'manager' ? { to: '/reports', label: 'Back to reports' } : undefined;
  return (
    <WorksheetModulePage
      module="trademark"
      title="Trademark Reports"
      subtitle="TM Master, Register TM, oppositions and assignments — one record per trademark"
      pickerLabel="Report"
      back={back}
    />
  );
}
