import React from "react";
import "./LtopvtGovtCosts.css";

const rows = [
  {
    head: "MCA Filing Fee — SPICe+ + URC-1",
    range: "₹0 – ₹610",
    note: "₹0 for authorised capital up to ₹15 lakh; URC-1 filing fee separate",
  },
  {
    head: "SPICe+ Part A (Name Reservation)",
    range: "₹1,000",
    note: "Per attempt; up to 4 names per attempt",
  },
  {
    head: "URC-2 Newspaper Advertisement",
    range: "₹4,500 – ₹18,000",
    note: "English + vernacular newspaper; rates vary by State + circulation",
  },
  {
    head: "Stamp Duty — MOA + AOA",
    range: "₹500 – ₹12,600",
    note: "State-based; Maharashtra / Delhi low, Punjab / Kerala high",
  },
  {
    head: "Stamp Duty — Asset Transfer Agreement",
    range: "₹500 – ₹3,000+",
    note: "Required under Supreme / Supreme Plus only; State-based",
  },
  {
    head: "Class 3 DSC (2-year) — partners without DSC",
    range: "₹1,999 / person",
    note: "Existing designated partners may already have DPIN-linked DSC",
  },
  {
    head: "PAN + TAN",
    range: "₹0",
    note: "Issued free with COI",
  },
  {
    head: "GST Cancellation + Re-Registration",
    range: "₹0",
    note: "Free; only our consultancy charges",
  },
  {
    head: "INC-20A (Commencement)",
    range: "₹200 – ₹400",
    note: "Filed within 180 days of incorporation",
  },
  {
    head: "Affidavit + Notarisation (URC-1)",
    range: "₹500 – ₹1,500",
    note: "Multiple affidavits required (1 per partner)",
  },
];

const LtopvtGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per current MCA SPICe+ tariff + Section 366 conversion rules + LLP strike-off fees + State Stamp Duty schedules. These charges are over and above our professional fee — billed at actuals.
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

export default LtopvtGovtCosts;
