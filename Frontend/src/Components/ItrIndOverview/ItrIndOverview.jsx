import React from "react";
import "./ItrIndOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

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
              Why Choose Professional Personal ITR Filing
            </h2>
            <p className="opc-intro-text">
              An Income Tax Return is your annual declaration of income, deductions, and taxes paid to the government. For individuals, the right form depends on your income mix — ITR-1 (Sahaj) for salary and one house property, ITR-2 for capital gains and foreign assets, ITR-3 for business/professional income, and ITR-4 (Sugam) for presumptive income. On top of the form, you must choose between the old and new tax regimes — a choice that can change your tax by tens of thousands of rupees.
              <br /><br />
              Filing on time is what unlocks the upside. It gets your TDS refund credited faster, preserves your ability to carry forward capital losses, and builds the income record banks rely on for loans and visas. Professional filing means the correct form, the better regime, every eligible deduction claimed, and a clean reconciliation with your Form 16, 26AS, and AIS — so your return sails through without notices and your refund lands sooner.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Professional Filing vs DIY / Late Filing: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when your return is filed accurately and on time versus left to chance:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Professional Filing</th>
                  <th>DIY / Late Filing</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Tax Regime</td><td>Old vs new compared — lower tax chosen</td><td>Default regime applied — often higher tax</td></tr>
                <tr><td>ITR Form Selection</td><td>Correct form for your income mix</td><td>Wrong form → defective return u/s 139(9)</td></tr>
                <tr><td>Late Fee (Sec 234F)</td><td>₹0 — filed before due date</td><td>₹1,000 – ₹5,000</td></tr>
                <tr><td>Deductions Claimed</td><td>Maximised — 80C, 80D, HRA, home loan</td><td>Missed / under-claimed deductions</td></tr>
                <tr><td>TDS Refund</td><td>Fully claimed, faster credit</td><td>Delayed or unclaimed refund</td></tr>
                <tr><td>AIS / 26AS Match</td><td>Reconciled before filing</td><td>Mismatch → notices &amp; queries</td></tr>
                <tr><td>Loss Carry-Forward</td><td>Preserved (filed on time)</td><td>Lost if return is belated</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ItrIndOverview;
