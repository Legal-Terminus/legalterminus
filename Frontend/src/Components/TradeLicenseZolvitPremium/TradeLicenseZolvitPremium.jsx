import React from "react";
import "./TradeLicenseZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TradeLicenseZolvitPremium = () => {
  return (
    <section className="tradezp-section">
      <div className="tradezp-container">
        <div className="tradezp-card">

          {/* Top two-column row: illustration + content */}
          <div className="tradezp-top-row">

            {/* Left illustration */}
            <div className="tradezp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Trade License Registration by Legal Terminus"
                className="tradezp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="tradezp-content">

              <header className="tradezp-header">
                <h2 className="tradezp-title">
                  Legal Terminus{" "}
                  <span className="tradezp-title-highlight">Priority</span>{" "}
                  <span className="tradezp-title-icon">⚖️</span>
                </h2>
                <p className="tradezp-subtitle">
                  Get your Trade License Registration completed faster with Legal Terminus’ expert-handled process — made for business owners who value time and want a smooth, delay-free setup.
                </p>
              </header>

              <section className="tradezp-section-block">
                <h3 className="tradezp-label">What You Get:</h3>
                <ul className="tradezp-list tradezp-features-list">
                  <li className="tradezp-list-item">
                    <span className="tradezp-list-icon">🧑‍⚖️</span>
                    End-to-end Trade License registration handled by our legal experts for quick approval and minimal delay risk.
                  </li>
                  <li className="tradezp-list-item">
                    <span className="tradezp-list-icon">📑</span>
                    Hassle-free documentation & application filing as per local municipal requirements
                  </li>
                  <li className="tradezp-list-item">
                    <span className="tradezp-list-icon">⏱️</span>
                    Fast processing with regular updates until your license is issued
                  </li>
                </ul>
              </section>

            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="tradezp-bottom-full">
            <h3 className="tradezp-label">Important Notes:</h3>
            <div className="tradezp-note-box">
              <ul className="tradezp-note-list">
                <li className="tradezp-note-item">
                  We review your details and documents properly before submission to avoid rejection or delays.
                </li>
                <li className="tradezp-note-item">
                  If any clarification is required by the municipal authority, our team handles the follow-up on your behalf for smooth approval.
                </li>
              </ul>
            </div>

            <div className="tradezp-cta-row">
              <button className="tradezp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TradeLicenseZolvitPremium;
