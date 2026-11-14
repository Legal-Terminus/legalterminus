/**
 * Word and size limits for user-authored rich text — ONE copy for the Portal's
 * editor and the API (LT #194, #295).
 *
 * Words are the limit people are told about. The editor counts and stops typing
 * at the limit as a convenience; the API (`prepareRichText`) is the control,
 * because anyone can post straight to it.
 *
 * #295: a Chat message may be up to 5,000 words; step comments and notes to the
 * client stay at 1,000.
 */
export const COMMENT_WORD_LIMIT = 1000;
export const MESSAGE_WORD_LIMIT = 5000;

/** The word limit for a kind of text ('message', 'comment', 'note', …). */
export const wordLimitFor = (what) => (what === 'message' ? MESSAGE_WORD_LIMIT : COMMENT_WORD_LIMIT);

/**
 * Most sanitised markup one piece may carry — a guard against pathological
 * payloads, set at about four times what the word limit's worth of real,
 * formatted prose produces. Exceeding it is refused, never truncated.
 */
export const COMMENT_MAX_CHARS = 60000;
export const MESSAGE_MAX_CHARS = 300000;
export const maxCharsFor = (what) => (what === 'message' ? MESSAGE_MAX_CHARS : COMMENT_MAX_CHARS);

/**
 * Raw input caps for the request schemas (pasted Word markup is bulky before
 * sanitising). They must stay above what the word limits allow, and the
 * message cap below the API's 1 MB JSON body limit.
 */
export const COMMENT_MAX_INPUT_CHARS = 200000;
export const MESSAGE_MAX_INPUT_CHARS = 600000;
