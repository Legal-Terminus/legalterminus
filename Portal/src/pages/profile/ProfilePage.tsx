import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageShell from '../../components/common/PageShell';
import { getMe, updateMe, type ProfileUpdate } from '../../api/profile';
import { displayName } from '../../api/users';
import { roleLabel, roleBadgeClass } from '../../lib/roles';
import { User, Mail, Phone, MapPin, Building2, Pencil, Save, X, AlertCircle } from 'lucide-react';

function initials(name?: string) {
  const n = (name ?? '').trim();
  if (!n) return '?';
  return n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['me'], queryFn: getMe });
  const user = data?.user;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileUpdate>({});
  const [formError, setFormError] = useState('');

  // Seed the edit form whenever the profile loads / changes.
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? user.fullName ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        businessName: user.businessName ?? '',
        state: user.state ?? '',
        organisation: user.organisation ?? '',
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: (body: ProfileUpdate) => updateMe(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setEditing(false);
      setFormError('');
    },
    onError: (err: Error) => setFormError(err.message || 'Failed to update profile.'),
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) { setFormError('Name is required.'); return; }
    mutation.mutate(form);
  };

  if (isLoading) {
    return (
      <PageShell title="My Profile">
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <div className="w-7 h-7 border-2 border-hairline border-t-ink rounded-full animate-spin" />
          <span className="text-sm">Loading profile…</span>
        </div>
      </PageShell>
    );
  }

  if (error || !user) {
    return (
      <PageShell title="My Profile">
        <div className="card p-16 flex flex-col items-center gap-3 text-ink-faint">
          <AlertCircle className="w-10 h-10 text-red-300" />
          <p className="text-sm font-medium text-red-600">Couldn’t load your profile</p>
          {error && <p className="text-xs text-ink-faint">{(error as Error).message}</p>}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="My Profile"
      subtitle="Your account details"
      action={
        !editing ? (
          <button onClick={() => setEditing(true)} className="btn-secondary">
            <Pencil className="w-4 h-4" /> Edit
          </button>
        ) : undefined
      }
    >
      {/* Identity header */}
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ink text-white flex items-center justify-center shrink-0">
            <span className="text-lg font-bold">{initials(displayName(user))}</span>
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-ink truncate">{displayName(user)}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-ink-muted truncate">{user.email}</span>
              <span className={`badge ${roleBadgeClass(user.role)}`}>{roleLabel(user.role)}</span>
            </div>
          </div>
        </div>
      </div>

      {!editing ? (
        <div className="card p-6 space-y-4">
          <Field icon={<User className="w-4 h-4" />} label="Full name" value={displayName(user)} />
          <Field icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} hint="Email can’t be changed" />
          <Field icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phone} />
          <Field icon={<MapPin className="w-4 h-4" />} label="Address" value={user.address} />
          <Field icon={<Building2 className="w-4 h-4" />} label="Organisation" value={user.organisation} />
          <Field icon={<Building2 className="w-4 h-4" />} label="Business name" value={user.businessName} />
          <Field icon={<MapPin className="w-4 h-4" />} label="State" value={user.state} />
        </div>
      ) : (
        <form onSubmit={onSubmit} className="card p-6 space-y-4">
          {formError && (
            <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-2xl">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}
          <div>
            <label className="input-label">Full Name <span className="text-red-400">*</span></label>
            <input name="name" value={form.name ?? ''} onChange={onChange} className="input-field" required />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input value={user.email} disabled className="input-field disabled:bg-gray-50 disabled:text-gray-400" />
            <p className="text-xs text-ink-faint mt-1">Email can’t be changed</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Phone</label>
              <input name="phone" value={form.phone ?? ''} onChange={onChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">State</label>
              <input name="state" value={form.state ?? ''} onChange={onChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="input-label">Address</label>
            <input name="address" value={form.address ?? ''} onChange={onChange} className="input-field" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Organisation</label>
              <input name="organisation" value={form.organisation ?? ''} onChange={onChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">Business name</label>
              <input name="businessName" value={form.businessName ?? ''} onChange={onChange} className="input-field" />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button type="button" onClick={() => { setEditing(false); setFormError(''); }} className="btn-secondary flex-1 sm:flex-none sm:px-6">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
              <Save className="w-4 h-4" /> {mutation.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      )}
    </PageShell>
  );
}

function Field({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value?: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-surface-soft flex items-center justify-center text-ink-faint shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-ink-faint uppercase tracking-wide">{label}</p>
        <p className="text-sm text-ink mt-0.5">{value?.trim() || '—'}</p>
        {hint && <p className="text-xs text-ink-faint mt-0.5">{hint}</p>}
      </div>
    </div>
  );
}
