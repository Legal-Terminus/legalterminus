import React from "react";
import "./ISOpremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ISOPremium = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          {/* Top two-column row: illustration + content */}
          <div className="zp-top-row">

            {/* Left illustration */}
            <div className="zp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="ISO Certification by Legal Terminus"
                className="zp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="zp-content">

              {/* Title + subtitle */}
              <header className="zp-header">
                <h2 className="zp-title">
                  Legal Terminus{" "}
                  <span className="zp-title-highlight">Priority</span>{" "}
                  <span className="zp-title-icon">⚖</span>
                </h2>
                <p className="zp-subtitle">
                  Get your ISO Certification done faster with Legal Terminus' expert-handled process — designed for businesses that want to improve quality standards, build customer trust, and win government tenders without delays.
                </p>
              </header>

              {/* Features */}
              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🧑‍⚖️</span>
                    Complete guidance from documentation to ISO certification — we recommend the right standard for your business.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Hassle-free documentation preparation and application filing with the certifying body.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⏱️</span>
                    Fast processing with real-time status updates on mail and WhatsApp.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📋</span>
                    Post-certification kit: ISO certificate, surveillance audit calendar, and renewal reminders.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="zp-bottom-full">
            <h3 className="zp-label">Important Notes</h3>
            <div className="zp-note-box">
              <ul className="zp-note-list">
                <li className="zp-note-item">
                  <strong>Surveillance audits</strong> are required annually to maintain ISO certification. Failure to undergo surveillance audits results in suspension or withdrawal of the certificate.
                </li>
                <li className="zp-note-item">
                  <strong>ISO certification scope</strong> must accurately describe your business activities. Misrepresentation of scope can lead to certificate cancellation and legal consequences.
                </li>
                <li className="zp-note-item">
                  <strong>Recertification</strong> is required every 3 years (for most standards). We send timely reminders and assist with renewal to ensure uninterrupted certification.
                </li>
                <li className="zp-note-item">
                  <strong>Government fee</strong> varies by certifying body and ISO standard. We will communicate the exact amount before you proceed with payment.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#iso-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(".lt-public-hero")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Legal Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ISOPremium;
