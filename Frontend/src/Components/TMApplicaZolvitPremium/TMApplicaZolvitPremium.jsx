import React from "react";
import "./TMApplicaZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="Tm-Application-zp-section">
      <div className="Tm-Application-zp-container">
        <div className="Tm-Application-zp-card">

          {/* Left illustration */}
          <div className="Tm-Application-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="Tm-Application-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="Tm-Application-zp-content">

            {/* Title + subtitle */}
            <header className="Tm-Application-zp-header">
              <h2 className="Tm-Application-zp-title">
                Legal Terminus{" "}
                <span className="Tm-Application-zp-title-highlight">Priority</span>{" "}
                <span className="Tm-Application-zp-title-icon">⚖️</span>
              </h2>
              <p className="Tm-Application-zp-subtitle">
               Get your trademark filed faster with Legal Terminus' expert-handled process — made for founders, creators, and businesses who value speed and accuracy.</p>
            </header>

            {/* Features */}
            <section className="Tm-Application-zp-section-block">
              <h3 className="Tm-Application-zp-label">What You Get:</h3>
              <ul className="Tm-Application-zp-list Tm-Application-zp-features-list">
                <li className="Tm-Application-zp-list-item">
                  <span className="Tm-Application-zp-list-icon">📑</span>
                 Expert-handled, end-to-end trademark filing from search to certificate</li>
                <li className="Tm-Application-zp-list-item">
                  <span className="Tm-Application-zp-list-icon">🔎</span>
                  Hassle-Free Compliance — we handle the registry communication for you
                </li>
                <li className="Tm-Application-zp-list-item">
                  <span className="Tm-Application-zp-list-icon">⏰</span>
                  Smart Reminder Policy — we track your trademark status and alert you at every stage</li>
              </ul>
            </section>

            {/* Note */}
            <section className="Tm-Application-zp-section-block">
              <h3 className="Tm-Application-zp-label">Important Notes:</h3>
              <div className="Tm-Application-zp-note-box">
                <ul className="Tm-Application-zp-note-list">
                  <li className="Tm-Application-zp-note-item">
                    We conduct a comprehensive trademark search before filing to maximise your chances of approval.
                  </li>
                  <li className="Tm-Application-zp-note-item">
                    In case of a similar existing mark, our experts will recommend legally sound alternative marks to ensure your application goes through.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="Tm-Application-zp-cta-row">
              <button className="Tm-Application-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="Tm-Application-zp-pricing">
              <span className="Tm-Application-zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
