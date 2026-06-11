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
                  LLP filing looks like just two forms a year — but a missed Form 11 in May, a late Form 8 in October, or a skipped DIR-3 KYC quietly piles up ₹100-a-day penalties with no cap, and can lead to the LLP being struck off. Priority is what happens when a dedicated compliance manager owns your LLP's calendar from books to filed challan.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A locked annual calendar — Form 11 (30 May), Form 8 (30 October), DIR-3 KYC (30 September), and ITR-5 — tracked with reminders well before each due date.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior-reviewed Statement of Account &amp; Solvency and partner/contribution details, prepared to be MCA-ready the first time.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Audit-applicability check on your turnover and contribution, with the CA looped in early only when it is actually required.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    DSC validity and designated-partner KYC checked up front — no failed uploads on the due date.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Compliance kit: all filed forms, SRN/challan receipts, updated LLP records, and a clean year-end compliance trail.
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
                  Late fees have no ceiling. Form 11 and Form 8 attract ₹100 per day, per form, from the due date until filing. Because LLP penalties don't cap, a year's delay across both forms can run into lakhs — we file on time so it never starts.
                </li>
                <li className="opczp-note-item">
                  Filing is mandatory even with no business. A dormant or zero-revenue LLP must still file Form 11 and Form 8. Assuming "no activity means no filing" is the single most common and costly LLP compliance mistake.
                </li>
                <li className="opczp-note-item">
                  Audit isn't always needed — but the threshold matters. An LLP needs a statutory tax audit only if turnover exceeds ₹40 lakh or contribution exceeds ₹25 lakh. We confirm your position so you neither skip a required audit nor pay for an unnecessary one.
                </li>
                <li className="opczp-note-item">
                  DIR-3 KYC is non-negotiable. Every designated partner with a DIN/DPIN must complete KYC by 30 September or the DIN is deactivated with a ₹5,000 reactivation penalty — blocking all filings until restored.
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
