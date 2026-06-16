import React from "react";
import "./PtoopcZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PtoopcZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Proprietorship to OPC Conversion by Legal Terminus"
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
                  Proprietorship to OPC Conversion may look like a simple company registration process, but a proper conversion involves multiple legal and compliance steps under the Companies Act, 2013. Documentation, creditor consent, newspaper publication, ROC filing, and business transition planning all play an important role in smooth approval and future compliance.
                </p>
                <p className="opczp-subtitle">
                  With LT Priority, your Proprietorship Firm to OPC Conversion is handled by experienced company law professionals who carefully manage the complete process — from eligibility review to final incorporation and business transition support.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority processing and faster filing support throughout the conversion process
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Proper drafting and handling of URC-1, URC-2, SPICe+ and related MCA filings
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🛡</span>
                    Senior Company Secretary review before final submission
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📲</span>
                    Dedicated coordination and real-time status updates during the process
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    Post-incorporation compliance guidance and annual filing reminders
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
                  URC-2 newspaper advertisement MUST run 21 days BEFORE URC-1 filing - this is a hard statutory waiting period. Plan your timeline: URC-2 advertisement (Day 0) -&gt; 21-day objection window (Day 21) -&gt; URC-1 filing (Day 22+). Skip this window or file URC-1 early, and the Registrar rejects the application. Coordination of English + vernacular publication is part of all plans.
                </li>
                <li className="opczp-note-item">
                  ELIGIBILITY: ONLY an Indian citizen (or NRI Indian citizen with 120-day residency in the preceding FY - effective 1 April 2021) can be the SOLE MEMBER of an OPC. Foreign nationals (non-citizens) CANNOT convert their proprietorship to an OPC - they should look at WOS or Pvt Ltd instead. ONE PERSON RULE: you can only hold ONE OPC at a time + cannot be a nominee in more than one OPC.
                </li>
                <li className="opczp-note-item">
                  AUDITED STATEMENT OF ACCOUNTS REQUIRED: Form URC-1 requires an AUDITED Statement of Accounts of the proprietorship, NOT older than 30 days from URC-1 filing. If your proprietorship books are not audit-ready, factor in 7-10 days for the audit before URC-1 can be filed. We coordinate with your existing CA or arrange a fresh audit.
                </li>
                <li className="opczp-note-item">
                  CREDITOR / MEMBER OBJECTIONS: The URC-2 newspaper window invites objections from creditors, members, and the public. If material objections are received, the conversion may need RD approval, creditor settlement, or other resolution before the Registrar acts on URC-1. Most clean cases proceed without objections; problem cases can extend timeline by 30-60 days.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ptoopc-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ptoopc-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default PtoopcZolvitPremium;
