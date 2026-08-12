import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import PageShell from '../../components/common/PageShell';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { useConfirm } from '../../components/common/confirmContext';
import { useToast } from '../../components/common/toastContext';
import {
  getAllUsers, deleteUser, reassignUserWork, displayName,
  type PortalUser, type Role,
} from '../../api/users';
import { useAuthStore } from '../../store/authStore';
import UserDetailDrawer from '../../components/users/UserDetailDrawer';
import {
  ROLES, roleLabel, roleBadgeClass, roleAvatarClass, can, USER_DELETE_ROLES,
} from '../../lib/roles';
import {
  Plus, Search, Pencil, Trash2, Users, UserCircle,
  Mail, Phone, Briefcase, Building2, Calendar, ArrowUpDown, ArrowUp, ArrowDown,
  ArrowRightLeft, X, Loader2,
} from 'lucide-react';

// Filter tabs derive from the role service — adding a role adds a tab automatically.
type RoleFilter = 'all' | Role;
const ROLE_TABS: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...ROLES.map((r) => ({ value: r.key as RoleFilter, label: r.pluralLabel })),
];

function initials(name?: string) {
  const n = (name ?? '').trim();
  if (!n) return '?';
  return n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

// Tolerates ISO strings, Firestore Timestamp objects ({_seconds,...} or
// {seconds,...}), Date, epoch ms, or missing — never throws, never "Invalid Date".
function toMillis(value: unknown): number {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string' || typeof value === 'number') {
    const t = new Date(value).getTime();
    return Number.isNaN(t) ? 0 : t;
  }
  if (typeof value === 'object') {
    const o = value as { _seconds?: number; seconds?: number };
    const secs = o._seconds ?? o.seconds;
    return secs != null ? secs * 1000 : 0;
  }
  return 0;
}

