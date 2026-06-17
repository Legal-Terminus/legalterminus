import React from "react";
import "./PubpvtGovtCosts.css";

const rows = [
  {
    head: "MGT-14 Filing Fee",
    range: "₹300 – ₹600",
    note: "ROC fee to file the special resolution, by capital slab",
  },
  {
    head: "Form RD-1 Application Fee",
    range: "₹2,000 (approx)",
    note: "Application to the Regional Director for conversion approval",
  },
  {
    head: "Newspaper Advertisement (INC-25A)",
    range: "₹3,000 – ₹10,000",
    note: "Notice in one English + one vernacular newspaper inviting objections",
  },
  {
    head: "INC-28 + INC-27 Filing",
    range: "₹300 – ₹600",
    note: "Filing the RD order and the conversion application with the ROC",
  },
  {
    head: "Stamp Duty on Altered MOA/AOA",
    range: "₹500 – ₹5,000+",
    note: "State + capital based, where applicable on the amended documents",
  },
  {
    head: "Class 3 DSC (2-yr)",
    range: "₹1,499 / person",
    note: "Required for directors signing the conversion forms",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹8,000 – ₹20,000",
    note: "Varies by state, capital & advertisement charges — billed at actuals",
    isTotal: true,
  },
];

const PubpvtGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          A public-to-private conversion needs Regional Director approval and a mandatory newspaper notice, so it carries more out-of-pocket cost than an internal change. The MCA fees, RD-1 fee, advertisement, stamp duty, and DSC are over and above our professional fee — billed at actuals per the official MCA schedule and applicable state stamp law.
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

export default PubpvtGovtCosts;
