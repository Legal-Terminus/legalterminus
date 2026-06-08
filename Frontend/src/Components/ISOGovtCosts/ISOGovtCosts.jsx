import React from "react";
import "../Section8GovtCosts/Section8GovtCosts.css";

const rows = [
  {
    head: "Government Registration Fee",
    range: "₹0",
    notes: "ISO certification has no government registration fee in India",
  },
  {
    head: "CB Audit — Stage 1 & 2 (Initial Certification)",
    range: "₹15,000–₹90,000",
    notes: "Charged by the Certification Body (CB); varies by standard, scope & employee count",
  },
  {
    head: "CB Surveillance Audit (Annual — Year 1 & Year 2)",
    range: "₹5,000–₹40,000",
    notes: "Approx. 50% of Stage 1+2 fees; payable directly to the CB each year",
  },
  {
    head: "CB Re-Certification Audit (End of 3-Year Cycle)",
    range: "₹15,000–₹90,000",
    notes: "Required at the end of Year 3 to renew the certificate for the next cycle",
  },
  {
    head: "CB Auditor Travel & Per Diem (if applicable)",
    range: "₹5,000–₹20,000",
    notes: "Charged on actuals for on-site audits; not applicable for remote/desk audits",
  },
  {
    head: "MSME Subsidy on CB Fees (if eligible)",
    range: "Up to ₹75,000",
    notes: "Available to MSME-registered entities under government scheme; subject to approval",
  },
  {
    head: "Net OOP — Elemental Plan (MSME entity)",
    range: "₹5,000–₹10,000",
    notes: "After MSME subsidy applied on CB fees; approximate out-of-pocket CB cost",
    isTotal: true,
  },
  {
    head: "Net OOP — Supreme Plan (non-MSME)",
    range: "₹45,000–₹90,000",
    notes: "Total CB cost without subsidy; includes Stage 1+2 + travel for full-service scope",
    isTotal: true,
  },
];

const ISOGovtCosts = () => (
  <section className="govtcosts-section">
    <div className="govtcosts-container">
      <h2 className="govtcosts-title">
        Government &amp; Certification Body Costs
        <span className="govtcosts-badge">Transparent Pricing</span>
      </h2>
      <p className="govtcosts-subtitle">
        Legal Terminus professional fees are separate from Certification Body (CB) fees. The table below shows actual CB and government costs so you know the full picture before you commit.
      </p>

      <div className="govtcosts-table-wrapper">
        <table className="govtcosts-table">
          <thead>
            <tr>
              <th>Cost Head</th>
              <th>Amount / Range</th>
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
