import React from "react";
import "./AddZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const AddZolvitPremium = () => {
  return (
    <section className="Add-zp-section">
      <div className="Add-zp-container">
        <div className="Add-zp-card">

          {/* Left illustration */}
          <div className="Add-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="Add-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="Add-zp-content">

            {/* Title + subtitle */}
            <header className="Add-zp-header">
              <h2 className="Add-zp-title">
                Legal Terminus{" "}
                <span className="Add-zp-title-highlight">Priority</span>{" "}
                <span className="Add-zp-title-icon">⚖️</span>
              </h2>
              <p className="Add-zp-subtitle">
               Add or remove a director smoothly with Legal Terminus’ expert-handled process, designed for companies that want structured management changes without compliance risks or delays.              </p>
            </header>

            {/* Features */}
            <section className="Add-zp-section-block">
              <h3 className="Add-zp-label">What You Get:</h3>
              <ul className="Add-zp-list Add-zp-features-list">
                <li className="Add-zp-list-item">
                  <span className="Add-zp-list-icon">🧑‍⚖️</span>
                    Complete assistance from drafting Board Resolution to filing required forms with the Registrar of Companies (ROC).                </li>
                <li className="Add-zp-list-item">
                  <span className="Add-zp-list-icon">📑</span>
                  Accurate documentation and compliance support, including director consent, disclosures, and timely MCA form submission.
                </li>
                <li className="Add-zp-list-item">
                  <span className="Add-zp-list-icon">⏱️</span>
                  Regular follow-ups and status updates to ensure the appointment or resignation is completed within the prescribed time limit.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="Add-zp-section-block">
              <h3 className="Add-zp-label">Important Notes:</h3>
              <div className="Add-zp-note-box">
                <ul className="Add-zp-note-list">
                  <li className="Add-zp-note-item">
                    Appointment of a new director requires written consent and necessary declarations as per the Companies Act.
                  </li>
                  <li className="Add-zp-note-item">
                    All changes must be filed with the ROC within the specified time period to avoid penalties.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="Add-zp-cta-row">
              <button className="Add-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="Add-zp-pricing">
              <span className="Add-zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default AddZolvitPremium;
