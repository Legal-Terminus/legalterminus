import React from "react";
import "./GSTRegOverview.css";
import gstImage from "../../assets/img-5.webp";

const GSTRegOverview = () => {
  return (
    <div className="pvt-full-wrapper">

      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          <div className="pvt-intro-illustration-wrap">
            <img
              src={gstImage}
              alt="GST Registration in India"
              className="pvt-intro-illustration"
            />
          </div>

          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">What is GST Registration?</h2>
            <p className="pvt-intro-text">
              GST registration gives your business a unique GSTIN — required to collect, file, and pay Goods and Services Tax. India's unified indirect tax replaced VAT, service tax, and excise duty in 2017. Once registered, you can claim Input Tax Credit, sell on e-commerce platforms, and trade inter-state legally.
            </p>
            <p className="pvt-intro-text" style={{ marginTop: "16px" }}>
              Mandatory if annual turnover exceeds ₹40 lakh (goods) or ₹20 lakh (services). E-commerce sellers must register regardless of turnover. The process is 100% online — no office visits. ARN is issued within minutes of a correct submission; GSTIN follows within 3–7 working days.
            </p>
          </div>
        </div>
      </section>

      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">GST vs Income Tax: Key Differences</h2>
          <p className="pvt-compare-subtitle">
            Both are mandatory taxes in India — but they work very differently. Here's the quick comparison:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>GST (Goods &amp; Services Tax)</th>
                  <th>Income Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Type</td><td>Indirect tax</td><td>Direct tax</td></tr>
                <tr><td>Imposed on</td><td>Consumption of goods &amp; services</td><td>Income (salary, profits, capital gains)</td></tr>
                <tr><td>Filing frequency</td><td>Monthly / Quarterly / Annual</td><td>Annual</td></tr>
                <tr><td>Collected by</td><td>Central &amp; State Governments</td><td>Central Government only</td></tr>
                <tr><td>Mandatory threshold</td><td>Turnover &gt; ₹40L (goods) / ₹20L (services)</td><td>Income &gt; ₹3L (new regime)</td></tr>
                <tr><td>Registration number</td><td>GSTIN (15-digit PAN-based)</td><td>PAN (10-digit)</td></tr>
                <tr><td>Input credit</td><td>Yes — ITC on business purchases</td><td>Deductions under 80C, 80D etc.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GSTRegOverview;
