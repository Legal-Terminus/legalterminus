import React from "react";
import "./CacomOverview.css";
import illustration from "../../assets/whypvt-imp1.svg";

const CacomOverview = () => {
  return (
    <div className="opc-full-wrapper">

      <section className="opc-intro-section">
        <div className="opc-intro-container">
          <div className="opc-intro-illustration-wrap">
            <img
              src={illustration}
              alt="Change of Registered Office illustration"
              className="opc-intro-illustration"
            />
          </div>

          <div className="opc-intro-content">
            <h2 className="opc-intro-title">
              Why Update Your Registered Office
            </h2>
            <p className="opc-intro-text">
              The registered office is the official address of a company — the place where the MCA, the Income Tax Department, and every other authority send legal notices, summons, and correspondence. Under Section 12 of the Companies Act, 2013, every company must maintain a registered office and intimate the Registrar of any change in it by filing Form INC-22, generally within 30 days. When you physically relocate, the legal address on record must follow, or important communications keep arriving at an address you have left.
              <br /><br />
              The process scales with how far you move. A shift within the same city or local limits needs only a board resolution and Form INC-22. Moving to a different city within the state — across ROC jurisdiction — requires a special resolution and often Regional Director approval. A change from one state to another is the most involved: it alters the registered-office clause of the MOA and needs a special resolution, a newspaper advertisement, and Regional Director approval before the new address takes effect. Getting the correct route right is what keeps the change clean and compliant.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Updated Address vs Stale Address on Record: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What changes when your registered office is updated officially versus left outdated after a move:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Officially Updated</th>
                  <th>Stale / Old Address</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Legal Notices</td><td>Reach you at the right place</td><td>Sent to an address you've left</td></tr>
                <tr><td>MCA Compliance</td><td>Compliant under Section 12</td><td>Default — penalty exposure</td></tr>
                <tr><td>Bank / GST / PAN</td><td>Consistent &amp; updated</td><td>Address mismatch &amp; KYC issues</td></tr>
                <tr><td>Risk of Missed Deadlines</td><td>Minimal</td><td>High — notices go unseen</td></tr>
                <tr><td>Vendor / Tender KYC</td><td>Clean records</td><td>Discrepancy flagged</td></tr>
                <tr><td>Director Liability</td><td>Protected</td><td>Exposed to non-compliance</td></tr>
                <tr><td>Professional Image</td><td>Current &amp; credible</td><td>Outdated, inconsistent</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CacomOverview;
