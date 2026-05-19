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
            Private Limited Company Registration
          </span>

          <h1 className="lt-public-title">
            Register Your Private Limited Company
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Fast, Hassle-Free &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            Your big idea deserves a legit structure. Legal Terminus handles your entire Private Limited Company Registration — from name approval to the Certificate of Incorporation — while you stay focused on what matters: building your business. Professional fees starting at ₹3,999* | Government fees extra. (*Prices exclusive of 18% GST and government/statutory charges.)
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Minimum 2 Directors Required</div>
            <div className="lt-feature-item"> Separate Legal Identity</div>
            <div className="lt-feature-item"> Limited Liability Protection</div>
            <div className="lt-feature-item"> High Business Credibility</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Process</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
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
