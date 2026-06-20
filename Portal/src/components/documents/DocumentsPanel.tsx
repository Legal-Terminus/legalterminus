import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText, Upload, Download, Check, X, Loader2, AlertCircle,
  CheckCircle2, Clock, Archive,
} from 'lucide-react';
import {
  getDocuments, uploadDocument, openDocument, reviewDocument,
  ALLOWED_DOC_EXT, type TaskDocument, type DocumentStatus,
} from '../../api/documents';
import { useToast } from '../common/toastContext';

/**
 * Documents tab (E-05). Staff review uploads (approve/reject); clients upload and
 * re-upload after rejection. Active documents show first; archived (superseded)
 * versions are listed under a history section so the trail is preserved.
 */
export default function DocumentsPanel({ taskId, isStaff }: { taskId: string; isStaff: boolean }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: docs = [], isLoading, error } = useQuery({
    queryKey: ['documents', taskId],
    queryFn: () => getDocuments(taskId),
    staleTime: 5_000,
    refetchInterval: 20_000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['documents', taskId] });

  const upload = useMutation({
    mutationFn: (file: File) => uploadDocument(taskId, file),
    onSuccess: () => { invalidate(); toast.success('Document uploaded — awaiting review.'); },
    onError: (e: Error) => toast.error(e.message || 'Upload failed.'),
  });

  const active = docs.filter((d) => d.status !== 'archived');
  const archived = docs.filter((d) => d.status === 'archived');

  if (isLoading) {
    return (
      <div className="card p-12 flex items-center justify-center text-ink-faint">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }
  if (error) {
    return <div className="card p-8 text-center text-sm text-red-600">Failed to load documents. {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-5">
      {/* Uploader — both roles can add a document (staff on behalf of the client too). */}
      <Uploader onPick={(f) => upload.mutate(f)} busy={upload.isPending} />

      {active.length === 0 && archived.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-10 h-10 text-hairline mx-auto mb-3" />
          <p className="text-sm font-medium text-ink">No documents yet</p>
          <p className="text-sm text-ink-muted mt-1">Upload a document above to get started.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {active.map((d) => (
            <DocumentCard
              key={d.docId}
              doc={d}
              taskId={taskId}
              isStaff={isStaff}
              onChanged={invalidate}
              onReupload={(f) => upload.mutate(f)}
              reuploading={upload.isPending}
            />
          ))}
        </div>
      )}

      {archived.length > 0 && (
        <details className="card p-4">
          <summary className="text-sm font-medium text-ink-muted cursor-pointer flex items-center gap-2">
            <Archive className="w-4 h-4" /> Version history ({archived.length})
          </summary>
          <div className="mt-3 space-y-2.5">
            {archived.map((d) => (
              <DocumentCard key={d.docId} doc={d} taskId={taskId} isStaff={isStaff} onChanged={invalidate} archived />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

/* ── Uploader ──────────────────────────────────────────────────────────────── */

function Uploader({ onPick, busy }: { onPick: (f: File) => void; busy: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="card p-4 flex items-center justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">Upload a document</p>
        <p className="text-xs text-ink-muted mt-0.5">PDF, JPG, PNG or DOCX · max 10MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_DOC_EXT}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = ''; // allow re-picking the same file
        }}
      />
      <button onClick={() => inputRef.current?.click()} disabled={busy} className="btn-primary inline-flex items-center gap-1.5">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {busy ? 'Uploading…' : 'Choose file'}
      </button>
    </div>
  );
}

/* ── Document card ───────────────────────────────────────────────────────────── */

const STATUS_META: Record<DocumentStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  awaiting_upload: { label: 'Awaiting upload', cls: 'bg-surface-card text-ink-muted', Icon: Clock },
  pending_review:  { label: 'Pending review',  cls: 'bg-amber-50 text-amber-700',     Icon: Clock },
  approved:        { label: 'Approved',        cls: 'bg-emerald-50 text-emerald-700', Icon: CheckCircle2 },
  rejected:        { label: 'Rejected',        cls: 'bg-red-50 text-red-600',          Icon: AlertCircle },
  archived:        { label: 'Archived',        cls: 'bg-surface-card text-ink-faint', Icon: Archive },
};

function DocumentCard({
  doc, taskId, isStaff, onChanged, archived, onReupload, reuploading,
}: {
  doc: TaskDocument;
  taskId: string;
  isStaff: boolean;
  onChanged: () => void;
  archived?: boolean;
  onReupload?: (f: File) => void;
  reuploading?: boolean;
}) {
  const toast = useToast();
  const reuploadRef = useRef<HTMLInputElement>(null);
  const [rejecting, setRejecting] = useState(false);
  const [remark, setRemark] = useState('');
  const meta = STATUS_META[doc.status];

  const review = useMutation({
    mutationFn: (vars: { action: 'approve' | 'reject'; remark?: string }) =>
      reviewDocument(taskId, doc.docId, vars.action, vars.remark),
    onSuccess: () => { setRejecting(false); setRemark(''); onChanged(); },
    onError: (e: Error) => toast.error(e.message || 'Could not update the document.'),
  });

  const open = useMutation({
    mutationFn: () => openDocument(taskId, doc.docId),
    onError: (e: Error) => toast.error(e.message || 'Could not open the document.'),
  });

  return (
    <div className={`card p-4 ${archived ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-surface-soft flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-ink-muted" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink truncate">{doc.fileName}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`badge ${meta.cls} inline-flex items-center gap-1`}>
                <meta.Icon className="w-3 h-3" /> {meta.label}
              </span>
              {doc.stepNumber != null && <span className="text-[11px] text-ink-faint">Step {doc.stepNumber}</span>}
            </div>
          </div>
        </div>
        {doc.status !== 'awaiting_upload' && (
          <button
            onClick={() => open.mutate()}
            disabled={open.isPending}
            className="btn-secondary py-1.5 px-3 text-xs inline-flex items-center gap-1.5 shrink-0"
          >
            {open.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Open
          </button>
        )}
      </div>

      {/* Rejection remark — visible to both roles so the client knows what to fix. */}
      {doc.status === 'rejected' && doc.rejectionRemark && (
        <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2 mt-3">{doc.rejectionRemark}</p>
      )}

      {/* Staff review actions (pending only, not on archived). */}
      {isStaff && !archived && doc.status === 'pending_review' && (
        <div className="mt-3">
          {!rejecting ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => review.mutate({ action: 'approve' })}
                disabled={review.isPending}
                className="btn-primary py-1.5 inline-flex items-center gap-1.5"
              >
                {review.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Approve
              </button>
              <button onClick={() => setRejecting(true)} disabled={review.isPending} className="btn-secondary py-1.5 inline-flex items-center gap-1.5">
                <X className="w-4 h-4" /> Reject
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                className="input-field text-sm w-full"
                rows={2}
                placeholder="Reason for rejection (shown to the client)…"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => review.mutate({ action: 'reject', remark: remark.trim() })}
                  disabled={review.isPending || !remark.trim()}
                  className="btn-primary py-1.5 bg-red-600 hover:bg-red-700 inline-flex items-center gap-1.5"
                >
                  {review.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />} Confirm rejection
                </button>
                <button onClick={() => { setRejecting(false); setRemark(''); }} disabled={review.isPending} className="btn-ghost py-1.5">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Re-upload after rejection (E05-S03) — available to whoever is viewing. */}
      {!archived && doc.status === 'rejected' && onReupload && (
        <div className="mt-3">
          <input
            ref={reuploadRef}
            type="file"
            accept={ALLOWED_DOC_EXT}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onReupload(f);
              e.target.value = '';
            }}
          />
          <button onClick={() => reuploadRef.current?.click()} disabled={reuploading} className="btn-secondary py-1.5 inline-flex items-center gap-1.5">
            {reuploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Re-upload
          </button>
        </div>
      )}
    </div>
  );
}
