import { z } from 'zod';
import { stripTags } from '../utils/sanitize.js';
import { MARKETING_LIMITS } from '../services/emailTemplates.service.js';

/**
 * PUT /api/settings/completion-marketing — #310, the "Explore more services"
 * block on the client's completion email. Plain text: tags are stripped here,
 * and the email escapes what is left before it is rendered. An empty heading
 * and body are allowed — that is one way to stop sending the block.
 */
const plain = (max) => z.string().max(max * 2).transform((s) => stripTags(s).slice(0, max));

export const completionMarketingSchema = z.object({
  enabled: z.boolean(),
  heading: plain(MARKETING_LIMITS.heading),
  body: plain(MARKETING_LIMITS.body),
}).strict();
