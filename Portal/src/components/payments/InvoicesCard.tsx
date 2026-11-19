import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, FileText, Loader2, RefreshCw, Trash2, Upload } from 'lucide-react';
import { useToast } from '../common/toastContext';
import { useConfirm } from '../common/confirmContext';
import {
  deleteInvoice, downloadInvoice, getInvoices, invoicesKey, uploadInvoice, type MatterInvoice,
} from '../../api/invoices';

/**
 * #313 — Invoices, on a matter's Payments tab.
 *
 * Admin / manager (`canManage`) upload PDF invoices — several per matter — and
 * replace or delete one. The client sees the invoices of their own matter and
 * downloads them. Team members never reach this card: the Payments tab is
 * hidden from them and the API refuses them (#148).
 *
 * Each invoice shows its upload date. A replacement is a new upload that takes
 * the old one's place, so it carries the new date.
 */
const day = (iso: string | null | undefined) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

interface Props {
  taskId: string;
  /** Admin / manager: upload, replace and delete. */
  canManage: boolean;
}

export default function InvoicesCard({ taskId, canManage }: Props) {
  const toast = useToast();
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: invoices = [], isLoading, isError } = useQuery({
    queryKey: invoicesKey(taskId),
    queryFn: () => getInvoices(taskId),
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: invoicesKey(taskId) });
    qc.invalidateQueries({ queryKey: ['task-events', taskId] });
  };

  const upload = useMutation({
    mutationFn: (file: File) => uploadInvoice(taskId, file),
    onSuccess: () => { toast.success('Invoice uploaded.'); refresh(); },
    onError: (e: Error) => toast.error(e.message || 'The invoice could not be uploaded.'),
  });

  // A client with no invoices yet sees nothing rather than an empty box.
  if (!canManage && !isLoading && !isError && invoices.length === 0) return null;

  return (
    <div className="card p-5" data-testid="invoices">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-ink">Invoices</p>
          <p className="text-xs text-ink-muted mt-0.5">
            {canManage
              ? 'Upload the invoices for this matter as PDF files (up to 10 MB each). The client can download them.'
              : 'Invoices for this matter. Download a copy for your records.'}
          </p>
        </div>
        {canManage && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              aria-label="Invoice PDF"
              data-testid="invoice-upload-input"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) upload.mutate(f);
              }}
            />
            <button
              type="button"
              disabled={upload.isPending}
              onClick={() => inputRef.current?.click()}
              className="btn-secondary min-h-11 text-sm disabled:opacity-50"
            >
              {upload.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload invoice
            </button>
          </>
        )}
      </div>

      {isLoading && <p className="text-sm text-ink-faint mt-4">Loading invoices…</p>}
      {isError && <p className="text-sm text-red-600 mt-4">Could not load the invoices.</p>}
      {!isLoading && !isError && invoices.length === 0 && (
        <p className="text-sm text-ink-muted mt-4">No invoices uploaded yet.</p>
      )}

      {invoices.length > 0 && (
        <ul className="mt-4 divide-y divide-hairline-soft" aria-label="Invoices">
          {invoices.map((inv) => (
            <InvoiceRow key={inv.id} taskId={taskId} invoice={inv} canManage={canManage} onChanged={refresh} />
          ))}
        </ul>
      )}
    </div>
  );
}

function InvoiceRow({ taskId, invoice, canManage, onChanged }: {
  taskId: string; invoice: MatterInvoice; canManage: boolean; onChanged: () => void;
}) {
  const toast = useToast();
  const confirm = useConfirm();
  const replaceRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState(false);

  const replace = useMutation({
    mutationFn: (file: File) => uploadInvoice(taskId, file, invoice.id),
    onSuccess: () => { toast.success('Invoice replaced.'); onChanged(); },
    onError: (e: Error) => toast.error(e.message || 'The invoice could not be replaced.'),
  });
  const remove = useMutation({
    mutationFn: () => deleteInvoice(taskId, invoice.id),
    onSuccess: () => { toast.success('Invoice deleted.'); onChanged(); },
    onError: (e: Error) => toast.error(e.message || 'The invoice could not be deleted.'),
  });

  const download = async () => {
    setDownloading(true);
    try { await downloadInvoice(taskId, invoice); }
    catch (e) { toast.error((e as Error).message || 'The invoice could not be downloaded.'); }
    finally { setDownloading(false); }
  };

  const askDelete = async () => {
    const ok = await confirm({
      title: 'Delete this invoice?',
      message: `"${invoice.fileName}" is removed for good, and the client can no longer download it.`,
      confirmLabel: 'Delete invoice',
      tone: 'danger',
    });
    if (ok) remove.mutate();
  };

  const busy = replace.isPending || remove.isPending;

  return (
    <li className="py-3 flex flex-col sm:flex-row sm:items-center gap-2" data-testid="invoice-row">
      <div className="flex items-start gap-2 min-w-0 flex-1">
        <FileText className="w-4 h-4 mt-0.5 shrink-0 text-ink-muted" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink wrap-break-word">{invoice.fileName}</p>
          <p className="text-xs text-ink-muted mt-0.5" data-testid="invoice-date">
            Uploaded {day(invoice.uploadedAt)}
            {canManage && invoice.uploadedByName ? ` · by ${invoice.uploadedByName}` : ''}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={download} disabled={downloading}
          aria-label={`Download invoice ${invoice.fileName}`}
          className="btn-secondary min-h-11 text-sm disabled:opacity-50">
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Download
        </button>
        {canManage && (
          <>
            <input
              ref={replaceRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              aria-label={`Replacement PDF for ${invoice.fileName}`}
              data-testid="invoice-replace-input"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) replace.mutate(f);
              }}
            />
            <button type="button" disabled={busy} onClick={() => replaceRef.current?.click()}
              aria-label={`Replace invoice ${invoice.fileName}`}
              className="btn-secondary min-h-11 text-sm disabled:opacity-50">
              {replace.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Replace
            </button>
            <button type="button" disabled={busy} onClick={askDelete}
              aria-label={`Delete invoice ${invoice.fileName}`}
              className="btn-secondary min-h-11 text-sm text-red-700 disabled:opacity-50">
              {remove.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}
