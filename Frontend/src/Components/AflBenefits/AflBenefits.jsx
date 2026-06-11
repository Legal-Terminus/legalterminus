import React from "react";
import "./AflBenefits.css";

const AflBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Timely LLP Annual Filing
          </h2>
          <p className="opcben-subtitle">
            Annual compliance keeps your LLP active, your partners protected, and your business credible — all while avoiding the uncapped penalties that grow every single day a filing is delayed.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid Uncapped ₹100/Day Penalties</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Form 11 and Form 8 carry an additional fee of ₹100 per day, per form, with no maximum limit. Filing on time eliminates a penalty that — unlike many others — never stops growing, and can run into lakhs over a year.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Keep the LLP Active &amp; Avoid Strike-Off</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Persistent non-filing leads the ROC to classify the LLP as a defaulter and ultimately strike it off the register. Regular filing keeps your LLP "Active" on the MCA portal and operationally alive.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Protect Designated Partners</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Continued default can expose designated partners to disqualification and personal liability. Staying compliant keeps your partners eligible to manage and join other LLPs and companies without restriction.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Preserve Limited Liability</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The core advantage of an LLP — separating partners' personal assets from business liabilities — depends on the LLP remaining a compliant, active entity. Lapsed filings and strike-off can erode this protection just when you need it most.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Easier Loans &amp; Tenders</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks, NBFCs, and tendering authorities review an LLP's MCA filings during due diligence. An up-to-date compliance record speeds up loan sanctions, credit limits, and qualification for government and corporate contracts.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Smooth Conversion &amp; Closure</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Whether you later convert the LLP into a company or wind it up, the ROC requires all annual filings to be up to date. A clean compliance history makes conversion, closure, and any restructuring fast and hassle-free.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AflBenefits;
