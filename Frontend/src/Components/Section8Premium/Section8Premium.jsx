import React from "react";
import "../PvtltdZolvitPremium/PvtltdZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const Section8Premium = () => {
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
                alt="Section 8 Company Registration by Legal Terminus"
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
                  A Section 8 Company offers higher credibility, better governance, and stronger legal recognition compared to Trusts and Societies. It is the preferred structure for NGOs, foundations, CSR funding, grants, and impact-driven organizations. Section 8 registration involves detailed documentation, government approvals, object-clause drafting, and compliance review. With LT Priority, your application receives faster coordination, dedicated attention, and professional monitoring throughout the registration process.
                </p>
              </header>

              {/* Features */}
              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⏱️</span>
                    72-hour SLA on first MOA / AOA draft — and a same-day name search and object-clause review.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📋</span>
                    Senior-expert reviewed MOA — charitable object precision, no commercial drift.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📞</span>
                    Direct line to your assigned expert + tax counsel for 12A / 80G drafting.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📱</span>
                    Real-time CRC status updates on mail and WhatsApp — no refreshing the MCA portal at midnight.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📦</span>
                    Post-incorporation kit: COI, MOA, AOA and compliance calendar.
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
                  The object clause MUST be charitable / not-for-profit — any commercial-leaning language (e.g. 'profit', 'business', 'enterprise') is rejected by the RoC. Even ancillary objects must be subordinate to the charitable purpose. We draft and stress-test the object before filing.
                </li>
                <li className="zp-note-item">
                  Section 8 companies CANNOT distribute profits or pay dividends. All surplus must be applied to the charitable object. Founders / directors can only receive reasonable remuneration for services rendered (not profit share). Make sure all subscribers are aligned on this.
                </li>
                <li className="zp-note-item">
                  12A and 80G registrations are SEPARATE applications (under the Income Tax Act, not Companies Act). Without them, your Section 8 company has no tax exemption and donors get no benefit. Apply within 1 year of incorporation for cleanest treatment. The Enriched tier handles this.
                </li>
                <li className="zp-note-item">
                  A Section 8 company cannot be converted into a regular Pvt Ltd / OPC / LLP without Central Government approval and surrender of accumulated charitable assets. Pick this structure only if you genuinely intend a non-profit operating model.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#section8-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("section8-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default Section8Premium;
