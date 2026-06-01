import React from "react";
import "./ProZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          <div className="zp-top-row">
            <div className="zp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Proprietorship Firm Registration by Legal Terminus"
                className="zp-illustration"
              />
            </div>

            <div className="zp-content">
              <header className="zp-header">
                <h2 className="zp-title">
                  Legal Terminus{" "}
                  <span className="zp-title-highlight">Priority</span>{" "}
                  <span className="zp-title-icon">⚖</span>
                </h2>
                <p className="zp-subtitle">
                  Proprietorships are deceptively simple — until the bank refuses to open a current account because your MSME doesn't match your Shop &amp; Establishment, or until a marketplace rejects you because your GST address doesn't match your bank statement. Priority is what happens when a senior expert stitches all your registrations together as one coherent identity.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    48-hour SLA on MSME + Shop &amp; Establishment filings — same-day if started before 11 AM.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Senior expert reviewed registration map — no mismatches between MSME, Shop &amp; Est, GST, and bank docs.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Regular updates on registration status via Mail &amp; WhatsApp.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📞</span>
                    Direct support from a dedicated expert whenever you need help.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Complete Registration Certificate, post-registration compliance guidance.
                  </li>
                </ul>
              </section>
            </div>
          </div>

          <div className="zp-bottom-full">
            <h3 className="zp-label">Important Notes</h3>
            <div className="zp-note-box">
              <ul className="zp-note-list">
                <li className="zp-note-item">
                  Banks are now strict about 'business existence proof' for current accounts. Most require BOTH a Shop &amp; Establishment certificate AND a GST registration (or MSME + GST). Proprietorships set up only on MSME often get rejected at the bank stage.
                </li>
                <li className="zp-note-item">
                  Marketplace onboarding (Amazon, Flipkart, Meesho, Zomato) requires a GSTIN matching your bank statement and Aadhaar address. Mismatches between any of these = onboarding rejected. Plan the address consistency upfront.
                </li>
                <li className="zp-note-item">
                  Section 44AD presumptive tax has a 5-year lock-in: if you opt in once and then opt out, you lose the benefit for the next 5 years. Don't toggle in and out — pick a regime and stick. We run the math on the discovery call.
                </li>
                <li className="zp-note-item">
                  Proprietorship has UNLIMITED liability — your personal assets (house, savings, vehicle) are at risk for business debts. If you're operating in regulated, high-liability, or product-recall sectors, you should NOT be a proprietorship. We'll flag this honestly.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#pro-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("pro-consult-form")?.scrollIntoView({ behavior: "smooth" });
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
