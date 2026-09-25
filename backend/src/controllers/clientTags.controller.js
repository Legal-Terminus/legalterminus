import { db } from '../config/firebase.js';
import { logger } from '../config/logger.js';
import {
  normaliseTag, normaliseTags, mergeManagedTags, planTagRename, planTagDelete,
} from '../services/clientProfile.service.js';

/**
 * E19 (ported) — the managed client-tag list.
 *
 * A firm curates the tags it uses so the roster filter offers a stable
 * vocabulary rather than whatever anyone last typed. Two operations need care:
 *
 * - **Rename cascades.** Renaming "gst" to "gst registered" must update every
 *   client carrying it, or the old tag lingers on real clients while vanishing
 *   from the list — invisible, unfilterable, and impossible to clean up.
 * - **Delete detaches.** Removing a tag from the list removes it from clients
 *   too. The alternative (leaving it attached) is the same orphaning problem.
 */

const SETTINGS = 'settings';
const TAGS_DOC = 'clientTags';

/** Read the curated list, merged with what clients actually carry. */
async function readTags(db) {
  const [doc, clients] = await Promise.all([
    db.collection(SETTINGS).doc(TAGS_DOC).get(),
    db.collection('users').where('role', '==', 'client').get(),
  ]);
  const inUse = [];
  for (const c of clients.docs) for (const t of c.data().tags ?? []) inUse.push(t);
  return {
    managed: normaliseTags(doc.exists ? doc.data()?.tags : []),
    // A tag in use but absent from the managed list still appears, so the
    // filter can never offer less than the data contains.
    all: mergeManagedTags(doc.exists ? doc.data()?.tags : [], inUse),
  };
}

export async function listClientTags(req, res) {
  try {
    res.json(await readTags(db));
  } catch (err) {
    logger.error({ err }, 'listClientTags failed');
    res.status(500).json({ message: 'Failed to load tags' });
  }
}

export async function addClientTag(req, res) {
  try {
    const tag = normaliseTag(req.body?.tag);
    if (!tag) return res.status(400).json({ message: 'A tag cannot be empty.' });
    const { managed } = await readTags(db);
    if (managed.includes(tag)) return res.status(409).json({ message: 'That tag already exists.' });
    await db.collection(SETTINGS).doc(TAGS_DOC)
      .set({ tags: [...managed, tag].sort() }, { merge: true });
    res.status(201).json(await readTags(db));
  } catch (err) {
    logger.error({ err }, 'addClientTag failed');
    res.status(500).json({ message: 'Failed to add the tag' });
  }
}

/** Rename across the list AND every client that carries it. */
export async function renameClientTag(req, res) {
  try {
    const from = normaliseTag(req.params.tag);
    const to = normaliseTag(req.body?.tag);
    if (!from || !to) return res.status(400).json({ message: 'A tag cannot be empty.' });
    if (from === to) return res.json(await readTags(db));

    const clients = await db.collection('users').where('role', '==', 'client').get();
    const changes = planTagRename(
      clients.docs.map((d) => ({ id: d.id, tags: d.data().tags })), from, to,
    );

    // Batched: a partial rename would leave the old tag on some clients and the
    // new one on others, which is worse than not renaming at all.
    for (let i = 0; i < changes.length; i += 450) {
      const batch = db.batch();
      for (const c of changes.slice(i, i + 450)) {
        batch.set(db.collection('users').doc(c.id), { tags: c.tags }, { merge: true });
      }
      await batch.commit();
    }

    const { managed } = await readTags(db);
    const next = [...new Set(managed.map((t) => (t === from ? to : t)))].sort();
    await db.collection(SETTINGS).doc(TAGS_DOC).set({ tags: next }, { merge: true });

    logger.info({ from, to, clients: changes.length }, 'client tag renamed');
    res.json({ ...(await readTags(db)), updatedClients: changes.length });
  } catch (err) {
    logger.error({ err }, 'renameClientTag failed');
    res.status(500).json({ message: 'Failed to rename the tag' });
  }
}

/** Delete from the list AND detach from every client (AC2). */
export async function deleteClientTag(req, res) {
  try {
    const tag = normaliseTag(req.params.tag);
    if (!tag) return res.status(400).json({ message: 'A tag cannot be empty.' });

    const clients = await db.collection('users').where('role', '==', 'client').get();
    const changes = planTagDelete(
      clients.docs.map((d) => ({ id: d.id, tags: d.data().tags })), tag,
    );
    for (let i = 0; i < changes.length; i += 450) {
      const batch = db.batch();
      for (const c of changes.slice(i, i + 450)) {
        batch.set(db.collection('users').doc(c.id), { tags: c.tags }, { merge: true });
      }
      await batch.commit();
    }

    const { managed } = await readTags(db);
    await db.collection(SETTINGS).doc(TAGS_DOC)
      .set({ tags: managed.filter((t) => t !== tag) }, { merge: true });

    logger.info({ tag, detached: changes.length }, 'client tag deleted');
    res.json({ ...(await readTags(db)), detachedFrom: changes.length });
  } catch (err) {
    logger.error({ err }, 'deleteClientTag failed');
    res.status(500).json({ message: 'Failed to delete the tag' });
  }
}
