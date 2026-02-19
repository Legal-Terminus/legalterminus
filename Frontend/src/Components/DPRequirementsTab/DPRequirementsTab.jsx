import React from "react";
import "./DPRequirementsTab.css";

const DPRequirementsTab = () => {
  return (
    <section className="DP-req-section">
      <div className="DP-req-container">

        {/* ================= HEADER ================= */}
        <header className="DP-req-header">
          <h2 className="DP-req-title">
            Benefits of Choose Dissolve a Partnership Firm
          </h2>
          <p className="DP-req-subtitle">
            Dissolving a partnership firm ends its legal existence, settles all dues and liabilities, prevents future disputes, and allows partners to move forward with new opportunities.
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="DP-req-grid">

          {/* Card 1 */}
          <article className="DP-req-card">
            <h3 className="DP-req-card-title">
              Legal & Financial Protection:
            </h3>
            <div className="DP-req-card-underline" />
            <p className="DP-req-card-text">
              Closing the firm properly helps prevent future legal problems, protects credit records, and limits responsibility for any actions after closure.
            </p>
          </article>

          {/* Card 2 */}
          <article className="DP-req-card">
            <h3 className="DP-req-card-title">
              Resolving Partner Conflicts:
            </h3>
            <div className="DP-req-card-underline" />
            <p className="DP-req-card-text">
              It gives a formal way to end the partnership when disagreements among partners cannot be resolved.
            </p>
          </article>

          {/* Card 3 */}
          <article className="DP-req-card">
            <h3 className="DP-req-card-title">
              Final Settlement of Accounts:
            </h3>
            <div className="DP-req-card-underline" />
            <p className="DP-req-card-text">
              The process ensures all debts and liabilities are paid off, and any remaining assets are fairly shared among partners.
            </p>
          </article>

          {/* Card 4 */}
          <article className="DP-req-card">
            <h3 className="DP-req-card-title">
              Freedom to Move On:
            </h3>
            <div className="DP-req-card-underline" />
            <p className="DP-req-card-text">
              Partners can pursue their own new or better business opportunities without being tied to the old firm.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default DPRequirementsTab;
