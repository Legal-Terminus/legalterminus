import React from "react";
import "./TmrnwZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TmrnwZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Trademark Renewal by Legal Terminus"
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
                  Trademark Renewal may look simple — file Form TM-R, pay the government fee, and wait for the renewal certificate. But in practice, many trademarks lapse because renewal deadlines are missed, old agent records are not updated properly, or businesses stop tracking their brand after renewal.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your Trademark Renewal is handled on a priority basis by an experienced IP team that ensures timely filing, smooth coordination, and continued protection of your brand.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority processing and complete renewal support, including timely reminders before every 10-year expiry cycle and dedicated coordination throughout the process.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📄</span>
                    Trademark verification, TM-R preparation, and filing support through the official IP India portal to help avoid errors, mismatches, and filing issues.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🤝</span>
                    Documentation and agent change assistance, along with renewal acknowledgement and certificate sharing with regular status updates.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔍</span>
                    Post-renewal trademark watch support to help identify similar or potentially infringing marks and protect your brand identity.
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
                  1 YEAR BEFORE TO EXPIRY DATE = ON-TIME WINDOW: Standard renewal at ₹9,000 per class — UNIFORM for all applicants (no MSME / Startup rebate at renewal). No surcharge. This is the sweet spot — we recommend renewing 3–6 months before expiry to avoid last-minute surprises.
                </li>
                <li className="opczp-note-item">
                  WITHIN 6 MONTHS POST-EXPIRY = LATE WITH SURCHARGE: Section 25(4) proviso allows renewal here but adds a ₹4,500 SURCHARGE per class. Total: ₹13,500 per class for ALL applicants. The mark stays on the register during this 6-month grace period.
                </li>
                <li className="opczp-note-item">
                  6 TO 12 MONTHS POST-EXPIRY = RESTORATION (Form TM-18): Section 25(5) read with Rule 60. The mark is removed from the register; restoration is at the REGISTRAR'S DISCRETION. Combined Govt fee ₹18,000 per class. NO GUARANTEE — the Registrar considers third-party interests + public interest before allowing restoration.
                </li>
                <li className="opczp-note-item">
                  BEYOND 12 MONTHS POST-EXPIRY = PERMANENTLY LOST: The mark is REMOVED from the register; you have NO PATH TO RESTORATION. The only option is to file a FRESH trademark application (losing 10/20/30+ years of brand seniority + priority date + customs recordal status + e-commerce brand-protection status). Our Lifelong Reminder Policy is designed to make sure this never happens to you.
                </li>
                <li className="opczp-note-item">
                  NO 50% REBATE AT RENEWAL: The reduced fee (₹4,500 vs ₹9,000) that helps Individual / DPIIT Startup / Udyam MSME applicants at the INITIAL FILING stage (Form TM-A) does NOT extend to renewal. Renewal is uniform ₹9,000 per class for everyone. Budget accordingly.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#tmrnw-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("tmrnw-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Trademark Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TmrnwZolvitPremium;
