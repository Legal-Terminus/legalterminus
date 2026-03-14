import React from "react";
import "./CICbreadcrum.css";

const Breadcrum = () => {
  return (
    <section className="cic-public-hero">
      <div className="cic-public-container">

        {/* LEFT CONTENT */}
        <div className="cic-public-content">

          <span className="cic-public-tag">
            Change Company Name
          </span>

          <h1 className="cic-public-title">
            Change In Name(Company)
          </h1>

          <p className="cic-public-description">
            Legal Terminus can help you with change company name in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 5999/-.
          </p>

          <div className="cic-public-features">
            <div className="cic-feature-item"> Minimum 2 Directors Required</div>
            <div className="cic-feature-item"> Separate Legal Entity</div>
            <div className="cic-feature-item"> Limited Liability Protection</div>
            <div className="cic-feature-item"> High Business Credibility</div>
          </div>

          <div className="cic-public-highlights">
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
        <aside className="cic-public-form-wrapper">
          <div className="cic-public-form-card">

            <h3 className="cic-form-title">
              Get Expert Assistance
            </h3>

            <p className="cic-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="cic-public-form"
              onSubmit={(e) => e.preventDefaucic()}
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

              <div className="cic-whatsapp-row">
                <label className="cic-whatsapp-label">
                  <input type="checkbox" defaucicChecked />
                  <span className="cic-custom-checkbox"></span>
                  <span className="cic-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consucication
              </button>
            </form>

            <p className="cic-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default Breadcrum;
