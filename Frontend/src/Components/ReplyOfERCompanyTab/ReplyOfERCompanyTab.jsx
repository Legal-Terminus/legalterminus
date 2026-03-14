import React from "react";
import "./ReplyOfERCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const PvtLtdFull = () => {
  return (
    <div className="Replyof-ER-pvt-full-wrapper">

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
      <section className="Replyof-ER-pvt-intro-section">
        <div className="Replyof-ER-pvt-intro-container">
          {/* Illustration */}
          <div className="Replyof-ER-pvt-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="Replyof-ER-pvt-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="Replyof-ER-pvt-intro-content">
            <h2 className="Replyof-ER-pvt-intro-title">
              Why Choose Reply of Examination Report?
            </h2>
            <p className="Replyof-ER-pvt-intro-text">
             Reply of Examination Report is a crucial step in the trademark registration process in India. After filing a trademark application, the Trademark Registry may raise objections under various legal provisions. Filing a proper and timely reply ensures that your application continues toward registration without being abandoned.            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      <section className="ER-companies-act-section">
        <div className="ER-companies-act-container">
          <div className="ER-companies-act-card">
            {/* <h3 className="ER-companies-act-title">Companies Act, 2013</h3> */}

            <p className="ER-companies-act-text">
              A Sole Proprietorship is a simple business structure owned and managed by a single individual. It does not have a separate legal identity from its owner and is one of the easiest ways to start a business in India.
            </p>

            <p className="ER-companies-act-point">
              <span className="ER-companies-act-point-label">(a)</span>
              PAN and Aadhaar of the proprietor;
            </p>

            <p className="ER-companies-act-point">
              <span className="ER-companies-act-point-label">(b)</span>
              Business address proof and utility bill; and
            </p>

            <p className="ER-companies-act-point">
              <span className="ER-companies-act-point-label">(c)</span>
              Basic registrations like GST Registration (if applicable), Shop & Establishment License, or Udyam Registration.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtLtdFull;
