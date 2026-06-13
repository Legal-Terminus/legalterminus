import { getDb } from "../config/firebase.js";

/**
 * Firestore-backed store for express-rate-limit.
 *
 * Why Firestore: the default memory store is per-instance, so on a horizontally
 * scaled service (e.g. multiple Cloud Run instances) each instance counts
 * independently and the effective limit is N× the configured value, and counts
 * reset on every deploy. Backing the counter on Firestore makes the limit shared
 * and durable across instances.
 *
 * Implements the express-rate-limit v7 Store interface: init / increment /
 * decrement / resetKey. Counters live in `rateLimits/{key}` with a `count` and a
 * window `resetAt`; the window resets lazily on first hit after expiry.
 *
 * NOTE: each increment is a transaction (1 read + 1 write). That's fine for the
 * low-volume sensitive endpoints this guards (auth/payment/contact). Do NOT put
 * this on a high-QPS path — use the in-memory limiter there.
 */
const COLLECTION = "rateLimits";

export class FirestoreStore {
  constructor() {
    this.windowMs = 60_000;
  }

  // express-rate-limit calls init() with the limiter options.
  init(options) {
    this.windowMs = options.windowMs;
  }

  _col() {
    return getDb().collection(COLLECTION);
  }

  async increment(key) {
    const ref = this._col().doc(encodeURIComponent(key));
    const now = Date.now();

    return getDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      let count = 1;
      let resetAt = now + this.windowMs;

      if (snap.exists) {
        const data = snap.data();
        if (data.resetAt > now) {
          count = (data.count ?? 0) + 1;
          resetAt = data.resetAt;
        }
      }

      tx.set(ref, { count, resetAt });
      return { totalHits: count, resetTime: new Date(resetAt) };
    });
  }

  async decrement(key) {
    const ref = this._col().doc(encodeURIComponent(key));
    await getDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists) {
        const count = Math.max(0, (snap.data().count ?? 0) - 1);
        tx.update(ref, { count });
      }
    });
  }

  async resetKey(key) {
    await this._col().doc(encodeURIComponent(key)).delete();
  }
}
