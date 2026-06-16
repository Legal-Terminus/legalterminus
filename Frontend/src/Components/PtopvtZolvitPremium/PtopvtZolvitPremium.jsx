import React from "react";
import "./PtopvtZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PtopvtZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Proprietorship to Private Limited Conversion by Legal Terminus"
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
                  This is a statutory Section 366 conversion, not a simple incorporation — URC-1, URC-2 newspaper notice, creditor consent, and an audited statement of accounts all have to line up. Get any of them wrong and the ROC sends it back. Priority is what happens when a specialist runs the whole conversion and business migration as one coordinated project.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Help structuring the mandatory second member/director and the cap table — so you meet the Pvt Ltd minimum cleanly before filing.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    A complete URC-1 statutory pack — audited statement of accounts, list of creditors with consent, and solvency declaration — prepared correctly.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    URC-2 newspaper notice drafted and published in the right English and vernacular papers, with objections handled.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    GST, bank, Udyam, and licence migration to the company — and the old proprietorship registrations surrendered.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    A first-year compliance calendar — AOC-4, MGT-7, audit, board meetings — so the Pvt Ltd starts life fully compliant.
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
                  You need a second person. A Private Limited Company requires a minimum of two shareholders and two directors. As a sole proprietor you must bring in at least one more member — a co-founder, family member, or associate — to make the conversion possible.
                </li>
                <li className="opczp-note-item">
                  The accounts must be fresh and audited. URC-1 needs an audited statement of accounts of the proprietorship dated within 30 days of filing, plus a list of creditors with consent. We coordinate the audit and the consents so the application isn't rejected on a stale or incomplete account.
                </li>
                <li className="opczp-note-item">
                  The newspaper notice is mandatory. A URC-2 advertisement inviting objections must run in an English and a vernacular newspaper before the company is registered. Skipping or mis-drafting it stalls the whole conversion.
                </li>
                <li className="opczp-note-item">
                  Compliance steps up sharply. A Pvt Ltd must hold board meetings, file annual ROC returns, and get audited every year — far more than a proprietorship. We set up the calendar so the new structure is an asset, not a surprise burden.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#ptopvt-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("ptopvt-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default PtopvtZolvitPremium;
