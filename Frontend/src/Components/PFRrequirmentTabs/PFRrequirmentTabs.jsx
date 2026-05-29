import React from "react";
import "./PFRrequirmentTabs.css";

const RequirementsPvt = () => {
  return (
    <section className="pfr-req-section">
      <div className="pfr-req-container">
        {/* Heading + intro */}
        <header className="pfr-req-header">
          <h2 className="pfr-req-title">
            Benefits of Partnership Firm Registration in India
          </h2>
          <p className="pfr-req-subtitle">
            Registering a partnership firm gives your business a legal foundation, builds trust with clients and banks, and opens doors to government schemes — all at a low cost and with minimal compliance.
          </p>
        </header>

        {/* Cards */}
        <div className="pfr-req-grid">
          {/* 1 */}
          <article className="pfr-req-card">
            <h3 className="pfr-req-card-title">Separate Legal Identity</h3>
            <div className="pfr-req-card-underline" />
            <p className="pfr-req-card-text">
              Once registered, a partnership firm becomes its own legal entity. It can own property, sign contracts, and operate separately from its partners.
            </p>
          </article>

          {/* 2 */}
          <article className="pfr-req-card">
            <h3 className="pfr-req-card-title">Limited Liability Protection</h3>
            <div className="pfr-req-card-underline" />
            <p className="pfr-req-card-text">
              The personal assets of partners are protected from company debts and risks, ensuring financial security for each partner.
            </p>
          </article>

          {/* 3 */}
          <article className="pfr-req-card">
            <h3 className="pfr-req-card-title">Access to Government Schemes</h3>
            <div className="pfr-req-card-underline" />
            <p className="pfr-req-card-text">
              Registered partnership firms can benefit from government schemes like Startup India for tax benefits and easier compliance, and Make in India for incentives and support.
            </p>
          </article>

          {/* 4 */}
          <article className="pfr-req-card">
            <h3 className="pfr-req-card-title">Increased Credibility</h3>
            <div className="pfr-req-card-underline" />
            <p className="pfr-req-card-text">
              A registered firm is more trusted by investors, clients, and vendors, making it easier to secure funding, open bank accounts, and form business partnerships.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
