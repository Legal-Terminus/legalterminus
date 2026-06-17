import React from "react";
import "./FoodlicenseZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const FoodlicenseZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="FSSAI Food License Registration by Legal Terminus"
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
                  FSSAI Food License Registration may look simple online, but delays often happen because of wrong license selection, incorrect business category, incomplete documents, or slow follow-up. That's where LT Priority makes the difference.
                </p>
                <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                  With LT Priority, your application gets faster attention, priority handling, and dedicated support from our experienced compliance team — helping you complete your FSSAI registration smoothly and without unnecessary delays.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Priority document review and faster application filing.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Correct FSSAI category selection based on your food business.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔍</span>
                    Expert verification before submission to reduce rejection chances.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🏢</span>
                    Support for inspection and food safety compliance requirements.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📅</span>
                    Renewal reminders and 1-year support for basic updates and modifications.
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
                  REVISED 2026 SLABS: Basic up to ₹1.5 Cr (was 12 lakh), State ₹1.5 Cr to ₹50 Cr (was 12 lakh–20 Cr), Central above ₹50 Cr (was 20 Cr). Many small / mid manufacturers earlier needing a State License now fit into Basic — which is a meaningful compliance + cost relief.
                </li>
                <li className="opczp-note-item">
                  VALIDITY + RENEWAL DISCIPLINE: FSSAI licences are issued for 1–5 YEARS (applicant's choice at filing). Renewal MUST be filed BEFORE EXPIRY (180-day pre-expiry window). LATE RENEWAL = ₹100 PER DAY of delay (no cap). Filing more than 180 days post-expiry = licence cancellation + fresh application. Don't slip — our plans include a renewal-reminder calendar with 90 / 30 / 7-day pre-expiry alerts. Annual returns (Form D1) + hygiene compliance + FSMP discipline (Supreme + Supreme Plus) sit on top of the renewal cycle.
                </li>
                <li className="opczp-note-item">
                  Operating without a license is a CRIMINAL offence under Section 63 of the FSS Act 2006 — punishable with imprisonment up to 6 months + fine up to ₹5 lakh. Even tea-stall vendors + home bakers need at minimum Basic Registration. The 2026 slab hike does NOT exempt anyone.
                </li>
                <li className="opczp-note-item">
                  E-commerce food businesses MUST hold a Central License (Supreme Plus) — irrespective of the new ₹50 crore turnover slab. Selling via Swiggy / Zomato / Amazon Food / your own website triggers a Central License under the FSSAI Order on E-commerce FBOs. Same for importers, exporters, multi-state operators, ports / airports / railways / 5-star hotels.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#fl-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("fl-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default FoodlicenseZolvitPremium;
