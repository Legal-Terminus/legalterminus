import React from "react";
import "./EsiRetGovtCosts.css";

const rows = [
  {
    delay: "Late ESI Payment — Any delay",
    charge: "12% per annum SIMPLE INTEREST (calculated from the 16th day to date of payment)",
    authority: "Section 39(5)(a) ESI Act",
  },
  {
    delay: "Default — Delay less than 2 months",
    charge: "Damages @ 5% per annum",
    authority: "Section 85B ESI Act",
  },
  {
    delay: "Default — Delay 2 to 4 months",
    charge: "Damages @ 10% per annum",
    authority: "Section 85B ESI Act",
  },
  {
    delay: "Default — Delay 4 to 6 months",
    charge: "Damages @ 15% per annum",
    authority: "Section 85B ESI Act",
  },
  {
    delay: "Default — Delay more than 6 months",
    charge: "Damages @ 25% per annum",
    authority: "Section 85B ESI Act",
  },
  {
    delay: "Wilful default / fraud",
    charge: "Imprisonment up to 3 years + fine up to ₹10,000",
    authority: "Section 85 ESI Act",
  },
  {
    delay: "Our promise: We file by 15th, every month",
    charge: "ZERO interest + ZERO damages",
    authority: "Late-fee Zero policy",
    isPromise: true,
  },
];

const EsiRetGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">

        <div className="esiret-enterprise-callout">
          <h3 className="esiret-enterprise-title">★&nbsp;&nbsp;ESTABLISHMENT WITH MORE THAN 50 EMPLOYEES?&nbsp;&nbsp;★</h3>
          <p className="esiret-enterprise-text">
            Please reach out to us for a CUSTOM ENTERPRISE PLAN tailored to your employee count, multi-branch presence, and compliance complexity. Drop us a note + we'll structure a fit-for-purpose monthly engagement.
          </p>
        </div>

        <h2 className="opc-govtcosts-title">
          Statutory ESI Penalties + Interest
          <span className="opc-govtcosts-badge">Pass-Through at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per Section 39(5)(a) + Section 85B of the ESI Act, 1948. We file on time — so these are ZERO. But here's the official schedule (the cost of slipping):
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
                  <td className="opc-govtcosts-range">{row.charge}</td>
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

export default EsiRetGovtCosts;
