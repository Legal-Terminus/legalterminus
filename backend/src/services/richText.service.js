import sanitizeHtml from 'sanitize-html';

/**
 * #122 — rich-text sanitisation for user-authored content (step comments and
 * discussion messages).
 *
 * SECURITY: this runs on the SERVER, on WRITE. Never trust HTML that arrives from
 * a browser — a client could post directly to the API without going through our
 * editor. Everything stored is already clean, so every render site is safe and we
 * don't have to remember to sanitise in each of them.
 *
 * The allow-list is deliberately narrow: formatting, lists, tables and links —
 * the things the team actually pastes from Word/Excel/email. No <script>, no
 * <style>, no event handlers, no iframes/objects, no inline styles beyond a tiny
 * safe set. Links are forced to http/https/mailto and get rel="noopener".
 */

const ALLOWED_TAGS = [
  'p', 'br', 'span', 'div', 'mark',
  'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'code', 'pre', 'blockquote',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'colgroup', 'col',
  'a', 'hr',
  // #122 follow-up: an image REFERENCE only — see the img rules below.
  'img',
];

/** #122 follow-up: a comment image id — 32 lowercase hex characters. */
export const IMAGE_ID_RE = /^[0-9a-f]{32}$/;
/** The most images one comment / message may carry. */
export const COMMENT_IMAGE_LIMIT = 20;
const IMAGE_ALT_MAX = 200;

/**
 * #122 follow-up — the ONLY image form that survives sanitising is a reference
 * to an image uploaded to this matter:
 *
 *     <img data-lt-image="{32 hex}" alt="…">
 *
 * Every other attribute is stripped. An <img> that carries ANY `src`/`srcset`
 * (http, data:, anything) or lacks a well-formed id is REMOVED entirely — an
 * unrestricted image tag is a tracking pixel / data-leak vector, and a data: URI
 * is the base64 bloat this design exists to avoid. The id is checked against the
 * matter's own images when the comment is saved (commentImages.service.js).
 */
function transformImg(tagName, attribs) {
  const id = attribs['data-lt-image'];
  const hasSource = ['src', 'srcset', 'lowsrc', 'dynsrc'].some((a) => a in attribs);
  if (hasSource || typeof id !== 'string' || !IMAGE_ID_RE.test(id)) {
    // No id → dropped by exclusiveFilter below.
    return { tagName: 'img', attribs: {} };
  }
  const alt = String(attribs.alt ?? '').slice(0, IMAGE_ALT_MAX);
  return { tagName: 'img', attribs: { 'data-lt-image': id, ...(alt ? { alt } : {}) } };
}

