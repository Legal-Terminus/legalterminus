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
            <h2 className="pvt-intro-title">Why Choose GST Registration</h2>
            <p className="pvt-intro-text">
              GST registration isn't just a formality — it protects and strengthens your business. Once your aggregate annual turnover crosses ₹40 lakhs (goods, normal states) or ₹20 lakhs (services / special category states), it stops being optional. But beyond the threshold question, registration is what unlocks input tax credit, lets you sell on Amazon / Flipkart / Zomato, qualifies you for B2B contracts that demand a GSTIN on every invoice, and — let's be honest — makes you look like a real business when a procurement team is reviewing vendors.
            </p>
            <p className="pvt-intro-text" style={{ marginTop: "16px" }}>
              Even if you're under the threshold, voluntary registration is a strategic move for D2C brands, SaaS founders billing international clients (LUT route), and anyone who wants to claim ITC on raw materials, software subscriptions, or office rent. Skip it, and you're effectively paying GST without ever recovering it.
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
