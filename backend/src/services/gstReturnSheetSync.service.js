/**
 * #279 — keeps the GST Return Filing sheet in step with the GST return matters.
 * The rules (what a matter's row holds, last change wins) are pure, in
 * gstReturnSheet.service.js; this file only reads and writes.
 *
 * WHEN. "Due on read": opening the sheet (its first page) runs the sync before
 * the rows are read, at most every 15 seconds, under a lock — the pattern of
 * the KYC reminders and the GST sweep. No trigger is added to the matter code:
 * every change to a matter (a task completed, approval, stop, reassignment)
 * already moves the matter's `updatedAt`, and that is what is read.
 *
 * BOUNDED. A watermark `(updatedAt, id)` in `system/worksheetSync_<book>` means
 * each run reads only matters of the linked services changed since the last
 * run, in pages of 200, at most 3 pages per run (the next opening continues).
 * Per matter: its steps, plus one batched read of the clients and assignees and
 * of the rows already linked to those matters. Never a scan of `tasks` or of
 * the sheet. Changing the linked services restarts the watermark.
 *
 * ROWS. A matter's row is found by `sourceMatterId`; failing that, a row typed
 * or uploaded by staff for the same GSTIN and period (and not linked to another
 * matter) is ADOPTED instead of adding a duplicate; failing that, a row is
 * created in Monthly or Quarterly. Cells are written one by one
 * (`values.<field>`), so a person editing another cell of the same row at the
 * same moment is not overwritten.
 */
import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import { getDb } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import { BOOKS, SHEETS } from '../config/worksheetDefinitions.js';
import { resolveSheet, sheetRecordKey } from './worksheetEngine.service.js';
import { deriveRow, mergeDerived, withAuthoredOrder } from './gstReturnSheet.service.js';
import { getCompiledById } from './workflowDefinitions.service.js';

const RECORDS = 'worksheetRecords';
const PAGE = 200;
const MAX_PAGES = 3;
const LOCK_MS = 2 * 60 * 1000;
const RECENCY_MS = 15 * 1000;
const ACTOR = 'system:gst-return-sheet';
const RULES_VERSION = 2;

const chunks = (list, n) => {
  const out = [];
  for (let i = 0; i < list.length; i += n) out.push(list.slice(i, i + n));
  return out;
};
const nameOf = (u) => u?.name || u?.fullName || u?.email || null;

/**
 * Bring the book's rows up to date with its matters. Never throws for a single
 * bad matter; returns { scanned, created, updated } or { skipped }.
 */
