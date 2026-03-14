import React from "react";
import "./CIRbreadcrum.css";

const Breadcrum = () => {
  return (
    <section className="at-public-hero">
      <div className="at-public-container">

        {/* LEFT CONTENT */}
        <div className="at-public-content">

          <span className="at-public-tag">
           Change in Registered Office Address 
          </span>

          <h1 className="at-public-title">
           Change in Registered Office Address (LLP) 
          </h1>

          <p className="at-public-description">
            Legal Terminus can help you with change in Registered Office Address of your LLP in a hassle-free manner within a reasonable time span and for competitive professional fee which starts from Rs. 2499/- excluding Govt. Fees.
          </p>

          <div className="at-public-features">
            <div className="at-feature-item"> Partner Approval Required</div>
            <div className="at-feature-item"> Filing with Registrar (ROC)</div>
            <div className="at-feature-item"> Address Proof & NOC Required</div>
            <div className="at-feature-item"> Additional Approval for Inter-State Shift</div>
          </div>

          <div className="at-public-highlights">
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
        <aside className="at-public-form-wrapper">
          <div className="at-public-form-card">

            <h3 className="at-form-title">
              Get Expert Assistance
            </h3>

            <p className="at-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="at-public-form"
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

              <div className="at-whatsapp-row">
                <label className="at-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="at-custom-checkbox"></span>
                  <span className="at-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="at-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default Breadcrum;
