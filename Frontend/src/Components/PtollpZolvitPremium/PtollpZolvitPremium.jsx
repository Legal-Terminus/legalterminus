import React from "react";
import "./PtollpZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PtollpZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Partnership to LLP Conversion by Legal Terminus"
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
                  Partnership to LLP Conversion may look simple on paper, but proper conversion requires accurate documentation, partner verification, capital contribution mapping, creditor approvals, and timely MCA filings. Even small mistakes in Form 17, FiLLiP, or post-conversion compliance can lead to ROC delays and unnecessary queries.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your Partnership to LLP Conversion is handled on priority by experienced professionals who ensure faster filing, proper documentation, and smooth end-to-end conversion support.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority document review and faster MCA filing support.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Proper drafting and verification of Form 17, FiLLiP, and LLP documents.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔍</span>
                    Senior Company Secretary review before submission.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    Timely filing of Form 14 and LLP Agreement (Form 3) after conversion.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📲</span>
                    Dedicated coordination and real-time status updates throughout the process.
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
                  ALL PARTNERS MUST BECOME LLP PARTNERS — NO ONE ELSE: Per Clause 4 of the Second Schedule, ALL partners of the firm must be partners of the LLP at the time of conversion, and NO ONE ELSE shall be a partner. Composition cannot change at conversion. Partner exit / new admission must happen BEFORE Form 17 (via retirement deed) OR AFTER CoI (via Form 4). Misalignment = ROC rejection.
                </li>
                <li className="opczp-note-item">
                  ALL PARTNERS MUST CONSENT — UNANIMOUSLY: Form 17 requires consent from EVERY partner. Any dissenting partner blocks the conversion — resolve internal disagreements + buy-outs BEFORE you kick off the Form 17 process. Partner-dispute resolution is OUT OF SCOPE.
                </li>
                <li className="opczp-note-item">
                  AUDITED STATEMENT REQUIRED: Form 17 requires a Statement of Accounts of the firm certified by a Chartered Accountant, not older than 30 days from Form 17 filing. If the firm has audit obligations (under the IT Act or LLP Act 2008 thresholds), audited accounts are required. Factor 7–10 days for the CA work BEFORE Form 17 can be filed.
                </li>
                <li className="opczp-note-item">
                  FORM 14 + FORM 3 ARE TIME-BARRED: Post-CoI, Form 14 (Notice to Registrar of Firms) must be filed within 15 DAYS; Form 3 (LLP Agreement) must be filed within 30 DAYS. Missing these = late-fee accumulation under LLP Rules + default rights / duties under the First Schedule (which most firms don't want). All plans include Form 14; Enriched + Supreme include Form 3.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ptollp-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ptollp-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default PtollpZolvitPremium;
