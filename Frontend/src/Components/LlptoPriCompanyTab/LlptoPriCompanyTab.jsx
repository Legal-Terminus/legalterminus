import React from "react";
import "./LlptoPriCompanyTab.css";

// Replace with your actual illustration
import pvtIllustration from "../../assets/whypvt-imp.svg";

const LlpFull = () => {
  return (
    <div className="LLP-to-PLC-com-full-wrapper">

      {/* ===========================
          SECTION 1 — OVERVIEW
      ============================ */}
      {/* <div className="LLP-to-PLC-overview-wrapper">
        <h2 className="LLP-to-PLC-overview-title">Understanding the Basics
</h2>
        <p className="LLP-to-PLC-overview-text">
A Private Limited Company is a legally registered business under the Companies Act, 2013, with its own separate identity from its owners. It protects the personal assets of its members, limits who can own shares, and must have a registered office address. </p>
      </div> */}

      {/* ===========================
          SECTION 2 — INTRO
      ============================ */}
      <section className="LLP-to-PLC-com-intro-section">
        <div className="LLP-to-PLC-com-intro-container">
          {/* Illustration */}
          <div className="LLP-to-PLC-com-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="LLP-to-PLC-com-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="LLP-to-PLC-com-intro-content">
            <h2 className="LLP-to-PLC-com-intro-title">
              Why Choose Conversion of LLP into Private Limited Company
            </h2>
            <p className="LLP-to-PLC-com-intro-text">
              A Limited Liability Partnership (LLP), is an economical form of the incorporated structure of the business with benefits of both corporate and partnership structures. However, LLP has its own set of limitations, such as non-separation of ownership and management, limitations under FDI regulations, etc. Therefore, venture capitalists and private equity investors are more keen on corporate structures which allow them to delineate from day-to-day/ operational management. Therefore, in case LLPs need capital infusion through venture capitalist or private equity investors, they tend to convert into a private Limited Company.
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
              As per the Companies Act, 2013 and the applicable rules, an existing Limited Liability Partnership (LLP) can be converted into a Private Limited Company subject to compliance with prescribed conditions and approval from the Registrar of Companies.
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(a)</span>
              Have a minimum of two Directors and two Shareholders;
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(b)</span>
              Be governed by its Memorandum and Articles of Association;
            </p>

            <p className="companies-act-point">
              <span className="companies-act-point-label">(c)</span>
              Restrict the right to transfer its shares as per its Articles;
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LlpFull;
