/**
 * Input sanitisers shared by every controller, schema and service that cleans
 * user text. ONE copy, so a fix lands everywhere at once.
 *
 * Why there are no regular expressions here: `s.replace(/<[^>]*>/g, '')` — the
 * form this repo used in eight places — is quadratic on a string of many '<'
 * with no '>' (CodeQL js/polynomial-redos): every '<' rescans the rest of the
 * string. On a public endpoint that is a CPU-exhaustion lever. Each function
 * below looks at every character a bounded number of times.
 */

/**
 * Remove every `open … close` span, outermost-first, in one linear pass.
 *
 * Exactly what `replace(/<open>[^<close>]*<close>/g, '')` returns: a span runs
 * from an opener to the FIRST closer after it (openers in between are inside
 * the span), and once no closer is left the rest is kept unchanged.
 */
export function removeDelimited(input, open, close) {
  const s = String(input ?? '');
  let out = '';
  let i = 0;
  while (i < s.length) {
    const start = s.indexOf(open, i);
    if (start === -1) { out += s.slice(i); break; }
    const end = s.indexOf(close, start + 1);
    if (end === -1) { out += s.slice(i); break; }
    out += s.slice(i, start);
    i = end + 1;
  }
  return out;
}

/** A character that can follow '<' to begin markup: a letter, '/', '!' or '?'. */
const opensMarkup = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '/' || c === '!' || c === '?';

/**
 * Remove HTML tags.
 *
 * Same result as the old `replace(/<[^>]*>/g, '')` for any text whose angle
 * brackets are balanced or are not markup ("5 < 10" keeps its '<'). The one
 * difference is deliberate: a dangling opener with no '>' after it ("<script"
 * at the end of a field) loses its '<', so the result can never hold the start
 * of a tag (CodeQL js/incomplete-multi-character-sanitization). Nested input
 * like "<scr<script>ipt>" leaves "ipt>", which no browser parses as markup.
 *
 * Non-strings are stringified (null/undefined → '').
 */
export function stripTags(input) {
  const s = removeDelimited(input, '<', '>');
  if (s.indexOf('<') === -1) return s;
  let out = '';
  let i = 0;
  while (i < s.length) {
    if (s[i] !== '<') { out += s[i]; i += 1; continue; }
    // A run of '<' is dropped whole when markup follows it — dropping only the
    // last one would leave the one before it touching the markup.
    let j = i;
    while (j < s.length && s[j] === '<') j += 1;
    if (!(j < s.length && opensMarkup(s[j]))) out += s.slice(i, j);
    i = j;
  }
  return out;
}

/**
 * A plausible email: one '@', something before it, no whitespace, and a '.'
 * in the domain with something on both sides. The same acceptance as
 * `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`, which is quadratic on a domain of many dots
 * (CodeQL js/polynomial-redos), and capped at RFC 5321's 254 characters.
 */
export function isPlausibleEmail(input) {
  const s = String(input ?? '');
  if (s.length === 0 || s.length > 254) return false;
  if (/\s/.test(s)) return false; // a single-character class: linear
  const at = s.indexOf('@');
  if (at < 1 || s.indexOf('@', at + 1) !== -1) return false;
  const domain = s.slice(at + 1);
  // A dot with at least one character on each side of it.
  const dot = domain.indexOf('.', 1);
  return dot !== -1 && dot < domain.length - 1;
}

/**
 * Object keys that, written with `obj[key] = …`, reach Object.prototype or the
 * constructor instead of the object (CodeQL js/remote-property-injection).
 */
const RESERVED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** True when `key` is safe to use as a property name taken from a request. */
export const isSafeKey = (key) => typeof key === 'string' && key.length > 0 && !RESERVED_KEYS.has(key);

/**
 * A user-supplied value made safe to put in a log line: stringified, CR/LF
 * collapsed to a space (so it cannot forge a second entry, CodeQL
 * js/log-injection) and capped in length. Pass the result as a structured
 * field — `logger.info({ txnId: logValue(id) }, 'msg')` — never interpolated.
 */
export function logValue(input, max = 200) {
  if (input === undefined || input === null) return input;
  return String(input).replace(/[\r\n]+/g, ' ').slice(0, max);
}
