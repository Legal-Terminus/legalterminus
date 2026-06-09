import React from "react";
import "./SocietyPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const SocietyPremium = () => {
  return (
    <section className="soczp-section">
      <div className="soczp-container">
        <div className="soczp-card">

          {/* Top two-column row: illustration + content */}
          <div className="soczp-top-row">

            {/* Left illustration */}
            <div className="soczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Society Registration by Legal Terminus"
                className="soczp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="soczp-content">
              <header className="soczp-header">
                <h2 className="soczp-title">
                  Legal Terminus{" "}
                  <span className="soczp-title-highlight">Priority</span>{" "}
                  <span className="soczp-title-icon">⚖</span>
                </h2>
                <p className="soczp-subtitle">
                  Society registration sounds straightforward — but objections to the society name, incomplete MOA/bylaws, or missing member signatures can stall your application for weeks. Priority is what happens when a senior legal expert owns your file from name verification to registration certificate.
                </p>
              </header>

              <section className="soczp-section-block">
                <h3 className="soczp-label">What you get</h3>
                <ul className="soczp-list soczp-features-list">
                  <li className="soczp-list-item">
                    <span className="soczp-list-icon">⚡</span>
                    Priority handling by society registration experts with same-day name verification.
                  </li>
                  <li className="soczp-list-item">
                    <span className="soczp-list-icon">✅</span>
                    Complete documentation support — MOA, bylaws, member declarations reviewed by a senior expert.
                  </li>
                  <li className="soczp-list-item">
                    <span className="soczp-list-icon">✅</span>
                    Pre-screening of society name against existing registrations to avoid rejections.
                  </li>
                  <li className="soczp-list-item">
                    <span className="soczp-list-icon">🔄</span>
                    Real-time status updates on mail and WhatsApp — no chasing the registrar's office yourself.
                  </li>
                  <li className="soczp-list-item">
                    <span className="soczp-list-icon">📑</span>
                    Post-registration kit: registration certificate, MOA, bylaws, and compliance checklist.
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="soczp-bottom-full">
            <h3 className="soczp-label">Important Notes</h3>
            <div className="soczp-note-box">
              <ul className="soczp-note-list">
                <li className="soczp-note-item">
                  A minimum of 7 members is required to register a society under the Societies Registration Act, 1860. All members must provide valid identity and address proof.
                </li>
                <li className="soczp-note-item">
                  Society name rejection is the most common delay. Avoid names that are too generic or already in use. We pre-check your preferred name and suggest alternatives if needed.
                </li>
                <li className="soczp-note-item">
                  Society registration is state-governed — rules, fees, and timelines vary by state. Our experts are familiar with local requirements across all major states.
                </li>
                <li className="soczp-note-item">
                  Post-registration, the society must file annual returns with the Registrar of Societies. Failure to comply can result in cancellation of registration.
                </li>
              </ul>
            </div>

            <div className="soczp-cta-row">
              <button className="soczp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SocietyPremium;
