import React from "react";
import "./ChangeaddComCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const ChangeaddComCompanyTab = () => {
  return (
    <div className="Change-add-com-CompanyTab-full-wrapper">

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
      <section className="Change-add-com-CompanyTab-intro-section">
        <div className="Change-add-com-CompanyTab-intro-container">
          {/* Illustration */}
          <div className="Change-add-com-CompanyTab-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="Change-add-com-CompanyTab-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="Change-add-com-CompanyTab-intro-content">
            <h2 className="Change-add-com-CompanyTab-intro-title">
              Why Choose changing in Registered Office Address (Company)
            </h2>
            <p className="Change-add-com-CompanyTab-intro-text">
             Changing the Registered Office Address of your Company in India helps your business stay compliant and operationally efficient. Whether you are relocating to a larger space, expanding to a new city, or consolidating operations, updating your registered address ensures all legal communications from government authorities are received without interruption. It allows you to maintain statutory compliance, strengthen your business presence, and build credibility with clients, banks, and stakeholders while continuing operations smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      <section className="Change-add-com-CompanyTab-act-section">
        <div className="Change-add-com-CompanyTab-act-container">
          <div className="Change-add-com-CompanyTab-act-card">
            {/* <h3 className="Change-add-com-CompanyTab-act-title">Companies Act, 2013</h3> */}

            <p className="Change-add-com-CompanyTab-act-text">
             Designed for entrepreneurs and growing businesses looking for a smooth, quick, and hassle-free Private Limited Company registration process, with expert assistance at every step.</p>
            <p className="Change-add-com-CompanyTab-act-point">
              <span className="Change-add-com-CompanyTab-act-point-label">(a)</span>
              PAN and Aadhaar of all Directors/Shareholders;
            </p>

            <p className="Change-add-com-CompanyTab-act-point">
              <span className="Change-add-com-CompanyTab-act-point-label">(b)</span>
              Registered office address proof along with latest utility bill (electricity/water/gas); and
            </p>

            <p className="Change-add-com-CompanyTab-act-point">
              <span className="Change-add-com-CompanyTab-act-point-label">(c)</span>
              Supporting documents (if applicable) such as rent agreement/ownership proof and NOC from the property owner.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ChangeaddComCompanyTab;
