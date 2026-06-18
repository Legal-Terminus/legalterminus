import React from "react";
import "./EpfRetZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const EpfRetZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="EPF Return Filing by Legal Terminus"
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
                  EPF Return Filing may look simple — upload the ECR, generate the challan, and make the payment. But even a small delay or error can create bigger compliance issues later. Late filing may attract interest and penalties, incorrect KYC can delay employee withdrawals, and missing updates in Form 5A or authorized signatory records can create problems during inspections or audits.
                </p>
                <p className="opczp-subtitle">
                  With LT Priority, your EPF Return Filing is handled on a priority basis by a dedicated compliance team that ensures faster processing, timely filing, and proper monthly coordination.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority processing and faster monthly filing support.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    ECR filing before the 15th of every month (subject to timely data sharing).
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">👤</span>
                    Employee KYC support — Aadhaar, PAN, and bank details linked with UAN.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📄</span>
                    Monthly ECR preparation, challan generation, and filing support.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🏢</span>
                    Form 5A filing and authorized signatory updates included.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📲</span>
                    Dedicated coordination with monthly acknowledgement and status updates.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔍</span>
                    Error-check review before filing to reduce future EPF compliance issues.
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
                  <strong>15th of next month is a hard deadline:</strong> PF dues for any month must be deposited by the 15th of next month. Section 7Q INTEREST @ 12% p.a. kicks in from the 16th — calculated daily. Section 14B DAMAGES are graded by delay (5% for &lt;2 months / 10% for 2–4 / 15% for 4–6 / 25% for &gt;6). For ₹10 lakh PF dues delayed 3 months: ₹30,000 interest + ₹25,000 damages = ₹55,000 statutory hit. Don't slip.
                </li>
                <li className="opczp-note-item">
                  <strong>KYC seeding is member-critical:</strong> KYC linkage (Aadhaar + PAN + Bank account) to UAN is mandatory + the foundation of any future member service (withdrawal, transfer, pension, EDLI claim). Seeding errors / mismatches at onboarding cause delays later. Our KYC seeding is monthly — new joinees onboarded + existing-member gaps actively cleared.
                </li>
                <li className="opczp-note-item">
                  <strong>Form 5A keeps ownership records current:</strong> Form 5A is the annual return by owners / partners / directors confirming ownership + management structure. Non-filing / outdated Form 5A flags the establishment for EPFO verification + can trigger inquiries. Included in every plan.
                </li>
                <li className="opczp-note-item">
                  <strong>Establishments with more than 50 employees need a custom plan:</strong> Our standard tiers cover up to 50 employees. Beyond 50 — multi-branch coordination, KYC at scale, eSign authorities at scale, contractor compliance — we structure a custom enterprise engagement. Drop us a note.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#epfret-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("epfret-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a PF Compliance Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EpfRetZolvitPremium;
