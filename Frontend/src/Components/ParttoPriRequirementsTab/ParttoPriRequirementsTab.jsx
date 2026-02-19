import React from "react";
import "./ParttoPriRequirementsTab.css";

const RequirementsPvt = () => {
  return (
    <section className="Partnership-to-PLC-reqsection">
      <div className="Partnership-to-PLC-reqcontainer">
        {/* Heading + intro */}
        <header className="Partnership-to-PLC-reqheader">
          <h2 className="Partnership-to-PLC-reqtitle">
            Benefits of Conversion of Partnership firm into Private Limited Company
          </h2>
          <p className="Partnership-to-PLC-reqsubtitle">
            Converting a Partnership Firm into a Private Limited Company provides better credibility, limited liability protection, and improved opportunities for business growth. It helps separate personal and business liabilities, makes it easier to raise funds, and enhances trust among customers, investors, and financial institutions.
          </p>
        </header>

        {/* Cards */}
        <div className="Partnership-to-PLC-reqgrid">
          {/* 1 */}
          <article className="Partnership-to-PLC-reqcard">
            <h3 className="Partnership-to-PLC-reqcard-title">Tax Benefits</h3>
            <div className="Partnership-to-PLC-reqcard-underline" />
            <p className="Partnership-to-PLC-reqcard-text">
             You can get different income tax benefits and reliefs that are available for registered companies.
            </p>
          </article>

          {/* 2 */}
          <article className="Partnership-to-PLC-reqcard">
            <h3 className="Partnership-to-PLC-reqcard-title">Easy Funding</h3>
            <div className="Partnership-to-PLC-reqcard-underline" />
            <p className="Partnership-to-PLC-reqcard-text">
              It becomes easier to get investment from investors, bank loans, and government financial support.
            </p>
          </article>

          {/* 3 */}
          <article className="Partnership-to-PLC-reqcard">
            <h3 className="Partnership-to-PLC-reqcard-title">
              Simple Compliance
            </h3>
            <div className="Partnership-to-PLC-reqcard-underline" />
            <p className="Partnership-to-PLC-reqcard-text">
              You can manage legal and government requirements more easily compared to traditional business structures.
            </p>
          </article>

          {/* 4 */}
          <article className="Partnership-to-PLC-reqcard">
            <h3 className="Partnership-to-PLC-reqcard-title">
              IPR Benefits
            </h3>
            <div className="Partnership-to-PLC-reqcard-underline" />
            <p className="Partnership-to-PLC-reqcard-text">
              You can apply for trademarks and patents faster and at lower government fees.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default RequirementsPvt;
