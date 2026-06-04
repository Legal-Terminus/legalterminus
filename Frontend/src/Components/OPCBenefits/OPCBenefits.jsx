import React from "react";
import "./OPCBenefits.css";

const OPCBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        {/* Heading + intro */}
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of One Person Company Registration in India
          </h2>
          <p className="opcben-subtitle">
            OPC isn’t just a smaller version of a Private Limited company. It’s specially designed for solo founders, with simpler rules and fewer compliances.
          </p>
        </header>

        {/* Cards */}
        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Limited Liability for Solo Founders</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Your personal assets — house, savings, car — are insulated from company debts. A creditor can chase the company, not you. Sole proprietorships don’t give you this protection.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Separate Legal Identity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The OPC can sign contracts, sue and be sued, hold property, and open bank accounts in its own name. You stop being personally liable for every business contract you sign.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Perpetual Succession via Nominee</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              If something happens to you, the nominee you’ve named in INC-3 automatically takes over membership of the OPC. Sole proprietorships die with the proprietor — OPC doesn’t.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Compliance Relaxations (vs Pvt Ltd)</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              No AGM required (Section 96 exempts OPC). Annual return filed on MGT-7A (simpler than MGT-7). Cash flow statement not mandatory. Only 2 board meetings per year. No Company Secretary required up to ₹10cr paid-up capital.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">No Mandatory Conversion</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Post-2021 amendment, the ₹2cr turnover / ₹50L paid-up capital trigger for forced conversion to Pvt Ltd was abolished. You can run OPC indefinitely — convert only when you’re ready (e.g., to add a co-founder).
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Banking, Credit &amp; Tax Credibility</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks lend more readily to OPCs than to sole proprietorships. Vendors extend longer credit terms. ITC under GST is cleanly claimable. Income tax return is straightforward (Section 115BAA new regime applies).
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default OPCBenefits;
