import React from "react";
import "./PvtltdCompanyTab.css";

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
              Why Choose a Private Limited Company? Here's the Real Talk.
            </h2>
            <p className="pvt-intro-text">
             India's most loved business structure — and for good reason. A Private Limited Company (governed by the Companies Act, 2013) gives you a separate legal identity, shields your personal assets from business liabilities, and signals serious credibility to investors, banks, and clients. Whether you're a startup hustling towards your first funding round or an established SME looking to scale, the Pvt Ltd structure is built for growth. It's also the gateway to government schemes like Startup India, Make in India, and DPIIT recognition.
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
