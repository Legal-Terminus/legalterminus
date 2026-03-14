import React from "react";
import "./CICpremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="np-section">
      <div className="np-container">
        <div className="np-card">

          {/* Left illustration */}
          <div className="np-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="np-illustration"
            />
          </div>

          {/* Right content */}
          <div className="np-content">

            {/* Title + subtitle */}
            <header className="np-header">
              <h2 className="np-title">
                Legal Terminus{" "}
                <span className="np-title-highlight">Priority</span>{" "}
                <span className="np-title-icon">⚖️</span>
              </h2>
              <p className="np-subtitle">
               Change your company name smoothly with Legal Terminus’ expert-handled process, designed for businesses that want a professional transition without compliance risks or unnecessary delays.              </p>
            </header>

            {/* Features */}
            <section className="np-section-block">
              <h3 className="np-label">What You Get:</h3>
              <ul className="np-list np-features-list">
                <li className="np-list-item">
                  <span className="np-list-icon">🧑‍⚖️</span>
                  Complete assistance from passing Board Resolution to obtaining the new Certificate of Incorporation from the Registrar of Companies (ROC).                </li>
                <li className="np-list-item">
                  <span className="np-list-icon">📑</span>
                  Accurate documentation and filing support, including name reservation, alteration of MOA & AOA, and MCA form submission.
                </li>
                <li className="np-list-item">
                  <span className="np-list-icon">⏱️</span>
                  Timely follow-ups and regular status updates to ensure faster approval and minimal disruption to your business.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="np-section-block">
              <h3 className="np-label">Important Notes:</h3>
              <div className="np-note-box">
                <ul className="np-note-list">
                  <li className="np-note-item">
                    We conduct a preliminary name availability check before filing the application to improve approval chances.
                  </li>
                  <li className="np-note-item">
                    In case the proposed name is rejected, our experts suggest legally compliant alternative names to ensure smooth approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="np-cta-row">
              <button className="np-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="np-pricing">
              <span className="np-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
