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

/**
 * #319 — the pixel dimensions an image in a comment or Chat message may have.
 * ONE copy: the editor checks before uploading (so the person is told at once
 * and nothing is sent), and the upload endpoint enforces the same rule.
 *
 * - At least 20 px on each side. Smaller is a speck or a tracking pixel, not
 *   something a reader can use — yet a cropped screenshot of a single line of
 *   text (about 20–30 px tall) must still be accepted.
 * - At most 8,000 px on either side. A 5 MB PNG can still claim enormous
 *   dimensions (flat colour compresses to nothing), and every viewer's browser
 *   decodes the full bitmap — 8,000 px covers any screenshot, scan or phone
 *   photo a person would share in a message.
 */
export const COMMENT_IMAGE_MIN_SIDE_PX = 20;
export const COMMENT_IMAGE_MAX_SIDE_PX = 8000;

/** A person-readable reason an image of this size cannot be added, or null if it can. */
export function commentImageDimensionProblem(width, height) {
  const w = Number(width);
  const h = Number(height);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return 'That image could not be read. Please try a different JPEG, PNG or WebP image.';
  }
  const size = `${Math.round(w).toLocaleString('en-IN')} × ${Math.round(h).toLocaleString('en-IN')} pixels`;
  if (w < COMMENT_IMAGE_MIN_SIDE_PX || h < COMMENT_IMAGE_MIN_SIDE_PX) {
    return `That image is too small to read (${size}). Images must be at least ${COMMENT_IMAGE_MIN_SIDE_PX} × ${COMMENT_IMAGE_MIN_SIDE_PX} pixels.`;
  }
  if (w > COMMENT_IMAGE_MAX_SIDE_PX || h > COMMENT_IMAGE_MAX_SIDE_PX) {
    return `That image is too large (${size}). Images can be at most ${COMMENT_IMAGE_MAX_SIDE_PX.toLocaleString('en-IN')} pixels wide or tall — please resize it, or use a screenshot of the part you need.`;
  }
  return null;
}
