import React from "react";
import "../OPCGovtCosts/OPCGovtCosts.css";

const rows = [
  {
    head: "Name Reservation (SPICe+ Part A / RUN)",
    range: "₹1,000 / name",
    note: "Up to 2 proposed names per application; resubmission charged again",
  },
  {
    head: "DIN for Directors",
    range: "Included in SPICe+",
    note: "Director Identification Number allotted with incorporation",
  },
  {
    head: "Class 3 DSC (2-yr)",
    range: "₹1,499 / person",
    note: "Required for each director to sign the e-forms",
  },
  {
    head: "Stamp Duty (MOA, AOA & INC-32)",
    range: "₹500 – ₹10,000+",
    note: "State + authorized-capital based; Odisha stamp duty applied at actuals",
  },
  {
    head: "PAN & TAN",
    range: "₹131 (approx)",
    note: "Issued along with the Certificate of Incorporation",
  },
  {
    head: "Authorized Capital Fee",
    range: "Nil up to ₹15,00,000",
    note: "Government fee relaxed up to ₹15 lakh authorized capital; extra beyond",
  },
  {
    head: "Total Government Out-of-Pocket (typical)",
    range: "₹2,000 – ₹12,000",
    note: "Varies by state, authorized capital & number of directors — billed at actuals",
    isTotal: true,
  },
];

const CroGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Company registration is filed through the MCA's integrated SPICe+ form. The government fees —
          name reservation, DSC, stamp duty on the MOA/AOA, and PAN/TAN — are over and above our
          professional fee and are billed at actuals per the official MCA schedule and Odisha stamp law.
          Government fees are relaxed for authorized capital up to ₹15,00,000.
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

export default CroGovtCosts;
