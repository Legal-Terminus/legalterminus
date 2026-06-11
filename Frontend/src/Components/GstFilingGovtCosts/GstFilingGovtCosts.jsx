import React from "react";
import "./GstFilingGovtCosts.css";

const rows = [
  {
    head: "Late Fee — GSTR-3B / GSTR-1 (with tax)",
    range: "₹50 / day",
    note: "₹25 CGST + ₹25 SGST per day of delay; capped per return as per turnover slab",
  },
  {
    head: "Late Fee — Nil Return",
    range: "₹20 / day",
    note: "₹10 CGST + ₹10 SGST per day where there is no outward supply / tax liability",
  },
  {
    head: "Interest on Late Tax Payment",
    range: "18% p.a.",
    note: "Charged on the net tax liability paid in cash, from the due date until actual payment",
  },
  {
    head: "Late Fee — Annual Return (GSTR-9)",
    range: "₹100 – ₹200 / day",
    note: "₹50–₹100 each under CGST & SGST per day; capped at a % of state turnover by slab",
  },
  {
    head: "Maximum Late Fee Cap (per return)",
    range: "₹500 – ₹10,000",
    note: "Depends on annual aggregate turnover slab as notified by CBIC",
  },
  {
    head: "Total Out-of-Pocket (typical, on-time filing)",
    range: "₹0 govt fee",
    note: "GST returns themselves carry no government filing fee — only late fees / interest if delayed",
    isTotal: true,
  },
];

const GstFilingGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government Late Fees &amp; Interest
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Filing a GST return carries no government fee when done on time. Late fees and 18% interest apply only on delayed filing or tax payment, and are charged over and above our professional fee — billed at actuals per CBIC notifications.
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

export default GstFilingGovtCosts;
