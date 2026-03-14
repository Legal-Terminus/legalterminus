import React from "react";
import "./AddBreadcrum.css";

const AddBreadcrum = () => {
  return (
    <section className="Add-public-hero">
      <div className="Add-public-container">

        {/* LEFT CONTENT */}
        <div className="Add-public-content">

          <span className="Add-public-tag">
            Add or Remove a Director
          </span>

          <h1 className="Add-public-title">
            Add Or Remove A Director (Company)
          </h1>

          <p className="Add-public-description">
          Legal Terminus can help you add or remove a director in a hassle-free manner and within a reasonable time frame and a competitive professional fee which starts from Rs. 1499/-.          </p>
          <div className="Add-public-features">
            <div className="Add-feature-item"> Board & Shareholder Approval Required</div>
            <div className="Add-feature-item"> Filing with Registrar (ROC)</div>
            <div className="Add-feature-item"> Consent & Declaration Mandatory</div>
            <div className="Add-feature-item"> Update of Company Records</div>
          </div>

          <div className="Add-public-highlights">
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
        <aside className="Add-public-form-wrapper">
          <div className="Add-public-form-card">

            <h3 className="Add-form-title">
              Get Expert Assistance
            </h3>

            <p className="Add-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="Add-public-form"
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

              <div className="Add-whatsapp-row">
                <label className="Add-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="Add-custom-checkbox"></span>
                  <span className="Add-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="Add-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default AddBreadcrum;
