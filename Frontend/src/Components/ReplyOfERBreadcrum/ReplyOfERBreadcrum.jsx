import React from "react";
import "./ReplyOfERBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  return (
    <section className="Replyof-ER-public-hero">
      <div className="Replyof-ER-public-container">

        {/* LEFT CONTENT */}
        <div className="Replyof-ER-public-content">

          <span className="Replyof-ER-public-tag">
            Reply Of Examination Report
          </span>

          <h1 className="Replyof-ER-public-title">
            Reply Of Examination Report
          </h1>

          <p className="Replyof-ER-public-description">
            Legal Terminus can help you with filing a reply to examination report trademark for your organization, as and when required, in a hassle-free manner within a reasonable time span and for a competitive professional fee which starts from Rs. 2,999/-.
          </p>

          <div className="Replyof-ER-public-features">
            <div className="Replyof-ER-feature-item"> Expert Drafting of Legal Reply</div>
            <div className="Replyof-ER-feature-item"> Objection Handling Under Trademark Act</div>
            <div className="Replyof-ER-feature-item"> Timely & Accurate Response Filing</div>
            <div className="Replyof-ER-feature-item"> Higher Chances of Trademark Approval</div>
          </div>

          <div className="Replyof-ER-public-highlights">
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
          source="trademark-examination-reply"
          subtitle="Talk to our Expert"
        />

      </div>
    </section>
  );
};

export default Breadcrum;
