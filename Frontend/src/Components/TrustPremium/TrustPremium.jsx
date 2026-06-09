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
                  Trust registration involves drafting a precise trust deed, selecting the right type of trust, and ensuring the deed is properly stamped and registered with the Sub-Registrar. A single error in the deed can lead to rejection or disputes. Priority is what happens when a senior legal expert manages your file from start to finish.
                </p>
              </header>

              <section className="trusczp-section-block">
                <h3 className="trusczp-label">What you get</h3>
                <ul className="trusczp-list trusczp-features-list">
                  <li className="trusczp-list-item">
                    <span className="trusczp-list-icon">⚡</span>
                    Priority handling by trust law experts with a 48-hour SLA on trust deed draft.
                  </li>
                  <li className="trusczp-list-item">
                    <span className="trusczp-list-icon">✅</span>
                    Senior expert reviewed trust deed — object clause, trustee details, and beneficiary provisions checked thoroughly.
                  </li>
                  <li className="trusczp-list-item">
                    <span className="trusczp-list-icon">✅</span>
                    Pre-verification of trustee eligibility and documentation before filing.
                  </li>
                  <li className="trusczp-list-item">
                    <span className="trusczp-list-icon">🔄</span>
                    Real-time status updates on mail and WhatsApp — no follow-up with the Sub-Registrar office needed.
                  </li>
                  <li className="trusczp-list-item">
                    <span className="trusczp-list-icon">📑</span>
                    Post-registration kit: registered trust deed, compliance calendar, and guidance on 12A/80G registration.
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
                  A minimum of 3 members (1 settler + at least 2 trustees) is required to register a public trust. Private trusts may have different requirements depending on state law.
                </li>
                <li className="trusczp-note-item">
                  Trust registration rules vary significantly by state. Public charitable trusts are governed by state-specific Acts (e.g., Maharashtra Public Trusts Act, Rajasthan Public Trust Act). Our experts are familiar with requirements across all major states.
                </li>
                <li className="trusczp-note-item">
                  The trust deed must be executed on non-judicial stamp paper of appropriate value (varies by state and trust property value) and registered with the local Sub-Registrar's office.
                </li>
                <li className="trusczp-note-item">
                  For tax exemptions (12A and 80G), a separate application must be filed with the Income Tax Department after registration. We guide you through this process as part of our post-registration support.
                </li>
              </ul>
            </div>

            <div className="trusczp-cta-row">
              <button className="trusczp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrustPremium;
