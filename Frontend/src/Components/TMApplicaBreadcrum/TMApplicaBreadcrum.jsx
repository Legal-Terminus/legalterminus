import React from "react";
import "./TMApplicaBreadcrum.css";

const Breadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            TRADEMARK REGISTRATION IN INDIA
          </span>

          <h1 className="lt-public-title">
            Trademark Registration
            <span> in India</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus helps you secure your brand name, logo, or slogan — fast, right, and stress-free. We handle everything from trademark search to filing Form TM-A, so you don't have to decode government portals at 2 AM. Professional fees start at ₹1,499. Gov fees extra (₹4,500 for individuals/MSMEs, ₹9,000 for companies — per class).
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> Valuable Business Asset</div>
            <div className="lt-feature-item"> Valid for 10 Years</div>
            <div className="lt-feature-item"> Use ™ Symbol Immediately</div>
            <div className="lt-feature-item"> Legal Protection Against Infringement</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>2,000+</h3>
              <p>Trademarks Filed</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Process</p>
            </div>
            <div>
              <h3>5+</h3>
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
              Talk to our Trademark registration expert
            </p>

            <form
              className="lt-public-form"
              onSubmit={(e) => e.preventDefault()}
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
