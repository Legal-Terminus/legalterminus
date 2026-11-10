/**
 * #210 / #217 — the worksheet engine's PURE rules. No Firestore here: the
 * controller reads and writes; every decision (which columns a sheet has, how a
 * header in the firm's Excel file maps to a field, what an upload will change,
 * the renewal and KYC dates, which reminder is due) is made here from plain data
 * and unit-tested in __tests__/worksheetEngine.test.js.
 *
 * Definitions live in config/worksheetDefinitions.js; the firm's edits are an
 * override document per book: `worksheetConfig/{book}`
 *   { customFields: [{ key, label, type, options? }],
 *     sheets: { [sheetKey]: { columns: [{ key, label?, hidden? }], linkedServices?: [] } } }
 */
import { BOOKS, SHEETS, MODULES, ADDABLE_TYPES } from '../config/worksheetDefinitions.js';

const httpError = (status, message, extra = {}) => Object.assign(new Error(message), { status, ...extra });

/* ── Resolving definitions + overrides ──────────────────────────────────── */

/**
 * Every field a book's records may hold: built-in plus the firm's own.
 *
 * #280 / #279: the options of ANY choice list — built-in or added — may be
 * edited by staff; the edited list is stored in `optionOverrides[field]` and
 * replaces the default here, so every sheet, form and upload sees it at once.
 */
export function bookFields(bookKey, config = {}) {
  const book = BOOKS[bookKey];
  if (!book) return [];
  const overrides = config?.optionOverrides && typeof config.optionOverrides === 'object' ? config.optionOverrides : {};
  const withOptions = (fd) => (fd.type === 'select' && Array.isArray(overrides[fd.key]) ? { ...fd, options: overrides[fd.key] } : fd);
  const builtIn = book.fields.map((fd) => withOptions({ ...fd, builtIn: true }));
  const custom = (Array.isArray(config?.customFields) ? config.customFields : [])
    .filter((cf) => cf && typeof cf.key === 'string' && !book.fields.some((b) => b.key === cf.key))
    .map((cf) => withOptions({
      key: cf.key, label: cf.label, type: ADDABLE_TYPES.includes(cf.type) ? cf.type : 'text',
      ...(cf.type === 'select' ? { options: Array.isArray(cf.options) ? cf.options : [] } : {}),
      builtIn: false,
    }));
  return [...builtIn, ...custom];
}

/**
 * The headings a field carries on ANY sheet of its book — so an upload to TM
 * Master still recognises "DATE OF FILING TMA" from TM Assignment.
 */
export function bookHeadings(bookKey, fieldKey) {
  const out = [];
  for (const s of Object.values(SHEETS)) {
    if (s.book !== bookKey) continue;
    const col = s.columns.find((x) => x.key === fieldKey);
    if (col?.label) out.push(col.label);
  }
  return out;
}

/**
 * A sheet as the page shows it: its columns in order (hidden ones included and
 * flagged), each carrying the field's type and every heading that names it.
 */
