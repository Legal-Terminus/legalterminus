import React from "react";
import "./PvtllpOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const PvtllpOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Private Limited to LLP Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert a Private Limited Company into an LLP
            </h2>
            <p className="opc-intro-text">
              A Private Limited Company is the right vehicle when you are raising equity, issuing ESOPs, or courting investors — but for a profitable, owner-run business with no such plans, it can be heavier than it needs to be. A company must hold board meetings, file AOC-4 and MGT-7 every year, and get a statutory audit regardless of turnover. An LLP keeps the same limited-liability protection but strips most of that away: there is no mandatory audit until turnover crosses ₹40 lakh or contribution crosses ₹25 lakh, only Form 8 and Form 11 to file each year, and no dividend distribution tax when partners draw profits.
              <br /><br />
              The conversion is done through the statutory route under Section 56 and the Third Schedule of the LLP Act, 2008, using Form 18 with FiLLiP. All shareholders of the company — and no one else — become partners of the LLP, the shareholding is mapped into capital contribution, and the business continues seamlessly. The company must have no charge subsisting on its assets, all ROC and income-tax filings must be up to date, and the consent of shareholders and creditors is required. Once incorporated, Form 14 intimation is filed with the Registrar of Companies and the LLP agreement is filed in Form 3 — and the conversion is tax-neutral where the conditions of Section 47(xiiib) are met.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">LLP vs Private Limited Company: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes for your business when it moves from a Private Limited Company to an LLP:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Limited Liability Partnership</th>
                  <th>Private Limited Company</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Statutory Audit</td><td>Only above ₹40L turnover / ₹25L contribution</td><td>Mandatory every year</td></tr>
                <tr><td>Annual ROC Filings</td><td>Form 8 &amp; Form 11 only</td><td>AOC-4, MGT-7 + board meetings</td></tr>
                <tr><td>Compliance Cost</td><td>Low</td><td>Higher</td></tr>
                <tr><td>Profit Withdrawal</td><td>No DDT; share exempt u/s 10(2A)</td><td>Dividend taxable in shareholder's hands</td></tr>
                <tr><td>Equity Funding / ESOPs</td><td>Not possible</td><td>Can raise equity &amp; issue ESOPs</td></tr>
                <tr><td>Management</td><td>Flexible, via LLP agreement</td><td>Board / Companies Act governance</td></tr>
                <tr><td>Liability</td><td>Limited to contribution</td><td>Limited to shareholding</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtllpOverview;