function formatDate(value: unknown): string {
  const ms = toMillis(value);
  if (!ms) return '—';
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const columnHelper = createColumnHelper<PortalUser>();

export default function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const toast = useToast();
  const currentRole = useAuthStore((s) => s.role);
  const canDelete = can(currentRole, USER_DELETE_ROLES); // BMAD E09-S01/S02: manager cannot delete

  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
  // E09-S06: read-only detail view opened by clicking a user row.
  const [detailUser, setDetailUser] = useState<PortalUser | null>(null);

  // Load all users once; the grid does sorting/filtering/search client-side.
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['portalUsers'],
    queryFn: getAllUsers,
    retry: 1,            // fail fast & visibly instead of hammering on a bad token
    staleTime: 30_000,
  });

  // Counts for the role tabs — derived from the loaded set (single source).
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: users.length };
    for (const u of users) c[u.role] = (c[u.role] ?? 0) + 1;
    return c;
  }, [users]);
  const countFor = (value: RoleFilter) => (value === 'all' ? users.length : counts[value] ?? 0);

  // The user we're offboarding via the reassign-then-delete flow (E09-S04).
  const [reassignFor, setReassignFor] = useState<PortalUser | null>(null);

  const deleteUserMutation = useMutation({
    mutationFn: (uid: string) => deleteUser(uid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portalUsers'] });
      toast.success('User deleted.');
    },
    onError: (err: Error & { status?: number; body?: unknown }, uid) => {
      // The delete guard blocks while the user still holds work. Only offer the
      // reassign-then-delete flow when the block is STAFF work (assignee/step) —
      // a client's OWNED matters can't be reassigned (a matter belongs to its
      // client), so for that case we surface the backend's clear message instead
      // of opening a reassign modal that can never unblock the delete.
      const body = err.body as { reassignable?: boolean } | undefined;
      if (err.status === 409 && body?.reassignable) {
        const u = users.find((x) => x.uid === uid) ?? null;
        if (u) { setReassignFor(u); return; }
      }
      toast.error(err.message || 'Failed to delete user.');
    },
  });

  function handleEdit(user: PortalUser) {
    const type = user.role === 'client' ? 'client' : 'member';
    navigate(`/users/edit/${type}/${user.uid}`);
  }

  async function handleDelete(user: PortalUser) {
    const ok = await confirm({
      title: 'Delete user?',
      message: `Delete ${displayName(user)}? This permanently removes their account and cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (ok) deleteUserMutation.mutate(user.uid);
  }

  // Role tab → column filter on `role`.
  const columnFilters: ColumnFiltersState = useMemo(
    () => (roleFilter === 'all' ? [] : [{ id: 'role', value: roleFilter }]),
    [roleFilter],
  );

  const columns = useMemo(() => [
    columnHelper.accessor((u) => displayName(u), {
      id: 'name',
      header: 'User',
      size: 260,
      cell: (ctx) => {
        const user = ctx.row.original;
        return (
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${roleAvatarClass(user.role)}`}>
              <span className="text-sm font-bold">{initials(displayName(user))}</span>
            </div>
            <p className="text-sm font-semibold text-ink">{displayName(user)}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor('role', {
      id: 'role',
      header: 'Role / Details',
      size: 200,
      cell: (ctx) => {
        const user = ctx.row.original;
        return (
          <>
            <span className={`badge ${roleBadgeClass(user.role)}`}>{roleLabel(user.role)}</span>
            {user.designation && (
              <p className="text-xs text-ink-faint flex items-center gap-1 mt-1.5">
                <Briefcase className="w-3 h-3" />{user.designation}
              </p>
            )}
            {user.organisation && (
              <p className="text-xs text-ink-faint flex items-center gap-1 mt-1">
                <Building2 className="w-3 h-3" />{user.organisation}
              </p>
            )}
          </>
        );
      },
    }),
    columnHelper.accessor('email', {
      id: 'email',
      header: 'Contact',
      size: 320,
      cell: (ctx) => {
        const user = ctx.row.original;
        return (
          <>
            <p className="text-sm text-ink-soft flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-ink-faint shrink-0" />{user.email}
            </p>
            {user.phone && (
              <p className="text-xs text-ink-faint flex items-center gap-1.5 mt-1">
                <Phone className="w-3 h-3 text-gray-300 shrink-0" />{user.phone}
              </p>
            )}
          </>
        );
      },
    }),
    columnHelper.accessor((u) => toMillis(u.createdAt), {
      id: 'createdAt',
      header: 'Added',
      size: 150,
      cell: (ctx) => (
        <span className="text-sm text-ink-muted flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-300" />
          {formatDate(ctx.row.original.createdAt)}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="block text-right">Actions</span>,
      size: 110,
      enableSorting: false,
      cell: (ctx) => {
        const user = ctx.row.original;
        return (
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleEdit(user)}
              className="p-2 rounded-xl text-ink-faint hover:text-ink hover:bg-surface-soft transition-colors"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            {canDelete && (
              <button
                onClick={() => handleDelete(user)}
                disabled={deleteUserMutation.isPending}
                className="p-2 rounded-xl text-ink-faint hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [canDelete, deleteUserMutation.isPending]);

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting, globalFilter: search, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    globalFilterFn: (row, _columnId, filterValue) => {
      const u = row.original;
      const q = String(filterValue).toLowerCase();
      return (
        displayName(u).toLowerCase().includes(q) ||
        (u.email?.toLowerCase().includes(q) ?? false) ||
        (u.designation?.toLowerCase().includes(q) ?? false) ||
        (u.organisation?.toLowerCase().includes(q) ?? false) ||
        roleLabel(u.role).toLowerCase().includes(q) ||
        (u.phone?.toLowerCase().includes(q) ?? false)
      );
    },
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;
  const totalWidth = table.getTotalSize();

  return (
    <PageShell
      title="Users"
      subtitle={`${rows.length} of ${users.length}`}
      action={
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/users/new/client')} className="btn-secondary">
            <UserCircle className="w-4 h-4" /> Add Client
          </button>
          <button onClick={() => navigate('/users/new/member')} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>
      }
    >
      {/* Role filter tabs.
          #161: the row scrolled but clipped "Managers" to "Man…" with no hint it
          could scroll. Same treatment as the matter tabs: hidden scrollbar chrome
          plus an edge fade as the affordance. */}
      <div className="relative mb-4">
      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none pb-0.5">
        <div className="nav-pill-container shrink-0">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRoleFilter(tab.value)}
              className={roleFilter === tab.value ? 'nav-pill-active' : 'nav-pill'}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-60">{countFor(tab.value)}</span>
            </button>
          ))}
        </div>
      </div>
        <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent sm:hidden" />
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
        <input
          type="text"
          placeholder="Search users by name, email, role, phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {isLoading ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
          <span className="text-sm">Loading users…</span>
        </div>
      ) : error ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <Users className="w-10 h-10 text-red-300" />
          <p className="text-sm font-medium text-red-600">Couldn’t load users</p>
          <p className="text-xs text-ink-faint">{(error as Error).message}</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <Users className="w-10 h-10 text-hairline" />
          <p className="text-sm font-medium">{search || roleFilter !== 'all' ? 'No results found' : 'No users yet'}</p>
        </div>
      ) : (
        <ErrorBoundary>
          {/* Desktop table — sortable headers + virtualized rows (div grid so
              absolute-positioned virtual rows stay column-aligned via fixed widths). */}
          <div className="card overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <div style={{ width: totalWidth, minWidth: '100%' }}>
                {/* Header */}
                {table.getHeaderGroups().map((hg) => (
                  <div key={hg.id} className="flex border-b border-hairline-soft bg-surface-soft">
                    {hg.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const sorted = header.column.getIsSorted();
                      return (
                        <div
                          key={header.id}
                          onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          style={{ width: header.getSize() }}
                          className={`px-5 py-3.5 text-xs font-semibold text-ink-muted uppercase tracking-wide shrink-0 ${
                            canSort ? 'cursor-pointer select-none hover:text-ink' : ''
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              sorted === 'asc' ? <ArrowUp className="w-3 h-3" />
                                : sorted === 'desc' ? <ArrowDown className="w-3 h-3" />
                                : <ArrowUpDown className="w-3 h-3 opacity-40" />
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Body — plain scroll (no virtualization; fine at this scale) */}
                <div className="max-h-[70vh] overflow-y-auto">
                  {rows.map((row) => (
                    <div
                      key={row.id}
                      onClick={() => setDetailUser(row.original)}
                      className="flex items-start border-b border-gray-50 hover:bg-surface-soft transition-colors group cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="px-5 py-4 shrink-0"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((row) => {
              const user = row.original;
              return (
                <div key={row.id} onClick={() => setDetailUser(user)} className="card p-4 cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${roleAvatarClass(user.role)}`}>
                        <span className="text-sm font-bold">{initials(displayName(user))}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{displayName(user)}</p>
                        {(user.designation || user.organisation) && (
                          <p className="text-xs text-ink-faint truncate">{user.designation ?? user.organisation}</p>
                        )}
                      </div>
                    </div>
                    <span className={`badge shrink-0 ${roleBadgeClass(user.role)}`}>{roleLabel(user.role)}</span>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs text-ink-muted flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-300" />{user.email}
                    </p>
                    {user.phone && (
                      <p className="text-xs text-ink-muted flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gray-300" />{user.phone}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-hairline-soft flex items-center justify-between">
                    <span className="text-xs text-ink-faint flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(user.createdAt)}
                    </span>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleEdit(user)} className="btn-secondary py-1.5 px-3 text-xs">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={deleteUserMutation.isPending}
                          className="btn-danger py-1.5 px-3 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ErrorBoundary>
      )}

      {/* Reassign-then-delete flow (E09-S04): opened when a delete is blocked
          because the user still holds work. Move their work to another staff
          member, then they become deletable. */}
      {reassignFor && (
        <ReassignWorkModal
          user={reassignFor}
          candidates={users.filter((u) => u.role !== 'client' && u.uid !== reassignFor.uid)}
          onClose={() => setReassignFor(null)}
          onDone={() => {
            setReassignFor(null);
            queryClient.invalidateQueries({ queryKey: ['portalUsers'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
          }}
        />
      )}

      {/* E09-S06: read-only detail view; Edit switches to the edit form. */}
      {detailUser && (
        <UserDetailDrawer
          user={detailUser}
          canEdit
          onClose={() => setDetailUser(null)}
          onEdit={(u) => { setDetailUser(null); handleEdit(u); }}
        />
      )}
    </PageShell>
  );
}

/* ── Reassign work modal (E09-S04) ─────────────────────────────────────────── */

function ReassignWorkModal({ user, candidates, onClose, onDone }: {
  user: PortalUser;
  candidates: PortalUser[];
  onClose: () => void;
  onDone: () => void;
}) {
  const toast = useToast();
  const [toUid, setToUid] = useState('');

  const reassign = useMutation({
    mutationFn: () => reassignUserWork(user.uid, toUid),
    onSuccess: (res) => {
      toast.success(`Reassigned ${res.mattersMoved} matter(s) and ${res.stepsMoved} step(s). You can now delete this user.`);
      onDone();
    },
    onError: (err: Error) => toast.error(err.message || 'Could not reassign work.'),
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="card w-full max-w-md p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3 p-5">
          <span className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <ArrowRightLeft className="w-4 h-4 text-amber-600" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-ink">Reassign {displayName(user)}'s work</h2>
            <p className="text-sm text-ink-muted mt-1">
              This user still owns open matters or steps, so they can't be deleted yet. Move all
              their work to another team member, then delete them.
            </p>
            <label className="input-label mt-4 block">Reassign all work to</label>
            <select
              className="input-field"
              value={toUid}
              onChange={(e) => setToUid(e.target.value)}
              disabled={reassign.isPending}
            >
              <option value="">Select a team member…</option>
              {candidates.map((u) => (
                <option key={u.uid} value={u.uid}>{displayName(u)} · {roleLabel(u.role)}</option>
              ))}
            </select>
          </div>
          <button onClick={onClose} className="text-ink-faint hover:text-ink shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-surface-soft border-t border-hairline">
          <button onClick={onClose} className="btn-ghost" disabled={reassign.isPending}>Cancel</button>
          <button
            onClick={() => reassign.mutate()}
            disabled={!toUid || reassign.isPending}
            className="btn-primary inline-flex items-center gap-1.5"
          >
            {reassign.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
            Reassign work
          </button>
        </div>
      </div>
    </div>
  );
}
