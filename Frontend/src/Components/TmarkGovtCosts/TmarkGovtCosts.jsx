import React from "react";
import "./TmarkGovtCosts.css";

const rows = [
  {
    head: "Govt Fee — Individual / Startup / MSME",
    range: "₹4,500 / class",
    note: "Concessional e-filing fee in Form TM-A for individuals, startups, and MSMEs",
  },
  {
    head: "Govt Fee — Company / Others",
    range: "₹9,000 / class",
    note: "E-filing fee in Form TM-A for companies, partnerships, and other entities",
  },
  {
    head: "Per Additional Class",
    range: "Same fee × classes",
    note: "The above fee applies separately for each class of goods/services applied for",
  },
  {
    head: "Opposition / Notice (TM-O)",
    range: "₹2,700 / class",
    note: "Fee to file or defend an opposition during the 4-month publication window",
  },
  {
    head: "Renewal (after 10 years)",
    range: "₹9,000 / class",
    note: "Renewal fee on Form TM-R; a registered mark is valid for 10 years and renewable",
  },
  {
    head: "Total Out-of-Pocket (typical, 1 class)",
    range: "₹4,500 – ₹9,000",
    note: "Govt. fee billed at actuals per applicant type; professional fee charged separately",
    isTotal: true,
  },
];

const TmarkGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Trademark government fees are charged over and above our professional fee. The fee depends on the applicant type (individual/startup/MSME vs others) and the number of classes applied for — billed at actuals per the official IP India fee schedule.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "opc-govtcosts-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className="opc-govtcosts-range">{row.range}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TmarkGovtCosts;
