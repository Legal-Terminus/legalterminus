import React from "react";
import "./TmoppGovtCosts.css";

const rows = [
  {
    head: "Notice of Opposition (Form TM-O)",
    range: "₹2,700 / class",
    note: "Government fee to file an opposition against a published mark, per class",
  },
  {
    head: "Counter-Statement (Form TM-O)",
    range: "₹0 govt fee",
    note: "Filing the counter-statement to defend the application carries no separate fee",
  },
  {
    head: "Opposition Window",
    range: "4 months",
    note: "Time from journal publication within which any party may file an opposition",
  },
  {
    head: "Counter-Statement Deadline",
    range: "2 months",
    note: "Applicant must file the counter-statement within 2 months of receiving the opposition",
  },
  {
    head: "Evidence Stages (Rule 45 / 46 / 47)",
    range: "2 months each",
    note: "Opponent's evidence, applicant's evidence, and evidence in reply, by affidavit",
  },
  {
    head: "Total Out-of-Pocket (file opposition, 1 class)",
    range: "₹2,700 govt fee",
    note: "Govt. fee billed at actuals; defending an opposition carries no government fee",
    isTotal: true,
  },
];

const TmoppGovtCosts = () => {
  return (
    <section className="opc-govtcosts-section">
      <div className="opc-govtcosts-container">
        <h2 className="opc-govtcosts-title">
          Government Fees &amp; Key Timelines
          <span className="opc-govtcosts-badge">Billed at Actuals</span>
        </h2>
        <p className="opc-govtcosts-subtitle">
          Filing an opposition carries a government fee of ₹2,700 per class, while defending one carries none — the value is in the legal argument and evidence. The proceeding runs on strict statutory deadlines. Our professional fee covers drafting, evidence, and representation; government fees are billed at actuals.
        </p>

        <div className="opc-govtcosts-table-wrapper">
          <table className="opc-govtcosts-table">
            <thead>
              <tr>
                <th>Cost / Timeline Head</th>
                <th>Typical Value</th>
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

export default TmoppGovtCosts;
