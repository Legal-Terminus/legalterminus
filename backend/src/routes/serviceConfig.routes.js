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
import { logger } from "../config/logger.js";
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { serviceUpdateSchema } from '../schemas/content.schema.js';

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
    logger.error({ err }, '[serviceConfig] Failed to fetch:');
    res.status(500).json({ error: 'Failed to load service config.' });
  }
});

/**
 * GET /api/service-config/all  (staff-only)
 *   Like GET / but INCLUDES inactive services and exposes the `active` flag, so
 *   staff can see and re-enable disabled services on the catalog screen. Not
 *   cached and never exposed publicly (the public GET / stays active-only).
 */
router.get(
  '/all',
  verifyToken,
  requireRole('admin', 'manager', 'team_member'),
  async (req, res) => {
    try {
      const db = getDb();
      const snapshot = await db.collection('serviceCategories').orderBy('order').get();

      const services = {};
      snapshot.forEach((doc) => {
        const { id: categoryId, name: category, services: svcMap = {} } = doc.data();
        for (const [key, svc] of Object.entries(svcMap)) {
          services[key] = {
            key,
            displayName: svc.displayName,
            category,
            categoryId,
            active: svc.active !== false,
          };
        }
      });

      res.json({ services });
    } catch (err) {
      logger.error({ err }, '[serviceConfig] Failed to fetch (all):');
      res.status(500).json({ error: 'Failed to load service config.' });
    }
  }
);

/**
 * PATCH /api/service-config/:categoryId/:key
 *   Update a single service's editable fields (displayName, active) inside the
 *   `services` map of serviceCategories/{categoryId}. Identity fields (key,
 *   category, categoryId) are immutable. Staff-only. Invalidates the cache so
 *   the next GET reflects the change.
 */
router.patch(
  '/:categoryId/:key',
  verifyToken,
  requireRole('admin', 'manager', 'team_member'),
  validate(serviceUpdateSchema),
  async (req, res) => {
    try {
      const { categoryId, key } = req.params;
      const db = getDb();
      const ref = db.collection('serviceCategories').doc(categoryId);
      const snap = await ref.get();
      if (!snap.exists) {
        return res.status(404).json({ error: 'Category not found.' });
      }

      const existing = snap.data()?.services?.[key];
      if (!existing) {
        return res.status(404).json({ error: 'Service not found in category.' });
      }

      // Merge only the provided editable fields onto the existing service entry.
      const updated = { ...existing };
      if (req.body.displayName !== undefined) updated.displayName = req.body.displayName;
      if (req.body.active !== undefined) updated.active = req.body.active;

      await ref.update({ [`services.${key}`]: updated });
      invalidateServiceConfigCache();

      res.json({
        key,
        categoryId,
        category: snap.data()?.name,
        displayName: updated.displayName,
        active: updated.active !== false,
      });
    } catch (err) {
      logger.error({ err }, '[serviceConfig] Failed to update service:');
      res.status(500).json({ error: 'Failed to update service.' });
    }
  }
);

/** Invalidate the in-memory cache (called after admin updates a service label) */
export function invalidateServiceConfigCache() {
  _cache = null;
  _cacheTime = 0;
}

export default router;


