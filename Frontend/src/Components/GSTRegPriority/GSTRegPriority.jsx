import React from "react";
import "./GSTRegPriority.css";
import premiumIllustration from "../../assets/lt-company.svg";

const GSTRegPriority = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          <div className="zp-top-row">
            <div className="zp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="GST Registration by Legal Terminus"
                className="zp-illustration"
              />
            </div>

            <div className="zp-content">
              <header className="zp-header">
                <h2 className="zp-title">
                  Legal Terminus{" "}
                  <span className="zp-title-highlight">Priority</span>{" "}
                  <span className="zp-title-icon">⚖</span>
                </h2>
                <p className="zp-subtitle">
                  Speed without shortcuts. Accuracy without the alphabet soup. Priority is what happens when a senior Expert actually owns your file from filing to GSTIN.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    48-hour SLA on the first draft of all forms — same business day if filed before 11 AM.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Senior-expert reviewed HSN/SAC mapping — because the wrong code costs you a Section 122 penalty later.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Real-time ARN status pings to WhatsApp — no logging into the portal at 11 PM to check.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Post-GSTIN onboarding kit: Guidance for post GSTIN compliances.
                  </li>
                </ul>
              </section>
            </div>
          </div>

          <div className="zp-bottom-full">
            <h3 className="zp-label">Important Notes</h3>
            <div className="zp-note-box">
              <ul className="zp-note-list">
                <li className="zp-note-item">
                  GSTN matches your bank IFSC against the PAN database. A name mismatch here triggers a 30-day suspension clock — submit a current account, not a personal one wherever possible.
                </li>
                <li className="zp-note-item">
                  If your turnover is approaching ₹10 crore, you fall under the e-invoicing 30-day reporting window from registration day one. Plan ahead — Supreme plan flags this for you.
                </li>
                <li className="zp-note-item">
                  Aadhaar authentication is non-negotiable from 2026. If you've never linked your mobile number to Aadhaar, sort that out before you start — otherwise you're looking at physical verification.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#gst-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("gst-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default GSTRegPriority;
