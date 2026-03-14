import React from "react";
import "./ProFOPCBreadcrum.css";

const Breadcrum = () => {
  return (
    <section className="ProPrietorship-opc-Bc-public-hero">
      <div className="ProPrietorship-opc-Bc-public-container">

        {/* LEFT CONTENT */}
        <div className="ProPrietorship-opc-Bc-public-content">

          <span className="ProPrietorship-opc-Bc-public-tag">
            Conversion of Proprietorship Firm To Private Limited
          </span>

          <h1 className="ProPrietorship-opc-Bc-public-title">
            Proprietorship Firm To Private Limited Company
            {/* <span> in India</span> */}
          </h1>

          <p className="ProPrietorship-opc-Bc-public-description">
            Legal Terminus can help you with conversion of proprietorship into private limited company in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 14999/- excluding Govt. Fees
          </p>

          <div className="ProPrietorship-opc-Bc-public-features">
            <div className="ProPrietorship-opc-Bc-feature-item">1 Directors Required</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Required 40 to 50 Working Days</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Easy Conversion Process</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Limited Liability Protection</div>
          </div>

          <div className="ProPrietorship-opc-Bc-public-highlights">
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
        <aside className="ProPrietorship-opc-Bc-public-form-wrapper">
          <div className="ProPrietorship-opc-Bc-public-form-card">

            <h3 className="ProPrietorship-opc-Bc-form-title">
              Get Expert Assistance
            </h3>

            <p className="ProPrietorship-opc-Bc-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="ProPrietorship-opc-Bc-public-form"
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

              <div className="ProPrietorship-opc-Bc-whatsapp-row">
                <label className="ProPrietorship-opc-Bc-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="ProPrietorship-opc-Bc-custom-checkbox"></span>
                  <span className="ProPrietorship-opc-Bc-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="ProPrietorship-opc-Bc-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default Breadcrum;
