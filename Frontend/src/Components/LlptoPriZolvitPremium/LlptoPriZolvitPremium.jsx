import React from "react";
import "./LlptoPriZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="LLP-to-PLC-zp-section">
      <div className="LLP-to-PLC-zp-container">
        <div className="LLP-to-PLC-zp-card">

          {/* Left illustration */}
          <div className="LLP-to-PLC-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="LLP-to-PLC-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="LLP-to-PLC-zp-content">

            {/* Title + subtitle */}
            <header className="LLP-to-PLC-zp-header">
              <h2 className="LLP-to-PLC-zp-title">
                Legal Terminus{" "}
                <span className="LLP-to-PLC-zp-title-highlight">Priority</span>{" "}
                <span className="LLP-to-PLC-zp-title-icon">⚖️</span>
              </h2>
              <p className="LLP-to-PLC-zp-subtitle">
                Convert your LLP into a Private Limited Company with Legal Terminus expert-guided process, designed for businesses ready to scale, raise funding, and build stronger market credibility.
              </p>
            </header>

            {/* Features */}
            <section className="LLP-to-PLC-zp-section-block">
              <h3 className="LLP-to-PLC-zp-label">What You Get:</h3>
              <ul className="LLP-to-PLC-zp-list LLP-to-PLC-zp-features-list">
                <li className="LLP-to-PLC-zp-list-item">
                  <span className="LLP-to-PLC-zp-list-icon">🧑‍⚖️</span>
                  Smooth and structured conversion from LLP to Private Limited Company with complete legal support.
                </li>
                <li className="LLP-to-PLC-zp-list-item">
                  <span className="LLP-to-PLC-zp-list-icon">📑</span>
                  Complete documentation, drafting of MOA & AOA, and seamless ROC filing process.
                </li>
                <li className="LLP-to-PLC-zp-list-item">
                  <span className="LLP-to-PLC-zp-list-icon">⏱️</span>
                  Timely updates and dedicated compliance reminders to ensure no delays during conversion.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="LLP-to-PLC-zp-section-block">
              <h3 className="LLP-to-PLC-zp-label">Important Notes:</h3>
              <div className="LLP-to-PLC-zp-note-box">
                <ul className="LLP-to-PLC-zp-note-list">
                  <li className="LLP-to-PLC-zp-note-item">
                    We review your existing LLP details and check name availability before initiating the conversion process.
                  </li>
                  <li className="LLP-to-PLC-zp-note-item">
                    In case of name conflict or rejection, our experts suggest legally suitable alternative names to secure approval smoothly.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="LLP-to-PLC-zp-cta-row">
              <button className="LLP-to-PLC-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="LLP-to-PLC-zp-pricing">
              <span className="LLP-to-PLC-zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
