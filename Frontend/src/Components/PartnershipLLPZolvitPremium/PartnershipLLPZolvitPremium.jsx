import React from "react";
import "./PartnershipLLPZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const PartnershipLLPZolvitPremium = () => {
  return (
    <section className="partnership-llp-zp-section">
      <div className="partnership-llp-zp-container">
        <div className="partnership-llp-zp-card">

          {/* Left illustration */}
          <div className="partnership-llp-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="partnership-llp-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="partnership-llp-zp-content">

            {/* Title + subtitle */}
            <header className="partnership-llp-zp-header">
              <h2 className="partnership-llp-zp-title">
                Legal Terminus{" "}
                <span className="partnership-llp-zp-title-highlight">Priority</span>{" "}
                <span className="partnership-llp-zp-title-icon">⚖️</span>
              </h2>
              <p className="partnership-llp-zp-subtitle">
                Convert your Partnership Firm into a Private Limited Company smoothly with our expert-managed process, designed for businesses that want better growth, credibility, and legal protection.
              </p>
            </header>

            {/* Features */}
            <section className="partnership-llp-zp-section-block">
              <h3 className="partnership-llp-zp-label">What You Get:</h3>
              <ul className="partnership-llp-zp-list partnership-llp-zp-features-list">
                <li className="partnership-llp-zp-list-item">
                  <span className="partnership-llp-zp-list-icon">🧑‍⚖️</span>
                  Expert handling of complete conversion process
                </li>
                <li className="partnership-llp-zp-list-item">
                  <span className="partnership-llp-zp-list-icon">📑</span>
                  End-to-end documentation and compliance support
                </li>
                <li className="partnership-llp-zp-list-item">
                  <span className="partnership-llp-zp-list-icon">⏱️</span>
                  Dedicated follow-up and regular status updates
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="partnership-llp-zp-section-block">
              <h3 className="partnership-llp-zp-label">Important Notes:</h3>
              <div className="partnership-llp-zp-note-box">
                <ul className="partnership-llp-zp-note-list">
                  <li className="partnership-llp-zp-note-item">
                    We assist in checking name availability and reserving your preferred company name before filing.
                  </li>
                  <li className="partnership-llp-zp-note-item">
                    Our team ensures proper transfer of assets, liabilities, and business structure as per legal requirements.
                  </li>
                  <li className="partnership-llp-zp-note-item">
                    In case of any query or objection from authorities, we provide complete support until approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="partnership-llp-zp-cta-row">
              <button className="partnership-llp-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipLLPZolvitPremium;
