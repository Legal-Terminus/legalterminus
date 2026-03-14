import React from "react";
import "./CICrequirment.css";

const RequirementsPvt = () => {
  return (
    <section className="nic-section">
      <div className="nic-container">
        {/* Heading + intro */}
        <header className="nic-header">
          <h2 className="nic-title">
            Benefits of Change in Company Name
          </h2>
          <p className="nic-subtitle">
            Changing your company name can strengthen your brand identity and align your business with its current goals and market direction. It helps create a stronger impression, improve recognition, and support long-term growth while maintaining your company’s legal continuity.
          </p>
        </header>

        {/* Cards */}
        <div className="nic-grid">
          {/* 1 */}
          <article className="nic-card">
            <h3 className="nic-card-title">Matches Your New Vision</h3>
            <div className="nic-card-underline" />
            <p className="nic-card-text">
              A new name can better reflect your current goals, mission, and future plans. It gives your business a fresh and updated identity.
            </p>
          </article>

          {/* 2 */}
          <article className="nic-card">
            <h3 className="nic-card-title">Stronger Market Position</h3>
            <div className="nic-card-underline" />
            <p className="nic-card-text">
              Changing the name can help your company stand out from competitors and stay relevant in today’s market.
            </p>
          </article>

          {/* 3 */}
          <article className="nic-card">
            <h3 className="nic-card-title">
              Better Brand Recognition
            </h3>
            <div className="nic-card-underline" />
            <p className="nic-card-text">
              A clear and meaningful name makes it easier for customers to remember your business and attracts the right target audience.
            </p>
          </article>

          {/* 4 */}
          <article className="nic-card">
            <h3 className="nic-card-title">
              Brings Everything Under One Identity
            </h3>
            <div className="nic-card-underline" />
            <p className="nic-card-text">
              It helps combine different services, products, or business activities under one strong and unified brand name.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
