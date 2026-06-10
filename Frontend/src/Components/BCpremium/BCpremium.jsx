import React from "react";
import "./BCpremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const BCPriority = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="GS1 Barcode Registration by Legal Terminus"
              className="opczp-illustration"
            />
          </div>

          <div className="opczp-content">

            <header className="opczp-header">
              <h2 className="opczp-title">
                Legal Terminus{" "}
                <span className="opczp-title-highlight">Priority</span>{" "}
                <span className="opczp-title-icon">⚖️</span>
              </h2>
              <p className="opczp-subtitle">
                Get your GS1 Barcode Registration completed faster with our expert-handled process — designed for businesses that need scan-ready product codes for retail, e-commerce, and global supply chains without the paperwork hassle.
              </p>
            </header>

            <section className="opczp-section-block">
              <h3 className="opczp-label">What You Get:</h3>
              <ul className="opczp-list opczp-features-list">
                <li className="opczp-list-item">
                  <span className="opczp-list-icon">🧑‍⚖️</span>
                  End-to-End GS1 Registration — from Company Prefix application to GTIN assignment
                </li>
                <li className="opczp-list-item">
                  <span className="opczp-list-icon">📑</span>
                  Document preparation, GS1 India portal filing &amp; annual subscription coordination
                </li>
                <li className="opczp-list-item">
                  <span className="opczp-list-icon">🏷️</span>
                  EAN-13 / UPC-A barcode image files (PNG + SVG) for packaging &amp; online listing
                </li>
                <li className="opczp-list-item">
                  <span className="opczp-list-icon">⏱️</span>
                  Timely updates, renewal reminders &amp; post-registration compliance support
                </li>
              </ul>
            </section>

            <section className="opczp-section-block">
              <h3 className="opczp-label">Important Notes:</h3>
              <div className="opczp-note-box">
                <ul className="opczp-note-list">
                  <li className="opczp-note-item">
                    We verify your business details and product category before initiating the GS1 registration to ensure correct prefix allocation.
                  </li>
                  <li className="opczp-note-item">
                    In case of any document mismatch, our team will guide you with the correct format to ensure smooth GS1 India approval.
                  </li>
                </ul>
              </div>
            </section>

            <div className="opczp-cta-row">
              <button
                className="opczp-cta-btn"
                onClick={() => {
                  const el = document.getElementById("bc-consult-form");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
              >
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BCPriority;