export function resolveSheet(sheetKey, config = {}) {
  const sheet = SHEETS[sheetKey];
  if (!sheet) return null;
  const book = BOOKS[sheet.book];
  const fields = bookFields(sheet.book, config);
  const byKey = new Map(fields.map((fd) => [fd.key, fd]));
  const stored = config?.sheets?.[sheetKey];

  const defaults = sheet.columns.map((col) => ({ key: col.key, label: col.label, hidden: false }));
  let list = Array.isArray(stored?.columns) && stored.columns.length ? stored.columns : defaults;
  // A built-in column added to the definition after the firm saved its edits
  // still appears (at the end), so a code change never silently hides a column.
  const listed = new Set(list.map((col) => col.key));
  list = [...list, ...defaults.filter((d) => !listed.has(d.key))];

  const columns = [];
  const seen = new Set();
  for (const col of list) {
    const fd = byKey.get(col?.key);
    if (!fd || seen.has(fd.key)) continue;
    seen.add(fd.key);
    const defaultCol = sheet.columns.find((d) => d.key === fd.key);
    const label = (col.label && String(col.label).trim()) || defaultCol?.label || fd.label;
    const aliases = new Set([fd.label, ...(fd.aliases ?? []), ...bookHeadings(sheet.book, fd.key)]);
    aliases.delete(label);
    columns.push({
      key: fd.key,
      label,
      type: fd.type,
      ...(fd.options ? { options: fd.options } : {}),
      ...(fd.compute ? { compute: fd.compute } : {}),
      hidden: !!col.hidden,
      builtIn: fd.builtIn,
      aliases: [...aliases],
    });
  }

  const linked = Array.isArray(stored?.linkedServices) ? stored.linkedServices : book.linkedServices ?? [];
  const recordKey = book.recordKey ?? [];
  return {
    key: sheet.key,
    label: sheet.label,
    module: sheet.module,
    book: sheet.book,
    columns,
    recordKey,
    recordKeyLabel: recordKey.map((k) => byKey.get(k)?.label ?? k).join(' + '),
    linkedServices: linked,
    // The other sheets a record of this book can also appear in (#210). In an
    // EXCLUSIVE book (#279: Monthly / Quarterly) a record is in one sheet only,
    // so switching sheets never mixes records.
    memberships: Object.values(SHEETS)
      .filter((s) => s.book === sheet.book && (!book.exclusive || s.key === sheet.key))
      .map((s) => ({ key: s.key, label: s.label })),
    reminder: book.reminder ? { field: book.reminder.field, milestones: book.reminder.milestones } : null,
    // #280 / #279: the firm's sheets start with "Sl. No." — the row's number,
    // shown and downloaded, never stored.
    serial: !!sheet.serial,
    // #279: rows that come from matters (read-only provenance for the Portal).
    source: book.sync ? { kind: book.sync } : null,
  };
}

export const moduleSheets = (moduleKey) => MODULES[moduleKey]?.sheets ?? null;

/* ── Header matching (Excel upload) ─────────────────────────────────────── */

/** "Date of Filing (TM)" → "DATEOFFILINGTM": case, spaces and punctuation ignored. */
export function normalizeHeader(h) {
  return String(h ?? '').toUpperCase().replace(/[^A-Z0-9%]+/g, '');
}
/** Same, with any (parenthetical) removed: "CONSTITUTION (COMPANY/LLP)" → "CONSTITUTION". */
const normalizeBare = (h) => normalizeHeader(String(h ?? '').replace(/\([^)]*\)/g, ''));

/** Every normalised spelling that names a column. */
function spellings(col) {
  const out = new Set();
  for (const l of [col.label, ...(col.aliases ?? [])]) {
    const a = normalizeHeader(l); const b = normalizeBare(l);
    if (a) out.add(a);
    if (b) out.add(b);
  }
  return out;
}

const MIN_PREFIX = 6;

/**
 * Map each uploaded header to a field.
 *
 * Order of trust: an exact match (label or alias, case/space/punctuation
 * insensitive, with or without the bracketed part) on this sheet's columns,
 * then on the rest of the book's fields; then a UNIQUE prefix match of at least
 * six characters ("EXAMINATION REPO" → "Examination Report", "DATE OF FILING
 * TMA" → "Date of Filing TM"). A prefix that fits two different fields is
 * ambiguous and reported as unknown rather than guessed.
 *
 * Returns one entry per header: { index, header, key|null, status } where
 * status is matched | computed | matter | unknown | blank | duplicate.
 */
