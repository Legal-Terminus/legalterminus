import React from "react";
import "./TradeLicenseZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TradeLicenseZolvitPremium = () => {
  return (
    <section className="tradezp-section">
      <div className="tradezp-container">
        <div className="tradezp-card">

          {/* Top two-column row: illustration + content */}
          <div className="tradezp-top-row">

            {/* Left illustration */}
            <div className="tradezp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Trade License Registration by Legal Terminus"
                className="tradezp-illustration"
              />
            </div>

            {/* Right content */}
            <div className="tradezp-content">

              <header className="tradezp-header">
                <h2 className="tradezp-title">
                  Legal Terminus{" "}
                  <span className="tradezp-title-highlight">Priority</span>{" "}
                  <span className="tradezp-title-icon">⚖️</span>
                </h2>
                <p className="tradezp-subtitle">
                  Trade License Registration may look simple, but every Municipal Corporation follows its own rules, portal system, trade categories, inspection process, and renewal requirements. Even a small mistake in business category selection, document filing, or inspection coordination can lead to delays, rejection, penalties, or renewal issues. With LT Priority, your Trade License Registration is handled by experienced municipal compliance professionals who manage the process carefully from application filing to final approval and renewal guidance.
                </p>
              </header>

              <section className="tradezp-section-block">
                <h3 className="tradezp-label">What You Get:</h3>
                <ul className="tradezp-list tradezp-features-list">
                  <li className="tradezp-list-item">
                    <span className="tradezp-list-icon">⚡</span>
                    Priority application processing and faster filing support
                  </li>
                  <li className="tradezp-list-item">
                    <span className="tradezp-list-icon">📑</span>
                    Correct trade category selection and professional document review
                  </li>
                  <li className="tradezp-list-item">
                    <span className="tradezp-list-icon">🏛</span>
                    Support across major municipal corporations with inspection coordination and premises readiness guidance
                  </li>
                  <li className="tradezp-list-item">
                    <span className="tradezp-list-icon">📅</span>
                    Annual renewal reminders, compliance tracking, and dedicated real-time status updates throughout the process
                  </li>
                </ul>
              </section>

            </div>
          </div>

          {/* Full-width bottom: Important Notes + CTA */}
          <div className="tradezp-bottom-full">
            <h3 className="tradezp-label">Important Notes:</h3>
            <div className="tradezp-note-box">
              <ul className="tradezp-note-list">
                <li className="tradezp-note-item">
                  Operating WITHOUT a Trade License = the Municipal Corporation can SEAL your premises, issue closure notices, refuse / disconnect utility connections (water, sewerage, sometimes electricity), levy penalty + per-day surcharge, and prosecute under the State Municipal Act. Don&apos;t operate ungazed — file before you open the shutter.
                </li>
                <li className="tradezp-note-item">
                  Trade License is DIFFERENT from Shop &amp; Establishment Registration. Trade License = municipal compliance (under your State&apos;s Municipal Act). Shop &amp; Estd = State labour compliance (under State S&amp;E Act). Many businesses need BOTH. We assess overlap in the discovery call and avoid double-paying.
                </li>
                <li className="tradezp-note-item">
                  Trade categories matter. A &apos;general trade&apos; license can NOT be used for food / hazardous / manufacturing / hospitality activities — each has its own category, its own fee, and often its own inspection regime. Wrong category = license cancellation + re-application. We map the right code first time.
                </li>
                <li className="tradezp-note-item">
                  Annual renewal is mandatory — many cities by 31 March, others 30 days before expiry. Late renewal triggers penalty of 50-100% of fee + per-day surcharge in some cities. Two consecutive missed renewals can trigger cancellation — then you re-apply from scratch.
                </li>
              </ul>
            </div>

            <div className="tradezp-cta-row">
              <a
                href="#trade-consult-form"
                className="tradezp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("trade-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default TradeLicenseZolvitPremium;
