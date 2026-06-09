import React from "react";
import "./SocietyRequirementsTab.css";

const SocietyRequirementsTab = () => {
  return (
    <section className="society-req-section">
      <div className="society-req-container">

        <header className="society-req-header">
          <h2 className="society-req-title">
            Benefits of Society Registration in India
          </h2>
          <p className="society-req-subtitle">
            Society isn't just a cheap non-profit setup - it's the right governance model for member-driven missions. Here's what genuinely matters once registered:
          </p>
        </header>

        <div className="society-req-grid">

          <article className="society-req-card">
            <h3 className="society-req-card-title">Member-Driven Democratic Governance</h3>
            <div className="society-req-card-underline" />
            <p className="society-req-card-text">
              Office Bearers (President, Secretary, Treasurer) are elected periodically per the Rules. Decisions flow through General Body meetings and Executive Committee meetings. The membership IS the institution - this is unique among non-profit structures and is the right fit for associations + collectives.
            </p>
          </article>

          <article className="society-req-card">
            <h3 className="society-req-card-title">Separate Legal Identity</h3>
            <div className="society-req-card-underline" />
            <p className="society-req-card-text">
              A registered society has a distinct legal existence for practical purposes — it can own property, open bank accounts, enter into contracts, and sue or be sued in the name of its office bearers. However, unlike a Private Limited Company or LLP, a registered society is not a body corporate and does not confer the same level of limited liability protection on its members.
            </p>
          </article>

          <article className="society-req-card">
            <h3 className="society-req-card-title">Section 43B(h) 45-Day Payment Protection (with Udyam)</h3>
            <div className="society-req-card-underline" />
            <p className="society-req-card-text">
              With Udyam Registration (Enriched / Supreme), your Society becomes an MSME entitled to Section 43B(h) protection - B2B buyers MUST pay you within 45 days or lose the tax deduction. Genuinely powerful for Societies generating revenue from services / training / events.
            </p>
          </article>

          <article className="society-req-card">
            <h3 className="society-req-card-title">Government Tender Access (with Udyam)</h3>
            <div className="society-req-card-underline" />
            <p className="society-req-card-text">
              Udyam-registered Societies qualify for the 25% reservation in central government procurement plus exemption from EMD on most tenders. Many state schemes prefer registered Societies in education / health / sports sectors with MSME / Udyam status.
            </p>
          </article>

          <article className="society-req-card">
            <h3 className="society-req-card-title">12A + 80G + CSR-1 + FCRA Eligibility</h3>
            <div className="society-req-card-underline" />
            <p className="society-req-card-text">
              Registered Societies are eligible to apply for 12A (income tax exemption), 80G (donor deduction eligibility), CSR-1 (CSR funding from corporates), and FCRA (foreign donations). These four registrations collectively unlock government grants, institutional funding, corporate CSR budgets, and international donor money — none of which are accessible without a registered society as the base entity.
            </p>
          </article>

          <article className="society-req-card">
            <h3 className="society-req-card-title">Lower Setup vs Section 8 Co + Stronger Governance vs Trust</h3>
            <div className="society-req-card-underline" />
            <p className="society-req-card-text">
              Society costs Rs.6K-Rs.14K total (vs Rs.15K-Rs.30K for Section 8). Has structured member-elected governance (vs Trust where Settlor-trustees dominate). Sweet spot for groups wanting collective ownership + reasonable cost.
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default SocietyRequirementsTab;
