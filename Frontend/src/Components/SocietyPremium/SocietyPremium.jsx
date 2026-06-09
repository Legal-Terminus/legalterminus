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
                  Society Registration may look simple, but the real strength of a Society depends on properly drafted Rules & Regulations and clear governance structure. The MoA and Rules define how the Society will operate, manage members, appoint office bearers, conduct meetings, and handle future decisions.
                </p>
                <p className="soczp-subtitle" style={{ marginTop: "10px" }}>
                  With LT Priority, your application is handled on a fast-track basis with dedicated professional support, quicker drafting, priority filing, and faster coordination throughout the registration process.
                </p>
              </header>

              <section className="soczp-section-block">
                <h3 className="soczp-label">What you get</h3>
                <ul className="soczp-list soczp-features-list">
                  <li className="soczp-list-item">
                    <span className="soczp-list-icon">⚡</span>
                    Priority processing for faster Society Registration filing and follow-up
                  </li>
                  <li className="soczp-list-item">
                    <span className="soczp-list-icon">📑</span>
                    Professionally drafted MoA &amp; Rules with proper governance clauses
                  </li>
                  <li className="soczp-list-item">
                    <span className="soczp-list-icon">✅</span>
                    Senior professional review of documents before final submission
                  </li>
                  <li className="soczp-list-item">
                    <span className="soczp-list-icon">📲</span>
                    Real-time updates and dedicated coordination support
                  </li>
                  <li className="soczp-list-item">
                    <span className="soczp-list-icon">📂</span>
                    Post-registration kit with Registration Certificate and compliance guidance
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
                  7-member minimum is statutory - and in some states (AP, Telangana), members must be from at least 7 different families. Plan member composition carefully before drafting the MoA. We confirm state-specific rules on the discovery call.
                </li>
                <li className="soczp-note-item">
                  Rules & Regulations determine 30-year governance. Wrong drafting (e.g., no clear quorum rules, no replacement-of-office-bearer mechanism, no member-expulsion procedure) creates governance disputes years later. Senior-professional drafting matters.
                </li>
                <li className="soczp-note-item">
                  Society is STATE-LEVEL. The Society is registered in the state of its registered office - and that state's Societies Act + procedural variations apply. Multi-state operations need either (a) the parent Society + state branches (procedurally complex) or (b) multiple Societies (one per state).
                </li>
                <li className="soczp-note-item">
                  Society vs Trust vs Section 8 Company - they're NOT interchangeable. Societies are member-driven (democratic governance via Office Bearers election). Trusts are founder/trustee-driven. Section 8 Companies are board/director-driven. Pick based on your governance preference - we advise on the discovery call.
                </li>
              </ul>
            </div>

            <div className="soczp-cta-row">
              <a
                href="#society-consult-form"
                className="soczp-cta-btn"
                style={{ textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("society-consult-form");
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

export default SocietyPremium;
