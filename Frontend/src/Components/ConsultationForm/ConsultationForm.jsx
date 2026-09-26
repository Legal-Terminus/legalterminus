import React, { useState } from 'react';
import { getServiceDisplayName } from '../../utils/serviceConfig.js';
import {
  validators,
  validateFields,
  normalizeIndianMobile,
  sanitizePhoneInput,
} from '../../utils/leadValidation.js';
import './ConsultationForm.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Other',
];

const CALL_TIMES = [
  '9:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM',
  '1:00 PM – 2:00 PM',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
  '5:00 PM – 6:00 PM',
  '6:00 PM – 7:00 PM',
];

const EMPTY = {
  fullName: '',
  email: '',
  phone: '',
  state: '',
  city: '',
  preferredCallTime: '',
  whatsapp: true,
};

/**
 * Shared "Get Expert Assistance / Book Free Consultation" form used across all service pages.
 *
 * Props:
 *   source       {string}  - identifies which page the lead came from (e.g. "private-limited")
 *   subtitle     {string}  - short line below the title (e.g. "Talk to our GST registration expert")
 *   title        {string}  - optional, defaults to "Get Expert Assistance"
 *   locationField {'state'|'city'} - 'state' (default) shows the state dropdown; 'city' shows a
 *                  plain city text input instead, for pages already scoped to one state
 *   fixedState   {string}  - state value submitted when locationField is 'city' (defaults to "Odisha")
 */
const ConsultationForm = ({
  source = 'unknown',
  subtitle = 'Talk to our expert',
  title = 'Get Expert Assistance',
  locationField = 'state',
  fixedState = 'Odisha',
}) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Every field except Preferred Call Time is mandatory.
  const rules = {
    fullName: validators.fullName,
    email: validators.email,
    phone: validators.phone,
    ...(locationField === 'city' ? { city: validators.city } : { state: validators.state }),
  };

  const checkField = (name, value) => {
    if (!rules[name]) return;
    setFieldErrors((prev) => ({ ...prev, [name]: rules[name](value) }));
  };

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    const value = name === 'phone' ? sanitizePhoneInput(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Once a field is flagged, re-check as the visitor corrects it; selects are checked on change.
    if (fieldErrors[name] || e.target.tagName === 'SELECT') checkField(name, value);
  };

  const handleBlur = (e) => checkField(e.target.name, e.target.value);

  const fieldProps = (name, extraClass = '') => ({
    onBlur: handleBlur,
    'aria-invalid': fieldErrors[name] ? true : undefined,
    'aria-describedby': fieldErrors[name] ? `cf-${source}-${name}-error` : undefined,
    className: `cf-input${extraClass}${fieldErrors[name] ? ' cf-input--invalid' : ''}`,
  });

  const fieldError = (name) =>
    fieldErrors[name] ? (
      <span className="cf-field-error" id={`cf-${source}-${name}-error`}>{fieldErrors[name]}</span>
    ) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = validateFields(form, rules);
    setFieldErrors(errors);
    const firstInvalid = Object.keys(rules).find((name) => errors[name]);
    if (firstInvalid) {
      const el = e.currentTarget.elements[firstInvalid];
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: normalizeIndianMobile(form.phone),
          state: locationField === 'city' ? fixedState : form.state,
          preferredCallTime: form.preferredCallTime,
          subject: `Consultation request – ${source}`,
          message: locationField === 'city' && form.city
            ? `Lead from service page: ${source} (City: ${form.city.trim()})`
            : `Lead from service page: ${source}`,
          source,
          sourceLabel: getServiceDisplayName(source),
          whatsapp: form.whatsapp,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed.');

      setSubmitted(true);
      setForm(EMPTY);
      setFieldErrors({});
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="cf-wrapper">
      <div className="cf-card">
        <h3 className="cf-title">{title}</h3>
        <p className="cf-subtitle">{subtitle}</p>

        {submitted ? (
          <div className="cf-success" role="alert">
            <span className="cf-success-icon">✅</span>
            <p>Thank you! Our team will contact you shortly.</p>
          </div>
        ) : (
          <form className="cf-form" onSubmit={handleSubmit} noValidate>
            <input
              {...fieldProps('fullName')}
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name *"
              required
              maxLength={100}
              autoComplete="name"
            />
            {fieldError('fullName')}

            <input
              {...fieldProps('email')}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address *"
              required
              maxLength={254}
              autoComplete="email"
            />
            {fieldError('email')}

            <input
              {...fieldProps('phone')}
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit Mobile Number *"
              required
              inputMode="numeric"
              autoComplete="tel-national"
            />
            {fieldError('phone')}

            {locationField === 'city' ? (
              <>
                <input
                  {...fieldProps('city', ' cf-input--dark-placeholder')}
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter City *"
                  required
                  maxLength={100}
                  autoComplete="address-level2"
                />
                {fieldError('city')}
              </>
            ) : (
              <>
                <select
                  {...fieldProps('state', ' cf-select')}
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Your State *</option>
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
                {fieldError('state')}
              </>
            )}

            <select
              className="cf-input cf-select"
              name="preferredCallTime"
              value={form.preferredCallTime}
              onChange={handleChange}
            >
              <option value="">Preferred Call Time</option>
              {CALL_TIMES.map((t) => <option key={t}>{t}</option>)}
            </select>

            <label className="cf-whatsapp">
              <input
                type="checkbox"
                name="whatsapp"
                checked={form.whatsapp}
                onChange={handleChange}
              />
              <span className="cf-whatsapp-text">
                Receive updates on <strong>WhatsApp</strong>
              </span>
            </label>

            {error && (
              <p className="cf-error" role="alert">{error}</p>
            )}

            <button className="cf-submit" type="submit" disabled={loading}>
              {loading ? 'Submitting…' : 'Book Free Consultation'}
            </button>
          </form>
        )}

        <p className="cf-note">🔒 100% Confidential • No Spam • No Hidden Charges</p>
      </div>
    </aside>
  );
};

export default ConsultationForm;
