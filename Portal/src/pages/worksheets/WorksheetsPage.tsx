import WorksheetModulePage from './WorksheetModulePage';

/**
 * #217 — the firm's company worksheets (incorporation, auditors, KYC, annual
 * filing, ROC, strike off, ADT-3, Startup Odisha/India, GST, TDS (#280), Udyam,
 * Professional Tax, FSSAI) in one dropdown. KYC rows remind admins and
 * managers before the next KYC falls due.
 */
export default function WorksheetsPage() {
  return (
    <WorksheetModulePage
      module="company"
      title="Worksheets"
      subtitle="Company records kept in one place — search, filter, upload and download as Excel"
      pickerLabel="Worksheet"
    />
  );
}
