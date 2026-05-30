import React from "react";
import "./AddBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const AddBreadcrum = () => {
  return (
    <section className="Add-public-hero">
      <div className="Add-public-container">

        {/* LEFT CONTENT */}
        <div className="Add-public-content">

          <span className="Add-public-tag">
            Add or Remove a Director
          </span>

          <h1 className="Add-public-title">
            Add Or Remove A Director (Company)
          </h1>

          <p className="Add-public-description">
          Legal Terminus can help you add or remove a director in a hassle-free manner and within a reasonable time frame and a competitive professional fee which starts from Rs. 1499/-.          </p>
          <div className="Add-public-features">
            <div className="Add-feature-item"> Board & Shareholder Approval Required</div>
            <div className="Add-feature-item"> Filing with Registrar (ROC)</div>
            <div className="Add-feature-item"> Consent & Declaration Mandatory</div>
            <div className="Add-feature-item"> Update of Company Records</div>
          </div>

          <div className="Add-public-highlights">
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
          source="add-director"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default AddBreadcrum;
