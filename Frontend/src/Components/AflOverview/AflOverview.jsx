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
              Every Limited Liability Partnership registered in India must file its annual returns with the Ministry of Corporate Affairs (MCA) under the LLP Act, 2008 — regardless of turnover or whether it carried on any business during the year. The two core annual filings are Form 11 (Annual Return), due by 30 May, and Form 8 (Statement of Account &amp; Solvency), due by 30 October. Designated partners must also complete DIR-3 KYC, and the LLP files its income tax return (ITR-5) separately.
              <br /><br />
              The penalty for delay is uniquely harsh. Late filing of Form 11 or Form 8 attracts an additional fee of ₹100 per day, per form, with no upper limit — so a year's delay can balloon into lakhs. Persistent non-filing can also lead to the LLP being declared a defaulter, its designated partners disqualified, and the LLP struck off the register. Timely filing keeps the LLP active, the partners clean, and the limited-liability protection intact.
            </p>
          </div>
        </div>
      </section>

      <section className="opc-compare-section">
        <div className="opc-compare-container">
          <h2 className="opc-compare-title">Compliant vs Non-Compliant LLP: The Honest Comparison</h2>
          <p className="opc-compare-subtitle">
            What happens when an LLP keeps up its annual filings versus when it lets them lapse:
          </p>
          <div className="opc-compare-table-wrapper">
            <table className="opc-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Compliant LLP</th>
                  <th>Non-Compliant LLP</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Late Filing Fee</td><td>₹0 — filed before due date</td><td>₹100/day per form, no upper cap</td></tr>
                <tr><td>LLP Status (MCA)</td><td>Active &amp; in good standing</td><td>Default → strike-off risk</td></tr>
                <tr><td>Designated Partner Status</td><td>Eligible to act &amp; incorporate</td><td>Disqualification risk</td></tr>
                <tr><td>Limited Liability Shield</td><td>Fully protected</td><td>Exposed on strike-off / default</td></tr>
                <tr><td>Bank Loans &amp; Tenders</td><td>Filings support due diligence</td><td>Rejected — records not up to date</td></tr>
                <tr><td>Conversion / Closure</td><td>Smooth, records clean</td><td>Blocked until filings regularised</td></tr>
                <tr><td>Annual Cost</td><td>₹500 – ₹2,000 govt fee</td><td>Uncapped penalties + revival cost</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AflOverview;
