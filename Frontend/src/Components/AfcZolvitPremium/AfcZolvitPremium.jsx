import React from "react";
import "./AfcZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const AfcZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Company Annual Filing by Legal Terminus"
                className="opczp-illustration"
              />
            </div>

            <div className="opczp-content">

              <header className="opczp-header">
                <h2 className="opczp-title">
                  Legal Terminus{" "}
                  <span className="opczp-title-highlight">Priority</span>{" "}
                  <span className="opczp-title-icon">⚖</span>
                </h2>
                <p className="opczp-subtitle">
                  Company annual compliance involves multiple ROC, tax, and audit filings throughout the year. Missing important deadlines can lead to heavy late fees, penalties, DIN deactivation, and even Director Disqualification under the Companies Act, 2013.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your company's annual compliance is handled on a priority basis through one coordinated team of professionals who manage filings, audit coordination, reminders, and status tracking to ensure smooth and timely compliance.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority handling with faster compliance coordination.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    Monthly status updates + important deadline alerts.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📂</span>
                    Complete annual ROC + Income Tax compliance under one roof.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🧾</span>
                    Filing support for AOC-4, MGT-7 / 7A, DIR-3 KYC, DPT-3, ADT-1, MSME-1 (if applicable), ITR and related compliances.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          <div className="opczp-bottom-full">
            <h3 className="opczp-label">Important Notes</h3>
            <div className="opczp-note-box">
              <ul className="opczp-note-list">
                <li className="opczp-note-item">
                  AGM ANCHORS EVERYTHING — AGM must be held by 30 SEPTEMBER 2026 (Section 96) only for 2nd year onwards; for 1st financial year company ROC provides 3 months' extension. AOC-4 follows in 30 days (29 Oct); MGT-7 follows in 60 days (29 Nov); ADT-1 in 15 days. Miss AGM = cascade of penalty across forms.
                </li>
                <li className="opczp-note-item">
                  ₹100/DAY NO CAP — AOC-4 + MGT-7 late fee ₹100/day per form (NO upper limit) + Section 403 additional fee multipliers (2x to 12x normal Govt fees). A 6-month delay on AOC-4 + MGT-7 can easily cross ₹40,000+ in fees.
                </li>
                <li className="opczp-note-item">
                  DIR-3 KYC = ₹5,000 FIXED PENALTY + DIN DEACTIVATION — non-discretionary penalty if missed. DIN deactivation freezes the Director from any filings till compliance.
                </li>
                <li className="opczp-note-item">
                  DIRECTOR DISQUALIFICATION — Section 164(2) — if a company defaults on AOC-4 / MGT-7 filing for 3 CONSECUTIVE YEARS, all Directors are DISQUALIFIED for 5 years from being directors in ANY company. This is the nuclear option — permanent career consequence.
                </li>
                <li className="opczp-note-item">
                  AUDIT FEE — SEPARATE FROM OUR PLAN — For Supreme tier (companies under ₹1 Cr turnover), the Statutory Audit fee (Section 139, mandatory for ALL companies) is BILLED DIRECTLY by the CA to your company. We only coordinate the best CA.
                </li>
                <li className="opczp-note-item">
                  STATUTORY AUDIT IS MANDATORY EVEN FOR ZERO-REVENUE COMPANIES — unlike LLPs, every company (including dormant / Section 8 / Section 455 inactive companies) needs an auditor. Companies cannot skip statutory audit.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#afc-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("afc-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Compliance Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AfcZolvitPremium;
