import React from "react";
import "./PtopvtZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PtopvtZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Proprietorship to Private Limited Conversion by Legal Terminus"
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
                  A Proprietorship to Private Limited Conversion is much more than a simple company registration. Unlike a fresh Private Limited incorporation, the conversion process under Section 366 involves additional legal procedures such as newspaper publication, creditor consents, audited financials, and ROC scrutiny. Proper structuring is also important to ensure your company is investor-ready from day one.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your conversion is handled by experienced Company Secretaries who manage the complete process carefully — from documentation and compliance to incorporation and post-conversion transition.
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
                    <span className="opczp-list-icon">📑</span>
                    Proper drafting and handling of URC-1, URC-2, SPICe+ and related MCA filings.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔍</span>
                    Senior Company Secretary review before final submission.
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
                  MINIMUM 2 DIRECTORS + 2 SHAREHOLDERS: A Pvt Ltd cannot exist with just one person. The proprietor MUST bring in a second director + shareholder (commonly spouse, family member, business partner, or co-founder). Decide WHO this person will be before kicking off the conversion. The 2nd shareholder can hold nominal shareholding (e.g., 1%) to keep founder economic control intact — but they must consent + provide KYC.
                </li>
                <li className="opczp-note-item">
                  URC-2 NEWSPAPER ADVERTISEMENT MUST RUN 21 DAYS BEFORE URC-1 FILING — this is a hard statutory waiting period. Plan your timeline: URC-2 advertisement (Day 0) → 21-day objection window (Day 21) → URC-1 filing (Day 22+). Skip this window or file URC-1 early, and the Registrar rejects the application. Coordination of English + vernacular publication is part of all plans.
                </li>
                <li className="opczp-note-item">
                  AUDITED STATEMENT OF ACCOUNTS REQUIRED: Form URC-1 requires an AUDITED Statement of Accounts of the proprietorship, NOT older than 30 days from URC-1 filing. If your proprietorship books are not audit-ready, factor in 7–10 days for the audit before URC-1 can be filed. We coordinate with your existing CA or arrange a fresh audit.
                </li>
                <li className="opczp-note-item">
                  AGM + AUDIT + FULL COMPLIANCE STACK: Once you're a Pvt Ltd, you must (a) hold AGM annually under Section 96(1), (b) appoint a statutory auditor regardless of turnover, (c) file MGT-7 (full annual return — not the OPC's simplified MGT-7A), (d) prepare full financial statements WITH Cash Flow Statement. Annual compliance cost typically ₹40,000 – ₹1,00,000 / year. Supreme covers the 1st year; Supreme Plus extends to a 12-month wrap.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ptopvt-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ptopvt-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default PtopvtZolvitPremium;
