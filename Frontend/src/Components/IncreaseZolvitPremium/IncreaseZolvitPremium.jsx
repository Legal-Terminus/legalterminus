import React from "react";
import "./IncreaseZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const IncreaseZolvitPremium= () => {
  return (
    <section className="Increase-zp-section">
      <div className="Increase-zp-container">
        <div className="Increase-zp-card">

          {/* Left illustration */}
          <div className="Increase-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="Increase-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="Increase-zp-content">

            {/* Title + subtitle */}
            <header className="Increase-zp-header">
              <h2 className="Increase-zp-title">
                Legal Terminus{" "}
                <span className="Increase-zp-title-highlight">Priority</span>{" "}
                <span className="Increase-zp-title-icon">⚖️</span>
              </h2>
              <p className="Increase-zp-subtitle">
               Increase your Company’s Authorized Capital smoothly with Legal Terminus’ expert-handled process, designed for growing businesses that need quick compliance without unnecessary delays.              </p>
            </header>

            {/* Features */}
            <section className="Increase-zp-section-block">
              <h3 className="Increase-zp-label">What You Get:</h3>
              <ul className="Increase-zp-list Increase-zp-features-list">
                <li className="Increase-zp-list-item">
                  <span className="Increase-zp-list-icon">🧑‍⚖️</span>
                   Complete assistance from drafting Board Resolution and Shareholders’ Resolution to final filing with the Registrar of Companies (RoC).                </li>
                <li className="Increase-zp-list-item">
                  <span className="Increase-zp-list-icon">📑</span>
                   Hassle-Free Documentation & Filing Support including preparation and submission of required ROC forms and alteration of Memorandum of Association (MOA).                </li>
                <li className="Increase-zp-list-item">
                  <span className="Increase-zp-list-icon">⏱️</span>
                  Strong Follow-Up & Reminder Policy to ensure timely approval and avoid compliance penalties.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="Increase-zp-section-block">
              <h3 className="Increase-zp-label">Important Notes:</h3>
              <div className="Increase-zp-note-box">
                <ul className="Increase-zp-note-list">
                  <li className="Increase-zp-note-item">
                    We review your existing capital structure and ensure proper compliance under the Companies Act before filing.
                  </li>
                  <li className="Increase-zp-note-item">
                    Post-approval, we guide you on further steps such as share allotment and updating statutory registers, if required.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="Increase-zp-cta-row">
              <button className="Increase-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="Increase-zp-pricing">
              <span className="Increase-zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default IncreaseZolvitPremium;
