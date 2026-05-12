import React from "react";
import "./IncorptionBreadcrum.css";

const IncorptionBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">
        {/* LEFT CONTENT */}
        <div className="lt-public-content">
          <span className="lt-public-tag">
            Incorporation Of Wholly Owned Subsidiary
          </span>

          <h1 className="lt-public-title">
            Incorporation Of Wholly Owned Subsidiary
            <span> in India</span>
          </h1>

          <p className="lt-public-description">
            Legal Terminus can help you with Incorporation of Wholly Owned Subsidiary (WOS) in India, as and when required, in a hassle-free manner within a reasonable time span. We provide expert assistance to meet your business setup needs in India.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item"> 7 Steps Registration</div>
            <div className="lt-feature-item"> 100% of the shares are held by a foreign company</div>
            <div className="lt-feature-item"> At least 2 directors, & 1 must be an Indian resident</div>
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
              <h3>5+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <aside className="lt-public-form-wrapper">
          <div className="lt-public-form-card">
            <h3 className="lt-form-title">Get Expert Assistance</h3>

            <p className="lt-form-subtitle">
              Talk to our expert
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

              <button type="submit">Book Free Consultation</button>
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

export default IncorptionBreadcrum;
