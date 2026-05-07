import React from "react";
import "./FoodlicenseZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const FoodLicenseZolvitPremium = () => {
  return (
    <section className="foodlicensezp-section">
      <div className="foodlicensezp-container">
        <div className="foodlicensezp-card">

          {/* Left illustration */}
          <div className="foodlicensezp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Food License Registration by Legal Terminus"
              className="foodlicensezp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="foodlicensezp-content">

            {/* Title + subtitle */}
            <header className="foodlicensezp-header">
              <h2 className="foodlicensezp-title">
                Legal Terminus{" "}
                <span className="foodlicensezp-title-highlight">Priority</span>{" "}
                <span className="foodlicensezp-title-icon">⚖️</span>
              </h2>
              <p className="foodlicensezp-subtitle">
                Get your FSSAI Food License completed faster with Legal Terminus’ expert-handled process — designed for food business owners who value time and want a smooth, hassle-free setup.
              </p>
            </header>

            {/* Features */}
            <section className="foodlicensezp-section-block">
              <h3 className="foodlicensezp-label">What You Get:</h3>
              <ul className="foodlicensezp-list foodlicensezp-features-list">
                <li className="foodlicensezp-list-item">
                  <span className="foodlicensezp-list-icon">🧑‍⚖️</span>
                  End-to-end FSSAI license registration handled by our experts to ensure quick approval and minimal rejection risk.
                </li>
                <li className="foodlicensezp-list-item">
                  <span className="foodlicensezp-list-icon">📑</span>
                  Hassle-free documentation support and online application filing
                </li>
                <li className="foodlicensezp-list-item">
                  <span className="foodlicensezp-list-icon">⏱️</span>
                  Fast processing with regular updates till license issuance
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="foodlicensezp-section-block">
              <h3 className="foodlicensezp-label">Important Notes:</h3>
              <div className="foodlicensezp-note-box">
                <ul className="foodlicensezp-note-list">
                  <li className="foodlicensezp-note-item">
                    We review and verify your documents properly before submission to avoid delays or rejection.
                  </li>
                  <li className="foodlicensezp-note-item">
                    If the FSSAI authority asks for any clarification, our team will handle it on your behalf for smooth approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="foodlicensezp-cta-row">
              <button className="foodlicensezp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodLicenseZolvitPremium;
