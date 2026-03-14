import React from "react";
import "./ChangeLlpZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ChangeLlpZolvitPremium = () => {
  return (
    <section className="ChangeLlp-zp-section">
      <div className="ChangeLlp-zp-container">
        <div className="ChangeLlp-zp-card">

          {/* Left illustration */}
          <div className="ChangeLlp-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="ChangeLlp-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="ChangeLlp-zp-content">

            {/* Title + subtitle */}
            <header className="ChangeLlp-zp-header">
              <h2 className="ChangeLlp-zp-title">
                Legal Terminus{" "}
                <span className="ChangeLlp-zp-title-highlight">Priority</span>{" "}
                <span className="ChangeLlp-zp-title-icon">⚖️</span>
              </h2>
              <p className="ChangeLlp-zp-subtitle">
               Change your LLP name quickly with Legal Terminus’ expert-handled process, designed for businesses that want a smooth transition without unnecessary delays.
              </p>
            </header>

            {/* Features */}
            <section className="ChangeLlp-zp-section-block">
              <h3 className="ChangeLlp-zp-label">What You Get:</h3>
              <ul className="ChangeLlp-zp-list ChangeLlp-zp-features-list">
                <li className="ChangeLlp-zp-list-item">
                  <span className="ChangeLlp-zp-list-icon">🧑‍⚖️</span>
                  Complete assistance from drafting partner resolution to final approval from the Registrar of Companies (RoC).
                </li>
                <li className="ChangeLlp-zp-list-item">
                  <span className="ChangeLlp-zp-list-icon">📑</span>
                  Hassle-Free Documentation & Filing Support to ensure accurate submission of RUN-LLP and Form 5.
                </li>
                <li className="ChangeLlp-zp-list-item">
                  <span className="ChangeLlp-zp-list-icon">⏱️</span>
                  Strong Follow-Up & Reminder Policy to keep your name change process on track without missing deadlines.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="ChangeLlp-zp-section-block">
              <h3 className="ChangeLlp-zp-label">Important Notes:</h3>
              <div className="ChangeLlp-zp-note-box">
                <ul className="ChangeLlp-zp-note-list">
                  <li className="ChangeLlp-zp-note-item">
                    We prioritize your preferred LLP name and conduct a thorough name availability check before submission.
                  </li>
                  <li className="ChangeLlp-zp-note-item">
                    In case of name rejection, our experts suggest legally compliant alternative names to improve approval chances.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="ChangeLlp-zp-cta-row">
              <button className="ChangeLlp-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="ChangeLlp-zp-pricing">
              <span className="ChangeLlp-zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangeLlpZolvitPremium;
