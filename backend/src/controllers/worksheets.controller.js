import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import sharp from 'sharp';
import { getDb, getBucket } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { BOOKS, SHEETS, MODULES } from '../config/worksheetDefinitions.js';
import {
  resolveSheet, bookFields, computeValues, cleanRecordValues, recordKeyFor, applyColumnEdit,
  planImport, encodeCursor, decodeCursor,
} from '../services/worksheetEngine.service.js';

/**
 * #210 / #217 — worksheets: the trademark reports and the company worksheets,
 * one engine for both (design: architecture.md §Worksheets).
 *
 * Storage:
 *   worksheetRecords/{id}   { module, book, sheets: [sheetKey], values: {field: value},
 *                             recordKey, images: {field: {objectPath, contentType, updatedAt}},
 *                             reminderDue, remindersSent, createdAt, createdBy, updatedAt, updatedBy }
 *   worksheetConfig/{book}  the firm's column edits (see worksheetEngine.service.js)
 *   Storage: worksheets/{book}/{recordId}/{field}-{ts}.webp  (streamed back, never a signed URL)
 *
 * Every list is a bounded page; the Portal pages through a sheet and filters,
 * sorts and searches on the client (Excel-style), the way the Master Sheet does.
 */

export const RECORDS = 'worksheetRecords';
const CONFIG = 'worksheetConfig';
const MAX_MATTER_SCAN = 200;

const serverError = (res, err, ctx) => {
  logger.error({ err }, ctx);
  if (!res.headersSent) res.status(500).json({ message: 'Internal server error' });
};
const sendKnown = (res, err, ctx) => {
  if (err?.status && err.status < 500) {
    return res.status(err.status).json({ message: err.message, ...(err.code ? { code: err.code } : {}), ...(err.body ?? {}) });
  }
  return serverError(res, err, ctx);
};
const httpError = (status, message, extra = {}) => Object.assign(new Error(message), { status, ...extra });

async function loadConfig(db, book) {
  const snap = await db.collection(CONFIG).doc(book).get();
  return snap.exists ? snap.data() : {};
}

/** The sheet named in the URL, resolved against the firm's edits, or a 404. */
async function sheetContext(req, res) {
  const key = req.params.sheet;
  if (!Object.hasOwn(SHEETS, key)) { res.status(404).json({ message: 'Unknown worksheet' }); return null; }
  const db = getDb();
  const config = await loadConfig(db, SHEETS[key].book);
  return { db, config, sheet: resolveSheet(key, config), fields: bookFields(SHEETS[key].book, config) };
}

/** A record of THIS sheet's book, or a 404 (an id from another book never resolves here). */
async function loadRecord(db, sheet, id, tx) {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(String(id))) return null;
  const ref = db.collection(RECORDS).doc(id);
  const snap = tx ? await tx.get(ref) : await ref.get();
  if (!snap.exists || snap.data().book !== sheet.book) return null;
  return { ref, snap, data: snap.data() };
}

const reminderDueFor = (bookKey, fields, values) => {
  const r = BOOKS[bookKey]?.reminder;
  return r ? computeValues(fields, values)[r.field] ?? null : null;
};

/** What the Portal receives for a record: stored values plus the calculated ones. */
function serialize(doc, fields) {
  const d = doc.data();
  const images = {};
  for (const [k, v] of Object.entries(d.images ?? {})) if (v?.objectPath) images[k] = { v: v.updatedAt ?? '' };
  return {
    id: doc.id,
    sheets: d.sheets ?? [],
    values: { ...(d.values ?? {}), ...computeValues(fields, d.values ?? {}) },
    images,
    createdAt: d.createdAt ?? null,
    updatedAt: d.updatedAt ?? null,
  };
}

function matterLabel(t) {
  return `${t.serviceName || t.serviceKey || 'Matter'} — ${t.clientName || 'Client'}${t.organisation ? ` (${t.organisation})` : ''}`;
}

/** Labels for the matters a page of records links to: one batched read. */
async function matterLabels(db, fields, records) {
  const keys = fields.filter((fd) => fd.type === 'matter').map((fd) => fd.key);
  const ids = [...new Set(records.flatMap((r) => keys.map((k) => r.values[k]).filter((v) => typeof v === 'string' && v)))];
  const out = {};
  for (let i = 0; i < ids.length; i += 100) {
    const snaps = await db.getAll(...ids.slice(i, i + 100).map((id) => db.collection('tasks').doc(id)));
    for (const s of snaps) if (s.exists) out[s.id] = { label: matterLabel(s.data()), status: s.data().status ?? null };
  }
  return out;
}

/** A matter typed into a record must exist and belong to one of the sheet's linked services. */
async function checkMatters(db, sheet, fields, values) {
  for (const fd of fields) {
    if (fd.type !== 'matter' || !values[fd.key]) continue;
    const t = await db.collection('tasks').doc(values[fd.key]).get();
    if (!t.exists) throw httpError(400, 'That matter no longer exists.');
    if (sheet.linkedServices.length && !sheet.linkedServices.includes(t.data().serviceKey)) {
      throw httpError(400, 'That matter is not one of the services linked to this sheet.');
    }
  }
}

function cleanMemberships(sheet, requested) {
  const allowed = new Set(sheet.memberships.map((m) => m.key));
  const list = [...new Set(requested)];
  if (list.some((k) => !allowed.has(k))) throw httpError(400, 'A record can only be added to reports of the same kind.');
  if (!list.length) throw httpError(400, 'A record must stay in at least one report.');
  return list;
}

const dropNulls = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && v !== ''));

/* ── Definitions ────────────────────────────────────────────────────────── */

// GET /api/worksheets/modules/:module — the dropdown and every sheet's columns.
export async function getModule(req, res) {
  try {
    if (!Object.hasOwn(MODULES, req.params.module)) return res.status(404).json({ message: 'Unknown module' });
    const mod = MODULES[req.params.module];
    const db = getDb();
    const books = [...new Set(mod.sheets.map((s) => SHEETS[s].book))];
    const snaps = await db.getAll(...books.map((b) => db.collection(CONFIG).doc(b)));
    const configs = Object.fromEntries(snaps.map((s) => [s.id, s.exists ? s.data() : {}]));
    const isAdmin = req.user.role === 'admin';
    res.json({
      module: { key: mod.key, label: mod.label },
      sheets: mod.sheets.map((s) => resolveSheet(s, configs[SHEETS[s].book])),
      // Everyone on the staff views and edits (firm, 29 Oct); columns and
      // deleting a record are the admin's.
      canEdit: true,
      canManageColumns: isAdmin,
      canDelete: isAdmin,
    });
  } catch (err) { serverError(res, err, 'getModule failed'); }
}

/* ── Records ────────────────────────────────────────────────────────────── */

// GET /api/worksheets/sheets/:sheet/records?limit&cursor — one page, oldest first.
export async function listRecords(req, res) {
  try {
    const ctx = await sheetContext(req, res); if (!ctx) return;
    const { db, sheet, fields } = ctx;
    const { limit, cursor } = req.query;
    let q = db.collection(RECORDS).where('sheets', 'array-contains', sheet.key)
      .orderBy('createdAt').orderBy(FieldPath.documentId()).limit(limit);
    if (cursor) {
      const c = decodeCursor(cursor);
      if (!c) return res.status(400).json({ message: 'Invalid cursor' });
      q = q.startAfter(c[0], c[1]);
    }
    const snap = await q.get();
    const data = snap.docs.map((d) => serialize(d, fields));
    const last = snap.docs[snap.docs.length - 1];
    res.json({
      data,
      matters: await matterLabels(db, fields, data),
      nextCursor: snap.docs.length === limit && last ? encodeCursor(last.data().createdAt ?? '', last.id) : null,
    });
  } catch (err) { serverError(res, err, 'listRecords failed'); }
}