export function matchHeaders(headers, sheetColumns, otherFields = []) {
  const candidates = [
    ...sheetColumns.map((col) => ({ col, sp: spellings(col) })),
    ...otherFields
      .filter((fd) => !sheetColumns.some((col) => col.key === fd.key))
      .map((fd) => ({ col: fd, sp: spellings({ label: fd.label, aliases: fd.aliases }) })),
  ];
  const used = new Set();
  return headers.map((raw, index) => {
    const header = String(raw ?? '').trim();
    const norm = normalizeHeader(header);
    const bare = normalizeBare(header);
    if (!norm) return { index, header, key: null, status: 'blank' };

    let hit = candidates.find((cand) => cand.sp.has(norm) || (bare && cand.sp.has(bare)));
    if (!hit) {
      const prefixHits = candidates.filter((cand) => [...cand.sp].some((s) => {
        const [shorter, longer] = s.length <= norm.length ? [s, norm] : [norm, s];
        return shorter.length >= MIN_PREFIX && longer.startsWith(shorter);
      }));
      const distinct = new Set(prefixHits.map((h) => h.col.key));
      if (distinct.size === 1) hit = prefixHits[0];
    }
    if (!hit) return { index, header, key: null, status: 'unknown' };
    const { key, type, label } = hit.col;
    if (used.has(key)) return { index, header, key, label, status: 'duplicate' };
    used.add(key);
    const status = type === 'computed' ? 'computed' : type === 'matter' ? 'matter' : 'matched';
    return { index, header, key, label, status };
  });
}

/* ── Values ──────────────────────────────────────────────────────────────── */

const MONTHS = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, SEPT: 9, OCT: 10, NOV: 11, DEC: 12 };
const pad = (n) => String(n).padStart(2, '0');
const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
const isRealDate = (y, m, d) => y >= 1900 && y <= 2200 && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
const iso = (y, m, d) => (isRealDate(y, m, d) ? `${y}-${pad(m)}-${pad(d)}` : null);
const fullYear = (y) => (y < 100 ? (y < 70 ? 2000 + y : 1900 + y) : y);

/**
 * A date as the firm may have typed it, to `YYYY-MM-DD`; null if it is not one.
 * Indian day-first order: 05/03/2021 is 5 March. Excel serial numbers (what a
 * date cell reads as) are converted too.
 */
export function normalizeDate(raw) {
  if (raw == null || raw === '') return null;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw.toISOString().slice(0, 10);
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    // Excel's day 1 is 1900-01-01; counting from 1899-12-30 absorbs its fake
    // 29 Feb 1900, so every serial after 60 (all real data) lands right.
    if (raw < 1 || raw > 2958465) return null;
    const ms = Date.UTC(1899, 11, 30) + Math.floor(raw) * 86400000;
    return new Date(ms).toISOString().slice(0, 10);
  }
  const s = String(raw).trim();
  let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s].*)?$/);
  if (m) return iso(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[-/.\s](\d{1,2})[-/.\s](\d{2}|\d{4})$/);
  if (m) return iso(fullYear(+m[3]), +m[2], +m[1]);
  m = s.match(/^(\d{1,2})(?:st|nd|rd|th)?[-/.\s]+([A-Za-z]{3,9})[-/.,\s]+(\d{2}|\d{4})$/);
  if (m) {
    const mon = MONTHS[m[2].slice(0, 4).toUpperCase()] ?? MONTHS[m[2].slice(0, 3).toUpperCase()];
    return mon ? iso(fullYear(+m[3]), mon, +m[1]) : null;
  }
  if (/^\d+(\.\d+)?$/.test(s)) return normalizeDate(Number(s));
  return null;
}

const stripTags = (s) => String(s).replace(/<[^>]*>/g, '');
const MAX_LEN = { text: 500, longtext: 5000, select: 200, image: 200, date: 100, number: 100 };

/**
 * One cell, cleaned for its field. Returns { value, warning? }: a value that
 * does not fit the type (a date column holding "Proposed to be used") is KEPT as
 * text with a warning — the firm's data is never dropped for being untidy.
 * Empty → null (the field is cleared).
 */
