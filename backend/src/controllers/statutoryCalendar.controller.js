import { logger } from '../config/logger.js';
import { db } from '../config/firebase.js';
import { readCalendar, setOverride } from '../services/statutoryCalendar.service.js';

/**
 * The statutory calendar's endpoints (ported from Ambyflow, Story 35.3).
 *
 * Reading is open to any staff member: the compliance calendar is a view
 * of the firm's year and everyone benefits from it. EDITING is admin-only,
 * because one edit moves every deadline anchored to that key — which is the
 * feature's value and also its risk.
 */

export async function getStatutoryCalendar(req, res) {
  try {
    // `month` scopes the resolved dates and any period override, so the screen
    // can show "what does September actually resolve to?".
    const month = /^\d{4}-\d{2}$/.test(String(req.query.month ?? '')) ? String(req.query.month) : null;
    res.json(await readCalendar(db, { month }));
  } catch (err) {
    logger.error({ err }, 'getStatutoryCalendar failed');
    res.status(500).json({ message: 'Failed to load the statutory calendar' });
  }
}

export async function putStatutoryOverride(req, res) {
  try {
    const { key } = req.params;
    const { entry = null, periodKey = null } = req.body ?? {};
    if (periodKey && !/^\d{4}(-\d{2})?$/.test(String(periodKey))) {
      return res.status(400).json({ message: 'periodKey must be YYYY or YYYY-MM.' });
    }
    // A null entry REVERTS to the shipped default rather than freezing today's
    // default onto the firm — otherwise they would miss the next correction.
    const overrides = await setOverride(db, key, entry, {
      periodKey, actorUid: req.user.uid,
    });
    res.json({ overrides, ...(await readCalendar(db)) });
  } catch (err) {
    // setOverride throws a message written for the caller ("day must be between
    // 1 and 28"), so returning it is useful rather than leaky.
    if (err?.message && !/internal/i.test(err.message)) {
      return res.status(400).json({ message: err.message });
    }
    logger.error({ err }, 'putStatutoryOverride failed');
    res.status(500).json({ message: 'Failed to update the statutory calendar' });
  }
}
