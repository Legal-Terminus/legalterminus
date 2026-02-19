import React from "react";
import "./DissolvePrivateCompanyTabs.css";
import pvtIllustration from "../../assets/whypvt-imp.svg";

const DissolvePrivateCompanyTabs = () => {
  return (
    <div className="Dissolve-company-wrapper">

      {/* ===========================
          INTRO SECTION
      ============================ */}
      <section className="Dissolve-intro-section">
        <div className="Dissolve-intro-container">

          {/* Illustration */}
          <div className="Dissolve-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Private limited company illustration"
              className="Dissolve-intro-illustration"
            />
          </div>

          {/* Content */}
          <div className="Dissolve-intro-content">
            <h2 className="Dissolve-intro-title">
              Why Choose Dissolve a Private Limited Company
            </h2>

            <p className="Dissolve-intro-text">
              Dissolving a Private Limited Company is a prudent decision when the business is no longer operational or has no foreseeable plans to continue. Even inactive companies are legally required to comply with ongoing statutory obligations such as annual filings, financial reporting, and regulatory submissions. Failure to meet these requirements can lead to heavy penalties, legal proceedings, and even disqualification of directors from holding positions in other companies. By opting for a formal strike-off or winding-up process, promoters can avoid unnecessary compliance costs, reduce legal and financial risks, and ensure a clean and responsible exit.
            </p>
          </div>

        </div>
      </section>

      {/* ===========================
          COMPANIES ACT SECTION
      ============================ */}
      {/* <section className="Dissolve-act-section">
        <div className="Dissolve-act-container">
          <div className="Dissolve-act-card"> */}

            {/* <h3 className="Dissolve-act-title">Companies Act, 2013</h3>

            <p className="Dissolve-act-text">
              As per Section 2(68) of the Companies Act, 2013, a private limited
              company means a company having such minimum paid-up share capital
              as may be prescribed, and which by its articles of association:
            </p> */}

            {/* <p className="Dissolve-act-point">
              <span className="Dissolve-act-point-label">(a)</span>
              Restricts the right to transfer its shares;
            </p>

            <p className="Dissolve-act-point">
              <span className="Dissolve-act-point-label">(b)</span>
              Limits the number of its members to 200 (excluding employees);
            </p>

            <p className="Dissolve-act-point">
              <span className="Dissolve-act-point-label">(c)</span>
              Prohibits any invitation to the public to subscribe to securities.
            </p>

          </div>
        </div>
      </section> */}

    </div>
  );
};

export default DissolvePrivateCompanyTabs;
