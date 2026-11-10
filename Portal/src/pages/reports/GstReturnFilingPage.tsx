import { useAuthStore } from '../../store/authStore';
import WorksheetModulePage from '../worksheets/WorksheetModulePage';

/**
 * #279 — GST Return Filing under Reports: the firm's GST return register, one
 * row per client per return period, with a Monthly / Quarterly dropdown at the
 * top (the Marketing Reports pattern) whose two sheets never share a record.
 * Rows of GST return matters are filled in and kept up to date from the
 * workflow; staff add their own rows and edit any cell.
 */
export default function GstReturnFilingPage() {
  const role = useAuthStore((s) => s.role);
  // Team members reach this page from the dashboard; the Reports hub is admin/manager only.
  const back = role === 'admin' || role === 'manager' ? { to: '/reports', label: 'Back to reports' } : undefined;
  return (
    <WorksheetModulePage
      module="gst_return"
      title="GST Return Filing"
      subtitle="Monthly and quarterly GST returns — one row per client per period, kept up to date from the GST return matters"
      pickerLabel="Return filing"
      back={back}
    />
  );
}
