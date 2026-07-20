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
  'p', 'br', 'span', 'div',
  'b', 'strong', 'i', 'em', 'u', 's', 'strike', 'code', 'pre', 'blockquote',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'colgroup', 'col',
  'a', 'hr',
];

export const RICH_TEXT_OPTIONS = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    td: ['colspan', 'rowspan'],
    th: ['colspan', 'rowspan'],
    // TipTap marks cells/rows with these; harmless and needed for table layout.
    col: ['span'],
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
  },
  // No inline styles at all — the biggest vector for layout/─clickjacking abuse
  // and the main source of Word's paste noise.
  allowedStyles: {},
};

/** Sanitise user-authored HTML. Returns '' for empty/invalid input. */
export function sanitizeRichText(html, { maxLength = 20000 } = {}) {
  if (typeof html !== 'string' || !html.trim()) return '';
  const clean = sanitizeHtml(html, RICH_TEXT_OPTIONS);
  return clean.slice(0, maxLength);
}

/**
 * Plain-text projection of rich content — used for email bodies, notification
 * previews and search, where HTML would be noise (or unsafe to inject).
 */
export function richTextToPlain(html) {
  if (typeof html !== 'string' || !html.trim()) return '';
  // Turn block boundaries into newlines first so the text stays readable.
  const withBreaks = html
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
