import React from "react";
import "./FoodlicenseZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const FoodlicenseZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="FSSAI Food License Registration by Legal Terminus"
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
                  FSSAI registration sounds simple — but wrong license type selection, FBO category mismatches, and inspection-ready documentation gaps cause rejections and delays. Priority is what happens when a senior expert owns your FSSAI file from discovery call to license certificate delivery.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Same-day license type recommendation — Basic, State, or Central — based on your actual turnover and business model, before you commit.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior expert reviewed document package and FBO category mapping to prevent FoSCoS rejection on first submission.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Inspection-ready documentation — product list, layout plan, FSMS undertaking — prepared and reviewed before filing.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Real-time FoSCoS application status updates on mail and WhatsApp — no checking the portal yourself.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Post-license kit: FSSAI certificate, compliance calendar, display notice template, and renewal due-date alert.
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
                  License type selection is the #1 reason for FSSAI application rejection. A petty food vendor applying for a Central License — or a medium manufacturer applying for Basic Registration — will face rejection. We confirm the correct type on a discovery call before a single document is submitted.
                </li>
                <li className="opczp-note-item">
                  FSSAI may conduct a physical inspection for State and Central licenses. Premises must be ready: safe drinking water source, clean work area, pest control records, health certificates for food handlers, and accurate layout plan. We prepare your inspection checklist in advance.
                </li>
                <li className="opczp-note-item">
                  Food product list accuracy matters. FSSAI issues licenses for specific food categories. Adding a new product category after license issuance requires a modification application (paid, ~30 days). Plan your product scope before filing — we help you future-proof it.
                </li>
                <li className="opczp-note-item">
                  Renewal is non-negotiable. A lapsed FSSAI license means you must stop food business operations legally until reactivated. We send renewal reminders 90/60/30 days before expiry under State and Central plans.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#fl-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("fl-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default FoodlicenseZolvitPremium;
