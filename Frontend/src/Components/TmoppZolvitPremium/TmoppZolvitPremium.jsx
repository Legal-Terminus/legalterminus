import React from "react";
import "./TmoppZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TmoppZolvitPremium = () => {
  return (
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
                  Opposition is where trademarks are won or lost. Whether a copycat is trying to register your brand or someone has opposed your application, the proceeding runs on hard deadlines and rises or falls on evidence. Priority is what happens when a trademark attorney owns your matter from notice to the Registrar's decision.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Deadline-driven action — the 2-month counter-statement and each evidence stage tracked so your case is never lost on a missed date.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    A grounds-led Notice of Opposition or Counter-Statement, drafted around Section 9/11 and prior-use arguments specific to your dispute.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Properly structured evidence affidavits (Rule 45/46/47) — prior use, reputation, sales, advertising — that actually move the Registrar.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Hearing preparation and representation before the Registry, so your case is argued by someone who does this every day.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Clear status updates at every stage — notice, counter-statement, evidence, hearing, decision — so you always know where you stand.
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
                  The 2-month counter-statement deadline is fatal if missed. If you are opposed and fail to file a counter-statement within 2 months of receiving the opposition, your application is deemed abandoned. Acting the moment you receive notice is critical.
                </li>
                <li className="opczp-note-item">
                  Oppose within the 4-month window. To block a conflicting mark, the Notice of Opposition must be filed within 4 months of the mark's publication in the Trademark Journal. Monitoring the journal — or having us watch it — is how you catch threats in time.
                </li>
                <li className="opczp-note-item">
                  Evidence decides the case. Opposition is won on documentary proof of prior use, reputation, and likelihood of confusion — filed by affidavit at fixed stages. Strong, well-organised evidence is far more persuasive than assertion alone.
                </li>
                <li className="opczp-note-item">
                  It is a multi-stage marathon. From notice to decision, a contested opposition can run many months through counter-statement, three evidence stages, and a hearing. Consistent, professional handling across all stages is what carries a matter to a favourable result.
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
  );
};

export default TmoppZolvitPremium;
