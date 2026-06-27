import React from "react";
import "./ItrIndOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const planMatrix = [
  { profile: "Salaried, income up to Rs.5L (TDS refund claim)", plan: "Elemental Rs.799", form: "ITR-1" },
  { profile: "Salaried, income up to Rs.10L (NIL tax under New Regime)", plan: "Enriched Rs.1,499", form: "ITR-1" },
  { profile: "Salaried, income > Rs.10L (high-bracket)", plan: "Supreme Rs.1,999", form: "ITR-1 (or ITR-2 above Rs.50L)" },
  { profile: "Stock trading + capital gains (equity / MF / property)", plan: "Elemental+ Rs.4,499", form: "ITR-2" },
  { profile: "Resident with foreign dividend / interest / royalty / Schedule FA", plan: "Enriched+ Rs.5,999", form: "ITR-2" },
  { profile: "NRI / RNOR with India-source income + DTAA application", plan: "Supreme+ Rs.7,999", form: "ITR-2" },
];

const ItrIndOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Individual Income Tax Return Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Individual ITR Filing Matters
            </h2>
            <p className="opc-intro-text">
              Filing an Income Tax Return (ITR) is not just about paying taxes—it is an important legal and financial compliance requirement. Under Section 139 of the Income Tax Act, 1961, individuals meeting the prescribed conditions are required to file an ITR. Even if your income is below the taxable limit, filing may still be mandatory in certain cases, such as TDS deductions, high-value transactions, foreign assets, or multiple sources of income.
              <br /><br />
              With the introduction of the New Tax Regime, choosing the right tax regime and filing the correct ITR form has become more important than ever. At Legal Terminus, we help individuals select the appropriate tax regime, accurately report income from all sources, reconcile Form 26AS, AIS, and TIS, and file error-free ITRs to avoid notices, penalties, and delays in refunds.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Plan-to-Profile Matching Matrix</h2>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Your Profile</th>
                  <th>Suggested Plan</th>
                  <th>ITR Form</th>
                </tr>
              </thead>
              <tbody>
                {planMatrix.map((row, i) => (
                  <tr key={i}>
                    <td>{row.profile}</td>
                    <td>{row.plan}</td>
                    <td>{row.form}</td>
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

export default ItrIndOverview;
