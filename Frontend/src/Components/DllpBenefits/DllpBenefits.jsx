import React from "react";
import "./DllpBenefits.css";

const DllpBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Formally Dissolving Your LLP
          </h2>
          <p className="opcben-subtitle">
            Closing an unused LLP the right way is not just paperwork — it stops uncapped penalties, protects the designated partners, and draws a clean legal line under a venture that has run its course.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">End the Annual Filing Burden</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Once struck off, the LLP no longer has to file Form 8, Form 11, income tax returns, or complete partner KYC. You stop paying for filings and professional fees on an LLP that earns nothing.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Stop Uncapped Penalties</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Pending Form 8 and Form 11 accrue ₹100 per day, per form — and for LLPs there is no upper cap. A formal closure halts these escalating penalties for good, instead of letting them silently compound into lakhs.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Protect the Designated Partners</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Persistent non-filing can expose designated partners to penalties and disqualification, affecting their ability to run other LLPs or companies. A clean strike-off keeps the partners compliant and free to move on.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Low Cost vs Winding-Up</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              For a dormant LLP with no assets or liabilities, a Form 24 strike-off is dramatically cheaper and faster than a full voluntary winding-up — no liquidator, no court process, just a clean ROC filing.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">A Clean Legal Closure</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Strike-off gives you a definitive, on-record end to the LLP's existence — closing the chapter properly rather than leaving a defunct entity with open-ended liability hanging over the partners.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Free Up Time &amp; Headspace</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              No more tracking due dates, chasing filings, or worrying about notices for an LLP you have moved on from. Closing it formally lets you focus entirely on what you are building next.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default DllpBenefits;
