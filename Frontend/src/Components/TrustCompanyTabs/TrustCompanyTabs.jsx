import React from "react";
import "./TrustCompanyTabs.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const TrustCompanyTabs = () => {
  return (
    <div className="trust-company-wrapper">

      {/* ===========================
          INTRO SECTION
      ============================ */}
      <section className="trust-intro-section">
        <div className="trust-intro-container">

          {/* Illustration */}
          <div className="trust-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="trust-intro-illustration"
            />
          </div>

          {/* Content */}
          <div className="trust-intro-content">
            <h2 className="trust-intro-title">
              Why Choose Trust Registration in India?
            </h2>

            <p className="trust-intro-text">
              Trust registration in India establishes a non-profit entity primarily for charitable purposes. Like Section 8 companies and societies, the structure of a trust aligns with philanthropic objectives. Below, we address relevant queries related to trust registration in India.
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          COMPANIES ACT SECTION
      ============================ */}
      <section className="trust-act-section">
        <div className="trust-act-container">
          <div className="trust-act-card">

            <h3 className="trust-act-title">Indian Trusts Act, 1882</h3>

            <p className="trust-act-text">
              As per the provisions of the Indian Trusts Act, 1882 and applicable state laws, a Trust is formed when a settlor transfers property to trustees for the benefit of beneficiaries with a lawful objective.
            </p>

            <p className="trust-act-point">
              <span className="trust-act-point-label">(a)</span>
              Name and registered office address of the Trust;
            </p>

            <p className="trust-act-point">
              <span className="trust-act-point-label">(b)</span>
              Details of the Settlor, Trustees, and Beneficiaries;
            </p>

            <p className="trust-act-point">
              <span className="trust-act-point-label">(c)</span>
              Clearly defined charitable or lawful objectives of the Trust;
            </p>

            <p className="trust-act-point">
              <span className="trust-act-point-label">(c)</span>
              Details of the Trust property or initial corpus fund;
            </p>

          </div>
        </div>
      </section>

    </div>
  );
};

export default TrustCompanyTabs;
