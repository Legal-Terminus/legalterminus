import React from "react";
import "./SocietyCompanyTabs.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const SocietyCompanyTabs = () => {
  return (
    <div className="society-company-wrapper">

      {/* ===========================
          INTRO SECTION
      ============================ */}
      <section className="society-intro-section">
        <div className="society-intro-container">

          {/* Illustration */}
          <div className="society-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="society-intro-illustration"
            />
          </div>

          {/* Content */}
          <div className="society-intro-content">
            <h2 className="society-intro-title">
              Why Choose Society Registration in India?
            </h2>

            <p className="society-intro-text">
              Society registration in India establishes a non-profit entity primarily for charitable purposes. Similar in structure to Section 8 Companies and Trusts, a Society serves philanthropic objectives. Below, we address pertinent queries related to society registration.
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          COMPANIES ACT SECTION
      ============================ */}
      <section className="society-act-section">
        <div className="society-act-container">
          <div className="society-act-card">

            <h3 className="society-act-title">Societies Registration Act, 1860</h3>

            <p className="society-act-text">
              As per the Societies Registration Act, 1860, a society is formed by a group of individuals who come together for charitable, literary, scientific, or social purposes. A society is registered with the Registrar of Societies of the respective state and operates according to its Memorandum of Association and Rules & Regulations.
            </p>

            <p className="society-act-point">
              <span className="society-act-point-label">(a)</span>
              Is formed by a minimum of seven members (as required under the Act);
            </p>

            <p className="society-act-point">
              <span className="society-act-point-label">(b)</span>
              Is established for lawful purposes such as education, art, culture, religion, charity, sports, or social welfare;
            </p>

            <p className="society-act-point">
              <span className="society-act-point-label">(c)</span>
              Functions as a non-profit organization, where profits or income are used only for promoting the objectives of the society;
            </p>

            <p className="society-act-point">
              <span className="society-act-point-label">(a)</span>
              Is governed by a managing committee or governing body responsible for its administration and compliance;
            </p>

          </div>
        </div>
      </section>

    </div>
  );
};

export default SocietyCompanyTabs;
