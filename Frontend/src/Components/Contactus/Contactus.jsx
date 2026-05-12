//// ContactUs.jsx (updated class names to match the CSS prefixes)
import React, { useState, useEffect } from 'react';
import './Contactus.css';

// react-icons (ensure package is installed)
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const SOCIALS = [
  { name: 'LinkedIn',  href: 'https://www.linkedin.com/company/legalterminus/', icon: <FaLinkedin size={20} /> },
  { name: 'Facebook',  href: 'https://www.facebook.com/LegalTerminusofficial',  icon: <FaFacebook size={20} /> },
  { name: 'Twitter',   href: 'https://x.com/legalterminus',                      icon: <FaTwitter size={20} /> },
  { name: 'Instagram', href: 'https://www.instagram.com/legalterminus/',          icon: <FaInstagram size={20} /> },
  { name: 'YouTube',   href: 'https://www.youtube.com/@LegalTerminus',            icon: <FaYoutube size={20} /> },
];

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

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo submit — replace with actual submit logic
    alert('Thanks — form submitted (demo).');
    setForm({ fullName: '', company: '', phone: '', email: '', subject: '', message: '' });
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

            <form onSubmit={handleSubmit} className="zen-form">
              <div className="zen-grid">
                {[
                  { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Your full name', delay: '0.1s' },
                  { label: 'Company / Organization *', name: 'company', type: 'text', placeholder: 'Company name', required: true, delay: '0.15s' },
                  { label: 'Phone *', name: 'phone', type: 'tel', placeholder: '+1 (555) 555-5555', required: true, delay: '0.2s' },
                  { label: 'Company email *', name: 'email', type: 'email', placeholder: 'you@company.com', required: true, delay: '0.25s' },
                  { label: 'Your Subject *', name: 'subject', type: 'text', placeholder: 'Short subject', required: true, full: true, delay: '0.3s' }
                ].map((field, index) => (
                  <label key={index} className={`zen-field ${field.full ? 'full' : ''} zen-fade-in`} style={{ '--zen-delay': field.delay }}>
                    <span className="zen-label">{field.label}</span>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  </label>
                ))}

                <label className="zen-field full zen-fade-in" style={{ '--zen-delay': '0.35s' }}>
                  <span className="zen-label">Message *</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    rows="6"
                    required
                  />
                </label>
              </div>

              <div className="zen-form-actions zen-fade-in" style={{ '--zen-delay': '0.4s' }}>
                <button type="submit" className="zen-submit">
                  Submit Now
                  <span className="zen-submit-arrow" aria-hidden>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
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
