import React from "react";
import "./PvtllpZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PvtllpZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Private Limited to LLP Conversion by Legal Terminus"
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
                  Pvt Ltd Company to LLP Conversion may look simple on paper, but proper execution requires careful handling of legal, tax, and MCA compliance requirements. Eligibility conditions, shareholder-to-partner conversion, creditor approvals, Statement of Accounts, and post-conversion filings all need to be managed correctly to avoid delays or future compliance issues.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your Pvt Ltd Company to LLP Conversion is handled on a priority basis by experienced Company Secretaries who manage the entire process quickly and professionally — from eligibility review to final LLP incorporation and post-conversion filings.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority handling and faster MCA filing support.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Proper review of eligibility, documents, and partner structure.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔍</span>
                    Senior Company Secretary review before filing.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📲</span>
                    Dedicated coordination and real-time status updates.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    Timely filing of Form 14 and LLP Agreement (Form 3) compliances.
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
                  SECTION 47(xiiib) THRESHOLDS ARE RESTRICTIVE: Capital-gains EXEMPTION is available ONLY if turnover ≤ ₹60 LAKH in any of the 3 preceding years AND total assets in books ≤ ₹5 CRORE in any of the 3 preceding years. Breach either threshold and the entire asset transfer becomes TAXABLE under Section 45 (capital gains). For growth-stage Pvt Ltd companies above these thresholds, conversion is STILL LEGAL under Section 56 — but a tax bill arrives. We audit eligibility upfront.
                </li>
                <li className="opczp-note-item">
                  NO SECURITY INTEREST CONDITION: Per Third Schedule Para 1(a), there must be NO SECURITY INTEREST (charge / mortgage / lien / hypothecation) on company assets at the time of Form 18 filing. If you have outstanding secured loans (CC, term loan, equipment finance), the security must be RELEASED / SATISFIED before Form 18. We verify the company's charge-register (Form CHG-7) early in the discovery call.
                </li>
                <li className="opczp-note-item">
                  ALL SHAREHOLDERS BECOME LLP PARTNERS — NO ONE ELSE: Per Third Schedule Para 1(b), at conversion ALL SHAREHOLDERS of the company MUST become partners of the LLP, AND no other person can become a partner. Composition cannot change at conversion. Shareholder exit (via share transfer / buy-back) must complete BEFORE Form 18. New partner admission must wait until POST-CoI (via Form 4).
                </li>
                <li className="opczp-note-item">
                  5-YEAR PROFIT-SHARE LOCK-IN under Section 47(xiiib)(d): Aggregate profit-sharing ratio of erstwhile shareholders in the LLP must remain ≥ 50% AT ANY TIME during the 5 YEARS post-conversion. If a partner exits / transfers profit share and the aggregate drops below 50% in years 1–5, the original Section 47(xiiib) exemption is REVOKED + capital-gains tax kicks in retrospectively. Supreme tier monitors the 5-year lock-in + flags pre-emption.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#pvtllp-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("pvtllp-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Conversion Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PvtllpZolvitPremium;
