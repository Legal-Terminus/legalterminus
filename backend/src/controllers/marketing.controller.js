import { FieldPath } from 'firebase-admin/firestore';
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { STAFF_ROLES } from '../config/roles.js';
import {
  SECTIONS, getGrants, levelsForUser, saveGrants,
} from '../services/reportingAccess.service.js';
import {
  SHEET_KEYS, resolveSheet, sheetView, sumValues, totalsFor, fyStart, daysOfMonth,
  reportingRow, monthsBetween, cleanColumns,
} from '../services/marketingSheets.service.js';

/**
 * #197 — DM Cost / DM Income / Cold Calling Income sheets and the Reporting
 * rollup, plus (#196/#197) the admin's section-access table.
 *
 * Storage: `marketingSheets/{sheet}` holds the column edits;
 * `marketingSheets/{sheet}/days/{YYYY-MM-DD}` holds one day's values. Reads are
 * bounded by a date range on the document id, so cost follows the months asked
 * for, never the history.
 */

const SHEETS_COL = 'marketingSheets';
const today = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => today().slice(0, 7);

const serverError = (res, err, ctx) => {
  logger.error({ err }, ctx);
  res.status(500).json({ message: 'Internal server error' });
};

async function loadSheet(db, key) {
  const snap = await db.collection(SHEETS_COL).doc(key).get();
  return resolveSheet(key, snap.exists ? snap.data() : {});
}

/** `{ date: values }` for one sheet between two dates, inclusive. */
async function loadEntries(db, key, from, to) {
  const snap = await db.collection(SHEETS_COL).doc(key).collection('days')
    .where(FieldPath.documentId(), '>=', from)
    .where(FieldPath.documentId(), '<=', to)
    .get();
  const out = {};
  for (const d of snap.docs) out[d.id] = d.data().values ?? {};
  return out;
}

/* ── Access ─────────────────────────────────────────────────────────────── */

// GET /api/marketing/access/me — the caller's level on every section.
export async function getMyAccess(req, res) {
  try {
    res.json({ sections: SECTIONS, levels: await levelsForUser(req.user) });
  } catch (err) { serverError(res, err, 'getMyAccess failed'); }
}

