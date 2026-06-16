import React from "react";
import "./PtopvtOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const PtopvtOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Proprietorship to Private Limited Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert a Proprietorship into a Private Limited Company
            </h2>
            <p className="opc-intro-text">
              A sole proprietorship is quick to start but quickly becomes a ceiling once a business grows. The proprietor and the business are legally the same person, so personal assets are exposed to every business debt; the business cannot issue shares to investors; and it cannot easily scale, hire on equity, or build institutional credibility. A Private Limited Company solves all of this — it is a separate legal entity with limited liability, can raise equity from angels and VCs, issue ESOPs to employees, and is the structure that banks, investors, and large customers take seriously.
              <br /><br />
              Because a proprietorship has no separate legal identity, the move is done through the statutory conversion route under Section 366 of the Companies Act, 2013 — filing Form URC-1 with the ROC, publishing a URC-2 public notice inviting objections, obtaining creditor consent and an audited statement of accounts, and incorporating the new Private Limited Company that takes over the business. Since a Pvt Ltd needs a minimum of two shareholders and two directors, you bring in at least one more member. The result: the same business you've built, now ring-fenced behind limited liability and ready to raise capital and scale.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Proprietorship vs Private Limited Company: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes for your business when it moves from a proprietorship to a Pvt Ltd:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Private Limited Company</th>
                  <th>Sole Proprietorship</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Legal Status</td><td>Separate legal entity</td><td>Same as the owner</td></tr>
                <tr><td>Liability</td><td>Limited to shareholding</td><td>Unlimited — personal assets at risk</td></tr>
                <tr><td>Owners Required</td><td>Min 2 (up to 200)</td><td>Single owner only</td></tr>
                <tr><td>Equity Funding</td><td>Can raise from angels &amp; VCs</td><td>Not possible</td></tr>
                <tr><td>ESOPs &amp; Talent</td><td>Can issue ESOPs</td><td>No equity to offer</td></tr>
                <tr><td>Continuity</td><td>Perpetual succession</td><td>Ends with the proprietor</td></tr>
                <tr><td>Credibility</td><td>High — corporate identity</td><td>Limited</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PtopvtOverview;