export function normalizeValue(field, raw) {
  if (raw == null) return { value: null };
  if (typeof raw === 'boolean') raw = raw ? 'Yes' : 'No';
  if (typeof raw === 'string' && raw.trim() === '') return { value: null };
  const type = field.type;
  if (type === 'computed') return { value: null, warning: 'calculated' };

  if (type === 'number') {
    if (typeof raw === 'number' && Number.isFinite(raw)) return { value: raw };
    const n = Number(String(raw).replace(/[₹,\s]/g, ''));
    if (String(raw).trim() && Number.isFinite(n)) return { value: n };
    return { value: stripTags(raw).trim().slice(0, MAX_LEN.number), warning: `"${field.label}" expects a number` };
  }
  if (type === 'date') {
    const d = normalizeDate(raw);
    if (d) return { value: d };
    return { value: stripTags(raw).trim().slice(0, MAX_LEN.date), warning: `"${field.label}" expects a date` };
  }
  if (type === 'matter') {
    const id = String(raw).trim();
    return /^[A-Za-z0-9_-]{1,128}$/.test(id) ? { value: id } : { value: null, warning: 'not a matter id' };
  }
  const text = stripTags(typeof raw === 'number' ? String(raw) : raw).trim().slice(0, MAX_LEN[type] ?? MAX_LEN.text);
  if (!text) return { value: null };
  if (type === 'select' && Array.isArray(field.options)) {
    const hit = field.options.find((o) => o.toLowerCase() === text.toLowerCase());
    return { value: hit ?? text };
  }
  return { value: text };
}

/** The upsert key of a record: its key fields, normalised, or null if any is blank. */
export function recordKeyFor(keyFields, values) {
  if (!keyFields?.length) return null;
  const parts = keyFields.map((k) => String(values?.[k] ?? '').toUpperCase().replace(/\s+/g, ''));
  return parts.every(Boolean) ? parts.join('|') : null;
}

/* ── Computed dates ──────────────────────────────────────────────────────── */

/**
 * `YYYY-MM-DD` plus years/months/days. A day that does not exist in the target
 * month is pulled back to the month's last day: 29 Feb 2016 + 9 years is
 * 28 Feb 2025, 31 Aug + 6 months is 28/29 Feb.
 */
export function addPeriod(isoDate, { years = 0, months = 0, days = 0 } = {}) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate ?? ''));
  if (!m) return null;
  const total = (+m[1]) * 12 + (+m[2] - 1) + years * 12 + months;
  const y = Math.floor(total / 12);
  const mo = (total % 12) + 1;
  const d = Math.min(+m[3], daysInMonth(y, mo));
  const ms = Date.UTC(y, mo - 1, d) + days * 86400000;
  return new Date(ms).toISOString().slice(0, 10);
}

/** Every computed field of a record, from its stored values. */
export function computeValues(columns, values = {}) {
  const out = {};
  for (const col of columns) {
    if (col.type !== 'computed' || !col.compute) continue;
    const base = col.compute.from.map((k) => normalizeDate(values?.[k])).find(Boolean);
    out[col.key] = base ? addPeriod(base, col.compute.add) : null;
  }
  return out;
}

/* ── Column edits (admin) ───────────────────────────────────────────────── */

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 30) || 'column';

/**
 * Apply an admin's column list to a book's stored config for one sheet.
 * - A column with a known field key is kept/renamed/hidden/re-ordered (or, if
 *   the field is on another report of the book, added to this one).
 * - A column without a key is a NEW field: `c_<slug>`, unique in the book.
 * - A built-in column left out is kept HIDDEN, never dropped — its values stay
 *   and it can be shown again. A column the firm added and then deleted leaves
 *   the sheet, but its field stays registered so its stored values are never
 *   reused by a different column.
 * Returns the next config document (pure; the caller saves it).
 */
