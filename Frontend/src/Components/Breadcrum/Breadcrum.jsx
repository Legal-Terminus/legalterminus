import React, { useState } from "react";
import "./Breadcrum.css";

const Breadcrum = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            PRIVATE LIMITED COMPANY REGISTRATION IN INDIA
          </span>

          <h1 className="lt-public-title">
            Private Limited Company Registration
            <span className="lt-title-india"> in India</span>
          </h1>

          <p className="lt-public-description">
            A Private Limited Company (Pvt. Ltd.) is India's most investor-loved business structure — registered under the Companies Act, 2013 and governed by the Ministry of Corporate Affairs (MCA). It gives your venture a separate legal identity, shields personal assets via limited liability, and opens doors to institutional funding that no proprietorship or partnership can access. In 2026, the entire incorporation process is 100% online through the SPICe+ portal — no office visits, no paper chaos. Government registration fee is nil for companies with Authorised Capital up to ₹15 Lakhs; stamp duty is state-specific and charged at actuals.
          </p>

          <p className="lt-features-label">Quick Trust Badges</p>
          <div className="lt-public-features">
            <div className="lt-feature-item">Separate Legal Entity</div>
            <div className="lt-feature-item">Limited Liability Protection</div>
            <div className="lt-feature-item">Investor-Ready Structure</div>
            <div className="lt-feature-item">Perpetual Succession</div>
          </div>

          <p className="lt-features-label">Receipts (the trust stats)</p>
          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Pvt Ltd companies incorporated</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>MCA21 V3 + SPICe+ AGILE-PRO-S</p>
            </div>
            <div>
              <h3>6 Years</h3>
              <p>of Companies Act expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <aside className="lt-public-form-wrapper">
          <div className="lt-public-form-card">

            <h3 className="lt-form-title">
              Get Expert Assistance
            </h3>

            <p className="lt-form-subtitle">
              Talk to our Private Limited Company registration expert
            </p>

            {submitted ? (
              <div className="lt-form-success" role="alert">
                <p>✅ Thank you! Our team will contact you shortly.</p>
              </div>
            ) : null}
            <form
              className="lt-public-form"
              onSubmit={handleSubmit}
              style={submitted ? { display: "none" } : undefined}
            >
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email Address" required />
              <input type="tel" placeholder="Mobile Number" required />

              <select required>
                <option value="">Select Your State</option>
                <option>Odisha</option>
                <option>Maharashtra</option>
                <option>Delhi</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>Other</option>
              </select>

              <select>
                <option value="">Preferred Call Time</option>
                <option>10:00 AM – 12:00 PM</option>
                <option>12:00 PM – 2:00 PM</option>
                <option>2:00 PM – 4:00 PM</option>
                <option>4:00 PM – 6:00 PM</option>
              </select>

              <div className="lt-whatsapp-row">
                <label className="lt-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="lt-custom-checkbox"></span>
                  <span className="lt-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="lt-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default Breadcrum;
