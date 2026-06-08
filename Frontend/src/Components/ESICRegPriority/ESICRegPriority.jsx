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
                  ESIC Registration looks deceptively simple — until an Aadhaar mismatch blocks an Insurance Number at generation, or a wrong family declaration leaves an employee's dependent ineligible for medical benefits at the moment they need it most. Details that seem minor at the filing stage become compliance failures during inspections or employee grievances. LT Priority is a premium, fast-track service where a senior payroll expert owns your file end-to-end — from Form 1 submission to your first successful monthly contribution clearing without a rejection.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    5-day SLA on Employer Code — Employer Code targeted for allotment within 5 working days of complete document submission.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Same-day file review and submission — documents verified and application submitted to ESIC on the same working day.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Senior Payroll-expert ownership — one senior expert handles your file from Form 1 to final Employer Code, with full accountability.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📞</span>
                    IP generation and family declaration within 3 days of Employer Code — all covered employees registered and dependants declared without delay.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Priority helpdesk — 4-hour response — any ESIC query or compliance issue addressed within 4 business hours.
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
                  Once your headcount touches 10, you have 15 days to register. Delayed registration attracts interest under Section 39(5) + damages under Section 85B — up to 25% of arrears. Don't wait until an Inspector visit catches you.
                </li>
                <li className="zp-note-item">
                  Family declaration matters more than people think. Dependants listed in the declaration are eligible for ESIC medical benefits + dependants' benefit (90% wages) in case of employment-related death. Wrong declaration = denied claims. We capture this carefully for every covered employee.
                </li>
                <li className="zp-note-item">
                  ESIC coverage is geographic — implemented in stages. Some new industrial estates / Tier-3 cities may not yet be notified. If you're in an un-notified area but voluntarily covered, scope can be limited. We verify notified-area status before filing.
                </li>
                <li className="zp-note-item">
                  ESIC wage threshold (₹21,000) hasn't been revised since January 2017 — and is widely expected to be increased. When it is, more employees will become covered overnight without separate notification. Plan your payroll structure with this expansion risk in mind.
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
