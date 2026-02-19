import React from "react";
import "./DissolveLLPRequiremwntsTab.css";

const DissolveLLPRequiremwntsTab = () => {
  return (
    <section className="Dissllp-req-section">
      <div className="Dissllp-req-container">

        {/* ================= HEADER ================= */}
        <header className="Dissllp-req-header">
          <h2 className="Dissllp-req-title">
           Benefits of Choose Dissolve a Limited Liability Partnership
          </h2>
          <p className="Dissllp-req-subtitle">
            Dissolving an LLP removes ongoing compliance requirements, stops additional penalties, provides a clear legal closure, and allows partners to focus their time and resources on new business opportunities.
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="Dissllp-req-grid">

          {/* Card 1 */}
          <article className="Dissllp-req-card">
            <h3 className="Dissllp-req-card-title">
              Removal of Compliance Burden:
            </h3>
            <div className="Dissllp-req-card-underline" />
            <p className="Dissllp-req-card-text">
              After dissolution, the LLP is no longer required to file annual returns or financial statements, which saves time, effort, and money.
            </p>
          </article>

          {/* Card 2 */}
          <article className="Dissllp-req-card">
            <h3 className="Dissllp-req-card-title">
              Stop Further Penalties:
            </h3>
            <div className="Dissllp-req-card-underline" />
            <p className="Dissllp-req-card-text">
              If the LLP has pending filings, closing it legally prevents additional late fees and penalties from increasing.
            </p>
          </article>

          {/* Card 3 */}
          <article className="Dissllp-req-card">
            <h3 className="Dissllp-req-card-title">
              Proper Legal Closure:
            </h3>
            <div className="Dissllp-req-card-underline" />
            <p className="Dissllp-req-card-text">
              Dissolution officially closes the LLP and clearly settles its assets and liabilities, protecting partners from future legal issues.
            </p>
          </article>

          {/* Card 4 */}
          <article className="Dissllp-req-card">
            <h3 className="Dissllp-req-card-title">
              Better Use of Resources:
            </h3>
            <div className="Dissllp-req-card-underline" />
            <p className="Dissllp-req-card-text">
              It helps partners avoid spending money and time on an inactive business and focus on new or profitable opportunities.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default DissolveLLPRequiremwntsTab;
