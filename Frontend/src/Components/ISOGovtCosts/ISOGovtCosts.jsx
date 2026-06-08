import React from "react";
import "../Section8GovtCosts/Section8GovtCosts.css";

const rows = [
  {
    head: "Government Fee",
    range: "Rs.0",
    notes: "ISO is NOT a government registration - no govt fee anywhere",
  },
  {
    head: "Certification Body (Stage 1+2)",
    range: "Rs.15,000 - Rs.90,000",
    notes: "Varies by standard, employee count, accreditation (NABCB / UKAS / ANAB)",
  },
  {
    head: "CB Surveillance Audit (per year)",
    range: "Rs.5,000 - Rs.40,000",
    notes: "Year 1 + Year 2; mandatory to keep certificate valid",
  },
  {
    head: "CB Re-Certification (Year 3)",
    range: "Rs.15,000 - Rs.90,000",
    notes: "Full re-audit at end of 3-year cycle",
  },
  {
    head: "CB Auditor Travel + Per Diem",
    range: "Rs.5,000 - Rs.20,000",
    notes: "Borne by client; varies by location",
  },
  {
    head: "MSME Subsidy Reimbursement",
    range: "Up to Rs.75,000",
    notes: "Subsidy CLAIMED post-certification via MSME Office (75% reimbursement)",
  },
  {
    head: "Net Out-of-Pocket (Elemental, MSME)",
    range: "Rs.5,000 - Rs.10,000",
    notes: "After subsidy reimbursement; net of CB fees",
    isTotal: true,
  },
  {
    head: "Net Out-of-Pocket (Supreme, non-MSME)",
    range: "Rs.45,000 - Rs.90,000",
    notes: "No subsidy for non-MSME; full CB cost",
    isTotal: true,
  },
];

const ISOGovtCosts = () => (
  <section className="govtcosts-section">
    <div className="govtcosts-container">
      <h2 className="govtcosts-title">
        Indicative CB &amp; Out-of-Pocket Costs (Billed at Actuals)
      </h2>
      <p className="govtcosts-subtitle">
        Legal Terminus professional fees are separate from Certification Body (CB) fees. The table below shows typical CB and government costs so you have full clarity before committing.
      </p>

      <div className="govtcosts-table-wrapper">
        <table className="govtcosts-table">
          <thead>
            <tr>
              <th>Cost Head</th>
              <th>Typical Range</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={row.isTotal ? "govtcosts-total-row" : ""}>
                <td>{row.head}</td>
                <td className="govtcosts-range">{row.range}</td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default ISOGovtCosts;
