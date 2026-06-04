import React from "react";
import "./PublicltdZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          {/* Top two-column row: illustration + content */}
          <div className="zp-top-row">

            {/* Left illustration */}
            <div className="zp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Public Limited Company Registration by Legal Terminus"
                className="zp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="zp-content">

              <header className="zp-header">
                <h2 className="zp-title">
                  Legal Terminus{" "}
                  <span className="zp-title-highlight">Priority</span>{" "}
                  <span className="zp-title-icon">⚖</span>
                </h2>
                <p className="zp-subtitle">
                  A Public Limited Company is heavier machinery than a Private Limited — 7 subscribers, 3 directors, deeper stamp duty, future-listing optics. Priority is what happens when a senior expert owns your incorporation file, front to back, with zero handoffs.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    72-hour SLA on first MOA/AOA draft — and a same-day name search before you commit.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Senior expert reviewed your documents and provide the name availability percentage.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Real-time CRC status updates on mail and WhatsApp — no refreshing the MCA portal at midnight.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Post-incorporation kit: COI, MOA, AOA and compliance calendar.
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
                  Name rejection is the #1 delay. Avoid generic words — follow our naming guidelines, check trademark conflicts, and have 4 backup names ready. We pre-screen, but the CRC is the final authority.
                </li>
                <li className="zp-note-item">
                  Registered office proof must be ≤ 60 days old. NoC from the property owner + utility bill (electricity / gas / telephone bill) — not a rent receipt. Co-working spaces need a service agreement plus the operator's NoC.
                </li>
                <li className="zp-note-item">
                  All 7 subscribers and 3 directors need active DSCs and Aadhaar-linked mobiles. If any subscriber is an NRI / foreign national, expect a 5–7 day extension for apostille / notarisation.
                </li>
                <li className="zp-note-item">
                  INC-20A (commencement of business) must be filed within 180 days of incorporation. Skipping these blocks the PLC from operating bank accounts and triggers ₹10,000 penalties.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#pub-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("pub-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default ZolvitPremium;
