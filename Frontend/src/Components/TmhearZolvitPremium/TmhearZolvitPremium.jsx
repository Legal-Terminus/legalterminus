import React from "react";
import "./TmhearZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TmhearZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Trademark Hearing by Legal Terminus"
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
                <p className="opczp-subtitle">
                  A Trademark Hearing is a critical stage in the trademark registration process. Missing the hearing, giving weak arguments, or poor preparation can lead to refusal or abandonment of the application.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your Trademark Hearing matter is handled on a priority basis by experienced IP professionals who ensure timely coordination, proper preparation, and professional representation before the Trade Marks Registry.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority handling and faster hearing coordination.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    Timely hearing tracking with regular status updates.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">👨‍⚖️</span>
                    Professional representation before the Trademark Registry.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📄</span>
                    Detailed hearing preparation with legal arguments and supporting documents.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">💻</span>
                    Online hearing support with proper technical coordination.
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
                  NON-APPEARANCE = ABANDONMENT — failure to appear at any scheduled hearing causes the matter to be MARKED ABANDONED. The Registry does not call out for missing parties — if the Hearing Officer opens the file at the scheduled time and the party / representative is not present, the matter is dismissed for default.
                </li>
                <li className="opczp-note-item">
                  15-DAY NOTICE (Show Cause — Rule 33) — the Registry must give MINIMUM 15 DAYS notice for a Show Cause Hearing. Use this window to engage hearing counsel + prepare thoroughly. Don't leave it to the last 48 hours.
                </li>
                <li className="opczp-note-item">
                  MAX 2 ADJOURNMENTS (Rule 50 proviso) — max 2 adjournments per matter, max 30 days each. Form TM-M (₹900 each) pass-through. Beyond 2 adjournments, Hearing Officer typically proceeds ex-parte on merits. Use adjournments sparingly — prefer to attend prepared on the original date.
                </li>
                <li className="opczp-note-item">
                  ALL HEARINGS ARE ONLINE — 2026 practice is overwhelmingly online video conference. Plan for: stable internet, professional setup, no background noise, formal attire (camera on). Physical hearing only on specific request.
                </li>
                <li className="opczp-note-item">
                  REGISTRAR'S ORDER 30-90 DAYS POST-HEARING — written order typically issued 30-90 days after the hearing. We follow up till order receipt + brief you on the order + advise on next steps (acceptance / appeal under Section 91 / rectification etc.).
                </li>
                <li className="opczp-note-item">
                  PRIOR POWER OF ATTORNEY — if LT was not the prior attorney on file, we draft Form TM-48 POA + Authorisation Letter (additional ₹999 + GST). Required for our online attendance to be recorded as authorised representative.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#tmhear-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("tmhear-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Trademark Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TmhearZolvitPremium;
