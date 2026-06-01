import React from "react";
import "./PvtltdCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp1.svg";

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
              Why Choose a Private Limited Company
            </h2>
            <p className="pvt-intro-text">
              Private Limited is the default structure for any business that intends to raise external capital, hire senior talent with ESOPs, sell to enterprise customers, or scale beyond a small team. The Companies Act, 2013 gives you a clean separation between founders and the company, limited liability protection, perpetual succession, and the structural plumbing investors actually understand — share classes, preference rights, valuation caps, board observer seats. Almost every funded Indian startup runs as a Pvt Ltd.
            </p>
            <p className="pvt-intro-text">
              The trade-off is real: heaviest annual compliance load (statutory audit + AGM + AOC-4 + MGT-7 + DIR-3 KYC + minimum 4 board meetings), strictest tax regime (22-25% even with 115BAA), and the highest setup cost. For founders not raising capital and below ₹50L turnover, LLP or OPC is often the smarter first choice. For founders aiming at Series A, Pvt Ltd is non-negotiable from Day 1.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPARISON TABLE
      ============================ */}
      <section className="pvt-compare-section">
        <div className="pvt-compare-container">
          <h2 className="pvt-compare-title">Pvt Ltd vs LLP vs OPC: The Deep Dive</h2>
          <p className="pvt-compare-subtitle">
            Three corporate structures, three different best-fit profiles. Here's the honest 2026 comparison:
          </p>
          <div className="pvt-compare-table-wrapper">
            <table className="pvt-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Pvt Ltd</th>
                  <th>LLP</th>
                  <th>OPC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Min Owners / Members</td>
                  <td>2 dirs + 2 shareholders</td>
                  <td>2 designated partners</td>
                  <td>1 + 1 nominee</td>
                </tr>
                <tr>
                  <td>Max Members</td>
                  <td>200</td>
                  <td>Unlimited</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>Separate Legal Entity</td>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Limited Liability</td>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Yes</td>
                </tr>
                <tr>
                  <td>Income Tax</td>
                  <td>22% (115BAA) / 25.17%</td>
                  <td>30% flat</td>
                  <td>22% (115BAA) / 25.17%</td>
                </tr>
                <tr>
                  <td>Statutory Audit</td>
                  <td>Mandatory regardless</td>
                  <td>Turnover &gt; ₹40L OR Cap &gt; ₹25L</td>
                  <td>Mandatory regardless</td>
                </tr>
                <tr>
                  <td>External VC Funding</td>
                  <td>Yes (preferred)</td>
                  <td>Difficult (uncommon)</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>ESOP Friendly</td>
                  <td>Yes (Sec 62(1)(b))</td>
                  <td>No</td>
                  <td>No</td>
                </tr>
                <tr>
                  <td>Annual Compliance Cost</td>
                  <td>₹40K – ₹1L</td>
                  <td>₹15K – ₹40K</td>
                  <td>₹20K – ₹40K</td>
                </tr>
                <tr>
                  <td>Setup Cost (Total)</td>
                  <td>₹10K – ₹25K</td>
                  <td>₹8K – ₹15K</td>
                  <td>₹8K – ₹15K</td>
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
