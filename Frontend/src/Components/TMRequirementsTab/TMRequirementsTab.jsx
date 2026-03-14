import React from "react";
import "./TMRequirementsTab.css";

const RequirementsPvt = () => {
  return (
    <section className="Tm-req-section">
      <div className="Tm-req-container">
        {/* Heading + intro */}
        <header className="Tm-req-header">
          <h2 className="Tm-req-title">
            Benefits of Trademark Renewal in India
          </h2>
          <p className="Tm-req-subtitle">
            Renewing your trademark on time ensures continuous legal protection and exclusive rights over your brand. It helps you maintain ownership, avoid legal issues, and preserve your brand value without interruption.
          </p>
        </header>

        {/* Cards */}
        <div className="Tm-req-grid">
          {/* 1 */}
          <article className="Tm-req-card">
            <h3 className="Tm-req-card-title">Continue Your Brand Identity Protection</h3>
            <div className="Tm-req-card-underline" />
            <p className="Tm-req-card-text">
             Renewing your trademark ensures that your customers can continue to identify your products or services with your brand. It prevents others from registering or using a similar mark in the same category.
            </p>
          </article>

          {/* 2 */}
          <article className="Tm-req-card">
            <h3 className="Tm-req-card-title">Create Business Opportunities</h3>
            <div className="Tm-req-card-underline" />
            <p className="Tm-req-card-text">
              A renewed trademark remains a valuable intangible asset. You can license, assign, or transfer it and generate revenue through royalty or ownership agreements.
            </p>
          </article>

          {/* 3 */}
          <article className="Tm-req-card">
            <h3 className="Tm-req-card-title">
              Extended Ownership Rights
            </h3>
            <div className="Tm-req-card-underline" />
            <p className="Tm-req-card-text">
              Trademark renewal keeps your legal ownership active. It allows you to take action against anyone who infringes on your rights and protects your brand reputation.
            </p>
          </article>

          {/* 4 */}
          <article className="Tm-req-card">
            <h3 className="Tm-req-card-title">
              Reduced Legal Risk
            </h3>
            <div className="Tm-req-card-underline" />
            <p className="Tm-req-card-text">
              Timely renewal maintains continuous protection and reduces the risk of disputes. It ensures that no other person can legally claim rights over your registered trademark.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