// POST /api/worksheets/sheets/:sheet/records { values, sheets? }
export async function createRecord(req, res) {
  try {
    const ctx = await sheetContext(req, res); if (!ctx) return;
    const { db, sheet, fields } = ctx;
    const values = dropNulls(cleanRecordValues(fields, req.body.values));
    if (Object.keys(values).length === 0) return res.status(400).json({ message: 'Fill in at least one column.' });
    await checkMatters(db, sheet, fields, values);
    const sheets = cleanMemberships(sheet, [sheet.key, ...(req.body.sheets ?? [])]);
    const recordKey = recordKeyFor(sheet.recordKey, values);
    const now = new Date().toISOString();
    const ref = db.collection(RECORDS).doc();

    await db.runTransaction(async (tx) => {
      // The key (Application No. for a trademark) is unique within its book:
      // a second record would split one trademark's history in two.
      if (recordKey) {
        const dup = await tx.get(db.collection(RECORDS).where('book', '==', sheet.book).where('recordKey', '==', recordKey).limit(1));
        if (!dup.empty) {
          const ex = dup.docs[0];
          throw httpError(409, `A record with this ${sheet.recordKeyLabel} already exists.`, {
            code: 'DUPLICATE_KEY', body: { existingId: ex.id, existingSheets: ex.data().sheets ?? [] },
          });
        }
      }
      tx.set(ref, {
        module: sheet.module, book: sheet.book, sheets, values, recordKey,
        images: {}, reminderDue: reminderDueFor(sheet.book, fields, values), remindersSent: {},
        createdAt: now, createdBy: req.user.uid, updatedAt: now, updatedBy: req.user.uid,
      });
    });
    const saved = await ref.get();
    logger.info({ sheet: sheet.key, recordId: ref.id, actorUid: req.user.uid }, 'Worksheet record created');
    res.status(201).json(serialize(saved, fields));
  } catch (err) { sendKnown(res, err, 'createRecord failed'); }
}

// PATCH /api/worksheets/sheets/:sheet/records/:id { values?, sheets? }
export async function updateRecord(req, res) {
  try {
    const ctx = await sheetContext(req, res); if (!ctx) return;
    const { db, sheet, fields } = ctx;
    const patch = req.body.values ? cleanRecordValues(fields, req.body.values) : {};
    await checkMatters(db, sheet, fields, patch);
    const sheets = req.body.sheets ? cleanMemberships(sheet, req.body.sheets) : null;
    const now = new Date().toISOString();

    const ref = await db.runTransaction(async (tx) => {
      const rec = await loadRecord(db, sheet, req.params.id, tx);
      if (!rec) throw httpError(404, 'Record not found');
      // Merged inside the transaction so two people editing different cells
      // of the same row never overwrite each other.
      const values = dropNulls({ ...(rec.data.values ?? {}), ...patch });
      const recordKey = recordKeyFor(sheet.recordKey, values);
      if (recordKey && recordKey !== rec.data.recordKey) {
        const dup = await tx.get(db.collection(RECORDS).where('book', '==', sheet.book).where('recordKey', '==', recordKey).limit(2));
        if (dup.docs.some((d) => d.id !== rec.ref.id)) {
          throw httpError(409, `Another record already has this ${sheet.recordKeyLabel}.`, { code: 'DUPLICATE_KEY' });
        }
      }
      tx.update(rec.ref, {
        values, recordKey, reminderDue: reminderDueFor(sheet.book, fields, values),
        ...(sheets ? { sheets } : {}),
        updatedAt: now, updatedBy: req.user.uid,
      });
      return rec.ref;
    });
    const saved = await ref.get();
    const data = serialize(saved, fields);
    res.json({ ...data, matters: await matterLabels(db, fields, [data]) });
  } catch (err) { sendKnown(res, err, 'updateRecord failed'); }
}

// DELETE /api/worksheets/sheets/:sheet/records/:id — admin. Gone from every report.
export async function deleteRecord(req, res) {
  try {
    const ctx = await sheetContext(req, res); if (!ctx) return;
    const rec = await loadRecord(ctx.db, ctx.sheet, req.params.id);
    if (!rec) return res.status(404).json({ message: 'Record not found' });
    await rec.ref.delete();
    for (const img of Object.values(rec.data.images ?? {})) {
      if (img?.objectPath) await getBucket().file(img.objectPath).delete({ ignoreNotFound: true }).catch((err) => logger.warn({ err }, 'worksheet image cleanup failed'));
    }
    logger.info({ sheet: ctx.sheet.key, recordId: rec.ref.id, actorUid: req.user.uid }, 'Worksheet record deleted');
    res.json({ id: rec.ref.id, deleted: true });
  } catch (err) { serverError(res, err, 'deleteRecord failed'); }
}

/* ── Columns (admin) ────────────────────────────────────────────────────── */

