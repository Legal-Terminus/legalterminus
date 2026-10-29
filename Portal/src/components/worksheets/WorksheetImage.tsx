import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { deleteWorksheetImage, fetchWorksheetImage, uploadWorksheetImage } from '../../api/worksheets';
import { useToast } from '../common/toastContext';

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp';

/**
 * #210 — a logo in a worksheet cell. The picture is fetched with the session's
 * token and shown from an object URL: there is no public or signed link to it.
 */
export default function WorksheetImage({
  sheet, recordId, field, version, label, canEdit, size = 'sm', onChanged,
}: {
  sheet: string;
  recordId: string;
  field: string;
  version: string | undefined;
  label: string;
  canEdit: boolean;
  size?: 'sm' | 'lg';
  onChanged: (version: string | null) => void;
}) {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState<{ key: string; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const key = `${recordId}:${field}:${version ?? ''}`;

  useEffect(() => {
    if (!version) return undefined;
    let alive = true;
    let url: string | null = null;
    fetchWorksheetImage(sheet, recordId, field)
      .then((blob) => {
        if (!alive) return;
        url = URL.createObjectURL(blob);
        setLoaded({ key, url });
      })
      .catch(() => { /* a missing logo just shows the placeholder */ });
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [sheet, recordId, field, version, key]);

  const src = version && loaded?.key === key ? loaded.url : null;

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPT.split(',').includes(file.type)) { toast.error('Use a JPEG, PNG or WebP image.'); return; }
    if (file.size > MAX_BYTES) { toast.error('The image must be 2 MB or smaller.'); return; }
    setBusy(true);
    try {
      const res = await uploadWorksheetImage(sheet, recordId, field, file);
      onChanged(res.v);
    } catch (e) {
      toast.error((e as Error).message || 'Could not upload the image.');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  const remove = async () => {
    setBusy(true);
    try { await deleteWorksheetImage(sheet, recordId, field); onChanged(null); }
    catch (e) { toast.error((e as Error).message || 'Could not remove the image.'); }
    finally { setBusy(false); }
  };

  const box = size === 'lg' ? 'h-24 w-24' : 'h-10 w-10';
  return (
    <div className="flex items-center gap-1.5">
      {src ? (
        <img src={src} alt={label} className={`${box} object-contain rounded-sm border border-hairline bg-white`} />
      ) : version ? (
        <div className={`${box} rounded-sm bg-surface-card animate-pulse`} />
      ) : null}
      {canEdit && (
        <>
          <input ref={input} type="file" accept={ACCEPT} className="hidden" aria-label={`Upload ${label}`}
            onChange={(e) => pick(e.target.files?.[0])} />
          <button type="button" onClick={() => input.current?.click()} disabled={busy}
            className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-ink min-h-9 min-w-9"
            title={version ? 'Replace image' : 'Add image'} aria-label={version ? `Replace ${label}` : `Add ${label}`}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          </button>
          {version && !busy && (
            <button type="button" onClick={remove} className="p-2 rounded-lg text-ink-muted hover:bg-surface-soft hover:text-red-600 min-h-9 min-w-9"
              title="Remove image" aria-label={`Remove ${label}`}>
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
