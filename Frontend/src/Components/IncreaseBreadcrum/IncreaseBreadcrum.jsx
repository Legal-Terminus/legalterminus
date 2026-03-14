import React from "react";
import "./IncreaseBreadcrum.css";

const IncreaseBreadcrum = () => {
  return (
    <section className="Increase-public-hero">
      <div className="Increase-public-container">

        {/* LEFT CONTENT */}
        <div className="Increase-public-content">

          <span className="Increase-public-tag">
            Increase Authorized Share Capital
          </span>

          <h1 className="Increase-public-title">
            Increase in Authorised Capital (Company)
          </h1>

          <p className="Increase-public-description">
            Legal Terminus can help you with Increase Authorized Share Capital of your company in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 2499/-.
          </p>

          <div className="Increase-public-features">
            <div className="Increase-feature-item"> Business Expansion Support</div>
            <div className="Increase-feature-item"> Improved Investment Opportunities</div>
            <div className="Increase-feature-item"> Better Financial Flexibility</div>
            <div className="Increase-feature-item"> Enhanced Market Credibility</div>
          </div>

          <div className="Increase-public-highlights">
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
        <aside className="Increase-public-form-wrapper">
          <div className="Increase-public-form-card">

            <h3 className="Increase-form-title">
              Get Expert Assistance
            </h3>

            <p className="Increase-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="Increase-public-form"
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

              <div className="Increase-whatsapp-row">
                <label className="Increase-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="Increase-custom-checkbox"></span>
                  <span className="Increase-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="Increase-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default IncreaseBreadcrum;
