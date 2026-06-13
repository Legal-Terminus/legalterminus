import React from "react";
import "./PtoopcBenefits.css";

const PtoopcBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Converting to an OPC
          </h2>
          <p className="opcben-subtitle">
            Moving from a proprietorship to a One Person Company keeps you in sole control while adding the legal shield, credibility, and continuity that a proprietorship can never offer.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Limited Liability Protection</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The single biggest gain — your personal assets are no longer exposed to business debts. The company's liabilities stay with the company, so a business setback can no longer reach your home, savings, or personal property.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Separate Legal Identity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              The OPC exists in its own right — it can own assets, hold contracts, open accounts, and sue or be sued in its own name. Your business becomes a distinct legal person, not just an extension of you.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Perpetual Succession</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A proprietorship ends with its owner; an OPC does not. Through the nominee mechanism, the company continues seamlessly even in the event of the member's death or incapacity — protecting the business you've built for the long term.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Better Credibility &amp; Funding</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A registered company carries far more weight with banks, suppliers, and customers than a proprietorship. The corporate structure improves access to loans and credit and makes the business look established and trustworthy.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">You Stay in Full Control</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Unlike a partnership or private limited company, an OPC has no co-owners. You retain 100% ownership and complete decision-making power — you simply gain a protective legal wrapper around the business you already run alone.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Easy to Scale Up Later</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              When the business grows and you want to bring in investors or partners, an OPC can be converted into a private limited company smoothly. Starting as an OPC gives you a clean corporate base to scale from when the time is right.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PtoopcBenefits;
