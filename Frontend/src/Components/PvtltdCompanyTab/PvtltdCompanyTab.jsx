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
          SECTION 3 — COMPANIES ACT
      ============================ */}
      <section className="companies-act-section">
        <div className="companies-act-container">
          <div className="companies-act-card">
            {/* <h3 className="companies-act-title">Companies Act, 2013</h3> */}

            <p className="companies-act-text">
             Designed for entrepreneurs and growing businesses looking for a smooth, quick, and hassle-free Private Limited Company registration process, with expert assistance at every step.</p>
            <p className="companies-act-point">
              <span className="companies-act-point-label">(a)</span>
              PAN and Aadhaar of all Directors/Shareholders;
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(b)</span>
              Registered office address proof along with latest utility bill (electricity/water/gas); and
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(c)</span>
              Supporting documents (if applicable) such as rent agreement/ownership proof and NOC from the property owner.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtLtdFull;
