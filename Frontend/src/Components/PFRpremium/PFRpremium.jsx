import React from "react";
import "./PFRpremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          {/* Top two-column row: illustration + content */}
          <div className="zp-top-row">

            {/* Left illustration */}
            <div className="zp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Partnership Firm Registration by Legal Terminus"
                className="zp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="zp-content">

              {/* Title + subtitle */}
              <header className="zp-header">
                <h2 className="zp-title">
                  Legal Terminus{" "}
                  <span className="zp-title-highlight">Priority</span>{" "}
                  <span className="zp-title-icon">⚖</span>
                </h2>
                <p className="zp-subtitle">
                  Starting a Partnership Firm may look easy, but problems usually arise later when the agreement is not clear. We make sure your Partnership Deed is properly drafted to avoid future disputes between partners.
                </p>
              </header>

              {/* Features */}
              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    Draft of Partnership Deed within 48 hours and quick stamp duty calculation.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Deed reviewed by an experienced professional covering profit sharing, exit terms, and dispute handling.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Regular updates on registration status via WhatsApp.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📞</span>
                    Direct support from a dedicated expert whenever you need help.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Complete post-registration documents and compliance guidance.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="zp-bottom-full">
            <h3 className="zp-label">Important Notes</h3>
            <div className="zp-note-box">
              <ul className="zp-note-list">
                <li className="zp-note-item">
                  <strong>Unregistered firms cannot SUE</strong> third parties or co-partners under Section 69 — but they CAN be sued. If a customer doesn't pay, you have no court remedy unless you register first. Strongly weigh this before opting Elemental tier.
                </li>
                <li className="zp-note-item">
                  <strong>The Partnership Deed is your firm's constitution</strong> — not a template. Generic deeds skip clauses on goodwill, IP ownership, partner-incapacity, dissolution triggers. Our custom Deed (Enriched / Supreme) covers all 12 standard contingency clauses.
                </li>
                <li className="zp-note-item">
                  <strong>Firm partners have UNLIMITED liability</strong> — personal assets are at risk for firm debts. If liability protection matters, you should be looking at LLP, not Partnership Firm. We flag this on the discovery call.
                </li>
                <li className="zp-note-item">
                  <strong>Audit kicks in at turnover &gt; ₹1 crore</strong> (Section 44AB of the Income Tax Act). Below that, you can use Section 44ADA presumptive taxation if professional, or Section 44AD if business — much simpler than full audit.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <button className="zp-cta-btn">
                Consult a Legal Expert
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ZolvitPremium;
