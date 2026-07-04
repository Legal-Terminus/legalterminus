import { X, Pencil, Mail, Phone, Briefcase, Building2, Calendar } from 'lucide-react';
import { displayName, type PortalUser } from '../../api/users';
import { roleLabel, roleBadgeClass, roleAvatarClass } from '../../lib/roles';

function initials(name?: string) {
  const n = (name ?? '').trim();
  if (!n) return '?';
  return n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

/**
 * E09-S06 — read-only user detail view. Opens when a user row is clicked, showing
 * ALL of the user's fields without entering edit mode. An explicit "Edit" action
 * switches to the edit form; viewing never mutates.
 */
export default function UserDetailDrawer({ user, onClose, onEdit, canEdit }: {
  user: PortalUser;
  onClose: () => void;
  onEdit: (u: PortalUser) => void;
  canEdit: boolean;
}) {
  const isClient = user.role === 'client';
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto" role="dialog" aria-label="User details">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-hairline px-5 py-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">User details</p>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-muted hover:bg-surface-soft" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Identity */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${roleAvatarClass(user.role)}`}>
              <span className="text-base font-bold">{initials(displayName(user))}</span>
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-ink truncate">{displayName(user)}</p>
              <span className={`badge ${roleBadgeClass(user.role)}`}>{roleLabel(user.role)}</span>
            </div>
          </div>

          {/* Contact */}
          <Section title="Contact">
            <Field icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={user.email} />
            <Field icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={user.phone} />
            {user.emailIds && user.emailIds.filter((e) => e !== user.email).length > 0 && (
              <Field label="Other emails" value={user.emailIds.filter((e) => e !== user.email).join(', ')} />
            )}
          </Section>

          {/* Role-specific */}
          {isClient ? (
            <Section title="Client details">
              <Field icon={<Building2 className="w-3.5 h-3.5" />} label="Organisation" value={user.organisation} />
              <Field label="Business name" value={user.businessName} />
              <Field label="Professional" value={user.professionalName} />
              <Field label="Group company" value={user.groupCompany} />
              <Field label="GST number" value={user.gstNumber} />
              <Field label="PAN" value={user.panNumber} />
              <Field label="Aadhaar" value={user.aadhaarNumber} />
              <Field label="State" value={user.state} />
              <Field label="Address" value={user.address} />
            </Section>
          ) : (
            <Section title="Team member details">
              <Field icon={<Briefcase className="w-3.5 h-3.5" />} label="Designation" value={user.designation} />
              <Field label="Joining date" value={user.joiningDate} />
              <Field label="Father's name" value={user.fathersName} />
              <Field label="Date of birth" value={user.dateOfBirth} />
              <Field label="Address" value={user.address} />
              <Field label="State" value={user.state} />
            </Section>
          )}

          <Section title="Account">
            <Field icon={<Calendar className="w-3.5 h-3.5" />} label="Added" value={formatDate(user.createdAt)} />
          </Section>
        </div>

        {/* Footer actions */}
        {canEdit && (
          <div className="sticky bottom-0 bg-white border-t border-hairline px-5 py-3 flex justify-end">
            <button onClick={() => onEdit(user)} className="btn-primary inline-flex items-center gap-2">
              <Pencil className="w-4 h-4" /> Edit
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-2">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Field({ icon, label, value }: { icon?: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-ink-faint mt-0.5 shrink-0">{icon}</span>}
      <div className="min-w-0">
        <p className="text-[11px] text-ink-faint">{label}</p>
        <p className="text-sm text-ink break-words">{value}</p>
      </div>
    </div>
  );
}

function formatDate(v?: string): string {
  if (!v) return '';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
