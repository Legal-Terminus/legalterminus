import { z } from 'zod';

/**
 * Body of the two unauthenticated account-link requests (#203). `.strip()`
 * drops anything else, so nothing in the request can choose where a link goes
 * — it goes only to the address asked about.
 */
export const accountLinkRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
}).strip();
