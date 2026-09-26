/**
 * #197 — DM Cost, DM Income, Cold Calling Income and the consolidated Reporting
 * sheet, replacing the firm's Excel workbooks.
 *
 * Pure: column definitions, totals, the financial-year cumulative and the
 * monthly report are computed here from plain data, so every number the page
 * shows is derived in one place and unit-tested. The controller only reads and
 * writes Firestore.
 *
 * Shape of one day's stored values: `{ [groupKey]: { [columnKey]: number } }`.
 * Groups are FIXED per sheet (the report maps Google ↔ Google, FB/Insta ↔
 * FB/Insta); the COLUMNS inside a group are the firm's to edit — that is the
 * "dynamic" part. A column is either money (summed into the totals) or a count
 * ("Convert" — clients won), which is never added to money.
 */

const SERVICES = [
  ['trademark', 'Trademark'], ['fssai', 'FSSAI'], ['gst', 'GST'],
  ['company_reg', 'Company Reg'], ['udyam', 'UDYAM'], ['itr', 'ITR'], ['others', 'Others'],
];
const money = (list) => list.map(([key, label]) => ({ key, label, kind: 'money' }));
const convert = { key: 'convert', label: 'Convert', kind: 'count' };

export const SHEETS = {
  dm_cost: {
    label: 'DM Cost',
    groups: [
      { key: 'google', label: 'DM Google Ads', totalLabel: 'Total Google Ads Cost', columns: money(SERVICES) },
      { key: 'fb', label: 'DM FB/Insta Ads', totalLabel: 'Total FB/Insta Ads Cost', columns: money(SERVICES) },
    ],
    grandTotalLabel: 'Total Ad Cost (Google + FB/Insta)',
  },
  dm_income: {
    label: 'DM Income',
    groups: [
      { key: 'google', label: 'DM Google Ads', totalLabel: 'Total DM Google Ads Income', columns: [...money(SERVICES), convert] },
      // The firm's sheet has no ITR column for FB/Insta.
      { key: 'fb', label: 'DM FB/Insta Ads', totalLabel: 'Total DM FB/Insta Ads Income', columns: [...money(SERVICES.filter(([k]) => k !== 'itr')), convert] },
    ],
    grandTotalLabel: 'Total DM Google and FB/Insta Ads Income',
  },
  cold_calling: {
    label: 'Cold Calling Income',
    groups: [
      { key: 'cold', label: 'Cold Calling', totalLabel: 'Total Cold Calling Income', columns: [...money(SERVICES), convert] },
    ],
    grandTotalLabel: 'Total Cold Calling Income',
  },
};
export const SHEET_KEYS = Object.keys(SHEETS);

/**
 * Merge stored column edits over the defaults. The firm may rename, add or
 * HIDE columns, never delete them. A hidden column leaves the view and the
 * totals, but its values stay stored and return if it is shown again, so
 * hiding is reversible and history is never lost.
 */
export function resolveSheet(sheetKey, stored = {}) {
  const def = SHEETS[sheetKey];
  if (!def) return null;
  const groups = def.groups.map((g) => {
    const overrides = stored?.groups?.[g.key]?.columns;
    const columns = Array.isArray(overrides) && overrides.length ? overrides : g.columns;
    return {
      key: g.key,
      label: g.label,
      totalLabel: g.totalLabel,
      columns: columns.map((c) => ({
        key: c.key, label: c.label, kind: c.kind === 'count' ? 'count' : 'money', hidden: !!c.hidden,
      })),
    };
  });
  return { key: sheetKey, label: def.label, grandTotalLabel: def.grandTotalLabel, groups };
}

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const visible = (group) => group.columns.filter((c) => !c.hidden);

/** Totals for one set of values against a resolved sheet. */
export function totalsFor(sheet, values = {}) {
  const groupTotals = {};
  const groupCounts = {};
  let total = 0;
  let count = 0;
  for (const g of sheet.groups) {
    let money = 0;
    let n = 0;
    for (const c of visible(g)) {
      const v = num(values?.[g.key]?.[c.key]);
      if (c.kind === 'count') n += v; else money += v;
    }
    groupTotals[g.key] = money;
    groupCounts[g.key] = n;
    total += money;
    count += n;
  }
  return { groupTotals, groupCounts, total, count };
}

/** Column-by-column sum of many days' values. */
export function sumValues(sheet, list) {
  const out = {};
  for (const g of sheet.groups) {
    out[g.key] = {};
    for (const c of g.columns) {
      out[g.key][c.key] = list.reduce((s, v) => s + num(v?.[g.key]?.[c.key]), 0);
    }
  }
  return out;
}

