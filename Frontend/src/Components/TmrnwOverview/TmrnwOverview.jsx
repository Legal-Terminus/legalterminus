import React from "react";
import "./TmrnwOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const TmrnwOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Trademark Renewal illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Trademark Renewal Matters
            </h2>
            <p className="opc-intro-text">
              A registered trademark in India is protected for 10 years from the date of application, after which it must be renewed under Section 25 of the Trade Marks Act, 1999 to keep it alive. Renewal is done by filing Form TM-R, and it can be filed up to one year before the expiry date. Each renewal extends protection by a further 10 years — and a trademark can be renewed indefinitely, making it one of the few business assets that can last forever.
              <br /><br />
              The catch is that protection is not automatic. If you miss the deadline, your mark enters a 6-month grace period (renewable with a surcharge), and beyond that it can be removed from the register — wiping out the exclusive rights and goodwill you spent years building. A removed mark can sometimes be restored within a year, but it is costly, discretionary, and leaves your brand exposed to copycats in the meantime. Timely renewal is simply the cheapest, safest way to keep your brand legally yours.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Renewed vs Lapsed Trademark: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when you renew your trademark on time versus letting it expire:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Renewed On Time</th>
                  <th>Lapsed / Removed Mark</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Brand Protection</td><td>Continuous, uninterrupted</td><td>Lost from the expiry date</td></tr>
                <tr><td>Right to ® Symbol</td><td>Retained</td><td>Forfeited until restored</td></tr>
                <tr><td>Exclusive Rights</td><td>Fully enforceable</td><td>Open to copycats &amp; squatters</td></tr>
                <tr><td>Cost</td><td>Renewal fee only</td><td>Surcharge + restoration fee</td></tr>
                <tr><td>Certainty</td><td>Guaranteed on filing</td><td>Restoration is discretionary</td></tr>
                <tr><td>Infringement Suit</td><td>Available</td><td>Weakened — no live registration</td></tr>
                <tr><td>Brand Value</td><td>Preserved &amp; growing</td><td>Eroded; goodwill at risk</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default TmrnwOverview;
