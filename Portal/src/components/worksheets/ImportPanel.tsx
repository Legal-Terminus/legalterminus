import { useState } from 'react';
import { AlertTriangle, ArrowLeft, FileSpreadsheet, Loader2 } from 'lucide-react';
import { importWorksheetBatch, type ImportCell, type ImportReport, type WsSheet } from '../../api/worksheets';
import { IMPORT_BATCH, MAX_IMPORT_ROWS, splitHeader, type ParsedSheet } from '../../lib/worksheets';
import { useToast } from '../common/toastContext';

/**
 * #210 / #217 — upload the firm's Excel file into a sheet.
 *
 * The file is read IN THE BROWSER (nothing but its cell values leaves the
 * machine) and sent in batches. First a dry run: what will be added, what will
 * be updated (matched by the sheet's key — Application No. for a trademark),
 * which headings were not recognised. Nothing is written until "Apply".
 */

interface Preview {
  report: ImportReport;
  newCount: number;
  updatedCount: number;
  unchanged: number;
  keyless: number;
  empty: number;
  duplicates: number;
  warnings: ImportReport['warnings'];
}

export default function ImportPanel({ sheet, onDone, onCancel }: { sheet: WsSheet; onDone: () => void; onCancel: () => void }) {
  const toast = useToast();
  const [fileName, setFileName] = useState('');
  const [book, setBook] = useState<{ names: string[]; read: (name: string) => ImportCell[][] } | null>(null);
  const [tab, setTab] = useState('');
  const [parsed, setParsed] = useState<ParsedSheet | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState<'reading' | 'checking' | 'applying' | null>(null);

  const batches = (p: ParsedSheet) => {
    const out: { rows: ImportCell[][]; startRow: number }[] = [];
    for (let i = 0; i < p.rows.length; i += IMPORT_BATCH) {
      out.push({ rows: p.rows.slice(i, i + IMPORT_BATCH), startRow: p.headerRow + 1 + i });
    }
    return out.length ? out : [{ rows: [], startRow: p.headerRow + 1 }];
  };

  const check = async (p: ParsedSheet) => {
    setBusy('checking');
    setPreview(null);
    try {
      const newKeys = new Set<string>();
      const updKeys = new Set<string>();
      let first: ImportReport | null = null;
      const agg = { keyless: 0, unchanged: 0, empty: 0, duplicates: 0, warnings: [] as ImportReport['warnings'] };
      for (const b of batches(p)) {
        const r = await importWorksheetBatch(sheet.key, { headers: p.headers, rows: b.rows, startRow: b.startRow, apply: false });
        first ??= r;
        r.newKeys.forEach((k) => newKeys.add(k));
        r.updatedKeys.forEach((k) => updKeys.add(k));
        agg.keyless += r.summary.keylessRows;
        agg.unchanged += r.summary.unchangedRows;
        agg.empty += r.summary.emptyRows;
        agg.duplicates += r.summary.duplicatesInFile;
        agg.warnings.push(...r.warnings);
      }
      setPreview({
        report: first!, newCount: newKeys.size + agg.keyless, updatedCount: updKeys.size, unchanged: agg.unchanged,
        keyless: agg.keyless, empty: agg.empty, duplicates: agg.duplicates, warnings: agg.warnings.slice(0, 50),
      });
    } catch (e) {
      toast.error((e as Error).message || 'Could not read the file.');
    } finally {
      setBusy(null);
    }
  };

  const choose = (read: (n: string) => ImportCell[][], name: string) => {
    setTab(name);
    const p = splitHeader(read(name));
    if (!p) { setParsed(null); setPreview(null); toast.error('No heading row was found in that sheet.'); return; }
    if (p.rows.length > MAX_IMPORT_ROWS) { setParsed(null); toast.error(`A file can hold up to ${MAX_IMPORT_ROWS} rows — split it and upload the parts.`); return; }
    setParsed(p);
    void check(p);
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    if (!/\.xlsx$/i.test(file.name)) { toast.error('Choose an Excel file (.xlsx).'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('The file must be 10 MB or smaller.'); return; }
    setBusy('reading');
    setFileName(file.name);
    try {
      const XLSX = await import('xlsx');
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const read = (name: string) => XLSX.utils.sheet_to_json<ImportCell[]>(wb.Sheets[name], { header: 1, raw: true, defval: null, blankrows: true });
      const names = wb.SheetNames;
      setBook({ names, read });
      // The tab named like this report, if there is one; otherwise the first.
      const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const best = names.find((n) => norm(n) === norm(sheet.label)) ?? names[0];
      setBusy(null);
      choose(read, best);
    } catch {
      setBusy(null);
      toast.error('That file could not be read as an Excel workbook.');
    }
  };

  const apply = async () => {
    if (!parsed) return;
    setBusy('applying');
    try {
      for (const b of batches(parsed)) {
        await importWorksheetBatch(sheet.key, { headers: parsed.headers, rows: b.rows, startRow: b.startRow, apply: true });
      }
      toast.success(`Upload applied: ${preview?.newCount ?? 0} added, ${preview?.updatedCount ?? 0} updated.`);
      onDone();
    } catch (e) {
      toast.error((e as Error).message || 'The upload stopped part-way. Rows already applied are saved; upload the file again to finish.');
    } finally {
      setBusy(null);
    }
  };

  const r = preview?.report;
  return (
    <div className="card p-4 md:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onCancel} aria-label="Back to the sheet" className="p-2 -ml-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink min-h-11 min-w-11">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-semibold text-ink">Upload Excel into {sheet.label}</h2>
      </div>

      <ul className="text-xs text-ink-muted space-y-1 list-disc pl-5">
        <li>Headings are matched to this sheet's columns; spelling of case, spaces and punctuation does not matter.</li>
        {sheet.recordKey.length > 0
          ? <li>A row whose <strong>{sheet.recordKeyLabel}</strong> is already in the portal updates that record; any other row is added.</li>
          : <li>This sheet has no matching key, so every row is added as a new record.</li>}
        <li>Blank cells never clear what is already in the portal. Calculated columns are worked out by the portal and are not read from the file.</li>
        <li><strong>Logos pasted inside the Excel file are not imported.</strong> Add them to each record afterwards.</li>
      </ul>

      <label className="block">
        <span className="input-label">Excel file (.xlsx)</span>
        <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" aria-label="Excel file"
          onChange={(e) => onFile(e.target.files?.[0])} className="block w-full text-sm py-2" disabled={!!busy} />
      </label>

      {book && book.names.length > 1 && (
        <label className="block sm:w-72">
          <span className="input-label">Sheet in {fileName}</span>
          <select value={tab} onChange={(e) => choose(book.read, e.target.value)} className="input-field px-4 py-3" aria-label="Sheet in the file">
            {book.names.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      )}

      {busy && busy !== 'applying' && (
        <p className="text-sm text-ink-muted inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> {busy === 'reading' ? 'Reading the file…' : 'Checking against the portal…'}</p>
      )}

      {preview && r && (
        <div className="space-y-4" aria-label="Upload preview">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="New records" value={preview.newCount} />
            <Stat label="Records updated" value={preview.updatedCount} />
            <Stat label="Already up to date" value={preview.unchanged} />
            <Stat label="Unknown columns" value={r.unknownColumns.length} />
          </div>
          {preview.keyless > 0 && sheet.recordKey.length > 0 && (
            <p className="text-xs text-ink-muted">{preview.keyless} of the new rows have no {sheet.recordKeyLabel}; they are added as they are.</p>
          )}
          {preview.duplicates > 0 && <p className="text-xs text-ink-muted">{preview.duplicates} rows repeat a {sheet.recordKeyLabel} already in the file; they are merged into one record.</p>}

          {r.unknownColumns.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 text-amber-800 text-sm flex gap-2 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">These headings match no column and will not be imported:</p>
                <p className="mt-1">{r.unknownColumns.map((h) => `“${h}”`).join(', ')}</p>
                <p className="mt-1 text-xs">An admin can add them as columns (Edit columns), then upload again.</p>
              </div>
            </div>
          )}

          <details className="text-sm">
            <summary className="cursor-pointer text-ink-soft py-2">How each heading was read</summary>
            <ul className="mt-2 space-y-1 text-xs">
              {r.columns.filter((c) => c.status !== 'blank').map((c) => (
                <li key={c.index} className="flex flex-wrap gap-x-2">
                  <span className="text-ink">“{c.header}”</span>
                  <span className="text-ink-muted">→ {c.status === 'matched' ? `${c.label}${c.notShown ? ' (kept, not shown on this sheet)' : ''}`
                    : c.status === 'computed' ? `${c.label} — calculated by the portal, not read`
                    : c.status === 'matter' ? `${c.label} — link matters in the portal, not read`
                    : c.status === 'duplicate' ? `${c.label} — already read from another heading`
                    : 'not recognised'}</span>
                </li>
              ))}
            </ul>
          </details>

          {preview.warnings.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-ink-soft py-2">{preview.warnings.length} cells were kept as written</summary>
              <ul className="mt-2 space-y-1 text-xs text-ink-muted">
                {preview.warnings.map((w, i) => <li key={i}>Row {w.row}, “{w.column}”: {w.message}</li>)}
              </ul>
            </details>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <button type="button" onClick={onCancel} className="btn-secondary min-h-11">Cancel</button>
            <button type="button" onClick={apply} disabled={!!busy || (preview.newCount + preview.updatedCount === 0)} className="btn-primary min-h-11 inline-flex items-center justify-center gap-1.5">
              {busy === 'applying' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
              Apply: add {preview.newCount}, update {preview.updatedCount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-hairline-soft p-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