export function applyColumnEdit(sheetKey, config = {}, edit = {}) {
  const sheet = SHEETS[sheetKey];
  if (!sheet) throw httpError(404, 'Unknown worksheet');
  const current = resolveSheet(sheetKey, config);
  const fields = bookFields(sheet.book, config);
  const byKey = new Map(fields.map((fd) => [fd.key, fd]));
  const customFields = [...(config.customFields ?? [])];
  const optionOverrides = { ...(config.optionOverrides ?? {}) };
  const cols = Array.isArray(edit.columns) ? edit.columns : null;
  if (!cols || cols.length === 0 || cols.length > 80) throw httpError(400, 'A sheet needs between 1 and 80 columns.');

  const next = [];
  const seen = new Set();
  for (const col of cols) {
    const label = stripTags(col?.label ?? '').trim().slice(0, 80);
    if (!label) throw httpError(400, 'Every column needs a name.');
    let key = col?.key ? String(col.key) : '';
    if (key) {
      const fd = byKey.get(key);
      if (!fd) throw httpError(400, `Unknown column "${key}".`);
      // The firm may change the options of a select it added here; every
      // select's options (built-in too) are also editable under Edit dropdowns.
      if (!fd.builtIn && fd.type === 'select' && Array.isArray(col.options)) {
        const i = customFields.findIndex((cf) => cf.key === key);
        const options = cleanOptions(col.options);
        if (i >= 0) customFields[i] = { ...customFields[i], options };
        optionOverrides[key] = options;
      }
    } else {
      const type = col?.type ?? 'text';
      if (!ADDABLE_TYPES.includes(type)) throw httpError(400, `A new column cannot be of type "${type}".`);
      const base = `c_${slug(label)}`;
      key = base;
      let n = 2;
      while (byKey.has(key)) { key = `${base}_${n}`; n += 1; }
      const fd = { key, label, type, ...(type === 'select' ? { options: cleanOptions(col.options) } : {}) };
      customFields.push(fd);
      byKey.set(key, fd);
    }
    if (seen.has(key)) continue;
    seen.add(key);
    next.push({ key, label, hidden: !!col.hidden });
  }
  // Built-in columns of this sheet that were left out stay, hidden.
  for (const old of current.columns) {
    if (!seen.has(old.key) && old.builtIn) next.push({ key: old.key, label: old.label, hidden: true });
  }
  if (!next.some((col) => !col.hidden)) throw httpError(400, 'At least one column must stay visible.');

  const sheets = { ...(config.sheets ?? {}) };
  const linked = Array.isArray(edit.linkedServices)
    ? [...new Set(edit.linkedServices.map((s) => String(s).trim()).filter((s) => /^[a-z0-9_-]{1,80}$/i.test(s)))].slice(0, 30)
    : current.linkedServices;
  sheets[sheetKey] = { columns: next, linkedServices: linked };
  return { customFields, sheets, optionOverrides };
}

export const MAX_OPTIONS = 200;
export const MAX_OPTION_LENGTH = 80;

/** Trimmed, tag-free, de-duplicated (case-insensitively), in the order given. */
export function cleanOptions(options) {
  const out = [];
  for (const o of Array.isArray(options) ? options : []) {
    const v = stripTags(o).trim().slice(0, MAX_OPTION_LENGTH);
    if (v && !out.some((x) => x.toLowerCase() === v.toLowerCase())) out.push(v);
  }
  return out.slice(0, MAX_OPTIONS);
}

/* ── Dropdown options (staff) ───────────────────────────────────────────── */

/**
 * #280 / #279 — staff (admin, manager, team member) add, rename and remove the
 * options of a choice-list column. The whole list is sent; it replaces the
 * field's options for every sheet of the book. Records keep the value they
 * hold: a renamed or removed option stays on the rows that use it (shown as it
 * is) until someone picks another. Returns `{ optionOverrides }` (pure; the
 * caller saves it with a merge).
 */
export function applyOptionsEdit(sheetKey, config = {}, fieldKey, options) {
  const sheet = SHEETS[sheetKey];
  if (!sheet) throw httpError(404, 'Unknown worksheet');
  const fd = bookFields(sheet.book, config).find((x) => x.key === fieldKey);
  if (!fd) throw httpError(404, 'Unknown column');
  if (fd.type !== 'select') throw httpError(400, `"${fd.label}" is not a dropdown column.`);
  if (!Array.isArray(options)) throw httpError(400, 'Send the list of options.');
  return { optionOverrides: { [fieldKey]: cleanOptions(options) } };
}

/* ── Record writes ──────────────────────────────────────────────────────── */

/**
 * Clean the values of a manual edit against the book's fields. Unlike an
 * upload, a manual edit that does not fit its type is REFUSED (the person is
 * right there to correct it). Computed fields cannot be written.
 */