// GET /api/marketing/access — admin: the whole table plus the staff to assign.
export async function getAccess(req, res) {
  try {
    const db = getDb();
    const assignable = STAFF_ROLES.filter((r) => r !== 'admin');
    const users = await db.collection('users').where('role', 'in', assignable).get();
    res.json({
      sections: SECTIONS,
      grants: await getGrants(),
      staff: users.docs
        .map((d) => ({ uid: d.id, name: d.data().name || d.data().email || 'Team member', role: d.data().role }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (err) { serverError(res, err, 'getAccess failed'); }
}

// PUT /api/marketing/access — admin: replace the table.
export async function putAccess(req, res) {
  try {
    const db = getDb();
    const assignable = STAFF_ROLES.filter((r) => r !== 'admin');
    const users = await db.collection('users').where('role', 'in', assignable).get();
    const grants = await saveGrants(req.body.sections, {
      staffUids: users.docs.map((d) => d.id), actorUid: req.user.uid,
    });
    res.json({ grants });
  } catch (err) { serverError(res, err, 'putAccess failed'); }
}

/* ── Sheets ─────────────────────────────────────────────────────────────── */

const sheetParam = (req, res) => {
  const key = req.params.sheet;
  if (!SHEET_KEYS.includes(key)) { res.status(404).json({ message: 'Unknown sheet' }); return null; }
  return key;
};

// GET /api/marketing/sheets/:sheet?month=YYYY-MM
export async function getSheet(req, res) {
  try {
    const key = sheetParam(req, res); if (!key) return;
    const db = getDb();
    const month = req.query.month || thisMonth();
    const days = daysOfMonth(month);
    const sheet = await loadSheet(db, key);
    const entries = await loadEntries(db, key, fyStart(days[0]), days[days.length - 1]);
    res.json({ ...sheetView(sheet, entries, month), canEdit: req.sectionLevel === 'edit' });
  } catch (err) { serverError(res, err, 'getSheet failed'); }
}

// PUT /api/marketing/sheets/:sheet/days/:date  { values }
export async function putDay(req, res) {
  try {
    const key = sheetParam(req, res); if (!key) return;
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
      return res.status(400).json({ message: 'Use a real date as YYYY-MM-DD.' });
    }
    if (date > today()) return res.status(400).json({ message: 'Figures cannot be entered for a future date.' });
    const db = getDb();
    const sheet = await loadSheet(db, key);
    // Only columns this sheet actually has — an unknown key is refused, not stored.
    const values = {};
    for (const [gKey, cols] of Object.entries(req.body.values)) {
      const group = sheet.groups.find((g) => g.key === gKey);
      if (!group) return res.status(400).json({ message: `Unknown group "${gKey}".` });
      values[gKey] = {};
      for (const [cKey, v] of Object.entries(cols)) {
        const col = group.columns.find((c) => c.key === cKey);
        if (!col) return res.status(400).json({ message: `Unknown column "${cKey}".` });
        if (col.kind === 'count' && !Number.isInteger(v)) {
          return res.status(400).json({ message: `"${col.label}" is a count of clients — use a whole number.` });
        }
        values[gKey][cKey] = v;
      }
    }
    const ref = db.collection(SHEETS_COL).doc(key).collection('days').doc(date);
    // merge: a save of one group must not wipe the other group's figures.
    await ref.set({ values, updatedAt: new Date().toISOString(), updatedBy: req.user.uid }, { merge: true });
    const saved = (await ref.get()).data().values ?? {};
    res.json({ date, values: saved, ...totalsFor(sheet, saved) });
  } catch (err) { serverError(res, err, 'putDay failed'); }
}

// DELETE /api/marketing/sheets/:sheet/days/:date — clear a day entered by mistake.
export async function deleteDay(req, res) {
  try {
    const key = sheetParam(req, res); if (!key) return;
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ message: 'Use a date as YYYY-MM-DD.' });
    await getDb().collection(SHEETS_COL).doc(key).collection('days').doc(date).delete();
    logger.info({ sheet: key, date, actorUid: req.user.uid }, 'Marketing sheet day cleared');
    res.json({ date, cleared: true });
  } catch (err) { serverError(res, err, 'deleteDay failed'); }
}

// PUT /api/marketing/sheets/:sheet/columns — admin: rename/add/hide columns.
export async function putColumns(req, res) {
  try {
    const key = sheetParam(req, res); if (!key) return;
    const db = getDb();
    const current = await loadSheet(db, key);
    const groups = {};
    for (const g of current.groups) {
      const next = req.body.groups[g.key];
      groups[g.key] = { columns: next ? cleanColumns(next.columns) : g.columns };
      // Never drop a column: anything left out is kept, hidden, so its history
      // stays attached and can be shown again.
      const kept = new Set(groups[g.key].columns.map((c) => c.key));
      for (const old of g.columns) {
        if (!kept.has(old.key)) groups[g.key].columns.push({ ...old, hidden: true });
      }
    }
    await db.collection(SHEETS_COL).doc(key).set({
      groups, updatedAt: new Date().toISOString(), updatedBy: req.user.uid,
    });
    res.json(resolveSheet(key, { groups }));
  } catch (err) {
    if (err?.status === 400) return res.status(400).json({ message: err.message });
    serverError(res, err, 'putColumns failed');
  }
}

/* ── Reporting ──────────────────────────────────────────────────────────── */

// GET /api/marketing/reporting?from=YYYY-MM&to=YYYY-MM
export async function getReporting(req, res) {
  try {
    const db = getDb();
    const to = req.query.to || thisMonth();
    const from = req.query.from || fyStart(`${to}-01`).slice(0, 7);
    if (from > to) return res.status(400).json({ message: '"From" must not be after "to".' });
    const months = monthsBetween(from, to);
    const start = `${months[0]}-01`;
    const endDays = daysOfMonth(months[months.length - 1]);
    const end = endDays[endDays.length - 1];

    const [cost, income, cold] = await Promise.all(['dm_cost', 'dm_income', 'cold_calling'].map(async (k) => ({
      sheet: await loadSheet(db, k), entries: await loadEntries(db, k, start, end),
    })));

    // Converted leads by lead date. A single-field range (auto-indexed); the
    // outcome is counted here so no composite index is needed.
    const leads = await db.collection('contactLeads')
      .where('leadDate', '>=', start).where('leadDate', '<=', end).get();
    const convertedByMonth = {};
    for (const d of leads.docs) {
      const l = d.data();
      if (l.outcome === 'converted' && typeof l.leadDate === 'string') {
        const m = l.leadDate.slice(0, 7);
        convertedByMonth[m] = (convertedByMonth[m] ?? 0) + 1;
      }
    }

    const monthTotals = ({ sheet, entries }, month) => {
      const vals = sumValues(sheet, Object.entries(entries).filter(([d]) => d.startsWith(month)).map(([, v]) => v));
      return totalsFor(sheet, vals);
    };
    const rows = months.map((m) => reportingRow(m, {
      cost: monthTotals(cost, m), income: monthTotals(income, m), cold: monthTotals(cold, m),
      convertedLeads: convertedByMonth[m] ?? 0,
    }));
    const sum = (k) => rows.reduce((s, r) => s + (r[k] ?? 0), 0);
    const totals = reportingRow('total', {
      cost: { groupTotals: { google: sum('spentGoogle'), fb: sum('spentFb') } },
      income: { groupTotals: { google: sum('incomeGoogle'), fb: sum('incomeFb') },
        groupCounts: { google: sum('clientsGoogle'), fb: sum('clientsFb') } },
      cold: { total: sum('coldCallingIncome'), count: sum('coldCallingClients') },
      convertedLeads: sum('convertedLeads'),
    });
    res.json({ from, to, rows, totals });
  } catch (err) { serverError(res, err, 'getReporting failed'); }
}
