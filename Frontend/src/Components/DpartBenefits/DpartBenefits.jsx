import React from "react";
import "./DpartBenefits.css";

const DpartBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Formally Dissolving Your Firm
          </h2>
          <p className="opcben-subtitle">
            A proper dissolution is not just paperwork — it ends each partner's liability, settles the money cleanly, and protects relationships from the disputes that follow an informal split.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Ends Partner Liability</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A public notice of dissolution stops partners from being held liable for acts done in the firm's name after closure. Without it, an old partner can be dragged into obligations created by others long after they have left.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Clean Settlement of Accounts</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              A documented settlement under Section 48 records exactly how debts, loans, capital, and surplus are dealt with — leaving no ambiguity about who owes or receives what once the firm is wound up.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Prevents Future Disputes</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Mutual releases and indemnities in the dissolution deed close the door on later claims between partners. A well-drafted deed is the cheapest insurance against costly, relationship-destroying litigation down the line.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Stops Ongoing Compliance</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Surrendering the firm's PAN, GST, and licences ends the recurring returns and notices that otherwise keep arriving for a business that no longer trades — and stops penalties for non-filing piling up.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Clear Tax &amp; Asset Closure</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Filing the final return and properly recording the distribution of assets closes the firm's tax affairs cleanly and lets each partner account for their share correctly, avoiding surprises at assessment.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Protects Relationships</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Most partnerships are built on trust. A transparent, well-documented dissolution lets partners part on good terms — preserving personal and professional relationships instead of ending in acrimony.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default DpartBenefits;
