import React from "react";
import "../ProFOPCCompanyTab/ProFOPCCompanyTab.css";

import pvtIllustration from "../../assets/whypvt-imp.svg";

const PvtLtdFull = () => {
  return (
    <div className="profopc-companytab-wrapper">

      {/* ===========================
          SECTION 2 — INTRO
      ============================ */}
      <section className="profopc-companytab-intro-section">
        <div className="profopc-companytab-intro-container">
          {/* Illustration */}
          <div className="profopc-companytab-intro-illustration-wrap">
            <img
              src={pvtIllustration}
              alt="Public to Private Limited conversion illustration"
              className="profopc-companytab-intro-illustration"
            />
          </div>

          {/* Text */}
          <div className="profopc-companytab-intro-content">
            <h2 className="profopc-companytab-intro-title">
              Why Convert a Public Limited Company into a Private Limited Company
            </h2>
            <p className="profopc-companytab-intro-text">
              A Public Limited Company is built to raise capital from the public and carries a heavy compliance load - a minimum of seven members, three directors, mandatory public disclosures, and a long list of statutory provisions that simply do not apply to closely held businesses. As a company matures, many promoters find that they no longer need public funds and would rather keep ownership within a small, trusted group. Converting to a Private Limited Company lets them restrict share transfers, cap the membership, and step away from the formalities meant for widely held companies. The private structure is leaner, more private, and easier to manage - which is why a large number of public companies choose to convert once their fundraising needs are met.
            </p>
          </div>
        </div>
      </section>

      {/* ===========================
          SECTION 3 — COMPANIES ACT
      ============================ */}
      <section className="profopc-companytab-act-section">
        <div className="profopc-companytab-act-container">
          <div className="profopc-companytab-act-card">
            <h3 className="profopc-companytab-act-title">Companies Act, 2013</h3>

            <p className="profopc-companytab-act-text">
              As per Section 14 read with Rule 41 of the Companies (Incorporation) Rules, 2014, a public company may convert into a private company by passing a special resolution and obtaining the approval of the Regional Director, provided the following conditions are met:
            </p>

            <p className="profopc-companytab-act-point">
              <span className="profopc-companytab-act-point-label">(a)</span>
              The Articles must restrict the right to transfer the company's shares;
            </p>

            <p className="profopc-companytab-act-point">
              <span className="profopc-companytab-act-point-label">(b)</span>
              The number of members must be limited to a maximum of 200; and
            </p>

            <p className="profopc-companytab-act-point">
              <span className="profopc-companytab-act-point-label">(c)</span>
              Any invitation to the public to subscribe to the company's securities must be prohibited.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PvtLtdFull;
