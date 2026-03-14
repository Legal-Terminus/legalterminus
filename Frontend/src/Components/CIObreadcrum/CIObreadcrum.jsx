import React from "react";
import "./CIObreadcrum.css";

const Breadcrum = () => {
  return (
    <section className="qt-public-hero">
      <div className="qt-public-container">

        {/* LEFT CONTENT */}
        <div className="qt-public-content">

          <span className="qt-public-tag">
           Changing the Objects of LLP 
          </span>

          <h1 className="qt-public-title">
           Change in Object (LLP)
          </h1>

          <p className="qt-public-description">
            Legal Terminus can help you with changing the objects of LLP, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 2499/- excluding Govt. Fees.
          </p>

          <div className="qt-public-features">
            <div className="qt-feature-item"> Partner Approval Required</div>
            <div className="qt-feature-item"> Amendment of LLP Agreement</div>
            <div className="qt-feature-item"> Filing with Registrar (ROC)</div>
            <div className="qt-feature-item"> Legal Expansion of Business Activities</div>
          </div>

          <div className="qt-public-highlights">
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
        <aside className="qt-public-form-wrapper">
          <div className="qt-public-form-card">

            <h3 className="qt-form-title">
              Get Expert Assistance
            </h3>

            <p className="qt-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="qt-public-form"
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

              <div className="qt-whatsapp-row">
                <label className="qt-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="qt-custom-checkbox"></span>
                  <span className="qt-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="qt-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default Breadcrum;
