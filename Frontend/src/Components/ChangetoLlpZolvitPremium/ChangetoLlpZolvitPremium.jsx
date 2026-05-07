import React from "react";
import "./ChangetoLlpZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="llpzp-section">
      <div className="llpzp-container">
        <div className="llpzp-card">

          {/* Left illustration */}
          <div className="llpzp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="llpzp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="llpzp-content">

            {/* Title + subtitle */}
            <header className="llpzp-header">
              <h2 className="llpzp-title">
                Legal Terminus{" "}
                <span className="llpzp-title-highlight">Priority</span>{" "}
                <span className="llpzp-title-icon">⚖️</span>
              </h2>
              <p className="llpzp-subtitle">
                Get your LLP registered faster with Legal Terminus’ expert-handled
                process—designed for founders who want a smooth setup without delays.
              </p>
            </header>

            {/* Features */}
            <section className="llpzp-section-block">
              <h3 className="llpzp-label">What You Get:</h3>
              <ul className="llpzp-list llpzp-features-list">
                <li className="llpzp-list-item">
                  <span className="llpzp-list-icon">🧑‍⚖️</span>
                  End-to-end assistance for a quick and compliant LLP setup.
                </li>
                <li className="llpzp-list-item">
                  <span className="llpzp-list-icon">📑</span>
                  Guidance on key filings and legal formalities.
                </li>
                <li className="llpzp-list-item">
                  <span className="llpzp-list-icon">⏱️</span>
                  Stay on track with due dates and documentation.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="llpzp-section-block">
              <h3 className="llpzp-label">Important Notes:</h3>
              <div className="llpzp-note-box">
                <ul className="llpzp-note-list">
                  <li className="llpzp-note-item">
                    We prioritize your preferred LLP name and conduct a preliminary name check before submission.
                  </li>
                  <li className="llpzp-note-item">
                    If your name is rejected, our experts will suggest legally compliant alternative names for faster approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="llpzp-cta-row">
              <button className="llpzp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
