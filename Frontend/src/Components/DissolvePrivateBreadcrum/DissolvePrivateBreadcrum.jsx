import React from "react";
import "./DissolvePrivateBreadcrum.css";

const DissolvePrivateBreadcrum = () => {
  return (
    <section className="DissolvePrivate-public-hero">
      <div className="DissolvePrivate-public-container">

        {/* LEFT CONTENT */}
        <div className="DissolvePrivate-public-content">

          <span className="DissolvePrivate-public-tag">
             Dissolve a Private Limited Company
          </span>

          <h1 className="DissolvePrivate-public-title">
             Winding Up of a Private Limited Company
          </h1>

          <p className="DissolvePrivate-public-description">
            Legal Terminus can help you with the Process of Winding Up of a Company in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 18999/-
          </p>

          <div className="DissolvePrivate-public-features">
            <div className="DissolvePrivate-feature-item"> Minimum 2 Directors Required</div>
            <div className="DissolvePrivate-feature-item"> Process Takes 3 to 6 Months</div>
            <div className="DissolvePrivate-feature-item"> All Liabilities Must Be Cleared Before Closure</div>
            <div className="DissolvePrivate-feature-item"> Official Strike-Off by Registrar of Companies</div>
          </div>

          <div className="DissolvePrivate-public-highlights">
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
        <aside className="DissolvePrivate-public-form-wrapper">
          <div className="DissolvePrivate-public-form-card">

            <h3 className="DissolvePrivate-form-title">
              Get Expert Assistance
            </h3>

            <p className="DissolvePrivate-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="DissolvePrivate-public-form"
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

              <div className="DissolvePrivate-whatsapp-row">
                <label className="DissolvePrivate-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="DissolvePrivate-custom-checkbox"></span>
                  <span className="DissolvePrivate-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="DissolvePrivate-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default DissolvePrivateBreadcrum;
