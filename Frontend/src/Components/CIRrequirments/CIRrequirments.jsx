import React from "react";
import "./CIRrequirments.css";

const RequirementsPvt = () => {
  return (
    <section className="rew-section">
      <div className="rew-container">
        {/* Heading + intro */}
        <header className="rew-header">
          <h2 className="rew-title">
            Benefits of Change in Registered Office Address (LLP)
          </h2>
          <p className="rew-subtitle">
            Changing the registered office address of your LLP ensures your business remains legally compliant while supporting operational improvements. It helps you avoid penalties, improve efficiency, manage costs effectively, and strengthen your professional image as your business grows.
          </p>
        </header>

        {/* Cards */}
        <div className="rew-grid">
          {/* 1 */}
          <article className="rew-card">
            <h3 className="rew-card-title">Avoids Penalties and Legal Issues</h3>
            <div className="rew-card-underline" />
            <p className="rew-card-text">
              Filing the required forms on time helps your LLP stay compliant and avoid fines, legal notices, or other complications.
            </p>
          </article>

          {/* 2 */}
          <article className="rew-card">
            <h3 className="rew-card-title">Supports Business Growth</h3>
            <div className="rew-card-underline" />
            <p className="rew-card-text">
              Shifting to a new location can provide better space, improved facilities, and closer access to clients, suppliers, or target markets.
            </p>
          </article>

          {/* 3 */}
          <article className="rew-card">
            <h3 className="rew-card-title">
              Reduces Business Costs
            </h3>
            <div className="rew-card-underline" />
            <p className="rew-card-text">
              Moving to a more affordable office can lower rent and operating expenses, helping improve the LLP’s overall financial health.
            </p>
          </article>

          {/* 4 */}
          <article className="rew-card">
            <h3 className="rew-card-title">
              Improves Business Image
            </h3>
            <div className="rew-card-underline" />
            <p className="rew-card-text">
             A better or more professional location can enhance your LLP’s credibility and create a stronger impression in the market.            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
