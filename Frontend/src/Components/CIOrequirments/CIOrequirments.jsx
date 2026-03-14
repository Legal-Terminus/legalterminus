import React from "react";
import "./CIOrequirments.css";

const RequirementsPvt = () => {
  return (
    <section className="raq-section">
      <div className="raq-container">
        {/* Heading + intro */}
        <header className="raq-header">
          <h2 className="raq-title">
            Benefits of Change in Object (LLP)
          </h2>
          <p className="raq-subtitle">
            Changing the object of your LLP allows your business to legally update or expand its activities as it grows. It ensures compliance with regulations while providing flexibility to explore new opportunities, attract investors, and adapt to changing market conditions
          </p>
        </header>

        {/* Cards */}
        <div className="raq-grid">
          {/* 1 */}
          <article className="raq-card">
            <h3 className="raq-card-title">Supports Business Growth and Diversification</h3>
            <div className="raq-card-underline" />
            <p className="raq-card-text">
             It allows the LLP to enter new markets or industries, helping increase revenue and reduce dependence on a single line of business.
            </p>
          </article>

          {/* 2 */}
          <article className="raq-card">
            <h3 className="raq-card-title">Ensures Legal Compliance</h3>
            <div className="raq-card-underline" />
            <p className="raq-card-text">
              Updating the business activities keeps the LLP’s records aligned with its actual operations, helping avoid penalties or issues during inspections or audits.            </p>
          </article>

          {/* 3 */}
          <article className="raq-card">
            <h3 className="raq-card-title">
              Provides Operational Flexibility
            </h3>
            <div className="raq-card-underline" />
            <p className="raq-card-text">
              It gives the LLP the freedom to adapt to changing market conditions and update its business focus as it grows.            </p>
          </article>

          {/* 4 */}
          <article className="raq-card">
            <h3 className="raq-card-title">
              Helps Attract Investors and Partners
            </h3>
            <div className="raq-card-underline" />
            <p className="raq-card-text">
             A clear and updated business objective can build confidence among potential investors or partners interested in the LLP’s new activities.            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