// PUT /api/worksheets/sheets/:sheet/columns { columns, linkedServices? }
export async function putColumns(req, res) {
  try {
    const ctx = await sheetContext(req, res); if (!ctx) return;
    const next = applyColumnEdit(ctx.sheet.key, ctx.config, req.body);
    await ctx.db.collection(CONFIG).doc(ctx.sheet.book).set({
      ...next, updatedAt: new Date().toISOString(), updatedBy: req.user.uid,
    });
    logger.info({ sheet: ctx.sheet.key, actorUid: req.user.uid }, 'Worksheet columns updated');
    res.json(resolveSheet(ctx.sheet.key, next));
  } catch (err) { sendKnown(res, err, 'putColumns failed'); }
}

/* ── Excel upload ───────────────────────────────────────────────────────── */

// POST /api/worksheets/sheets/:sheet/import { headers, rows, startRow, apply }
// One batch of the file. `apply: false` is the dry run the page shows first.
export async function importRows(req, res) {
  try {
    const ctx = await sheetContext(req, res); if (!ctx) return;
    const { db, sheet, fields } = ctx;
    const { headers, rows, startRow, apply } = req.body;

    // Pass 1 finds the keys in this batch; pass 2 plans against what exists.
    const keys = [...new Set(planImport({ sheet, fields, headers, rows, startRow }).creates.map((cr) => cr.key).filter(Boolean))];
    const existingByKey = new Map();
    for (let i = 0; i < keys.length; i += 30) {
      const snap = await db.collection(RECORDS).where('book', '==', sheet.book).where('recordKey', 'in', keys.slice(i, i + 30)).get();
      for (const d of snap.docs) existingByKey.set(d.data().recordKey, { id: d.id, values: d.data().values ?? {}, sheets: d.data().sheets ?? [] });
    }
    const plan = planImport({ sheet, fields, headers, rows, existingByKey, startRow });
    const report = {
      columns: plan.columns,
      unknownColumns: plan.unknownColumns,
      ignoredColumns: plan.ignoredColumns,
      summary: plan.summary,
      newKeys: plan.newKeys,
      updatedKeys: plan.updates.filter((u) => u.changed || u.addsSheet).map((u) => u.key),
      warnings: plan.warnings,
    };
    if (!apply) return res.json({ ...report, applied: false });

    const baseMs = Date.now();
    const now = new Date(baseMs).toISOString();
    let batch = db.batch();
    let ops = 0;
    const flush = async () => { if (ops) { await batch.commit(); batch = db.batch(); ops = 0; } };
    // createdAt steps by a millisecond per row so the sheet keeps the file's order.
    for (const [i, cr] of plan.creates.entries()) {
      batch.set(db.collection(RECORDS).doc(), {
        module: sheet.module, book: sheet.book, sheets: [sheet.key], values: cr.values, recordKey: cr.key,
        images: {}, reminderDue: reminderDueFor(sheet.book, fields, cr.values), remindersSent: {},
        createdAt: new Date(baseMs + i).toISOString(), createdBy: req.user.uid, updatedAt: now, updatedBy: req.user.uid,
        source: 'excel',
      });
      ops += 1; if (ops >= 400) await flush();
    }
    for (const up of plan.updates) {
      if (!up.changed && !up.addsSheet) continue;
      const merged = { ...existingByKey.get(up.key).values, ...up.values };
      const update = { sheets: FieldValue.arrayUnion(sheet.key), reminderDue: reminderDueFor(sheet.book, fields, merged), updatedAt: now, updatedBy: req.user.uid };
      // Cell by cell: a value the file leaves blank is never cleared.
      for (const [k, v] of Object.entries(up.values)) update[`values.${k}`] = v;
      batch.update(db.collection(RECORDS).doc(up.id), update);
      ops += 1; if (ops >= 400) await flush();
    }
    await flush();
    logger.info({ sheet: sheet.key, actorUid: req.user.uid, ...plan.summary }, 'Worksheet Excel batch applied');
    res.json({ ...report, applied: true });
  } catch (err) { sendKnown(res, err, 'importRows failed'); }
}

/* ── Matter link ────────────────────────────────────────────────────────── */

