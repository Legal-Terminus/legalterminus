import React from "react";
import "./CIOcompany.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const PvtLtdFull = () => {
  return (
    <div className="cio-full-wrapper">

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
      <section className="cio-intro-section">
        <div className="cio-intro-container">
          {/* Illustration */}
          <div className="cio-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="cio-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="cio-intro-content">
            <h2 className="cio-intro-title">
              Why Choose Change in Object (LLP) 
            </h2>
            <p className="cio-intro-text">
              Changing the Object of your LLP in India allows your business to legally expand, modify, or redefine its activities as it grows. Whether you are adding new services, entering a different industry, diversifying operations, or restructuring your business model, the process enables you to officially update your LLP Agreement without affecting its existing legal identity. It ensures compliance with regulatory requirements while allowing smooth continuation of business operations, supporting flexibility, innovation, and long-term growth.            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      {/* <section className="companies-act-section">
        <div className="companies-act-container">
          <div className="companies-act-card"> */}
            {/* <h3 className="companies-act-title">Companies Act, 2013</h3> */}

            {/* <p className="companies-act-text">
              A Sole Proprietorship is a simple business structure owned and managed by a single individual. It does not have a separate legal identity from its owner and is one of the easiest ways to start a business in India.
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(a)</span>
              PAN and Aadhaar of the proprietor;
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(b)</span>
              Business address proof and utility bill; and
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(c)</span>
              Basic registrations like GST Registration (if applicable), Shop & Establishment License, or Udyam Registration.
            </p> */}
          {/* </div>
        </div>
      </section> */}

    </div>
  );
};

export default PvtLtdFull;
