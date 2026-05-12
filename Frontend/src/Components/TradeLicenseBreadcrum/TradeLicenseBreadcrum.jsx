import React from "react";
import "./TradeLicensebreadcrum.css";

const TradeLicenseBreadcrum = () => {
  return (
    <section className="lt-trade-hero">
      <div className="lt-trade-container">

        {/* LEFT CONTENT */}
        <div className="lt-trade-content">

          <span className="lt-trade-tag">
            Trade License Registration
          </span>

          <h1 className="lt-trade-title">
            Trade License Registration
            <br></br>
            <span> in India</span>
          </h1>

          <p className="lt-trade-description">
            Legal Terminus can help you with the Trade License Registration for your organization, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 2,999/- (excluding government fees).
          </p>

          <div className="lt-trade-features">
            <div className="lt-feature-item"> Required 7 to 10 Working Days</div>
            <div className="lt-feature-item"> 1 Year Validity</div>
            <div className="lt-feature-item"> 5 Steps Processes</div>
            <div className="lt-feature-item"> Renewal at before 31st March of Every Year</div>
          </div>

          <div className="lt-trade-highlights">
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
        <aside className="lt-trade-form-wrapper">
          <div className="lt-trade-form-card">

            <h3 className="lt-form-title">
              Get Expert Assistance
            </h3>

            <p className="lt-form-subtitle">
              Talk to our Trade License registration expert
            </p>

            <form
              className="lt-trade-form"
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

export default TradeLicenseBreadcrum;
