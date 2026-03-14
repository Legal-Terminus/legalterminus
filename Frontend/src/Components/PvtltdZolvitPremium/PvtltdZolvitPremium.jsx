import React from "react";
import "./PvtltdZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          {/* Left illustration */}
          <div className="zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="zp-content">

            {/* Title + subtitle */}
            <header className="zp-header">
              <h2 className="zp-title">
                Legal Terminus{" "}
                <span className="zp-title-highlight">Priority</span>{" "}
                <span className="zp-title-icon">⚖️</span>
              </h2>
              <p className="zp-subtitle">
               Move fast without breaking compliance. Our expert-handled process is built for founders who don't have time to waste — zero back-and-forth, zero confusion.              </p>
            </header>

            {/* Features */}
            <section className="zp-section-block">
              <h3 className="zp-label">What You Get:</h3>
              <ul className="zp-list zp-features-list">
                <li className="zp-list-item">
                  <span className="zp-list-icon">🧑‍⚖️</span>
                 Expert-handled process from Day 1 — we own the paperwork so you don't have to.</li>
                <li className="zp-list-item">
                  <span className="zp-list-icon">📑</span>
                  Hassle-Free Compliance Support — one dedicated point of contact throughout.
                </li>
                <li className="zp-list-item">
                  <span className="zp-list-icon">⏱️</span>
                  Proactive Reminder System — never miss a deadline or pay a late penalty.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="zp-section-block">
              <h3 className="zp-label">Important Notes:</h3>
              <div className="zp-note-box">
                <ul className="zp-note-list">
                  <li className="zp-note-item">
                    We prioritise your preferred company name and run a preliminary name check before submission to MCA.
                  </li>
                  <li className="zp-note-item">
                    In case of name rejection by the RoC, our experts will recommend legally compliant alternative names to ensure swift approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="zp-cta-row">
              <button className="zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="zp-pricing">
              <span className="zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
