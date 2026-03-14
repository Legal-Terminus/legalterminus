import React from "react";
import "./ChangeObjectComRequirementsTab.css";

const ChangeObjectComRequirementsTab = () => {
  return (
    <section className="Change-ob-com-Req-section">
      <div className="Change-ob-com-Req-container">
        {/* Heading + intro */}
        <header className="Change-ob-com-Req-header">
          <h2 className="Change-ob-com-Req-title">
            Benefits of Change in Company Object
          </h2>
          <p className="Change-ob-com-Req-subtitle">
            Updating the object clause allows a company to legally expand, adapt to new opportunities, and align its operations with future growth plans while ensuring full regulatory compliance.
          </p>
        </header>

        {/* Cards */}
        <div className="Change-ob-com-Req-grid">
          {/* 1 */}
          <article className="Change-ob-com-Req-card">
            <h3 className="Change-ob-com-Req-card-title">Business Expansion & Diversification:</h3>
            <div className="Change-ob-com-Req-card-underline" />
            <p className="Change-ob-com-Req-card-text">
              Enables the company to legally start new activities, enter different industries, or expand into new markets.
            </p>
          </article>

          {/* 2 */}
          <article className="Change-ob-com-Req-card">
            <h3 className="Change-ob-com-Req-card-title">Operational Flexibility:</h3>
            <div className="Change-ob-com-Req-card-underline" />
            <p className="Change-ob-com-Req-card-text">
              Provides the freedom to adapt business strategies according to market trends and growth opportunities.
            </p>
          </article>

          {/* 3 */}
          <article className="Change-ob-com-Req-card">
            <h3 className="Change-ob-com-Req-card-title">
              Legal Authorization:
            </h3>
            <div className="Change-ob-com-Req-card-underline" />
            <p className="Change-ob-com-Req-card-text">
              Ensures that all new or additional business activities are properly approved and compliant with company law.
            </p>
          </article>

          {/* 4 */}
          <article className="Change-ob-com-Req-card">
            <h3 className="Change-ob-com-Req-card-title">
              Improved Investor Confidence:
            </h3>
            <div className="Change-ob-com-Req-card-underline" />
            <p className="Change-ob-com-Req-card-text">
              An updated object clause reflects a forward-looking and growth-oriented business, enhancing credibility with investors and stakeholders.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ChangeObjectComRequirementsTab;
