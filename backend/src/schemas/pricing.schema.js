import { z } from 'zod';

// A price in whole rupees. The ceiling is a typo guard, not a business rule.
const amount = z.number().int().min(1).max(10_000_000);

/** PUT /api/pricing/:productKey — an admin's edit to one product (E24-S01). */
export const updatePricingSchema = z.object({
  label: z.string().trim().min(1).max(120).optional(),
  // The portal service this product opens a matter on; null clears the link.
  serviceKey: z.string().trim().max(100).nullable().optional(),
  plans: z.array(z.object({
    id: z.string().trim().min(1).max(60),
    price: amount.optional(),
    oldPrice: amount.nullable().optional(),
    name: z.string().trim().min(1).max(80).optional(),
    active: z.boolean().optional(),
  }).strict()).max(20).optional(),
}).strict();
