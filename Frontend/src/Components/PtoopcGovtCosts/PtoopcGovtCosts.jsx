import React from "react";
import "./PtoopcGovtCosts.css";

const rows = [
  {
    head: "DSC for the Proprietor",
    range: "₹1,000 – ₹2,000",
    note: "Digital Signature Certificate required to e-sign the incorporation forms",
  },
  {
    head: "Name Reservation (SPICe+ Part A)",
    range: "₹0 – ₹1,000",
    note: "MCA fee to reserve the OPC's proposed name; nil within the SPICe+ flow in many cases",
  },
  {
    head: "MCA Incorporation Fee (SPICe+)",
    range: "Slab-based",
    note: "Government fee on incorporation, based on authorised capital; often nil for small capital",
  },
  {
    head: "Stamp Duty on MOA / AOA",
    range: "₹500 – ₹3,000",
    note: "State-specific stamp duty on the incorporation documents",
  },
  {
    head: "Takeover Agreement Stamp Duty",
    range: "₹500 – ₹5,000+",
    note: "On the proprietorship-to-OPC transfer agreement; varies with assets & state",
  },
  {
    head: "Total Out-of-Pocket (typical)",
    range: "₹2,000 – ₹10,000",
    note: "Govt. fees & stamp duty billed at actuals; varies by capital, state & assets",
    isTotal: true,
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
          The MCA incorporation fees, DSC cost, and stamp duty on the MOA/AOA and takeover agreement are charged over and above our professional fee. The total depends on the authorised capital, the state, and the value of assets transferred — billed at actuals per the official MCA schedule.
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
