import React from "react";
import "./DissolveLLPPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const DissolveLLPPremium = () => {
  return (
    <section className="Dissllp-premium-section">
      <div className="Dissllp-premium-container">
        <div className="Dissllp-premium-card">

          {/* Illustration */}
          <div className="Dissllp-premium-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="Dissllp-premium-illustration"
            />
          </div>

          {/* Content */}
          <div className="Dissllp-premium-content">

            {/* Header */}
            <header className="Dissllp-premium-header">
              <h2 className="Dissllp-premium-title">
                Legal Terminus{" "}
                <span className="Dissllp-premium-title-highlight">Priority</span>{" "}
                <span className="Dissllp-premium-title-icon">⚖️</span>
              </h2>
              <p className="Dissllp-premium-subtitle">
                Get your Limited Liability Partnership dissolved smoothly with Legal Terminus’s expert-handled process, designed for partners who want a hassle-free and timely closure without unnecessary complications.
              </p>
            </header>

            {/* Features */}
            <section className="Dissllp-premium-block">
              <h3 className="Dissllp-premium-label">What You Get:</h3>
              <ul className="Dissllp-premium-list">
                <li className="Dissllp-premium-list-item">
                  <span className="Dissllp-premium-list-icon">🧑‍⚖️</span>
                  Priority handling by LLP dissolution experts
                </li>
                <li className="Dissllp-premium-list-item">
                  <span className="Dissllp-premium-list-icon">📑</span>
                  Complete assistance with documentation and compliance filings
                </li>
                <li className="Dissllp-premium-list-item">
                  <span className="Dissllp-premium-list-icon">⏱️</span>
                  Strong follow-up & status updates until final strike-off
                </li>
              </ul>
            </section>

            {/* Notes */}
            <section className="Dissllp-premium-block">
              <h3 className="Dissllp-premium-label">Important Notes:</h3>
              <div className="Dissllp-premium-note-box">
                <ul className="Dissllp-premium-note-list">
                  <li className="Dissllp-premium-note-item">
                    All liabilities must be cleared and bank accounts closed before initiating the dissolution process.
                  </li>
                  <li className="Dissllp-premium-note-item">
                    In case of any discrepancies or pending compliances, our experts provide proper guidance to ensure smooth approval and official strike-off by the Registrar of Companies.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="Dissllp-premium-cta-row">
              <button className="Dissllp-premium-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DissolveLLPPremium;
