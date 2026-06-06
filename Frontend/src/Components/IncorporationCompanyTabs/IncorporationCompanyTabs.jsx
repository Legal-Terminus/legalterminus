import React from "react";
import "./IncorporationCompanyTabs.css";
import "../Section8GovtCosts/Section8GovtCosts.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const compareRows = [
  {
    param: "Governing Frameworks",
    indian: "Companies Act 2013",
    foreign: "Companies Act + FEMA + FDI Policy",
  },
  {
    param: "Apostille on Parent Docs",
    indian: "Not required",
    foreign: "Required (Hague / non-Hague)",
  },
  {
    param: "FC-GPR Filing",
    indian: "Not applicable",
    foreign: "Mandatory within 30 days",
    indianNa: true,
  },
  {
    param: "FLA Return (Annual)",
    indian: "Not applicable",
    foreign: "Mandatory by 15 July",
    indianNa: true,
  },
  {
    param: "Sectoral FDI Restrictions",
    indian: "Not applicable",
    foreign: "Applicable — auto / approval / prohibited",
    indianNa: true,
  },
  {
    param: "AD-Bank FIRC + KYC",
    indian: "Not applicable",
    foreign: "Required for inward remittance",
    indianNa: true,
  },
  {
    param: "Setup Timeline",
    indian: "10 – 15 working days",
    foreign: "20 – 30 working days",
  },
  {
    param: "Income Tax Rate",
    indian: "22% (Sec 115BAA) / 25.17%",
    foreign: "22% (Sec 115BAA) / 25.17%",
  },
  {
    param: "RPT Compliance (Sec 188)",
    indian: "Mandatory (parent is RP)",
    foreign: "Mandatory (parent is RP)",
  },
  {
    param: "Total Out-of-Pocket (typical)",
    indian: "₹6,500 – ₹17,000",
    foreign: "₹22,000 – ₹65,000",
    isTotal: true,
  },
];

const IncorporationCompanyTabs = () => {
  return (
    <div className="incorp-company-wrapper">

      {/* ===========================
          WHY CHOOSE SECTION
      ============================ */}
      <section className="incorp-intro-section">
        <div className="incorp-intro-container">

          {/* Illustration */}
          <div className="incorp-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Wholly Owned Subsidiary illustration"
              className="incorp-intro-illustration"
            />
          </div>

          {/* Content */}
          <div className="incorp-intro-content">
            <h2 className="incorp-intro-title">
              Why Choose a Wholly Owned Subsidiary
            </h2>

            <p className="incorp-intro-text">
              A Wholly Owned Subsidiary (WOS) is a company where 100% of the shareholding is held by a single parent entity — either Indian or foreign. While the parent company retains complete ownership and strategic control, the subsidiary operates as a separate legal entity with its own directors, bank account, contracts, tax registrations, and financial records.
              <br /><br />
              For Indian parent companies, a WOS is often used to create a dedicated entity for a specific business line, investment, acquisition, or operational segregation. For foreign parent companies, it is the most widely used structure for establishing an India presence for trading, services, manufacturing, technology, or R&amp;D operations. While the incorporation process is governed by the Companies Act, foreign-owned subsidiaries also require compliance with FEMA, RBI reporting, and apostilled documentation requirements.
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          COMPARISON TABLE
      ============================ */}
      <section className="govtcosts-section incorp-compare-section">
        <div className="govtcosts-container wos-govtcosts-container">
          <h2 className="govtcosts-title">
            Indian-Parent WOS vs Foreign-Parent WOS: The Deep Dive
          </h2>
          <p className="govtcosts-subtitle">
            Same structure, different compliance layers. Here's the honest 2026 comparison:
          </p>

          <div className="govtcosts-table-wrapper">
            <table className="govtcosts-table wos-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Indian-Parent WOS</th>
                  <th>Foreign-Parent WOS</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr key={i} className={row.isTotal ? "govtcosts-total-row" : ""}>
                    <td>{row.param}</td>
                    <td className={row.isTotal ? "govtcosts-range" : ""}>
                      {row.indianNa
                        ? <span className="wos-na">Not applicable</span>
                        : row.indian}
                    </td>
                    <td className={row.isTotal ? "govtcosts-range" : ""}>
                      {row.foreign}
                    </td>
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

export default IncorporationCompanyTabs;
