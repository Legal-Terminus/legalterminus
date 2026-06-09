import React from "react";
import "./ProfTaxPriority.css";
import priorityIllustration from "../../assets/lt-company.svg";

const ProfTaxPriority = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          {/* Top two-column row: illustration + content */}
          <div className="opczp-top-row">

            {/* Left illustration */}
            <div className="opczp-illustration-wrapper">
              <img
                src={priorityIllustration}
                alt="Professional Tax Registration by Legal Terminus"
                className="opczp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="opczp-content">

              <header className="opczp-header">
                <h2 className="opczp-title">
                  Legal Terminus{" "}
                  <span className="opczp-title-highlight">Priority</span>{" "}
                  <span className="opczp-title-icon">⚖</span>
                </h2>
                <p className="opczp-subtitle">
                  PT sounds straightforward — until you hit state-specific slab schedules, dual certificate requirements, and varying due dates. Priority is what happens when a senior compliance expert owns your PT registration from applicability check to certificate delivery.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    48-hour SLA on document review and state portal filing — same-day applicability check before you commit.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior expert maps your salary slabs to the correct state PT schedule, preventing under-deduction penalties.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Separate PTEC (Employer) and PTRC (Employee) certificates handled in a single workflow, no back-and-forth.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Real-time status updates on WhatsApp — no login-refresh loops on crowded state portals.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Post-registration kit: certificates, compliance calendar, monthly challan template.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="opczp-bottom-full">
            <h3 className="opczp-label">Important Notes</h3>
            <div className="opczp-note-box">
              <ul className="opczp-note-list">
                <li className="opczp-note-item">
                  PT is not a central tax — each state has its own Act, rates, due dates, and penalty structure. A Maharashtra PTRC and a Karnataka PT registration are completely different filings. We manage state-specific rules for you.
                </li>
                <li className="opczp-note-item">
                  Late payment of PT or non-filing of returns attracts penalties ranging from 1%–2% per month plus interest in most states. Registration within 30 days of becoming liable is the safest approach.
                </li>
                <li className="opczp-note-item">
                  The PTEC (Employer Enrollment Certificate) in Maharashtra is ₹2,500/year paid by the employer on its own income — separate from employee deductions. We flag this during the discovery call.
                </li>
                <li className="opczp-note-item">
                  For multi-state businesses, PT registrations must be obtained in each state where employees work — remote-work employees are typically liable in the state of their work location, not the HO state.
                </li>
                <li className="opczp-note-item">
                  Salary thresholds and PT slabs are revised periodically by state governments. Our compliance calendar alerts you when slab changes affect your deduction amounts.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#pt-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("pt-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default ProfTaxPriority;
