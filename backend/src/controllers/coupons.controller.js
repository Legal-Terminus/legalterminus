/**
 * Coupons (#256, #257, #260) — HTTP only. The rules are in services/coupons.js
 * and the reads and writes in services/coupons.service.js.
 */
import { logger } from '../config/logger.js';
import { getDb } from '../config/firebase.js';
import {
  createCoupon, deleteCoupon, getCoupon, listCoupons, listRedemptions, redemptionsCsv, setCouponActive, updateCoupon,
} from '../services/coupons.service.js';

const fail = (res, err, context) => {
  if (err?.status && err.status < 500) return res.status(err.status).json({ message: err.message, code: err.code });
  logger.error({ err }, context);
  return res.status(500).json({ message: 'Something went wrong. Please try again.' });
};

/** Who is acting, from the token and their stored profile — never the request. */
async function actor(req) {
  const profile = await getDb().collection('users').doc(req.user.uid).get();
  const p = profile.exists ? profile.data() : {};
  return { uid: req.user.uid, name: p.name || p.fullName || req.user.name || req.user.email || '' };
}

export async function getCoupons(req, res) {
  try { res.json(await listCoupons({ limit: req.query.limit, cursor: req.query.cursor })); } catch (err) { fail(res, err, 'getCoupons error'); }
}

export async function getCouponByCode(req, res) {
  try {
    const c = await getCoupon(req.params.code);
    if (!c) return res.status(404).json({ message: 'Coupon not found.' });
    res.json(c);
  } catch (err) { fail(res, err, 'getCouponByCode error'); }
}

export async function postCoupon(req, res) {
  try { res.status(201).json(await createCoupon(req.body, await actor(req))); } catch (err) { fail(res, err, 'postCoupon error'); }
}

export async function putCoupon(req, res) {
  try { res.json(await updateCoupon(req.params.code, req.body, await actor(req))); } catch (err) { fail(res, err, 'putCoupon error'); }
}

export async function patchCoupon(req, res) {
  try { res.json(await setCouponActive(req.params.code, req.body.active, await actor(req))); } catch (err) { fail(res, err, 'patchCoupon error'); }
}

export async function removeCoupon(req, res) {
  try { await deleteCoupon(req.params.code); res.json({ deleted: true }); } catch (err) { fail(res, err, 'removeCoupon error'); }
}

/** GET /api/coupons/redemptions — the Coupon & Discount report, a page at a time, or as CSV. */
export async function getRedemptions(req, res) {
  try {
    const { limit, cursor, from, to, format } = req.query;
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="coupon-report.csv"');
      return res.send(await redemptionsCsv({ from, to }));
    }
    res.json(await listRedemptions({ limit, cursor, from, to }));
  } catch (err) { fail(res, err, 'getRedemptions error'); }
}
