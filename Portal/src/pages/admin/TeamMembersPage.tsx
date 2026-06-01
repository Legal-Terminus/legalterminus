import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageShell from '../../components/common/PageShell';
import { apiFetch } from '../../api/client';
import { Plus, Search, Pencil, Trash2, Users, Mail, Phone, Briefcase, Calendar } from 'lucide-react';

interface TeamMember {
  uid: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  role: 'admin' | 'manager' | 'team_member';
  joiningDate: string;
  createdAt: string;
}

const roleBadge: Record<string, string> = {
  admin: 'bg-red-50 text-red-700 ring-1 ring-red-100',
  manager: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  team_member: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
};
const roleLabel: Record<string, string> = {
  admin: 'Admin', manager: 'Manager', team_member: 'Team Member',
};

export default function TeamMembersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      return await apiFetch<TeamMember[]>('/api/team-members?limit=100');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (uid: string) => {
      return await apiFetch(`/api/team-members/${uid}`, { method: 'DELETE' });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teamMembers'] }),
  });

  const filtered: TeamMember[] = members.filter((m: TeamMember) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.designation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell
      title="Team Members"
      subtitle={`${members.length} member${members.length !== 1 ? 's' : ''}`}
      action={
        <button onClick={() => navigate('/admin/team-members/new')} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      }
    >
      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or designation…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      {isLoading ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <span className="text-sm">Loading team members…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-gray-400">
          <Users className="w-10 h-10 text-gray-200" />
          <p className="text-sm font-medium">{search ? 'No results found' : 'No team members yet'}</p>
          {!search && (
            <button onClick={() => navigate('/admin/team-members/new')} className="btn-primary mt-2">
              <Plus className="w-4 h-4" /> Add your first member
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card overflow-hidden hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((member) => (
                  <tr key={member.uid} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-brand-700">
                            {member.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Briefcase className="w-3 h-3" />{member.designation}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />{member.email}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                        <Phone className="w-3 h-3 text-gray-300 shrink-0" />{member.phone}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${roleBadge[member.role] ?? ''}`}>
                        {roleLabel[member.role] ?? member.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-300" />
                      {new Date(member.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/admin/team-members/edit/${member.uid}`)}
                          className="p-2 rounded-xl text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${member.name}?`)) deleteMutation.mutate(member.uid);
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((member) => (
              <div key={member.uid} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-brand-700">
                        {member.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
                      <p className="text-xs text-gray-400 truncate">{member.designation}</p>
                    </div>
                  </div>
                  <span className={`badge shrink-0 ${roleBadge[member.role] ?? ''}`}>{roleLabel[member.role]}</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs text-gray-500 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-300" />{member.email}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-300" />{member.phone}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(member.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/admin/team-members/edit/${member.uid}`)} className="btn-secondary py-1.5 px-3 text-xs">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => { if (window.confirm(`Delete ${member.name}?`)) deleteMutation.mutate(member.uid); }}
                      disabled={deleteMutation.isPending}
                      className="btn-danger py-1.5 px-3 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
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

