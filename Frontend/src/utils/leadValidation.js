// Shared field validation for the marketing-site lead forms (ConsultationForm, ContactUs).
// Each validator takes the raw input value and returns an error message, or '' when valid.

const NAME_RE = /^[A-Za-z][A-Za-z .'-]*$/;
const PLACE_RE = /^[A-Za-z][A-Za-z .-]*$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

// Indian mobile numbers: 10 digits starting with 6–9. A leading +91, 91 or 0 is tolerated.
export const normalizeIndianMobile = (value) =>
  String(value || '').replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');

// Keeps only digits while typing, capped at 10. A pasted +91/91/0 prefix is dropped first so
// "+91 98765 43210" becomes "9876543210" rather than "9198765432".
export const sanitizePhoneInput = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return (digits.length > 10 ? digits.replace(/^(91|0)/, '') : digits).slice(0, 10);
};

export const validators = {
  fullName: (v) => {
    const s = String(v || '').trim();
    if (!s) return 'Please enter your full name';
    if (s.length < 2 || !NAME_RE.test(s)) return 'Please enter a valid name (letters only)';
    return '';
  },
  email: (v) => {
    const s = String(v || '').trim();
    if (!s) return 'Please enter your email address';
    if (!EMAIL_RE.test(s)) return 'Please enter a valid email address';
    return '';
  },
  phone: (v) => {
    if (!String(v || '').trim()) return 'Please enter your mobile number';
    if (!/^[6-9]\d{9}$/.test(normalizeIndianMobile(v))) {
      return 'Please enter a valid 10-digit Indian mobile number';
    }
    return '';
  },
  city: (v) => {
    const s = String(v || '').trim();
    if (!s) return 'Please enter your city';
    if (s.length < 2 || !PLACE_RE.test(s)) return 'Please enter a valid city name';
    return '';
  },
  state: (v) => (String(v || '').trim() ? '' : 'Please select your state'),
  required: (label) => (v) => (String(v || '').trim() ? '' : `Please enter ${label}`),
};

// Runs the given { fieldName: validator } map over values; returns { fieldName: message } for failures.
export const validateFields = (values, rules) =>
  Object.entries(rules).reduce((errors, [name, rule]) => {
    const msg = rule(values[name]);
    if (msg) errors[name] = msg;
    return errors;
  }, {});
