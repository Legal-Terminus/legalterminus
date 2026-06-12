import React from "react";
import "./DllpZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const DllpZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="LLP Closure by Legal Terminus"
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
                  Closing an LLP looks like one form — but a Form 24 filed with pending Form 8/11, unextinguished liabilities, or an open bank account gets rejected, while the uncapped penalties keep climbing. Priority is what happens when a compliance expert owns the closure from eligibility check to the name being struck off.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A clear eligibility check up front — strike-off vs voluntary winding-up — so you choose the right, lawful exit route before spending a rupee.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Pending Form 8 and Form 11 brought up to date, because the ROC will reject a Form 24 that leaves compliance gaps.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Properly drafted partners' consent, affidavit, indemnity, and a CA-certified nil statement of accounts — the documents that make or break the application.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Bank-account closure and liability clean-up handled so the designated partners' indemnity is genuinely safe to sign.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Full ROC coordination — responding to queries and tracking the public notice — until the LLP is struck off the register.
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
                  Doing nothing is the costliest option. An inactive LLP that simply stops filing keeps accruing a ₹100-per-day late fee per form — and for LLPs this has no upper cap — so a dormant LLP can quietly run up huge liabilities. A clean strike-off stops it for good.
                </li>
                <li className="opczp-note-item">
                  Liabilities must be truly extinguished. Designated partners sign an indemnity promising to settle any liability that surfaces after closure — and remain personally liable for it. We make sure the LLP's books, dues, and bank account are genuinely clean before you sign.
                </li>
                <li className="opczp-note-item">
                  Eligibility is not automatic. The LLP must have either never commenced business or ceased operations for at least one year, with no pending liabilities. We confirm this and advise voluntary winding-up under the LLP Act where assets or disputes exist.
                </li>
                <li className="opczp-note-item">
                  The ROC has the final say. After filing Form 24, the Registrar publishes a public notice inviting objections before striking the name off. A complete, accurate application is the single biggest factor in a smooth, objection-free closure.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#dllp-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("dllp-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default DllpZolvitPremium;
