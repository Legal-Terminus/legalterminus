import React from "react";
import "./DissolveLLPBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const DissolveLLPBreadcrum = () => {
  return (
    <section className="Dissllp-public-hero">
      <div className="Dissllp-public-container">

        {/* LEFT CONTENT */}
        <div className="Dissllp-public-content">

          <span className="Dissllp-public-tag">
            Dissolve a Limited Liability Partnership
          </span>

          <h1 className="Dissllp-public-title">
            Winding Up of a Limited Liability Partnership
          </h1>

          <p className="Dissllp-public-description">
            Legal Terminus can help you with Process of Winding Up Limited Liability Partnership in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 18999/-
          </p>

          <div className="Dissllp-public-features">
            <div className="Dissllp-feature-item"> Minimum 2 Designated Partners Required</div>
            <div className="Dissllp-feature-item"> Process Takes 3 to 6 Months</div>
            <div className="Dissllp-feature-item"> All Liabilities Must Be Cleared Before Closure</div>
            <div className="Dissllp-feature-item"> Official Strike-Off by Registrar of Companies (RoC)</div>
          </div>

          <div className="Dissllp-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Processes</p>
            </div>
            <div>
              <h3>5+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="dissolve-llp"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default DissolveLLPBreadcrum;
