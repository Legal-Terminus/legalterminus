import React from "react";
import "./PtoopcOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const PtoopcOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Proprietorship to OPC Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert a Proprietorship into an OPC
            </h2>
            <p className="opc-intro-text">
              A sole proprietorship is the simplest way to do business, but it has one big weakness — the proprietor and the business are legally the same person. Your personal assets are fully exposed to business debts, the business cannot raise equity, and it ends with you. A One Person Company (OPC), introduced by the Companies Act, 2013, was designed exactly for solo entrepreneurs who want the simplicity of running a business alone but with the protection of a corporate structure. You remain the single owner and decision-maker, while the company becomes a separate legal entity with limited liability.
              <br /><br />
              Because a proprietorship has no separate legal identity, the change is done by incorporating a fresh OPC and transferring the existing business — its assets, liabilities, and contracts — into the new company through a takeover agreement. You name a nominee who would step in if anything happens to you, and the proprietorship's registrations (GST, bank, licences) are migrated to the OPC. The result is the same business you've built, now ring-fenced behind limited liability, with perpetual succession and far better standing with banks, customers, and investors.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Proprietorship vs One Person Company: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes for a solo business when it moves from a proprietorship to an OPC:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>One Person Company (OPC)</th>
                  <th>Sole Proprietorship</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Legal Status</td><td>Separate legal entity</td><td>Same as the owner</td></tr>
                <tr><td>Liability</td><td>Limited to the capital</td><td>Unlimited — personal assets at risk</td></tr>
                <tr><td>Continuity</td><td>Perpetual; nominee continues it</td><td>Ends with the proprietor</td></tr>
                <tr><td>Ownership</td><td>Single member retains full control</td><td>Single owner</td></tr>
                <tr><td>Funding &amp; Credibility</td><td>Higher — corporate identity</td><td>Limited; harder to scale</td></tr>
                <tr><td>Compliance</td><td>Annual ROC filings &amp; audit</td><td>Minimal</td></tr>
                <tr><td>Conversion to Pvt Ltd</td><td>Easy when you grow</td><td>Requires full restructuring</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PtoopcOverview;
