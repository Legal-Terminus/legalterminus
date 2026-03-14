import React from "react";
import "./WindupCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const WindupCompanyTab = () => {
  return (
    <div className="Windup-PLC-full-wrapper">

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
      <section className="Windup-PLC-intro-section">
        <div className="Windup-PLC-intro-container">
          {/* Illustration */}
          <div className="Windup-PLC-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="Windup-PLC-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="Windup-PLC-intro-content">
            <h2 className="Windup-PLC-intro-title">
              Why Choose Proprietorship Firms Registration
            </h2>
            <p className="Windup-PLC-intro-text">
             Sole proprietorship firm registration in India is the easiest way to start a new business. It’s when one person owns and runs the business, and they’re personally responsible for any debt it incurs. In simple terms, there’s no legal difference between the sole proprietorship firm and the sole proprietors themselves. Here are answers to some common questions about proprietorship firm registration in India.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      <section className="Windup-PLC-companies-act-section">
        <div className="Windup-PLC-companies-act-container">
          <div className="Windup-PLC-companies-act-card">
            {/* <h3 className="Windup-PLC-companies-act-title">Companies Act, 2013</h3> */}

            <p className="Windup-PLC-companies-act-text">
              A Sole Proprietorship is a simple business structure owned and managed by a single individual. It does not have a separate legal identity from its owner and is one of the easiest ways to start a business in India.
            </p>

            <p className="Windup-PLC-companies-act-point">
              <span className="Windup-PLC-companies-act-point-label">(a)</span>
              PAN and Aadhaar of the proprietor;
            </p>

            <p className="Windup-PLC-companies-act-point">
              <span className="Windup-PLC-companies-act-point-label">(b)</span>
              Business address proof and utility bill; and
            </p>

            <p className="Windup-PLC-companies-act-point">
              <span className="Windup-PLC-companies-act-point-label">(c)</span>
              Basic registrations like GST Registration (if applicable), Shop & Establishment License, or Udyam Registration.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default WindupCompanyTab;
