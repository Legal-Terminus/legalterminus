import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import {
  CLIENT_DATABASE_COLLECTION,
  CLIENT_DATABASE_FIELDS,
  isDatabaseClient,
  mergeRecord,
  matchesSearch,
  sortRows,
} from '../services/clientDatabase.service.js';

/**
 * LT #205 — the Client Database API. Admin + manager only (route guard).
 *
 * Reads the clients and the database's own records and merges them per field
 * (see clientDatabase.service.js). Writes go ONLY to `clientDatabase/{uid}` —
 * never to the client's `users` doc — so this screen cannot change anyone's
 * login email or profile.
 *
 * Cost note: like `GET /api/clients`, the list filters clients in Firestore
 * (`role == client`) and searches, orders and pages in memory, because the
 * search runs over MERGED values that exist in no single document. That is two
 * queries per request whose size is the firm's client count (tens to hundreds),
 * never the matters or anything that grows with work done.
 */

async function loadRows() {
  const [usersSnap, savedSnap] = await Promise.all([
    db.collection('users').where('role', '==', 'client').get(),
    db.collection(CLIENT_DATABASE_COLLECTION).get(),
  ]);
  const saved = new Map(savedSnap.docs.map((d) => [d.id, d.data()]));
  const rows = [];
  for (const doc of usersSnap.docs) {
    const user = doc.data();
    if (!isDatabaseClient(user)) continue;
    rows.push({ row: mergeRecord(doc.id, user, saved.get(doc.id)), user });
  }
  return rows;
}

/** GET /api/client-database?search=&limit=&cursor= → { data, nextCursor } */
export async function listClientDatabase(req, res) {
  try {
    const { limit, cursor, search } = req.query;
    const all = await loadRows();
    let rows = sortRows(all.filter(({ row, user }) => matchesSearch(row, user, search)).map(({ row }) => row));
    if (cursor) {
      const idx = rows.findIndex((r) => r.uid === cursor);
      if (idx >= 0) rows = rows.slice(idx + 1);
    }
    const page = rows.slice(0, limit);
    res.json({
      data: page,
      nextCursor: rows.length > limit && page.length ? page[page.length - 1].uid : null,
    });
  } catch (err) {
    logger.error({ err }, 'Failed to list the client database');
    res.status(500).json({ message: 'Internal server error' });
  }
}

/** GET /api/client-database/names → every client's uid + name, for the picker. */
export async function listClientDatabaseNames(req, res) {
  try {
    const rows = sortRows((await loadRows()).map(({ row }) => row));
    res.json({ data: rows.map((r) => ({ uid: r.uid, clientName: r.clientName })) });
  } catch (err) {
    logger.error({ err }, 'Failed to list client database names');
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function loadOne(uid) {
  const [userDoc, savedDoc] = await Promise.all([
    db.collection('users').doc(uid).get(),
    db.collection(CLIENT_DATABASE_COLLECTION).doc(uid).get(),
  ]);
  // A staff uid, an additional login or a deactivated client is "not found":
  // this collection is about clients, and only those rows exist on the screen.
  if (!userDoc.exists || !isDatabaseClient(userDoc.data())) return null;
  return mergeRecord(uid, userDoc.data(), savedDoc.exists ? savedDoc.data() : null);
}

/** GET /api/client-database/:clientUid → { data } */
export async function getClientDatabaseRecord(req, res) {
  try {
    const row = await loadOne(req.params.clientUid);
    if (!row) return res.status(404).json({ message: 'Client not found' });
    res.json({ data: row });
  } catch (err) {
    logger.error({ err }, 'Failed to read a client database record');
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * PUT /api/client-database/:clientUid — save the record. The doc id IS the
 * client's uid, so a save always updates the one record; it can never create
 * a second row for the same client.
 */
export async function updateClientDatabaseRecord(req, res) {
  const { clientUid } = req.params;
  try {
    const userDoc = await db.collection('users').doc(clientUid).get();
    if (!userDoc.exists || !isDatabaseClient(userDoc.data())) {
      return res.status(404).json({ message: 'Client not found' });
    }
    const patch = {};
    for (const f of CLIENT_DATABASE_FIELDS) {
      if (typeof req.body[f] === 'string') patch[f] = req.body[f];
    }
    await db.collection(CLIENT_DATABASE_COLLECTION).doc(clientUid).set({
      ...patch,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid,
    }, { merge: true });
    logger.info({ clientUid, fields: Object.keys(patch), by: req.user.uid }, 'Client database record saved');
    const row = await loadOne(clientUid);
    res.json({ data: row });
  } catch (err) {
    logger.error({ err }, 'Failed to save a client database record');
    res.status(500).json({ message: 'Internal server error' });
  }
}
