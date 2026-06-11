import React from "react";
import "./AfcBenefits.css";

const AfcBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Timely Company Annual Filing
          </h2>
          <p className="opcben-subtitle">
            Annual compliance is not just a legal box to tick — it keeps your company active, your directors clean, and your business investment-ready, all while avoiding penalties that grow every single day.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid ₹100/Day Penalties</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              AOC-4 and MGT-7 carry an additional fee of ₹100 per day, per form, with no maximum cap. Filing on time eliminates a penalty that quietly snowballs into tens of thousands of rupees the longer it is ignored.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Protect Directors from Disqualification</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Failure to file annual returns for a continuous period can disqualify directors for five years and bar them from other companies. Staying compliant keeps your board eligible to manage and incorporate businesses.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Keep the Company Active</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Persistent non-filing leads the ROC to mark the company as a defaulter and ultimately strike it off the register. Regular filing keeps your company "Active" on the MCA portal and operationally alive.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Easier Loans &amp; Funding</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks, NBFCs, and investors examine your MCA filings and audited financials during due diligence. An up-to-date compliance record speeds up loan sanctions, fundraising, and credit-limit approvals.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Tender &amp; Contract Eligibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Government and corporate tenders verify that a bidding company's ROC filings are current. A clean compliance history keeps your company qualified for high-value contracts and vendor empanelments.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Investor &amp; Buyer Confidence</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              In any funding round, acquisition, or partnership, the first thing a counterparty reviews is your statutory record. Consistent annual filings present a transparent, well-governed company and remove a major deal red flag.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AfcBenefits;
