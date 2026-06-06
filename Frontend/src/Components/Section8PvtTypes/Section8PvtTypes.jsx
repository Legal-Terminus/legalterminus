import React from "react";
import "./Section8PvtTypes.css";
import typesIllustration from "../../assets/pvtltd-types.png";

const Section8PvtTypes = () => {
  return (
    <section className="s8-types-section">
      <div className="s8-types-container">

        {/* Illustration */}
        <div className="s8-types-illustration-wrap">
          <img
            src={typesIllustration}
            alt="Types of Section 8 Company in India"
            className="s8-types-illustration"
          />
        </div>

        {/* Content */}
        <div className="s8-types-content">
          <h2 className="s8-types-title">
            Types of Section 8 Company Registration in India
          </h2>

          <p className="s8-types-intro">
            Section 8 Companies are formed to promote charitable, educational, scientific, social, or other non-profit objectives. While all operate under a single legal structure, they vary significantly by purpose, beneficiary group, and operational focus. Understanding which type fits your mission helps you draft the right object clause and choose the correct 12A / 80G / FCRA pathway.
          </p>

          {/* Type 1 */}
          <div className="s8-types-block">
            <h3 className="s8-types-subtitle">
              Education-Focused Section 8 Company
            </h3>
            <p className="s8-types-text">
              Established to promote formal and informal education, skill development, literacy, or vocational training. These organizations may run schools, coaching centres, e-learning platforms, scholarship programs, or teacher-training initiatives. They are eligible for 12A tax exemption and can receive CSR grants from corporates with education as a CSR activity. Many are also registered as charitable institutions under state education boards.
            </p>
          </div>

          {/* Type 2 */}
          <div className="s8-types-block">
            <h3 className="s8-types-subtitle">
              Healthcare &amp; Medical Relief Section 8 Company
            </h3>
            <p className="s8-types-text">
              Set up to provide medical relief, preventive healthcare, mental health services, or support for persons with disabilities. These organizations may operate free or subsidized clinics, mobile health units, blood banks, or awareness campaigns. They qualify for 12A and 80G status and are often eligible for health-sector CSR funding. They may also access government health schemes and tie-ups with district hospitals.
            </p>
          </div>

          {/* Type 3 */}
          <div className="s8-types-block">
            <h3 className="s8-types-subtitle">
              Environmental &amp; Sustainability Section 8 Company
            </h3>
            <p className="s8-types-text">
              Focused on environmental conservation, renewable energy promotion, waste management, clean water access, or climate action. These entities work with government bodies, research institutions, and international agencies on sustainability projects. CSR funding from large corporates is readily available for environmental activities under Schedule VII of the Companies Act, making this a well-funded operating space.
            </p>
          </div>

          {/* Type 4 */}
          <div className="s8-types-block">
            <h3 className="s8-types-subtitle">
              Arts, Culture &amp; Heritage Section 8 Company
            </h3>
            <p className="s8-types-text">
              Formed to preserve cultural heritage, promote classical arts, support folk traditions, archive historical records, or sponsor cultural events and festivals. These organizations often receive funding from the Ministry of Culture, state cultural departments, and corporate CSR programs. With 80G registration, donor contributions become tax-deductible, making fundraising from individual patrons significantly more effective.
            </p>
          </div>

          {/* Type 5 */}
          <div className="s8-types-block">
            <h3 className="s8-types-subtitle">
              Sports &amp; Youth Development Section 8 Company
            </h3>
            <p className="s8-types-text">
              Dedicated to promoting sports infrastructure, training grassroots athletes, running youth empowerment programs, or supporting para-sports. These entities are eligible for CSR funding under the "promoting rural sports, nationally recognized sports, Paralympic sports and Olympic sports" category in Schedule VII. They can partner with sports federations, government sports authorities, and academies.
            </p>
          </div>

          {/* Type 6 */}
          <div className="s8-types-block">
            <h3 className="s8-types-subtitle">
              Social Welfare &amp; Charity Section 8 Company
            </h3>
            <p className="s8-types-text">
              The broadest category — set up for poverty alleviation, women empowerment, child welfare, senior citizen support, rural development, or relief operations during disasters. These organizations typically seek 12A, 80G, and FCRA registration to diversify funding from domestic donors, corporate CSR programs, and international foundations. Their wide mandate makes them eligible for the largest number of government and institutional grant programs.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Section8PvtTypes;
