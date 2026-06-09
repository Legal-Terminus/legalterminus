import React from "react";
import "../OPCGovtCosts/OPCGovtCosts.css";

const rows = [
  {
    head: "PT Registration Fee (Employer)",
    range: "₹0 – ₹2,500",
    note: "Varies by state; some states charge nil, others levy a one-time or annual registration fee",
  },
  {
    head: "Annual Renewal / Enrolment Fee",
    range: "₹2,500 / year",
    note: "Maximum per constitutional cap; applicable in states that have enrolment for self-employed",
  },
  {
    head: "Monthly PT Challan (per employee)",
    range: "₹0 – ₹208",
    note: "Monthly deduction per employee per salary slab; employer remits to state government",
  },
  {
    head: "Late Return Filing Penalty",
    range: "₹200 – ₹1,000",
    note: "Per month of delay; state-specific; Maharashtra levies ₹1,000/month, Karnataka ₹50/day",
  },
  {
    head: "Non-Registration Penalty",
    range: "₹1,000 – ₹5,000",
    note: "Levied for failure to register within the due period; varies by state",
  },
  {
    head: "Interest on Unpaid Tax",
    range: "1% – 2% per month",
    note: "Charged on outstanding PT dues from due date; compounded monthly in most states",
  },
  {
    head: "Total Annual Cost (typical 10-employee firm)",
    range: "₹5,000 – ₹25,000",
    note: "Includes challan remittances + return filing costs; excludes penalty (if compliant)",
    isTotal: true,
  },
];

const ProfTaxGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Statutory Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          These are estimated government fees and statutory costs over and above our professional fee. Actual amounts vary by state and employee headcount.
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

export default ProfTaxGovtCosts;
