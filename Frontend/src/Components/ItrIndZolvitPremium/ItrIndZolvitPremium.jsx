import React from "react";
import "./ItrIndZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const ItrIndZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Individual ITR Filing by Legal Terminus"
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
                  Income Tax Return filing may look simple, but small mistakes can lead to notices, penalties, delayed refunds, or excess tax payments. Missing the filing deadline, selecting the wrong ITR form, choosing the wrong tax regime, or incorrect reporting of income and foreign assets are some of the most common issues taxpayers face.
                </p>
                <p className="opczp-subtitle itrind-subtitle-2">
                  With LT Priority, your ITR filing is handled on a priority basis by experienced professionals who ensure accurate filing, proper tax planning, and faster coordination from start to finish.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority handling and faster filing support
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    Timely filing reminders and regular status updates
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📄</span>
                    Correct ITR form selection based on your income type
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">💰</span>
                    Old vs New Tax Regime comparison for better tax savings
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🧾</span>
                    Form 26AS, AIS &amp; TIS reconciliation for accurate reporting
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
                  <span className="itrind-note-label">31 JULY 2026 (NON-AUDIT)</span> — if you don't have tax audit applicability, file by this date. Missing it = Section 234F penalty (Rs.5,000 / Rs.1,000) + 1%/month interest under 234A/B/C.
                </li>
                <li className="opczp-note-item">
                  <span className="itrind-note-label">31 DECEMBER 2026 (BELATED / REVISED)</span> — last chance under Section 139(4)/139(5). After this only ITR-U under Section 139(8A) with 25%–70% additional tax penalty.
                </li>
                <li className="opczp-note-item">
                  <span className="itrind-note-label">WRONG ITR FORM = DEFECTIVE RETURN</span> — ITR-1 (Sahaj) for basic salaried up to Rs.50L income; ITR-2 for capital gains, multiple HP, NRI, foreign assets. Filing wrong form = Section 139(9) defective return notice + re-filing within 15 days. We auto-detect at intake.
                </li>
                <li className="opczp-note-item">
                  <span className="itrind-note-label">NEW REGIME IS DEFAULT (Section 115BAC)</span> — if you don't actively opt for Old Regime via Form 10-IEA, your ITR is processed under New Regime. For most salaried up to Rs.12.75L income, New Regime = NIL tax. For higher incomes with big Section 80 claims, Old Regime may still win — we run BOTH (Enriched onwards).
                </li>
                <li className="opczp-note-item">
                  <span className="itrind-note-label">Rs.12 LAKH REBATE DOES NOT APPLY TO CAPITAL GAINS</span> — Section 87A Rs.60,000 rebate applies only to NORMAL INCOME, not to special-rate income like STCG (20%), LTCG (12.5%), or VDA (30%). Capital gains are taxed at their special rates separately.
                </li>
                <li className="opczp-note-item">
                  <span className="itrind-note-label">TAX PAYMENT - DIRECTLY BY CLIENT (per T&amp;C)</span> — any tax payable to the Government is PAID DIRECTLY BY YOU to the tax authority via authorised banks / portal. LT does NOT collect, hold, or remit Govt tax. Our professional fee is separate from any tax payable.
                </li>
                <li className="opczp-note-item">
                  <span className="itrind-note-label">SCHEDULE FA NON-DISCLOSURE = BLACK MONEY ACT</span> — Resident Indians holding ANY foreign asset (bank account, property, stocks, MFs) at any time during the FY must disclose in Schedule FA. Non-disclosure = Rs.10 LAKH penalty + prosecution under Black Money Act 2015. Enriched+ / Supreme+ tiers handle this.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#itrind-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("itrind-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Tax Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ItrIndZolvitPremium;
