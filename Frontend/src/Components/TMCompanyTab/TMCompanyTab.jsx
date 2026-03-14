import React from "react";
import "./TMCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const PvtLtdFull = () => {
  return (
    <div className="Tm-full-wrapper">

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
      <section className="Tm-intro-section">
        <div className="Tm-intro-container">
          {/* Illustration */}
          <div className="Tm-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="Tm-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="Tm-intro-content">
            <h2 className="Tm-intro-title">
              Why Choose Trademark Renewal in India
            </h2>
            <p className="Tm-intro-text">
             Trademark renewal is important to continue your legal rights over your brand name, logo, or symbol. A registered trademark is valid for 10 years, and renewing it on time ensures that your protection does not expire. If you fail to renew, your trademark can be removed from the official register, and others may apply for a similar mark. Renewal helps you maintain exclusive rights, protect your brand reputation, and avoid legal risks. It also ensures that your business identity remains secure without interruption.            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      <section className="Tm-companies-act-section">
        <div className="Tm-companies-act-container">
          <div className="Tm-companies-act-card">
            {/* <h3 className="Tm-companies-act-title">Companies Act, 2013</h3> */}

            <p className="Tm-companies-act-text">
              A Sole Proprietorship is a simple business structure owned and managed by a single individual. It does not have a separate legal identity from its owner and is one of the easiest ways to start a business in India.
            </p>

            <p className="Tm-companies-act-point">
              <span className="Tm-companies-act-point-label">(a)</span>
              PAN and Aadhaar of the proprietor;
            </p>

            <p className="Tm-companies-act-point">
              <span className="Tm-companies-act-point-label">(b)</span>
              Business address proof and utility bill; and
            </p>

            <p className="Tm-companies-act-point">
              <span className="Tm-companies-act-point-label">(c)</span>
              Basic registrations like GST Registration (if applicable), Shop & Establishment License, or Udyam Registration.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtLtdFull;
