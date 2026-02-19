import React from "react";
import "./DissolvePrivatePremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const DissolvePrivatePremium = () => {
  return (
    <section className="DissolvePrivate-premium-section">
      <div className="DissolvePrivate-premium-container">
        <div className="DissolvePrivate-premium-card">

          {/* Illustration */}
          <div className="DissolvePrivate-premium-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="DissolvePrivate-premium-illustration"
            />
          </div>

          {/* Content */}
          <div className="DissolvePrivate-premium-content">

            {/* Header */}
            <header className="DissolvePrivate-premium-header">
              <h2 className="DissolvePrivate-premium-title">
                Legal Terminus{" "}
                <span className="DissolvePrivate-premium-title-highlight">Priority</span>{" "}
                <span className="DissolvePrivate-premium-title-icon">⚖️</span>
              </h2>
              <p className="DissolvePrivate-premium-subtitle">
                Close your Private Limited Company smoothly with Legal Terminus’s expert-guided dissolution process, designed for business owners who want a compliant and stress-free exit.
              </p>
            </header>

            {/* Features */}
            <section className="DissolvePrivate-premium-block">
              <h3 className="DissolvePrivate-premium-label">What You Get:</h3>
              <ul className="DissolvePrivate-premium-list">
                <li className="DissolvePrivate-premium-list-item">
                  <span className="DissolvePrivate-premium-list-icon">🧑‍⚖️</span>
                  Expert handling of board resolution & strike-off process
                </li>
                <li className="DissolvePrivate-premium-list-item">
                  <span className="DissolvePrivate-premium-list-icon">📑</span>
                  Complete documentation & RoC filing support
                </li>
                <li className="DissolvePrivate-premium-list-item">
                  <span className="DissolvePrivate-premium-list-icon">⏱️</span>
                  Timely follow-ups until final dissolution approval
                </li>
              </ul>
            </section>

            {/* Notes */}
            <section className="DissolvePrivate-premium-block">
              <h3 className="DissolvePrivate-premium-label">Important Notes:</h3>
              <div className="DissolvePrivate-premium-note-box">
                <ul className="DissolvePrivate-premium-note-list">
                  <li className="DissolvePrivate-premium-note-item">
                    All liabilities, statutory dues, and compliance filings must be cleared before initiating the strike-off application.
                  </li>
                  <li className="DissolvePrivate-premium-note-item">
                    In case of any RoC query or objection, our experts provide prompt clarification and necessary corrections to ensure smooth closure approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="DissolvePrivate-premium-cta-row">
              <button className="DissolvePrivate-premium-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DissolvePrivatePremium;
