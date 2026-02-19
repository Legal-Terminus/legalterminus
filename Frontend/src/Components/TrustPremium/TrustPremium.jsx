import React from "react";
import "./TrustPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const TrustPremium = () => {
  return (
    <section className="trust-premium-section">
      <div className="trust-premium-container">
        <div className="trust-premium-card">

          {/* Illustration */}
          <div className="trust-premium-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="trust-premium-illustration"
            />
          </div>

          {/* Content */}
          <div className="trust-premium-content">

            {/* Header */}
            <header className="trust-premium-header">
              <h2 className="trust-premium-title">
                Legal Terminus{" "}
                <span className="trust-premium-title-highlight">Priority</span>{" "}
                <span className="trust-premium-title-icon">⚖️</span>
              </h2>
              <p className="trust-premium-subtitle">
                Get your Trust registered quickly and smoothly with our expert-led process, specially designed for NGOs, charitable initiatives, and social organizations that value timely approval and proper compliance.
              </p>
            </header>

            {/* Features */}
            <section className="trust-premium-block">
              <h3 className="trust-premium-label">What You Get:</h3>
              <ul className="trust-premium-list">
                <li className="trust-premium-list-item">
                  <span className="trust-premium-list-icon">🧑‍⚖️</span>
                  Priority handling by trust law experts
                </li>
                <li className="trust-premium-list-item">
                  <span className="trust-premium-list-icon">📑</span>
                  Complete documentation & compliance assistance
                </li>
                <li className="trust-premium-list-item">
                  <span className="trust-premium-list-icon">⏱️</span>
                  Dedicated follow-up and status tracking
                </li>
              </ul>
            </section>

            {/* Notes */}
            <section className="trust-premium-block">
              <h3 className="trust-premium-label">Important Notes:</h3>
              <div className="trust-premium-note-box">
                <ul className="trust-premium-note-list">
                  <li className="trust-premium-note-item">
                    We assist in selecting and verifying your Trust name before filing the application.
                  </li>
                  <li className="trust-premium-note-item">
                    In case of objections or clarifications from the authority, our experts guide you with proper solutions to ensure smooth approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="trust-premium-cta-row">
              <button className="trust-premium-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustPremium;
