import React from "react";
import "./TrustCompanyTabs.css";
import "../IECGovtCosts/IECGovtCosts.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const comparisonRows = [
  { param: "Governing Law", trust: "Indian Trusts Act 1882 / state PTAs", society: "Societies Registration Act 1860", sec8: "Companies Act 2013" },
  { param: "Registered With", trust: "Sub-Registrar / Charity Commissioner", society: "Registrar of Societies (state)", sec8: "MCA / RoC" },
  { param: "Min Members", trust: "2 trustees", society: "7 members", sec8: "2 directors + 2 subs" },
  { param: "Setup Cost (Total)", trust: "Rs.5K - Rs.15K", society: "Rs.5K - Rs.12K", sec8: "Rs.15K - Rs.30K" },
  { param: "Setup Time", trust: "10 - 20 days", society: "15 - 30 days", sec8: "20 - 25 days" },
  { param: "Statutory Audit", trust: "Income > Rs.50K (state-specific)", society: "Conditional", sec8: "Mandatory regardless" },
  { param: "Annual MCA Filings", trust: "None", society: "Annual return (state-specific)", sec8: "MGT-7 + AOC-4 + DIR-3" },
  { param: "Donor Credibility", trust: "Medium-High", society: "Medium", sec8: "Highest" },
  { param: "CSR Funding (with CSR-1)", trust: "Yes", society: "Yes", sec8: "Yes" },
  { param: "Foreign Funding (FCRA)", trust: "Eligible", society: "Eligible", sec8: "Eligible" },
];

const TrustCompanyTabs = () => {
  return (
    <div className="trust-company-wrapper">

      {/* ===========================
          INTRO SECTION
      ============================ */}
      <section className="trust-intro-section">
        <div className="trust-intro-container">

          {/* Illustration */}
          <div className="trust-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Why choose Trust Registration"
              className="trust-intro-illustration"
            />
          </div>

          {/* Content */}
          <div className="trust-intro-content">
            <h2 className="trust-intro-title">
              Why Choose a Trust Registration
            </h2>

            <p className="trust-intro-text">
              Trust Registration in India is one of the oldest and most widely used legal structures for charitable, religious, educational, medical, social welfare, and family-purpose organizations. A Trust is created when a Settlor transfers assets or property to Trustees, who manage them for the benefit of beneficiaries or for a charitable purpose. It is a cost-effective and straightforward structure with relatively lower compliance requirements, making it easier to establish and manage.
            </p>
            <p className="trust-intro-text" style={{ marginTop: "14px" }}>
              Once registered, a Trust can open bank accounts, own property, receive donations, and carry out charitable or welfare activities through its trustees. Trusts are commonly chosen for charitable organizations, temples, educational initiatives, family trusts, and NGOs. Eligible Trusts can also obtain registrations such as 12A and 80G, enabling income tax exemptions and allowing donors to claim tax benefits on their contributions.
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          COMPARISON TABLE
      ============================ */}
      <section className="iec-govtcosts-section">
        <div className="iec-govtcosts-container">
          <h2 className="iec-govtcosts-title">
            Trust vs Society vs Section 8 Company: The Deep Dive
          </h2>
          <p className="iec-govtcosts-subtitle">
            Three non-profit structures, three different best-fits. Here's the honest 2026 comparison:
          </p>

          <div className="iec-govtcosts-table-wrapper">
            <table className="iec-govtcosts-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Trust</th>
                  <th>Society</th>
                  <th>Section 8 Co.</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.param}</td>
                    <td>{row.trust}</td>
                    <td>{row.society}</td>
                    <td>{row.sec8}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TrustCompanyTabs;
