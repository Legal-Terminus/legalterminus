import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PageShell from '../../components/common/PageShell';
import { apiFetch } from '../../api/client';
import { Plus, Search, Pencil, Trash2, UserCircle, Mail, Phone, Building2, Calendar } from 'lucide-react';

interface Client {
  clientId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  organisation?: string;
  gstNumber?: string;
  panNumber?: string;
  emailIds: string[];
  createdAt: string;
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await apiFetch('/api/clients');
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const res = await apiFetch(`/api/clients/${clientId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete client');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  });

  const filtered: Client[] = clients.filter((c: Client) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageShell
      title="Clients"
      subtitle={`${clients.length} client${clients.length !== 1 ? 's' : ''}`}
      action={
        <button onClick={() => navigate('/admin/clients/new')} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      }
    >
      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      {isLoading ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <span className="text-sm">Loading clients…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 flex flex-col items-center gap-3 text-gray-400">
          <UserCircle className="w-10 h-10 text-gray-200" />
          <p className="text-sm font-medium">{searchTerm ? 'No results found' : 'No clients yet'}</p>
          {!searchTerm && (
            <button onClick={() => navigate('/admin/clients/new')} className="btn-primary mt-2">
              <Plus className="w-4 h-4" /> Add your first client
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
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Organisation</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Added</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((client) => (
                  <tr key={client.clientId} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-emerald-700">
                            {client.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />{client.email}
                      </p>
                      {client.phone && (
                        <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                          <Phone className="w-3 h-3 text-gray-300 shrink-0" />{client.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {client.organisation ? (
                        <span className="text-sm text-gray-700 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />{client.organisation}
                        </span>
                      ) : <span className="text-gray-300 text-sm">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-300" />
                        {new Date(client.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/admin/clients/edit/${client.clientId}`)}
                          className="p-2 rounded-xl text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { if (window.confirm(`Delete ${client.name}?`)) deleteMutation.mutate(client.clientId); }}
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
            {filtered.map((client) => (
              <div key={client.clientId} className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-emerald-700">
                      {client.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                    {client.organisation && (
                      <p className="text-xs text-gray-400 truncate">{client.organisation}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs text-gray-500 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-300" />{client.email}</p>
                  {client.phone && <p className="text-xs text-gray-500 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-300" />{client.phone}</p>}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(client.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/admin/clients/edit/${client.clientId}`)} className="btn-secondary py-1.5 px-3 text-xs">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => { if (window.confirm(`Delete ${client.name}?`)) deleteMutation.mutate(client.clientId); }}
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

