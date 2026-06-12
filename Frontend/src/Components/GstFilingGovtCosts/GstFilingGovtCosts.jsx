import React from "react";
import "./GstFilingGovtCosts.css";

const rows = [
  {
    head: "GSTR-1 / GSTR-3B - Nil return",
    range: "Rs.20 / day (max Rs.500)",
    note: "Not applicable (nil)",
  },
  {
    head: "GSTR-1 / GSTR-3B - Non-nil (turnover up to Rs.5 Cr)",
    range: "Rs.50 / day (max Rs.2,000)",
    note: "18% p.a. on tax dues",
  },
  {
    head: "GSTR-1 / GSTR-3B - Non-nil (turnover Rs.5 Cr to Rs.20 Cr)",
    range: "Rs.50 / day (max Rs.5,000)",
    note: "18% p.a. on tax dues",
  },
  {
    head: "GSTR-1 / GSTR-3B - Non-nil (turnover above Rs.20 Cr)",
    range: "Rs.50 / day (max Rs.10,000)",
    note: "18% p.a. on tax dues",
  },
  {
    head: "GSTR-9 (Annual) - Turnover up to Rs.5 Cr",
    range: "Rs.50 / day (max 0.04% of T/O)",
    note: "Per Section 50",
  },
  {
    head: "GSTR-9 (Annual) - Turnover Rs.5 Cr to Rs.20 Cr",
    range: "Rs.100 / day (max 0.04% of T/O)",
    note: "Per Section 50",
  },
  {
    head: "GSTR-9C (Reconciliation) - Required > Rs.5 Cr T/O",
    range: "Self-certified; late = penalty under Sec 125",
    note: "Per Section 50",
  },
  {
    head: "3-YEAR TIME-BAR (effective FY 2026-27)",
    range: "Returns CANNOT be filed beyond 3 years from due date",
    note: "ITC permanently forfeited",
  },
];

const GstFilingGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative GST Late-Fees + Penalties
          <span className="opc-govtcosts-badge">Pass-Through at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per CGST Act Section 47 + Section 50 + Notification 75/2018-CT (as amended). We plan filings to ensure ZERO late fees - but here&apos;s the official schedule:
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Return / Default</th>
                <th>Late Fee</th>
                <th>Interest on Tax</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
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

export default GstFilingGovtCosts;
