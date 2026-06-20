import React from "react";
import "./AflOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const AflOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="LLP Annual Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why LLP Annual Filing Matters
            </h2>
            <p className="opc-intro-text">
              Every LLP registered under the LLP Act, 2008 must complete annual compliance filings, even if there is no business activity. The key compliances include Form LLP-11, Form LLP-8, and the Income Tax Return (ITR-5). Non-compliance may lead to additional fees, penalties, and legal issues.
              <br /><br />
              Since LLPs do not have a dormant status option, annual filings are mandatory every year. Timely compliance helps maintain active status, improves credibility, and protects Designated Partners from unnecessary penalties. Legal Terminus provides complete support for hassle-free LLP annual filings.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">LLP Annual Filing — Forms + Triggers + Audit Thresholds</h2>
          <p className="opc-compare-subtitle">
            Every mandatory annual filing, its due date, and the audit trigger you need to watch:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Form / Filing</th>
                  <th>Due Date</th>
                  <th>Audit Trigger</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Form LLP-11 (Annual Return)</td><td>30 May</td><td>Not applicable — mandatory for all LLPs</td></tr>
                <tr><td>Form LLP-8 (Statement of Account &amp; Solvency)</td><td>30 October</td><td>CA certification needed if statutory audit applies</td></tr>
                <tr><td>LLP ITR-5 (Income Tax Return) — non-audit</td><td>31 July</td><td>Belated = Sec 234F + interest</td></tr>
                <tr><td>LLP ITR-5 — audit cases (Sec 44AB)</td><td>31 October</td><td>Tax Audit Report due 30 Sep</td></tr>
                <tr><td>STATUTORY AUDIT (LLP Act, Rule 24 proviso)</td><td>Annual</td><td>Turnover &gt; ₹40 LAKH OR Contribution &gt; ₹25 LAKH</td></tr>
                <tr><td>TAX AUDIT (Section 44AB of IT Act)</td><td>Annual</td><td>Turnover &gt; ₹1 CRORE</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AflOverview;
