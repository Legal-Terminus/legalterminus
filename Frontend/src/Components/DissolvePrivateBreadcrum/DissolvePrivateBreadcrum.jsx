import React from "react";
import "./DissolvePrivateBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const DissolvePrivateBreadcrum = () => {
  return (
    <section className="DissolvePrivate-public-hero">
      <div className="DissolvePrivate-public-container">

        {/* LEFT CONTENT */}
        <div className="DissolvePrivate-public-content">

          <span className="DissolvePrivate-public-tag">
             Dissolve a Private Limited Company..
          </span>

          <h1 className="DissolvePrivate-public-title">
             Winding Up of a Private Limited Company
          </h1>

          <p className="DissolvePrivate-public-description">
            Legal Terminus can help you with the Process of Winding Up of a Company in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 18999/-
          </p>

          <div className="DissolvePrivate-public-features">
            <div className="DissolvePrivate-feature-item"> Minimum 2 Directors Required</div>
            <div className="DissolvePrivate-feature-item"> Process Takes 3 to 6 Months</div>
            <div className="DissolvePrivate-feature-item"> All Liabilities Must Be Cleared Before Closure</div>
            <div className="DissolvePrivate-feature-item"> Official Strike-Off by Registrar of Companies</div>
          </div>

          <div className="DissolvePrivate-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Online Process</p>
            </div>
            <div>
              <h3>5+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="dissolve-private-limited"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default DissolvePrivateBreadcrum;
