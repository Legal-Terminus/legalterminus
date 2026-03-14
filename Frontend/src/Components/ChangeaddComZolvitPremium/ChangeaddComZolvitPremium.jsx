import React from "react";
import "./ChangeaddComZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ChangeaddComZolvitPremium= () => {
  return (
    <section className="Change-add-com-zp-section">
      <div className="Change-add-com-zp-container">
        <div className="Change-add-com-zp-card">

          {/* Left illustration */}
          <div className="Change-add-com-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="Change-add-com-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="Change-add-com-zp-content">

            {/* Title + subtitle */}
            <header className="Change-add-com-zp-header">
              <h2 className="Change-add-com-zp-title">
                Legal Terminus{" "}
                <span className="Change-add-com-zp-title-highlight">Priority</span>{" "}
                <span className="Change-add-com-zp-title-icon">⚖️</span>
              </h2>
              <p className="Change-add-com-zp-subtitle">
               Change your Company’s Registered Office Address quickly with Legal Terminus’ expert-handled process, designed for businesses that want a seamless transition without compliance delays.
              </p>
            </header>

            {/* Features */}
            <section className="Change-add-com-zp-section-block">
              <h3 className="Change-add-com-zp-label">What You Get:</h3>
              <ul className="Change-add-com-zp-list Change-add-com-zp-features-list">
                <li className="Change-add-com-zp-list-item">
                  <span className="Change-add-com-zp-list-icon">🧑‍⚖️</span>
                  Complete assistance from drafting Board Resolution to final approval and updating records with the Registrar of Companies (RoC).
                </li>
                <li className="Change-add-com-zp-list-item">
                  <span className="Change-add-com-zp-list-icon">📑</span>
                  Hassle-Free Documentation & Filing Support to ensure accurate submission of required forms like INC-22 and MGT-14 (if applicable).
                </li>
                <li className="Change-add-com-zp-list-item">
                  <span className="Change-add-com-zp-list-icon">⏱️</span>
                  Strong Follow-Up & Reminder Policy to keep your address change process on track and fully compliant within statutory timelines.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="Change-add-com-zp-section-block">
              <h3 className="Change-add-com-zp-label">Important Notes:</h3>
              <div className="Change-add-com-zp-note-box">
                <ul className="Change-add-com-zp-note-list">
                  <li className="Change-add-com-zp-note-item">
                    We verify all address proofs and supporting documents before filing to avoid rejection or resubmission.
                  </li>
                  <li className="Change-add-com-zp-note-item">
                    In case of any query raised by the RoC, our experts handle clarification and resubmission promptly to ensure smooth approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="Change-add-com-zp-cta-row">
              <button className="Change-add-com-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="Change-add-com-zp-pricing">
              <span className="Change-add-com-zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangeaddComZolvitPremium;
