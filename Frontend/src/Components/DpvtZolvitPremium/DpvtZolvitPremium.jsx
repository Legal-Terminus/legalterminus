import React from "react";
import "./DpvtZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const DpvtZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Private Limited Company Closure by Legal Terminus"
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
                  Closing a company looks like one form — but an STK-2 filed with pending returns, unextinguished liabilities, or a wrong eligibility call gets rejected, and the penalties keep growing while it sits. Priority is what happens when a compliance expert owns the closure from eligibility check to the name being struck off.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A clear eligibility check up front — strike-off vs voluntary liquidation — so you choose the right, lawful exit route before spending a rupee.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Pending annual filings and the final ITR brought up to date, because the ROC will reject a strike-off that leaves compliance gaps.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Properly drafted special resolution, STK-3 indemnity bond, STK-4 affidavit, and CA-certified STK-8 accounts — the documents that make or break the application.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Bank-account closure and liability clean-up handled so the directors' indemnity is genuinely safe to sign.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Full ROC coordination — responding to queries and tracking the public notice — until the company is struck off and notified in STK-7.
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
                  Doing nothing is the costliest option. An inactive company that simply stops filing keeps accruing ₹100/day-per-form penalties, and its directors risk disqualification for five years. A clean strike-off stops the bleeding for good.
                </li>
                <li className="opczp-note-item">
                  Liabilities must be truly extinguished. Directors sign an indemnity (STK-3) promising to settle any liability that surfaces after closure — and remain personally liable for it. We make sure the company's books, dues, and bank accounts are genuinely clean before you sign.
                </li>
                <li className="opczp-note-item">
                  Eligibility is not automatic. The company must have either never commenced business or been inactive for two financial years, with no pending charges, prosecutions, or investigations. Companies with assets or disputes usually need voluntary liquidation under the IBC instead — we tell you which applies.
                </li>
                <li className="opczp-note-item">
                  The ROC has the final say. After filing, the Registrar publishes a public notice (STK-5/STK-6) inviting objections before striking the name off. A complete, accurate application is the single biggest factor in a smooth, objection-free closure.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#dpvt-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("dpvt-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Closure Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DpvtZolvitPremium;
