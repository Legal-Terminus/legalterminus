import React from "react";
import "./TmhearZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const TmhearZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Trademark Hearing by Legal Terminus"
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
                  The hearing is often the last and most decisive stage between your mark and registration. Showing up unprepared — or not showing up — usually means refusal. Priority is what happens when a trademark attorney builds your case, files written submissions, and argues it for you before the Hearing Officer.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Fast preparation from the moment the hearing notice arrives — submissions drafted and evidence organised well before the date.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    A focused legal argument addressing the exact objection or opposition that triggered the hearing — not a generic script.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    An experienced attorney appearing on your behalf at the virtual hearing, so you never have to argue trademark law alone.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Adjournment handling if you need more time, and clear advice on whether to seek one.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Post-hearing analysis of the order with a clear recommendation — acceptance, review, or appeal — so you always know the next move.
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
                  Not attending is the worst outcome. If you fail to appear at the hearing, the Hearing Officer can decide the matter ex-parte — usually refusing or treating the application as abandoned. Representation ensures your side is actually heard.
                </li>
                <li className="opczp-note-item">
                  Preparation beats improvisation. The hearing is your chance to address the Officer's specific concerns with reasoned arguments and evidence. Well-drafted written submissions filed in advance frame the case in your favour before a word is spoken.
                </li>
                <li className="opczp-note-item">
                  Hearings are now mostly virtual. Most trademark hearings are held by video conference, which means precise scheduling, a stable connection, and an attorney who knows the process matter just as much as the legal argument.
                </li>
                <li className="opczp-note-item">
                  Adjournments are limited. The Registry grants only a few adjournments at its discretion. Relying on repeated postponements is risky — it is far safer to be fully prepared for the date that is set.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#tmhear-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("tmhear-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default TmhearZolvitPremium;
