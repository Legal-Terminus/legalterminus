import React from "react";
import "../PvtltdCompanyTab/PvtltdCompanyTab.css";
import "../IECGovtCosts/IECGovtCosts.css";
import pvtIllustration from "../../assets/whypvt-imp1.svg";

const eligibilityRows = [
  {
    parameter: "Entity Types Eligible",
    criterion: "Pvt Ltd / LLP / Registered Partnership Firm",
    notes: "Sole proprietorships and OPCs are NOT eligible for Startup Odisha recognition",
  },
  {
    parameter: "Odisha Presence",
    criterion: "Registered in Odisha OR operating in Odisha",
    notes: "Verified via address / bank / team / customers",
  },
  {
    parameter: "Age Cap",
    criterion: "Up to 5 years from incorporation",
    notes: "Half the Startup India limit",
  },
  {
    parameter: "Turnover Cap",
    criterion: "Up to Rs.25 crores in any FY",
    notes: "1/8th of the Startup India limit",
  },
  {
    parameter: "Innovation Test",
    criterion: "Innovation / scalability / employment-creation",
    notes: "Subjective; Startup Cell screens",
  },
  {
    parameter: "Government Fee",
    criterion: "Rs.0 (NIL)",
    notes: "Filing at startupodisha.gov.in is free",
  },
  {
    parameter: "Recognition Timeline",
    criterion: "7-15 working days (typical)",
    notes: "Subject to Startup Cell review",
  },
  {
    parameter: "Recognition Validity",
    criterion: "Co-terminus with eligibility",
    notes: "Auto-lapses if you cross 5 yrs / Rs.25 cr (Odisha limits)",
  },
  {
    parameter: "Central DPIIT Required?",
    criterion: "No - independent",
    notes: "Many startups hold BOTH state + central",
  },
  {
    parameter: "Benefits Auto-Activated?",
    criterion: "NO - apply separately",
    notes: "Each benefit has its own application process",
  },
];

const StartupOdishaOverview = () => {
  return (
    <div className="pvt-full-wrapper">

      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          <div className="pvt-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Startup Odisha Registration illustration"
              className="pvt-intro-illustration"
            />
          </div>

          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">
              Why Get Startup Odisha Recognition
            </h2>
            <p className="pvt-intro-text">
              Startup Odisha is the state-level startup recognition issued by the Government of Odisha under the Odisha Startup Policy. It identifies your startup as part of Odisha's official innovation ecosystem and gets you onto the curated startupodisha.gov.in directory. The Recognition Certificate itself is the key entry point - everything else (grants, marketing assistance, patent reimbursement, power tariff subsidy, GST reimbursement, incubation matchmaking, state tender preferences) flows from the recognition but is applied for SEPARATELY through individual benefit application processes.
            </p>
            <p className="pvt-intro-text" style={{ marginTop: "20px" }}>
              Even purely as a recognition (without claiming any downstream benefits), Startup Odisha matters for credibility with state-level investors, Odisha government tenders, the state's startup ecosystem events (Startup Odisha Conclave, sectoral demo days), and for founders building India-focused businesses where being on the state's official curated list signals seriousness. The govt fee is zero - the only investment is the time and effort to put together a credible application.
            </p>
          </div>
        </div>
      </section>

      <section className="iec-govtcosts-section">
        <div className="iec-govtcosts-container">
          <h2 className="iec-govtcosts-title">
            Eligibility &amp; Recognition Scope: The Deep Dive
          </h2>
          <p className="iec-govtcosts-subtitle">
            Here's the 2026 picture of who qualifies and what the Recognition Certificate actually says:
          </p>

          <div className="iec-govtcosts-table-wrapper">
            <table className="iec-govtcosts-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Criterion / Detail</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {eligibilityRows.map((row, i) => (
                  <tr key={i}>
                    <td>{row.parameter}</td>
                    <td className="iec-govtcosts-range">{row.criterion}</td>
                    <td>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default StartupOdishaOverview;
