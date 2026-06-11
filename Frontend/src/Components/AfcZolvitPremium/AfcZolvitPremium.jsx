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
                  Annual filing looks like a few forms — but a missed AGM date, an un-appointed auditor, a skipped DIR-3 KYC, or a late AOC-4 quietly piles up ₹100-a-day penalties and can disqualify your directors. Priority is what happens when a dedicated compliance manager owns your company's calendar from board meeting to filed challan.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A locked annual compliance calendar — AGM, AOC-4, MGT-7, ADT-1, DIR-3 KYC, DPT-3 — tracked with reminders well before each due date.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior-reviewed financial statements, Director's Report, and board/AGM minutes drafted to be MCA- and audit-ready.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Auditor appointment (ADT-1) and statutory audit coordination handled so AOC-4 is filed without last-minute scramble.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    DSC validity and DIN/KYC checks done up front — no failed uploads on the due date.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Compliance kit: all filed forms, SRN/challan receipts, updated statutory registers, and a clean year-end compliance record.
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
                  Late fees have no ceiling. AOC-4 and MGT-7 attract ₹100 per day, per form, from the due date until filing. A few months' delay across two forms can run into tens of thousands — we file on time so it never starts.
                </li>
                <li className="opczp-note-item">
                  Non-compliance disqualifies directors. A company that fails to file financials/annual returns for a continuous period can have its directors disqualified for 5 years and its name struck off. Staying current protects both the company and its board.
                </li>
                <li className="opczp-note-item">
                  Audit comes first. Every company — even one with nil or no business — must get its accounts audited before AOC-4. We line up the auditor and finalise accounts early so the filing chain doesn't stall.
                </li>
                <li className="opczp-note-item">
                  DIR-3 KYC is non-negotiable. Every director with a DIN must complete KYC by 30 September each year or the DIN is deactivated with a ₹5,000 reactivation penalty. We track and file it for every director.
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
