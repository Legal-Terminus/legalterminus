import React from "react";
import "./TmhearGovtCosts.css";

const rows = [
  {
    action: "Show Cause Hearing attendance (Rule 33)",
    fee: "NIL — No Govt Fee",
    note: "Post Examination Report reply hearings",
  },
  {
    action: "Opposition Final Hearing (Rule 50)",
    fee: "NIL — No Govt Fee",
    note: "Final hearing in opposition proceedings",
  },
  {
    action: "Rectification Hearing (Section 47 / 57)",
    fee: "NIL — No Govt Fee",
    note: "Rectification / cancellation hearings",
  },
  {
    action: "Renewal / Restoration Hearing (Section 25)",
    fee: "NIL — No Govt Fee",
    note: "Where Registrar requires hearing",
  },
  {
    action: "Form TM-M — Adjournment of Hearing",
    fee: "₹900 per adjournment",
    note: "Max 2 adjournments per matter, 30 days each",
  },
  {
    action: "Form TM-M — Extension of Time",
    fee: "₹900 per request",
    note: "Used sparingly",
  },
  {
    action: "Form TM-48 — Power of Attorney (if new)",
    fee: "NIL — No Govt Fee",
    note: "₹100 stamp paper cost only",
  },
];

const TmhearGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">

        <div className="tmhear-status-callout">
          <h3 className="tmhear-status-title">*&nbsp;&nbsp;STATUS UPDATE COMMITMENT&nbsp;&nbsp;*</h3>
          <p className="tmhear-status-text">
            From engagement to Registrar's order, you stay in the loop. ONCE A MONTH — calendared, guaranteed — you receive an email status update on your hearing matter. AND for ANY CHANGE (Hearing Re-Scheduled / Adjournment Granted / Final Order Passed / etc.), you're notified WITHIN 1-2 DAYS. Active across ALL three plan tiers.
          </p>
        </div>

        <h2 className="opc-govtcosts-title">
          Indicative Government Fees — Hearing-Related
          <span className="opc-govtcosts-badge">At Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per Trade Marks Rules, 2017. GOOD NEWS: Hearing attendance itself attracts NO GOVERNMENT FEE across ALL hearing types — Show Cause, Opposition, Rectification, or Renewal. The only Govt fee touchpoint is Form TM-M (₹900) for adjournment / extension — pass-through only if needed.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Government Fee</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.action}</td>
                  <td className="opc-govtcosts-range">{row.fee}</td>
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

export default TmhearGovtCosts;
