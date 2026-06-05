import React from "react";
import "./LLPCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const LlpFull = () => {
  return (
    <div className="llp-com-full-wrapper">

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
      <section className="llp-com-intro-section">
        <div className="llp-com-intro-container">
          {/* Illustration */}
          <div className="llp-com-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="llp-com-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="llp-com-intro-content">
            <h2 className="llp-com-intro-title">
              Why Choose an Limited Liability Partnership Registration
            </h2>
            <p className="llp-com-intro-text">
              LLP is the structure for partnerships that want limited liability without the compliance load of a Private Limited. Introduced under the LLP Act, 2008, it combines partnership flexibility — internal governance via a private LLP Agreement — with corporate-style protection: separate legal entity, perpetual succession, and limited partner liability. You don't get sued personally for the firm's debts.
              <br /><br />
              The LLP Amendment Act, 2021 made LLPs even better for small firms by introducing the 'Small LLP' classification (contribution ≤ ₹25L AND turnover ≤ ₹40L) with reduced filing fees and audit exemption. Plus, decriminalisation of multiple offences makes LLP one of the most founder-friendly structures in the Companies Act / LLP Act ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          COMPARISON TABLE
      ============================ */}
      <section className="llp-com-compare-section">
        <div className="llp-com-compare-container">
          <h2 className="llp-com-compare-title">LLP vs Pvt Ltd vs Partnership Firm: The Deep Dive</h2>
          <p className="llp-com-compare-subtitle">
            LLP sits between a traditional Partnership Firm (unlimited liability, no separate identity) and a Private Limited Company (heavy compliance, lower tax). Here's the honest comparison for 2026:
          </p>
          <div className="llp-com-compare-table-wrapper">
            <table className="llp-com-compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Partnership Firm</th>
                  <th>LLP</th>
                  <th>Pvt Ltd</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Min Partners / Members</td><td>2</td><td>2 designated</td><td>2</td></tr>
                <tr><td>Separate Legal Entity</td><td>No</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Limited Liability</td><td>No</td><td>Yes</td><td>Yes</td></tr>
                <tr><td>Income Tax Rate</td><td>30%</td><td>30% (flat)</td><td>22% – 25.17%</td></tr>
                <tr><td>DDT / Dividend Tax</td><td>N/A</td><td>N/A (pass-through)</td><td>Taxable in shareholder hands</td></tr>
                <tr><td>Audit Threshold</td><td>Turnover &gt; ₹1cr (sec 44AB)</td><td>Turnover &gt; ₹40L OR Cap &gt; ₹25L</td><td>Mandatory regardless</td></tr>
                <tr><td>AGM Required</td><td>No</td><td>No</td><td>Yes</td></tr>
                <tr><td>Annual Filings</td><td>ITR + audit (if applicable)</td><td>Form 11 + Form 8 + ITR-5</td><td>MGT-7 + AOC-4 + audit + ITR</td></tr>
                <tr><td>FDI Eligibility</td><td>No</td><td>Yes (auto route, most sectors)</td><td>Yes</td></tr>
                <tr><td>Setup Cost (Total)</td><td>₹3K – ₹8K</td><td>₹8K – ₹15K</td><td>₹10K – ₹25K</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LlpFull;
