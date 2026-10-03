/**
 * Client / group-wise work and fee report (LT #206).
 *
 * "How much work did we do for the Mehta group last year, and what did it
 * bring in?" Every fact needed already exists — a client's optional group
 * (`users.groupCompany`), the matter's client, its fee and what has been
 * received — so this module only FOLDS; it stores nothing.
 *
 * Three decisions, each a deliberate trade-off:
 *
 *  - A matter belongs to the financial year it was CREATED in. Works and fee
 *    charged then describe the same set of matters. The cost: money received in
 *    May for a March matter counts in the earlier year. This is a work report,
 *    not a cash book — the Revenue report is the cash view.
 *  - A matter's group is its client's CURRENT group, resolved at read time.
 *    Moving a client to another group moves their history with them.
 *  - The financial year is April–March in India time. A matter created at
 *    00:10 IST on 1 April is in the new year even though its UTC timestamp
 *    still says 31 March.
 *
 * Pure functions; the controller does the I/O.
 */
import { matterMoney } from './clientRollup.service.js';

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Clients with no group are reported together under this label. */
export const INDIVIDUAL = 'individual';

/** "2026-27" for any instant inside April 2026 – March 2027 (India time). */
export function financialYearOf(iso) {
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return null;
  const ist = new Date(ms + IST_OFFSET_MS);
  const y = ist.getUTCFullYear();
  const start = ist.getUTCMonth() >= 3 ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
}

/** The [from, to) ISO instants of a financial year label, or null if malformed. */
export function financialYearRange(fy) {
  const m = /^(\d{4})-(\d{2})$/.exec(fy ?? '');
  if (!m) return null;
  const start = Number(m[1]);
  if ((start + 1) % 100 !== Number(m[2])) return null;
  const at = (year) => new Date(Date.UTC(year, 3, 1) - IST_OFFSET_MS).toISOString();
  return { from: at(start), to: at(start + 1) };
}

/** The current year and the five before it — what the year filter offers. */
export function recentFinancialYears(now = Date.now(), count = 6) {
  const start = Number(financialYearOf(new Date(now).toISOString()).slice(0, 4));
  return Array.from({ length: count }, (_, i) => {
    const y = start - i;
    return `${y}-${String((y + 1) % 100).padStart(2, '0')}`;
  });
}

/** How the report names a client: the firm/company, else the person. */
export const clientLabel = (c) => c?.organisation || c?.businessName || c?.name || c?.fullName || c?.email || '';

const groupOf = (c) => String(c?.groupCompany ?? '').trim();
const sameGroup = (a, b) => a.toLowerCase() === b.toLowerCase();

/**
 * @param {object[]} tasks    matters created in the year (task docs, with `id`)
 * @param {object[]} clients  the firm's client users (with `uid`)
 * @param {{ group?: string, clientUid?: string, serviceKey?: string }} filters
 *        `group` is a group name, or INDIVIDUAL for clients with none.
 */
export function buildClientGroupReport(tasks, clients, filters = {}) {
  const byUid = new Map(clients.map((c) => [c.uid, c]));
  // One spelling per group everywhere in the report — the same one the filter
  // offers — or "Mehta Group" and "mehta group" would head separate lines.
  const canonical = new Map(distinctGroups(clients).map((g) => [g.toLowerCase(), g]));
  const canonicalGroup = (c) => canonical.get(groupOf(c).toLowerCase()) ?? '';

  const all = tasks.map((t) => {
    const client = byUid.get(t.clientUid);
    const money = matterMoney(t);
    return {
      taskId: t.id,
      clientUid: t.clientUid ?? null,
      // A matter keeps the client name it was created with if the client record
      // has since been removed — a deleted client must not blank a fee row.
      clientName: clientLabel(client) || t.organisation || t.clientName || '(client removed)',
      group: canonicalGroup(client),
      serviceKey: t.serviceKey ?? t.workflowType ?? '',
      serviceName: t.serviceName ?? t.workflowType ?? '',
      createdAt: t.createdAt ?? null,
      financialYear: financialYearOf(t.createdAt),
      status: t.status ?? '',
      priced: money.priced,
      charged: money.total,
      received: money.received,
      balance: money.balance,
    };
  });

  // Service options come from the year BEFORE the service filter narrows it,
  // or picking one service would empty its own dropdown.
  const services = [...new Map(all.filter((r) => r.serviceKey)
    .map((r) => [r.serviceKey, { key: r.serviceKey, name: r.serviceName || r.serviceKey }])).values()]
    .sort((a, b) => a.name.localeCompare(b.name));

  const group = String(filters.group ?? '').trim();
  const rows = all.filter((r) => {
    if (group === INDIVIDUAL && r.group) return false;
    if (group && group !== INDIVIDUAL && !sameGroup(r.group, group)) return false;
    if (filters.clientUid && r.clientUid !== filters.clientUid) return false;
    if (filters.serviceKey && r.serviceKey !== filters.serviceKey) return false;
    return true;
  }).sort((a, b) => (a.group || '￿').localeCompare(b.group || '￿')
    || a.clientName.localeCompare(b.clientName)
    || String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));

  const sum = (list) => list.reduce((acc, r) => ({
    works: acc.works + 1,
    charged: acc.charged + r.charged,
    received: acc.received + r.received,
    balance: acc.balance + r.balance,
  }), { works: 0, charged: 0, received: 0, balance: 0 });

  // One line per group (individual clients last), for the year-on-year glance.
  const buckets = new Map();
  for (const r of rows) {
    const key = r.group ? r.group.toLowerCase() : '';
    const b = buckets.get(key) ?? { group: r.group, rows: [], clients: new Set() };
    b.rows.push(r);
    if (r.clientUid) b.clients.add(r.clientUid);
    buckets.set(key, b);
  }
  const byGroup = [...buckets.values()]
    .map((b) => ({ group: b.group, clients: b.clients.size, ...sum(b.rows) }))
    .sort((a, b) => (a.group ? 0 : 1) - (b.group ? 0 : 1) || b.charged - a.charged || a.group.localeCompare(b.group));

  return { rows, totals: sum(rows), byGroup, services };
}

/**
 * The distinct groups in use, case-insensitively de-duplicated (first spelling
 * wins) — "ABC Group" and "abc group" are one group, not two.
 */
export function distinctGroups(clients) {
  const seen = new Map();
  for (const c of clients) {
    const g = groupOf(c);
    if (g && !seen.has(g.toLowerCase())) seen.set(g.toLowerCase(), g);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}