export const RICH_TEXT_OPTIONS = {
  allowedTags: ALLOWED_TAGS,
  // An image reference is all attributes; nothing else may ride on it.
  exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs['data-lt-image'],
  allowedAttributes: {
    img: ['data-lt-image', 'alt'],
    a: ['href', 'title', 'target', 'rel'],
    td: ['colspan', 'rowspan'],
    th: ['colspan', 'rowspan'],
    // TipTap marks cells/rows with these; harmless and needed for table layout.
    col: ['span'],
    // #194: the colour/highlight/size marks ride on inline styles; the values are
    // constrained by allowedStyles below, so only known-safe declarations survive.
    span: ['style'],
    mark: ['style', 'data-color'],
  },
  // Only real, safe link schemes — blocks javascript:, data:, vbscript: etc.
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesAppliedToAttributes: ['href'],
  // Drop the CONTENT of these too, not just the tags (default keeps inner text).
  nonTextTags: ['style', 'script', 'textarea', 'option', 'noscript', 'iframe', 'object', 'embed'],
  transformTags: {
    // Any surviving link opens safely and can't reach back via window.opener.
    a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
    // Normalise legacy/verbose tags Word tends to emit.
    strike: 's',
    img: transformImg,
  },
  // #194: text colour, highlight and size are now offered in the editor, so the
  // marks they produce must survive sanitising — previously `allowedStyles: {}`
  // stripped them and the formatting silently vanished on save.
  //
  // This stays deliberately narrow: only `color`, `background-color` and
  // `font-size`, each matched against a value pattern, on `span`/`mark` only.
  // Everything that made blanket inline styles dangerous — position, display,
  // z-index, url(), expression() — remains impossible, as does Word's paste noise.
  allowedStyles: {
    span: {
      color: [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i],
      'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i],
      // Cap the unit values so a comment can't blow up the layout with 500rem.
      'font-size': [/^(0?\.\d+|[0-3](\.\d+)?)rem$/, /^([8-9]|[1-3]\d|4[0-8])px$/, /^(smaller|larger|normal)$/],
    },
    mark: {
      'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i],
      color: [/^#[0-9a-f]{3,8}$/i],
    },
  },
};

/**
 * #194 — maximum words in a comment / message. The editor shows a counter and
 * stops typing at this number, but that is a convenience: this module is the
 * actual control, since anyone can post straight to the API.
 */
export const COMMENT_WORD_LIMIT = 1000;

/** Words in rich text, counted on the PLAIN text — markup is not content. */
export function countWords(html) {
  // #122 follow-up: an image is not a word — count the text only.
  const text = richTextToPlain(html, { image: '' });
  const t = String(text).replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
}

/**
 * Is this rich text within the word limit? Returns { ok, words } so the caller
 * can put the real number in the error message rather than a generic refusal.
 */
export function checkWordLimit(html, limit = COMMENT_WORD_LIMIT) {
  const words = countWords(html);
  return { ok: words <= limit, words, limit };
}

/**
 * The most markup a single comment / note / message may carry once sanitised.
 *
 * LT #194 (reopened): the word limit is 1,000, but each write path also cut the
 * sanitised HTML to a CHARACTER cap sized for a few paragraphs — 4,000 for a
 * Discussion message, 8,000 for a comment or note. A thousand ordinary words are
 * about 6,500 characters before any markup and close to 10,000 with it. So a
 * message inside the word limit was silently cut to roughly 400 words (mid-word,
 * possibly mid-tag), a comment to roughly 800, and a note was refused outright
 * by its schema as "Validation failed". The firm saw exactly that.
 *
 * Words are the limit people are told about, so words are the limit. This cap
 * exists only to stop a pathological payload (a thousand 500-character "words",
 * or markup that survives sanitising in bulk), and it sits far above anything a
 * thousand real words can produce. Exceeding it is REFUSED, never truncated —
 * cutting HTML at a byte offset loses content without telling anyone.
 */
export const RICH_TEXT_MAX_CHARS = 60000;
/** Raw input cap. Matches the Zod schemas; pasted Word markup is bulky before sanitising. */
export const RICH_TEXT_MAX_INPUT_CHARS = 200000;

/**
 * Validate and sanitise one piece of user-authored rich text for storage.
 *
 * Returns `{ ok: true, html }` — the full sanitised content, never truncated —
 * or `{ ok: false, status, code, message }` with a message a person can act on.
 * `what` names the thing in that message ("comment", "note", "message").
 */
export function prepareRichText(raw, { what = 'comment' } = {}) {
  const input = typeof raw === 'string' ? raw : String(raw ?? '');
  const html = sanitizeRichText(input, { maxLength: RICH_TEXT_MAX_INPUT_CHARS });
  const wl = checkWordLimit(html);
  const a = /^[aeiou]/i.test(what) ? 'An' : 'A';
  if (!wl.ok) {
    return {
      ok: false, status: 400, code: 'WORD_LIMIT_EXCEEDED',
      message: `${a} ${what} may be at most ${wl.limit} words (this one has ${wl.words}).`,
    };
  }
  const images = (html.match(/<img\b/gi) ?? []).length;
  if (images > COMMENT_IMAGE_LIMIT) {
    return {
      ok: false, status: 400, code: 'TOO_MANY_IMAGES',
      message: `${a} ${what} may include at most ${COMMENT_IMAGE_LIMIT} images (this one has ${images}).`,
    };
  }
  if (html.length > RICH_TEXT_MAX_CHARS) {
    return {
      ok: false, status: 400, code: 'RICH_TEXT_TOO_LARGE',
      message: `This ${what} carries too much formatting to save. Remove some of it — pasted tables, colours or very long links — and try again.`,
    };
  }
  return { ok: true, html, words: wl.words };
}

/** Sanitise user-authored HTML. Returns '' for empty/invalid input. */
export function sanitizeRichText(html, { maxLength = 20000 } = {}) {
  if (typeof html !== 'string' || !html.trim()) return '';
  const clean = sanitizeHtml(html, RICH_TEXT_OPTIONS);
  return clean.slice(0, maxLength);
}

/**
 * Plain-text projection of rich content — used for email bodies, notification
 * previews and search, where HTML would be noise (or unsafe to inject).
 *
 * #122 follow-up: an image reference becomes the literal text "[image]" (or
 * `image`, when given). Emails and notifications never embed or link an image —
 * it lives behind the Portal's login — and an image-only comment still reads as
 * "something was shared" rather than as empty.
 */
export function richTextToPlain(html, { image = '[image]' } = {}) {
  if (typeof html !== 'string' || !html.trim()) return '';
  // Turn block boundaries into newlines first so the text stays readable.
  const withBreaks = html
    .replace(/<img\b[^>]*>/gi, image ? ` ${image} ` : ' ')
    .replace(/<\/(p|div|tr|h[1-4]|li|blockquote)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/t[dh]>/gi, '\t');
  return sanitizeHtml(withBreaks, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** True when the string contains markup we'd render as HTML (vs plain text). */
export const looksLikeHtml = (s) => typeof s === 'string' && /<[a-z][\s\S]*>/i.test(s);
