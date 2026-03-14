import React from "react";
import "./ChangeObjectComZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ChangeObjectComZolvitPremium = () => {
  return (
    <section className="Change-ob-com-zp-section">
      <div className="Change-ob-com-zp-container">
        <div className="Change-ob-com-zp-card">

          {/* Left illustration */}
          <div className="Change-ob-com-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="Change-ob-com-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="Change-ob-com-zp-content">

            {/* Title + subtitle */}
            <header className="Change-ob-com-zp-header">
              <h2 className="Change-ob-com-zp-title">
                Legal Terminus{" "}
                <span className="Change-ob-com-zp-title-highlight">Priority</span>{" "}
                <span className="Change-ob-com-zp-title-icon">⚖️</span>
              </h2>
              <p className="Change-ob-com-zp-subtitle">
               Update your Company’s Object Clause smoothly with Legal Terminus’ expert-handled process, designed for businesses planning to add, modify, or realign their business activities without compliance delays.
              </p>
            </header>

            {/* Features */}
            <section className="Change-ob-com-zp-section-block">
              <h3 className="Change-ob-com-zp-label">What You Get:</h3>
              <ul className="Change-ob-com-zp-list Change-ob-com-zp-features-list">
                <li className="Change-ob-com-zp-list-item">
                  <span className="Change-ob-com-zp-list-icon">🧑‍⚖️</span>
                  Complete assistance from drafting Board and Shareholder Resolutions to altering the Memorandum of Association (MOA) and filing required forms with the Registrar of Companies (RoC).
                </li>
                <li className="Change-ob-com-zp-list-item">
                  <span className="Change-ob-com-zp-list-icon">📑</span>
                  Accurate Documentation & Filing Support to ensure proper preparation, approval, and submission of MGT-14 and other applicable forms.
                </li>
                <li className="Change-ob-com-zp-list-item">
                  <span className="Change-ob-com-zp-list-icon">⏱️</span>
                  Dedicated Follow-Up & Compliance Tracking to ensure timely processing and avoid unnecessary objections or delays.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="Change-ob-com-zp-section-block">
              <h3 className="Change-ob-com-zp-label">Important Notes:</h3>
              <div className="Change-ob-com-zp-note-box">
                <ul className="Change-ob-com-zp-note-list">
                  <li className="Change-ob-com-zp-note-item">
                    The change in object clause requires shareholder approval through a Special Resolution and filing with the RoC within prescribed timelines.
                  </li>
                  <li className="Change-ob-com-zp-note-item">
                    If any clarification or resubmission is required, our experts handle the response to ensure smooth approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="Change-ob-com-zp-cta-row">
              <button className="Change-ob-com-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="Change-ob-com-zp-pricing">
              <span className="Change-ob-com-zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangeObjectComZolvitPremium;
