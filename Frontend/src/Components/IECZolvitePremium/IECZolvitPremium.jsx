import React from "react";
import "./IECZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const IECZolvitPremium = () => {
  return (
    <section className="ieczp-section">
      <div className="ieczp-container">
        <div className="ieczp-card">

          {/* Top two-column row: illustration + content */}
          <div className="ieczp-top-row">

            {/* Left illustration */}
            <div className="ieczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Import Export Code Registration by Legal Terminus"
                className="ieczp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="ieczp-content">

              {/* Title + subtitle */}
              <header className="ieczp-header">
                <h2 className="ieczp-title">
                  Legal Terminus{" "}
                  <span className="ieczp-title-highlight">Priority</span>{" "}
                  <span className="ieczp-title-icon">⚖</span>
                </h2>
                <p className="ieczp-subtitle">
                  Getting an IEC registration is simple when your documents and Aadhaar-PAN linkage are properly in place. However, many businesses face delays due to portal errors, DSC issues, missed annual updates, or lack of guidance for ICEGATE, AD Code, and export incentive setup. At Legal Terminus, we do more than just file your IEC application. We provide end-to-end support to help your business become fully ready for import and export operations.
                </p>
              </header>

              {/* Features */}
              <section className="ieczp-section-block">
                <h3 className="ieczp-label">What you get</h3>
                <ul className="ieczp-list ieczp-features-list">
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">⚡</span>
                    IEC Registration filing on DGFT portal within 24 hours of receiving complete documents.
                  </li>
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">✅</span>
                    Expert verification of PAN, Aadhaar linkage, business details, and document readiness before filing.
                  </li>
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">📱</span>
                    Real-time application updates via Email and WhatsApp throughout the registration process.
                  </li>
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">📑</span>
                    Post-registration support including IEC Certificate, ICEGATE guidance, and basic import-export compliance resources.
                  </li>
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">🤝</span>
                    Single point of contact for IEC, ICEGATE, AD Code, GST, Trademark, and other business registrations.
                  </li>
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">🌐</span>
                    Assistance in making your business import-export ready with smooth DGFT filing support.
                  </li>
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">⏱️</span>
                    Fast processing with IEC Certificate delivery in 1–2 working days in most cases.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="ieczp-bottom-full">
            <h3 className="ieczp-label">Important Notes</h3>
            <div className="ieczp-note-box">
              <ul className="ieczp-note-list">
                <li className="ieczp-note-item">
                  Mandatory Annual Update is the single biggest gotcha. EVERY IEC must be updated online between 1 April and 30 June each year - even with zero changes. Miss it = IEC deactivated = no shipping bills, no bills of entry, no foreign payments. We send the reminder and handle the update free for 1 year.
                </li>
                <li className="ieczp-note-item">
                  Service exporters often think they don't need IEC because they're not shipping physical goods. Wrong. If you receive payment in foreign currency for services (IT, consulting, design, BPO, freelancing for foreign clients), IEC is mandatory for the bank to credit FIRC and process the inward remittance correctly.
                </li>
                <li className="ieczp-note-item">
                  AD Code registration is separate from IEC - it links your bank account to your IEC on the customs portal (ICEGATE). Without AD Code, your shipping bill won't process and your export proceeds won't flow back to you. Enriched and Supreme tiers handle this.
                </li>
                <li className="ieczp-note-item">
                  PAN-Aadhaar linkage must be valid (post 30 June 2023 deadline). Inoperative PANs cannot complete IEC application - the DGFT portal rejects them. Check at incometax.gov.in before applying.
                </li>
              </ul>
            </div>

            <div className="ieczp-cta-row">
              <a
                href="#iec-consult-form"
                className="ieczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("iec-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default IECZolvitPremium;
