import React from "react";
import "./DpvtBenefits.css";

const DpvtBenefits = () => {
  return (
    <section className="opcben-section">
      <div className="opcben-container">
        <header className="opcben-header">
          <h2 className="opcben-title">
            Benefits of Formally Dissolving Your Company
          </h2>
          <p className="opcben-subtitle">
            Closing an unused company the right way is not just paperwork — it stops penalties, protects the directors, and draws a clean legal line under a venture that has run its course.
          </p>
        </header>

        <div className="opcben-grid">
          <article className="opcben-card">
            <h3 className="opcben-card-title">End the Annual Compliance Burden</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Once struck off, the company no longer has to file AOC-4, MGT-7, income tax returns, or hold board meetings. You stop paying for filings and professional fees on a company that earns nothing.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Stop Penalties Permanently</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Pending annual filings accrue ₹100 per day, per form, with no upper limit. A formal closure halts these escalating penalties for good, instead of letting them silently compound year after year.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Protect the Directors</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Persistent non-filing can disqualify directors for five years and block them from running or starting other companies. A clean strike-off keeps the directors compliant and free to pursue their next venture.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Low Cost vs Liquidation</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              For a dormant company with no assets or liabilities, strike-off is dramatically cheaper and faster than a full voluntary liquidation — no liquidator, no court process, just a clean ROC filing.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">A Clean Legal Closure</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              Strike-off gives you a definitive, on-record end to the company's existence — closing the chapter properly rather than leaving a defunct entity with open-ended liability hanging over you.
            </p>
          </article>

          <article className="opcben-card">
            <h3 className="opcben-card-title">Free Up Time &amp; Headspace</h3>
            <div className="opcben-card-underline" />
            <p className="opcben-card-text">
              No more tracking deadlines, chasing filings, or worrying about notices for a business you have moved on from. Closing it formally lets you focus entirely on what you are building next.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default DpvtBenefits;
