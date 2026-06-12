import React from "react";
import "./CocomBenefits.css";

const CocomBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Amending the Object Clause
          </h2>
          <p className="opcben-subtitle">
            Updating your object clause unlocks new business legally, keeps your contracts enforceable, and gives banks, investors, and authorities a clean, accurate picture of what your company is empowered to do.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">Legally Enter New Business</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              An amended object clause gives the company clear legal authority to carry on the new activity. You can sign contracts, raise invoices, and take on work in the new line with full confidence that it is within the company's powers.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Avoid Ultra-Vires Risk</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Operating outside the object clause is ultra vires and can render acts and contracts void or open to challenge. Amending the objects first removes this risk entirely, protecting the company and its directors from disputes and liability.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Smoother Funding &amp; Due Diligence</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Banks and investors examine the MOA to confirm a company can legally do what it claims. Objects that match your actual and planned business sail through due diligence — a mismatch is a classic red flag that can stall a deal.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Qualify for Tenders &amp; Licences</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Many tenders and sector licences require the company's objects to cover the relevant activity. Updating the object clause makes the company eligible to apply, opening doors that a narrow or outdated MOA would keep shut.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Future-Proof the MOA</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Well-drafted objects give the company room to grow into related activities without amending again every time. A modern, broad-but-precise object clause supports diversification and reduces repeated compliance costs down the line.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">No Loss of Continuity</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Changing the objects does not change the company's identity. The CIN, history, PAN, existing contracts, and liabilities all continue unchanged — you simply expand what the company is allowed to do, with zero disruption.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default CocomBenefits;
