import React from "react";
import "./TrustPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const TrustPremium = () => {
  return (
    <section className="trusczp-section">
      <div className="trusczp-container">
        <div className="trusczp-card">

          {/* Top two-column row: illustration + content */}
          <div className="trusczp-top-row">

            {/* Left illustration */}
            <div className="trusczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Trust Registration by Legal Terminus"
                className="trusczp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="trusczp-content">
              <header className="trusczp-header">
                <h2 className="trusczp-title">
                  Legal Terminus{" "}
                  <span className="trusczp-title-highlight">Priority</span>{" "}
                  <span className="trusczp-title-icon">⚖</span>
                </h2>
                <p className="trusczp-subtitle">
                  Trust Registration may appear simple, but a properly drafted Trust Deed is extremely important for the long-term functioning of the Trust. The object clauses, trustee powers, succession process, and management rules play a major role in future compliance, governance, and eligibility for registrations such as 12A and 80G.
                </p>
                <p className="trusczp-subtitle" style={{ marginTop: "10px" }}>
                  With LT Priority, your Trust Registration is handled on a fast-track basis with dedicated professional support, priority drafting, quicker coordination, and faster filing support throughout the process.
                </p>
              </header>

              <section className="trusczp-section-block">
                <h3 className="trusczp-label">What you get</h3>
                <ul className="trusczp-list trusczp-features-list">
                  <li className="trusczp-list-item">
                    <span className="trusczp-list-icon">⚡</span>
                    Priority processing for faster Trust Registration and document handling
                  </li>
                  <li className="trusczp-list-item">
                    <span className="trusczp-list-icon">📑</span>
                    Professionally drafted Trust Deed with clear object and governance clauses
                  </li>
                  <li className="trusczp-list-item">
                    <span className="trusczp-list-icon">✅</span>
                    Senior expert review before final registration filing
                  </li>
                  <li className="trusczp-list-item">
                    <span className="trusczp-list-icon">🏛</span>
                    12A &amp; 80G registration support included in Enriched &amp; Supreme Plans
                  </li>
                  <li className="trusczp-list-item">
                    <span className="trusczp-list-icon">📂</span>
                    Post-registration kit with Trust Deed, Registration Certificate, PAN, and compliance guidance
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="trusczp-bottom-full">
            <h3 className="trusczp-label">Important Notes</h3>
            <div className="trusczp-note-box">
              <ul className="trusczp-note-list">
                <li className="trusczp-note-item">
                  Object clause must be SPECIFIC and CHARITABLE. Generic 'social welfare' clauses get rejected for 12A. Education, healthcare, environment, poverty alleviation - each demands precise framing. We stress-test the object before drafting.
                </li>
                <li className="trusczp-note-item">
                  Stamp duty is state-specific and depends on the trust's property value. Maharashtra: Rs.500 typically; Karnataka: Rs.1,000 typically; some states with sizeable trust corpus may attract higher slabs. We calculate precisely on the discovery call.
                </li>
                <li className="trusczp-note-item">
                  Minimum 2 trustees required. Same person CAN be both settlor AND trustee - but can't be the SOLE trustee (the Trust would lack legal capacity). Plan trustee composition before drafting the Deed.
                </li>
                <li className="trusczp-note-item">
                  12A and 80G are SEPARATE applications (under the Income Tax Act, not Indian Trusts Act). Without them, your Trust pays 30% income tax and donors get no tax benefit. Apply within 1 year of registration for cleanest treatment. The Enriched tier handles this.
                </li>
              </ul>
            </div>

            <div className="trusczp-cta-row">
              <a
                href="#trust-consult-form"
                className="trusczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("trust-consult-form");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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

export default TrustPremium;
