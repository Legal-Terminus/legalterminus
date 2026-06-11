import React from "react";
import "./ItrIndGovtCosts.css";

const rows = [
  {
    head: "Late Filing Fee — Sec 234F (income > ₹5L)",
    range: "₹5,000",
    note: "For belated returns filed after the due date when total income exceeds ₹5 lakh",
  },
  {
    head: "Late Filing Fee — Sec 234F (income ≤ ₹5L)",
    range: "₹1,000",
    note: "Reduced late fee where total income is up to ₹5 lakh",
  },
  {
    head: "Interest on Unpaid Tax — Sec 234A",
    range: "1% / month",
    note: "On outstanding self-assessment tax from the due date until the return is filed",
  },
  {
    head: "Interest — Sec 234B / 234C",
    range: "1% / month",
    note: "For non-payment / deferment of advance tax (where liability is ₹10,000 or more)",
  },
  {
    head: "Belated / Updated Return Window",
    range: "Allowed with fee",
    note: "Belated return till 31 Dec; updated return (ITR-U) later with additional tax of 25–50%",
  },
  {
    head: "Total Out-of-Pocket (typical, on-time filing)",
    range: "₹0 govt fee",
    note: "Filing the return itself carries no government fee — only penalties/interest if delayed",
    isTotal: true,
  },
];

const ItrIndGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Penalties &amp; Interest for Late / Non-Filing
          <span className="opc-govtcosts-badge">Statutory</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Filing your personal ITR on time carries no government fee. Late-filing fees and interest under the Income Tax Act apply only on delay or default and are over and above our professional fee — charged by the department at actuals.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Amount</th>
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

export default ItrIndGovtCosts;
