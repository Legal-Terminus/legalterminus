import React from "react";
import "./CIOpremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="cp-section">
      <div className="cp-container">
        <div className="cp-card">

          {/* Left illustration */}
          <div className="cp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="cp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="cp-content">

            {/* Title + subtitle */}
            <header className="cp-header">
              <h2 className="cp-title">
                Legal Terminus{" "}
                <span className="cp-title-highlight">Priority</span>{" "}
                <span className="cp-title-icon">⚖️</span>
              </h2>
              <p className="cp-subtitle">
               Update your LLP’s business activities smoothly with Legal Terminus’ expert-handled process, designed for growing businesses that want to expand legally without compliance risks or delays.              </p>
            </header>

            {/* Features */}
            <section className="cp-section-block">
              <h3 className="cp-label">What You Get:</h3>
              <ul className="cp-list cp-features-list">
                <li className="cp-list-item">
                  <span className="cp-list-icon">🧑‍⚖️</span>
                  Complete assistance from drafting partner resolution to amending the LLP Agreement and filing required forms with the Registrar.
                </li>
                <li className="cp-list-item">
                  <span className="cp-list-icon">📑</span>
                  Accurate documentation and hassle-free filing support to officially record the change in business activities.
                </li>
                <li className="cp-list-item">
                  <span className="cp-list-icon">⏱️</span>
                  Timely follow-ups and regular updates to ensure quick approval and uninterrupted business operations.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="cp-section-block">
              <h3 className="cp-label">Important Notes:</h3>
              <div className="cp-note-box">
                <ul className="cp-note-list">
                  <li className="cp-note-item">
                    Partner approval is mandatory before changing or adding new business activities in the LLP.
                  </li>
                  <li className="cp-note-item">
                    The updated LLP Agreement must be filed with the Registrar within the prescribed time limit to avoid penalties.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="cp-cta-row">
              <button className="cp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="cp-pricing">
              <span className="cp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
