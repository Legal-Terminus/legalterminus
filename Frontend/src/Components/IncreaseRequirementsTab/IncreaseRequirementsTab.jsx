import React from "react";
import "./IncreaseRequirementsTab.css";

const IncreaseRequirementsTab= () => {
  return (
    <section className="Increase-section">
      <div className="Increase-container">
        {/* Heading + intro */}
        <header className="Increase-header">
          <h2 className="Increase-title">
            Benefits of Increase in Authorised Capital (Company)
          </h2>
          <p className="Increase-subtitle">
           Increasing Authorised Capital allows your company to raise additional funds by expanding its shareholding capacity. It supports business growth, new investments, restructuring, and ensures smooth compliance with legal requirements.          </p>
        </header>

        {/* Cards */}
        <div className="Increase-grid">
          {/* 1 */}
          <article className="Increase-card">
            <h3 className="Increase-card-title">Supports Business Growth</h3>
            <div className="Increase-card-underline" />
            <p className="Increase-card-text">
             It allows the company to issue more shares and raise funds for new projects, expansion, acquisitions, or scaling the business.
            </p>
          </article>

          {/* 2 */}
          <article className="Increase-card">
            <h3 className="Increase-card-title">Builds Strong Market Image</h3>
            <div className="Increase-card-underline" />
            <p className="Increase-card-text">
             A higher authorised capital creates a positive impression on investors, business partners, and lenders. It shows that the company is planning for long-term growth.            </p>
          </article>

          {/* 3 */}
          <article className="Increase-card">
            <h3 className="Increase-card-title">
              Better Loan Opportunities
            </h3>
            <div className="Increase-card-underline" />
            <p className="Increase-card-text">
              When the company has a higher capital base, banks and financial institutions may feel more confident in giving loans or financial support.
            </p>
          </article>

          {/* 4 */}
          <article className="Increase-card">
            <h3 className="Increase-card-title">
              More Flexibility in Issuing Shares
            </h3>
            <div className="Increase-card-underline" />
            <p className="Increase-card-text">
              It gives the company freedom to issue shares to new investors, existing shareholders, or even employees under ESOP schemes, whenever required.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default IncreaseRequirementsTab;