// GET /api/worksheets/sheets/:sheet/matters?q= — matters of the linked services.
export async function matterOptions(req, res) {
  try {
    const ctx = await sheetContext(req, res); if (!ctx) return;
    const { db, sheet } = ctx;
    const linked = sheet.linkedServices;
    if (!linked.length) return res.json({ data: [], linkedServices: [] });
    const q = String(req.query.q ?? '').toLowerCase();
    const found = [];
    for (let i = 0; i < linked.length; i += 30) {
      const snap = await db.collection('tasks').where('serviceKey', 'in', linked.slice(i, i + 30))
        .orderBy('createdAt', 'desc').limit(MAX_MATTER_SCAN).get();
      found.push(...snap.docs);
    }
    const data = found
      .map((d) => ({ id: d.id, label: matterLabel(d.data()), status: d.data().status ?? null }))
      .filter((m) => !q || m.label.toLowerCase().includes(q) || m.id.toLowerCase().startsWith(q))
      .slice(0, 25);
    res.json({ data, linkedServices: linked });
  } catch (err) { serverError(res, err, 'matterOptions failed'); }
}

/* ── Images (logo) ──────────────────────────────────────────────────────── */

async function imageContext(req, res) {
  const ctx = await sheetContext(req, res); if (!ctx) return null;
  const fd = ctx.fields.find((x) => x.key === req.params.field);
  if (!fd || fd.type !== 'image') { res.status(404).json({ message: 'Unknown image column' }); return null; }
  const rec = await loadRecord(ctx.db, ctx.sheet, req.params.id);
  if (!rec) { res.status(404).json({ message: 'Record not found' }); return null; }
  return { ...ctx, field: fd, rec };
}

// POST /api/worksheets/sheets/:sheet/records/:id/images/:field  (multipart "file")
export async function uploadImage(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Choose a JPEG, PNG or WebP image.' });
    const ctx = await imageContext(req, res); if (!ctx) return;
    // Re-encoded, never stored as uploaded: strips metadata and anything that
    // is not a picture, and keeps every logo small enough for a table cell.
    let buffer;
    try {
      buffer = await sharp(req.file.buffer).rotate()
        .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 }).toBuffer();
    } catch {
      return res.status(400).json({ message: 'That file could not be read as an image.' });
    }
    const objectPath = `worksheets/${ctx.sheet.book}/${ctx.rec.ref.id}/${ctx.field.key}-${Date.now()}.webp`;
    await getBucket().file(objectPath).save(buffer, { contentType: 'image/webp', resumable: false });
    const old = ctx.rec.data.images?.[ctx.field.key]?.objectPath;
    const updatedAt = new Date().toISOString();
    await ctx.rec.ref.update({
      [`images.${ctx.field.key}`]: { objectPath, contentType: 'image/webp', updatedAt },
      updatedAt, updatedBy: req.user.uid,
    });
    if (old && old !== objectPath) await getBucket().file(old).delete({ ignoreNotFound: true }).catch(() => {});
    res.status(201).json({ field: ctx.field.key, v: updatedAt });
  } catch (err) { serverError(res, err, 'uploadImage failed'); }
}

// GET /api/worksheets/sheets/:sheet/records/:id/images/:field — streamed, never a signed URL.
export async function getImage(req, res) {
  try {
    const ctx = await imageContext(req, res); if (!ctx) return;
    const img = ctx.rec.data.images?.[ctx.field.key];
    if (!img?.objectPath) return res.status(404).json({ message: 'No image' });
    const file = getBucket().file(img.objectPath);
    const [exists] = await file.exists();
    if (!exists) return res.status(404).json({ message: 'No image' });
    res.setHeader('Content-Type', img.contentType || 'image/webp');
    res.setHeader('Cache-Control', 'private, max-age=300');
    const stream = file.createReadStream();
    stream.on('error', (err) => {
      logger.error({ err }, 'worksheet image stream failed');
      if (!res.headersSent) res.status(500).json({ message: 'Internal server error' }); else res.destroy();
    });
    stream.pipe(res);
  } catch (err) { serverError(res, err, 'getImage failed'); }
}

// DELETE /api/worksheets/sheets/:sheet/records/:id/images/:field
export async function deleteImage(req, res) {
  try {
    const ctx = await imageContext(req, res); if (!ctx) return;
    const img = ctx.rec.data.images?.[ctx.field.key];
    const updatedAt = new Date().toISOString();
    await ctx.rec.ref.update({ [`images.${ctx.field.key}`]: FieldValue.delete(), updatedAt, updatedBy: req.user.uid });
    if (img?.objectPath) await getBucket().file(img.objectPath).delete({ ignoreNotFound: true }).catch(() => {});
    res.json({ field: ctx.field.key, deleted: true });
  } catch (err) { serverError(res, err, 'deleteImage failed'); }
}
