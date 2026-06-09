import React from "react";
import "../OpcZolvitPremium/OpcZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const ProfTaxPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          {/* Top two-column row: illustration + content */}
          <div className="opczp-top-row">

            {/* Left illustration */}
            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Professional Tax Compliance by Legal Terminus"
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
                  Professional Tax sounds simple — deduct from salary, file return, done. The reality is messier: states change slabs without notice, challan codes differ by municipality, and one missed deadline triggers compounding penalties. Priority is what happens when a senior compliance officer owns your PT file from registration to annual reconciliation.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    48-hour SLA on PT registration filing — and a same-day state applicability check before you commit.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior expert reviewed slab mapping for your employee headcount and salary structure.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Proactive deadline alerts via email and WhatsApp — 7 days and 2 days before each due date.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Real-time return status updates — no logging into state portals at midnight.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Annual PT compliance kit: registration certificate, challan history, filed returns archive.
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
                  PT applicability varies drastically by state. What applies in Maharashtra (monthly filing, ₹200–₹2,500 slab) is different from Karnataka (annual enrolment for self-employed, monthly employer deduction). We map your exact state obligations before filing.
                </li>
                <li className="opczp-note-item">
                  PT is constitutionally capped at ₹2,500 per person per year. No state can levy more — if you're being charged above this, it's an error. We flag overcharges immediately.
                </li>
                <li className="opczp-note-item">
                  Non-filing of PT returns attracts compounding penalties in most states. Maharashtra levies ₹1,000/month; Karnataka ₹50/day. Don't let small compliance slip into a large penalty. Priority clients get automated reminders before every deadline.
                </li>
                <li className="opczp-note-item">
                  Employers are personally liable for PT deducted but not remitted. If you've been deducting PT from employees but not depositing with the state government, this is a serious default. We help you regularize past dues with a managed approach.
                </li>
                <li className="opczp-note-item">
                  PT registration is mandatory even if no employees are currently on payroll — the obligation kicks in the moment you intend to hire. Register proactively, not reactively.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#proftax-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("proftax-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default ProfTaxPremium;
