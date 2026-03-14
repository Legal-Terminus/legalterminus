import React from "react";
import "./WindupZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const WindupZolvitPremium = () => {
  return (
    <section className="Windup-PLC-zp-section">
      <div className="Windup-PLC-zp-container">
        <div className="Windup-PLC-zp-card">

          {/* Left illustration */}
          <div className="Windup-PLC-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="Windup-PLC-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="Windup-PLC-zp-content">

            {/* Title + subtitle */}
            <header className="Windup-PLC-zp-header">
              <h2 className="Windup-PLC-zp-title">
                Legal Terminus{" "}
                <span className="Windup-PLC-zp-title-highlight">Priority</span>{" "}
                <span className="Windup-PLC-zp-title-icon">⚖️</span>
              </h2>
              <p className="Windup-PLC-zp-subtitle">
Get your company registered faster with Legal Terminus expert-handled process, made for entrepreneurs who value time and want to avoid unnecessary delays.
              </p>
            </header>

            {/* Features */}
            <section className="Windup-PLC-zp-section-block">
              <h3 className="Windup-PLC-zp-label">What You Get:</h3>
              <ul className="Windup-PLC-zp-list Windup-PLC-zp-features-list">
                <li className="Windup-PLC-zp-list-item">
                  <span className="Windup-PLC-zp-list-icon">🧑‍⚖️</span>
                  Get your company registered faster with Legal Terminus expert-handled process, made for entrepreneurs who value time and want to avoid unnecessary delays.
                </li>
                <li className="Windup-PLC-zp-list-item">
                  <span className="Windup-PLC-zp-list-icon">📑</span>
                  Hassle-Free Compliance Solutions
                </li>
                <li className="Windup-PLC-zp-list-item">
                  <span className="Windup-PLC-zp-list-icon">⏱️</span>
                  Excellent Reminder Policy
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="Windup-PLC-zp-section-block">
              <h3 className="Windup-PLC-zp-label">Important Notes:</h3>
              <div className="Windup-PLC-zp-note-box">
                <ul className="Windup-PLC-zp-note-list">
                  <li className="Windup-PLC-zp-note-item">
                    We prioritize your preferred business name and conduct a
                    preliminary name check before submission.
                  </li>
                  <li className="Windup-PLC-zp-note-item">
                    In case of name rejection, our experts will recommend
                    legally compliant alternative names to ensure approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="Windup-PLC-zp-cta-row">
              <button className="Windup-PLC-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="Windup-PLC-zp-pricing">
              <span className="Windup-PLC-zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default WindupZolvitPremium;
