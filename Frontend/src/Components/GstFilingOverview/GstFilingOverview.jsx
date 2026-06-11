import React from "react";
import "./GstFilingOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const GstFilingOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="GST Return Filing illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Choose Professional GST Return Filing
            </h2>
            <p className="opc-intro-text">
              A GST return is a periodic statement of your sales, purchases, output tax, and Input Tax Credit (ITC) that every GST-registered business must file on the GST portal. Returns are filed monthly, quarterly (under QRMP), or annually depending on turnover and the scheme opted. GSTR-1 reports outward supplies, GSTR-3B summarises tax and ITC, and GSTR-9 / 9C consolidate the year — each with its own non-negotiable due date.
              <br /><br />
              Getting it wrong is expensive. Late filing attracts a daily late fee plus 18% interest on unpaid tax; an ITC claimed beyond what your GSTR-2B supports can be reversed with interest; and continuous non-filing can suspend your GSTIN and block your buyers' credit. Professional filing means accurate reconciliation, correct tax computation, and on-time submission — turning GST compliance from a recurring risk into a quiet, handled routine.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">On-Time Filing vs Delayed / DIY Filing: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when your GST returns are filed accurately and on time versus left to chance:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Professionally Filed</th>
                  <th>Delayed / Error-Prone Filing</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Late Fee</td><td>₹0 — filed before due date</td><td>₹20–₹50 per day, per return</td></tr>
                <tr><td>Interest on Tax</td><td>None (paid on time)</td><td>18% p.a. on unpaid liability</td></tr>
                <tr><td>Input Tax Credit</td><td>Fully reconciled with GSTR-2B</td><td>Missed / blocked / reversed with interest</td></tr>
                <tr><td>GSTIN Status</td><td>Active &amp; compliant</td><td>Suspension / cancellation risk on non-filing</td></tr>
                <tr><td>Buyer's Credit</td><td>Buyers claim ITC smoothly</td><td>Buyers' credit blocked on your invoices</td></tr>
                <tr><td>E-Way Bill / Returns</td><td>No portal blocks</td><td>e-way bill generation can be blocked</td></tr>
                <tr><td>Notices &amp; Scrutiny</td><td>Minimal — clean record</td><td>DRC-01 / scrutiny notices &amp; demands</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GstFilingOverview;
