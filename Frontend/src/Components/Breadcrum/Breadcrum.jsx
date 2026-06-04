import React, { useState } from "react";
import "./Breadcrum.css";

import ConsultationForm from '../ConsultationForm/ConsultationForm';
const Breadcrum = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        {/* LEFT CONTENT */}
        <div className="lt-public-content">

          <span className="lt-public-tag">
            Private Limited Company Registration
          </span>

          <h1 className="lt-public-title">
            Private Limited Company Registration
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-public-subtitle">Fast, Secure &amp; 100% Online</span>
          </h1>

          <p className="lt-public-description">
            A Private Limited Company (Pvt. Ltd.) is India's most investor-loved business structure — registered under the Companies Act, 2013 and governed by the Ministry of Corporate Affairs (MCA). It gives your venture a separate legal identity, shields personal assets via limited liability, and opens doors to institutional funding that no proprietorship or partnership can access. In 2026, the entire incorporation process is 100% online through the SPICe+ portal — no office visits, no paper chaos. Government registration fee is nil for companies with Authorised Capital up to ₹15 Lakhs; stamp duty is state-specific and charged at actuals.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">Separate Legal Entity</div>
            <div className="lt-feature-item">Limited Liability Protection</div>
            <div className="lt-feature-item">Investor-Ready Structure</div>
            <div className="lt-feature-item">Perpetual Succession</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>1,000+</h3>
              <p>Pvt Ltd companies incorporated</p>
            </div>
            <div>
              <h3>100% Online</h3>
              <p>MCA21 V3 + SPICe+ AGILE-PRO-S</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        {/* RIGHT FORM */}
        <div id="pvt-consult-form">
          <ConsultationForm
            source="private-limited"
            subtitle="Talk to our Private Limited Company registration expert"
          />
        </div>

      </div>
    </section>
  );
};

export default Breadcrum;
