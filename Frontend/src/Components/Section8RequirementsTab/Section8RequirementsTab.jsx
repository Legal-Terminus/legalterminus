import React from "react";
import "./Section8RequirementsTab.css";

const Section8RequirementsTab = () => {
  return (
    <section className="s8-req-section">
      <div className="s8-req-container">

        {/* ================= HEADER ================= */}
        <header className="s8-req-header">
          <h2 className="s8-req-title">
            Benefits of Section 8 Company Registration in India
          </h2>
          <p className="s8-req-subtitle">
            Section 8 isn't a "lighter Pvt Ltd" — it's a different instrument. It trades dividend rights and conversion flexibility for tax privileges, donor incentives, and institutional credibility that no other structure offers. Here's what you unlock when you register a Section 8 Company.
          </p>
        </header>

        {/* ================= CARDS ================= */}
        <div className="s8-req-grid">

          {/* Card 1 */}
          <article className="s8-req-card">
            <h3 className="s8-req-card-title">
              Tax Exemption via 12A Registration
            </h3>
            <div className="s8-req-card-underline" />
            <p className="s8-req-card-text">
              Once registered under Section 12A of the Income Tax Act, your Section 8 Company's entire income applied to charitable purposes is exempt from income tax. This applies to grants, donations, program income, and interest earned on corpus — making the 12A registration the single most valuable tax benefit available to non-profits in India.
            </p>
          </article>

          {/* Card 2 */}
          <article className="s8-req-card">
            <h3 className="s8-req-card-title">
              Donor Tax Deduction via 80G Registration
            </h3>
            <div className="s8-req-card-underline" />
            <p className="s8-req-card-text">
              With 80G registration, individuals and corporates donating to your Section 8 Company get a 50% deduction on their taxable income. This is a powerful fundraising lever — most institutional donors, HNIs, and CSR programs require 80G certification before committing funds. It directly increases your fundraising conversion rate.
            </p>
          </article>

          {/* Card 3 */}
          <article className="s8-req-card">
            <h3 className="s8-req-card-title">
              Institutional Credibility &amp; Governance
            </h3>
            <div className="s8-req-card-underline" />
            <p className="s8-req-card-text">
              Registered under the Companies Act, 2013 and regulated by the MCA and RoC, a Section 8 Company has mandatory statutory audits, annual board meetings, and MCA filings. This structured governance makes it the most credible non-profit form in India — preferred by bilateral agencies, embassies, large corporates, and government grant programs over Trusts and Societies.
            </p>
          </article>

          {/* Card 4 */}
          <article className="s8-req-card">
            <h3 className="s8-req-card-title">
              CSR Funding Eligibility
            </h3>
            <div className="s8-req-card-underline" />
            <p className="s8-req-card-text">
              Large companies in India are required to spend 2% of net profits on CSR activities under Schedule VII of the Companies Act. Section 8 Companies with valid CSR-1 registration on the MCA portal are directly eligible to receive this funding. Trusts and Societies need additional conditions; Section 8 Companies have the smoothest path to CSR partnerships.
            </p>
          </article>

          {/* Card 5 */}
          <article className="s8-req-card">
            <h3 className="s8-req-card-title">
              FCRA-Compatible Structure
            </h3>
            <div className="s8-req-card-underline" />
            <p className="s8-req-card-text">
              Foreign Contribution Regulation Act (FCRA) registration allows organizations to receive foreign funds from international donors, foundations, and agencies. Section 8 Companies are eligible to apply for FCRA registration after 3 years of operation (or via prior permission for younger organizations). The structured governance and audited accounts of a Section 8 Company significantly improve FCRA approval rates compared to Trusts and Societies.
            </p>
          </article>

          {/* Card 6 */}
          <article className="s8-req-card">
            <h3 className="s8-req-card-title">
              Limited Liability + Separate Legal Entity
            </h3>
            <div className="s8-req-card-underline" />
            <p className="s8-req-card-text">
              Directors and members of a Section 8 Company enjoy limited liability — personal assets are protected from organizational debts and liabilities. The company exists as a separate legal entity, capable of owning property, entering contracts, and operating bank accounts in its own name. This is a significant advantage over Trusts (where trustees may have personal liability) and Societies (which have weaker legal personhood).
            </p>
          </article>

        </div>
      </div>
    </section>
  );
};

export default Section8RequirementsTab;
