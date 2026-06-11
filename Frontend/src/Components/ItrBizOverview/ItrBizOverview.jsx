import React from "react";
import "./ItrBizOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const ItrBizOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Business Income Tax Return Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Choose Professional Business ITR Filing
            </h2>
            <p className="opc-intro-text">
              An income tax return for a business is far more than a personal ITR. It reports your business or professional income, claims depreciation and expenses, reconciles TDS credits from Form 26AS and AIS, and — depending on your entity — files a full Profit &amp; Loss and Balance Sheet. The correct form ranges from ITR-3 (proprietors with books) and ITR-4 (presumptive) to ITR-5 (firms &amp; LLPs) and ITR-6 (companies), each with its own schedules and disclosures.
              <br /><br />
              Getting it right protects real money. Filing on time preserves your right to carry forward business losses, avoids the Section 234F late fee and 234A/B/C interest, and keeps you off the scrutiny radar. Professional, CA-assisted filing means the right form, every eligible deduction, clean AIS reconciliation, and an early read on whether a tax audit under Section 44AB applies — turning a high-stakes compliance task into a handled, penalty-free routine.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Professional Filing vs DIY / Late Filing: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when your business return is filed accurately and on time versus left to chance:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Professionally Filed</th>
                  <th>DIY / Late Filing</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>ITR Form Selection</td><td>Correct form for your entity &amp; income</td><td>Wrong form → defective return u/s 139(9)</td></tr>
                <tr><td>Late Fee (Sec 234F)</td><td>₹0 — filed before due date</td><td>Up to ₹5,000</td></tr>
                <tr><td>Interest (234A/B/C)</td><td>Minimised with advance-tax planning</td><td>1% per month on shortfall</td></tr>
                <tr><td>Carry-Forward of Losses</td><td>Preserved (filed on time)</td><td>Lost if return is belated</td></tr>
                <tr><td>TDS Credit &amp; AIS</td><td>Fully reconciled &amp; claimed</td><td>Missed credits / AIS mismatch notices</td></tr>
                <tr><td>Tax Audit (44AB)</td><td>Applicability flagged early</td><td>Sec 271B penalty (0.5% of turnover)</td></tr>
                <tr><td>Deductions Claimed</td><td>Optimised — lowest lawful tax</td><td>Over/under-claimed; refund or demand risk</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ItrBizOverview;
