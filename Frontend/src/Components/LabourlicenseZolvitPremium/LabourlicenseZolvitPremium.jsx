import React from "react";
import "./LabourlicenseZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const LabourlicenseZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Labour Licence (CLRA) Registration by Legal Terminus"
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
                  Labour licensing sounds simple — but wrong registration type, missing Form V from the principal employer, and incorrect workmen counts cause rejections and inspection trouble. Priority is what happens when a senior expert owns your CLRA file from discovery call to certificate delivery.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Same-day applicability check — do you need a Principal Employer RC, a Contractor Licence, or both — based on your actual role and workmen count, before you commit.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior expert reviewed Form I / IV package and workmen mapping to prevent department rejection on first submission.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Form V coordination with the principal employer and security deposit calculation done before filing — no last-minute surprises.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Real-time application status updates on mail and WhatsApp — no following up with the labour office yourself.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Post-licence kit: Certificate of Registration / Licence, compliance calendar, register templates, and renewal due-date alert.
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
                  Registration type selection is the #1 reason for CLRA application rejection. A principal employer applying as a contractor — or a contractor filing without the principal employer's Form V — will face rejection. We confirm the correct route on a discovery call before a single form is submitted.
                </li>
                <li className="opczp-note-item">
                  The labour department may inspect the worksite. Statutory welfare amenities must be in place: canteen (where applicable), restrooms, drinking water, first-aid, and proper wage records. We prepare your compliance checklist in advance.
                </li>
                <li className="opczp-note-item">
                  Workmen count accuracy matters. The licence is issued for a maximum number of workmen and the fee/deposit scale with it. Engaging more workmen than licensed requires an amendment (paid). Plan your peak headcount before filing — we help you future-proof it.
                </li>
                <li className="opczp-note-item">
                  Renewal is non-negotiable. A lapsed labour licence means you cannot legally engage contract labour until reactivated, exposing the principal employer to liability. We send renewal reminders 90/60/30 days before expiry under the relevant plans.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ll-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ll-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default LabourlicenseZolvitPremium;
