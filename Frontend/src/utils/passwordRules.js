/**
 * #35 — the password rules, for the website.
 *
 * TWIN of `shared/auth/passwordRules.js` (used by the Portal and the backend).
 * The website is built from `Frontend/` alone (its deploy only rebuilds when
 * `Frontend/` changes), so it keeps its own copy. Change both together;
 * `backend/src/__tests__/passwordRules.test.js` fails when they disagree.
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const PASSWORD_RULES = [
  { id: 'length', label: `At least ${PASSWORD_MIN_LENGTH} characters`, test: (pw) => pw.length >= PASSWORD_MIN_LENGTH },
  { id: 'upper', label: 'One uppercase letter (A–Z)', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'One lowercase letter (a–z)', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'One number (0–9)', test: (pw) => /[0-9]/.test(pw) },
  // Any character that is not a letter, digit or space: !@#$%^&* and the rest.
  { id: 'special', label: 'One special character (!@#$%^&*)', test: (pw) => /[^A-Za-z0-9\s]/.test(pw) },
];

/** Each rule with whether `password` meets it, in display order. */
export function checkPassword(password) {
  const pw = String(password ?? '');
  return PASSWORD_RULES.map(({ id, label, test }) => ({ id, label, met: test(pw) }));
}

/** True when every rule is met and the password is not over the maximum. */
export function isStrongPassword(password) {
  const pw = String(password ?? '');
  return pw.length <= PASSWORD_MAX_LENGTH && PASSWORD_RULES.every(({ test }) => test(pw));
}

/** The one sentence shown when a password is refused. */
export const PASSWORD_RULES_MESSAGE =
  `Use at least ${PASSWORD_MIN_LENGTH} characters, with an uppercase letter, a lowercase letter, a number and a special character.`;
