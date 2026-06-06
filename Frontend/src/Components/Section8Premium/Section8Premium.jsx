import React from "react";
import "./Section8Premium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const Section8Premium = () => {
  return (
    <section className="s8-premium-section">
      <div className="s8-premium-container">
        <div className="s8-premium-card">

          {/* Illustration */}
          <div className="s8-premium-illustration-wrapper">
            <img
              src={premiumIllustration}
              alt="Section 8 Company Registration by Legal Terminus"
              className="s8-premium-illustration"
            />
          </div>

          {/* Content */}
          <div className="s8-premium-content">

            {/* Header */}
            <header className="s8-premium-header">
              <h2 className="s8-premium-title">
                Legal Terminus{" "}
                <span className="s8-premium-title-highlight">Priority</span>{" "}
                <span className="s8-premium-title-icon">⚖️</span>
              </h2>
              <p className="s8-premium-subtitle">
                A Section 8 Company offers higher credibility, better governance, and stronger legal recognition compared to Trusts and Societies. It is the preferred structure for NGOs, foundations, CSR funding, grants, and impact-driven organizations. Section 8 registration involves detailed documentation, government approvals, object-clause drafting, and compliance review. With LT Priority, your application receives faster coordination, dedicated attention, and professional monitoring throughout the registration process.
              </p>
            </header>

            {/* Features */}
            <section className="s8-premium-block">
              <h3 className="s8-premium-label">What You Get:</h3>
              <ul className="s8-premium-list">
                <li className="s8-premium-list-item">
                  <span className="s8-premium-list-icon">⏱️</span>
                  72-hour SLA on first MOA / AOA draft — and a same-day name search and object-clause review.
                </li>
                <li className="s8-premium-list-item">
                  <span className="s8-premium-list-icon">📋</span>
                  Senior-expert reviewed MOA — charitable object precision, no commercial drift.
                </li>
                <li className="s8-premium-list-item">
                  <span className="s8-premium-list-icon">📞</span>
                  Direct line to your assigned expert + tax counsel for 12A / 80G drafting.
                </li>
                <li className="s8-premium-list-item">
                  <span className="s8-premium-list-icon">📱</span>
                  Real-time CRC status updates on mail and WhatsApp — no refreshing the MCA portal at midnight.
                </li>
                <li className="s8-premium-list-item">
                  <span className="s8-premium-list-icon">📦</span>
                  Post-incorporation kit: COI, MOA, AOA and compliance calendar.
                </li>
              </ul>
            </section>

            {/* Notes */}
            <section className="s8-premium-block">
              <h3 className="s8-premium-label">Important Notes:</h3>
              <div className="s8-premium-note-box">
                <ul className="s8-premium-note-list">
                  <li className="s8-premium-note-item">
                    The object clause MUST be charitable / not-for-profit — any commercial-leaning language (e.g. 'profit', 'business', 'enterprise') is rejected by the RoC. Even ancillary objects must be subordinate to the charitable purpose. We draft and stress-test the object before filing.
                  </li>
                  <li className="s8-premium-note-item">
                    Section 8 companies CANNOT distribute profits or pay dividends. All surplus must be applied to the charitable object. Founders / directors can only receive reasonable remuneration for services rendered (not profit share). Make sure all subscribers are aligned on this.
                  </li>
                  <li className="s8-premium-note-item">
                    12A and 80G registrations are SEPARATE applications (under the Income Tax Act, not Companies Act). Without them, your Section 8 company has no tax exemption and donors get no benefit. Apply within 1 year of incorporation for cleanest treatment. The Enriched tier handles this.
                  </li>
                  <li className="s8-premium-note-item">
                    A Section 8 company cannot be converted into a regular Pvt Ltd / OPC / LLP without Central Government approval and surrender of accumulated charitable assets. Pick this structure only if you genuinely intend a non-profit operating model.
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="s8-premium-cta-row">
              <button className="s8-premium-cta-btn">
                Consult a Legal Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Section8Premium;
