import React from "react";
import "./ISOpremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ISOPremium = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          <div className="zp-top-row">

            <div className="zp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="ISO Certification by Legal Terminus"
                className="zp-illustration"
              />
            </div>

            <div className="zp-content">

              <header className="zp-header">
                <h2 className="zp-title">
                  Legal Terminus{" "}
                  <span className="zp-title-highlight">Priority</span>{" "}
                  <span className="zp-title-icon">⚖</span>
                </h2>
                <p className="zp-subtitle">
                  An ISO certificate is more than a document — it is proof that your business follows defined processes and quality standards. While obtaining a certificate is relatively straightforward, building a management system that can withstand customer audits, tender evaluations, and supplier assessments requires expertise. Priority is what happens when experienced ISO professionals guide your certification journey from gap analysis to successful certification.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🧑‍⚖️</span>
                    Gap analysis in 5 days — so you know exactly what you need to build vs document.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Senior ISO expert-reviewed Quality Manual + SOPs — aligned to your actual processes, not generic.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⏱️</span>
                    NABCB-accredited CB shortlist (not the cheap unaccredited variety) — so your certificate holds up everywhere.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📋</span>
                    Internal audit + management review facilitation — so Stage 1 and Stage 2 audits are non-events.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          <div className="zp-bottom-full">
            <h3 className="zp-label">Important Notes</h3>
            <div className="zp-note-box">
              <ul className="zp-note-list">
                <li className="zp-note-item">
                  Not all ISO certificates are equal. NABCB / IAF-accredited CBs issue certificates that pass enterprise / export / GeM scrutiny. Unaccredited 'paper mills' issue certificates that get rejected when checked on the IAF database. We only recommend accredited CBs.
                </li>
                <li className="zp-note-item">
                  Template-only consultants give you a Quality Manual that doesn't match your actual processes — which fails Stage 2 audit when the auditor walks the floor and finds reality doesn't match documentation. Our SOPs are customised to your processes.
                </li>
                <li className="zp-note-item">
                  MSME subsidy reimbursement requires specific paperwork — certification by an MSME-Office-approved CB, particular invoice formats, evidence of payment. We pre-validate the CB and structure invoices for clean subsidy claim.
                </li>
                <li className="zp-note-item">
                  ISO is a 3-year commitment, not a one-time exercise. Annual surveillance audits are mandatory in Year 1 + 2; re-certification at Year 3. Skipping a surveillance audit = certificate withdrawn. Plan the ongoing cost in your budget.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#iso-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(".lt-public-hero")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Legal Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ISOPremium;
