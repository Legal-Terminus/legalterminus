import React from "react";
import "./ProCompanyTab.css";

import pvtIllustration from "../../assets/whypvt-imp1.svg";

const PvtLtdFull = () => {
  return (
    <div className="pvt-full-wrapper">

      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          <div className="pvt-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Proprietorship firm registration illustration"
              className="pvt-intro-illustration"
            />
          </div>

          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">
              Why Choose a Proprietorship Firm
            </h2>
            <p className="pvt-intro-text">
              Proprietorship is the simplest and most common business structure in India — over 70% of small businesses operate as proprietorships. Why? Because there's no central registration, no Act to comply with, no MCA filing, no DSC, no DIN, no MOA, no AOA. You stitch together a few essential registrations (MSME, GST if applicable, Shop &amp; Establishment) and you're a recognised business — invoicing clients, accepting payments, and getting onboarded by marketplaces.
            </p>
            <p className="pvt-intro-text" style={{ marginTop: "16px" }}>
              The trade-offs are real: unlimited personal liability, no separate legal identity from the proprietor, and no ability to bring in a partner or external investor without converting. But for solo founders, freelancers, retailers, professionals, and bootstrap businesses below ₹40-50L turnover — the cost-benefit math overwhelmingly favours proprietorship in Year 1. Convert later when scale demands it.
            </p>
          </div>
        </div>
      </section>

      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">Proprietorship vs OPC vs Partnership: The Deep Dive</h2>
          <p className="pvt-compare-subtitle">
            Three solo / small structures, three different trade-offs. Here's the honest 2026 comparison:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Proprietorship</th>
                  <th>OPC</th>
                  <th>Partnership Firm</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Owners</td><td>1</td><td>1 + 1 nominee</td><td>2 – 50</td></tr>
                <tr><td>Governing Law</td><td>No central Act</td><td>Companies Act 2013</td><td>Partnership Act 1932</td></tr>
                <tr><td>Separate Legal Entity</td><td>No</td><td>Yes</td><td>No</td></tr>
                <tr><td>Limited Liability</td><td>No (unlimited)</td><td>Yes</td><td>No (unlimited)</td></tr>
                <tr><td>Min Capital</td><td>Nil</td><td>Nil</td><td>Nil</td></tr>
                <tr><td>Income Tax</td><td>Slab rate (up to 30%)</td><td>30% flat (entity)</td><td>30% flat (entity)</td></tr>
                <tr><td>Audit Threshold</td><td>Turnover &gt; ₹1cr (Sec 44AB)</td><td>Mandatory regardless</td><td>Turnover &gt; ₹1cr (Sec 44AB)</td></tr>
                <tr><td>Annual Compliance</td><td>ITR + GSTR (if reg)</td><td>MGT-7A + AOC-4 + ITR</td><td>ITR-5 + GSTR (if reg)</td></tr>
                <tr><td>Setup Cost (Total)</td><td>₹500 – ₹3,000</td><td>₹8K – ₹15K</td><td>₹3K – ₹8K</td></tr>
                <tr><td>Setup Time</td><td>2 – 5 days</td><td>10 days</td><td>10 – 15 days</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtLtdFull;
