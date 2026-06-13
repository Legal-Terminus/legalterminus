import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageShell from '../../components/common/PageShell';
import { getUsers, deleteUser, type PortalUser } from '../../api/users';
import { useAuthStore } from '../../store/authStore';
import {
  ROLES, roleLabel, roleBadgeClass, roleAvatarClass, can, USER_DELETE_ROLES,
} from '../../lib/roles';
import {
  Plus, Search, Pencil, Trash2, Users, UserCircle,
  Mail, Phone, Briefcase, Building2, Calendar,
} from 'lucide-react';

// Filter tabs derive from the role service — adding a role adds a tab automatically.
type RoleFilter = 'all' | string;
const ROLE_TABS: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...ROLES.map((r) => ({ value: r.key as RoleFilter, label: r.pluralLabel })),
];

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentRole = useAuthStore((s) => s.role);
  const canDelete = can(currentRole, USER_DELETE_ROLES); // BMAD E09-S01/S02: manager cannot delete
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [search, setSearch] = useState('');

  // Single unified fetch — all users from one endpoint (BMAD architecture §3.5)
  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ['portalUsers'],
    queryFn: () => getUsers(),
  });

  const filtered = allUsers.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.designation?.toLowerCase().includes(q) ||
      u.organisation?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const deleteUserMutation = useMutation({
    mutationFn: (uid: string) => deleteUser(uid),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portalUsers'] }),
  });

  function handleEdit(user: PortalUser) {
    const type = user.role === 'client' ? 'client' : 'member';
    navigate(`/users/edit/${type}/${user.uid}`);
  }

  function handleDelete(user: PortalUser) {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    deleteUserMutation.mutate(user.uid);
  }

  const countFor = (value: RoleFilter) =>
    value === 'all' ? allUsers.length : allUsers.filter((u) => u.role === value).length;

  return (
    <PageShell
      title="Users"
      subtitle={`${filtered.length} of ${allUsers.length}`}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/users/new/client')}
            className="btn-secondary"
          >
            <UserCircle className="w-4 h-4" /> Add Client
          </button>
          <button
            onClick={() => navigate('/users/new/member')}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>
        </div>
      }
    >
      {/* Role filter tabs */}
      <div className="flex items-center gap-0.5 mb-4 overflow-x-auto pb-0.5">
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

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
        <input
          type="text"
          placeholder="Search by name, email, designation…"
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
      ) : filtered.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <Users className="w-10 h-10 text-hairline" />
          <p className="text-sm font-medium">{search ? 'No results found' : 'No users yet'}</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card overflow-hidden hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hairline-soft bg-surface-soft">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">User</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Contact</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Role / Details</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Added</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-ink-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <tr key={user.uid} className="hover:bg-surface-soft transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${roleAvatarClass(user.role)}`}>
                          <span className="text-sm font-bold">{initials(user.name)}</span>
                        </div>
                        <p className="text-sm font-semibold text-ink">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-ink-soft flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-ink-faint shrink-0" />{user.email}
                      </p>
                      {user.phone && (
                        <p className="text-xs text-ink-faint flex items-center gap-1.5 mt-1">
                          <Phone className="w-3 h-3 text-gray-300 shrink-0" />{user.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
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
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-ink-muted flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-300" />
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((user) => (
              <div key={user.uid} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${roleAvatarClass(user.role)}`}>
                      <span className="text-sm font-bold">{initials(user.name)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
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
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-2">
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
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}
