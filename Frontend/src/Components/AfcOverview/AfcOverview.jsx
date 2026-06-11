import React from "react";
import "./AfcOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const AfcOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Company Annual Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Company Annual Filing Matters
            </h2>
            <p className="opc-intro-text">
              Every company registered in India — Private Limited, Public Limited, or One Person Company — must file its annual returns and financial statements with the Ministry of Corporate Affairs (MCA) under the Companies Act, 2013, irrespective of turnover or whether it did any business during the year. This includes AOC-4 (audited financials), MGT-7 / MGT-7A (annual return), ADT-1 (auditor appointment), and director-level compliances like DIR-3 KYC and DPT-3.
              <br /><br />
              The cost of ignoring it compounds daily. Late filing of AOC-4 or MGT-7 carries an additional fee of ₹100 per day, per form, with no upper limit. Worse, a company that fails to file for a continuous period risks its directors being disqualified for five years and its name being struck off the register. Timely annual compliance keeps the company active, the directors clean, and the business credible with banks, investors, and regulators.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Compliant vs Non-Compliant Company: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens when a company keeps up its annual filings versus when it lets them lapse:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Compliant Company</th>
                  <th>Non-Compliant Company</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Late Filing Fee</td><td>₹0 — filed before due date</td><td>₹100/day per form, no upper cap</td></tr>
                <tr><td>Company Status (MCA)</td><td>Active &amp; in good standing</td><td>Default → strike-off risk</td></tr>
                <tr><td>Director Status</td><td>Eligible to act &amp; incorporate</td><td>Disqualified up to 5 years</td></tr>
                <tr><td>Bank Loans &amp; Funding</td><td>Filings support due diligence</td><td>Rejected — records not up to date</td></tr>
                <tr><td>Tenders &amp; Contracts</td><td>Eligible with clean MCA record</td><td>Disqualified at compliance check</td></tr>
                <tr><td>Investor / Buyer Confidence</td><td>Clean, auditable history</td><td>Red flag in any due diligence</td></tr>
                <tr><td>Annual Cost</td><td>₹2,000 – ₹5,000 govt fee</td><td>Penalties + revival cost + lost deals</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AfcOverview;
