import React from "react";
import "./PartnershipLLPCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const PartnershipLLPCompanyTab = () => {
  return (
    <div className="partnership-llp-companytab-wrapper">

      {/* ===========================
          SECTION 1 — OVERVIEW
      ============================ */}
      {/* <div className="partnership-llp-companytab-overview-wrapper">
        <h2 className="partnership-llp-companytab-overview-title">Understanding the Basics</h2>
        <p className="partnership-llp-companytab-overview-text">
          A Private Limited Company is a legally registered business under the Companies Act, 2013...
        </p>
      </div> */}

      {/* ===========================
          SECTION 2 — INTRO
      ============================ */}
      <section className="partnership-llp-companytab-intro-section">
        <div className="partnership-llp-companytab-intro-container">
          {/* Illustration */}
          <div className="partnership-llp-companytab-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="partnership-llp-companytab-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="partnership-llp-companytab-intro-content">
            <h2 className="partnership-llp-companytab-intro-title">
              Why Choose Conversion of Partnership into Limited Liability Partnership
            </h2>
            <p className="partnership-llp-companytab-intro-text">
              A partnership firm is a popular business structure for most small and medium traders/manufacturers/ service providers. However, a partnership firm is not mandatorily liable to be registered in terms of the extant provisions of the applicable law. Furthermore, there is no provision for compulsory audit of a partnership firm. Therefore, as it grows in size, it becomes need of the hour for a business to evolve into a more trustworthy and transparent structure, such as Limited Liability Partnership. It has been observed that such structures are preferred by critical stakeholders (investors, creditors, etc.)
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      <section className="partnership-llp-companytab-act-section">
        <div className="partnership-llp-companytab-act-container">
          <div className="partnership-llp-companytab-act-card">
            <h3 className="partnership-llp-companytab-act-title">Limited Liability Partnership Act, 2008</h3>

            <p className="partnership-llp-companytab-act-text">
              As per the Limited Liability Partnership Act, 2008, a Limited Liability Partnership (LLP) is a separate legal entity formed by two or more partners who agree to carry on a lawful business with limited liability.
            </p>

            <p className="partnership-llp-companytab-act-point">
              <span className="partnership-llp-companytab-act-point-label">(a)</span>
              Is a separate legal entity from its partners;
            </p>

            <p className="partnership-llp-companytab-act-point">
              <span className="partnership-llp-companytab-act-point-label">(b)</span>
              Requires a minimum of two partners, with no maximum limit;
            </p>

            <p className="partnership-llp-companytab-act-point">
              <span className="partnership-llp-companytab-act-point-label">(c)</span>
              Provides limited liability protection to its partners;
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PartnershipLLPCompanyTab;
