import { checkPassword } from "../../utils/passwordRules";
import "./PasswordChecklist.css";

/**
 * #35 — the password rules under a "create password" field, each ticking as
 * it is met. A tick or a cross and the words "met" / "not yet" carry the
 * state, not colour alone. Polite live region: a screen reader hears the list
 * change without being interrupted on every key.
 */
export default function PasswordChecklist({ password, id }) {
  const rules = checkPassword(password);
  return (
    <ul className="pw-checklist" id={id} aria-label="Password must have" aria-live="polite">
      {rules.map((r) => (
        <li key={r.id} className={r.met ? "met" : ""} data-rule={r.id}>
          <span className="pw-mark" aria-hidden="true">{r.met ? "✓" : "•"}</span>
          {r.label}
          <span className="pw-sr">{r.met ? " (met)" : " (not yet)"}</span>
        </li>
      ))}
    </ul>
  );
}

/** "I agree to the Terms & Conditions and Privacy Policy" — links open in a new tab, so the form is kept. */
export function TermsAgreement({ checked, onChange, error, id = "terms" }) {
  return (
    <div className="terms-agree">
      <label htmlFor={id}>
        <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? "true" : undefined} />
        <span>
          I agree to the{" "}
          <a href="/policies/terms" target="_blank" rel="noopener">Terms &amp; Conditions</a>{" "}and{" "}
          <a href="/policies/privacy" target="_blank" rel="noopener">Privacy Policy</a>
        </span>
      </label>
      {error && <p className="terms-err" role="alert">{error}</p>}
    </div>
  );
}

/** The line next to "Continue with Google": choosing Google is the agreement. */
export function GoogleTermsNote() {
  return (
    <p className="google-terms-note">
      By continuing with Google you agree to our{" "}
      <a href="/policies/terms" target="_blank" rel="noopener">Terms &amp; Conditions</a>{" "}and{" "}
      <a href="/policies/privacy" target="_blank" rel="noopener">Privacy Policy</a>.
    </p>
  );
}
