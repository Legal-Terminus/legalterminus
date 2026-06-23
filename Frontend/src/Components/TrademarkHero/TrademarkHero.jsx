import React, { useState } from "react";
import "./TrademarkHero.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const CALL_TIMES = [
  "9:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 1:00 PM",
  "1:00 PM – 2:00 PM",
  "2:00 PM – 3:00 PM",
  "3:00 PM – 4:00 PM",
  "4:00 PM – 5:00 PM",
  "5:00 PM – 6:00 PM",
  "6:00 PM – 7:00 PM",
];

const EMPTY = { fullName: "", email: "", phone: "", preferredCallTime: "" };

const TrademarkHero = () => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.phone || !form.email) {
      setError("Phone and email are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          preferredCallTime: form.preferredCallTime,
          subject: "Consultation request – trademark-registration",
          message: "Lead from trademark registration landing page",
          source: "trademark-application",
          sourceLabel: "Trademark Registration",
          whatsapp: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed.");

      setSubmitted(true);
      setForm(EMPTY);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tmh-hero">
      <div className="tmh-blob tmh-blob-1" aria-hidden="true" />
      <div className="tmh-blob tmh-blob-2" aria-hidden="true" />

      <div className="tmh-container">
        {/* ---------------- LEFT ---------------- */}
        <div className="tmh-content">
          <a href="/" className="tmh-logo">
            <img
              src="https://legalterminus.com/wp-content/uploads/2023/09/Legal-Terminus-LOGO-GIF_300-x-150.gif"
              alt="Legal Terminus"
            />
          </a>

          <h1 className="tmh-title">Your Brand Is Your Asset, Protect It Now!</h1>
          <p className="tmh-subtitle">Legal Terminus Experts Are Here to Help!</p>

          <div className="tmh-callout">
            <p>
              Experience the future of Trademark filing through
              <br />
              <span className="tmh-red">No.1</span>
              <br />
              Trademark Service provider in
              <br />
              <span className="tmh-red">Odisha.</span>
            </p>
          </div>

          <ul className="tmh-checklist">
            <li>
              <span className="tmh-ic">✅</span>
              <span>
                Enjoy the convenience of 100% online registration and the added trust of a local
                office visit. Complete your trademark registration process comfortably from home,
                and/ or <span className="tmh-link">visit our Bhubaneswar office</span> for a more
                personal touch.
              </span>
            </li>
            <li>
              <span className="tmh-ic">🔍</span>
              <span>
                Extensive Trademark Availability Search conducted before filing by{" "}
                <span className="tmh-link">Trademark Experts</span>.
              </span>
            </li>
            <li>
              <span className="tmh-ic">📋</span>
              <span>
                Experience <span className="tmh-link">Detailed Updates</span> throughout your
                trademark journey, from filing your application to receiving your Trademark
                Registration Certificate.
              </span>
            </li>
            <li>
              <span className="tmh-ic">🔄</span>
              <span>
                Easy <span className="tmh-link">Return and Grievance</span> Redressal Policy.
              </span>
            </li>
          </ul>
        </div>

        {/* ---------------- RIGHT (FORM) ---------------- */}
        <div className="tmh-form-col">
          <div className="tmh-form-card">
            <h3 className="tmh-form-title">
              <span className="tmh-form-title-accent">REGISTER YOUR</span> TRADEMARK TODAY
            </h3>

            {submitted ? (
              <div className="tmh-success" role="alert">
                <span>✅</span>
                <p>Thank you! Our team will contact you shortly.</p>
              </div>
            ) : (
              <form className="tmh-form" onSubmit={handleSubmit} noValidate>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Name"
                  maxLength={100}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  maxLength={254}
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  required
                  maxLength={15}
                />
                <select
                  name="preferredCallTime"
                  value={form.preferredCallTime}
                  onChange={handleChange}
                >
                  <option value="">Select a preferable time to call</option>
                  {CALL_TIMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>

                {error && <p className="tmh-error" role="alert">{error}</p>}

                <button type="submit" disabled={loading}>
                  {loading ? "SUBMITTING…" : "BOOK OUR FREE CONSULTATION"}
                </button>
              </form>
            )}
          </div>

          <div className="tmh-rating">
            <span className="tmh-google" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="34" height="34">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
                <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.47 14.97.5 12 .5a11 11 0 0 0-9.82 6.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z" />
              </svg>
            </span>
            <div className="tmh-rating-text">
              <p>Odisha&apos;s Top-Rated Platform for Legal, Tax, and Compliance Solutions.</p>
              <div className="tmh-rating-stars">
                <span className="tmh-stars">★★★★★</span>
                <strong>4.9/5</strong> Happy Reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrademarkHero;
