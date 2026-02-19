import React from "react";
import "./PritoLlpBreadcrum.css";

const Breadcrum = () => {
  return (
    <section className="PLC-to-LLP-public-hero">
      <div className="PLC-to-LLP-public-container">

        {/* LEFT CONTENT */}
        <div className="PLC-to-LLP-public-content">

          <span className="PLC-to-LLP-public-tag">
            Conversion of Private Limited Company into LLP
          </span>

          <h1 className="PLC-to-LLP-public-title">
            Private Limited Company into LLP
          </h1>

          <p className="PLC-to-LLP-public-description">
            Legal Terminus can help you with Conversion of private limited company into LLP in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 14999/- excluding Govt. Fees. 
          </p>

          <div className="PLC-to-LLP-public-features">
            <div className="PLC-to-LLP-feature-item"> Minimum 2 Partners Required</div>
            <div className="PLC-to-LLP-feature-item"> 3 Simple Steps</div>
            <div className="PLC-to-LLP-feature-item"> Required 7 Working Days</div>
            <div className="PLC-to-LLP-feature-item"> High Business Credibility</div>
          </div>

          <div className="PLC-to-LLP-public-highlights">
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
        <aside className="PLC-to-LLP-public-form-wrapper">
          <div className="PLC-to-LLP-public-form-card">

            <h3 className="PLC-to-LLP-form-title">
              Get Expert Assistance
            </h3>

            <p className="PLC-to-LLP-form-subtitle">
              Talk to our expert
            </p>

            <form
              className="PLC-to-LLP-public-form"
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

              <div className="PLC-to-LLP-whatsapp-row">
                <label className="PLC-to-LLP-whatsapp-label">
                  <input type="checkbox" defaultChecked />
                  <span className="PLC-to-LLP-custom-checkbox"></span>
                  <span className="PLC-to-LLP-whatsapp-text">
                    Receive updates on <strong>WhatsApp</strong>
                  </span>
                </label>
              </div>

              <button type="submit">
                Book Free Consultation
              </button>
            </form>

            <p className="PLC-to-LLP-form-note">
              🔒 100% Confidential • No Spam • No Hidden Charges
            </p>

          </div>
        </aside>

      </div>
    </section>
  );
};

export default Breadcrum;
