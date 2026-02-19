import React from "react";
import "./DissolveLLPComapanyTabs.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const DissolveLLPComapanyTabs = () => {
  return (
    <div className="Dissllp-company-wrapper">

      {/* ===========================
          INTRO SECTION
      ============================ */}
      <section className="Dissllp-intro-section">
        <div className="Dissllp-intro-container">

          {/* Illustration */}
          <div className="Dissllp-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="Dissllp-intro-illustration"
            />
          </div>

          {/* Content */}
          <div className="Dissllp-intro-content">
            <h2 className="Dissllp-intro-title">
              Why Choose Dissolve a Limited Liability Partnership
            </h2>

            <p className="Dissllp-intro-text">
              Once an LLP is incorporated, it is legally required to comply with ongoing statutory obligations such as filing annual returns, maintaining financial statements, and meeting regulatory requirements. Failure to comply can result in heavy penalties, additional fees, and legal action against designated partners. Therefore, if an LLP is not carrying on any business activities or has no plans to operate in the future, it is advisable to legally close it.
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          COMPANIES ACT SECTION
      ============================ */}
      <section className="Dissllp-act-section">
        <div className="Dissllp-act-container">
          {/* <div className="Dissllp-act-card">

            <h3 className="Dissllp-act-title">Companies Act, 2013</h3> */}

            {/* <p className="Dissllp-act-text">
              As per Section 2(68) of the Companies Act, 2013, a private limited
              company means a company having such minimum paid-up share capital
              as may be prescribed, and which by its articles of association:
            </p>

            <p className="Dissllp-act-point">
              <span className="Dissllp-act-point-label">(a)</span>
              Restricts the right to transfer its shares;
            </p>

            <p className="Dissllp-act-point">
              <span className="Dissllp-act-point-label">(b)</span>
              Limits the number of its members to 200 (excluding employees);
            </p>

            <p className="Dissllp-act-point">
              <span className="Dissllp-act-point-label">(c)</span>
              Prohibits any invitation to the public to subscribe to securities.
            </p> */}

          {/* </div> */}
        </div>
      </section>

    </div>
  );
};

export default DissolveLLPComapanyTabs;
