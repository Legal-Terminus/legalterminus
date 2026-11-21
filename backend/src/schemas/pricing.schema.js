import { z } from 'zod';

// A price in whole rupees. The ceiling is a typo guard, not a business rule.
const amount = z.number().int().min(1).max(10_000_000);

/** PUT /api/pricing/:productKey — an admin's edit to one product (E24-S01). */
export const updatePricingSchema = z.object({
  // The portal service this product opens a matter on; null clears the link.
  serviceKey: z.string().trim().max(100).nullable().optional(),
  plans: z.array(z.object({
    id: z.string().trim().min(1).max(60),
    price: amount.optional(),
    oldPrice: amount.nullable().optional(),
    name: z.string().trim().min(1).max(80).optional(),
    active: z.boolean().optional(),
  }).strict()).max(20).optional(),
  // #221: the surcharge each answer to the product's question adds (₹0 allowed:
  // "Proposed to be Used" adds nothing). The question and its answers are the website's.
  choice: z.object({
    options: z.array(z.object({
      id: z.string().trim().min(1).max(60),
      surcharge: z.number().int().min(0).max(10_000_000),
    }).strict()).min(1).max(10),
  }).strict().optional(),
}).strict();
