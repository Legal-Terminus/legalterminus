/**
 * LT #366 — the filters above a report (Status, Service, Payment, From, To),
 * applied one way for every report.
 *
 * Before, each report built a Firestore query from whichever filters it knew:
 * the Master Sheet ignored Status, Service and Payment altogether; Pending
 * ignored Service and Payment; All / Completed matched Service against
 * `workflowType` (the workflow's id, not the service the dropdown names) and
 * failed outright on combinations no composite index covered. The To date was
 * compared as text against a full timestamp, so a matter from that day was
 * left out.
 *
 * Now a report reads its matters and keeps those that pass `matchesReportFilters`
 * — every chosen filter must match (AND). Dates are whole days in India,
 * inclusive at both ends.
 */
import { indiaDate } from '../../../shared/workflows/gstReturns.js';

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** The filters a report request carries. Unknown or blank values are dropped. */
export function reportFiltersOf(query = {}) {
  const s = (v) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
  return {
    status: s(query.status),
    serviceType: s(query.serviceType),
    teamMember: s(query.teamMember),
    paymentStatus: s(query.paymentStatus),
    startDate: DAY.test(query.startDate ?? '') ? query.startDate : undefined,
    endDate: DAY.test(query.endDate ?? '') ? query.endDate : undefined,
  };
}

/** The India calendar day ('YYYY-MM-DD') of an ISO time, or null. */
export function indiaDayOf(iso) {
  if (!iso || typeof iso !== 'string') return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : indiaDate(d);
}

/** A matter's service, as the Service dropdown names it (the service key), and its older aliases. */
const serviceIdsOf = (t) => [t.serviceKey, t.workflowType, t.workflowDefinitionId].filter(Boolean);

const assigneesOf = (t) => [
  t.assignedTo,
  ...(Array.isArray(t.assignedToUids) ? t.assignedToUids : []),
].filter(Boolean);

/** Matters whose money is no longer expected: their due amount is not outstanding. */
export const CLOSED_FOR_PAYMENT = ['cancelled', 'rejected', 'archived'];

/**
 * LT #370 / #365: an amount still to be collected — something due on a matter
 * that is not stopped, rejected or archived. A completed matter with a balance
 * is still owed. Revenue Analytics' Outstanding uses the same rule.
 */
export const hasAmountDue = (t) => (Number(t?.amountDue ?? 0) || 0) > 0 && !CLOSED_FOR_PAYMENT.includes(t?.status);

/**
 * The Payment filter: a status ('not_paid' | 'part_paid' | 'fully_paid'), or
 * 'due' (LT #370: has an amount due) or 'received' (LT #365: any money received —
 * what Revenue Analytics' Collected adds up).
 */
function matchesPayment(task, wanted) {
  if (wanted === 'due') return hasAmountDue(task);
  if (wanted === 'received') return (Number(task.amountPaid ?? 0) || 0) > 0;
  return (task.paymentStatus ?? 'not_paid') === wanted;
}

/**
 * Whether one matter passes every chosen filter. `dateField` is the date the
 * report's range applies to (`createdAt`, or `updatedAt` for Completed).
 */
export function matchesReportFilters(task, filters, { dateField = 'createdAt' } = {}) {
  const f = filters ?? {};
  if (f.status && task.status !== f.status) return false;
  if (f.serviceType && !serviceIdsOf(task).includes(f.serviceType)) return false;
  if (f.teamMember && !assigneesOf(task).includes(f.teamMember)) return false;
  if (f.paymentStatus && !matchesPayment(task, f.paymentStatus)) return false;
  if (f.startDate || f.endDate) {
    const day = indiaDayOf(task[dateField]);
    if (!day) return false;
    if (f.startDate && day < f.startDate) return false;
    if (f.endDate && day > f.endDate) return false;
  }
  return true;
}

/** Newest first by `field` (ISO strings). */
export const byNewest = (field) => (a, b) => String(b[field] ?? '').localeCompare(String(a[field] ?? ''));
