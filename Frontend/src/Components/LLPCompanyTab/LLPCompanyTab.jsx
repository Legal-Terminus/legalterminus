import React from "react";
import "./LLPCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const LlpFull = () => {
  return (
    <div className="llp-com-full-wrapper">

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
      <section className="llp-com-intro-section">
        <div className="llp-com-intro-container">
          {/* Illustration */}
          <div className="llp-com-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="llp-com-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="llp-com-intro-content">
            <h2 className="llp-com-intro-title">
              Why Choose LLP Registration in India
            </h2>
            <p className="llp-com-intro-text">
         An LLP (Limited Liability Partnership) is the simplest business structure to set up in India. It offers limited liability to owners and has fewer compliance requirements compared to other corporate structures. Since the introduction of the Limited Liability Partnership Act of 2008, this business form has gained popularity due to its blend of partnership and company characteristics. Below, we address common queries related to Limited Liability Partnership Registration in India.
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
            <h3 className="companies-act-title">Limited Liability Partnership Act, 2008</h3>

            <p className="companies-act-text">
              As per the Limited Liability Partnership Act, 2008, an LLP (Limited Liability Partnership) means a partnership formed and registered under this Act, where the partners enjoy limited liability and the LLP has a separate legal identity.
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(a)</span>
              It is a separate legal entity from its partners;
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(b)</span>
              Partners have limited liability, restricted to their agreed contribution; and
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(c)</span>
              It provides the flexibility of a partnership with the benefits of limited liability and perpetual succession.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LlpFull;
