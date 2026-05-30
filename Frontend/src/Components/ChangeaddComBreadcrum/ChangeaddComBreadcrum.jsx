import React from "react";
import "./ChangeaddComBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const ChangeaddComBreadcrum = () => {
  return (
    <section className="Change-addCom-it-public-hero">
      <div className="Change-addCom-it-public-container">

        {/* LEFT CONTENT */}
        <div className="Change-addCom-it-public-content">

          <span className="Change-addCom-it-public-tag">
            Change in Registered Office Address of the Company
          </span>

          <h1 className="Change-addCom-it-public-title">
            Change in Registered Office Address(Company)  
          </h1>

          <p className="Change-addCom-it-public-description">
            Legal Terminus can help you with change in Registered office Address of the Company in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 1499/-
          </p>

          <div className="Change-addCom-it-public-features">
            <div className="Change-addCom-it-feature-item"> Smooth Legal Compliance</div>
            <div className="Change-addCom-it-feature-item"> Updated Government Records</div>
            <div className="Change-addCom-it-feature-item"> Better Business Accessibility</div>
            <div className="Change-addCom-it-feature-item"> Stronger Corporate Presence</div>
          </div>

          <div className="Change-addCom-it-public-highlights">
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
          source="change-company-address"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default ChangeaddComBreadcrum;
