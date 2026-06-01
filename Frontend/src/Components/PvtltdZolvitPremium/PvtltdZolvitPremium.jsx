import React from "react";
import "./PvtltdZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          {/* Left illustration */}
          <div className="zp-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Private Limited Company Registration by Legal Terminus"
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
                A Pvt Ltd is the structure investors expect, lenders trust, and enterprise customers contract with. But the difference between a 'cheap registration' and a 'fundable company' is in the AOA — entrenchment, transfer restrictions, ESOP enabling, voting thresholds. Priority is what happens when a senior CS drafts your AOA like you'll be raising Series A in 18 months (because you might).
              </p>
            </header>

            {/* Features */}
            <section className="zp-section-block">
              <h3 className="zp-label">What you get</h3>
              <ul className="zp-list zp-features-list">
                <li className="zp-list-item">
                  <span className="zp-list-icon">⚡</span>
                  72-hour SLA on first MOA/AOA draft — and a same-day name search before you commit.
                </li>
                <li className="zp-list-item">
                  <span className="zp-list-icon">✅</span>
                  Senior expert reviewed your documents and provide the name availability percentage.
                </li>
                <li className="zp-list-item">
                  <span className="zp-list-icon">🔄</span>
                  Real-time CRC status updates on mail and WhatsApp — no refreshing the MCA portal at midnight.
                </li>
                <li className="zp-list-item">
                  <span className="zp-list-icon">📑</span>
                  Post-incorporation kit: COI, MOA, AOA and compliance calendar.
                </li>
              </ul>
            </section>

            {/* Note */}
            <section className="zp-section-block">
              <h3 className="zp-label">Important Notes</h3>
              <div className="zp-note-box">
                <ul className="zp-note-list">
                  <li className="zp-note-item">
                    <strong>INC-20A</strong> (commencement of business) MUST be filed within 180 days of incorporation. If skipped, the company cannot operate its bank account, and ROC can strike it off. Penalty ₹50,000 on company + ₹1,000/day on every director (capped ₹1L). We file this in our Supreme tier; Elemental and Enriched clients get a reminder.
                  </li>
                  <li className="zp-note-item">
                    <strong>Name rejection</strong> is the #1 delay. Avoid generic words ('India', 'Tech', 'Solutions'), check trademark conflicts, and have 4 backup names ready. We pre-screen, but the CRC is the final authority.
                  </li>
                  <li className="zp-note-item">
                    <strong>Section 115BAA</strong> (22% concessional tax) requires you to opt in via Form 10-IC by the income tax filing deadline of the first relevant FY. Once opted in, you cannot opt out. Run the math before opting — older companies with carry-forward losses may prefer 25.17% with deductions.
                  </li>
                  <li className="zp-note-item">
                    <strong>Statutory audit is MANDATORY</strong> for every Pvt Ltd from Day 1 — even if turnover is zero. This is the one place where Pvt Ltd is heavier than LLP / Partnership. Plan annual audit cost (₹15K – ₹50K) into your runway.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="zp-cta-row">
              <button className="zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

            {/* Pricing
            <p className="zp-pricing">
              <span className="zp-label">Starts from ₹3,999 (excluding government fees)</span> for Private Limited Company Registration in India.{" "}The package includes name approval, incorporation, DIN for two directors, e-PAN, e-TAN, and bank account documents. Also covers auditor appointment documents, EPF and ESI registrations.
              </p> */}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
