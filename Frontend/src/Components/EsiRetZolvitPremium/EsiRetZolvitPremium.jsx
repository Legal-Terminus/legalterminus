import React from "react";
import "./EsiRetZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const EsiRetZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="ESI Return Filing by Legal Terminus"
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
                  ESI filing looks like one challan a month — but a wrong wage base, an unregistered IP, a missed exit date, or a late deposit triggers 12% interest, damages, and blocked medical benefits for your workers. Priority is what happens when a dedicated ESI manager owns your monthly return from wage sheet to paid challan.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    A monthly ESI routine locked to the 15th — wages collected, contributions computed, and challan ready well before the due date.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Accurate 0.75% / 3.25% computation on gross wages, with the ₹21,000 ceiling and the contribution-period continuation rule applied correctly.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    IP registration and e-Pehchaan cards for new joiners so every covered worker can actually access medical care from day one.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    New joiner and exit (Date of Leaving) updates handled each month so your insured-person roster always matches reality.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Filed-return kit: contribution challan, paid receipt, IP-wise summary, and a running monthly compliance log.
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
                  The 15th is a hard deadline. ESI contributions for a month must be deposited by the 15th of the next month. Late deposit attracts 12% annual interest plus graded damages of 5%–25% — we file ahead so a holiday or cash-flow gap never costs you.
                </li>
                <li className="opczp-note-item">
                  The wage ceiling and continuation rule matter. Coverage applies up to ₹21,000/month, but an employee covered at the start of a contribution period stays covered till it ends even if wages rise. Getting this wrong means under- or over-payment — we apply it precisely.
                </li>
                <li className="opczp-note-item">
                  IP registration unlocks real benefits. Unless a worker is registered as an Insured Person with an e-Pehchaan card, they cannot avail ESIC medical, sickness, or maternity benefits. We register every eligible joiner so the cover is genuinely usable.
                </li>
                <li className="opczp-note-item">
                  Non-compliance invites prosecution. Persistent default or under-reporting can trigger a 45A determination and prosecution under Section 85, with recovery, interest, and damages. Clean monthly filing keeps you off the radar.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#esiret-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("esiret-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult an ESI Compliance Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EsiRetZolvitPremium;
