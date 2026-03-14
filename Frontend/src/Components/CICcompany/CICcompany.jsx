import React from "react";
import "./CICcompany.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";
const PvtLtdFull = () => {
  return (
    <div className="cic-full-wrapper">

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
      <section className="cic-intro-section">
        <div className="cic-intro-container">
          {/* Illustration */}
          <div className="cic-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="cic-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="cic-intro-content">
            <h2 className="cic-intro-title">
              Why Choose Change in Name (Company)
            </h2>
            <p className="cic-intro-text">
             Changing the Name of your Company in India helps your business reflect its new vision, branding strategy, or market positioning. Whether you are rebranding, expanding into new markets, changing ownership structure, or aligning your name with updated business activities, the process allows you to legally adopt a new identity without affecting your company’s existing legal status. It ensures compliance with regulatory requirements while maintaining business continuity, contracts, and credibility, supporting your long-term growth and brand recognition.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      {/* <section className="company-act-section">
        <div className="company-act-container">
          <div className="company-act-card">
            <h3 className="company-act-title">Companies Act, 2013</h3> */}

            {/* <p className="company-act-text">
              A Sole Proprietorship is a simple business structure owned and managed by a single individual. It does not have a separate legal identity from its owner and is one of the easiest ways to start a business in India.
            </p>

            <p className="company-act-point">
              <span className="company-act-point-label">(a)</span>
              PAN and Aadhaar of the proprietor;
            </p>

            <p className="company-act-point">
              <span className="company-act-point-label">(b)</span>
              Business address proof and utility bill; and
            </p>

            <p className="company-act-point">
              <span className="company-act-point-label">(c)</span>
              Basic registrations like GST Registration (if applicable), Shop & Establishment License, or Udyam Registration.
            </p> */}
          {/* </div>
        </div>
      </section> */}

    </div>
  );
};

export default PvtLtdFull;
