import React from "react";
import "./SocietyPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const SocietyPremium = () => {
  return (
    <section className="Society-premium-section">
      <div className="Society-premium-container">
        <div className="Society-premium-card">

          {/* Illustration */}
          <div className="Society-premium-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="Society-premium-illustration"
            />
          </div>

          {/* Content */}
          <div className="Society-premium-content">

            {/* Header */}
            <header className="Society-premium-header">
              <h2 className="Society-premium-title">
                Legal Terminus{" "}
                <span className="Society-premium-title-highlight">Priority</span>{" "}
                <span className="Society-premium-title-icon">⚖️</span>
              </h2>
              <p className="Society-premium-subtitle">
                Get your Society registered quickly with our expert-managed process, specially designed for NGOs, associations, and social groups who want smooth and timely approval without delays.
              </p>
            </header>

            {/* Features */}
            <section className="Society-premium-block">
              <h3 className="Society-premium-label">What You Get:</h3>
              <ul className="Society-premium-list">
                <li className="Society-premium-list-item">
                  <span className="Society-premium-list-icon">🧑‍⚖️</span>
                  Priority handling by society registration experts
                </li>
                <li className="Society-premium-list-item">
                  <span className="Society-premium-list-icon">📑</span>
                  Complete documentation and compliance support
                </li>
                <li className="Society-premium-list-item">
                  <span className="Society-premium-list-icon">⏱️</span>
                  Dedicated follow-up and regular status updates
                </li>
              </ul>
            </section>

            {/* Notes */}
            <section className="Society-premium-block">
              <h3 className="Society-premium-label">Important Notes:</h3>
              <div className="Society-premium-note-box">
                <ul className="Society-premium-note-list">
                  <li className="Society-premium-note-item">
                    We help you choose and check your preferred Society name before filing the application.
                  </li>
                  <li className="Society-premium-note-item">
                    If there is any objection or name issue, our experts suggest suitable alternatives to ensure smooth approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="Society-premium-cta-row">
              <button className="Society-premium-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SocietyPremium;
