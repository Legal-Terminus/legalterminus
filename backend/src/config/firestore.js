import { getDb } from "./firebase.js";

/**
 * Firestore CRUD Utility Functions
 */

// CREATE
export const createDoc = async (collection, docId = null, data) => {
  try {
    const db = getDb();
    if (docId) {
      await db.collection(collection).doc(docId).set(data);
      return { id: docId, ...data };
    } else {
      const docRef = await db.collection(collection).add(data);
      return { id: docRef.id, ...data };
    }
  } catch (error) {
    throw new Error(`Error creating document: ${error.message}`);
  }
};

// READ ONE
export const getDoc = async (collection, docId) => {
  try {
    const db = getDb();
    const doc = await db.collection(collection).doc(docId).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(`Error reading document: ${error.message}`);
  }
};

// READ ALL (bounded)
// opts: { orderBy?: { field, direction='desc' }, limit?: number }
// Pushes ordering + a hard cap to Firestore so callers never scan an unbounded
// collection or sort in memory. `limit` defaults to 500 as a safety cap.
export const getAllDocs = async (collection, filters = [], opts = {}) => {
  try {
    const db = getDb();
    let query = db.collection(collection);

    // Apply filters if provided
    for (const filter of filters) {
      const { field, operator, value } = filter;
      query = query.where(field, operator, value);
    }

    if (opts.orderBy) {
      query = query.orderBy(opts.orderBy.field, opts.orderBy.direction || "desc");
    }
    query = query.limit(opts.limit ?? 500);

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error reading documents: ${error.message}`);
  }
};

// UPDATE
export const updateDoc = async (collection, docId, data) => {
  try {
    const db = getDb();
    await db.collection(collection).doc(docId).update(data);
    return { id: docId, ...data };
  } catch (error) {
    throw new Error(`Error updating document: ${error.message}`);
  }
};

// DELETE
export const deleteDoc = async (collection, docId) => {
  try {
    const db = getDb();
    await db.collection(collection).doc(docId).delete();
    return { id: docId, deleted: true };
  } catch (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }
};

// SEARCH by slug
export const getDocBySlug = async (collection, slug) => {
  try {
    const db = getDb();
    const snapshot = await db
      .collection(collection)
      .where("slug", "==", slug)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(`Error reading document by slug: ${error.message}`);
  }
};

export default {
  createDoc,
  getDoc,
  getAllDocs,
  updateDoc,
  deleteDoc,
  getDocBySlug,
};
