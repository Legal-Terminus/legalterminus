import React, { useState } from "react";
import "./ContactUsSection.css";
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  state: "",
  preferredCallTime: "",
  message: "",
};

const ContactUsSection = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success"|"error", text }

  const FIELD_MAX = { fullName: 100, email: 254, phone: 15, message: 2000, state: 60, preferredCallTime: 50 };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const max = FIELD_MAX[name];
    setForm((prev) => ({ ...prev, [name]: max ? value.slice(0, max) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!form.phone || !form.email || !form.message) {
      setFeedback({ type: "error", text: "Phone, email, and message are required." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact-page" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed.");

      setFeedback({ type: "success", text: "Thank you! We'll call you back shortly." });
      setForm(EMPTY_FORM);
    } catch (err) {
      setFeedback({ type: "error", text: err.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contactussection-wrapper" aria-labelledby="contactus-heading">
      <div className="contactussection-left">
        <div className="contactussection-mapbox" aria-hidden="true">
          <iframe
            className="contactussection-iframe"
            title="Bhubaneswar map"
            src="https://maps.google.com/maps?q=Flat+No+1B+RK+Enclave+Plot+No+A%2F155+Saheed+Nagar+Bhubaneswar+Odisha+751007&output=embed"
            allowFullScreen
            loading="lazy"
          />
        </div>

        <div className="contactussection-eyebrow">Get In Touch</div>

        <h2 id="contactus-heading" className="contactussection-headline">
          Contact Us To Get Better Information
        </h2>

        <p className="contactussection-intro">
          Have a question or need assistance? We're happy to help. Send us a message or reach out using the contact details below.
        </p>

        <div className="contactussection-contactgrid">
          <article className="contactussection-card">
            <div className="contactussection-iconwrap" aria-hidden="true">
              <FaPhone />
            </div>
            <div className="contactussection-card-body">
              <h3 className="contactussection-card-title">Let's Talk</h3>
              <ul className="contactussection-list">
                <li><span className="contactussection-bullet" /> <strong>Phone:</strong> (+91) 8280045432 / 8280093456</li>
                <li><span className="contactussection-bullet" /> <strong>Location:</strong> Flat No 1B, RK Enclave, Plot No A/155, Saheed Nagar, Bhubaneswar, Odisha 751007</li>
                <li><span className="contactussection-bullet" /> <strong>Email:</strong> sales21@legalterminus.com</li>
              </ul>
            </div>
          </article>

          <article className="contactussection-card">
            <div className="contactussection-iconwrap" aria-hidden="true">
              <FiClock />
            </div>
            <div className="contactussection-card-body">
              <h3 className="contactussection-card-title">Open Hours</h3>
              <ul className="contactussection-list">
                <li><span className="contactussection-bullet" /> Mon – Sat: 10 AM — 7 PM</li>
                <li><span className="contactussection-bullet" /> Sunday: Closed</li>
              </ul>
            </div>
          </article>
        </div>
      </div>

      <aside className="contactussection-right" aria-labelledby="contactus-form-heading">
        <h3 id="contactus-form-heading" className="contactussection-form-heading">Request a Callback</h3>

        <form className="contactussection-form" onSubmit={handleSubmit} noValidate>
          <div className="contactussection-row">
            <input
              className="contactussection-field"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your Name"
              aria-label="Your name"
            />
            <input
              className="contactussection-field"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              aria-label="Your email"
              required
            />
          </div>

          <input
            className="contactussection-field"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Mobile Number"
            aria-label="Mobile number"
            required
          />

          <select
            className="contactussection-field contactussection-select"
            name="state"
            value={form.state}
            onChange={handleChange}
            aria-label="Select your state"
          >
            <option value="">Select Your State</option>
            <option>Odisha</option>
            <option>Maharashtra</option>
            <option>Delhi</option>
            <option>Karnataka</option>
            <option>Tamil Nadu</option>
            <option>Other</option>
          </select>

          <select
            className="contactussection-field contactussection-select"
            name="preferredCallTime"
            value={form.preferredCallTime}
            onChange={handleChange}
            aria-label="Preferred call time"
          >
            <option value="">Preferred Call Time</option>
            <option>10:00 AM – 12:00 PM</option>
            <option>12:00 PM – 2:00 PM</option>
            <option>2:00 PM – 4:00 PM</option>
            <option>4:00 PM – 6:00 PM</option>
          </select>

          <textarea
            className="contactussection-field contactussection-textarea"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            aria-label="Your message"
            required
            maxLength={2000}
          />

          {feedback && (
            <p
              style={{
                color: feedback.type === "success" ? "#166534" : "#991b1b",
                background: feedback.type === "success" ? "#dcfce7" : "#fee2e2",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "0.875rem",
                margin: "0 0 8px",
              }}
              role="alert"
            >
              {feedback.text}
            </p>
          )}

          <div className="contactussection-actions">
            <button className="contactussection-button" type="submit" disabled={loading}>
              {loading ? "Sending…" : "SEND"}
            </button>
            <button
              className="contactussection-ghost"
              type="button"
              onClick={() => { setForm(EMPTY_FORM); setFeedback(null); }}
              disabled={loading}
            >
              CLEAR
            </button>
          </div>
        </form>

        <div className="contactussection-mini" aria-hidden="true">
          <div className="contactussection-mini-item">
            <FaMapMarkerAlt /> <span>Bhubaneswar, Odisha</span>
          </div>
          <div className="contactussection-mini-item">
            <FaEnvelope /> <span>sales21@legalterminus.com</span>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default ContactUsSection;
