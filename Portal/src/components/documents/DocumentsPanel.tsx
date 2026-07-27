import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText, Upload, Download, Check, X, Loader2, AlertCircle,
  CheckCircle2, Clock, Archive, Send, Trash2, FilePlus2, Building2, DownloadCloud, Square, CheckSquare, Eye, EyeOff,
} from 'lucide-react';
import {
  getDocuments, uploadDocument, openDocument, reviewDocument,
  submitDocuments, deleteDocument, downloadDocumentsZip, setDocumentVisibility,
  ALLOWED_DOC_EXT, type TaskDocument, type DocumentStatus,
} from '../../api/documents';
import { useToast } from '../common/toastContext';
import { useConfirm } from '../common/confirmContext';
import { useAuthStore } from '../../store/authStore';

/**
 * Documents tab (E-05). Staff review uploads (approve/reject); clients upload and
 * re-upload after rejection. Active documents show first; archived (superseded)
 * versions are listed under a history section so the trail is preserved.
 */
export default function DocumentsPanel({ taskId, isStaff }: { taskId: string; isStaff: boolean }) {
  const toast = useToast();
  const confirm = useConfirm();
  const isAdmin = useAuthStore((s) => s.role) === 'admin';
  const myUid = useAuthStore((s) => s.user?.uid ?? null);
  // #128: the delete icon shows ONLY when a delete is actually allowed — an admin
  // may remove any document; anyone else (incl. the client) may remove only their
  // OWN document while it is still a draft. A submitted document is view/download
  // only. This mirrors the backend rule exactly, so the icon never lies.
  const canDelete = (d: TaskDocument) => isAdmin || (d.uploadedBy === myUid && d.status === 'draft');

  // #127: bulk download — pick documents, get one zip. Only real (uploaded) docs
  // can be downloaded, so selection is limited to those.
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [zipping, setZipping] = useState(false);
  const toggleSel = (id: string) => setSelected((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });
  const queryClient = useQueryClient();
  const { data: docs = [], isLoading, error } = useQuery({
    queryKey: ['documents', taskId],
    queryFn: () => getDocuments(taskId),
    staleTime: 5_000,
    refetchInterval: 20_000,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['documents', taskId] });

  const upload = useMutation({
    mutationFn: ({ file, docType }: { file: File; docType?: string }) => uploadDocument(taskId, file, undefined, docType),
    // #113: an upload is now a DRAFT — say so, so the user knows to press Submit.
    onSuccess: () => { invalidate(); toast.success('Document added as a draft — press Submit to send it for review.'); },
    onError: (e: Error) => toast.error(e.message || 'Upload failed.'),
  });

  // #126: upload MANY files in one action. Each file is validated + uploaded
  // individually (a bad one doesn't block the rest) and lands as its own draft.
  const [multiBusy, setMultiBusy] = useState(false);
  const uploadMany = async (files: File[], docType?: string) => {
    setMultiBusy(true);
    let ok = 0; const failed: string[] = [];
    for (const file of files) {
      // uploadDocument validates size + type per file and throws on a bad one, so
      // one invalid file is reported but never blocks the others.
      try { await uploadDocument(taskId, file, undefined, docType); ok += 1; }
      catch (e) { failed.push(`${file.name}: ${(e as Error).message || 'upload failed'}`); }
    }
    invalidate();
    setMultiBusy(false);
    if (ok) toast.success(ok === 1 ? 'Document added as a draft — press Submit.' : `${ok} documents added as drafts — press Submit.`);
    if (failed.length) toast.error(`${failed.length} file(s) skipped. ${failed.slice(0, 2).join(' · ')}${failed.length > 2 ? '…' : ''}`);
  };

  // #113: submit all drafts for review.
  const submit = useMutation({
    mutationFn: () => submitDocuments(taskId),
    onSuccess: (r) => {
      invalidate();
      toast.success(r.submitted === 1 ? 'Document submitted for review.' : `${r.submitted} documents submitted for review.`);
    },
    onError: (e: Error) => toast.error(e.message || 'Could not submit documents.'),
  });

  // #113: delete a mistaken upload (admin any; uploader's own drafts).
  const remove = useMutation({
    mutationFn: (docId: string) => deleteDocument(taskId, docId),
    onSuccess: () => { invalidate(); toast.success('Document deleted.'); },
    onError: (e: Error) => toast.error(e.message || 'Could not delete the document.'),
  });

  const askDelete = async (doc: TaskDocument) => {
    const ok = await confirm({
      title: 'Delete this document?',
      message: `"${doc.fileName}" will be permanently removed from this matter. This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (ok) remove.mutate(doc.docId);
  };

  // #113: drafts are staged separately from documents already under review.
  const drafts = docs.filter((d) => d.status === 'draft');
  // #131: every version (approved / re-submitted / rejected / pending) stays in the
  // main list during the matter — shown in CHRONOLOGICAL order so a document's
  // progression reads top-to-bottom. Superseded versions only move to Version
  // History once the matter completes (backend finalizeMatterDocuments).
  const active = docs
    .filter((d) => d.status !== 'archived' && d.status !== 'draft')
    .sort((a, b) => (a.uploadedAt ?? '').localeCompare(b.uploadedAt ?? ''));
  const archived = docs.filter((d) => d.status === 'archived');

  // #127: only real (uploaded) documents are downloadable.
  const downloadable = active.filter((d) => d.status !== 'awaiting_upload');
  const allSelected = downloadable.length > 0 && downloadable.every((d) => selected.has(d.docId));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(downloadable.map((d) => d.docId)));
  const downloadSelected = async () => {
    const picked = downloadable.filter((d) => selected.has(d.docId));
    if (!picked.length) return;
    setZipping(true);
    try {
      const { ok, failed } = await downloadDocumentsZip(
        taskId, picked.map((d) => ({ docId: d.docId, fileName: d.fileName })),
        'documents.zip',
      );
      if (ok) toast.success(`Downloaded ${ok} document${ok > 1 ? 's' : ''} as a zip.`);
      if (failed.length) toast.error(`${failed.length} file(s) could not be added.`);
      setSelected(new Set());
    } catch (e) {
      toast.error((e as Error).message || 'Could not build the download.');
    } finally { setZipping(false); }
  };

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
      <Uploader onPick={(files, docType) => uploadMany(files, docType)} busy={upload.isPending || multiBusy} />

      {/* #113: DRAFTS — uploaded but not yet submitted. Viewable + deletable here;
          one Submit sends them all for review. */}
      {drafts.length > 0 && (
        <section className="card p-4 border-brand-200 bg-brand-50/40">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">
                Drafts ({drafts.length}) — not yet submitted
              </p>
              <p className="text-xs text-ink-muted mt-0.5">
                Review them below, then submit. You can delete a draft if it was added by mistake.
              </p>
            </div>
            <button
              onClick={() => submit.mutate()}
              disabled={submit.isPending}
              className="btn-primary shrink-0 inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {submit.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit {drafts.length > 1 ? `all (${drafts.length})` : ''}
            </button>
          </div>
          <div className="space-y-2.5">
            {drafts.map((d) => (
              <DocumentCard
                key={d.docId}
                doc={d}
                taskId={taskId}
                isStaff={isStaff}
                onChanged={invalidate}
                onDelete={canDelete(d) ? () => askDelete(d) : undefined}
                deleting={remove.isPending}
              />
            ))}
          </div>
        </section>
      )}

      {active.length === 0 && archived.length === 0 && drafts.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-10 h-10 text-hairline mx-auto mb-3" />
          <p className="text-sm font-medium text-ink">No documents yet</p>
          <p className="text-sm text-ink-muted mt-1">Upload a document above to get started.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* #127: bulk-download toolbar — Select all + Download selected as a zip. */}
          {downloadable.length > 0 && (
            <div className="flex items-center justify-between gap-3 px-1">
              <button
                onClick={toggleAll}
                className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink"
              >
                {allSelected ? <CheckSquare className="w-4 h-4 text-brand-600" /> : <Square className="w-4 h-4" />}
                Select all
              </button>
              {selected.size > 0 && (
                <button
                  onClick={downloadSelected}
                  disabled={zipping}
                  className="btn-secondary py-1.5 px-3 text-xs inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {zipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DownloadCloud className="w-3.5 h-3.5" />}
                  Download selected ({selected.size})
                </button>
              )}
            </div>
          )}
          {active.map((d) => (
            <DocumentCard
              key={d.docId}
              doc={d}
              taskId={taskId}
              isStaff={isStaff}
              onChanged={invalidate}
              onReupload={(f) => upload.mutate({ file: f, docType: d.docType ?? undefined })}
              reuploading={upload.isPending}
              // #113/#128: an admin may still remove a submitted doc; a client
              // gets no delete on a submitted document (view/download only).
              onDelete={canDelete(d) ? () => askDelete(d) : undefined}
              deleting={remove.isPending}
              // #127: selectable for bulk download (only uploaded docs).
              selectable={d.status !== 'awaiting_upload'}
              selected={selected.has(d.docId)}
              onToggleSelect={() => toggleSel(d.docId)}
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

// Common document types (#79) — free text is still allowed via the datalist.
const COMMON_DOC_TYPES = ['PAN', 'TAN', 'Aadhaar', 'Address Proof', 'Photograph', 'Bank Statement', 'Rent Agreement', 'MOA', 'AOA', 'Board Resolution', 'Invoice', 'Other'];

function Uploader({ onPick, busy }: { onPick: (files: File[], docType?: string) => void; busy: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState('');
  return (
    <div className="card p-4 flex items-end justify-between gap-3 flex-wrap">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">Upload a document</p>
        <p className="text-xs text-ink-muted mt-0.5 mb-2">PDF, JPG, PNG, DOCX or Excel · max 10MB · select multiple files at once</p>
        <label className="block">
          <span className="text-xs text-ink-muted">Document type <span className="text-ink-faint">(e.g. PAN, TAN, Address proof)</span></span>
          <input
            list="doc-type-options"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            placeholder="Select or type a document type"
            className="input-field mt-1 max-w-xs"
          />
          <datalist id="doc-type-options">
            {COMMON_DOC_TYPES.map((t) => <option key={t} value={t} />)}
          </datalist>
        </label>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_DOC_EXT}
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) { onPick(files, docType.trim() || undefined); setDocType(''); }
          e.target.value = ''; // allow re-picking the same file(s)
        }}
      />
      <button onClick={() => inputRef.current?.click()} disabled={busy} className="btn-primary inline-flex items-center gap-1.5">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {busy ? 'Uploading…' : 'Choose file(s)'}
      </button>
    </div>
  );
}

/* ── Document card ───────────────────────────────────────────────────────────── */

const STATUS_META: Record<DocumentStatus, { label: string; cls: string; Icon: typeof Clock }> = {
  awaiting_upload: { label: 'Awaiting upload', cls: 'bg-surface-card text-ink-muted', Icon: Clock },
  draft:           { label: 'Draft',           cls: 'bg-brand-50 text-brand-700',     Icon: FilePlus2 },
  pending_review:  { label: 'Pending review',  cls: 'bg-amber-50 text-amber-700',     Icon: Clock },
  approved:        { label: 'Approved',        cls: 'bg-emerald-50 text-emerald-700', Icon: CheckCircle2 },
  rejected:        { label: 'Rejected',        cls: 'bg-red-50 text-red-600',          Icon: AlertCircle },
  archived:        { label: 'Archived',        cls: 'bg-surface-card text-ink-faint', Icon: Archive },
};

function DocumentCard({
  doc, taskId, isStaff, onChanged, archived, onReupload, reuploading, onDelete, deleting,
  selectable, selected, onToggleSelect,
}: {
  doc: TaskDocument;
  taskId: string;
  isStaff: boolean;
  onChanged: () => void;
  archived?: boolean;
  onReupload?: (f: File) => void;
  reuploading?: boolean;
  /** #113: when provided, a Delete action is shown (confirmed by the caller). */
  onDelete?: () => void;
  deleting?: boolean;
  /** #127: bulk-download selection. */
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
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

  // #125: internal team shares/hides a document from the client.
  const visibility = useMutation({
    mutationFn: (next: boolean) => setDocumentVisibility(taskId, doc.docId, next),
    onSuccess: (_r, next) => { onChanged(); toast.success(next ? 'Shared with the client.' : 'Hidden from the client — internal only.'); },
    onError: (e: Error) => toast.error(e.message || 'Could not change visibility.'),
  });

  const open = useMutation({
    mutationFn: () => openDocument(taskId, doc.docId),
    onError: (e: Error) => toast.error(e.message || 'Could not open the document.'),
  });

  return (
    <div className={`card p-4 ${archived ? 'opacity-70' : ''} ${selected ? 'ring-1 ring-brand-300' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* #127: selection checkbox for bulk download. */}
          {selectable && (
            <input
              type="checkbox"
              className="h-4 w-4 mt-0.5 shrink-0"
              checked={!!selected}
              onChange={onToggleSelect}
              aria-label={`Select ${doc.fileName}`}
            />
          )}
          <span className="w-9 h-9 rounded-lg bg-surface-soft flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-ink-muted" />
          </span>
          <div className="min-w-0">
            {/* #79: show the document type name (PAN, TAN, …) with the file name as
                secondary. Falls back to just the file name when no type was set. */}
            <p className="text-sm font-medium text-ink truncate">{doc.docType || doc.fileName}</p>
            {doc.docType && <p className="text-[11px] text-ink-faint truncate">{doc.fileName}</p>}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`badge ${meta.cls} inline-flex items-center gap-1`}>
                <meta.Icon className="w-3 h-3" /> {meta.label}
              </span>
              {/* #125: who uploaded it — Legal Terminus (internal) or the Client. */}
              {doc.uploaderRole && (
                <span className={`badge inline-flex items-center gap-1 ${
                  doc.uploaderRole === 'client' ? 'bg-blue-50 text-blue-700' : 'bg-brand-50 text-brand-700'
                }`}>
                  <Building2 className="w-3 h-3" />
                  {doc.uploaderRole === 'client' ? 'Client' : 'Legal Terminus'}
                </span>
              )}
              {/* #125: STAFF-ONLY sharing state, so the team can see at a glance
                  which documents the client can view. Hidden from the client (they
                  only ever see docs already shared with them). Not shown on drafts
                  (nothing to share yet) or archived versions. */}
              {isStaff && !archived && doc.status !== 'draft' && doc.status !== 'awaiting_upload' && (
                <span className={`badge inline-flex items-center gap-1 ${
                  doc.clientVisible ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-soft text-ink-muted'
                }`}>
                  {doc.clientVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {doc.clientVisible ? 'Shared with client' : 'Internal only'}
                </span>
              )}
              {doc.stepNumber != null && <span className="text-[11px] text-ink-faint">Step {doc.stepNumber}</span>}
            </div>
          </div>
        </div>
        {/* #113: View (open) + Delete actions. Upload is the panel's own control. */}
        <div className="flex items-center gap-2 shrink-0">
          {/* #125: staff share/hide toggle. Only meaningful once a doc exists and is
              past draft; never on archived versions. */}
          {isStaff && !archived && doc.status !== 'draft' && doc.status !== 'awaiting_upload' && (
            <button
              onClick={() => visibility.mutate(!doc.clientVisible)}
              disabled={visibility.isPending}
              title={doc.clientVisible ? 'Hide from the client (internal only)' : 'Share with the client'}
              className="btn-secondary py-1.5 px-3 text-xs inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {visibility.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : doc.clientVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {doc.clientVisible ? 'Make internal' : 'Share'}
            </button>
          )}
          {doc.status !== 'awaiting_upload' && (
            <button
              onClick={() => open.mutate()}
              disabled={open.isPending}
              className="btn-secondary py-1.5 px-3 text-xs inline-flex items-center gap-1.5"
            >
              {open.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              View
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={deleting}
              title="Delete this document"
              aria-label={`Delete ${doc.fileName}`}
              className="py-1.5 px-2 text-xs rounded-lg text-red-600 hover:bg-red-50 inline-flex items-center gap-1 disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
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
