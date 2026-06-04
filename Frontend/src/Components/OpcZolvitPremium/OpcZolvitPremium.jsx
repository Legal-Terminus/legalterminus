import React from "react";
import "./OpcZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const OpcZolvitPremium = () => {
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
                alt="OPC Registration by Legal Terminus"
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
                  OPC sounds simple — one director, one nominee, done. The reality is messier: nominee consent gets rejected, name suffixes get wrong, restricted activities trigger CRC objections. Priority is what happens when a senior CS owns your file from name search to COI.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    48-hour SLA on first MOA/AOA draft — and a same-day name search before you commit.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior expert reviewed object clause to make sure your business doesn't fall under restricted activities.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior expert reviewed your documents and provide the name availability percentage.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Real-time CRC status updates on mail and WhatsApp — no refreshing the MCA portal at midnight.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Post-incorporation kit: COI, MOA, AOA and compliance calendar.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="opczp-bottom-full">
            <h3 className="opczp-label">Important Notes</h3>
            <p className="opczp-notes-intro">Heads up — these are the things that derail OPC incorporations:</p>
            <div className="opczp-note-box">
              <ul className="opczp-note-list">
                <li className="opczp-note-item">
                  The nominee must be an Indian citizen, age 18+, and cannot already be a member or nominee of another OPC. A wrong nominee selection = full re-filing. We verify nominee eligibility before drafting INC-3.
                </li>
                <li className="opczp-note-item">
                  Name rejection is the #1 delay. Avoid generic words — follow our naming guidelines, check trademark conflicts, and have 4 backup names ready. We pre-screen, but the CRC is the final authority.
                </li>
                <li className="opczp-note-item">
                  OPCs cannot conduct Non-Banking Financial Investment activities including investing in securities of any body corporate. If your business model touches investment / lending / insurance, you'll need a Pvt Ltd or PLC structure — we'll flag this on the discovery call.
                </li>
                <li className="opczp-note-item">
                  Company name must end with '(OPC) Private Limited' — non-negotiable per Rule 8. Marketing names without the OPC suffix are not allowed in the official name (you can still use a brand name on invoices).
                </li>
                <li className="opczp-note-item">
                  Stay requirement for the sole member: 120 days in India during the immediately preceding financial year (reduced from 182 days post-2021 amendment). NRIs can incorporate, but the stay test still applies.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#opc-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("opc-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default OpcZolvitPremium;
