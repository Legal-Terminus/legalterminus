import React from "react";
import "./CIRpremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="xp-section">
      <div className="xp-container">
        <div className="xp-card">

          {/* Left illustration */}
          <div className="xp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="xp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="xp-content">

            {/* Title + subtitle */}
            <header className="xp-header">
              <h2 className="xp-title">
                Legal Terminus{" "}
                <span className="xp-title-highlight">Priority</span>{" "}
                <span className="xp-title-icon">⚖️</span>
              </h2>
              <p className="xp-subtitle">
                Change your registered office address smoothly with Legal Terminus’ expert-handled process, designed for businesses that want a quick update without compliance risks or unnecessary delays.
              </p>
            </header>

            {/* Features */}
            <section className="xp-section-block">
              <h3 className="xp-label">What You Get:</h3>
              <ul className="xp-list xp-features-list">
                <li className="xp-list-item">
                  <span className="xp-list-icon">🧑‍⚖️</span>
                  Complete assistance from drafting Board Resolution to filing required MCA forms and obtaining approval from the Registrar of Companies (ROC).
                </li>
                <li className="xp-list-item">
                  <span className="xp-list-icon">📑</span>
                  Accurate documentation support, including preparation of resolutions, address proof collection, and proper filing as per company law requirements.
                </li>
                <li className="xp-list-item">
                  <span className="xp-list-icon">⏱️</span>
                  Timely follow-ups and regular updates to ensure your address change is completed efficiently and without penalties.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="xp-section-block">
              <h3 className="xp-label">Important Notes:</h3>
              <div className="xp-note-box">
                <ul className="xp-note-list">
                  <li className="xp-note-item">
                    The registered office change must be reported to the ROC within the prescribed time limit to avoid penalties.
                  </li>
                  <li className="xp-note-item">
                    Additional approvals may be required if the address change involves shifting to another city or state.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="xp-cta-row">
              <button className="xp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="xp-pricing">
              <span className="xp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
