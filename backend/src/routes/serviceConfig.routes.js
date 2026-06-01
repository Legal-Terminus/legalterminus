/**
 * serviceConfig.routes.js
 *
 * GET /api/service-config
 *   Returns a flat map of { serviceKey: { key, displayName, category, categoryId } }
 *   built from the `serviceCategories` Firestore collection.
 *
 * The flat map is used by the frontend to:
 *   1. Look up displayName for a source key (shown in reports, UI)
 *   2. Pass sourceLabel alongside source in payment/lead submissions
 *
 * Cache: 5 minutes in-memory.
 */

import express from 'express';
import { getDb } from '../config/firebase.js';

const router = express.Router();

let _cache = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

router.get('/', async (req, res) => {
  try {
    const now = Date.now();
    if (_cache && now - _cacheTime < CACHE_TTL_MS) {
      return res.json({ services: _cache });
    }

    const db = getDb();
    const snapshot = await db.collection('serviceCategories').orderBy('order').get();

    // Flatten into { key: { key, displayName, category, categoryId } }
    const services = {};
    snapshot.forEach((doc) => {
      const { id: categoryId, name: category, services: svcMap = {} } = doc.data();
      for (const [key, svc] of Object.entries(svcMap)) {
        if (svc.active !== false) {
          services[key] = {
            key,
            displayName: svc.displayName,
            category,
            categoryId,
          };
        }
      }
    });

    _cache = services;
    _cacheTime = now;
    res.json({ services });
  } catch (err) {
    console.error('[serviceConfig] Failed to fetch:', err.message);
    res.status(500).json({ error: 'Failed to load service config.' });
  }
});

/** Invalidate the in-memory cache (called after admin updates a service label) */
export function invalidateServiceConfigCache() {
  _cache = null;
  _cacheTime = 0;
}

export default router;


