import React from "react";
import "../OpcZolvitPremium/OpcZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const StartupOdishaPriority = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Startup Odisha Registration by Legal Terminus"
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
                <p className="opczp-subtitle" style={{ textAlign: "left" }}>
                  LT Priority is designed for startups that want faster processing, priority handling, and dedicated professional support for Startup Odisha Recognition. Startup Odisha applications are carefully reviewed by the Startup Cell based on innovation, scalability, and business potential. With LT Priority, your application receives professional drafting support, priority coordination, and dedicated assistance throughout the recognition process.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What You Get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority Application Drafting &amp; Filing Support for faster processing and submission.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Professional Review of startup profile, innovation details, and application documents before filing.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📞</span>
                    Dedicated Support for Startup Odisha queries, clarification responses, and application coordination.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Real-Time Status Updates through Email and WhatsApp during the registration process.
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
                  Recognition is NOT the same as benefits. Once you have the Startup Odisha Recognition Certificate, you still need to APPLY SEPARATELY for each benefit (grant, marketing assistance, patent reimbursement, etc.) - and most have their own application forms, evaluation criteria, and approval timelines. We do not handle these applications under this service.
                </li>
                <li className="opczp-note-item">
                  Odisha presence requirement is real. The Startup Cell verifies that the entity is registered in Odisha OR operates substantively in Odisha (Odisha address, Odisha bank account, Odisha team, Odisha customers). A 'paper' Odisha entity with no real presence will be rejected.
                </li>
                <li className="opczp-note-item">
                  Innovation pitch MUST be substantive. The Startup Cell rejects me-too businesses, generic consultancies, and resellers dressed up as innovation. We do a brutal honesty check on the discovery call - if you don't meet the innovation bar, we'll tell you before filing.
                </li>
                <li className="opczp-note-item">
                  Central DPIIT Recognition is SEPARATE. Startup Odisha is a state-level recognition; central DPIIT Startup India is a separate central-government recognition (which we file under our Startup India service). Many founders pursue both - we can file the central DPIIT in parallel under that separate service.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#startup-odisha-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("startup-odisha-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default StartupOdishaPriority;
