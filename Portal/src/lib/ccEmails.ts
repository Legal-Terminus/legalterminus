/**
 * #149: a matter can carry additional email addresses. The client's own address
 * is the To recipient; these are CC'd on every automated email for that matter.
 *
 * Shared between Create Matter and the matter screen's editor so the two can't
 * drift in how they parse, validate or de-duplicate the list.
 */

/** Loose but practical — the backend re-validates with Zod's stricter email(). */
const EMAIL_RE = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;

export const MAX_CC_EMAILS = 20;

/** Split a comma/semicolon/whitespace-separated string into trimmed addresses. */
export function parseCcEmails(input: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(/[,;\s]+/)) {
    const addr = raw.trim().toLowerCase();
    if (!addr || seen.has(addr)) continue;
    seen.add(addr);
    out.push(addr);
  }
  return out;
}

/**
 * Validate a parsed list. Returns an error message, or null when the list is
 * fine. `primaryEmail` (the client's own address) is allowed but redundant —
 * the backend strips it, so we only warn about genuine problems.
 */
export function validateCcEmails(list: string[]): string | null {
  if (list.length > MAX_CC_EMAILS) {
    return `Please enter at most ${MAX_CC_EMAILS} additional email addresses.`;
  }
  const bad = list.filter((a) => !EMAIL_RE.test(a));
  if (bad.length) {
    return `Not a valid email address: ${bad.join(', ')}`;
  }
  return null;
}

/** Render a stored list back into the comma-separated form the inputs use. */
export const formatCcEmails = (list: string[] | undefined | null): string =>
  (list ?? []).join(', ');
