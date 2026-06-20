import React from "react";
import "./PubpvtBenefits.css";

const PubpvtBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting a Public Limited into a Private Limited Company
          </h2>
          <p className="opcben-subtitle">
            For a closely held business that no longer raises from the public, converting removes the heaviest public-company obligations while keeping limited liability and the company's identity intact.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Lighter Compliance Burden</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A private company has materially fewer obligations than a public one — fewer mandatory board meetings, no requirement for the public-company governance machinery, and lighter disclosure. For a closely held business, that is a direct saving in time and professional cost every year.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Tighter, Owner-Led Control</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Restricting share transfers and capping membership at 200 keeps ownership inside a known group. Decisions stay with the founders and core shareholders rather than a wide, dispersed public shareholder base — ideal once external fundraising is no longer the goal.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Restricted Share Transfer</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The private-company articles restrict the transfer of shares, so no outsider can acquire a stake without the board's or shareholders' consent. This protects the closely held nature of the business and prevents unwanted changes in the cap table.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Fewer Directors &amp; Members Needed</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A private company needs only 2 directors and 2 members, against 3 directors and 7 members for a public company. Conversion lets a smaller, closely held group run the business without padding the board or shareholder register to meet public-company minimums.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Lower Cost of Running the Entity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Between fewer meetings, lighter filings, and simpler governance, the annual cost of maintaining a private company is meaningfully lower than a public one — while limited liability and perpetual succession continue exactly as before.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Business Continuity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Conversion is not a fresh incorporation. The same legal entity continues with its history, PAN, contracts, assets, and liabilities intact — only the structure, articles, and name change. There is no transfer of business or break in operations.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PubpvtBenefits;
