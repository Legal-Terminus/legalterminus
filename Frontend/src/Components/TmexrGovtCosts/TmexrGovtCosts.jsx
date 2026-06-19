import React from "react";
import "./TmexrGovtCosts.css";

const rows = [
  {
    action: "Reply to Examination Report filing (Section 18)",
    fee: "NIL - No Govt Fee",
    note: "Reply filed under Misc head on IP India portal",
  },
  {
    action: "Show Cause Hearing attendance (Rule 33)",
    fee: "NIL - No Govt Fee",
    note: "Online hearing via video conference",
  },
  {
    action: "Form TM-M - Amendment to Application",
    fee: "₹900 per request",
    note: "Only if the reply requires amending the application",
  },
  {
    action: "Form TM-M - Extension of Reply Time",
    fee: "₹900 per request",
    note: "Up to 30 additional days beyond initial 30",
  },
  {
    action: "Form TM-M - Adjournment of Hearing",
    fee: "₹900 per request",
    note: "Max 2 adjournments per matter, 30 days each",
  },
  {
    action: "Form TM-48 - Power of Attorney",
    fee: "NIL - No Govt Fee",
    note: "₹100 stamp paper cost only (for Enriched / Supreme)",
  },
];

const TmexrGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">

        <div className="tmexr-status-callout">
          <h3 className="tmexr-status-title">★&nbsp;&nbsp;OUR STATUS UPDATE COMMITMENT&nbsp;&nbsp;★</h3>
          <p className="tmexr-status-text">
            From the moment we accept the engagement, we don't go silent. ONCE A MONTH - calendared, guaranteed - you receive an email status update on your application. AND for ANY CHANGE in your application status (Reply Accepted / Reply Objected / Hearing Scheduled / Journal Published / Order Issued), you're notified WITHIN 1-2 DAYS. Active across ALL three plan tiers. No ghosting - ever.
          </p>
        </div>

        <h2 className="opc-govtcosts-title">
          Indicative Government Fees — Reply / Hearing
          <span className="opc-govtcosts-badge">At Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per Trade Marks Rules, 2017. GOOD NEWS: The reply to the Examination Report itself attracts NO GOVERNMENT FEE. The Show Cause Hearing attendance also attracts NO GOVERNMENT FEE. The only Govt fee touchpoint is Form TM-M (₹900) — used for amendment to application / time extension / adjournment of hearing — and only if the case actually requires it.
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

export default TmexrGovtCosts;
