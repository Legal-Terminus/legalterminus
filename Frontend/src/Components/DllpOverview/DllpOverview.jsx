import React from "react";
import "./DllpOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const DllpOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Dissolve LLP illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Formally Close an Inactive LLP
            </h2>
            <p className="opc-intro-text">
              When a Limited Liability Partnership stops doing business, its compliance obligations carry on. Under the LLP Act, 2008, every LLP must file its annual return (Form 11) by 30 May and its Statement of Account &amp; Solvency (Form 8) by 30 October each year — and complete designated-partner KYC — whether or not it earns a rupee. The clean way out is a strike-off: the LLP files Form 24 under Rule 37 of the LLP Rules, 2009 to have its name removed from the Register, and once the ROC strikes it off, the LLP ceases to exist.
              <br /><br />
              Simply abandoning an LLP is a uniquely expensive mistake. The late fee for Form 8 and Form 11 is ₹100 per day, per form — and for LLPs it has no upper cap — so a dormant LLP can silently pile up liabilities running into lakhs over a few years. Continuous default also exposes the designated partners to penalties and disqualification. A formal strike-off stops the penalties permanently, frees the partners, and gives you a clean compliance record for a fraction of what the defaults would cost.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Strike-Off vs Leaving It Inactive: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens when you formally close an unused LLP versus simply walking away:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Formally Struck Off</th>
                  <th>Left Inactive / Abandoned</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Annual Filing Duty</td><td>Ends permanently</td><td>Form 8 &amp; Form 11 every year</td></tr>
                <tr><td>Late Fee</td><td>Stopped for good</td><td>₹100/day per form, no cap</td></tr>
                <tr><td>Designated Partner Status</td><td>Clean &amp; free to act</td><td>Penalties &amp; disqualification risk</td></tr>
                <tr><td>LLP Existence</td><td>Legally dissolved</td><td>Exists with growing defaults</td></tr>
                <tr><td>Limited Liability Shield</td><td>Closed cleanly on record</td><td>Eroded by ongoing default</td></tr>
                <tr><td>Peace of Mind</td><td>Definitive closure</td><td>Open-ended liability</td></tr>
                <tr><td>Cost</td><td>One-time fee &amp; filing</td><td>Uncapped compounding penalties</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default DllpOverview;
