import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Pencil } from 'lucide-react';
import { useToast } from '../../components/common/toastContext';
import { exportToXlsx, type ExportColumn } from '../../lib/exportXlsx';
import type { ApiError } from '../../api/client';
import {
  CLIENT_DATABASE_COLUMNS, CLIENT_DATABASE_KEY, CONTACT_DESIGNATIONS,
  getAllClientDatabase, getClientDatabase, getClientDatabaseNames, getClientDatabaseRecord,
  saveClientDatabaseRecord,
  type ClientDatabaseFields, type ClientDatabaseRecord,
} from '../../api/clientDatabase';

/**
 * LT #205 — the Client Database.
 *
 * A screen of its own, separate from the client form (the firm's 6 Oct
 * decision). Nine fields per client; the starting values come from the
 * client's profile, and a save here is stored apart from it, so editing a
 * record never changes the client form or the client's login.
 *
 * Pick a client from "Client Name" to see that client's record; with none
 * picked, the screen lists every client. Edit opens the record for editing
 * right where it is — no other page.
 */

const PAGE_SIZE = 50;

const showDate = (iso: string) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const display = (r: ClientDatabaseRecord, key: keyof ClientDatabaseFields) =>
  key === 'clientSince' ? showDate(r.clientSince) : r[key];

const fieldsOf = (r: ClientDatabaseRecord): ClientDatabaseFields =>
  Object.fromEntries(CLIENT_DATABASE_COLUMNS.map((c) => [c.key, r[c.key] ?? ''])) as unknown as ClientDatabaseFields;

