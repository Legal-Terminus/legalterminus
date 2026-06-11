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
                  Renewal looks like a routine refile — but a missed expiry date turns years of brand-building into a removed mark, an open door for copycats, and a costly restoration fight. Priority is what happens when an IP expert watches your renewal calendar and files Form TM-R well before the deadline.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Deadline verification against the official register, so you renew on the correct date — not a date you half-remember.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Early filing — up to a year before expiry — to lock in continuity and completely avoid the grace-period surcharge.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Multi-class and portfolio renewal handled together so no mark in your brand family slips through the cracks.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Restoration support if a mark has already lapsed — filed within the one-year window with a proper justification.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    A renewal record with the new 10-year validity date and an automatic reminder set for the next cycle.
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
                  Renewal is every 10 years — but you can file early. An application can be made up to one year before expiry. Filing early is the single best way to guarantee uninterrupted protection and avoid any surcharge.
                </li>
                <li className="opczp-note-item">
                  Miss the date and the clock starts. After expiry you get a 6-month grace window to renew with a surcharge. Beyond that, the mark can be removed from the register — and you lose your exclusive rights in the meantime.
                </li>
                <li className="opczp-note-item">
                  Removal is not always final — but it's costly. A removed mark can be restored within one year of expiry via Form TM-R with a restoration fee, subject to the Registrar's discretion. It is far cheaper and safer to simply renew on time.
                </li>
                <li className="opczp-note-item">
                  A lapsed mark invites copycats. The moment your registration lapses, competitors can attempt to use or even register a similar mark — undoing years of goodwill. Continuous renewal keeps your brand legally locked down.
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
