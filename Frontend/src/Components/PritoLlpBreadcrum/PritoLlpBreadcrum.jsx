import React from "react";
import "./PritoLlpBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="PLC-to-LLP-public-hero">
      <div className="PLC-to-LLP-public-container">

        {/* LEFT CONTENT */}
        <div className="PLC-to-LLP-public-content">

          <span className="PLC-to-LLP-public-tag">
            Conversion of Private Limited Company into LLP
          </span>

          <h1 className="PLC-to-LLP-public-title">
            Private Limited Company into LLP
          </h1>

          <p className="PLC-to-LLP-public-description">
            Legal Terminus can help you with Conversion of private limited company into LLP in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 14999/- excluding Govt. Fees. 
          </p>

          <div className="PLC-to-LLP-public-features">
            <div className="PLC-to-LLP-feature-item"> Minimum 2 Partners Required</div>
            <div className="PLC-to-LLP-feature-item"> 3 Simple Steps</div>
            <div className="PLC-to-LLP-feature-item"> Required 7 Working Days</div>
            <div className="PLC-to-LLP-feature-item"> High Business Credibility</div>
          </div>

          <div className="PLC-to-LLP-public-highlights">
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
          source="private-to-llp"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