export default function ClientDatabasePage() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const selected = params.get('client') ?? '';
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const names = useQuery({ queryKey: [...CLIENT_DATABASE_KEY, 'names'], queryFn: getClientDatabaseNames });

  const pickClient = (uid: string) => {
    setEditing(null);
    setParams((p) => {
      const next = new URLSearchParams(p);
      if (uid) next.set('client', uid); else next.delete('client');
      return next;
    }, { replace: true });
  };

  const download = async () => {
    setExporting(true);
    try {
      const rows = await getAllClientDatabase();
      const cols: ExportColumn<ClientDatabaseRecord>[] = CLIENT_DATABASE_COLUMNS.map((c) => ({
        header: c.label,
        value: (r) => r[c.key],
      }));
      await exportToXlsx(rows, cols, 'client-database', 'Client Database');
    } catch {
      toast.error('Could not prepare the download. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/reports" className="text-sm text-brand-600 hover:underline shrink-0">← Reports</Link>
          <h1 className="text-xl font-semibold text-ink truncate">Client Database</h1>
        </div>
        <button
          type="button"
          onClick={download}
          disabled={exporting}
          className="btn-secondary inline-flex items-center gap-2 min-h-[44px] disabled:opacity-50"
          aria-label="Download Client Database as Excel"
        >
          <Download className="w-4 h-4" /> {exporting ? 'Preparing…' : 'Download Excel'}
        </button>
      </div>

      <div className="card p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="cdb-client" className="input-label">Client Name</label>
          <select id="cdb-client" className="input-field w-full" value={selected} onChange={(e) => pickClient(e.target.value)}>
            <option value="">All clients</option>
            {(names.data ?? []).map((n) => <option key={n.uid} value={n.uid}>{n.clientName}</option>)}
          </select>
        </div>
        {!selected && (
          <div>
            <label htmlFor="cdb-search" className="input-label">Search</label>
            <input
              id="cdb-search"
              type="search"
              className="input-field w-full"
              placeholder="Name, organisation, phone or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {selected ? (
        <SelectedClient uid={selected} editing={editing === selected} onEdit={setEditing} />
      ) : (
        <ClientList search={debounced} editing={editing} onEdit={setEditing} onOpen={pickClient} />
      )}
    </div>
  );
}

/* ── One client, in a readable layout ─────────────────────────────────────── */

function SelectedClient({ uid, editing, onEdit }: { uid: string; editing: boolean; onEdit: (uid: string | null) => void }) {
  const { data, isLoading, error } = useQuery({
    queryKey: [...CLIENT_DATABASE_KEY, 'record', uid],
    queryFn: () => getClientDatabaseRecord(uid),
  });
  if (isLoading) return <p className="text-sm text-ink-muted">Loading…</p>;
  if (error || !data) {
    return <p className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700" role="alert">This client could not be loaded.</p>;
  }
  return (
    <section className="card p-4 sm:p-6" aria-label={`Client Database record: ${data.clientName}`}>
      {editing ? (
        <RecordForm record={data} onDone={() => onEdit(null)} />
      ) : (
        <>
          <div className="flex items-start justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-ink break-words">{data.clientName}</h2>
            <EditButton name={data.clientName} onClick={() => onEdit(uid)} />
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {CLIENT_DATABASE_COLUMNS.map((c) => (
              <div key={c.key}>
                <dt className="text-xs text-ink-muted">{c.label}</dt>
                <dd className="text-base text-ink break-words">{display(data, c.key) || '—'}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  );
}

/* ── Every client ─────────────────────────────────────────────────────────── */

function ClientList({ search, editing, onEdit, onOpen }: {
  search: string;
  editing: string | null;
  onEdit: (uid: string | null) => void;
  onOpen: (uid: string) => void;
}) {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [...CLIENT_DATABASE_KEY, 'list', search],
    queryFn: ({ pageParam }) => getClientDatabase({ search, cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
  const rows = data?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) return <p className="text-sm text-ink-muted">Loading…</p>;
  if (error) {
    return <p className="rounded-lg border border-red-100 bg-red-50 p-3.5 text-sm text-red-700" role="alert">The Client Database could not be loaded. Please try again.</p>;
  }
  if (rows.length === 0) {
    return <div className="card p-10 text-center text-sm text-ink-muted">{search ? 'No client matches that search.' : 'No clients yet.'}</div>;
  }

  // One structure for every width: a card per client on phones and tablets,
  // a ten-column grid row on wide screens. Rendering it once (not a table AND
  // a card list) keeps a single edit form on the page.
  const grid = 'lg:grid lg:grid-cols-[1.3fr_1.1fr_0.9fr_1fr_1fr_1.3fr_1.3fr_1.5fr_0.9fr_auto] lg:gap-3 lg:items-start';
  return (
    <div className="card overflow-hidden">
      <div className={`hidden ${grid} px-4 py-3 text-xs font-medium text-ink-muted border-b border-hairline`} aria-hidden="true">
        {CLIENT_DATABASE_COLUMNS.map((c) => <span key={c.key}>{c.label}</span>)}
        <span className="sr-only">Actions</span>
      </div>
      <ul aria-label="Client Database">
        {rows.map((r) => (
          <li key={r.uid} className="border-b border-hairline-soft last:border-0 px-4 py-3" aria-label={r.clientName}>
            {editing === r.uid ? (
              <RecordForm record={r} onDone={() => onEdit(null)} />
            ) : (
              <div className={`${grid} text-sm`}>
                {CLIENT_DATABASE_COLUMNS.map((c, i) => (
                  <div key={c.key} className={i === 0 ? 'mb-2 lg:mb-0' : 'flex gap-2 lg:block py-0.5 lg:py-0'}>
                    {i === 0 ? (
                      <button type="button" onClick={() => onOpen(r.uid)} className="text-base lg:text-sm font-semibold lg:font-normal text-brand-600 hover:underline text-left break-words">
                        {r.clientName}
                      </button>
                    ) : (
                      <>
                        <span className="lg:hidden text-ink-muted shrink-0 w-40">{c.label}</span>
                        <span className="text-ink break-words min-w-0">{display(r, c.key) || '—'}</span>
                      </>
                    )}
                  </div>
                ))}
                <div className="mt-2 lg:mt-0">
                  <EditButton name={r.clientName} onClick={() => onEdit(r.uid)} />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <div className="p-3 text-center border-t border-hairline">
          <button type="button" className="btn-secondary min-h-[44px]" disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}

function EditButton({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-secondary inline-flex items-center gap-1.5 min-h-[44px] shrink-0"
      aria-label={`Edit ${name}`}
    >
      <Pencil className="w-4 h-4" /> Edit
    </button>
  );
}

/* ── Editing, in place ────────────────────────────────────────────────────── */

const INPUT_TYPES: Partial<Record<keyof ClientDatabaseFields, string>> = {
  phone: 'tel', altPhone: 'tel', email: 'email', clientSince: 'date',
};

function RecordForm({ record, onDone }: { record: ClientDatabaseRecord; onDone: () => void }) {
  const toast = useToast();
  const qc = useQueryClient();
  const [values, setValues] = useState<ClientDatabaseFields>(() => fieldsOf(record));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const save = useMutation({
    mutationFn: () => saveClientDatabaseRecord(record.uid, values),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: CLIENT_DATABASE_KEY });
      toast.success('Client Database updated.');
      onDone();
    },
    onError: (err: ApiError) => {
      const body = err.body as { errors?: { field: string; message: string }[] } | undefined;
      if (err.status === 400 && body?.errors?.length) {
        setFieldErrors(Object.fromEntries(body.errors.map((e) => [e.field, friendly(e.field, e.message)])));
        setFormError('Please correct the highlighted fields.');
      } else if (err.status === 404) {
        setFormError('This client no longer exists.');
      } else {
        setFormError('Could not save. Please try again.');
      }
    },
  });

  const set = (key: keyof ClientDatabaseFields, v: string) => {
    setValues((s) => ({ ...s, [key]: v }));
    setFieldErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); setFormError(''); save.mutate(); }}
      aria-label={`Edit ${record.clientName}`}
      noValidate
    >
      <p className="text-sm font-semibold text-ink mb-3">Editing {record.clientName}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CLIENT_DATABASE_COLUMNS.map((c) => {
          const id = `cdb-${record.uid}-${c.key}`;
          const err = fieldErrors[c.key];
          const common = {
            id,
            className: 'input-field w-full px-4 py-3',
            'aria-invalid': err ? true : undefined,
            'aria-describedby': err ? `${id}-err` : undefined,
          };
          return (
            <div key={c.key} className={c.key === 'address' ? 'sm:col-span-2 lg:col-span-3' : undefined}>
              <label htmlFor={id} className="input-label">{c.label}</label>
              {c.key === 'contactDesignation' ? (
                <select {...common} value={values.contactDesignation} onChange={(e) => set(c.key, e.target.value)}>
                  <option value="">Not set</option>
                  {CONTACT_DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              ) : c.key === 'address' ? (
                <textarea {...common} rows={2} value={values.address} onChange={(e) => set(c.key, e.target.value)} />
              ) : (
                <input
                  {...common}
                  type={INPUT_TYPES[c.key] ?? 'text'}
                  inputMode={c.key === 'phone' || c.key === 'altPhone' ? 'tel' : undefined}
                  value={values[c.key]}
                  onChange={(e) => set(c.key, e.target.value)}
                />
              )}
              {err && <p id={`${id}-err`} className="mt-1 text-xs text-red-700">{err}</p>}
            </div>
          );
        })}
      </div>
      {formError && <p className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700" role="alert">{formError}</p>}
      <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button type="button" className="btn-secondary min-h-[44px]" onClick={onDone} disabled={save.isPending}>Cancel</button>
        <button type="submit" className="btn-primary min-h-[44px]" disabled={save.isPending}>
          {save.isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

/** Turn the API's validation message into one a person can act on. */
function friendly(field: string, message: string): string {
  switch (field) {
    case 'phone':
    case 'altPhone': return 'Enter a phone number of 7 to 20 digits.';
    case 'email': return 'Enter a valid email address.';
    case 'altEmail': return 'Enter valid email addresses, separated by commas.';
    case 'contactDesignation': return 'Choose Owner, Director, Accountant or Manager.';
    case 'clientSince': return 'Enter a valid date.';
    case 'clientName': return 'Client name is required.';
    default: return message;
  }
}
