import React from "react";
import "./ChangeObjectComBreadcrum.css";

const ChangeObjectComBreadcrum = () => {
  return (
    <section className="Change-ob-Breadcrum-public-hero">
      <div className="Change-ob-Breadcrum-public-container">

        {/* LEFT CONTENT */}
        <div className="Change-ob-Breadcrum-public-content">

          <span className="Change-ob-Breadcrum-public-tag">
            Change in Object Clause of Company
          </span>

          <h1 className="Change-ob-Breadcrum-public-title">
            Change in Object (Company)
          </h1>

          <p className="Change-ob-Breadcrum-public-description">
          Legal Terminus can help you with change in object clause of company, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 2999/-
          </p>

          <div className="Change-ob-Breadcrum-public-features">
            <div className="Change-ob-Breadcrum-feature-item"> Expand or Modify Business Activities</div>
            <div className="Change-ob-Breadcrum-feature-item"> Legal Compliance with MCA Regulations</div>
            <div className="Change-ob-Breadcrum-feature-item"> Flexibility to Enter New Markets</div>
            <div className="Change-ob-Breadcrum-feature-item"> Stronger Business Alignment with Growth Strategy</div>
          </div>

          <div className="Change-ob-Breadcrum-public-highlights">
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
        <aside className="Change-ob-Breadcrum-public-form-wrapper">
          <div className="Change-ob-Breadcrum-public-form-card">

            <h3 className="Change-ob-Breadcrum-form-title">
              Get Expert Assistance
            </h3>

            <p className="Change-ob-Breadcrum-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="Change-ob-Breadcrum-public-form"
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

              <div className="Change-ob-Breadcrum-whatsapp-row">
                <label className="Change-ob-Breadcrum-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="Change-ob-Breadcrum-custom-checkbox"></span>
                  <span className="Change-ob-Breadcrum-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="Change-ob-Breadcrum-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default ChangeObjectComBreadcrum;
