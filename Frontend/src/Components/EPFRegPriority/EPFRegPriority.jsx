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
                  EPF compliance is where most employers get caught — not at registration, but at monthly ECR filing, contribution accuracy, and exit settlements. Priority is what happens when a compliance specialist owns your EPFO onboarding: enrollment done once, correctly, with a verified salary structure, documented contribution registers, and an inspection-ready setup from Day 1.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    72-hour EPF registration turnaround after complete document submission.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Senior compliance specialist reviews your employee roster and contribution calculations.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Real-time EPFO portal status updates on WhatsApp and email — no manual portal refreshing.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Post-registration kit: EPFO credentials, UAN activation guide, and ECR filing calendar.
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="zp-bottom-full">
            <h3 className="zp-label">Important Notes</h3>
            <div className="zp-note-box">
              <ul className="zp-note-list">
                <li className="zp-note-item">
                  <strong>20-employee threshold</strong> — EPF becomes mandatory the moment your headcount crosses 20. It applies retroactively to all employees from the date of eligibility. Delayed registration means penalty + interest on all unpaid contribution arrears under Section 14B of the EPF Act.
                </li>
                <li className="zp-note-item">
                  <strong>Contractor headcount counts</strong> — Workers engaged through a contractor count toward your 20-employee threshold under the EPF Act. Many employers miss this when calculating applicability, leading to unintentional non-compliance.
                </li>
                <li className="zp-note-item">
                  <strong>Monthly ECR is the real compliance</strong> — Registration is one-time. Monthly ECR (Electronic Challan-cum-Return) by the 15th is the ongoing obligation. A missed filing triggers interest at 12% p.a. under Para 38 of the EPF Scheme, which compounds quickly.
                </li>
                <li className="zp-note-item">
                  <strong>ESI runs parallel</strong> — If your establishment has 10+ employees in ESI-notified industries, ESI registration is separately mandatory. EPFO and ESIC are different portals — register for both simultaneously if applicable to avoid dual penalty exposure.
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
