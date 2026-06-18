import React from "react";
import "./TmarkZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TmarkZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Trademark Application by Legal Terminus"
                className="opczp-illustration tmark-zp-illustration"
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
                  Trademark Application Filing may look simple — choose a class, file TM-A, and wait for registration. But in reality, even a small mistake can create major delays or weaken your brand protection. Wrong class selection, incomplete descriptions, missed objections, or delayed replies can lead to rejection, abandonment, or loss of trademark rights.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your Trademark Application Filing is handled on a priority basis by experienced trademark professionals who ensure faster processing, accurate filing, and proper follow-up at every stage.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔍</span>
                    Trademark Search &amp; Filing Support — trademark search for up to 5 brand name options, proper class selection, and TM-A application filing.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📄</span>
                    Documentation &amp; Affidavit Assistance — complete documentation support, including user affidavit preparation for prior-use trademarks.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">💰</span>
                    Fee Rebate &amp; Status Tracking — MSME / Startup fee rebate support (where applicable) along with regular application status updates.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🛡</span>
                    Priority Processing &amp; Legal Support — faster filing assistance and support for examination queries, objections, and trademark hearings (selected plans).
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
                  WRONG CLASS = REFILING: Trademark classes are under the Nice Classification (1–34 Goods + 35 Trading + 45 Services). Wrong class selection = your protection doesn't cover what you actually sell. Refiling = fresh application + lost time + lost priority date. We identify the class correctly first time based on your actual goods / services.
                </li>
                <li className="opczp-note-item">
                  EXAMINATION REPORT DEADLINE IS 30 DAYS: The Examination Report typically issues 3–6 months post-filing. You have 30 DAYS under Section 18 to respond. Miss it = the application is treated as ABANDONED. Supreme + Supreme Plus include departmental query handling (max 2 + max 2 hearings respectively).
                </li>
                <li className="opczp-note-item">
                  OPPOSITION COUNTER-STATEMENT DEADLINE IS 2 MONTHS: Post-publication in the Trade Marks Journal, anyone can file an Opposition within 4 months. Once Notice of Opposition is served on you, you have 2 MONTHS to file a Counter-Statement. Miss it = the opposition is deemed accepted + your application is treated as abandoned. Supreme Plus handles 1 opposition reply.
                </li>
                <li className="opczp-note-item">
                  TRADEMARK REGISTRATION IS NOT GUARANTEED: We file with discipline + handle examination / hearing / opposition where applicable. But final registration is at the Registry's discretion, subject to no oppositions succeeding, and subject to compliance with Sections 9, 11, 17, 18 etc. Realistic timeline: 12–24 months for clean cases; 24–36+ months with oppositions.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#tmark-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("tmark-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default TmarkZolvitPremium;
