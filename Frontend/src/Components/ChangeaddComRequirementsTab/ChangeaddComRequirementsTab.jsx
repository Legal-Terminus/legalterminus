import React from "react";
import "./ChangeaddComRequirementsTab.css";

const ChangeaddComRequirementsTab = () => {
  return (
    <section className="Change-add-com-Rt-section">
      <div className="Change-add-com-Rt-container">
        {/* Heading + intro */}
        <header className="Change-add-com-Rt-header">
          <h2 className="Change-add-com-Rt-title">
            Benefits of Changing in Registered Office Address (Company)
          </h2>
          <p className="Change-add-com-Rt-subtitle">
            Changing the registered office address of a company supports business growth, operational flexibility, and better compliance management. It helps the company adapt to new opportunities, improve its presence, and ensure smooth legal and administrative functioning.
          </p>
        </header>

        {/* Cards */}
        <div className="Change-add-com-Rt-grid">
          {/* 1 */}
          <article className="Change-add-com-Rt-card">
            <h3 className="Change-add-com-Rt-card-title">Growth & Expansion:</h3>
            <div className="Change-add-com-Rt-card-underline" />
            <p className="Change-add-com-Rt-card-text">
Shifting to a new office gives your business the space it needs for a growing team, larger operations, or moving into a permanent and owned premises.
            </p>
          </article>

          {/* 2 */}
          <article className="Change-add-com-Rt-card">
            <h3 className="Change-add-com-Rt-card-title">Cost Efficiency:</h3>
            <div className="Change-add-com-Rt-card-underline" />
            <p className="Change-add-com-Rt-card-text">
              Relocating to a better location can help reduce rent, lower operational expenses, and improve overall cost management.
            </p>
          </article>

          {/* 3 */}
          <article className="Change-add-com-Rt-card">
            <h3 className="Change-add-com-Rt-card-title">
              Improved Business Image:
            </h3>
            <div className="Change-add-com-Rt-card-underline" />
            <p className="Change-add-com-Rt-card-text">
              Moving to a well-known or easily accessible area enhances your company’s professional reputation and makes it more convenient for clients and employees.
            </p>
          </article>

          {/* 4 */}
          <article className="Change-add-com-Rt-card">
            <h3 className="Change-add-com-Rt-card-title">
              Better Market Reach:
            </h3>
            <div className="Change-add-com-Rt-card-underline" />
            <p className="Change-add-com-Rt-card-text">
              A new location can bring your business closer to target customers, suppliers, or new markets, supporting future growth and opportunities.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ChangeaddComRequirementsTab;
