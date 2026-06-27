import React from "react";
import "./ItrBizZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const features = [
  { icon: "⚡", text: "Priority handling with faster filing support" },
  { icon: "📅", text: "Timely filing reminders and regular status updates" },
  { icon: "🏢", text: "Support for both Proprietorships and Partnership Firms" },
  { icon: "📄", text: "Correct ITR form selection (ITR-3, ITR-4, or ITR-5)" },
];

const notes = [
  {
    label: "PROPRIETOR vs PARTNERSHIP FIRM",
    text: "completely different tax mechanics. PROPRIETOR = slab rates + Section 87A rebate (NIL up to Rs.12L). PARTNERSHIP = flat 30% + 12% surcharge (if T/o > Rs.1 Cr) + 4% cess (NO regime, NO 87A). Different ITR forms apply.",
  },
  {
    label: "31 JULY 2026 (NON-AUDIT)",
    text: "file by this date for both entity types. Missing it = Section 234F penalty + 234A/B/C interest. Tax audit cases (T/o > Rs.1 Cr) = 31 Oct 2026 deadline (out of scope, custom quote per T&C #1).",
  },
  {
    label: "WRONG ITR FORM = DEFECTIVE RETURN",
    text: "ITR-3 (proprietor regular) / ITR-5 (firm regular) / ITR-4 Sugam (presumptive - both entity types). Filing wrong form = Section 139(9) notice + re-filing within 15 days. We auto-detect at intake.",
  },
  {
    label: "NEW SECTION 194T (Partnership Firm only - FY 2025-26 onwards)",
    text: "10% TDS deducted by firm on partner payments (salary/bonus/interest/commission) > Rs.20,000 per partner per year. Non-deduction = Section 40(a)(ia) disallowance + interest. Supreme tier handles this.",
  },
  {
    label: "SECTION 40(b) Budget 2024 amendment",
    text: "First slab for partner remuneration DOUBLED to Rs.6 LAKH (was Rs.3L). Effective FY 2025-26. We apply the new higher limits in partnership firm computations.",
  },
  {
    label: "SECTION 44AA BOOKS",
    text: "Mandatory if income > Rs.1.2L or T/o > Rs.10L. Non-maintenance = Section 271A penalty Rs.25,000. Supreme tier (Tally year-round) ensures compliance.",
  },
  {
    label: "TAX PAYMENT DIRECTLY BY YOU (per T&C #2)",
    text: "any tax payable to Government is PAID DIRECTLY BY YOU. LT does NOT collect / hold / remit Govt tax.",
  },
];

const ItrBizZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Business ITR Filing by Legal Terminus"
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
                  Business ITR filing is more than just submitting a return — the correct form selection, proper tax calculation, and timely filing are extremely important to avoid notices, penalties, and unnecessary tax liability.
                </p>
                <p className="opczp-subtitle itrbiz-subtitle-2">
                  With LT Priority, your Proprietorship or Partnership Firm return is handled on a priority basis by experienced tax professionals who ensure faster processing, proper compliance, and accurate filing.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  {features.map((feature, i) => (
                    <li className="opczp-list-item" key={i}>
                      <span className="opczp-list-icon">{feature.icon}</span>
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </section>

            </div>
          </div>

          <div className="opczp-bottom-full">
            <h3 className="opczp-label">Important Notes</h3>
            <div className="opczp-note-box">
              <ul className="opczp-note-list">
                {notes.map((note, i) => (
                  <li className="opczp-note-item" key={i}>
                    <span className="itrbiz-note-label">{note.label}</span> — {note.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#itrbiz-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("itrbiz-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default ItrBizZolvitPremium;
