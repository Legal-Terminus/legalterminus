import React from "react";
import "./SocietyRequirementsTab.css";

const SocietyRequirementsTab = () => {
  return (
    <section className="society-req-section">
      <div className="society-req-container">

        {/* ================= HEADER ================= */}
        <header className="society-req-header">
          <h2 className="society-req-title">
            Benefits of Society Registration in India
          </h2>
          <p className="society-req-subtitle">
            Society registration gives legal recognition, protects members from personal liability, and allows the society to open a bank account and own property. It also helps in getting tax benefits, government grants, and building trust among donors and the public.
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="society-req-grid">

          {/* Card 1 */}
          <article className="society-req-card">
            <h3 className="society-req-card-title">
              Legal Identity
            </h3>
            <div className="society-req-card-underline" />
            <p className="society-req-card-text">
              Once registered, the society becomes legally recognized. It can sign agreements, open a bank account, and buy or own property in its own name.
            </p>
          </article>

          {/* Card 2 */}
          <article className="society-req-card">
            <h3 className="society-req-card-title">
              Continued Existence
            </h3>
            <div className="society-req-card-underline" />
            <p className="society-req-card-text">
              The society continues to exist even if members leave or pass away.
            </p>
          </article>

          {/* Card 3 */}
          <article className="society-req-card">
            <h3 className="society-req-card-title">
              Protection of Members
            </h3>
            <div className="society-req-card-underline" />
            <p className="society-req-card-text">
              In most cases, members are not personally responsible for the society’s debts or legal issues.
            </p>
          </article>

          {/* Card 4 */}
          <article className="society-req-card">
            <h3 className="society-req-card-title">
              Tax Benefits
            </h3>
            <div className="society-req-card-underline" />
            <p className="society-req-card-text">
              A registered society can apply to save income tax under 12A. Donors can also get tax benefits under 80G.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default SocietyRequirementsTab;
