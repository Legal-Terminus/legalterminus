import React from "react";
import "./LtopvtZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const LtopvtZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="LLP to Private Limited Conversion by Legal Terminus"
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
                  Converting an LLP to a Pvt Ltd is a statutory Section 366 process, not a simple incorporation — URC-1, the URC-2 newspaper notice, the Registrar's NOC, and a CA-certified statement of accounts all have to line up, and the partners' contribution must map cleanly into share capital. Priority is what happens when a specialist runs the conversion and the cap-table setup as one coordinated project.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Partner-to-shareholder mapping and a clean cap table — so the LLP's contribution converts into share capital correctly.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    A complete URC-1 pack — CA-certified statement of accounts, latest LLP agreement, list of creditors with consent — prepared to the ROC's standard.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    The URC-2 newspaper notice and the NOC from the LLP's Registrar obtained and the 21-day objection window managed.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    GST, bank, Udyam, and licence migration to the company — and the LLP dissolved with the Registrar intimated.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    An investor-ready cap table with an ESOP pool option and a first-year compliance calendar — AOC-4, MGT-7, audit, board meetings.
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
                  All partners must become shareholders. On conversion every partner of the LLP becomes a shareholder of the company, with their contribution mapped into share capital. A Pvt Ltd needs at least two directors and two shareholders — which an LLP with two or more partners already satisfies.
                </li>
                <li className="opczp-note-item">
                  The Registrar's NOC is essential. A No-Objection Certificate from the Registrar where the LLP is registered must be obtained before the URC-1 conversion is filed. We secure this so the application isn't held up.
                </li>
                <li className="opczp-note-item">
                  The newspaper notice and objection window are mandatory. A URC-2 advertisement inviting objections runs in an English and a vernacular newspaper, followed by a statutory objection period. We draft, publish, and manage any objections.
                </li>
                <li className="opczp-note-item">
                  Compliance and audit step up. Unlike an LLP — where audit applies only above thresholds — a Pvt Ltd must be audited every year and file AOC-4 and MGT-7. We set up the calendar so the new structure is an asset, not a surprise.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ltopvt-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ltopvt-consult-form")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Consult a Conversion Expert
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LtopvtZolvitPremium;
