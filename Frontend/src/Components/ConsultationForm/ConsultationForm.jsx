import React, { useState } from 'react';
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
  preferredCallTime: '',
  whatsapp: true,
};

/**
 * Shared "Get Expert Assistance / Book Free Consultation" form used across all service pages.
 *
 * Props:
 *   source   {string}  - identifies which page the lead came from (e.g. "private-limited")
 *   subtitle {string}  - short line below the title (e.g. "Talk to our GST registration expert")
 *   title    {string}  - optional, defaults to "Get Expert Assistance"
 */
const ConsultationForm = ({
  source = 'unknown',
  subtitle = 'Talk to our expert',
  title = 'Get Expert Assistance',
}) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.phone || !form.email) {
      setError('Phone and email are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          state: form.state,
          preferredCallTime: form.preferredCallTime,
          subject: `Consultation request – ${source}`,
          message: `Lead from service page: ${source}`,
          source,
          whatsapp: form.whatsapp,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed.');

      setSubmitted(true);
      setForm(EMPTY);
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
              className="cf-input"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              maxLength={100}
            />

            <input
              className="cf-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              maxLength={254}
            />

            <input
              className="cf-input"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Mobile Number"
              required
              maxLength={15}
            />

            <select
              className="cf-input cf-select"
              name="state"
              value={form.state}
              onChange={handleChange}
            >
              <option value="">Select Your State</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>

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
