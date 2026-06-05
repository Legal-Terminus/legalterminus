import React from "react";
import "./LLPZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const ZolvitPremium = () => {
  return (
    <section className="llp-zp-section">
      <div className="llp-zp-container">
        <div className="llp-zp-card">

          {/* Top two-column row: illustration + content */}
          <div className="llp-zp-top-row">

            {/* Left illustration */}
            <div className="llp-zp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="LLP Registration by Legal Terminus"
                className="llp-zp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="llp-zp-content">

              <header className="llp-zp-header">
                <h2 className="llp-zp-title">
                  Legal Terminus{" "}
                  <span className="llp-zp-title-highlight">Priority</span>{" "}
                  <span className="llp-zp-title-icon">⚖</span>
                </h2>
                <p className="llp-zp-subtitle">
                  An LLP is deceptively simple. The form filing is the easy part — the real work is in the LLP Agreement, the profit-share schedule, the exit clauses, and the IP assignment. Get it wrong, and you'll be back here in 18 months arguing about who owns what. Priority is what happens when a senior expert owns your file end-to-end.
                </p>
              </header>

              <section className="llp-zp-section-block">
                <h3 className="llp-zp-label">What you get</h3>
                <ul className="llp-zp-list llp-zp-features-list">
                  <li className="llp-zp-list-item">
                    <span className="llp-zp-list-icon">⚡</span>
                    48-hour SLA on first LLP Agreement draft — and a same-day name search before you commit.
                  </li>
                  <li className="llp-zp-list-item">
                    <span className="llp-zp-list-icon">✅</span>
                    Senior professional reviewed Agreement — profit share, capital, exit, IP, dispute resolution — checked.
                  </li>
                  <li className="llp-zp-list-item">
                    <span className="llp-zp-list-icon">🔄</span>
                    Real-time CRC status updates on WhatsApp — no refreshing the MCA portal at midnight.
                  </li>
                  <li className="llp-zp-list-item">
                    <span className="llp-zp-list-icon">✅</span>
                    We prioritize your preferred LLP name &amp; run a preliminary name check before submission.
                  </li>
                  <li className="llp-zp-list-item">
                    <span className="llp-zp-list-icon">🔄</span>
                    In case of name rejection, we recommend legally compliant alternative names to ensure approval.
                  </li>
                  <li className="llp-zp-list-item">
                    <span className="llp-zp-list-icon">📑</span>
                    Post-incorporation kit: COI, LLP Agreement, statutory registers, 90-day compliance calendar, audit threshold tracker.
                  </li>
                </ul>
              </section>

            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="llp-zp-bottom-full">
            <h3 className="llp-zp-label">Important Notes</h3>
            <div className="llp-zp-note-box">
              <ul className="llp-zp-note-list">
                <li className="llp-zp-note-item">
                  At least 1 designated partner must be an Indian resident (120-day stay test in preceding FY). If both your partners are NRIs / foreign, you cannot incorporate an LLP — you'll need a different structure.
                </li>
                <li className="llp-zp-note-item">
                  Name rejection is the #1 delay. Avoid generic words — follow our naming guidelines, check trademark conflicts, and have 4 backup names ready. We pre-screen, but the CRC is the final authority.
                </li>
                <li className="llp-zp-note-item">
                  Form 3 (LLP Agreement) MUST be filed within 30 days of incorporation. Penalty for late filing is ₹100 per day with NO upper cap (LLP Amendment Act 2021). A 6-month delay = ₹18,000 penalty.
                </li>
                <li className="llp-zp-note-item">
                  If turnover crosses ₹40L OR contribution crosses ₹25L, audit becomes mandatory. Plan for it — Small LLP status is binary (you either qualify or you don't).
                </li>
                <li className="llp-zp-note-item">
                  LLPs are taxed at a flat 30% — no slab benefit, no startup tax holiday under Section 80-IAC (which only applies to companies). Run the tax math against Pvt Ltd at 22% / 25% before choosing structure.
                </li>
              </ul>
            </div>

            <div className="llp-zp-cta-row">
              <a
                href="#llp-consult-form"
                className="llp-zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("llp-consult-form")?.scrollIntoView({ behavior: "smooth" });
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
