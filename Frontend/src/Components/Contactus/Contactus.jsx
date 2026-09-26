//// ContactUs.jsx (updated class names to match the CSS prefixes)
import React, { useState, useEffect } from 'react';
import './Contactus.css';
import {
  validators,
  validateFields,
  normalizeIndianMobile,
  sanitizePhoneInput,
} from '../../utils/leadValidation.js';

// react-icons (ensure package is installed)
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const SOCIALS = [
  { name: 'LinkedIn',  href: 'https://www.linkedin.com/company/legalterminus/', icon: <FaLinkedin size={20} /> },
  { name: 'Facebook',  href: 'https://www.facebook.com/LegalTerminusofficial',  icon: <FaFacebook size={20} /> },
  { name: 'Twitter',   href: 'https://x.com/legalterminus',                      icon: <FaTwitter size={20} /> },
  { name: 'Instagram', href: 'https://www.instagram.com/legalterminus/',          icon: <FaInstagram size={20} /> },
  { name: 'YouTube',   href: 'https://www.youtube.com/@LegalTerminus',            icon: <FaYoutube size={20} /> },
];

// Every field on this form is mandatory.
const RULES = {
  fullName: validators.fullName,
  company: validators.required('your company name'),
  phone: validators.phone,
  email: validators.email,
  subject: validators.required('a subject'),
  message: validators.required('your message'),
};

