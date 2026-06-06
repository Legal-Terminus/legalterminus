import React from "react";
import "../PvtltdZolvitPremium/PvtltdZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const IncorporationPremium = () => {
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
                alt="Wholly Owned Subsidiary Incorporation by Legal Terminus"
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
                  A Wholly Owned Subsidiary (WOS) — whether backed by an Indian parent or a foreign parent — is more than a standard Private Limited Company. It requires carefully structured governance, parent-company control mechanisms, related party transaction safeguards, and, in the case of foreign investment, FEMA and RBI compliance layered over Companies Act requirements. At Legal Terminus, your file is handled end-to-end by senior professionals, with FEMA counsel support available for foreign-parent structures.
                </p>
              </header>

              {/* Features */}
              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    72-hour SLA on the first draft of MOA &amp; AOA, along with same-day sectoral and structural guidance during the discovery call.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Senior expert-reviewed AOA covering parent reserved matters, board structure, transfer restrictions, and RPT carve-outs.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Real-time updates on CRC approvals and, where applicable, FC-GPR and FIRMS portal filings — ensuring no critical compliance timelines are missed.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📞</span>
                    Direct access to your assigned expert and dedicated FEMA counsel support for foreign-parent legal coordination.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Complete post-incorporation compliance kit including COI, MOA/AOA, Share Certificates, Statutory Registers, FC-GPR acknowledgement (where applicable), and a structured 90-day compliance calendar.
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
                  Indian-parent WOS: Section 188 (Related Party Transactions) kicks in from Day 1 — every inter-company transaction (services, royalty, lending, leases) must follow arm's-length pricing and (above thresholds) require board / shareholder approval. We draft the RPT policy in our Enriched and Supreme tiers.
                </li>
                <li className="zp-note-item">
                  Foreign-parent WOS: FC-GPR within 30 days of share allotment is non-negotiable. Late filing attracts compounding under FEMA — typically 1% of investment per month, capped at 100%. Plan the AD-Bank inward remittance + share allotment + FC-GPR sequence carefully.
                </li>
                <li className="zp-note-item">
                  Resident director rule (Section 149(3)) is strict for both tracks — 120 days in India in the preceding FY.
                </li>
                <li className="zp-note-item">
                  FLA Return is the most-missed annual filing for foreign-parent WOS — due 15 July annually for any Indian company that has received foreign investment, regardless of whether new shares were allotted that year. Penalty under FEMA: compounding starts at ₹10,000+. The Track B Supreme tier includes Year-1 FLA filing.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#wos-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(".lt-public-hero")?.scrollIntoView({ behavior: "smooth" });
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

export default IncorporationPremium;
