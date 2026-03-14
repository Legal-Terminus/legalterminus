import React from "react";
import "./TMZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="Tm-zp-section">
      <div className="Tm-zp-container">
        <div className="Tm-zp-card">

          {/* Left illustration */}
          <div className="Tm-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="Tm-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="Tm-zp-content">

            {/* Title + subtitle */}
            <header className="Tm-zp-header">
              <h2 className="Tm-zp-title">
                Legal Terminus{" "}
                <span className="Tm-zp-title-highlight">Priority</span>{" "}
                <span className="Tm-zp-title-icon">⚖️</span>
              </h2>
              <p className="Tm-zp-subtitle">
               Renew your trademark on time with Legal Terminus expert-handled process, designed to ensure your brand protection continues without interruption. A registered trademark in India is valid for 10 years. It must be renewed before expiry to maintain legal protection and exclusive rights.              </p>
            </header>

            {/* Features */}
            <section className="Tm-zp-section-block">
              <h3 className="Tm-zp-label">What You Get:</h3>
              <ul className="Tm-zp-list Tm-zp-features-list">
                <li className="Tm-zp-list-item">
                  <span className="Tm-zp-list-icon">🧑‍⚖️</span>
                   Complete assistance in filing your trademark renewal application with the Trademark Registry.                </li>
                <li className="Tm-zp-list-item">
                  <span className="Tm-zp-list-icon">📑</span>
                  Accurate documentation and timely submission to avoid penalties or removal from the register.
                </li>
                <li className="Tm-zp-list-item">
                  <span className="Tm-zp-list-icon">⏱️</span>
                  Timely renewal reminders so you never miss the renewal deadline.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="Tm-zp-section-block">
              <h3 className="Tm-zp-label">Important Notes:</h3>
              <div className="Tm-zp-note-box">
                <ul className="Tm-zp-note-list">
                  <li className="Tm-zp-note-item">
                    Trademark renewal is required every 10 years from the date of registration.
                  </li>
                  <li className="Tm-zp-note-item">
                    Renewal can be filed within 6 months before the expiry date.
                  </li>
                  <li className="Tm-zp-note-item">
                    There is a grace period of 6 months after expiry with additional late fees.
                  </li>
                  <li className="Tm-zp-note-item">
                    If not renewed within the allowed period, the trademark may be removed from the official register.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="Tm-zp-cta-row">
              <button className="Tm-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="Tm-zp-pricing">
              <span className="Tm-zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
