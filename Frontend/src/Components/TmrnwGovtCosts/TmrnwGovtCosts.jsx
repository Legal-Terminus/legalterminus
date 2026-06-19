import React from "react";
import "./TmrnwGovtCosts.css";

const rows = [
  {
    scenario: "ON-TIME Renewal (1 year before expiry through expiry date)",
    fee: "₹9,000 per class - UNIFORM",
    ref: "Section 25(3) + Rule 57",
  },
  {
    scenario: "LATE RENEWAL with Surcharge (within 6 months post-expiry)",
    fee: "₹13,500 per class (₹9,000 + ₹4,500 surcharge)",
    ref: "Section 25(4) proviso",
  },
  {
    scenario: "RESTORATION (6–12 months post-expiry, Form TM-R + Form TM-18)",
    fee: "₹18,000 per class (combined)",
    ref: "Section 25(5) + Rule 60",
  },
  {
    scenario: "Beyond 12 months post-expiry",
    fee: "Mark REMOVED; fresh registration required (Form TM-A)",
    ref: "Rule 58",
  },
  {
    scenario: "MSME / Startup / Individual at renewal stage",
    fee: "Same ₹9,000 per class - NO REBATE at renewal",
    ref: "First Schedule, Trade Marks Rules 2017",
  },
  {
    scenario: "Multi-class portfolios",
    fee: "MULTIPLICATIVE - ₹9,000 per class per renewal",
    ref: "Section 18(2)",
  },
];

const TmrnwGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">

        <div className="tmrnw-reminder-callout">
          <h3 className="tmrnw-reminder-title">★&nbsp;&nbsp;OUR LIFELONG REMINDER POLICY&nbsp;&nbsp;★</h3>
          <p className="tmrnw-reminder-text">
            We remind you for renewal after 10 years - AND we keep reminding YEAR AFTER YEAR, 10-YEAR CYCLE AFTER 10-YEAR CYCLE - until either (a) your business exits / shuts down, OR (b) you explicitly ask us to stop the reminders. Your brand is too valuable to lose to a calendar oversight. Binding commitment, included in EVERY plan tier.
          </p>
        </div>

        <h2 className="opc-govtcosts-title">
          Indicative Government Fees — Trademark Renewal
          <span className="opc-govtcosts-badge">Per Class — At Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Per First Schedule of the Trade Marks Rules, 2017. E-filing only (physical filing is essentially obsolete). IMPORTANT: The 50% rebate (₹4,500 vs ₹9,000) that helped Individual / DPIIT Startup / Udyam MSME applicants at the INITIAL FILING stage (Form TM-A) does NOT extend to renewal. Renewal fee under Form TM-R is UNIFORM ₹9,000 per class for all applicants. This is by design per the 2017 Rules — the discounted track was limited to filing + expedited examination only.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Scenario (Form TM-R - All Applicants)</th>
                <th>Government Fee per Class (E-Filing)</th>
                <th>Statutory Reference</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.scenario}</td>
                  <td className="opc-govtcosts-range">{row.fee}</td>
                  <td>{row.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TmrnwGovtCosts;
