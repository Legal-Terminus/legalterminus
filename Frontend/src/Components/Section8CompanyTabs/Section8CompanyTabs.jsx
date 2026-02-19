import React from "react";
import "./Section8CompanyTabs.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const Section8CompanyTabs = () => {
  return (
    <div className="s8-company-wrapper">

      {/* ===========================
          INTRO SECTION
      ============================ */}
      <section className="s8-intro-section">
        <div className="s8-intro-container">

          {/* Illustration */}
          <div className="s8-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="s8-intro-illustration"
            />
          </div>

          {/* Content */}
          <div className="s8-intro-content">
            <h2 className="s8-intro-title">
              Why Choose Section 8 Company Registration in India?
            </h2>

            <p className="s8-intro-text">
              A Sec 8 company, also known as a non-profit organization, is primarily established for charitable purposes in India. Its structure resembles that of trusts and societies. Section 8 company in India is considered the most reliable and transparent form of business structure for charitable endeavors. Below, we address relevant queries related to Section 8 company registration and non-profit organization registration in India.
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          COMPANIES ACT SECTION
      ============================ */}
      <section className="s8-act-section">
        <div className="s8-act-container">
          <div className="s8-act-card">

            <h3 className="s8-act-title">Companies Act, 2013</h3>

            <p className="s8-act-text">
              As per Section 8 of the Companies Act, 2013, a Section 8 Company means a company established for promoting charitable objectives such as commerce, art, science, sports, education, research, social welfare, religion, charity, environmental protection, or any other similar purpose, and which:
            </p>

            <p className="s8-act-point">
              <span className="s8-act-point-label">(a)</span>
              Intends to apply its profits or income solely towards the promotion of its stated objectives;
            </p>

            <p className="s8-act-point">
              <span className="s8-act-point-label">(b)</span>
              Prohibits the payment of any dividend to its members;
            </p>

            <p className="s8-act-point">
              <span className="s8-act-point-label">(c)</span>
              Requires prior approval of the Central Government (Regional Director) before incorporation;
            </p>

            <p className="s8-act-point">
              <span className="s8-act-point-label">(c)</span>
              Operates as a limited company without adding the words “Limited” or “Private Limited” to its name.
            </p>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Section8CompanyTabs;
