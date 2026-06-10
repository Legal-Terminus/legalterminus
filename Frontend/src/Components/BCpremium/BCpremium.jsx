import React from "react";
import "./BCpremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const BCPriority = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

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
                  Bar Code Registration may look simple, but choosing the wrong barcode capacity, incorrect product mapping, or incomplete DataKart setup can create problems later while selling on marketplaces, retail chains, or export platforms. Proper GS1 registration helps businesses avoid future barcode expansion costs and ensures smoother product onboarding across platforms.
                  <br /><br />
                  With LT Priority, your Bar Code Registration is handled on a fast-track basis with dedicated professional support, priority filing, and complete coordination from application to barcode activation.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority processing for faster GS1 India registration and barcode allocation
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📦</span>
                    Professional guidance for selecting the correct barcode package based on your product range
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Senior expert review before final application submission
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📲</span>
                    Real-time updates and dedicated coordination support throughout the process
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
                  Only GS1 India can issue legitimate GS1 barcodes in India. Third-party services selling 'discount barcodes' for Rs.500–2,000 are NOT GS1 barcodes — they will fail at Amazon / Flipkart / modern trade / customs / global retail. Cheap up-front = expensive at the shelf. We file only via the official GS1 India portal (https://www.gs1india.org).
                </li>
                <li className="opczp-note-item">
                  Each unique SKU = one GTIN. A T-shirt in 5 sizes x 4 colours = 20 GTINs, not 1. Bulk packs / multipacks need their own GTIN. Wrong pack size at registration = either over-payment (you pay for 1,000 when 100 suffice) or expensive top-up (you bought 100 but need 1,000 — have to pay incremental). We audit your SKU plan first.
                </li>
                <li className="opczp-note-item">
                  MSME 80% reimbursement is NOT automatic. The applicant must be Udyam-registered AND must file the reimbursement claim in the prescribed manner. Many small manufacturers miss the deadline / form and forfeit up to Rs.50,650 of reimbursement. Enriched + Supreme tiers handle the claim.
                </li>
                <li className="opczp-note-item">
                  GS1 Sunrise 2027 transition: GS1 Global is moving global retail from 1D linear barcodes (EAN-13) to 2D barcodes / QR codes by 2027. Pharma in India has already mandated 2D barcoding for Top 300 brands since Aug 2023 (DCGI Order). Plan ahead — Supreme tier includes 2D transition advisory.
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