/** Indian financial year: 1 April → 31 March. `YYYY-MM-DD` → `YYYY-04-01`. */
export function fyStart(dateStr) {
  const [y, m] = dateStr.split('-').map(Number);
  return `${m >= 4 ? y : y - 1}-04-01`;
}

/** Every date of a `YYYY-MM` month, as `YYYY-MM-DD`. */
export function daysOfMonth(month) {
  const [y, m] = month.split('-').map(Number);
  const n = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: n }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`);
}

/**
 * The page for one sheet and month: a row per day, the month's total, and the
 * cumulative from the start of the financial year to the end of that month.
 * `entries` is `{ 'YYYY-MM-DD': values }` covering FY start → month end.
 */
export function sheetView(sheet, entries, month) {
  const days = daysOfMonth(month);
  const rows = days.map((date) => ({ date, values: entries[date] ?? {}, ...totalsFor(sheet, entries[date]) }));
  const monthValues = sumValues(sheet, days.map((d) => entries[d]));
  const from = fyStart(`${month}-01`);
  const to = days[days.length - 1];
  const fyDates = Object.keys(entries).filter((d) => d >= from && d <= to);
  const cumValues = sumValues(sheet, fyDates.map((d) => entries[d]));
  return {
    sheet,
    month,
    rows,
    monthTotal: { values: monthValues, ...totalsFor(sheet, monthValues) },
    cumulative: { from, to, values: cumValues, ...totalsFor(sheet, cumValues) },
  };
}

const ratio = (a, b) => (b > 0 ? Math.round((a / b) * 100) / 100 : null);

/**
 * The consolidated monthly Reporting sheet. Inputs are each sheet's month
 * totals (from `totalsFor` on the month's summed values) plus the month's
 * converted-lead count.
 */
export function reportingRow(month, { cost, income, cold, convertedLeads = 0 }) {
  const spentGoogle = cost?.groupTotals?.google ?? 0;
  const spentFb = cost?.groupTotals?.fb ?? 0;
  const spentBoth = spentGoogle + spentFb;
  const incomeGoogle = income?.groupTotals?.google ?? 0;
  const incomeFb = income?.groupTotals?.fb ?? 0;
  const incomeBoth = incomeGoogle + incomeFb;
  const clientsGoogle = income?.groupCounts?.google ?? 0;
  const clientsFb = income?.groupCounts?.fb ?? 0;
  const clientsTotal = clientsGoogle + clientsFb;
  return {
    month,
    spentGoogle, spentFb, spentBoth,
    incomeGoogle, incomeFb, incomeBoth,
    clientsGoogle, clientsFb, clientsTotal,
    // Customer acquisition cost: ad spend per client won through the ads.
    cac: ratio(spentBoth, clientsTotal),
    // Revenue to cost: ad income per rupee of ad spend.
    revenueToCost: ratio(incomeBoth, spentBoth),
    coldCallingIncome: cold?.total ?? 0,
    coldCallingClients: cold?.count ?? 0,
    convertedLeads,
  };
}

/** `YYYY-MM` months from `from` to `to` inclusive (max 24). */
export function monthsBetween(from, to) {
  const out = [];
  let [y, m] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  while ((y < ty || (y === ty && m <= tm)) && out.length < 24) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    m += 1; if (m > 12) { m = 1; y += 1; }
  }
  return out;
}

/** Validate an admin's column edit for one group. Returns clean columns or throws. */
export function cleanColumns(columns) {
  if (!Array.isArray(columns) || columns.length === 0 || columns.length > 40) {
    throw Object.assign(new Error('A group needs between 1 and 40 columns.'), { status: 400 });
  }
  const seen = new Set();
  return columns.map((c) => {
    const label = String(c?.label ?? '').replace(/<[^>]*>/g, '').trim().slice(0, 40);
    if (!label) throw Object.assign(new Error('Every column needs a name.'), { status: 400 });
    let key = String(c?.key ?? '').trim()
      || label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 30) || 'col';
    if (!/^[a-z0-9_]{1,40}$/.test(key)) throw Object.assign(new Error(`Invalid column key "${key}".`), { status: 400 });
    while (seen.has(key)) key = `${key}_2`;
    seen.add(key);
    return { key, label, kind: c?.kind === 'count' ? 'count' : 'money', hidden: !!c?.hidden };
  });
}
