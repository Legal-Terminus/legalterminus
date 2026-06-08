import React from "react";
import "../PvtltdZolvitPremium/PvtltdZolvitPremium.css";
import priorityIllustration from "../../assets/lt-companys.svg";

const ShopRegPriority = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          {/* Top two-column row: illustration + content */}
          <div className="zp-top-row">

            <div className="zp-illustration-wrapper">
              <img
                src={priorityIllustration}
                alt="Shop & Establishment Registration by Legal Terminus"
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
                <p className="zp-subtitle" style={{ textAlign: "left" }}>
                  Shop &amp; Establishment Registration may look simple, but every state in India follows its own rules, forms, fee structure, validity period, and renewal process. For businesses operating in multiple states, handling state-specific labour compliance can quickly become complicated. With LT Priority, your application is handled on a faster and priority basis by experienced professionals who understand the practical requirements of different State Labour Department portals and registration procedures.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What You Get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    Priority processing for faster registration support and certificate issuance.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📋</span>
                    State-specific application review and filing assistance by experienced compliance professionals.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🌐</span>
                    Registration support across all Indian States and Union Territories.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Free Shop &amp; Establishment profile update support for 1 year.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📅</span>
                    Renewal reminder support based on your applicable state validity and renewal cycle.
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Important Notes + CTA */}
          <div className="zp-bottom-full">
            <h3 className="zp-label">Important Notes</h3>
            <div className="zp-note-box">
              <ul className="zp-note-list">
                <li className="zp-note-item">
                  SHOP &amp; ESTABLISHMENT is state-specific — NOT central. Each state has its own Act (Maharashtra SHOP &amp; ESTABLISHMENT Act 2017, Karnataka S&amp;CE Act 1961, Delhi SHOP &amp; ESTABLISHMENT Act 1954, Tamil Nadu SHOP &amp; ESTABLISHMENT Act 1947, etc.). If you operate in multiple states, you need separate registrations in each. Single-state registration doesn't extend to others.
                </li>
                <li className="zp-note-item">
                  Registration trigger varies by state. Maharashtra: registration required from 1 employee. Karnataka and Delhi: from 1 employee. Some states require it only above 10 employees. Most banks demand SHOP &amp; ESTABLISHMENT for current account opening — effectively making it functionally mandatory even for solo-employee businesses.
                </li>
                <li className="zp-note-item">
                  Validity periods vary dramatically. Maharashtra Gumasta is one-time / lifetime. Karnataka is 5 years. Tamil Nadu and Delhi are annual. Missing renewal can lead to small per-day penalties + Inspector visits. Set the renewal calendar carefully — we provide one in the onboarding kit.
                </li>
                <li className="zp-note-item">
                  SHOP &amp; ESTABLISHMENT Registration is NOT the same as Trade Licence, Factory Licence, or Professional Tax. Many founders confuse these — they're separate registrations under separate state Acts. We map your full state-labour stack on the discovery call but file ONLY SHOP &amp; ESTABLISHMENT under this service.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#shop-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("shop-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default ShopRegPriority;
