import React from "react";
import "./EsiRetGovtCosts.css";

const rows = [
  {
    head: "Employee ESI Contribution",
    range: "0.75% of wages",
    note: "Deducted from the wages of employees earning up to ₹21,000 per month",
  },
  {
    head: "Employer ESI Contribution",
    range: "3.25% of wages",
    note: "Borne by the employer for each covered employee — total ESI contribution is 4%",
  },
  {
    head: "Wage Ceiling for Coverage",
    range: "₹21,000 / month",
    note: "₹25,000 for employees with disability; employees above the ceiling are not covered",
  },
  {
    head: "Interest on Late Payment",
    range: "12% p.a.",
    note: "Simple interest on delayed contributions from the due date until the date of payment",
  },
  {
    head: "Damages on Delay — Regulation 31C",
    range: "5% – 25% p.a.",
    note: "Penal damages graded by the length of the delay, in addition to 12% interest",
  },
  {
    head: "Default Penalty — Section 85",
    range: "Fine + imprisonment",
    note: "For failure to pay contributions; recovery plus prosecution under the ESI Act",
  },
];

const EsiRetGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative ESI Contribution &amp; Late-Payment Costs
          <span className="opc-govtcosts-badge">Statutory</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          ESI contributions are statutory amounts deposited with ESIC, separate from our professional fee. Contributions are computed on gross monthly wages, and late deposit attracts 12% interest plus damages of 5%–25% — charged by ESIC at actuals.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Rate</th>
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

export default EsiRetGovtCosts;
