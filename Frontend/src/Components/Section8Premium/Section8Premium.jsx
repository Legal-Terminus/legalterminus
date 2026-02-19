import React from "react";
import "./Section8Premium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const Section8Premium = () => {
  return (
    <section className="s8-premium-section">
      <div className="s8-premium-container">
        <div className="s8-premium-card">

          {/* Illustration */}
          <div className="s8-premium-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="s8-premium-illustration"
            />
          </div>

          {/* Content */}
          <div className="s8-premium-content">

            {/* Header */}
            <header className="s8-premium-header">
              <h2 className="s8-premium-title">
                Legal Terminus{" "}
                <span className="s8-premium-title-highlight">Priority</span>{" "}
                <span className="s8-premium-title-icon">⚖️</span>
              </h2>
              <p className="s8-premium-subtitle">
                Register your Non-Profit Organization with expert guidance and a faster approval process. Legal Terminus ensures smooth incorporation under Section 8 of the Companies Act, 2013 — ideal for charitable, social, educational, and non-profit objectives.
              </p>
            </header>

            {/* Features */}
            <section className="s8-premium-block">
              <h3 className="s8-premium-label">What You Get:</h3>
              <ul className="s8-premium-list">
                <li className="s8-premium-list-item">
                  <span className="s8-premium-list-icon">🧑‍⚖️</span>
                  Dedicated expert handling for Section 8 incorporation
                </li>
                <li className="s8-premium-list-item">
                  <span className="s8-premium-list-icon">📑</span>
                  Drafting of MOA & AOA as per non-profit compliance
                </li>
                <li className="s8-premium-list-item">
                  <span className="s8-premium-list-icon">⏱️</span>
                  Timely follow-up & compliance coordination
                </li>
              </ul>
            </section>

            {/* Notes */}
            <section className="s8-premium-block">
              <h3 className="s8-premium-label">Important Notes:</h3>
              <div className="s8-premium-note-box">
                <ul className="s8-premium-note-list">
                  <li className="s8-premium-note-item">
                    The company must be formed for charitable, social, educational, or non-profit purposes.
                  </li>
                  <li className="s8-premium-note-item">
                    Profits cannot be distributed to members; they must be reinvested in the organization’s objectives.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="s8-premium-cta-row">
              <button className="s8-premium-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Section8Premium;
