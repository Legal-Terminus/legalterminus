import React from "react";
import "./TmoppGovtCosts.css";

const rows = [
  {
    action: "Form TM-O — Notice of Opposition (Scenario A)",
    fee: "₹2,700 per class (e-filing)",
    note: "Filed by OPPOSER within 4 months of Journal publication",
  },
  {
    action: "Form TM-O — Counter Statement (Scenario B)",
    fee: "NIL — No Govt Fee",
    note: "Filed by APPLICANT within 2 months of opposition notice received",
  },
  {
    action: "Rule 45 Evidence (Opposer's evidence)",
    fee: "NIL — No Govt Fee",
    note: "Affidavit filed within 2 months of counter statement",
  },
  {
    action: "Rule 46 Evidence (Applicant's evidence)",
    fee: "NIL — No Govt Fee",
    note: "Affidavit filed within 2 months of opposer's evidence",
  },
  {
    action: "Rule 47 Reply Evidence (Opposer's reply)",
    fee: "NIL — No Govt Fee",
    note: "Within 1 month + 1 month extension",
  },
  {
    action: "Rule 50 Hearing attendance",
    fee: "NIL — No Govt Fee",
    note: "Online video conference",
  },
  {
    action: "Form TM-M — Adjournment / Extension",
    fee: "₹900 per request",
    note: "Max 2 adjournments per matter, 30 days each",
  },
];

const TmoppGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">

        <div className="tmopp-status-callout">
          <h3 className="tmopp-status-title">*&nbsp;&nbsp;STATUS UPDATE COMMITMENT&nbsp;&nbsp;*</h3>
          <p className="tmopp-status-text">
            Opposition matters run 2-5 YEARS through multiple evidence + hearing stages. You won't lose track. ONCE A MONTH — calendared, guaranteed — you receive an email status update on your matter. AND for ANY CHANGE (Counter Statement Received / Evidence Filed / Hearing Scheduled / Order Passed / etc.), you're notified WITHIN 1-2 DAYS. Active across ALL three plan tiers from engagement through final Registrar's order.
          </p>
        </div>

        <h2 className="opc-govtcosts-title">
          Indicative Government Fees — Opposition
          <span className="opc-govtcosts-badge">At Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per First Schedule of the Trade Marks Rules, 2017 + verified IP India portal fees:
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

export default TmoppGovtCosts;
