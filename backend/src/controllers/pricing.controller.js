import { logger } from '../config/logger.js';
import { GST_PERCENT, loadCatalog, publicView, updateProduct } from '../services/pricing.service.js';

/**
 * GET /api/public/pricing — what the website shows (E24-S01). Public and
 * read-only: prices are printed on the website anyway. Only active plans and
 * their prices are returned.
 */
export async function getPublicPricing(_req, res) {
  try {
    // Browsers and the CDN may keep it briefly; a price change shows within minutes.
    res.set('Cache-Control', 'public, max-age=60');
    // gstPercent: prices are exclusive of GST; the checkout shows what is added (#212).
    res.json({ products: publicView(await loadCatalog()), gstPercent: GST_PERCENT });
  } catch (err) {
    logger.error({ err }, 'getPublicPricing error');
    res.status(500).json({ message: 'Could not load prices.' });
  }
}

/** GET /api/pricing — the full catalogue, with service links and inactive plans. */
export async function getPricing(_req, res) {
  try {
    res.json({ products: await loadCatalog({ fresh: true }) });
  } catch (err) {
    logger.error({ err }, 'getPricing error');
    res.status(500).json({ message: 'Could not load prices.' });
  }
}

/** PUT /api/pricing/:productKey — change a product's prices. Admin only. */
export async function putPricing(req, res) {
  try {
    const product = await updateProduct(req.params.productKey, req.body, req.user.uid);
    if (!product) return res.status(404).json({ message: 'No such product.' });
    res.json({ product });
  } catch (err) {
    if (err.status === 400) return res.status(400).json({ message: err.message });
    logger.error({ err }, 'putPricing error');
    res.status(500).json({ message: 'Could not save the prices.' });
  }
}
