import React from "react";
import "./TmexrZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TmexrZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Trademark Examination Reply by Legal Terminus"
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
                  A Trademark Examination Report may look simple, but even a small mistake or delay can put your trademark application at risk. Missing the 30-day reply deadline, submitting a weak or generic response, or failing to attend the Show Cause Hearing can lead to abandonment of the application.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your Reply to Examination Report is handled on a priority basis by experienced IP professionals who ensure timely drafting, proper legal response, and continuous follow-up throughout the process.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority handling and faster response preparation.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    30-day deadline tracking with proactive follow-up support.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📄</span>
                    Legal arguments and case-law support wherever required.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Trademark attorney change support, if required.
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
                  30 DAYS from Examination Report receipt (Rule 29) — this is the HARD deadline. Missing it = application DEEMED ABANDONED. We engage immediately and target Day 20 of the window for filing to leave a safe buffer.
                </li>
                <li className="opczp-note-item">
                  PLAN SCOPE = 1 CITED MARK / 1 CLASS — all 3 plans are priced for one cited mark in one class. ADDITIONAL CITED MARKS billed at ₹999 + GST per additional mark (extra distinguishing + drafting per mark). We share the FINAL QUOTE in writing BEFORE taking the assignment — so no surprises. Multi-citation matters are common in Section 11 cases.
                </li>
                <li className="opczp-note-item">
                  EXTENSION possible via Form TM-M (₹900) for up to 30 additional days — but use sparingly. Repeat extensions can hurt your credibility with the Examiner. We recommend extension only when genuinely needed (e.g., obtaining proof of prior-use evidence).
                </li>
                <li className="opczp-note-item">
                  SHOW CAUSE HEARING — if the Examiner is not persuaded by the written reply, a hearing is scheduled (typically 3–6 months after the reply, conducted ONLINE by video conference under Rule 33). NON-APPEARANCE = application ABANDONED. Supreme tier covers up to 2 hearings.
                </li>
                <li className="opczp-note-item">
                  ADJOURNMENT max 2 per matter (Rule 33 proviso), 30 days each. Form TM-M ₹900 per adjournment. Beyond 2 adjournments, the Hearing Officer typically proceeds ex-parte on the merits.
                </li>
                <li className="opczp-note-item">
                  NO GOVT FEE FOR REPLY OR HEARING — this is genuinely free at the Registry. The only Govt fee touchpoints are Form TM-M (₹900) for amendment / extension / adjournment, and DSC / Class-3 digital signature (one-time cost outside this engagement).
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#tmexr-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("tmexr-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Trademark Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TmexrZolvitPremium;