export async function syncSheetFromMatters({ bookKey, config = {}, force = false, now = Date.now() }) {
  const book = BOOKS[bookKey];
  if (!book?.sync) return { skipped: 'not_synced' };
  const db = getDb();
  const sheets = Object.values(SHEETS).filter((s) => s.book === bookKey).map((s) => ({ def: s, resolved: resolveSheet(s.key, config) }));
  const sheetFor = (frequency) => (sheets.find((s) => s.def.frequency === frequency) ?? sheets[0]).resolved;
  const linked = [...new Set(sheets.flatMap((s) => s.resolved.linkedServices))].sort().slice(0, 30);
  // RULES_VERSION is part of the key: when the derivation rules change (#279 fix of
  // 2026-11-14: GSTR-1 / GSTR-3B dates), the watermark restarts once and every GST
  // matter's row is re-derived, so rows synced under the old rules correct themselves.
  const servicesKey = `${linked.join(',')}#r${RULES_VERSION}`;

  const stateRef = db.collection('system').doc(`worksheetSync_${bookKey}`);
  const claim = await db.runTransaction(async (tx) => {
    const snap = await tx.get(stateRef);
    const d = snap.exists ? snap.data() : {};
    if (d.lockedAtMs && now - d.lockedAtMs < LOCK_MS) return { skip: 'locked' };
    if (!force && d.lastRunAtMs && now - d.lastRunAtMs < RECENCY_MS && d.servicesKey === servicesKey) return { skip: 'recent' };
    tx.set(stateRef, { lockedAtMs: now }, { merge: true });
    return { cursor: d.servicesKey === servicesKey ? d.cursor ?? null : null };
  });
  if (claim.skip) return { skipped: claim.skip };

  const totals = { scanned: 0, created: 0, updated: 0 };
  let cursor = claim.cursor;
  try {
    if (!linked.length) return totals;
    for (let page = 0; page < MAX_PAGES; page += 1) {
      let q = db.collection('tasks').where('serviceKey', 'in', linked)
        .orderBy('updatedAt').orderBy(FieldPath.documentId()).limit(PAGE);
      if (cursor?.updatedAt && cursor?.id) q = q.startAfter(cursor.updatedAt, cursor.id);
      let snap;
      try {
        snap = await q.get();
      } catch (err) {
        // The (serviceKey, updatedAt) index is deployed with the release. Until
        // it is, re-derive the newest matters through the index the matter
        // picker already uses, so the sheet works, bounded, and say why.
        if (err?.code !== 9 && !/index/i.test(err?.message ?? '')) throw err;
        logger.warn({ book: bookKey }, '#279 tasks (serviceKey, updatedAt) index missing — syncing the newest matters only');
        const recent = await db.collection('tasks').where('serviceKey', 'in', linked).orderBy('createdAt', 'desc').limit(PAGE).get();
        const r = await syncPage(db, bookKey, book, sheetFor, recent.docs);
        totals.scanned += recent.size; totals.created += r.created; totals.updated += r.updated;
        break;
      }
      if (snap.empty) break;
      const r = await syncPage(db, bookKey, book, sheetFor, snap.docs);
      totals.scanned += snap.size;
      totals.created += r.created;
      totals.updated += r.updated;
      const last = snap.docs[snap.docs.length - 1];
      cursor = { updatedAt: last.data().updatedAt, id: last.id };
      await stateRef.set({ cursor, servicesKey }, { merge: true });
      if (snap.size < PAGE) break;
    }
    if (totals.created || totals.updated) logger.info({ book: bookKey, ...totals }, '#279 sheet synced from matters');
    return totals;
  } finally {
    await stateRef.set({ lockedAtMs: null, lastRunAtMs: Date.now(), servicesKey }, { merge: true });
  }
}

async function readUsers(db, uids) {
  const out = new Map();
  for (const part of chunks([...new Set(uids.filter(Boolean))], 100)) {
    const snaps = await db.getAll(...part.map((uid) => db.collection('users').doc(uid)));
    for (const s of snaps) if (s.exists) out.set(s.id, s.data());
  }
  return out;
}

async function readSteps(db, taskIds) {
  const out = new Map();
  for (const part of chunks(taskIds, 25)) {
    const snaps = await Promise.all(part.map((id) => db.collection('tasks').doc(id).collection('steps').get()));
    part.forEach((id, i) => out.set(id, snaps[i].docs.map((d) => d.data())));
  }
  return out;
}

/** Records of the book whose `field` is one of `values`, as Map(value → [doc]). */
async function recordsWhereIn(db, bookKey, field, values) {
  const out = new Map();
  for (const part of chunks([...new Set(values.filter(Boolean))], 30)) {
    const snap = await db.collection(RECORDS).where('book', '==', bookKey).where(field, 'in', part).get();
    for (const d of snap.docs) {
      const k = d.data()[field];
      out.set(k, [...(out.get(k) ?? []), d]);
    }
  }
  return out;
}

