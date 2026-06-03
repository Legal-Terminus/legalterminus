import React, { useState } from "react";
import "./PublicBreadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const PublicBreadcrum = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="pub-ltd-hero">
      <div className="pub-ltd-container">

        {/* LEFT CONTENT */}
        <div className="pub-ltd-content">

          <span className="pub-ltd-tag">
            Public Limited Company Registration
          </span>

          <h1 className="pub-ltd-title">
            Public Limited Company Registration
            <span className="pub-ltd-title-india"> in India</span>
            <br />
            <span className="pub-ltd-tagline">Fast, Hassle-Free &amp; 100% Online</span>
          </h1>

          <p className="pub-ltd-description">
            Build the structure VCs, lenders, and the BSE actually take seriously. Take your business to the next level with a Public Limited Company. Legal Terminus manages your entire incorporation process end to end on MCA21 V3 — SPICe+, AGILE-PRO-S, MOA, AOA, the works. Our fee starts at ₹19,999 + GST (Excluding Stamp Duty &amp; Govt Fees). Listed-grade governance, on day one.
          </p>

          <div className="pub-ltd-features">
            <div className="pub-ltd-feature-item">Minimum 3 Directors Required</div>
            <div className="pub-ltd-feature-item">Minimum 7 Shareholders Required</div>
            <div className="pub-ltd-feature-item">Limited Liability Protection</div>
            <div className="pub-ltd-feature-item">Suitable for Large-Scale Business &amp; Fundraising</div>
          </div>

          <div className="pub-ltd-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Companies Registered</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>MCA21 V3 + DSC</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <ConsultationForm
          source="public-limited-company"
          subtitle="Talk to our expert"
        />

      </div>
    </section>
  );
};

export default PublicBreadcrum;
