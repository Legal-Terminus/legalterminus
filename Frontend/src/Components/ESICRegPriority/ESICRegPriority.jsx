import React from "react";
import "../PvtltdZolvitPremium/PvtltdZolvitPremium.css";
import priorityIllustration from "../../assets/lt-companys.svg";

const ESICRegPriority = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          {/* Top two-column row: illustration + content */}
          <div className="zp-top-row">

            <div className="zp-illustration-wrapper">
              <img
                src={priorityIllustration}
                alt="ESIC Registration by Legal Terminus"
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
                  ESIC Registration looks like a simple portal form — until your first contribution bounces because an employee's Aadhaar isn't mobile-linked, or the employer code is mapped to the wrong regional office, or the DSC validation fails at submission. Priority is what happens when a compliance specialist owns your ESIC setup from Form-1 to first successful challan.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    Priority processing of your ESIC Registration application upon receipt of complete documents.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Senior compliance expert reviews Form-1 — correct establishment classification, industry type, wage ceiling, and contribution start date.
                  </li>
                  <li className="zp-list-icon">
                    <span className="zp-list-icon">🔄</span>
                    Employee IP number activation + Aadhaar-bank KYC verification for every covered employee before first challan.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📞</span>
                    First ESI contribution challan walkthrough included — so your first monthly payment actually clears the ESIC portal.
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
                  ESIC registration must be completed within 15 days of becoming eligible (crossing 10-employee threshold). Delayed registration triggers Section 85B interest at 12% p.a. plus damages of 5–25% on arrears — calculated from the date of eligibility, not registration.
                </li>
                <li className="zp-note-item">
                  Contract workers and temporary employees also count toward the 10-employee threshold under the ESI Act. Many employers miss this when calculating applicability, leading to unintentional non-compliance and retrospective liability.
                </li>
                <li className="zp-note-item">
                  Once registered, ESI coverage continues even if your headcount drops below the threshold. You cannot de-register unless the establishment closes. Plan your ESIC registration with long-term compliance costs in mind.
                </li>
                <li className="zp-note-item">
                  ESIC and EPF registrations are often required simultaneously. We handle both in a single engagement — if you need EPF registration as well, mention it at the discovery call and we'll bundle the process to save time and cost.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#esic-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("esic-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default ESICRegPriority;
