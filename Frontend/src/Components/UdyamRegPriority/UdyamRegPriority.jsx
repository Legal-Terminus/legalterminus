import React from "react";
import "./UdyamRegPriority.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const UdyamRegPriority = () => {
  return (
    <section className="udyamzp-section">
      <div className="udyamzp-container">
        <div className="udyamzp-card">

          <div className="udyamzp-top-row">

            <div className="udyamzp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Udyam Registration by Legal Terminus"
                className="udyamzp-illustration"
              />
            </div>

            <div className="udyamzp-content">
              <header className="udyamzp-header">
                <h2 className="udyamzp-title">
                  Legal Terminus{" "}
                  <span className="udyamzp-title-highlight">Priority</span>{" "}
                  <span className="udyamzp-title-icon">⚖</span>
                </h2>
                <p className="udyamzp-subtitle">
                  Anyone can file a UDYAM in 30 minutes, for free. The reason most businesses still pay for it: the wrong NIC code reclassifies you later, future updates / corrections need professional handling, and bundling Udyam with GST and Trademark from the same expert keeps your name and address consistent across all certificates so banks and buyers don't reject KYC for mismatches.
                </p>
              </header>

              <section className="udyamzp-section-block">
                <h3 className="udyamzp-label">What you get</h3>
                <ul className="udyamzp-list udyamzp-features-list">
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">⚡</span>
                    Same-day UDYAM Registration filing upon receipt of complete documents.
                  </li>
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">🎯</span>
                    Expert review of your business activities and selection of appropriate NIC Codes.
                  </li>
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">🔄</span>
                    Free support for UDYAM profile updates, corrections, and modifications for 1 year.
                  </li>
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">📱</span>
                    Real-time status updates via Email and WhatsApp throughout the registration process.
                  </li>
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">📑</span>
                    Post-registration kit including UDYAM Certificate, MSME benefits guide, and compliance support resources.
                  </li>
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">🤝</span>
                    Single point of contact for UDYAM, GST, Trademark, Startup India, and other business registrations.
                  </li>
                </ul>
              </section>
            </div>
          </div>

          <div className="udyamzp-bottom-full">
            <h3 className="udyamzp-label">Important Notes</h3>
            <div className="udyamzp-note-box">
              <ul className="udyamzp-note-list">
                <li className="udyamzp-note-item">
                  Aadhaar must be mobile-linked for OTP. If your registered mobile number changed and you didn't update Aadhaar, the filing fails. Update at any UIDAI centre BEFORE applying. Takes 7–10 days.
                </li>
                <li className="udyamzp-note-item">
                  PAN-Aadhaar linkage is now mandatory (post-30 June 2023 deadline). Unlinked PANs are inoperative — Udyam filing on an inoperative PAN gets rejected. Check at incometax.gov.in before applying.
                </li>
                <li className="udyamzp-note-item">
                  NIC code matters more than people think. Pick wrong (e.g. trading code for a manufacturing business) and you become ineligible for manufacturing-only subsidies (PMEGP capital subsidy, ZED tier benefits). We map carefully against your activities.
                </li>
                <li className="udyamzp-note-item">
                  Udyam classification updates AUTOMATICALLY based on your ITR + GSTR data each year. If your investment + turnover crosses the slab during a year, you graduate to the next tier next FY (Micro → Small → Medium). Plan growth around this — some MSME benefits drop off above the Micro threshold.
                </li>
              </ul>
            </div>

            <div className="udyamzp-cta-row">
              <a
                href="#udyam-consult-form"
                className="udyamzp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("udyam-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default UdyamRegPriority;