const ContactUs = () => {
  const [form, setForm] = useState({
    fullName: '',
    company: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [animated, setAnimated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', text }
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const checkField = (name, value) => {
    if (!RULES[name]) return;
    setFieldErrors(prev => ({ ...prev, [name]: RULES[name](value) }));
  };

  const handleChange = (e) => {
    const { name } = e.target;
    const value = name === 'phone' ? sanitizePhoneInput(e.target.value) : e.target.value;
    setForm(prev => ({ ...prev, [name]: value }));
    // Once a field is flagged, re-check as the visitor corrects it.
    if (fieldErrors[name]) checkField(name, value);
  };

  const handleBlur = (e) => checkField(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const errors = validateFields(form, RULES);
    setFieldErrors(errors);
    const firstInvalid = Object.keys(RULES).find(name => errors[name]);
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
        body: JSON.stringify({ ...form, phone: normalizeIndianMobile(form.phone), source: 'home' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed.');
      setFeedback({ type: 'success', text: "Thanks for reaching out! We'll get back to you soon." });
      setForm({ fullName: '', company: '', phone: '', email: '', subject: '', message: '' });
      setFieldErrors({});
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="zen-section" aria-labelledby="contact-heading">
      <div className="zen-inner">
        <div className={`zen-left ${animated ? 'zen-animated' : ''}`}>
          <div className="zen-left-inner">
            <span className="zen-subtle zen-fade-in" style={{ '--zen-delay': '0.1s' }}>
              <span className="zen-subtle-icon">✦</span>
              Drop us a line
              <span className="zen-subtle-icon">✦</span>
            </span>

            <h2 id="contact-heading" className="zen-title zen-slide-up" style={{ '--zen-delay': '0.2s' }}>
              Connect with Us
            </h2>

            <p className="zen-desc zen-fade-in" style={{ '--zen-delay': '0.3s' }}>
            Whether you need Company Registration, Trademark Filing, GST, FSSAI, or complete Legal and Compliance support, Legal Terminus is here to guide you with clarity, accuracy, and confidence—so you can focus on growing your business without legal worries.
            </p>

            <div className="zen-contact-blocks">
              <div className="zen-contact-row zen-slide-up" style={{ '--zen-delay': '0.4s' }}>
                <div className="zen-icon" aria-hidden>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.13 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.09 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1.05.37 2.07.73 3.04a2 2 0 0 1-.45 2.11L8.91 10.91a16 16 0 0 0 6 6l1.05-1.05a2 2 0 0 1 2.11-.45c.97.36 1.99.61 3.04.73A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="zen-contact-text">
                  <div className="zen-contact-label">General Inquiries</div>
                  <div className="zen-contact-value">+91 82800 93456 / 8280045432</div>
                </div>
              </div>

              <div className="zen-contact-row zen-slide-up" style={{ '--zen-delay': '0.5s' }}>
                <div className="zen-icon" aria-hidden>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 8l-9 6-9-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="zen-contact-text">
                  <div className="zen-contact-label">Email Us</div>
                  <div className="zen-contact-value">sales21@legalterminus.com</div>
                </div>
              </div>
            </div>

            <div className="zen-social">
              <div className="zen-social-title zen-fade-in" style={{ '--zen-delay': '0.6s' }}>
                Follow LEGAL TERMINUS on Social Platforms
              </div>

              <div className="zen-social-icons">
                {SOCIALS.map((s, i) => (
                  <a
                    key={s.name}
                    href={s.href}
                    className="zen-social-btn zen-fade-in-scale"
                    aria-label={s.name}
                    title={s.name}
                    style={{ '--zen-delay': `${0.7 + i * 0.05}s` }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* Render react-icon component directly */}
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className={`zen-right ${animated ? 'zen-animated' : ''}`} aria-labelledby="form-heading">
          <div className="zen-form-card zen-slide-up" style={{ '--zen-delay': '0.3s' }} role="form" aria-label="Contact form">
            <h3 id="form-heading" className="zen-form-title">Got Questions? I'm Here to Help!</h3>
            <hr className="zen-sep" />

            <form onSubmit={handleSubmit} className="zen-form" noValidate>
              <div className="zen-grid">
                {[
                  { label: 'Full Name *', name: 'fullName', type: 'text', placeholder: 'Your full name', delay: '0.1s', autoComplete: 'name' },
                  { label: 'Company / Organization *', name: 'company', type: 'text', placeholder: 'Company name', delay: '0.15s', autoComplete: 'organization' },
                  { label: 'Phone *', name: 'phone', type: 'tel', placeholder: '10-digit mobile number', delay: '0.2s', autoComplete: 'tel-national', inputMode: 'numeric' },
                  { label: 'Company email *', name: 'email', type: 'email', placeholder: 'you@company.com', delay: '0.25s', autoComplete: 'email' },
                  { label: 'Your Subject *', name: 'subject', type: 'text', placeholder: 'Short subject', full: true, delay: '0.3s' }
                ].map((field, index) => (
                  <label key={index} className={`zen-field ${field.full ? 'full' : ''} zen-fade-in`} style={{ '--zen-delay': field.delay }}>
                    <span className="zen-label">{field.label}</span>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={field.placeholder}
                      required
                      autoComplete={field.autoComplete}
                      inputMode={field.inputMode}
                      maxLength={field.maxLength}
                      className={fieldErrors[field.name] ? 'zen-invalid' : undefined}
                      aria-invalid={fieldErrors[field.name] ? true : undefined}
                    />
                    {fieldErrors[field.name] && (
                      <span className="zen-field-error">{fieldErrors[field.name]}</span>
                    )}
                  </label>
                ))}

                <label className="zen-field full zen-fade-in" style={{ '--zen-delay': '0.35s' }}>
                  <span className="zen-label">Message *</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell us about your project..."
                    rows="6"
                    required
                    className={fieldErrors.message ? 'zen-invalid' : undefined}
                    aria-invalid={fieldErrors.message ? true : undefined}
                  />
                  {fieldErrors.message && (
                    <span className="zen-field-error">{fieldErrors.message}</span>
                  )}
                </label>
              </div>

              {feedback && (
                <p
                  className="zen-fade-in"
                  style={{
                    color: feedback.type === 'success' ? '#166534' : '#991b1b',
                    background: feedback.type === 'success' ? '#dcfce7' : '#fee2e2',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '0.875rem',
                    margin: '0 0 8px',
                  }}
                  role="alert"
                >
                  {feedback.text}
                </p>
              )}

              <div className="zen-form-actions zen-fade-in" style={{ '--zen-delay': '0.4s' }}>
                <button type="submit" className="zen-submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Submit Now'}
                  {!loading && (
                    <span className="zen-submit-arrow" aria-hidden>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default ContactUs;
