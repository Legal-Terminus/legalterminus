import React from "react";
import "./PtpubGovtCosts.css";

const rows = [
  {
    head: "MGT-14 Filing Fee",
    range: "₹300 – ₹600",
    note: "ROC fee to file the special resolution, by capital slab",
  },
  {
    head: "INC-27 Filing Fee",
    range: "₹300 – ₹600",
    note: "Application for conversion of private company into public company",
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
    head: "DIN (per additional director)",
    range: "₹500",
    note: "If new directors are added to meet the 3-director minimum",
  },
  {
    head: "Fresh Certificate of Incorporation",
    range: "₹0",
    note: "Issued by the ROC on approval with the new (public) name",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹4,000 – ₹15,000",
    note: "Varies by state, capital, and number of new directors / members",
    isTotal: true,
  },
];

const PtpubGovtCosts = () => {
  return (
    <section className="pub-govtcosts-section">
      <div className="pub-govtcosts-container">
        <h2 className="pub-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="pub-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="pub-govtcosts-subtitle">
          These are estimated government fees charged over and above our professional fee for the conversion. Actual amounts may vary by state, authorised capital, and how many directors / members need to be added.
        </p>

        <div className="pub-govtcosts-table-wrapper">
          <table className="pub-govtcosts-table">
            <thead>
              <tr>
                <th>Cost Head</th>
                <th>Typical Range</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isTotal ? "pub-govtcosts-total-row" : ""}>
                  <td>{row.head}</td>
                  <td className="pub-govtcosts-range">{row.range}</td>
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

export default PtpubGovtCosts;
