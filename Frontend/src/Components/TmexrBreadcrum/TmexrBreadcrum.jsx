import React from "react";
import "./TmexrBreadcrum.css";
import "../OPCBreadcrum/OPCBreadcrum.css";
import ConsultationForm from '../ConsultationForm/ConsultationForm';

const TmexrBreadcrum = () => {
  return (
    <section className="lt-public-hero">
      <div className="lt-public-container">

        <div className="lt-public-content">

          <span className="lt-public-tag">
            Reply of Examination Report
          </span>

          <h1 className="lt-public-title">
            Reply of Examination Report
            <span className="lt-title-india"> in India</span>
            <br />
            <span className="lt-title-tagline">Beat the Objection, 100% Online</span>
          </h1>

          <p className="lt-public-description">
            When the Trade Marks Registry examines your application under SECTION 18 of the Trade Marks Act, 1999, you may receive an Examination Report listing objections under Section 9 (absolute grounds — descriptive / generic / lacking distinctiveness) or Section 11 (relative grounds — similarity to existing marks). Under RULE 29 of the Trade Marks Rules, 2017 you have EXACTLY 30 DAYS to file a reasoned reply — miss it and your application is DEEMED ABANDONED.
            <br /><br />
            We draft, we file, we represent you at the hearing if needed. Plans from ₹2,999 + GST (covers ONE CITED MARK in ONE CLASS — additional cited marks billed at ₹999 each; final quote shared before assignment). Filed via https://ipindiaonline.gov.in. And we don't go silent — you get monthly status updates + 1–2 day change alerts on every plan.
          </p>

          <div className="lt-public-features">
            <div className="lt-feature-item">30-Day Beat</div>
            <div className="lt-feature-item">Monthly Updates</div>
            <div className="lt-feature-item">Attorney Change</div>
            <div className="lt-feature-item">2x Hearings Covered</div>
          </div>

          <div className="lt-public-highlights">
            <div>
              <h3>5,200+</h3>
              <p>Replies + hearings handled</p>
            </div>
            <div>
              <h3>12 Years</h3>
              <p>of IP / TM expertise</p>
            </div>
            <div>
              <h3>7+</h3>
              <p>Years of Legal Expertise</p>
            </div>
          </div>

        </div>

        <div id="tmexr-consult-form">
          <ConsultationForm
            source="trademark-exam-reply"
            subtitle="Talk to our trademark objection expert"
          />
        </div>

      </div>
    </section>
  );
};

export default TmexrBreadcrum;
