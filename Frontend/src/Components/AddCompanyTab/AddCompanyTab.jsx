import React from "react";
import "./AddCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const AddCompanyTab = () => {
  return (
    <div className="Add-com-tabfull-wrapper">

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
      <section className="Add-com-tabintro-section">
        <div className="Add-com-tabintro-container">
          {/* Illustration */}
          <div className="Add-com-tabintro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="Add-com-tabintro-illustration"
            />
          </div>

          {/* Text */}
          <div className="Add-com-tabintro-content">
            <h2 className="Add-com-tabintro-title">
              Why Choose Add Or Remove A Director (Company)
            </h2>
            <p className="Add-com-tabintro-text">
            Adding or Removing a Director in your Company in India helps ensure that your management structure remains aligned with your current business needs and strategic goals. Whether you are bringing in new expertise, restructuring leadership, managing a resignation, or complying with regulatory requirements, the process allows you to legally update your company’s board without affecting its existing legal identity. It ensures compliance with statutory provisions while maintaining smooth operations, proper governance, and business continuity, supporting long-term stability and growth.            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      {/* <section className="companies-act-section">
        <div className="companies-act-container">
          <div className="companies-act-card">
            <h3 className="companies-act-title">Companies Act, 2013</h3> */}

            {/* <p className="companies-act-text">
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
              Supporting documents (if applicable) such as rent agreement/ownership proof and NOC from the property owner.</p> */}
          {/* </div>
        </div>
      </section> */}

    </div>
  );
};

export default AddCompanyTab;
