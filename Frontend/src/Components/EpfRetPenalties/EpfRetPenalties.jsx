import React from "react";
import "./EpfRetPenalties.css";

// Statutory schedule under Sec 7Q (interest) + Sec 14B (damages).
// We file on time, so these are pass-through-at-actuals reference only.
const rows = [
  {
    delay: "Late PF Payment — Any delay",
    charge: "12% per annum INTEREST (calculated from the 16th day to date of payment)",
    authority: "Section 7Q, EPF Act",
  },
  {
    delay: "Default — Delay less than 2 months",
    charge: "Damages @ 5% per annum",
    authority: "Section 14B, EPF Act",
  },
  {
    delay: "Default — Delay 2 to 4 months",
    charge: "Damages @ 10% per annum",
    authority: "Section 14B, EPF Act",
  },
  {
    delay: "Default — Delay 4 to 6 months",
    charge: "Damages @ 15% per annum",
    authority: "Section 14B, EPF Act",
  },
  {
    delay: "Default — Delay more than 6 months",
    charge: "Damages @ 25% per annum",
    authority: "Section 14B, EPF Act",
  },
  {
    delay: "Our promise: We file by the 15th, every month",
    charge: "ZERO interest + ZERO damages",
    authority: "Late-fee Zero policy",
    isPromise: true,
  },
];

const EpfRetPenalties = () => {
  return (
    <section className="opc-govtcosts-section epfret-penalties">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Statutory EPF Penalties + Interest (Pass-Through at Actuals)
        </h2>
        <p className="opc-govtcosts-subtitle epfret-penalties-note">
          Per Section 7Q + Section 14B of the EPF &amp; MP Act, 1952. We file on time — so
          these are ZERO. But here&apos;s the official schedule (the cost of slipping):
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Default / Delay</th>
                <th>Statutory Charge</th>
                <th>Authority</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={row.isPromise ? "opc-govtcosts-total-row" : ""}>
                  <td>{row.delay}</td>
                  <td className="epfret-penalties-charge">{row.charge}</td>
                  <td>{row.authority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default EpfRetPenalties;
