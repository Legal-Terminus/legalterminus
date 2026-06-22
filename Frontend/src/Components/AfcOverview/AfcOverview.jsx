import React from "react";
import "./AfcOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const AfcOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Company Annual Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Company Annual Filing Matters
            </h2>
            <p className="opc-intro-text">
              Every Private Limited Company, OPC, and Small Company in India must comply with various annual filing requirements under the Companies Act, 2013 and Income Tax Act. These include ROC filings such as AOC-4, MGT-7/MGT-7A, ADT-1, DPT-3, MSME-1, DIR-3 KYC, and Income Tax Return filings. Each compliance has specific due dates, and non-compliance may result in additional fees, penalties, and legal consequences.
              <br /><br />
              Unlike LLPs, statutory audit is mandatory for every company regardless of turnover or business activity. Failure to file annual returns and financial statements for three consecutive years can lead to Director Disqualification under Section 164(2) of the Companies Act, 2013. Legal Terminus provides complete annual compliance support, including timely filings, audit coordination, reminders, and compliance management to keep your company legally compliant throughout the year.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Company Annual Filing — Forms + Deadlines + Triggers</h2>
          <p className="opc-compare-subtitle">
            Every mandatory annual filing, its due date, and the trigger or late penalty attached:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Form / Filing</th>
                  <th>Due Date</th>
                  <th>Trigger / Late Penalty</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>DPT-3 (Return of Deposits)</td><td>30 June</td><td>Typically 2x to 12x normal fees</td></tr>
                <tr><td>MSME-1 (Half-yearly H1)</td><td>30 April and 30 Oct</td><td>Outstanding dues to MSME suppliers; 2x to 12x normal fees if late</td></tr>
                <tr><td>AGM (Annual General Meeting)</td><td>by 30 September</td><td>Section 96; anchors AOC-4 + MGT-7 timing</td></tr>
                <tr><td>Tax Audit Report (3CA-3CD)</td><td>30 September</td><td>If turnover &gt; ₹1 crore (Section 44AB)</td></tr>
                <tr><td>Form ADT-1 (Auditor Appointment)</td><td>15 days of AGM</td><td>Mandatory; statutory audit per Section 139</td></tr>
                <tr><td>Form AOC-4 (Financial Statements)</td><td>29 October (30 days of AGM)</td><td>₹100/day late fee + Section 403 multipliers</td></tr>
                <tr><td>Company ITR-6</td><td>31 October</td><td>Audit case (all companies); Sec 234F belated penalty</td></tr>
                <tr><td>Form MGT-7 / MGT-7A (Annual Return)</td><td>29 November (60 days of AGM)</td><td>₹100/day late fee</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AfcOverview;
