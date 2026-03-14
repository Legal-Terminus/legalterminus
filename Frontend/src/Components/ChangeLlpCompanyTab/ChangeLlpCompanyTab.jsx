import React from "react";
import "./ChangeLlpCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const ChangeLlpCompanyTab = () => {
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
      <section className="ChangeLlpCompanyTab-section">
        <div className="ChangeLlpCompanyTab-container">
          {/* Illustration */}
          <div className="ChangeLlpCompanyTab-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="ChangeLlpCompanyTab-illustration"
            />
          </div>

          {/* Text */}
          <div className="ChangeLlpCompanyTab-content">
            <h2 className="ChangeLlpCompanyTab-title">
              Why Choose Name Change Process in India
            </h2>
            <p className="ChangeLlpCompanyTab-text">
             Changing your LLP name in India helps your business stay relevant and aligned with your growth. Whether you are rebranding, expanding services, or correcting your existing name, the process allows you to legally update your business identity while continuing operations smoothly and building better trust with customers.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      <section className="companies-act-section">
        <div className="companies-act-container">
          {/* <div className="companies-act-card"> */}
            {/* <h3 className="companies-act-title">Companies Act, 2013</h3> */}

            {/* <p className="companies-act-text">
              A Sole Proprietorship is a simple business structure owned and managed by a single individual. It does not have a separate legal identity from its owner and is one of the easiest ways to start a business in India.
            </p> */}

            {/* <p className="companies-act-point">
              <span className="companies-act-point-label">(a)</span>
              PAN and Aadhaar of the proprietor;
            </p> */}

            {/* <p className="companies-act-point">
              <span className="companies-act-point-label">(b)</span>
              Business address proof and utility bill; and
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(c)</span>
              Basic registrations like GST Registration (if applicable), Shop & Establishment License, or Udyam Registration.
            </p> */}
          {/* </div> */}
        </div>
      </section>

    </div>
  );
};

export default ChangeLlpCompanyTab;
