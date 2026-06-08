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
                  Get your IEC Registration completed faster with Legal Terminus' expert-handled process — designed for businesses who want smooth import/export setup with quick approval and zero rejection risk.
                </p>
              </header>

              {/* Features */}
              <section className="ieczp-section-block">
                <h3 className="ieczp-label">What you get</h3>
                <ul className="ieczp-list ieczp-features-list">
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">🧑‍⚖️</span>
                    End-to-end IEC registration handled by our legal experts to ensure quick approval and zero rejection risk.
                  </li>
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">📑</span>
                    Hassle-free documentation support and DGFT application filing with document pre-verification.
                  </li>
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">⏱️</span>
                    Fast processing with real-time status updates on mail and WhatsApp.
                  </li>
                  <li className="ieczp-list-item">
                    <span className="ieczp-list-icon">📋</span>
                    Post-registration kit: IEC certificate and compliance guidance delivered to your inbox.
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
                  <strong>DGFT document verification</strong> is mandatory before submission. We pre-check all documents (PAN, address proof, bank certificate, cancel cheque) to prevent rejection or delay.
                </li>
                <li className="ieczp-note-item">
                  <strong>IEC annual update</strong> is required every year (April–June) on the DGFT portal, even if there are no changes — failure to update results in deactivation of the IEC code.
                </li>
                <li className="ieczp-note-item">
                  <strong>Government fee of ₹500</strong> is payable at actuals directly on the DGFT portal and is not included in the professional fee. We assist with the payment process.
                </li>
                <li className="ieczp-note-item">
                  <strong>IEC modification</strong> (change in address, bank, activity) requires a fresh DGFT application. Modifications are not covered in the base plan — additional charges apply.
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
