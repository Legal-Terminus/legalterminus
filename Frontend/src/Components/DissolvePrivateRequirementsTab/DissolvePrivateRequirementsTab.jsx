import React from "react";
import "./DissolvePrivateRequirementsTab.css";

const DissolvePrivateRequirementsTab = () => {
  return (
    <section className="Dissolve-req-section">
      <div className="Dissolve-req-container">

        {/* ================= HEADER ================= */}
        <header className="Dissolve-req-header">
          <h2 className="Dissolve-req-title">
           Benefits of Choose Dissolve a Private Limited Company
          </h2>
          <p className="Dissolve-req-subtitle">
            Dissolving a Private Limited Company stops compliance costs, avoids penalties, protects from future liabilities, and provides a clean legal closure.
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="Dissolve-req-grid">

          {/* Card 1 */}
          <article className="Dissolve-req-card">
            <h3 className="Dissolve-req-card-title">
              Elimination of Compliance Costs & Penalties:
            </h3>
            <div className="Dissolve-req-card-underline" />
            <p className="Dissolve-req-card-text">
              After dissolution, the company is no longer required to file annual returns, financial statements, or pay regular government fees. This helps save money and avoids penalties for non-compliance.
            </p>
          </article>

          {/* Card 2 */}
          <article className="Dissolve-req-card">
            <h3 className="Dissolve-req-card-title">
              Protection from Future Liabilities:
            </h3>
            <div className="Dissolve-req-card-underline" />
            <p className="Dissolve-req-card-text">
              Closing the company legally protects directors and shareholders from future legal issues, debts, or claims related to the company.
            </p>
          </article>

          {/* Card 3 */}
          <article className="Dissolve-req-card">
            <h3 className="Dissolve-req-card-title">
              Proper Financial & Operational Closure:
            </h3>
            <div className="Dissolve-req-card-underline" />
            <p className="Dissolve-req-card-text">
              Dissolution ensures that all business matters are properly settled, including clearing debts, selling assets, and distributing any remaining funds to shareholders.
            </p>
          </article>

          {/* Card 4 */}
          <article className="Dissolve-req-card">
            <h3 className="Dissolve-req-card-title">
              Freedom to Start Fresh:
            </h3>
            <div className="Dissolve-req-card-underline" />
            <p className="Dissolve-req-card-text">
              It allows directors and shareholders to move on from an inactive or loss-making business and focus their time, energy, and investment on new opportunities.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default DissolvePrivateRequirementsTab;
