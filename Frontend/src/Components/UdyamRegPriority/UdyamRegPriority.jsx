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
                  Udyam sounds straightforward — enter Aadhaar, pick a code, submit. The reality is messier: wrong NIC codes trigger classification disputes, unlinked Aadhaar mobiles block the OTP, and misdeclared turnover figures auto-flag under GSTR mismatch. Priority is what happens when a senior expert owns your file from document check to certificate delivery.
                </p>
              </header>

              <section className="udyamzp-section-block">
                <h3 className="udyamzp-label">What you get</h3>
                <ul className="udyamzp-list udyamzp-features-list">
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">⚡</span>
                    Same-day filing SLA — submit your documents before 5 PM and your Udyam Number is generated the same day.
                  </li>
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">✅</span>
                    Expert NIC code review — we map your primary activity to the correct code to avoid classification disputes or scheme ineligibility.
                  </li>
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">✅</span>
                    Pre-filing document check — we verify your Aadhaar mobile linkage, PAN status, and entity proof before hitting the portal.
                  </li>
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">🔄</span>
                    Real-time status updates on email and WhatsApp — know exactly where your application stands without chasing us.
                  </li>
                  <li className="udyamzp-list-item">
                    <span className="udyamzp-list-icon">📑</span>
                    Post-registration kit: Udyam Certificate PDF, NIC code summary, and MSME scheme eligibility checklist.
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
                  Only ONE Udyam Registration is allowed per enterprise (per PAN). If you operate multiple business activities, all must be covered under a single Udyam certificate — additional registrations under the same PAN are invalid and can lead to cancellation.
                </li>
                <li className="udyamzp-note-item">
                  Your Aadhaar mobile number must be linked to UIDAI for OTP authentication. If it is not, you must update it at an Aadhaar Seva Kendra before we can proceed — this is a mandatory portal requirement, not something we can bypass.
                </li>
                <li className="udyamzp-note-item">
                  Udyam is self-declaration-based, but turnover and investment figures are cross-verified against your ITR and GSTR data from FY 2020-21 onwards. Providing inflated or incorrect figures to get a lower classification constitutes misdeclaration and attracts penalties under Section 27 of the MSMED Act.
                </li>
                <li className="udyamzp-note-item">
                  MSME classification thresholds were revised upward by Budget 2025 (effective 1 April 2025). Micro is now up to Rs.2.5 Cr investment and Rs.10 Cr turnover. If you were previously classified as Small, you may now qualify as Micro — we will reassess your classification before filing.
                </li>
                <li className="udyamzp-note-item">
                  Udyam Registration has lifetime validity but requires annual update of turnover and investment details based on your ITR filing. We recommend reviewing your classification every year to ensure you continue to avail correct scheme benefits.
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
