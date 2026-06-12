import React from "react";
import "./DpvtOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const DpvtOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Dissolve Private Limited Company illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Formally Close an Inactive Company
            </h2>
            <p className="opc-intro-text">
              When a private limited company stops doing business, its legal obligations do not stop with it. Under the Companies Act, 2013, the company must keep filing its annual returns (MGT-7) and financial statements (AOC-4), hold board meetings, and complete director KYC every year — whether or not it earns a single rupee. The clean way out is a voluntary strike-off under Section 248(2): the company applies in Form STK-2 to have its name removed from the Register of Companies, and once the ROC strikes it off, it ceases to exist.
              <br /><br />
              Simply abandoning a company is a costly mistake. Each unfiled AOC-4 and MGT-7 attracts a ₹100-per-day penalty with no cap, and continuous non-filing can disqualify the directors for five years and bar them from other companies. A formal closure stops the penalties permanently, frees the directors, and gives you a clean compliance record. For a company that never traded or has been dormant for years, strike-off is far cheaper and faster than letting the defaults accumulate.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Strike-Off vs Leaving It Inactive: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens when you formally close an unused company versus simply walking away:
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
                <tr><td>Annual Filing Duty</td><td>Ends permanently</td><td>Continues every year</td></tr>
                <tr><td>Penalties</td><td>Stopped for good</td><td>₹100/day per form, no cap</td></tr>
                <tr><td>Director Status</td><td>Clean &amp; free to act</td><td>Disqualification up to 5 years</td></tr>
                <tr><td>Company Existence</td><td>Legally dissolved</td><td>Exists with growing defaults</td></tr>
                <tr><td>Future Incorporations</td><td>Unaffected</td><td>Blocked by disqualified DIN</td></tr>
                <tr><td>Peace of Mind</td><td>Clean closure on record</td><td>Open-ended liability</td></tr>
                <tr><td>Cost</td><td>One-time fee &amp; filing</td><td>Compounding penalties</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default DpvtOverview;
