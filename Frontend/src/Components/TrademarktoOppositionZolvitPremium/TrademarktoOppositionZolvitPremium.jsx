import React from "react";
import "./TrademarktoOppositionZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TradeLicenseZolvitPremium = () => {
  return (
    <section className="tlzp-section">
      <div className="tlzp-container">
        <div className="tlzp-card">

          {/* Left illustration */}
          <div className="tlzp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Trade License Registration by Legal Terminus"
              className="tlzp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="tlzp-content">

            {/* Title + subtitle */}
            <header className="tlzp-header">
              <h2 className="tlzp-title">
                Legal Terminus{" "}
                <span className="tlzp-title-highlight">Priority</span>{" "}
                <span className="tlzp-title-icon">⚖️</span>
              </h2>
              <p className="tlzp-subtitle">
                Protect your brand with Legal Terminus. Our experts handle the trademark opposition process to help you challenge similar or conflicting trademarks quickly and smoothly.
              </p>
            </header>

            {/* Features */}
            <section className="tlzp-section-block">
              <h3 className="tlzp-label">What You Get:</h3>
              <ul className="tlzp-list tlzp-features-list">
                <li className="tlzp-list-item">
                  <span className="tlzp-list-icon">🧑‍⚖️</span>
                  Expert Support: Our professionals prepare and file your trademark opposition with proper legal guidance.
                </li>
                <li className="tlzp-list-item">
                  <span className="tlzp-list-icon">📑</span>
                  Complete Documentation Help: We assist you in preparing all required documents and responses during the opposition process.
                </li>
                <li className="tlzp-list-item">
                  <span className="tlzp-list-icon">⏱️</span>
                  Timely Updates & Reminders: Stay informed about important deadlines and case updates so you never miss any step.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="tlzp-section-block">
              <h3 className="tlzp-label">Important Notes:</h3>
              <div className="tlzp-note-box">
                <ul className="tlzp-note-list">
                  <li className="tlzp-note-item">
                    We carefully review the conflicting trademark before filing the opposition.
                  </li>
                  <li className="tlzp-note-item">
                    Our team helps you prepare strong grounds to protect your brand rights.
                  </li>
                  <li className="tlzp-note-item">
                    If required, we guide you on the next legal steps during the opposition process.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="tlzp-cta-row">
              <button className="tlzp-cta-btn">
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
