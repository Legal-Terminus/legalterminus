import React from "react";
import "./TMRenewBreadcrum.css";

const Breadcrum = () => {
  return (
    <section className="Tm-hero">
      <div className="Tm-container">

        {/* LEFT CONTENT */}
        <div className="Tm-content">

          <span className="Tm-tag">
            Trademark Renewal
          </span>

          <h1 className="Tm-title">
            Trademark Renewal
            <span> in India</span>
          </h1>

          <p className="Tm-description">
            Legal Terminus can help you with obtaining Trademark Renewal in India for your organization, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 2,999/-.
          </p>

          <div className="Tm-features">
            <div className="lt-feature-item"> Continued Legal Protection</div>
            <div className="lt-feature-item"> Prevents Removal from Register</div>
            <div className="lt-feature-item"> Maintains Exclusive Rights</div>
            <div className="lt-feature-item"> Protects Brand Value</div>
          </div>

          <div className="Tm-highlights">
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
        <aside className="Tm-form-wrapper">
          <div className="Tm-form-card">

            <h3 className="lt-form-title">
              Get Expert Assistance
            </h3>

            <p className="lt-form-subtitle">
              Talk to our Trademark renewal expert
            </p>

            <form
              className="Tm-form"
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
