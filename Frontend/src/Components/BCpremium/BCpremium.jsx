import React from "react";
import "./BCpremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const BCPriority = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          {/* Top two-column row: illustration + content */}
          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="GS1 Barcode Registration by Legal Terminus"
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
                  GS1 registration sounds straightforward — but prefix tier selection, GSTIN linkage errors, and GS1 portal rejections cause delays. Priority is what happens when a senior expert owns your file from document check to barcode image delivery.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Same-day GS1 prefix tier recommendation — so you never over-pay or under-allocate GTINs.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior expert reviewed document package to prevent GS1 India rejection on first submission.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    GSTIN linkage verified before portal filing — the #1 cause of GS1 application delays.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Real-time GS1 portal status updates on mail and WhatsApp throughout the process.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Delivery kit: barcode image files (PNG + SVG), product data on GS1 registry, and renewal calendar.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="opczp-bottom-full">
            <h3 className="opczp-label">Important Notes</h3>
            <div className="opczp-note-box">
              <ul className="opczp-note-list">
                <li className="opczp-note-item">
                  GS1 India's annual subscription is mandatory and billed at actuals over and above our professional fee. The subscription amount depends on the prefix tier (number of GTINs) you select — we confirm this before filing.
                </li>
                <li className="opczp-note-item">
                  Each unique product variant (size, colour, flavour, pack size) requires a separate GTIN. A 100ml and 250ml pack of the same product are two different barcodes. Ensure your product list is finalised before we begin.
                </li>
                <li className="opczp-note-item">
                  Annual renewal of the GS1 subscription is non-negotiable. Non-renewal deactivates your Company Prefix and all associated GTINs globally — Amazon and retail POS systems will reject your products. We send renewal reminders 60 days before due date.
                </li>
                <li className="opczp-note-item">
                  Barcode scan performance depends on correct printing: bar width tolerance, quiet zones, and contrast ratio per GS1 print quality specification. We provide print-ready files, but final print quality is the responsibility of your packaging vendor.
                </li>
                <li className="opczp-note-item">
                  Non-GS1 barcodes (random number generators, local barcode tools) are not valid for Amazon, Flipkart, or international retail chains. If you currently use non-GS1 barcodes, we will migrate your listings to GS1 GTINs as part of the engagement.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#bc-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("bc-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default BCPriority;
