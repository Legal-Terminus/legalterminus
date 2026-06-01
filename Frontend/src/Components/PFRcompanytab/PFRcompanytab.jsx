import React from "react";
import "./PFRcompanytab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const PvtLtdFull = () => {
  return (
    <div className="pvt-full-wrapper">

      {/* ===========================
          SECTION 1 — OVERVIEW
      ============================ */}
      {/* <div className="overview-wrapper">
        <h2 className="overview-title">Understanding the Basics
</h2>
        <p className="overview-text">
A Private Limited Company is a legally registered business under the Companies Act, 2013, with its own separate identity from its owners. It protects the personal assets of its members, limits who can own shares, and must have a registered office address. </p>
      </div> */}

      {/* ===========================
          SECTION 2 — INTRO
      ============================ */}
      <section className="pvt-intro-section">
        <div className="pvt-intro-container">
          {/* Illustration */}
          <div className="pvt-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="pvt-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="pvt-intro-content">
            <h2 className="pvt-intro-title">
              Why Choose a Partnership Firm
            </h2>
            <p className="pvt-intro-text">
              Partnership Firm is the oldest and simplest co-founder structure in India — governed by the Indian Partnership Act, 1932, predating both the Companies Act and the LLP Act. Think of it as 'sole proprietorship for two or more people'. No MCA filings, no DSC, no DIN, no annual MGT-7 — just a Deed, a PAN, and you can be doing business. For consultants, traders, family-run businesses, and short-term ventures where compliance overhead is the enemy, this remains the structure of choice.
            </p>
            <p className="pvt-intro-text">
              The trade-off is real: unlimited personal liability for all partners, no separate legal identity, and a firm taxed at the same flat 30% as an LLP. If liability protection or institutional credibility matters, you should look at LLP. If quick setup, low compliance, and partner flexibility matter more — Partnership Firm wins.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPARISON TABLE
      ============================ */}
      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">Partnership Firm vs LLP vs Pvt Ltd: The Deep Dive</h2>
          <p className="pvt-compare-subtitle">
            Three structures, three trade-offs. Here's the honest 2026 comparison:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Partnership Firm</th>
                  <th>LLP</th>
                  <th>Pvt Ltd</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Governing Law</td>
                  <td>Partnership Act 1932</td>
                  <td>LLP Act 2008</td>
                  <td>Companies Act 2013</td>
                </tr>
                <tr>
                  <td>Registration With</td>
                  <td>Registrar of Firms (state)</td>
                  <td>MCA21 V3 (central)</td>
                  <td>MCA21 V3 (central)</td>
                </tr>
                <tr>
                  <td>Min / Max Partners</td>
                  <td>2 / 50</td>
                  <td>2 / unlimited</td>
                  <td>2 / 200 (Pvt)</td>
                </tr>
                <tr>
                  <td>Separate Legal Entity</td>
                  <td>No</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Limited Liability</td>
                  <td>No (unlimited)</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Income Tax Rate</td>
                  <td>30% (flat)</td>
                  <td>30% (flat)</td>
                  <td>22% – 25.17%</td>
                </tr>
                <tr>
                  <td>Audit Threshold</td>
                  <td>Turnover &gt; ₹1cr (Sec 44AB)</td>
                  <td>Turnover &gt; ₹40L OR Cap &gt; ₹25L</td>
                  <td>Mandatory regardless</td>
                </tr>
                <tr>
                  <td>Annual ROC Filing</td>
                  <td>None (RoF static)</td>
                  <td>Form 11 + Form 8</td>
                  <td>MGT-7 + AOC-4</td>
                </tr>
                <tr>
                  <td>Setup Cost (Total)</td>
                  <td>₹3K – ₹8K</td>
                  <td>₹8K – ₹15K</td>
                  <td>₹10K – ₹25K</td>
                </tr>
                <tr>
                  <td>Right to Sue</td>
                  <td>Only if registered</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtLtdFull;
