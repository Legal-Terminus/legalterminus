import React, { useState } from "react";
import "./PublicBreadcrum.css";

const PublicBreadcrum = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="pub-ltd-hero">
      <div className="pub-ltd-container">

        {/* LEFT CONTENT */}
        <div className="pub-ltd-content">

          <span className="pub-ltd-tag">
            Public Limited Company Registration
          </span>

          <h1 className="pub-ltd-title">
            Public Limited Company Registration
            <span className="pub-ltd-title-india"> in India</span>
            <br />
            <span className="pub-ltd-tagline">Fast, Compliant &amp; Built to Scale</span>
          </h1>

          <p className="pub-ltd-description">
            Legal Terminus can help you with Public Limited Company Registration in India, as and when required, in a hassle-free manner within a reasonable time span. We provide expert assistance to meet your business setup needs in India.
          </p>

          <div className="pub-ltd-features">
            <div className="pub-ltd-feature-item"> Minimum 7 Shareholders Required</div>
            <div className="pub-ltd-feature-item"> Minimum 3 Directors Required</div>
            <div className="pub-ltd-feature-item"> 15 to 20 Working Days</div>
            <div className="pub-ltd-feature-item"> High Business Credibility</div>
          </div>

          <div className="pub-ltd-highlights">
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
        <aside className="pub-ltd-form-wrapper">
          <div className="pub-ltd-form-card">

            <h3 className="pub-ltd-form-title">Get Expert Assistance</h3>

            <p className="pub-ltd-form-subtitle">
              Talk to our expert
            </p>

            {submitted ? (
              <div className="pub-ltd-form-success" role="alert">
                <p>✅ Thank you! Our team will contact you shortly.</p>
              </div>
            ) : null}

            <form
              className="pub-ltd-form"
              onSubmit={handleSubmit}
              style={submitted ? { display: "none" } : undefined}
            >
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email Address" required />
              <input type="tel" placeholder="Mobile Number" required />

              <select required>
                <option value="">Select Your State</option>
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

              <div className="pub-ltd-whatsapp-row">
                <label className="pub-ltd-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="pub-ltd-checkbox"></span>
                  <span className="pub-ltd-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">Book Free Consultation</button>
            </form>

            <p className="pub-ltd-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default PublicBreadcrum;
