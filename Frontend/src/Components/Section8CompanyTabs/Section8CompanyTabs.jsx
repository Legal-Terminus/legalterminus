import React from "react";
import "./Section8CompanyTabs.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const compareRows = [
  {
    param: "Governing Law",
    s8: "Companies Act 2013",
    trust: "Indian Trusts Act / state Public Trusts Acts",
    society: "Societies Registration Act 1860",
  },
  {
    param: "Registered With",
    s8: "MCA / RoC (central)",
    trust: "Charity Commissioner / Sub-Registrar (state)",
    society: "Registrar of Societies (state)",
  },
  {
    param: "Min Members",
    s8: "2 directors + 2 subs",
    trust: "2 trustees",
    society: "7 members",
  },
  {
    param: "Statutory Audit",
    s8: "Mandatory regardless",
    trust: "Required if income > Rs.50,000",
    society: "Conditional",
  },
  {
    param: "Annual MCA Filings",
    s8: "MGT-7 + AOC-4 + DIR-3",
    trust: "None",
    society: "Annual return (state-specific)",
  },
  {
    param: "Donor Credibility",
    s8: "Highest",
    trust: "Medium",
    society: "Medium",
  },
  {
    param: "CSR Funding Eligibility",
    s8: "Yes (with CSR-1)",
    trust: "Yes (with CSR-1)",
    society: "Yes (with CSR-1)",
  },
  {
    param: "Foreign Funding (FCRA)",
    s8: "Eligible",
    trust: "Eligible",
    society: "Eligible",
  },
  {
    param: "Setup Cost (Total)",
    s8: "Rs.15K – Rs.30K",
    trust: "Rs.5K – Rs.15K",
    society: "Rs.5K – Rs.12K",
  },
  {
    param: "Setup Time",
    s8: "20 – 25 days",
    trust: "10 – 20 days",
    society: "15 – 30 days",
  },
];

const Section8CompanyTabs = () => {
  return (
    <div className="s8-company-wrapper">

      {/* INTRO SECTION */}
      <section className="s8-intro-section">
        <div className="s8-intro-container">

          <div className="s8-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Section 8 Company illustration"
              className="s8-intro-illustration"
            />
          </div>

          <div className="s8-intro-content">
            <h2 className="s8-intro-title">
              Why Choose a Section 8 Company
            </h2>

            <p className="s8-intro-text">
              A Section 8 Company is a legally recognized non-profit organization structure registered under the Companies Act, 2013. It is designed for organizations working towards charitable, social, educational, cultural, environmental, religious, or non-profit objectives. Unlike regular companies, a Section 8 Company cannot distribute profits to its members or directors. Any income or surplus earned must be used only for promoting the organization's objectives and activities.
            </p>

            <p className="s8-intro-text s8-intro-text--mt">
              One of the biggest advantages of a Section 8 Company is its higher legal credibility and structured governance. It enjoys benefits such as separate legal identity, limited liability protection, perpetual succession, and better transparency through statutory compliance and audited accounts. Section 8 Companies are widely preferred by CSR contributors, institutional donors, government authorities, and foreign funding agencies because of their professional structure and regulatory oversight. Compared to Trusts and Societies, a Section 8 Company offers stronger compliance standards, better credibility, and improved opportunities for grants, partnerships, CSR funding, and large-scale social impact projects.
            </p>
          </div>

        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="s8-compare-section">
        <div className="s8-compare-container">
          <h2 className="s8-compare-title">Section 8 vs Trust vs Society: The Deep Dive</h2>
          <p className="s8-compare-subtitle">
            Three non-profit structures, three different best-fits. Here's the honest 2026 comparison:
          </p>

          <div className="s8-compare-table-wrapper">
            <table className="s8-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Section 8 Co.</th>
                  <th>Public Trust</th>
                  <th>Society</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={i}>
                    <td className="s8-compare-param">{row.param}</td>
                    <td>{row.s8}</td>
                    <td>{row.trust}</td>
                    <td>{row.society}</td>
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

export default Section8CompanyTabs;
