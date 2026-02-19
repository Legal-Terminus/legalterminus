import React from "react";
import "./DPCompanyTabs.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const DPCompanyTabs = () => {
  return (
    <div className="DP-company-wrapper">

      {/* ===========================
          INTRO SECTION
      ============================ */}
      <section className="DP-intro-section">
        <div className="DP-intro-container">

          {/* Illustration */}
          <div className="DP-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="DP-intro-illustration"
            />
          </div>

          {/* Content */}
          <div className="DP-intro-content">
            <h2 className="DP-intro-title">
              Why Choose Dissolve a Partnership Firm
            </h2>

            <p className="DP-intro-text">
              A Partnership Firm is required to comply with various legal and regulatory obligations throughout its existence. Even if the firm is no longer active, it still needs to file returns, maintain books of accounts, and meet statutory requirements. Failing to comply with these obligations can result in penalties, disputes among partners, and complications with tax authorities or other regulators.
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          COMPANIES ACT SECTION
      ============================ */}
      <section className="DP-act-section">
        <div className="DP-act-container">
          {/* <div className="DP-act-card"> */}

            {/* <h3 className="DP-act-title">Companies Act, 2013</h3> */}

            {/* <p className="DP-act-text">
              As per Section 2(68) of the Companies Act, 2013, a private limited
              company means a company having such minimum paid-up share capital
              as may be prescribed, and which by its articles of association:
            </p>

            <p className="DP-act-point">
              <span className="DP-act-point-label">(a)</span>
              Restricts the right to transfer its shares;
            </p>

            <p className="DP-act-point">
              <span className="DP-act-point-label">(b)</span>
              Limits the number of its members to 200 (excluding employees);
            </p>

            <p className="DP-act-point">
              <span className="DP-act-point-label">(c)</span>
              Prohibits any invitation to the public to subscribe to securities.
            </p> */}

          {/* </div> */}
        </div>
      </section>

    </div>
  );
};

export default DPCompanyTabs;
