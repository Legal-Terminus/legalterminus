import React from "react";
import "./CIRcompany.css";

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
              Why Choose Change In Registered Office Address (LLP)
            </h2>
            <p className="pvt-intro-text">
            Changing the Registered Office Address of your LLP in India helps your business stay updated and legally compliant when relocating or expanding operations. Whether you are shifting to a bigger office, moving to a new city, restructuring your business setup, or aligning your registered address with your actual place of operations, the process allows you to officially update your LLP’s records without affecting its legal identity. It ensures compliance with regulatory requirements while maintaining smooth business operations, official communication, and credibility, supporting your continued growth and professional image.            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      {/* <section className="cs-act-section">
        <div className="cs-act-container">
          <div className="cs-act-card"> */}
            {/* <h3 className="cs-act-title">Companies Act, 2013</h3> */}

            {/* <p className="cs-act-text">
              A Sole Proprietorship is a simple business structure owned and managed by a single individual. It does not have a separate legal identity from its owner and is one of the easiest ways to start a business in India.
            </p>

            <p className="cs-act-point">
              <span className="cs-act-point-label">(a)</span>
              PAN and Aadhaar of the proprietor;
            </p>

            <p className="cs-act-point">
              <span className="cs-act-point-label">(b)</span>
              Business address proof and utility bill; and
            </p>

            <p className="cs-act-point">
              <span className="cs-act-point-label">(c)</span>
              Basic registrations like GST Registration (if applicable), Shop & Establishment License, or Udyam Registration.
            </p> */}
          {/* </div>
        </div>
      </section> */}

    </div>
  );
};

export default PvtLtdFull;
