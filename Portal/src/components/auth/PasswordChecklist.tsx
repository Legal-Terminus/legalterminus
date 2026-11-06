import { Capacitor } from '@capacitor/core';
import { Check, Circle } from 'lucide-react';
import { checkPassword } from '@shared/auth/passwordRules.js';

/**
 * #35 — the password rules under a "choose a password" field, each ticking as
 * it is met. The icon and the hidden "met / not yet" carry the state, not
 * colour alone; a met rule uses the success hue, an unmet one stays neutral
 * (it is not an error until the person tries to submit).
 */
export default function PasswordChecklist({ password, id }: { password: string; id: string }) {
  return (
    <ul id={id} aria-label="Password must have" aria-live="polite" className="mt-2 space-y-1">
      {checkPassword(password).map((r) => (
        <li key={r.id} data-rule={r.id} className={`flex items-center gap-2 text-sm ${r.met ? 'text-emerald-700' : 'text-ink-muted'}`}>
          {r.met
            ? <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            : <Circle className="w-2 h-2 mx-1 shrink-0" aria-hidden="true" />}
          {r.label}
          <span className="sr-only">{r.met ? ' (met)' : ' (not yet)'}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The website's policy pages. In the browser the Portal shares the website's
 * address; inside the app (served from https://localhost) the link must name
 * the site, which is the API's address in that build.
 */
const SITE = Capacitor.isNativePlatform() ? (import.meta.env.VITE_API_BASE_URL ?? '') : '';
const TERMS_URL = `${SITE}/policies/terms`;
const PRIVACY_URL = `${SITE}/policies/privacy`;

function PolicyLinks() {
  return (
    <>
      <a href={TERMS_URL} target="_blank" rel="noopener" className="font-medium text-ink underline">Terms &amp; Conditions</a>
      {' '}and{' '}
      <a href={PRIVACY_URL} target="_blank" rel="noopener" className="font-medium text-ink underline">Privacy Policy</a>
    </>
  );
}

export function TermsAgreement({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor="terms" className="flex items-start gap-3 min-h-11 text-sm text-ink cursor-pointer">
      <input
        id="terms"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-ink"
      />
      <span>I agree to the <PolicyLinks /></span>
    </label>
  );
}

/** The line beside "Continue with Google": choosing Google is the agreement. */
export function GoogleTermsNote() {
  return (
    <p className="mt-2 text-center text-xs text-ink-muted">
      By continuing with Google you agree to our <PolicyLinks />.
    </p>
  );
}
