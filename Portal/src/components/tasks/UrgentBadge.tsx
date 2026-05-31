interface UrgentBadgeProps {
  /** Show only the dot indicator (for table rows / compact views) */
  compact?: boolean;
}

/**
 * Red blinking badge shown on urgent tasks and steps.
 * Admin/manager can set urgency; team_member and client only see this indicator.
 */
export default function UrgentBadge({ compact = false }: UrgentBadgeProps) {
  if (compact) {
    return (
      <span
        className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"
        title="Urgent"
        aria-label="Urgent"
      />
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-300 animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      URGENT
    </span>
  );
}
