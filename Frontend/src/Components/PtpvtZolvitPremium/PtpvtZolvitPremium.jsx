import React from "react";
import "./PtpvtZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PtpvtZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Partnership Firm to Private Limited Conversion by Legal Terminus"
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
                  Converting an existing Partnership Firm into a Private Limited Company under Section 366 of the Companies Act, 2013 is a much more detailed process. It involves partner approvals, creditor consents, newspaper publication, capital restructuring, and proper legal documentation to ensure smooth business continuity and future tax efficiency.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With Legal Terminus Priority, your entire conversion process is handled by experienced professionals who manage the URC-1, URC-2, and SPICe+ filing process carefully from start to finish — helping you avoid delays, rejection, and compliance issues.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority processing and faster filing support throughout the conversion process.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔍</span>
                    Senior Company Secretary review before final submission.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📰</span>
                    Newspaper advertisement and objection-period compliance support.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📲</span>
                    Dedicated coordination and real-time status updates during the process.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    Post-incorporation compliance guidance and annual filing reminders.
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
                  ALL PARTNERS MUST CONSENT — UNANIMOUSLY: URC-1 requires consent from EVERY partner of the firm. Any dissenting partner blocks the conversion — resolve internal disagreements + buy-outs + retirements BEFORE you kick off the URC-1 process. Partner-dispute resolution is OUT OF SCOPE; we coordinate but don't litigate.
                </li>
                <li className="opczp-note-item">
                  URC-2 NEWSPAPER ADVERTISEMENT MUST RUN 21 DAYS BEFORE URC-1 FILING — this is a hard statutory waiting period. Plan your timeline: URC-2 advertisement (Day 0) → 21-day objection window (Day 21) → URC-1 filing (Day 22+). Skip this window or file URC-1 early, and the Registrar rejects the application. Coordination of English + vernacular publication is part of all plans.
                </li>
                <li className="opczp-note-item">
                  SECTION 47(xiii) IS UNFORGIVING: To get capital-gains exemption on the asset transfer, ALL FOUR conditions must be satisfied for FIVE YEARS post-conversion — all assets + liabilities transferred, ALL PARTNERS become shareholders in the SAME PROPORTION as capital accounts, no consideration other than allotment of shares, and partners' aggregate shareholding ≥ 50% of voting power for 5 years. Break any condition (e.g., a partner sells all their shares in year 3) and the original conversion gets retrospectively taxed as capital gains. Supreme Plus covers the structuring + 5-year lock-in advisory.
                </li>
                <li className="opczp-note-item">
                  AUDITED STATEMENT REQUIRED: Form URC-1 requires an AUDITED Statement of Accounts of the firm, NOT older than 30 days from URC-1 filing. If your firm's books are not audit-ready, factor in 7–10 days for the audit before URC-1 can be filed. We coordinate with your existing CA or arrange a fresh audit.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ptpvt-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ptpvt-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default PtpvtZolvitPremium;
