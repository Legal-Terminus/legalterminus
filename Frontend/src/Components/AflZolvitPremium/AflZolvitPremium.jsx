import React from "react";
import "./AflZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const AflZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="LLP Annual Filing by Legal Terminus"
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
                  LLP annual compliance involves multiple filings and strict deadlines throughout the financial year. Missing Form 11, Form 8, or Income Tax Return deadlines can result in heavy late fees, penalties, and additional compliance issues for the LLP and its Designated Partners.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your LLP Annual Filing is handled on a priority basis with timely coordination, proactive follow-ups, and faster compliance management to help your LLP stay fully compliant.
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
                    Timely reminders and regular status updates throughout the year.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📄</span>
                    Filing support for Form 11, Form 8, and LLP Income Tax Return.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">👨‍💼</span>
                    Coordination with associated Chartered Accountants for audit-related compliances.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📌</span>
                    End-to-end compliance support under one professional team.
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
                  FORM 11 DUE ON 30 MAY. Late fee multiplier kicks in immediately after the deadline – as per LLP Amendment Rules 2022. Small LLP: 2x to 15x normal fee + ₹10/day continuing beyond 360 days. Other LLP: 2x to 30x + ₹20/day continuing.
                </li>
                <li className="opczp-note-item">
                  FORM 8 DUE ON 30 OCTOBER. Same graded late-fee structure. Both forms delayed compound the penalty quickly.
                </li>
                <li className="opczp-note-item">
                  ITR DEADLINES – 31 JULY (non-audit) / 31 OCTOBER (audit). Belated return = Section 234F penalty (₹5,000 / ₹1,000) + interest under Sections 234A/B/C.
                </li>
                <li className="opczp-note-item">
                  AUDIT REGIMES – TWO SEPARATE TRIGGERS: STATUTORY AUDIT (LLP Act) when TURNOVER > ₹40 LAKH or CONTRIBUTION > ₹25 LAKH (EITHER). TAX AUDIT (Section 44AB) when turnover > ₹1 CRORE. Our SUPREME tier is built specifically for AUDITED LLPs (statutory audit) under ₹1 CRORE turnover. Tax-audit-applicable LLPs (> ₹1 crore) are quoted separately as a custom engagement.
                </li>
                <li className="opczp-note-item">
                  AUDIT FEE – SEPARATE FROM OUR PLAN – For Supreme tier (audited LLPs under ₹1 Cr T/o), the statutory CA's audit fee is BILLED DIRECTLY by the CA to your LLP. You agree the fee directly with the CA. LT coordinates + facilitates but does NOT mark up the audit fee. Industry-standard audit independence practice. Typical statutory audit fee range: ₹10,000 – ₹30,000 for LLPs under ₹1 Cr turnover.
                </li>
                <li className="opczp-note-item">
                  EVEN DORMANT LLPs MUST FILE – LLP has no 'dormant' status like companies. All annual filings are mandatory regardless of business activity.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#afl-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("afl-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default AflZolvitPremium;
