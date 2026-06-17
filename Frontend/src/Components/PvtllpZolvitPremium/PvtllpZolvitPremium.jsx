import React from "react";
import "./PvtllpZolvitPremium.css";
import premiumIllustration from "../../assets/lt-companys.svg";

const PvtllpZolvitPremium = () => {
  return (
    <section className="opczp-section">
      <div className="opczp-container">
        <div className="opczp-card">

          <div className="opczp-top-row">

            <div className="opczp-illustration-wrapper">
              <img
                src={premiumIllustration}
                alt="Private Limited to LLP Conversion by Legal Terminus"
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
                  Converting a Pvt Ltd to an LLP is a statutory Section 56 process, not a simple closure — the charges on the company's assets must be clear, ROC and income-tax filings must be up to date, every shareholder must become a partner, and Section 47(xiiib) eligibility decides whether the conversion is tax-neutral. Priority is what happens when a specialist runs the conversion, the compliance closure, and the tax check as one coordinated project.
                </p>
              </header>

              <section className="opczp-section-block">
                <h3 className="opczp-label">What you get</h3>
                <ul className="opczp-list opczp-features-list">
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">⚡</span>
                    Shareholder-to-partner mapping and capital-contribution structuring — so the company's shareholding converts into the LLP cleanly.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">✅</span>
                    A clean Form 18 pack — up-to-date ROC &amp; income-tax filings, statement of assets and liabilities, and shareholder &amp; creditor consents — prepared to the Registrar's standard.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔎</span>
                    A charge / security-interest check and satisfaction, plus a Section 47(xiiib) eligibility review so you know your tax position before filing.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">🔄</span>
                    GST amendment, PAN/TAN update, bank, and licence migration to the LLP — and Form 14 intimation to the Registrar of Companies.
                  </li>
                  <li className="opczp-list-item">
                    <span className="opczp-list-icon">📑</span>
                    A registered LLP agreement (Form 3) and a lean first-year compliance calendar — Form 8 and Form 11 only.
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
                  All shareholders must become partners. On conversion every shareholder of the company — and no one else — becomes a partner of the LLP, with at least two designated partners. The shareholding is mapped into capital contribution.
                </li>
                <li className="opczp-note-item">
                  Charges must be cleared first. The company must have no security interest subsisting on its assets at the time of application. Any secured loan or charge must be satisfied, or an NOC obtained from the charge-holder, before Form 18 is filed.
                </li>
                <li className="opczp-note-item">
                  Filings and consents are essential. All ROC annual filings and income-tax returns must be up to date, and the consent of all shareholders and secured creditors is mandatory. We get these in order so the application isn't rejected.
                </li>
                <li className="opczp-note-item">
                  Tax-neutrality depends on Section 47(xiiib). The conversion is exempt from capital-gains tax only if the prescribed conditions are met. We review eligibility up front so the move reduces cost without an unexpected tax bill.
                </li>
              </ul>
            </div>

            <div className="opczp-cta-row">
              <a
                href="#pvtllp-consult-form"
                className="opczp-cta-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("pvtllp-consult-form")?.scrollIntoView({ behavior: "smooth" });
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

export default PvtllpZolvitPremium;