export function cleanRecordValues(fields, values) {
  const byKey = new Map(fields.map((fd) => [fd.key, fd]));
  const out = {};
  for (const [key, raw] of Object.entries(values ?? {})) {
    const fd = byKey.get(key);
    if (!fd) throw httpError(400, `Unknown column "${key}".`);
    if (fd.type === 'computed') throw httpError(400, `"${fd.label}" is calculated and cannot be typed.`);
    const { value, warning } = normalizeValue(fd, raw);
    if (warning && (fd.type === 'number' || fd.type === 'matter')) throw httpError(400, `${warning}.`);
    if (warning && fd.type === 'date') throw httpError(400, `${warning} — use the date picker.`);
    out[key] = value;
  }
  return out;
}

/* ── Upload planning ────────────────────────────────────────────────────── */

const MAX_WARNINGS = 50;
/** Headings that mean "row number" in the firm's files (normalised). */
const SERIAL_HEADERS = new Set(['SLNO', 'SNO', 'SRNO', 'SERIALNO', 'SERIALNUMBER', 'SL']);

/**
 * What an upload WILL do, before anything is written (the dry run), and the
 * exact writes to make when it is applied.
 *
 * - Rows are matched to existing records by the book's key (Application No. for
 *   trademarks): a match is UPDATED, anything else is ADDED.
 * - Only cells with a value are written. A blank cell never clears what the
 *   portal already holds — "existing data stays intact".
 * - A key repeated in the file is merged into one record (later cells win).
 * - Unknown headers are reported, never silently dropped; calculated columns
 *   in the file are ignored (the portal calculates them).
 *
 * `existingByKey`: Map(recordKey → { id, values }) for the keys in this file.
 * `startRow`: the sheet row number of rows[0], for warnings.
 */
export function planImport({ sheet, fields, headers, rows, existingByKey = new Map(), startRow = 2 }) {
  // The sheet's visible columns are tried first; then every other field of the
  // book (hidden here, or shown only on another report) with all its headings.
  const visible = sheet.columns.filter((col) => !col.hidden);
  const others = fields
    .filter((fd) => !visible.some((col) => col.key === fd.key))
    .map((fd) => ({ ...fd, aliases: [...(fd.aliases ?? []), ...bookHeadings(sheet.book, fd.key)] }));
  const mapping = matchHeaders(headers, visible, others).map((m) => {
    // The firm's "Sl. No." is the row number: recognised, never stored.
    if (sheet.serial && m.status === 'unknown' && SERIAL_HEADERS.has(normalizeHeader(m.header))) return { ...m, status: 'serial' };
    return m.status === 'matched' && !visible.some((col) => col.key === m.key) ? { ...m, notShown: true } : m;
  });
  const byKey = new Map(fields.map((fd) => [fd.key, fd]));
  const writable = mapping.filter((m) => m.status === 'matched');
  const warnings = [];
  const creates = [];
  const updates = new Map(); // id → { id, key, values, changed }
  const pendingByKey = new Map(); // key → create entry
  let keyless = 0;
  let duplicatesInFile = 0;
  let emptyRows = 0;

  rows.forEach((row, i) => {
    const values = {};
    for (const m of writable) {
      const { value, warning } = normalizeValue(byKey.get(m.key), row?.[m.index]);
      if (value == null) continue;
      values[m.key] = value;
      if (warning && warnings.length < MAX_WARNINGS) warnings.push({ row: startRow + i, column: m.header, message: warning });
    }
    if (Object.keys(values).length === 0) { emptyRows += 1; return; }
    const key = recordKeyFor(sheet.recordKey, values);
    if (key && existingByKey.has(key)) {
      const ex = existingByKey.get(key);
      const prev = updates.get(ex.id);
      if (prev) duplicatesInFile += 1;
      const merged = { ...(prev?.values ?? {}), ...values };
      const changed = Object.entries(merged).some(([k, v]) => ex.values?.[k] !== v);
      updates.set(ex.id, { id: ex.id, key, values: merged, changed, addsSheet: !(ex.sheets ?? []).includes(sheet.key) });
      return;
    }
    if (key && pendingByKey.has(key)) {
      duplicatesInFile += 1;
      Object.assign(pendingByKey.get(key).values, values);
      return;
    }
    const entry = { key, values };
    if (key) pendingByKey.set(key, entry); else keyless += 1;
    creates.push(entry);
  });

  const upd = [...updates.values()];
  return {
    columns: mapping,
    unknownColumns: mapping.filter((m) => m.status === 'unknown').map((m) => m.header),
    ignoredColumns: mapping.filter((m) => ['computed', 'matter', 'duplicate', 'serial'].includes(m.status)).map((m) => ({ header: m.header, reason: m.status })),
    creates,
    updates: upd,
    summary: {
      newRows: creates.length,
      updatedRows: upd.filter((u) => u.changed || u.addsSheet).length,
      unchangedRows: upd.filter((u) => !u.changed && !u.addsSheet).length,
      keylessRows: keyless,
      duplicatesInFile,
      emptyRows,
    },
    newKeys: creates.map((cr) => cr.key).filter(Boolean),
    warnings,
  };
}

