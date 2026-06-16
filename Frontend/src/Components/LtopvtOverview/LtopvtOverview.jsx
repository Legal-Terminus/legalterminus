import React from "react";
import "./LtopvtOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const LtopvtOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="LLP to Private Limited Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert an LLP into a Private Limited Company
            </h2>
            <p className="opc-intro-text">
              An LLP is a great structure for a stable, profitable business — but it hits a wall the moment you want to raise outside capital. An LLP has no share capital, so it cannot issue equity shares to investors, cannot grant ESOPs to employees, and is generally avoided by angel investors and venture capital funds. A Private Limited Company is the opposite — built around share capital, it is the structure investors expect, the one that supports priced equity rounds, convertible notes, ESOP pools, and clean exits. When your LLP is ready to scale and fundraise, converting to a Pvt Ltd unlocks that path.
              <br /><br />
              The conversion is done through the statutory route under Section 366 of the Companies Act, 2013, using Form URC-1 with SPICe+. All partners of the LLP become shareholders of the new company, the partners' contribution is mapped into share capital, and the business continues seamlessly. The process requires a No-Objection Certificate from the LLP's Registrar, a URC-2 newspaper notice inviting objections, a CA-certified statement of accounts, creditor consent, and the latest LLP agreement. Once registered under Section 367, the LLP is dissolved and the company carries on the same business — now investor-ready.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">LLP vs Private Limited Company: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes for your business when it moves from an LLP to a Private Limited Company:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Private Limited Company</th>
                  <th>Limited Liability Partnership</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Equity Funding</td><td>Can raise from angels &amp; VCs</td><td>No share capital — very difficult</td></tr>
                <tr><td>ESOPs</td><td>Can issue ESOPs to employees</td><td>Not possible</td></tr>
                <tr><td>Investor Preference</td><td>The standard, fundable structure</td><td>Generally avoided by investors</td></tr>
                <tr><td>Ownership Units</td><td>Shares — easy to transfer &amp; price</td><td>Capital contribution — illiquid</td></tr>
                <tr><td>Compliance</td><td>AOC-4, MGT-7, board meetings, audit</td><td>Form 8 &amp; Form 11; audit above threshold</td></tr>
                <tr><td>Audit</td><td>Mandatory every year</td><td>Only above turnover/contribution limits</td></tr>
                <tr><td>Liability</td><td>Limited to shareholding</td><td>Limited to contribution</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LtopvtOverview;
