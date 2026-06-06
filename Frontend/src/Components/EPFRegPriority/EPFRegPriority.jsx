import React from "react";
import "../PvtltdZolvitPremium/PvtltdZolvitPremium.css";
import priorityIllustration from "../../assets/lt-companys.svg";

const EPFRegPriority = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          {/* Top two-column row: illustration + content */}
          <div className="zp-top-row">

            <div className="zp-illustration-wrapper">
              <img
                src={priorityIllustration}
                alt="EPF Registration by Legal Terminus"
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
                  EPF Registration looks like a simple online form — until your first ECR fails because the UANs weren't properly linked, or the authorised signatory's DSC doesn't validate, or an employee's Aadhaar-bank mismatch holds up their PF account. Priority is what happens when a payroll-CA owns the file from Form 5A to first successful ECR.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    Priority Processing of your EPF Registration application upon receipt of complete documents.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Senior payroll Expert reviewed Form 5A — correct establishment classification, NIC code, contribution start date.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    UAN activation handled for every employee + KYC linkage (Aadhaar / PAN / bank) verified before first ECR.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📞</span>
                    First ECR walkthrough included — so your first monthly contribution actually clears the EPFO portal.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Real-time status updates via Email and WhatsApp throughout the registration process.
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Important Notes + CTA */}
          <div className="zp-bottom-full">
            <h3 className="zp-label">Important Notes</h3>
            <div className="zp-note-box">
              <ul className="zp-note-list">
                <li className="zp-note-item">
                  Once your employee strength touches 20, you have to register within 30 days. Delayed registration attracts damages under Section 14B — typically 5–25% of arrears depending on delay period. Don't wait until inspection finds you.
                </li>
                <li className="zp-note-item">
                  Every employee needs an Aadhaar-PAN-bank linkage that matches each other. Any mismatch (e.g. name spelling difference between Aadhaar and bank account) blocks UAN activation and the first ECR fails. We verify all KYC before filing.
                </li>
                <li className="zp-note-item">
                  Once you register, you cannot opt out even if your headcount drops below 20. EPF coverage continues for as long as the establishment exists. Voluntary registrants under Section 1(4) are equally locked in.
                </li>
                <li className="zp-note-item">
                  Section 17 exempted trusts (where the employer runs its own PF trust instead of EPFO) is heavily restricted post-2017 amendments — virtually no new exemptions granted. For new establishments, RPFC (EPFO-administered) is the only path.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#epf-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("epf-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default EPFRegPriority;
