import React from "react";
import "./ProFOPCBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="ProPrietorship-opc-Bc-public-hero">
      <div className="ProPrietorship-opc-Bc-public-container">

        {/* LEFT CONTENT */}
        <div className="ProPrietorship-opc-Bc-public-content">

          <span className="ProPrietorship-opc-Bc-public-tag">
            Conversion of Proprietorship Firm To Private Limited
          </span>

          <h1 className="ProPrietorship-opc-Bc-public-title">
            Proprietorship Firm To Private Limited Company
            {/* <span> in India</span> */}
          </h1>

          <p className="ProPrietorship-opc-Bc-public-description">
            Legal Terminus can help you with conversion of proprietorship into private limited company in a hassle-free manner within a reasonable time span and competitive Professional fee which starts from Rs. 14999/- excluding Govt. Fees
          </p>

          <div className="ProPrietorship-opc-Bc-public-features">
            <div className="ProPrietorship-opc-Bc-feature-item">1 Directors Required</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Required 40 to 50 Working Days</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Easy Conversion Process</div>
            <div className="ProPrietorship-opc-Bc-feature-item">Limited Liability Protection</div>
          </div>

          <div className="ProPrietorship-opc-Bc-public-highlights">
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
          source="proprietorship-to-opc"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
