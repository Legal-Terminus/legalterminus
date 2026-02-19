import React from "react";
import "./DPBreadcrum.css";

const DPBreadcrum = () => {
  return (
    <section className="DP-public-hero">
      <div className="DP-public-container">

        {/* LEFT CONTENT */}
        <div className="DP-public-content">

          <span className="DP-public-tag">
            Dissolve a Partnership Firm
          </span>

          <h1 className="DP-public-title">
            Winding Up of a Partnership Firm
          </h1>

          <p className="DP-public-description">
            Legal Terminus can help you with Dissolution of Partnership Firm in a hassle-free manner within a reasonable time span and a competitive Professional fee which starts from Rs. 2999/-
          </p>

          <div className="DP-public-features">
            <div className="DP-feature-item"> Minimum 2 Partners Required</div>
            <div className="DP-feature-item"> Clear all business debts and liabilities</div>
            <div className="DP-feature-item"> Settle accounts among partners</div>
            <div className="DP-feature-item"> Close the firm legally with proper documentation</div>
          </div>

          <div className="DP-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Processes</p>
            </div>
            <div>
              <h3>5+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <aside className="DP-public-form-wrapper">
          <div className="DP-public-form-card">

            <h3 className="DP-form-title">
              Get Expert Assistance
            </h3>

            <p className="DP-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="DP-public-form"
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

              <div className="DP-whatsapp-row">
                <label className="DP-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="DP-custom-checkbox"></span>
                  <span className="DP-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="DP-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default DPBreadcrum;
