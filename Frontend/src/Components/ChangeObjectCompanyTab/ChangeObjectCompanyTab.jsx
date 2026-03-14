import React from "react";
import "./ChangeObjectCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const ChangeObjectCompanyTab = () => {
  return (
    <div className="Change-ob-com-Tab-full-wrapper">

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
      <section className="Change-ob-com-Tab-intro-section">
        <div className="Change-ob-com-Tab-intro-container">
          {/* Illustration */}
          <div className="Change-ob-com-Tab-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="Change-ob-com-Tab-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="Change-ob-com-Tab-intro-content">
            <h2 className="Change-ob-com-Tab-intro-title">
              Why Choose Change in Object (Company)
            </h2>
            <p className="Change-ob-com-Tab-intro-text">
             Changing the Object Clause of your Company in India helps your business stay aligned with evolving goals and new opportunities. Whether you are expanding into new activities, adding services, or restructuring your business model, the process allows you to legally update your company’s scope of operations. It ensures compliance with regulatory requirements while enabling smooth continuation of business activities and supporting long-term growth.
            </p>
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
              Supporting documents (if applicable) such as rent agreement/ownership proof and NOC from the property owner.</p>
          </div>
        </div>
      </section> */}

    </div>
  );
};

export default ChangeObjectCompanyTab;
