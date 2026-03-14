import React from "react";
import "./ChangeLlpRequirementsTab.css";

const ChangeLlpRequirementsTab = () => {
  return (
    <section className="Change-llp-req-section">
      <div className="Change-llp-req-container">
        {/* Heading + intro */}
        <header className="Change-llp-req-header">
          <h2 className="Change-llp-req-title">
            Benefits of Change in LLP Name
          </h2>
          <p className="Change-llp-req-subtitle">
            Changing the name of an LLP can help improve your brand image, match your new business goals, and avoid issues if the name is similar to another company or trademark.
          </p>
        </header>

        {/* Cards */}
        <div className="Change-llp-req-grid">
          {/* 1 */}
          <article className="Change-llp-req-card">
            <h3 className="Change-llp-req-card-title">Rebranding and New Direction:</h3>
            <div className="Change-llp-req-card-underline" />
            <p className="Change-llp-req-card-text">
              A new name helps the business match its current goals, show a fresh direction, and improve its image in the market.
            </p>
          </article>

          {/* 2 */}
          <article className="Change-llp-req-card">
            <h3 className="Change-llp-req-card-title">Avoid Legal Issues:</h3>
            <div className="Change-llp-req-card-underline" />
            <p className="Change-llp-req-card-text">
              Changing the name can prevent problems if it is too similar to another company or trademark, helping you avoid disputes.
            </p>
          </article>

          {/* 3 */}
          <article className="Change-llp-req-card">
            <h3 className="Change-llp-req-card-title">
              Better Market Appeal:
            </h3>
            <div className="Change-llp-req-card-underline" />
            <p className="Change-llp-req-card-text">
              A clear and relevant name can attract new customers and reflect changes in your products or services.
            </p>
          </article>

          {/* 4 */}
          <article className="Change-llp-req-card">
            <h3 className="Change-llp-req-card-title">
              Stronger Professional Image:
            </h3>
            <div className="Change-llp-req-card-underline" />
            <p className="Change-llp-req-card-text">
              Updating the name can improve your business identity and build more trust with clients and partners.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ChangeLlpRequirementsTab;
