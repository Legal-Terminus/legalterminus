import React from "react";
import "./ChangeLlpBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const ChangeLlpBreadcrum = () => {
  return (
    <section className="ChangeLlp-bd-hero">
      <div className="ChangeLlp-bd-container">

        {/* LEFT CONTENT */}
        <div className="ChangeLlp-bd-content">

          <span className="ChangeLlp-bd-tag">
            Change In Name
          </span>

          <h1 className="ChangeLlp-bd-title">
            Change in Name(LLP)
          </h1>

          <p className="ChangeLlp-bd-description">
            Legal Terminus can help you with name change process in india in a hassle-free manner within a reasonable time span and for competitive professional fee which starts from Rs. 4499/-
          </p>

          <div className="ChangeLlp-bd-features">
            <div className="ChangeLlp-bd-feature-item"> Name Approval from MCA</div>
            <div className="ChangeLlp-bd-feature-item"> 6 Simple Steps</div>
            <div className="ChangeLlp-bd-feature-item"> Takes 2 Weeks</div>
            <div className="ChangeLlp-bd-feature-item"> Post-Approval Compliance Updates</div>
          </div>

          <div className="ChangeLlp-bd-highlights">
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
          source="change-llp-name"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default ChangeLlpBreadcrum;
