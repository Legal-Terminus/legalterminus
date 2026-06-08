import React from "react";
import "../PvtltdZolvitPremium/PvtltdZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const StartupIndiaPriority = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          <div className="zp-top-row">

            <div className="zp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Startup India Registration by Legal Terminus"
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
                  DPIIT recognition is not just a certificate — it's the gateway to India's most powerful startup tax toolkit. The difference between a rubber-stamp filing and a fundable, tax-optimised startup is in the application narrative. Priority is what happens when a senior CS and a tax expert jointly craft your innovation description, category, and 80-IAC filing — because investors and the IMB read these documents very carefully.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    48-hour SLA on DPIIT application draft — including innovation description and category selection review.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Senior CS-reviewed eligibility assessment before filing — no wasted applications.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Real-time DPIIT portal status updates on WhatsApp — no refreshing dashboards.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Post-recognition kit: DPIIT certificate, 80-IAC eligibility report, angel tax Form 2 docs, compliance calendar.
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
                  <strong>80-IAC Tax Holiday</strong> is NOT automatic with DPIIT recognition. You must separately apply to the Inter-Ministerial Board (IMB). Only startups with ≥ 51% Indian-resident directors AND a genuine technology / innovation business qualify. IMB can reject if the innovation is not sufficiently differentiated.
                </li>
                <li className="zp-note-item">
                  <strong>Angel tax exemption</strong> under Section 56(2)(viib) requires filing Form 2 with DPIIT AND the shares must be issued at Fair Market Value (FMV). Shares issued above FMV to Indian (non-accredited) investors will attract angel tax even with DPIIT recognition unless proper FMV reports are in place.
                </li>
                <li className="zp-note-item">
                  <strong>Turnover &amp; age limits</strong> — the 10-year age limit and ₹100 crore turnover cap are checked at the time of application AND at the time of 80-IAC renewal for each year of exemption claimed. One year over the cap and the exemption is lost for that FY.
                </li>
                <li className="zp-note-item">
                  <strong>Entity type matters</strong> — only Pvt Ltd, LLP, and Registered Partnership Firms are eligible. Sole proprietorships and HUFs cannot apply for DPIIT recognition regardless of innovation. If you're a proprietor aiming for Startup India, convert to Pvt Ltd first.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#startup-india-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("startup-india-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default StartupIndiaPriority;
