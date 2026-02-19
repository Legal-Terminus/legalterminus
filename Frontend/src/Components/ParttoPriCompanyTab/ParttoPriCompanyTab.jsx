import React from "react";
import "./ParttoPriCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const PvtLtdFull = () => {
  return (
    <div className="Partnership-to-PLC-full-wrapper">

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
      <section className="Partnership-to-PLC-intro-section">
        <div className="Partnership-to-PLC-intro-container">
          {/* Illustration */}
          <div className="Partnership-to-PLC-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="Partnership-to-PLC-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="Partnership-to-PLC-intro-content">
            <h2 className="Partnership-to-PLC-intro-title">
              Why Choose Conversion of Partnership into Private Limited Company
            </h2>
            <p className="Partnership-to-PLC-intro-text">
            A partnership firm is a popular business structure for most small and medium traders/manufacturers/  service providers. However, a partnership firm is not mandatorily liable to be registered in terms of the extant provisions of applicable law. Furthermore, there is no provision for compulsory audit of a partnership firm. Therefore, as it grows in size, it becomes need of the hour for a business to evolve into a more trustworthy and transparent structure, such as Company.  It has been observed that such structures are preferred by critical stakeholders (investors, creditors, etc.).
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
            <h3 className="companies-act-title">Companies Act, 2013</h3>

            <p className="companies-act-text">
              As per Section 2(68) of the Companies Act, 2013, a Private Limited Company means a company having such minimum paid-up share capital as may be prescribed and which, by its Articles of Association:
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(a)</span>
              Restricts the right to transfer its shares;
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(b)</span>
              Limits the number of its members to 200 (excluding present and former employees who are members); and
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(c)</span>
              Prohibits any invitation to the public to subscribe for any securities of the company.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtLtdFull;