/* ── Reminders (KYC) ────────────────────────────────────────────────────── */

/** Whole days from `fromIso` to `toIso` (negative when `toIso` is earlier). */
export function daysBetween(fromIso, toIso) {
  const a = Date.parse(`${fromIso}T00:00:00Z`);
  const b = Date.parse(`${toIso}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((b - a) / 86400000);
}

/** How long after the due date the "on the day" reminder may still go out (no traffic, no sweep). */
export const OVERDUE_GRACE_DAYS = 30;

/**
 * Which reminder, if any, is due now. Milestones are days before the due date
 * (30, 7, 0). Only the MOST URGENT milestone reached is sent: if nobody used the
 * portal between day 30 and day 7, the firm hears "due in 7 days" once — not a
 * stale "30 days" followed by the real one. Every milestone at or above the one
 * sent is marked done, so each fires at most once per due date.
 *
 * `sent`: the record's `remindersSent` map, keyed `${due}:${milestone}`.
 * Returns { milestone, daysLeft, markKeys } or null.
 */
export function pickReminder({ due, today, milestones = [30, 7, 0], sent = {} }) {
  if (!due || !today) return null;
  const daysLeft = daysBetween(today, due);
  if (daysLeft == null || daysLeft < -OVERDUE_GRACE_DAYS) return null;
  const reached = [...milestones].sort((a, b) => a - b).find((m) => daysLeft <= m);
  if (reached == null) return null;
  if (sent?.[`${due}:${reached}`]) return null;
  return {
    milestone: reached,
    daysLeft,
    markKeys: milestones.filter((m) => m >= reached).map((m) => `${due}:${m}`),
  };
}

/** The notification wording for a reminder. */
export function reminderText({ subject, daysLeft, due, describe }) {
  const when = new Date(`${due}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const title = daysLeft > 0 ? `${subject} due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
    : daysLeft === 0 ? `${subject} due today` : `${subject} overdue`;
  const who = describe.filter(Boolean).join(' · ');
  return { title, message: `${who ? `${who} — ` : ''}${subject} ${daysLeft < 0 ? 'was' : 'is'} due on ${when}.` };
}

/** Today's date in India, `YYYY-MM-DD` — the firm's calendar, not the server's. */
export const indiaToday = (now = Date.now()) => new Date(now + 5.5 * 3600000).toISOString().slice(0, 10);

/* ── Pagination cursor ──────────────────────────────────────────────────── */

export const encodeCursor = (createdAt, id) => Buffer.from(JSON.stringify([createdAt, id])).toString('base64url');
export function decodeCursor(cursor) {
  try {
    const v = JSON.parse(Buffer.from(String(cursor), 'base64url').toString('utf8'));
    return Array.isArray(v) && v.length === 2 && typeof v[0] === 'string' && typeof v[1] === 'string' ? v : null;
  } catch { return null; }
}
