import React from "react";
import "./PtpvtOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const PtpvtOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Partnership Firm to Private Limited Conversion illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Convert a Partnership Firm into a Private Limited Company
            </h2>
            <p className="opc-intro-text">
              A partnership firm is simple to run, but it carries two real limitations — the partners have unlimited personal liability for the firm's debts, and the firm has no separate legal existence apart from its partners. It also cannot issue equity shares, grant ESOPs, or attract angel investors and venture capital. A Private Limited Company solves all of this: it is a separate legal entity with perpetual succession, the partners' liability is limited to their shareholding, and it is the structure that banks, investors, and large customers expect to deal with.
              <br /><br />
              The conversion is done through the statutory route under Section 366 of the Companies Act, 2013, using Form URC-1 with SPICe+. All partners of the firm become shareholders of the new company, the partners' capital is mapped into share capital, and the business continues seamlessly. The process requires a No-Objection Certificate from the Registrar of Firms and from secured creditors, a URC-2 newspaper notice inviting objections, a CA-certified statement of accounts, the registered partnership deed, and the latest income-tax return. Once registered under Section 367, the company carries on the same business — now with limited liability and investor-ready.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Partnership Firm vs Private Limited Company: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes for your business when it moves from a partnership firm to a Private Limited Company:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Private Limited Company</th>
                  <th>Partnership Firm</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Liability</td><td>Limited to shareholding</td><td>Unlimited — personal assets at risk</td></tr>
                <tr><td>Legal Status</td><td>Separate legal entity</td><td>No identity separate from partners</td></tr>
                <tr><td>Equity Funding</td><td>Can raise from angels &amp; VCs</td><td>No share capital — not possible</td></tr>
                <tr><td>ESOPs</td><td>Can issue ESOPs to employees</td><td>Not possible</td></tr>
                <tr><td>Continuity</td><td>Perpetual succession</td><td>Affected by a partner's exit/death</td></tr>
                <tr><td>Investor Preference</td><td>The standard, fundable structure</td><td>Generally avoided by investors</td></tr>
                <tr><td>Compliance</td><td>AOC-4, MGT-7, board meetings, audit</td><td>Minimal statutory compliance</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PtpvtOverview;
