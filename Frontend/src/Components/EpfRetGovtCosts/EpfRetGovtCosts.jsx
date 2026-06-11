import React from "react";
import "./EpfRetGovtCosts.css";

const rows = [
  {
    head: "Employee PF Contribution",
    range: "12% of wages",
    note: "Deducted from the employee's basic + DA and deposited fully into the EPF account",
  },
  {
    head: "Employer Contribution (EPF + EPS)",
    range: "12% of wages",
    note: "Split as 8.33% to EPS (capped at ₹15,000 wage) and 3.67% to EPF",
  },
  {
    head: "EDLI Charges",
    range: "0.50% of wages",
    note: "Employer-borne contribution to the Employees' Deposit Linked Insurance scheme",
  },
  {
    head: "EPF Admin Charges",
    range: "0.50% of wages",
    note: "Employer-borne administrative charge, subject to a minimum amount per month",
  },
  {
    head: "Interest on Late Payment — Sec 7Q",
    range: "12% p.a.",
    note: "Charged on delayed contributions from the due date until the date of payment",
  },
  {
    head: "Damages on Delay — Sec 14B",
    range: "5% – 25% p.a.",
    note: "Penal damages graded by the length of the delay, in addition to 7Q interest",
  },
];

const EpfRetGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative EPF Contribution &amp; Late-Payment Costs
          <span className="opc-govtcosts-badge">Statutory</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          EPF contributions are statutory amounts deposited with EPFO, separate from our professional fee. Contributions are calculated on wages (basic + DA), and late deposit attracts interest under Section 7Q and damages under Section 14B — charged by EPFO at actuals.
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

export default EpfRetGovtCosts;
