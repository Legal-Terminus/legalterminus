import React from "react";
import "../PvtltdZolvitPremium/PvtltdZolvitPremium.css";
import premiumIllustration from "../../assets/lt-company.svg";

const StartupOdishaPriority = () => {
  return (
    <section className="zp-section">
      <div className="zp-container">
        <div className="zp-card">

          <div className="zp-top-row">

            <div className="zp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Startup Odisha Registration by Legal Terminus"
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
                  Startup Odisha recognition is a state-level gateway to capital subsidy, incubation, and government market access — but the subsidy application is where most startups leave money on the table. The capital subsidy requires a business plan, investment proof, and sector-specific documentation that the portal alone won't guide you through. Priority is what happens when a senior CS combines your Startup Odisha application with a dual DPIIT filing — because getting both recognitions in one shot maximises your benefits.
                </p>
              </header>

              <section className="zp-section-block">
                <h3 className="zp-label">What you get</h3>
                <ul className="zp-list zp-features-list">
                  <li className="zp-list-item">
                    <span className="zp-list-icon">⚡</span>
                    48-hour SLA on Startup Odisha application draft — including business plan summary and sector classification.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">✅</span>
                    Senior CS-reviewed eligibility assessment for both Startup Odisha and DPIIT (Startup India) before filing.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">🔄</span>
                    Real-time portal status updates on WhatsApp — no refreshing government dashboards.
                  </li>
                  <li className="zp-list-item">
                    <span className="zp-list-icon">📑</span>
                    Post-recognition kit: recognition certificate, capital subsidy application checklist, compliance calendar, incubation centre shortlist.
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
                  <strong>Odisha-registered office is mandatory</strong> — the startup must have its registered office in the state of Odisha to qualify for Startup Odisha benefits. A startup with a founder who is an Odisha resident but whose entity is registered in another state is NOT eligible.
                </li>
                <li className="zp-note-item">
                  <strong>Capital subsidy is not automatic</strong> — Startup Odisha recognition opens the door to subsidy application, but the actual subsidy quantum depends on investment type, employment generated, and sector. Budget ₹10–15K for detailed subsidy application documentation.
                </li>
                <li className="zp-note-item">
                  <strong>Dual recognition benefit</strong> — Startup Odisha and DPIIT (Startup India) recognitions are separate and complementary. Startup Odisha gives you state-level benefits (subsidy, incubation, mentorship); DPIIT gives you central government benefits (80-IAC tax holiday, angel tax exemption). Our Supreme plan covers both.
                </li>
                <li className="zp-note-item">
                  <strong>Incubation centre application</strong> — STPI Bhubaneswar, IIT Bhubaneswar Technology Business Incubator, and KIIT-TBI are the key incubation centres under Startup Odisha. Space is limited and applications are competitive. We help with the application narrative and pitch for incubation.
                </li>
              </ul>
            </div>

            <div className="zp-cta-row">
              <a
                href="#startup-odisha-consult-form"
                className="zp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("startup-odisha-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default StartupOdishaPriority;
