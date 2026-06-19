import React from "react";
import "./TmoppZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TmoppZolvitPremium = () => {
  return (
    <>
      <section className="opczp-section">
        <div className="opczp-container">
          <div className="opczp-card">

            <div className="opczp-top-row">

              <div className="opczp-illustration-wrapper">
                <img
                  src={premiumIllustration}
                  alt="Trademark Opposition by Legal Terminus"
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
                    Trademark Opposition is not just about filing a legal reply — it is a deadline-driven legal process where even a small mistake can lead to loss of rights. Missing the Counter Statement deadline, filing weak legal grounds, or failing to submit evidence on time can result in abandonment of the application or opposition matter.
                  </p>
                  <p className="opczp-subtitle" style={{ marginTop: "12px" }}>
                    With LT Priority, your Trademark Opposition matter is handled on a priority basis by an experienced IP team that manages the case professionally from notice to final hearing — with timely updates, faster coordination, and strict deadline monitoring throughout the process.
                  </p>
                </header>

                <section className="opczp-section-block">
                  <h3 className="opczp-label">What you get</h3>
                  <ul className="opczp-list opczp-features-list">
                    <li className="opczp-list-item">
                      <span className="opczp-list-icon">⚡</span>
                      Priority handling and faster response coordination.
                    </li>
                    <li className="opczp-list-item">
                      <span className="opczp-list-icon">📅</span>
                      Strict monitoring of all opposition and evidence deadlines.
                    </li>
                    <li className="opczp-list-item">
                      <span className="opczp-list-icon">🔍</span>
                      Support for both Opposition Filing and Counter Statement matters.
                    </li>
                    <li className="opczp-list-item">
                      <span className="opczp-list-icon">📄</span>
                      Professionally drafted legal grounds under Sections 9 &amp; 11 of the Trade Marks Act.
                    </li>
                    <li className="opczp-list-item">
                      <span className="opczp-list-icon">👨‍⚖</span>
                      IP counsel support for pleadings, evidence, and hearing stages.
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
                    4-MONTH OPPOSITION WINDOW (Section 21(1)) — from Journal publication date. NO EXTENSION possible (2017 Rules removed the Registrar's extension power). Miss it = the application moves to acceptance + registration unopposed by you.
                  </li>
                  <li className="opczp-note-item">
                    2-MONTH COUNTER STATEMENT WINDOW (Rule 44) — from notice receipt. NO EXTENSION whatsoever — the strictest deadline in trademark practice. Non-filing = application DEEMED ABANDONED without a hearing. We work to Day 50 of the window for safe buffer.
                  </li>
                  <li className="opczp-note-item">
                    PLAN SCOPE = 1 TM / 1 CLASS / 25 GROUNDS — all 3 plans calibrated for one trademark in one class. UP TO 25 GROUNDS of opposition drafted (covers virtually every matter). Beyond 25 grounds = mutually discussed + separately quoted before assignment.
                  </li>
                  <li className="opczp-note-item">
                    EVIDENCE STAGE DEADLINES (Rules 45 / 46 / 47) — 2 months + 2 months + (1+1) months. Missing Rule 45 evidence deadline = opposition deemed ABANDONED. Enriched / Supreme tiers handle these stages systematically.
                  </li>
                  <li className="opczp-note-item">
                    TIMELINE — typical opposition runs 2-5 YEARS from notice to Registrar's order. Status Update Commitment exists precisely because of this length — so the matter doesn't go stale in client's inbox.
                  </li>
                  <li className="opczp-note-item">
                    OUTCOME NOT GUARANTEED — we provide best legal arguments + strongest evidence work. The Registrar's order depends on merits. We're upfront in discovery if the underlying case is weak.
                  </li>
                </ul>
              </div>

              <div className="opczp-cta-row">
                <a
                  href="#tmopp-consult-form"
                  className="opczp-cta-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("tmopp-consult-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Consult a Trademark Expert
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="tmopp-basics-section">
        <div className="tmopp-basics-container">
          <h2 className="tmopp-basics-title">Trademark Opposition: The Basics</h2>
          <div className="tmopp-basics-grid">

            <div className="tmopp-basics-card tmopp-basics-card--a">
              <span className="tmopp-basics-label">SCENARIO A</span>
              <h3 className="tmopp-basics-heading">Oppose Someone Else's Trademark</h3>
              <p className="tmopp-basics-text">
                You've spotted a copycat mark in the Trade Marks Journal. We file a NOTICE OF OPPOSITION (Form TM-O) under Section 21 within the 4-month window from publication. Up to 25 grounds drafted. Govt fee ₹2,700/class pass-through.
              </p>
            </div>

            <div className="tmopp-basics-card tmopp-basics-card--b">
              <span className="tmopp-basics-label">SCENARIO B</span>
              <h3 className="tmopp-basics-heading">Reply to Opposition Against Your TM</h3>
              <p className="tmopp-basics-text">
                Someone has opposed YOUR pending application. We draft + file COUNTER STATEMENT (Form TM-O) under Rule 44 within the rigid 2-month window. NO GOVT FEE. Miss the 2 months = application DEEMED ABANDONED. No extension available.
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default TmoppZolvitPremium;
