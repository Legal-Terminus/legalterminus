import React from "react";
import "./PritoLlpZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="PLC-to-LLP-zp-section">
      <div className="PLC-to-LLP-zp-container">
        <div className="PLC-to-LLP-zp-card">

          {/* Left illustration */}
          <div className="PLC-to-LLP-zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
              className="PLC-to-LLP-zp-illustration"
            />
          </div>

          {/* Right content */}
          <div className="PLC-to-LLP-zp-content">

            {/* Title + subtitle */}
            <header className="PLC-to-LLP-zp-header">
              <h2 className="PLC-to-LLP-zp-title">
                Legal Terminus{" "}
                <span className="PLC-to-LLP-zp-title-highlight">Priority</span>{" "}
                <span className="PLC-to-LLP-zp-title-icon">⚖️</span>
              </h2>
              <p className="PLC-to-LLP-zp-subtitle">
                Convert your Private Limited Company into an LLP with Legal Terminus expert-guided support, designed for businesses seeking operational flexibility, reduced compliance burden, and cost-effective management.
              </p>
            </header>

            {/* Features */}
            <section className="PLC-to-LLP-zp-section-block">
              <h3 className="PLC-to-LLP-zp-label">What You Get:</h3>
              <ul className="PLC-to-LLP-zp-list PLC-to-LLP-zp-features-list">
                <li className="PLC-to-LLP-zp-list-item">
                  <span className="PLC-to-LLP-zp-list-icon">🧑‍⚖️</span>
                   Complete assistance for smooth conversion from Private Limited Company to LLP with proper legal compliance.
                </li>
                <li className="PLC-to-LLP-zp-list-item">
                  <span className="PLC-to-LLP-zp-list-icon">📑</span>
                  End-to-end documentation, drafting of LLP Agreement, and seamless filing with the Registrar.
                </li>
                <li className="PLC-to-LLP-zp-list-item">
                  <span className="PLC-to-LLP-zp-list-icon">⏱️</span>
                  Timely updates and structured compliance reminders to ensure a hassle-free conversion process.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="PLC-to-LLP-zp-section-block">
              <h3 className="PLC-to-LLP-zp-label">Important Notes:</h3>
              <div className="PLC-to-LLP-zp-note-box">
                <ul className="PLC-to-LLP-zp-note-list">
                  <li className="PLC-to-LLP-zp-note-item">
                    We prioritize your preferred business name and conduct a
                    preliminary name check before submission.
                  </li>
                  <li className="PLC-to-LLP-zp-note-item">
                    In case of name rejection, our experts will recommend
                    legally compliant alternative names to ensure approval.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="PLC-to-LLP-zp-cta-row">
              <button className="PLC-to-LLP-zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="PLC-to-LLP-zp-pricing">
              <span className="PLC-to-LLP-zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
