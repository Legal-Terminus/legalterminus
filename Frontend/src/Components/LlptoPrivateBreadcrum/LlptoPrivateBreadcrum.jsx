import React from "react";
import "./LlptoPrivateBreadcrum.css";

const LLPBreadcrum = () => {
  return (
    <section className="LLP-to-PLC-public-hero">
      <div className="LLP-to-PLC-public-container">

        {/* LEFT CONTENT */}
        <div className="LLP-to-PLC-public-content">

          <span className="LLP-to-PLC-public-tag">
           Conversion of LLP into Private Limited Company
          </span>

          <h1 className="LLP-to-PLC-public-title">
            Limited Liability Partnership into Private Limited Company 
          </h1>

          <p className="LLP-to-PLC-public-description">
            Legal Terminus can help you with Conversion of LLP into Private Limited Company in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 14999/- excluding Govt. Fees.
          </p>

          <div className="LLP-to-PLC-public-features">
            <div className="LLP-to-PLC-feature-item"> Minimum 2 Directors Required</div>
            <div className="LLP-to-PLC-feature-item"> 5 Steps Procedure</div>
            <div className="LLP-to-PLC-feature-item"> 40 - 50 Working Days</div>
            <div className="LLP-to-PLC-feature-item"> High Business Credibility</div>
          </div>

          <div className="LLP-to-PLC-public-highlights">
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
        <aside className="LLP-to-PLC-public-form-wrapper">
          <div className="LLP-to-PLC-public-form-card">

            <h3 className="LLP-to-PLC-form-title">
              Get Expert Assistance
            </h3>

            <p className="LLP-to-PLC-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="LLP-to-PLC-public-form"
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

              <div className="LLP-to-PLC-whatsapp-row">
                <label className="LLP-to-PLC-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="LLP-to-PLC-custom-checkbox"></span>
                  <span className="LLP-to-PLC-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="LLP-to-PLC-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default LLPBreadcrum;