async function syncPage(db, bookKey, book, sheetFor, docs) {
  const tasks = docs.map((d) => ({ id: d.id, ...d.data() }));
  const clients = await readUsers(db, tasks.map((t) => t.clientUid));
  const steps = await readSteps(db, tasks.map((t) => t.id));
  const assignees = tasks.map((t) => (steps.get(t.id) ?? []).find((s) => s.stepNumber === t.currentStepNumber)?.assignedTo);
  const people = await readUsers(db, assignees.filter((uid) => uid && !clients.has(uid)));
  const names = new Map([...clients, ...people].map(([uid, u]) => [uid, nameOf(u)]));

  const linkedRows = await recordsWhereIn(db, bookKey, 'sourceMatterId', tasks.map((t) => t.id));
  // #279: tasks are matched in the service's authored order (step numbers are identity only).
  const defSteps = new Map();
  await Promise.all([...new Set(tasks.map((t) => t.workflowDefinitionId).filter(Boolean))].map(async (id) => {
    try { defSteps.set(id, (await getCompiledById(id))?.definition?.steps ?? null); } catch { /* step-number order */ }
  }));
  const plans = tasks.map((task) => {
    const ordered = withAuthoredOrder(steps.get(task.id) ?? [], defSteps.get(task.workflowDefinitionId));
    const { frequency, values } = deriveRow({ task, client: clients.get(task.clientUid) ?? null, steps: ordered, names });
    const sheet = sheetFor(frequency);
    return { task, sheet, next: values, row: linkedRows.get(task.id)?.[0] ?? null };
  });

  // A row typed or uploaded for the same GSTIN + period is adopted, not duplicated.
  const unlinked = plans.filter((p) => !p.row);
  const byKey = await recordsWhereIn(db, bookKey, 'recordKey', unlinked.map((p) => sheetRecordKey(p.sheet, p.next)));
  const adopted = new Set();
  for (const p of unlinked) {
    const key = sheetRecordKey(p.sheet, p.next);
    const free = (byKey.get(key) ?? []).find((d) => !d.data().sourceMatterId && !adopted.has(d.id));
    if (free) { p.row = free; adopted.add(free.id); }
  }

  // Merge, then make sure no two rows end up with the same key.
  for (const p of plans) {
    const d = p.row?.data();
    p.merge = mergeDerived({ values: d?.values ?? {}, derived: d?.derived }, p.next);
    p.key = sheetRecordKey(p.sheet, p.merge.values);
  }
  const holders = await recordsWhereIn(db, bookKey, 'recordKey', plans.map((p) => p.key));
  const claimed = new Set();
  for (const p of plans) {
    if (!p.key) continue;
    const others = (holders.get(p.key) ?? []).filter((d) => d.id !== p.row?.id);
    if (others.length || claimed.has(p.key)) p.key = null; else claimed.add(p.key);
  }

  const nowIso = new Date().toISOString();
  let batch = db.batch();
  let ops = 0;
  let created = 0;
  let updated = 0;
  for (const p of plans) {
    if (!p.row) {
      const values = Object.fromEntries(Object.entries(p.merge.values).filter(([, v]) => v != null));
      batch.set(db.collection(RECORDS).doc(), {
        module: book.module, book: bookKey, sheets: [p.sheet.key], values, derived: p.merge.derived, recordKey: p.key,
        sourceMatterId: p.task.id, images: {}, reminderDue: null, remindersSent: {},
        createdAt: p.task.createdAt ?? nowIso, createdBy: ACTOR, updatedAt: nowIso, updatedBy: ACTOR, source: 'matter',
      });
      created += 1;
    } else {
      const d = p.row.data();
      const moved = !(d.sheets ?? []).includes(p.sheet.key) || (d.sheets ?? []).length !== 1;
      const relinked = d.sourceMatterId !== p.task.id;
      if (!p.merge.changed && !moved && !relinked && (d.recordKey ?? null) === p.key) continue;
      const update = { derived: p.merge.derived, recordKey: p.key, sourceMatterId: p.task.id, updatedAt: nowIso, updatedBy: ACTOR };
      if (moved) update.sheets = [p.sheet.key];
      for (const [k, v] of Object.entries(p.merge.set)) update[`values.${k}`] = v == null ? FieldValue.delete() : v;
      batch.update(p.row.ref, update);
      updated += 1;
    }
    ops += 1;
    if (ops >= 400) { await batch.commit(); batch = db.batch(); ops = 0; }
  }
  if (ops) await batch.commit();
  return { created, updated };
}
