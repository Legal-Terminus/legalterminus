import React from "react";
import "./PtoopcGovtCosts.css";

const rows = [
  {
    head: "MCA Filing Fee - SPICe+ + URC-1",
    range: "Rs.0 - Rs.610",
    note: "Rs.0 for authorised capital up to Rs.15 lakh; URC-1 filing fee separate",
  },
  {
    head: "SPICe+ Part A (Name Reservation)",
    range: "Rs.1,000",
    note: "Per attempt; up to 4 names per attempt",
  },
  {
    head: "URC-2 Newspaper Advertisement",
    range: "Rs.4,500 - Rs.18,000",
    note: "English + vernacular newspaper; rates vary by State + circulation",
  },
  {
    head: "Stamp Duty - MOA + AOA",
    range: "Rs.500 - Rs.12,600",
    note: "State-based; Maharashtra / Delhi low, Punjab / Kerala high",
  },
  {
    head: "Stamp Duty - Asset Transfer Agreement",
    range: "Rs.500 - Rs.3,000+",
    note: "Required under Supreme / Supreme Plus only; State-based",
  },
  {
    head: "Class 3 DSC (2-year)",
    range: "Rs.1,999 / person",
    note: "Director + Nominee = 2 DSCs",
  },
  {
    head: "PAN + TAN",
    range: "Rs.0",
    note: "Issued free with COI",
  },
  {
    head: "GST Cancellation + Re-Registration",
    range: "Rs.0",
    note: "Free; only our consultancy charges",
  },
  {
    head: "INC-20A (Commencement)",
    range: "Rs.200 - Rs.400",
    note: "Filed within 180 days of incorporation",
  },
  {
    head: "Affidavit + Notarisation (URC-1)",
    range: "Rs.500 - Rs.1,500",
    note: "Multiple affidavits required",
  },
];

const PtoopcGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Indicative Government &amp; Out-of-Pocket Costs
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per current MCA SPICe+ tariff + Section 366 conversion rules + State Stamp Duty schedules:
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

export default PtoopcGovtCosts;
