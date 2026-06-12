import React from "react";
import "./IacapZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const IacapZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Increase Authorised Capital by Legal Terminus"
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
                  Increasing authorised capital looks like one form — but an AOA that doesn't permit it blocks the whole filing, miscalculated stamp duty causes rejection, and confusing authorised with paid-up capital trips up first-time founders. Priority is what happens when a compliance expert checks the Articles, computes the duty correctly, and owns the filing end-to-end.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    An upfront AOA check so we know whether a simple increase will do, or the Articles must be amended first — no surprises mid-filing.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Correctly drafted board and members' resolutions, EGM notice, and the altered MOA capital clause.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    Accurate MCA fee and state stamp-duty computation on the increase, so Form SH-7 isn't bounced on a payment error.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    Form SH-7 filed within the 30-day deadline and tracked to ROC approval, with the updated capital reflected on record.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    Allotment guidance — board resolution, PAS-3, and share certificates — so the new headroom is actually used to bring in funds.
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
                  Check the Articles first. A company can increase authorised capital only if its AOA permits it. If the Articles are silent or restrictive, they must be amended by special resolution before the increase — skipping this step leads to rejection.
                </li>
                <li className="opczp-note-item">
                  Stamp duty is on the increase amount. The major cost is the MCA fee and state stamp duty calculated on the amount of the increase, not a flat fee. We compute it correctly up front so there are no shortfalls or surprises at filing.
                </li>
                <li className="opczp-note-item">
                  Authorised is not paid-up. Increasing authorised capital only raises the maximum the company can issue. It does not bring in money — that happens only when shares are actually allotted, which is a separate, planned step.
                </li>
                <li className="opczp-note-item">
                  File SH-7 within 30 days. Form SH-7 must be filed within 30 days of the resolution. Doing it promptly keeps the company compliant and ready to allot the new shares to investors without delay.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#iacap-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("iacap-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Compliance Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default IacapZolvitPremium;
